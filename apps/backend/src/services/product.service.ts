import { Product } from "@domain/src/entities/Product";
import productRepository from "../data/product.repository";

const getAllProducts = async () => {
  return await productRepository.getAllProducts();
};

const getProductById = async (productId: string) => {
  return await productRepository.findById(productId);
};

const createProduct = async (product: Product) => {
  return await productRepository.save(product);
};

// const updateProduct = async (productId: string, body) => {
//   return body;
// };

const deleteProduct = async (productId: string) => {
  return await productRepository.deleteById(productId);
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  //updateProduct,
  deleteProduct,
};
