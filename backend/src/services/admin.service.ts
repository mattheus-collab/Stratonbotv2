import prisma from '../config/prisma';

export const getAllWithdrawals = async () => {
    return await prisma.withdrawalRequest.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
    });
};

export const approveWithdrawal = async (id: string, adminId: string) => {
    return await prisma.$transaction(async (tx) => {
        const withdrawal = await tx.withdrawalRequest.findUnique({ where: { id } });
        if (!withdrawal) throw new Error('Solicitação de saque não encontrada');
        if (withdrawal.status !== 'PENDING') throw new Error('Solicitação já processada');

        // Balance was already deducted on request? 
        // In finance.controller.ts we deducted it. 
        // So here we just mark as approved/paid.

        const updatedWithdrawal = await tx.withdrawalRequest.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvedBy: adminId,
                updatedAt: new Date()
            },
        });

        return updatedWithdrawal;
    });
};

export const getSystemStats = async () => {
    const totalUsers = await prisma.user.count();
    const totalBots = await prisma.bot.count();
    const totalTransactions = await prisma.transaction.count();

    // Calculate total volume
    const volume = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' }
    });

    return {
        totalUsers,
        totalBots,
        totalTransactions,
        totalVolume: volume._sum.amount || 0
    };
};

export const getSystemConfig = async () => {
    return await prisma.systemConfig.findUnique({ where: { id: 'default' } });
};

export const updateSystemConfig = async (data: any) => {
    return await prisma.systemConfig.upsert({
        where: { id: 'default' },
        update: data,
        create: { id: 'default', ...data }
    });
};

export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, balance: true, createdAt: true }
    });
};
