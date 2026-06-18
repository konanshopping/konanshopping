import { useEffect, useState } from "react";

import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
  useMap,
  Circle,
} from "react-leaflet";

import {
  FaMoneyBillWave
} from "react-icons/fa";

import {
  FaTruck,
  FaMapMarkedAlt,
  FaMotorcycle,
  FaClock,
} from "react-icons/fa";

import {
  FaCity,
  FaLocationArrow,
} from "react-icons/fa";

import {
  FaRoute,
  FaChartLine,
  FaCheckCircle
} from "react-icons/fa";

import {
  FaPhoneAlt,
  FaBolt,
  FaCrown,
} from "react-icons/fa";

import {
  FaShoppingBag,
  FaCube,
} from "react-icons/fa";

import {
  FaMapMarkerAlt,
  FaMapPin,
} from "react-icons/fa";

import { FaCircle } from "react-icons/fa";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  useParams,
} from "react-router-dom";

// =========================
// LEAFLET FIX
// =========================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

});

// =========================
// DRIVER ICON
// =========================

const driverIcon =
  new L.Icon({

    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/854/854894.png",

    iconSize: [38, 38],

    iconAnchor: [19, 19],

  });

// =========================
// CUSTOMER ICON
// =========================

const customerIcon =
  new L.Icon({

    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/684/684908.png",

    iconSize: [40, 40],

    iconAnchor: [20, 20],

  });


// =========================
// RECENTER MAP
// =========================

function RecenterMap({
  position,
}) {

  const map = useMap();

  useEffect(() => {

    map.flyTo(
  position,
  window.innerWidth < 768
    ? 16
    : 15,
  {
    duration: 1.5,
  }
);

  }, [position]);

  return null;

}

// =========================
// DISTANCE GPS
// =========================

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =
    (lat2 - lat1) *
    Math.PI / 180;

  const dLon =
    (lon2 - lon1) *
    Math.PI / 180;

  const a =

    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +

    Math.cos(
      lat1 * Math.PI / 180
    ) *

    Math.cos(
      lat2 * Math.PI / 180
    ) *

    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;

}

// =========================
// COMPONENT
// =========================

