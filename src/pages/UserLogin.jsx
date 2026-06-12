import { useState } from "react";
import axios from "axios";

import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaUserPlus,
  FaShieldAlt,
  FaHeadset
} from "react-icons/fa";

import { toast } from "react-toastify";

function UserLogin() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

    const [showPassword,
  setShowPassword] =
  useState(false);

const mobile =
  window.innerWidth < 768;

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
  "#f8fafc",
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

  maxWidth: "720px",

  background: "#ffffff",

  borderRadius: "40px",

  padding:
    mobile
      ? "35px 25px"
      : "50px",

  boxShadow:
    "0 20px 50px rgba(0,0,0,0.08)",

  border:
    "1px solid #e5e7eb",

  position: "relative",

  zIndex: 5,
}}
      >

        {/* LOGO */}

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
  }}
>
  <img
    src="/logo.jpg"
    alt="Konan Shopping"
    style={{
      width:
        window.innerWidth < 768
          ? "130px"
          : "170px",

      height:
        window.innerWidth < 768
          ? "130px"
          : "170px",

      borderRadius: "50%",

      objectFit: "cover",

      background: "#fff",

      border:
        "3px solid #2563eb",

      padding: "8px",

      boxShadow:
        "0 10px 30px rgba(37,99,235,0.15)",
    }}
  />
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
      fontSize:
        window.innerWidth < 768
          ? "52px"
          : "70px",

      fontWeight: "900",

      color: "#0f172a",

      marginBottom: "10px",

      lineHeight: "1",
    }}
  >
    Bienvenue
  </h1>

  <div
    style={{
      width: "60px",

      height: "5px",

      borderRadius: "999px",

      background: "#2563eb",

      margin: "0 auto 25px auto",
    }}
  />

  <p
    style={{
      color: "#64748b",

      fontSize:
        window.innerWidth < 768
          ? "15px"
          : "16px",

      lineHeight: "28px",

      maxWidth: "450px",

      margin: "0 auto",
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
      color: "#0f172a",

      marginBottom: "10px",

      fontWeight: "700",

      fontSize: "15px",
    }}
  >
    Adresse email
  </p>

  <div
    style={{
      position: "relative",
    }}
  >

    <FaEnvelope
      style={{
        position: "absolute",

        left: "18px",

        top: "21px",

        color: "#94a3b8",

        fontSize: "16px",
      }}
    />

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

        height: "60px",

        paddingLeft: "50px",

        paddingRight: "15px",

        borderRadius: "18px",

        border:
          "1px solid #dbe2ea",

        background: "#ffffff",

        color: "#111827",

        WebkitTextFillColor:
          "#111827",

        fontSize: "15px",

        outline: "none",

        boxSizing:
          "border-box",

        boxShadow:
          "0 4px 12px rgba(0,0,0,0.04)",
      }}
    />

  </div>

</div>

{/* PASSWORD */}

<div
  style={{
    marginBottom: "28px",
  }}
>

  <p
    style={{
      color: "#0f172a",

      marginBottom: "10px",

      fontWeight: "700",

      fontSize: "15px",
    }}
  >
    Mot de passe
  </p>

  <div
    style={{
      position: "relative",
    }}
  >

    <FaLock
      style={{
        position: "absolute",

        left: "18px",

        top: "21px",

        color: "#94a3b8",

        fontSize: "16px",
      }}
    />

    <input
      type={
        showPassword
          ? "text"
          : "password"
      }

      placeholder="Entrez votre mot de passe"

      value={password}

      onChange={(e) =>
        setPassword(
          e.target.value
        )
      }

      style={{
        width: "100%",

        height: "60px",

        paddingLeft: "50px",

        paddingRight: "50px",

        borderRadius: "18px",

        border:
          "1px solid #dbe2ea",

        background: "#ffffff",

        color: "#111827",

        WebkitTextFillColor:
          "#111827",

        fontSize: "15px",

        outline: "none",

        boxSizing:
          "border-box",

        boxShadow:
          "0 4px 12px rgba(0,0,0,0.04)",
      }}
    />

    <FaEye
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }

      style={{
        position: "absolute",

        right: "18px",

        top: "21px",

        color: "#94a3b8",

        cursor: "pointer",
      }}
    />

  </div>

