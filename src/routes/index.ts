import { Router } from "express";
import userRouter from "./User.routes";
import authRouter from "./Auth.routes";
import departmentRouter from "./Department.routes";
import eventRouter from "./Event.route";
import eventCategoriesRouter from "./EventCategories.routes";
import inviteRouter from "./Invite.routes";
import eventInviteRouter from "./EventInvite.routes";
import eventSupportRouter from "./EventSupport.routes";
import eventDetailRouter from "./EventDetail.routes";
import eventCostRouter from "./EventCost.routes";
import feedbackRouter from "./Feedback.routes";
import sendMailRouter from "./SendMail.routes";
import uploadFileRouter from "./UploadFile.routes";

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/departments', departmentRouter);
router.use('/events', eventRouter);
router.use('/event-categories', eventCategoriesRouter);
router.use('/invite', inviteRouter);
router.use('/event-invite', eventInviteRouter);
router.use('/event-support', eventSupportRouter);
router.use('/event-detail', eventDetailRouter);
router.use('/event-cost', eventCostRouter);
router.use('/feedback', feedbackRouter);
router.use('/sendmail', sendMailRouter);
router.use('/upload-file', uploadFileRouter);

export default router;
