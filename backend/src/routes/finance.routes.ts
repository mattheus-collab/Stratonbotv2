import { Router } from 'express';
import * as financeController from '../controllers/finance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { transactionSchema, pixKeySchema, withdrawalSchema } from '../schemas/validation.schemas';

const router = Router();

router.use(authMiddleware);

router.get('/balance', financeController.getBalance);
router.get('/transactions', financeController.getTransactions);
router.post('/transactions', validate(transactionSchema), financeController.addTransaction);
router.post('/pix-keys', validate(pixKeySchema), financeController.createPixKey);
router.get('/pix-keys', financeController.getPixKeys);
router.post('/withdrawals', validate(withdrawalSchema), financeController.requestWithdrawal);
router.get('/withdrawals', financeController.getWithdrawals);

export default router;
