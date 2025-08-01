import { Router } from "express";
import cartController from "../controllers/cart.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["user", "admin"]),
  cartController.addToCart
);

export default router;
