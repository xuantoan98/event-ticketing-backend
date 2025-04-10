import { Router } from "express";
import { userController } from "../controllers";
import { validate } from "../validators";
import { requireAdmin, authMiddleware, checkOwnership, requireOrganizer, handleAvatarUpload } from "../middlewares";

const router = Router();

// Public routes
router.post('/register', validate('register'), userController.register);


// Protected routes
router.get('/', authMiddleware, validate('list'), userController.getUsers)
// router.get('/search', authMiddleware(), validate('search'), userController.searchUsers)
// router.get('/:id', authMiddleware(), checkOwnership, userController.getCurrentUser)
// router.put('/update:id', authMiddleware(), checkOwnership, requireAdmin, validate('update'), userController.updateUser)
// router.delete('/:id', authMiddleware(),checkOwnership, requireAdmin, userController.deleteUser)
// router.put('/avatar', authMiddleware(), handleAvatarUpload, userController.updateAvatar)
router.post('/change-password', authMiddleware, validate('changePassword'), userController.changePassword)

export default router
