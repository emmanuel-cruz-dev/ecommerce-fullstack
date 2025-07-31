import { UserRole } from "../entities/User";

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}
