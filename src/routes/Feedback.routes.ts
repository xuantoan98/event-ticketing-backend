import { Router } from "express";
import { feedbackController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { createFeedbackValidator, updateFeedbackValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, feedbackController.getFeedbacks);
router.get('/:id', authMiddleware, feedbackController.getFeedback);

router.post('/', authMiddleware, createFeedbackValidator, feedbackController.createFeedback);
router.put('/:id', authMiddleware, updateFeedbackValidator, feedbackController.updateFeedback);
router.delete('/:id', authMiddleware, feedbackController.deleteFeedback);

export default router;
