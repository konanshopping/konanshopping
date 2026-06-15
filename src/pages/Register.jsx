import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaUserPlus,
  FaSignInAlt,
  FaShieldAlt,
  FaEyeSlash,
  FaCheckCircle,

} from "react-icons/fa";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

    const [showPassword, setShowPassword] =
  useState(false);

  const register = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "https://konanshopping-production.up.railway.app/register",
        {
          name,
          email,
          password,
        }
      );

      // SAVE USER

      const userData = {

        _id:
          res.data.user._id,

        name:
          res.data.user.name,

        email:
          res.data.user.email,

        registerDate:
          Date.now(),

      };

   localStorage.setItem(
  "token",
  res.data.token
);

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      toast.success(
  "Compte créé avec succès 🚀"
);

     setTimeout(() => {

  window.location.href =
    "/account";

}, 1500);

    } catch (err) {

      console.log(err);

      toast.error(
  err.response?.data?.message ||
  "Erreur serveur"
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

      alignItems:
        window.innerWidth < 768
          ? "flex-start"
          : "center",

      overflow: "hidden",

      position: "relative",

      background:
        "linear-gradient(180deg,#f8fafc 0%,#ffffff 45%,#eef4ff 100%)",

      padding:
        window.innerWidth < 768
          ? "0"
          : "20px",
    }}
  >

    {/* HALO HAUT DROIT */}

    <div
      style={{
        position: "absolute",
        top: "-150px",
        right: "-150px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background:
          "rgba(37,99,235,0.10)",
        filter: "blur(60px)",
      }}
    />

    {/* HALO BAS GAUCHE */}

    <div
      style={{
        position: "absolute",
        bottom: "-150px",
        left: "-150px",
        width: "280px",
        height: "280px",
        borderRadius: "50%",
        background:
          "rgba(96,165,250,0.08)",
        filter: "blur(60px)",
      }}
    />

     {/* CARD */}

<div
  style={{
    width: "100%",

    maxWidth:
      window.innerWidth < 768
        ? "100%"
        : "900px",

    minHeight: "100vh",

    background:
      "linear-gradient(180deg,#ffffff,#f8fbff)",

    borderRadius:
      window.innerWidth < 768
        ? "0"
        : "36px",

    padding:
      window.innerWidth < 768
        ? "20px"
        : "60px 70px",

    boxShadow:
      window.innerWidth < 768
        ? "inset 0 1px 0 rgba(255,255,255,0.8)"
        : "0 20px 60px rgba(15,23,42,0.08)",

    border:
      window.innerWidth < 768
        ? "none"
        : "1px solid #e5e7eb",

    position: "relative",

    zIndex: 5,

    overflow: "hidden",
  }}
>
  <div
  style={{
    position: "absolute",
    top: "-120px",
    right: "-120px",
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    background:
      "rgba(37,99,235,0.08)",
    filter: "blur(40px)",
  }}
/>

 {/* LOGO PREMIUM */}

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom:
      window.innerWidth < 768
        ? "22px"
        : "35px",
  }}
>

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "90px"
          : "130px",

      height:
        window.innerWidth < 768
          ? "90px"
          : "130px",

      borderRadius: "50%",

      background: "#ffffff",

      border: "2px solid #dbeafe",

      display: "flex",

      justifyContent: "center",

      alignItems: "center",

      boxShadow:
        "0 10px 30px rgba(37,99,235,0.10)",

      position: "relative",

      overflow: "hidden",
    }}
  >

    <img
      src="/logo.jpg"
      alt="Konan Shopping"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />

  </div>

</div>

{/* TITLE */}

<div
  style={{
    textAlign: "center",
    marginBottom:
      window.innerWidth < 768
        ? "28px"
        : "40px",
  }}
>

  <h1
    style={{
      margin: 0,

      fontSize:
        window.innerWidth < 768
          ? "30px"
          : "54px",

      fontWeight: "900",

      letterSpacing: "-1px",

      color: "#0f172a",

      lineHeight: "1.1",
    }}
  >
    Créer votre{" "}
    <span
      style={{
        color: "#2563eb",
      }}
    >
      compte
    </span>
  </h1>

  <p
    style={{
      marginTop: "12px",

      color: "#64748b",

      fontSize:
        window.innerWidth < 768
          ? "14px"
          : "18px",

      lineHeight: "1.7",

      maxWidth: "500px",

      marginLeft: "auto",

      marginRight: "auto",
    }}
  >
    Accédez à une expérience d'achat rapide,
    sécurisée et personnalisée sur
    Konan Shopping.
  </p>

  <div
    style={{
      width: "50px",

      height: "4px",

      borderRadius: "999px",

      background:
        "linear-gradient(135deg,#2563eb,#60a5fa)",

      margin: "18px auto 0",
    }}
  />

</div>
{/* NOM COMPLET */}

<div
  style={{
    marginBottom: "25px",
  }}
>

  <p
    style={{
      color: "#0f172a",
      fontWeight: "700",
      fontSize: "15px",
      marginBottom: "10px",
    }}
  >
    Nom complet
  </p>

  <div
    style={{
      height: "68px",

      border: "1.5px solid #e2e8f0",

      borderRadius: "18px",

      background: "#ffffff",

      display: "flex",

      alignItems: "center",

      padding: "0 18px",

      transition: "0.3s",
    }}
  >

    <FaUser
      style={{
        color: "#94a3b8",

        fontSize: "18px",

        marginRight: "12px",

        flexShrink: 0,
      }}
    />

    <input
      type="text"

      placeholder="Entrez votre nom"

      value={name}

      onChange={(e) =>
        setName(e.target.value)
      }

      style={{
        flex: 1,

        border: "none",

        outline: "none",

        background: "transparent",

        fontSize: "15px",

        color: "#0f172a",
      }}
    />

  </div>

