import { Router } from "express";
import { uploadFileController } from "../controllers";

const router = Router();

router.post('/', uploadFileController.uploadFile);

export default router;
