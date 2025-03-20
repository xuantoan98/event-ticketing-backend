import { Router } from "express";
import { deleteUser, getCurrentUser, getUsers, login, register, searchUsers, updateUser } from "../controllers/User.controller";
import { validate } from "../validators/User.validator";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import { checkOwnership } from "../middlewares/ownership.middleware";
import { requireOrganizer } from "../middlewares/organizer.middleware";

const router = Router()

// Public routes
router.post('/register', validate('register'), register)
router.post('/login', validate('login'), login)

// Protected routes
router.get('/', authMiddleware(), requireOrganizer, validate('list'), getUsers)
router.get('/search', authMiddleware(), validate('search'), searchUsers)
router.get('/:id', authMiddleware(), checkOwnership, getCurrentUser)
router.put('/update:id', authMiddleware(), checkOwnership, requireAdmin, validate('update'), updateUser)
router.delete('/:id', authMiddleware(),checkOwnership, requireAdmin, deleteUser)

export default router
