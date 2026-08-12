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
  // 📝 FORMULAIRE
  // =====================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  // =====================================================
  // 👁️ MOT DE PASSE
  // =====================================================

  const [showPassword,
    setShowPassword] =
    useState(false);


  // =====================================================
  // ⏳ LOADING
  // =====================================================

  const [loading,
    setLoading] =
    useState(false);


  // =====================================================
  // 🔔 NOTIFICATION
  // =====================================================

  const [notification,
    setNotification] =
    useState(null);


  // =====================================================
  // 🔔 NOTIFICATION PROFESSIONNELLE
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
  // 🔐 CONNEXION
  // =====================================================

  const login = async () => {

    // ===================================================
    // EMAIL
    // ===================================================

    if (!email.trim()) {

      showNotification(

        "warning",

        "Adresse email requise",

        "Veuillez saisir l'adresse email utilisée pour votre compte livreur."

      );

      return;

    }


    // ===================================================
    // PASSWORD
    // ===================================================

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
      // 🚀 BACKEND
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
      // 💾 SAUVEGARDE LIVREUR
      // =================================================

      localStorage.setItem(

        "driver",

        JSON.stringify(
          res.data
        )

      );


      // =================================================
      // 🎉 SUCCÈS
      // =================================================

      showNotification(

        "success",

        "Connexion réussie 🎉",

        "Bienvenue dans votre Centre Livreur Konan Shopping."

      );


      // =================================================
      // 🚚 DASHBOARD
      // =================================================

      setTimeout(() => {

        navigate(
          "/driver-dashboard"
        );

      }, 900);


    } catch (err) {

      console.error(
        "❌ DRIVER LOGIN :",
        err.response?.data ||
        err
      );


      const message =

        err.response?.data?.message ||

        "Email ou mot de passe incorrect.";


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
  // ⌨️ ENTER
  // =====================================================

  const handleKeyDown = (
    e
  ) => {

    if (
      e.key === "Enter" &&
      !loading
    ) {

      login();

    }

  };


  // =====================================================
  // 🔔 ICÔNE NOTIFICATION
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

      return (
        <FaExclamationTriangle />
      );

    };


  // =====================================================
  // 🎨 COULEUR
  // =====================================================

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


  // =====================================================
  // 🎨 INTERFACE
  // =====================================================

  return (

    <>

      <style>{`

        /* ==================================================
           RESET
        ================================================== */

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          width: 100%;
          min-height: 100%;
          margin: 0;
          padding: 0;
        }

        body {
          overflow-x: hidden;

          font-family:
            Inter,
            Arial,
            sans-serif;
        }


        /* ==================================================
           PAGE
        ================================================== */

        .driver-login-page {

          width: 100%;

          min-height: 100vh;

          min-height: 100dvh;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 24px;

          position: relative;

          overflow: hidden;

          background:

            radial-gradient(
              circle at 0% 0%,
              rgba(
                37,
                99,
                235,
                .12
              ),
              transparent 32%
            ),

            radial-gradient(
              circle at 100% 100%,
              rgba(
                79,
                70,
                229,
                .10
              ),
              transparent 32%
            ),

            linear-gradient(
              135deg,
              #eef4ff,
              #f8fafc
            );

        }


        /* ==================================================
           BACKGROUND
        ================================================== */

        .driver-login-bg-one {

          position: absolute;

          width: 420px;

          height: 420px;

          top: -180px;

          left: -160px;

          border-radius: 50%;

          background:
            rgba(
              37,
              99,
              235,
              .11
            );

          filter: blur(70px);

          pointer-events: none;

        }


        .driver-login-bg-two {

          position: absolute;

          width: 360px;

          height: 360px;

          right: -130px;

          bottom: -160px;

          border-radius: 50%;

          background:
            rgba(
              79,
              70,
              229,
              .11
            );

          filter: blur(70px);

          pointer-events: none;

        }


        /* ==================================================
           CARD PC
        ================================================== */

        .driver-login-card {

          width: 100%;

          max-width: 440px;

          padding:
            40px;

          position: relative;

          z-index: 2;

          background:
            rgba(
              255,
              255,
              255,
              .96
            );

          border:
            1px solid
            rgba(
              226,
              232,
              240,
              .9
            );

          border-radius: 28px;

          box-shadow:
            0 30px 80px
            rgba(
              15,
              23,
              42,
              .12
            );

        }


        /* ==================================================
           HEADER
        ================================================== */

        .driver-login-header {

          text-align: center;

        }


        .driver-login-logo {

          width: 78px;

          height: 78px;

          margin: 0 auto;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 23px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: white;

          font-size: 30px;

          box-shadow:
            0 15px 35px
            rgba(
              37,
              99,
              235,
              .28
            );

        }


        .driver-login-brand {

          margin-top: 17px;

          color: #2563eb;

          font-size: 10px;

          font-weight: 950;

          letter-spacing: 1.8px;

        }


        .driver-login-title {

          margin:
            7px 0 0;

          color: #0f172a;

          font-size: 32px;

          line-height: 1.1;

          font-weight: 950;

          letter-spacing: -.8px;

        }


        .driver-login-subtitle {

          margin:
            10px auto 0;

          max-width: 380px;

          color: #64748b;

          font-size: 13px;

          line-height: 1.6;

        }


        /* ==================================================
           SECURITY
        ================================================== */

        .driver-login-security {

          margin-top: 22px;

          padding:
            11px 13px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          border-radius: 13px;

          background: #f8fafc;

          border:
            1px solid
            #e2e8f0;

          color: #475569;

          font-size: 10px;

          font-weight: 800;

        }


        .driver-login-security svg {

          color: #2563eb;

        }


        /* ==================================================
           FORM
        ================================================== */

        .driver-login-form {

          margin-top: 22px;

        }


        .driver-login-field {

          margin-top: 16px;

        }


        .driver-login-field label {

          display: block;

          margin-bottom: 8px;

          color: #334155;

          font-size: 12px;

          font-weight: 850;

        }


        .driver-login-input {

          width: 100%;

          min-height: 53px;

          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            0 14px;

          border:
            1px solid
            #dbe3ef;

          border-radius: 15px;

          background: #f8fafc;

          transition:
            .2s ease;

        }


        .driver-login-input:focus-within {

          background: white;

          border-color:
            #2563eb;

          box-shadow:
            0 0 0 4px
            rgba(
              37,
              99,
              235,
              .09
            );

        }


        .driver-login-input-icon {

          flex-shrink: 0;

          display: flex;

          color: #64748b;

          font-size: 14px;

        }


        .driver-login-input input {

          width: 100%;

          min-width: 0;

          border: none;

          outline: none;

          background: transparent;

          color: #0f172a;

          font-size: 14px;

          padding:
            15px 0;

        }


        .driver-login-input input::placeholder {

          color: #94a3b8;

        }


        /* ==================================================
           PASSWORD BUTTON
        ================================================== */

        .driver-login-password-button {

          width: 34px;

          height: 34px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border: none;

          border-radius: 9px;

          background: transparent;

          color: #64748b;

          cursor: pointer;

        }


        /* ==================================================
           LOGIN BUTTON
        ================================================== */

        .driver-login-button {

          width: 100%;

          min-height: 55px;

          margin-top: 24px;

          border: none;

          border-radius: 15px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          color: white;

          font-size: 14px;

          font-weight: 950;

          cursor: pointer;

          box-shadow:
            0 12px 30px
            rgba(
              37,
              99,
              235,
              .25
            );

          transition:
            .2s ease;

        }


        .driver-login-button:hover {

          transform:
            translateY(-1px);

          box-shadow:
            0 16px 35px
            rgba(
              37,
              99,
              235,
              .30
            );

        }


        .driver-login-button:disabled {

          opacity: .65;

          cursor:
            not-allowed;

          transform: none;

          box-shadow: none;

        }


        /* ==================================================
           REGISTER
        ================================================== */

        .driver-login-register {

          margin-top: 21px;

          padding-top: 19px;

          border-top:
            1px solid
            #eef2f7;

          text-align: center;

          color: #64748b;

          font-size: 12px;

        }


        .driver-login-register a {

          display: inline-flex;

          align-items: center;

          gap: 5px;

          margin-left: 5px;

          color: #2563eb;

          text-decoration: none;

          font-weight: 900;

        }


        .driver-login-footer {

          margin-top: 16px;

          text-align: center;

          color: #94a3b8;

          font-size: 9px;

          font-weight: 700;

        }


        /* ==================================================
           NOTIFICATION
        ================================================== */

        .driver-login-notification {

          position: fixed;

          top: 18px;

          right: 18px;

          z-index: 999999;

          width:
            min(
              410px,
              calc(100vw - 36px)
            );

          min-height: 68px;

          display: flex;

          align-items: center;

          gap: 12px;

          padding: 13px;

          border:
            1px solid
            #e2e8f0;

          border-radius: 17px;

          background:
            rgba(
              255,
              255,
              255,
              .98
            );

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          box-shadow:
            0 20px 60px
            rgba(
              15,
              23,
              42,
              .18
            );

          animation:
            driverLoginNotificationIn
            .3s ease;

        }


        .driver-login-notification-icon {

          width: 42px;

          height: 42px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          font-size: 17px;

        }


        .driver-login-notification-content {

          min-width: 0;

          flex: 1;

        }


        .driver-login-notification-title {

          color: #0f172a;

          font-size: 12px;

          font-weight: 950;

        }


        .driver-login-notification-message {

          margin-top: 3px;

          color: #64748b;

          font-size: 11px;

          line-height: 1.45;

          overflow-wrap:
            anywhere;

        }


        .driver-login-notification-close {

          width: 28px;

          height: 28px;

          flex-shrink: 0;

          border: none;

          border-radius: 8px;

          background: #f1f5f9;

          color: #64748b;

          font-size: 17px;

          cursor: pointer;

        }


        /* ==================================================
           ANIMATIONS
        ================================================== */

        @keyframes driverLoginNotificationIn {

          from {

            opacity: 0;

            transform:
              translateY(-12px)
              scale(.97);

          }

          to {

            opacity: 1;

            transform:
              translateY(0)
              scale(1);

          }

        }


        @keyframes driverLoginSpin {

          from {

            transform:
              rotate(0deg);

          }

          to {

            transform:
              rotate(360deg);

          }

        }


        /* ==================================================
           📱 MOBILE — PLEIN ÉCRAN
        ================================================== */

        @media (
          max-width: 600px
        ) {

          .driver-login-page {

            /*
             * 🔥 TOUTE LA LARGEUR
             */

            width: 100vw;

            min-height: 100dvh;

            min-height: 100vh;

            padding: 0;

            display: flex;

            align-items: stretch;

            justify-content: stretch;

            background:
              linear-gradient(
                135deg,
                #f1f5ff,
                #f8fafc
              );

          }


          /*
           * 🔥 LA CARTE DEVIENT
           * LA PAGE ELLE-MÊME
           */

          .driver-login-card {

            width: 100%;

            max-width: none;

            min-height: 100dvh;

            min-height: 100vh;

            padding:
              28px
              18px
              30px;

            border: none;

            border-radius: 0;

            box-shadow: none;

            background:
              rgba(
                255,
                255,
                255,
                .98
              );

            display: flex;

            flex-direction: column;

          }


          .driver-login-bg-one,
          .driver-login-bg-two {

            display: none;

          }


          /* HEADER */

          .driver-login-logo {

            width: 68px;

            height: 68px;

            border-radius: 20px;

            font-size: 27px;

          }


          .driver-login-brand {

            margin-top: 13px;

            font-size: 9px;

          }


          .driver-login-title {

            font-size:
              clamp(
                26px,
                8vw,
                32px
              );

          }


          .driver-login-subtitle {

            max-width: 340px;

            font-size: 12px;

          }


          /* SECURITY */

          .driver-login-security {

            margin-top: 18px;

            font-size: 9px;

          }


          /* FORM */

          .driver-login-form {

            margin-top: 16px;

          }


          .driver-login-field {

            margin-top: 14px;

          }


          .driver-login-field label {

            font-size: 11px;

          }


          .driver-login-input {

            min-height: 54px;

            border-radius: 14px;

          }


          .driver-login-input input {

            font-size: 14px;

            padding:
              15px 0;

          }


          /* BUTTON */

          .driver-login-button {

            min-height: 55px;

            margin-top: 21px;

          }


          /* FOOTER */

          .driver-login-register {

            margin-top: 20px;

          }


          /*
           * 🔔 NOTIFICATION MOBILE
           */

          .driver-login-notification {

            top: 10px;

            left: 10px;

            right: 10px;

            width: auto;

          }

        }


        /* ==================================================
           📱 PETITS ÉCRANS
        ================================================== */

        @media (
          max-width: 380px
        ) {

          .driver-login-card {

            padding:
              22px
              14px
              25px;

          }


          .driver-login-logo {

            width: 62px;

            height: 62px;

            font-size: 24px;

          }


          .driver-login-title {

            font-size: 25px;

          }


          .driver-login-subtitle {

            font-size: 11px;

          }


          .driver-login-input {

            min-height: 52px;

          }


          .driver-login-input input {

            font-size: 13px;

          }


          .driver-login-button {

            min-height: 53px;

            font-size: 13px;

          }

        }

      `}</style>


      {/* ==================================================
          PAGE
      ================================================== */}

      <main
        className="
          driver-login-page
        "
        onKeyDown={
          handleKeyDown
        }
      >


        {/* BACKGROUND */}

        <div
          className="
            driver-login-bg-one
          "
        />

        <div
          className="
            driver-login-bg-two
          "
        />


        {/* =================================================
            🔔 NOTIFICATION
        ================================================= */}

        {notification && (

          <div
            className="
              driver-login-notification
            "
          >

            <div
              className="
                driver-login-notification-icon
              "
              style={{

                color:
                  getNotificationColor(),

                background:
                  `${getNotificationColor()}18`

              }}
            >

              {
                getNotificationIcon()
              }

            </div>


            <div
              className="
                driver-login-notification-content
              "
            >

              <div
                className="
                  driver-login-notification-title
                "
              >

                {
                  notification.title
                }

              </div>


              <div
                className="
                  driver-login-notification-message
                "
              >

                {
                  notification.message
                }

              </div>

            </div>


            <button

              type="button"

              className="
                driver-login-notification-close
              "

              onClick={() =>
                setNotification(
                  null
                )
              }

            >

              ×

            </button>

          </div>

        )}


        {/* =================================================
            🚚 CARTE
        ================================================= */}

        <section
          className="
            driver-login-card
          "
        >


          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="
              driver-login-header
            "
          >

            <div
              className="
                driver-login-logo
              "
            >

              <FaTruck />

            </div>


            <div
              className="
                driver-login-brand
              "
            >

              KONAN SHOPPING

            </div>


            <h1
              className="
                driver-login-title
              "
            >

              Centre Livreur

            </h1>


            <p
              className="
                driver-login-subtitle
              "
            >

              Connectez-vous pour gérer
              vos commandes, vos livraisons
              et votre activité en temps réel.

            </p>

          </header>


          {/* =================================================
              🔐 SÉCURITÉ
          ================================================= */}

          <div
            className="
              driver-login-security
            "
          >

            <FaShieldAlt />

            Connexion sécurisée du livreur

          </div>


          {/* =================================================
              FORMULAIRE
          ================================================= */}

          <div
            className="
              driver-login-form
            "
          >


            {/* EMAIL */}

            <div
              className="
                driver-login-field
              "
            >

              <label>

                Adresse email

              </label>


              <div
                className="
                  driver-login-input
                "
              >

                <span
                  className="
                    driver-login-input-icon
                  "
                >

                  <FaEnvelope />

                </span>


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

                  placeholder="
                    votre@email.com
                  "

                  autoComplete="
                    email
                  "

                />

              </div>

            </div>


            {/* PASSWORD */}

            <div
              className="
                driver-login-field
              "
            >

              <label>

                Mot de passe

              </label>


              <div
                className="
                  driver-login-input
                "
              >

                <span
                  className="
                    driver-login-input-icon
                  "
                >

                  <FaLock />

                </span>


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

                  placeholder="
                    Votre mot de passe
                  "

                  autoComplete="
                    current-password
                  "

                />


                <button

                  type="button"

                  className="
                    driver-login-password-button
                  "

                  onClick={() =>
                    setShowPassword(
                      previous =>
                        !previous
                    )
                  }

                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }

                >

                  {showPassword

                    ? <FaEyeSlash />

                    : <FaEye />

                  }

                </button>

              </div>

            </div>


            {/* =================================================
                🚀 CONNEXION
            ================================================= */}

            <button

              type="button"

              className="
                driver-login-button
              "

              onClick={
                login
              }

              disabled={
                loading
              }

            >

              {loading ? (

                <>

                  <FaSpinner
                    style={{
                      animation:
                        "driverLoginSpin 1s linear infinite"
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


            {/* =================================================
                👤 INSCRIPTION
            ================================================= */}

            <div
              className="
                driver-login-register
              "
            >

              Pas encore livreur ?

              <Link
                to="/driver-register"
              >

                <FaUserPlus />

                Créer un compte

              </Link>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                driver-login-footer
              "
            >

              🚚 KONAN SHOPPING CAMEROUN

            </div>

          </div>

        </section>

      </main>

    </>

  );

}