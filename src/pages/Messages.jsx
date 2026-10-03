import { useState } from "react";

import axios from "axios";

import {
  FaRobot,
  FaPaperPlane,
  FaComments,
  FaUser,
  FaSpinner,
} from "react-icons/fa";

// ======================================================
// 🔐 SÉCURITÉ CLIENT
// Compatible avec le backend actuel : POST /ai-chat
// ======================================================

const API_BASE_URL = "https://konanshopping.com";
const API_TIMEOUT = 15000;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 20;
const MAX_HISTORY_MESSAGE_LENGTH = 2000;
const MAX_PAGE_LENGTH = 300;

const sanitizeText = (value, maxLength) => {
  if (typeof value !== "string") return "";

  return value
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
};

const normalizeHistory = (history) => {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_ITEMS)
    .map((message) => {
      if (
        !message ||
        typeof message !== "object"
      ) {
        return null;
      }

      const sender =
        message.sender === "user" ||
        message.sender === "ai"
          ? message.sender
          : "";

      const text = sanitizeText(
        message.text,
        MAX_HISTORY_MESSAGE_LENGTH
      );

      if (!sender || !text) return null;

      return {
        sender,
        text,
      };
    })
    .filter(Boolean);
};

const getSafeToken = () => {
  try {
    const token =
      localStorage.getItem("token");

    return typeof token === "string"
      ? token.trim()
      : "";
  } catch {
    return "";
  }
};

