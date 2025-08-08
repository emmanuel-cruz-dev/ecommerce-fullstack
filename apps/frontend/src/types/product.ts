import type { Product } from "@domain/entities/Product";

export interface ProductCardProps {
  product: Product;
}

export interface ProductContainerProps {
  products: Product[];
}
