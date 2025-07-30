import { Product } from "@domain/src/entities/Product";
import { productsDB } from "../database/products.db";

const getAllProducts = async () => {
  return productsDB;
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

export default {
  getAllProducts,
  findById,
  save,
};
