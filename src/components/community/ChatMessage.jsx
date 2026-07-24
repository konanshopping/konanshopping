import {
  FaUserShield,
  FaStore,
  FaCheck,
  FaCheckDouble,
  FaEllipsisV
} from "react-icons/fa";

import {
  FaReply,
  FaImage,
  FaVideo,
  FaFileAlt
} from "react-icons/fa";

function ChatMessage({

  message,

  currentUser,

  onMenu,

  onReply

}) {

  const isMine =
    message.senderId === currentUser?._id;

  return (

    <div
      style={{
        display: "flex",

        justifyContent:
          isMine
            ? "flex-end"
            : "flex-start",

        padding: "8px 14px"
      }}
    >

      <div
        style={{
          display: "flex",

          flexDirection:
            isMine
              ? "row-reverse"
              : "row",

          alignItems: "flex-end",

          gap: "10px",

          width: "100%",

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

              width: 42,

              height: 42,

              borderRadius: "50%",

              objectFit: "cover",

              flexShrink: 0

            }}

          />

        )}

        {/* Contenu */}

        <div
          style={{
            maxWidth: "78%",

            display: "flex",

            flexDirection: "column"
          }}
        >

          {/* En-tête */}

          {!isMine && (

            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: 6,

                marginBottom: 5,

                flexWrap: "wrap"
              }}
            >

              <span
                style={{
                  fontWeight: 700,

                  fontSize: 14,

                  color: "#111827"
                }}
              >

                {message.senderName}

              </span>

              {message.role ===
                "admin" && (

                <FaUserShield
                  style={{
                    color: "#2563EB",
                    fontSize: 13
                  }}
                />

              )}

              {message.role ===
                "seller" && (

                <FaStore
                  style={{
                    color: "#10B981",
                    fontSize: 13
                  }}
                />

              )}

              <span
                style={{
                  fontSize: 11,

                  color: "#9CA3AF"
                }}
              >

                {message.time}

              </span>

            </div>

          )}

          {/* Message répondu */}

{message.replyTo && (

  <div
    style={{
      background: "#F8FAFC",
      borderLeft: "4px solid #2563EB",
      borderRadius: "14px",
      padding: "12px",
      marginBottom: "10px"
    }}
  >

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 6
      }}
    >

      <FaReply
        style={{
          color: "#2563EB",
          fontSize: 12
        }}
      />

      <span
        style={{
          fontWeight: 700,
          color: "#2563EB",
          fontSize: 13
        }}
      >
        {message.replyTo.senderName}
      </span>

    </div>

    <div
      style={{
        color: "#6B7280",
        fontSize: 13,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}
    >
      {message.replyTo.text}
    </div>

  </div>

)}

{/* Bulle */}

<div
  style={{
    background: isMine ? "#2563EB" : "#FFFFFF",
    color: isMine ? "#FFFFFF" : "#111827",
    borderRadius: isMine
      ? "20px 20px 6px 20px"
      : "20px 20px 20px 6px",
    padding: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
    border: isMine ? "none" : "1px solid #E5E7EB",
    wordBreak: "break-word"
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

  {message.image && (

    <div style={{ marginTop: 12 }}>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 600,
          color: isMine ? "#fff" : "#374151"
        }}
      >
        <FaImage />
        Image
      </div>

      <img
        src={message.image}
        alt="message"
        style={{
          width: "100%",
          borderRadius: 14,
          objectFit: "cover",
          maxHeight: 320
        }}
      />

    </div>

  )}

  {message.video && (

    <div style={{ marginTop: 12 }}>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 600,
          color: isMine ? "#fff" : "#374151"
        }}
      >
        <FaVideo />
        Vidéo
      </div>

      <video
        controls
        style={{
          width: "100%",
          borderRadius: 14
        }}
      >
        <source src={message.video} />
      </video>

    </div>

  )}

  {message.file && (

    <a
      href={message.file.url}
      target="_blank"
      rel="noreferrer"
      style={{
        marginTop: 12,
        padding: "12px",
        borderRadius: 14,
        background: isMine
          ? "rgba(255,255,255,.15)"
          : "#F3F4F6",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: isMine ? "#fff" : "#111827",
        textDecoration: "none",
        fontWeight: 600
      }}
    >

      <FaFileAlt
        style={{
          fontSize: 18,
          flexShrink: 0
        }}
      />

      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {message.file.name}
      </span>

    </a>

  )}

</div>

{/* Bas du message */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
              gap: 10,
              flexWrap: "wrap"
            }}
          >

            {/* Réactions */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap"
              }}
            >

              {["👍", "❤️", "😂", "😮", "😢", "🔥"].map(
                (emoji) => (

                  <button
                    key={emoji}
                    style={{
                      border: "none",
                      background: "#F3F4F6",
                      borderRadius: "50%",
                      width: 34,
                      height: 34,
                      cursor: "pointer",
                      fontSize: 17,
                      transition: ".2s"
                    }}
                  >
                    {emoji}
                  </button>

                )
              )}

            </div>

            {/* Actions */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >

              <button
                onClick={() => onReply(message)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: isMine ? "#fff" : "#2563EB",
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                Répondre
              </button>

              <button
                onClick={(e) => onMenu(e, message)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: isMine ? "#fff" : "#6B7280",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <FaEllipsisV />
              </button>

            </div>

          </div>

          {/* Heure + Statut */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 5,
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

              message.seen ?

                <FaCheckDouble
                  style={{
                    color: "#22C55E",
                    fontSize: 11
                  }}
                />

              :

                <FaCheck
                  style={{
                    fontSize: 11
                  }}
                />

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default ChatMessage;