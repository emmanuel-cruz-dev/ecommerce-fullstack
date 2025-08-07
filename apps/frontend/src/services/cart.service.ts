import api from "./api";
import type { AddToCartRequest } from "../../../backend/src/types/types";

export const addToCart = async (request: AddToCartRequest, token: string) => {
  const response = await api.post(`/cart`, request, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCart = async (token: string) => {
  const response = await api.get(`/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.payload;
};
