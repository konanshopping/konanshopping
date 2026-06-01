import { useState } from "react";
import axios from "axios";
import { Lock, Mail } from "lucide-react";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/admin-login",
        {
          email: email.trim(),
          password: password.trim(),
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(res.data.user)
      );

      alert("Connexion réussie 🚀");

      window.location.href = "/admin";

    } catch (err) {

      console.log(err);

      if (err.response) {

        alert(err.response.data.message);

      } else {

        alert("Erreur serveur");

      }

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
          "linear-gradient(135deg,#6A5AFA,#8B7BFF,#BFA2FF)",
        padding: "20px",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          borderRadius: "30px",
          padding: "40px",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.2)",
          color: "white",
        }}
      >

        {/* LOGO */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >

          <img
            src="/logo.png"
            alt=""
            style={{
              width: "85px",
              marginBottom: "15px",
            }}
          />

          <h1
            style={{
              fontSize: "34px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            Konan Admin
          </h1>

          <p
            style={{
              opacity: 0.8,
            }}
          >
            Connexion sécurisée administrateur
          </p>

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
              background: "rgba(255,255,255,0.2)",
              padding: "15px",
              borderRadius: "15px",
            }}
          >

            <Mail size={20} />

            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                color: "white",
                marginLeft: "10px",
                fontSize: "16px",
              }}
            />

          </div>

        </div>

        {/* PASSWORD */}

        <div
          style={{
            marginBottom: "25px",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.2)",
              padding: "15px",
              borderRadius: "15px",
            }}
          >

            <Lock size={20} />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                color: "white",
                marginLeft: "10px",
                fontSize: "16px",
              }}
            />

          </div>

        </div>

        {/* BUTTON */}

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "16px",
            background: "white",
            color: "#6A5AFA",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Se connecter
        </button>

      </div>

    </div>

  );

}

export default Login;