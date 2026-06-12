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

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const sendResetLink = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "https://konanshopping-production.up.railway.app/forgot-password",
        {
          email,
        }
      );

      toast.success(
        res.data.message
      );

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Erreur"
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

        padding: "20px",

        position: "relative",

        overflow: "hidden",

        background:
          "linear-gradient(135deg,#f8fafc,#eff6ff,#eef2ff)",
      }}
    >

      {/* LIGHT EFFECT */}

      <div
        style={{
          position: "absolute",

          width: "350px",

          height: "350px",

          borderRadius: "50%",

          background:
            "rgba(37,99,235,0.08)",

          top: "-120px",

          left: "-120px",

          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "350px",

          height: "350px",

          borderRadius: "50%",

          background:
            "rgba(79,70,229,0.08)",

          bottom: "-120px",

          right: "-120px",

          filter: "blur(80px)",
        }}
      />

      {/* CARD */}

      <div
        style={{
          width: "100%",

          maxWidth: "550px",

          background: "#ffffff",

          borderRadius: "40px",

          padding:
            window.innerWidth < 768
              ? "30px 22px"
              : "50px",

          boxShadow:
            "0 25px 70px rgba(0,0,0,0.08)",

          border:
            "1px solid rgba(37,99,235,0.08)",

          position: "relative",

          zIndex: 5,
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
              width: "140px",

              height: "140px",

              borderRadius: "50%",

              background:
                "linear-gradient(135deg,#ffffff,#f8fafc)",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              boxShadow:
                "0 20px 50px rgba(37,99,235,0.15)",

              border:
                "3px solid rgba(37,99,235,0.15)",
            }}
          >

            <img
              src="/logo.jpg"

              alt="Konan Shopping"

              style={{
                width: "95px",

                height: "95px",

                objectFit: "cover",

                borderRadius: "50%",
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
              margin: 0,

              fontSize:
                window.innerWidth < 768
                  ? "38px"
                  : "48px",

              fontWeight: "900",

              color: "#0f172a",

              lineHeight: "1.1",
            }}
          >
            Récupération
          </h1>

          <h1
            style={{
              margin: 0,

              fontSize:
                window.innerWidth < 768
                  ? "38px"
                  : "48px",

              fontWeight: "900",

              color: "#2563eb",

              lineHeight: "1.1",
            }}
          >
            de compte
          </h1>

          <div
            style={{
              width: "70px",

              height: "4px",

              background:
                "linear-gradient(135deg,#2563eb,#4f46e5)",

              borderRadius: "20px",

              margin:
                "15px auto 20px",
            }}
          />

          <p
            style={{
              color: "#64748b",

              lineHeight: "28px",

              fontSize: "16px",

              margin: 0,
            }}
          >
            Entrez votre adresse e-mail.
            Nous vous enverrons un lien
            sécurisé pour récupérer
            votre compte Konan Shopping.
          </p>

        </div>

        {/* EMAIL */}

        <div
          style={{
            position: "relative",
          }}
        >

          <FaEnvelope
            style={{
              position: "absolute",

              left: "18px",

              top: "23px",

              color: "#94a3b8",
            }}
          />

          <input
            type="email"

            placeholder="Votre email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            style={{
              width: "100%",

              height: "65px",

              borderRadius: "18px",

              border:
                "2px solid #e2e8f0",

              paddingLeft: "50px",

              paddingRight: "20px",

              fontSize: "16px",

              background: "#fff",

              color: "#0f172a",

              outline: "none",

              boxSizing:
                "border-box",
            }}
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={sendResetLink}

          disabled={loading}

          style={{
            width: "100%",

            height: "65px",

            marginTop: "20px",

            border: "none",

            borderRadius: "20px",

            background:
              "linear-gradient(135deg,#2563eb,#4f46e5)",

            color: "white",

            fontWeight: "800",

            fontSize: "17px",

            cursor: "pointer",

            boxShadow:
              "0 20px 40px rgba(37,99,235,0.30)",
          }}
        >

          {loading
            ? "Envoi..."
            : "📩 Envoyer le lien sécurisé"}

        </button>

        {/* RETOUR */}

        <button

          onClick={() =>
            window.location.href =
              "/login"
          }

          style={{
            width: "100%",

            height: "60px",

            marginTop: "15px",

            border:
              "2px solid #2563eb",

            borderRadius: "18px",

            background: "white",

            color: "#2563eb",

            fontWeight: "700",

            cursor: "pointer",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            gap: "10px",
          }}
        >

          <FaArrowLeft />

          Retour connexion

        </button>

        {/* SECURITY */}

        <div
          style={{
            marginTop: "30px",

            padding: "18px",

            borderRadius: "18px",

            background: "#f8fafc",

            border:
              "1px solid #e2e8f0",
          }}
        >

          <p
            style={{
              margin: 0,

              color: "#0f172a",

              fontWeight: "700",

              display: "flex",

              alignItems: "center",

              gap: "10px",
            }}
          >

            <FaShieldAlt />

            Sécurité Konan Shopping

          </p>

          <p
            style={{
              marginTop: "10px",

              color: "#64748b",

              fontSize: "14px",

              lineHeight: "24px",
            }}
          >
            Chaque lien est unique,
            personnel et expire
            automatiquement après
            30 minutes pour protéger
            votre compte.
          </p>

        </div>

      </div>

    </div>

  );

}

export default ForgotPassword;