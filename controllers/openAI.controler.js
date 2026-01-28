import OpenAI from "openai";

const key = "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";
const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY, // ✅ MUST come from env
  apiKey: key
});

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
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * ✅ OpenAI Responses API (RECOMMENDED)
 */
const getResponseGPT_nano = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.responses.create({
      model: "gpt-4.1-nano",
      input: message,
    });

    const result =
      response.output_text || "Error: Could not get reply.";

    res.json({
      reply: {
        Question: message,
        Answer: result,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ⚠️ Legacy Chat Completions (still works, but deprecated)
 */
const getResponseGPT = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ❌ DeepSeek NOTE
 * This WILL NOT work unless you are using DeepSeek's own SDK or endpoint.
 * OpenAI SDK does NOT support deepseek-chat.
 */
const getResponseDeepSeek = async (req, res) => {
  return res.status(400).json({
    error: "DeepSeek is not supported via OpenAI SDK",
  });
};

export default {
  getResponseChat,
};
