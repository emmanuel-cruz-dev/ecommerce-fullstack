import express from "express";

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
