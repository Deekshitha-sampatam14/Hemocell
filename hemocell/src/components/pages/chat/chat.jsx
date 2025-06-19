import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";

const socket = io("http://localhost:5000");

const Chat = () => {
  const location = useLocation();
  const senderEmail = localStorage.getItem("email");
  const receiverEmail = location.state?.user?.email;
  const userName = localStorage.getItem("username") || "You";
  const roomId = [senderEmail, receiverEmail].sort().join("_");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handlePreviousMessages = (data) => {
      setMessages(data);
      setLoading(false);
    };

    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.emit("join_room", roomId);
    socket.on("previous_messages", handlePreviousMessages);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("previous_messages", handlePreviousMessages);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      roomId,
      senderEmail,
      receiverEmail,
      message,
    };

    socket.emit("send_message", newMessage);
    setMessage("");
  };

  return (
    <>
     <HeaderComponent />
   
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md border rounded-lg p-4 bg-white shadow-md">
        <h2 className="text-lg font-bold mb-3 text-center">
          Chat with {receiverEmail}
        </h2>
        <div className="h-80 overflow-y-auto bg-gray-100 p-3 rounded-lg mb-3">
          {loading && <p className="text-gray-500">Loading chat...</p>}
          {messages.map((msg, index) => (
            <div
  key={index}
  className={`mb-2 flex ${
    msg.sender === senderEmail ? "justify-end" : "justify-start"
  }`}
>
  <div
    className={`px-4 py-2 rounded-lg max-w-[70%] text-sm break-words ${
      msg.sender === senderEmail
        ? "bg-blue-500 text-gray text-right"
        : "bg-gray-300 text-black text-left"
    }`}
  >
    <span className="font-semibold mr-1">
      {msg.sender === senderEmail ? "You" : receiverEmail}:
    </span>
    <span>{msg.message || msg.text}</span>
  </div>
</div>

          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="w-90 bg-dark_red hover:bg-dark text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
     <FooterComponent />
     </>
  );
};

export default Chat;
