const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const processChatQuery = async (userMessage, history = [], currentItinerary = null) => {
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
4. Keep answers relatively concise and easy to read formatting with markdown.

CRITICAL INSTRUCTION: Your output MUST ALWAYS be a valid JSON object matching this exact schema:
{
  "reply": "Your markdown formatted message to the user",
  "updatedItinerary": null // or the updated itinerary object if the user asked to modify it
}

If the user asks to modify their current itinerary (e.g., change a place, remove something, add something), you must:
1. Copy their current itinerary.
2. Make the necessary modifications. If you add a new place, include an estimated "lat" and "lng", "category", and a "reason". Leave image_url empty if unknown.
3. Provide the entire modified itinerary object in the "updatedItinerary" field.
4. Output a friendly message in "reply" explaining the changes.

If the user is NOT asking to modify the itinerary, leave "updatedItinerary" as null.`;

  try {
    // We convert the frontend history format to the Gemini format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    let contextHistory = [];
    if (currentItinerary) {
      contextHistory.push({
        role: 'user',
        parts: [{ text: 'System Context: The user is currently viewing this itinerary: \n' + JSON.stringify(currentItinerary) }]
      });
      contextHistory.push({
        role: 'model',
        parts: [{ text: '{"reply": "Noted. I have the users current itinerary memorized.","updatedItinerary":null}' }]
      });
    }

    const chatSession = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'System Instruction: ' + systemInstruction }]
        },
        {
          role: 'model',
          parts: [{ text: '{"reply": "Understood. I am your expert travel guide. How can I help you plan your trip today?","updatedItinerary":null}' }]
        },
        ...contextHistory,
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 5000,
        responseMimeType: "application/json",
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
