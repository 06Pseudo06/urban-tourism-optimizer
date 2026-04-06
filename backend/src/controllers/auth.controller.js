// const authService = require('../services/auth.service');

// const register = async (req, res) => {
//   try {
//     const user = await User.findOne({ email }).select('+password');

//     const { password, ...safeUser } = user._doc;

//     res.status(201).json(safeUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const data = await authService.loginUser(req.body);

//     const { password, ...safeUser } = data.user._doc;

//     res.status(200).json({
//       user: safeUser,
//       token: data.token,
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// module.exports = { register, login };
const User = require("../models/user.model");
const mongoose = require("mongoose");

const register = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("DB STATE:", mongoose.connection.readyState);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register };