export default function TrackOrder() {

  const { id } =
    useParams();

  // =========================
  // STATES
  // =========================

  const [position,
    setPosition] =
      useState([
        4.0511,
        9.7679,
      ]);

const [location, setLocation] =
  useState(null);

  const [order,
    setOrder] =
      useState(null);

  // =========================
  // CUSTOMER POSITION
  // =========================

  const customerPosition = [

    order?.location?.lat ||
      4.0511,

    order?.location?.lng ||
      9.7679,

  ];

  // =========================
  // FETCH ORDER
  // =========================

  useEffect(() => {

    const fetchOrder =
      async () => {

        try {

          const res =
            await axios.get(
              `https://konanshopping-production.up.railway.app/order/${id}`
            );

          setOrder(
            res.data
          );

          if (
            res.data.driverLocation
          ) {

            setPosition([
              res.data
                .driverLocation.lat,

              res.data
                .driverLocation.lng,
            ]);

          }

        } catch (err) {

          console.log(err);

        }

      };

    fetchOrder();

    const interval =
      setInterval(
        fetchOrder,
        4000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [id]);


  // =========================
  // REAL DISTANCE
  // =========================

  const realDistance =
    calculateDistance(
      position[0],
      position[1],
      customerPosition[0],
      customerPosition[1]
    );

  // =========================
  // DISTANCE FORMAT
  // =========================

  const distance =
    `${realDistance.toFixed(
      1
    )} km`;


  // =========================
// ETA RÉEL DYNAMIQUE
// =========================

// vitesse dynamique du livreur

const liveSpeed =
  realDistance > 8
    ? 55
    : realDistance > 5
    ? 45
    : realDistance > 2
    ? 35
    : realDistance > 1
    ? 25
    : 12;

const realSpeed =
  `${liveSpeed} km/h`;

// =========================
// ETA RÉEL CORRIGÉ
// =========================

let estimatedTime = "";

if (realDistance <= 0.05) {

  estimatedTime = "0 min";

}

else {

  const estimatedMinutes =
    Math.round(
      (realDistance / liveSpeed) * 60
    );

  estimatedTime =
    estimatedMinutes <= 1
      ? "1 min"
      : estimatedMinutes < 60
      ? `${estimatedMinutes} min`
      : `${(
          estimatedMinutes / 60
        ).toFixed(1)} h`;

}

  // =========================
  // DELIVERY STATUS
  // =========================

 const deliveryStatus =
  order?.status ||
  "En attente";

  // =========================
  // PROGRESS
  // =========================

  const maxDistance = 10;

  const progress =
    Math.min(
      100,

      Math.max(
        0,

        (
          (
            maxDistance -
            realDistance
          ) /
          maxDistance
        ) * 100
      )

    ).toFixed(0);

  // =========================
  // STATUS COLOR
  // =========================

  const statusColor =

    realDistance > 5
      ? "#2563eb"

      : realDistance > 2
      ? "#16a34a"

      : realDistance > 0.3
      ? "#f59e0b"

      : "#22c55e";

  // =========================
  // LIVE STATUS
  // =========================

 const liveStatus =

  realDistance > 5
    ? "En livraison"

    : realDistance > 2
    ? "Arrivée proche"

    : realDistance > 0.3
    ? "Presque arrivé"

    : "Livré";

  if (!order) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >

      <div
        style={{
          width: "65px",
          height: "65px",
          borderRadius: "18px",
          background:
            "linear-gradient(135deg,#2563EB,#1D4ED8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: "26px",
          boxShadow:
            "0 10px 25px rgba(37,99,235,0.25)",
        }}
      >
        <FaTruck />
      </div>

      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "20px",
          fontWeight: "800",
        }}
      >
        Suivi de livraison
      </h2>

      <p
        style={{
          margin: 0,
          color: "#6B7280",
          fontSize: "14px",
        }}
      >
        Chargement des informations...
      </p>

    </div>

  );

}

return (

  <div
    style={{
      minHeight: "100vh",

      background:
  "linear-gradient(180deg,#FFFFFF,#F8FAFC)",

      padding:
        window.innerWidth < 768
          ? "10px"
          : "20px",

      width: "100%",

      maxWidth: "100vw",

      overflowX: "hidden",

      overflowY: "auto",

      boxSizing: "border-box",

      fontFamily:
        "'Inter', sans-serif",
    }}
  >
    {/* ========================= */}
{/* ULTRA PREMIUM HEADER */}
{/* ========================= */}

<div
  style={{
    background: "#FFFFFF",

    borderRadius: "22px",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "18px",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      window.innerWidth < 768
        ? "flex-start"
        : "center",

    flexWrap:
      window.innerWidth < 768
        ? "wrap"
        : "nowrap",

    gap: "14px",

    marginBottom: "16px",

    border:
      "1px solid #E5E7EB",

    boxShadow:
      "0 10px 30px rgba(15,23,42,0.06)",

    position: "relative",

    overflow: "hidden",
  }}
>

  {/* LIGHT EFFECT */}

  <div
    style={{
      position: "absolute",

      top: "-50px",

      right: "-50px",

      width: "140px",

      height: "140px",

      borderRadius: "50%",

      background:
        "rgba(37,99,235,0.06)",

      filter: "blur(35px)",
    }}
  />

  {/* LEFT */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "12px",

      flex: 1,

      minWidth: 0,

      zIndex: 2,
    }}
  >

    {/* LOGO */}

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "50px"
            : "58px",

        height:
          window.innerWidth < 768
            ? "50px"
            : "58px",

        borderRadius: "16px",

        overflow: "hidden",

        background:
          "linear-gradient(135deg,#2563EB,#1D4ED8)",

        padding: "2px",

        flexShrink: 0,

        boxShadow:
          "0 8px 20px rgba(37,99,235,0.20)",
      }}
    >

      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "14px",
          overflow: "hidden",
          background: "#FFFFFF",
        }}
      >

        <img
          src="/logo.jpg"
          alt="Konan Shopping"

          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

      </div>

    </div>

    {/* TEXT */}

    <div
      style={{
        minWidth: 0,
        flex: 1,
      }}
    >

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "8px",

          flexWrap: "wrap",
        }}
      >

        <h1
          style={{
            margin: 0,

            fontSize:
              window.innerWidth < 768
                ? "18px"
                : "22px",

            color: "#0F172A",

            fontWeight: "900",

            lineHeight: 1.2,
          }}
        >
          Suivi de Livraison
        </h1>

        <div
          style={{
            background:
              "linear-gradient(135deg,#22C55E,#16A34A)",

            color: "#FFFFFF",

            padding: "4px 8px",

            borderRadius: "999px",

            fontSize: "9px",

            fontWeight: "800",

            boxShadow:
              "0 4px 12px rgba(34,197,94,0.25)",
          }}
        >
          LIVE
        </div>

      </div>

      <p
        style={{
          margin: "4px 0 0 0",

          color: "#64748B",

          fontSize:
            window.innerWidth < 768
              ? "12px"
              : "13px",

          fontWeight: "500",
        }}
      >
        Suivi GPS en temps réel de votre commande
      </p>

    </div>

  </div>


     {/* STATUS */}

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "8px",

    marginTop: "6px",

    flexWrap: "wrap",
  }}
