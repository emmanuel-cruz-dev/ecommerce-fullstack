import { Router } from "express";
import productController from "../controllers/product.controller";

const router = Router();

router
  .get("/", productController.getAllProducts)
  .get("/:productId", productController.getProductById)
  .post("/", productController.createProduct)
  //.put("/:productId", productController.updateProduct)
  .delete("/:productId", productController.deleteProduct);

export default router;
