import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    const status = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';

    res.status(status).json({
        status: 'erro',
        mensagem: message,
        ...(process.env.NODE_ENV === 'development' && { pilha: err.stack }),
    });
};
