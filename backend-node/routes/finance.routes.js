const express = require('express');
const router = express.Router();
const {
    cadastrarChavePix,
    consultarSaldo,
    solicitarSaque,
    listarChavesPix,
    listarSaques,
    listarTransacoes,
    consultarSaldoBalance
} = require('../controllers/financeiro.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Rotas compatíveis com /finance/* (frontend antigo)
// Todas as rotas requerem autenticação
router.get('/balance', authenticateToken, consultarSaldoBalance);
router.get('/pix-keys', authenticateToken, listarChavesPix);
router.post('/pix-keys', authenticateToken, cadastrarChavePix);
router.get('/withdrawals', authenticateToken, listarSaques);
router.post('/withdrawals', authenticateToken, solicitarSaque);
router.get('/transactions', authenticateToken, listarTransacoes);

module.exports = router;
