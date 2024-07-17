const Room = require("../models/roomModel");

const getRoomsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const rooms = await Room.find({ members: userId }).populate("members");
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving rooms", error: error.message });
  }
};

const getAnonymousRoomsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const rooms = await Room.find({
      members: userId,
      roomType: "anonymous",
    }).populate("members");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving anonymous rooms",
      error: error.message,
    });
  }
};

const getGroupRoomsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const rooms = await Room.find({
      members: userId,
      roomType: "group",
    }).populate("members");
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving group rooms", error: error.message });
  }
};

const getFriendRoomsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const rooms = await Room.find({
      members: userId,
      roomType: "friend",
    }).populate("members");
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving friend rooms", error: error.message });
  }
};

const getRoomById = async (req, res) => {
  const { roomId, userId } = req.params;

  try {
    let room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the room is anonymous; if so, do not populate members
    if (room.roomType === "anonymous") {
      return res.status(200).json({
        _id: room._id,
        roomId: room.roomId,
        roomType: room.roomType,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      });
    }

    // Check if userId is available in members before populating
    if (room.members.includes(userId)) {
      room = await Room.findOne({ roomId }).populate("members");
      return res.status(200).json(room);
    } else {
      return res
        .status(403)
        .json({ message: "User not authorized to access this room" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving room", error: error.message });
  }
};

const createRoom = async (req, res) => {
  const { roomId, roomType, members } = req.body;
  try {
    const newRoom = new Room({
      roomId,
      roomType,
      members,
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating room", error: error.message });
  }
};

const updateRoom = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("members");
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(updatedRoom);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating room", error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting room", error: error.message });
  }
};

module.exports = {
  getRoomsByUserId,
  getAnonymousRoomsByUserId,
  getGroupRoomsByUserId,
  getFriendRoomsByUserId,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
