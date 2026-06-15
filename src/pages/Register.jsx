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
"linear-gradient(135deg,#f8fafc,#ffffff,#eef4ff)",

        padding:
  window.innerWidth < 768
    ? "0"
    : "20px",
      }}
    >


      {/* CARD */}

<div
  style={{
    width: "100%",

    maxWidth:
      window.innerWidth < 768
        ? "100%"
        : "900px",

    minHeight:
      window.innerWidth < 768
        ? "100vh"
        : "auto",

    background: "#ffffff",

    borderRadius:
      window.innerWidth < 768
        ? "0px"
        : "35px",

    padding:
      window.innerWidth < 768
        ? "25px"
        : "60px 70px",

    boxShadow:
      window.innerWidth < 768
        ? "none"
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

    {/* LOGO PREMIUM */}

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  }}
>

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "110px"
          : "170px",

      height:
        window.innerWidth < 768
          ? "110px"
          : "170px",

      borderRadius: "50%",

      background:
        "linear-gradient(135deg,#ffffff,#f8fafc)",

      border:
        "3px solid #2563eb",

      display: "flex",

      justifyContent: "center",

      alignItems: "center",

      boxShadow:
        "0 15px 40px rgba(37,99,235,0.15)",

      position: "relative",
    }}
  >

    <img
      src="/logo.jpg"

      alt="Konan Shopping"

      style={{
        width: "75%",

        objectFit: "contain",
      }}
    />

  </div>

</div>

{/* TITLE */}

<div
  style={{
    textAlign: "center",
    marginBottom: "45px",
  }}
>

  <h1
    style={{
      margin: 0,

      fontSize:
        window.innerWidth < 768
          ? "42px"
          : "70px",

      fontWeight: "900",

      color: "#07133d",

      lineHeight: "1",
    }}
  >
    Créer un
  </h1>

  <h1
    style={{
      margin: 0,

      fontSize:
        window.innerWidth < 768
          ? "50px"
          : "70px",

      fontWeight: "900",

      color: "#2563eb",

      lineHeight: "1",
    }}
  >
    compte
  </h1>

  <div
    style={{
      width: "90px",

      height: "6px",

      background:
        "linear-gradient(135deg,#2563eb,#60a5fa)",

      margin: "18px auto",

      borderRadius: "20px",
    }}
  />

  <p
    style={{
      color: "#64748b",

      fontSize:
        window.innerWidth < 768
          ? "16px"
          : "20px",

      lineHeight: "1.8",

      maxWidth: "600px",

      margin: "0 auto",
    }}
  >
    Rejoignez Konan Shopping et profitez
    d'une expérience premium de vente en ligne.
  </p>

</div>
       {/* NAME */}

<div
  style={{
    marginBottom: "20px",
  }}
>

  <div
  style={{
    display: "flex",

    alignItems: "center",

    background: "#ffffff",

    border:
      "2px solid #eef2ff",

    borderRadius: "24px",

    padding:
      window.innerWidth < 768
        ? "16px"
        : "20px",

    boxShadow:
      "0 12px 30px rgba(15,23,42,0.05)",

    transition: "all .3s ease",

    minHeight: "95px",
  }}
>

    {/* ICON */}

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "60px"
            : "72px",

        height:
          window.innerWidth < 768
            ? "60px"
            : "72px",

        borderRadius: "18px",

        background:
  "linear-gradient(135deg,#2563eb,#60a5fa)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        marginRight: "18px",

        flexShrink: 0,
      }}
    >

      <FaUser
  style={{
    color: "#ffffff",

          fontSize:
            window.innerWidth < 768
              ? "24px"
              : "28px",
        }}
      />

    </div>

    {/* INPUT */}

    <div
      style={{
        flex: 1,
      }}
    >

      <p
        style={{
          margin: 0,

          color: "#0f172a",

          fontWeight: "700",

          fontSize: "15px",

          marginBottom: "8px",
        }}
      >
        Nom complet
      </p>

      <input
        type="text"

        placeholder="Entrez votre nom"

        value={name}

        onChange={(e) =>
          setName(
            e.target.value
          )
        }

        style={{
          width: "100%",

          border: "none",

          outline: "none",

          background: "transparent",

          fontSize: "18px",

          color: "#64748b",

          padding: 0,
        }}
      />

    </div>

  </div>

</div>

    {/* EMAIL */}

<div
  style={{
    marginBottom: "20px",
  }}
