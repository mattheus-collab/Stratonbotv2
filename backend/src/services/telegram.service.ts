import TelegramBot from 'node-telegram-bot-api';
import prisma from '../config/prisma';

interface BotInstance {
    bot: TelegramBot;
    botId: string;
}

class TelegramService {
    private bots: Map<string, BotInstance> = new Map();

    /**
     * Initialize a Telegram bot with the given configuration
     */
    async initializeBot(botId: string, token: string, config: any) {
        try {
            // Stop existing bot if any
            if (this.bots.has(botId)) {
                await this.stopBot(botId);
            }

            // Create new bot instance
            const bot = new TelegramBot(token, { polling: true });

            // Store bot instance
            this.bots.set(botId, { bot, botId });

            // Setup commands and handlers
            this.setupCommands(bot, botId, config);

            console.log(`✅ Bot ${botId} initialized successfully`);
            return { success: true, message: 'Bot initialized' };
        } catch (error: any) {
            console.error(`❌ Error initializing bot ${botId}:`, error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Setup bot commands and message handlers
     */
    private setupCommands(bot: TelegramBot, botId: string, config: any) {
        // Handle /start command
        bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            const { welcomeMessage, welcomePhoto, products } = config;

            try {
                // Send welcome photo if available
                if (welcomePhoto) {
                    // Convert base64 to buffer
                    const photoBuffer = Buffer.from(welcomePhoto.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                    await bot.sendPhoto(chatId, photoBuffer, {
                        caption: welcomeMessage || 'Bem-vindo!',
                    });
                } else {
                    await bot.sendMessage(chatId, welcomeMessage || 'Bem-vindo!');
                }

                // Send products as inline keyboard if available
                if (products && products.length > 0) {
                    const keyboard = products.map((product: any) => ([{
                        text: `${product.title} - R$ ${product.value.toFixed(2)}`,
                        callback_data: `buy_${product.id}`
                    }]));

                    await bot.sendMessage(chatId, 'Escolha um produto:', {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    });
                }
            } catch (error) {
                console.error('Error handling /start:', error);
                await bot.sendMessage(chatId, 'Ocorreu um erro. Tente novamente.');
            }
        });

        // Handle callback queries (button clicks)
        bot.on('callback_query', async (query) => {
            const chatId = query.message?.chat.id;
            const data = query.callback_data;

            if (!chatId || !data) return;

            try {
                if (data.startsWith('buy_')) {
                    const productId = data.replace('buy_', '');
                    const product = config.products?.find((p: any) => p.id === productId);

                    if (product) {
                        // Get bot info from database
                        const botInfo = await prisma.bot.findUnique({
                            where: { id: botId },
                            include: { user: true }
                        });

                        if (!botInfo) {
                            await bot.answerCallbackQuery(query.id, { text: 'Erro ao processar pedido' });
                            return;
                        }

                        // Create transaction
                        const transaction = await prisma.transaction.create({
                            data: {
                                userId: botInfo.userId,
                                botId: botId,
                                amount: product.value,
                                fee: 0,
                                netAmount: product.value,
                                type: 'CREDIT',
                                status: 'PENDING',
                            }
                        });

                        // In a real implementation, you would:
                        // 1. Generate PIX QR Code using Inter API
                        // 2. Send QR Code to user
                        // 3. Wait for payment confirmation via webhook

                        // For now, send a placeholder message
                        await bot.sendMessage(chatId,
                            `✅ Pedido criado!\n\n` +
                            `Produto: ${product.title}\n` +
                            `Valor: R$ ${product.value.toFixed(2)}\n\n` +
                            `ID da Transação: ${transaction.id}\n\n` +
                            `⚠️ Integração com PIX em desenvolvimento.\n` +
                            `Em breve você receberá o QR Code para pagamento.`
                        );

                        await bot.answerCallbackQuery(query.id, { text: 'Pedido criado!' });
                    }
                }
            } catch (error) {
                console.error('Error handling callback:', error);
                await bot.answerCallbackQuery(query.id, { text: 'Erro ao processar' });
            }
        });

        // Handle errors
        bot.on('polling_error', (error) => {
            console.error(`Polling error for bot ${botId}:`, error);
        });
    }

    /**
     * Stop a bot
     */
    async stopBot(botId: string) {
        const instance = this.bots.get(botId);
        if (instance) {
            await instance.bot.stopPolling();
            this.bots.delete(botId);
            console.log(`🛑 Bot ${botId} stopped`);
        }
    }

    /**
     * Stop all bots
     */
    async stopAllBots() {
        for (const [botId] of this.bots) {
            await this.stopBot(botId);
        }
    }

    /**
     * Get bot instance
     */
    getBot(botId: string): TelegramBot | null {
        return this.bots.get(botId)?.bot || null;
    }
}

// Export singleton instance
export default new TelegramService();
