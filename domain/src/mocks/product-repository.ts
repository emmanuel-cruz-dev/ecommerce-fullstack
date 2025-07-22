import { ProductProps } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export function mockProductRepository(): ProductRepository {
  const products: ProductProps[] = [];

  return {
    save(product: ProductProps): void {
      products.push(product);
    },
    findById(id: string): ProductProps | undefined {
      return products.find((product) => product.id === id);
    },
  };
}
