// src/controllers/authController.js
const User = require("../models/userModel");

const Signup = async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      phoneNumber,
      password,
    });

    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { Signup, Login };
