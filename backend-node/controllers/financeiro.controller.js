const { supabase } = require('../index');

// Cadastrar chave PIX
const cadastrarChavePix = async (req, res) => {
    try {
        const { usuario_id, chave_pix, tipo_chave } = req.body;

        // Validação básica
        if (!usuario_id || !chave_pix || !tipo_chave) {
            return res.status(400).json({
                mensagem: 'Campos obrigatórios não preenchidos',
                erro: 'usuario_id, chave_pix e tipo_chave são obrigatórios'
            });
        }

        // Verifica se o usuário existe
        const { data: usuario, error: usuarioError } = await supabase
            .from('usuarios')
            .select('id')
            .eq('id', usuario_id)
            .single();

        if (usuarioError || !usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado',
                erro: 'ID de usuário inválido'
            });
        }

        // Verifica se já existe uma chave PIX para este usuário
        const { data: pixExistente } = await supabase
            .from('chaves_pix')
            .select('id')
            .eq('usuario_id', usuario_id)
            .eq('status', 'aprovada')
            .single();

        if (pixExistente) {
            return res.status(409).json({
                mensagem: 'Usuário já possui uma chave PIX cadastrada',
                erro: 'Apenas uma chave PIX ativa por usuário é permitida'
            });
        }

        // Insere a nova chave PIX
        const { data, error } = await supabase
            .from('chaves_pix')
            .insert([{
                usuario_id,
                chave_pix,
                tipo_chave,
                status: 'pendente'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            mensagem: 'Chave PIX cadastrada com sucesso',
            dados: data
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao cadastrar chave PIX',
            erro: error.message
        });
    }
};

// Consultar saldo do usuário
const consultarSaldo = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const { data, error } = await supabase
            .from('usuarios')
            .select('id, nome, email, saldo')
            .eq('id', usuarioId)
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
            mensagem: 'Saldo consultado com sucesso',
            dados: {
                usuario_id: data.id,
                nome: data.nome,
                email: data.email,
                saldo: data.saldo || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao consultar saldo',
            erro: error.message
        });
    }
};

// Solicitar saque
const solicitarSaque = async (req, res) => {
    try {
        const { usuario_id, valor } = req.body;

        // Validação básica
        if (!usuario_id || !valor) {
            return res.status(400).json({
                mensagem: 'Campos obrigatórios não preenchidos',
                erro: 'usuario_id e valor são obrigatórios'
            });
        }

        if (valor <= 0) {
            return res.status(400).json({
                mensagem: 'Valor inválido',
                erro: 'O valor do saque deve ser maior que zero'
            });
        }

        // Verifica se o usuário existe e tem saldo suficiente
        const { data: usuario, error: usuarioError } = await supabase
            .from('usuarios')
            .select('id, saldo')
            .eq('id', usuario_id)
            .single();

        if (usuarioError || !usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado',
                erro: 'ID de usuário inválido'
            });
        }

        if (usuario.saldo < valor) {
            return res.status(400).json({
                mensagem: 'Saldo insuficiente',
                erro: `Saldo disponível: R$ ${usuario.saldo.toFixed(2)}`
            });
        }

        // Verifica se o usuário tem uma chave PIX aprovada
        const { data: chavePix, error: pixError } = await supabase
            .from('chaves_pix')
            .select('id, chave_pix')
            .eq('usuario_id', usuario_id)
            .eq('status', 'aprovada')
            .single();

        if (pixError || !chavePix) {
            return res.status(400).json({
                mensagem: 'Chave PIX não encontrada',
                erro: 'É necessário ter uma chave PIX aprovada para solicitar saque'
            });
        }

        // Cria a solicitação de saque
        const { data, error } = await supabase
            .from('saques')
            .insert([{
                usuario_id,
                valor,
                status: 'pendente',
                chave_pix_id: chavePix.id
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            mensagem: 'Solicitação de saque criada com sucesso',
            dados: data
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao solicitar saque',
            erro: error.message
        });
    }
};

// Listar chaves PIX do usuário
const listarChavesPix = async (req, res) => {
    try {
        const { usuario_id } = req.query;

        if (!usuario_id) {
            return res.status(400).json({
                mensagem: 'ID do usuário é obrigatório',
                erro: 'Forneça o usuario_id como query parameter'
            });
        }

        const { data, error } = await supabase
            .from('chaves_pix')
            .select('*')
            .eq('usuario_id', usuario_id)
            .eq('status', 'aprovada');

        if (error) throw error;

        // Formata para compatibilidade com frontend
        const chavesFormatadas = data.map(chave => ({
            id: chave.id,
            keyType: chave.tipo_chave,
            keyValue: chave.chave_pix,
            status: chave.status
        }));

        res.json({
            mensagem: 'Chaves PIX recuperadas com sucesso',
            dados: chavesFormatadas
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao listar chaves PIX',
            erro: error.message
        });
    }
};

// Listar saques do usuário
const listarSaques = async (req, res) => {
    try {
        const { usuario_id } = req.query;

        if (!usuario_id) {
            return res.status(400).json({
                mensagem: 'ID do usuário é obrigatório',
                erro: 'Forneça o usuario_id como query parameter'
            });
        }

        const { data, error } = await supabase
            .from('saques')
            .select('*')
            .eq('usuario_id', usuario_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Formata para compatibilidade com frontend
        const saquesFormatados = data.map(saque => ({
            id: saque.id,
            amount: saque.valor,
            status: saque.status.toUpperCase(),
            createdAt: saque.created_at
        }));

        res.json({
            mensagem: 'Saques recuperados com sucesso',
            dados: saquesFormatados
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao listar saques',
            erro: error.message
        });
    }
};

// Listar transações do usuário (mock - pode ser implementado com tabela de transações)
const listarTransacoes = async (req, res) => {
    try {
        const { usuario_id } = req.query;

        if (!usuario_id) {
            return res.status(400).json({
                mensagem: 'ID do usuário é obrigatório',
                erro: 'Forneça o usuario_id como query parameter'
            });
        }

        // Por enquanto retorna array vazio - pode ser implementado com tabela de transações
        res.json({
            mensagem: 'Transações recuperadas com sucesso',
            dados: []
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao listar transações',
            erro: error.message
        });
    }
};

// Consultar saldo (versão compatível com /finance/balance)
const consultarSaldoBalance = async (req, res) => {
    try {
        const { usuario_id } = req.query;

        if (!usuario_id) {
            return res.status(400).json({
                mensagem: 'ID do usuário é obrigatório',
                erro: 'Forneça o usuario_id como query parameter'
            });
        }

        const { data, error } = await supabase
            .from('usuarios')
            .select('saldo')
            .eq('id', usuario_id)
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
            mensagem: 'Saldo consultado com sucesso',
            dados: {
                balance: data.saldo || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao consultar saldo',
            erro: error.message
        });
    }
};

module.exports = {
    cadastrarChavePix,
    consultarSaldo,
    solicitarSaque,
    listarChavesPix,
    listarSaques,
    listarTransacoes,
    consultarSaldoBalance
};
