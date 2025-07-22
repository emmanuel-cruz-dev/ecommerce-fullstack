import { ProductProps } from "../entities/Product";

export interface ProductRepository {
  save(product: ProductProps): void;
  findById(id: string): ProductProps | undefined;
}
