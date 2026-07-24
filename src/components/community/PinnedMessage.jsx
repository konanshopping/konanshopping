import {
  FaThumbtack,
  FaChevronRight,
  FaBullhorn,
  FaCheckCircle
} from "react-icons/fa";

function PinnedMessage({

  announcement,

  onClick,

  isAdmin = false,

  onEdit

}) {

  const message =
    announcement?.message ||
    "Bienvenue dans la communauté officielle KONAN SHOPPING. Respectez les règles et échangez avec les autres clients.";

  return (

    <div

      onClick={onClick}

      style={{

        margin: "14px 16px",

        background: "#FFFFFF",

        borderRadius: 20,

        padding: 16,

        display: "flex",

        alignItems: "center",

        gap: 14,

        boxShadow:
          "0 8px 24px rgba(15,23,42,.08)",

        border: "1px solid #E5E7EB"

      }}

    >

      <div

        style={{

          width: 58,

          height: 58,

          minWidth: 58,

          borderRadius: 18,

          background:
            "linear-gradient(135deg,#EFF6FF,#DBEAFE)",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          color: "#2563EB",

          fontSize: 24

        }}

      >

        <FaBullhorn />

      </div>

      <div

        style={{

          flex: 1,

          minWidth: 0

        }}

      >

        <div

          style={{

            display: "flex",

            alignItems: "center",

            gap: 8,

            flexWrap: "wrap",

            marginBottom: 6

          }}

        >

          <FaThumbtack

            style={{

              color: "#2563EB",

              fontSize: 13

            }}

          />

          <span

            style={{

              fontWeight: 800,

              color: "#111827",

              fontSize: 16

            }}

          >

            Message épinglé

          </span>

          <FaCheckCircle

            style={{

              color: "#22C55E",

              fontSize: 14

            }}

          />

        </div>

        <div

          style={{

            fontSize: 14,

            color: "#4B5563",

            lineHeight: "22px",

            wordBreak: "break-word",

            overflowWrap: "break-word",

            display: "-webkit-box",

            WebkitLineClamp: 2,

            WebkitBoxOrient: "vertical",

            overflow: "hidden"

          }}

        >

          {message}

        </div>

      </div>

      {isAdmin ? (

        <button

          onClick={(e) => {

            e.stopPropagation();

            onEdit?.();

          }}

          style={{

            border: "none",

            background: "#2563EB",

            color: "#FFFFFF",

            borderRadius: 12,

            padding: "10px 14px",

            fontWeight: 700,

            fontSize: 12,

            cursor: "pointer",

            minWidth: 80

          }}

        >

          Modifier

        </button>

      ) : (

        <FaChevronRight

          style={{

            color: "#9CA3AF",

            fontSize: 18,

            minWidth: 18

          }}

        />

      )}

    </div>

  );

}

export default PinnedMessage;