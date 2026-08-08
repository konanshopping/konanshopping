import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FaEnvelope,
  FaBell,
  FaClock,
  FaCheckCircle,
  FaInbox,
  FaChevronRight,
} from "react-icons/fa";

import MessageCard from "../components/MessageCard";

function Message() {

  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // USER
  // =====================================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};


  // =====================================================
  // FETCH MESSAGES
  // =====================================================

  useEffect(() => {

    fetchMessages();

  }, []);


  const fetchMessages =
    async () => {

      try {

        const res =
          await axios.get(
            "https://konanshopping.com/api/messages",
            {
              params: {
                userId:
                  user._id,
              },
            }
          );

        setMessages(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (err) {

        console.log(
          "Erreur récupération messages:",
          err
        );

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // MARK AS READ
  // =====================================================

  const markAsRead =
    async (messageId) => {

      try {

        await axios.put(
          `https://konanshopping.com/api/messages/${messageId}/read`,
          {
            userId:
              user._id,
          }
        );

        setMessages(
          (prev) =>
            prev.map(
              (msg) =>

                msg._id === messageId

                  ? {
                      ...msg,

                      readBy: [
                        ...(msg.readBy || []),

                        user._id,
                      ],
                    }

                  : msg
            )
        );

      } catch (error) {

        console.log(
          "Erreur lecture message:",
          error
        );

      }

    };


  // =====================================================
  // DELETE MESSAGE FOR USER
  // =====================================================

  const deleteMessage =
    async (messageId) => {

      try {

        await axios.put(
          `https://konanshopping.com/api/messages/${messageId}/delete`,
          {
            userId:
              user._id,
          }
        );

        setMessages(
          (prev) =>
            prev.filter(
              (msg) =>
                msg._id !==
                messageId
            )
        );

      } catch (error) {

        console.log(
          "Erreur suppression message:",
          error
        );

      }

    };


  // =====================================================
  // SORT MESSAGES
  // NON-LUS EN PREMIER
  // =====================================================

  const sortedMessages =
    useMemo(() => {

      return [...messages]

        .filter(
          (msg) =>
            !(msg.deletedBy || [])
              .map(String)
              .includes(
                String(user._id)
              )
        )

        .sort((a, b) => {

          const aRead =
            (a.readBy || [])
              .map(String)
              .includes(
                String(user._id)
              );

          const bRead =
            (b.readBy || [])
              .map(String)
              .includes(
                String(user._id)
              );

          if (
            aRead === bRead
          ) {

            return (
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
            );

          }

          return aRead
            ? 1
            : -1;

        });

    }, [
      messages,
      user._id,
    ]);


  // =====================================================
  // STATISTICS
  // =====================================================

  const unreadCount =
    useMemo(() => {

      return sortedMessages.filter(
        (msg) =>
          !(msg.readBy || [])
            .map(String)
            .includes(
              String(user._id)
            )
      ).length;

    }, [
      sortedMessages,
      user._id,
    ]);


  // =====================================================
  // DATE DU DERNIER MESSAGE
  // =====================================================

  const latestMessage =
    sortedMessages.length > 0
      ? sortedMessages[0]
      : null;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight:
            "100vh",

          background:
            "linear-gradient(180deg,#f5f7ff 0%,#f8fafc 100%)",

          padding:
            "16px",

          boxSizing:
            "border-box",

          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >

        {/* HEADER SKELETON */}

        <div
          style={{
            height:
              "128px",

            borderRadius:
              "24px",

            background:
              "#e8eaf5",

            animation:
              "messagePulse 1.4s ease-in-out infinite",
          }}
        />

        {/* CARDS SKELETON */}

        <div
          style={{
            marginTop:
              "16px",

            display:
              "flex",

            flexDirection:
              "column",

            gap:
              "10px",
          }}
        >

          {[1, 2, 3].map(
            (item) => (

              <div
                key={item}
                style={{
                  height:
                    "120px",

                  borderRadius:
                    "20px",

                  background:
                    "#ffffff",

                  border:
                    "1px solid #edf0f5",

                  animation:
                    "messagePulse 1.4s ease-in-out infinite",
                }}
              />

            )
          )}

        </div>


        <style>
          {`
            @keyframes messagePulse {
              0% {
                opacity: .55;
              }

              50% {
                opacity: 1;
              }

              100% {
                opacity: .55;
              }
            }
          `}
        </style>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div
      style={{
        minHeight:
          "100vh",

        background:
          "linear-gradient(180deg,#f5f7ff 0%,#f8fafc 100%)",

        padding:
          "12px",

        paddingBottom:
          "90px",

        boxSizing:
          "border-box",

        color:
          "#111827",

        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

        overflowX:
          "hidden",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          position:
            "relative",

          overflow:
            "hidden",

          background:
            "linear-gradient(135deg,#312e81 0%,#4f46e5 52%,#7c3aed 100%)",

          borderRadius:
            "24px",

          padding:
            "20px",

          color:
            "#ffffff",

          boxShadow:
            "0 15px 35px rgba(79,70,229,.20)",
        }}
      >

        {/* DECORATION */}

        <div
          style={{
            position:
              "absolute",

            width:
              "150px",

            height:
              "150px",

            borderRadius:
              "50%",

            background:
              "rgba(255,255,255,.07)",

            right:
              "-65px",

            top:
              "-70px",
          }}
        />

        <div
          style={{
            position:
              "absolute",

            width:
              "90px",

            height:
              "90px",

            borderRadius:
              "50%",

            background:
              "rgba(255,255,255,.05)",

            right:
              "55px",

            bottom:
              "-55px",
          }}
        />


        {/* HEADER CONTENT */}

        <div
          style={{
            position:
              "relative",

            zIndex:
              2,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              "12px",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "12px",

              minWidth:
                0,
            }}
          >

            <div
              style={{
                width:
                  "50px",

                height:
                  "50px",

                minWidth:
                  "50px",

                borderRadius:
                  "16px",

                background:
                  "rgba(255,255,255,.14)",

                border:
                  "1px solid rgba(255,255,255,.18)",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backdropFilter:
                  "blur(10px)",
              }}
            >

              <FaEnvelope
                style={{
                  fontSize:
                    "21px",
                }}
              />

            </div>


            <div
              style={{
                minWidth:
                  0,
              }}
            >

              <div
                style={{
                  fontSize:
                    "10px",

                  fontWeight:
                    "800",

                  letterSpacing:
                    "1.2px",

                  textTransform:
                    "uppercase",

                  opacity:
                    ".75",

                  marginBottom:
                    "3px",
                }}
              >
                KONAN SHOPPING
              </div>

              <h1
                style={{
                  margin:
                    0,

                  fontSize:
                    "20px",

                  lineHeight:
                    "1.2",

                  fontWeight:
                    "850",

                  letterSpacing:
                    "-.4px",
                }}
              >
                Centre de messages
              </h1>

              <p
                style={{
                  margin:
                    "4px 0 0",

                  fontSize:
                    "11px",

                  opacity:
                    ".86",

                  lineHeight:
                    "1.4",
                }}
              >
                Vos notifications officielles
              </p>

            </div>

          </div>


          {/* UNREAD BADGE */}

          {unreadCount > 0 && (

            <div
              style={{
                flexShrink:
                  0,

                minWidth:
                  "42px",

                height:
                  "42px",

                padding:
                  "0 8px",

                borderRadius:
                  "14px",

                background:
                  "rgba(255,255,255,.15)",

                border:
                  "1px solid rgba(255,255,255,.18)",

                display:
                  "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backdropFilter:
                  "blur(10px)",
              }}
            >

              <span
                style={{
                  fontSize:
                    "15px",

                  fontWeight:
                    "900",

                  lineHeight:
                    "1",
                }}
              >
                {unreadCount}
              </span>

              <span
                style={{
                  marginTop:
                    "3px",

                  fontSize:
                    "8px",

                  opacity:
                    ".85",

                  fontWeight:
                    "700",
                }}
              >
                NON LU
              </span>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      {sortedMessages.length > 0 && (

        <div
          style={{
            marginTop:
              "12px",

            display:
              "grid",

            gridTemplateColumns:
              "repeat(2,minmax(0,1fr))",

            gap:
              "10px",
          }}
        >

          {/* TOTAL */}

          <div
            style={{
              background:
                "#ffffff",

              border:
                "1px solid #e8ebf2",

              borderRadius:
                "18px",

              padding:
                "14px",

              boxShadow:
                "0 7px 20px rgba(15,23,42,.04)",
            }}
          >

            <div
              style={{
                width:
                  "34px",

                height:
                  "34px",

                borderRadius:
                  "11px",

                background:
                  "#eef2ff",

                color:
                  "#4f46e5",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >

              <FaInbox />

            </div>

            <div
              style={{
                marginTop:
                  "9px",

                fontSize:
                  "20px",

                fontWeight:
                  "850",
              }}
            >
              {sortedMessages.length}
            </div>

            <div
              style={{
                marginTop:
                  "2px",

                fontSize:
                  "10px",

                color:
                  "#64748b",

                fontWeight:
                  "600",
              }}
            >
              Notifications
            </div>

          </div>


          {/* UNREAD */}

          <div
            style={{
              background:
                "#ffffff",

              border:
                "1px solid #e8ebf2",

              borderRadius:
                "18px",

              padding:
                "14px",

              boxShadow:
                "0 7px 20px rgba(15,23,42,.04)",
            }}
          >

            <div
              style={{
                width:
                  "34px",

                height:
                  "34px",

                borderRadius:
                  "11px",

                background:
                  "#f5f3ff",

                color:
                  "#7c3aed",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >

              <FaBell />

            </div>

            <div
              style={{
                marginTop:
                  "9px",

                fontSize:
                  "20px",

                fontWeight:
                  "850",
              }}
            >
              {unreadCount}
            </div>

            <div
              style={{
                marginTop:
                  "2px",

                fontSize:
                  "10px",

                color:
                  "#64748b",

                fontWeight:
                  "600",
              }}
            >
              Non lus
            </div>

          </div>

        </div>

      )}


      {/* =================================================
          LAST COMMUNICATION
      ================================================= */}

      {latestMessage && (

        <div
          style={{
            marginTop:
              "12px",

            padding:
              "12px 14px",

            background:
              "#ffffff",

            border:
              "1px solid #e8ebf2",

            borderRadius:
              "17px",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "10px",

            boxShadow:
              "0 7px 20px rgba(15,23,42,.035)",
          }}
        >

          <div
            style={{
              width:
                "32px",

              height:
                "32px",

              minWidth:
                "32px",

              borderRadius:
                "10px",

              background:
                "#f1f5f9",

              color:
                "#64748b",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",
            }}
          >

            <FaClock
              style={{
                fontSize:
                  "12px",
              }}
            />

          </div>

          <div
            style={{
              minWidth:
                0,

              flex:
                1,
            }}
          >

            <div
              style={{
                fontSize:
                  "10px",

                color:
                  "#94a3b8",

                fontWeight:
                  "700",

                textTransform:
                  "uppercase",

                letterSpacing:
                  ".5px",
              }}
            >
              Dernière notification
            </div>

            <div
              style={{
                marginTop:
                  "2px",

                fontSize:
                  "12px",

                fontWeight:
                  "800",

                color:
                  "#334155",

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",
              }}
            >
              {latestMessage.title}
            </div>

          </div>

          <FaChevronRight
            style={{
              color:
                "#cbd5e1",

              fontSize:
                "11px",

              flexShrink:
                0,
            }}
          />

        </div>

      )}


     {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        sortedMessages.length === 0 && (

          <div
            style={{
              background:
                "#ffffff",

              border:
                "1px solid #e8ebf2",

              borderRadius:
                "24px",

              padding:
                "38px 22px",

              marginTop:
                "16px",

              textAlign:
                "center",

              boxShadow:
                "0 10px 28px rgba(15,23,42,.045)",
            }}
          >

            <div
              style={{
                width:
                  "70px",

                height:
                  "70px",

                margin:
                  "0 auto",

                borderRadius:
                  "22px",

                background:
                  "linear-gradient(135deg,#eef2ff,#f5f3ff)",

                color:
                  "#6366f1",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                boxShadow:
                  "0 8px 20px rgba(99,102,241,.10)",
              }}
            >

              <FaBell
                style={{
                  fontSize:
                    "27px",
                }}
              />

            </div>


            <h3
              style={{
                margin:
                  "18px 0 7px",

                fontSize:
                  "17px",

                fontWeight:
                  "850",

                color:
                  "#111827",
              }}
            >
              Aucun message
            </h3>

            <p
              style={{
                margin:
                  0,

                color:
                  "#64748b",

                fontSize:
                  "12px",

                lineHeight:
                  "1.6",
              }}
            >
              Vous n'avez reçu aucune
              notification pour le moment.
            </p>

          </div>

        )}


      {/* =================================================
          MESSAGE LIST
      ================================================= */}

      {sortedMessages.length > 0 && (

        <div
          style={{
            marginTop:
              "16px",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              marginBottom:
                "10px",

              padding:
                "0 2px",
            }}
          >

            <div>

              <h2
                style={{
                  margin:
                    0,

                  fontSize:
                    "17px",

                  fontWeight:
                    "850",

                  color:
                    "#111827",
                }}
              >
                Vos messages
              </h2>

              <p
                style={{
                  margin:
                    "3px 0 0",

                  fontSize:
                    "10px",

                  color:
                    "#94a3b8",
                }}
              >
                Les messages non lus apparaissent en premier.
              </p>

            </div>

            {unreadCount > 0 && (

              <div
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    "5px",

                  background:
                    "#eef2ff",

                  color:
                    "#4f46e5",

                  padding:
                    "6px 9px",

                  borderRadius:
                    "9px",

                  fontSize:
                    "10px",

                  fontWeight:
                    "800",
                }}
              >

                <FaCheckCircle />

                {unreadCount} non lu
                {unreadCount > 1
                  ? "s"
                  : ""}

              </div>

            )}

          </div>


          {/* MESSAGE CARDS */}

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "10px",
            }}
          >

            {sortedMessages.map(
              (msg) => (

                <div
                  key={
                    msg._id
                  }

                  style={{
                    width:
                      "100%",

                    boxSizing:
                      "border-box",

                    overflow:
                      "hidden",

                    borderRadius:
                      "20px",
                  }}
                >

                  <MessageCard
                    msg={msg}
                    user={user}
                    markAsRead={
                      markAsRead
                    }
                    deleteMessage={
                      deleteMessage
                    }
                  />

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* =================================================
          MOBILE SAFE AREA
      ================================================= */}

      <div
        style={{
          height:
            "8px",
        }}
      />


      {/* =================================================
          GLOBAL MOBILE FIXES
      ================================================= */}

      <style>
        {`

          * {
            box-sizing: border-box;
          }

          button,
          input,
          textarea {
            -webkit-tap-highlight-color: transparent;
          }

          body {
            margin: 0;
            overflow-x: hidden;
          }

          @media (max-width: 420px) {

            .message-mobile-small {
              font-size: 12px;
            }

          }

          @media (max-width: 360px) {

            .message-mobile-small {
              font-size: 11px;
            }

          }

        `}
      </style>

    </div>

  );

}

export default Message;