import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ status: 'sucesso', mensagem: 'Usuário criado com sucesso', dados: { userId: user.id } });
    } catch (error: any) {
        res.status(400).json({ status: 'erro', mensagem: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body);
        res.json({ status: 'sucesso', dados: result });
    } catch (error: any) {
        res.status(400).json({ status: 'erro', mensagem: error.message });
    }
};

export const getMe = async (req: Request | any, res: Response) => {
    try {
        const userData = await authService.getUserProfile(req.user.id);
        res.json({ status: 'sucesso', dados: userData });
    } catch (error: any) {
        res.status(404).json({ status: 'erro', mensagem: error.message });
    }
};
