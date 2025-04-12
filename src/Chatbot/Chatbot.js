import React, { useState } from "react";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA7o8cPAMYecsV_xCt9wkIzUw2yn7HtjkU",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      const data = await response.json();

      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm not sure how to respond.";

      const botMessage = { sender: "bot", text: botText };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Error fetching response. Try again later." },
      ]);
    }

    setInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        right: "50px",
        width: "400px",
        backgroundColor: "#333", // Dark background for the chatbot
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "15px",
        zIndex: 9999,
        color: "#fff", // White text for the chatbot interface
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #444",
          paddingBottom: "10px",
        }}
      >
        <h3 style={{ margin: 0 }}>🤖 Ask me your Doubts 🤖</h3>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "none",
            fontSize: "18px",
            color: "#ff6f61", // Red color for close button
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      </div>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "8px",
                background:
                  msg.sender === "user"
                    ? "#1e40af" // Blue background for user messages
                    : "#444", // Dark grey for bot messages
                color: msg.sender === "user" ? "white" : "#fff",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #444",
            backgroundColor: "#555", // Input field background color
            color: "#fff", // White text inside input
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "5px",
            padding: "10px",
            backgroundColor: "#1e40af", // Button color
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
