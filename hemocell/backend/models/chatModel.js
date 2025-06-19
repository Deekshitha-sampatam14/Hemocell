import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  messages: [
    {
      sender: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
