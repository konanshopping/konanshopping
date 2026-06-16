import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaEnvelope,
  FaBell,
  FaClock,
} from "react-icons/fa";

function Message() {

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchMessages();

  }, []);

  const fetchMessages =
    async () => {

      try {

        const res =
          await axios.get(
            "https://konanshopping-production.up.railway.app/api/messages"
          );

        setMessages(
          res.data
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

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
              width: "52px",
              height: "52px",
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
              centre de messages
            </h1>

            <p
              style={{
                margin: "4px 0 0",
                opacity: 0.9,
                fontSize: "13px",
              }}
            >
              Notifications officielles
              Konan Shopping
            </p>

          </div>

        </div>

      </div>

      {loading && (

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#6b7280",
          }}
        >
          Chargement...
        </div>

      )}

      {!loading &&
        messages.length === 0 && (

        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "30px",
            marginTop: "20px",
            textAlign: "center",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.05)",
          }}
        >

          <FaBell
            style={{
              fontSize: "42px",
              color: "#c7d2fe",
            }}
          />

          <h3
            style={{
              color: "#111827",
            }}
          >
            Aucun message
          </h3>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Vous n'avez reçu
            aucune notification.
          </p>

        </div>

      )}

      {messages.map((msg) => (

        <div
          key={msg._id}
          style={{
            background: "#fff",
            marginTop: "16px",
            borderRadius: "22px",
            padding: "18px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.05)",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
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
                fontSize: "15px",
              }}
            >
              {msg.title}
            </strong>

          </div>

          <p
            style={{
              color: "#4b5563",
              fontSize: "14px",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            {msg.content}
          </p>

          <div
            style={{
              marginTop: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#9ca3af",
              fontSize: "12px",
            }}
          >

            <FaClock />

            {new Date(
              msg.createdAt
            ).toLocaleString()}

          </div>

        </div>

      ))}

    </div>

  );

}

export default Message;