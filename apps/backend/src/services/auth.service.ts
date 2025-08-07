import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../data/user.repository";
import { User } from "@domain/src/entities/User";
import { AuthPayload, RefreshPayload } from "src/types/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret-key";

const generateAuthToken = (user: User): string => {
  const payload: AuthPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId: string): string => {
  const payload: RefreshPayload = { id: userId };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

const signUp = async (
  userData: Omit<User, "id">
): Promise<{ accessToken: string; refreshToken: string }> => {
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new Error("El correo electrónico ya está registrado.");
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser: User = {
    ...userData,
    id: "",
    password: hashedPassword,
    role: userData.role || "user",
  };
  const savedUser = await userRepository.save(newUser);
  const accessToken = generateAuthToken(savedUser);
  const refreshToken = generateRefreshToken(savedUser.id);
  return { accessToken, refreshToken };
};

const signIn = async (
  email: string,
  passwordFromRequest: string
): Promise<{ accessToken: string; refreshToken: string }> => {
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
  const accessToken = generateAuthToken(user);
  const refreshToken = generateRefreshToken(user.id);
  return { accessToken, refreshToken };
};

const refreshToken = async (
  token: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }
    const newAccessToken = generateAuthToken(user);
    const newRefreshToken = generateRefreshToken(user.id);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error("Refresh token inválido o expirado.");
  }
};

const getUserById = async (id: string): Promise<User | null> => {
  return userRepository.findById(id);
};

export default {
  signUp,
  signIn,
  generateAuthToken,
  refreshToken,
  getUserById,
};
