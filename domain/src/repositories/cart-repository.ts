import { Cart } from "../entities/Cart";

export interface CartRepository {
  carts: Cart[];
  findCartByUserId(userId: string): Cart | undefined;
  saveCart(cart: Cart): void;
}
