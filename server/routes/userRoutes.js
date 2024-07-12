const express = require("express");
const { Signup, Login, checkUsername } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/checkUsername",checkUsername)

module.exports = router;
