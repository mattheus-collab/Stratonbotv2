import { Router } from 'express';
import * as botController from '../controllers/bot.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBotSchema, updateBotSchema } from '../schemas/validation.schemas';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createBotSchema), botController.createBot);
router.get('/', botController.getBots);
router.get('/:id', botController.getBot);
router.put('/:id', validate(updateBotSchema), botController.updateBot);
router.delete('/:id', botController.deleteBot);

export default router;
