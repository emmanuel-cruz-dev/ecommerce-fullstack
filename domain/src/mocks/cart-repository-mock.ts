import { CartProps } from "../entities/Cart";
import { CartRepository } from "../repositories/cart-repository";

export interface MockedCartRepository extends CartRepository {
  carts: CartProps[];
}

export function mockCartRepository(
  carts: CartProps[] = []
): MockedCartRepository {
  return {
    carts,
    findById: async (cartId: string): Promise<CartProps | null> => {
      const cart = carts.find((cart) => cart.id === cartId);
      const result = cart ? { ...cart, items: [...cart.items] } : null;
      return result;
    },
    findByUserId: async (userId: string): Promise<CartProps | null> => {
      const cart = carts.find((cart) => cart.userId === userId);
      const result = cart ? { ...cart, items: [...cart.items] } : null;
      return result;
    },
    save: async (cart: CartProps): Promise<CartProps> => {
      const existingCartIndex = carts.findIndex((c) => c.id === cart.id);
      const cartToSave = {
        ...cart,
        items: [...cart.items],
        updatedAt: new Date(),
      };

      if (existingCartIndex !== -1) {
        carts[existingCartIndex] = cartToSave;
      } else {
        carts.push(cartToSave);
      }
      return { ...cartToSave };
    },
    delete: async (cartId: string): Promise<void> => {
      const cartIndex = carts.findIndex((c) => c.id === cartId);
      if (cartIndex !== -1) {
        carts.splice(cartIndex, 1);
      }
    },
  };
}
