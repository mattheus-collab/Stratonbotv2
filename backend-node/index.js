// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Inicializa o servidor Express
const app = express();

// Porta dinâmica para hospedagem no Render
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====

// CORS - Permite requisições do frontend Netlify
app.use(cors({
    origin: ['https://stratonbot.netlify.app', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware para parsing de JSON
app.use(express.json());

// Middleware de logging para debug
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Valida se as credenciais do Supabase estão configuradas
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERRO: SUPABASE_URL e SUPABASE_KEY devem estar definidas no arquivo .env');
    process.exit(1);
}

// Cria o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporta o cliente Supabase para uso em outros módulos
module.exports = { supabase };

// Importa as rotas
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const financeiroRoutes = require('./routes/financeiro.routes');
const financeRoutes = require('./routes/finance.routes');
const botsRoutes = require('./routes/bots.routes');
const adminRoutes = require('./routes/admin.routes');

// Registra as rotas
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/financeiro', financeiroRoutes);
app.use('/finance', financeRoutes);
app.use('/bots', botsRoutes);
app.use('/admin', adminRoutes);

// Endpoint básico de health check
app.get('/', (req, res) => {
    res.json({
        mensagem: 'StratonBot API funcionando!',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Endpoint para testar conexão com Supabase
app.get('/health/supabase', async (req, res) => {
    try {
        // Tenta fazer uma query simples para verificar a conexão
        const { data, error } = await supabase.from('usuarios').select('count').limit(1);

        if (error) {
            return res.status(500).json({
                mensagem: 'Erro ao conectar com Supabase',
                erro: error.message
            });
        }

        res.json({
            mensagem: 'Conexão com Supabase estabelecida com sucesso!',
            status: 'conectado'
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao verificar conexão com Supabase',
            erro: error.message
        });
    }
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log(`🚀 StratonBot API rodando na porta ${PORT}`);
    console.log(`📡 Supabase URL: ${supabaseUrl}`);
    console.log(`🌐 CORS habilitado para: https://stratonbot.netlify.app`);
    console.log(`✅ Servidor pronto para receber requisições`);
    console.log('='.repeat(50));
});
