import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

const API_BASE_URL = "https://konanshopping.com/api";
const API_TIMEOUT = 15000;

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 256;
const RESET_TOKEN_MAX_LENGTH = 128;

// Validation du jeton et du mot de passe.
function isValidResetToken(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= RESET_TOKEN_MAX_LENGTH
  );
}

function isValidPassword(value) {
  return (
    typeof value === "string" &&
    value.length >= MIN_PASSWORD_LENGTH &&
    value.length <= MAX_PASSWORD_LENGTH
  );
}

// N'affiche qu'un message serveur exploitable et de longueur raisonnable.
function getSafeServerMessage(error) {
  const message = error?.response?.data?.message;
  if (typeof message !== "string") return "";
  const cleaned = message.trim();
  return cleaned.length > 0 && cleaned.length <= 240 ? cleaned : "";
}

// ======================================================
// AUTHENTIFICATION PAR COOKIE HTTPONLY
// Le navigateur envoie automatiquement le cookie HttpOnly.
// Aucun JWT n'est lu depuis localStorage et aucun Bearer
// n'est ajouté côté frontend.
// ======================================================

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config) return config;
    config.withCredentials = true;
    config.headers = config.headers || {};
    config.headers.Accept = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePassword = async () => {
    const safeToken = typeof token === "string" ? token.trim() : "";

    if (!isValidResetToken(safeToken)) {
      return toast.error("Lien de réinitialisation invalide ou expiré");
    }

    if (!isValidPassword(password)) {
      return toast.error(
        `Le mot de passe doit contenir entre ${MIN_PASSWORD_LENGTH} et ${MAX_PASSWORD_LENGTH} caractères`
      );
    }

    if (password !== confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas");
    }

    if (loading) return;

    try {
      setLoading(true);

      // Backend réel : POST /reset-password/:token
      const res = await api.post(
        `/reset-password/${encodeURIComponent(safeToken)}`,
        { password }
      );

      const responseData = res?.data;
      const user = responseData?.user;

      if (typeof user !== "object" || user === null) {
        throw new Error("Réponse serveur invalide.");
      }

      // Le backend gère la session avec le cookie HttpOnly.
      // Les informations utilisateur non sensibles restent disponibles
      // côté frontend comme dans la logique fournie.
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        throw new Error("Impossible d'enregistrer la session.");
      }

      toast.success("Connexion réussie ✅");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      const serverMessage = getSafeServerMessage(err);

      if (err?.response?.status === 400) {
        toast.error(serverMessage || "Lien expiré ou invalide");
      } else if (err?.response?.status === 429) {
        toast.error(
          "Trop de tentatives. Veuillez patienter avant de réessayer."
        );
      } else if (err?.code === "ECONNABORTED") {
        toast.error(
          "Le serveur met trop de temps à répondre. Réessayez."
        );
      } else if (!err?.response) {
        toast.error(
          "Impossible de contacter le serveur. Vérifiez votre connexion."
        );
      } else {
        toast.error(
          serverMessage || "Impossible de modifier le mot de passe"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="konan-reset-page">
      <div className="konan-reset-decoration konan-reset-decoration-one" />
      <div className="konan-reset-decoration konan-reset-decoration-two" />

      <section className="konan-reset-card" aria-labelledby="reset-title">
        <header className="konan-reset-header">
          <a className="konan-reset-brand" href="/" aria-label="Accueil Konan Shopping">
            <img src="/logo.jpg" alt="Konan Shopping" />
          </a>

          <span className="konan-reset-security">
            <FaShieldAlt aria-hidden="true" />
            Espace sécurisé
          </span>

          <h1 id="reset-title">Nouveau mot de passe</h1>
          <p>
            Choisissez un mot de passe sécurisé pour retrouver l'accès à votre
            compte Konan Shopping.
          </p>
        </header>

        <div className="konan-reset-form">
          <label className="konan-reset-label" htmlFor="new-password">
            Nouveau mot de passe
          </label>
          <div className="konan-reset-input-wrap">
            <FaLock className="konan-reset-input-icon" aria-hidden="true" />
            <input
              id="new-password"
              type="password"
              placeholder="Saisissez votre nouveau mot de passe"
              value={password}
              maxLength={MAX_PASSWORD_LENGTH}
              autoComplete="new-password"
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <label className="konan-reset-label" htmlFor="confirm-password">
            Confirmer le mot de passe
          </label>
          <div className="konan-reset-input-wrap">
            <FaCheckCircle className="konan-reset-input-icon" aria-hidden="true" />
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              maxLength={MAX_PASSWORD_LENGTH}
              autoComplete="new-password"
              disabled={loading}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <p className="konan-reset-hint">
            Votre mot de passe doit contenir entre {MIN_PASSWORD_LENGTH} et{" "}
            {MAX_PASSWORD_LENGTH} caractères.
          </p>

          <button
            type="button"
            className="konan-reset-submit"
            onClick={updatePassword}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="konan-reset-spinner" />
                Modification en cours...
              </>
            ) : (
              "Modifier le mot de passe"
            )}
          </button>
        </div>

        <footer className="konan-reset-footer">
          <FaShieldAlt aria-hidden="true" />
          Vos informations sont protégées
        </footer>
      </section>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="konan-reset-toast"
        bodyClassName="konan-reset-toast-body"
      />

      <style>{`
        .konan-reset-page {
          --konan-blue: var(--season-primary, #2563eb);
          --konan-blue-dark: color-mix(in srgb, var(--season-primary, #2563eb) 78%, #000);
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding:
            max(28px, env(safe-area-inset-top, 0px))
            max(14px, env(safe-area-inset-right, 0px))
            max(28px, env(safe-area-inset-bottom, 0px))
            max(14px, env(safe-area-inset-left, 0px));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          isolation: isolate;
          overflow-x: clip;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: contain;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
          background: linear-gradient(145deg, color-mix(in srgb, var(--season-primary, #2563eb) 3%, white) 0%, color-mix(in srgb, var(--season-primary, #2563eb) 8%, white) 52%, color-mix(in srgb, var(--season-secondary, #3b82f6) 3%, white) 100%);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .konan-reset-page *,
        .konan-reset-page *::before,
        .konan-reset-page *::after {
          box-sizing: border-box;
        }

        .konan-reset-decoration {
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }

        .konan-reset-decoration-one {
          width: 390px;
          height: 390px;
          top: -190px;
          right: -120px;
          background: radial-gradient(circle, color-mix(in srgb, var(--season-primary, #2563eb) 13%, transparent), color-mix(in srgb, var(--season-primary, #2563eb) 0%, transparent));
        }

        .konan-reset-decoration-two {
          width: 440px;
          height: 440px;
          bottom: -250px;
          left: -180px;
          background: radial-gradient(circle, color-mix(in srgb, var(--season-secondary, #3b82f6) 12%, transparent), color-mix(in srgb, var(--season-secondary, #3b82f6) 0%, transparent));
        }

        .konan-reset-card {
          width: min(100%, 490px);
          min-width: 0;
          margin: auto;
          padding: clamp(26px, 5vw, 42px) clamp(18px, 5vw, 42px) 28px;
          border: 1px solid rgba(226,232,240,.9);
          border-radius: 26px;
          background: rgba(255,255,255,.96);
          box-shadow: 0 24px 70px rgba(15, 40, 85, .11), 0 3px 12px rgba(15,23,42,.035);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .konan-reset-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .konan-reset-brand {
          display: inline-flex;
          margin-bottom: 17px;
          border-radius: 50%;
          outline-offset: 5px;
        }

        .konan-reset-brand img {
          display: block;
          width: 86px;
          height: 86px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 10px 28px color-mix(in srgb, var(--season-primary, #2563eb) 17%, transparent);
        }

        .konan-reset-security {
          width: fit-content;
          max-width: 100%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 12px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--season-primary, #2563eb) 9%, white);
          color: var(--season-primary, #2563eb);
          font-size: 12px;
          font-weight: 750;
          letter-spacing: .02em;
        }

        .konan-reset-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(25px, 5vw, 31px);
          line-height: 1.2;
          letter-spacing: -.8px;
          font-weight: 850;
        }

        .konan-reset-header p {
          max-width: 360px;
          margin: 12px auto 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.65;
        }

        .konan-reset-form {
          display: flex;
          flex-direction: column;
        }

        .konan-reset-label {
          margin: 0 0 8px 2px;
          color: #334155;
          font-size: 13px;
          font-weight: 750;
        }

        .konan-reset-input-wrap {
          position: relative;
          margin-bottom: 19px;
        }

        .konan-reset-input-icon {
          position: absolute;
          z-index: 1;
          left: 17px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 16px;
          pointer-events: none;
        }

        .konan-reset-input-wrap input {
          display: block;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          min-height: 56px;
          height: 56px;
          padding: 0 16px 0 48px;
          border: 1px solid #dbe3ef;
          border-radius: 13px;
          outline: none;
          background: #fbfdff;
          color: #0f172a;
          font: inherit;
          font-size: 16px;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
          -webkit-appearance: none;
          appearance: none;
          -webkit-text-size-adjust: 100%;
          touch-action: manipulation;
        }

        .konan-reset-input-wrap input::placeholder {
          color: #a0aec0;
          font-size: 13px;
        }

        .konan-reset-input-wrap input:focus {
          border-color: var(--season-secondary, #3b82f6);
          background: #fff;
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--season-secondary, #3b82f6) 12%, transparent);
        }

        .konan-reset-input-wrap input:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .konan-reset-hint {
          margin: -5px 0 0 2px;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.5;
        }

        .konan-reset-submit {
          width: 100%;
          min-height: 56px;
          margin-top: 23px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--season-secondary, #3b82f6), var(--season-primary, #2563eb));
          color: #fff;
          font: inherit;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 24px color-mix(in srgb, var(--season-primary, #2563eb) 23%, transparent);
          transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          max-width: 100%;
        }

        .konan-reset-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px color-mix(in srgb, var(--season-primary, #2563eb) 29%, transparent);
        }

        .konan-reset-submit:active:not(:disabled) {
          transform: translateY(0) scale(.99);
        }

        .konan-reset-submit:focus-visible {
          outline: 3px solid color-mix(in srgb, var(--season-primary, #2563eb) 35%, transparent);
          outline-offset: 3px;
        }

        .konan-reset-submit:disabled {
          opacity: .7;
          cursor: not-allowed;
          box-shadow: none;
        }

        .konan-reset-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: konan-reset-spin .7s linear infinite;
        }

        .konan-reset-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 27px;
          padding-top: 19px;
          border-top: 1px solid #eef2f7;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 650;
        }

        .konan-reset-footer svg {
          color: var(--season-secondary, #3b82f6);
        }

        .konan-reset-toast {
          min-height: 68px !important;
          padding: 0 !important;
          border: 1px solid #e5eaf2 !important;
          border-radius: 15px !important;
          background: rgba(255,255,255,.98) !important;
          color: #0f172a !important;
          box-shadow: 0 18px 45px rgba(15,23,42,.16) !important;
          overflow: hidden !important;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        }

        .konan-reset-toast-body {
          margin: 0 !important;
          padding: 14px 17px 14px 7px !important;
          color: #0f172a !important;
          font-size: 13px !important;
          font-weight: 650 !important;
          line-height: 1.5 !important;
        }

        .konan-reset-toast .Toastify__toast-icon {
          width: 25px !important;
          margin-left: 13px !important;
          margin-right: 5px !important;
        }

        .konan-reset-toast .Toastify__close-button {
          align-self: center !important;
          margin-right: 10px !important;
          color: #64748b !important;
          opacity: .7 !important;
        }

        .konan-reset-toast .Toastify__close-button:hover {
          opacity: 1 !important;
        }

        .konan-reset-toast.Toastify__toast--success {
          border-left: 4px solid #16a34a !important;
        }

        .konan-reset-toast.Toastify__toast--error {
          border-left: 4px solid #dc2626 !important;
        }

        .konan-reset-toast .Toastify__progress-bar--success {
          background: #16a34a !important;
        }

        .konan-reset-toast .Toastify__progress-bar--error {
          background: #dc2626 !important;
        }

        @keyframes konan-reset-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .konan-reset-page {
            align-items: flex-start;
            justify-content: center;
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            padding:
              max(18px, env(safe-area-inset-top, 0px))
              max(14px, env(safe-area-inset-right, 0px))
              max(18px, env(safe-area-inset-bottom, 0px))
              max(14px, env(safe-area-inset-left, 0px));
            overflow-x: clip;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .konan-reset-card {
            width: 100%;
            max-width: 440px;
            margin: auto;
            padding: clamp(24px, 6vw, 30px) clamp(16px, 5vw, 22px) 23px;
            border-radius: 21px;
          }

          .konan-reset-brand img {
            width: 74px;
            height: 74px;
          }

          .konan-reset-header {
            margin-bottom: 25px;
          }

          .konan-reset-header p {
            font-size: 13px;
          }

          .konan-reset-input-wrap input {
            height: 54px;
          }

          .konan-reset-submit {
            min-height: 54px;
          }

          .Toastify__toast-container {
            width: calc(100% - 24px) !important;
            left: 12px !important;
            right: 12px !important;
            top: max(12px, env(safe-area-inset-top)) !important;
            padding: 0 !important;
          }

          .konan-reset-toast {
            width: 100% !important;
            min-height: 64px !important;
            margin-bottom: 9px !important;
            border-radius: 13px !important;
          }

          .konan-reset-toast-body {
            font-size: 12.5px !important;
          }
        }

        @media (max-width: 360px) {
          .konan-reset-card {
            padding: 26px 17px 20px;
          }

          .konan-reset-header h1 {
            font-size: 25px;
          }

          .konan-reset-input-wrap input::placeholder {
            font-size: 12px;
          }
        }

        /* Ajustements complémentaires Safari iOS, clavier virtuel et écrans courts */
        .konan-reset-page,
        .konan-reset-card,
        .konan-reset-form,
        .konan-reset-input-wrap {
          min-width: 0;
        }

        .konan-reset-page img,
        .konan-reset-page svg {
          max-width: 100%;
        }

        .konan-reset-submit,
        .konan-reset-input-wrap input,
        .konan-reset-brand {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        @supports (height: 100dvh) {
          .konan-reset-page {
            min-height: 100dvh;
          }
        }

        @media (max-width: 380px) {
          .konan-reset-page {
            padding-left: max(12px, env(safe-area-inset-left, 0px));
            padding-right: max(12px, env(safe-area-inset-right, 0px));
          }

          .konan-reset-card {
            padding-left: 15px;
            padding-right: 15px;
          }

          .konan-reset-submit {
            padding-left: 12px;
            padding-right: 12px;
            font-size: 14px;
          }
        }

        @media (max-height: 650px) and (max-width: 600px) {
          .konan-reset-page {
            align-items: flex-start;
            padding-top: max(12px, env(safe-area-inset-top, 0px));
            padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
          }

          .konan-reset-card {
            margin-top: 0;
            margin-bottom: 0;
          }

          .konan-reset-header {
            margin-bottom: 18px;
          }

          .konan-reset-brand {
            margin-bottom: 10px;
          }

          .konan-reset-brand img {
            width: 62px;
            height: 62px;
          }

          .konan-reset-input-wrap {
            margin-bottom: 14px;
          }

          .konan-reset-footer {
            margin-top: 18px;
            padding-top: 14px;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .konan-reset-submit:hover:not(:disabled) {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .konan-reset-page *,
          .konan-reset-page *::before,
          .konan-reset-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

export default ResetPassword;
