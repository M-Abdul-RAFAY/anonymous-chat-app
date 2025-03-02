import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../dist")));

// Store active chat rooms
const chatRooms = new Map();

// Generate a unique room ID
app.get("/api/create-room", (req, res) => {
  const roomId = uuidv4();
  chatRooms.set(roomId, { users: 0, messages: [] });
  res.json({ roomId });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected");
  let currentRoom = null;

  // Join a room
  socket.on("join-room", ({ roomId, userId }) => {
    // Check if room exists
    if (!chatRooms.has(roomId)) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    // Join the room
    socket.join(roomId);
    currentRoom = roomId;

    const room = chatRooms.get(roomId);
    room.users += 1;

    // Notify the room that a new user has joined
    io.to(roomId).emit("user-joined", {
      userId,
      userCount: room.users,
    });

    // Send room info to the user who just joined
    socket.emit("room-joined", {
      roomId,
      userId,
      messages: room.messages,
      userCount: room.users,
    });

    console.log(
      `User ${userId} joined room ${roomId}. Total users: ${room.users}`
    );
  });

  // Handle messages
  socket.on("send-message", (message) => {
    if (!currentRoom || !chatRooms.has(currentRoom)) return;

    console.log(`Message received in room ${currentRoom}: ${message.text}`);

    // Store message
    const room = chatRooms.get(currentRoom);
    room.messages.push(message);

    // Broadcast to everyone in the room (including sender for consistency)
    io.to(currentRoom).emit("receive-message", message);
  });

  // Handle typing indicator
  socket.on("typing", ({ roomId, userId, isTyping }) => {
    socket.to(roomId).emit("user-typing", { userId, isTyping });
  });

  // Handle leave room
  socket.on("leave-room", ({ roomId }) => {
    if (roomId && chatRooms.has(roomId)) {
      socket.leave(roomId);
      const room = chatRooms.get(roomId);
      room.users -= 1;

      // Notify remaining users
      io.to(roomId).emit("user-left", {
        userCount: room.users,
      });

      console.log(`User left room ${roomId}. Remaining users: ${room.users}`);

      // If room is empty, remove it after a timeout
      if (room.users === 0) {
        setTimeout(() => {
          if (chatRooms.has(roomId) && chatRooms.get(roomId).users === 0) {
            chatRooms.delete(roomId);
            console.log(`Room ${roomId} removed due to inactivity`);
          }
        }, 3600000); // 1 hour timeout
      }

      currentRoom = null;
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (currentRoom && chatRooms.has(currentRoom)) {
      const room = chatRooms.get(currentRoom);
      room.users -= 1;

      // Notify remaining users
      io.to(currentRoom).emit("user-left", {
        userCount: room.users,
      });

      console.log(
        `User disconnected from room ${currentRoom}. Remaining users: ${room.users}`
      );

      // If room is empty, remove it after a timeout
      if (room.users === 0) {
        setTimeout(() => {
          if (
            chatRooms.has(currentRoom) &&
            chatRooms.get(currentRoom).users === 0
          ) {
            chatRooms.delete(currentRoom);
            console.log(`Room ${currentRoom} removed due to inactivity`);
          }
        }, 3600000); // 1 hour timeout
      }
    }
  });
});

// Catch-all handler to return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
