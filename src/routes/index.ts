import { Router } from "express";
import userRouter from "./User.routes";
import authRouter from "./auth.routes";

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
