import { Request, Response } from 'express';
import * as botService from '../services/bot.service';

interface AuthRequest extends Request {
    user?: any;
}

export const createBot = async (req: AuthRequest, res: Response) => {
    try {
        const bot = await botService.createBot(req.user.id, req.body);
        res.status(201).json({ status: 'sucesso', mensagem: 'Bot criado com sucesso', dados: bot });
    } catch (error: any) {
        res.status(400).json({ status: 'erro', mensagem: error.message });
    }
};

export const getBots = async (req: AuthRequest, res: Response) => {
    try {
        const bots = await botService.getBots(req.user.id);
        res.json({ status: 'sucesso', dados: bots });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const getBot = async (req: AuthRequest, res: Response) => {
    try {
        const bot = await botService.getBot(req.user.id, req.params.id);
        res.json({ status: 'sucesso', dados: bot });
    } catch (error: any) {
        res.status(404).json({ status: 'erro', mensagem: error.message });
    }
};

export const updateBot = async (req: AuthRequest, res: Response) => {
    try {
        const updatedBot = await botService.updateBot(req.user.id, req.params.id, req.body);
        res.json({ status: 'sucesso', mensagem: 'Bot atualizado com sucesso', dados: updatedBot });
    } catch (error: any) {
        res.status(400).json({ status: 'erro', mensagem: error.message });
    }
};

export const deleteBot = async (req: AuthRequest, res: Response) => {
    try {
        const result = await botService.deleteBot(req.user.id, req.params.id);
        res.json({ status: 'sucesso', mensagem: 'Bot removido com sucesso', dados: result });
    } catch (error: any) {
        res.status(400).json({ status: 'erro', mensagem: error.message });
    }
};
