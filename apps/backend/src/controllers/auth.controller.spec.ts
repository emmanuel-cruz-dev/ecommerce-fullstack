import request from "supertest";
import { describe, beforeEach, test, vi, expect } from "vitest";
import app from "../app";
import { usersDB } from "../database/users.db";
import authService from "../services/auth.service";

vi.mock("../services/auth.service");

describe("Auth Controller", () => {
  const newUser = {
    email: "test@example.com",
    password: "Password123!",
    username: "testuser",
  };

  beforeEach(() => {
    usersDB.length = 0;
    vi.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    test("should register a new user and return a token", async () => {
      vi.mocked(authService.signUp).mockResolvedValue("mock-token-123");

      const res = await request(app).post("/api/auth/register").send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload.token).toBe("mock-token-123");
      expect(authService.signUp).toHaveBeenCalledWith(
        expect.objectContaining({ email: newUser.email })
      );
    });

    test("should return 409 if the email already exists", async () => {
      vi.mocked(authService.signUp).mockRejectedValue(
        new Error("El correo electrónico ya está registrado.")
      );

      const res = await request(app).post("/api/auth/register").send(newUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "El correo electrónico ya está registrado."
      );
    });

    test("should return 400 if required fields are missing", async () => {
      const incompleteUser = { email: "test@example.com" };
      const res = await request(app)
        .post("/api/auth/register")
        .send(incompleteUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Faltan campos obligatorios: email, password, username"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    test("should return a token for a valid login", async () => {
      vi.mocked(authService.signIn).mockResolvedValue("mock-token-456");

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: newUser.email, password: newUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.payload.token).toBe("mock-token-456");
      expect(authService.signIn).toHaveBeenCalledWith(
        newUser.email,
        newUser.password
      );
    });

    test("should return 401 for invalid credentials", async () => {
      vi.mocked(authService.signIn).mockRejectedValue(
        new Error("Correo electrónico o contraseña incorrectos.")
      );

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: newUser.email, password: "wrong-password" });

      expect(res.statusCode).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Correo electrónico o contraseña incorrectos."
      );
    });

    test("should return 400 if required fields are missing", async () => {
      const incompleteLogin = { email: newUser.email };
      const res = await request(app)
        .post("/api/auth/login")
        .send(incompleteLogin);

      expect(res.statusCode).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.message).toBe(
        "Faltan campos obligatorios: email, password"
      );
    });
  });
});
