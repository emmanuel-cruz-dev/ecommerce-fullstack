import { Cart } from "@domain/src/entities/Cart";
import { cartsDB } from "../database/cart.db";

const findCartByUserId = async (userId: string): Promise<Cart | null> => {
  return cartsDB.find((cart) => cart.userId === userId) || null;
};

const saveCart = async (cart: Cart): Promise<Cart> => {
  const existingIndex = cartsDB.findIndex((c) => c.id === cart.id);
  if (existingIndex !== -1) {
    cartsDB[existingIndex] = cart;
  } else {
    cartsDB.push(cart);
  }
  return cart;
};

const clearCart = async (userId: string): Promise<boolean> => {
  const index = cartsDB.findIndex((cart) => cart.userId === userId);
  if (index !== -1) {
    cartsDB.splice(index, 1);
    return true;
  }
  return false;
};

const removeCartItem = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  const cart = await findCartByUserId(userId);
  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      await saveCart(cart);
      return true;
    }
  }
  return false;
};

export default {
  findCartByUserId,
  saveCart,
  clearCart,
  removeCartItem,
};
