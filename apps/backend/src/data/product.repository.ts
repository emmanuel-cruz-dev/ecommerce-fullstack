import productDB from "../database/products.db.json";

const getAllProducts = async () => {
  return productDB;
};

export default {
  getAllProducts,
};
