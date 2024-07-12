// src/controllers/authController.js
const User = require("../models/userModel");

const Signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);

    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    const avail = await User.find({ username: username });

    if (avail.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "Username available" });
    }

    return res
      .status(409)
      .json({ success: false, message: "Username not available" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
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

module.exports = { Signup, Login,checkUsername };
