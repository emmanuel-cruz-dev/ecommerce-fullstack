import { ProductProps } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export function CreateProduct(
  productData: ProductProps,
  repository: ProductRepository
): ProductProps {
  repository.save(productData);
  return productData;
}
