const express = require('express');
const router = express.Router();
const {
    listarBots,
    criarBot,
    consultarBot,
    atualizarBot,
    removerBot
} = require('../controllers/bots.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Todas as rotas de bots requerem autenticação
// GET /bots - Listar todos os bots do usuário autenticado
router.get('/', authenticateToken, listarBots);

// POST /bots - Criar novo bot
router.post('/', authenticateToken, criarBot);

// GET /bots/:id - Consultar bot por ID
router.get('/:id', authenticateToken, consultarBot);

// PUT /bots/:id - Atualizar bot
router.put('/:id', authenticateToken, atualizarBot);

// DELETE /bots/:id - Remover bot
router.delete('/:id', authenticateToken, removerBot);

module.exports = router;
