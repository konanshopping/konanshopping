import { useEffect, useState } from "react";
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
const API_BASE_URL = "https://konanshopping.com/api";
const API_TIMEOUT = 15000;
// Authentification par cookie HttpOnly
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
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Un seul conteneur de défilement sur la page Register : le body.
  // Même stratégie que la page Success qui a résolu le double scroll.
  // Les styles précédents sont restaurés lorsque l’utilisateur quitte la page.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverflowY = html.style.overflowY;
    const previousBodyOverflowY = body.style.overflowY;
    const previousBodyHeight = body.style.height;
    const previousBodyMinHeight = body.style.minHeight;
    const previousBodyWebkitOverflowScrolling = body.style.webkitOverflowScrolling;
    html.style.overflow = "hidden";
    html.style.overflowY = "hidden";
    body.style.height = "100dvh";
    body.style.minHeight = "0";
    body.style.overflowY = "auto";
    body.style.webkitOverflowScrolling = "touch";
    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.overflowY = previousHtmlOverflowY;
      body.style.overflowY = previousBodyOverflowY;
      body.style.height = previousBodyHeight;
      body.style.minHeight = previousBodyMinHeight;
      body.style.webkitOverflowScrolling = previousBodyWebkitOverflowScrolling;
    };
  }, []);
  const register = async () => {
    if (loading) return;
    const safeName = typeof name === "string" ? name.trim() : "";
    const safeEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const safePassword = typeof password === "string" ? password : "";
    if (!safeName) {
      toast.error("Nom complet requis");
      return;
    }
    if (safeName.length > 100) {
      toast.error("Le nom est trop long");
      return;
    }
    if (!safeEmail) {
      toast.error("Adresse e-mail requise");
      return;
    }
    if (
      safeEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)
    ) {
      toast.error("Adresse e-mail invalide");
      return;
    }
    if (!safePassword) {
      toast.error("Mot de passe requis");
      return;
    }
    if (safePassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (safePassword.length > 128) {
      toast.error("Le mot de passe est trop long");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/register", {
        name: safeName,
        email: safeEmail,
        password: safePassword,
      });
      const responseData = res?.data;
      const serverUser = responseData?.user;
      if (
        typeof serverUser !== "object" ||
        serverUser === null ||
        typeof serverUser._id !== "string" ||
        !serverUser._id.trim()
      ) {
        throw new Error("Réponse serveur invalide.");
      }
      const userData = {
        _id: serverUser._id,
        name:
          typeof serverUser.name === "string" ? serverUser.name : safeName,
        email:
          typeof serverUser.email === "string" ? serverUser.email : safeEmail,
        registerDate: Date.now(),
      };
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch {
        throw new Error("Impossible d'enregistrer la session.");
      }
      toast.success("Compte créé avec succès 🚀");
      setTimeout(() => {
        window.location.href = "/account";
      }, 1500);
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      if (err?.response?.status === 429) {
        toast.error(
          "Trop de tentatives. Veuillez patienter avant de réessayer."
        );
      } else if (
        typeof serverMessage === "string" &&
        serverMessage.trim()
      ) {
        toast.error(serverMessage.trim().slice(0, 300));
      } else if (err?.code === "ECONNABORTED") {
        toast.error(
          "Le serveur met trop de temps à répondre. Réessayez."
        );
      } else if (!err?.response) {
        toast.error(
          "Impossible de contacter le serveur. Vérifiez votre connexion."
        );
      } else {
        toast.error("Erreur serveur");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="konan-register-page">
      <div className="konan-register-orb konan-register-orb-top" />
      <div className="konan-register-orb konan-register-orb-bottom" />
      <section className="konan-register-card" aria-labelledby="register-title">
        <div className="konan-register-card-glow" />
        <div className="konan-register-content">
          <header className="konan-register-header">
            <div className="konan-register-logo-wrap">
              <span className="konan-register-logo-ring" />
              <img
                src="/logo.jpg"
                alt="Konan Shopping"
                className="konan-register-logo"
              />
            </div>
            <div className="konan-register-kicker">
              <span />
              Bienvenue chez Konan Shopping
            </div>
            <h1 id="register-title">
              Créer votre <span>compte</span>
            </h1>
            <p>
              Accédez à une expérience d'achat rapide, sécurisée et
              personnalisée sur Konan Shopping.
            </p>
            <div className="konan-register-title-line" />
          </header>
          <form
            className="konan-register-form"
            onSubmit={(event) => {
              event.preventDefault();
              register();
            }}
          >
            <div className="konan-register-field">
              <label htmlFor="register-name">Nom complet</label>
              <div className="konan-register-input-wrap">
                <FaUser className="konan-register-input-icon" aria-hidden="true" />
                <input
                  id="register-name"
                  type="text"
                  placeholder="Entrez votre nom"
                  value={name}
                  maxLength={100}
                  autoComplete="name"
                  disabled={loading}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="konan-register-field">
              <label htmlFor="register-email">Adresse e-mail</label>
              <div className="konan-register-input-wrap">
                <FaEnvelope
                  className="konan-register-input-icon"
                  aria-hidden="true"
                />
                <input
                  id="register-email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  maxLength={254}
                  autoComplete="email"
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="konan-register-field konan-register-password-field">
              <label htmlFor="register-password">Mot de passe</label>
              <div className="konan-register-input-wrap">
                <FaLock className="konan-register-input-icon" aria-hidden="true" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  maxLength={128}
                  autoComplete="new-password"
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="konan-register-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  aria-pressed={showPassword}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <span className="konan-register-field-hint">
                6 caractères minimum
              </span>
            </div>
            <div className="konan-register-security">
              <span className="konan-register-security-icon">
                <FaShieldAlt aria-hidden="true" />
              </span>
              <span>
                <strong>Vos données sont sécurisées</strong>
                <small>Vos informations restent protégées.</small>
              </span>
              <FaCheckCircle
                className="konan-register-security-check"
                aria-hidden="true"
              />
            </div>
            <button
              type="submit"
              className="konan-register-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="konan-register-spinner" />
                  Création...
                </>
              ) : (
                <>
                  <FaUserPlus aria-hidden="true" />
                  Créer mon compte
                  <span className="konan-register-submit-arrow">→</span>
                </>
              )}
            </button>
          </form>
          <div className="konan-register-separator">
            <span />
            <small>OU</small>
            <span />
          </div>
          <button
            type="button"
            className="konan-register-login"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            <FaSignInAlt aria-hidden="true" />
            Se connecter
            <span className="konan-register-submit-arrow">→</span>
          </button>
          <div className="konan-register-trust-badges">
            <span className="trust-blue">
              <FaShieldAlt aria-hidden="true" />
              SSL Sécurisé
            </span>
            <span className="trust-green">
              <FaCheckCircle aria-hidden="true" />
              Données protégées
            </span>
            <span className="trust-neutral">
              <FaUser aria-hidden="true" />
              Premium
            </span>
          </div>
          <footer className="konan-register-footer">
            En créant votre compte, vous rejoignez la communauté Konan Shopping.
          </footer>
        </div>
      </section>
      <style>{`
        .konan-register-page {
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          overflow: hidden;
          padding: max(28px, env(safe-area-inset-top)) 20px max(28px, env(safe-area-inset-bottom));
          background:
            radial-gradient(ellipse at 50% 0%, var(--season-glow), transparent 45%),
            linear-gradient(180deg, var(--season-surface-soft) 0%, var(--season-surface) 48%, var(--season-surface-soft) 100%);
          color: var(--season-text);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .konan-register-page \*,
        .konan-register-page \*::before,
        .konan-register-page \*::after {
          box-sizing: border-box;
        }
        .konan-register-orb {
          position: absolute;
          z-index: -1;
          width: 390px;
          height: 390px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(55px);
          animation: konan-register-orb-float 10s ease-in-out infinite alternate;
        }
        .konan-register-orb-top {
          top: -210px;
          right: -130px;
          background: var(--season-glow);
        }
        .konan-register-orb-bottom {
          bottom: -220px;
          left: -150px;
          width: 350px;
          height: 350px;
          background: var(--season-glow);
          animation-delay: -5s;
        }
        .konan-register-card {
          position: relative;
          width: 100%;
          max-width: 900px;
          overflow: hidden;
          border: 1px solid var(--season-border);
          border-radius: 30px;
          background: linear-gradient(180deg, var(--season-surface) 0%, var(--season-surface) 100%);
          box-shadow: 0 25px 75px rgba(15,23,42,.09), 0 4px 15px var(--season-glow);
          animation: konan-register-card-enter 1.25s cubic-bezier(.16,1,.3,1) both;
        }
        .konan-register-card-glow {
          position: absolute;
          top: -130px;
          right: -120px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: var(--season-glow);
          filter: blur(48px);
          pointer-events: none;
        }
        .konan-register-content {
          position: relative;
          z-index: 1;
          width: min(100%, 610px);
          margin: 0 auto;
          padding: 48px 35px 30px;
        }
        .konan-register-header {
          margin-bottom: 34px;
          text-align: center;
          opacity: 0;
          animation: konan-register-content-enter .9s cubic-bezier(.16,1,.3,1) .2s forwards;
        }
        .konan-register-logo-wrap {
          position: relative;
          display: grid;
          place-items: center;
          width: 132px;
          height: 132px;
          margin: 0 auto 22px;
        }
        .konan-register-logo {
          position: relative;
          z-index: 1;
          display: block;
          width: 112px;
          height: 112px;
          border: 4px solid var(--season-surface);
          border-radius: 50%;
          background: var(--season-surface);
          object-fit: contain;
          box-shadow: 0 12px 32px var(--season-glow);
          animation: konan-register-logo-float 4.5s ease-in-out 1.4s infinite;
        }
        .konan-register-logo-ring {
          position: absolute;
          inset: 0;
          border: 1px solid var(--season-glow);
          border-radius: 50%;
          animation: konan-register-ring 3.8s ease-out 1s infinite;
        }
        .konan-register-kicker {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 13px;
          color: var(--season-primary);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .konan-register-kicker span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--season-primary);
          box-shadow: 0 0 0 4px var(--season-glow);
        }
        .konan-register-header h1 {
          margin: 0;
          color: var(--season-text);
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1.12;
          letter-spacing: -1.5px;
          font-weight: 900;
        }
        .konan-register-header h1 span {
          color: var(--season-primary);
        }
        .konan-register-header p {
          max-width: 480px;
          margin: 13px auto 0;
          color: var(--season-text);
          font-size: 15px;
          line-height: 1.7;
        }
        .konan-register-title-line {
          width: 52px;
          height: 4px;
          margin: 19px auto 0;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--season-primary), var(--season-accent));
          transform-origin: center;
          animation: konan-register-line-grow 1s cubic-bezier(.16,1,.3,1) .7s both;
        }
        .konan-register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .konan-register-field {
          opacity: 0;
          animation: konan-register-content-enter .8s cubic-bezier(.16,1,.3,1) both;
        }
        .konan-register-field:nth-child(1) { animation-delay: .48s; }
        .konan-register-field:nth-child(2) { animation-delay: .62s; }
        .konan-register-field:nth-child(3) { animation-delay: .76s; }
        .konan-register-field label {
          display: block;
          margin: 0 0 9px 2px;
          color: var(--season-text);
          font-size: 13px;
          font-weight: 800;
        }
        .konan-register-input-wrap {
          display: flex;
          align-items: center;
          width: 100%;
          min-width: 0;
          height: 61px;
          padding: 0 17px;
          border: 1.5px solid var(--season-border);
          border-radius: 15px;
          background: var(--season-surface);
          transition: border-color .22s ease, box-shadow .22s ease, transform .22s ease;
        }
        .konan-register-input-wrap:focus-within {
          border-color: var(--season-accent);
          box-shadow: 0 0 0 4px var(--season-glow);
          transform: translateY(-1px);
        }
        .konan-register-input-icon {
          flex: 0 0 auto;
          margin-right: 13px;
          color: #94a3b8;
          font-size: 17px;
        }
        .konan-register-input-wrap input {
          flex: 1;
          width: 100%;
          min-width: 0;
          height: 100%;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--season-text);
          font: inherit;
          font-size: 16px;
          -webkit-appearance: none;
          appearance: none;
        }
        .konan-register-input-wrap input::placeholder {
          color: #a0aec0;
          font-size: 13px;
        }
        .konan-register-input-wrap input:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
        .konan-register-password-toggle {
          display: grid;
          place-items: center;
          flex: 0 0 36px;
          width: 36px;
          height: 36px;
          margin-left: 8px;
          padding: 0;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #94a3b8;
          font-size: 17px;
          cursor: pointer;
          transition: color .2s ease, background .2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .konan-register-password-toggle:hover {
          background: var(--season-surface-soft);
          color: var(--season-primary);
        }
        .konan-register-password-toggle:disabled {
          opacity: .5;
          cursor: not-allowed;
        }
        .konan-register-password-toggle:focus-visible,
        .konan-register-submit:focus-visible,
        .konan-register-login:focus-visible {
          outline: 3px solid var(--season-glow);
          outline-offset: 3px;
        }
        .konan-register-field-hint {
          display: block;
          margin: 7px 0 0 2px;
          color: #94a3b8;
          font-size: 11px;
        }
        .konan-register-security {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 1px;
          padding: 13px 15px;
          border: 1px solid var(--season-border);
          border-radius: 14px;
          background: var(--season-surface-soft);
          color: #16a34a;
          opacity: 0;
          animation: konan-register-content-enter .8s cubic-bezier(.16,1,.3,1) .92s forwards;
        }
        .konan-register-security-icon {
          display: grid;
          place-items: center;
          flex: 0 0 34px;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #ecfdf5;
          font-size: 15px;
        }
        .konan-register-security > span:nth-child(2) {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .konan-register-security strong {
          color: #166534;
          font-size: 12px;
          font-weight: 800;
        }
        .konan-register-security small {
          color: #718096;
          font-size: 11px;
        }
        .konan-register-security-check {
          flex: 0 0 auto;
          font-size: 15px;
        }
        .konan-register-submit,
        .konan-register-login {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 59px;
          padding: 13px 18px;
          border-radius: 15px;
          font: inherit;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .konan-register-submit {
          margin-top: 1px;
          border: 0;
          background: linear-gradient(135deg, var(--season-primary), var(--season-secondary));
          color: var(--season-surface);
          box-shadow: 0 11px 26px var(--season-glow);
          opacity: 0;
          animation: konan-register-content-enter .85s cubic-bezier(.16,1,.3,1) 1.08s forwards;
        }
        .konan-register-submit:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px var(--season-glow);
        }
        .konan-register-submit:active:not(:disabled) {
          transform: translateY(-1px) scale(.99);
        }
        .konan-register-submit:disabled {
          opacity: .68;
          cursor: not-allowed;
          box-shadow: none;
        }
        .konan-register-submit-arrow {
          position: absolute;
          right: 19px;
          opacity: .72;
          transition: transform .22s ease;
        }
        .konan-register-submit:hover .konan-register-submit-arrow,
        .konan-register-login:hover .konan-register-submit-arrow {
          transform: translateX(4px);
        }
        .konan-register-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,.4);
          border-top-color: var(--season-surface);
          border-radius: 50%;
          animation: konan-register-spin .7s linear infinite;
        }
        .konan-register-separator {
          display: flex;
          align-items: center;
          gap: 13px;
          margin: 23px 0;
          opacity: 0;
          animation: konan-register-content-enter .8s ease-out 1.25s forwards;
        }
        .konan-register-separator span {
          flex: 1;
          height: 1px;
          background: var(--season-border);
        }
        .konan-register-separator small {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }
        .konan-register-login {
          border: 1.5px solid var(--season-primary);
          background: var(--season-surface);
          color: var(--season-primary);
          box-shadow: 0 7px 18px var(--season-glow);
          opacity: 0;
          animation: konan-register-content-enter .8s cubic-bezier(.16,1,.3,1) 1.38s forwards;
        }
        .konan-register-login:hover {
          transform: translateY(-2px);
          background: var(--season-surface-soft);
          box-shadow: 0 13px 25px var(--season-glow);
        }
        .konan-register-trust-badges {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 21px;
          opacity: 0;
          animation: konan-register-content-enter .8s ease-out 1.5s forwards;
        }
        .konan-register-trust-badges span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 32px;
          padding: 0 11px;
          border: 1px solid transparent;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
        }
        .konan-register-trust-badges .trust-blue {
          border-color: var(--season-border);
          background: var(--season-surface-soft);
          color: var(--season-primary);
        }
        .konan-register-trust-badges .trust-green {
          border-color: #bbf7d0;
          background: #f0fdf4;
          color: #16a34a;
        }
        .konan-register-trust-badges .trust-neutral {
          border-color: var(--season-border);
          background: var(--season-surface);
          color: var(--season-text);
        }
        .konan-register-footer {
          margin-top: 22px;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.6;
          text-align: center;
          opacity: 0;
          animation: konan-register-content-enter .8s ease-out 1.62s forwards;
        }
        @keyframes konan-register-card-enter {
          from { opacity: 0; transform: translateY(30px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes konan-register-content-enter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes konan-register-logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes konan-register-ring {
          0% { opacity: 0; transform: scale(.84); }
          25% { opacity: .7; }
          100% { opacity: 0; transform: scale(1.14); }
        }
        @keyframes konan-register-line-grow {
          from { opacity: .3; transform: scaleX(.15); }
          to { opacity: 1; transform: scaleX(1); }
        }
        @keyframes konan-register-orb-float {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(14px, -18px, 0); }
        }
        @keyframes konan-register-spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 767px) {
          .konan-register-page {
            align-items: stretch;
            padding: max(0px, env(safe-area-inset-top)) 0 max(0px, env(safe-area-inset-bottom));
          }
          .konan-register-card {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: none;
            min-height: 100vh;
            min-height: 100dvh;
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }
          .konan-register-content {
            width: 100%;
            max-width: 560px;
            padding: 28px 22px max(28px, env(safe-area-inset-bottom));
          }
          .konan-register-logo-wrap {
            width: 104px;
            height: 104px;
            margin-bottom: 18px;
          }
          .konan-register-logo {
            width: 88px;
            height: 88px;
          }
          .konan-register-header {
            margin-bottom: 27px;
          }
          .konan-register-header h1 {
            font-size: clamp(30px, 8vw, 38px);
          }
          .konan-register-header p {
            max-width: 390px;
            font-size: 13px;
          }
          .konan-register-form {
            gap: 17px;
          }
          .konan-register-input-wrap {
            height: 57px;
            border-radius: 13px;
          }
          .konan-register-submit,
          .konan-register-login {
            min-height: 55px;
          }
        }
        @media (max-width: 360px) {
          .konan-register-content {
            padding-right: 16px;
            padding-left: 16px;
          }
          .konan-register-trust-badges {
            gap: 6px;
          }
          .konan-register-trust-badges span {
            padding: 0 8px;
            font-size: 9px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .konan-register-page \*,
          .konan-register-page \*::before,
          .konan-register-page \*::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
          .konan-register-header,
          .konan-register-field,
          .konan-register-security,
          .konan-register-submit,
          .konan-register-separator,
          .konan-register-login,
          .konan-register-trust-badges,
          .konan-register-footer {
            opacity: 1 !important;
            transform: none !important;
          }
        }
        /\* Ajustements responsive iOS, mobiles et grands écrans \*/
        .konan-register-page {
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          overflow-x: clip;
          overflow-y: visible;
          overscroll-behavior-y: auto;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }
        .konan-register-card {
          width: min(100%, 720px);
          max-width: 720px;
        }
        .konan-register-content {
          width: min(100%, 610px);
        }
        .konan-register-input-wrap input {
          font-size: 16px;
          line-height: 1.4;
        }
        .konan-register-submit,
        .konan-register-login,
        .konan-register-password-toggle {
          touch-action: manipulation;
        }
        @media (min-width: 768px) {
          .konan-register-page {
            padding: clamp(32px, 5vh, 64px) 28px;
          }
          .konan-register-card {
            border-radius: 28px;
          }
          .konan-register-content {
            padding: clamp(42px, 5vw, 58px) 42px 36px;
          }
        }
        @media (max-width: 767px) {
          .konan-register-page {
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            overflow-y: visible;
          }
          .konan-register-card {
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            height: auto;
          }
          .konan-register-content {
            margin: auto;
            padding-top: clamp(22px, 5vh, 38px);
            padding-bottom: max(24px, env(safe-area-inset-bottom));
          }
          .konan-register-input-wrap {
            min-height: 56px;
          }
          .konan-register-password-toggle {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
          }
          .konan-register-submit,
          .konan-register-login {
            min-height: 56px;
          }
        }
        @media (max-height: 720px) and (max-width: 767px) {
          .konan-register-content {
            padding-top: 20px;
          }
          .konan-register-logo-wrap {
            width: 82px;
            height: 82px;
            margin-bottom: 13px;
          }
          .konan-register-logo {
            width: 72px;
            height: 72px;
          }
          .konan-register-header {
            margin-bottom: 20px;
          }
          .konan-register-header p {
            margin-top: 9px;
            line-height: 1.5;
          }
          .konan-register-form {
            gap: 14px;
          }
        }
        @media (hover: none) and (pointer: coarse) {
          .konan-register-submit:hover:not(:disabled),
          .konan-register-login:hover {
            transform: none;
          }
        }
        /\* Finitions Safari iOS : clavier virtuel, focus et largeur \*/
        .konan-register-page,
        .konan-register-card,
        .konan-register-content {
          min-width: 0;
          max-width: 100%;
        }
        .konan-register-field {
          scroll-margin-top: 24px;
          scroll-margin-bottom: 24px;
        }
        .konan-register-input-wrap input {
          min-width: 0;
          max-width: 100%;
          -webkit-text-size-adjust: 100%;
        }
        .konan-register-submit,
        .konan-register-login,
        .konan-register-password-toggle {
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }
        @supports not (height: 100dvh) {
          .konan-register-page,
          .konan-register-card {
            min-height: 100vh;
          }
        }
        @media (max-width: 767px) {
          .konan-register-page {
            width: 100%;
            padding-left: max(0px, env(safe-area-inset-left));
            padding-right: max(0px, env(safe-area-inset-right));
          }
          .konan-register-content {
            padding-left: clamp(16px, 5vw, 24px);
            padding-right: clamp(16px, 5vw, 24px);
          }
        }
      `}</style>
    </main>
  );
}
export default Register;
