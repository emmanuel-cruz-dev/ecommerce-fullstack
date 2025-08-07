import { v4 as uuid } from "uuid";
import cartRepository from "../data/cart.repository";
import { Cart, CartItem } from "@domain/src/entities/Cart";

const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<Cart> => {
  let cart = await cartRepository.findCartByUserId(userId);

  if (!cart) {
    cart = {
      id: uuid(),
      userId: userId,
      items: [],
    };
  }

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const newItem: CartItem = {
      productId: productId,
      quantity: quantity,
    };
    cart.items.push(newItem);
  }

  return await cartRepository.saveCart(cart);
};

const getCartByUserId = async (userId: string): Promise<Cart | null> => {
  return cartRepository.findCartByUserId(userId);
};

const removeFromCart = async (
  userId: string,
  productId: string
): Promise<Cart | null> => {
  const cart = await cartRepository.findCartByUserId(userId);
  if (!cart) {
    return null;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId === productId
  );
  if (itemIndex === -1) {
    return cart;
  }

  cart.items.splice(itemIndex, 1);
  await cartRepository.saveCart(cart);
  return cart;
};

const clearCart = async (userId: string): Promise<boolean> => {
  const cart = await cartRepository.findCartByUserId(userId);
  if (!cart) {
    return false;
  }
  cart.items = [];
  await cartRepository.saveCart(cart);
  return true;
};

export default {
  addToCart,
  getCartByUserId,
  removeFromCart,
  clearCart,
};
