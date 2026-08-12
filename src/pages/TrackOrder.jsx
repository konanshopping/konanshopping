import { useEffect, useMemo, useState } from "react";
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
  FaTruck,
  FaMotorcycle,
  FaClock,
  FaRoute,
  FaChartLine,
  FaCheckCircle,
  FaPhoneAlt,
  FaSignal,
  FaBoxOpen,
  FaTimesCircle,
  FaCircle,
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaSatelliteDish,
} from "react-icons/fa";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { useParams } from "react-router-dom";


// ======================================================
// 🌐 API
// ======================================================

const API = "https://konanshopping.com";


// ======================================================
// 📍 LEAFLET FIX
// ======================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// ======================================================
// 🚚 DRIVER ICON
// ======================================================

const driverIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/854/854894.png",

  iconSize: [42, 42],

  iconAnchor: [21, 21],

  popupAnchor: [0, -20],
});


// ======================================================
// 📍 CUSTOMER ICON
// ======================================================

const customerIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",

  iconSize: [40, 40],

  iconAnchor: [20, 40],

  popupAnchor: [0, -40],
});


// ======================================================
// 🗺️ RECENTER MAP
// ======================================================

function RecenterMap({ position }) {

  const map = useMap();

  useEffect(() => {

    if (
      !position ||
      position.length !== 2
    ) {
      return;
    }

    map.flyTo(
      position,
      window.innerWidth < 768 ? 16 : 15,
      {
        duration: 1.2,
      }
    );

  }, [map, position]);

  return null;
}


// ======================================================
// 📏 DISTANCE GPS
// ======================================================

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =
    (lat2 - lat1) *
    Math.PI /
    180;

  const dLon =
    (lon2 - lon1) *
    Math.PI /
    180;

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


// ======================================================
// 🚚 TRACK ORDER
// ======================================================

