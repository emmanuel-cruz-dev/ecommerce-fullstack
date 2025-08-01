import { Request, Response } from "express";
import authService from "../services/auth.service";
import { User } from "@domain/src/entities/User";

const signUp = async (req: Request, res: Response): Promise<Response> => {
  const { email, password, username, role } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({
      ok: false,
      message: "Faltan campos obligatorios: email, password, username",
    });
  }

  try {
    const newUser: Omit<User, "id"> = {
      email,
      password,
      username,
      role: role || "user",
    };
    const token = await authService.signUp(newUser);
    return res.status(201).json({ ok: true, payload: { token } });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(409).json({ ok: false, message: errorMessage });
  }
};

const signIn = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Faltan campos obligatorios: email, password",
    });
  }

  try {
    const token = await authService.signIn(email, password);
    return res.status(200).json({ ok: true, payload: { token } });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(401).json({ ok: false, message: errorMessage });
  }
};

export default {
  signUp,
  signIn,
};
