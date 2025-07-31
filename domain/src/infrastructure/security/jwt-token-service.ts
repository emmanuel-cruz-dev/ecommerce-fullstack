import jwt from "jsonwebtoken";
import { User } from "../../entities/User";
import { ITokenService } from "../../ports/token-service";

export class JwtTokenService implements ITokenService {
  private readonly secretKey: string;
  private readonly expiresIn: string = "1h";

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error("JWT Secret Key is required");
    }
    this.secretKey = secretKey;
  }

  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): User | null {
    try {
      const decoded = jwt.verify(token, this.secretKey) as jwt.JwtPayload;

      return {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        password: "",
        role: decoded.role,
      };
    } catch (error) {
      return null;
    }
  }
}
