import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";

const app = express();

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.BASE_URL || "http://localhost:5173",
  "http://localhost:6006",
];

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origen no permitido por CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API RESTful TypeScript & Express",
  });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// Not found (404)
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `No se encontró la ruta '${req.originalUrl}'`,
  });
});

// General error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});

export default app;
