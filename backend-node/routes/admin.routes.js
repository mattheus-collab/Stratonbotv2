const express = require('express');
const router = express.Router();
const {
    listarUsuarios,
    listarSaques,
    atualizarSaque
} = require('../controllers/admin.controller');

// GET /admin/users - Listar todos os usuários (admin)
router.get('/users', listarUsuarios);

// GET /admin/withdrawals - Listar todos os saques (admin)
router.get('/withdrawals', listarSaques);

// PATCH /admin/withdrawals/:id - Aprovar/rejeitar saque (admin)
router.patch('/withdrawals/:id', atualizarSaque);

module.exports = router;
