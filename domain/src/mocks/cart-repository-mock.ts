import { CartProps } from "../entities/Cart";
import { CartRepository } from "../repositories/cart-repository";

export interface MockedCartRepository extends CartRepository {
  carts: CartProps[];
}

export function mockCartRepository(): MockedCartRepository {
  const carts: CartProps[] = [];

  return {
    carts,
    findCartByUserId(userId: string): CartProps | undefined {
      return carts.find((cart) => cart.userId === userId);
    },
    saveCart(cart: CartProps): void {
      const index = carts.findIndex((c) => c.id === cart.id);
      if (index !== -1) {
        carts[index] = cart;
      } else {
        carts.push(cart);
      }
    },
  };
}
