import { Cart } from "@domain/src/entities/Cart";
import { CartRepository } from "@domain/src/repositories/cart-repository";

const carts: Cart[] = [];

export const cartRepository: CartRepository = {
  carts: carts,

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
