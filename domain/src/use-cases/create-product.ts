import { ProductProps } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

function validateFields(name: string, price: number, stock: number): void {
  if (!name || name.trim() === "") {
    throw new Error("Name is required");
  }
  if (price <= 0) {
    throw new Error("Price must be greater than 0");
  }
  if (stock < 0) {
    throw new Error("Stock cannot be 0 or negative");
  }
}

export function CreateProduct(
  productData: ProductProps,
  repository: ProductRepository
): ProductProps {
  validateFields(productData.name, productData.price, productData.stock);

  repository.save(productData);

  return productData;
}
