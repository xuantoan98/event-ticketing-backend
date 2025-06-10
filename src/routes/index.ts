import { Router } from "express";
import userRouter from "./User.routes";
import authRouter from "./Auth.routes";
import departmentRouter from "./Department.routes";
import eventRouter from "./Event.route";
import eventCategoriesRouter from "./EventCategories.routes";
import inviteRouter from "./Invite.routes";
import eventInviteRouter from "./EventInvite.routes";
import eventSupportRouter from "./EventSupport.routes";

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/departments', departmentRouter);
router.use('/events', eventRouter);
router.use('/event-catogories', eventCategoriesRouter);
router.use('/invite', inviteRouter);
router.use('/event-invite', eventInviteRouter);
router.use('/event-support', eventSupportRouter);

export default router;