>

  <div
    style={{
      width: "10px",

      height: "10px",

      borderRadius: "50%",

      background: statusColor,

      boxShadow:
        `0 0 12px ${statusColor}`,

      flexShrink: 0,
    }}
  />

  <div
    style={{
      background:
        `${statusColor}15`,

      color: statusColor,

      padding: "4px 10px",

      borderRadius: "999px",

      fontSize:
        window.innerWidth < 768
          ? "10px"
          : "11px",

      fontWeight: "800",

      border:
        `1px solid ${statusColor}30`,
    }}
  >
    {deliveryStatus}
  </div>

</div>

</div>


  {/* ETA */}

<div
  style={{
    background:
      "linear-gradient(135deg,#2563EB,#1D4ED8)",

    borderRadius: "16px",

    padding:
      window.innerWidth < 768
        ? "10px 12px"
        : "12px 16px",

    color: "#FFFFFF",

    minWidth:
      window.innerWidth < 768
        ? "85px"
        : "110px",

    textAlign: "center",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.25)",

    flexShrink: 0,
  }}
>

  <p
    style={{
      margin: 0,

      fontSize:
        window.innerWidth < 768
          ? "9px"
          : "10px",

      opacity: 0.9,

      fontWeight: "700",

      textTransform: "uppercase",

      letterSpacing: "0.5px",
    }}
  >
    ETA
  </p>

  <h2
    style={{
      margin: 0,

      marginTop: "3px",

      fontSize:
        window.innerWidth < 768
          ? "18px"
          : "24px",

      fontWeight: "900",

      lineHeight: 1.1,
    }}
  >
    {estimatedTime}
  </h2>

  <p
    style={{
      margin: 0,

      marginTop: "2px",

      fontSize: "9px",

      opacity: 0.85,
    }}
  >
    Arrivée
  </p>

</div>

    {/* GPS */}

<div
  style={{
    background: "#FFFFFF",

    border: "1px solid #E2E8F0",

    borderRadius: "16px",

    padding:
      window.innerWidth < 768
        ? "10px"
        : "12px 14px",

    display: "flex",

    alignItems: "center",

    gap: "10px",

    minWidth:
      window.innerWidth < 768
        ? "120px"
        : "145px",

    boxShadow:
      "0 4px 12px rgba(15,23,42,0.04)",

    flexShrink: 0,
  }}
