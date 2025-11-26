# StratonBot Backend - Node.js

Backend da StratonBot desenvolvido em Node.js com Express e Supabase.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Supabase** - Backend as a Service (PostgreSQL)
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura de Pastas

```
backend-node/
├── index.js              # Arquivo principal do servidor
├── package.json          # Dependências e scripts
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore           # Arquivos ignorados pelo Git
├── routes/              # Rotas da API
│   └── index.js
├── controllers/         # Lógica de negócio
│   └── README.md
└── models/              # Modelos de dados
    └── README.md
```

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-aqui
```

### 3. Executar localmente

```bash
npm start
```

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## 🌐 Endpoints Disponíveis

### Health Check

#### `GET /`
Health check básico da API.

**Resposta:**
```json
{
  "mensagem": "StratonBot API funcionando!",
  "status": "online",
  "timestamp": "2025-11-25T23:33:14.000Z"
}
```

#### `GET /health/supabase`
Verifica a conexão com o Supabase.

**Resposta de sucesso:**
```json
{
  "mensagem": "Conexão com Supabase estabelecida com sucesso!",
  "status": "conectado"
}
```

---

### Usuários (`/usuarios`)

#### `GET /usuarios`
Lista todos os usuários cadastrados.

**Resposta:**
```json
{
  "mensagem": "Usuários recuperados com sucesso",
  "dados": [...],
  "total": 10
}
```

#### `POST /usuarios`
Cadastra um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telegram_id": "123456789",
  "username": "joaosilva"
}
```

**Resposta:**
```json
{
  "mensagem": "Usuário cadastrado com sucesso",
  "dados": { "id": 1, "nome": "João Silva", ... }
}
```

#### `GET /usuarios/:id`
Consulta um usuário específico por ID.

**Resposta:**
```json
{
  "mensagem": "Usuário encontrado",
  "dados": { "id": 1, "nome": "João Silva", ... }
}
```

---

### Financeiro (`/financeiro`)

#### `POST /financeiro/pix`
Cadastra uma chave PIX para um usuário.

**Body:**
```json
{
  "usuario_id": 1,
  "chave_pix": "joao@example.com",
  "tipo_chave": "email"
}
```

**Resposta:**
```json
{
  "mensagem": "Chave PIX cadastrada com sucesso",
  "dados": { "id": 1, "chave_pix": "joao@example.com", "status": "pendente" }
}
```

#### `GET /financeiro/saldo/:usuarioId`
Consulta o saldo de um usuário.

**Resposta:**
```json
{
  "mensagem": "Saldo consultado com sucesso",
  "dados": {
    "usuario_id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "saldo": 150.50
  }
}
```

#### `POST /financeiro/saque`
Solicita um saque.

**Body:**
```json
{
  "usuario_id": 1,
  "valor": 50.00
}
```

**Resposta:**
```json
{
  "mensagem": "Solicitação de saque criada com sucesso",
  "dados": { "id": 1, "valor": 50.00, "status": "pendente" }
}
```

---

### Bots (`/bots`)

#### `GET /bots`
Lista todos os bots. Aceita query parameter `usuario_id` para filtrar.

**Query Parameters:**
- `usuario_id` (opcional): Filtra bots por usuário

**Resposta:**
```json
{
  "mensagem": "Bots recuperados com sucesso",
  "dados": [...],
  "total": 5
}
```

#### `POST /bots`
Cria um novo bot.

**Body:**
```json
{
  "usuario_id": 1,
  "nome": "Bot Vendas",
  "token": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  "descricao": "Bot para vendas automáticas"
}
```

**Resposta:**
```json
{
  "mensagem": "Bot criado com sucesso",
  "dados": { "id": 1, "nome": "Bot Vendas", "ativo": true, ... }
}
```

#### `GET /bots/:id`
Consulta um bot específico por ID.

**Resposta:**
```json
{
  "mensagem": "Bot encontrado",
  "dados": { "id": 1, "nome": "Bot Vendas", ... }
}
```

#### `PUT /bots/:id`
Atualiza um bot existente.

**Body:**
```json
{
  "nome": "Bot Vendas Premium",
  "descricao": "Bot atualizado",
  "ativo": false
}
```

**Resposta:**
```json
{
  "mensagem": "Bot atualizado com sucesso",
  "dados": { "id": 1, "nome": "Bot Vendas Premium", ... }
}
```

#### `DELETE /bots/:id`
Remove um bot.

**Resposta:**
```json
{
  "mensagem": "Bot removido com sucesso",
  "dados": { "id": 1, "nome": "Bot Vendas" }
}
```

## 🚢 Deploy no Render

### 1. Criar novo Web Service no Render

- Conecte seu repositório GitHub
- Selecione o branch principal
- Configure o diretório raiz como `backend-node`

### 2. Configurar Build & Deploy

- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 3. Adicionar variáveis de ambiente

No painel do Render, adicione:
- `SUPABASE_URL`
- `SUPABASE_KEY`

### 4. Deploy

O Render fará o deploy automaticamente. A aplicação estará disponível em:
```
https://seu-app.onrender.com
```

## 📝 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Criar rotas de usuários
- [ ] Integrar com Telegram Bot API
- [ ] Adicionar middleware de validação
- [ ] Implementar rate limiting
- [ ] Adicionar testes automatizados

## 🔒 Segurança

- Nunca commite o arquivo `.env`
- Use variáveis de ambiente para todas as credenciais
- Mantenha as dependências atualizadas
- Implemente rate limiting em produção

## 📄 Licença

MIT
