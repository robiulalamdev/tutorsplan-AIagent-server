const OpenAi = require("openai");
const VARIABLES = require(".");

const openai = new OpenAi({
  apiKey: VARIABLES.OPENAI_API_KEY,
});

const generateAIMessage = async (messages = [], userInfo = "") => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: ` You are an AI assistant designed to help the user with detailed and structured information. Please respond politely, offering assistance as a knowledgeable assistant helper.
            
          User Information: 
          ${userInfo}
            `,
        },
        ...messages,
      ],
      max_tokens: 100,
    });

    const aiMessage =
      response?.choices[0]?.message?.content || "Failed to generate message.";
    return { success: true, message: aiMessage };
  } catch (error) {
    return {
      success: false,
      message: "Failed to generate message.",
      error: error.message,
    };
  }
};

module.exports = {
  generateAIMessage,
};
