import { Router } from "express";
import userRouter from "./User.routes";
import authRouter from "./Auth.routes";
import departmentRouter from "./Department.routes";

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/departments', departmentRouter);

export default router;
