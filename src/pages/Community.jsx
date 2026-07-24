import {
  useState,
  useEffect,
  useRef
} from "react";

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

  function sendMessage(text) {

    console.log(text);

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

    </div>

  );

}

export default Community;