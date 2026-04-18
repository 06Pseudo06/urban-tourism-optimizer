const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    const { password, ...safeUser } = user._doc;

    res.status(201).json(safeUser);
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);

    const { password, ...safeUser } = data.user._doc;

    res.status(200).json({
      user: safeUser,
      token: data.token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };