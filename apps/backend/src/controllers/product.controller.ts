import { Request, Response } from "express";
import { HttpError } from "src/errors/error";
import productService from "src/services/product.service";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ ok: true, payload: products });
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ ok: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ ok: false, message: "Error interno del servidor" });
    }
  }
};

const getProductById = async (req: Request, res: Response) => {
  const id = req.params.productId;

  try {
    const product = await productService.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ ok: false, message: `Producto con ID '${id}' no encontrado` });
    }

    res.status(200).json({ ok: true, payload: product });
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ ok: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ ok: false, message: "Error interno del servidor" });
    }
  }
};

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
