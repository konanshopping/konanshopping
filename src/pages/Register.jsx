import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
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

        alignItems: "center",

        overflow: "hidden",

        position: "relative",

        background:
          "linear-gradient(135deg,#0F172A,#1E1B4B,#312E81)",

        padding: "20px",
      }}
    >

      {/* LIGHT EFFECT */}

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
            "#4F46E5",

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

          maxWidth: "500px",

          background:
            "rgba(255,255,255,0.08)",

          backdropFilter:
            "blur(25px)",

          border:
            "1px solid rgba(255,255,255,0.12)",

          borderRadius: "38px",

          padding: "45px 35px",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.35)",

          position: "relative",

          zIndex: 5,
        }}
      >

        {/* LOGO PREMIUM */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >

          <div

            style={{

              width: "150px",

              height: "150px",

              borderRadius: "40px",

              background:
                "rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(20px)",

              border:
                "1px solid rgba(255,255,255,0.15)",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              boxShadow:
                "0 20px 60px rgba(124,58,237,0.45)",

              transition: "0.4s",

              overflow: "hidden",

              cursor: "pointer",

            }}

            onMouseEnter={(e) => {

              e.currentTarget.style.transform =
                "translateY(-8px) scale(1.03)";

              e.currentTarget.style.boxShadow =
                "0 30px 80px rgba(124,58,237,0.7)";

            }}

            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                "translateY(0px) scale(1)";

              e.currentTarget.style.boxShadow =
                "0 20px 60px rgba(124,58,237,0.45)";

            }}
          >

            <img
              src="/logo.jpg"
              alt="Konan Shopping"

              style={{

                width: "85%",

                objectFit: "contain",

                filter:
                  "drop-shadow(0 10px 20px rgba(0,0,0,0.25))",

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
              color: "white",

              fontSize: "42px",

              fontWeight: "900",

              marginBottom: "10px",

              letterSpacing: "-1px",
            }}
          >
            Créer un compte
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.7)",

              fontSize: "15px",

              lineHeight: "26px",
            }}
          >
            Rejoignez Konan Shopping
            et profitez d'une expérience
            premium de vente en ligne.
          </p>

        </div>

        {/* NAME */}

        <div
          style={{
            marginBottom: "22px",
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

            <i
              className="fa-solid fa-user"
              style={{
                marginRight: "10px",
                color: "#A78BFA",
              }}
            ></i>

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

            style={inputStyle}
          />

        </div>

        {/* EMAIL */}

        <div
          style={{
            marginBottom: "22px",
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

            <i
              className="fa-solid fa-envelope"
              style={{
                marginRight: "10px",
                color: "#A78BFA",
              }}
            ></i>

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

            style={inputStyle}
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

            <i
              className="fa-solid fa-lock"
              style={{
                marginRight: "10px",
                color: "#A78BFA",
              }}
            ></i>

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

            style={inputStyle}
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={register}

          disabled={loading}

          style={buttonStyle}

          onMouseEnter={(e) => {

            e.target.style.transform =
              "translateY(-4px)";

            e.target.style.boxShadow =
              "0 20px 45px rgba(124,58,237,0.6)";

          }}

          onMouseLeave={(e) => {

            e.target.style.transform =
              "translateY(0px)";

            e.target.style.boxShadow =
              "0 15px 35px rgba(124,58,237,0.45)";

          }}
        >

          {loading ? (

            <>
              <i
                className="fa-solid fa-spinner fa-spin"
                style={{
                  marginRight: "10px",
                }}
              ></i>

              Création...

            </>

          ) : (

            <>
              <i
                className="fa-solid fa-user-plus"
                style={{
                  marginRight: "10px",
                }}
              ></i>

              Créer mon compte

            </>

          )}

        </button>

        {/* LOGIN LINK */}

        <button
          onClick={() =>
            window.location.href =
              "/login"
          }

          style={{
            width: "100%",

            padding: "17px",

            marginTop: "18px",

            borderRadius: "18px",

            border:
              "1px solid rgba(255,255,255,0.15)",

            background:
              "rgba(255,255,255,0.05)",

            color: "white",

            fontSize: "15px",

            fontWeight: "700",

            cursor: "pointer",

            transition: "0.3s",
          }}

          onMouseEnter={(e) => {

            e.target.style.background =
              "rgba(255,255,255,0.12)";

          }}

          onMouseLeave={(e) => {

            e.target.style.background =
              "rgba(255,255,255,0.05)";

          }}
        >

          <i
            className="fa-solid fa-right-to-bracket"
            style={{
              marginRight: "10px",
            }}
          ></i>

          J'ai déjà un compte

        </button>

      </div>

    </div>

  );

}

// =========================
// INPUT STYLE
// =========================

const inputStyle = {

  width: "100%",

  padding: "18px",

  borderRadius: "18px",

  border:
    "1px solid rgba(255,255,255,0.1)",

  background:
    "rgba(255,255,255,0.08)",

  color: "white",

  fontSize: "15px",

  outline: "none",

  boxSizing:
    "border-box",

};

// =========================
// BUTTON STYLE
// =========================

const buttonStyle = {

  width: "100%",

  padding: "18px",

  border: "none",

  borderRadius: "20px",

  background:
    "linear-gradient(135deg,#8B5CF6,#4F46E5)",

  color: "white",

  fontSize: "16px",

  fontWeight: "800",

  cursor: "pointer",

  boxShadow:
    "0 15px 35px rgba(124,58,237,0.45)",

  transition: "0.3s",

};

export default Register;