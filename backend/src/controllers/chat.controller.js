const chatService = require('../services/chat.service');

const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await chatService.processChatQuery(message, history || []);

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleChat
};
