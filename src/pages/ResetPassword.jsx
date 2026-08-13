import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  toast,
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

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

            `https://konanshopping.com/api/reset-passwordt-password/${token}`, 

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
      .konan-reset-toast {
        min-height: 72px !important;
        padding: 0 !important;
        border-radius: 16px !important;
        background: rgba(255,255,255,0.98) !important;
        color: #0f172a !important;
        border: 1px solid #e5e7eb !important;
        box-shadow: 0 18px 45px rgba(15,23,42,0.16) !important;
        overflow: hidden !important;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
      }

      .konan-reset-toast-body {
        margin: 0 !important;
        padding: 15px 18px 15px 8px !important;
        font-size: 14px !important;
        font-weight: 650 !important;
        line-height: 1.45 !important;
        color: #0f172a !important;
      }

      .konan-reset-toast .Toastify__toast-icon {
        width: 28px !important;
        margin-left: 14px !important;
        margin-right: 4px !important;
      }

      .konan-reset-toast .Toastify__close-button {
        color: #64748b !important;
        opacity: 0.75 !important;
        align-self: center !important;
        margin-right: 10px !important;
      }

      .konan-reset-toast .Toastify__close-button:hover {
        opacity: 1 !important;
      }

      .konan-reset-toast.Toastify__toast--success {
        border-left: 5px solid #16a34a !important;
      }

      .konan-reset-toast.Toastify__toast--error {
        border-left: 5px solid #dc2626 !important;
      }

      .konan-reset-toast.Toastify__progress-bar--success {
        background: #16a34a !important;
      }

      .konan-reset-toast.Toastify__progress-bar--error {
        background: #dc2626 !important;
      }

      @media (max-width: 768px) {
        .Toastify__toast-container {
          width: calc(100% - 24px) !important;
          left: 12px !important;
          right: 12px !important;
          top: 12px !important;
          padding: 0 !important;
        }

        .konan-reset-toast {
          width: 100% !important;
          min-height: 68px !important;
          margin-bottom: 10px !important;
          border-radius: 15px !important;
        }

        .konan-reset-toast-body {
          font-size: 13.5px !important;
        }
      }
    `}</style>

  </div> 

); 
} 

export default ResetPassword;