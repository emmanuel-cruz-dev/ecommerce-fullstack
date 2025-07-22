import { CartProps } from "../entities/Cart";

export interface CartRepository {
  carts: CartProps[];
  findCartByUserId(userId: string): CartProps | undefined;
  saveCart(cart: CartProps): void;
}
