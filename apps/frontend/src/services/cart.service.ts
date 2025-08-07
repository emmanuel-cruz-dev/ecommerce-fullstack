import api from "./api";
import type { AddToCartRequest } from "../../../backend/src/types/types";

const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

export const addToCart = async (request: AddToCartRequest) => {
  const response = await api.post(`/cart`, request, {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  });
  return response.data;
};

export const getCart = async () => {
  const response = await api.get(`/cart`, {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  });
  return response.data.payload;
};
