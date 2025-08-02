import { describe, beforeEach, test, vi, expect } from "vitest";
import authService from "./auth.service";
import userRepository from "../data/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@domain/src/entities/User";

vi.mock("../data/user.repository.ts");
vi.mock("bcryptjs");
vi.mock("jsonwebtoken");

describe("Auth Service", () => {
  const mockUser: User = {
    id: "user123",
    email: "test@example.com",
    username: "testuser",
    password: "Password123!",
    role: "user",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signUp", () => {
    test("should throw an error if the email is already registered", async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);
      const userData = { ...mockUser, id: undefined! };

      await expect(authService.signUp(userData)).rejects.toThrow(
        "El correo electrónico ya está registrado."
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    test("should create a new user and return a token", async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash as any).mockResolvedValue("hashedPassword123");
      vi.mocked(userRepository.save).mockResolvedValue(mockUser);
      vi.mocked(jwt.sign as any).mockReturnValue("mock-token-123");

      const userData = { ...mockUser, id: undefined! };
      const token = await authService.signUp(userData);

      expect(token).toBe("mock-token-123");
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUser,
          id: "",
          password: "hashedPassword123",
          role: "user",
        })
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        expect.any(String),
        { expiresIn: "1h" }
      );
    });
  });

  describe("signIn", () => {
    test("should return a token for valid credentials", async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare as any).mockResolvedValue(true);
      vi.mocked(jwt.sign as any).mockReturnValue("mock-token-456");

      const token = await authService.signIn(mockUser.email, "Password123!");

      expect(token).toBe("mock-token-456");
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "Password123!",
        mockUser.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        expect.any(String),
        { expiresIn: "1h" }
      );
    });

    test("should throw an error for an incorrect email", async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(
        authService.signIn("wrong@example.com", "Password123!")
      ).rejects.toThrow("Correo electrónico o contraseña incorrectos.");
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "wrong@example.com"
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test("should throw an error for an incorrect password", async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare as any).mockResolvedValue(false);

      await expect(
        authService.signIn(mockUser.email, "wrongpassword")
      ).rejects.toThrow("Correo electrónico o contraseña incorrectos.");
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        mockUser.password
      );
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
