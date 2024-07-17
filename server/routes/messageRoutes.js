const express = require("express");
const router = express.Router();
const {
  getMessages,
  saveMessage,
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:roomId", authMiddleware, getMessages);
router.post("/newMessage", authMiddleware, saveMessage);

module.exports = router;
