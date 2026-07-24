import { useState } from "react";

import {
  FaPlus,
  FaSmile,
  FaPaperPlane,
  FaMicrophone,
  FaImage,
  FaCamera,
  FaVideo,
  FaFileAlt,
  FaMapMarkerAlt,
  FaPoll,
  FaGift,
  FaHeadphones
} from "react-icons/fa";

function MessageInput({

  onSend,

  onImage,

  onCamera,

  onVideo,

  onFile,

  onVoice,

  onLocation,

  onPoll,

  onGift,

  onAudio

}) {

  const [text, setText] =
    useState("");

  const [showMenu,
    setShowMenu] =
    useState(false);

  const sendMessage = () => {

    if (!text.trim()) return;

    onSend(text);

    setText("");

    setShowMenu(false);

  };

  return (

    <>

      {/* MENU D'ACTIONS */}

      {showMenu && (

        <div
          style={{

            margin: "0 14px 12px",

            background: "#FFFFFF",

            borderRadius: "28px",

            padding: "22px",

            boxShadow:
              "0 15px 40px rgba(0,0,0,.12)",

            animation:
              "menuUp .25s ease"

          }}
        >

          <div
            style={{

              display: "grid",

              gridTemplateColumns:
                "repeat(5,1fr)",

              gap: "22px"

            }}
          >

            {/* PHOTO */}

          <ActionButton
            icon={<FaImage />}
            label="Photo"
            color="#6366F1"
            onClick={onImage}
          />

          {/* CAMÉRA */}

          <ActionButton
            icon={<FaCamera />}
            label="Caméra"
            color="#EC4899"
            onClick={onCamera}
          />

          {/* VIDÉO */}

          <ActionButton
            icon={<FaVideo />}
            label="Vidéo"
            color="#F97316"
            onClick={onVideo}
          />

          {/* DOCUMENT */}

          <ActionButton
            icon={<FaFileAlt />}
            label="Document"
            color="#22C55E"
            onClick={onFile}
          />

          {/* LOCALISATION */}

          <ActionButton
            icon={<FaMapMarkerAlt />}
            label="Position"
            color="#F59E0B"
            onClick={onLocation}
          />

          {/* SONDAGE */}

          <ActionButton
            icon={<FaPoll />}
            label="Sondage"
            color="#8B5CF6"
            onClick={onPoll}
          />

          {/* AUDIO */}

          <ActionButton
            icon={<FaHeadphones />}
            label="Audio"
            color="#2563EB"
            onClick={onAudio}
          />

          {/* CADEAU */}

          <ActionButton
            icon={<FaGift />}
            label="Cadeau"
            color="#EC4899"
            onClick={onGift}
          />

        </div>

      </div>

      )}

            {/* BARRE FLOTTANTE */}

      <div
        style={{
          margin: "0 12px 12px",
          background: "#FFFFFF",
          borderRadius: 35,
          boxShadow:
            "0 10px 35px rgba(0,0,0,.12)",
          display: "flex",
          alignItems: "center",
          padding: "8px",
          gap: 8
        }}
      >

        {/* PLUS */}

        <button
          onClick={() =>
            setShowMenu(!showMenu)
          }
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "none",
            background: "#F3F4F6",
            color: "#2563EB",
            fontSize: 20,
            cursor: "pointer"
          }}
        >
          <FaPlus />
        </button>

        {/* CHAMP */}

        <input
          type="text"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Écrivez un message..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 15,
            background: "transparent",
            padding: "0 10px"
          }}
        />

        {/* EMOJI */}

        <button
          style={{
            border: "none",
            background: "transparent",
            color: "#6B7280",
            fontSize: 22,
            cursor: "pointer"
          }}
        >
          <FaSmile />
        </button>


{/* MICRO OU ENVOYER */}

        {text.trim() ? (

          <button
            onClick={sendMessage}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: "#2563EB",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontSize: 18
            }}
          >
            <FaPaperPlane />
          </button>

        ) : (

          <button
            onClick={onVoice}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: "#10B981",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontSize: 18
            }}
          >
            <FaMicrophone />
          </button>

        )}

      </div>

    </>

  );

}

function ActionButton({

  icon,

  label,

  color,

  onClick

}) {

  return (

    <button
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        cursor: "pointer"
      }}
    >

      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: color,
          color: "#FFFFFF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 22
        }}
      >
        {icon}
      </div>

      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#374151"
        }}
      >
        {label}
      </span>

    </button>

  );

}

export default MessageInput;
