import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../data/user.repository";
import { User } from "@domain/src/entities/User";
import { AuthPayload } from "src/types/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateAuthToken = (user: User): string => {
  const payload: AuthPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

const signUp = async (userData: Omit<User, "id">): Promise<string> => {
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new Error("El correo electrónico ya está registrado.");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser: User = {
    ...userData,
    id: "",
    password: hashedPassword,
    role: "user",
  };

  const savedUser = await userRepository.save(newUser);
  return generateAuthToken(savedUser);
};

const signIn = async (
  email: string,
  passwordFromRequest: string
): Promise<string> => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Correo electrónico o contraseña incorrectos.");
  }

  const isPasswordValid = await bcrypt.compare(
    passwordFromRequest,
    user.password
  );
  if (!isPasswordValid) {
    throw new Error("Correo electrónico o contraseña incorrectos.");
  }

  return generateAuthToken(user);
};

export default {
  signUp,
  signIn,
  generateAuthToken,
};
