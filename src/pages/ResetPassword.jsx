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
      width: "100%",
      background:
        "linear-gradient(180deg,#f8fbff 0%,#eef4ff 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >

    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#fff",
        padding: "40px 25px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >

      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >

        <img
          src="/logo.jpg"
          alt="Konan Shopping"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto",
            display: "block",
            boxShadow:
              "0 15px 35px rgba(37,99,235,0.15)",
          }}
        />

        <h1
          style={{
            marginTop: "25px",
            color: "#2563eb",
            fontSize: "42px",
            fontWeight: "800",
            lineHeight: "1",
          }}
        >
          Réinitialiser
          <br />
          votre mot de passe
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "15px",
            fontSize: "16px",
          }}
        >
          Choisissez un mot de passe sécurisé pour protéger votre compte.
        </p>

      </div>

      <div
        style={{
          position: "relative",
          marginBottom: "18px",
        }}
      >

        <FaLock
          style={{
            position: "absolute",
            left: "20px",
            top: "22px",
            color: "#94a3b8",
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
            width: "100%",
            height: "62px",
            paddingLeft: "55px",
            borderRadius: "18px",
            border:
              "1px solid #e2e8f0",
            fontSize: "16px",
            outline: "none",
          }}
        />

      </div>

      <div
        style={{
          position: "relative",
        }}
      >

        <FaCheckCircle
          style={{
            position: "absolute",
            left: "20px",
            top: "22px",
            color: "#94a3b8",
          }}
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            height: "62px",
            paddingLeft: "55px",
            borderRadius: "18px",
            border:
              "1px solid #e2e8f0",
            fontSize: "16px",
            outline: "none",
          }}
        />

      </div>

      <button
        onClick={updatePassword}
        disabled={loading}
        style={{
          width: "100%",
          height: "62px",
          marginTop: "25px",
          border: "none",
          borderRadius: "18px",
          background: "#2563eb",
          color: "#fff",
          fontWeight: "800",
          fontSize: "17px",
          cursor: "pointer",
          boxShadow:
            "0 10px 25px rgba(37,99,235,0.25)",
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