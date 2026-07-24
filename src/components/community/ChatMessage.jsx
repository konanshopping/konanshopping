import { useState } from "react";

import {
  FaUserShield,
  FaStore,
  FaCheckCircle,
  FaEllipsisV,
  FaReply
} from "react-icons/fa";

function ChatMessage({

  message,

  currentUser,

  onReply,

  onMenu,

  onReaction

}) {

  const isMine =
    message.senderId === currentUser?._id;

  const [showReactions,
    setShowReactions] =
    useState(false);

  const reactions = [
    "👍",
    "❤️",
    "😂",
    "😮",
    "😢",
    "🔥"
  ];

  return (

    <div
      style={{
        display: "flex",
        justifyContent:
          isMine
            ? "flex-end"
            : "flex-start",
        padding: "10px 14px",
        position: "relative"
      }}

      onContextMenu={(e) => {

        e.preventDefault();

        setShowReactions(
          !showReactions
        );

      }}

      onTouchStart={() => {

        const timer =
          setTimeout(() => {

            setShowReactions(
              true
            );

          }, 500);

        return () =>
          clearTimeout(timer);

      }}

    >

      {/* Barre des réactions */}

      {showReactions && (

        <div
          style={{
            position: "absolute",
            top: -12,
            left: isMine ? "auto" : 60,
            right: isMine ? 20 : "auto",
            background: "#FFFFFF",
            borderRadius: 30,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,.15)",
            zIndex: 100
          }}
        >

          {reactions.map((emoji) => (

            <button

              key={emoji}

              onClick={() => {

                onReaction?.(
                  message,
                  emoji
                );

                setShowReactions(
                  false
                );

              }}

              style={{

                border: "none",

                background: "transparent",

                fontSize: 24,

                cursor: "pointer"

              }}

            >

              {emoji}

            </button>

          ))}

        </div>

      )}

      <div
        style={{
          display: "flex",
          flexDirection:
            isMine
              ? "row-reverse"
              : "row",
          alignItems: "flex-end",
          gap: 12,
          maxWidth: "100%"
        }}
      >

        {/* Avatar */}

        {!isMine && (

          <img

            src={
              message.avatar ||
              "/avatar.png"
            }

            alt="avatar"

            style={{

              width: 46,

              height: 46,

              borderRadius: "50%",

              objectFit: "cover",

              border:
                "3px solid #FFFFFF",

              boxShadow:
                "0 6px 18px rgba(91,46,145,.18)"

            }}

          />

        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "80%"
          }}
        >

          {!isMine && (

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
                flexWrap: "wrap"
              }}
            >

              <strong
                style={{
                  color: "#5B2E91",
                  fontSize: 15
                }}
              >

                {message.senderName}

              </strong>

              {message.role ===
                "admin" && (

                <FaUserShield
                  color="#5B2E91"
                />

              )}

              {message.role ===
                "seller" && (

                <FaStore
                  color="#F97316"
                />

              )}

              {message.verified && (

                <FaCheckCircle
                  color="#22C55E"
                />

              )}

            </div>

          )}

          {/* ==========================
              MESSAGE RÉPONDU
          ========================== */}

          {message.replyTo && (

            <div
              style={{
                background: "#F3E8FF",
                borderLeft: "4px solid #5B2E91",
                borderRadius: 16,
                padding: "10px 12px",
                marginBottom: 8
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 4
                }}
              >

                <FaReply
                  color="#5B2E91"
                  size={12}
                />

                <strong
                  style={{
                    color: "#5B2E91",
                    fontSize: 13
                  }}
                >
                  {message.replyTo.senderName}
                </strong>

              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {message.replyTo.text}
              </div>

            </div>

          )}

          {/* ==========================
              BULLE
          ========================== */}

          <div
            style={{

              background: isMine
                ? "linear-gradient(135deg,#5B2E91,#7C3AED)"
                : "#FFFFFF",

              color: isMine
                ? "#FFFFFF"
                : "#111827",

              borderRadius: isMine
                ? "22px 22px 8px 22px"
                : "22px 22px 22px 8px",

              padding: 16,

              border: isMine
                ? "none"
                : "1px solid #ECECEC",

              boxShadow:
                "0 8px 25px rgba(91,46,145,.12)",

              wordBreak: "break-word",

              overflow: "hidden"

            }}
          >

            {message.text && (

              <div
                style={{
                  fontSize: 15,
                  lineHeight: "24px",
                  whiteSpace: "pre-wrap"
                }}
              >
                {message.text}
              </div>

            )}

            {/* IMAGE */}

            {message.image && (

              <img

                src={message.image}

                alt="message"

                style={{

                  width: "100%",

                  marginTop: 12,

                  borderRadius: 18,

                  maxHeight: 320,

                  objectFit: "cover",

                  cursor: "pointer"

                }}

              />

            )}

            {/* VIDEO */}

            {message.video && (

              <video

                controls

                style={{

                  width: "100%",

                  marginTop: 12,

                  borderRadius: 18

                }}

              >

                <source
                  src={message.video}
                />

              </video>

            )}

            {/* DOCUMENT */}

            {message.file && (

              <a

                href={message.file.url}

                target="_blank"

                rel="noreferrer"

                style={{

                  marginTop: 12,

                  padding: 14,

                  borderRadius: 16,

                  background: isMine
                    ? "rgba(255,255,255,.18)"
                    : "#F3F4F6",

                  display: "flex",

                  alignItems: "center",

                  gap: 12,

                  color: isMine
                    ? "#FFFFFF"
                    : "#111827",

                  textDecoration: "none",

                  fontWeight: 700

                }}

              >

                <FaFileAlt
                  size={18}
                />

                <span>

                  {message.file.name}

                </span>

              </a>

            )}

          </div>

          {/* ==========================
              RÉACTIONS DU MESSAGE
          ========================== */}

          {message.reactions &&
            message.reactions.length > 0 && (

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 10
              }}
            >

              {message.reactions.map((reaction, index) => (

                <div

                  key={index}

                  style={{

                    display: "flex",

                    alignItems: "center",

                    gap: 5,

                    background: "#FFFFFF",

                    border: "1px solid #E5E7EB",

                    borderRadius: 20,

                    padding: "4px 10px",

                    boxShadow:
                      "0 2px 8px rgba(0,0,0,.08)"

                  }}

                >

                  <span
                    style={{
                      fontSize: 16
                    }}
                  >
                    {reaction.emoji}
                  </span>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6B7280"
                    }}
                  >
                    {reaction.count}
                  </span>

                </div>

              ))}

            </div>

          )}

          {/* ==========================
              ACTIONS
          ========================== */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10
            }}
          >

            <button

              onClick={() =>
                onReply?.(message)
              }

              style={{

                border: "none",

                background: "transparent",

                color: "#5B2E91",

                fontWeight: 700,

                display: "flex",

                alignItems: "center",

                gap: 6,

                cursor: "pointer"

              }}

            >

              <FaReply />

              Répondre

            </button>

            <button

              onClick={(e) =>
                onMenu?.(
                  e,
                  message
                )
              }

              style={{

                width: 38,

                height: 38,

                borderRadius: "50%",

                border: "none",

                background: "#F3F4F6",

                color: "#6B7280",

                cursor: "pointer",

                display: "flex",

                justifyContent: "center",

                alignItems: "center"

              }}

            >

              <FaEllipsisV />

            </button>

          </div>

          {/* ==========================
              HEURE + STATUT
          ========================== */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
              fontSize: 11,
              color: isMine
                ? "rgba(255,255,255,.85)"
                : "#9CA3AF"
            }}
          >

            <span>
              {message.time}
            </span>

            {isMine && (

              message.seen ? (

                <FaCheckDouble
                  style={{
                    color: "#22C55E",
                    fontSize: 12
                  }}
                />

              ) : (

                <FaCheck
                  style={{
                    fontSize: 12
                  }}
                />

              )

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default ChatMessage;