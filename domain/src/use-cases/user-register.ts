import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";
import { IPasswordHasher } from "../ports/password-hasher";

export async function UserRegister(
  user: User,
  userRepository: UserRepository,
  passwordHasher: IPasswordHasher
): Promise<User> {
  if (!user.id) {
    user.id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  validateUserData(user.email, user.password, user.username);

  const existingUser = await userRepository.findByEmail(user.email);
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const hashedPassword = await passwordHasher.hash(user.password);
  const newUser = { ...user, password: hashedPassword };

  return await userRepository.save(newUser);
}

function validateUserData(
  email: string,
  password: string,
  username: string
): void {
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
