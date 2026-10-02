import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaEnvelope,
  FaShieldAlt,
  FaArrowLeft,
  FaPaperPlane,
  FaCheckCircle,
  FaUserShield,
  FaLock,
  FaHeadset,
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems:
          window.innerWidth < 768 ? "flex-start" : "center",
        overflow: "hidden",
        position: "relative",
        background:
          "linear-gradient(180deg,#f8fafc 0%,#ffffff 45%,#eef4ff 100%)",
        padding:
          window.innerWidth < 768 ? "0" : "20px",
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
          background: "rgba(37,99,235,0.10)",
          filter: "blur(60px)",
          pointerEvents: "none",
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
          background: "rgba(96,165,250,0.08)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* CARD */}
      <div
        style={{
          width: "100%",
          maxWidth:
            window.innerWidth < 768 ? "100%" : "550px",
          minHeight:
            window.innerWidth < 768 ? "100vh" : "auto",
          background:
            "linear-gradient(180deg,#ffffff,#f8fbff)",
          borderRadius:
            window.innerWidth < 768 ? "0" : "36px",
          padding:
            window.innerWidth < 768 ? "20px" : "50px",
          boxShadow:
            window.innerWidth < 768
              ? "none"
              : "0 25px 70px rgba(0,0,0,0.08)",
          border:
            window.innerWidth < 768
              ? "none"
              : "1px solid rgba(37,99,235,0.08)",
          position: "relative",
          zIndex: 5,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom:
              window.innerWidth < 768 ? "20px" : "30px",
          }}
        >
          <div
            style={{
              width:
                window.innerWidth < 768 ? "95px" : "140px",
              height:
                window.innerWidth < 768 ? "95px" : "140px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#ffffff,#f8fafc)",
              border: "3px solid #2563eb",
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
                width: "80%",
                height: "80%",
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
              window.innerWidth < 768 ? "28px" : "40px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize:
                window.innerWidth < 768 ? "21px" : "48px",
              fontWeight: "900",
              lineHeight: "1.1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap:
                window.innerWidth < 768 ? "5px" : "10px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#0f172a" }}>
              Récupération
            </span>

            <span style={{ color: "#2563eb" }}>
              de compte
            </span>
          </h1>

          <div
            style={{
              width:
                window.innerWidth < 768 ? "55px" : "80px",
              height:
                window.innerWidth < 768 ? "3px" : "4px",
              background:
                "linear-gradient(135deg,#2563eb,#60a5fa)",
              borderRadius: "999px",
              margin: "14px auto",
            }}
          />

          <p
            style={{
              color: "#64748b",
              fontSize:
                window.innerWidth < 768 ? "13px" : "17px",
              lineHeight: "1.7",
              maxWidth: "450px",
              margin: "0 auto",
            }}
          >
            Entrez votre adresse e-mail pour recevoir
            un lien sécurisé permettant de récupérer
            votre compte Konan Shopping.
          </p>
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: "25px" }}>
          <p
            style={{
              marginBottom: "12px",
              color: "#0f172a",
              fontWeight: "800",
              fontSize: "15px",
            }}
          >
            Adresse e-mail
          </p>

          <div style={{ position: "relative" }}>
            <FaEnvelope
              style={{
                position: "absolute",
                left: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "20px",
                pointerEvents: "none",
              }}
            />

            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              maxLength={MAX_EMAIL_LENGTH}
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEmailKeyDown}
              style={{
                width: "100%",
                height:
                  window.innerWidth < 768 ? "72px" : "75px",
                borderRadius: "24px",
                border: "1.5px solid #e2e8f0",
                paddingLeft: "55px",
                paddingRight: "20px",
                fontSize: "16px",
                background: "#ffffff",
                color: "#0f172a",
                outline: "none",
                boxSizing: "border-box",
                boxShadow:
                  "0 2px 10px rgba(15,23,42,0.03)",
              }}
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={sendResetLink}
          disabled={loading}
          aria-busy={loading}
          style={{
            width: "100%",
            height:
              window.innerWidth < 768 ? "58px" : "64px",
            marginTop: "18px",
            border: "none",
            borderRadius: "18px",
            background:
              loading
                ? "linear-gradient(135deg,#64748b,#94a3b8)"
                : "linear-gradient(135deg,#2563eb,#3b82f6)",
            color: "#ffffff",
            fontWeight: "800",
            fontSize:
              window.innerWidth < 768 ? "15px" : "17px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow:
              "0 12px 30px rgba(37,99,235,0.25)",
            transition: "all .3s ease",
            opacity: loading ? 0.85 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0px)";
          }}
        >
          {loading ? (
            <>
              <FaPaperPlane />
              Envoi...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Envoyer le lien
            </>
          )}
        </button>

        {/* RETOUR */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/login";
          }}
          style={{
            width: "100%",
            height:
              window.innerWidth < 768 ? "58px" : "64px",
            marginTop: "14px",
            border: "2px solid #2563eb",
            borderRadius: "18px",
            background: "#ffffff",
            color: "#2563eb",
            fontWeight: "800",
            fontSize:
              window.innerWidth < 768 ? "15px" : "16px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            boxShadow:
              "0 10px 25px rgba(37,99,235,0.08)",
            transition: "all .3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0px)";
          }}
        >
          <FaArrowLeft />
          Retour connexion
        </button>

        {/* SECURITY */}
        <div
          style={{
            marginTop: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "#64748b",
            fontSize:
              window.innerWidth < 768 ? "12px" : "13px",
            fontWeight: "600",
          }}
        >
          <FaShieldAlt
            style={{
              color: "#2563eb",
              fontSize: "14px",
            }}
          />

          <span>
            Lien sécurisé • Expiration après 30 min
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;