export default function TrackOrder() {

  const { id } = useParams();


  // ====================================================
  // 📦 ORDER
  // ====================================================

  const [
    order,
    setOrder
  ] = useState(null);


  // ====================================================
  // 📍 DRIVER POSITION
  // ====================================================

  const [
    driverPosition,
    setDriverPosition
  ] = useState(null);


  // ====================================================
  // 🔄 LOADING
  // ====================================================

  const [
    loading,
    setLoading
  ] = useState(true);


  // ====================================================
  // ❌ ERROR
  // ====================================================

  const [
    error,
    setError
  ] = useState("");


  // ====================================================
  // 🕐 LAST GPS UPDATE
  // ====================================================

  const [
    lastGpsUpdate,
    setLastGpsUpdate
  ] = useState(null);


  // ====================================================
  // 📡 GPS LIVE
  // ====================================================

  const [
    gpsOnline,
    setGpsOnline
  ] = useState(false);


  // ====================================================
  // 📍 CUSTOMER POSITION
  // ====================================================

  const customerPosition = useMemo(() => {

    const lat =
      Number(order?.location?.lat);

    const lng =
      Number(order?.location?.lng);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {

      return [
        lat,
        lng
      ];

    }

    return [
      4.0511,
      9.7679
    ];

  }, [order]);


  // ====================================================
  // 📦 FETCH ORDER
  // ====================================================

  useEffect(() => {

    let mounted = true;

    const fetchOrder = async () => {

      try {

        const res =
          await axios.get(
            `${API}/api/order/${id}`
          );

        if (!mounted) {
          return;
        }

        const data = res.data;

        setOrder(data);

        setError("");


        // ==========================================
        // 📍 DRIVER LOCATION
        // ==========================================

        const gps =
          data?.driverLocation;

        if (
          gps &&
          Number.isFinite(
            Number(gps.lat)
          ) &&
          Number.isFinite(
            Number(gps.lng)
          )
        ) {

          setDriverPosition([
            Number(gps.lat),
            Number(gps.lng)
          ]);

          setLastGpsUpdate(
            gps.updatedAt || null
          );


          // ======================================
          // 📡 GPS LIVE
          // ======================================

          if (gps.updatedAt) {

            const age =
              Date.now() -
              new Date(
                gps.updatedAt
              ).getTime();

            setGpsOnline(
              age < 30000
            );

          } else {

            setGpsOnline(true);

          }

        } else {

          setDriverPosition(null);

          setGpsOnline(false);

          setLastGpsUpdate(null);

        }

      } catch (err) {

        console.error(
          "❌ TRACK ORDER ERROR:",
          err
        );

        if (mounted) {

          setError(
            "Impossible de récupérer le suivi de cette commande."
          );

        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };


    // ============================================
    // PREMIER CHARGEMENT
    // ============================================

    fetchOrder();


    // ============================================
    // 🔄 GPS LIVE
    // ============================================

    const interval =
      setInterval(
        fetchOrder,
        3000
      );


    return () => {

      mounted = false;

      clearInterval(interval);

    };

  }, [id]);


  // ====================================================
  // 🚚 ASSIGNED DRIVER
  // ====================================================

  const assignedDriver =
    order?.assignedDriver || null;


  // ====================================================
  // 📏 DISTANCE
  // ====================================================

  const realDistance = useMemo(() => {

    if (!driverPosition) {
      return null;
    }

    return calculateDistance(
      driverPosition[0],
      driverPosition[1],
      customerPosition[0],
      customerPosition[1]
    );

  }, [
    driverPosition,
    customerPosition
  ]);


  // ====================================================
  // 🚗 SPEED ESTIMATION
  // ====================================================

  const liveSpeed = useMemo(() => {

    if (realDistance === null) {
      return 0;
    }

    if (realDistance > 8) {
      return 55;
    }

    if (realDistance > 5) {
      return 45;
    }

    if (realDistance > 2) {
      return 35;
    }

    if (realDistance > 1) {
      return 25;
    }

    return 12;

  }, [realDistance]);


  // ====================================================
  // ⏱️ ETA
  // ====================================================

  const estimatedTime = useMemo(() => {

    if (realDistance === null) {
      return "--";
    }

    if (realDistance <= 0.05) {
      return "Arrivé";
    }

    const minutes =
      Math.round(
        (realDistance / liveSpeed) * 60
      );

    if (minutes <= 1) {
      return "1 min";
    }

    if (minutes < 60) {
      return `${minutes} min`;
    }

    return `${(
      minutes / 60
    ).toFixed(1)} h`;

  }, [
    realDistance,
    liveSpeed
  ]);


  // ====================================================
  // 📊 DISTANCE TEXT
  // ====================================================

  const distanceText =
    realDistance === null
      ? "--"
      : `${realDistance.toFixed(1)} km`;


  // ====================================================
  // 📈 PROGRESS
  // ====================================================

  const progress = useMemo(() => {

    if (realDistance === null) {
      return 0;
    }

    const maxDistance = 10;

    return Math.min(
      100,
      Math.max(
        0,
        (
          (maxDistance - realDistance) /
          maxDistance
        ) * 100
      )
    );

  }, [realDistance]);


  // ====================================================
  // 🎨 STATUS
  // ====================================================

  const statusInfo = useMemo(() => {

    switch (order?.status) {

      case "Livrée":

        return {
          label: "Livrée",
          color: "#16A34A",
          bg: "#DCFCE7",
        };


      case "Annulée":

        return {
          label: "Annulée",
          color: "#DC2626",
          bg: "#FEE2E2",
        };


      case "En livraison":

        return {
          label: "En livraison",
          color: "#2563EB",
          bg: "#DBEAFE",
        };


      case "Préparation":

        return {
          label: "Préparation",
          color: "#D97706",
          bg: "#FEF3C7",
        };


      case "Confirmée":

        return {
          label: "Confirmée",
          color: "#7C3AED",
          bg: "#EDE9FE",
        };


      default:

        return {
          label:
            order?.status ||
            "En attente",

          color: "#64748B",

          bg: "#F1F5F9",
        };

    }

  }, [order?.status]);


  // ====================================================
  // 📡 GPS STATUS
  // ====================================================

  const gpsStatus =
    order?.status !== "En livraison"
      ? "GPS en attente"
      : gpsOnline
        ? "GPS en direct"
        : "GPS hors ligne";


  // ====================================================
  // 🕐 GPS TIME
  // ====================================================

  const gpsTime = useMemo(() => {

    if (!lastGpsUpdate) {
      return "";
    }

    const date =
      new Date(lastGpsUpdate);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleTimeString(
      "fr-FR",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );

  }, [lastGpsUpdate]);


  // ====================================================
  // ⏳ LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "14px",
          background: "#F8FAFC",
          fontFamily: "'Inter',sans-serif",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >

        <div
          style={{
            width: "62px",
            height: "62px",
            borderRadius: "18px",
            background:
              "linear-gradient(135deg,#2563EB,#1D4ED8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: "25px",
            boxShadow:
              "0 12px 30px rgba(37,99,235,.25)",
          }}
        >
          <FaTruck />
        </div>

        <strong
          style={{
            color: "#0F172A",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          Chargement du suivi...
        </strong>

      </div>

    );

  }


  // ====================================================
  // ❌ ERROR
  // ====================================================

  if (error || !order) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          background: "#F8FAFC",
          fontFamily: "'Inter',sans-serif",
          boxSizing: "border-box",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "30px",
            textAlign: "center",
            boxShadow:
              "0 15px 40px rgba(15,23,42,.08)",
            border:
              "1px solid #E2E8F0",
          }}
        >

          <FaTimesCircle
            style={{
              color: "#EF4444",
              fontSize: "42px",
              marginBottom: "15px",
            }}
          />

          <h2
            style={{
              margin: 0,
              color: "#0F172A",
            }}
          >
            Suivi indisponible
          </h2>

          <p
            style={{
              color: "#64748B",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            {error ||
              "Cette commande est introuvable."}
          </p>

        </div>

      </div>

    );

  }


  // ====================================================
  // 🖥️ INTERFACE
  // ====================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        background:
          "linear-gradient(180deg,#FFFFFF,#F8FAFC)",
        padding:
          window.innerWidth < 768
            ? "10px"
            : "20px",
        boxSizing: "border-box",
        fontFamily:
          "'Inter',sans-serif",
      }}
    >


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          padding:
            window.innerWidth < 768
              ? "13px"
              : "18px",
          marginBottom: "14px",
          border:
            "1px solid #E5E7EB",
          boxShadow:
            "0 10px 30px rgba(15,23,42,.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
            minWidth: 0,
            flex: 1,
          }}
        >

          <div
            style={{
              width:
                window.innerWidth < 768
                  ? "48px"
                  : "56px",

              height:
                window.innerWidth < 768
                  ? "48px"
                  : "56px",

              borderRadius: "15px",

              background:
                "linear-gradient(135deg,#2563EB,#1D4ED8)",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              color: "#FFFFFF",

              fontSize:
                window.innerWidth < 768
                  ? "20px"
                  : "23px",

              flexShrink: 0,

              boxShadow:
                "0 8px 20px rgba(37,99,235,.2)",
            }}
          >
            <FaTruck />
          </div>


          <div
            style={{
              minWidth: 0,
            }}
          >

            <h1
              style={{
                margin: 0,
                color: "#0F172A",
                fontSize:
                  window.innerWidth < 768
                    ? "17px"
                    : "22px",
                fontWeight: "900",
                lineHeight: 1.2,
              }}
            >
              Suivi de livraison
            </h1>

            <p
              style={{
                margin: "4px 0 0",
                color: "#64748B",
                fontSize:
                  window.innerWidth < 768
                    ? "10px"
                    : "12px",
              }}
            >
              Commande #
              {String(order._id).slice(-8)}
            </p>

          </div>

        </div>


        {/* STATUS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            background: statusInfo.bg,
            color: statusInfo.color,
            border:
              `1px solid ${statusInfo.color}30`,
            padding: "7px 11px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "900",
            flexShrink: 0,
          }}
        >

          <FaCircle
            style={{
              fontSize: "6px",
            }}
          />

          {statusInfo.label}

        </div>

      </div>


      {/* ================================================= */}
      {/* DRIVER CARD */}
      {/* ================================================= */}

      {assignedDriver && (

        <div
          style={{
            background:
              "linear-gradient(135deg,#EFF6FF,#FFFFFF)",
            border:
              "1px solid #BFDBFE",
            borderRadius: "18px",
            padding:
              window.innerWidth < 768
                ? "12px"
                : "16px",
            marginBottom: "14px",
            boxShadow:
              "0 8px 22px rgba(37,99,235,.08)",
          }}
        >

          {/* HEADER LIVREUR */}

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
                flexShrink: 0,
              }}
            >

              <img
                src={
                  assignedDriver.photo ||
                  "/logo.jpg"
                }
                alt={
                  assignedDriver.name ||
                  "Livreur"
                }
                onError={(e) => {
                  e.currentTarget.src =
                    "/logo.jpg";
                }}
                style={{
                  width:
                    window.innerWidth < 768
                      ? "58px"
                      : "68px",
                  height:
                    window.innerWidth < 768
                      ? "58px"
                      : "68px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border:
                    "3px solid #DBEAFE",
                  boxShadow:
                    "0 8px 20px rgba(37,99,235,.15)",
                }}
              />

              <span
                style={{
                  position: "absolute",
                  right: "2px",
                  bottom: "2px",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background:
                    gpsOnline
                      ? "#22C55E"
                      : "#94A3B8",
                  border:
                    "2px solid white",
                }}
              />

            </div>


            {/* NOM */}

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >

              <div
                style={{
                  color: "#64748B",
                  fontSize: "9px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: ".7px",
                }}
              >
                Votre livreur
              </div>

              <h2
                style={{
                  margin: "3px 0",
                  color: "#0F172A",
                  fontSize:
                    window.innerWidth < 768
                      ? "17px"
                      : "20px",
                  fontWeight: "900",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {assignedDriver.name ||
                  "Livreur Konan"}
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color:
                    gpsOnline
                      ? "#16A34A"
                      : "#64748B",
                  fontSize: "10px",
                  fontWeight: "800",
                }}
              >

                <FaSignal />

                {gpsOnline
                  ? "GPS en direct"
                  : "GPS hors ligne"}

              </div>

            </div>

          </div>


          {/* INFORMATIONS */}

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                window.innerWidth < 600
                  ? "1fr 1fr"
                  : "repeat(3,1fr)",

              gap: "8px",

              marginTop: "13px",
            }}
          >

            {/* TELEPHONE */}

            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                padding: "10px",
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "8px",
                  fontWeight: "800",
                }}
              >
                <FaPhoneAlt /> TÉLÉPHONE
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#0F172A",
                  fontSize: "11px",
                  fontWeight: "900",
                }}
              >
                {assignedDriver.phone ||
                  "Non renseigné"}
              </div>

            </div>


            {/* VEHICULE */}

            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                padding: "10px",
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "8px",
                  fontWeight: "800",
                }}
              >
                <FaMotorcycle /> VÉHICULE
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#0F172A",
                  fontSize: "11px",
                  fontWeight: "900",
                  textTransform: "capitalize",
                }}
              >
                {assignedDriver.vehicle ||
                  "Non renseigné"}
              </div>

            </div>


            {/* PLAQUE */}

            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "12px",
                padding: "10px",
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <div
                style={{
                  color: "#94A3B8",
                  fontSize: "8px",
                  fontWeight: "800",
                }}
              >
                <FaTruck /> PLAQUE
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#0F172A",
                  fontSize: "11px",
                  fontWeight: "900",
                }}
              >
                {assignedDriver.plate ||
                  "Non renseignée"}
              </div>

            </div>

          </div>


          {/* APPELER */}

          {assignedDriver.phone && (

            <a
              href={`tel:${assignedDriver.phone}`}
              style={{
                marginTop: "10px",
                width: "100%",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
                background:
                  "linear-gradient(135deg,#16A34A,#22C55E)",
                color: "#FFFFFF",
                padding: "11px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "900",
                boxShadow:
                  "0 8px 18px rgba(22,163,74,.18)",
              }}
            >

              <FaPhoneAlt />

              Appeler le livreur

            </a>

          )}

        </div>

      )}


      {/* ================================================= */}
      {/* NO DRIVER */}
      {/* ================================================= */}

      {!assignedDriver &&
        order.status !== "Livrée" && (

        <div
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "18px",
            padding: "14px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#64748B",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >

          <FaBoxOpen
            style={{
              color: "#2563EB",
              fontSize: "20px",
            }}
          />

          Votre commande est en attente
          d'un livreur.

        </div>

      )}


      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(3,1fr)",

          gap:
            window.innerWidth < 768
              ? "8px"
              : "12px",

          marginBottom: "14px",
        }}
      >

        {/* ETA */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#2563EB,#1D4ED8)",
            color: "#FFFFFF",
            borderRadius: "16px",
            padding:
              window.innerWidth < 768
                ? "11px"
                : "15px",
            boxShadow:
              "0 9px 22px rgba(37,99,235,.18)",
          }}
        >

          <FaClock
            style={{
              fontSize: "12px",
            }}
          />

          <div
            style={{
              marginTop: "5px",
              fontSize:
                window.innerWidth < 768
                  ? "17px"
                  : "23px",
              fontWeight: "900",
            }}
          >
            {estimatedTime}
          </div>

          <div
            style={{
              marginTop: "2px",
              fontSize: "8px",
              opacity: .8,
              fontWeight: "700",
            }}
          >
            ETA
          </div>

        </div>


        {/* DISTANCE */}

        <div
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "16px",
            padding:
              window.innerWidth < 768
                ? "11px"
                : "15px",
          }}
        >

          <FaRoute
            style={{
              color: "#2563EB",
              fontSize: "12px",
            }}
          />

          <div
            style={{
              marginTop: "5px",
              color: "#0F172A",
              fontSize:
                window.innerWidth < 768
                  ? "17px"
                  : "23px",
              fontWeight: "900",
            }}
          >
            {distanceText}
          </div>

          <div
            style={{
              marginTop: "2px",
              color: "#64748B",
              fontSize: "8px",
              fontWeight: "700",
            }}
          >
            Distance
          </div>

        </div>


        {/* SPEED */}

        <div
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "16px",
            padding:
              window.innerWidth < 768
                ? "11px"
                : "15px",
          }}
        >

          <FaMotorcycle
            style={{
              color: "#7C3AED",
              fontSize: "12px",
            }}
          />

          <div
            style={{
              marginTop: "5px",
              color: "#0F172A",
              fontSize:
                window.innerWidth < 768
                  ? "17px"
                  : "23px",
              fontWeight: "900",
            }}
          >
            {liveSpeed || "--"}
          </div>

          <div
            style={{
              marginTop: "2px",
              color: "#64748B",
              fontSize: "8px",
              fontWeight: "700",
            }}
          >
            km/h
          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* MAP */}
      {/* ================================================= */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius:
            window.innerWidth < 768
              ? "20px"
              : "28px",
          overflow: "hidden",
          border:
            "1px solid #E2E8F0",
          boxShadow:
            "0 12px 35px rgba(15,23,42,.08)",
          position: "relative",
        }}
      >

        {/* GPS BADGE */}

        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#0F172A",
            color: "#FFFFFF",
            padding: "7px 10px",
            borderRadius: "999px",
            fontSize: "9px",
            fontWeight: "900",
            boxShadow:
              "0 6px 18px rgba(15,23,42,.2)",
          }}
        >

          <FaCircle
            style={{
              color:
                gpsOnline
                  ? "#22C55E"
                  : "#94A3B8",
              fontSize: "6px",
            }}
          />

          {gpsOnline
            ? "GPS EN DIRECT"
            : "GPS EN ATTENTE"}

        </div>


        <MapContainer
          center={
            driverPosition ||
            customerPosition
          }

          zoom={
            window.innerWidth < 768
              ? 15
              : 14
          }

          zoomControl={false}

          style={{
            width: "100%",
            height:
              window.innerWidth < 768
                ? "58vh"
                : "72vh",
            minHeight: "430px",
          }}
        >

          <RecenterMap
            position={
              driverPosition ||
              customerPosition
            }
          />

          <ZoomControl
            position="bottomright"
          />


          {/* MAP */}

          <TileLayer
            attribution="
              &copy; OpenStreetMap contributors
            "
            url="
              https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=9JxhpJjsI1LkjTuEYlOC
            "
          />


          {/* ROUTE */}

          {driverPosition && (

            <>

              <Polyline
                positions={[
                  driverPosition,
                  customerPosition,
                ]}
                pathOptions={{
                  color: "#60A5FA",
                  weight:
                    window.innerWidth < 768
                      ? 12
                      : 18,
                  opacity: .20,
                  lineCap: "round",
                }}
              />


              <Polyline
                positions={[
                  driverPosition,
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
                }}
              />

            </>

          )}


          {/* DRIVER AREA */}

          {driverPosition && (

            <Circle
              center={driverPosition}
              radius={
                window.innerWidth < 768
                  ? 100
                  : 160
              }
              pathOptions={{
                color: "#2563EB",
                fillColor: "#2563EB",
                fillOpacity: .12,
                weight: 2,
              }}
            />

          )}


          {/* DRIVER */}

          {driverPosition && (

            <Marker
              position={driverPosition}
              icon={driverIcon}
            >

              <Popup>

                <div
                  style={{
                    minWidth: "210px",
                    fontFamily:
                      "Inter,sans-serif",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >

                    <img
                      src={
                        assignedDriver?.photo ||
                        "/logo.jpg"
                      }
                      alt="Livreur"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/logo.jpg";
                      }}
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border:
                          "3px solid #DBEAFE",
                      }}
                    />

                    <div>

                      <strong
                        style={{
                          color: "#0F172A",
                          fontSize: "15px",
                        }}
                      >
                        {assignedDriver?.name ||
                          "Livreur Konan"}
                      </strong>

                      <div
                        style={{
                          color: "#16A34A",
                          fontSize: "11px",
                          fontWeight: "800",
                          marginTop: "3px",
                        }}
                      >

                        <FaCheckCircle />

                        {" "}
                        En livraison

                      </div>

                    </div>

                  </div>


                  <div
                    style={{
                      marginTop: "12px",
                      paddingTop: "10px",
                      borderTop:
                        "1px solid #E2E8F0",
                      color: "#475569",
                      fontSize: "12px",
                      lineHeight: "1.8",
                    }}
                  >

                    📞{" "}
                    {assignedDriver?.phone ||
                      "Téléphone non renseigné"}

                    <br />

                    🏍️{" "}
                    {assignedDriver?.vehicle ||
                      "Véhicule non renseigné"}

                    <br />

                    🔢{" "}
                    {assignedDriver?.plate ||
                      "Plaque non renseignée"}

                    <br />

                    📍 Distance :
                    {" "}
                    <strong>
                      {distanceText}
                    </strong>

                    <br />

                    ⏱️ ETA :
                    {" "}
                    <strong>
                      {estimatedTime}
                    </strong>

                  </div>

                </div>

              </Popup>

            </Marker>

          )}


          {/* CUSTOMER */}

          <Marker
            position={customerPosition}
            icon={customerIcon}
          >

            <Popup>

              <div
                style={{
                  minWidth: "200px",
                  fontFamily:
                    "Inter,sans-serif",
                }}
              >

                <strong
                  style={{
                    color: "#0F172A",
                    fontSize: "15px",
                  }}
                >
                  📍 Destination
                </strong>

                <p
                  style={{
                    color: "#64748B",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    marginBottom: "5px",
                  }}
                >
                  {order.address ||
                    "Adresse de livraison"}
                </p>

                <div
                  style={{
                    color: "#64748B",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >

                  {order.city}
                  {" • "}
                  {order.district}

                </div>

              </div>

            </Popup>

          </Marker>

        </MapContainer>

      </div>


      {/* ================================================= */}
      {/* PROGRESS */}
      {/* ================================================= */}

      {order.status ===
        "En livraison" && (

        <div
          style={{
            marginTop: "14px",
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "18px",
            padding:
              window.innerWidth < 768
                ? "13px"
                : "17px",
            boxShadow:
              "0 8px 20px rgba(15,23,42,.04)",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "9px",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#475569",
                fontSize: "11px",
                fontWeight: "800",
              }}
            >

              <FaChartLine
                style={{
                  color: "#2563EB",
                }}
              />

              Progression

            </div>

            <strong
              style={{
                color: "#2563EB",
                fontSize: "12px",
              }}
            >
              {Math.round(progress)}%
            </strong>

          </div>


          <div
            style={{
              height: "9px",
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
                  "width .5s ease",
              }}
            />

          </div>


          {gpsTime && (

            <div
              style={{
                marginTop: "8px",
                color: "#94A3B8",
                fontSize: "9px",
                textAlign: "right",
              }}
            >

              Dernière position :
              {" "}
              {gpsTime}

            </div>

          )}

        </div>

      )}


      {/* ================================================= */}
      {/* ✅ DELIVERY COMPLETED */}
      {/* ================================================= */}

      {order.status ===
        "Livrée" && (

        <div
          style={{
            marginTop: "14px",
            background:
              "linear-gradient(135deg,#DCFCE7,#F0FDF4)",
            border:
              "1px solid #86EFAC",
            borderRadius: "18px",
            padding: "16px",
            boxShadow:
              "0 8px 20px rgba(22,163,74,.08)",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            <FaCheckCircle
              style={{
                color: "#16A34A",
                fontSize: "25px",
                flexShrink: 0,
              }}
            />

            <div>

              <div
                style={{
                  color: "#166534",
                  fontSize: "16px",
                  fontWeight: "900",
                }}
              >
                Commande livrée
              </div>

              <div
                style={{
                  color: "#15803D",
                  fontSize: "11px",
                  marginTop: "3px",
                }}
              >
                Votre commande a été livrée
                avec succès.
              </div>

            </div>

          </div>


          {/* LIVREUR QUI A LIVRÉ */}

          {assignedDriver && (

            <div
              style={{
                marginTop: "13px",
                paddingTop: "12px",
                borderTop:
                  "1px solid #BBF7D0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >

              <img
                src={
                  assignedDriver.photo ||
                  "/logo.jpg"
                }
                alt="Livreur"
                onError={(e) => {
                  e.currentTarget.src =
                    "/logo.jpg";
                }}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border:
                    "2px solid #86EFAC",
                }}
              />

              <div>

                <div
                  style={{
                    color: "#166534",
                    fontSize: "9px",
                    fontWeight: "800",
                    textTransform:
                      "uppercase",
                  }}
                >
                  Livrée par
                </div>

                <strong
                  style={{
                    color: "#14532D",
                    fontSize: "14px",
                  }}
                >
                  {assignedDriver.name ||
                    "Livreur Konan"}
                </strong>

                <div
                  style={{
                    color: "#15803D",
                    fontSize: "10px",
                    marginTop: "3px",
                  }}
                >

                  {assignedDriver.vehicle ||
                    "Véhicule"}

                  {assignedDriver.plate
                    ? ` • ${assignedDriver.plate}`
                    : ""}

                </div>

              </div>

            </div>

          )}

        </div>

      )}


      {/* ================================================= */}
      {/* ❌ CANCELLED */}
      {/* ================================================= */}

      {order.status ===
        "Annulée" && (

        <div
          style={{
            marginTop: "14px",
            background: "#FEF2F2",
            border:
              "1px solid #FECACA",
            borderRadius: "18px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#991B1B",
            fontSize: "13px",
            fontWeight: "800",
          }}
        >

          <FaTimesCircle
            style={{
              fontSize: "22px",
            }}
          />

          Cette commande a été
          annulée.

        </div>

      )}

    </div>

  );

}