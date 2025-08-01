import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}

export function updateProduct(
  id: string,
  request: UpdateProductRequest,
  repository: ProductRepository
): Product | null {
  const existingProduct = repository.findById(id);

  if (!existingProduct) {
    return null;
  }

  const updatedProduct: Product = {
    ...existingProduct,
    ...request,
    updatedAt: new Date(),
  };

  repository.save(updatedProduct);

  return updatedProduct;
}
