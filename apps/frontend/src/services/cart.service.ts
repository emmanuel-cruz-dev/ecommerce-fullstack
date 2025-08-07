import api from "./api";
import type { AddToCartRequest } from "../../../backend/src/types/types";
import type { Cart } from "@domain/entities/Cart";

export const addToCart = async (request: AddToCartRequest) => {
  const response = await api.post(`/cart`, request);
  return response.data;
};

export const getCart = async (): Promise<Cart> => {
  const response = await api.get(`/cart`);
  return response.data.payload;
};
