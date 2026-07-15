// 1. Importações e configuração
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// 2. Configurações (Middlewares)
const PORT = process.env.PORT || 3000;
const PERSISTENCE_FILE = process.env.PERSISTENCE_FILE || path.join(__dirname, 'data', 'highscores.json');
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS: em produção, restringe a origem; em desenvolvimento permite localhost
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools or same-origin
    if (NODE_ENV !== 'production') return callback(null, true);
    if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiter para endpoint de palpites
const guessLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // limite por IP
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Banco de Dados em arquivo simples (JSON)
let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let highScores = [];

async function ensureDataFile() {
  const dir = path.dirname(PERSISTENCE_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // diretório pode já existir; segue o fluxo normal
  }

  try {
    const data = await fs.readFile(PERSISTENCE_FILE, 'utf-8');
    highScores = JSON.parse(data);
    if (!Array.isArray(highScores)) highScores = [];
  } catch (err) {
    // arquivo pode não existir ainda — inicia vazio
    highScores = [];
    await saveHighScores();
  }
}

let saveHighScoresInFlight = Promise.resolve();

function saveHighScores() {
  saveHighScoresInFlight = saveHighScoresInFlight.then(async () => {
    const tmp = `${PERSISTENCE_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(highScores, null, 2), 'utf-8');
    await fs.rename(tmp, PERSISTENCE_FILE);
  });
  return saveHighScoresInFlight;
}

if (NODE_ENV !== 'production') {
  console.log(`O número secreto é: ${numeroSecreto}`);
}

// Carrega arquivo na inicialização
ensureDataFile().catch(err => {
  console.error('Erro ao carregar high scores:', err);
});

// --- Definição da API ---

// ROTA 1: O palpite do jogador
app.post('/api/guess', guessLimiter, (req, res) => {
  const { palpite } = req.body || {};
  const numeroPalpite = Number(palpite);

  if (!Number.isInteger(numeroPalpite) || numeroPalpite < 1 || numeroPalpite > 100) {
    return res.status(400).json({ error: 'Palpite inválido. Envie um número inteiro entre 1 e 100.' });
  }

  if (numeroPalpite > numeroSecreto) {
    return res.json({ mensagem: 'Muito alto!', acertou: false });
  } else if (numeroPalpite < numeroSecreto) {
    return res.json({ mensagem: 'Muito baixo!', acertou: false });
  } else {
    // O jogador acertou!
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    if (NODE_ENV !== 'production') {
      console.log(`Acertou! O novo número secreto é: ${numeroSecreto}`);
    }
    return res.json({ mensagem: 'Correto!', acertou: true });
  }
});

// ROTA 2: Salvar um novo high score
app.post('/api/high-scores', async (req, res, next) => {
  try {
    let { nome, tentativas } = req.body || {};

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({ error: 'Nome inválido.' });
    }

    const nomeSanitizado = nome.trim().slice(0, 40); // limita 40 chars

    tentativas = Number(tentativas);
    if (!Number.isInteger(tentativas) || tentativas < 1) {
      return res.status(400).json({ error: 'Tentativas inválidas.' });
    }

    highScores.push({ nome: nomeSanitizado, tentativas });
    highScores.sort((a, b) => a.tentativas - b.tentativas);
    highScores = highScores.slice(0, 5);

    await saveHighScores();

    return res.status(201).json(highScores);
  } catch (err) {
    next(err);
  }
});

// ROTA 3: Buscar o ranking
app.get('/api/high-scores', (req, res) => {
  res.json(highScores);
});

app.use((err, req, res, next) => {
  void next;
  console.error(err && err.stack ? err.stack : err);
  const status = err && err.message === 'Not allowed by CORS' ? 403 : 500;
  const message = status === 403 ? 'Origem não permitida.' : 'Erro interno do servidor.';
  res.status(status).json({ error: message });
});

// Exporta app para testes
module.exports = app;

// Inicia o servidor somente se executado diretamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor de Jogo (API) rodando na porta ${PORT}`);
  });
}
