import { Request, Response } from 'express';
import * as webhookService from '../services/webhook.service';

export const handleInterWebhook = async (req: Request, res: Response) => {
    try {
        const result = await webhookService.handleInterWebhook(req.body);
        res.json({ status: 'sucesso', mensagem: 'Webhook recebido', dados: result });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};
