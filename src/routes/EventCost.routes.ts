import { Router } from "express";
import { eventCostController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { createEventCostValidator, updateEventCostValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, eventCostController.getEventCosts);
router.get('/:id', authMiddleware, eventCostController.getEventCosts);

router.post('/', authMiddleware, createEventCostValidator, eventCostController.createEventCost);
router.put('/:id', authMiddleware, updateEventCostValidator, eventCostController.updateEventCost);
router.delete('/:id', authMiddleware, eventCostController.deleteEventCost);

export default router;
