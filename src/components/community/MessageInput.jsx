import {
  useState,
  useRef,
  useEffect
} from "react";

import {

  FaPlus,

  FaSmile,

  FaPaperPlane,

  FaMicrophone,

  FaTimes,

  FaImage,

  FaCamera,

  FaVideo,

  FaFileAlt,

  FaMapMarkerAlt,

  FaPoll,

  FaGift,

  FaHeadphones,

  FaUser

} from "react-icons/fa";

function MessageInput({

  onSend,

  onImage,

  onVideo,

  onFile,

  onVoice,

  onCamera,

  onLocation,

  onPoll,

  onGift,

  onContact

}) {

  const [text, setText] =
    useState("");

  const [menuOpen,
    setMenuOpen] =
    useState(false);

  const [recording,
    setRecording] =
    useState(false);

  const [emojiOpen,
    setEmojiOpen] =
    useState(false);

  const imageRef =
    useRef(null);

  const videoRef =
    useRef(null);

  const fileRef =
    useRef(null);

  const mediaRecorder =
    useRef(null);

  const chunks =
    useRef([]);

  const emojis = [

    "😀","😁","😂","🤣","😊",

    "😍","😘","😎","🤩","😭",

    "😡","😮","👍","👏","🙏",

    "🔥","❤️","💙","🎉","💯",

    "😇","🤝","😅","🥳"

  ];

  const sendMessage = () => {

    if (!text.trim()) return;

    onSend(text);

    setText("");

    setEmojiOpen(false);

    setMenuOpen(false);

  };

  useEffect(() => {

    if (!recording) return;

    navigator.mediaDevices

      .getUserMedia({

        audio: true

      })

      .then((stream) => {

        const recorder =
          new MediaRecorder(stream);

        mediaRecorder.current =
          recorder;

        chunks.current = [];

        recorder.ondataavailable =
          (e) => {

            chunks.current.push(
              e.data
            );

          };

        recorder.onstop = () => {

          const blob =
            new Blob(
              chunks.current,
              {
                type:
                  "audio/webm"
              }
            );

          onVoice?.(blob);

          stream
            .getTracks()
            .forEach(track =>
              track.stop()
            );

        };

        recorder.start();

      });

  }, [recording]);

  const stopRecording = () => {

    if (
      mediaRecorder.current
    ) {

      mediaRecorder.current.stop();

    }

    setRecording(false);

  };

  return (

    <>

      <input

        ref={imageRef}

        hidden

        type="file"

        accept="image/*"

        onChange={(e)=>{

          const file =
            e.target.files?.[0];

          if(file){

            onImage?.(file);

          }

        }}

      />

      <input

        ref={videoRef}

        hidden

        type="file"

        accept="video/*"

        onChange={(e)=>{

          const file =
            e.target.files?.[0];

          if(file){

            onVideo?.(file);

          }

        }}

      />

      <input

        ref={fileRef}

        hidden

        type="file"

        onChange={(e)=>{

          const file =
            e.target.files?.[0];

          if(file){

            onFile?.(file);

          }

        }}

      />

      {/* ==========================
          OVERLAY
      ========================== */}

      {menuOpen && (

        <div

          onClick={() => setMenuOpen(false)}

          style={{

            position: "fixed",

            inset: 0,

            background: "rgba(0,0,0,.28)",

            backdropFilter: "blur(3px)",

            zIndex: 998

          }}

        />

      )}

      {/* ==========================
          BOTTOM SHEET
      ========================== */}

      <div

        style={{

          position: "fixed",

          left: 0,

          right: 0,

          bottom: menuOpen ? 0 : "-420px",

          background: "#FFFFFF",

          borderTopLeftRadius: 28,

          borderTopRightRadius: 28,

          transition: ".35s",

          boxShadow: "0 -10px 35px rgba(0,0,0,.18)",

          zIndex: 999,

          padding: "18px"

        }}

      >

        <div

          style={{

            width: 50,

            height: 5,

            background: "#D1D5DB",

            borderRadius: 20,

            margin: "0 auto 18px"

          }}

        />

        <div

          style={{

            display: "grid",

            gridTemplateColumns: "repeat(4,1fr)",

            gap: 20

          }}

        >

          <ActionButton
  icon={<FaImage />}
  label="Photo"
  color="#4F46E5"
  onClick={() => {
    imageRef.current?.click();
    setMenuOpen(false);
  }}
/>

<ActionButton
  icon={<FaCamera />}
  label="Caméra"
  color="#EC4899"
  onClick={() => {
    onCamera?.();
    setMenuOpen(false);
  }}
/>

<ActionButton
  icon={<FaVideo />}
  label="Vidéo"
  color="#F97316"
  onClick={() => {
    videoRef.current?.click();
    setMenuOpen(false);
  }}
/>

<ActionButton
  icon={<FaFileAlt />}
  label="Document"
  color="#22C55E"
  onClick={() => {
    fileRef.current?.click();
    setMenuOpen(false);
  }}
/>

<ActionButton
  icon={<FaMapMarkerAlt />}
  label="Position"
  color="#F59E0B"
  onClick={() => {
    onLocation?.();
    setMenuOpen(false);
  }}
/>

<ActionButton
  icon={<FaPoll />}
  label="Sondage"
  color="#8B5CF6"
  onClick={() => {
    onPoll?.();
    setMenuOpen(false);
  }}
/>

<ActionButton
  icon={<FaHeadphones />}
  label="Audio"
  color="#2563EB"
  onClick={() => {
    setRecording(true);
    setMenuOpen(false);
  }}
/>

<ActionButton
  icon={<FaGift />}
  label="Cadeau"
  color="#DB2777"
  onClick={() => {
    onGift?.();
    setMenuOpen(false);
  }}
/>

<ActionButton
  icon={<FaUser />}
  label="Contact"
  color="#0EA5E9"
  onClick={() => {
    onContact?.();
    setMenuOpen(false);
  }}
/>

        </div>
        </div>

    
      {/* ==========================
          BARRE FLOTTANTE
      ========================== */}

      <div

        style={{

          position: "sticky",

          bottom: 10,

          margin: "0 10px calc(env(safe-area-inset-bottom) + 8px)",

          background: "#FFFFFF",

          borderRadius: 32,

          boxShadow: "0 10px 30px rgba(0,0,0,.12)",

          display: "flex",

          alignItems: "center",

          padding: "6px",

          gap: 6,

          zIndex: 1000

        }}

      >

        {/* PLUS */}

        <button

          onClick={() => setMenuOpen(!menuOpen)}

          style={{

            width: 42,

            height: 42,

            borderRadius: "50%",

            border: "none",

            background: "#EEF2FF",

            color: "#2563EB",

            cursor: "pointer",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            fontSize: 18

          }}

        >

          {menuOpen ? <FaTimes /> : <FaPlus />}

        </button>

        {/* CHAMP */}

        <input

          value={text}

          onChange={(e)=>setText(e.target.value)}

          placeholder="Écrivez un message..."

          style={{

            flex: 1,

            border: "none",

            outline: "none",

            background: "transparent",

            fontSize: 15,

            padding: "0 8px"

          }}

        />

        {/* EMOJI */}

        <button

          onClick={()=>setEmojiOpen(!emojiOpen)}

          style={{

            border: "none",

            background: "transparent",

            color: "#6B7280",

            fontSize: 20,

            cursor: "pointer"

          }}

        >

          <FaSmile />

        </button>

        {emojiOpen && (

  <div
    style={{
      position: "absolute",
      bottom: 70,
      right: 16,
      width: 290,
      background: "#FFFFFF",
      borderRadius: 20,
      padding: 12,
      boxShadow: "0 10px 30px rgba(0,0,0,.18)",
      display: "grid",
      gridTemplateColumns: "repeat(6,1fr)",
      gap: 10
    }}
  >

    {emojis.map((emoji) => (

      <button
        key={emoji}
        onClick={() => {
          setText((prev) => prev + emoji);
          setEmojiOpen(false);
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

{/* MICRO OU ENVOYER */}

        {text.trim() ? (

          <button
            onClick={sendMessage}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(135deg,#2563EB,#5B2E91)",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 17,
              boxShadow: "0 8px 20px rgba(37,99,235,.35)"
            }}
          >
            <FaPaperPlane />
          </button>

        ) : (

          <button
            onMouseDown={() => setRecording(true)}
            onMouseUp={stopRecording}
            onTouchStart={() => setRecording(true)}
            onTouchEnd={stopRecording}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: recording
                ? "#EF4444"
                : "#10B981",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 17,
              boxShadow: "0 8px 20px rgba(16,185,129,.35)"
            }}
          >
            <FaMicrophone />
          </button>

        )}

      </div>

    </>

  );

}

/* ==========================
   ACTION BUTTON
========================== */

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
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: 20,
          boxShadow: "0 8px 18px rgba(0,0,0,.15)"
        }}
      >
        {icon}
      </div>

      <span
        style={{
          fontSize: 12,
          color: "#374151",
          fontWeight: 600,
          textAlign: "center"
        }}
      >
        {label}
      </span>

    </button>

  );

}

export default MessageInput;