const express = require('express');
const router = express.Router();
const {
    cadastrarChavePix,
    consultarSaldo,
    solicitarSaque
} = require('../controllers/financeiro.controller');

// POST /financeiro/pix - Cadastrar chave PIX
router.post('/pix', cadastrarChavePix);

// GET /financeiro/saldo/:usuarioId - Consultar saldo do usuário
router.get('/saldo/:usuarioId', consultarSaldo);

// POST /financeiro/saque - Solicitar saque
router.post('/saque', solicitarSaque);

module.exports = router;