</div>

    {/* EMAIL */}

<div
  style={{
    marginBottom: "25px",
  }}
>

  <p
    style={{
      color: "#0f172a",
      fontWeight: "700",
      fontSize: "15px",
      marginBottom: "10px",
    }}
  >
    Adresse e-mail
  </p>

  <div
    style={{
      height: "68px",

      border: "1.5px solid #e2e8f0",

      borderRadius: "18px",

      background: "#ffffff",

      display: "flex",

      alignItems: "center",

      padding: "0 18px",

      transition: "0.3s",
    }}
  >

    <FaEnvelope
      style={{
        color: "#94a3b8",

        fontSize: "18px",

        marginRight: "12px",

        flexShrink: 0,
      }}
    />

    <input
      type="email"

      placeholder="Entrez votre email"

      value={email}

      onChange={(e) =>
        setEmail(e.target.value)
      }

      style={{
        flex: 1,

        border: "none",

        outline: "none",

        background: "transparent",

        fontSize: "15px",

        color: "#0f172a",
      }}
    />

  </div>

</div>

{/* PASSWORD */}

<div
  style={{
    marginBottom: "20px",
  }}
>

  <p
    style={{
      color: "#0f172a",
      fontWeight: "700",
      fontSize: "15px",
      marginBottom: "10px",
    }}
  >
    Mot de passe
  </p>

  <div
    style={{
      height: "68px",

      border: "1.5px solid #e2e8f0",

      borderRadius: "18px",

      background: "#ffffff",

      display: "flex",

      alignItems: "center",

      padding: "0 18px",

      transition: "0.3s",
    }}
  >

    <FaLock
      style={{
        color: "#94a3b8",

        fontSize: "18px",

        marginRight: "12px",

        flexShrink: 0,
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
        flex: 1,

        border: "none",

        outline: "none",

        background: "transparent",

        fontSize: "15px",

        color: "#0f172a",
      }}
    />

    <div
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }

      style={{
        cursor: "pointer",

        color: "#94a3b8",

        fontSize: "18px",

        marginLeft: "10px",
      }}
    >

      {showPassword ? (
        <FaEyeSlash />
      ) : (
        <FaEye />
      )}

    </div>

  </div>

</div>


{/* SECURITY */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    gap: "8px",

    marginBottom: "25px",

    padding: "12px",

    background: "#f8fafc",

    border: "1px solid #e2e8f0",

    borderRadius: "14px",

    color: "#16a34a",

    fontSize: "13px",

    fontWeight: "600",
  }}
>
  <FaShieldAlt
    style={{
      fontSize: "15px",
    }}
  />

  Vos données sont sécurisées
</div>

{/* BUTTON */}

<button
  onClick={register}

  disabled={loading}

  style={{
    width: "100%",

    height: "62px",

    border: "none",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",

    color: "#ffffff",

    fontSize: "16px",

    fontWeight: "700",

    letterSpacing: "0.3px",

    cursor: "pointer",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "10px",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.20)",

    transition:
      "all 0.25s ease",
  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-2px) scale(1.01)";

    e.currentTarget.style.boxShadow =
      "0 16px 35px rgba(37,99,235,0.30)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px) scale(1)";

    e.currentTarget.style.boxShadow =
      "0 10px 25px rgba(37,99,235,0.20)";

  }}
>

  {loading ? (

    "Création..."

  ) : (

    <>
      <FaUserPlus />
      Créer mon compte
    </>

  )}

</button>

       {/* SEPARATOR */}

<div
  style={{
    display: "flex",
    alignItems: "center",

    gap: "12px",

    marginTop: "25px",

    marginBottom: "25px",
  }}
>

  <div
    style={{
      flex: 1,

      height: "1px",

      background: "#e2e8f0",
    }}
  />

  <span
    style={{
      color: "#94a3b8",

      fontSize: "11px",

      fontWeight: "600",

      letterSpacing: "1px",
    }}
  >
    OU
  </span>

  <div
    style={{
      flex: 1,

      height: "1px",

      background: "#e2e8f0",
    }}
  />

</div>

{/* LOGIN BUTTON */}

<button
  onClick={() =>
    window.location.href =
      "/login"
  }

  style={{
    width: "100%",

    height: "62px",

    borderRadius: "18px",

    border: "1.5px solid #2563eb",

    background: "#ffffff",

    color: "#2563eb",

    fontSize: "16px",

    fontWeight: "700",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    transition: "all 0.25s ease",

    boxShadow:
      "0 8px 20px rgba(37,99,235,0.08)",
  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-2px)";

    e.currentTarget.style.boxShadow =
      "0 14px 30px rgba(37,99,235,0.15)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)";

    e.currentTarget.style.boxShadow =
      "0 8px 20px rgba(37,99,235,0.08)";

  }}
>

  <FaSignInAlt />

  Se connecter

</button>

{/* TRUST BADGES */}

<div
  style={{
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  }}
>

  <div
    style={{
      height: "34px",
      padding: "0 12px",
      background: "#eff6ff",
      color: "#2563eb",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      border: "1px solid #dbeafe",
    }}
  >
    <FaShieldAlt />
    SSL Sécurisé
  </div>

  <div
    style={{
      height: "34px",
      padding: "0 12px",
      background: "#f0fdf4",
      color: "#16a34a",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      border: "1px solid #bbf7d0",
    }}
  >
    <FaCheckCircle />
    Données protégées
  </div>

  <div
    style={{
      height: "34px",
      padding: "0 12px",
      background: "#ffffff",
      color: "#0f172a",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      border: "1px solid #e2e8f0",
    }}
  >
    <FaUser />
    Premium
  </div>

</div>
</div>
</div>

  );

}



export default Register;