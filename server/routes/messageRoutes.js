const express = require("express");
const router = express.Router();
const {
  getMessages,
  saveMessage,
  updateAllSeenStatus,
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:roomId", authMiddleware, getMessages);
router.post("/newMessage", authMiddleware, saveMessage);
router.post("/seen/:roomId/:userId", authMiddleware, updateAllSeenStatus);
router.post("/messages/:messageId/seen", authMiddleware, updateAllSeenStatus);

module.exports = router;
