import { useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import {

  FaEnvelope,

  FaShieldAlt,

  FaArrowLeft,

  FaPaperPlane,

} from "react-icons/fa";

const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;

const MAX_EMAIL_LENGTH = 254;

const isValidEmail = (value) =>

  typeof value === "string" &&

  value.length <= MAX_EMAIL_LENGTH &&

  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: API_TIMEOUT,

  headers: {

    Accept: "application/json",

    "Content-Type": "application/json",

  },

});

const getApiErrorMessage = (error) => {

  if (error?.response?.status === 429) {

    return "Trop de demandes. Veuillez patienter avant de réessayer.";

  }

  if (error?.response?.status === 400) {

    return (

      error.response?.data?.message ||

      "Adresse e-mail invalide ou demande incorrecte."

    );

  }

  if (error?.response?.status === 404) {

    return (

      error.response?.data?.message ||

      "Aucun compte correspondant à cette adresse e-mail."

    );

  }

  if (error?.code === "ECONNABORTED") {

    return "La demande a expiré. Veuillez réessayer.";

  }

  return (

    error?.response?.data?.message ||

    "Une erreur est survenue. Veuillez réessayer."

  );

};

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const sendResetLink = async () => {

    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {

      toast.error("Veuillez saisir votre adresse e-mail.");

      return;

    }

    if (!isValidEmail(normalizedEmail)) {

      toast.error("Veuillez saisir une adresse e-mail valide.");

      return;

    }

    try {

      setLoading(true);

      const res = await api.post("/api/forgot-password", {

        email: normalizedEmail,

      });

      const message =

        typeof res?.data?.message === "string" &&

        res.data.message.trim()

          ? res.data.message.trim()

          : "Si cette adresse est associée à un compte, un lien de récupération a été envoyé.";

      toast.success(message);

    } catch (err) {

      toast.error(getApiErrorMessage(err));

    } finally {

      setLoading(false);

    }

  };

  const handleEmailKeyDown = (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      sendResetLink();

    }

  };

  return (

    <main className="forgot-page">

      <style>{`

        .forgot-page,

        .forgot-page * {

          box-sizing: border-box;

        }

        .forgot-page {

          min-height: 100vh;

          min-height: 100svh;

          min-height: 100dvh;

          width: 100%;

          display: flex;

          justify-content: center;

          align-items: center;

          position: relative;

          isolation: isolate;

          overflow-x: hidden;

          overflow-y: auto;

          padding: 24px;

          padding-top: max(24px, env(safe-area-inset-top));

          padding-right: max(24px, env(safe-area-inset-right));

          padding-bottom: max(24px, env(safe-area-inset-bottom));

          padding-left: max(24px, env(safe-area-inset-left));

          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #eef4ff 100%);

          -webkit-text-size-adjust: 100%;

          text-size-adjust: 100%;

        }

        .forgot-halo {

          position: absolute;

          border-radius: 50%;

          filter: blur(60px);

          pointer-events: none;

          z-index: -1;

        }

        .forgot-halo-top {

          width: 300px;

          height: 300px;

          top: -150px;

          right: -150px;

          background: color-mix(in srgb, var(--season-primary, var(--season-primary, #2563eb)) 10%, transparent);

        }

        .forgot-halo-bottom {

          width: 280px;

          height: 280px;

          bottom: -150px;

          left: -150px;

          background: color-mix(in srgb, var(--season-secondary, var(--season-secondary, #3b82f6)) 8%, transparent);

        }

        .forgot-card {

          width: 100%;

          max-width: 550px;

          padding: 48px;

          position: relative;

          z-index: 1;

          overflow: hidden;

          border: 1px solid color-mix(in srgb, var(--season-primary, var(--season-primary, #2563eb)) 8%, transparent);

          border-radius: 32px;

          background: linear-gradient(180deg, #ffffff, #f8fbff);

          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.08);

        }

        .forgot-logo-wrap {

          display: flex;

          justify-content: center;

          margin-bottom: 28px;

        }

        .forgot-logo-circle {

          width: 132px;

          height: 132px;

          flex: 0 0 auto;

          display: flex;

          justify-content: center;

          align-items: center;

          border: 3px solid var(--season-primary, #2563eb);

          border-radius: 50%;

          background: linear-gradient(135deg, #ffffff, #f8fafc);

          box-shadow: 0 15px 40px color-mix(in srgb, var(--season-primary, var(--season-primary, #2563eb)) 15%, transparent);

        }

        .forgot-logo-circle img {

          display: block;

          width: 80%;

          height: 80%;

          object-fit: contain;

        }

        .forgot-heading {

          text-align: center;

          margin-bottom: 34px;

        }

        .forgot-title {

          display: flex;

          justify-content: center;

          align-items: center;

          flex-wrap: wrap;

          gap: 8px;

          margin: 0;

          color: #0f172a;

          font-size: clamp(25px, 5vw, 42px);

          font-weight: 900;

          line-height: 1.12;

          letter-spacing: -0.04em;

        }

        .forgot-title-accent {

          color: var(--season-primary, #2563eb);

        }

        .forgot-underline {

          width: 76px;

          height: 4px;

          margin: 14px auto;

          border-radius: 999px;

          background: linear-gradient(135deg, var(--season-primary, #2563eb), var(--season-secondary, #3b82f6));

        }

        .forgot-description {

          max-width: 450px;

          margin: 0 auto;

          color: #64748b;

          font-size: 16px;

          line-height: 1.7;

          text-align: center;

        }

        .forgot-field {

          margin-bottom: 22px;

        }

        .forgot-label {

          display: block;

          margin: 0 0 12px;

          color: #0f172a;

          font-size: 15px;

          font-weight: 800;

        }

        .forgot-input-wrap {

          position: relative;

        }

        .forgot-input-icon {

          position: absolute;

          top: 50%;

          left: 18px;

          transform: translateY(-50%);

          color: #94a3b8;

          font-size: 19px;

          pointer-events: none;

        }

        .forgot-input {

          display: block;

          width: 100%;

          min-width: 0;

          height: 64px;

          padding: 0 18px 0 54px;

          border: 1.5px solid #e2e8f0;

          border-radius: 18px;

          outline: none;

          background: #ffffff;

          color: #0f172a;

          font-family: inherit;

          font-size: 16px;

          line-height: normal;

          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);

          -webkit-appearance: none;

          appearance: none;

        }

        .forgot-input:focus {

          border-color: var(--season-primary, #2563eb);

          box-shadow: 0 0 0 4px color-mix(in srgb, var(--season-primary, var(--season-primary, #2563eb)) 10%, transparent);

        }

        .forgot-button {

          width: 100%;

          min-height: 58px;

          margin-top: 14px;

          padding: 12px 18px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          border: 0;

          border-radius: 16px;

          font-family: inherit;

          font-size: 16px;

          font-weight: 800;

          cursor: pointer;

          touch-action: manipulation;

          -webkit-tap-highlight-color: transparent;

          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

        }

        .forgot-button-primary {

          margin-top: 8px;

          color: #ffffff;

          background: linear-gradient(135deg, var(--season-primary, #2563eb), var(--season-secondary, #3b82f6));

          box-shadow: 0 12px 30px color-mix(in srgb, var(--season-primary, var(--season-primary, #2563eb)) 25%, transparent);

        }

        .forgot-button-secondary {

          color: var(--season-primary, #2563eb);

          border: 2px solid var(--season-primary, #2563eb);

          background: #ffffff;

          box-shadow: 0 10px 25px color-mix(in srgb, var(--season-primary, var(--season-primary, #2563eb)) 8%, transparent);

        }

        .forgot-button:disabled {

          cursor: not-allowed;

          opacity: 0.78;

          background: linear-gradient(135deg, #64748b, #94a3b8);

        }

        .forgot-button:focus-visible {

          outline: 3px solid color-mix(in srgb, var(--season-primary, var(--season-primary, #2563eb)) 35%, transparent);

          outline-offset: 3px;

        }

        .forgot-security {

          margin-top: 22px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          color: #64748b;

          font-size: 13px;

          font-weight: 600;

          text-align: center;

        }

        .forgot-security svg {

          flex: 0 0 auto;

          color: var(--season-primary, #2563eb);

        }

        @media (hover: hover) and (pointer: fine) {

          .forgot-button:not(:disabled):hover {

            transform: translateY(-2px);

          }

        }

        @media (max-width: 767px) {

          .forgot-page {

            align-items: flex-start;

            padding: 0;

            padding-top: env(safe-area-inset-top);

            padding-right: env(safe-area-inset-right);

            padding-bottom: max(22px, env(safe-area-inset-bottom));

            padding-left: env(safe-area-inset-left);

          }

          .forgot-card {

            width: 100%;

            max-width: none;

            min-height: calc(100vh - env(safe-area-inset-top));

            min-height: calc(100svh - env(safe-area-inset-top));

            min-height: calc(100dvh - env(safe-area-inset-top));

            padding: clamp(20px, 5vw, 34px);

            border: 0;

            border-radius: 0;

            box-shadow: none;

          }

          .forgot-logo-wrap {

            margin-bottom: 22px;

          }

          .forgot-logo-circle {

            width: clamp(88px, 25vw, 112px);

            height: clamp(88px, 25vw, 112px);

          }

          .forgot-heading {

            margin-bottom: 28px;

          }

          .forgot-title {

            gap: 5px;

            font-size: clamp(23px, 6vw, 32px);

          }

          .forgot-description {

            font-size: 14px;

          }

          .forgot-input {

            height: 58px;

            border-radius: 16px;

          }

          .forgot-button {

            min-height: 54px;

            font-size: 15px;

          }

        }

        @media (max-width: 360px) {

          .forgot-card {

            padding: 18px 16px;

          }

          .forgot-title {

            font-size: 22px;

            letter-spacing: -0.03em;

          }

          .forgot-description {

            font-size: 13px;

          }

          .forgot-security {

            font-size: 11px;

          }

        }

        @media (max-height: 600px) and (orientation: landscape) {

          .forgot-page {

            align-items: flex-start;

          }

          .forgot-card {

            min-height: 0;

          }

          .forgot-logo-wrap {

            margin-bottom: 14px;

          }

          .forgot-logo-circle {

            width: 76px;

            height: 76px;

          }

          .forgot-heading {

            margin-bottom: 18px;

          }

        }

        @media (prefers-reduced-motion: reduce) {

          .forgot-button {

            transition: none;

          }

        }

      `}</style>

      <div className="forgot-halo forgot-halo-top" aria-hidden="true" />

      <div className="forgot-halo forgot-halo-bottom" aria-hidden="true" />

      <section className="forgot-card" aria-labelledby="forgot-title">

        <div className="forgot-logo-wrap">

          <div className="forgot-logo-circle">

            <img src="/logo.jpg" alt="Konan Shopping" />

          </div>

        </div>

        <div className="forgot-heading">

          <h1 className="forgot-title" id="forgot-title">

            <span>Récupération</span>

            <span className="forgot-title-accent">de compte</span>

          </h1>

          <div className="forgot-underline" />

          <p className="forgot-description">

            Entrez votre adresse e-mail pour recevoir un lien sécurisé permettant

            de récupérer votre compte Konan Shopping.

          </p>

        </div>

        <div className="forgot-field">

          <label className="forgot-label" htmlFor="forgot-email">

            Adresse e-mail

          </label>

          <div className="forgot-input-wrap">

            <FaEnvelope className="forgot-input-icon" aria-hidden="true" />

            <input

              id="forgot-email"

              className="forgot-input"

              type="email"

              placeholder="Entrez votre email"

              value={email}

              maxLength={MAX_EMAIL_LENGTH}

              autoComplete="email"

              inputMode="email"

              spellCheck={false}

              onChange={(e) => setEmail(e.target.value)}

              onKeyDown={handleEmailKeyDown}

              autoCapitalize="none"

              enterKeyHint="send"

            />

          </div>

        </div>

        <button

          type="button"

          className="forgot-button forgot-button-primary"

          onClick={sendResetLink}

          disabled={loading}

          aria-busy={loading}

        >

          <FaPaperPlane aria-hidden="true" />

          {loading ? "Envoi..." : "Envoyer le lien"}

        </button>

        <button

          type="button"

          className="forgot-button forgot-button-secondary"

          onClick={() => {

            window.location.href = "/login";

          }}

        >

          <FaArrowLeft aria-hidden="true" />

          Retour connexion

        </button>

        <div className="forgot-security">

          <FaShieldAlt aria-hidden="true" />

          <span>Lien sécurisé • Expiration après 30 min</span>

        </div>

      </section>

    </main>

  );

}

export default ForgotPassword;
