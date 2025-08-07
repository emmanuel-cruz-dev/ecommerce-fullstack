import { Router } from "express";
import cartController from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);
router
  .post("/", cartController.addToCart)
  .get("/", cartController.getCart)
  .delete("/", cartController.clearCart)
  .delete("/:productId", cartController.removeFromCart);

export default router;
