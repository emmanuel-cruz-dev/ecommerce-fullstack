import { Request, Response } from "express";
import { AuthenticatedRequest } from "@domain/src/ports/auth-types";
import authService from "../services/auth.service";
import { User } from "src/types/types";

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
    const { accessToken, refreshToken } = await authService.signUp(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ ok: true, payload: { accessToken } });
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
    const { accessToken, refreshToken } = await authService.signIn(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ ok: true, payload: { accessToken } });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(401).json({ ok: false, message: errorMessage });
  }
};

const getMe = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as AuthenticatedRequest).user.id;
  try {
    const user = await authService.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({ ok: true, payload: userWithoutPassword });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

const refresh = async (req: Request, res: Response): Promise<Response> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ ok: false, message: "Refresh token no proporcionado." });
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshToken(refreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ ok: true, payload: { accessToken } });
  } catch (error) {
    res.clearCookie("refreshToken");
    return res
      .status(401)
      .json({ ok: false, message: (error as Error).message });
  }
};

export default {
  signUp,
  signIn,
  getMe,
  refresh,
};
