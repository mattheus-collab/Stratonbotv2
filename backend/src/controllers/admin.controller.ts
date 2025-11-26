import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';

interface AuthRequest extends Request {
    user?: any;
}

export const getAllWithdrawals = async (req: AuthRequest, res: Response) => {
    try {
        const withdrawals = await adminService.getAllWithdrawals();
        res.json({ status: 'sucesso', dados: withdrawals });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const approveWithdrawal = async (req: AuthRequest, res: Response) => {
    try {
        const result = await adminService.approveWithdrawal(req.params.id, req.user.id);
        res.json({ status: 'sucesso', mensagem: 'Saque processado com sucesso', dados: result });
    } catch (error: any) {
        res.status(400).json({ status: 'erro', mensagem: error.message });
    }
};

export const getSystemStats = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await adminService.getSystemStats();
        res.json({ status: 'sucesso', dados: stats });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const getSystemConfig = async (req: AuthRequest, res: Response) => {
    try {
        const config = await adminService.getSystemConfig();
        res.json({ status: 'sucesso', dados: config });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const updateSystemConfig = async (req: AuthRequest, res: Response) => {
    try {
        const config = await adminService.updateSystemConfig(req.body);
        res.json({ status: 'sucesso', mensagem: 'Configuração atualizada', dados: config });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await adminService.getAllUsers();
        res.json({ status: 'sucesso', dados: users });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};
