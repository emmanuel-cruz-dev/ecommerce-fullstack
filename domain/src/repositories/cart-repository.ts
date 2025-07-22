import { CartProps } from "../entities/Cart";

export interface CartRepository {
  findById(cartId: string): Promise<CartProps | null>;
  findByUserId(userId: string): Promise<CartProps | null>;
  save(cart: CartProps): Promise<CartProps>;
  delete(cartId: string): Promise<void>;
}