>

  <div
    style={{
      display: "flex",

      alignItems: "center",

      background: "#ffffff",

      border:
        "2px solid #eef2ff",

      borderRadius: "24px",

      padding:
        window.innerWidth < 768
          ? "12px"
          : "14px",

      boxShadow:
        "0 12px 30px rgba(15,23,42,0.05)",

      transition: "all .3s ease",

      minHeight: "78px",
    }}
  >

    {/* ICON */}

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "50px"
            : "58px",

        height:
          window.innerWidth < 768
            ? "50px"
            : "58px",

        borderRadius: "16px",

        background:
          "linear-gradient(135deg,#2563eb,#60a5fa)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        marginRight: "12px",

        flexShrink: 0,
      }}
    >

      <FaEnvelope
        style={{
          color: "#ffffff",

          fontSize:
            window.innerWidth < 768
              ? "20px"
              : "22px",
        }}
      />

    </div>

    {/* INPUT */}

    <div
      style={{
        flex: 1,
      }}
    >

      <p
        style={{
          margin: 0,

          color: "#0f172a",

          fontWeight: "700",

          fontSize: "13px",

          marginBottom: "5px",
        }}
      >
        Adresse e-mail
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

          border: "none",

          outline: "none",

          background: "transparent",

          fontSize:
            window.innerWidth < 768
              ? "15px"
              : "16px",

          color: "#0f172a",

          padding: 0,
        }}
      />

    </div>

  </div>

</div>

{/* PASSWORD */}

<div
  style={{
    marginBottom: "15px",
  }}
>

  <div
    style={{
      display: "flex",

      alignItems: "center",

      background: "#ffffff",

      border:
        "2px solid #eef2ff",

      borderRadius: "24px",

      padding:
        window.innerWidth < 768
          ? "12px"
          : "14px",

      boxShadow:
        "0 12px 30px rgba(15,23,42,0.05)",

      transition: "all .3s ease",

      minHeight: "78px",
    }}
  >

    {/* ICON */}

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "50px"
            : "58px",

        height:
          window.innerWidth < 768
            ? "50px"
            : "58px",

        borderRadius: "16px",

        background:
          "linear-gradient(135deg,#2563eb,#60a5fa)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        marginRight: "12px",

        flexShrink: 0,
      }}
    >

      <FaLock
        style={{
          color: "#ffffff",

          fontSize:
            window.innerWidth < 768
              ? "20px"
              : "22px",
        }}
      />

    </div>

    {/* INPUT */}

    <div
      style={{
        flex: 1,
      }}
    >

      <p
        style={{
          margin: 0,

          color: "#0f172a",

          fontWeight: "700",

          fontSize: "13px",

          marginBottom: "5px",
        }}
      >
        Mot de passe
      </p>

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

          border: "none",

          outline: "none",

          background: "transparent",

          fontSize:
            window.innerWidth < 768
              ? "15px"
              : "16px",

          color: "#0f172a",

          padding: 0,
        }}
      />

    </div>

    {/* EYE */}

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

        paddingLeft: "10px",
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

    gap: "10px",

    marginBottom: "30px",

    color: "#16a34a",

    fontSize: "15px",

    fontWeight: "700",

padding: "14px 18px",
background: "#f0fdf4",
border: "1px solid #bbf7d0",
borderRadius: "16px",

  }}
>

  <FaShieldAlt />

  Vos données sont protégées et sécurisées

</div>

{/* BUTTON */}

<button
  onClick={register}

  disabled={loading}

  style={{

    width: "100%",

    height: "72px",

    letterSpacing: "0.3px",

    border: "none",

    borderRadius: "22px",

    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",

    color: "white",

    fontSize: "18px",

    fontWeight: "800",

    cursor: "pointer",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "12px",

    boxShadow:
  "0 20px 45px rgba(37,99,235,0.30)",

    transition: "0.3s",
  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-3px)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)";

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
    gap: "18px",
    marginTop: "35px",
    marginBottom: "30px",
  }}
>
  <div
    style={{
      flex: 1,
      height: "1px",
      background:
        "linear-gradient(to right,transparent,#dbeafe)",
    }}
  />

  <span
    style={{
      color: "#94a3b8",
      fontSize: "12px",
      fontWeight: "800",
      letterSpacing: "2px",
    }}
  >
    OU
  </span>

  <div
    style={{
      flex: 1,
      height: "1px",
      background:
        "linear-gradient(to left,transparent,#dbeafe)",
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
    height: "68px",
    borderRadius: "24px",
    border: "2px solid #2563eb",
    background: "#ffffff",
    color: "#2563eb",
    fontSize:
  window.innerWidth < 768
    ? "15px"
    : "16px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    transition: "0.3s",
    boxShadow:
      "0 12px 30px rgba(37,99,235,0.08)",
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
    gap: "6px",
  }}
>

  <div
  style={{
    padding: "6px 10px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  }}
>
  <FaShieldAlt />
  Sécurisé
</div>

  <div
  style={{
    padding: "6px 10px",
    background: "#f0fdf4",
    color: "#16a34a",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  }}
>
  <FaCheckCircle />
  Protégé
</div>

  <div
  style={{
    padding: "6px 10px",
    background: "#f8fafc",
    color: "#0f172a",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "4px",
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