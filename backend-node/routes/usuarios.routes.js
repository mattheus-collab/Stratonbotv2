const express = require('express');
const router = express.Router();
const {
    listarUsuarios,
    cadastrarUsuario,
    consultarUsuario
} = require('../controllers/usuarios.controller');

// GET /usuarios - Listar todos os usuários
router.get('/', listarUsuarios);

// POST /usuarios - Cadastrar novo usuário
router.post('/', cadastrarUsuario);

// GET /usuarios/:id - Consultar usuário por ID
router.get('/:id', consultarUsuario);

module.exports = router;
