import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {

  FaBoxOpen,

  FaShippingFast,

  FaMapMarkerAlt,

  FaMoneyBillWave,

  FaBox,

} from "react-icons/fa";

import { FaTruckFast } from "react-icons/fa6";

import {

  FaClipboardList

} from "react-icons/fa6";

/* =========================================================

   🔐 SÉCURITÉ FRONTEND

   Le backend reste l'autorité finale.

\\========================================================= */

const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;

const MAX_USER_ID_LENGTH = 24;

const MAX_STORED_USER_LENGTH = 10000;
const MAX_ORDERS = 200;

// Vérifie qu'un identifiant possède le format d'un ObjectId MongoDB.
const isValidObjectId = (value) =>
  typeof value === "string" &&
  value.length <= MAX_USER_ID_LENGTH &&
  /^[a-fA-F0-9]{24}$/.test(value);

// Récupère l'utilisateur enregistré localement, sans faire planter la page.
const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser || rawUser.length > MAX_STORED_USER_LENGTH) return null;

    const user = JSON.parse(rawUser);
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
};

// Accepte les formats de réponse habituels de l'API.
const normalizeOrdersResponse = (payload) => {
  let list = [];

  if (Array.isArray(payload)) {
    list = payload;
  } else if (payload && typeof payload === "object") {
    if (Array.isArray(payload.orders)) list = payload.orders;
    else if (Array.isArray(payload.data)) list = payload.data;
    else if (Array.isArray(payload.results)) list = payload.results;
  }

  return list
    .filter((order) => order && typeof order === "object")
    .slice(0, MAX_ORDERS);
};

const safeServerMessage = (error) => {
  const message = error?.response?.data?.message;

  if (typeof message === "string" && message.trim()) {
    return message.trim().slice(0, 300);
  }

  return "";
};

// ======================================================
// 🔐 AUTHENTIFICATION PAR COOKIE HTTPONLY
// ======================================================
// Le frontend ne lit plus le JWT depuis localStorage.
// Le navigateur envoie automatiquement le cookie HttpOnly.
// Le backend reste l'autorité finale.
// ======================================================

axios.defaults.withCredentials = true;

const getAuthConfig = () => ({
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config) {
      return config;
    }

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
    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      error.userMessage =
        "Votre session a expiré ou l'accès à vos commandes est refusé.";
    } else if (error?.code === "ECONNABORTED") {
      error.userMessage =
        "Le serveur met trop de temps à répondre.";
    } else if (!error?.response) {
      error.userMessage =
        "Impossible de contacter le serveur.";
    }

    return Promise.reject(error);
  }
);

export default function ShippedOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] =

    useState([]);

  // Suit les changements de largeur et d'orientation (Safari iOS inclus).
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia
        ? window.matchMedia("(max-width: 767px)").matches
        : window.innerWidth < 768
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia
      ? window.matchMedia("(max-width: 767px)")
      : null;

    const updateViewport = () => {
      setIsMobile(
        mediaQuery ? mediaQuery.matches : window.innerWidth < 768
      );
    };

    updateViewport();

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener("change", updateViewport);
    } else if (mediaQuery?.addListener) {
      mediaQuery.addListener(updateViewport);
    }

    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener("change", updateViewport);
      } else if (mediaQuery?.removeListener) {
        mediaQuery.removeListener(updateViewport);
      }
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  useEffect(() => {

  const fetchOrders = async () => {

      try {

        const user = getStoredUser();
const userId = String(

          user?._id ?? ""

        ).trim();

        if (!isValidObjectId(userId)) {

          navigate("/login", { replace: true });

          return;

        }

        const res = await api.get(

          `/api/my-orders/${encodeURIComponent(userId)}`

        );

        const ordersData =

          normalizeOrdersResponse(res.data);

        const filtered =

          ordersData.filter(

            (o) =>

              o.status ===

              "En livraison"

          );

        setOrders(filtered);

      } catch (err) {

        if (

          err?.response?.status === 401 ||

          err?.response?.status === 403

        ) {

          navigate("/login", {

            replace: true,

          });

          return;

        }

        if (import.meta.env?.DEV) {

          const message =

            err?.userMessage ||

            safeServerMessage(err) ||

            "Erreur lors du chargement des commandes.";

          console.warn(

            "[ShippedOrders]",

            message

          );

        }

      }

    };

    fetchOrders();

}, []);

  return (

    <div
      className="konan-shipped-orders-page"
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        minHeight: "100svh",
        minHeight: "100dvh",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "18px",
        overflowX: "clip",
      }}
    >

      {/* HEADER */}

