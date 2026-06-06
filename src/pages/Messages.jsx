import { useState } from "react";

import axios from "axios";

function Messages() {

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([

      {
        sender: "ai",

        text:
          "Bonjour 👋 Je suis Konan IA. Comment puis-je vous aider aujourd'hui ?",
      },

    ]);


  // =========================
  // SEND MESSAGE
  // =========================

const sendMessage = async () => {

  if (!input.trim()) return;

  const userMessage = {
    sender: "user",
    text: input,
  };

  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  const currentInput = input;

  setInput("");

  try {

    const res = await axios.post(
      "https://konanshopping-production.up.railway.app/ai/chat",
      {

        message: currentInput,

        currentPage:
          window.location.pathname,

        history: messages
          .map(
            (m) =>
              `${m.sender}: ${m.text}`
          )
          .join("\n"),

      }
    );

    const aiMessage = {

      sender: "ai",

      text:
        res.data.reply ||
        "Je n'ai pas trouvé de réponse.",

    };

    setMessages((prev) => [
      ...prev,
      aiMessage,
    ]);

  } catch (err) {

    console.log(err);

    const errorMessage = {

      sender: "ai",

      text:
        "Erreur serveur IA ❌",

    };

    setMessages((prev) => [
      ...prev,
      errorMessage,
    ]);

  }

};

  return (

    <div
      style={{
        minHeight: "100vh",

        background: "#f5f7ff",

        display: "flex",

        flexDirection: "column",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#4f46e5,#7c3aed)",

          padding: "18px",

          color: "white",

          fontWeight: "800",

          fontSize: "22px",

          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        🤖 Konan IA
      </div>

      {/* CHAT */}

      <div
        style={{
          flex: 1,

          padding: "14px",

          display: "flex",

          flexDirection: "column",

          gap: "12px",

          overflowY: "auto",
        }}
      >

        {messages.map(
          (msg, index) => (

            <div
              key={index}

              style={{
                display: "flex",

                justifyContent:

                  msg.sender === "user"

                    ? "flex-end"

                    : "flex-start",
              }}
            >

              <div
                style={{
                  maxWidth: "78%",

                  padding: "14px",

                  borderRadius: "18px",

                  background:

                    msg.sender === "user"

                      ? "linear-gradient(135deg,#4f46e5,#7c3aed)"

                      : "white",

                  color:

                    msg.sender === "user"

                      ? "white"

                      : "#111827",

                  fontSize: "14px",

                  lineHeight: "1.5",

                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                {msg.text}
              </div>

            </div>

          )
        )}

        {/* LOADING */}

        {loading && (

          <div
            style={{
              display: "flex",

              justifyContent:
                "flex-start",
            }}
          >

            <div
              style={{
                background: "white",

                padding:
                  "12px 16px",

                borderRadius: "16px",

                fontSize: "14px",

                color: "#6b7280",
              }}
            >
              Konan IA réfléchit...
            </div>

          </div>

        )}

      </div>

      {/* INPUT */}

      <div
        style={{
          padding: "14px",

          background: "white",

          display: "flex",

          gap: "10px",

          borderTop:
            "1px solid #e5e7eb",
        }}
      >

        <input

          type="text"

          placeholder="Posez votre question..."

          value={input}

          onChange={(e) =>
            setInput(
              e.target.value
            )
          }

          onKeyDown={(e) => {

            if (
              e.key === "Enter"
            ) {

              sendMessage();

            }

          }}

          style={{
            flex: 1,

            border: "none",

            outline: "none",

            background: "#f3f4f6",

            borderRadius: "16px",

            padding: "14px",

            fontSize: "14px",
          }}
        />

        <button

          onClick={sendMessage}

          style={{
            border: "none",

            background:
              "linear-gradient(135deg,#4f46e5,#7c3aed)",

            color: "white",

            borderRadius: "16px",

            padding:
              "0 20px",

            fontWeight: "800",

            cursor: "pointer",
          }}
        >
          Envoyer
        </button>

      </div>

    </div>

  );

}

export default Messages;