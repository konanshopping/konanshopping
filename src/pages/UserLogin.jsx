import { useState } from "react";
import axios from "axios";

import { FaArrowLeft }
from "react-icons/fa";

import { toast } from "react-toastify";

function UserLogin() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const login = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "https://konanshopping-production.up.railway.app/login",
        {
          email,
          password,
        }
      );

// SAVE TOKEN

localStorage.setItem(
  "token",
  res.data.token
);

// SUCCESS

toast.success(
  "Bienvenue sur Konan Shopping 🚀"
);

// ADMIN
if (res.data.user.isAdmin) {

  localStorage.setItem(

    "admin",

    JSON.stringify(
      res.data.user
    )

  );

  setTimeout(() => {

  window.location.href =
    "/admin";

}, 1500);

}

// CLIENT
else {

  localStorage.setItem(

    "user",

    JSON.stringify(
      res.data.user
    )

  );

  setTimeout(() => {

  window.location.href =
    "/account";

}, 1500);

}

    } catch (err) {

      console.log(err);

      toast.error(
  err.response?.data?.message ||
  "Erreur connexion"
);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        overflow: "hidden",

        position: "relative",

        background:
          "linear-gradient(135deg,#0B1023,#151A38,#312E81)",
      }}
    >

      {/* BACKGROUND LIGHTS */}

      <div
        style={{
          position: "absolute",

          width: "500px",

          height: "500px",

          background:
            "#7C3AED",

          borderRadius: "50%",

          top: "-180px",

          left: "-120px",

          opacity: 0.25,

          filter: "blur(120px)",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "450px",

          height: "450px",

          background:
            "#2563EB",

          borderRadius: "50%",

          bottom: "-180px",

          right: "-120px",

          opacity: 0.25,

          filter: "blur(120px)",
        }}
      />

      {/* CARD */}

      <div
        style={{
          width: "100%",

          maxWidth: "480px",

          background:
            "rgba(255,255,255,0.08)",

          backdropFilter:
            "blur(25px)",

          border:
            "1px solid rgba(255,255,255,0.12)",

          borderRadius: "40px",

          padding: "45px 35px",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45)",

          position: "relative",

          zIndex: 5,
        }}
      >

        {/* LOGO */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >

          <div
            style={{

              padding: "18px",

              borderRadius: "30px",

              background:
                "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(59,130,246,0.18))",

              border:
                "1px solid rgba(255,255,255,0.12)",

              backdropFilter: "blur(20px)",

              boxShadow:
                "0 20px 45px rgba(0,0,0,0.35)",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              position: "relative",

              overflow: "hidden",
            }}
          >

            {/* LIGHT EFFECT */}

            <div
              style={{
                position: "absolute",

                width: "140px",

                height: "140px",

                background:
                  "rgba(255,255,255,0.08)",

                borderRadius: "50%",

                top: "-60px",

                right: "-40px",

                filter: "blur(20px)",
              }}
            />

            <img
              src="/logo.jpg"

              alt="Konan Shopping"

              style={{
                width: "160px",

                objectFit: "contain",

                zIndex: 2,

                filter:
                  "drop-shadow(0 10px 25px rgba(124,58,237,0.35))",
              }}
            />

          </div>

        </div>

        {/* TITLE */}

        <div
          style={{
            textAlign: "center",

            marginBottom: "35px",
          }}
        >

          <h1
            style={{
              fontSize: "50px",

              fontWeight: "900",

              marginBottom: "12px",

              letterSpacing: "-2px",

              background:
                "linear-gradient(135deg,#FFFFFF,#C4B5FD,#93C5FD)",

              WebkitBackgroundClip: "text",

              WebkitTextFillColor: "transparent",
            }}
          >
            Konan Shopping
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.72)",

              fontSize: "15px",

              lineHeight: "28px",
            }}
          >
            Connectez-vous à votre espace premium
            et gérez vos commandes en temps réel.
          </p>

        </div>

        {/* EMAIL */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >

          <p
            style={{
              color: "white",

              marginBottom: "10px",

              fontWeight: "700",

              fontSize: "15px",
            }}
          >
            Adresse email
          </p>

          <input
            type="email"

            placeholder="Entrez votre email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            style={{
              width: "100%",

              padding:
                "18px",

              borderRadius: "18px",

              border:
                "1px solid rgba(255,255,255,0.12)",

              background:
                "rgba(255,255,255,0.08)",

              color: "white",

              fontSize: "15px",

              outline: "none",

              boxSizing:
                "border-box",

              transition: "0.3s",
            }}
          />

        </div>

        {/* PASSWORD */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >

          <p
            style={{
              color: "white",

              marginBottom: "10px",

              fontWeight: "700",

              fontSize: "15px",
            }}
          >
            Mot de passe
          </p>

          <input
            type="password"

            placeholder="Entrez votre mot de passe"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            style={{
              width: "100%",

              padding:
                "18px",

              borderRadius: "18px",

              border:
                "1px solid rgba(255,255,255,0.12)",

              background:
                "rgba(255,255,255,0.08)",

              color: "white",

              fontSize: "15px",

              outline: "none",

              boxSizing:
                "border-box",

              transition: "0.3s",
            }}
          />

        </div>

        {/* LOGIN BUTTON */}

        <button
          onClick={login}

          disabled={loading}

          onMouseEnter={(e) => {

            e.target.style.transform =
              "translateY(-4px) scale(1.02)";

            e.target.style.boxShadow =
              "0 18px 40px rgba(124,58,237,0.65)";
          }}

          onMouseLeave={(e) => {

            e.target.style.transform =
              "translateY(0px) scale(1)";

            e.target.style.boxShadow =
              "0 15px 35px rgba(124,58,237,0.45)";
          }}

          style={{
            width: "100%",

            padding: "18px",

            border: "none",

            borderRadius: "20px",

            background:
              "linear-gradient(135deg,#8B5CF6,#4F46E5)",

            color: "white",

            fontSize: "17px",

            fontWeight: "800",

            cursor: "pointer",

            boxShadow:
              "0 15px 35px rgba(124,58,237,0.45)",

            transition: "0.35s",
          }}
        >

          {loading ? (

            "Connexion..."

          ) : (

            "Accéder à mon compte"

          )}

        </button>

        {/* CREATE ACCOUNT */}

        <button

          onClick={() =>
            window.location.href =
              "/register"
          }

          onMouseEnter={(e) => {

            e.target.style.transform =
              "translateY(-4px)";

            e.target.style.background =
              "rgba(255,255,255,0.14)";
          }}

          onMouseLeave={(e) => {

            e.target.style.transform =
              "translateY(0px)";

            e.target.style.background =
              "transparent";
          }}

          style={{
            width: "100%",

            padding: "18px",

            marginTop: "18px",

            border:
              "1px solid rgba(255,255,255,0.15)",

            borderRadius: "20px",

            background:
              "transparent",

            color: "white",

            fontSize: "16px",

            fontWeight: "700",

            cursor: "pointer",

            transition: "0.35s",
          }}
        >

          Créer un compte

        </button>

<button

  onClick={() =>
    window.location.href="/"
  }

  onMouseEnter={(e) => {

    e.target.style.transform =
      "translateY(-4px)";

    e.target.style.background =
      "rgba(255,255,255,0.14)";
  }}

  onMouseLeave={(e) => {

    e.target.style.transform =
      "translateY(0px)";

    e.target.style.background =
      "rgba(255,255,255,0.05)";
  }}

  style={{

    width:"100%",

    padding:"18px",

    marginTop:"18px",

    border:
      "1px solid rgba(255,255,255,0.15)",

    borderRadius:"20px",

    background:
      "rgba(255,255,255,0.05)",

    color:"white",

    fontSize:"16px",

    fontWeight:"700",

    cursor:"pointer",

    transition:"0.35s",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    gap:"10px",

  }}

>

  <FaArrowLeft />

  Retour accueil

</button>

        {/* FOOTER */}

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            marginTop: "24px",

            flexWrap: "wrap",

            gap: "10px",
          }}
        >

          <span
            style={{
              color:
                "rgba(255,255,255,0.65)",

              fontSize: "13px",
            }}
          >
            🔒 Connexion sécurisée
          </span>

          <span
            style={{
              color:
                "rgba(255,255,255,0.65)",

              fontSize: "13px",
            }}
          >
            ⚡ Support premium
          </span>

        </div>

      </div>

    </div>

  );

}

export default UserLogin;