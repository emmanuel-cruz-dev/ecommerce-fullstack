import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../data/user.repository";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ ok: false, message: "No authentication token provided" });
    }

    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await userRepository.findById(payload.id);

    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Authentication failed" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ ok: false, message: "Authentication failed" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        message: "You are not authorized to perform this action",
      });
    }
    next();
  };
};
