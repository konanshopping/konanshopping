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
      "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",

    iconSize: [44, 44],

    iconAnchor: [22, 22],

  });

// =========================
// CUSTOMER ICON
// =========================

const customerIcon =
  new L.Icon({

    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/684/684908.png",

    iconSize: [46, 46],

    iconAnchor: [23, 23],

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
      15,
      {
        duration: 2,
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

const [location, setLocation] = useState(null)

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

  estimatedTime = "Arrivé";

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
    ? "EN LIVRAISON"

    : realDistance > 2
    ? "ARRIVÉE PROCHE"

    : realDistance > 0.3
    ? "PRESQUE ARRIVÉ"

    : "LIVRÉ";

  if (!order) {

    return (
      <div>
        Chargement...
      </div>
    );

  }

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "#f4f4f7",

        padding: "12px",

        fontFamily:
          "'Inter', sans-serif",
      }}
    > 
    {/* ========================= */}
{/* ULTRA PREMIUM HEADER */}
{/* ========================= */}

<div
  style={{
    background:
      "rgba(255,255,255,0.92)",

    backdropFilter:
      "blur(16px)",

    borderRadius: "20px",

    padding: "12px 18px",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: "14px",

    border:
      "1px solid rgba(255,255,255,0.4)",

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
        "rgba(91,61,245,0.08)",

      filter: "blur(35px)",
    }}
  />

  {/* LEFT */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "12px",

      zIndex: 2,
    }}
  >

    {/* LOGO */}

    <div
      style={{
        width: "52px",

        height: "52px",

        borderRadius: "16px",

        overflow: "hidden",

        background:
          "linear-gradient(135deg,#5b3df5,#7c4dff)",

        padding: "2px",

        boxShadow:
          "0 8px 22px rgba(91,61,245,0.22)",
      }}
    >

      <div
        style={{
          width: "100%",

          height: "100%",

          borderRadius: "14px",

          overflow: "hidden",

          background: "white",
        }}
      >

        <img
          src="/logo.jpg"

          alt="logo"

          style={{
            width: "100%",

            height: "100%",

            objectFit: "cover",
          }}
        />

      </div>

    </div>

    {/* TEXT */}

    <div>

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "8px",
        }}
      >

        <h1
          style={{
            margin: 0,

            fontSize: "21px",

            color: "#0f172a",

            fontWeight: "900",
          }}
        >
          Livraison Live
        </h1>

        {/* LIVE */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#22c55e,#16a34a)",

            color: "white",

            padding:
              "4px 8px",

            borderRadius:
              "999px",

            fontSize: "8px",

            fontWeight: "800",

            boxShadow:
              "0 4px 12px rgba(34,197,94,0.25)",
          }}
        >
          LIVE
        </div>

      </div>

      {/* STATUS */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "6px",

          marginTop: "6px",
        }}
      >

        <div
          style={{
            width: "8px",

            height: "8px",

            borderRadius:
              "50%",

            background:
              statusColor,

            boxShadow:
              `0 0 12px ${statusColor}`,

            animation:
              "pulse 1.5s infinite",
          }}
        />

        <p
          style={{
            margin: 0,

            color: "#64748b",

            fontSize: "12px",

            fontWeight: "600",
          }}
        >
          {deliveryStatus}
        </p>

      </div>

    </div>

  </div>

  {/* RIGHT */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "10px",

      zIndex: 2,
    }}
  >

    {/* ETA */}

    <div
      style={{
        background:
          "linear-gradient(135deg,#5b3df5,#7c4dff)",

        borderRadius: "16px",

        padding: "10px 14px",

        color: "white",

        minWidth: "95px",

        textAlign: "center",

        boxShadow:
          "0 10px 25px rgba(91,61,245,0.28)",
      }}
    >

      <p
        style={{
          margin: 0,

          fontSize: "9px",

          opacity: 0.85,

          fontWeight: "700",
        }}
      >
        Temps estimé
      </p>

      <h1
        style={{
          margin: 0,

          marginTop: "2px",

          fontSize: "22px",

          fontWeight: "900",
        }}
      >
        {estimatedTime}
      </h1>

    </div>

    {/* GPS */}

    <div
      style={{
        background:
          "#f8fafc",

        border:
          "1px solid #e2e8f0",

        borderRadius: "14px",

        padding: "8px 12px",

        display: "flex",

        alignItems: "center",

        gap: "8px",
      }}
    >

      <div
        style={{
          width: "30px",

          height: "30px",

          borderRadius:
            "10px",

          background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          color: "white",

          fontSize: "14px",
        }}
      >
        📍
      </div>

      <div>

        <p
          style={{
            margin: 0,

            color: "#64748b",

            fontSize: "9px",

            fontWeight: "600",
          }}
        >
          GPS TRACKING
        </p>

        <h3
          style={{
            margin: 0,

            marginTop: "1px",

            color: "#0f172a",

            fontSize: "12px",

            fontWeight: "800",
          }}
        >
          {liveStatus}
        </h3>

      </div>

    </div>

  </div>

