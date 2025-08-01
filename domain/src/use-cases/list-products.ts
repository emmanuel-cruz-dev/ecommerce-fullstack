import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export async function listProducts(
  repository: ProductRepository
): Promise<Product[]> {
  return repository.findAll();
}
