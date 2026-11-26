import { useEffect, useState } from "react";







import {



  FaBoxOpen,



  FaMoneyBillWave,



  FaShoppingBag,



  FaHashtag,



  FaTruck,



  FaCheckCircle,



  FaMapMarkerAlt,



  FaBox,



  FaEye,



} from "react-icons/fa";







import axios from "axios";







import { useParams } from "react-router-dom";










const API_BASE_URL = "https://konanshopping.com/api";


const API_TIMEOUT = 15000;

const MAX_ID_LENGTH = 24;



// ======================================================
 // 🔐 AUTHENTIFICATION UTILISATEUR PAR COOKIE HTTPONLY
 // ======================================================
 // Le JWT utilisateur n'est plus lu depuis localStorage.
 // Le navigateur envoie automatiquement le cookie HttpOnly.
 // La logique métier de la page reste inchangée.
 // ======================================================

axios.defaults.withCredentials = true;


const isValidObjectId = (value) => {

  if (typeof value !== "string") return false;

  const safeId = value.trim();

  return safeId.length === MAX_ID_LENGTH && /^[a-fA-F0-9]{24}$/.test(safeId);

};



const getSafeServerMessage = (error) => {

  const message = error?.response?.data?.message;

  return typeof message === "string" && message.trim()

    ? message.trim().slice(0, 300)

    : "";

};



const normalizeOrder = (data) => {

  const candidate = data?.order || data?.data || data;

  if (!candidate || typeof candidate !== "object") return null;

  if (!isValidObjectId(String(candidate._id || ""))) return null;

  return candidate;

};



const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use(
  (config) => {
    if (!config) return config;

    config.withCredentials = true;
    config.headers = config.headers || {};
    config.headers.Accept = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error?.response?.status === 401 || error?.response?.status === 403) {

      error.userMessage = "Accès refusé ou session expirée.";

    } else if (error?.code === "ECONNABORTED") {

      error.userMessage = "Le serveur met trop de temps à répondre.";

    } else if (!error?.response) {

      error.userMessage = "Impossible de contacter le serveur.";

    }

    return Promise.reject(error);

  }

);