<div

  style={{

    background:

      "linear-gradient(135deg,var(--season-secondary, #3b82f6),var(--season-primary, #2563eb))",

    padding:

      isMobile

        ? "16px"

        : "22px",

    borderRadius: "20px",

    color: "#FFF",

    marginBottom: "18px",

    position: "relative",

    overflow: "hidden",

    boxShadow:

      "0 8px 20px color-mix(in srgb, var(--season-primary, #2563eb) 15%, transparent)",

  }}

>

  {/* GLOW */}

  <div

    style={{

      position: "absolute",

      top: "-60px",

      right: "-60px",

      width: "120px",

      height: "120px",

      borderRadius: "50%",

      background:

        "rgba(255,255,255,0.07)",

    }}

  />

  <div

    style={{

      position: "relative",

      zIndex: 2,

      display: "flex",

      alignItems: "center",

      justifyContent:

        "space-between",

      gap: "12px",

    }}

  >

    {/* LEFT */}

    <div

      style={{

        display: "flex",

        alignItems: "center",

        gap: "12px",

        flex: 1,

      }}

    >

      {/* ICON */}

      <div

        style={{

          width:

            isMobile

              ? "50px"

              : "58px",

          height:

            isMobile

              ? "50px"

              : "58px",

          borderRadius: "16px",

          background:

            "rgba(255,255,255,0.15)",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          flexShrink: 0,

        }}

      >

        <FaTruckFast

          style={{

            fontSize:

              isMobile

                ? "22px"

                : "26px",

            color: "#FFFFFF",

          }}

        />

      </div>

      {/* TEXT */}

      <div

        style={{

          minWidth: 0,

        }}

      >

        <h1

          style={{

            margin: 0,

            fontSize:

              isMobile

                ? "18px"

                : "26px",

            fontWeight: "900",

            lineHeight: 1.2,

          }}

        >

          Commandes expédiées

        </h1>

        <p

          style={{

            margin: "4px 0 0 0",

            fontSize:

              isMobile

                ? "12px"

                : "14px",

            opacity: 0.95,

            lineHeight: "20px",

          }}

        >

          Consultez vos commandes en livraison et ouvrez leurs détails.

        </p>

      </div>

    </div>

    {/* BADGE */}

    <div

      style={{

        background:

          "rgba(255,255,255,0.15)",

        padding: "8px 12px",

        borderRadius: "999px",

        fontSize: "13px",

        fontWeight: "800",

      }}

    >

      {orders.length}

    </div>

  </div>

</div>

{/* AUCUNE COMMANDE */}

{orders.length === 0 && (

  <div

    style={{

      background: "#FFFFFF",

      padding:

        isMobile

          ? "32px 18px"

          : "45px 28px",

      borderRadius: "20px",

      textAlign: "center",

      border: "1px solid #E5E7EB",

      boxShadow:

        "0 8px 25px rgba(15,23,42,0.05)",

      position: "relative",

      overflow: "hidden",

    }}

  >

    {/* GLOW */}

    <div

      style={{

        position: "absolute",

        top: "-50px",

        right: "-50px",

        width: "120px",

        height: "120px",

        borderRadius: "50%",

        background:

          "color-mix(in srgb, var(--season-primary, #2563eb) 5%, transparent)",

      }}

    />

    {/* ICON */}

    <div

      style={{

        width:

          isMobile

            ? "75px"

            : "90px",

        height:

          isMobile

            ? "75px"

            : "90px",

        margin: "0 auto 18px",

        borderRadius: "22px",

        background:

          "linear-gradient(135deg,color-mix(in srgb, var(--season-primary, #2563eb) 14%, white),color-mix(in srgb, var(--season-primary, #2563eb) 22%, white))",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

      }}

    >

      <FaBoxOpen

        style={{

          fontSize:

            isMobile

              ? "34px"

              : "40px",

          color: "var(--season-primary, #2563eb)",

        }}

      />

    </div>

    {/* BADGE */}

    <div

      style={{

        display: "inline-flex",

        alignItems: "center",

        gap: "8px",

        background: "color-mix(in srgb, var(--season-primary, #2563eb) 8%, white)",

        color: "var(--season-primary, #2563eb)",

        padding: "8px 14px",

        borderRadius: "999px",

        fontSize: "12px",

        fontWeight: "800",

        marginBottom: "16px",

      }}

    >

      <FaClipboardList />

      Historique vide

    </div>

    {/* TITLE */}

    <h2

      style={{

        color: "#111827",

        fontSize:

          isMobile

            ? "22px"

            : "28px",

        fontWeight: "900",

        marginBottom: "10px",

        lineHeight: 1.2,

      }}

    >

      Aucune commande en livraison

    </h2>

    {/* TEXT */}

    <p

      style={{

        color: "#64748B",

        fontSize:

          isMobile

            ? "14px"

            : "15px",

        lineHeight: "24px",

        maxWidth: "420px",

        margin: "0 auto",

        fontWeight: "500",

      }}

    >

      Les commandes en livraison apparaîtront ici

      automatiquement dès leur mise en livraison.

    </p>

  </div>

)}

      {/* COMMANDES */}

