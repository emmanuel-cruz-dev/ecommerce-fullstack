import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";
import { IPasswordHasher } from "../ports/password-hasher";

export class UserLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserLoginError";
  }
}

export async function UserLogin(
  email: string,
  password: string,
  userRepository: UserRepository,
  passwordHasher: IPasswordHasher
): Promise<User> {
  if (email.trim() === "" || password.trim() === "") {
    throw new UserLoginError("Email and password are required");
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UserLoginError("Invalid credentials");
  }

  const isPasswordValid = await passwordHasher.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UserLoginError("Invalid credentials");
  }

  return user;
}
