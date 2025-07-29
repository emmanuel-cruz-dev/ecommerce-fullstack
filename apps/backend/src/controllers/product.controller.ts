import { Request, Response } from "express";
import { handleError } from "src/errors/error";
import productService from "src/services/product.service";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ ok: true, payload: products });
  } catch (error) {
    return handleError(res, error);
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
  } catch (error) {
    return handleError(res, error);
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await productService.createProduct(req.body);

    res.status(201).json({ ok: true, payload: newProduct });
  } catch (error) {
    return handleError(res, error);
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.productId;

  try {
    const updatedProduct = await productService.updateProduct(id, req.body);

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ ok: false, error: `Producto con ID '${id}' no encontrado` });
    }

    res.status(200).json({ ok: true, payload: updatedProduct });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.productId;

  try {
    const deletedProduct = await productService.deleteProduct(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ ok: false, error: `Producto con ID '${id}' no encontrado` });
    }

    res.status(200).json({ ok: true, payload: deletedProduct });
  } catch (error) {
    return handleError(res, error);
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
