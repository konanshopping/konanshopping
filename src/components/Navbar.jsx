import { Link } from "react-router-dom";

function Navbar() {

  return (

    <div
      style={{
        width: "100%",
        background: "white",

        padding: "10px 22px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        boxSizing: "border-box",

        borderBottom: "1px solid #eee",

        position: "sticky",

        top: 0,

        zIndex: 999,
      }}
    >

      {/* LOGO */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",
        }}
      >

        <img
          src="/logo.jpg"

          alt=""

          style={{
            width: "42px",

            height: "42px",

            borderRadius: "10px",

            objectFit: "cover",
          }}
        />

        <div>

          <h1
            style={{
              margin: 0,

              fontSize: "22px",

              fontWeight: "bold",

              lineHeight: "1.1",
            }}
          >

            <span style={{ color: "black" }}>
              Konan
            </span>

            <span style={{ color: "#ff8c00" }}>
              Shopping
            </span>

          </h1>

          <p
            style={{
              margin: 0,

              color: "gray",

              fontSize: "11px",
            }}
          >
            Tout ce dont vous avez besoin.
          </p>

        </div>

      </div>

      {/* MENU */}

      <div
        style={{
          display: "flex",

          gap: "14px",

          alignItems: "center",
        }}
      >

        <Link
          to="/"
          style={link}
        >
          Accueil
        </Link>

        <Link
          to="/boutique"
          style={link}
        >
          Boutique
        </Link>

        <Link
          to="/orders"
          style={link}
        >
          Commandes
        </Link>

        <Link
          to="/user-login"
          style={link}
        >
          Connexion
        </Link>

        <a
          href="https://wa.me/237694641329"

          style={{
            background: "#ff8c00",

            color: "white",

            padding: "8px 14px",

            borderRadius: "10px",

            textDecoration: "none",

            fontWeight: "bold",

            fontSize: "13px",
          }}
        >
          WhatsApp
        </a>

      </div>

    </div>

  );

}

const link = {

  textDecoration: "none",

  color: "black",

  fontWeight: "600",

  fontSize: "14px",
};

export default Navbar;