const express = require("express");
const {
  Signup,
  Login,
  checkUsername,
  verifyEmail,
  sendOTC,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/checkUsername", checkUsername);
router.post("/verify-email", verifyEmail);
router.post("/send-otc", sendOTC);

module.exports = router;
