import { Request, Response, NextFunction } from "express";
import { ITokenService } from "@domain/src/ports/token-service";
import { UserRole } from "@domain/src/entities/User";
import { JwtTokenService } from "@domain/src/infrastructure/security/jwt-token-service";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        role: UserRole;
      };
    }
  }
}

const tokenService: ITokenService = new JwtTokenService(
  process.env.JWT_SECRET || "default-secret-for-dev"
);

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ ok: false, message: "No authentication token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decodedUser = tokenService.verifyToken(token);

  if (!decodedUser) {
    return res
      .status(403)
      .json({ ok: false, message: "Invalid or expired token" });
  }

  req.user = decodedUser;
  next();
};

export const authorize = (requiredRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ ok: false, message: "Authentication required" });
    }

    if (!requiredRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ ok: false, message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
