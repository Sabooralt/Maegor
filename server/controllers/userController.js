const User = require("../models/userModel");
const OTC = require("../models/otcModel");
const { generateAndSendOTC } = require("../utils/otcUtil");

const getUserDetails = async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
const verifyEmail = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.verified) {
      return res.status(200).json({ message: "Email is already verified." });
    }

    const otpEntry = await OTC.findOne({ email });
    if (!otpEntry) {
      return res.status(400).json({ message: "OTP expired." });
    }

    if (otpEntry.otc !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    await User.findOneAndUpdate({ email }, { verified: true });
    await OTC.findOneAndDelete({ email });

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const sendOTC = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateAndSendOTC(email);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP." });
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

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await User.login(email, password);

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  Signup,
  getUserDetails,
  sendOTC,
  Login,
  checkUsername,
  verifyEmail,
};
