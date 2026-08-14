import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  FaShoppingBag,
  FaMap,
  FaShieldAlt,
  FaQrcode,
  FaCreditCard,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaHome,
  FaInfoCircle,
  FaBox,
  FaArrowLeft,
} from "react-icons/fa";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  QRCodeSVG,
} from "qrcode.react";


// ======================================================
// 🌐 API
// ======================================================

const API =
  "https://konanshopping.com";


// ======================================================
// 🧩 NORMALISER ID
// ======================================================

const normalizeId = (
  value
) => {

  if (!value) {
    return "";
  }

  if (
    typeof value === "object" &&
    value.$oid
  ) {

    return String(
      value.$oid
    );

  }

  return String(
    value
  );

};


// ======================================================
// 🖼️ URL IMAGE
// ======================================================

const getImageUrl = (
  value
) => {

  if (!value) {
    return "";
  }

  const url =
    String(
      value
    ).trim();

  if (!url) {
    return "";
  }

  if (
    url.startsWith(
      "https://"
    )
  ) {

    return url;

  }

  if (
    url.startsWith(
      "http://localhost:5000"
    )
  ) {

    return url.replace(
      "http://localhost:5000",
      API
    );

  }

  if (
    url.startsWith("/")
  ) {

    return `${API}${url}`;

  }

  return url;

};


// ======================================================
// 🗺️ LEAFLET
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
// 🚚 ICÔNE LIVREUR
// ======================================================

const driverIcon =
  new L.Icon({

    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/854/854894.png",

    iconSize: [
      44,
      44,
    ],

    iconAnchor: [
      22,
      22,
    ],

    popupAnchor: [
      0,
      -22,
    ],

  });


// ======================================================
// 📍 ICÔNE CLIENT
// ======================================================

const customerIcon =
  new L.Icon({

    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/684/684908.png",

    iconSize: [
      42,
      42,
    ],

    iconAnchor: [
      21,
      42,
    ],

    popupAnchor: [
      0,
      -42,
    ],

  });


// ======================================================
// 🗺️ RECENTER MAP
// ======================================================

function RecenterMap({
  position,
}) {

  const map =
    useMap();

  useEffect(() => {

    if (
      !position ||
      position.length !== 2
    ) {

      return;

    }

    map.flyTo(
      position,
      window.innerWidth < 768
        ? 15
        : 14,
      {
        duration: 1.2,
      }
    );

  }, [
    map,
    position,
  ]);

  return null;

}


// ======================================================
// 📏 CALCUL DISTANCE
// ======================================================

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =
    (
      lat2 - lat1
    ) *
    Math.PI /
    180;

  const dLon =
    (
      lon2 - lon1
    ) *
    Math.PI /
    180;

  const a =
    Math.sin(
      dLat / 2
    ) *
    Math.sin(
      dLat / 2
    ) +

    Math.cos(
      lat1 *
      Math.PI /
      180
    ) *

    Math.cos(
      lat2 *
      Math.PI /
      180
    ) *

    Math.sin(
      dLon / 2
    ) *
    Math.sin(
      dLon / 2
    );

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(
        1 - a
      )
    );

  return R * c;

}


// ======================================================
// 🚚 TRACK ORDER
// ======================================================

