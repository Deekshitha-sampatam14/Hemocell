import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import HeaderComponent from "./sections/header/header-component";
import FooterComponent from "./sections/footer/footer-component";


const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);

    try {
      const baseUrl = process.env.NODE_ENV === "production"
  ? "https://hemocell-backend.onrender.com"
  : "http://localhost:5000";

      const res = await axios.post(`${baseUrl}/api/auth/chatbot`, {
        message: input,
      });

      setMessages([...newMessages, { role: "bot", text: res.data.reply }]);
      setInput("");
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "⚠️ Sorry, I couldn’t respond." }]);
    }
  };

  return (
    <>
          <HeaderComponent />

 <div className="mx-auto my-10 bg-white border border-red-300 rounded-xl shadow-2xl w-[90%] max-w-md p-4">

      <h2 className="text-xl font-bold text-dark_red mb-3 text-center">HemoCell Assistant 🤖</h2>

      <div className="h-64 overflow-y-auto mb-3 bg-[#fff5f5] rounded-md p-2 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                msg.role === "user"
                  ? "bg-red text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-dark_red hover:bg-red text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Send
        </button>
      </div>
    </div>
    <FooterComponent/>
    </>
  );
};

export default Chatbot;
