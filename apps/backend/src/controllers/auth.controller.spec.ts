import request from "supertest";
import { describe, test, vi } from "vitest";
import app from "../app";
import authService from "../services/auth.service";
import { User } from "@domain/src/entities/User";
import { UserLoginError } from "@domain/src/use-cases/user-login";

vi.mock("../services/auth.service");

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser: User = {
    id: "user123",
    username: "testuser",
    email: "test@example.com",
    password: "hashed_password",
    role: "user",
  };

  const mockLoginResponse = {
    user: { ...mockUser, password: undefined },
    token: "mocked-jwt-token",
  };

  describe("POST /api/auth/register", () => {
    const newUserInput = {
      username: "newuser",
      email: "new@example.com",
      password: "securepassword",
      role: "user",
    };

    test("should return 201 and the registered user (without password)", async () => {
      // @ts-ignore
      authService.registerUser.mockResolvedValue({
        ...mockUser,
        id: "newId",
        ...newUserInput,
        password: "hashed_password",
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send(newUserInput);

      expect(res.statusCode).toEqual(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload).toEqual(
        expect.objectContaining({
          id: "newId",
          username: newUserInput.username,
          email: newUserInput.email,
          role: newUserInput.role,
        })
      );
      expect(res.body.payload).not.toHaveProperty("password");
      expect(authService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining(newUserInput)
      );
    });

    test("should return 500 if registration fails (e.g., email in use)", async () => {
      // @ts-ignore
      authService.registerUser.mockRejectedValue(
        new Error("Email is already in use")
      );

      const res = await request(app)
        .post("/api/auth/register")
        .send(newUserInput);

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });

    test("should return 500 if validation fails", async () => {
      const invalidInput = {
        username: "newuser",
        email: "",
        password: "securepassword",
        role: "user",
      };
      // @ts-ignore
      authService.registerUser.mockRejectedValue(
        new Error("Email is required")
      );

      const res = await request(app)
        .post("/api/auth/register")
        .send(invalidInput);

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });

  describe("POST /api/auth/login", () => {
    const loginCredentials = {
      email: "test@example.com",
      password: "securepassword",
    };

    test("should return 200 and a token on successful login", async () => {
      // @ts-ignore
      authService.loginUser.mockResolvedValue(mockLoginResponse);

      const res = await request(app)
        .post("/api/auth/login")
        .send(loginCredentials);

      expect(res.statusCode).toEqual(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload.token).toBe("mocked-jwt-token");
      expect(res.body.payload.user).toEqual(mockLoginResponse.user);
      expect(res.body.payload.user).not.toHaveProperty("password");
      expect(authService.loginUser).toHaveBeenCalledWith(
        loginCredentials.email,
        loginCredentials.password
      );
    });

    test("should return 401 for invalid credentials", async () => {
      // @ts-ignore
      authService.loginUser.mockRejectedValue(
        new UserLoginError("Invalid credentials")
      );

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrong@example.com", password: "wrong" });

      expect(res.statusCode).toEqual(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Invalid credentials");
      expect(authService.loginUser).toHaveBeenCalled();
    });

    test("should return 500 if an unexpected error occurs during login", async () => {
      // @ts-ignore
      authService.loginUser.mockRejectedValue(
        new Error("Database connection failed")
      );

      const res = await request(app)
        .post("/api/auth/login")
        .send(loginCredentials);

      expect(res.statusCode).toEqual(500);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe("Error interno del servidor");
    });
  });
});
