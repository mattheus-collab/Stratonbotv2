import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Erro de validação',
                erros: error.errors.map((e) => ({
                    campo: e.path.join('.'),
                    mensagem: e.message,
                })),
            });
        }
        return next(error);
    }
};
