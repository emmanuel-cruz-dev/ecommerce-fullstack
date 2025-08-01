import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.signUp);
router.post("/login", authController.signIn);

export default router;
