import { UserRole } from "@domain/src/entities/User";
import { Request } from "express";

export interface AuthPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export interface AddToCartRequest {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}
