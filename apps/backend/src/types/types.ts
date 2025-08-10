import type { Request } from "express";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface RefreshPayload {
  id: string;
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
