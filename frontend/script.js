// --- API base URL detection ---
// For local development the backend runs at http://localhost:3000
// For production set window.__API_URL__ before loading this script (e.g. via build tool or by editing this file)
const API_URL = window.__API_URL__ || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : '');
if (!API_URL) throw new Error('API_URL não configurada. Defina window.__API_URL__ em produção.');

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
const formJogo = document.getElementById('form-jogo');

// --- Variáveis do Jogo ---
let contagemTentativas = 0;
let aguardandoResposta = false;

// --- Funções da API (A "Ponte") ---

// 1. Função para fazer um palpite (POST)
async function fazerPalpite(event) {
    if (event) event.preventDefault();
    if (aguardandoResposta) return;

    const palpite = inputPalpite.value;
    if (!palpite) return;

    const numeroPalpite = Number(palpite);
    if (!Number.isInteger(numeroPalpite) || numeroPalpite < 1 || numeroPalpite > 100) {
        mensagemFeedback.textContent = 'Digite um número entre 1 e 100.';
        mensagemFeedback.style.color = 'red';
        return;
    }

    // Desabilita botão enquanto aguarda
    aguardandoResposta = true;
    btnAdivinhar.disabled = true;
    mensagemFeedback.textContent = 'Enviando...';

    try {
        const resposta = await fetch(`${API_URL}/api/guess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ palpite: numeroPalpite })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagemFeedback.textContent = dados.error || 'Erro no servidor.';
            mensagemFeedback.style.color = 'red';
            return;
        }

        // Incrementa apenas em caso de requisição bem-sucedida
        contagemTentativas++;
        mensagemFeedback.textContent = dados.mensagem || '';

        if (dados.acertou) {
            areaAcertou.classList.remove('hidden');
            totalTentativas.textContent = contagemTentativas;
            mensagemFeedback.style.color = 'green';
        } else {
            mensagemFeedback.style.color = 'red';
        }

    } catch (error) {
        mensagemFeedback.textContent = 'Erro ao conectar com o servidor.';
        console.error('Erro no palpite:', error);
    } finally {
        aguardandoResposta = false;
        btnAdivinhar.disabled = false;
    }
}

// 2. Função para buscar o ranking (GET)
async function atualizarRanking() {
    try {
        const resposta = await fetch(`${API_URL}/api/high-scores`);
        const ranking = await resposta.json();

        listaRanking.innerHTML = '';

        if (!Array.isArray(ranking) || ranking.length === 0) {
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
    if (aguardandoResposta) return;

    const nome = inputNome.value;
    if (!nome || !nome.trim()) {
        alert('Por favor, digite um nome.');
        return;
    }

    aguardandoResposta = true;
    btnSalvarScore.disabled = true;

    try {
        const resposta = await fetch(`${API_URL}/api/high-scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                nome: nome.trim(), 
                tentativas: contagemTentativas 
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.error || 'Erro ao salvar score.');
            return;
        }

        alert('Score salvo com sucesso!');
        inputPalpite.value = '';
        inputNome.value = '';
        mensagemFeedback.textContent = 'Boa sorte na próxima rodada!';
        mensagemFeedback.style.color = 'black';
        areaAcertou.classList.add('hidden');
        contagemTentativas = 0;

        atualizarRanking();

    } catch (error) {
        console.error('Erro ao salvar score:', error);
        alert('Erro ao salvar score.');
    } finally {
        aguardandoResposta = false;
        btnSalvarScore.disabled = false;
    }
}

// --- Event Listeners (Botões) ---
formJogo.addEventListener('submit', fazerPalpite);
btnSalvarScore.addEventListener('click', salvarScore);
btnAtualizarRanking.addEventListener('click', atualizarRanking);

// Carrega o ranking assim que a página abre
document.addEventListener('DOMContentLoaded', atualizarRanking);
