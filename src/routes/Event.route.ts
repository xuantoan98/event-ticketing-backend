import { Router } from "express";
import { eventController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { eventCreateValidator, updateEventValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, eventController.getAllEvents);
// router.get('/search', authMiddleware, searchEventValidator, eventController.searchEvents);
router.get('/:id', authMiddleware, eventController.getEventById);

router.post('/', authMiddleware, eventCreateValidator, eventController.createEvent);
router.put('/:id', authMiddleware, updateEventValidator, eventController.updateEvent);

router.get('/event-by-categories', authMiddleware, eventController.getEventCategories);
router.patch('/:id/cancel', authMiddleware, eventController.cancellEvent);

export default router;
