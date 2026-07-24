import {
  useState,
  useEffect,
  useRef
} from "react";

import {
  FaBullhorn,
  FaThumbtack,
  FaCheckCircle,
  FaTimes
} from "react-icons/fa";

import axios from "axios";

import { io } from "socket.io-client";

import CommunityHeader from "../components/community/CommunityHeader";
import CommunityTabs from "../components/community/CommunityTabs";
import PinnedMessage from "../components/community/PinnedMessage";
import ChatList from "../components/community/ChatList";
import MessageInput from "../components/community/MessageInput";
import CommunityMenu from "../components/community/CommunityMenu";
import Members from "../components/community/Members";
import Media from "../components/community/Media";
import Files from "../components/community/Files";
import Polls from "../components/community/Polls";

function Community() {

  /* ==========================
     SOCKET
  ========================== */

  const socket = useRef(null);

  /* ==========================
     COMMUNITY
  ========================== */

  const [community, setCommunity] =
    useState(null);

  const [announcement, setAnnouncement] =
    useState(null);

    const [showPinned, setShowPinned] = useState(false);
  /* ==========================
     USER
  ========================== */

  const [currentUser, setCurrentUser] =
    useState(null);

  const [onlineUsers, setOnlineUsers] =
    useState(0);

  const [members, setMembers] =
    useState([]);

  /* ==========================
     CHAT
  ========================== */

  const [messages, setMessages] =
    useState([]);

  const [replyMessage, setReplyMessage] =
    useState(null);

  /* ==========================
     MEDIA
  ========================== */

  const [media, setMedia] =
    useState([]);

  /* ==========================
     FILES
  ========================== */

  const [files, setFiles] =
    useState([]);

  /* ==========================
     POLLS
  ========================== */

  const [polls, setPolls] =
    useState([]);

  /* ==========================
     UI
  ========================== */

  const [activeTab, setActiveTab] =
    useState("discussion");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  /* ==========================
     SOCKET CONNECTION
  ========================== */

  useEffect(() => {

    socket.current = io(
      import.meta.env.VITE_API_URL
    );

    return () => {

      socket.current.disconnect();

    };

  }, []);

  /* ==========================
     LOAD DATA
  ========================== */

  useEffect(() => {

    loadCommunity();
    loadCurrentUser();
    loadMembers();
    loadMessages();
    loadMedia();
    loadFiles();
    loadPolls();

  }, []);

  async function loadCommunity() {

    try {

      const { data } =
        await axios.get("/api/community");

      setCommunity(data.community);
      setAnnouncement(data.announcement);

    } catch (err) {

      console.log(err);

    }

  }

  async function loadCurrentUser() {

    try {

      const token =
        localStorage.getItem("token");

      const { data } =
        await axios.get(
          "/api/users/me",
          {
            headers: {
              token
            }
          }
        );

      setCurrentUser(data.user);

    } catch (err) {

      console.log(err);

    }

  }

  async function loadMembers() {

    try {

      const { data } =
        await axios.get(
          "/api/community/members"
        );

      setMembers(data);

    } catch (err) {

      console.log(err);

    }

  }

  async function loadMessages() {

    try {

      const { data } =
        await axios.get(
          "/api/community/messages"
        );

      setMessages(data);

    } catch (err) {

      console.log(err);

    }

  }

  async function loadMedia() {

    try {

      const { data } =
        await axios.get(
          "/api/community/media"
        );

      setMedia(data);

    } catch (err) {

      console.log(err);

    }

  }

  async function loadFiles() {

    try {

      const { data } =
        await axios.get(
          "/api/community/files"
        );

      setFiles(data);

    } catch (err) {

      console.log(err);

    }

  }

  async function loadPolls() {

    try {

      const { data } =
        await axios.get(
          "/api/community/polls"
        );

      setPolls(data);

    } catch (err) {

      console.log(err);

    }

  }

  /* ==========================
     SOCKET EVENTS
  ========================== */

  useEffect(() => {

    if (!socket.current)
      return;

    socket.current.on(
      "onlineUsers",
      (count) => {

        setOnlineUsers(count);

      }
    );

    socket.current.on(
      "newMessage",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message
        ]);

      }
    );

    socket.current.on(
      "newMedia",
      (item) => {

        setMedia((prev) => [
          item,
          ...prev
        ]);

      }
    );

    socket.current.on(
      "newFile",
      (file) => {

        setFiles((prev) => [
          file,
          ...prev
        ]);

      }
    );

    socket.current.on(
      "pollUpdated",
      (updatedPoll) => {

        setPolls((prev) =>
          prev.map((poll) =>
            poll._id === updatedPoll._id
              ? updatedPoll
              : poll
          )
        );

      }
    );

    return () => {

      socket.current.off("onlineUsers");
      socket.current.off("newMessage");
      socket.current.off("newMedia");
      socket.current.off("newFile");
      socket.current.off("pollUpdated");

    };

  }, []);

  /* ==========================
     ACTIONS
  ========================== */

  async function sendMessage(text) {

  if (!text.trim()) return;

  const message = {

    _id: Date.now().toString(),

    senderName: currentUser?.name || "Client",

    text,

    time: new Date().toLocaleTimeString(),

  };

  // Affichage immédiat
  setMessages((prev) => [...prev, message]);

  // Envoi aux autres utilisateurs via Socket.IO
  socket.current.emit("sendMessage", message);

}

  function replyMessageHandler(message) {

    setReplyMessage(message);

  }

  function openMenu() {

    setMenuOpen(true);

  }

  function closeMenu() {

    setMenuOpen(false);

  }

  function previewFile(file) {

    console.log(file);

  }

  function downloadFile(file) {

    console.log(file);

  }

  function votePoll(
    pollId,
    optionIndex
  ) {

    console.log(
      pollId,
      optionIndex
    );

  }

  useEffect(() => {

    setLoading(false);

  }, []);

  if (loading) {

    return (

      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "#F4F7FB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 18,
          fontWeight: 700,
          color: "#2563EB"
        }}
      >
        Chargement...
      </div>

    );

  }

  return (

    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F4F7FB",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >

      {/* HEADER */}

      <CommunityHeader
        community={community}
        onlineUsers={onlineUsers}
        openMenu={openMenu}
      />

      {/* TABS */}

      <CommunityTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* DISCUSSION */}

      {activeTab === "discussion" && (

        <>

   <PinnedMessage
  announcement={announcement}
  onClick={() => setShowPinned(true)}
/>

          <ChatList
            messages={messages}
            currentUser={currentUser}
            replyMessage={replyMessage}
            onReply={replyMessageHandler}
            onMenu={() => {}}
          />

        </>

      )}

      {/* MEMBRES */}

      {activeTab === "members" && (

        <Members
          members={members}
          currentUser={currentUser}
          onOpenProfile={(member) => {

            console.log(member);

          }}
          onMessage={(member) => {

            console.log(member);

          }}
        />

      )}

      {/* MÉDIAS */}

      {activeTab === "media" && (

        <Media
          media={media}
        />

      )}

      {/* FICHIERS */}

      {activeTab === "files" && (

        <Files
          files={files}
          onPreview={previewFile}
          onDownload={downloadFile}
        />

      )}

      {/* SONDAGES */}

      {activeTab === "polls" && (

        <Polls
          polls={polls}
          onVote={votePoll}
        />

      )}

      {/* BARRE DE SAISIE */}

      {activeTab === "discussion" && (

        <MessageInput

          onSend={sendMessage}

          replyMessage={replyMessage}

          onCancelReply={() =>

            setReplyMessage(null)

          }

          onImage={() => {

            console.log("Image");

          }}

          onFile={() => {

            console.log("Fichier");

          }}

          onVoice={() => {

            console.log("Message vocal");

          }}

        />

      )}

      {/* MENU LATÉRAL */}

      <CommunityMenu

        open={menuOpen}

        onClose={closeMenu}

        onSelect={(item) => {

          switch (item) {

            case "discussion":

              setActiveTab("discussion");

              break;

            case "members":

              setActiveTab("members");

              break;

            case "media":

              setActiveTab("media");

              break;

            case "files":

              setActiveTab("files");

              break;

            case "polls":

              setActiveTab("polls");

              break;

            case "announcements":

              setActiveTab("discussion");

              break;

            case "notifications":

              console.log("Notifications");

              break;

            case "profile":

              console.log("Profil");

              break;

            case "settings":

              console.log("Paramètres");

              break;

            case "rules":

              console.log("Règles");

              break;

            default:

              break;

          }

          closeMenu();

        }}

      />