>

  {/* ICON */}

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "34px"
          : "38px",

      height:
        window.innerWidth < 768
          ? "34px"
          : "38px",

      borderRadius: "12px",

      background:
        "linear-gradient(135deg,#2563EB,#1D4ED8)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

      color: "#FFFFFF",

      flexShrink: 0,

      boxShadow:
        "0 6px 14px rgba(37,99,235,0.20)",
    }}
  >
    <FaMapMarkerAlt
      style={{
        fontSize:
          window.innerWidth < 768
            ? "13px"
            : "15px",
      }}
    />
  </div>

  {/* TEXT */}

  <div>

    <p
      style={{
        margin: 0,

        color: "#94A3B8",

        fontSize:
          window.innerWidth < 768
            ? "8px"
            : "9px",

        fontWeight: "700",

        letterSpacing: "0.5px",
      }}
    >
      GPS TRACKING
    </p>

    <h3
      style={{
        margin: 0,

        marginTop: "2px",

        color: "#0F172A",

        fontSize:
          window.innerWidth < 768
            ? "11px"
            : "13px",

        fontWeight: "900",

        lineHeight: 1.2,
      }}
    >
      {liveStatus}
    </h3>

  </div>

</div>


{/* ========================= */}
{/* PREMIUM MAIN GRID */}
{/* ========================= */}

<div
  style={{
    display: "grid",

    gridTemplateColumns: "1fr",

    gap:
      window.innerWidth < 768
        ? "14px"
        : "22px",

    width: "100%",

    maxWidth: "100%",

    overflow: "hidden",
  }}
>

  {/* ========================= */}
  {/* MAP CONTAINER */}
  {/* ========================= */}

  <div
    style={{
      background:
        "linear-gradient(180deg,#FFFFFF,#F8FAFC)",

      borderRadius:
        window.innerWidth < 768
          ? "24px"
          : "32px",

      overflow: "hidden",

      position: "relative",

      width: "100%",

     minHeight:
  window.innerWidth < 768
    ? "75vh"
    : "100vh",

height: "auto",

      border:
        "1px solid #E5E7EB",

      boxShadow:
        "0 12px 40px rgba(15,23,42,0.08)",

      transition:
        "all .3s ease",
    }}
  >

    {/* LIVE BADGE */}

<div
  style={{
    position: "absolute",

    top:
      window.innerWidth < 768
        ? "14px"
        : "24px",

    right:
      window.innerWidth < 768
        ? "14px"
        : "24px",

    zIndex: 999,

    background:
      "linear-gradient(135deg,#2563EB,#1D4ED8)",

    padding:
      window.innerWidth < 768
        ? "8px 12px"
        : "12px 18px",

    borderRadius: "999px",

    color: "#FFFFFF",

    fontWeight: "800",

    display: "flex",

    alignItems: "center",

    gap: "8px",

    fontSize:
      window.innerWidth < 768
        ? "11px"
        : "13px",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.25)",

    border:
      "1px solid rgba(255,255,255,0.2)",

    backdropFilter: "blur(10px)",

    maxWidth:
      window.innerWidth < 768
        ? "160px"
        : "220px",
  }}
>

  <FaCircle
    style={{
      color: "#22C55E",

      fontSize:
        window.innerWidth < 768
          ? "8px"
          : "10px",

      filter:
        "drop-shadow(0 0 8px rgba(34,197,94,0.9))",

      flexShrink: 0,
    }}
  />

  <span
    style={{
      whiteSpace: "nowrap",

      overflow: "hidden",

      textOverflow: "ellipsis",
    }}
  >
    {liveStatus}
  </span>

</div>



  {/* DESTINATION */}

<div
  style={{
    marginTop: "16px",

    background:
      "linear-gradient(180deg,#F8FAFC,#F1F5F9)",

    borderRadius: "18px",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "18px",

    border:
      "1px solid #E2E8F0",

    boxShadow:
      "0 4px 12px rgba(0,0,0,0.03)",
  }}
