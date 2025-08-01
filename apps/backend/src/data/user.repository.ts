import { v4 as uuid } from "uuid";
import { User } from "@domain/src/entities/User";
import { usersDB } from "../database/users.db";

const findById = async (id: string): Promise<User | null> => {
  return usersDB.find((user) => user.id === id) || null;
};

const findByEmail = async (email: string): Promise<User | null> => {
  return usersDB.find((user) => user.email === email) || null;
};

const save = async (user: User): Promise<User> => {
  const existingIndex = usersDB.findIndex((u) => u.id === user.id);
  if (existingIndex !== -1) {
    usersDB[existingIndex] = user;
    return user;
  } else {
    const newUser = {
      ...user,
      id: uuid(),
    };
    usersDB.push(newUser);
    return newUser;
  }
};

export default {
  findById,
  findByEmail,
  save,
};
