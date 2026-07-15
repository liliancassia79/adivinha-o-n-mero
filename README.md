# 🎮 Jogo "Adivinhe o Número" (Projeto Fullstack)

Este é um projeto de aprendizado para demonstrar a criação de uma aplicação Web completa (Fullstack), separando claramente o **Frontend** (o jogo visual) do **Backend** (a API e a lógica).

O jogo desafia o usuário a adivinhar um número secreto entre 1 e 100, fornecendo dicas de "Muito alto!" ou "Muito baixo!". O projeto também inclui um ranking (Top 5) que é salvo em um arquivo JSON no servidor.

---

## 🚀 Links (Projeto Online)

* **Frontend (O Jogo):** `https://SEU_FRONTEND_NETLIFY_URL`
* **Backend (A API):** `https://SEU_BACKEND_RENDER_URL`

---

## 🛠️ Arquitetura e Tecnologias Utilizadas

- Frontend: HTML, CSS e JavaScript puro.
- Backend: Node.js e Express.js.
- Persistência: arquivo JSON local (data/highscores.json). Configure via a variável de ambiente PERSISTENCE_FILE.

---

## 📋 Como Rodar Este Projeto Localmente

1.  **Clone o Repositório**
    ```bash
    git clone [SUA-URL-DO-REPOSITÓRIO-GITHUB]
    cd adivinha-o-n-mero
    ```

2.  **Inicie o Backend (Servidor)**
    * Você precisará ter o [Node.js](https://nodejs.org/) instalado.
    * Abra um terminal:
    ```bash
    cd backend
    npm install
    npm start
    # ou para desenvolvimento com reload automático:
    npm run dev
    ```
    * Variáveis de ambiente úteis:
      - PORT (padrão 3000)
      - ALLOWED_ORIGIN (ex.: https://seu-frontend.netlify.app) — quando definido, em produção somente essa origem será aceita via CORS
      - PERSISTENCE_FILE (local do arquivo JSON de ranking)

3.  **Inicie o Frontend (Jogo)**
    * Abra `frontend/index.html` com Live Server do VS Code, ou sirva a pasta `frontend/` por um servidor estático.
    * O frontend detecta `localhost` automaticamente e usará `http://localhost:3000` como API. Em produção, configure a URL da API editando `frontend/script.js` na constante API_URL ou adotando uma injeção de variáveis no build.

---

## Testes e CI

- Testes backend: Jest + Supertest. Rode `cd backend && npm test`.
- CI: GitHub Actions (.github/workflows/ci.yml) roda lint e testes.

---

## Notas e Próximos Passos

- Para produção, considere usar um banco de dados (SQLite, Postgres) em vez de arquivo JSON.
- Restrinja ALLOWED_ORIGIN em produção.
- Adicione autenticação/anonimização se for necessário para métricas reais.
