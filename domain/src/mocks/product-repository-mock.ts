import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export function mockProductRepository(): ProductRepository {
  const products: Product[] = [];

  return {
    save(product: Product): Product {
      const existingIndex = products.findIndex((p) => p.id === product.id);
      if (existingIndex !== -1) {
        products[existingIndex] = product;
      } else {
        products.push(product);
      }
      return product;
    },
    findById(id: string): Product | undefined {
      return products.find((product) => product.id === id);
    },
    findAll(): Product[] {
      return products;
    },
    delete(id: string): boolean {
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        return true;
      }
      return false;
    },
  };
}
