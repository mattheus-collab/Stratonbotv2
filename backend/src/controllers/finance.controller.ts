import { Request, Response } from 'express';
import * as financeService from '../services/finance.service';

interface AuthRequest extends Request {
    user?: any;
}

export const getBalance = async (req: AuthRequest, res: Response) => {
    try {
        const balance = await financeService.getBalance(req.user.id);
        res.json({ status: 'sucesso', dados: balance });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const transactions = await financeService.getTransactions(req.user.id);
        res.json({ status: 'sucesso', dados: transactions });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const addTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const transaction = await financeService.addTransaction(req.user.id, req.body);
        res.status(201).json({ status: 'sucesso', mensagem: 'Transação adicionada', dados: transaction });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const createPixKey = async (req: AuthRequest, res: Response) => {
    try {
        const pixKey = await financeService.createPixKey(req.user.id, req.body);
        res.status(201).json({ status: 'sucesso', mensagem: 'Chave PIX criada', dados: pixKey });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const getPixKeys = async (req: AuthRequest, res: Response) => {
    try {
        const pixKeys = await financeService.getPixKeys(req.user.id);
        res.json({ status: 'sucesso', dados: pixKeys });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};

export const requestWithdrawal = async (req: AuthRequest, res: Response) => {
    try {
        const result = await financeService.requestWithdrawal(req.user.id, req.body);
        res.status(201).json({ status: 'sucesso', mensagem: 'Saque solicitado com sucesso', dados: result });
    } catch (error: any) {
        res.status(400).json({ status: 'erro', mensagem: error.message });
    }
};

export const getWithdrawals = async (req: AuthRequest, res: Response) => {
    try {
        const withdrawals = await financeService.getWithdrawals(req.user.id);
        res.json({ status: 'sucesso', dados: withdrawals });
    } catch (error: any) {
        res.status(500).json({ status: 'erro', mensagem: error.message });
    }
};
