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
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// Todas as rotas de admin requerem autenticação E autorização de admin
// GET /admin/users - Listar todos os usuários (admin)
router.get('/users', authenticateToken, requireAdmin, listarUsuarios);

// GET /admin/withdrawals - Listar todos os saques (admin)
router.get('/withdrawals', authenticateToken, requireAdmin, listarSaques);

// PATCH /admin/withdrawals/:id - Aprovar/rejeitar saque (admin)
router.patch('/withdrawals/:id', authenticateToken, requireAdmin, atualizarSaque);

// GET /admin/config - Obter configurações do sistema (admin)
router.get('/config', authenticateToken, requireAdmin, getConfig);

// PUT /admin/config - Atualizar configurações do sistema (admin)
router.put('/config', authenticateToken, requireAdmin, updateConfig);

// GET /admin/stats - Obter estatísticas do sistema (admin)
router.get('/stats', authenticateToken, requireAdmin, getStats);

module.exports = router;
