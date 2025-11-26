import prisma from '../config/prisma';

export const handleInterWebhook = async (payload: any) => {
    // Log webhook
    await prisma.webhookLog.create({
        data: {
            payload,
            status: 'RECEIVED'
        }
    });

    // Implement Inter webhook logic here
    // Verify signature, find transaction by externalId, update status

    // Example:
    // const { nossoNumero, situacao } = payload;
    // ... logic to update transaction ...

    return { message: 'Webhook recebido' };
};
