require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const Room = require("./models/roomModel");

// Sockets initialization
const userSockets = {};
const facultySockets = {};
const roomSockets = {};

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Middleware to attach socket.io instance to requests
app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  req.facultySockets = facultySockets;
  req.roomSockets = roomSockets;
  console.log(req.path, req.method);
  next();
});

// Routes initialization
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const generateRoomId = require("./utils/generateRoomId");
const { saveMessage } = require("./controllers/messageController");

app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    const port = process.env.PORT || 5000;
    const host = "0.0.0.0"; 
    server.listen(port, () => {
      console.log(`Backend running at http://${host}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

const waitingRoom = new Map();

io.on("connection", (socket) => {
  socket.on("register", ({ role, userId }) => {
    if (role === "student") {
      if (!userSockets[userId]) {
        userSockets[userId] = { socketId: socket.id, waitingRoomJoined: false };
        console.log("A student connected", userSockets);
      } else {
        userSockets[userId].socketId = socket.id;
      }
    } else if (role === "faculty") {
      if (!facultySockets[userId]) {
        facultySockets[userId] = socket.id;
        console.log("A faculty connected", facultySockets);
      }
    }
  });

  socket.on("join_waiting_room", async ({ userId }) => {
    if (waitingRoom.has(userId)) {
      if (!waitingRoom.get(userId).available) {
        socket.emit("already_paired", "You are already paired in a room");
        console.log("User is already paired in a room");
        return;
      } else {
        socket.emit(
          "already_in_waiting_room",
          "You are already in the waiting room"
        );
        console.log("User is already in the waiting room");
        return;
      }
    }

    waitingRoom.set(userId, {
      socketId: socket.id,
      waitingRoomJoined: true,
      available: true,
      inRoom: false,
    });
    socket.emit("waiting_room_joined", "Successfully joined the waiting room");
    console.log(`A student (${userId}) joined the waiting room`);

    const availableCount = [...waitingRoom.values()].filter(
      (user) => user.available
    ).length;
    io.emit("waiting_room_count", availableCount);

    const availableStudents = [...waitingRoom.keys()].filter(
      (id) =>
        id !== userId &&
        waitingRoom.get(id).available &&
        !waitingRoom.get(id).inRoom
    );

    if (availableStudents.length >= 1) {
      const student1 = userId;
      const student2 = availableStudents[0];

      const roomId = await generateRoomId();

      const newRoom = new Room({
        roomId: roomId,
        roomType: "anonymous",
        members: [student1, student2],
      });

      await newRoom.save();

      waitingRoom.get(student1).waitingRoomJoined = true;
      waitingRoom.get(student1).available = false;
      waitingRoom.get(student1).inRoom = true;
      waitingRoom.get(student2).waitingRoomJoined = true;
      waitingRoom.get(student2).available = false;
      waitingRoom.get(student2).inRoom = true;

      io.to(waitingRoom.get(student1).socketId).emit("room_joined", newRoom);
      io.to(waitingRoom.get(student2).socketId).emit("room_joined", newRoom);
      io.emit("waiting_room_count", availableCount);

      console.log(`Students ${student1} and ${student2} joined room ${roomId}`);

      io.sockets.sockets.get(waitingRoom.get(student1).socketId).join(roomId);
      io.sockets.sockets.get(waitingRoom.get(student2).socketId).join(roomId);
    }
  });

  socket.on("leave_waiting_room", (disconnectedUserId) => {
    if (disconnectedUserId && waitingRoom.has(disconnectedUserId)) {
      waitingRoom.delete(disconnectedUserId);
      console.log(
        `Removed student (${disconnectedUserId}) from the waiting room`
      );
      const availableCount = [...waitingRoom.values()].filter(
        (user) => user.available
      ).length;
      io.emit("waiting_room_count", availableCount);
    }
  });
  socket.on("send_message", async (data) => {
    const { roomId, senderId, message } = data;

    await saveMessage(roomId, senderId, message);

    io.to(roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    for (const userId in userSockets) {
      if (userSockets[userId].socketId === socket.id) {
        if (waitingRoom.has(userId)) {
          waitingRoom.delete(userId); // Remove from waiting room on disconnect
        }
        delete userSockets[userId];
        break;
      }
    }
    for (const userId in facultySockets) {
      if (facultySockets[userId] === socket.id) {
        delete facultySockets[userId];
        break;
      }
    }
  });
});