const getSafeServerMessage = (error) => {
  const status =
    error?.response?.status;

  if (status === 400) {
    return "Votre message est invalide ou trop long.";
  }

  if (status === 401) {
    return "Authentification invalide.";
  }

  if (status === 403) {
    return "Accès refusé.";
  }

  if (status === 429) {
    return "Trop de demandes. Veuillez patienter quelques instants.";
  }

  if (error?.code === "ECONNABORTED") {
    return "Le serveur IA met trop de temps à répondre.";
  }

  if (!error?.response) {
    return "Impossible de contacter le serveur IA.";
  }

  return "Erreur serveur IA ❌";
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getSafeToken();

    // Le backend /ai-chat est public.
    // Le JWT n'est envoyé que s'il existe déjà.
    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Nettoyage d'un token manifestement refusé.
    // Cela ne modifie pas la logique de Konan IA.
    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      try {
        localStorage.removeItem("token");
      } catch {
        // Ne jamais bloquer le chat.
      }
    }

    return Promise.reject(error);
  }
);

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

    const currentInput =
      sanitizeText(
        input,
        MAX_MESSAGE_LENGTH
      );

    if (!currentInput || loading) {
      return;
    }

    const userMessage = {
      sender: "user",
      text: currentInput,
    };

    // Historique sécurisé avant ajout
    // du nouveau message.
    const currentHistory =
      normalizeHistory(messages);

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    setLoading(true);

    try {

      const res = await api.post(
        "/api/ai-chat",
        {

          message:
            currentInput,

          currentPage:
            sanitizeText(
              window.location.pathname,
              MAX_PAGE_LENGTH
            ),

          history:
            currentHistory
              .map(
                (m) =>
                  `${m.sender}: ${m.text}`
              )
              .join("\n"),

        }
      );

      const reply =
        typeof res?.data?.reply ===
        "string"
          ? sanitizeText(
              res.data.reply,
              MAX_HISTORY_MESSAGE_LENGTH
            )
          : "";

      const aiMessage = {

        sender: "ai",

        text:
          reply ||
          "Je n'ai pas trouvé de réponse.",

      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

    } catch (error) {
const errorMessage = {

        sender: "ai",

        text:
          getSafeServerMessage(
            error
          ),

      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#F5F7FB",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#4F46E5,#7C3AED)",

          padding: "16px 18px",

          display: "flex",

          alignItems: "center",

          gap: "12px",

          color: "#FFFFFF",

          boxShadow:
            "0 4px 20px rgba(79,70,229,0.15)",
        }}
      >

        <div
          style={{
            width: "44px",
            height: "44px",

            borderRadius: "14px",

            background:
              "rgba(255,255,255,0.15)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            backdropFilter:
              "blur(10px)",
          }}
        >

          <FaRobot
            style={{
              fontSize: "20px",
            }}
          />

        </div>

        <div>

          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "800",
            }}
          >
            Konan IA
          </h1>

          <p
            style={{
              margin:
                "2px 0 0 0",
              fontSize: "12px",
              opacity: 0.9,
            }}
          >
            Assistant intelligent
          </p>

        </div>

      </div>


      {/* CHAT */}

      <div
        style={{
          flex: 1,

          padding: "14px",

          display: "flex",

          flexDirection:
            "column",

          gap: "14px",

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
                  msg.sender ===
                  "user"
                    ? "flex-end"
                    : "flex-start",
              }}
            >

              <div
                style={{
                  display: "flex",

                  alignItems:
                    "flex-end",

                  gap: "8px",

                  maxWidth: "90%",
                }}
              >

                {msg.sender ===
                  "ai" && (

                  <div
                    style={{
                      width: "34px",
                      height: "34px",

                      borderRadius:
                        "12px",

                      background:
                        "#EEF2FF",

                      display: "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      color:
                        "#4F46E5",

                      flexShrink: 0,
                    }}
                  >

                    <FaRobot />

                  </div>

                )}

                <div
                  style={{
                    maxWidth: "100%",

                    padding:
                      "12px 14px",

                    borderRadius:
                      "18px",

                    background:
                      msg.sender ===
                      "user"

                        ? "linear-gradient(135deg,#4F46E5,#7C3AED)"

                        : "#FFFFFF",

                    color:
                      msg.sender ===
                      "user"

                        ? "#FFFFFF"

                        : "#111827",

                    fontSize: "14px",

                    lineHeight: "1.6",

                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.05)",

                    border:
                      msg.sender ===
                      "ai"

                        ? "1px solid #E5E7EB"

                        : "none",
                  }}
                >
                  {msg.text}
                </div>

                {msg.sender ===
                  "user" && (

                  <div
                    style={{
                      width: "34px",
                      height: "34px",

                      borderRadius:
                        "12px",

                      background:
                        "#EDE9FE",

                      display: "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      color:
                        "#5B3CC4",

                      flexShrink: 0,
                    }}
                  >

                    <FaUser />

                  </div>

                )}

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
                display: "flex",

                alignItems:
                  "center",

                gap: "8px",

                background:
                  "#FFFFFF",

                padding:
                  "12px 16px",

                borderRadius:
                  "16px",

                border:
                  "1px solid #E5E7EB",

                color:
                  "#6B7280",

                fontSize: "14px",
              }}
            >

              <FaRobot
                style={{
                  color:
                    "#4F46E5",
                }}
              />

              Konan IA réfléchit...

            </div>

          </div>

        )}

      </div>


      {/* INPUT */}

      <div
        style={{
          padding: "14px",

          background:
            "#FFFFFF",

          borderTop:
            "1px solid #E5E7EB",

          boxShadow:
            "0 -4px 20px rgba(0,0,0,0.04)",
        }}
      >

        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: "10px",

            background:
              "#F8FAFC",

            border:
              "1px solid #E5E7EB",

            borderRadius:
              "18px",

            padding: "8px",
          }}
        >

          <input
            type="text"

            placeholder=
              "Posez votre question à Konan IA..."

            value={input}

            onChange={(e) =>
              setInput(
                e.target.value
              )
            }

            onKeyDown={(e) => {

              if (
                e.key ===
                "Enter"
              ) {

                sendMessage();

              }

            }}

            maxLength={
              MAX_MESSAGE_LENGTH
            }

            style={{
              flex: 1,

              border: "none",

              outline: "none",

              background:
                "transparent",

              padding:
                "10px 12px",

              fontSize: "14px",

              color:
                "#111827",
            }}
          />

          <button
            type="button"

            onClick={
              sendMessage
            }

            disabled={loading}

            aria-label=
              "Envoyer le message"

            style={{
              width: "46px",

              height: "46px",

              border: "none",

              borderRadius:
                "14px",

              background:
                loading
                  ? "#9CA3AF"
                  : "linear-gradient(135deg,#4F46E5,#7C3AED)",

              color: "#FFFFFF",

              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",

              display: "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              boxShadow:
                "0 6px 18px rgba(79,70,229,0.25)",

              transition:
                "all .25s ease",

              opacity:
                loading ? 0.7 : 1,
            }}
          >

            {loading ? (

              <FaSpinner
                style={{
                  fontSize: "16px",
                  animation:
                    "spin 1s linear infinite",
                }}
              />

            ) : (

              <FaPaperPlane
                style={{
                  fontSize:
                    "16px",
                }}
              />

            )}

          </button>

        </div>

      </div>

    </div>

  );

}

export default Messages;