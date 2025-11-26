# StratonBot Frontend

Interface web do StratonBot - Sistema de gerenciamento de bots de trading.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios
- React Router DOM
- React Toastify

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_URL=https://stratonbotv2.onrender.com
```

Para desenvolvimento local, use:

```env
VITE_API_URL=http://localhost:3000
```

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 📡 Endpoints da API

O frontend consome os seguintes endpoints do backend:

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário

### Financeiro
- `GET /finance/balance` - Consultar saldo
- `GET /finance/pix-keys` - Listar chaves PIX
- `POST /finance/pix-keys` - Cadastrar chave PIX
- `GET /finance/withdrawals` - Listar saques
- `POST /finance/withdrawals` - Solicitar saque
- `GET /finance/transactions` - Listar transações

### Bots
- `GET /bots` - Listar bots
- `POST /bots` - Criar bot
- `GET /bots/:id` - Consultar bot
- `PUT /bots/:id` - Atualizar bot
- `DELETE /bots/:id` - Remover bot

### Admin
- `GET /admin/users` - Listar usuários
- `GET /admin/withdrawals` - Listar saques
- `PATCH /admin/withdrawals/:id` - Aprovar/rejeitar saque
- `GET /admin/config` - Obter configurações
- `PUT /admin/config` - Atualizar configurações
- `GET /admin/stats` - Obter estatísticas

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. O token é armazenado no localStorage e enviado automaticamente em todas as requisições através de um interceptor do Axios.

## 📱 Páginas

- `/login` - Login
- `/register` - Registro
- `/dashboard` - Dashboard do usuário
- `/bots` - Gerenciamento de bots
- `/bots/new` - Criar novo bot
- `/bots/:id/edit` - Editar bot
- `/finance` - Gerenciamento financeiro
- `/withdrawals` - Saques
- `/profile` - Perfil do usuário
- `/settings` - Configurações (Admin)
- `/admin` - Dashboard administrativo (Admin)
- `/admin/users` - Gerenciar usuários (Admin)
- `/admin/withdrawals` - Aprovar saques (Admin)

## 🌐 Deploy

O frontend está configurado para ser hospedado em plataformas como:
- Netlify
- Vercel
- GitHub Pages

Certifique-se de configurar a variável de ambiente `VITE_API_URL` com a URL do backend em produção.

## 📝 Notas

- Todas as respostas da API seguem o padrão PT-BR com as chaves `mensagem`, `dados` e `erro`
- O sistema possui tratamento automático de erros com notificações toast
- Sessões expiradas (401) redirecionam automaticamente para a página de login
