import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        cpf: z.string().optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(1, 'Senha é obrigatória'),
    }),
});

export const createBotSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Nome do bot é obrigatório'),
        apiKey: z.string().min(1, 'Token do bot é obrigatório'),
        config: z.record(z.any()).optional(),
    }),
});

export const updateBotSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
    body: z.object({
        name: z.string().optional(),
        apiKey: z.string().optional(),
        config: z.record(z.any()).optional(),
    }),
});

export const transactionSchema = z.object({
    body: z.object({
        amount: z.number().positive('Valor deve ser positivo'),
        type: z.enum(['CREDIT', 'DEBIT'], { errorMap: () => ({ message: 'Tipo inválido' }) }),
        botId: z.string().uuid('ID do bot inválido').optional(),
    }),
});

export const pixKeySchema = z.object({
    body: z.object({
        keyType: z.enum(['CPF', 'EMAIL', 'PHONE', 'RANDOM'], { errorMap: () => ({ message: 'Tipo de chave inválido' }) }),
        keyValue: z.string().min(1, 'Chave PIX é obrigatória'),
    }),
});

export const withdrawalSchema = z.object({
    body: z.object({
        amount: z.number().positive('Valor deve ser positivo'),
        pixKey: z.string().min(1, 'Chave PIX é obrigatória'),
    }),
});
