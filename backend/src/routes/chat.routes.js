const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Optionally add the protect middleware if you only want logged-in users to chat
// const protect = require('../middlewares/auth.middleware');
// router.post('/', protect, chatController.handleChat);

router.post('/', chatController.handleChat);

module.exports = router;
