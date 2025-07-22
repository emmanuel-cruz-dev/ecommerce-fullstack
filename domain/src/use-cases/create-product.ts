import { ProductProps } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export function CreateProduct(
  productData: ProductProps,
  repository: ProductRepository
): ProductProps {
  if (!productData.name || productData.name.trim() === "") {
    throw new Error("Name is required");
  }
  if (productData.price <= 0) {
    throw new Error("Price must be greater than 0");
  }
  if (productData.stock < 0) {
    throw new Error("Stock cannot be 0 or negative");
  }

  repository.save(productData);

  return productData;
}
