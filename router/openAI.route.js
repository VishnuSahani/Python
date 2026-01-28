const express = require("express");
const openAIrouter = express.Router();
const openAIControlersBot = require("../controllers/openAI.controler");
const { body,validationResult } = require("express-validator");

const validatePayloadOpenAI = [
  body("botType").exists().withMessage("B-Type is required"),
  body("message").exists().withMessage("Message is required"),
  body("type").exists().withMessage("Type  is required"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// get response
openAIrouter.post(
  "/chat",
  validatePayloadOpenAI,
  handleValidationErrors, // Add this middleware
  openAIControlersBot.getResponseChat
);

module.exports = openAIrouter;
