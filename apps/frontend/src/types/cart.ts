import type { Product } from "@domain/entities/Product";

export interface CombinedCartItem extends Product {
  quantity: number;
}
