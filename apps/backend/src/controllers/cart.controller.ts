import { Request, Response } from "express";
import { AddToCart } from "@domain/src/use-cases/add-to-cart";
import { AuthenticatedRequest } from "@domain/src/ports/auth-types";
import { cartRepository } from "../data/cart.repository";

export default {
  async addToCart(req: Request, res: Response): Promise<Response> {
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

      const updatedCart = await AddToCart(request, cartRepository);
      return res.status(200).json({ ok: true, payload: updatedCart });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("is required") ||
          error.message.includes("must be greater")
        ) {
          return res.status(400).json({ ok: false, message: error.message });
        }
        return res
          .status(500)
          .json({ ok: false, message: "Error interno del servidor" });
      }
      return res
        .status(500)
        .json({ ok: false, message: "Error interno del servidor" });
    }
  },
};
