import { useState } from "react";
import axios from "axios";
import { Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE_URL = "https://konanshopping.com";
const API_TIMEOUT = 15000;

const isValidEmail = (value) =>
  typeof value === "string" &&
  value.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const handleApiError = (err) => {
  if (err?.response?.status === 401) {
    return "Identifiants administrateur incorrects";
  }

  if (err?.response?.status === 429) {
    return "Trop de tentatives. Veuillez patienter avant de réessayer.";
  }

  if (err?.code === "ECONNABORTED") {
    return "Le serveur met trop de temps à répondre.";
  }

  if (err?.response?.data?.message) {
    return String(err.response.data.message);
  }

  return "Erreur serveur";
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      toast.error("Veuillez saisir une adresse email valide");
      return;
    }

    if (!cleanPassword) {
      toast.error("Veuillez saisir votre mot de passe");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post(
        "/api/admin-login",
        {
          email: cleanEmail,
          password: cleanPassword,
        },
        {
          withCredentials: true,
        }
      );

      const adminUser = res?.data?.user;

      if (!adminUser || typeof adminUser !== "object") {
        throw new Error("Réponse de connexion invalide");
      }

      localStorage.setItem("admin", JSON.stringify(adminUser));

      toast.success("Connexion réussie 🚀");

      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
    } catch (err) {
      console.log("Erreur connexion administrateur:", err);
      toast.error(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
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
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
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
            src="/logo.jpg"
            alt="Konan Shopping"
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
              autoComplete="username"
              maxLength={254}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
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
              autoComplete="current-password"
              maxLength={256}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
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
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "16px",
            background: isLoading ? "#e8e8e8" : "white",
            color: "#6A5AFA",
            fontSize: "18px",
            fontWeight: "700",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "0.3s",
            opacity: isLoading ? 0.8 : 1,
          }}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </div>
  );
}

export default Login;