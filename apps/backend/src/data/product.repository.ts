import productDB from "../database/products.db.json";

const getAllProducts = async () => {
  return productDB;
};

const findById = async (id: string) => {
  return productDB.find((product) => product.id === id) || null;
};

export default {
  getAllProducts,
  findById,
};
