import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST

import express from "express";
import cors from "cors";
import openAIrouter from "./router/openAI.route.js";

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

app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    message: err?.message || err,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
