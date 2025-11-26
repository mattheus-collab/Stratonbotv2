import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes';
import botRoutes from './routes/bot.routes';
import financeRoutes from './routes/finance.routes';
import adminRoutes from './routes/admin.routes';
import webhookRoutes from './routes/webhook.routes';
import { errorHandler } from './middlewares/error.middleware';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Validate critical env vars
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(`Variáveis de ambiente obrigatórias faltando: ${missingEnv.join(', ')}`);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Update this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Muitas requisições deste IP, por favor tente novamente mais tarde.'
});
app.use('/api/', limiter);

app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        status: 'sucesso',
        mensagem: 'API do Stratonbotv2 está online',
        versao: '1.0.0',
        documentacao: '/api-docs' // Placeholder
    });
});

// Global Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Documentação disponível em http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
    console.log('Sinal SIGTERM recebido: fechando servidor HTTP');
    await prisma.$disconnect();
    server.close(() => {
        console.log('Servidor HTTP fechado');
    });
});
