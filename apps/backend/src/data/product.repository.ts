import { v4 as uuid } from "uuid";
import { Product } from "@domain/src/entities/Product";
import { productsDB } from "../database/products.db";

const getAllProducts = async () => {
  return [...productsDB];
};

const findById = async (id: string) => {
  return productsDB.find((product) => product.id === id) || null;
};

const save = async (product: Product) => {
  const existingIndex = productsDB.findIndex((prod) => prod.id === product.id);

  if (existingIndex >= 0) {
    productsDB[existingIndex] = product;
  } else {
    const newProduct = { ...product, id: "prod-004" };
    productsDB.push(newProduct);
    return newProduct;
  }
  return product;
};

const updateById = async (
  id: string,
  updates: Partial<Omit<Product, "id" | "createdAt">>
): Promise<Product | null> => {
  const existingIndex = productsDB.findIndex((prod) => prod.id === id);

  if (existingIndex === -1) {
    return null;
  }

  const updatedProduct: Product = {
    ...productsDB[existingIndex],
    ...updates,
    updatedAt: new Date(),
  };

  productsDB[existingIndex] = updatedProduct;
  return updatedProduct;
};

const deleteById = async (id: string) => {
  const indexToDelete = productsDB.findIndex((prod) => prod.id === id);

  if (indexToDelete !== -1) {
    productsDB.splice(indexToDelete, 1);
    return true;
  }

  return false;
};

export default {
  getAllProducts,
  findById,
  save,
  updateById,
  deleteById,
};
