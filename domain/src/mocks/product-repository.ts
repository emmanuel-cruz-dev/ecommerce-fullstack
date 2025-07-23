import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export function mockProductRepository(): ProductRepository {
  const products: Product[] = [];

  return {
    save(product: Product): void {
      products.push(product);
    },
    findById(id: string): Product | undefined {
      return products.find((product) => product.id === id);
    },
  };
}
