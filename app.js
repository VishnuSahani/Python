import express from "express";              // 1
import cors from "cors";                    // 2
import openAIrouter from "./router/openAI.route.js"; // ⚠️ extension REQUIRED in ESM

const app = express();

app.use(
  cors({
    origin: true,
    credentials: false,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/bot", openAIrouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Hello" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    message: err?.message || err,
  });
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 3000;

// ⚠️ Vercel note: app.listen is ignored for serverless,
// but keeping it doesn't break local dev
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app; // ✅ required for Vercel
