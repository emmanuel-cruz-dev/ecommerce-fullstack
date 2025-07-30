import productRepository from "../data/product.repository";

const getAllProducts = async () => {
  return await productRepository.getAllProducts();
};

const getProductById = async (productId: string) => {
  return productId;
};

const createProduct = async (product: string) => {};

// const updateProduct = async (productId: string, body) => {
//   return body;
// };

const deleteProduct = async (productId: string) => {
  return productId;
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  //updateProduct,
  deleteProduct,
};
