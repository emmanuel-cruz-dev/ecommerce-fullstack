import { ProductRepository } from "../repositories/product-repository";

export async function deleteProduct(
  id: string,
  repository: ProductRepository
): Promise<boolean> {
  return repository.delete(id);
}
