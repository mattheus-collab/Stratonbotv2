import prisma from '../config/prisma';
import telegramService from './telegram.service';

export const createBot = async (userId: string, data: any) => {
    const { name, config, apiKey } = data;

    if (!name || name.trim() === '') throw new Error('Nome do bot é obrigatório');
    if (!apiKey || apiKey.trim() === '') throw new Error('Token do bot é obrigatório');

    const bot = await prisma.bot.create({
        data: {
            userId,
            name: name.trim(),
            apiKey: apiKey.trim(),
            config: config || {},
        },
    });

    if (apiKey && config) {
        await telegramService.initializeBot(bot.id, apiKey.trim(), config);
    }

    return bot;
};

export const getBots = async (userId: string) => {
    return await prisma.bot.findMany({ where: { userId } });
};

export const getBot = async (userId: string, botId: string) => {
    const bot = await prisma.bot.findFirst({ where: { id: botId, userId } });
    if (!bot) throw new Error('Bot não encontrado');
    return bot;
};

export const updateBot = async (userId: string, botId: string, data: any) => {
    const { name, config, apiKey } = data;

    const bot = await prisma.bot.findFirst({ where: { id: botId, userId } });
    if (!bot) throw new Error('Bot não encontrado');

    if (name !== undefined && name.trim() === '') throw new Error('Nome do bot não pode ser vazio');

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (config !== undefined) updateData.config = config;
    if (apiKey !== undefined) updateData.apiKey = apiKey;

    const updatedBot = await prisma.bot.update({
        where: { id: botId },
        data: updateData,
    });

    if (apiKey || config) {
        const finalToken = apiKey || bot.apiKey;
        const finalConfig = config || bot.config;
        if (finalToken && finalConfig) {
            await telegramService.initializeBot(botId, finalToken, finalConfig);
        }
    }

    return updatedBot;
};

export const deleteBot = async (userId: string, botId: string) => {
    const bot = await prisma.bot.findFirst({ where: { id: botId, userId } });
    if (!bot) throw new Error('Bot não encontrado');

    await prisma.bot.delete({ where: { id: botId } });
    return { message: 'Bot excluído com sucesso' };
};
