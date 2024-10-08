const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { generateAndSendOTC } = require("../utils/otcUtil");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
   
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  profilePicture: {
    type: String,
  },
  role: {
    type: String,
    enum: ["student", "faculty", "admin"],
    default: "student",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  return token;
};

userSchema.statics.signup = async function (username, email, password) {
  if (!username || !email || !password) {
    throw new Error("All fields must be filled.");
  }

  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use.");
  }

  const user = await this.create({
    username,
    email,
    password,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields must be filled.");
  }

  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Incorrect email.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect password.");
  }

  if (!user.verified) {
    await generateAndSendOTC(email);
    user.isLoggedIn = true;

    await user.save();
    const token = user.generateAuthToken();
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    return { user: userWithoutPassword, token };
  }

  user.isLoggedIn = true;

  await user.save();
  const token = user.generateAuthToken();
  const { password: pwd, ...userWithoutPassword } = user.toObject();
  return { user: userWithoutPassword, token };
};

userSchema.statics.updatePassword = async function (
  password,
  newPassword,
  userId
) {
  if (!password || !newPassword) {
    throw new Error("All fields must be filled.");
  }

  const user = await this.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect password.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedNewPassword;
  await user.save();

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