{showPinned && (

  <div

    onClick={() => setShowPinned(false)}

    style={{

      position: "fixed",

      inset: 0,

      background: "rgba(15,23,42,.72)",

      backdropFilter: "blur(8px)",

      display: "flex",

      alignItems: "flex-end",

      justifyContent: "center",

      zIndex: 99999

    }}

  >

    <div

      onClick={(e) => e.stopPropagation()}

      style={{

        width: "100%",

        maxWidth: 600,

        maxHeight: "88vh",

        overflowY: "auto",

        background: "#FFFFFF",

        borderTopLeftRadius: 28,

        borderTopRightRadius: 28,

        boxShadow: "0 -15px 40px rgba(0,0,0,.25)",

        animation: "slideUp .25s ease",

        padding: 24

      }}

    >

      <div

        style={{

          width: 60,

          height: 6,

          background: "#D1D5DB",

          borderRadius: 20,

          margin: "0 auto 20px"

        }}

      />

      <div

        style={{

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          marginBottom: 20

        }}

      >

        <div

          style={{

            display: "flex",

            alignItems: "center",

            gap: 14

          }}

        >

          <div

            style={{

              width: 58,

              height: 58,

              borderRadius: 18,

              background:
                "linear-gradient(135deg,#2563EB,#5B2E91)",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              color: "#FFFFFF",

              fontSize: 24

            }}

          >

            <FaBullhorn />

          </div>

          <div>

            <div

              style={{

                display: "flex",

                alignItems: "center",

                gap: 8

              }}

            >

              <FaThumbtack color="#2563EB" />

              <span

                style={{

                  fontSize: 20,

                  fontWeight: 800,

                  color: "#111827"

                }}

              >

                Message épinglé

              </span>

              <FaCheckCircle color="#22C55E" />

            </div>

            <div

              style={{

                marginTop: 6,

                color: "#6B7280",

                fontSize: 13

              }}

            >

              {announcement?.author || "Administration"}

              {" • "}

              {announcement?.date || ""}

            </div>

          </div>

        </div>

        <button

          onClick={() => setShowPinned(false)}

          style={{

            border: "none",

            background: "#F3F4F6",

            width: 42,

            height: 42,

            borderRadius: "50%",

            cursor: "pointer",

            display: "flex",

            justifyContent: "center",

            alignItems: "center"

          }}

        >

          <FaTimes color="#374151" />

        </button>

      </div>

      <div

        style={{

          background: "#F8FAFC",

          border: "1px solid #E5E7EB",

          borderRadius: 20,

          padding: 20

        }}

      >

        <div

          style={{

            fontSize: 16,

            color: "#374151",

            lineHeight: "30px",

            whiteSpace: "pre-wrap",

            wordBreak: "break-word"

          }}

        >

          {announcement?.message ||

            "Aucun message épinglé."}

        </div>

      </div>

    </div>

    <style>

      {`

      @keyframes slideUp{

        from{

          transform:translateY(100%);

          opacity:0;

        }

        to{

          transform:translateY(0);

          opacity:1;

        }

      }

      `}

    </style>

  </div>

)}

    </div>

  );

}


export default Community;