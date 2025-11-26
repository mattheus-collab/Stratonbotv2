import prisma from '../config/prisma';

export const getBalance = async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return { balance: user?.balance || 0 };
};

export const getTransactions = async (userId: string) => {
    return await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};

export const addTransaction = async (userId: string, data: any) => {
    const { amount, type, botId } = data;

    const config = await prisma.systemConfig.findUnique({ where: { id: 'default' } });
    const feePercent = config?.salesFeePercent || 5.0;

    const fee = type === 'CREDIT' ? (amount * feePercent) / 100 : 0;
    const netAmount = amount - fee;

    return await prisma.$transaction(async (tx) => {
        const newTransaction = await tx.transaction.create({
            data: {
                userId,
                botId,
                amount,
                fee,
                netAmount,
                type,
                status: 'COMPLETED',
            },
        });

        if (type === 'CREDIT') {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: netAmount } },
            });
        } else if (type === 'DEBIT') {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } },
            });
        }

        return newTransaction;
    });
};

export const createPixKey = async (userId: string, data: any) => {
    const { keyType, keyValue } = data;
    return await prisma.pixKey.create({
        data: { userId, keyType, keyValue },
    });
};

export const getPixKeys = async (userId: string) => {
    return await prisma.pixKey.findMany({ where: { userId } });
};

export const requestWithdrawal = async (userId: string, data: any) => {
    const { amount, pixKey } = data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < amount) {
        throw new Error('Saldo insuficiente');
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { balance: { decrement: amount } },
        }),
        prisma.withdrawalRequest.create({
            data: {
                userId,
                amount,
                pixKey,
                status: 'PENDING',
            },
        }),
    ]);

    return { message: 'Saque solicitado com sucesso' };
};

export const getWithdrawals = async (userId: string) => {
    return await prisma.withdrawalRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};
