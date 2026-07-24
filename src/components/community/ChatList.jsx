import {
  useEffect,
  useRef
} from "react";

import ChatMessage from "./ChatMessage";

function ChatList({

  messages,

  currentUser,

  onMenu,

  onReply

}) {

  const bottomRef =
    useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({

      behavior: "smooth"

    });

  }, [messages]);

  const safeMessages = Array.isArray(messages)
  ? messages
  : [];

  return (

    <div
      style={{

        flex: 1,

        display: "flex",

        flexDirection: "column",

        paddingBottom: "20px",

        overflowY: "auto",

        WebkitOverflowScrolling:
          "touch",

        background: "#F4F7FB"

      }}
    >

      {safeMessages.length === 0 && (

        <div
          style={{

            display: "flex",

            flexDirection: "column",

            justifyContent: "center",

            alignItems: "center",

            padding: "70px 20px",

            color: "#6B7280"

          }}
        >

          <div
            style={{
              fontSize: 60
            }}
          >
            💬
          </div>

          <h3
            style={{
              marginTop: 18
            }}
          >
            Aucun message
          </h3>

          <p
            style={{
              textAlign: "center",
              lineHeight: "24px",
              maxWidth: 320
            }}
          >
            Soyez le premier à lancer la discussion dans la communauté.
          </p>

        </div>

      )}

      {safeMessages.map((message) => (

        <ChatMessage

          key={message._id}

          message={message}

          currentUser={currentUser}

          onMenu={onMenu}

          onReply={onReply}

        />

      ))}

      <div ref={bottomRef} />

    </div>

  );

}

export default ChatList;