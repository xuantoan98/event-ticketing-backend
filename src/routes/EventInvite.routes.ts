import { Router } from "express";
import { eventInviteController } from "../controllers";

const router = Router();

router.get('/', eventInviteController.getEventInvites);
router.get('/:id', eventInviteController.getEventInviteById);

router.post('/', eventInviteController.createEventInvite);
router.put('/:id', eventInviteController.updateEventInvite);
router.delete('/:id', eventInviteController.deleteEventInvite);

export default router;
