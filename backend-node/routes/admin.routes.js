const express = require('express');
const router = express.Router();
const {
    listarUsuarios,
    listarSaques,
    atualizarSaque,
    getConfig,
    updateConfig,
    getStats
} = require('../controllers/admin.controller');

// GET /admin/users - Listar todos os usuários (admin)
router.get('/users', listarUsuarios);

// GET /admin/withdrawals - Listar todos os saques (admin)
router.get('/withdrawals', listarSaques);

// PATCH /admin/withdrawals/:id - Aprovar/rejeitar saque (admin)
router.patch('/withdrawals/:id', atualizarSaque);

// GET /admin/config - Obter configurações do sistema (admin)
router.get('/config', getConfig);

// PUT /admin/config - Atualizar configurações do sistema (admin)
router.put('/config', updateConfig);

// GET /admin/stats - Obter estatísticas do sistema (admin)
router.get('/stats', getStats);

module.exports = router;
