import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../validators';

const router = Router();
const authController = new AuthController();

router.post('/login', validate('login'), authController.login);
router.post('/refresh-token', validate('refresh-token'), authController.refreshToken);

export default router;