export default function OrderDetails() {







  const { id } = useParams();







  const [order, setOrder] =



    useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchOrder = async () => {
      setLoading(true);
      setLoadError(false);

      if (!isValidObjectId(id)) {
        if (mounted) {
          setOrder(null);
          setLoadError(true);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get(`/order/${encodeURIComponent(id.trim())}`);
        if (!mounted) return;

        const data = normalizeOrder(res?.data);

        if (!data) {
          setOrder(null);
          setLoadError(true);
          return;
        }

        if (import.meta.env?.DEV) {
          console.debug("Order details loaded:", data._id);
        }

        setOrder(data);
      } catch (err) {
        if (!mounted) return;

        if (import.meta.env?.DEV) {
          console.warn(
            "Impossible de charger la commande.",
            err?.userMessage ||
              getSafeServerMessage(err) ||
              "Erreur serveur"
          );
        }

        setOrder(null);
        setLoadError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      mounted = false;
    };
  }, [id]);


 if (!order) {







  return (







    <div className="konan-order-details konan-order-details--state"



      style={{
        background: "#F5F7FB",







        minHeight: "100dvh",







        display: "flex",







        justifyContent: "center",







        alignItems: "center",







        padding: "16px",



      }}



    >
      <style>{`
        .konan-order-details,
        .konan-order-details * { box-sizing: border-box; }
        .konan-order-details {
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          overflow-x: clip;
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
          padding:
            max(16px, env(safe-area-inset-top))
            max(16px, env(safe-area-inset-right))
            max(16px, env(safe-area-inset-bottom))
            max(16px, env(safe-area-inset-left)) !important;
        }
        .konan-order-details img { max-width: 100%; }
        .konan-order-details button {
          min-height: 46px;
          touch-action: manipulation;
          -webkit-appearance: none;
        }
        .konan-order-details h1,
        .konan-order-details h2,
        .konan-order-details h3,
        .konan-order-details p,
        .konan-order-details span,
        .konan-order-details strong { overflow-wrap: anywhere; }
        @media (max-width: 600px) {
          .konan-order-details--state > div { max-width: 100% !important; }
        }
        @media (max-width: 360px) {
          .konan-order-details--state {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .konan-order-details--state > div { padding: 18px !important; }
        }
      `}</style>

      <div



        style={{



          background: "#FFFFFF",







          width: "100%",







          maxWidth: "340px",







          padding: "22px",







          borderRadius: "22px",







          border: "1px solid #E5E7EB",







          boxShadow:



            "0 10px 30px rgba(15,23,42,0.06)",







          display: "flex",







          flexDirection: "column",







          alignItems: "center",







          textAlign: "center",



        }}



      >







        <div



          style={{



            width: "65px",







            height: "65px",







            borderRadius: "18px",







            background:



              "linear-gradient(135deg,color-mix(in srgb, var(--season-primary, #2563eb) 10%, white),color-mix(in srgb, var(--season-primary, #2563eb) 22%, white))",







            display: "flex",







            justifyContent: "center",







            alignItems: "center",







            marginBottom: "14px",



          }}



        >







          <FaBoxOpen



            style={{



              fontSize: "28px",







              color: "var(--season-primary, #2563eb)",



            }}



          />







        </div>







        <h2



          style={{



            margin: 0,







            color: "#111827",







            fontSize: "18px",







            fontWeight: "900",



          }}



        >



          {loading ? "Chargement..." : "Commande indisponible"}



        </h2>







        <p



          style={{



            marginTop: "8px",







            marginBottom: 0,







            color: "#64748B",







            fontSize: "13px",







            lineHeight: "22px",



          }}



        >



          {loading
            ? "Récupération des détails de votre commande"
            : loadError
              ? "Impossible d’afficher cette commande. Vérifiez le lien ou réessayez plus tard."
              : "Récupération des détails de votre commande"}



        </p>







      </div>







    </div>







  );







}







  const products =



    order.items || order.products || [];







  return (







    <div className="konan-order-details"



      style={{
        background: "#f5f7fb",



        minHeight: "100vh",



        padding: "15px",



      }}
    >
      <style>{`
        .konan-order-details,
        .konan-order-details * { box-sizing: border-box; }
        .konan-order-details {
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          overflow-x: clip;
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
          padding:
            max(15px, env(safe-area-inset-top))
            max(15px, env(safe-area-inset-right))
            max(15px, env(safe-area-inset-bottom))
            max(15px, env(safe-area-inset-left)) !important;
        }
        .konan-order-details > div { width: 100%; min-width: 0; }
        .konan-order-details .konan-order-details__card {
          width: 100%;
          max-width: 850px;
          margin-left: auto;
          margin-right: auto;
        }
        .konan-order-details img {
          display: block;
          max-width: 100%;
          height: auto;
          -webkit-user-drag: none;
        }
        .konan-order-details button {
          min-height: 46px;
          touch-action: manipulation;
          -webkit-appearance: none;
        }
        .konan-order-details h1,
        .konan-order-details h2,
        .konan-order-details h3,
        .konan-order-details p,
        .konan-order-details span,
        .konan-order-details strong { overflow-wrap: anywhere; }
        @media (max-width: 600px) {
          .konan-order-details {
            padding-left: max(12px, env(safe-area-inset-left)) !important;
            padding-right: max(12px, env(safe-area-inset-right)) !important;
          }
          .konan-order-details .konan-order-details__card { border-radius: 16px !important; }
        }
        @media (max-width: 380px) {
          .konan-order-details {
            padding-left: max(9px, env(safe-area-inset-left)) !important;
            padding-right: max(9px, env(safe-area-inset-right)) !important;
          }
          .konan-order-details .konan-order-details__card { padding: 12px !important; }
        }
        @media (max-width: 340px) {
          .konan-order-details .konan-order-details__card { padding: 10px !important; }
          .konan-order-details button { width: 100% !important; }
        }
        @media (orientation: landscape) and (max-height: 500px) {
          .konan-order-details { min-height: 100svh; }
        }
        @media (prefers-reduced-motion: reduce) {
          .konan-order-details *,
          .konan-order-details *::before,
          .konan-order-details *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

     {/* MAIN CARD */}







<div className="konan-order-details__card"



  style={{



    background: "#FFFFFF",







    maxWidth: "850px",







    margin: "0 auto",







    borderRadius: "16px",







    padding:



      window.innerWidth < 768



        ? "16px"



        : "22px",







    border: "1px solid #E5E7EB",







    boxShadow:



      "0 2px 12px rgba(15,23,42,0.05)",



  }}



>







  {/* HEADER */}







<div



  style={{



    display: "flex",



    justifyContent: "space-between",



    alignItems:



      window.innerWidth < 768



        ? "flex-start"



        : "center",



    flexDirection:



      window.innerWidth < 768



        ? "column"



        : "row",



    gap: "12px",



    paddingBottom: "14px",



    marginBottom: "16px",



    borderBottom: "1px solid #E5E7EB",



  }}



>







  {/* LEFT */}







  <div



    style={{



      display: "flex",



      alignItems: "center",



      gap: "10px",



      width: "100%",



      minWidth: 0,



    }}



  >







    <div



      style={{



        width:



          window.innerWidth < 768



            ? "44px"



            : "54px",







        height:



          window.innerWidth < 768



            ? "44px"



            : "54px",







        borderRadius: "14px",







        background:



          "linear-gradient(135deg,color-mix(in srgb, var(--season-primary, #2563eb) 10%, white),color-mix(in srgb, var(--season-primary, #2563eb) 22%, white))",







        display: "flex",







        justifyContent: "center",







        alignItems: "center",







        flexShrink: 0,



      }}



    >







      <FaBoxOpen



        style={{



          fontSize:



            window.innerWidth < 768



              ? "18px"



              : "24px",







          color: "var(--season-primary, #2563eb)",



        }}



      />







    </div>







    <div



      style={{



        flex: 1,



        minWidth: 0,



      }}



    >







      <h1



        style={{



          margin: 0,







          color: "#111827",







          fontSize:



            window.innerWidth < 768



              ? "17px"



              : "24px",







          fontWeight: "900",







          lineHeight: 1.2,



        }}



      >



        Détails commande



      </h1>







      <div



        style={{



          display: "flex",







          alignItems: "center",







          gap: "5px",







          marginTop: "4px",







          color: "#64748B",







          fontSize: "11px",







          overflow: "hidden",



        }}



      >







        <FaHashtag



          style={{



            fontSize: "10px",



          }}



        />







        <span



          style={{



            overflow: "hidden",



            textOverflow: "ellipsis",



            whiteSpace: "nowrap",



          }}



        >



          {order._id}



        </span>







      </div>







    </div>







  </div>







  {/* STATUS */}







  <div



    style={{



      background:



        order.status === "Livrée"



          ? "#DCFCE7"



          : order.status === "En livraison"



          ? "#DBEAFE"



          : "#FEF3C7",







      color:



        order.status === "Livrée"



          ? "#15803D"



          : order.status === "En livraison"



          ? "#2563EB"



          : "#92400E",







      padding: "8px 12px",







      borderRadius: "999px",







      fontWeight: "800",







      fontSize: "11px",







      display: "flex",







      alignItems: "center",







      gap: "6px",







      border:



        order.status === "Livrée"



          ? "1px solid #BBF7D0"



          : order.status === "En livraison"



          ? "1px solid #BFDBFE"



          : "1px solid #FCD34D",







      alignSelf:



        window.innerWidth < 768



          ? "flex-start"



          : "center",



    }}



  >







    {



      order.status === "Livrée"



        ? <FaCheckCircle />



        : order.status === "En livraison"



        ? <FaTruck />



        : <FaBoxOpen />



    }







    {order.status}







  </div>







</div>











{/* PRODUITS */}







{products.map((item, index) => (







  <div



    key={index}



    style={{



      background: "#FFFFFF",







      border:



        "1px solid #E5E7EB",







      borderRadius: "16px",







      padding: "12px",







      marginBottom: "12px",







      display: "flex",







      justifyContent: "space-between",







      alignItems: "center",







      gap: "12px",







      boxShadow:



        "0 2px 8px rgba(15,23,42,0.04)",



    }}



  >







    {/* LEFT */}







    <div



      style={{



        display: "flex",







        alignItems: "center",







        gap: "12px",







        flex: 1,







        minWidth: 0,



      }}



    >







      <img



        src={



          (



            item.image ||



            item.product?.image ||



            item.productImage



          )?.includes("localhost:5000")







            ? (



                item.image ||



                item.product?.image ||



                item.productImage



              ).replace(



                "http\://localhost:5000",



                "https://konanshopping.com/api/"



              )







            : (



                item.image ||



                item.product?.image ||



                item.productImage ||



                "/logo.jpg"



              )



        }







        alt={



          item.name ||



          item.product?.name



        }







        onError={(e) => {



          e.target.src = "/logo.jpg";



        }}







        style={{



          width:



            window.innerWidth < 768



              ? "65px"



              : "75px",







          height:



            window.innerWidth < 768



              ? "65px"



              : "75px",







          objectFit: "cover",







          borderRadius: "14px",







          border:



            "1px solid #E5E7EB",







          flexShrink: 0,



        }}



      />







      <div



        style={{



          flex: 1,







          minWidth: 0,



        }}



      >







        <div



          style={{



            display: "inline-flex",







            alignItems: "center",







            gap: "6px",







            background: "color-mix(in srgb, var(--season-primary, #2563eb) 7%, white)",







            color: "var(--season-primary, #2563eb)",







            padding: "4px 8px",







            borderRadius: "999px",







            fontSize: "10px",







            fontWeight: "700",







            marginBottom: "6px",



          }}



        >







          <FaShoppingBag />







          Produit







        </div>







        <h3



          style={{



            margin: 0,







            color: "#111827",







            fontSize:



              window.innerWidth < 768



                ? "14px"



                : "16px",







            fontWeight: "800",







            overflow: "hidden",







            textOverflow: "ellipsis",







            whiteSpace: "nowrap",



          }}



        >



          {



            item.name ||



            item.product?.name



          }



        </h3>







        <div



          style={{



            display: "flex",







            alignItems: "center",







            gap: "6px",







            marginTop: "6px",







            color: "#64748B",







            fontSize: "12px",



          }}



        >







          <FaBox />







          Quantité :



          {" "}



          {item.quantity || 1}







        </div>







      </div>







    </div>







    {/* PRIX */}







    <div



      style={{



        textAlign: "right",







        flexShrink: 0,



      }}



    >







      <div



        style={{



          fontSize: "11px",







          color: "#94A3B8",







          fontWeight: "600",



        }}



      >



        Prix



      </div>







      <div



        style={{



          color: "var(--season-primary, #2563eb)",







          fontWeight: "900",







          fontSize:



            window.innerWidth < 768



              ? "15px"



              : "18px",



        }}



      >



        {



          item.price ||



          item.product?.price



        } FCFA



      </div>







    </div>







  </div>







))}







        {/* FOOTER */}







<div



  style={{



    marginTop: "18px",







    background: "#F8FAFC",







    border: "1px solid #E2E8F0",







    borderRadius: "18px",







    padding: "16px",







    display: "flex",







    justifyContent: "space-between",







    alignItems:



      window.innerWidth < 768



        ? "stretch"



        : "center",







    flexDirection:



      window.innerWidth < 768



        ? "column"



        : "row",







    gap: "14px",



  }}



>







  {/* TOTAL */}







  <div



    style={{



      flex: 1,



    }}



  >







    <div



      style={{



        display: "flex",







        alignItems: "center",







        gap: "8px",







        color: "#64748B",







        fontSize: "12px",







        fontWeight: "700",



      }}



    >







      <FaMoneyBillWave



        style={{



          color: "var(--season-primary, #2563eb)",



        }}



      />







      Montant total







    </div>







    <h2



      style={{



        margin: "8px 0 0 0",







        color: "#111827",







        fontSize:



          window.innerWidth < 768



            ? "24px"



            : "30px",







        fontWeight: "900",







        lineHeight: 1,



      }}



    >



      {order.total} FCFA



    </h2>







  </div>







  {/* BUTTON */}







  <button



   onClick={() =>



  window.location.href =



  `/track-order/${order._id}`



}



    style={{



      background:



        "linear-gradient(135deg,var(--season-primary, #2563eb),var(--season-secondary, #3b82f6))",







      color: "#FFFFFF",







      border: "none",







      padding:



        window.innerWidth < 768



          ? "14px"



          : "14px 22px",







      borderRadius: "14px",







      fontWeight: "800",







      fontSize: "14px",







      cursor: "pointer",







      display: "flex",







      alignItems: "center",







      justifyContent: "center",







      gap: "8px",







      width:



        window.innerWidth < 768



          ? "100%"



          : "auto",







      boxShadow:



        "0 8px 20px rgba(79,70,229,0.18)",



    }}



  >







    <FaTruck />







    Suivre la livraison







  </button>







</div>







      </div>







    </div>







  );







}