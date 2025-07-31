import { Request, Response } from "express";
import authService from "../services/auth.service";
import { handleError } from "../errors/error";
import { UserLoginError } from "@domain/src/use-cases/user-login";

const register = async (req: Request, res: Response) => {
  try {
    const newUser = await authService.registerUser(req.body);
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json({
      ok: true,
      payload: userWithoutPassword,
      message: "User registered successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    const { password: userPassword, ...userWithoutPassword } = user;
    res.status(200).json({
      ok: true,
      payload: { user: userWithoutPassword, token },
      message: "Login successful",
    });
  } catch (error) {
    if (error instanceof UserLoginError) {
      return res.status(401).json({ ok: false, message: error.message });
    }
    return handleError(res, error);
  }
};

export default {
  register,
  login,
};
