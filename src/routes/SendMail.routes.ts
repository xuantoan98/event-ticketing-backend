import { Router } from "express";
import { sendMailController } from "../controllers";

const router = Router();

router.post('/', sendMailController.sendMail);

export default router;
