import { CartItem } from "@domain/src/entities/Cart";
import cartRepository from "../data/cart.repository";
import { v4 as uuid } from "uuid";
import { AddToCartRequest } from "src/types/types";

const getCartContent = async (userId: string) => {
  return await cartRepository.findCartByUserId(userId);
};

const addToCart = async (request: AddToCartRequest) => {
  const { userId, productId, quantity } = request;
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

const clearCart = async (userId: string) => {
  return await cartRepository.clearCart(userId);
};

const removeFromCart = async (userId: string, productId: string) => {
  return await cartRepository.removeCartItem(userId, productId);
};

export default {
  getCartContent,
  addToCart,
  clearCart,
  removeFromCart,
};
