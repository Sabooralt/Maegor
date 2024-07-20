const Room = require("../models/roomModel");

const Message = require("../models/messagesModel");

const getRoomsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const rooms = await Room.find({ members: userId });

    if (!rooms.length) {
      return res.status(404).json({ message: "No rooms found for this user" });
    }

    const roomsWithLastMessage = await Promise.all(
      rooms.map(async (room) => {
        try {
          const lastMessage = await Message.findOne({
            roomId: room.roomId,
          }).sort({ createdAt: -1 });

          return {
            ...room._doc,
            lastMessage: lastMessage ? lastMessage : null,
          };
        } catch (messageError) {
          console.error(
            `Error fetching last message for room ${room.roomId}:`,
            messageError,
          );
          return {
            ...room._doc,
            lastMessage: null,
          };
        }
      }),
    );

    res.status(200).json(roomsWithLastMessage);
  } catch (error) {
    console.error("Error retrieving rooms:", error);
    res.status(500).json({
      message: "Error retrieving rooms",
      error: error.message,
    });
  }
};

module.exports = {
  getRoomsByUserId,
};

const getRoomById = async (req, res) => {
  const { roomId, userId } = req.params;

  try {
    let room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.roomType === "anonymous") {
      return res.status(200).json({
        _id: room._id,
        roomId: room.roomId,
        roomType: room.roomType,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      });
    }

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
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