>

  {/* HEADER */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "8px",

      marginBottom: "10px",
    }}
  >

    <div
      style={{
        width: "30px",

        height: "30px",

        borderRadius: "10px",

        background:
          "#DBEAFE",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        color: "#2563EB",
      }}
    >
      <FaMapMarkerAlt />
    </div>

    <p
      style={{
        margin: 0,

        color: "#64748B",

        fontSize: "11px",

        fontWeight: "800",

        textTransform:
          "uppercase",

        letterSpacing: "1px",
      }}
    >
      Adresse de livraison
    </p>

  </div>

  {/* ADRESSE */}

  <h3
    style={{
      margin: 0,

      color: "#0F172A",

      fontSize:
        window.innerWidth < 768
          ? "12px"
          : "16px",

      fontWeight: "900",

      lineHeight: "24px",
    }}
  >
    {order?.address}
  </h3>

  {/* VILLE + QUARTIER */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "10px",

      flexWrap: "wrap",

      marginTop: "12px",
    }}
  >

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "6px",

        color: "#64748B",

        fontSize: "12px",

        fontWeight: "700",
      }}
    >
      <FaCity
        style={{
          color: "#2563EB",
        }}
      />

      {order?.city}
    </div>

    <div
      style={{
        width: "5px",

        height: "5px",

        borderRadius: "50%",

        background: "#CBD5E1",
      }}
    />

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "6px",

        color: "#64748B",

        fontSize: "12px",

        fontWeight: "700",
      }}
    >
      <FaLocationArrow
        style={{
          color: "#2563EB",
        }}
      />

      {order?.district}
    </div>

  </div>

</div>

{/* ========================= */}
{/* PRODUITS COMMANDÉS */}
{/* ========================= */}

{order?.items?.map((item, index) => (

  <div
    key={index}
    style={{
      marginTop: index === 0 ? "16px" : "10px",

      background: "#FFFFFF",

      borderRadius: "14px",

      padding:
        window.innerWidth < 768
          ? "12px"
          : "14px",

      border: "1px solid #E2E8F0",

      display: "flex",

      alignItems: "center",

      gap: "10px",

      boxShadow:
        "0 4px 12px rgba(0,0,0,0.04)",
    }}
  >

    {/* IMAGE */}

    <img
      src={
        item?.image ||
        "https://via.placeholder.com/80"
      }
      alt="product"
      style={{
        width:
          window.innerWidth < 768
            ? "58px"
            : "72px",

        height:
          window.innerWidth < 768
            ? "58px"
            : "72px",

        borderRadius: "14px",

        objectFit: "cover",

        border:
          "1px solid #E2E8F0",

        flexShrink: 0,
      }}
    />

    {/* INFOS */}

    <div
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "6px",
        }}
      >

        <FaShoppingBag
          style={{
            color: "#2563EB",
            fontSize: "12px",
          }}
        />

        <p
          style={{
            margin: 0,
            color: "#64748B",
            fontSize: "11px",
            fontWeight: "800",
            textTransform:
              "uppercase",
          }}
        >
          Produit {index + 1}
        </p>

      </div>

      <h3
        style={{
          margin: 0,
          color: "#0F172A",
          fontSize:
            window.innerWidth < 768
              ? "13px"
              : "15px",
          fontWeight: "900",
        }}
      >
        {item?.name}
      </h3>

{/* PRIX */}

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "6px",

    marginTop: "8px",

    color: "#16A34A",

    fontSize:
      window.innerWidth < 768
        ? "13px"
        : "14px",

    fontWeight: "900",
  }}
>

  <FaMoneyBillWave
    style={{
      color: "#16A34A",
      fontSize: "12px",
    }}
  />

  <span>
    {item?.price?.toLocaleString?.() ||
      0} FCFA
  </span>

