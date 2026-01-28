//import model here
const OpenAI = require("openai");
const key = "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";
//open ai
const openai = new OpenAI({
  // apiKey: 'key',
  apiKey: key,
});

const getResponseChat = async (req, res) => {
  const { botType } = req.body;
  //   res.status(500).json({ error: "Invalid Chat bot type" });
  //     return
  if (botType == "GPT") {
    // return await getResponseGPT(req, res);
    return await getResponseGPT_neno(req, res);
  } else if (botType == "Deepseek") {
    return await getResponseDeepSeak(req, res);
  } else {
    res.status(500).json({ error: "Invalid Chat bot type" });
  }
};

const getResponseGPT_neno = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("req neno=", req.body);

    const response = await openai.responses.create({
      model: "gpt-4.1-nano",
      input: message,
      store: true,
    });

    // console.log("response=", response);
    // response.then((result) => console.log(result.output_text));
    let result = response?.output_text || 'Error: Could not get reply.';
    // console.log("respppp=", result);

    const dataResponse =  {
      'Question':message,
      "Answer":result
    }

    res.json({ reply: dataResponse});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getResponseGPT = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("msg=", message);

    const response = await openai.chat.completions.create({
      // model: "gpt-5", // fast & cost-efficient
      // model: "gpt-4o-mini", // fast & cost-efficient
      model: "gpt-3.5-turbo", // fast & cost-efficient free
      messages: [{ role: "user", content: message }],
      reasoning: { effort: "low" },
      text: { verbosity: "low" },
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getResponseDeepSeak = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("deepseek msg=", message);

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "deepseek-chat",
      response_format: {
        type: "json_object",
      },
    });

    // console.log(completion.choices[0].message.content);
    console.log(completion.choices[0]);

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getResponseChat,
};
