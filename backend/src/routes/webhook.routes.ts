import { Router } from 'express';
import * as webhookController from '../controllers/webhook.controller';

const router = Router();

router.post('/inter', webhookController.handleInterWebhook);

export default router;
