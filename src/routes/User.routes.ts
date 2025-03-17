import { Router } from "express";
import { register } from "../controllers/User.controller";
import { validate } from "../validators/User.validator";

const router = Router();

// Public routes
router.post('/register', validate('register'), register);

export default router;
