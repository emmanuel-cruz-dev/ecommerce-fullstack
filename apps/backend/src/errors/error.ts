import { Response } from "express";

export class HttpError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export const handleError = (res: Response, error: unknown) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      ok: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
  });
};