{orders.map((order) => (

<div
  className="konan-shipped-order-card"
  key={order._id}
  onClick={() =>

    navigate(`/order/${order._id}`)

  }

  role="button"

  tabIndex={0}

  onKeyDown={(e) => {

    if (e.key === "Enter" || e.key === " ") {

      e.preventDefault();

      navigate(`/order/${order._id}`);

    }

  }}

  style={{

    background: "#FFFFFF",

    borderRadius: "20px",

    padding:

      isMobile

        ? "16px"

        : "18px",

    marginBottom: "16px",

    border: "1px solid #E5E7EB",

    boxShadow:

      "0 4px 12px rgba(15,23,42,0.05)",

    overflow: "hidden",

    cursor: "pointer",

    WebkitTapHighlightColor: "transparent",

    transition: "transform 0.18s ease, box-shadow 0.18s ease",

  }}

>

          {/* TOP */}

<div

  style={{

    display: "flex",

    justifyContent: "space-between",

    alignItems:

      isMobile

        ? "flex-start"

        : "center",

    gap: "12px",

    flexWrap: "wrap",

    marginBottom: "15px",

    paddingBottom: "14px",

    borderBottom:

      "1px solid #F1F5F9",

  }}

>

  <div

    style={{

      display: "flex",

      alignItems: "center",

      gap: "12px",

      flex: 1,

      minWidth: 0,

    }}

  >

    <div

      style={{

        width: "48px",

        height: "48px",

        borderRadius: "14px",

        background:

          "linear-gradient(135deg,color-mix(in srgb, var(--season-primary, #2563eb) 14%, white),color-mix(in srgb, var(--season-primary, #2563eb) 22%, white))",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        flexShrink: 0,

      }}

    >

      <FaTruckFast

        style={{

          color: "var(--season-primary, #2563eb)",

          fontSize: "22px",

        }}

      />

    </div>

    <div

      style={{

        minWidth: 0,

      }}

    >

      <h2

        style={{

          margin: 0,

          color: "#111827",

          fontSize:

            isMobile

              ? "17px"

              : "19px",

          fontWeight: "800",

          overflow: "hidden",

          textOverflow: "ellipsis",

          whiteSpace: "nowrap",

        }}

      >

        {order.customerName}

      </h2>

      <p

        style={{

          marginTop: "4px",

          marginBottom: 0,

          color: "#64748B",

          fontSize: "13px",

          fontWeight: "500",

        }}

      >

        {order.phone}

      </p>

    </div>

  </div>

  <div

    style={{

      background: "color-mix(in srgb, var(--season-primary, #2563eb) 14%, white)",

      color: "var(--season-primary, #2563eb)",

      padding: "8px 14px",

      borderRadius: "999px",

      fontSize: "12px",

      fontWeight: "800",

      display: "flex",

      alignItems: "center",

      gap: "6px",

      border:

        "1px solid color-mix(in srgb, var(--season-primary, #2563eb) 22%, white)",

    }}

  >

    <FaShippingFast />

    En livraison

  </div>

</div>

          {/* PRODUITS */}

{order.items.map(

  (item, index) => (

    <div
      className="konan-shipped-order-item"
      key={index}
      style={{

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        gap: "12px",

        padding: "12px 0",

        borderBottom:

          index !== order.items.length - 1

            ? "1px solid #F1F5F9"

            : "none",

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

              item.image?.includes("localhost:5000")

                ? item.image.replace(

                    "http://localhost:5000",

                    "https://konanshopping.com/api/"

                  )

                : item.image || "/logo.jpg"

            }

            alt={item.name}

            onError={(e) => {

              e.target.src = "/logo.jpg";

            }}

          style={{

            width: "60px",

            height: "60px",

            borderRadius: "12px",

            objectFit: "cover",

            flexShrink: 0,

          }}

        />

        <div

          style={{

            flex: 1,

            minWidth: 0,

          }}

        >

          <h3

            style={{

              margin: 0,

              color: "#111827",

              fontSize: "15px",

              fontWeight: "700",

              overflow: "hidden",

              textOverflow: "ellipsis",

              whiteSpace: "nowrap",

            }}

          >

            {item.name}

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

            Qté : {item.quantity}

          </div>

        </div>

      </div>

      {/* PRIX */}

      <div

        style={{

          color: "var(--season-primary, #2563eb)",

          fontWeight: "800",

          fontSize:

            isMobile

              ? "15px"

              : "16px",

          whiteSpace: "nowrap",

        }}

      >

        {item.price} FCFA

      </div>

    </div>

  )

)}

{/* FOOTER */}

<div

  style={{

    marginTop: "14px",

    paddingTop: "14px",

    borderTop: "1px solid #E5E7EB",

    display: "flex",

    justifyContent: "space-between",

    alignItems:

      isMobile

        ? "flex-start"

        : "center",

    flexDirection:

      isMobile

        ? "column"

        : "row",

    gap: "12px",

  }}

>

  {/* ADRESSE */}

  <div

    style={{

      display: "flex",

      alignItems: "center",

      gap: "8px",

      color: "#64748B",

      fontSize: "13px",

      fontWeight: "600",

    }}

  >

    <FaMapMarkerAlt

      style={{

        color: "var(--season-primary, #2563eb)",

      }}

    />

    {order.city}

  </div>

  {/* TOTAL */}

  <div

    style={{

      textAlign:

        isMobile

          ? "left"

          : "right",

    }}

  >

    <div

      style={{

        display: "flex",

        alignItems: "center",

        gap: "6px",

        color: "#64748B",

        fontSize: "12px",

        fontWeight: "600",

        justifyContent:

          isMobile

            ? "flex-start"

            : "flex-end",

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

        margin: "4px 0 0 0",

        color: "#111827",

        fontSize:

          isMobile

            ? "20px"

            : "24px",

        fontWeight: "900",

      }}

    >

      {order.total} FCFA

    </h2>

  </div>

</div>

</div>

))}

      <style>{`
        .konan-shipped-orders-page,
        .konan-shipped-orders-page *,
        .konan-shipped-orders-page *::before,
        .konan-shipped-orders-page *::after {
          box-sizing: border-box;
        }

        .konan-shipped-orders-page {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          padding:
            max(14px, env(safe-area-inset-top))
            max(14px, env(safe-area-inset-right))
            max(20px, env(safe-area-inset-bottom))
            max(14px, env(safe-area-inset-left));
          overflow-x: clip;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
          overscroll-behavior-x: none;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .konan-shipped-orders-page img {
          display: block;
          max-width: 100%;
        }

        .konan-shipped-order-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          overflow-wrap: anywhere;
        }

        .konan-shipped-order-card:focus-visible {
          outline: 3px solid rgba(37, 99, 235, .35);
          outline-offset: 3px;
        }

        .konan-shipped-order-item {
          min-width: 0;
        }

        .konan-shipped-orders-page h1,
        .konan-shipped-orders-page h2,
        .konan-shipped-orders-page h3,
        .konan-shipped-orders-page p {
          overflow-wrap: anywhere;
        }

        @media (max-width: 767px) {
          .konan-shipped-orders-page {
            padding:
              max(12px, env(safe-area-inset-top))
              max(12px, env(safe-area-inset-right))
              max(18px, env(safe-area-inset-bottom))
              max(12px, env(safe-area-inset-left));
          }

          .konan-shipped-order-card {
            border-radius: 16px !important;
          }

          .konan-shipped-order-item {
            flex-wrap: wrap;
            align-items: flex-start !important;
          }

          .konan-shipped-order-item > div:last-child {
            max-width: 100%;
            white-space: normal !important;
            overflow-wrap: anywhere;
          }
        }

        @media (max-width: 380px) {
          .konan-shipped-orders-page {
            padding-left: max(10px, env(safe-area-inset-left));
            padding-right: max(10px, env(safe-area-inset-right));
          }

          .konan-shipped-order-card {
            padding: 13px !important;
          }
        }

        @supports (height: 100dvh) {
          .konan-shipped-orders-page {
            min-height: 100dvh;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .konan-shipped-order-card {
            transition: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .konan-shipped-orders-page *,
          .konan-shipped-orders-page *::before,
          .konan-shipped-orders-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </div>

  );

}