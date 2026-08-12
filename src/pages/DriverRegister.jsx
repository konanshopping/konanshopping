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
  FaArrowLeft
} from "react-icons/fa";

import {
  Link,
  useNavigate
} from "react-router-dom";


export default function DriverRegister() {

  const navigate =
    useNavigate();


  // =====================================================
  // FORMULAIRE
  // =====================================================

  const [form, setForm] =
    useState({

      name: "",
      email: "",
      password: "",
      phone: "",
      city: "",
      vehicle: "",
      plate: "",

    });


  // =====================================================
  // PHOTO
  // =====================================================

  const [image, setImage] =
    useState(null);

  const [preview,
    setPreview] =
    useState("");


  // =====================================================
  // UI
  // =====================================================

  const [loading,
    setLoading] =
    useState(false);

  const [showPassword,
    setShowPassword] =
    useState(false);


  // =====================================================
  // NOTIFICATION
  // =====================================================

  const [notification,
    setNotification] =
    useState(null);


  // =====================================================
  // PREVIEW IMAGE
  // =====================================================

  useEffect(() => {

    if (!image) {

      setPreview("");

      return;

    }


    const url =
      URL.createObjectURL(
        image
      );

    setPreview(url);


    return () => {

      URL.revokeObjectURL(
        url
      );

    };

  }, [image]);


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

    }, 5000);

  };


  // =====================================================
  // ICON NOTIFICATION
  // =====================================================

  const notificationIcon = () => {

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


  const notificationColor = () => {

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
  // CHANGEMENT FORMULAIRE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setForm((prev) => ({

      ...prev,

      [name]:
        value

    }));

  };


  // =====================================================
  // PHOTO
  // =====================================================

  const handleImageChange =
    (e) => {

      const file =
        e.target.files?.[0];


      if (!file) {

        return;

      }


      // -----------------------------------------------
      // Vérification type
      // -----------------------------------------------

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        showNotification(

          "error",

          "Format incorrect",

          "Veuillez sélectionner une image."

        );

        return;

      }


      // -----------------------------------------------
      // Taille maximale : 5 MB
      // -----------------------------------------------

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        showNotification(

          "error",

          "Image trop volumineuse",

          "La photo doit faire moins de 5 MB."

        );

        return;

      }


      setImage(file);

    };


  // =====================================================
  // VALIDATION
  // =====================================================

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

        "Veuillez utiliser une adresse email valide."

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

        "Le mot de passe doit contenir au moins 6 caractères."

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


  // =====================================================
  // INSCRIPTION
  // =====================================================

  const register =
    async () => {

      if (
        !validateForm()
      ) {

        return;

      }


      try {

        setLoading(true);


        // =============================================
        // PHOTO UPLOAD
        // =============================================

        let photoUrl = "";


        if (image) {

          const data =
            new FormData();


          data.append(
            "image",
            image
          );


          const upload =
            await axios.post(

              "https://konanshopping.com/api/upload",

              data

            );


          photoUrl =
            upload.data.imageUrl;

        }


        // =============================================
        // CRÉATION DU LIVREUR
        // =============================================

        await axios.post(

          "https://konanshopping.com/api/driver-register",

          {

            ...form,

            photo:
              photoUrl

          }

        );


        // =============================================
        // SUCCÈS
        // =============================================

        showNotification(

          "success",

          "Compte créé avec succès",

          "Votre compte livreur Konan Shopping est maintenant créé."

        );


        // =============================================
        // REDIRECTION
        // =============================================

        setTimeout(() => {

          navigate(
            "/driver-login"
          );

        }, 1200);


      } catch (err) {

        console.log(
          "❌ DRIVER REGISTER:",
          err
        );


        let message =
          "Une erreur est survenue lors de l'inscription.";


        if (
          err.response?.data?.message
        ) {

          message =
            err.response.data.message;

        }


        if (
          err.response?.data?.error
        ) {

          message =
            err.response.data.error;

        }


        showNotification(

          "error",

          "Inscription impossible",

          message

        );

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // INPUT COMPONENT
  // =====================================================

  const InputField = ({
    name,
    label,
    placeholder,
    icon,
    type = "text"
  }) => {

    return (

      <div
        style={{

          marginTop:
            "14px"

        }}
      >

        <label
          style={{

            display:
              "block",

            marginBottom:
              "7px",

            color:
              "#334155",

            fontSize:
              "12px",

            fontWeight:
              "800"

          }}
        >

          {label}

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
              "14px",

            padding:
              "0 13px",

            transition:
              "all .2s ease"

          }}
        >

          <span
            style={{

              color:
                "#64748b",

              fontSize:
                "14px",

              display:
                "flex",

              alignItems:
                "center",

              flexShrink:
                0

            }}
          >

            {icon}

          </span>


          <input

            type={
              type
            }

            name={
              name
            }

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
              name === "password"
                ? "new-password"
                : "off"
            }

            style={{

              flex:
                1,

              minWidth:
                0,

              border:
                "none",

              outline:
                "none",

              background:
                "transparent",

              padding:
                "14px 0",

              fontSize:
                "13px",

              color:
                "#0f172a"

            }}

          />

        </div>

      </div>

    );

  };


  return (

    <div
      style={{

        minHeight:
          "100vh",

        width:
          "100%",

        boxSizing:
          "border-box",

        display:
          "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        padding:
          "20px",

        background:
          "linear-gradient(135deg,#eef4ff 0%,#f8fafc 48%,#eef2ff 100%)",

        fontFamily:
          "'Inter',Arial,sans-serif",

        position:
          "relative",

        overflow:
          "hidden"

      }}
    >


      {/* ================================================= */}
      {/* BACKGROUND */}
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
            "rgba(37,99,235,.11)",

          top:
            "-180px",

          right:
            "-150px",

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
            "350px",

          height:
            "350px",

          borderRadius:
            "50%",

          background:
            "rgba(79,70,229,.10)",

          bottom:
            "-150px",

          left:
            "-130px",

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
              "rgba(255,255,255,.97)",

            backdropFilter:
              "blur(18px)",

            WebkitBackdropFilter:
              "blur(18px)",

            border:
              "1px solid #e2e8f0",

            borderRadius:
              "18px",

            padding:
              "14px",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            boxShadow:
              "0 20px 55px rgba(15,23,42,.16)",

            zIndex:
              99999,

            animation:
              "driverRegisterNotification .3s ease"

          }}
        >

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
                `${notificationColor()}18`,

              color:
                notificationColor(),

              fontSize:
                "17px"

            }}
          >

            {notificationIcon()}

          </div>


          <div
            style={{
              flex: 1,
              minWidth: 0
            }}
          >

            <div
              style={{

                color:
                  "#0f172a",

                fontSize:
                  "13px",

                fontWeight:
                  "900"

              }}
            >

              {notification.title}

            </div>


            <div
              style={{

                marginTop:
                  "3px",

                color:
                  "#64748b",

                fontSize:
                  "11px",

                lineHeight:
                  "1.45"

              }}
            >

              {notification.message}

            </div>

          </div>


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
                "pointer"

            }}
          >

            ×

          </button>

        </div>

      )}


      {/* ================================================= */}
      {/* CARD */}
      {/* ================================================= */}

      <div
        style={{

          width:
            "100%",

          maxWidth:
            "470px",

          background:
            "rgba(255,255,255,.95)",

          backdropFilter:
            "blur(20px)",

          WebkitBackdropFilter:
            "blur(20px)",

          borderRadius:
            "26px",

          padding:
            "clamp(22px,5vw,38px)",

          boxSizing:
            "border-box",

          position:
            "relative",

          zIndex:
            2,

          border:
            "1px solid rgba(255,255,255,.85)",

          boxShadow:
            "0 25px 70px rgba(15,23,42,.12)"

        }}
      >


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          style={{

            textAlign:
              "center"

          }}
        >

          <div
            style={{

              width:
                "74px",

              height:
                "74px",

              borderRadius:
                "21px",

              margin:
                "0 auto",

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
                "29px",

              boxShadow:
                "0 14px 32px rgba(37,99,235,.28)"

            }}
          >

            <FaTruck />

          </div>


          <div
            style={{

              marginTop:
                "17px",

              color:
                "#2563eb",

              fontSize:
                "11px",

              fontWeight:
                "900",

              letterSpacing:
                "1.5px"

            }}
          >

            KONAN SHOPPING

          </div>


          <h1
            style={{

              margin:
                "7px 0 0",

              color:
                "#0f172a",

              fontSize:
                "clamp(25px,7vw,32px)",

              fontWeight:
                "900",

              letterSpacing:
                "-.8px"

            }}
          >

            Devenir livreur

          </h1>


          <p
            style={{

              margin:
                "9px 0 0",

              color:
                "#64748b",

              fontSize:
                "12px",

              lineHeight:
                "1.6"

            }}
          >

            Rejoignez les partenaires
            de livraison de Konan Shopping
            Cameroun.

          </p>

        </div>


        {/* ================================================= */}
        {/* SECURITY */}
        {/* ================================================= */}

        <div
          style={{

            marginTop:
              "20px",

            padding:
              "10px 12px",

            borderRadius:
              "13px",

            background:
              "#f8fafc",

            border:
              "1px solid #e2e8f0",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "8px",

            color:
              "#475569",

            fontSize:
              "10px",

            fontWeight:
              "700"

          }}
        >

          <FaShieldAlt
            style={{
              color:
                "#2563eb"
            }}
          />

          Vos informations sont protégées.

        </div>


        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <InputField

          name="name"

          label="Nom complet"

          placeholder="Votre nom complet"

          icon={
            <FaUser />
          }

        />


        <InputField

          name="email"

          label="Adresse email"

          placeholder="votre@email.com"

          type="email"

          icon={
            <FaEnvelope />
          }

        />


        {/* ================================================= */}
        {/* PASSWORD */}
        {/* ================================================= */}

        <div
          style={{

            marginTop:
              "14px"

          }}
        >

          <label
            style={{

              display:
                "block",

              marginBottom:
                "7px",

              color:
                "#334155",

              fontSize:
                "12px",

              fontWeight:
                "800"

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
                "14px",

              padding:
                "0 13px"

            }}
          >

            <FaLock
              style={{

                color:
                  "#64748b",

                fontSize:
                  "14px"

              }}
            />


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

              placeholder=
                "Créer un mot de passe"

              autoComplete=
                "new-password"

              style={{

                flex:
                  1,

                minWidth:
                  0,

                border:
                  "none",

                outline:
                  "none",

                background:
                  "transparent",

                padding:
                  "14px 0",

                fontSize:
                  "13px"

              }}

            />


            <button

              type="button"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
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
                  "5px"

              }}
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

          placeholder="Ex : 691 01 67 20"

          type="tel"

          icon={
            <FaPhone />
          }

        />


        <InputField

          name="city"

          label="Ville"

          placeholder="Ex : Yaoundé"

          icon={
            <FaCity />
          }

        />


        <InputField

          name="vehicle"

          label="Véhicule"

          placeholder="Moto / voiture"

          icon={
            <FaCar />
          }

        />


        <InputField

          name="plate"

          label="Plaque du véhicule"

          placeholder="Ex : CMR 001 DSE"

          icon={
            <FaIdCard />
          }

        />


        {/* ================================================= */}
        {/* PHOTO */}
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

              color:
                "#334155",

              fontSize:
                "12px",

              fontWeight:
                "800"

            }}
          >

            Photo du livreur

          </label>


          <label
            style={{

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              gap:
                "9px",

              minHeight:
                "48px",

              border:
                "1px dashed #cbd5e1",

              borderRadius:
                "14px",

              background:
                "#f8fafc",

              color:
                "#475569",

              fontSize:
                "12px",

              fontWeight:
                "800",

              cursor:
                "pointer"

            }}
          >

            <FaCamera
              style={{
                color:
                  "#2563eb"
              }}
            />

            {image
              ? "Changer la photo"
              : "Choisir une photo"
            }


            <input

              type="file"

              accept="image/*"

              onChange={
                handleImageChange
              }

              style={{
                display:
                  "none"
              }}

            />

          </label>

        </div>


        {/* ================================================= */}
        {/* PREVIEW */}
        {/* ================================================= */}

        {preview && (

          <div
            style={{

              marginTop:
                "15px",

              display:
                "flex",

              justifyContent:
                "center"

            }}
          >

            <div
              style={{
                position:
                  "relative"
              }}
            >

              <img

                src={
                  preview
                }

                alt="Aperçu"

                style={{

                  width:
                    "88px",

                  height:
                    "88px",

                  borderRadius:
                    "50%",

                  objectFit:
                    "cover",

                  border:
                    "4px solid #dbeafe",

                  boxShadow:
                    "0 10px 25px rgba(37,99,235,.16)"

                }}

              />


              <div
                style={{

                  position:
                    "absolute",

                  right:
                    "0",

                  bottom:
                    "3px",

                  width:
                    "25px",

                  height:
                    "25px",

                  borderRadius:
                    "50%",

                  background:
                    "#2563eb",

                  color:
                    "white",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  fontSize:
                    "10px"

                }}
              >

                <FaCamera />

              </div>

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* BUTTON */}
        {/* ================================================= */}

        <button

          type="button"

          onClick={
            register
          }

          disabled={
            loading
          }

          style={{

            width:
              "100%",

            marginTop:
              "23px",

            border:
              "none",

            borderRadius:
              "15px",

            padding:
              "15px",

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
              "9px",

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
                : "0 12px 28px rgba(37,99,235,.25)"

          }}
        >

          {loading ? (

            <>

              <FaSpinner
                style={{
                  animation:
                    "driverRegisterSpin 1s linear infinite"
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


        {/* ================================================= */}
        {/* LOGIN LINK */}
        {/* ================================================= */}

        <div
          style={{

            marginTop:
              "20px",

            paddingTop:
              "18px",

            borderTop:
              "1px solid #eef2f7",

            textAlign:
              "center",

            color:
              "#64748b",

            fontSize:
              "11px"

          }}
        >

          Vous avez déjà un compte ?

          <Link

            to="/driver-login"

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

              fontWeight:
                "900",

              textDecoration:
                "none"

            }}
          >

            <FaArrowLeft />

            Se connecter

          </Link>

        </div>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div
          style={{

            marginTop:
              "17px",

            textAlign:
              "center",

            color:
              "#94a3b8",

            fontSize:
              "9px",

            fontWeight:
              "600"

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

          @keyframes driverRegisterSpin {

            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }

          }


          @keyframes driverRegisterNotification {

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


          @media (max-width: 480px) {

            body {
              overflow-x: hidden;
            }

          }

        `}

      </style>

    </div>

  );

}