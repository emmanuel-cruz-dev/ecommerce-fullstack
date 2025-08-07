import { Router } from "express";
import authController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/me", authenticate, authController.getMe);
router.post("/refresh", authController.refresh);

export default router;
