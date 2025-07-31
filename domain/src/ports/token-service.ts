import { User } from "../entities/User";

export interface ITokenService {
  generateToken(user: User): string;
  verifyToken(token: string): User | null;
}
