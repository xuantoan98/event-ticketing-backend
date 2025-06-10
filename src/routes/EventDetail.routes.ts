import { Router } from "express";
import { eventDetailController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

router.get('/', authMiddleware, eventDetailController.getEventDetails);
router.get('/:id', authMiddleware, eventDetailController.getEventDetail);

router.post('/', authMiddleware, eventDetailController.createEventDetail);
router.put('/:id', authMiddleware, eventDetailController.updateEventDetail);
router.delete('/:id', authMiddleware, eventDetailController.deleteEventDetail);

export default router;
