import { useState } from "react";

import axios from "axios";

import {
  FaEnvelope,
  FaPaperPlane,
  FaUsers,
  FaBell,
} from "react-icons/fa";

function AdminMessages() {

    const [title, setTitle] =
  useState("");

const [message, setMessage] =
  useState("");

const [messages, setMessages] =
  useState([]);

  const sendMessage = async () => {

  if (
    !title.trim() ||
    !message.trim()
  ) return;

  try {

    const response =
      await axios.post(
        "https://konanshopping-production.up.railway.app/api/messages",
        {
          title,
          content: message,
        }
      );

    setMessages([
      response.data,
      ...messages,
    ]);

    setTitle("");

    setMessage("");

    alert(
      "Message envoyé avec succès"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Erreur lors de l'envoi"
    );

  }

};

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(to bottom,#eef2ff,#f8fafc)",

        padding: "16px",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#4f46e5,#7c3aed)",

          borderRadius: "24px",

          padding: "20px",

          color: "#fff",

          boxShadow:
            "0 15px 35px rgba(79,70,229,0.25)",
        }}
      >

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "12px",
          }}
        >

          <div
            style={{
              width: "50px",

              height: "50px",

              borderRadius: "16px",

              background:
                "rgba(255,255,255,0.15)",

              display: "flex",

              justifyContent:
                "center",

              alignItems:
                "center",
            }}
          >

            <FaEnvelope
              style={{
                fontSize: "22px",
              }}
            />

          </div>

          <div>

            <h1
              style={{
                margin: 0,

                fontSize: "22px",

                fontWeight: "800",
              }}
            >
              Messages Clients
            </h1>

            <p
              style={{
                margin: "4px 0 0",

                fontSize: "13px",

                opacity: 0.9,
              }}
            >
              Envoyez des annonces à tous vos clients
            </p>

          </div>

        </div>

      </div>

      {/* STATISTIQUES */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(2,1fr)",

          gap: "12px",

          marginTop: "16px",
        }}
      >

        <div
          style={{
            background: "#fff",

            borderRadius: "20px",

            padding: "16px",

            boxShadow:
              "0 10px 25px rgba(0,0,0,0.05)",
          }}
        >

          <FaUsers
            style={{
              color: "#4f46e5",

              fontSize: "22px",
            }}
          />

          <h3
            style={{
              margin:
                "10px 0 0",
            }}
          >
            0
          </h3>

          <p
            style={{
              margin: 0,

              color: "#6b7280",

              fontSize: "12px",
            }}
          >
            Clients
          </p>

        </div>

        <div
          style={{
            background: "#fff",

            borderRadius: "20px",

            padding: "16px",

            boxShadow:
              "0 10px 25px rgba(0,0,0,0.05)",
          }}
        >

          <FaBell
            style={{
              color: "#4f46e5",

              fontSize: "22px",
            }}
          />

          <h3
            style={{
              margin:
                "10px 0 0",
            }}
          >
            0
          </h3>

          <p
            style={{
              margin: 0,

              color: "#6b7280",

              fontSize: "12px",
            }}
          >
            Messages envoyés
          </p>

        </div>

      </div>

      {/* ENVOI MESSAGE */}

      <div
        style={{
          background: "#fff",

          marginTop: "16px",

          borderRadius: "24px",

          padding: "18px",

          boxShadow:
            "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >

        <h2
          style={{
            marginTop: 0,

            fontSize: "18px",
          }}
        >
          Nouveau message
        </h2>

        <input
  value={title}

  onChange={(e) =>
    setTitle(
      e.target.value
    )
  }

  placeholder="Titre du message"

  style={{
    width: "100%",

    height: "48px",

    border:
      "1px solid #e5e7eb",

    borderRadius: "14px",

    padding:
      "0 14px",

    marginBottom:
      "12px",

    outline: "none",

    fontSize: "14px",

    fontWeight: "500",

    background: "#fff",

    color: "#111827",
  }}
/>

<textarea
  value={message}

  onChange={(e) =>
    setMessage(
      e.target.value
    )
  }

  placeholder="Écrivez votre message ici..."

  style={{
    width: "100%",

    height: "140px",

    border:
      "1px solid #e5e7eb",

    borderRadius: "14px",

    padding: "14px",

    resize: "none",

    outline: "none",

    fontSize: "14px",

    fontWeight: "500",

    background: "#fff",

    color: "#111827",

    lineHeight: "1.6",
  }}
/>

        <button
  onClick={sendMessage}

  style={{
    width: "100%",

    height: "48px",

    marginTop: "14px",

    border: "none",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",

    color: "#fff",

    fontWeight: "800",

    fontSize: "14px",

    cursor: "pointer",

    display: "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    gap: "8px",

    boxShadow:
      "0 10px 25px rgba(79,70,229,0.25)",

    transition:
      "all 0.25s ease",
  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.opacity =
      "0.95";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.opacity =
      "1";

  }}
>

  <FaPaperPlane />

  Envoyer à tous les clients

</button>

      </div>

      {messages.length > 0 && (

  <div
    style={{
      marginTop: "20px",
    }}
  >

    <h3
      style={{
        fontSize: "16px",

        fontWeight: "800",

        color: "#111827",

        marginBottom: "12px",
      }}
    >
      Messages envoyés
    </h3>

    {messages.map((msg) => (

      <div
        key={msg.id}

        style={{
          background: "#f8fafc",

          border:
            "1px solid #e5e7eb",

          borderRadius: "16px",

          padding: "14px",

          marginBottom: "10px",
        }}
      >

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "8px",

            marginBottom: "8px",
          }}
        >

          <FaEnvelope
            style={{
              color: "#4f46e5",
            }}
          />

          <strong
            style={{
              color: "#111827",
            }}
          >
            {msg.title}
          </strong>

        </div>

        <p
          style={{
            margin: 0,

            color: "#4b5563",

            fontSize: "13px",

            lineHeight: "1.6",
          }}
        >
          {msg.message}
        </p>

        <div
          style={{
            marginTop: "10px",

            fontSize: "11px",

            color: "#9ca3af",
          }}
        >
          {msg.date}
        </div>

      </div>

    ))}

  </div>

)}

    </div>

  );

}

export default AdminMessages;