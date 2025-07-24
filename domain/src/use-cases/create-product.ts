import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export function CreateProduct(
  productData: Product,
  repository: ProductRepository
): Product {
  validateFields(
    productData.name,
    productData.description,
    productData.price,
    productData.stock
  );

  repository.save(productData);

  return productData;
}

function validateFields(
  name: string,
  description: string,
  price: number,
  stock: number
): void {
  if (!name || name.trim() === "") {
    throw new Error("Name is required");
  }
  if (!description || description.trim() === "") {
    throw new Error("Description is required");
  }
  if (price <= 0) {
    throw new Error("Price must be greater than 0");
  }
  if (stock < 0) {
    throw new Error("Stock cannot be 0 or negative");
  }
}