</div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "10px",
          background:
            "#EEF2FF",
          color: "#2563EB",
          padding: "6px 10px",
          borderRadius: "999px",
          fontSize: "11px",
          fontWeight: "800",
        }}
      >

        <FaCube />

        Quantité :
        {" "}
        x{item?.quantity}

      </div>

    </div>

  </div>

))}

  {/* STATS */}

  <div
    style={{
      display: "grid",

      gridTemplateColumns:
        "1fr 1fr",

      gap: "12px",

      marginTop: "16px",
    }}
  >

   {/* ETA */}

<div
  style={{
    background:
      "linear-gradient(135deg,#2563EB,#1D4ED8)",

    borderRadius: "18px",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "18px",

    color: "#FFFFFF",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.25)",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    minHeight:
      window.innerWidth < 768
        ? "85px"
        : "120px",
  }}
>

  {/* HEADER */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "8px",

      marginBottom: "8px",
    }}
  >

    <FaClock
      style={{
        fontSize:
          window.innerWidth < 768
            ? "14px"
            : "16px",

        opacity: 0.9,
      }}
    />

    <p
      style={{
        margin: 0,

        fontSize:
          window.innerWidth < 768
            ? "11px"
            : "12px",

        fontWeight: "800",

        textTransform:
          "uppercase",

        opacity: 0.9,

        letterSpacing: "0.5px",
      }}
    >
      Temps estimé
    </p>

  </div>

  {/* TEMPS */}

  <h2
    style={{
      margin: 0,

      fontSize:
        window.innerWidth < 768
          ? "24px"
          : "30px",

      fontWeight: "900",

      lineHeight: 1.1,
    }}
  >
    {estimatedTime}
  </h2>

  {/* DESCRIPTION */}

  <p
    style={{
      marginTop: "6px",

      marginBottom: 0,

      fontSize:
        window.innerWidth < 768
          ? "11px"
          : "12px",

      opacity: 0.85,

      fontWeight: "600",
    }}
  >
    Heure d'arrivée estimée
  </p>

</div>

{/* DISTANCE */}

<div
  style={{
    background: "#FFFFFF",

    borderRadius: "18px",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "18px",

    border:
      "1px solid #E2E8F0",

    boxShadow:
      "0 8px 20px rgba(15,23,42,0.05)",

    minHeight:
      window.innerWidth < 768
        ? "100px"
        : "120px",
  }}
>

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "8px",

      marginBottom: "8px",
    }}
  >

    <FaRoute
      style={{
        color: "#2563EB",

        fontSize:
          window.innerWidth < 768
            ? "14px"
            : "16px",
      }}
    />

    <p
      style={{
        margin: 0,

        color: "#64748B",

        fontSize:
          window.innerWidth < 768
            ? "11px"
            : "12px",

        fontWeight: "800",

        textTransform:
          "uppercase",
      }}
    >
      Distance
    </p>

  </div>

  <h2
    style={{
      margin: 0,

      color: "#0F172A",

      fontSize:
        window.innerWidth < 768
          ? "24px"
          : "30px",

      fontWeight: "900",
    }}
  >
    {distance}
  </h2>

  <p
    style={{
      marginTop: "6px",

      marginBottom: 0,

      color: "#64748B",

      fontSize:
        window.innerWidth < 768
          ? "11px"
          : "12px",

      fontWeight: "600",
    }}
  >
    Distance restante
  </p>

</div>

</div>

{/* PROGRESSION */}

<div
  style={{
    marginTop: "18px",

    background: "#FFFFFF",

    borderRadius: "18px",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "18px",

    border:
      "1px solid #E2E8F0",

    boxShadow:
      "0 8px 20px rgba(15,23,42,0.04)",
  }}
