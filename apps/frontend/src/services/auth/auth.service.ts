import api from "../api";
import type { LoginRequest, RegisterRequest } from "src/types/auth";

export const login = async (request: LoginRequest) => {
  const response = await api.post("/auth/login", request);
  return response.data;
};

export const register = async (request: RegisterRequest) => {
  const response = await api.post("/auth/register", request);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data.payload;
};
