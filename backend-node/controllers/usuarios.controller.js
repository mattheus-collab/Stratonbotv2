const { supabase } = require('../index');

// Listar todos os usuários
const listarUsuarios = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            mensagem: 'Usuários recuperados com sucesso',
            dados: data,
            total: data.length
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao buscar usuários',
            erro: error.message
        });
    }
};

// Cadastrar novo usuário
const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, telegram_id, username } = req.body;

        // Validação básica
        if (!nome || !email) {
            return res.status(400).json({
                mensagem: 'Nome e email são obrigatórios',
                erro: 'Campos obrigatórios não preenchidos'
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
                erro: 'Usuário com este email já existe'
            });
        }

        // Insere o novo usuário
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{
                nome,
                email,
                telegram_id,
                username,
                saldo: 0,
                role: 'usuario'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso',
            dados: data
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário',
            erro: error.message
        });
    }
};

// Consultar usuário por ID
const consultarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    mensagem: 'Usuário não encontrado',
                    erro: 'ID inválido ou usuário não existe'
                });
            }
            throw error;
        }

        res.json({
            mensagem: 'Usuário encontrado',
            dados: data
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao consultar usuário',
            erro: error.message
        });
    }
};

module.exports = {
    listarUsuarios,
    cadastrarUsuario,
    consultarUsuario
};
