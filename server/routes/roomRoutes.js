const express = require("express");
const {
  getRoomsByUserId,
  getAnonymousRoomsByUserId,
  getGroupRoomsByUserId,
  getFriendRoomsByUserId,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:userId", authMiddleware, getRoomsByUserId);

router.get("/:userId/anonymous", authMiddleware, getAnonymousRoomsByUserId);

router.get("/:userId/group", authMiddleware, getGroupRoomsByUserId);

router.get("/:userId/friend", authMiddleware, getFriendRoomsByUserId);

router.get("/:roomId/:userId", authMiddleware, getRoomById);

router.post("/", authMiddleware, createRoom);

router.put("/:id", authMiddleware, updateRoom);

router.delete("/:id", authMiddleware, deleteRoom);

module.exports = router;
