import { Cart } from "../entities/Cart";
import { CartRepository } from "../repositories/cart-repository";

export interface MockedCartRepository extends CartRepository {
  carts: Cart[];
}

export function mockCartRepository(): MockedCartRepository {
  const carts: Cart[] = [];

  return {
    carts,
    findCartByUserId(userId: string): Cart | undefined {
      return carts.find((cart) => cart.userId === userId);
    },
    saveCart(cart: Cart): void {
      const index = carts.findIndex((c) => c.id === cart.id);
      if (index !== -1) {
        carts[index] = cart;
      } else {
        carts.push(cart);
      }
    },
  };
}
