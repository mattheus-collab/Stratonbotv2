const express = require('express');
const router = express.Router();
const {
    cadastrarChavePix,
    consultarSaldo,
    solicitarSaque
} = require('../controllers/financeiro.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Todas as rotas requerem autenticação
// POST /financeiro/pix - Cadastrar chave PIX
router.post('/pix', authenticateToken, cadastrarChavePix);

// GET /financeiro/saldo - Consultar saldo do usuário autenticado
router.get('/saldo', authenticateToken, consultarSaldo);

// POST /financeiro/saque - Solicitar saque
router.post('/saque', authenticateToken, solicitarSaque);

module.exports = router;
