import { Cart } from "../entities/Cart";

export interface CartRepository {
  findCartByUserId(userId: string): Cart | undefined;
  saveCart(cart: Cart): void;
  clearCart(userId: string): boolean;
  removeCartItem(userId: string, productId: string): boolean;
}
