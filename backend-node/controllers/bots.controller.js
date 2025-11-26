const { supabase } = require('../index');

// Listar todos os bots
const listarBots = async (req, res) => {
    try {
        const usuario_id = req.user.id; // Extrai do token autenticado

        const { data, error } = await supabase
            .from('bots')
            .select('*')
            .eq('usuario_id', usuario_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            mensagem: 'Bots recuperados com sucesso',
            dados: data,
            total: data.length
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao buscar bots',
            erro: error.message
        });
    }
};

// Criar novo bot
const criarBot = async (req, res) => {
    try {
        const { nome, name, token, descricao, description } = req.body;
        const usuario_id = req.user.id; // Extrai do token autenticado

        // Aceita tanto 'nome' quanto 'name', 'descricao' quanto 'description'
        const nomeBot = nome || name;
        const descricaoBot = descricao || description;

        // Validação básica
        if (!nomeBot || !token) {
            return res.status(400).json({
                mensagem: 'Campos obrigatórios não preenchidos',
                erro: 'nome e token são obrigatórios'
            });
        }

        // Verifica se já existe um bot com este token
        const { data: botExistente } = await supabase
            .from('bots')
            .select('id')
            .eq('token', token)
            .single();

        if (botExistente) {
            return res.status(409).json({
                mensagem: 'Token já cadastrado',
                erro: 'Já existe um bot com este token'
            });
        }

        // Insere o novo bot
        const { data, error } = await supabase
            .from('bots')
            .insert([{
                usuario_id,
                nome: nomeBot,
                token,
                descricao: descricaoBot,
                ativo: true
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            mensagem: 'Bot criado com sucesso',
            dados: data
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao criar bot',
            erro: error.message
        });
    }
};

// Consultar bot por ID
const consultarBot = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('bots')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    mensagem: 'Bot não encontrado',
                    erro: 'ID inválido ou bot não existe'
                });
            }
            throw error;
        }

        res.json({
            mensagem: 'Bot encontrado',
            dados: data
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao consultar bot',
            erro: error.message
        });
    }
};

// Atualizar bot
const atualizarBot = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, ativo } = req.body;

        // Verifica se o bot existe
        const { data: botExistente, error: botError } = await supabase
            .from('bots')
            .select('id')
            .eq('id', id)
            .single();

        if (botError || !botExistente) {
            return res.status(404).json({
                mensagem: 'Bot não encontrado',
                erro: 'ID inválido ou bot não existe'
            });
        }

        // Prepara os dados para atualização
        const dadosAtualizacao = {};
        if (nome !== undefined) dadosAtualizacao.nome = nome;
        if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
        if (ativo !== undefined) dadosAtualizacao.ativo = ativo;

        if (Object.keys(dadosAtualizacao).length === 0) {
            return res.status(400).json({
                mensagem: 'Nenhum campo para atualizar',
                erro: 'Forneça pelo menos um campo para atualização'
            });
        }

        // Atualiza o bot
        const { data, error } = await supabase
            .from('bots')
            .update(dadosAtualizacao)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            mensagem: 'Bot atualizado com sucesso',
            dados: data
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao atualizar bot',
            erro: error.message
        });
    }
};

// Remover bot
const removerBot = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o bot existe
        const { data: botExistente, error: botError } = await supabase
            .from('bots')
            .select('id, nome')
            .eq('id', id)
            .single();

        if (botError || !botExistente) {
            return res.status(404).json({
                mensagem: 'Bot não encontrado',
                erro: 'ID inválido ou bot não existe'
            });
        }

        // Remove o bot
        const { error } = await supabase
            .from('bots')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({
            mensagem: 'Bot removido com sucesso',
            dados: {
                id: botExistente.id,
                nome: botExistente.nome
            }
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao remover bot',
            erro: error.message
        });
    }
};

module.exports = {
    listarBots,
    criarBot,
    consultarBot,
    atualizarBot,
    removerBot
};
