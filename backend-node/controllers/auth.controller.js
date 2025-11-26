const { supabase } = require('../index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login de usuário
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validação básica
        if (!email || !password) {
            return res.status(400).json({
                mensagem: 'Email e senha são obrigatórios',
                erro: 'Campos obrigatórios não preenchidos'
            });
        }

        // Busca o usuário pelo email
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !usuario) {
            return res.status(401).json({
                mensagem: 'Credenciais inválidas',
                erro: 'Email ou senha incorretos'
            });
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(password, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'Credenciais inválidas',
                erro: 'Email ou senha incorretos'
            });
        }

        // Gera o token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                role: usuario.role
            },
            process.env.JWT_SECRET || 'secret-key-change-in-production',
            { expiresIn: '7d' }
        );

        // Remove a senha do objeto de usuário
        delete usuario.senha;

        res.json({
            mensagem: 'Login realizado com sucesso',
            dados: {
                token,
                user: {
                    id: usuario.id,
                    name: usuario.nome,
                    email: usuario.email,
                    role: usuario.role.toUpperCase(),
                    balance: usuario.saldo
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao fazer login',
            erro: error.message
        });
    }
};

// Registro de novo usuário
const register = async (req, res) => {
    try {
        const { nome, name, email, password, cpf } = req.body;

        // Aceita tanto 'nome' quanto 'name' para compatibilidade com frontend
        const nomeUsuario = nome || name;

        // Validação básica
        if (!nomeUsuario || !email || !password) {
            return res.status(400).json({
                mensagem: 'Todos os campos são obrigatórios',
                erro: 'Nome, email e senha devem ser preenchidos'
            });
        }

        // Validação de senha
        if (password.length < 6) {
            return res.status(400).json({
                mensagem: 'Senha muito curta',
                erro: 'A senha deve ter no mínimo 6 caracteres'
            });
        }

        // Verifica se o email já existe
        const { data: usuarioExistente } = await supabase
            .from('usuarios')
            .select('id')
            .eq('email', email)
            .single();

        if (usuarioExistente) {
            return res.status(409).json({
                mensagem: 'Email já cadastrado',
                erro: 'Já existe um usuário com este email'
            });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(password, 10);

        // Insere o novo usuário
        const { data: novoUsuario, error } = await supabase
            .from('usuarios')
            .insert([{
                nome: nomeUsuario,
                email,
                senha: senhaHash,
                cpf: cpf || null,
                saldo: 0,
                role: 'usuario'
            }])
            .select()
            .single();

        if (error) throw error;

        // Gera o token JWT
        const token = jwt.sign(
            {
                id: novoUsuario.id,
                email: novoUsuario.email,
                role: novoUsuario.role
            },
            process.env.JWT_SECRET || 'secret-key-change-in-production',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso',
            dados: {
                token,
                user: {
                    id: novoUsuario.id,
                    name: novoUsuario.nome,
                    email: novoUsuario.email,
                    role: novoUsuario.role.toUpperCase(),
                    balance: novoUsuario.saldo
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário',
            erro: error.message
        });
    }
};

module.exports = {
    login,
    register
};