</div>

{/* ========================= */}
{/* PREMIUM MAIN GRID */}
{/* ========================= */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "1fr",

    gap: "22px",

    width: "100%",
  }}
>

  {/* ========================= */}
  {/* MAP CONTAINER */}
  {/* ========================= */}

  <div
    style={{
      background:
        "linear-gradient(180deg,#ffffff,#f8fafc)",

      borderRadius: "36px",

      overflow: "hidden",

      position: "relative",

      width: "100%",

      height: "100vh",

      border:
        "1px solid rgba(255,255,255,0.45)",

      boxShadow:
        `
        0 25px 80px rgba(15,23,42,0.16),
        0 8px 30px rgba(91,61,245,0.08)
        `,
    }}
  >

    {/* LIVE BADGE */}

    <div
      style={{
        position: "absolute",

        top: "24px",

        right: "24px",

        zIndex: 999,

        background:
          "linear-gradient(135deg,#5b3df5,#2563eb)",

        padding: "14px 22px",

        borderRadius: "999px",

        color: "white",

        fontWeight: "900",

        display: "flex",

        alignItems: "center",

        gap: "12px",

        fontSize: "13px",

        boxShadow:
          "0 18px 40px rgba(91,61,245,0.38)",
      }}
    >

      <div
        style={{
          width: "11px",

          height: "11px",

          borderRadius: "50%",

          background: "#22c55e",

          boxShadow:
            "0 0 18px rgba(34,197,94,0.95)",

          animation:
            "pulse 1.6s infinite",
        }}
      />

      {liveStatus}

    </div>

{/* ========================= */}
{/* DELIVERY GLASS CARD */}
{/* ========================= */}

<div
  style={{
    position: "absolute",

    top: "28px",

    left: "28px",

    zIndex: 999,

    width: "280px",

    background:
      "rgba(255,255,255,0.88)",

    backdropFilter:
      "blur(30px)",

    WebkitBackdropFilter:
      "blur(30px)",

    borderRadius: "30px",

    padding: "18px",

    border:
      "1px solid rgba(255,255,255,0.65)",

    boxShadow:
      `
      0 35px 80px rgba(15,23,42,0.18),
      0 10px 25px rgba(91,61,245,0.10)
      `,

    overflow: "hidden",
  }}
