const { supabase } = require('../index');

// Listar todos os usuários (admin)
const listarUsuarios = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
        id,
        nome,
        email,
        role,
        saldo,
        created_at,
        chaves_pix (
          id,
          chave_pix,
          tipo_chave,
          status
        )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Formata a resposta para compatibilidade com o frontend
        const usuariosFormatados = data.map(usuario => ({
            id: usuario.id,
            name: usuario.nome,
            email: usuario.email,
            role: usuario.role,
            balance: usuario.saldo,
            createdAt: usuario.created_at,
            pixKeys: usuario.chaves_pix?.filter(pix => pix.status === 'aprovada').map(pix => ({
                id: pix.id,
                keyType: pix.tipo_chave,
                keyValue: pix.chave_pix
            })) || []
        }));

        res.json({
            mensagem: 'Usuários recuperados com sucesso',
            dados: usuariosFormatados,
            total: usuariosFormatados.length
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao buscar usuários',
            erro: error.message
        });
    }
};

// Listar todos os saques pendentes (admin)
const listarSaques = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('saques')
            .select(`
        id,
        valor,
        status,
        created_at,
        usuario_id,
        usuarios (
          id,
          nome,
          email
        ),
        chave_pix_id,
        chaves_pix (
          chave_pix,
          tipo_chave
        )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Formata a resposta
        const saquesFormatados = data.map(saque => ({
            id: saque.id,
            amount: saque.valor,
            status: saque.status.toUpperCase(),
            createdAt: saque.created_at,
            user: {
                id: saque.usuarios?.id,
                name: saque.usuarios?.nome,
                email: saque.usuarios?.email
            },
            pixKey: {
                keyType: saque.chaves_pix?.tipo_chave,
                keyValue: saque.chaves_pix?.chave_pix
            }
        }));

        res.json({
            mensagem: 'Saques recuperados com sucesso',
            dados: saquesFormatados,
            total: saquesFormatados.length
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao buscar saques',
            erro: error.message
        });
    }
};

// Aprovar ou rejeitar saque (admin)
const atualizarSaque = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validação
        if (!status || !['APPROVED', 'REJECTED', 'PAID'].includes(status)) {
            return res.status(400).json({
                mensagem: 'Status inválido',
                erro: 'Status deve ser APPROVED, REJECTED ou PAID'
            });
        }

        // Verifica se o saque existe
        const { data: saqueExistente, error: saqueError } = await supabase
            .from('saques')
            .select('*, usuarios(saldo)')
            .eq('id', id)
            .single();

        if (saqueError || !saqueExistente) {
            return res.status(404).json({
                mensagem: 'Saque não encontrado',
                erro: 'ID inválido ou saque não existe'
            });
        }

        // Se está rejeitando, devolve o saldo ao usuário
        if (status === 'REJECTED' && saqueExistente.status === 'pendente') {
            const { error: updateSaldoError } = await supabase
                .from('usuarios')
                .update({
                    saldo: saqueExistente.usuarios.saldo + saqueExistente.valor
                })
                .eq('id', saqueExistente.usuario_id);

            if (updateSaldoError) throw updateSaldoError;
        }

        // Se está aprovando, deduz o saldo (se ainda não foi deduzido)
        if (status === 'APPROVED' && saqueExistente.status === 'pendente') {
            const novoSaldo = saqueExistente.usuarios.saldo - saqueExistente.valor;

            if (novoSaldo < 0) {
                return res.status(400).json({
                    mensagem: 'Saldo insuficiente',
                    erro: 'Usuário não possui saldo suficiente'
                });
            }

            const { error: updateSaldoError } = await supabase
                .from('usuarios')
                .update({ saldo: novoSaldo })
                .eq('id', saqueExistente.usuario_id);

            if (updateSaldoError) throw updateSaldoError;
        }

        // Atualiza o status do saque
        const { data, error } = await supabase
            .from('saques')
            .update({ status: status.toLowerCase() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            mensagem: 'Saque atualizado com sucesso',
            dados: {
                id: data.id,
                status: data.status.toUpperCase(),
                amount: data.valor
            }
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao atualizar saque',
            erro: error.message
        });
    }
};

module.exports = {
    listarUsuarios,
    listarSaques,
    atualizarSaque
};
