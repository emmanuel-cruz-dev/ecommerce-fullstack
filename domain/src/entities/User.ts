export type UserRole = "admin" | "user";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}