>

  {/* LIGHT EFFECT */}

  <div
    style={{
      position: "absolute",

      top: "-120px",

      right: "-80px",

      width: "220px",

      height: "220px",

      borderRadius: "50%",

      background:
        "radial-gradient(circle,rgba(91,61,245,0.18),transparent 70%)",
    }}
  />

  {/* HEADER */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "14px",

      position: "relative",

      zIndex: 2,
    }}
  >

    {/* PHOTO */}

    <div
      style={{
        position: "relative",
      }}
    >

      <img
        src={order?.driver?.photo}

        alt=""

        style={{
          width: "60px",

          height: "60px",

          borderRadius: "50%",

          objectFit: "cover",

          border:
            "4px solid rgba(255,255,255,0.9)",

          boxShadow:
            `
            0 15px 35px rgba(91,61,245,0.20),
            0 5px 12px rgba(0,0,0,0.08)
            `,
        }}
      />

      {/* ONLINE */}

      <div
        style={{
          width: "16px",

          height: "16px",

          borderRadius: "50%",

          background: "#22c55e",

          position: "absolute",

          right: "2px",

          bottom: "4px",

          border:
            "3px solid white",

          boxShadow:
            "0 0 20px rgba(34,197,94,0.9)",
        }}
      />

    </div>

    {/* INFOS */}

    <div>

      <h2
        style={{
          margin: 0,

          color: "#0f172a",

          fontSize: "18px",

          fontWeight: "900",

          lineHeight: "24px",
        }}
      >
        {
         order?.driver?.name
        }
      </h2>

      {/* STATUS */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "8px",

          marginTop: "8px",
        }}
      >

        <div
          style={{
            width: "8px",

            height: "8px",

            borderRadius: "50%",

            background:
              statusColor,

            boxShadow:
              `0 0 14px ${statusColor}`,
          }}
        />

        <span
          style={{
            color:
              statusColor,

            fontWeight: "800",

            fontSize: "11px",
          }}
        >
          {deliveryStatus}
        </span>

      </div>

      {/* PHONE */}

      <p
        style={{
          marginTop: "6px",

          color: "#64748b",

          fontSize: "11px",

          fontWeight: "700",
        }}
      >
        📞 {
          order?.driver?.phone
        }
      </p>

      {/* VEHICLE */}

      <p
        style={{
          marginTop: "4px",

          color: "#64748b",

          fontSize: "11px",

          fontWeight: "700",
        }}
      >
 🛵 {order?.assignedDriver?.vehicle}

        

        {" • "}

        ⚡ {realSpeed}
      </p>

    </div>

  </div>

  {/* BADGES */}

  <div
    style={{
      marginTop: "16px",

      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      gap: "8px",
    }}
  >

    <div
      style={{
        background:
          "linear-gradient(135deg,#eef2ff,#dbeafe)",

        color: "#2563eb",

        padding:
          "7px 12px",

        borderRadius:
          "999px",

        fontSize: "9px",

        fontWeight: "900",
      }}
    >
      🚀 Premium
    </div>

    <div
      style={{
        background:
          "#ecfdf5",

        color: "#15803d",

        padding:
          "7px 12px",

        borderRadius:
          "999px",

        fontSize: "9px",

        fontWeight: "900",
      }}
    >
      GPS LIVE
    </div>

  </div>

  {/* DESTINATION */}

  <div
    style={{
      marginTop: "18px",

      background:
        "linear-gradient(180deg,#f8fafc,#f1f5f9)",

      borderRadius:
        "20px",

      padding:
        "16px",

      border:
        "1px solid #eef2f7",
    }}
  >

    <p
      style={{
        margin: 0,

        color: "#64748b",

        fontSize: "9px",

        fontWeight: "900",

        letterSpacing: "1px",
      }}
    >
      votre position
    </p>

    <h3
      style={{
        marginTop: "8px",

        marginBottom: 0,

        color: "#0f172a",

        fontSize: "17px",

        fontWeight: "900",

        lineHeight: "24px",
      }}
    >
      {
        order?.address 
        
      }
    </h3>

    <p
      style={{
        marginTop: "8px",

        marginBottom: 0,

        color: "#64748b",

        fontSize: "11px",

        fontWeight: "700",
      }}
    >
      🏙️ {
        order?.city 
        
      }

      {" • "}

      📌 {
        order?.district 
        
      }
    </p>

  </div>

  {/* ========================= */}
  {/* PRODUIT */}
  {/* ========================= */}

  <div
    style={{
      marginTop: "16px",

      background:
        "rgba(248,250,252,0.95)",

      borderRadius: "18px",

      padding: "12px",

      border:
        "1px solid #eef2f7",

      display: "flex",

      alignItems: "center",

      gap: "10px",
    }}
  >

    {/* IMAGE */}

    <img
      src={
  order?.items?.[0]?.image ||
  "https://via.placeholder.com/80"
}

      alt="product"

      style={{
        width: "52px",

        height: "52px",

        borderRadius: "14px",

        objectFit: "cover",

        border:
          "1px solid #e2e8f0",
      }}
    />

    {/* INFOS */}

    <div
      style={{
        flex: 1,
      }}
    >

      <p
        style={{
          margin: 0,

          color: "#64748b",

          fontSize: "9px",

          fontWeight: "800",
        }}
      >
        Commande
      </p>

      <h3
        style={{
          marginTop: "4px",

          marginBottom: 0,

          color: "#0f172a",

          fontSize: "13px",

          fontWeight: "900",

          lineHeight: "18px",
        }}
      >
        {
         order?.product?.title ||
order?.product?.name ||
order?.items?.[0]?.name
        }
      </h3>

      <p
        style={{
          marginTop: "6px",

          marginBottom: 0,

          color: "#5b3df5",

          fontSize: "11px",

          fontWeight: "800",
        }}
      >
        Quantité :
        {" "}
        x{
          order?.items?.[0]?.quantity
        }
      </p>

    </div>

  </div>

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
          "linear-gradient(135deg,#5b3df5,#7c4dff)",

        borderRadius:
          "20px",

        padding:
          "16px",

        color: "white",

        boxShadow:
          "0 18px 35px rgba(91,61,245,0.30)",
      }}
    >

      <p
        style={{
          margin: 0,

          fontSize: "9px",

          opacity: 0.9,

          fontWeight: "900",
        }}
      >
        ETA
      </p>

      <h2
        style={{
          marginTop: "8px",

          marginBottom: 0,

          fontSize: "22px",

          fontWeight: "900",
        }}
      >
        {estimatedTime}
      </h2>

      <p
        style={{
          marginTop: "4px",

          marginBottom: 0,

          fontSize: "10px",

          opacity: 0.9,
        }}
      >
        Arrivée
      </p>

    </div>

    {/* DISTANCE */}

    <div
      style={{
        background:
          "#ffffff",

        borderRadius:
          "20px",

        padding:
          "16px",

        border:
          "1px solid #eef2f7",

        boxShadow:
          "0 12px 25px rgba(15,23,42,0.05)",
      }}
    >

      <p
        style={{
          margin: 0,

          color: "#64748b",

          fontSize: "9px",

          fontWeight: "900",
        }}
      >
        DISTANCE
      </p>

      <h2
        style={{
          marginTop: "8px",

          marginBottom: 0,

          color: "#0f172a",

          fontSize: "22px",

          fontWeight: "900",
        }}
      >
        {distance}
      </h2>

      <p
        style={{
          marginTop: "4px",

          marginBottom: 0,

          fontSize: "10px",

          color: "#64748b",
        }}
      >
        Restant
      </p>

    </div>

  </div>

  {/* PROGRESS */}

  <div
    style={{
      marginTop: "16px",
    }}
  >

    <div
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        marginBottom: "8px",
      }}
    >

      <span
        style={{
          color: "#64748b",

          fontSize: "11px",

          fontWeight: "700",
        }}
      >
        Progression
      </span>

      <span
        style={{
          color: "#5b3df5",

          fontWeight: "900",

          fontSize: "11px",
        }}
      >
        {progress}%
      </span>

    </div>

    <div
      style={{
        width: "100%",

        height: "8px",

        background:
          "#e5e7eb",

        borderRadius:
          "999px",

        overflow:
          "hidden",
      }}
    >

      <div
        style={{
          width: `${progress}%`,

          height: "100%",

          background:
            "linear-gradient(90deg,#5b3df5,#7c4dff,#2563eb)",

          borderRadius:
            "999px",

          transition:
            "all 0.5s ease",
        }}
      />

    </div>

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
    zIndex: 2,
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
    attribution='&copy; MapTiler & OpenStreetMap contributors'

    url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=9JxhpJjsI1LkjTuEYlOC"
  />

  {/* ROUTE GLOW */}

  <Polyline
    positions={[
      position,
      customerPosition,
    ]}

    pathOptions={{
      color: "#60a5fa",

      weight: 18,

      opacity: 0.18,

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
      color: "#2563eb",

      weight: 6,

      opacity: 1,

      lineCap: "round",

      lineJoin: "round",
    }}
  />

  {/* DRIVER GLOW */}

  <Circle
    center={position}

    radius={180}

    pathOptions={{
      color: "#5b3df5",

      fillColor: "#5b3df5",

      fillOpacity: 0.18,
    }}
  />

  {/* CLIENT GLOW */}

  <Circle
    center={customerPosition}

    radius={180}

    pathOptions={{
      color: "#ef4444",

      fillColor: "#ef4444",

      fillOpacity: 0.18,
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
          minWidth: "220px",
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

          <img
            src={
              order?.driver?.photo ||
              "https://randomuser.me/api/portraits/men/32.jpg"
            }

            alt=""

            style={{
              width: "52px",

              height: "52px",

              borderRadius: "50%",

              objectFit: "cover",
            }}
          />

          <div>

            <h3
              style={{
                margin: 0,

                color: "#111827",

                fontSize: "16px",

                fontWeight: "900",
              }}
            >
              {
                order?.driver?.name ||
                "Konan Delivery"
              }
            </h3>

            <p
              style={{
                margin: 0,

                marginTop: "4px",

                color:
                  statusColor,

                fontWeight: "700",

                fontSize: "12px",
              }}
            >
              {deliveryStatus}
            </p>

          </div>

        </div>

        {/* INFOS */}

        <div
          style={{
            marginTop: "14px",

            paddingTop: "14px",

            borderTop:
              "1px solid #e5e7eb",
          }}
        >

          <p
            style={{
              margin: 0,

              color: "#64748b",

              fontSize: "13px",
            }}
          >
            📍 Distance :
            {" "}
            <strong>
              {distance}
            </strong>
          </p>

          <p
            style={{
              marginTop: "8px",

              marginBottom: 0,

              color: "#64748b",

              fontSize: "13px",
            }}
          >
            ⏱ ETA :
            {" "}
            <strong>
              {estimatedTime}
            </strong>
          </p>

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
          minWidth: "220px",
        }}
      >

        <h3
          style={{
            margin: 0,

            color: "#111827",

            fontSize: "16px",

            fontWeight: "900",
          }}
        >
          📍 Destination Client
        </h3>

        <p
          style={{
            marginTop: "10px",

            marginBottom: "4px",

            color: "#374151",

            fontWeight: "600",
          }}
        >
          {order?.address}
        </p>

        <span
          style={{
            color: "#6b7280",

            fontSize: "12px",
          }}
        >
          {order?.district}
        </span>

      </div>

    </Popup>

  </Marker>

</MapContainer>

</div>

</div>

</div>

);

}
