import express, { NextFunction, Request, Response } from "express";
import productRoutes from "./routes/product.routes";

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API RESTful TypeScript & Express",
  });
});

// Routes
app.use("/api/products", productRoutes);

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