export default function TrackOrder() {

  const {
    id: routeId,
  } = useParams();

  const navigate =
    useNavigate();


  // ====================================================
  // 🆔 ID COMMANDE
  // ====================================================

  const orderId =
    normalizeId(
      routeId ||
      (() => {

        const parts =
          window.location.pathname
            .split("/")
            .filter(Boolean);

        const index =
          parts.indexOf(
            "track-order"
          );

        if (
          index >= 0 &&
          parts[index + 1]
        ) {

          return parts[
            index + 1
          ];

        }

        return "";

      })()
    );


  // ====================================================
  // 📦 COMMANDE
  // ====================================================

  const [
    order,
    setOrder,
  ] = useState(null);


  // ====================================================
  // 📍 POSITION LIVREUR
  // ====================================================

  const [
    driverPosition,
    setDriverPosition,
  ] = useState(null);


  // ====================================================
  // 🔄 LOADING
  // ====================================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  // ====================================================
  // ❌ ERROR
  // ====================================================

  const [
    error,
    setError,
  ] = useState("");


  // ====================================================
  // 📡 GPS ONLINE
  // ====================================================

  const [
    gpsOnline,
    setGpsOnline,
  ] = useState(false);


  // ====================================================
  // 🕐 LAST GPS
  // ====================================================

  const [
    lastGpsUpdate,
    setLastGpsUpdate,
  ] = useState(null);


  // ====================================================
  // 📱 MOBILE
  // ====================================================

  const [
    isMobile,
    setIsMobile,
  ] = useState(
    typeof window !== "undefined" &&
    window.innerWidth < 768
  );


  // ====================================================
  // 📱 RESPONSIVE
  // ====================================================

  useEffect(() => {

    const handleResize =
      () => {

        setIsMobile(
          window.innerWidth < 768
        );

      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  // ====================================================
  // 📦 CHARGER COMMANDE
  // ====================================================

  useEffect(() => {

    let mounted = true;

    const fetchOrder =
      async () => {

        if (
          !orderId ||
          orderId === "undefined" ||
          orderId === "null"
        ) {

          if (mounted) {

            setError(
              "Identifiant de commande manquant."
            );

            setLoading(
              false
            );

          }

          return;

        }

        try {

          const response =
            await axios.get(

              `${API}/api/order/${orderId}`,

              {
                timeout:
                  10000,
              }

            );


          if (!mounted) {
            return;
          }


          // =================================================
          // 📦 RÉPONSE BACKEND
          // =================================================

          const raw =
            response?.data;

          const data =
            raw?.order ||
            raw?.data ||
            raw;


          console.log(
            "======================================"
          );

          console.log(
            "📡 TRACK ORDER"
          );

          console.log(
            "🆔 ORDER ID :",
            orderId
          );

          console.log(
            "📦 ORDER :",
            data
          );

          console.log(
            "🚚 DRIVER :",
            data?.assignedDriver
          );

          console.log(
            "📍 DRIVER GPS :",
            data?.driverLocation
          );

          console.log(
            "📍 CLIENT GPS :",
            data?.location
          );

          console.log(
            "📊 STATUS :",
            data?.status
          );

          console.log(
            "======================================"
          );


          if (
            !data
          ) {

            throw new Error(
              "Commande introuvable."
            );

          }


          const normalizedOrder =
            {

              ...data,

              _id:
                data?._id ||
                data?.id ||
                orderId,

            };


          setOrder(
            normalizedOrder
          );

          setError("");


          // =================================================
          // 📍 GPS LIVREUR
          // =================================================

          const gps =
            normalizedOrder
              ?.driverLocation;


          const lat =
            Number(
              gps?.lat
            );

          const lng =
            Number(
              gps?.lng
            );


          if (
            Number.isFinite(
              lat
            ) &&
            Number.isFinite(
              lng
            )
          ) {

            setDriverPosition([
              lat,
              lng,
            ]);


            setLastGpsUpdate(
              gps?.updatedAt ||
              null
            );


            if (
              gps?.updatedAt
            ) {

              const updated =
                new Date(
                  gps.updatedAt
                ).getTime();

              const age =
                Date.now() -
                updated;

              setGpsOnline(
                Number.isFinite(
                  age
                ) &&
                age < 30000
              );

            } else {

              setGpsOnline(
                true
              );

            }

          } else {

            setDriverPosition(
              null
            );

            setGpsOnline(
              false
            );

            setLastGpsUpdate(
              null
            );

          }

        } catch (err) {

          console.error(
            "❌ TRACK ORDER ERROR:",
            err?.response?.data ||
            err
          );


          if (!mounted) {
            return;
          }


          setError(

            err?.response?.data
              ?.message ||

            err?.response?.data
              ?.error ||

            err?.message ||

            "Impossible de récupérer le suivi de cette commande."

          );

        } finally {

          if (mounted) {

            setLoading(
              false
            );

          }

        }

      };


    fetchOrder();


    // =================================================
    // 🔄 SYNCHRONISATION GPS
    // =================================================

    const interval =
      orderId
        ? setInterval(
            fetchOrder,
            3000
          )
        : null;


    return () => {

      mounted = false;

      if (interval) {

        clearInterval(
          interval
        );

      }

    };

  }, [
    orderId,
  ]);


  // ====================================================
  // 🚚 LIVREUR
  // ====================================================

  const assignedDriver =
    useMemo(() => {

      if (
        !order?.assignedDriver
      ) {

        return null;

      }


      const assigned =
        order.assignedDriver;


      if (
        typeof assigned ===
        "string"
      ) {

        return {

          id:
            assigned,

          name:
            "",

          phone:
            "",

          photo:
            "",

          vehicle:
            "",

          plate:
            "",

        };

      }


      return {

        id:
          normalizeId(
            assigned.id ||
            assigned._id
          ),

        name:
          assigned.name ||
          "",

        phone:
          assigned.phone ||
          "",

        photo:
          getImageUrl(
            assigned.photo
          ),

        vehicle:
          assigned.vehicle ||
          "",

        plate:
          assigned.plate ||
          "",

      };

    }, [
      order,
    ]);


  // ====================================================
  // 📍 POSITION CLIENT
  // ====================================================

  const customerPosition =
    useMemo(() => {

      const lat =
        Number(
          order?.location?.lat
        );

      const lng =
        Number(
          order?.location?.lng
        );


      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {

        return [
          lat,
          lng,
        ];

      }


      // IMPORTANT :
      // aucune position fictive.

      return null;

    }, [
      order,
    ]);


  // ====================================================
  // 📏 DISTANCE RÉELLE
  // ====================================================

  const realDistance =
    useMemo(() => {

      if (
        !driverPosition ||
        !customerPosition
      ) {

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
      customerPosition,
    ]);


  // ====================================================
  // 🏍️ VITESSE RÉELLE
  // ====================================================

  const liveSpeed =
    Number(
      order?.driverLocation?.speed ??
      order?.driverLocation?.speedKmh ??
      order?.driverSpeed ??
      0
    );


  // ====================================================
  // ⏱️ ETA
  // ====================================================

  const estimatedTime =
    useMemo(() => {

      if (
        realDistance === null
      ) {

        return "--";

      }


      if (
        realDistance <= 0.05
      ) {

        return "Arrivé";

      }


      if (
        !liveSpeed ||
        liveSpeed <= 0
      ) {

        return "--";

      }


      const minutes =
        Math.round(
          (
            realDistance /
            liveSpeed
          ) *
          60
        );


      if (
        minutes <= 1
      ) {

        return "1 min";

      }


      if (
        minutes < 60
      ) {

        return `${minutes} min`;

      }


      return `${(
        minutes / 60
      ).toFixed(1)} h`;

    }, [
      realDistance,
      liveSpeed,
    ]);


  // ====================================================
  // 📏 DISTANCE TEXTE
  // ====================================================

  const distanceText =
    realDistance === null
      ? "--"
      : `${realDistance.toFixed(1)} km`;


  // ====================================================
  // 📈 PROGRESSION
  // ====================================================

  const progress =
    useMemo(() => {

      if (
        realDistance === null
      ) {

        return 0;

      }


      return Math.min(
        95,
        Math.max(
          5,
          100 -
          realDistance * 8
        )
      );

    }, [
      realDistance,
    ]);


  // ====================================================
  // 🕐 GPS TIME
  // ====================================================

  const gpsTime =
    lastGpsUpdate
      ? new Date(
          lastGpsUpdate
        ).toLocaleTimeString(
          "fr-FR",
          {
            hour:
              "2-digit",
            minute:
              "2-digit",
            second:
              "2-digit",
          }
        )
      : null;


  // ====================================================
  // 🔐 QR
  // ====================================================

  const qrToken =
    order?.deliveryQrToken ||
    "";


  // ====================================================
  // 💰 PRODUITS TOTAL
  // ====================================================

  const productsTotal =
    useMemo(() => {

      if (
        !Array.isArray(
          order?.items
        )
      ) {

        return 0;

      }


      return order.items.reduce(
        (
          total,
          item
        ) => {

          return (
            total +
            (
              Number(
                item.price
              ) || 0
            ) *
            (
              Number(
                item.quantity
              ) || 0
            )
          );

        },
        0
      );

    }, [
      order?.items,
    ]);


  // ====================================================
  // 📋 RÉFÉRENCE
  // ====================================================

  const orderReference =
    order?._id
      ? `KS-${String(
          order._id
        ).slice(
          -8
        ).toUpperCase()}`
      : "KS";


  // ====================================================
  // 📊 STATUS
  // ====================================================

  const statusInfo =
    useMemo(() => {

      switch (
        order?.status
      ) {

        case "Livrée":

          return {

            color:
              "#16A34A",

            bg:
              "#DCFCE7",

            icon:
              <FaCheckCircle />,

            label:
              "Commande livrée",

          };


        case "En livraison":

          return {

            color:
              "#2563EB",

            bg:
              "#DBEAFE",

            icon:
              <FaTruck />,

            label:
              "En livraison",

          };


        case "Préparation":

          return {

            color:
              "#D97706",

            bg:
              "#FEF3C7",

            icon:
              <FaBox />,

            label:
              "Préparation",

          };


        case "Confirmée":

          return {

            color:
              "#7C3AED",

            bg:
              "#EDE9FE",

            icon:
              <FaCheckCircle />,

            label:
              "Commande confirmée",

          };


        default:

          return {

            color:
              "#64748B",

            bg:
              "#F1F5F9",

            icon:
              <FaClock />,

            label:
              "Commande en attente",

          };

      }

    }, [
      order?.status,
    ]);


  // ====================================================
  // ⏳ LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        className="track-loading"
      >

        <div
          className="loading-card"
        >

          <div
            className="loading-logo"
          >

            <FaTruck />

          </div>

          <h2>
            Suivi de votre commande
          </h2>

          <p>
            Récupération des informations...
          </p>

          <div
            className="loader"
          />

        </div>

        <style>{`

          .track-loading {
            min-height:100vh;
            width:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            background:
              linear-gradient(
                180deg,
                #eff6ff,
                #ffffff
              );
            padding:20px;
            font-family:
              Inter,
              system-ui,
              sans-serif;
          }

          .loading-card {
            width:100%;
            max-width:420px;
            background:#fff;
            border-radius:24px;
            padding:35px 25px;
            text-align:center;
            box-shadow:
              0 20px 60px
              rgba(15,23,42,.10);
          }

          .loading-logo {
            width:70px;
            height:70px;
            margin:auto;
            border-radius:20px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#2563EB;
            color:white;
            font-size:28px;
          }

          .loading-card h2 {
            margin:
              20px 0 8px;
            color:#0F172A;
            font-size:20px;
          }

          .loading-card p {
            margin:0;
            color:#64748B;
            font-size:13px;
          }

          .loader {
            width:34px;
            height:34px;
            border:3px solid #DBEAFE;
            border-top-color:#2563EB;
            border-radius:50%;
            margin:25px auto 0;
            animation:
              trackSpin .8s linear infinite;
          }

          @keyframes trackSpin {
            to {
              transform:rotate(360deg);
            }
          }

        `}</style>

      </div>

    );

  }


  // ====================================================
  // ❌ ERREUR
  // ====================================================

  if (
    error ||
    !order
  ) {

    return (

      <div
        className="track-error"
      >

        <div
          className="error-card"
        >

          <div
            className="error-icon"
          >

            <FaTimesCircle />

          </div>

          <h2>
            Impossible de suivre la commande
          </h2>

          <p>
            {error ||
              "Commande introuvable."}
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
          >

            <FaArrowLeft />

            Retour

          </button>

        </div>

        <style>{`

          .track-error {
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            background:#F8FAFC;
            font-family:
              Inter,
              system-ui,
              sans-serif;
          }

          .error-card {
            width:100%;
            max-width:440px;
            background:white;
            border-radius:24px;
            padding:30px 22px;
            text-align:center;
            box-shadow:
              0 20px 50px
              rgba(15,23,42,.08);
          }

          .error-icon {
            width:65px;
            height:65px;
            margin:auto;
            border-radius:50%;
            background:#FEE2E2;
            color:#DC2626;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:28px;
          }

          .error-card h2 {
            color:#0F172A;
            font-size:19px;
            margin:18px 0 8px;
          }

          .error-card p {
            color:#64748B;
            font-size:13px;
            line-height:1.6;
          }

          .error-card button {
            border:none;
            background:#2563EB;
            color:white;
            padding:13px 20px;
            border-radius:12px;
            font-weight:800;
            cursor:pointer;
          }

        `}</style>

      </div>

    );

  }


  // ====================================================
  // 🚚 PHOTO / PHONE
  // ====================================================

  const driverPhoto =
    assignedDriver?.photo ||
    "";

  const driverPhone =
    assignedDriver?.phone ||
    "";


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      className="track-order-page"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="track-header"
      >

        <button
          className="back-button"
          onClick={() =>
            navigate(-1)
          }
        >

          <FaArrowLeft />

        </button>


        <div
          className="header-title"
        >

          <div
            className="header-icon"
          >

            <FaTruck />

          </div>

          <div>

            <strong>
              Suivi de commande
            </strong>

            <span>
              {orderReference}
            </span>

          </div>

        </div>


        <div
          className="header-status"
          style={{
            background:
              statusInfo.bg,
            color:
              statusInfo.color,
          }}
        >

          {statusInfo.icon}

        </div>

      </header>


      {/* =================================================
          STATUS
      ================================================= */}

      <section
        className="status-card"
      >

        <div
          className="status-top"
        >

          <div
            className="status-icon"
            style={{
              background:
                statusInfo.bg,
              color:
                statusInfo.color,
            }}
          >

            {statusInfo.icon}

          </div>

          <div>

            <span>
              ÉTAT DE LA COMMANDE
            </span>

            <h1
              style={{
                color:
                  statusInfo.color,
              }}
            >
              {statusInfo.label}
            </h1>

          </div>

        </div>


        <div
          className="progress-wrapper"
        >

          <div
            className="progress-line"
          >

            <div
              className="progress-fill"
              style={{
                width:
                  `${
                    order.status ===
                    "Livrée"
                      ? 100
                      : progress
                  }%`,
              }}
            />

          </div>


          <div
            className="progress-points"
          >

            <div
              className={
                "point active"
              }
            >
              <FaCheckCircle />
              <span>
                Commandée
              </span>
            </div>

            <div
              className={
                [
                  "point",
                  [
                    "Confirmée",
                    "Préparation",
                    "En livraison",
                    "Livrée",
                  ].includes(
                    order.status
                  )
                    ? "active"
                    : "",
                ].join(" ")
              }
            >
              <FaBox />
              <span>
                Préparation
              </span>
            </div>

            <div
              className={
                [
                  "point",
                  [
                    "En livraison",
                    "Livrée",
                  ].includes(
                    order.status
                  )
                    ? "active"
                    : "",
                ].join(" ")
              }
            >
              <FaTruck />
              <span>
                Livraison
              </span>
            </div>

            <div
              className={
                [
                  "point",
                  order.status ===
                  "Livrée"
                    ? "active"
                    : "",
                ].join(" ")
              }
            >
              <FaCheckCircle />
              <span>
                Livrée
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          CONTENU
      ================================================= */}

      <main
        className="track-content"
      >

        {/* =================================================
            MAP
        ================================================= */}

        <section
          className="map-card"
        >

          <div
            className="map-header"
          >

            <div>

              <strong>
                <FaMap />
                {" "}
                Suivi GPS
              </strong>

              <span>

                {gpsOnline
                  ? "Position du livreur en direct"
                  : "Position GPS en attente"}

              </span>

            </div>


            <div
              className={
                gpsOnline
                  ? "gps-badge online"
                  : "gps-badge"
              }
            >

              <FaCircle />

              {gpsOnline
                ? " EN DIRECT"
                : " HORS LIGNE"}

            </div>

          </div>


          <div
            className="map-container"
          >

            {(driverPosition ||
              customerPosition) ? (

              <MapContainer
                center={
                  driverPosition ||
                  customerPosition
                }
                zoom={
                  isMobile
                    ? 15
                    : 14
                }
                scrollWheelZoom={
                  true
                }
                zoomControl={false}
                style={{
                  width:
                    "100%",
                  height:
                    "100%",
                }}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <ZoomControl
                  position="bottomright"
                />


                <RecenterMap
                  position={
                    driverPosition ||
                    customerPosition
                  }
                />


                {/* =========================================
                    TRAJET
                ========================================= */}

                {driverPosition &&
                  customerPosition && (

                  <>

                    <Polyline
                      positions={[
                        driverPosition,
                        customerPosition,
                      ]}
                      pathOptions={{
                        color:
                          "#60A5FA",
                        weight:
                          isMobile
                            ? 10
                            : 17,
                        opacity:
                          0.20,
                        lineCap:
                          "round",
                      }}
                    />

                    <Polyline
                      positions={[
                        driverPosition,
                        customerPosition,
                      ]}
                      pathOptions={{
                        color:
                          "#2563EB",
                        weight:
                          isMobile
                            ? 4
                            : 6,
                        opacity:
                          1,
                        lineCap:
                          "round",
                      }}
                    />

                    <Circle
                      center={
                        driverPosition
                      }
                      radius={
                        isMobile
                          ? 100
                          : 160
                      }
                      pathOptions={{
                        color:
                          "#2563EB",
                        fillColor:
                          "#2563EB",
                        fillOpacity:
                          0.10,
                        weight:
                          2,
                      }}
                    />

                  </>

                )}


                {/* =========================================
                    LIVREUR
                ========================================= */}

                {driverPosition && (

                  <Marker
                    position={
                      driverPosition
                    }
                    icon={
                      driverIcon
                    }
                  >

                    <Popup>

                      <div
                        className="driver-popup"
                      >

                        {driverPhoto ? (

                          <img
                            src={
                              driverPhoto
                            }
                            alt="Livreur"
                            onError={(
                              event
                            ) => {

                              event.currentTarget.style.display =
                                "none";

                            }}
                          />

                        ) : (

                          <div
                            className="popup-avatar"
                          >

                            <FaUser />

                          </div>

                        )}


                        <div>

                          <strong>
                            {assignedDriver?.name ||
                              "Livreur"}
                          </strong>

                          <span>
                            <FaCheckCircle />
                            {" "}
                            {gpsOnline
                              ? "Position active"
                              : "Position en attente"}
                          </span>

                        </div>

                      </div>

                    </Popup>

                  </Marker>

                )}


                {/* =========================================
                    CLIENT
                ========================================= */}

                {customerPosition && (

                  <Marker
                    position={
                      customerPosition
                    }
                    icon={
                      customerIcon
                    }
                  >

                    <Popup>

                      <strong>
                        📍 Adresse de livraison
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "6px",
                          fontSize:
                            "12px",
                        }}
                      >

                        {order.address ||
                          order.district ||
                          order.city ||
                          "Adresse client"}

                      </div>

                    </Popup>

                  </Marker>

                )}

              </MapContainer>

            ) : (

              <div
                className="no-gps"
              >

                <FaMapMarkerAlt />

                <strong>
                  Position GPS indisponible
                </strong>

                <span>
                  La position apparaîtra dès que
                  le livreur commencera à transmettre
                  sa localisation.
                </span>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            INFORMATIONS LIVRAISON
        ================================================= */}

        <section
          className="metrics-grid"
        >

          <InfoBox
            icon={
              <FaRoute />
            }
            label="DISTANCE"
            value={
              distanceText
            }
          />

          <InfoBox
            icon={
              <FaClock />
            }
            label="TEMPS ESTIMÉ"
            value={
              estimatedTime
            }
          />

          <InfoBox
            icon={
              <FaSignal />
            }
            label="GPS"
            value={
              gpsOnline
                ? "En direct"
                : "En attente"
            }
          />

          <InfoBox
            icon={
              <FaChartLine />
            }
            label="VITESSE"
            value={
              liveSpeed > 0
                ? `${liveSpeed} km/h`
                : "--"
            }
          />

        </section>


        {/* =================================================
            LIVREUR
        ================================================= */}

        {assignedDriver ? (

          <section
            className="driver-card"
          >

            <div
              className="driver-card-header"
            >

              <div>

                <span>
                  VOTRE LIVREUR
                </span>

                <h2>
                  <FaMotorcycle />
                  {" "}
                  Livreur assigné
                </h2>

              </div>


              <div
                className="driver-live"
              >

                <FaCircle />

                ACTIF

              </div>

            </div>


            <div
              className="driver-main"
            >

              <div
                className="driver-photo"
              >

                {driverPhoto ? (

                  <img
                    src={
                      driverPhoto
                    }
                    alt={
                      assignedDriver.name ||
                      "Livreur"
                    }
                    onError={(
                      event
                    ) => {

                      event.currentTarget.style.display =
                        "none";

                    }}
                  />

                ) : (

                  <FaUser />

                )}

              </div>


              <div
                className="driver-info"
              >

                <h3>
                  {assignedDriver.name ||
                    "Livreur Konan Shopping"}
                </h3>

                <p>
                  <FaMotorcycle />
                  {" "}
                  {assignedDriver.vehicle ||
                    "Véhicule non renseigné"}
                </p>

                {assignedDriver.plate && (

                  <p>
                    <FaShieldAlt />
                    {" "}
                    Plaque :
                    {" "}
                    {assignedDriver.plate}
                  </p>

                )}

              </div>

            </div>


            {driverPhone && (

              <a
                className="call-driver"
                href={`tel:${driverPhone}`}
              >

                <FaPhoneAlt />

                Appeler le livreur

              </a>

            )}

          </section>

        ) : (

          <section
            className="no-driver-card"
          >

            <div>
              <FaBoxOpen />
            </div>

            <div>

              <strong>
                Aucun livreur assigné
              </strong>

              <p>
                Le premier livreur disponible
                qui acceptera la commande sera
                automatiquement affiché ici.
              </p>

            </div>

          </section>

        )}


        {/* =================================================
            COMMANDE
        ================================================= */}

        <section
          className="order-card"
        >

          <div
            className="section-title"
          >

            <div>
              <FaShoppingBag />
            </div>

            <div>

              <span>
                VOTRE COMMANDE
              </span>

              <h2>
                {orderReference}
              </h2>

            </div>

          </div>


          <div
            className="products-list"
          >

            {Array.isArray(
              order.items
            ) &&
              order.items.map(
                (
                  item,
                  index
                ) => (

                  <div
                    className="product-row"
                    key={
                      item.productId ||
                      item._id ||
                      index
                    }
                  >

                    <div
                      className="product-image"
                    >

                      {item.image ? (

                        <img
                          src={
                            getImageUrl(
                              item.image
                            )
                          }
                          alt={
                            item.name ||
                            "Produit"
                          }
                        />

                      ) : (

                        <FaBox />

                      )}

                    </div>


                    <div
                      className="product-info"
                    >

                      <strong>
                        {item.name ||
                          "Produit"}
                      </strong>

                      <span>
                        Quantité :
                        {" "}
                        x{
                          item.quantity ||
                          1
                        }
                      </span>

                    </div>


                    <strong
                      className="product-price"
                    >

                      {Number(
                        item.price ||
                        0
                      ).toLocaleString(
                        "fr-FR"
                      )}
                      {" "}
                      FCFA

                    </strong>

                  </div>

                )
              )}

          </div>


          <div
            className="total-row"
          >

            <div>

              <span>
                Sous-total produits
              </span>

              <strong>
                {productsTotal.toLocaleString(
                  "fr-FR"
                )}
                {" "}
                FCFA
              </strong>

            </div>


            <div>

              <span>
                Livraison
              </span>

              <strong>
                {Number(
                  order.shipping ||
                  0
                ).toLocaleString(
                  "fr-FR"
                )}
                {" "}
                FCFA
              </strong>

            </div>


            <div
              className="grand-total"
            >

              <span>
                TOTAL
              </span>

              <strong>
                {Number(
                  order.total ||
                  0
                ).toLocaleString(
                  "fr-FR"
                )}
                {" "}
                FCFA
              </strong>

            </div>

          </div>


          <div
            className="payment-info"
          >

            <FaCreditCard />

            <span>
              Paiement :
            </span>

            <strong>
              {order.paymentMethod ||
                "Paiement à la livraison"}
            </strong>

          </div>

        </section>


        {/* =================================================
            ADRESSE
        ================================================= */}

        <section
          className="address-card"
        >

          <div
            className="address-icon"
          >

            <FaHome />

          </div>


          <div>

            <span>
              ADRESSE DE LIVRAISON
            </span>

            <strong>
              {order.address ||
                "Adresse non renseignée"}
            </strong>

            <p>

              {order.district &&
                `${order.district}, `}

              {order.city ||
                ""}

            </p>

          </div>

        </section>


        {/* =================================================
            QR CODE
        ================================================= */}

        {qrToken &&
          order.status ===
          "En livraison" && (

          <section
            className="qr-card"
          >

            <div
              className="qr-icon"
            >

              <FaQrcode />

            </div>


            <h2>
              QR de livraison
            </h2>


            <p>

              Présentez ce code au livreur
              lors de la réception.

            </p>


            <div
              className="qr-wrapper"
            >

              <QRCodeSVG
                value={
                  qrToken
                }
                size={
                  isMobile
                    ? 190
                    : 230
                }
                level="H"
              />

            </div>


            <div
              className="qr-security"
            >

              <FaShieldAlt />

              Ce QR est unique à cette
              commande.

            </div>

          </section>

        )}


        {/* =================================================
            GPS INFO
        ================================================= */}

        {order.status ===
          "En livraison" && (

          <section
            className={
              gpsOnline
                ? "gps-info online"
                : "gps-info"
            }
          >

            <div>

              <FaLocationArrow />

            </div>

            <span>

              {gpsOnline
                ? "La position du livreur est synchronisée en direct."
                : "En attente de la prochaine position GPS du livreur."}

            </span>

            {gpsTime && (

              <small>
                {gpsTime}
              </small>

            )}

          </section>

        )}


        {/* =================================================
            INFORMATIONS
        ================================================= */}

        <section
          className="info-footer"
        >

          <FaInfoCircle />

          <div>

            <strong>
              Suivi automatique
            </strong>

            <p>

              Cette page actualise automatiquement
              le statut et la position du livreur
              toutes les 3 secondes.

            </p>

          </div>

        </section>

      </main>


      {/* =================================================
          CSS PROFESSIONNEL MOBILE
      ================================================= */}

      <style>{`

        * {
          box-sizing:border-box;
        }

        html,
        body,
        #root {
          margin:0;
          min-height:100%;
          width:100%;
        }

        body {
          background:#F8FAFC;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        a {
          font-family:inherit;
        }


        /* =================================================
           PAGE
        ================================================= */

        .track-order-page {

          width:100%;
          min-height:100vh;

          background:
            linear-gradient(
              180deg,
              #EFF6FF 0%,
              #F8FAFC 35%,
              #FFFFFF 100%
            );

          padding:
            12px;

          overflow-x:hidden;

          color:#0F172A;

        }


        /* =================================================
           HEADER
        ================================================= */

        .track-header {

          width:100%;
          max-width:1200px;

          margin:
            0 auto 12px;

          padding:
            13px;

          display:flex;
          align-items:center;

          gap:10px;

          background:#FFFFFF;

          border:
            1px solid #E2E8F0;

          border-radius:18px;

          box-shadow:
            0 8px 25px
            rgba(15,23,42,.06);

        }


        .back-button {

          width:44px;
          height:44px;

          flex-shrink:0;

          border:none;

          border-radius:13px;

          background:#EFF6FF;

          color:#2563EB;

          display:flex;
          align-items:center;
          justify-content:center;

          font-size:16px;

          cursor:pointer;

          transition:.2s;

        }

        .back-button:active {
          transform:scale(.94);
        }


        .header-title {

          min-width:0;

          flex:1;

          display:flex;
          align-items:center;

          gap:10px;

        }


        .header-icon {

          width:42px;
          height:42px;

          flex-shrink:0;

          border-radius:12px;

          display:flex;
          align-items:center;
          justify-content:center;

          background:
            linear-gradient(
              135deg,
              #2563EB,
              #4F46E5
            );

          color:#FFFFFF;

          font-size:18px;

        }


        .header-title strong {

          display:block;

          font-size:14px;

          font-weight:900;

          color:#0F172A;

        }


        .header-title span {

          display:block;

          margin-top:2px;

          font-size:10px;

          color:#64748B;

          font-weight:700;

        }


        .header-status {

          width:38px;
          height:38px;

          flex-shrink:0;

          border-radius:12px;

          display:flex;
          align-items:center;
          justify-content:center;

        }


        /* =================================================
           STATUS
        ================================================= */

        .status-card {

          width:100%;
          max-width:1200px;

          margin:
            0 auto 12px;

          padding:17px;

          background:#FFFFFF;

          border:
            1px solid #E2E8F0;

          border-radius:20px;

          box-shadow:
            0 8px 30px
            rgba(15,23,42,.06);

        }


        .status-top {

          display:flex;
          align-items:center;

          gap:12px;

        }


        .status-icon {

          width:48px;
          height:48px;

          flex-shrink:0;

          border-radius:15px;

          display:flex;
          align-items:center;
          justify-content:center;

          font-size:21px;

        }


        .status-top span {

          display:block;

          color:#94A3B8;

          font-size:8px;

          font-weight:900;

          letter-spacing:.7px;

        }


        .status-top h1 {

          margin:
            3px 0 0;

          font-size:17px;

          line-height:1.2;

          font-weight:950;

        }


        .progress-wrapper {

          margin-top:22px;

          position:relative;

        }


        .progress-line {

          position:absolute;

          top:10px;

          left:7%;

          right:7%;

          height:4px;

          border-radius:10px;

          background:#E2E8F0;

          overflow:hidden;

        }


        .progress-fill {

          height:100%;

          background:
            linear-gradient(
              90deg,
              #2563EB,
              #4F46E5
            );

          border-radius:10px;

          transition:
            width .5s ease;

        }


        .progress-points {

          position:relative;

          display:flex;

          justify-content:space-between;

        }


        .point {

          width:25%;

          display:flex;

          flex-direction:column;

          align-items:center;

          gap:5px;

          color:#CBD5E1;

          font-size:13px;

        }


        .point.active {

          color:#2563EB;

        }


        .point span {

          color:#64748B;

          font-size:8px;

          font-weight:800;

          text-align:center;

        }


        /* =================================================
           CONTENT
        ================================================= */

        .track-content {

          width:100%;
          max-width:1200px;

          margin:0 auto;

        }


        /* =================================================
           MAP
        ================================================= */

        .map-card {

          background:#FFFFFF;

          border:
            1px solid #E2E8F0;

          border-radius:20px;

          overflow:hidden;

          box-shadow:
            0 8px 30px
            rgba(15,23,42,.06);

          margin-bottom:12px;

        }


        .map-header {

          padding:
            13px 14px;

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

        }


        .map-header strong {

          display:flex;

          align-items:center;

          gap:7px;

          color:#0F172A;

          font-size:12px;

          font-weight:950;

        }


        .map-header strong svg {

          color:#2563EB;

        }


        .map-header span {

          display:block;

          margin-top:3px;

          color:#94A3B8;

          font-size:9px;

          font-weight:600;

        }


        .gps-badge {

          display:flex;

          align-items:center;

          gap:4px;

          white-space:nowrap;

          padding:
            6px 8px;

          border-radius:9px;

          background:#F1F5F9;

          color:#64748B;

          font-size:8px;

          font-weight:900;

        }


        .gps-badge.online {

          background:#DCFCE7;

          color:#16A34A;

        }


        .gps-badge svg {

          font-size:7px;

        }


        .map-container {

          width:100%;

          height:
            min(58vh,420px);

          min-height:320px;

          position:relative;

        }


        .leaflet-container {

          width:100%;
          height:100%;

          z-index:1;

        }


        .leaflet-control-zoom {

          margin:
            0 8px 8px 0 !important;

        }


        .leaflet-control-zoom a {

          width:34px !important;
          height:34px !important;

          line-height:34px !important;

        }


        .no-gps {

          height:100%;

          display:flex;

          flex-direction:column;

          align-items:center;

          justify-content:center;

          text-align:center;

          padding:30px;

          background:
            linear-gradient(
              145deg,
              #EFF6FF,
              #F8FAFC
            );

          color:#64748B;

        }


        .no-gps svg {

          color:#2563EB;

          font-size:35px;

          margin-bottom:12px;

        }


        .no-gps strong {

          color:#0F172A;

          font-size:14px;

        }


        .no-gps span {

          max-width:300px;

          margin-top:7px;

          font-size:11px;

          line-height:1.6;

        }


        /* =================================================
           METRICS
        ================================================= */

        .metrics-grid {

          display:grid;

          grid-template-columns:
            repeat(4,1fr);

          gap:8px;

          margin-bottom:12px;

        }


        /* =================================================
           DRIVER
        ================================================= */

        .driver-card {

          background:#FFFFFF;

          border:
            1px solid #E2E8F0;

          border-radius:20px;

          padding:15px;

          margin-bottom:12px;

          box-shadow:
            0 8px 30px
            rgba(15,23,42,.06);

        }


        .driver-card-header {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

          margin-bottom:15px;

        }


        .driver-card-header span {

          display:block;

          color:#94A3B8;

          font-size:8px;

          font-weight:900;

          letter-spacing:.6px;

        }


        .driver-card-header h2 {

          margin:
            4px 0 0;

          display:flex;

          align-items:center;

          gap:6px;

          font-size:15px;

          font-weight:950;

        }


        .driver-card-header h2 svg {

          color:#2563EB;

        }


        .driver-live {

          display:flex;

          align-items:center;

          gap:4px;

          padding:
            6px 8px;

          border-radius:8px;

          background:#DCFCE7;

          color:#16A34A;

          font-size:8px;

          font-weight:900;

        }


        .driver-live svg {

          font-size:6px;

        }


        .driver-main {

          display:flex;

          align-items:center;

          gap:13px;

        }


        .driver-photo {

          width:72px;
          height:72px;

          flex-shrink:0;

          border-radius:20px;

          overflow:hidden;

          display:flex;

          align-items:center;
          justify-content:center;

          background:#DBEAFE;

          color:#2563EB;

          font-size:27px;

        }


        .driver-photo img {

          width:100%;
          height:100%;

          object-fit:cover;

        }


        .driver-info {

          min-width:0;

        }


        .driver-info h3 {

          margin:0 0 7px;

          font-size:16px;

          font-weight:950;

          color:#0F172A;

          word-break:break-word;

        }


        .driver-info p {

          margin:
            4px 0;

          color:#64748B;

          font-size:10px;

          font-weight:700;

        }


        .driver-info svg {

          color:#2563EB;

        }


        .call-driver {

          min-height:48px;

          margin-top:15px;

          display:flex;

          align-items:center;

          justify-content:center;

          gap:8px;

          border-radius:13px;

          text-decoration:none;

          background:#2563EB;

          color:#FFFFFF;

          font-size:12px;

          font-weight:900;

          box-shadow:
            0 8px 20px
            rgba(37,99,235,.20);

        }


        .no-driver-card {

          display:flex;

          align-items:center;

          gap:12px;

          background:#FFFFFF;

          border:
            1px solid #E2E8F0;

          border-radius:20px;

          padding:15px;

          margin-bottom:12px;

        }


        .no-driver-card > div:first-child {

          width:48px;
          height:48px;

          flex-shrink:0;

          border-radius:14px;

          background:#EFF6FF;

          color:#2563EB;

          display:flex;

          align-items:center;
          justify-content:center;

          font-size:21px;

        }


        .no-driver-card strong {

          font-size:13px;

        }


        .no-driver-card p {

          margin:
            4px 0 0;

          color:#64748B;

          font-size:10px;

          line-height:1.5;

        }


        /* =================================================
           ORDER
        ================================================= */

        .order-card {

          background:#FFFFFF;

          border:
            1px solid #E2E8F0;

          border-radius:20px;

          padding:15px;

          margin-bottom:12px;

          box-shadow:
            0 8px 30px
            rgba(15,23,42,.06);

        }


        .section-title {

          display:flex;

          align-items:center;

          gap:10px;

          margin-bottom:14px;

        }


        .section-title > div:first-child {

          width:42px;
          height:42px;

          flex-shrink:0;

          border-radius:13px;

          display:flex;
          align-items:center;
          justify-content:center;

          background:#EFF6FF;

          color:#2563EB;

        }


        .section-title span {

          display:block;

          color:#94A3B8;

          font-size:8px;

          font-weight:900;

          letter-spacing:.6px;

        }


        .section-title h2 {

          margin:
            3px 0 0;

          color:#0F172A;

          font-size:14px;

          font-weight:950;

        }


        .products-list {

          display:flex;

          flex-direction:column;

          gap:8px;

        }


        .product-row {

          display:flex;

          align-items:center;

          gap:9px;

          padding:8px;

          border:
            1px solid #F1F5F9;

          border-radius:13px;

          background:#FAFCFF;

        }


        .product-image {

          width:48px;
          height:48px;

          flex-shrink:0;

          border-radius:11px;

          overflow:hidden;

          background:#EFF6FF;

          color:#2563EB;

          display:flex;
          align-items:center;
          justify-content:center;

        }


        .product-image img {

          width:100%;
          height:100%;

          object-fit:cover;

        }


        .product-info {

          min-width:0;

          flex:1;

        }


        .product-info strong {

          display:block;

          color:#0F172A;

          font-size:11px;

          font-weight:900;

          white-space:nowrap;

          overflow:hidden;

          text-overflow:ellipsis;

        }


        .product-info span {

          display:block;

          margin-top:4px;

          color:#94A3B8;

          font-size:9px;

          font-weight:700;

        }


        .product-price {

          color:#2563EB;

          font-size:10px;

          font-weight:950;

          white-space:nowrap;

        }


        .total-row {

          margin-top:13px;

          padding-top:12px;

          border-top:
            1px solid #E2E8F0;

        }


        .total-row > div {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

          margin:7px 0;

        }


        .total-row span {

          color:#64748B;

          font-size:10px;

          font-weight:700;

        }


        .total-row strong {

          color:#0F172A;

          font-size:11px;

          font-weight:900;

        }


        .total-row .grand-total {

          margin-top:12px;

          padding-top:12px;

          border-top:
            1px dashed #CBD5E1;

        }


        .grand-total span {

          color:#0F172A;

          font-size:11px;

          font-weight:950;

        }


        .grand-total strong {

          color:#2563EB;

          font-size:18px;

          font-weight:950;

        }


        .payment-info {

          margin-top:12px;

          padding:
            10px 12px;

          display:flex;

          align-items:center;

          gap:7px;

          flex-wrap:wrap;

          background:#EFF6FF;

          border-radius:12px;

          color:#475569;

          font-size:9px;

        }


        .payment-info svg {

          color:#2563EB;

        }


        .payment-info strong {

          color:#1D4ED8;

        }


        /* =================================================
           ADDRESS
        ================================================= */

        .address-card {

          display:flex;

          align-items:flex-start;

          gap:11px;

          padding:15px;

          margin-bottom:12px;

          background:#FFFFFF;

          border:
            1px solid #E2E8F0;

          border-radius:20px;

          box-shadow:
            0 8px 30px
            rgba(15,23,42,.05);

        }


        .address-icon {

          width:42px;
          height:42px;

          flex-shrink:0;

          border-radius:13px;

          background:#FEF3C7;

          color:#D97706;

          display:flex;

          align-items:center;
          justify-content:center;

        }


        .address-card span {

          display:block;

          color:#94A3B8;

          font-size:8px;

          font-weight:900;

        }


        .address-card strong {

          display:block;

          margin-top:4px;

          color:#0F172A;

          font-size:12px;

          line-height:1.5;

        }


        .address-card p {

          margin:
            4px 0 0;

          color:#64748B;

          font-size:10px;

        }


        /* =================================================
           QR
        ================================================= */

        .qr-card {

          background:
            linear-gradient(
              145deg,
              #FFFFFF,
              #F8FAFC
            );

          border:
            1px solid #CBD5E1;

          border-radius:22px;

          padding:
            20px 14px;

          text-align:center;

          margin-bottom:12px;

          box-shadow:
            0 12px 35px
            rgba(15,23,42,.07);

        }


        .qr-icon {

          width:52px;
          height:52px;

          margin:
            0 auto 10px;

          border-radius:15px;

          display:flex;

          align-items:center;
          justify-content:center;

          background:
            linear-gradient(
              135deg,
              #2563EB,
              #4F46E5
            );

          color:#FFFFFF;

          font-size:21px;

        }


        .qr-card h2 {

          margin:0;

          font-size:19px;

          font-weight:950;

        }


        .qr-card p {

          max-width:360px;

          margin:
            7px auto 15px;

          color:#64748B;

          font-size:11px;

          line-height:1.6;

        }


        .qr-wrapper {

          display:inline-flex;

          padding:11px;

          background:#FFFFFF;

          border:
            1px solid #E2E8F0;

          border-radius:16px;

          box-shadow:
            0 8px 25px
            rgba(15,23,42,.08);

        }


        .qr-security {

          margin:
            12px auto 0;

          display:flex;

          align-items:center;

          justify-content:center;

          gap:5px;

          color:#16A34A;

          font-size:9px;

          font-weight:900;

        }


        /* =================================================
           GPS INFO
        ================================================= */

        .gps-info {

          display:flex;

          align-items:center;

          gap:9px;

          padding:
            11px 13px;

          margin-bottom:12px;

          background:#F1F5F9;

          border:
            1px solid #E2E8F0;

          border-radius:14px;

          color:#64748B;

          font-size:9px;

          font-weight:800;

        }


        .gps-info.online {

          background:#F0FDF4;

          border-color:#BBF7D0;

          color:#166534;

        }


        .gps-info > div {

          width:30px;
          height:30px;

          flex-shrink:0;

          border-radius:9px;

          display:flex;

          align-items:center;
          justify-content:center;

          background:#FFFFFF;

          color:#2563EB;

        }


        .gps-info.online > div {

          color:#16A34A;

        }


        .gps-info span {

          flex:1;

          line-height:1.4;

        }


        .gps-info small {

          white-space:nowrap;

          font-size:8px;

        }


        /* =================================================
           FOOTER INFO
        ================================================= */

        .info-footer {

          display:flex;

          align-items:flex-start;

          gap:9px;

          padding:
            13px;

          margin-bottom:10px;

          background:#EFF6FF;

          border:
            1px solid #DBEAFE;

          border-radius:15px;

          color:#1E40AF;

        }


        .info-footer > svg {

          margin-top:2px;

          flex-shrink:0;

        }


        .info-footer strong {

          display:block;

          font-size:10px;

          font-weight:950;

        }


        .info-footer p {

          margin:
            4px 0 0;

          color:#64748B;

          font-size:9px;

          line-height:1.5;

        }


        /* =================================================
           POPUP
        ================================================= */

        .driver-popup {

          display:flex;

          align-items:center;

          gap:9px;

          min-width:200px;

        }


        .driver-popup img,
        .popup-avatar {

          width:48px;
          height:48px;

          flex-shrink:0;

          border-radius:50%;

          object-fit:cover;

        }


        .popup-avatar {

          display:flex;

          align-items:center;
          justify-content:center;

          background:#DBEAFE;

          color:#2563EB;

          font-size:19px;

        }


        .driver-popup strong {

          display:block;

          color:#0F172A;

          font-size:12px;

        }


        .driver-popup span {

          display:flex;

          align-items:center;

          gap:4px;

          margin-top:5px;

          color:#16A34A;

          font-size:9px;

          font-weight:800;

        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (
          max-width:767px
        ) {

          .track-order-page {

            padding:
              7px;

          }


          .track-header {

            border-radius:15px;

            padding:10px;

          }


          .status-card {

            border-radius:16px;

            padding:13px;

          }


          .map-card,
          .driver-card,
          .order-card,
          .address-card,
          .qr-card {

            border-radius:17px;

          }


          .map-container {

            height:
              55vh;

            min-height:
              310px;

          }


          .metrics-grid {

            grid-template-columns:
              repeat(2,1fr);

          }


          .leaflet-control-zoom {

            margin:
              0 7px 7px 0 !important;

          }


          .leaflet-control-zoom a {

            width:32px !important;

            height:32px !important;

            line-height:32px !important;

          }


          .product-price {

            font-size:9px;

          }

        }


        /* =================================================
           PETIT MOBILE
        ================================================= */

        @media (
          max-width:430px
        ) {

          .track-order-page {

            padding:
              5px;

          }


          .header-title strong {

            font-size:13px;

          }


          .status-top h1 {

            font-size:15px;

          }


          .point span {

            font-size:7px;

          }


          .map-container {

            height:
              56vh;

            min-height:
              300px;

          }


          .driver-photo {

            width:62px;

            height:62px;

          }


          .driver-info h3 {

            font-size:14px;

          }


          .product-image {

            width:44px;

            height:44px;

          }


          .product-price {

            max-width:75px;

            white-space:normal;

            text-align:right;

          }


          .grand-total strong {

            font-size:16px;

          }


          .gps-info {

            align-items:flex-start;

          }


          .gps-info small {

            display:none;

          }

        }


        /* =================================================
           TABLET / DESKTOP
        ================================================= */

        @media (
          min-width:768px
        ) {

          .track-order-page {

            padding:
              18px;

          }


          .track-content {

            display:grid;

            grid-template-columns:
              minmax(0,1.7fr)
              minmax(320px,.9fr);

            gap:14px;

          }


          .map-card {

            grid-column:
              1 / 2;

            grid-row:
              1 / span 4;

          }


          .metrics-grid {

            grid-column:
              2;

          }


          .driver-card,
          .no-driver-card {

            grid-column:
              2;

          }


          .order-card {

            grid-column:
              2;

          }


          .address-card {

            grid-column:
              2;

          }


          .qr-card {

            grid-column:
              2;

          }


          .gps-info,
          .info-footer {

            grid-column:
              1 / -1;

          }


          .map-container {

            height:
              620px;

          }

        }

      `}</style>

    </div>

  );

}


// ======================================================
// ℹ️ INFO BOX
// ======================================================

function InfoBox({
  icon,
  label,
  value,
}) {

  return (

    <div
      style={{
        background:
          "#FFFFFF",
        border:
          "1px solid #E2E8F0",
        borderRadius:
          "14px",
        padding:
          "11px",
        minWidth:
          0,
        boxShadow:
          "0 5px 18px rgba(15,23,42,.04)",
      }}
    >

      <small
        style={{
          display:
            "flex",
          alignItems:
            "center",
          gap:
            "5px",
          color:
            "#94A3B8",
          fontSize:
            "8px",
          fontWeight:
            900,
          whiteSpace:
            "nowrap",
        }}
      >

        {icon}

        {label}

      </small>


      <strong
        style={{
          display:
            "block",
          marginTop:
            "5px",
          color:
            "#0F172A",
          fontSize:
            "11px",
          fontWeight:
            950,
          wordBreak:
            "break-word",
        }}
      >

        {value}

      </strong>

    </div>

  );

}