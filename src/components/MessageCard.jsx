import { useSwipeable } from "react-swipeable";

import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaCircle,
  FaTrash,
} from "react-icons/fa";

import { useState } from "react";

function MessageCard({
  msg,
  user,
  markAsRead,
  deleteMessage,
}) {

    const [offset, setOffset] =
  useState(0)

  const handlers =
  useSwipeable({

    onSwiping: (event) => {

      if (event.deltaX < 0) {

        setOffset(
          Math.max(
            event.deltaX,
            -200
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

  });
;

  return (

    <div
      {...handlers}
      style={{
        position: "relative",
        overflow: "hidden",
        marginTop: "12px",
      }}
    >

      {/* FOND SUPPRESSION */}

      <div
  style={{
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,

    width:
      `${Math.abs(offset)}px`,

    background:
  "linear-gradient(135deg,#ef4444,#dc2626)",

    borderRadius:
      "18px",

    display: "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    color: "#fff",

    zIndex: 0,
  }}
>

        <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    color: "#fff",
  }}
>

  <FaTrash
    style={{
      fontSize: "22px",
    }}
  />

  <span
    style={{
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    Supprimer
  </span>

</div>

</div>

      

      {/* CARTE MESSAGE */}

      <div
     onClick={() => user?._id && markAsRead(msg._id)}
        
        style={{
  position: "relative",

  zIndex: 1,

  cursor: "pointer",

  transform:
    `translateX(${offset}px)`,

  transition:
    offset === 0
      ? "transform .25s ease"
      : "none",

  background: "#fff",

  border:
    (msg.readBy || []).includes(user?._id)
      ? "1px solid #e5e7eb"
      : "2px solid #2563eb",

  borderRadius: "18px",

  padding: "16px",

  boxShadow:
    "0 8px 24px rgba(0,0,0,0.06)",
}}

>

    <div
  style={{
    flex: 1,
  }}
>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  }}
>
  <strong
    style={{
      fontSize: "15px",
      fontWeight: "700",
      color: "#111827",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    {msg.title}

    <FaEnvelope
      style={{
        color: "#2563eb",
        fontSize: "14px",
      }}
    />
  </strong>

  <div
    style={{
      background: "#eef2ff",
      color: "#2563eb",
      padding: "5px 12px",
      borderRadius: "999px",
      fontSize: "10px",
      fontWeight: "700",
      whiteSpace: "nowrap",
      border: "1px solid #dbeafe",
    }}
  >
    KONAN SHOPPING
  </div>
</div>

            {/* MESSAGE */}

            <p
              style={{
                margin: 0,

                color:
                  "#4b5563",

                fontSize:
                  "13px",

                lineHeight:
                  "1.6",
              }}
            >
              {msg.content}
            </p>

            {/* FOOTER */}

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginTop:
                  "14px",
              }}
            >

              <div
                style={{
                  display: "flex",

                  alignItems:
                    "center",

                  gap: "6px",

                  color:
                    "#9ca3af",

                  fontSize:
                    "11px",
                }}
              >

                <FaClock />

               {new Date(
  msg.createdAt
).toLocaleString(
  "fr-FR",
  {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
)}

              </div>

              {(msg.readBy || []).includes(user?._id)? (

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "5px",

                    color:
                      "#16a34a",

                    fontSize:
                      "11px",

                    fontWeight:
                      "700",
                  }}
                >

                  <FaCheckCircle />

                  Lu

                </div>

              ) : (

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "5px",

                    color:
                      "#2563eb",

                    fontSize:
                      "11px",

                    fontWeight:
                      "700",
                  }}
                >

                  <FaCircle
                    style={{
                      fontSize:
                        "8px",
                    }}
                  />

                  Nouveau

                </div>

              )}

            </div>

          </div>

        </div>

    </div>
  );

}

export default MessageCard;