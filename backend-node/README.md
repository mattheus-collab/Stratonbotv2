# StratonBot Backend API

API backend do StratonBot construída com Node.js, Express e Supabase.

## 🚀 Stack Tecnológica

- **Runtime**: Node.js
- **Framework**: Express.js
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: JWT (JSON Web Tokens)
- **Criptografia**: bcryptjs

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Conta no Supabase
- Variáveis de ambiente configuradas

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase

# JWT
JWT_SECRET=sua_chave_secreta_jwt

# Servidor
PORT=3000
```

### 3. Iniciar Servidor

```bash
node index.js
```

O servidor estará rodando em `http://localhost:3000`

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

### Obter Token

Faça login ou registre-se para receber um token:

```bash
POST /auth/login
POST /auth/register
```

## 📡 Endpoints da API

### 🔓 Autenticação (Públicas)

#### POST /auth/register
Registrar novo usuário

**Body:**
```json
{
  "nome": "João Silva",  // ou "name"
  "email": "joao@example.com",
  "password": "senha123",
  "cpf": "12345678900"  // opcional
}
```

**Response:**
```json
{
  "mensagem": "Usuário cadastrado com sucesso",
  "dados": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "USUARIO",
      "balance": 0
    }
  }
}
```

#### POST /auth/login
Fazer login

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

---

### 💰 Financeiro (Autenticadas 🔒)

#### GET /finance/balance
Consultar saldo do usuário autenticado

**Response:**
```json
{
  "mensagem": "Saldo consultado com sucesso",
  "dados": {
    "balance": 150.50
  }
}
```

#### GET /finance/pix-keys
Listar chaves PIX do usuário

**Response:**
```json
{
  "mensagem": "Chaves PIX recuperadas com sucesso",
  "dados": [
    {
      "id": "uuid",
      "keyType": "CPF",
      "keyValue": "12345678900",
      "status": "aprovada"
    }
  ]
}
```

#### POST /finance/pix-keys
Cadastrar nova chave PIX

**Body:**
```json
{
  "keyType": "CPF",  // ou "tipo_chave"
  "keyValue": "12345678900"  // ou "chave_pix"
}
```

#### GET /finance/withdrawals
Listar saques do usuário

**Response:**
```json
{
  "mensagem": "Saques recuperados com sucesso",
  "dados": [
    {
      "id": "uuid",
      "amount": 100.00,
      "status": "PENDING",
      "createdAt": "2025-01-26T00:00:00Z"
    }
  ]
}
```

#### POST /finance/withdrawals
Solicitar saque

**Body:**
```json
{
  "amount": 100.00  // ou "valor"
}
```

#### GET /finance/transactions
Listar transações do usuário

---

### 🤖 Bots (Autenticadas 🔒)

#### GET /bots
Listar bots do usuário autenticado

**Response:**
```json
{
  "mensagem": "Bots recuperados com sucesso",
  "dados": [
    {
      "id": "uuid",
      "nome": "Meu Bot",
      "token": "123456:ABC...",
      "descricao": "Bot de vendas",
      "ativo": true,
      "created_at": "2025-01-26T00:00:00Z"
    }
  ],
  "total": 1
}
```

#### POST /bots
Criar novo bot

**Body:**
```json
{
  "nome": "Meu Bot",  // ou "name"
  "token": "123456:ABC...",
  "descricao": "Bot de vendas"  // ou "description", opcional
}
```

#### GET /bots/:id
Consultar bot por ID

#### PUT /bots/:id
Atualizar bot

**Body:**
```json
{
  "nome": "Novo Nome",
  "descricao": "Nova descrição",
  "ativo": false
}
```

#### DELETE /bots/:id
Remover bot

---

### 👑 Admin (Autenticadas 🔒 + Admin)

#### GET /admin/users
Listar todos os usuários

**Response:**
```json
{
  "mensagem": "Usuários recuperados com sucesso",
  "dados": [...],
  "total": 10
}
```

#### GET /admin/withdrawals
Listar todos os saques

**Response:**
```json
{
  "mensagem": "Saques recuperados com sucesso",
  "dados": [
    {
      "id": "uuid",
      "usuario_id": "uuid",
      "valor": 100.00,
      "status": "pendente",
      "created_at": "2025-01-26T00:00:00Z"
    }
  ],
  "total": 5
}
```

#### PATCH /admin/withdrawals/:id
Aprovar ou rejeitar saque

**Body (Opção 1):**
```json
{
  "status": "APPROVED"  // ou "REJECTED", "PAID", "PENDING"
}
```

**Body (Opção 2):**
```json
{
  "approved": true  // ou false
}
```

#### GET /admin/config
Obter configurações do sistema

**Response:**
```json
{
  "mensagem": "Configurações recuperadas com sucesso",
  "dados": {
    "salesFeePercent": 5.0
  }
}
```

#### PUT /admin/config
Atualizar configurações

**Body:**
```json
{
  "salesFeePercent": 7.5
}
```

#### GET /admin/stats
Obter estatísticas do sistema

**Response:**
```json
{
  "mensagem": "Estatísticas recuperadas com sucesso",
  "dados": {
    "totalUsers": 100,
    "totalBots": 50,
    "totalBalance": 10000.00,
    "pendingWithdrawals": {
      "count": 5,
      "totalAmount": 500.00
    },
    "transactions": {
      "count": 200,
      "totalAmount": 15000.00
    }
  }
}
```

---

## 🔒 Segurança

### Middleware de Autenticação

- **`authenticateToken`**: Valida JWT e extrai informações do usuário
- **`requireAdmin`**: Verifica se usuário tem permissão de administrador

### Proteções Implementadas

- ✅ Usuário só acessa seus próprios dados
- ✅ `usuario_id` extraído do token JWT (não do cliente)
- ✅ Rotas admin protegidas com autorização
- ✅ Token expirado retorna 403
- ✅ Requisição sem token retorna 401
- ✅ Senhas criptografadas com bcrypt

---

## 📦 Estrutura do Projeto

```
backend-node/
├── controllers/
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── bots.controller.js
│   ├── financeiro.controller.js
│   └── usuarios.controller.js
├── middleware/
│   └── auth.middleware.js
├── routes/
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── bots.routes.js
│   ├── finance.routes.js
│   └── usuarios.routes.js
├── index.js
├── package.json
└── .env
```

---

## 🐛 Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "mensagem": "Descrição do erro",
  "erro": "Detalhes técnicos"
}
```

### Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (ex: email já cadastrado)
- `500` - Erro interno do servidor

---

## 🚀 Deploy

### Render.com

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Variáveis de Ambiente Necessárias

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anon
JWT_SECRET=chave_secreta_forte
PORT=3000
```

---

## 📝 Notas Importantes

- Tokens JWT expiram em 7 dias
- Senha mínima: 6 caracteres
- Backend aceita campos em PT e EN para compatibilidade
- Todos os endpoints retornam JSON
- CORS habilitado para todos os origins

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 🆘 Suporte

Para suporte, entre em contato através do email: suporte@stratonbot.com
