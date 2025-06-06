import { Router } from "express";
import userRouter from "./User.routes";
import authRouter from "./Auth.routes";
import departmentRouter from "./Department.routes";
import eventRouter from "./Event.route";
import eventCategoriesRouter from "./EventCategories.routes";

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/departments', departmentRouter);
router.use('/events', eventRouter);
router.use('/event-catogories', eventCategoriesRouter);

export default router;
