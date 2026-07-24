import { useState } from "react";

import {
  FaSmile,
  FaPaperclip,
  FaImage,
  FaMicrophone,
  FaPaperPlane
} from "react-icons/fa";

function MessageInput({

  onSend,

  onImage,

  onFile,

  onVoice

}) {

  const [text, setText] =
    useState("");

  const sendMessage = () => {

    if (!text.trim()) return;

    onSend(text);

    setText("");

  };

  return (

    <div
      style={{
        position: "sticky",
        bottom: 0,
        background: "#fff",
        borderTop: "1px solid #E5E7EB",
        padding: "10px 12px",
        display: "flex",
        alignItems: "flex-end",
        gap: "10px",
        zIndex: 100
      }}
    >

      <button
        style={{
          border: "none",
          background: "transparent",
          fontSize: 22,
          color: "#6B7280",
          cursor: "pointer"
        }}
      >
        <FaSmile />
      </button>

      <button
        onClick={onImage}
        style={{
          border: "none",
          background: "transparent",
          fontSize: 20,
          color: "#2563EB",
          cursor: "pointer"
        }}
      >
        <FaImage />
      </button>

      <button
        onClick={onFile}
        style={{
          border: "none",
          background: "transparent",
          fontSize: 20,
          color: "#6B7280",
          cursor: "pointer"
        }}
      >
        <FaPaperclip />
      </button>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Écrire un message..."
        rows={1}
        style={{
          flex: 1,
          resize: "none",
          border: "none",
          outline: "none",
          background: "#F3F4F6",
          borderRadius: 22,
          padding: "12px 16px",
          fontSize: 15,
          maxHeight: 120,
          overflowY: "auto"
        }}
      />

      {text.trim() ? (

        <button
          onClick={sendMessage}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            background: "#2563EB",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18
          }}
        >
          <FaPaperPlane />
        </button>

      ) : (

        <button
          onClick={onVoice}
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            background: "#10B981",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18
          }}
        >
          <FaMicrophone />
        </button>

      )}

    </div>

  );

}

export default MessageInput;