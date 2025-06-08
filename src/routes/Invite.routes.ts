import { Router } from "express";
import { inviteController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

router.get('/', authMiddleware, inviteController.getAllInvite);
router.get('/search', authMiddleware, inviteController.search);
router.get('/:id', authMiddleware, inviteController.getDetailInvite);

router.post('/', authMiddleware, inviteController.createInvite);
router.put('/:id', authMiddleware, inviteController.updateInvite);
router.delete('/:id', authMiddleware, inviteController.deleteInvite);

export default router;