</div>

{/* MOT DE PASSE OUBLIÉ */}

<div
  style={{
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: "-10px",

    marginBottom: "25px",
  }}
>

  <span
    style={{
      color: "#94a3b8",

      fontSize: "13px",
    }}
  >
    Mot de passe oublié ?
  </span>

  <button
    onClick={() =>
      window.location.href =
        "/forgot-password"
    }

    style={{
      border: "none",

      background: "transparent",

      color: "#4f46e5",

      fontWeight: "700",

      fontSize: "14px",

      cursor: "pointer",

      padding: 0,
    }}
  >
    Réinitialiser
  </button>

</div>

        {/* LOGIN BUTTON */}

<button
  onClick={login}

  disabled={loading}

  onMouseEnter={(e) => {

    e.target.style.transform =
      "translateY(-3px)";

    e.target.style.boxShadow =
      "0 15px 35px rgba(37,99,235,0.30)";
  }}

  onMouseLeave={(e) => {

    e.target.style.transform =
      "translateY(0px)";

    e.target.style.boxShadow =
      "0 10px 25px rgba(37,99,235,0.20)";
  }}

  style={{
    width: "100%",

    height: "62px",

    border: "none",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color: "white",

    fontSize: "18px",

    fontWeight: "800",

    cursor: "pointer",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.20)",

    transition: "0.3s",
  }}
>

  {loading ? (

    "Connexion..."

  ) : (

    "Se connecter"

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
      "translateY(-2px)";

    e.target.style.background =
      "#eff6ff";

    e.target.style.border =
      "1px solid #2563eb";
  }}

  onMouseLeave={(e) => {

    e.target.style.transform =
      "translateY(0px)";

    e.target.style.background =
      "#ffffff";

    e.target.style.border =
      "1px solid #dbeafe";
  }}

  style={{
    width: "100%",

    height: "60px",

    marginTop: "16px",

    border:
      "1px solid #dbeafe",

    borderRadius: "18px",

    background: "#ffffff",

    color: "#2563eb",

    fontSize: "16px",

    fontWeight: "700",

    cursor: "pointer",

    transition: "0.3s",

    boxShadow:
      "0 4px 12px rgba(37,99,235,0.08)",
  }}
>

  Créer un compte

</button>

<button

  onClick={() =>
    window.location.href = "/"
  }

  onMouseEnter={(e) => {

    e.target.style.transform =
      "translateY(-2px)";

    e.target.style.background =
      "#f8fafc";
  }}

  onMouseLeave={(e) => {

    e.target.style.transform =
      "translateY(0px)";

    e.target.style.background =
      "#ffffff";
  }}

  style={{

    width: "100%",

    height: "60px",

    marginTop: "16px",

    border:
      "1px solid #e5e7eb",

    borderRadius: "18px",

    background: "#ffffff",

    color: "#374151",

    fontSize: "16px",

    fontWeight: "700",

    cursor: "pointer",

    transition: "0.3s",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "10px",

    boxShadow:
      "0 4px 12px rgba(0,0,0,0.05)",
  }}

>

  <FaArrowLeft />

  Retour accueil

</button>

       {/* FOOTER PREMIUM */}

<div
  style={{
    marginTop: "30px",

    paddingTop: "22px",

    borderTop: "1px solid #e5e7eb",

    textAlign: "center",
  }}
>

  <p
    style={{
      margin: 0,

      color: "#64748b",

      fontSize: "13px",

      fontWeight: "500",
    }}
  >
    Plateforme sécurisée • Paiements protégés • Support client
  </p>

  <p
    style={{
      marginTop: "8px",

      color: "#94a3b8",

      fontSize: "12px",
    }}
  >
    © 2026 Konan Shopping Cameroun
  </p>

</div>

    </div>
    </div>

  );

}

export default UserLogin;