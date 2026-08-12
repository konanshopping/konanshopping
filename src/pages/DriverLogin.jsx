import {
  useState
} from "react";

import axios from "axios";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  FaTruck,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserPlus,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";


export default function DriverLogin() {

  const navigate =
    useNavigate();


  // =====================================================
  // FORM
  // =====================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  // =====================================================
  // UI
  // =====================================================

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);


  // =====================================================
  // NOTIFICATION
  // =====================================================

  const [notification,
    setNotification] =
    useState(null);


  // =====================================================
  // NOTIFICATION PROFESSIONNELLE
  // =====================================================

  const showNotification = (
    type,
    title,
    message
  ) => {

    setNotification({
      type,
      title,
      message
    });


    setTimeout(() => {

      setNotification(null);

    }, 4500);

  };


  // =====================================================
  // CONNEXION
  // =====================================================

  const login = async () => {

    // ---------------------------------------------
    // VALIDATION EMAIL
    // ---------------------------------------------

    if (!email.trim()) {

      showNotification(
        "warning",
        "Adresse email requise",
        "Veuillez saisir votre adresse email."
      );

      return;

    }


    // ---------------------------------------------
    // VALIDATION PASSWORD
    // ---------------------------------------------

    if (!password) {

      showNotification(
        "warning",
        "Mot de passe requis",
        "Veuillez saisir votre mot de passe."
      );

      return;

    }


    try {

      setLoading(true);


      // =================================================
      // BACKEND EXISTANT
      // =================================================

      const res =
        await axios.post(

          "https://konanshopping.com/api/driver-login",

          {

            email:
              email.trim(),

            password

          }

        );


      // =================================================
      // SAUVEGARDE LIVREUR
      // =================================================

      localStorage.setItem(

        "driver",

        JSON.stringify(
          res.data
        )

      );


      // =================================================
      // NOTIFICATION
      // =================================================

      showNotification(

        "success",

        "Connexion réussie",

        "Bienvenue dans votre Centre Livreur Konan Shopping."

      );


      // =================================================
      // REDIRECTION
      // =================================================

      setTimeout(() => {

        navigate(
          "/driver-dashboard"
        );

      }, 900);


    } catch (err) {

      console.log(
        "❌ DRIVER LOGIN:",
        err
      );


      let message =
        "Email ou mot de passe incorrect.";


      if (
        err.response?.data?.message
      ) {

        message =
          err.response.data.message;

      }


      showNotification(

        "error",

        "Connexion impossible",

        message

      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // ENTER
  // =====================================================

  const handleKeyDown =
    (e) => {

      if (
        e.key === "Enter" &&
        !loading
      ) {

        login();

      }

    };


  // =====================================================
  // NOTIFICATION STYLE
  // =====================================================

  const getNotificationIcon =
    () => {

      if (
        notification?.type ===
        "success"
      ) {

        return (
          <FaCheckCircle />
        );

      }


      if (
        notification?.type ===
        "warning"
      ) {

        return (
          <FaExclamationTriangle />
        );

      }


      return (
        <FaExclamationTriangle />
      );

    };


  const getNotificationColor =
    () => {

      if (
        notification?.type ===
        "success"
      ) {

        return "#16a34a";

      }


      if (
        notification?.type ===
        "warning"
      ) {

        return "#d97706";

      }


      return "#dc2626";

    };


  return (

    <div
      onKeyDown={
        handleKeyDown
      }

      style={{

        minHeight:
          "100vh",

        width:
          "100%",

        display:
          "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        padding:
          "20px",

        boxSizing:
          "border-box",

        background:
          "linear-gradient(135deg,#eef4ff 0%,#f8fafc 45%,#eef2ff 100%)",

        fontFamily:
          "'Inter',Arial,sans-serif",

        position:
          "relative",

        overflow:
          "hidden"

      }}
    >


      {/* ================================================= */}
      {/* BACKGROUND DECORATION */}
      {/* ================================================= */}

      <div
        style={{

          position:
            "absolute",

          width:
            "420px",

          height:
            "420px",

          borderRadius:
            "50%",

          background:
            "rgba(37,99,235,0.12)",

          top:
            "-180px",

          left:
            "-160px",

          filter:
            "blur(70px)",

          pointerEvents:
            "none"

        }}
      />


      <div
        style={{

          position:
            "absolute",

          width:
            "360px",

          height:
            "360px",

          borderRadius:
            "50%",

          background:
            "rgba(91,61,245,0.12)",

          bottom:
            "-150px",

          right:
            "-120px",

          filter:
            "blur(70px)",

          pointerEvents:
            "none"

        }}
      />


      {/* ================================================= */}
      {/* NOTIFICATION */}
      {/* ================================================= */}

      {notification && (

        <div
          style={{

            position:
              "fixed",

            top:
              "20px",

            right:
              "20px",

            width:
              "min(390px, calc(100vw - 40px))",

            background:
              "rgba(255,255,255,0.96)",

            backdropFilter:
              "blur(18px)",

            WebkitBackdropFilter:
              "blur(18px)",

            borderRadius:
              "18px",

            padding:
              "15px",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            boxShadow:
              "0 18px 50px rgba(15,23,42,0.16)",

            border:
              "1px solid rgba(226,232,240,0.9)",

            zIndex:
              99999,

            animation:
              "driverNotificationIn .35s ease"

          }}
        >

          {/* ICON */}

          <div
            style={{

              width:
                "42px",

              height:
                "42px",

              minWidth:
                "42px",

              borderRadius:
                "13px",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                `${getNotificationColor()}18`,

              color:
                getNotificationColor(),

              fontSize:
                "18px"

            }}
          >

            {getNotificationIcon()}

          </div>


          {/* TEXT */}

          <div
            style={{
              flex: 1,
              minWidth: 0
            }}
          >

            <div
              style={{

                fontSize:
                  "13px",

                fontWeight:
                  "900",

                color:
                  "#0f172a"

              }}
            >

              {notification.title}

            </div>


            <div
              style={{

                marginTop:
                  "3px",

                fontSize:
                  "12px",

                lineHeight:
                  "1.45",

                color:
                  "#64748b"

              }}
            >

              {notification.message}

            </div>

          </div>


          {/* CLOSE */}

          <button
            onClick={() =>
              setNotification(null)
            }

            style={{

              border:
                "none",

              background:
                "transparent",

              color:
                "#94a3b8",

              fontSize:
                "18px",

              cursor:
                "pointer",

              padding:
                "4px"

            }}
          >
            ×
          </button>

        </div>

      )}


      {/* ================================================= */}
      {/* MAIN CARD */}
      {/* ================================================= */}

      <div
        style={{

          width:
            "100%",

          maxWidth:
            "440px",

          background:
            "rgba(255,255,255,0.94)",

          backdropFilter:
            "blur(20px)",

          WebkitBackdropFilter:
            "blur(20px)",

          borderRadius:
            "28px",

          padding:
            "clamp(24px, 6vw, 42px)",

          boxSizing:
            "border-box",

          position:
            "relative",

          zIndex:
            2,

          border:
            "1px solid rgba(255,255,255,0.85)",

          boxShadow:
            "0 25px 70px rgba(15,23,42,0.12)"

        }}
      >


        {/* ================================================= */}
        {/* BRAND */}
        {/* ================================================= */}

        <div
          style={{

            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            textAlign:
              "center"

          }}
        >

          <div
            style={{

              width:
                "76px",

              height:
                "76px",

              borderRadius:
                "22px",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              background:
                "linear-gradient(135deg,#2563eb,#4f46e5)",

              color:
                "white",

              fontSize:
                "30px",

              boxShadow:
                "0 14px 32px rgba(37,99,235,0.28)"

            }}
          >

            <FaTruck />

          </div>


          <div
            style={{

              marginTop:
                "20px",

              fontSize:
                "12px",

              fontWeight:
                "900",

              letterSpacing:
                "1.5px",

              color:
                "#2563eb"

            }}
          >

            KONAN SHOPPING

          </div>


          <h1
            style={{

              margin:
                "8px 0 0",

              fontSize:
                "clamp(25px,7vw,34px)",

              lineHeight:
                "1.1",

              fontWeight:
                "900",

              letterSpacing:
                "-1px",

              color:
                "#0f172a"

            }}
          >

            Centre Livreur

          </h1>


          <p
            style={{

              margin:
                "10px 0 0",

              color:
                "#64748b",

              fontSize:
                "13px",

              lineHeight:
                "1.6"

            }}
          >

            Connectez-vous pour gérer
            vos livraisons en temps réel.

          </p>

        </div>


        {/* ================================================= */}
        {/* SECURITY BADGE */}
        {/* ================================================= */}

        <div
          style={{

            marginTop:
              "24px",

            padding:
              "11px 13px",

            borderRadius:
              "14px",

            background:
              "#f8fafc",

            border:
              "1px solid #e2e8f0",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "9px",

            color:
              "#475569",

            fontSize:
              "11px",

            fontWeight:
              "700"

          }}
        >

          <FaShieldAlt
            style={{
              color:
                "#2563eb",
              fontSize:
                "14px"
            }}
          />

          Connexion sécurisée du livreur

        </div>


        {/* ================================================= */}
        {/* EMAIL */}
        {/* ================================================= */}

        <div
          style={{
            marginTop:
              "24px"
          }}
        >

          <label
            style={{

              display:
                "block",

              marginBottom:
                "8px",

              fontSize:
                "12px",

              fontWeight:
                "800",

              color:
                "#334155"

            }}
          >

            Adresse email

          </label>


          <div
            style={{

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              background:
                "#f8fafc",

              border:
                "1px solid #e2e8f0",

              borderRadius:
                "15px",

              padding:
                "0 14px",

              transition:
                "all .2s ease"

            }}
          >

            <FaEnvelope
              style={{
                color:
                  "#64748b",
                fontSize:
                  "14px",
                flexShrink:
                  0
              }}
            />


            <input

              type="email"

              value={
                email
              }

              onChange={
                e =>
                  setEmail(
                    e.target.value
                  )
              }

              onKeyDown={
                handleKeyDown
              }

              placeholder=
                "votre@email.com"

              autoComplete=
                "email"

              style={{

                width:
                  "100%",

                minWidth:
                  0,

                padding:
                  "15px 0",

                border:
                  "none",

                outline:
                  "none",

                background:
                  "transparent",

                fontSize:
                  "14px",

                color:
                  "#0f172a"

              }}

            />

          </div>

        </div>


        {/* ================================================= */}
        {/* PASSWORD */}
        {/* ================================================= */}

        <div
          style={{
            marginTop:
              "17px"
          }}
        >

          <label
            style={{

              display:
                "block",

              marginBottom:
                "8px",

              fontSize:
                "12px",

              fontWeight:
                "800",

              color:
                "#334155"

            }}
          >

            Mot de passe

          </label>


          <div
            style={{

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              background:
                "#f8fafc",

              border:
                "1px solid #e2e8f0",

              borderRadius:
                "15px",

              padding:
                "0 14px"

            }}
          >

            <FaLock
              style={{

                color:
                  "#64748b",

                fontSize:
                  "14px",

                flexShrink:
                  0

              }}
            />


            <input

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              value={
                password
              }

              onChange={
                e =>
                  setPassword(
                    e.target.value
                  )
              }

              onKeyDown={
                handleKeyDown
              }

              placeholder=
                "Votre mot de passe"

              autoComplete=
                "current-password"

              style={{

                flex:
                  1,

                minWidth:
                  0,

                padding:
                  "15px 0",

                border:
                  "none",

                outline:
                  "none",

                background:
                  "transparent",

                fontSize:
                  "14px",

                color:
                  "#0f172a"

              }}

            />


            <button

              type="button"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }

              style={{

                border:
                  "none",

                background:
                  "transparent",

                color:
                  "#64748b",

                cursor:
                  "pointer",

                padding:
                  "5px",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center"

              }}
            >

              {showPassword
                ? <FaEyeSlash />
                : <FaEye />
              }

            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* LOGIN BUTTON */}
        {/* ================================================= */}

        <button

          type="button"

          onClick={
            login
          }

          disabled={
            loading
          }

          style={{

            width:
              "100%",

            marginTop:
              "24px",

            border:
              "none",

            borderRadius:
              "15px",

            padding:
              "15px 18px",

            background:
              loading
                ? "#94a3b8"
                : "linear-gradient(135deg,#2563eb,#4f46e5)",

            color:
              "white",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap:
              "10px",

            fontSize:
              "13px",

            fontWeight:
              "900",

            cursor:
              loading
                ? "not-allowed"
                : "pointer",

            boxShadow:
              loading
                ? "none"
                : "0 12px 28px rgba(37,99,235,0.25)",

            transition:
              "all .2s ease"

          }}
        >

          {loading ? (

            <>
              <FaSpinner
                style={{
                  animation:
                    "driverSpin 1s linear infinite"
                }}
              />

              Connexion en cours...

            </>

          ) : (

            <>

              <FaTruck />

              Se connecter

              <FaArrowRight />

            </>

          )}

        </button>


        {/* ================================================= */}
        {/* REGISTER */}
        {/* ================================================= */}

        <div
          style={{

            marginTop:
              "22px",

            paddingTop:
              "20px",

            borderTop:
              "1px solid #eef2f7",

            textAlign:
              "center",

            fontSize:
              "12px",

            color:
              "#64748b"

          }}
        >

          Pas encore livreur ?

          <Link

            to="/driver-register"

            style={{

              display:
                "inline-flex",

              alignItems:
                "center",

              gap:
                "5px",

              marginLeft:
                "5px",

              color:
                "#2563eb",

              textDecoration:
                "none",

              fontWeight:
                "900"

            }}
          >

            <FaUserPlus />

            Créer un compte

          </Link>

        </div>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div
          style={{

            marginTop:
              "18px",

            textAlign:
              "center",

            fontSize:
              "10px",

            color:
              "#94a3b8"

          }}
        >

          🚚 KONAN SHOPPING CAMEROUN

        </div>

      </div>


      {/* ================================================= */}
      {/* ANIMATIONS */}
      {/* ================================================= */}

      <style>

        {`

          @keyframes driverNotificationIn {

            from {

              opacity: 0;

              transform:
                translateY(-15px)
                scale(.97);

            }

            to {

              opacity: 1;

              transform:
                translateY(0)
                scale(1);

            }

          }


          @keyframes driverSpin {

            from {

              transform:
                rotate(0deg);

            }

            to {

              transform:
                rotate(360deg);

            }

          }


          @media (max-width: 480px) {

            body {

              overflow-x:
                hidden;

            }

          }

        `}

      </style>

    </div>

  );

}