>

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: "12px",
    }}
  >

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "8px",
      }}
    >

      <FaChartLine
        style={{
          color: "#2563EB",
        }}
      />

      <span
        style={{
          color: "#475569",

          fontSize: "12px",

          fontWeight: "800",
        }}
      >
        Progression
      </span>

    </div>

    <span
      style={{
        color: "#2563EB",

        fontWeight: "900",

        fontSize: "13px",
      }}
    >
      {progress}%
    </span>

  </div>

  <div
    style={{
      width: "100%",

      height: "10px",

      background: "#E2E8F0",

      borderRadius: "999px",

      overflow: "hidden",
    }}
  >

    <div
      style={{
        width: `${progress}%`,

        height: "100%",

        background:
          "linear-gradient(90deg,#2563EB,#3B82F6)",

        borderRadius: "999px",

        transition:
          "all .5s ease",
      }}
    />

  </div>

</div>

{/* ========================= */}
{/* MAP */}
{/* ========================= */}

<MapContainer
  center={position}
  zoom={15}
  zoomControl={false}
  style={{
    width: "100%",

    height: "100%",

    minHeight:
      window.innerWidth < 768
        ? "50vh"
        : "70vh",

    zIndex: 2,

    borderRadius:
      window.innerWidth < 768
        ? "20px"
        : "30px",
  }}

  whenCreated={(map) => {

    map.on("click", (e) => {

      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });

      console.log(e.latlng);

    });

  }}

>

  {/* RECENTER */}

  <RecenterMap
    position={position}
  />

  {/* ZOOM */}

  <ZoomControl
    position="bottomright"
  />

  {/* MAP TILE */}

  <TileLayer
    attribution="&copy; MapTiler & OpenStreetMap contributors"

    url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=9JxhpJjsI1LkjTuEYlOC"
  />

  {/* ROUTE GLOW */}

  <Polyline
    positions={[
      position,
      customerPosition,
    ]}

    pathOptions={{
      color: "#93C5FD",

      weight:
        window.innerWidth < 768
          ? 12
          : 18,

      opacity: 0.22,

      lineCap: "round",

      lineJoin: "round",
    }}
  />

  {/* MAIN ROUTE */}

<Polyline
  positions={[
    position,
    customerPosition,
  ]}

  pathOptions={{
    color: "#2563EB",

    weight:
      window.innerWidth < 768
        ? 5
        : 7,

    opacity: 1,

    lineCap: "round",

    lineJoin: "round",

    dashArray:
      realDistance > 1
        ? null
        : "12,8",
  }}
/>

{/* DRIVER GLOW */}

<Circle
  center={position}

  radius={
    window.innerWidth < 768
      ? 120
      : 180
  }

  pathOptions={{
    color: "#2563EB",

    fillColor: "#2563EB",

    fillOpacity: 0.15,

    weight: 2,
  }}
/>

{/* CLIENT GLOW */}

<Circle
  center={customerPosition}

  radius={
    window.innerWidth < 768
      ? 120
      : 180
  }

  pathOptions={{
    color: "#EF4444",

    fillColor: "#EF4444",

    fillOpacity: 0.15,

    weight: 2,
  }}
/>

{/* DRIVER */}

<Marker
  position={position}
  icon={driverIcon}
>

  <Popup>

    <div
      style={{
        minWidth:
          window.innerWidth < 768
            ? "180px"
            : "220px",

        fontFamily:
          "Inter, sans-serif",
      }}
    >

{/* DRIVER HEADER */}

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "12px",
  }}
>

  {/* PHOTO */}

  <div
    style={{
      position: "relative",
    }}
  >

    <img
      src={
        order?.driver?.photo ||
        "https://randomuser.me/api/portraits/men/32.jpg"
      }

      alt="Livreur"

      style={{
        width: "56px",

        height: "56px",

        borderRadius: "50%",

        objectFit: "cover",

        border:
          "3px solid #DBEAFE",

        boxShadow:
          "0 4px 12px rgba(37,99,235,0.15)",
      }}
    />

    {/* ONLINE */}

    <div
      style={{
        position: "absolute",

        right: "2px",

        bottom: "2px",

        width: "14px",

        height: "14px",

        borderRadius: "50%",

        background: "#22C55E",

        border:
          "2px solid #FFFFFF",
      }}
    />

  </div>

  {/* INFOS */}

  <div
    style={{
      flex: 1,
    }}
  >

    <h3
      style={{
        margin: 0,

        color: "#0F172A",

        fontSize: "16px",

        fontWeight: "900",
      }}
    >
      {
        order?.driver?.name ||
        "Konan Delivery"
      }
    </h3>

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "6px",

        marginTop: "4px",
      }}
    >

      <FaCheckCircle
        style={{
          color: statusColor,

          fontSize: "12px",
        }}
      />

      <span
        style={{
          color: statusColor,

          fontWeight: "700",

          fontSize: "12px",
        }}
      >
        {deliveryStatus}
      </span>

    </div>

  </div>

