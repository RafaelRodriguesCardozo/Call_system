# 🛠️ Call System - Plataforma Full Stack de Chamados

> Uma aplicação web full-stack robusta, segura e moderna para gerenciamento de suporte técnico e chamados. Desenvolvida com React, Node.js, Express e MySQL, com deploy em produção via Vercel e Railway.

## 🚀 Sobre o Projeto

O **Call System** é uma plataforma de chamados intuitiva criada para otimizar fluxos de atendimento de suporte. A aplicação permite que usuários abram chamados, acompanhem status em tempo real e gerenciem permissões através de um sistema de controle de acesso baseado em funções (RBAC).

Projetada com foco em boas práticas e segurança, a arquitetura conta com autenticação JWT, criptografia de senhas, proteção contra ataques de força bruta (*Rate Limiting*) e uma interface moderna e responsiva construída com Bootstrap.

## 💻 Tecnologias Utilizadas

### **Front-end**
* **Framework/Biblioteca:** React (com Vite)
* **Linguagem:** TypeScript / JavaScript
* **Estilização:** Bootstrap & Custom CSS
* **Hospedagem:** Vercel

### **Back-end**
* **Runtime & Framework:** Node.js, Express.js
* **Segurança & Autenticação:** JSON Web Tokens (JWT), Bcrypt (hashing de senhas), Express Rate Limit
* **Hospedagem:** Railway

### **Banco de Dados**
* **Sistema Gerenciador:** MySQL (Hospedado na nuvem via Railway)

## ✨ Funcionalidades Principais

* **Autenticação Segura:** Sistema de login e registo com senhas protegidas por hash (`bcrypt`) e verificação de sessão via tokens JWT.
* **Controle de Acesso por Níveis (Roles):** Permissões distintas com base no cargo do usuário (ex: painéis específicos para administradores e utilizadores comuns).
* **Gestão do Ciclo de Vida dos Chamados:** Abertura de novos chamados, atualização dinâmica de status (`ABERTO`, `EM_ANDAMENTO`, `FINALIZADO`) e exclusão de registros.
* **Proteção de API (Rate Limiting):** Defesa contra requisições excessivas e tentativas de força bruta na rota de login.
* **Experiência do Usuário (UX):** Interface limpa equipada com indicadores de carregamento (*spinners*), alertas visuais e tratamento de erros.

## 📂 Estrutura do Projeto

```text
call-system/
├── Api/
│   ├── infraestrutura/     # Configuração da conexão e pool com o MySQL
│   ├── routes/             # Rotas da API (login, registo, chamados)
│   └── index.js            # Ponto de entrada principal da aplicação Express
└── call_system_front-end/
    ├── src/
    │   ├── pages/          # Componentes React (LoginPage, GerenciarChamados, etc.)
    │   ├── App.tsx         # Rotas principais e estado global da aplicação
    │   └── main.tsx        # Ponto de entrada do Vite
    └── vercel.json         # Configuração de rotas no cliente para a Vercel
```

## ⚙️ Como Executar o Projeto Localmente

Para rodar este projeto na sua máquina para fins de testes ou desenvolvimento, siga os passos abaixo:

### Pré-requisitos
* Node.js instalado no seu computador.
* Uma instância do MySQL (local ou remota).

### 1. Clonar o repositório
```bash
git clone https://github.com/RafaelRodriguesCardozo/Call_system.git
cd call_system_front-end
```

### 2. Configurar e executar o Back-end
```bash
cd Api
npm install
```

Crie um arquivo `.env` dentro da pasta `Api` com as suas variáveis de ambiente:
```env
PORT=3000
DB_HOST=seu_host_mysql
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=seu_banco_de_dados
DB_PORT=3306
JWT_SECRET=sua_chave_secreta_jwt
```

Inicie o servidor back-end:
```bash
npm start
```

### 3. Configurar e executar o Front-end
Abra um novo terminal na raiz do projeto e execute:
```bash
cd call_system_front-end
npm install
npm run dev
```

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

---
*Desenvolvido por [Rafael Cardozo](https://github.com/RafaelRodriguesCardozo)*