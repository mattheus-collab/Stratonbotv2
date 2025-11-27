const express = require('express');
const router = express.Router();
const {
    listarUsuarios,
    cadastrarUsuario,
    consultarUsuario
} = require('../controllers/usuarios.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET /usuarios - Listar todos os usuários (requer autenticação)
router.get('/', authenticateToken, listarUsuarios);

// POST /usuarios - Cadastrar novo usuário (público para registro)
router.post('/', cadastrarUsuario);

// GET /usuarios/:id - Consultar usuário por ID (requer autenticação)
router.get('/:id', authenticateToken, consultarUsuario);

module.exports = router;
