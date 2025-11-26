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

// Rotas compatíveis com /finance/* (frontend antigo)
router.get('/balance', consultarSaldoBalance);
router.get('/pix-keys', listarChavesPix);
router.post('/pix-keys', cadastrarChavePix);
router.get('/withdrawals', listarSaques);
router.post('/withdrawals', solicitarSaque);
router.get('/transactions', listarTransacoes);

module.exports = router;
