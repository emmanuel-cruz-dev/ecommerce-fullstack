import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";

export async function UserRegister(
  user: User,
  userRepository: UserRepository
): Promise<User> {
  validateData(user.email, user.password, user.username);

  const existingUser = await userRepository.findByEmail(user.email);
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  return await userRepository.save(user);
}

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
