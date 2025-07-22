import { UserProps } from "../entities/User";

function validateData(email: string, password: string, username: string): void {
  if (email.trim() === "") {
    throw new Error("Email is required");
  }
  if (password.trim() === "") {
    throw new Error("Password is required");
  }
  if (username.trim() === "") {
    throw new Error("Username is required");
  }
}

export function UserRegister(user: UserProps): UserProps {
  validateData(user.email, user.password, user.username);

  return user;
}
