// 1. Importações
const express = require('express');
const cors = require('cors');
const app = express();

// 2. Configurações (Middlewares)
app.use(cors()); // Permite que o Netlify (Frontend) acesse este Backend
app.use(express.json()); // Permite que o servidor leia JSON

// 3. O "Cérebro" e o "Banco de Dados" em Memória
let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let highScores = []; // Nosso "Banco de Dados" em memória

console.log(`O número secreto é: ${numeroSecreto}`);

// --- Definição da API ---

// ROTA 1: O palpite do jogador
// (Ex: POST /api/guess)
app.post('/api/guess', (req, res) => {
    const { palpite } = req.body; // Pega o palpite enviado pelo frontend
    const numeroPalpite = parseInt(palpite, 10);

    if (numeroPalpite > numeroSecreto) {
        res.json({ mensagem: 'Muito alto!' });
    } else if (numeroPalpite < numeroSecreto) {
        res.json({ mensagem: 'Muito baixo!' });
    } else {
        // O jogador acertou!
        // Gera um novo número para a próxima rodada
        numeroSecreto = Math.floor(Math.random() * 100) + 1;
        console.log(`Acertou! O novo número secreto é: ${numeroSecreto}`);
        res.json({ mensagem: 'Correto!', novoNumeroSecreto: true });
    }
});

// ROTA 2: Salvar um novo high score
// (Ex: POST /api/high-scores)
app.post('/api/high-scores', (req, res) => {
    const { nome, tentativas } = req.body;
    
    // Salva no nosso "BD"
    highScores.push({ nome, tentativas });
    
    // Mantém apenas os 5 melhores (menor número de tentativas)
    highScores.sort((a, b) => a.tentativas - b.tentativas);
    highScores = highScores.slice(0, 5);
    
    console.log("Ranking atual:", highScores);
    res.status(201).json(highScores); // Retorna o ranking atualizado
});

// ROTA 3: Buscar o ranking
// (Ex: GET /api/high-scores)
app.get('/api/high-scores', (req, res) => {
    res.json(highScores); // Simplesmente retorna nosso array
});

// 4. Iniciar o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Jogo (API) rodando na porta ${PORT}`);
});