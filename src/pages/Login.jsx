import { useState } from "react";
import axios from "axios";
import { Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE_URL = "https://konanshopping.com";
const API_TIMEOUT = 15000;

// ======================================================
// VALIDATION EMAIL
// ======================================================
const isValidEmail = (value) =>
  typeof value === "string" &&
  value.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// ======================================================
// CONFIGURATION API
// ======================================================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ======================================================
// GESTION DES ERREURS
// ======================================================
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

// ======================================================
// PAGE LOGIN ADMIN
// ======================================================
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ======================================================
  // CONNEXION ADMINISTRATEUR
  // ======================================================
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

      // Conservation du comportement initial.
      // Cette donnée ne doit jamais servir à authentifier la session.
      // La session doit être vérifiée par le serveur via le cookie HttpOnly.
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

  // ======================================================
  // VALIDATION AVEC LA TOUCHE ENTRÉE
  // ======================================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  // ======================================================
  // INTERFACE
  // ======================================================
  return (
    <div className="konan-admin-login-page">
      <div className="konan-admin-login-card">
        {/* LOGO */}
        <div className="konan-admin-login-brand">
          <img
            src="/logo.jpg"
            alt="Konan Shopping"
            className="konan-admin-login-logo"
          />

          <h1>Konan Admin</h1>
          <p>Connexion sécurisée administrateur</p>
        </div>

        {/* EMAIL */}
        <div className="konan-admin-login-field">
          <div className="konan-admin-login-input-wrap">
            <Mail size={20} aria-hidden="true" />
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              autoComplete="username"
              inputMode="email"
              spellCheck={false}
              maxLength={254}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Adresse email"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="konan-admin-login-field konan-admin-login-password">
          <div className="konan-admin-login-input-wrap">
            <Lock size={20} aria-hidden="true" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              autoComplete="current-password"
              maxLength={256}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Mot de passe"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          aria-busy={isLoading}
          className="konan-admin-login-button"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </div>

      <style>{`
        .konan-admin-login-page,
        .konan-admin-login-page * {
          box-sizing: border-box;
        }

        .konan-admin-login-page {
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          padding-top: max(24px, env(safe-area-inset-top));
          padding-right: max(24px, env(safe-area-inset-right));
          padding-bottom: max(24px, env(safe-area-inset-bottom));
          padding-left: max(24px, env(safe-area-inset-left));
          overflow-x: hidden;
          background: linear-gradient(135deg, #6A5AFA, #8B7BFF, #BFA2FF);
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
        }

        .konan-admin-login-card {
          width: 100%;
          max-width: 420px;
          min-width: 0;
          padding: clamp(24px, 6vw, 40px);
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 30px;
          background: rgba(255,255,255,.15);
          -webkit-backdrop-filter: blur(20px);
          backdrop-filter: blur(20px);
          box-shadow: 0 10px 40px rgba(0,0,0,.2);
          color: #fff;
        }

        .konan-admin-login-brand {
          margin-bottom: clamp(25px, 6vw, 35px);
          text-align: center;
        }

        .konan-admin-login-logo {
          display: block;
          width: clamp(72px, 20vw, 85px);
          height: clamp(72px, 20vw, 85px);
          margin: 0 auto 15px;
          object-fit: contain;
        }

        .konan-admin-login-brand h1 {
          margin: 0 0 10px;
          font-size: clamp(25px, 6vw, 34px);
          line-height: 1.15;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .konan-admin-login-brand p {
          margin: 0;
          color: rgba(255,255,255,.86);
          font-size: clamp(13px, 3.5vw, 15px);
          line-height: 1.5;
        }

        .konan-admin-login-field {
          width: 100%;
          margin-bottom: 20px;
        }

        .konan-admin-login-password {
          margin-bottom: 25px;
        }

        .konan-admin-login-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-width: 0;
          min-height: 56px;
          padding: 0 15px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 15px;
          background: rgba(255,255,255,.2);
          color: #fff;
        }

        .konan-admin-login-input-wrap svg {
          flex: 0 0 auto;
          color: rgba(255,255,255,.95);
        }

        .konan-admin-login-input-wrap input {
          flex: 1 1 auto;
          width: 100%;
          min-width: 0;
          min-height: 54px;
          padding: 0;
          border: 0;
          border-radius: 0;
          outline: none;
          background: transparent;
          color: #fff;
          font-family: inherit;
          font-size: 16px;
          line-height: 1.4;
          -webkit-appearance: none;
          appearance: none;
        }

        .konan-admin-login-input-wrap input::placeholder {
          color: rgba(255,255,255,.78);
          opacity: 1;
        }

        .konan-admin-login-input-wrap:focus-within {
          border-color: rgba(255,255,255,.85);
          box-shadow: 0 0 0 3px rgba(255,255,255,.13);
        }

        .konan-admin-login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 54px;
          padding: 14px 18px;
          border: 0;
          border-radius: 16px;
          background: #fff;
          color: #6A5AFA;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-appearance: none;
          appearance: none;
          transition: transform .2s ease, opacity .2s ease, background .2s ease;
        }

        .konan-admin-login-button:disabled {
          background: #e8e8e8;
          cursor: not-allowed;
          opacity: .8;
        }

        @media (hover: hover) and (pointer: fine) {
          .konan-admin-login-button:not(:disabled):hover {
            transform: translateY(-2px);
          }
        }

        .konan-admin-login-button:focus-visible {
          outline: 3px solid rgba(255,255,255,.9);
          outline-offset: 3px;
        }

        @media (max-width: 480px) {
          .konan-admin-login-page {
            align-items: center;
            padding: 16px;
            padding-top: max(16px, env(safe-area-inset-top));
            padding-right: max(16px, env(safe-area-inset-right));
            padding-bottom: max(16px, env(safe-area-inset-bottom));
            padding-left: max(16px, env(safe-area-inset-left));
          }

          .konan-admin-login-card {
            max-width: 100%;
            border-radius: 24px;
          }
        }

        @media (max-width: 350px) {
          .konan-admin-login-page {
            padding-right: 12px;
            padding-left: 12px;
          }

          .konan-admin-login-card {
            padding: 22px 18px;
            border-radius: 20px;
          }

          .konan-admin-login-input-wrap {
            padding-right: 11px;
            padding-left: 11px;
          }
        }

        @media (max-height: 560px) and (orientation: landscape) {
          .konan-admin-login-page {
            align-items: flex-start;
            padding-top: max(14px, env(safe-area-inset-top));
            padding-bottom: max(14px, env(safe-area-inset-bottom));
          }

          .konan-admin-login-card {
            margin: auto 0;
            padding-top: 20px;
            padding-bottom: 20px;
          }

          .konan-admin-login-brand {
            margin-bottom: 18px;
          }

          .konan-admin-login-logo {
            width: 58px;
            height: 58px;
            margin-bottom: 8px;
          }

          .konan-admin-login-brand h1 {
            font-size: 25px;
          }

          .konan-admin-login-field {
            margin-bottom: 12px;
          }

          .konan-admin-login-password {
            margin-bottom: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .konan-admin-login-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
