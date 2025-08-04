import { Request, Response } from "express";
import { AuthenticatedRequest } from "@domain/src/ports/auth-types";
import cartService from "../services/cart.service";

const addToCart = async (req: Request, res: Response): Promise<Response> => {
  const { productId, productName, productPrice, quantity } = req.body;
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    const request = {
      userId,
      productId,
      productName,
      productPrice,
      quantity,
    };
    const updatedCart = await cartService.addToCart(request);

    return res.status(200).json({ ok: true, payload: updatedCart });
  } catch (error) {
    return res
      .status(400)
      .json({ ok: false, message: (error as Error).message });
  }
};

const getCartContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    const cart = await cartService.getCartContent(userId);

    return res.status(200).json({ ok: true, payload: cart });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

const removeFromCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { productId } = req.params;
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    const success = await cartService.removeFromCart(userId, productId);

    if (!success) {
      return res.status(404).json({
        ok: false,
        message: "El producto no se encontró en el carrito",
      });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Producto eliminado del carrito" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

const clearCart = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    const success = await cartService.clearCart(userId);

    if (!success) {
      return res.status(404).json({
        ok: false,
        message: "El carrito del usuario no se encontró",
      });
    }

    return res
      .status(200)
      .json({ ok: true, message: "Carrito vaciado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export default { addToCart, getCartContent, removeFromCart, clearCart };
