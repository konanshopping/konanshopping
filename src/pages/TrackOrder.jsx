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
} from "react-icons/fa";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { useParams } from "react-router-dom";

import {
  QRCodeSVG,
} from "qrcode.react";


// ======================================================
// 🌐 API
// ======================================================

const API =
  "https://konanshopping.com";


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
      Math.sqrt(1 - a)
    );

  return R * c;
}


// ======================================================
// 🚚 TRACK ORDER
// ======================================================

export default function TrackOrder() {

  const {
    id,
  } = useParams();


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
  // ❌ ERREUR
  // ====================================================

  const [
    error,
    setError,
  ] = useState("");


  // ====================================================
  // 📡 GPS
  // ====================================================

  const [
    gpsOnline,
    setGpsOnline,
  ] = useState(false);


  const [
    lastGpsUpdate,
    setLastGpsUpdate,
  ] = useState(null);


  // ====================================================
  // 📱 RESPONSIVE
  // ====================================================

  const [
    isMobile,
    setIsMobile,
  ] = useState(
    window.innerWidth < 768
  );


  useEffect(() => {

    const handleResize = () => {

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

        try {

          let response;

          try {

            response =
              await axios.get(
                `${API}/api/order/${id}`,
                {
                  timeout: 10000,
                }
              );

          } catch {

            response =
              await axios.get(
                `${API}/order/${id}`,
                {
                  timeout: 10000,
                }
              );

          }


          if (!mounted) {
            return;
          }


          // =================================================
          // 📦 NORMALISER LA RÉPONSE API
          // =================================================
          //
          // Le backend peut répondre soit :
          //
          // { success: true, order: {...} }
          //
          // soit directement :
          //
          // { ...order }
          //
          // On récupère donc toujours le véritable objet
          // commande avant de faire setOrder().
          // =================================================

          const data =
            response.data?.order ||
            response.data?.data ||
            response.data;


          if (!data || !data._id) {

            throw new Error(
              "Réponse commande invalide"
            );

          }


          console.log(
            "📦 TRACK ORDER — COMMANDE :",
            data
          );


          console.log(
            "🚚 TRACK ORDER — LIVREUR :",
            data?.assignedDriver
          );


          setOrder(data);

          setError("");


          // =================================================
          // 📍 GPS LIVREUR
          // =================================================

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

              Number(
                gps.lat
              ),

              Number(
                gps.lng
              ),

            ]);


            setLastGpsUpdate(
              gps.updatedAt ||
              null
            );


            if (
              gps.updatedAt
            ) {

              const age =
                Date.now() -
                new Date(
                  gps.updatedAt
                ).getTime();

              setGpsOnline(
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
            "❌ TRACK ORDER :",
            err
          );

          if (mounted) {

            setError(
              "Impossible de récupérer le suivi de cette commande."
            );

          }

        } finally {

          if (mounted) {

            setLoading(
              false
            );

          }

        }

      };


    fetchOrder();


    // ===================================================
    // 🔄 ACTUALISATION
    // ===================================================

    const interval =
      setInterval(
        fetchOrder,
        3000
      );


    return () => {

      mounted = false;

      clearInterval(
        interval
      );

    };

  }, [
    id,
  ]);


  // ====================================================
  // 🚚 LIVREUR NORMALISÉ
  // ====================================================

  const assignedDriver =
    useMemo(() => {

      const assigned =
        order?.assignedDriver;

      const driver =
        order?.driver;


      // Nouveau système
      if (
        assigned &&
        typeof assigned ===
        "object"
      ) {

        return {

          id:
            assigned.id ||
            assigned._id ||
            order?.driverId ||
            "",

          name:
            assigned.name ||
            driver?.name ||
            "",

          phone:
            assigned.phone ||
            assigned.telephone ||
            driver?.phone ||
            "",

          photo:
            assigned.photo ||
            assigned.image ||
            driver?.photo ||
            driver?.image ||
            "",

          vehicle:
            assigned.vehicle ||
            assigned.driverVehicle ||
            driver?.vehicle ||
            "",

          plate:
            assigned.plate ||
            assigned.licensePlate ||
            driver?.plate ||
            driver?.licensePlate ||
            "",

        };

      }


      // Ancien système
      if (
        driver &&
        typeof driver ===
        "object"
      ) {

        return {

          id:
            order?.driverId ||
            "",

          name:
            driver.name ||
            "",

          phone:
            driver.phone ||
            driver.telephone ||
            "",

          photo:
            driver.photo ||
            driver.image ||
            "",

          vehicle:
            driver.vehicle ||
            "",

          plate:
            driver.plate ||
            driver.licensePlate ||
            "",

        };

      }


      // Dernier fallback
      if (
        order?.driverId ||
        order?.driverName ||
        order?.driverPhone
      ) {

        return {

          id:
            order.driverId ||
            "",

          name:
            order.driverName ||
            "",

          phone:
            order.driverPhone ||
            "",

          photo:
            order.driverPhoto ||
            "",

          vehicle:
            order.driverVehicle ||
            "",

          plate:
            order.driverPlate ||
            "",

        };

      }


      return null;

    }, [
      order,
    ]);


  // ====================================================
  // 📸 PHOTO
  // ====================================================

  const driverPhoto =
    assignedDriver?.photo ||
    "";


  // ====================================================
  // 📞 TÉLÉPHONE
  // ====================================================

  const driverPhone =
    assignedDriver?.phone ||
    "";


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


      return [
        4.0511,
        9.7679,
      ];

    }, [
      order,
    ]);


  // ====================================================
  // 📏 DISTANCE
  // ====================================================

  const realDistance =
    useMemo(() => {

      if (
        !driverPosition
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
  // 🏍️ VITESSE
  // ====================================================

  const liveSpeed =
    useMemo(() => {

      if (
        realDistance === null
      ) {

        return 0;

      }

      if (
        realDistance > 8
      ) {

        return 55;

      }

      if (
        realDistance > 5
      ) {

        return 45;

      }

      if (
        realDistance > 2
      ) {

        return 35;

      }

      if (
        realDistance > 1
      ) {

        return 25;

      }

      return 12;

    }, [
      realDistance,
    ]);


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

      const maxDistance =
        10;

      return Math.min(
        100,
        Math.max(
          0,
          (
            (
              maxDistance -
              realDistance
            ) /
            maxDistance
          ) *
          100
        )
      );

    }, [
      realDistance,
    ]);


  // ====================================================
  // 💰 TOTAL PRODUITS
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
  // 🔐 QR — IMPORTANT
  // ====================================================

  /*
   * Aucun faux QR.
   *
   * Le QR doit obligatoirement
   * venir du backend.
   */

  const qrValue =
    order?.deliveryQrToken ||
    "";


  // ====================================================
  // 📋 RÉFÉRENCE
  // ====================================================

  const orderReference =
    order?._id
      ? `KS-${String(
          order._id
        ).slice(-8).toUpperCase()}`
      : "KS";


  // ====================================================
  // 💳 PAIEMENT
  // ====================================================

  const paymentMethod =
    order?.paymentMethod ||
    "Paiement à la livraison";


  // ====================================================
  // 📊 STATUT
  // ====================================================

  const statusInfo =
    useMemo(() => {

      switch (
        order?.status
      ) {

        case "Livrée":

          return {

            label:
              "Livrée",

            color:
              "#16A34A",

            bg:
              "#DCFCE7",

          };


        case "En livraison":

          return {

            label:
              "En livraison",

            color:
              "#2563EB",

            bg:
              "#DBEAFE",

          };


        case "Préparation":

          return {

            label:
              "Préparation",

            color:
              "#D97706",

            bg:
              "#FEF3C7",

          };


        case "Confirmée":

          return {

            label:
              "Confirmée",

            color:
              "#7C3AED",

            bg:
              "#EDE9FE",

          };


        case "Annulée":

          return {

            label:
              "Annulée",

            color:
              "#DC2626",

            bg:
              "#FEE2E2",

          };


        default:

          return {

            label:
              order?.status ||
              "En attente",

            color:
              "#64748B",

            bg:
              "#F1F5F9",

          };

      }

    }, [
      order?.status,
    ]);


  // ====================================================
  // 📡 GPS STATUS
  // ====================================================

  const gpsStatus =
    order?.status !==
    "En livraison"

      ? "GPS en attente"

      : gpsOnline

        ? "GPS en direct"

        : "GPS hors ligne";


  // ====================================================
  // 🕐 DERNIÈRE POSITION
  // ====================================================

  const gpsTime =
    lastGpsUpdate
      ? new Date(
          lastGpsUpdate
        ).toLocaleTimeString(
          "fr-FR"
        )
      : "";


  // ====================================================
  // ⏳ LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "15px",
          background: "#F8FAFC",
          padding: "20px",
          fontFamily:
            "'Inter',sans-serif",
        }}
      >

        <div
          style={{
            width: "65px",
            height: "65px",
            borderRadius: "20px",
            background:
              "linear-gradient(135deg,#2563EB,#1D4ED8)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "27px",
            boxShadow:
              "0 15px 35px rgba(37,99,235,.25)",
          }}
        >

          <FaTruck />

        </div>


        <strong
          style={{
            color: "#0F172A",
            fontSize: "17px",
            textAlign: "center",
          }}
        >

          Chargement du suivi...

        </strong>


        <span
          style={{
            color: "#64748B",
            fontSize: "12px",
          }}
        >

          📡 Connexion au suivi en direct

        </span>

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
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background: "#F8FAFC",
          fontFamily:
            "'Inter',sans-serif",
        }}
      >

        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "#FFFFFF",
            borderRadius: "24px",
            padding: "30px 22px",
            textAlign: "center",
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 15px 40px rgba(15,23,42,.08)",
          }}
        >

          <FaTimesCircle
            style={{
              color: "#EF4444",
              fontSize: "46px",
              marginBottom: "15px",
            }}
          />


          <h2
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: "20px",
            }}
          >

            Suivi indisponible

          </h2>


          <p
            style={{
              color: "#64748B",
              lineHeight: 1.6,
              fontSize: "13px",
            }}
          >

            {error ||
              "Commande introuvable."}

          </p>

        </div>

      </div>

    );

  }


  // ====================================================
  // 🖥️ PAGE PRINCIPALE
  // ====================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        background:
          "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",
        padding:
          isMobile
            ? "10px"
            : "22px",
        boxSizing: "border-box",
        fontFamily:
          "'Inter',sans-serif",
      }}
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <section
        style={{
          background: "#FFFFFF",
          border:
            "1px solid #E2E8F0",
          borderRadius:
            isMobile
              ? "18px"
              : "24px",
          padding:
            isMobile
              ? "13px"
              : "18px",
          marginBottom: "12px",
          boxShadow:
            "0 8px 25px rgba(15,23,42,.05)",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: 0,
            flex: 1,
          }}
        >

          <div
            style={{
              width:
                isMobile
                  ? "46px"
                  : "56px",
              height:
                isMobile
                  ? "46px"
                  : "56px",
              flexShrink: 0,
              borderRadius: "15px",
              background:
                "linear-gradient(135deg,#2563EB,#1D4ED8)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize:
                isMobile
                  ? "19px"
                  : "23px",
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
                  isMobile
                    ? "17px"
                    : "22px",
                fontWeight: 900,
              }}
            >

              Suivi de livraison

            </h1>


            <div
              style={{
                marginTop: "3px",
                color: "#64748B",
                fontSize:
                  isMobile
                    ? "10px"
                    : "12px",
              }}
            >

              📦 Commande{" "}

              <strong
                style={{
                  color: "#2563EB",
                }}
              >

                {orderReference}

              </strong>

            </div>

          </div>

        </div>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background:
              statusInfo.bg,
            color:
              statusInfo.color,
            padding:
              "8px 11px",
            borderRadius:
              "999px",
            fontSize:
              isMobile
                ? "9px"
                : "11px",
            fontWeight: 900,
            whiteSpace: "nowrap",
          }}
        >

          <FaCircle
            style={{
              fontSize: "6px",
            }}
          />

          {statusInfo.label}

        </div>

      </section>


      {/* =================================================
          INFORMATIONS COMMANDE
      ================================================= */}

      <section
        style={{
          background: "#FFFFFF",
          border:
            "1px solid #E2E8F0",
          borderRadius:
            isMobile
              ? "20px"
              : "24px",
          padding:
            isMobile
              ? "14px"
              : "20px",
          marginBottom: "12px",
          boxShadow:
            "0 8px 25px rgba(15,23,42,.05)",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "13px",
              background: "#EFF6FF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <FaShoppingBag />

          </div>


          <div>

            <h2
              style={{
                margin: 0,
                color: "#0F172A",
                fontSize:
                  isMobile
                    ? "17px"
                    : "20px",
                fontWeight: 900,
              }}
            >

              📦 Votre commande

            </h2>


            <span
              style={{
                color: "#64748B",
                fontSize: "10px",
              }}
            >

              {order.items?.length || 0}
              {" "}article(s)

            </span>

          </div>

        </div>


        {(order.items || []).map(
          (
            item,
            index
          ) => (

            <div
              key={
                item.productId ||
                item._id ||
                index
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "9px",
                marginBottom: "7px",
                background: "#F8FAFC",
                border:
                  "1px solid #E2E8F0",
                borderRadius: "14px",
              }}
            >

              <img
                src={
                  item.image ||
                  "/logo.jpg"
                }
                alt={
                  item.name ||
                  "Produit"
                }
                style={{
                  width:
                    isMobile
                      ? "50px"
                      : "62px",
                  height:
                    isMobile
                      ? "50px"
                      : "62px",
                  borderRadius: "11px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
                onError={(e) => {

                  e.currentTarget.src =
                    "/logo.jpg";

                }}
              />


              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >

                <strong
                  style={{
                    display: "block",
                    color: "#0F172A",
                    fontSize:
                      isMobile
                        ? "12px"
                        : "14px",
                    overflow: "hidden",
                    textOverflow:
                      "ellipsis",
                    whiteSpace:
                      "nowrap",
                  }}
                >

                  {item.name}

                </strong>


                <span
                  style={{
                    color: "#64748B",
                    fontSize: "10px",
                  }}
                >

                  📦 Quantité :
                  {" "}
                  {item.quantity}

                </span>

              </div>


              <strong
                style={{
                  color: "#0F172A",
                  fontSize:
                    isMobile
                      ? "11px"
                      : "14px",
                  whiteSpace:
                    "nowrap",
                }}
              >

                {Number(
                  item.price || 0
                ).toLocaleString(
                  "fr-FR"
                )}

                {" "}FCFA

              </strong>

            </div>

          )
        )}


        <div
          style={{
            marginTop: "13px",
            paddingTop: "13px",
            borderTop:
              "1px solid #E2E8F0",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: "7px",
              color: "#64748B",
              fontSize: "11px",
            }}
          >

            <span>
              🛒 Produits
            </span>

            <strong
              style={{
                color: "#0F172A",
              }}
            >

              {productsTotal.toLocaleString(
                "fr-FR"
              )} FCFA

            </strong>

          </div>


          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: "9px",
              color: "#64748B",
              fontSize: "11px",
            }}
          >

            <span>
              🚚 Livraison
            </span>

            <strong
              style={{
                color: "#0F172A",
              }}
            >

              {Number(
                order.shipping || 0
              ).toLocaleString(
                "fr-FR"
              )} FCFA

            </strong>

          </div>


          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "10px",
              padding: "13px",
              background: "#EFF6FF",
              borderRadius: "14px",
              color: "#1D4ED8",
            }}
          >

            <strong>
              💰 TOTAL
            </strong>

            <strong
              style={{
                fontSize:
                  isMobile
                    ? "16px"
                    : "20px",
              }}
            >

              {Number(
                order.total || 0
              ).toLocaleString(
                "fr-FR"
              )} FCFA

            </strong>

          </div>


          <div
            style={{
              marginTop: "9px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748B",
              fontSize: "10px",
            }}
          >

            <FaCreditCard />

            💳 {paymentMethod}

          </div>

        </div>

      </section>


      {/* =================================================
          LIVREUR
      ================================================= */}

      {assignedDriver ? (

        <section
          style={{
            background:
              "linear-gradient(135deg,#EFF6FF,#FFFFFF)",
            border:
              "1px solid #BFDBFE",
            borderRadius:
              isMobile
                ? "20px"
                : "24px",
            padding:
              isMobile
                ? "15px"
                : "20px",
            marginBottom: "12px",
            boxShadow:
              "0 10px 28px rgba(37,99,235,.08)",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >

            {driverPhoto ? (

              <img
                src={driverPhoto}
                alt={
                  assignedDriver.name ||
                  "Livreur"
                }
                onError={(e) => {

                  e.currentTarget.style.display =
                    "none";

                  if (
                    e.currentTarget
                      .nextElementSibling
                  ) {

                    e.currentTarget
                      .nextElementSibling
                      .style.display =
                      "flex";

                  }

                }}
                style={{
                  width:
                    isMobile
                      ? "68px"
                      : "82px",
                  height:
                    isMobile
                      ? "68px"
                      : "82px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border:
                    "4px solid #DBEAFE",
                  flexShrink: 0,
                }}
              />

            ) : null}


            <div
              style={{
                display:
                  driverPhoto
                    ? "none"
                    : "flex",
                width:
                  isMobile
                    ? "68px"
                    : "82px",
                height:
                  isMobile
                    ? "68px"
                    : "82px",
                borderRadius: "50%",
                background: "#DBEAFE",
                color: "#2563EB",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "29px",
                flexShrink: 0,
              }}
            >

              <FaUser />

            </div>


            <div
              style={{
                minWidth: 0,
                flex: 1,
              }}
            >

              <div
                style={{
                  color: "#64748B",
                  fontSize: "9px",
                  fontWeight: 900,
                  textTransform:
                    "uppercase",
                }}
              >

                🚚 Votre livreur

              </div>


              <h2
                style={{
                  margin:
                    "3px 0 5px",
                  color: "#0F172A",
                  fontSize:
                    isMobile
                      ? "18px"
                      : "22px",
                  fontWeight: 900,
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace:
                    "nowrap",
                }}
              >

                {assignedDriver.name ||
                  "Livreur assigné"}

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
                  fontWeight: 800,
                }}
              >

                <FaSignal />

                {gpsOnline
                  ? "GPS en direct"
                  : "GPS hors ligne"}

              </div>

            </div>

          </div>


          {/* INFOS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                isMobile
                  ? "1fr 1fr"
                  : "repeat(3,1fr)",
              gap: "8px",
              marginTop: "14px",
            }}
          >

            <div
              style={{
                background: "#FFFFFF",
                padding: "10px",
                borderRadius: "13px",
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <small
                style={{
                  color: "#94A3B8",
                  fontSize: "8px",
                  fontWeight: 900,
                }}
              >

                📞 TÉLÉPHONE

              </small>


              <strong
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "#0F172A",
                  fontSize: "11px",
                  wordBreak:
                    "break-word",
                }}
              >

                {driverPhone ||
                  "Non renseigné"}

              </strong>

            </div>


            <div
              style={{
                background: "#FFFFFF",
                padding: "10px",
                borderRadius: "13px",
                border:
                  "1px solid #E2E8F0",
              }}
            >

              <small
                style={{
                  color: "#94A3B8",
                  fontSize: "8px",
                  fontWeight: 900,
                }}
              >

                🏍️ VÉHICULE

              </small>


              <strong
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "#0F172A",
                  fontSize: "11px",
                }}
              >

                {assignedDriver.vehicle ||
                  "Non renseigné"}

              </strong>

            </div>


            <div
              style={{
                background: "#FFFFFF",
                padding: "10px",
                borderRadius: "13px",
                border:
                  "1px solid #E2E8F0",
                gridColumn:
                  isMobile
                    ? "1 / -1"
                    : "auto",
              }}
            >

              <small
                style={{
                  color: "#94A3B8",
                  fontSize: "8px",
                  fontWeight: 900,
                }}
              >

                🔢 PLAQUE

              </small>


              <strong
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "#0F172A",
                  fontSize: "11px",
                }}
              >

                {assignedDriver.plate ||
                  "Non renseignée"}

              </strong>

            </div>

          </div>


          {/* APPEL */}

          {driverPhone && (

            <a
              href={
                `tel:${driverPhone}`
              }
              style={{
                marginTop: "10px",
                width: "100%",
                boxSizing:
                  "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                gap: "8px",
                textDecoration:
                  "none",
                background:
                  "linear-gradient(135deg,#16A34A,#22C55E)",
                color: "#FFFFFF",
                padding: "13px",
                borderRadius: "14px",
                fontSize: "12px",
                fontWeight: 900,
              }}
            >

              <FaPhoneAlt />

              📞 Appeler le livreur

            </a>

          )}

        </section>

      ) : (

        <section
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "18px",
            padding: "15px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#64748B",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >

          <FaBoxOpen
            style={{
              color: "#2563EB",
              fontSize: "22px",
              flexShrink: 0,
            }}
          />

          <span>

            ⏳ Aucun livreur n'est encore
            assigné à cette commande.

            <br />

            <small
              style={{
                display: "block",
                marginTop: "4px",
                color: "#94A3B8",
                fontWeight: 500,
              }}
            >

              Le premier livreur disponible
              qui accepte la commande
              sera affiché ici.

            </small>

          </span>

        </section>

      )}


      {/* =================================================
          QR CODE
      ================================================= */}

      {order.status ===
        "En livraison" &&
        qrValue && (

        <section
          style={{
            background:
              "linear-gradient(145deg,#FFFFFF,#F8FAFC)",
            border:
              "1px solid #CBD5E1",
            borderRadius:
              isMobile
                ? "22px"
                : "28px",
            padding:
              isMobile
                ? "20px 14px"
                : "28px",
            marginBottom: "12px",
            textAlign: "center",
            boxShadow:
              "0 12px 35px rgba(15,23,42,.08)",
          }}
        >

          <div
            style={{
              width: "54px",
              height: "54px",
              margin:
                "0 auto 11px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg,#2563EB,#4F46E5)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >

            <FaQrcode />

          </div>


          <h2
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize:
                isMobile
                  ? "19px"
                  : "24px",
              fontWeight: 900,
            }}
          >

            🔐 QR de livraison

          </h2>


          <p
            style={{
              margin:
                "8px auto 17px",
              maxWidth: "390px",
              color: "#64748B",
              fontSize:
                isMobile
                  ? "12px"
                  : "14px",
              lineHeight: 1.6,
            }}
          >

            📱 Présentez ce code au livreur
            lors de la réception.

            <br />

            <strong
              style={{
                color: "#1D4ED8",
              }}
            >

              🔒 Le scan est nécessaire
              pour confirmer la livraison.

            </strong>

          </p>


          <div
            style={{
              width: "fit-content",
              maxWidth: "100%",
              margin: "0 auto",
              padding:
                isMobile
                  ? "12px"
                  : "18px",
              background: "#FFFFFF",
              borderRadius: "20px",
              border:
                "1px solid #E2E8F0",
              boxShadow:
                "0 10px 25px rgba(15,23,42,.08)",
              boxSizing: "border-box",
            }}
          >

            <QRCodeSVG
              value={qrValue}
              size={
                isMobile
                  ? 210
                  : 260
              }
              level="H"
              includeMargin={true}
            />

          </div>


          <div
            style={{
              marginTop: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              gap: "7px",
              color: "#2563EB",
              fontSize: "10px",
              fontWeight: 800,
            }}
          >

            <FaShieldAlt />

            🔒 QR sécurisé • Commande unique

          </div>


          <div
            style={{
              marginTop: "11px",
              padding: "11px",
              borderRadius: "13px",
              background: "#EFF6FF",
              color: "#1E40AF",
              fontSize: "10px",
              lineHeight: 1.5,
            }}
          >

            📌 Gardez cette page ouverte
            lorsque le livreur arrive.

          </div>

        </section>

      )}


      {/* =================================================
          STATISTIQUES
      ================================================= */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3,minmax(0,1fr))",
          gap:
            isMobile
              ? "7px"
              : "12px",
          marginBottom: "12px",
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
              isMobile
                ? "11px"
                : "15px",
          }}
        >

          <FaClock
            style={{
              fontSize:
                isMobile
                  ? "13px"
                  : "17px",
            }}
          />


          <div
            style={{
              marginTop: "5px",
              fontSize:
                isMobile
                  ? "14px"
                  : "22px",
              fontWeight: 900,
            }}
          >

            {estimatedTime}

          </div>


          <small
            style={{
              fontSize:
                isMobile
                  ? "8px"
                  : "10px",
            }}
          >

            ⏱️ ETA

          </small>

        </div>


        {/* DISTANCE */}

        <div
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "16px",
            padding:
              isMobile
                ? "11px"
                : "15px",
          }}
        >

          <FaRoute
            style={{
              color: "#2563EB",
              fontSize:
                isMobile
                  ? "13px"
                  : "17px",
            }}
          />


          <div
            style={{
              marginTop: "5px",
              color: "#0F172A",
              fontSize:
                isMobile
                  ? "14px"
                  : "22px",
              fontWeight: 900,
            }}
          >

            {distanceText}

          </div>


          <small
            style={{
              color: "#64748B",
              fontSize:
                isMobile
                  ? "8px"
                  : "10px",
            }}
          >

            📍 Distance

          </small>

        </div>


        {/* VITESSE */}

        <div
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "16px",
            padding:
              isMobile
                ? "11px"
                : "15px",
          }}
        >

          <FaMotorcycle
            style={{
              color: "#7C3AED",
              fontSize:
                isMobile
                  ? "13px"
                  : "17px",
            }}
          />


          <div
            style={{
              marginTop: "5px",
              color: "#0F172A",
              fontSize:
                isMobile
                  ? "14px"
                  : "22px",
              fontWeight: 900,
            }}
          >

            {liveSpeed || "--"}

          </div>


          <small
            style={{
              color: "#64748B",
              fontSize:
                isMobile
                  ? "8px"
                  : "10px",
            }}
          >

            🏍️ km/h

          </small>

        </div>

      </section>


      {/* =================================================
          CARTE
      ================================================= */}

      <section
        style={{
          background: "#FFFFFF",
          borderRadius:
            isMobile
              ? "20px"
              : "28px",
          overflow: "hidden",
          border:
            "1px solid #E2E8F0",
          boxShadow:
            "0 12px 35px rgba(15,23,42,.08)",
          position: "relative",
          marginBottom: "12px",
        }}
      >

        {/* CARTE HEADER */}

        <div
          style={{
            position: "absolute",
            top: "11px",
            left: "11px",
            right: "11px",
            zIndex: 999,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "7px",
            pointerEvents: "none",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background:
                "rgba(255,255,255,.96)",
              color: "#0F172A",
              padding:
                "7px 10px",
              borderRadius:
                "999px",
              fontSize:
                isMobile
                  ? "8px"
                  : "10px",
              fontWeight: 900,
              boxShadow:
                "0 6px 18px rgba(15,23,42,.15)",
            }}
          >

            <FaMap
              style={{
                color: "#2563EB",
              }}
            />

            📍 Suivi en direct

          </div>


          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "#0F172A",
              color: "#FFFFFF",
              padding:
                "7px 9px",
              borderRadius:
                "999px",
              fontSize:
                isMobile
                  ? "8px"
                  : "9px",
              fontWeight: 900,
            }}
          >

            <FaCircle
              style={{
                color:
                  gpsOnline
                    ? "#22C55E"
                    : "#94A3B8",
                fontSize: "5px",
              }}
            />

            {gpsStatus}

          </div>

        </div>


        <MapContainer
          center={
            driverPosition ||
            customerPosition
          }
          zoom={
            isMobile
              ? 14
              : 13
          }
          zoomControl={false}
          style={{
            width: "100%",
            height:
              isMobile
                ? "56vh"
                : "650px",
            minHeight:
              isMobile
                ? "420px"
                : "520px",
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


          <TileLayer
            attribution="
              &copy; OpenStreetMap contributors
            "
            url="
              https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=9JxhpJjsI1LkjTuEYlOC
            "
          />


          {/* TRAJET */}

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
                    isMobile
                      ? 11
                      : 18,
                  opacity: .20,
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
                  color: "#2563EB",
                  weight:
                    isMobile
                      ? 4
                      : 7,
                  opacity: 1,
                  lineCap:
                    "round",
                  lineJoin:
                    "round",
                }}
              />

            </>

          )}


          {/* ZONE GPS */}

          {driverPosition && (

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
                  .10,
                weight: 2,
              }}
            />

          )}


          {/* LIVREUR */}

          {driverPosition && (

            <Marker
              position={
                driverPosition
              }
              icon={driverIcon}
            >

              <Popup>

                <div
                  style={{
                    minWidth:
                      "215px",
                    fontFamily:
                      "Inter,sans-serif",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "9px",
                    }}
                  >

                    {driverPhoto ? (

                      <img
                        src={
                          driverPhoto
                        }
                        alt="Livreur"
                        style={{
                          width:
                            "50px",
                          height:
                            "50px",
                          borderRadius:
                            "50%",
                          objectFit:
                            "cover",
                        }}
                      />

                    ) : (

                      <div
                        style={{
                          width:
                            "50px",
                          height:
                            "50px",
                          borderRadius:
                            "50%",
                          background:
                            "#DBEAFE",
                          color:
                            "#2563EB",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontSize:
                            "20px",
                        }}
                      >

                        <FaUser />

                      </div>

                    )}


                    <div>

                      <strong
                        style={{
                          color:
                            "#0F172A",
                          fontSize:
                            "14px",
                        }}
                      >

                        {assignedDriver?.name ||
                          "Livreur"}

                      </strong>


                      <div
                        style={{
                          color:
                            "#16A34A",
                          fontSize:
                            "10px",
                          fontWeight:
                            800,
                          marginTop:
                            "3px",
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
                      marginTop:
                        "11px",
                      paddingTop:
                        "9px",
                      borderTop:
                        "1px solid #E2E8F0",
                      color:
                        "#475569",
                      fontSize:
                        "11px",
                      lineHeight:
                        1.8,
                    }}
                  >

                    📞{" "}
                    {driverPhone ||
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

                    📍{" "}
                    {distanceText}

                    <br />

                    ⏱️{" "}
                    {estimatedTime}

                  </div>

                </div>

              </Popup>

            </Marker>

          )}


          {/* CLIENT */}

          <Marker
            position={
              customerPosition
            }
            icon={
              customerIcon
            }
          >

            <Popup>

              <div
                style={{
                  minWidth:
                    "200px",
                }}
              >

                <strong
                  style={{
                    color:
                      "#0F172A",
                    fontSize:
                      "14px",
                  }}
                >

                  <FaMapMarkerAlt
                    style={{
                      color:
                        "#EF4444",
                    }}
                  />

                  {" "}
                  Destination

                </strong>


                <p
                  style={{
                    color:
                      "#64748B",
                    fontSize:
                      "11px",
                    lineHeight:
                      1.5,
                  }}
                >

                  {order.address ||
                    "Adresse de livraison"}

                </p>


                <strong
                  style={{
                    color:
                      "#64748B",
                    fontSize:
                      "10px",
                  }}
                >

                  🏙️ {order.city}

                  {" • "}

                  📌 {order.district}

                </strong>

              </div>

            </Popup>

          </Marker>

        </MapContainer>

      </section>


      {/* =================================================
          PROGRESSION
      ================================================= */}

      {order.status ===
        "En livraison" && (

        <section
          style={{
            background: "#FFFFFF",
            border:
              "1px solid #E2E8F0",
            borderRadius: "18px",
            padding:
              isMobile
                ? "14px"
                : "17px",
            marginBottom: "12px",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "9px",
              color: "#475569",
              fontSize: "11px",
              fontWeight: 800,
            }}
          >

            <span>

              <FaChartLine />

              {" "}
              📈 Progression

            </span>


            <strong
              style={{
                color:
                  "#2563EB",
              }}
            >

              {Math.round(
                progress
              )}%

            </strong>

          </div>


          <div
            style={{
              height: "9px",
              background:
                "#E2E8F0",
              borderRadius:
                "999px",
              overflow:
                "hidden",
            }}
          >

            <div
              style={{
                width:
                  `${progress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg,#2563EB,#3B82F6)",
                borderRadius:
                  "999px",
                transition:
                  "width .5s ease",
              }}
            />

          </div>


          {gpsTime && (

            <div
              style={{
                marginTop:
                  "8px",
                color:
                  "#94A3B8",
                fontSize:
                  "9px",
                textAlign:
                  "right",
              }}
            >

              📡 Dernière position :
              {" "}
              {gpsTime}

            </div>

          )}

        </section>

      )}


      {/* =================================================
          COMMANDE LIVRÉE
      ================================================= */}

      {order.status ===
        "Livrée" && (

        <section
          style={{
            background:
              "linear-gradient(135deg,#DCFCE7,#F0FDF4)",
            border:
              "1px solid #86EFAC",
            borderRadius:
              "20px",
            padding:
              isMobile
                ? "17px"
                : "20px",
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
                color:
                  "#16A34A",
                fontSize:
                  "29px",
                flexShrink: 0,
              }}
            />


            <div>

              <strong
                style={{
                  color:
                    "#166534",
                  fontSize:
                    isMobile
                      ? "17px"
                      : "19px",
                }}
              >

                ✅ Commande livrée

              </strong>


              <div
                style={{
                  color:
                    "#15803D",
                  fontSize:
                    "12px",
                  marginTop:
                    "4px",
                }}
              >

                Votre commande a été
                livrée avec succès.

              </div>

            </div>

          </div>


          {assignedDriver && (

            <div
              style={{
                marginTop:
                  "15px",
                paddingTop:
                  "13px",
                borderTop:
                  "1px solid #BBF7D0",
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "10px",
              }}
            >

              {driverPhoto ? (

                <img
                  src={
                    driverPhoto
                  }
                  alt="Livreur"
                  style={{
                    width:
                      "52px",
                    height:
                      "52px",
                    borderRadius:
                      "50%",
                    objectFit:
                      "cover",
                    border:
                      "2px solid #86EFAC",
                  }}
                />

              ) : (

                <div
                  style={{
                    width:
                      "52px",
                    height:
                      "52px",
                    borderRadius:
                      "50%",
                    background:
                      "#DCFCE7",
                    color:
                      "#16A34A",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontSize:
                      "20px",
                  }}
                >

                  <FaUser />

                </div>

              )}


              <div>

                <small
                  style={{
                    color:
                      "#166534",
                    fontWeight:
                      800,
                    fontSize:
                      "9px",
                  }}
                >

                  LIVRÉE PAR

                </small>


                <strong
                  style={{
                    display:
                      "block",
                    color:
                      "#14532D",
                    fontSize:
                      "14px",
                  }}
                >

                  {assignedDriver.name ||
                    "Livreur"}

                </strong>


                <span
                  style={{
                    color:
                      "#15803D",
                    fontSize:
                      "10px",
                  }}
                >

                  {assignedDriver.vehicle ||
                    "Véhicule"}

                  {assignedDriver.plate
                    ? ` • ${assignedDriver.plate}`
                    : ""}

                </span>

              </div>

            </div>

          )}

        </section>

      )}

    </div>

  );

}