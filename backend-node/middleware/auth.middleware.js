const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticar requisições usando JWT
 * Extrai o token do header Authorization e valida
 * Adiciona req.user com as informações do usuário autenticado
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            mensagem: 'Token não fornecido',
            erro: 'Autenticação necessária para acessar este recurso'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret-key-change-in-production', (err, user) => {
        if (err) {
            return res.status(403).json({
                mensagem: 'Token inválido ou expirado',
                erro: 'Faça login novamente para continuar'
            });
        }

        // Adiciona informações do usuário à requisição
        req.user = user; // { id, email, role }
        next();
    });
};

/**
 * Middleware para verificar se o usuário é admin
 * Deve ser usado após authenticateToken
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            mensagem: 'Usuário não autenticado',
            erro: 'Autenticação necessária'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            mensagem: 'Acesso negado',
            erro: 'Apenas administradores podem acessar este recurso'
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    requireAdmin
};
