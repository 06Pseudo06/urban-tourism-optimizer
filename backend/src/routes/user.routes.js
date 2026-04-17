const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

router.get('/profile', protect, (req, res) => {
    const { _id, name, email } = req.user;

    res.json({
    user: { _id, name, email }
  });
});

module.exports = router;