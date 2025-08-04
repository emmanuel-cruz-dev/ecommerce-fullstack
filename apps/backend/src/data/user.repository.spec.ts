import { describe, beforeEach, test, vi, expect } from "vitest";
import userRepository from "./user.repository";
import { usersDB } from "../database/users.db";
import { User } from "@domain/src/entities/User";
import { v4 as uuid } from "uuid";

vi.mock("uuid", () => ({ v4: vi.fn() }));

describe("User Repository", () => {
  const mockUser: User = {
    id: "existing-user-id",
    email: "test@example.com",
    username: "testuser",
    password: "hashedPassword",
    role: "user",
  };

  beforeEach(() => {
    usersDB.length = 0;
    usersDB.push(mockUser);
    vi.clearAllMocks();
    vi.mocked(uuid as any).mockReturnValue("new-user-id");
  });

  describe("findById", () => {
    test("should return a user if a matching ID is found", async () => {
      const foundUser = await userRepository.findById(mockUser.id);
      expect(foundUser).toEqual(mockUser);
    });

    test("should return null if no user is found with the given ID", async () => {
      const foundUser = await userRepository.findById("non-existent-id");
      expect(foundUser).toBeNull();
    });
  });

  describe("findByEmail", () => {
    test("should return a user if a matching email is found", async () => {
      const foundUser = await userRepository.findByEmail(mockUser.email);
      expect(foundUser).toEqual(mockUser);
    });

    test("should return null if no user is found with the given email", async () => {
      const foundUser = await userRepository.findByEmail(
        "non-existent@example.com"
      );
      expect(foundUser).toBeNull();
    });
  });

  describe("save", () => {
    test("should save a new user and assign it a new ID", async () => {
      const newUserWithoutId: User = {
        id: "",
        email: "new@example.com",
        username: "newuser",
        password: "newHashedPassword",
        role: "user",
      };

      const savedUser = await userRepository.save(newUserWithoutId);

      expect(savedUser.id).toBe("new-user-id");
      expect(usersDB.length).toBe(2);
      expect(usersDB).toContainEqual(savedUser);
    });

    test("should update an existing user if the ID already exists", async () => {
      const updatedUser: User = {
        ...mockUser,
        username: "updated-testuser",
      };

      const savedUser = await userRepository.save(updatedUser);

      expect(savedUser).toEqual(updatedUser);
      expect(usersDB.length).toBe(1);
      expect(usersDB[0]).toEqual(updatedUser);
    });
  });
});
