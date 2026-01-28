
const express = require("express"); //1
const cors = require("cors"); //2
const openAIrouter = require("./router/openAI.route");

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
  res.status(200).json({ success: true, error: "Hello" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.error(err);
  res
    .status(500)
    .json({ success: false, error: "Something went wrong!", message: err });
});

// 404 handler (should be placed at the end of all routes)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
