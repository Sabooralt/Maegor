const express = require("express");
const {
  Signup,
  Login,
  checkUsername,
  verifyEmail,
  getUserDetails,
  sendOTC,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/me", authMiddleware, getUserDetails);
router.post("/checkUsername", checkUsername);
router.post("/verify-email", verifyEmail);
router.post("/send-otc", sendOTC);

module.exports = router;
