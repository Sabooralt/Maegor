const express = require("express");
const {
  getRoomsByUserId,

  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:userId/user_rooms", authMiddleware, getRoomsByUserId);

router.get("/:roomId/:userId", authMiddleware, getRoomById);

router.post("/", authMiddleware, createRoom);

router.put("/:id", authMiddleware, updateRoom);

router.delete("/:id", authMiddleware, deleteRoom);

module.exports = router;
