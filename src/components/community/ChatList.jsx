import {
  useEffect,
  useMemo,
  useRef
} from "react";

import ChatMessage from "./ChatMessage";

function ChatList({

  messages = [],

  currentUser,

  onMenu,

  onReply,

  onReaction

}) {

  const bottomRef = useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({

      behavior: "smooth"

    });

  }, [messages]);

  const safeMessages = useMemo(() => {

    return Array.isArray(messages)
      ? messages
      : [];

  }, [messages]);

  const formatDate = (date) => {

    const d = new Date(date);

    const today = new Date();

    const yesterday = new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    if (
      d.toDateString() ===
      today.toDateString()
    ) {

      return "Aujourd'hui";

    }

    if (
      d.toDateString() ===
      yesterday.toDateString()
    ) {

      return "Hier";

    }

    return d.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

  };

  let lastDate = "";

  return (

    <div
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#F5F7FB",
        padding: "12px 0 20px",
        WebkitOverflowScrolling: "touch"
      }}
    >

      {safeMessages.length === 0 && (

        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
            color: "#6B7280"
          }}
        >

          <div
            style={{
              fontSize: 70
            }}
          >
            💬
          </div>

          <h2
            style={{
              marginTop: 15,
              color: "#5B2E91"
            }}
          >
            Aucun message
          </h2>

          <p
            style={{
              maxWidth: 320,
              textAlign: "center",
              lineHeight: "24px"
            }}
          >
            Soyez le premier à envoyer un message
            dans la communauté KONAN SHOPPING.
          </p>

        </div>

      )}

      {safeMessages.map((message) => {

        const currentDate =
          formatDate(
            message.createdAt ||
            message.date ||
            new Date()
          );

        const showDate =
          currentDate !== lastDate;

        lastDate = currentDate;

        return (

          <div
            key={message._id || message.id || `${message.createdAt}-${message.sender}`}
            style={{
              animation:
                "fadeMessage .25s ease"
            }}
          >

            {showDate && (

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "16px 0"
                }}
              >

                <div
                  style={{
                    background: "#E5E7EB",
                    color: "#374151",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: 30
                  }}
                >
                  {currentDate}
                </div>

              </div>

            )}

            <ChatMessage

              message={message}

              currentUser={currentUser}

              onMenu={onMenu}

              onReply={onReply}

              onReaction={onReaction}

            />

          </div>

        );

      })}

      <div ref={bottomRef} />

      <style>

        {`

          @keyframes fadeMessage{

            from{

              opacity:0;

              transform:translateY(15px);

            }

            to{

              opacity:1;

              transform:translateY(0);

            }

          }

        `}

      </style>

    </div>

  );

}

export default ChatList;