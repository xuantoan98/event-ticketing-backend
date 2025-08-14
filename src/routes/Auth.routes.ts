import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../validators';
import { authMiddleware } from '../middlewares';

const router = Router();
const authController = new AuthController();

router.post('/login', validate('login'), authController.login);
router.post('/refresh-token', validate('refresh-token'), authController.refreshToken);
router.post('/forgot-password', validate('forgotPassword'), authController.forgotPassword);

export default router;