</div>

{/* INFOS */}

<div
  style={{
    marginTop: "14px",

    paddingTop: "14px",

    borderTop:
      "1px solid #E5E7EB",
  }}
>

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "8px",

      marginBottom: "10px",

      color: "#475569",

      fontSize: "13px",

      fontWeight: "700",
    }}
  >

    <FaRoute
      style={{
        color: "#2563EB",
      }}
    />

    <span>
      Distance :
    </span>

    <strong>
      {distance}
    </strong>

  </div>

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "8px",

      marginBottom: "10px",

      color: "#475569",

      fontSize: "13px",

      fontWeight: "700",
    }}
  >

    <FaClock
      style={{
        color: "#2563EB",
      }}
    />

    <span>
      ETA :
    </span>

    <strong>
      {estimatedTime}
    </strong>

  </div>

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "8px",

      color: "#475569",

      fontSize: "13px",

      fontWeight: "700",
    }}
  >

    <FaMotorcycle
      style={{
        color: "#2563EB",
      }}
    />

    <strong>
      {realSpeed}
    </strong>

  </div>

</div>

</div>

</Popup>

</Marker>

  {/* CLIENT */}

<Marker
  position={customerPosition}
  icon={customerIcon}
>

  <Popup>

    <div
      style={{
        minWidth:
          window.innerWidth < 768
            ? "180px"
            : "230px",

        fontFamily:
          "Inter, sans-serif",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",

          marginBottom: "12px",
        }}
      >

        <div
          style={{
            width: "42px",

            height: "42px",

            borderRadius: "12px",

            background:
              "#DBEAFE",

            display: "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            color: "#2563EB",
          }}
        >
          <FaMapMarkerAlt />
        </div>

        <div>

          <h3
            style={{
              margin: 0,

              color: "#0F172A",

              fontSize: "15px",

              fontWeight: "900",
            }}
          >
            Destination Client
          </h3>

          <p
            style={{
              margin: 0,

              color: "#64748B",

              fontSize: "11px",

              marginTop: "2px",
            }}
          >
            Adresse de livraison
          </p>

        </div>

      </div>

      {/* ADRESSE */}

      <div
        style={{
          background:
            "#F8FAFC",

          border:
            "1px solid #E2E8F0",

          borderRadius: "14px",

          padding: "12px",
        }}
      >

        <div
          style={{
            display: "flex",

            alignItems: "flex-start",

            gap: "8px",
          }}
        >

          <FaLocationArrow
            style={{
              color: "#2563EB",

              marginTop: "3px",

              flexShrink: 0,
            }}
          />

          <p
            style={{
              margin: 0,

              color: "#334155",

              fontSize: "13px",

              fontWeight: "700",

              lineHeight: "20px",
            }}
          >
            {order?.address}
          </p>

        </div>

      </div>

      {/* QUARTIER */}

      <div
        style={{
          marginTop: "10px",

          display: "flex",

          alignItems: "center",

          gap: "8px",
        }}
      >

        <FaMapPin
          style={{
            color: "#EF4444",
          }}
        />

        <span
          style={{
            color: "#64748B",

            fontSize: "12px",

            fontWeight: "700",
          }}
        >
          {order?.district}
        </span>

      </div>

    </div>

  </Popup>

</Marker>

</MapContainer>

</div>

</div>

</div>


);

}