import express from "express";
import { body, validationResult } from "express-validator";
import openAIControllersBot from "../controllers/openAI.controler.js"; // ⚠️ .js required

const openAIrouter = express.Router();

const validatePayloadOpenAI = [
  body("botType").exists().withMessage("B-Type is required"),
  body("message").exists().withMessage("Message is required"),
  body("type").exists().withMessage("Type is required"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST: get response
openAIrouter.post(
  "/chat",
  validatePayloadOpenAI,
  handleValidationErrors,
  openAIControllersBot.getResponseChat
);

export default openAIrouter;
