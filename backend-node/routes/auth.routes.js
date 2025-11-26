const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');

// POST /auth/login - Login de usuário
router.post('/login', login);

// POST /auth/register - Registro de novo usuário
router.post('/register', register);

module.exports = router;
