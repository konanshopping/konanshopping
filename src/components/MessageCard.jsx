import { useSwipeable } from "react-swipeable";

import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaCircle,
  FaTrash,
} from "react-icons/fa";

function MessageCard({
  msg,
  user,
  markAsRead,
  deleteMessage,
}) {

  const handlers =
    useSwipeable({

      onSwipedLeft: () => {

        deleteMessage(
          msg._id
        );

      },

      preventScrollOnSwipe: true,

      trackMouse: true,

    });

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
          width: "90px",

          background:
            "#ef4444",

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

        <FaTrash
          style={{
            fontSize: "20px",
          }}
        />

      </div>

      {/* CARTE MESSAGE */}

      <div
        onClick={() =>
          markAsRead(
            msg._id
          )
        }
        style={{
          position: "relative",

          zIndex: 1,

          cursor: "pointer",

          background:
            "#fff",

          border:
            (msg.readBy || [])
            .includes(user._id)
              ? "1px solid #e5e7eb"
              : "2px solid #2563eb",

          borderRadius:
            "18px",

          padding: "16px",

          boxShadow:
            "0 8px 24px rgba(0,0,0,0.06)",

          transition:
            "all .3s ease",
        }}
      >

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >

          {/* ICÔNE */}

          <div
            style={{
              width: "42px",

              height: "42px",

              borderRadius:
                "14px",

              background:
                "#eef2ff",

              display: "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              flexShrink: 0,
            }}
          >

            <FaEnvelope
              style={{
                color:
                  "#2563eb",

                fontSize:
                  "16px",
              }}
            />

          </div>

          {/* CONTENU */}

          <div
            style={{
              flex: 1,
            }}
          >

            <strong
              style={{
                display: "block",

                fontSize: "15px",

                fontWeight: "700",

                color: "#111827",

                marginBottom: "6px",
              }}
            >
              {msg.title}
            </strong>

            {/* BADGE OFFICIEL */}

            <div
              style={{
                display:
                  "inline-flex",

                alignItems:
                  "center",

                background:
                  "#eef2ff",

                color:
                  "#2563eb",

                padding:
                  "4px 10px",

                borderRadius:
                  "999px",

                fontSize:
                  "10px",

                fontWeight:
                  "700",

                marginBottom:
                  "10px",
              }}
            >
              KONAN SHOPPING
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
                ).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}

              </div>

              {(msg.readBy || [])
              .includes(
                user._id
              ) ? (

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

    </div>

  );

}

export default MessageCard;