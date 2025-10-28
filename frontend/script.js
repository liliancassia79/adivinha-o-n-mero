// --- Conexão com a API (Backend) ---
// O seu backend estará rodando localmente na porta 3000
// Quando fizermos o deploy, SÓ VAMOS MUDAR ESTA LINHA.
const API_URL = 'http://localhost:3000';

// --- Elementos do HTML (DOM) ---
const inputPalpite = document.getElementById('input-palpite');
const btnAdivinhar = document.getElementById('btn-adivinhar');
const mensagemFeedback = document.getElementById('mensagem-feedback');

const areaAcertou = document.getElementById('area-acertou');
const totalTentativas = document.getElementById('total-tentativas');
const inputNome = document.getElementById('input-nome');
const btnSalvarScore = document.getElementById('btn-salvar-score');

const btnAtualizarRanking = document.getElementById('btn-atualizar-ranking');
const listaRanking = document.getElementById('lista-ranking');

// --- Variáveis do Jogo ---
let contagemTentativas = 0;

// --- Funções da API (A "Ponte") ---

// 1. Função para fazer um palpite (POST)
async function fazerPalpite() {
    const palpite = inputPalpite.value;
    if (!palpite) return;

    contagemTentativas++;
    
    try {
        // 1. Envia o palpite para o Backend
        const resposta = await fetch(`${API_URL}/api/guess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ palpite: palpite })
        });

        const dados = await resposta.json();

        // 2. Mostra a resposta do Backend
        mensagemFeedback.textContent = dados.mensagem;

        // 3. Se acertou...
        if (dados.acertou) {
            areaAcertou.classList.remove('hidden'); // Mostra a área de salvar
            totalTentativas.textContent = contagemTentativas;
            mensagemFeedback.style.color = 'green';
        } else {
            mensagemFeedback.style.color = 'red';
        }

    } catch (error) {
        mensagemFeedback.textContent = 'Erro ao conectar com o servidor.';
        console.error('Erro no palpite:', error);
    }
}

// 2. Função para buscar o ranking (GET)
async function atualizarRanking() {
    try {
        const resposta = await fetch(`${API_URL}/api/high-scores`);
        const ranking = await resposta.json();

        // Limpa a lista antiga
        listaRanking.innerHTML = '';

        // Preenche a lista
        if (ranking.length === 0) {
            listaRanking.innerHTML = '<li>Ninguém jogou ainda. Seja o primeiro!</li>';
        } else {
            ranking.forEach(jogador => {
                const item = document.createElement('li');
                item.textContent = `${jogador.nome} - ${jogador.tentativas} tentativas`;
                listaRanking.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar ranking:', error);
    }
}

// 3. Função para salvar o score (POST)
async function salvarScore() {
    const nome = inputNome.value;
    if (!nome) {
        alert('Por favor, digite um nome.');
        return;
    }

    try {
        await fetch(`${API_URL}/api/high-scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                nome: nome, 
                tentativas: contagemTentativas 
            })
        });

        // Reseta o jogo
        alert('Score salvo com sucesso!');
        inputPalpite.value = '';
        inputNome.value = '';
        mensagemFeedback.textContent = 'Boa sorte na próxima rodada!';
        mensagemFeedback.style.color = 'black';
        areaAcertou.classList.add('hidden');
        contagemTentativas = 0;

        // Atualiza o ranking para mostrar o novo score
        atualizarRanking();

    } catch (error) {
        console.error('Erro ao salvar score:', error);
    }
}

// --- Event Listeners (Botões) ---
btnAdivinhar.addEventListener('click', fazerPalpite);
btnSalvarScore.addEventListener('click', salvarScore);
btnAtualizarRanking.addEventListener('click', atualizarRanking);

// Carrega o ranking assim que a página abre
document.addEventListener('DOMContentLoaded', atualizarRanking);