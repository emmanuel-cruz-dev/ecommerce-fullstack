import { User } from "@domain/src/entities/User";
import { UserRepository } from "@domain/src/repositories/user-repository";
import { IPasswordHasher } from "@domain/src/ports/password-hasher";
import { ITokenService } from "@domain/src/ports/token-service";
import { UserRegister } from "@domain/src/use-cases/user-register";
import { UserLogin } from "@domain/src/use-cases/user-login";
import { mockUserRepository } from "@domain/src/mocks/user-repository-mock";
import { BcryptPasswordHasher } from "@domain/src/infrastructure/security/bcrypt-password-hasher";
import { JwtTokenService } from "@domain/src/infrastructure/security/jwt-token-service";

const inMemoryUsers: User[] = [];
const userRepository: UserRepository = mockUserRepository(inMemoryUsers);
const passwordHasher: IPasswordHasher = new BcryptPasswordHasher();

const jwtSecret = process.env.JWT_SECRET || "your_super_secret_jwt_key";
const tokenService: ITokenService = new JwtTokenService(jwtSecret);

const registerUser = async (userData: User): Promise<User> => {
  return await UserRegister(userData, userRepository, passwordHasher);
};

const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const user = await UserLogin(email, password, userRepository, passwordHasher);

  const token = tokenService.generateToken(user);

  return { user, token };
};

export default {
  registerUser,
  loginUser,
};
