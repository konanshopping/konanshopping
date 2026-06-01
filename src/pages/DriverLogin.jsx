import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function DriverLogin() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {

    try {

      const res =
        await axios.post(
          "http://localhost:5000/driver-login",
          {
            email,
            password,
          }
        );

      localStorage.setItem(
  "driver",
  JSON.stringify(res.data)
);

      alert(
        "Connexion réussie 🚚"
      );

      navigate("/driver-dashboard");

    } catch (err) {

      alert(
        "Email ou mot de passe incorrect"
      );

      console.log(err);

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background:
          "linear-gradient(135deg,#eef2ff,#f5f3ff,#ede9fe)",

        padding: "20px",

        position: "relative",

        overflow: "hidden",
      }}
    >

      {/* BACKGROUND CIRCLES */}

      <div
        style={{
          position: "absolute",

          width: "400px",

          height: "400px",

          borderRadius: "50%",

          background:
            "rgba(91,61,245,0.15)",

          top: "-120px",

          left: "-120px",

          filter: "blur(50px)",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "350px",

          height: "350px",

          borderRadius: "50%",

          background:
            "rgba(124,77,255,0.15)",

          bottom: "-100px",

          right: "-100px",

          filter: "blur(50px)",
        }}
      />

      {/* CARD */}

      <div
        style={{
          width: "430px",

          background:
            "rgba(255,255,255,0.95)",

          backdropFilter:
            "blur(18px)",

          borderRadius: "32px",

          padding: "45px",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.12)",

          position: "relative",

          zIndex: 2,
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

          <div
            style={{
              width: "95px",

              height: "95px",

              borderRadius: "28px",

              background:
                "linear-gradient(135deg,#5b3df5,#7c4dff)",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              fontSize: "45px",

              color: "white",

              boxShadow:
                "0 15px 35px rgba(91,61,245,0.35)",
            }}
          >
            🚚
          </div>

        </div>

        {/* TITLE */}

        <h1
          style={{
            textAlign: "center",

            margin: 0,

            fontSize: "38px",

            color: "#111827",

            fontWeight: "800",
          }}
        >
          Connexion Livreur
        </h1>

        <p
          style={{
            textAlign: "center",

            marginTop: "12px",

            color: "#6b7280",

            fontSize: "15px",

            lineHeight: "1.7",
          }}
        >
          Accédez à votre espace de livraison
          Konan Shopping Cameroun 🚀
        </p>

        {/* EMAIL */}

        <div
          style={{
            marginTop: "35px",
          }}
        >

          <label
            style={{
              fontWeight: "700",

              color: "#374151",

              fontSize: "14px",
            }}
          >
            Adresse email
          </label>

          <input
            type="email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            placeholder="Entrez votre email"

            style={{
              width: "100%",

              padding: "18px",

              marginTop: "10px",

              borderRadius: "18px",

              border:
                "1px solid #e5e7eb",

              outline: "none",

              fontSize: "15px",

              background: "#f9fafb",

              boxSizing: "border-box",
            }}
          />

        </div>

        {/* PASSWORD */}

        <div
          style={{
            marginTop: "22px",
          }}
        >

          <label
            style={{
              fontWeight: "700",

              color: "#374151",

              fontSize: "14px",
            }}
          >
            Mot de passe
          </label>

          <input
            type="password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            placeholder="********"

            style={{
              width: "100%",

              padding: "18px",

              marginTop: "10px",

              borderRadius: "18px",

              border:
                "1px solid #e5e7eb",

              outline: "none",

              fontSize: "15px",

              background: "#f9fafb",

              boxSizing: "border-box",
            }}
          />

        </div>

        {/* BUTTON */}

        <button

          onClick={login}

          style={{
            width: "100%",

            marginTop: "35px",

            background:
              "linear-gradient(135deg,#5b3df5,#7c4dff)",

            color: "white",

            border: "none",

            padding: "18px",

            borderRadius: "18px",

            fontSize: "16px",

            fontWeight: "800",

            cursor: "pointer",

            boxShadow:
              "0 12px 30px rgba(91,61,245,0.35)",

            transition: "0.3s",
          }}
        >
          🚚 Se connecter
        </button>

        {/* FOOTER */}

        <p
          style={{
            textAlign: "center",

            marginTop: "28px",

            color: "#6b7280",

            fontSize: "14px",
          }}
        >
          Pas encore livreur ?{" "}

          <Link
            to="/driver-register"

            style={{
              color: "#5b3df5",

              textDecoration: "none",

              fontWeight: "700",
            }}
          >
            Créer un compte
          </Link>

        </p>

      </div>

    </div>

  );

}