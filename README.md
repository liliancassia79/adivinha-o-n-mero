

# 🎮 Jogo "Adivinhe o Número" (Projeto Fullstack)

Este é um projeto de aprendizado para demonstrar a criação de uma aplicação Web completa (Fullstack), separando claramente o **Frontend** (o jogo visual) do **Backend** (a API e a lógica).

O jogo desafia o usuário a adivinhar um número secreto entre 1 e 100, fornecendo dicas de "Muito alto!" ou "Muito baixo!". O projeto também inclui um ranking (Top 5) que é salvo na memória do servidor.

---

## 🚀 Links (Projeto Online)

* **Frontend (O Jogo):** `[COLOQUE AQUI SUA URL DO NETLIFY]`
* **Backend (A API):** `[COLOQUE AQUI SUA URL DO RENDER]`

---

## 🛠️ Arquitetura e Tecnologias Utilizadas

Este projeto foi construído usando uma arquitetura de serviços desacoplados, uma prática moderna no desenvolvimento web.

### 1. Frontend (O Cliente)

* **O que é:** A interface visual com a qual o usuário interage.
* **Tecnologias:** HTML, CSS e JavaScript puro.
* **Como funciona:** O `script.js` do frontend é responsável por "consumir" (fazer chamadas `fetch`) a API do backend para enviar palpites e buscar o ranking.
* **Hospedagem:** Publicado no **Netlify**.

### 2. Backend (A API)

* **O que é:** O "cérebro" do projeto. Ele guarda a lógica (o número secreto) e os dados (o ranking).
* **Tecnologias:** Node.js e Express.js.
* **Hospedagem:** Publicado no **Render**.

### 3. API (A Ponte)

* **O que é:** A ponte de comunicação (um contrato) que permite ao Frontend e ao Backend conversarem. A API foi construída usando o padrão REST.
* **Rotas (Endpoints) Criados:**
    * `GET /api/high-scores`: Busca a lista de pontuações mais altas.
    * `POST /api/guess`: Recebe um palpite do usuário e responde se está alto, baixo ou correto.
    * `POST /api/high-scores`: Salva o nome e as tentativas do jogador no ranking.

### 4. Banco de Dados (BD)

* **O que é:** Onde os dados são guardados.
* **Tecnologia:** Para este projeto, foi usado um **Array JavaScript** simples, salvo na memória do servidor (uma variável no `server.js`).
* **Por quê?** Isso demonstra a lógica de um banco de dados (salvar e ler dados) sem a complexidade de configurar um banco de dados externo (como PostgreSQL ou MariaDB).

---

## 📋 Como Rodar Este Projeto Localmente

Se você quiser testar este projeto no seu próprio computador:

1.  **Clone o Repositório**
    ```bash
    git clone [SUA-URL-DO-REPOSITÓRIO-GITHUB]
    cd jogo-adivinha-api
    ```

2.  **Inicie o Backend (Servidor)**
    * Você precisará ter o [Node.js](https://nodejs.org/) instalado.
    * Abra um terminal:
    ```bash
    # 1. Navegue até a pasta do backend
    cd backend
    
    # 2. Instale as dependências (express, cors)
    npm install
    
    # 3. Inicie o servidor
    node server.js
    ```
    *O seu terminal mostrará: `Servidor de Jogo (API) rodando em http://localhost:3000`*

3.  **Inicie o Frontend (Jogo)**
    * (Requer a extensão "Live Server" no VS Code)
    * Em um **novo terminal** (deixe o backend rodando), volte para a pasta raiz.
    * No VS Code, clique com o botão direito no arquivo `frontend/index.html`.
    * Selecione **"Open with Live Server"**.
    * O jogo abrirá no seu navegador e se conectará automaticamente ao `localhost:3000`.
    
   

