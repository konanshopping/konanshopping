import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaCircle,
  FaTrash,
  FaChevronLeft,
} from "react-icons/fa";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";

function MessageCard({
  msg,
  user,
  markAsRead,
  deleteMessage,
}) {

  // =====================================================
  // SWIPE
  // =====================================================

  const [offset, setOffset] =
    useState(0);

  const isRead =
    (msg.readBy || [])
      .map(String)
      .includes(
        String(user?._id)
      );


  const handlers =
    useSwipeable({

      onSwiping: (event) => {

        // Swipe uniquement vers la gauche

        if (event.deltaX < 0) {

          setOffset(
            Math.max(
              event.deltaX,
              -190
            )
          );

        }

      },


      onSwipedLeft: () => {

        if (offset <= -150) {

          deleteMessage(
            msg._id
          );

        }

        setOffset(0);

      },


      onSwipedRight: () => {

        setOffset(0);

      },


      onSwiped: () => {

        if (offset > -150) {

          setOffset(0);

        }

      },


      trackMouse: true,

      preventScrollOnSwipe: true,

      delta: 10,

    });


  // =====================================================
  // READ
  // =====================================================

  const handleRead = () => {

    if (
      user?._id &&
      !isRead
    ) {

      markAsRead(
        msg._id
      );

    }

  };


  return (

    <div
      {...handlers}
      style={{
        position:
          "relative",

        width:
          "100%",

        overflow:
          "hidden",

        marginTop:
          "10px",

        borderRadius:
          "20px",

        touchAction:
          "pan-y",

        WebkitTapHighlightColor:
          "transparent",
      }}
    >

      {/* =================================================
          DELETE BACKGROUND
      ================================================= */}

      <div
        style={{
          position:
            "absolute",

          inset:
            "0",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "flex-end",

          paddingRight:
            "25px",

          background:
            "linear-gradient(135deg,#ef4444,#dc2626)",

          borderRadius:
            "20px",

          color:
            "#fff",

          zIndex:
            0,

          opacity:
            offset < 0
              ? 1
              : 0,

          transition:
            offset === 0
              ? "opacity .2s ease"
              : "none",
        }}
      >

        <div
          style={{
            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap:
              "5px",

            minWidth:
              "70px",
          }}
        >

          <FaTrash
            style={{
              fontSize:
                "20px",
            }}
          />

          <span
            style={{
              fontSize:
                "11px",

              fontWeight:
                "800",
            }}
          >
            Supprimer
          </span>

        </div>

      </div>


      {/* =================================================
          MESSAGE CARD
      ================================================= */}

      <div
        onClick={
          handleRead
        }

        style={{
          position:
            "relative",

          zIndex:
            1,

          width:
            "100%",

          boxSizing:
            "border-box",

          cursor:
            "pointer",

          transform:
            `translate3d(${offset}px,0,0)`,

          transition:
            offset === 0
              ? "transform .25s cubic-bezier(.2,.8,.2,1)"
              : "none",

          background:
            "#ffffff",

          border:
            isRead
              ? "1px solid #e5e7eb"
              : "2px solid #2563eb",

          borderRadius:
            "20px",

          padding:
            "15px",

          boxShadow:
            isRead
              ? "0 7px 22px rgba(15,23,42,.055)"
              : "0 9px 25px rgba(37,99,235,.10)",

          minWidth:
            0,

          overflow:
            "hidden",

          userSelect:
            "none",

          WebkitUserSelect:
            "none",

          WebkitTapHighlightColor:
            "transparent",
        }}
      >

        {/* =================================================
            TOP
        ================================================= */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "flex-start",

            justifyContent:
              "space-between",

            gap:
              "10px",

            minWidth:
              0,
          }}
        >

          {/* TITLE */}

          <div
            style={{
              display:
                "flex",

              alignItems:
                "flex-start",

              gap:
                "8px",

              flex:
                1,

              minWidth:
                0,
            }}
          >

            <div
              style={{
                width:
                  "36px",

                height:
                  "36px",

                minWidth:
                  "36px",

                borderRadius:
                  "11px",

                background:
                  isRead
                    ? "#eef2ff"
                    : "#dbeafe",

                color:
                  "#2563eb",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >

              <FaEnvelope
                style={{
                  fontSize:
                    "14px",
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
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    "6px",

                  minWidth:
                    0,
                }}
              >

                <strong
                  style={{
                    fontSize:
                      "14px",

                    lineHeight:
                      "1.35",

                    fontWeight:
                      "800",

                    color:
                      "#111827",

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",

                    display:
                      "-webkit-box",

                    WebkitLineClamp:
                      2,

                    WebkitBoxOrient:
                      "vertical",

                    wordBreak:
                      "break-word",
                  }}
                >
                  {msg.title}
                </strong>

              </div>


              <div
                style={{
                  marginTop:
                    "3px",

                  fontSize:
                    "9px",

                  color:
                    "#94a3b8",

                  fontWeight:
                    "700",

                  letterSpacing:
                    ".3px",

                  textTransform:
                    "uppercase",
                }}
              >
                KONAN SHOPPING
              </div>

            </div>

          </div>


          {/* STATUS */}

          <div
            style={{
              flexShrink:
                0,

              display:
                "inline-flex",

              alignItems:
                "center",

              gap:
                "5px",

              padding:
                "5px 8px",

              borderRadius:
                "999px",

              background:
                isRead
                  ? "#f0fdf4"
                  : "#eff6ff",

              color:
                isRead
                  ? "#16a34a"
                  : "#2563eb",

              fontSize:
                "9px",

              fontWeight:
                "800",

              whiteSpace:
                "nowrap",
            }}
          >

            {isRead
              ? <FaCheckCircle />
              : <FaCircle
                  style={{
                    fontSize:
                      "6px",
                  }}
                />
            }

            {isRead
              ? "Lu"
              : "Nouveau"}

          </div>

        </div>


        {/* =================================================
            MESSAGE CONTENT
        ================================================= */}

        <div
          style={{
            marginTop:
              "14px",

            paddingTop:
              "13px",

            borderTop:
              "1px solid #f1f5f9",
          }}
        >

          <p
            style={{
              margin:
                0,

              color:
                "#475569",

              fontSize:
                "13px",

              lineHeight:
                "1.65",

              whiteSpace:
                "pre-wrap",

              overflowWrap:
                "anywhere",

              wordBreak:
                "break-word",
            }}
          >
            {msg.content}
          </p>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          style={{
            marginTop:
              "14px",

            paddingTop:
              "11px",

            borderTop:
              "1px solid #f1f5f9",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              "8px",

            minWidth:
              0,
          }}
        >

          {/* DATE */}

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "6px",

              color:
                "#94a3b8",

              fontSize:
                "10px",

              minWidth:
                0,

              overflow:
                "hidden",
            }}
          >

            <FaClock
              style={{
                flexShrink:
                  0,

                fontSize:
                  "10px",
              }}
            />

            <span
              style={{
                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",
              }}
            >

              {msg.createdAt
                ? new Date(
                    msg.createdAt
                  ).toLocaleString(
                    "fr-FR",
                    {
                      day:
                        "numeric",

                      month:
                        "short",

                      year:
                        "numeric",

                      hour:
                        "2-digit",

                      minute:
                        "2-digit",
                    }
                  )
                : "Date inconnue"}

            </span>

          </div>


          {/* SWIPE HINT */}

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "4px",

              color:
                "#cbd5e1",

              fontSize:
                "9px",

              fontWeight:
                "700",

              flexShrink:
                0,

              opacity:
                isRead
                  ? .75
                  : .9,
            }}
          >

            <FaChevronLeft
              style={{
                fontSize:
                  "8px",
              }}
            />

            Glisser pour supprimer

          </div>

        </div>

      </div>

    </div>

  );

}

export default MessageCard;