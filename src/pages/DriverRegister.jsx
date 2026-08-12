import {
  useState,
  useEffect
} from "react";

import axios from "axios";

import {
  FaTruck,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCity,
  FaCar,
  FaIdCard,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaUserPlus,
  FaShieldAlt,
  FaArrowLeft,
  FaCloudUploadAlt
} from "react-icons/fa";

import {
  Link,
  useNavigate
} from "react-router-dom";


// ======================================================
// 🌐 API KONAN SHOPPING
// ======================================================

const API =
  "https://konanshopping.com";


// ======================================================
// 🚚 INSCRIPTION LIVREUR
// ======================================================

export default function DriverRegister() {

  const navigate =
    useNavigate();


  // ======================================================
  // 📝 FORMULAIRE
  // ======================================================

  const [form, setForm] =
    useState({

      name: "",
      email: "",
      password: "",
      phone: "",
      city: "",
      vehicle: "",
      plate: ""

    });


  // ======================================================
  // 📸 PHOTO
  // ======================================================

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");


  // ======================================================
  // 👁️ MOT DE PASSE
  // ======================================================

  const [showPassword, setShowPassword] =
    useState(false);


  // ======================================================
  // ⏳ CHARGEMENT
  // ======================================================

  const [loading, setLoading] =
    useState(false);


  // ======================================================
  // 🔔 NOTIFICATION
  // ======================================================

  const [notification, setNotification] =
    useState(null);


  // ======================================================
  // 📸 CRÉATION PREVIEW
  // ======================================================

  useEffect(() => {

    if (!image) {

      setPreview("");

      return;

    }

    const objectUrl =
      URL.createObjectURL(image);

    setPreview(objectUrl);

    return () => {

      URL.revokeObjectURL(
        objectUrl
      );

    };

  }, [image]);


  // ======================================================
  // 🔔 NOTIFICATION PROFESSIONNELLE
  // ======================================================

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

    }, 5000);

  };


  // ======================================================
  // 🎨 COULEUR NOTIFICATION
  // ======================================================

  const getNotificationColor = () => {

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


  // ======================================================
  // 🔔 ICÔNE NOTIFICATION
  // ======================================================

  const getNotificationIcon = () => {

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


  // ======================================================
  // ✏️ MODIFICATION CHAMP
  // ======================================================

  const handleChange = (
    e
  ) => {

    const {
      name,
      value
    } = e.target;

    setForm(
      previous => ({

        ...previous,

        [name]:
          value

      })
    );

  };


  // ======================================================
  // 📸 SÉLECTION PHOTO
  // ======================================================

  const handleImageChange = (
    e
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) {

      return;

    }


    // ====================================================
    // FORMAT
    // ====================================================

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      showNotification(

        "error",

        "Format incorrect",

        "Veuillez sélectionner une photo au format JPG, PNG ou WEBP."

      );

      return;

    }


    // ====================================================
    // TAILLE
    // ====================================================

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      showNotification(

        "error",

        "Photo trop volumineuse",

        "La photo ne doit pas dépasser 5 MB."

      );

      return;

    }


    setImage(file);

  };


  // ======================================================
  // ✅ VALIDATION
  // ======================================================

  const validateForm = () => {

    if (
      !form.name.trim()
    ) {

      showNotification(

        "warning",

        "Nom requis",

        "Veuillez renseigner votre nom complet."

      );

      return false;

    }


    if (
      !form.email.trim()
    ) {

      showNotification(

        "warning",

        "Email requis",

        "Veuillez renseigner votre adresse email."

      );

      return false;

    }


    if (
      !form.email.includes("@")
    ) {

      showNotification(

        "warning",

        "Email invalide",

        "Veuillez renseigner une adresse email valide."

      );

      return false;

    }


    if (
      !form.password
    ) {

      showNotification(

        "warning",

        "Mot de passe requis",

        "Veuillez créer un mot de passe."

      );

      return false;

    }


    if (
      form.password.length <
      6
    ) {

      showNotification(

        "warning",

        "Mot de passe trop court",

        "Votre mot de passe doit contenir au moins 6 caractères."

      );

      return false;

    }


    if (
      !form.phone.trim()
    ) {

      showNotification(

        "warning",

        "Téléphone requis",

        "Veuillez renseigner votre numéro de téléphone."

      );

      return false;

    }


    if (
      !form.city.trim()
    ) {

      showNotification(

        "warning",

        "Ville requise",

        "Veuillez renseigner votre ville."

      );

      return false;

    }


    if (
      !form.vehicle.trim()
    ) {

      showNotification(

        "warning",

        "Véhicule requis",

        "Veuillez renseigner votre véhicule."

      );

      return false;

    }


    if (
      !form.plate.trim()
    ) {

      showNotification(

        "warning",

        "Plaque requise",

        "Veuillez renseigner la plaque du véhicule."

      );

      return false;

    }


    return true;

  };


  // ======================================================
  // 🚚 CRÉER LE COMPTE
  // ======================================================

  const register = async () => {

    if (
      !validateForm()
    ) {

      return;

    }


    try {

      setLoading(true);


      // ==================================================
      // 📦 FORMDATA
      // ==================================================

      const formData =
        new FormData();


      // ==================================================
      // 👤 INFORMATIONS LIVREUR
      // ==================================================

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "email",
        form.email.trim()
      );

      formData.append(
        "password",
        form.password
      );

      formData.append(
        "phone",
        form.phone.trim()
      );

      formData.append(
        "city",
        form.city.trim()
      );

      formData.append(
        "vehicle",
        form.vehicle.trim()
      );

      formData.append(
        "plate",
        form.plate.trim()
      );


      // ==================================================
      // 📸 PHOTO
      //
      // IMPORTANT :
      //
      // Ton backend utilise :
      //
      // upload.single("photo")
      //
      // Donc le champ DOIT être "photo".
      // ==================================================

      if (image) {

        formData.append(
          "photo",
          image
        );

      }


      // ==================================================
      // 🚀 ENVOI AU BACKEND
      // ==================================================

      const response =
        await axios.post(

          `${API}/api/driver-register`,

          formData,

          {
            headers: {

              "Content-Type":
                "multipart/form-data"

            },

            timeout:
              60000

          }

        );


      // ==================================================
      // ❌ ERREUR BACKEND
      // ==================================================

      if (
        response.data?.success ===
        false
      ) {

        throw new Error(

          response.data?.message ||
          "Impossible de créer le compte."

        );

      }


      // ==================================================
      // 🎉 SUCCÈS
      // ==================================================

      showNotification(

        "success",

        "Compte créé avec succès 🎉",

        "Votre compte livreur Konan Shopping est maintenant actif."

      );


      // ==================================================
      // 🔄 REDIRECTION
      // ==================================================

      setTimeout(() => {

        navigate(
          "/driver-login"
        );

      }, 1500);


    } catch (err) {

      console.error(
        "❌ DRIVER REGISTER:",
        err.response?.data ||
        err
      );


      const message =

        err.response?.data?.message ||

        err.response?.data?.error ||

        err.message ||

        "Une erreur est survenue lors de l'inscription.";


      showNotification(

        "error",

        "Inscription impossible",

        message

      );


    } finally {

      setLoading(false);

    }

  };


  // ======================================================
  // 🧩 CHAMP INPUT
  // ======================================================

  const InputField = ({
    name,
    label,
    placeholder,
    icon,
    type = "text"
  }) => {

    return (

      <div className="driver-field">

        <label>

          {label}

        </label>


        <div className="driver-input">

          <span className="driver-input-icon">

            {icon}

          </span>


          <input

            type={type}

            name={name}

            value={
              form[name]
            }

            onChange={
              handleChange
            }

            placeholder={
              placeholder
            }

            autoComplete={
              name ===
              "password"
                ? "new-password"
                : "off"
            }

          />

        </div>

      </div>

    );

  };


  // ======================================================
  // 🎨 INTERFACE
  // ======================================================

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

        .driver-register-page {

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

        .driver-bg-one {

          position: absolute;

          width: 420px;

          height: 420px;

          top: -180px;

          right: -160px;

          border-radius: 50%;

          background:
            rgba(
              37,
              99,
              235,
              .10
            );

          filter: blur(70px);

          pointer-events: none;

        }

        .driver-bg-two {

          position: absolute;

          width: 350px;

          height: 350px;

          bottom: -160px;

          left: -150px;

          border-radius: 50%;

          background:
            rgba(
              79,
              70,
              229,
              .10
            );

          filter: blur(70px);

          pointer-events: none;

        }


        /* ==================================================
           CARD
        ================================================== */

        .driver-register-card {

          width: 100%;

          max-width: 520px;

          position: relative;

          z-index: 2;

          padding: 38px;

          background:
            rgba(
              255,
              255,
              255,
              .97
            );

          border:
            1px solid
            #e2e8f0;

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

        .driver-header {

          text-align: center;

        }

        .driver-logo {

          width: 76px;

          height: 76px;

          margin: 0 auto;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 22px;

          color: white;

          font-size: 30px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          box-shadow:
            0 15px 35px
            rgba(
              37,
              99,
              235,
              .28
            );

        }

        .driver-brand {

          margin-top: 15px;

          color: #2563eb;

          font-size: 10px;

          font-weight: 950;

          letter-spacing: 1.7px;

        }

        .driver-header h1 {

          margin:
            7px 0 0;

          color: #0f172a;

          font-size: 31px;

          font-weight: 950;

          letter-spacing: -.8px;

        }

        .driver-header p {

          margin:
            9px auto 0;

          max-width: 390px;

          color: #64748b;

          font-size: 13px;

          line-height: 1.6;

        }


        /* ==================================================
           SECURITY
        ================================================== */

        .driver-security {

          margin-top: 20px;

          padding: 11px;

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

        .driver-security svg {

          color: #2563eb;

        }


        /* ==================================================
           FORM
        ================================================== */

        .driver-form {

          margin-top: 20px;

        }

        .driver-field {

          margin-top: 14px;

        }

        .driver-field label {

          display: block;

          margin-bottom: 7px;

          color: #334155;

          font-size: 12px;

          font-weight: 850;

        }

        .driver-input {

          width: 100%;

          min-height: 52px;

          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            0 14px;

          border:
            1px solid
            #dbe3ef;

          border-radius: 14px;

          background: #f8fafc;

          transition:
            .2s ease;

        }

        .driver-input:focus-within {

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

        .driver-input-icon {

          flex-shrink: 0;

          display: flex;

          color: #64748b;

          font-size: 14px;

        }

        .driver-input input {

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

        .driver-input input::placeholder {

          color: #94a3b8;

        }


        /* ==================================================
           PASSWORD
        ================================================== */

        .driver-password-button {

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
           PHOTO
        ================================================== */

        .driver-photo-section {

          margin-top: 18px;

        }

        .driver-photo-label {

          display: flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 8px;

          color: #334155;

          font-size: 12px;

          font-weight: 850;

        }

        .driver-photo-label svg {

          color: #2563eb;

        }

        .driver-photo-upload {

          width: 100%;

          min-height: 55px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          border:
            1px dashed
            #cbd5e1;

          border-radius: 14px;

          background: #f8fafc;

          color: #475569;

          font-size: 12px;

          font-weight: 800;

          cursor: pointer;

          transition: .2s ease;

        }

        .driver-photo-upload:hover {

          border-color:
            #2563eb;

          background:
            #eff6ff;

        }

        .driver-photo-upload svg {

          color: #2563eb;

        }

        .driver-photo-upload input {

          display: none;

        }


        /* ==================================================
           PREVIEW
        ================================================== */

        .driver-photo-preview {

          margin-top: 15px;

          display: flex;

          justify-content: center;

        }

        .driver-photo-wrapper {

          position: relative;

        }

        .driver-photo-preview img {

          width: 92px;

          height: 92px;

          object-fit: cover;

          border-radius: 50%;

          border:
            4px solid
            #dbeafe;

          box-shadow:
            0 10px 30px
            rgba(
              37,
              99,
              235,
              .18
            );

        }

        .driver-photo-check {

          position: absolute;

          right: 0;

          bottom: 2px;

          width: 27px;

          height: 27px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background: #2563eb;

          color: white;

          border:
            3px solid white;

          font-size: 10px;

        }

        .driver-cloudinary {

          margin-top: 8px;

          display: flex;

          justify-content: center;

          align-items: center;

          gap: 6px;

          color: #94a3b8;

          font-size: 9px;

          font-weight: 700;

        }

        .driver-cloudinary svg {

          color: #2563eb;

        }


        /* ==================================================
           BUTTON
        ================================================== */

        .driver-submit {

          width: 100%;

          min-height: 54px;

          margin-top: 23px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          border: none;

          border-radius: 15px;

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

        .driver-submit:hover {

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

        .driver-submit:disabled {

          opacity: .65;

          cursor:
            not-allowed;

          transform: none;

          box-shadow: none;

        }


        /* ==================================================
           FOOTER
        ================================================== */

        .driver-login-footer {

          margin-top: 20px;

          padding-top: 18px;

          border-top:
            1px solid
            #eef2f7;

          text-align: center;

          color: #64748b;

          font-size: 11px;

        }

        .driver-login-footer a {

          display: inline-flex;

          align-items: center;

          gap: 5px;

          margin-left: 5px;

          color: #2563eb;

          font-weight: 900;

          text-decoration: none;

        }

        .driver-footer {

          margin-top: 15px;

          text-align: center;

          color: #94a3b8;

          font-size: 9px;

          font-weight: 700;

        }


        /* ==================================================
           NOTIFICATION
        ================================================== */

        .driver-notification {

          position: fixed;

          top: 18px;

          right: 18px;

          z-index: 999999;

          width:
            min(
              410px,
              calc(100vw - 36px)
            );

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
            driverNotificationIn
            .3s ease;

        }

        .driver-notification-icon {

          width: 42px;

          height: 42px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          font-size: 17px;

        }

        .driver-notification-content {

          min-width: 0;

          flex: 1;

        }

        .driver-notification-title {

          color: #0f172a;

          font-size: 12px;

          font-weight: 950;

        }

        .driver-notification-message {

          margin-top: 3px;

          color: #64748b;

          font-size: 11px;

          line-height: 1.45;

          overflow-wrap:
            anywhere;

        }

        .driver-notification-close {

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

        @keyframes driverNotificationIn {

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


        /* ==================================================
           📱 MOBILE
        ================================================== */

        @media (
          max-width: 600px
        ) {

          .driver-register-page {

            width: 100vw;

            min-height: 100dvh;

            padding: 0;

            align-items:
              stretch;

            justify-content:
              stretch;

          }


          /*
           * 🔥 LE FORMULAIRE PREND
           * TOUTE LA PAGE MOBILE
           */

          .driver-register-card {

            width: 100%;

            max-width: none;

            min-height: 100dvh;

            min-height: 100vh;

            padding:
              24px
              18px
              30px;

            border: none;

            border-radius: 0;

            box-shadow: none;

          }


          .driver-bg-one,
          .driver-bg-two {

            display: none;

          }


          .driver-logo {

            width: 68px;

            height: 68px;

            border-radius: 20px;

            font-size: 27px;

          }


          .driver-brand {

            margin-top: 13px;

            font-size: 9px;

          }


          .driver-header h1 {

            font-size:
              clamp(
                25px,
                8vw,
                31px
              );

          }


          .driver-header p {

            font-size: 12px;

            max-width: 350px;

          }


          .driver-security {

            margin-top: 17px;

            font-size: 9px;

          }


          .driver-form {

            margin-top: 15px;

          }


          .driver-field {

            margin-top: 13px;

          }


          .driver-input {

            min-height: 53px;

          }


          .driver-input input {

            font-size: 14px;

          }


          .driver-photo-upload {

            min-height: 55px;

          }


          .driver-submit {

            min-height: 55px;

          }


          .driver-notification {

            top: 10px;

            left: 10px;

            right: 10px;

            width: auto;

          }

        }


        /* ==================================================
           📱 PETITS TÉLÉPHONES
        ================================================== */

        @media (
          max-width: 380px
        ) {

          .driver-register-card {

            padding:
              20px
              14px
              25px;

          }


          .driver-logo {

            width: 62px;

            height: 62px;

            font-size: 24px;

          }


          .driver-header h1 {

            font-size: 25px;

          }


          .driver-header p {

            font-size: 11px;

          }


          .driver-input {

            min-height: 51px;

          }


          .driver-input input {

            font-size: 13px;

          }

        }

      `}</style>


      {/* ==================================================
          PAGE
      ================================================== */}

      <main
        className="
          driver-register-page
        "
      >


        <div
          className="
            driver-bg-one
          "
        />

        <div
          className="
            driver-bg-two
          "
        />


        {/* =================================================
            🔔 NOTIFICATION
        ================================================= */}

        {notification && (

          <div
            className="
              driver-notification
            "
          >

            <div
              className="
                driver-notification-icon
              "
              style={{

                color:
                  getNotificationColor(),

                background:
                  `${getNotificationColor()}18`

              }}
            >

              {getNotificationIcon()}

            </div>


            <div
              className="
                driver-notification-content
              "
            >

              <div
                className="
                  driver-notification-title
                "
              >

                {
                  notification.title
                }

              </div>


              <div
                className="
                  driver-notification-message
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
                driver-notification-close
              "

              onClick={() =>
                setNotification(null)
              }

            >

              ×

            </button>

          </div>

        )}


        {/* =================================================
            🚚 CARD
        ================================================= */}

        <section
          className="
            driver-register-card
          "
        >


          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="
              driver-header
            "
          >

            <div
              className="
                driver-logo
              "
            >

              <FaTruck />

            </div>


            <div
              className="
                driver-brand
              "
            >

              KONAN SHOPPING

            </div>


            <h1>

              Devenir livreur

            </h1>


            <p>

              Rejoignez les partenaires
              de livraison de Konan Shopping
              Cameroun.

            </p>

          </header>


          {/* =================================================
              🔐 SÉCURITÉ
          ================================================= */}

          <div
            className="
              driver-security
            "
          >

            <FaShieldAlt />

            Vos informations sont
            protégées et sécurisées.

          </div>


          {/* =================================================
              FORMULAIRE
          ================================================= */}

          <div
            className="
              driver-form
            "
          >


            <InputField

              name="name"

              label="Nom complet"

              placeholder="
                Votre nom complet
              "

              icon={
                <FaUser />
              }

            />


            <InputField

              name="email"

              label="Adresse email"

              placeholder="
                votre@email.com
              "

              type="email"

              icon={
                <FaEnvelope />
              }

            />


            {/* =================================================
                MOT DE PASSE
            ================================================= */}

            <div
              className="
                driver-field
              "
            >

              <label>

                Mot de passe

              </label>


              <div
                className="
                  driver-input
                "
              >

                <span
                  className="
                    driver-input-icon
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

                  name="password"

                  value={
                    form.password
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="
                    Créer un mot de passe
                  "

                  autoComplete="
                    new-password
                  "

                />


                <button

                  type="button"

                  className="
                    driver-password-button
                  "

                  onClick={() =>
                    setShowPassword(
                      previous =>
                        !previous
                    )
                  }

                >

                  {showPassword

                    ? <FaEyeSlash />

                    : <FaEye />

                  }

                </button>

              </div>

            </div>


            <InputField

              name="phone"

              label="Téléphone"

              placeholder="
                Ex : 691 01 67 20
              "

              type="tel"

              icon={
                <FaPhone />
              }

            />


            <InputField

              name="city"

              label="Ville"

              placeholder="
                Ex : Yaoundé
              "

              icon={
                <FaCity />
              }

            />


            <InputField

              name="vehicle"

              label="Véhicule"

              placeholder="
                Moto / voiture
              "

              icon={
                <FaCar />
              }

            />


            <InputField

              name="plate"

              label="
                Plaque du véhicule
              "

              placeholder="
                Ex : CMR 001 DSE
              "

              icon={
                <FaIdCard />
              }

            />


            {/* =================================================
                📸 PHOTO
            ================================================= */}

            <div
              className="
                driver-photo-section
              "
            >

              <label
                className="
                  driver-photo-label
                "
              >

                <FaCamera />

                Photo du livreur

              </label>


              <label
                className="
                  driver-photo-upload
                "
              >

                <FaCamera />

                {image

                  ? "Changer la photo"

                  : "Choisir une photo"

                }


                <input

                  type="file"

                  accept="
                    image/jpeg,
                    image/png,
                    image/webp,
                    image/jpg
                  "

                  onChange={
                    handleImageChange
                  }

                />

              </label>


              {/* =================================================
                  PREVIEW
              ================================================= */}

              {preview && (

                <div
                  className="
                    driver-photo-preview
                  "
                >

                  <div
                    className="
                      driver-photo-wrapper
                    "
                  >

                    <img

                      src={
                        preview
                      }

                      alt="
                        Aperçu de la photo du livreur
                      "

                    />


                    <div
                      className="
                        driver-photo-check
                      "
                    >

                      <FaCheckCircle />

                    </div>

                  </div>

                </div>

              )}


              <div
                className="
                  driver-cloudinary
                "
              >

                <FaCloudUploadAlt />

                Photo sécurisée avec
                Cloudinary.

              </div>

            </div>


            {/* =================================================
                🚀 BOUTON
            ================================================= */}

            <button

              type="button"

              className="
                driver-submit
              "

              onClick={
                register
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
                        "driverSpin 1s linear infinite"
                    }}
                  />

                  Création du compte...

                </>

              ) : (

                <>

                  <FaUserPlus />

                  Créer mon compte

                </>

              )}

            </button>


            {/* =================================================
                🔐 CONNEXION
            ================================================= */}

            <div
              className="
                driver-login-footer
              "
            >

              Vous avez déjà un compte ?

              <Link
                to="/driver-login"
              >

                <FaArrowLeft />

                Se connecter

              </Link>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                driver-footer
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