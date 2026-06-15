import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

function ResetPassword() {

  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const [password,
    setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading,
    setLoading] =
    useState(false);

  const updatePassword =
    async () => {

      if (
        password.length < 6
      ) {

        return toast.error(
          "Minimum 6 caractères"
        );

      }

      if (
        password !==
        confirmPassword
      ) {

        return toast.error(
          "Les mots de passe ne correspondent pas"
        );

      }

      try {

        setLoading(true);

        const res =
          await axios.post(

            `https://konanshopping-production.up.railway.app/reset-password/${token}`,

            {
              password,
            }
          );

        localStorage.setItem(
  "token",
  res.data.token
);

localStorage.setItem(
  "user",
  JSON.stringify(
    res.data.user
  )
);

toast.success(
  "Connexion réussie ✅"
);

setTimeout(() => {

  window.location.href = "/";

}, 1500);

      } catch (err) {

        toast.error(

          err.response?.data
            ?.message ||

          "Lien expiré ou invalide"
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

        justifyContent:
          "center",

        alignItems: "center",

        background:
          "linear-gradient(135deg,#f8fafc,#eff6ff)",

        padding: "20px",
      }}
    >

      <div
        style={{
          width: "100%",

          maxWidth: "450px",

          background: "#fff",

          borderRadius: "28px",

          padding: "35px",

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >

        <div
          style={{
            textAlign:
              "center",

            marginBottom:
              "25px",
          }}
        >

          <img
            src="/logo.jpg"
            alt="Konan Shopping"
            style={{
              width: "90px",

              height: "90px",

              borderRadius:
                "50%",
            }}
          />

          <h1
            style={{
              marginTop:
                "15px",

              color:
                "#2563eb",
            }}
          >
            Nouveau mot de passe
          </h1>

          <p
            style={{
              color:
                "#64748b",
            }}
          >
            Choisissez un mot de passe sécurisé.
          </p>

        </div>

        <div
          style={{
            position:
              "relative",

            marginBottom:
              "15px",
          }}
        >

          <FaLock
            style={{
              position:
                "absolute",

              left: "18px",

              top: "18px",

              color:
                "#94a3b8",
            }}
          />

          <input
            type="password"

            placeholder="Nouveau mot de passe"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            style={{
              width:
                "100%",

              height:
                "55px",

              paddingLeft:
                "50px",

              borderRadius:
                "14px",

              border:
                "1px solid #e2e8f0",
            }}
          />

        </div>

        <div
          style={{
            position:
              "relative",
          }}
        >

          <FaCheckCircle
            style={{
              position:
                "absolute",

              left: "18px",

              top: "18px",

              color:
                "#94a3b8",
            }}
          />

          <input
            type="password"

            placeholder="Confirmer le mot de passe"

            value={
              confirmPassword
            }

            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }

            style={{
              width:
                "100%",

              height:
                "55px",

              paddingLeft:
                "50px",

              borderRadius:
                "14px",

              border:
                "1px solid #e2e8f0",
            }}
          />

        </div>

        <button
          onClick={
            updatePassword
          }

          disabled={
            loading
          }

          style={{
            width: "100%",

            height: "55px",

            marginTop:
              "20px",

            border: "none",

            borderRadius:
              "14px",

            background:
              "#2563eb",

            color: "#fff",

            fontWeight:
              "700",

            cursor:
              "pointer",
          }}
        >

          {loading
            ? "Modification..."
            : "Modifier le mot de passe"}

        </button>

      </div>

    </div>
  );
}

export default ResetPassword;