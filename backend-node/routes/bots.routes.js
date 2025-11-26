const express = require('express');
const router = express.Router();
const {
    listarBots,
    criarBot,
    consultarBot,
    atualizarBot,
    removerBot
} = require('../controllers/bots.controller');

// GET /bots - Listar todos os bots (com filtro opcional por usuario_id)
router.get('/', listarBots);

// POST /bots - Criar novo bot
router.post('/', criarBot);

// GET /bots/:id - Consultar bot por ID
router.get('/:id', consultarBot);

// PUT /bots/:id - Atualizar bot
router.put('/:id', atualizarBot);

// DELETE /bots/:id - Remover bot
router.delete('/:id', removerBot);

module.exports = router;
