import OpenAI from "openai";

/**
 * ✅ Create OpenAI client lazily (AFTER env is loaded)
 */
function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const getResponseChat = async (req, res) => {
  const { botType } = req.body;

  try {
    if (botType === "GPT") {
      return await getResponseGPT_nano(req, res);
    } else if (botType === "Deepseek") {
      return await getResponseDeepSeek(req, res);
    } else {
      return res.status(400).json({ error: "Invalid Chat bot type" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getResponseGPT_nano = async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ OpenAI client created HERE
    const openai = createOpenAIClient();

    const response = await openai.responses.create({
      model: "gpt-4.1-nano",
      input: message,
    });

    res.json({
      reply: {
        Question: message,
        Answer: response.output_text ?? "No response",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getResponseGPT = async (req, res) => {
  try {
    const { message } = req.body;
    const openai = createOpenAIClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const getResponseDeepSeek = async (_req, res) => {
  return res.status(400).json({
    error: "DeepSeek is not supported via OpenAI SDK",
  });
};

export default {
  getResponseChat,
};
