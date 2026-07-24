import {
  FaThumbtack,
  FaChevronRight,
  FaBullhorn,
  FaCheckCircle
} from "react-icons/fa";

function PinnedMessage({

  announcement,

  onClick

}) {

  return (

    <div
      onClick={onClick}
      style={{
        margin: "14px 16px",
        background: "#FFFFFF",
        borderRadius: "18px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow:
          "0 6px 20px rgba(15,23,42,.06)",
        border: "1px solid #E5E7EB",
        cursor: "pointer"
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flex: 1
        }}
      >

        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "#EFF6FF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#2563EB",
            fontSize: 22
          }}
        >

          <FaBullhorn/>

        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden"
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4
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
                fontSize: 15
              }}
            >

              Message épinglé

            </span>

            <FaCheckCircle
              style={{
                color: "#22C55E",
                fontSize: 13
              }}
            />

          </div>

          <div
            style={{
              fontSize: 14,
              color: "#4B5563",
              lineHeight: "22px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >

            {announcement?.message ||

              "Bienvenue dans la communauté officielle KONAN SHOPPING. Respectez les règles et échangez avec les autres clients."}

          </div>

        </div>

      </div>

      <FaChevronRight
        style={{
          color: "#9CA3AF",
          fontSize: 18
        }}
      />

    </div>

  );

}

export default PinnedMessage;