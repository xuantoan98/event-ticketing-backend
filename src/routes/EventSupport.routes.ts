import { Router } from "express";
import { eventSupportController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { createEventSupportValidator, updateEventSupportValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, eventSupportController.getEventSupports);
router.get('/:id', authMiddleware, eventSupportController.getEventSupport);

router.post('/', authMiddleware, createEventSupportValidator, eventSupportController.createEventSupport);
router.put('/:id', authMiddleware, updateEventSupportValidator, eventSupportController.updateEventSupport);
router.delete('/:id', authMiddleware, eventSupportController.deleteEventSupport);

export default router;
