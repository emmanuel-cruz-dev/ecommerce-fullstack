import { User } from "../entities/User";
import { IPasswordHasher } from "../ports/password-hasher";
import { UserRepository } from "../repositories/user-repository";

export class MockPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed_${password}`;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return `hashed_${password}` === hashedPassword;
  }
}

export interface MockedUserRepository extends UserRepository {
  users: User[];
}

export function mockUserRepository(users: User[] = []): MockedUserRepository {
  return {
    users,
    findByEmail: async (email: string) => {
      const user = users.find((user) => user.email === email);
      const result = user ? { ...user } : null;
      return result;
    },
    save: async (user: User) => {
      const newUser = { ...user };
      const existingUserIndex = users.findIndex(
        (u) => u.email === newUser.email
      );
      if (existingUserIndex !== -1) {
        users[existingUserIndex] = { ...user };
      } else {
        users.push({ ...user });
      }
      return { ...user };
    },
  };
}
