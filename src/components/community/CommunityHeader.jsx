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

        background: "#071A45",

        color: "#fff",

        padding: "14px 16px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        boxShadow:
          "0 4px 15px rgba(0,0,0,.15)"
      }}
    >

      {/* Partie gauche */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flex: 1
        }}
      >

        <Link
          to="/"
          style={{
            color: "#fff",
            fontSize: 22,
            display: "flex"
          }}
        >
          <FaArrowLeft />
        </Link>

        <img
          src={
            community?.logo ||
            "/logo.jpg"
          }
          alt="logo"
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            objectFit: "cover"
          }}
        />

        <div
          style={{
            overflow: "hidden"
          }}
        >

          <div
            translate="no"
            style={{
              fontWeight: 800,
              fontSize: 18,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis"
            }}
          >
            {community?.name ||
              "KONAN SHOPPING"}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,

              fontSize: 13,

              marginTop: 3,

              opacity: .95
            }}
          >

            <FaCircle
              style={{
                color: "#22C55E",
                fontSize: 8
              }}
            />

            {onlineUsers} membres en ligne

          </div>

        </div>

      </div>

      {/* Menu */}

      <button

        onClick={openMenu}

        style={{

          background: "transparent",

          border: "none",

          color: "#fff",

          fontSize: 22,

          cursor: "pointer"
        }}

      >

        <FaEllipsisV/>

      </button>

    </header>

  );

}

export default CommunityHeader;