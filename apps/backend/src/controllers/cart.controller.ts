import { Request, Response } from "express";
import { AuthenticatedRequest } from "@domain/src/ports/auth-types";
import cartService from "../services/cart.service";

const addToCart = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      ok: false,
      message: "Faltan campos obligatorios: productId, quantity",
    });
  }

  try {
    const updatedCart = await cartService.addToCart(
      userId,
      productId,
      quantity
    );
    return res.status(200).json({ ok: true, payload: updatedCart });
  } catch (error) {
    return res
      .status(400)
      .json({ ok: false, message: (error as Error).message });
  }
};

const getCart = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user.id;
  try {
    const cart = await cartService.getCartByUserId(userId);
    return res.status(200).json({ ok: true, payload: cart });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({ ok: false, message: errorMessage });
  }
};

const removeFromCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { productId } = req.params;
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    const updatedCart = await cartService.removeFromCart(userId, productId);

    if (!updatedCart) {
      return res.status(404).json({
        ok: false,
        message: "El carrito del usuario no se encontró",
      });
    }

    return res.status(200).json({ ok: true, payload: updatedCart });
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

export default { addToCart, getCart, removeFromCart, clearCart };
