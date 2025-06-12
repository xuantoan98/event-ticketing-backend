import { Router } from "express";
import { eventCategoriesController } from "../controllers";
import { eventCategoriesValidator } from "../validators/EventCategories.validator";
import { authMiddleware } from "../middlewares";

const router = Router();

router.get('/', authMiddleware, eventCategoriesController.getAllEventCategories);
// router.get('/search', authMiddleware, eventCategoriesValidator('search'), eventCategoriesController.search);
router.get('/:id', eventCategoriesController.getDetailEventCategories);

router.post('/', authMiddleware, eventCategoriesValidator('create'), eventCategoriesController.createEventCategories);
router.put('/:id', authMiddleware, eventCategoriesValidator('update'), eventCategoriesController.updateEventCategories);
router.delete('/:id', authMiddleware, eventCategoriesController.deleteEventCategories);

export default router;
