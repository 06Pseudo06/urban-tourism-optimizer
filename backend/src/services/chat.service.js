const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const processChatQuery = async (userMessage, history = []) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  // Add system instruction as the context of the conversation.
  const systemInstruction = `You are an expert, friendly, and helpful AI tourist guide for the Urban Tourism Optimizer platform. 
Your goal is to assist tourists with planning their trips, learning about landmarks, suggesting itineraries, finding restaurants, and understanding local history or culture. 
Rules:
1. Always be polite and welcoming.
2. Only answer questions related to travel, tourism, geography, history, and local culture.
3. If a user asks about coding, math, general science, or anything fundamentally unrelated to travel/tourism, politely decline and steer the conversation back to travel.
4. Keep answers relatively concise and easy to read formatting with markdown.`;

  try {
    // We convert the frontend history format to the Gemini format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Start a chat session, injecting the system instruction into the conversation start if possible, 
    // or just relying on model instructions. For gemini-1.5-flash, we can pass systemInstruction directly if supported, 
    // but the easiest way is to push it as the first context if history is empty.
    
    const chatSession = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'System Instruction: ' + systemInstruction }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am your expert travel guide. How can I help you plan your trip today?' }]
        },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 5000,
      },
    });

    const result = await chatSession.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    throw new Error('Failed to generate chat response. Please try again later.');
  }
};

module.exports = {
  processChatQuery
};
