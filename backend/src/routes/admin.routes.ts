import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authMiddleware, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.use(authorizeAdmin);

router.get('/withdrawals', adminController.getAllWithdrawals);
router.put('/withdrawals/:id', adminController.approveWithdrawal);
router.get('/stats', adminController.getSystemStats);
router.get('/config', adminController.getSystemConfig);
router.put('/config', adminController.updateSystemConfig);
router.get('/users', adminController.getAllUsers);

export default router;
