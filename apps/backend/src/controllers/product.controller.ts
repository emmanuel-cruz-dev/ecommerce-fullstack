import { Request, Response } from "express";

const getAllProducts = (req: Request, res: Response) => {};
const getProductById = (req: Request, res: Response) => {};
const createProduct = (req: Request, res: Response) => {};
const updateProduct = (req: Request, res: Response) => {};
const deleteProduct = (req: Request, res: Response) => {};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
