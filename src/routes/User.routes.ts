import { Router } from "express";
import { deleteUser, getCurrentUser, getUsers, login, register, updateUser } from "../controllers/User.controller";
import { validate } from "../validators/User.validator";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import { checkOwnership } from "../middlewares/ownership.middleware";

const router = Router();

// Public routes
router.post('/register', validate('register'), register);
router.post('/login', validate('login'), login);

// Protected routes
router.get('/', authMiddleware(), requireAdmin, validate('list'), getUsers);
router.get('/:id', authMiddleware(), checkOwnership, getCurrentUser);
router.put('/update:id', authMiddleware(), checkOwnership, validate('update'), updateUser);
router.delete('/:id', authMiddleware(), requireAdmin, deleteUser)

export default router;
