type UserRole = "admin" | "user";

export interface UserProps {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}
