const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { getMessages } = require("../controllers/messageController");

router.get("/message/:roomId/", getMessages);

module.exports = router;
