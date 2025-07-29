import { Router } from "express";
import productController from "src/controllers/product.controller";

const router = Router();

router
  .get("/", productController.getAllProducts)
  .get("/:productId", productController.getProductById)
  .post("/create", productController.createProduct)
  .put("/:productId", productController.updateProduct)
  .delete("/:productId", productController.deleteProduct);

export default router;
