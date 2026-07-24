import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEllipsisV,
  FaCircle
} from "react-icons/fa";

function CommunityHeader({
  community,
  onlineUsers,
  openMenu
}) {

  return (

    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,

        background: "linear-gradient(135deg,#5B2E91,#7C3AED)",

        color: "#fff",

        padding: "14px 16px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        boxShadow: "0 8px 25px rgba(91,46,145,.25)",

        borderBottomLeftRadius: 22,

        borderBottomRightRadius: 22
      }}
    >

      {/* Partie gauche */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flex: 1,
          overflow: "hidden"
        }}
      >

        <Link
          to="/"
          style={{
            width: 42,
            height: 42,

            borderRadius: "50%",

            background: "rgba(255,255,255,.15)",

            color: "#fff",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            textDecoration: "none",

            fontSize: 18
          }}
        >
          <FaArrowLeft />
        </Link>

        <img
          src={community?.logo || "/logo.jpg"}
          alt="Logo"

          style={{

            width: 52,

            height: 52,

            borderRadius: 18,

            objectFit: "cover",

            background: "#fff",

            padding: 4,

            boxShadow:
              "0 4px 15px rgba(0,0,0,.18)"

          }}
        />

        <div
          style={{
            flex: 1,
            overflow: "hidden"
          }}
        >

          <div
            translate="no"
            style={{
              fontSize: 20,

              fontWeight: 800,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis"
            }}
          >
            {community?.name || "KONAN SHOPPING"}
          </div>

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 7,

              marginTop: 5,

              color: "#F3F4F6",

              fontSize: 13,

              fontWeight: 500
            }}
          >

            <FaCircle
              style={{
                color: "#22C55E",
                fontSize: 9
              }}
            />

            <span>

              {onlineUsers} membre{onlineUsers > 1 ? "s" : ""} en ligne

            </span>

          </div>

        </div>

      </div>

      {/* Menu */}

      <button

        onClick={openMenu}

        style={{

          width: 44,

          height: 44,

          borderRadius: "50%",

          border: "none",

          background: "rgba(255,255,255,.15)",

          color: "#fff",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          cursor: "pointer",

          fontSize: 20,

          transition: ".25s"

        }}

      >

        <FaEllipsisV />

      </button>

    </header>

  );

}

export default CommunityHeader;