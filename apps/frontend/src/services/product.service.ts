import api from "./api";
import type { Product } from "@domain/entities/Product";

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  return response.data.payload;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const response = await api.get(`/products/${id}`);
  return response.data.payload;
};

export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) return [];
  const response = await api.get(`/products?ids=${ids.join(",")}`);
  return response.data.payload;
};
