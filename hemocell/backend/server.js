import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import nodemailer from "nodemailer";
import authRoutes from "./routes/authRoutes.js";
import Chat from "./models/chatModel.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update this to your frontend domain in production
  },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;



// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://hemocell-lake.vercel.app"
}));
app.use("/api/auth", authRoutes);

// Store online users and their socket IDs
let onlineUsers = {};

// WebSocket events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user to track their socket
  socket.on("register", (email) => {
    onlineUsers[email] = socket.id;
    console.log(`${email} registered with socket ID ${socket.id}`);
  });

  // Blood request event
  socket.on("sendRequest", ({ donorEmail, receiverEmail, request }) => {
    const socketId = onlineUsers[donorEmail];
    if (socketId) {
      io.to(socketId).emit("newRequest", { from: receiverEmail, request });
    } else {
      console.log(`Donor ${donorEmail} is offline, sending email notification.`);
      sendEmailNotification(donorEmail, receiverEmail, request);
    }
  });

  // Join a chat room
 socket.on("join_room", async (roomId) => {
  try {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);

    // ✅ Create chat document if it doesn't exist
    let chat = await Chat.findOne({ roomId });
    if (!chat) {
      chat = await new Chat({ roomId, messages: [] }).save();
      console.log("New chat created for room:", roomId);
    }

    // ✅ Emit previous messages
    socket.emit("previous_messages", chat.messages); // <-- ADD THIS LINE

  } catch (error) {
    console.error("Error in join_room:", error);
  }
});


  // Handle sending messages
 socket.on("send_message", async ({ roomId, senderEmail, receiverEmail,message }) => {
  try {
    let chat = await Chat.findOne({ roomId });

    // Log the chat before saving
    console.log("Chat before save:", chat);

    if (!chat) {
      chat = new Chat({
        roomId,
        messages: [{ sender: senderEmail, message }],
      });
    } else {
      chat.messages.push({ sender: senderEmail, message });
    }

    await chat.save();

    // Log after saving
    console.log("Chat after save:", chat);

    io.to(roomId).emit("receive_message", {
      sender: senderEmail,
      message,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error handling send_message:", error);
  }
});


  // Disconnect
  socket.on("disconnect", () => {
    for (const email in onlineUsers) {
      if (onlineUsers[email] === socket.id) {
        delete onlineUsers[email];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Email Fallback
function sendEmailNotification(donorEmail, receiverEmail, request) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: donorEmail,
    subject: "New Blood Donation Request",
    text: `You have a new blood donation request from ${receiverEmail}.\n\nRequest Details:\n${request}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// DB Connection and Server Start
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
