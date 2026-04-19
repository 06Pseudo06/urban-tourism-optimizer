const chatService = require('../services/chat.service');

const handleChat = async (req, res) => {
  try {
    const { message, history, currentItinerary } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const resultText = await chatService.processChatQuery(message, history || [], currentItinerary);

    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch {
      parsedResult = { reply: resultText };
    }

    res.status(200).json(parsedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleChat
};
