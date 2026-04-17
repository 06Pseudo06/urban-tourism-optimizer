const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const user = await User.findOne({ email }).select('+password');

    const { password, ...safeUser } = user._doc;

    res.status(201).json(safeUser);
  } catch (error) {
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