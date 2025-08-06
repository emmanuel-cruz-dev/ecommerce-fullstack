import api from "./api";
import type { Product } from "@domain/entities/Product";

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products");
  return response.data.payload;
};
