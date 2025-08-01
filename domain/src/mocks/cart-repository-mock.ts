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
    clearCart(userId: string): boolean {
      const index = carts.findIndex((cart) => cart.userId === userId);
      if (index !== -1) {
        carts.splice(index, 1);
        return true;
      }
      return false;
    },

    removeCartItem(userId: string, productId: string): boolean {
      const cart = carts.find((c) => c.userId === userId);
      if (cart) {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId === productId
        );
        if (itemIndex !== -1) {
          cart.items.splice(itemIndex, 1);
          return true;
        }
      }
      return false;
    },
  };
}
