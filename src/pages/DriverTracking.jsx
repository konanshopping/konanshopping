import {
  useEffect,
  useRef,
  useState
} from "react";

import axios from "axios";

import {
  FaTruck,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRoute,
  FaClock,
  FaRoad,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaSyncAlt,
  FaExclamationTriangle,
  FaMotorcycle,
  FaTrophy,
  FaClipboardList,
  FaSatelliteDish,
  FaUser,
  FaBox,
  FaLocationArrow,
  FaChevronRight,
  FaShippingFast,
  FaCircle,
  FaTelegramPlane,
  FaBan
} from "react-icons/fa";


// ======================================================
// 🌐 API
// ======================================================

const API = "https://konanshopping.com";


// ======================================================
// 🚚 DRIVER TRACKING
// ======================================================

export default function DriverTracking() {

  // ====================================================
  // 🔔 NOTIFICATION
  // ====================================================

  const [notification, setNotification] =
    useState(null);

  const notificationTimer =
    useRef(null);


  const notify = (
    message,
    type = "info",
    title
  ) => {

    if (notificationTimer.current) {

      clearTimeout(
        notificationTimer.current
      );

    }

    const titles = {

      success:
        "Opération réussie",

      error:
        "Une erreur est survenue",

      info:
        "Information"

    };

    setNotification({

      message:
        String(message || ""),

      type,

      title:
        title ||
        titles[type] ||
        "Notification"

    });

    notificationTimer.current =
      setTimeout(() => {

        setNotification(null);

      }, 4500);

  };


  const closeNotification = () => {

    if (notificationTimer.current) {

      clearTimeout(
        notificationTimer.current
      );

    }

    setNotification(null);

  };


  // ====================================================
  // 📦 STATES
  // ====================================================

  const [orders, setOrders] =
    useState([]);

  const [availableOrdersState, setAvailableOrdersState] =
    useState([]);

  const [myDeliveries, setMyDeliveries] =
    useState([]);

  const [driver, setDriver] =
    useState(null);

  const [isTracking, setIsTracking] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("available");

  const [refusedOrders, setRefusedOrders] =
    useState([]);

  const [clientAddresses, setClientAddresses] =
    useState({});

  const [distances, setDistances] =
    useState({});

  const [etas, setEtas] =
    useState({});

  const [connectingTelegram, setConnectingTelegram] =
    useState(false);

  const [telegramConnected, setTelegramConnected] =
    useState(false);

  const [telegramUsername, setTelegramUsername] =
    useState("");


  const watchIdsRef =
    useRef({});

  const mountedRef =
    useRef(true);

  // 🔒 Commandes acceptées par CE livreur.
  // Empêche un auto-refresh de les faire disparaître
  // avant que /api/orders confirme l'assignation.
  const locallyAcceptedRef =
    useRef({});


  // ====================================================
  // 🖼️ PHOTO LIVREUR
  // ====================================================

  const getDriverPhotoUrl = (photo) => {

    if (!photo) {
      return "";
    }

    // Ancienne URL locale
    if (
      photo.includes(
        "http://localhost:5000"
      )
    ) {

      return photo.replace(
        "http://localhost:5000",
        API
      );

    }

    // Ancienne URL localhost HTTPS
    if (
      photo.includes(
        "https://localhost:5000"
      )
    ) {

      return photo.replace(
        "https://localhost:5000",
        API
      );

    }

    // Photo relative
    if (
      photo.startsWith("/uploads/")
    ) {

      return `${API}${photo}`;

    }

    return photo;

  };


  // ====================================================
  // 👤 CHARGER LE LIVREUR
  // ====================================================

  useEffect(() => {

    try {

      const savedDriver =
        JSON.parse(
          localStorage.getItem(
            "driver"
          ) || "null"
        );

      if (!savedDriver) {

        setDriver(null);

        return;

      }

      setDriver(savedDriver);

      setTelegramConnected(
        savedDriver.telegramConnected === true
      );

      setTelegramUsername(
        savedDriver.telegramUsername || ""
      );

    } catch (error) {

      console.error(
        "❌ DRIVER STORAGE:",
        error
      );

      localStorage.removeItem(
        "driver"
      );

      setDriver(null);

    }

  }, []);


  // ====================================================
  // 🧹 CLEANUP
  // ====================================================

  useEffect(() => {

    mountedRef.current = true;

    return () => {

      mountedRef.current = false;

      Object.values(
        watchIdsRef.current
      ).forEach(
        (watchId) => {

          try {

            navigator.geolocation.clearWatch(
              watchId
            );

          } catch {}

        }
      );

      watchIdsRef.current = {};

      if (
        notificationTimer.current
      ) {

        clearTimeout(
          notificationTimer.current
        );

      }

    };

  }, []);


  // ====================================================
  // 📏 DISTANCE
  // ====================================================

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {

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
        lat1 *
        Math.PI /
        180
      ) *

      Math.cos(
        lat2 *
        Math.PI /
        180
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

  };


  // ====================================================
  // 📍 ADRESSE CLIENT
  // ====================================================

  const getClientAddress = async (
    order
  ) => {

    if (
      !order?.location ||
      order.location.lat === undefined ||
      order.location.lng === undefined
    ) {

      return;

    }

    if (
      clientAddresses[order._id]
    ) {

      return;

    }

    try {

      const response =
        await axios.get(

          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${order.location.lat}&lon=${order.location.lng}`,

          {
            headers: {
              "Accept-Language": "fr"
            }
          }

        );

      if (
        response.data?.display_name &&
        mountedRef.current
      ) {

        setClientAddresses(
          previous => ({

            ...previous,

            [order._id]:
              response.data.display_name

          })
        );

      }

    } catch (error) {

      console.log(
        "Reverse GPS:",
        error
      );

    }

  };


  // ====================================================
  // 📏 DISTANCE + ETA
  // ====================================================

  const calculateOrderDistance = (
    order
  ) => {

    if (
      !order?.location ||
      order.location.lat === undefined ||
      order.location.lng === undefined
    ) {

      return;

    }

    if (
      !navigator.geolocation
    ) {

      return;

    }

    navigator.geolocation.getCurrentPosition(

      position => {

        const driverLat =
          position.coords.latitude;

        const driverLng =
          position.coords.longitude;

        const km =
          calculateDistance(

            driverLat,
            driverLng,

            Number(order.location.lat),
            Number(order.location.lng)

          );

        if (!mountedRef.current) {
          return;
        }

        setDistances(
          previous => ({

            ...previous,

            [order._id]:
              `${km.toFixed(1)} km`

          })
        );

        const speed = 35;

        const minutes =
          Math.max(
            1,
            Math.round(
              (km / speed) * 60
            )
          );

        setEtas(
          previous => ({

            ...previous,

            [order._id]:
              `${minutes} min`

          })
        );

      },

      error => {

        console.log(
          "GPS distance:",
          error
        );

      },

      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }

    );

  };


  // ====================================================
  // 📦 COMMANDES DISPONIBLES
  // ====================================================

  const fetchAvailableOrders =
    async () => {

      try {

        const response =
          await axios.get(
            `${API}/api/driver-orders`
          );

        const list =
          Array.isArray(response.data)
            ? response.data
            : Array.isArray(
                response.data?.orders
              )
              ? response.data.orders
              : [];

        if (
          !mountedRef.current
        ) {

          return list;

        }

        setAvailableOrdersState(
          list
        );

        list.forEach(
          order => {

            if (
              order.location?.lat !== undefined &&
              order.location?.lng !== undefined
            ) {

              calculateOrderDistance(
                order
              );

              getClientAddress(
                order
              );

            }

          }
        );

        return list;

      } catch (error) {

        console.error(
          "❌ COMMANDES DISPONIBLES:",
          error.response?.data ||
          error.message
        );

        if (
          mountedRef.current
        ) {

          setAvailableOrdersState([]);

        }

        return [];

      }

    };


  // ====================================================
  // 🚚 MES LIVRAISONS
  // ====================================================

  const fetchMyDeliveries =
    async () => {

      try {

        const response =
          await axios.get(
            `${API}/api/orders`
          );

        const list =
          Array.isArray(response.data)
            ? response.data
            : Array.isArray(
                response.data?.orders
              )
              ? response.data.orders
              : [];

        const serverMine =
          list.filter(
            order => {

              const assignedId =
                typeof order.assignedDriver ===
                "string"

                  ? order.assignedDriver

                  : (
                      order.assignedDriver?.id ||
                      order.assignedDriver?._id ||
                      ""
                    );

              return (
                String(assignedId) ===
                String(driver?._id)
              );

            }
          );

        // Les commandes déjà confirmées par le serveur
        // n'ont plus besoin d'être protégées localement.
        serverMine.forEach(order => {

          delete locallyAcceptedRef.current[
            String(order._id)
          ];

        });

        // Fusion serveur + commandes acceptées localement.
        // Une commande acceptée ne disparaît donc jamais
        // pendant un auto-refresh de 5 secondes.
        const merged = [
          ...serverMine
        ];

        Object.values(
          locallyAcceptedRef.current
        ).forEach(
          localOrder => {

            const exists =
              merged.some(
                order =>
                  String(order._id) ===
                  String(localOrder._id)
              );

            if (!exists) {

              merged.push(
                localOrder
              );

            }

          }
        );

        if (
          !mountedRef.current
        ) {

          return merged;

        }

        setMyDeliveries(
          merged
        );

        setOrders(
          list
        );

        merged.forEach(
          order => {

            if (
              order.location?.lat !== undefined &&
              order.location?.lng !== undefined
            ) {

              calculateOrderDistance(
                order
              );

              getClientAddress(
                order
              );

            }

          }
        );

        return merged;

      } catch (error) {

        console.error(
          "❌ MES LIVRAISONS:",
          error.response?.data ||
          error.message
        );

        // Ne jamais vider les livraisons à cause
        // d'une erreur réseau / proxy / refresh.
        return Object.values(
          locallyAcceptedRef.current
        );

      }

    };

  // ====================================================
  // 🔄 SYNCHRONISATION
  // ====================================================

  const syncDriverCenter =
    async () => {

      if (!driver?._id) {
        return;
      }

      try {

        setIsRefreshing(true);

        await Promise.all([
          fetchAvailableOrders(),
          fetchMyDeliveries()
        ]);

      } finally {

        if (
          mountedRef.current
        ) {

          setIsRefreshing(false);

        }

      }

    };


  // ====================================================
  // 🔄 AUTO REFRESH
  // ====================================================

  useEffect(() => {

    if (!driver?._id) {
      return;
    }

    syncDriverCenter();

    const interval =
      setInterval(
        () => {

          syncDriverCenter();

        },
        5000
      );

    return () => {

      clearInterval(
        interval
      );

    };

  }, [driver?._id]);


  // ====================================================
  // 📲 TELEGRAM
  // ====================================================

  const connectTelegram =
    async () => {

      if (!driver?._id) {

        notify(
          "Livreur non connecté.",
          "error"
        );

        return;

      }

      try {

        setConnectingTelegram(
          true
        );

        const response =
          await axios.post(

            `${API}/driver/${driver._id}/telegram-connect`

          );

        if (
          response.data?.success &&
          response.data?.telegramUrl
        ) {

          window.open(
            response.data.telegramUrl,
            "_blank",
            "noopener,noreferrer"
          );

          notify(
            "Ouvrez Telegram pour terminer la connexion.",
            "success",
            "Telegram"
          );

        } else {

          notify(
            "Impossible de générer le lien Telegram.",
            "error",
            "Telegram"
          );

        }

      } catch (error) {

        console.error(
          "❌ TELEGRAM:",
          error
        );

        notify(
          error.response?.data?.message ||
          "Impossible de connecter Telegram.",
          "error",
          "Telegram"
        );

      } finally {

        setConnectingTelegram(
          false
        );

      }

    };


  // ====================================================
  // 🚚 ACCEPTER UNE COMMANDE
  // ====================================================

  const acceptOrder =
    async (
      orderId
    ) => {

      if (!driver?._id) {

        notify(
          "Livreur non connecté.",
          "error"
        );

        return;

      }

      // IMPORTANT :
      // On cherche d'abord dans les commandes disponibles.

      const currentOrder =
        availableOrdersState.find(
          order =>
            String(order._id) ===
            String(orderId)
        ) ||

        orders.find(
          order =>
            String(order._id) ===
            String(orderId)
        );

      if (!currentOrder) {

        notify(
          "Commande introuvable.",
          "error"
        );

        await syncDriverCenter();

        return;

      }


      // ==================================================
      // 🔒 VÉRIFICATION LOCALE
      // ==================================================

      const assignedId =

        typeof currentOrder.assignedDriver ===
        "string"

          ? currentOrder.assignedDriver

          : (
              currentOrder.assignedDriver?.id ||
              currentOrder.assignedDriver?._id ||
              ""
            );


      if (
        assignedId &&
        String(assignedId) !==
        String(driver._id)
      ) {

        notify(
          "Cette commande a déjà été prise.",
          "error"
        );

        await syncDriverCenter();

        return;

      }


      if (
        String(assignedId) ===
        String(driver._id)
      ) {

        notify(
          "Cette commande vous est déjà attribuée.",
          "info"
        );

        setActiveSection(
          "active"
        );

        return;

      }


      try {

        const response =
          await axios.put(

            `${API}/api/accept-order/${orderId}`,

            {

              driverId:
                driver._id,

              driverName:
                driver.name || "",

              driverPhone:
                driver.phone || "",

              driverPhoto:
                getDriverPhotoUrl(
                  driver.photo
                ),

              driverVehicle:
                driver.vehicle || ""

            }

          );


        const acceptedOrder =
          response.data?.order ||
          response.data?.data ||
          response.data;


        // ==================================================
        // 🧹 RETIRER DES COMMANDES DISPONIBLES
        // ==================================================

        setAvailableOrdersState(
          previous =>
            previous.filter(
              order =>
                String(order._id) !==
                String(orderId)
            )
        );


        // ==================================================
        // 🚚 CONSTRUIRE LA COMMANDE ACCEPTÉE
        // ==================================================

        const assignedDriver =
          acceptedOrder?.assignedDriver ||
          {

            id:
              driver._id,

            name:
              driver.name || "",

            phone:
              driver.phone || "",

            photo:
              getDriverPhotoUrl(
                driver.photo
              ),

            vehicle:
              driver.vehicle || ""

          };


        const localOrder = {

          ...currentOrder,

          ...(acceptedOrder || {}),

          status:
            "En livraison",

          assignedDriver

        };

        // 🔒 Verrou local : cette commande appartient
        // désormais à ce livreur. Le refresh ne doit pas
        // la retirer de "Mes livraisons".
        locallyAcceptedRef.current[
          String(orderId)
        ] = localOrder;


        // ==================================================
        // 📋 AJOUTER À MES LIVRAISONS
        // ==================================================

        setMyDeliveries(
          previous => {

            const exists =
              previous.some(
                order =>
                  String(order._id) ===
                  String(orderId)
              );

            if (exists) {

              return previous.map(
                order =>

                  String(order._id) ===
                  String(orderId)

                    ? localOrder

                    : order
              );

            }

            return [
              ...previous,
              localOrder
            ];

          }
        );


        // ==================================================
        // 🌐 METTRE À JOUR ORDERS
        // ==================================================

        setOrders(
          previous => {

            const exists =
              previous.some(
                order =>
                  String(order._id) ===
                  String(orderId)
              );

            if (!exists) {

              return [
                ...previous,
                localOrder
              ];

            }

            return previous.map(
              order =>

                String(order._id) ===
                String(orderId)

                  ? localOrder

                  : order
            );

          }
        );


        // ==================================================
        // 📱 PASSER À MES LIVRAISONS
        // ==================================================

        setActiveSection(
          "active"
        );


        // ==================================================
        // 📍 DÉMARRER GPS
        // ==================================================

        startDriverGPS(
          orderId
        );

        setIsTracking(
          true
        );


        notify(
          "La commande est maintenant dans « Mes livraisons ».",
          "success",
          "Commande acceptée"
        );


        // ==================================================
        // 🔄 SYNCHRONISATION
        // ==================================================

        setTimeout(
          () => {

            syncDriverCenter();

          },
          500
        );


      } catch (error) {

        console.error(
          "❌ ACCEPT ORDER:",
          error.response?.data ||
          error
        );


        // ==================================================
        // 409
        // ==================================================

        if (
          error.response?.status ===
          409
        ) {

          setAvailableOrdersState(
            previous =>
              previous.filter(
                order =>
                  String(order._id) !==
                  String(orderId)
              )
          );

          notify(
            "Cette commande vient d'être acceptée par un autre livreur.",
            "error",
            "Commande indisponible"
          );

          await syncDriverCenter();

          return;

        }


        notify(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Impossible d'accepter la commande.",
          "error"
        );

      }

    };


  // ====================================================
  // 📍 GPS LIVREUR
  // ====================================================

  const startDriverGPS =
    (
      orderId
    ) => {

      if (
        !navigator.geolocation
      ) {

        notify(
          "La géolocalisation n'est pas disponible sur cet appareil.",
          "error",
          "GPS"
        );

        return;

      }


      if (
        watchIdsRef.current[orderId]
      ) {

        navigator.geolocation.clearWatch(
          watchIdsRef.current[orderId]
        );

      }


      const watchId =
        navigator.geolocation.watchPosition(

          async position => {

            try {

              const lat =
                position.coords.latitude;

              const lng =
                position.coords.longitude;


              await axios.put(

                `${API}/api/order-location/${orderId}`,

                {

                  driverId:
                    driver._id,

                  lat,

                  lng

                }

              );

            } catch (error) {

              console.log(
                "❌ GPS SERVEUR:",
                error.response?.data ||
                error.message
              );

            }

          },

          error => {

            console.log(
              "❌ GPS:",
              error
            );

          },

          {

            enableHighAccuracy:
              true,

            maximumAge:
              0,

            timeout:
              10000

          }

        );


      watchIdsRef.current[
        orderId
      ] = watchId;

    };


  // ====================================================
  // 🛑 STOP GPS
  // ====================================================

  const stopGPS =
    (
      orderId
    ) => {

      if (
        watchIdsRef.current[
          orderId
        ]
      ) {

        try {

          navigator.geolocation.clearWatch(
            watchIdsRef.current[
              orderId
            ]
          );

        } catch {}

        delete watchIdsRef.current[
          orderId
        ];

      }

    };


  // ====================================================
  // 🚫 REFUSER
  // ====================================================

  const refuseOrder =
    (
      orderId
    ) => {

      setRefusedOrders(
        previous => {

          if (
            previous.includes(
              orderId
            )
          ) {

            return previous;

          }

          return [
            ...previous,
            orderId
          ];

        }
      );

      notify(
        "Commande ignorée.",
        "info"
      );

    };


  // ====================================================
  // ✅ LIVRER
  // ====================================================

  const finishDelivery =
    async (
      orderId
    ) => {

      if (!driver?._id) {

        return;

      }

      try {

        await axios.put(

          `${API}/api/driver-deliver/${orderId}`,

          {

            driverId:
              driver._id

          }

        );


        stopGPS(
          orderId
        );

        delete locallyAcceptedRef.current[
          String(orderId)
        ];


        const updatedOrder =
          {

            ...myDeliveries.find(
              order =>
                String(order._id) ===
                String(orderId)
            ),

            status:
              "Livrée"

          };


        setMyDeliveries(
          previous =>
            previous.map(
              order =>

                String(order._id) ===
                String(orderId)

                  ? updatedOrder

                  : order
            )
        );


        setOrders(
          previous =>
            previous.map(
              order =>

                String(order._id) ===
                String(orderId)

                  ? {

                      ...order,

                      status:
                        "Livrée"

                    }

                  : order
            )
        );


        notify(
          "La commande a été livrée avec succès.",
          "success",
          "Livraison terminée"
        );


        await syncDriverCenter();


      } catch (error) {

        console.error(
          "❌ LIVRAISON:",
          error.response?.data ||
          error.message
        );

        notify(
          error.response?.data?.message ||
          "Impossible de terminer la livraison.",
          "error"
        );

      }

    };


  // ====================================================
  // ❌ ANNULER
  // ====================================================

  const cancelOrder =
    async (
      orderId
    ) => {

      if (!driver?._id) {

        notify(
          "Livreur non connecté.",
          "error"
        );

        return;

      }


      try {

        const response =
          await axios.put(

            `${API}/api/driver-cancel/${orderId}`,

            {

              driverId:
                driver._id

            }

          );


        if (
          response.data?.success === false
        ) {

          throw new Error(
            response.data?.message ||
            "Impossible d'annuler la livraison."
          );

        }


        stopGPS(
          orderId
        );

        delete locallyAcceptedRef.current[
          String(orderId)
        ];


        // ==================================================
        // RETIRER DE MES LIVRAISONS
        // ==================================================

        setMyDeliveries(
          previous =>
            previous.filter(
              order =>
                String(order._id) !==
                String(orderId)
            )
        );


        // ==================================================
        // METTRE À JOUR ORDERS
        // ==================================================

        setOrders(
          previous =>
            previous.map(
              order =>

                String(order._id) ===
                String(orderId)

                  ? {

                      ...order,

                      status:
                        "En attente",

                      assignedDriver:
                        undefined

                    }

                  : order
            )
        );


        setIsTracking(
          false
        );


        notify(
          "La commande est de nouveau disponible pour tous les livreurs.",
          "success",
          "Commande remise à disposition"
        );


        await syncDriverCenter();


      } catch (error) {

        console.error(
          "❌ ANNULATION:",
          error.response?.data ||
          error.message
        );


        if (
          error.response?.status ===
          409
        ) {

          notify(
            error.response?.data?.message ||
            "Cette commande ne peut plus être annulée.",
            "error"
          );

          await syncDriverCenter();

          return;

        }


        notify(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Impossible d'annuler la livraison.",
          "error"
        );

      }

    };


  // ====================================================
  // 🗑️ SUPPRIMER
  // ====================================================

  const deleteOrder =
    async (
      orderId
    ) => {

      try {

        await axios.delete(

          `${API}/api/delete-order/${orderId}`

        );


        setMyDeliveries(
          previous =>
            previous.filter(
              order =>
                String(order._id) !==
                String(orderId)
            )
        );


        setOrders(
          previous =>
            previous.filter(
              order =>
                String(order._id) !==
                String(orderId)
            )
        );


        notify(
          "Commande supprimée.",
          "success"
        );


      } catch (error) {

        console.error(
          "❌ DELETE:",
          error.response?.data ||
          error.message
        );

        notify(
          "Impossible de supprimer la commande.",
          "error"
        );

      }

    };


  // ====================================================
  // 🚫 PAS CONNECTÉ
  // ====================================================

  if (!driver) {

    return (

      <div className="driver-login-page">

        <div className="login-card">

          <div className="login-icon">

            <FaTruck />

          </div>

          <h2>
            Centre Livreur
          </h2>

          <p>
            Aucun compte livreur connecté.
          </p>

        </div>


        <style>{`

          .driver-login-page {

            min-height:100vh;

            display:flex;

            align-items:center;

            justify-content:center;

            padding:20px;

            background:
              linear-gradient(
                135deg,
                #eff6ff,
                #f8fafc
              );

            font-family:
              Inter,
              system-ui,
              sans-serif;

          }

          .login-card {

            width:100%;

            max-width:420px;

            padding:40px 25px;

            background:white;

            border-radius:24px;

            text-align:center;

            box-shadow:
              0 20px 60px
              rgba(15,23,42,.12);

          }

          .login-icon {

            width:72px;

            height:72px;

            margin:auto;

            display:flex;

            align-items:center;

            justify-content:center;

            border-radius:20px;

            color:white;

            background:
              linear-gradient(
                135deg,
                #2563eb,
                #4f46e5
              );

            font-size:30px;

          }

          .login-card h2 {

            margin:20px 0 8px;

            font-size:24px;

          }

          .login-card p {

            margin:0;

            color:#64748b;

            font-size:15px;

          }

        `}</style>

      </div>

    );

  }


  // ====================================================
  // 📊 FILTRES
  // ====================================================

  const availableOrders =
    availableOrdersState.filter(
      order => {

        const assignedId =
          typeof order.assignedDriver ===
          "string"

            ? order.assignedDriver

            : (
                order.assignedDriver?.id ||
                order.assignedDriver?._id ||
                ""
              );

        return (
          !refusedOrders.includes(
            order._id
          ) &&

          !assignedId &&

          [
            "En attente",
            "Confirmée",
            "Préparation"
          ].includes(
            order.status
          ) &&

          order.status !==
            "Livrée" &&

          order.status !==
            "Annulée"
        );

      }
    );


  const myActiveOrders =
    myDeliveries.filter(
      order =>

        order.status !==
          "Livrée" &&

        order.status !==
          "Annulée"

    );


  const deliveredOrders =
    myDeliveries.filter(
      order =>
        order.status ===
        "Livrée"
    );


  let displayedOrders =
    availableOrders;


  if (
    activeSection ===
    "all"
  ) {

    const availableIds =
      new Set(
        availableOrders.map(
          order =>
            String(order._id)
        )
      );

    displayedOrders = [
      ...availableOrders,
      ...myActiveOrders.filter(
        order =>
          !availableIds.has(
            String(order._id)
          )
      )
    ];

  }


  if (
    activeSection ===
    "active"
  ) {

    displayedOrders =
      myActiveOrders;

  }


  if (
    activeSection ===
    "delivered"
  ) {

    displayedOrders =
      deliveredOrders;

  }


  // ====================================================
  // 📦 CARTE COMMANDE
  // ====================================================

  const renderOrder =
    (
      order
    ) => {

      const assignedDriverId =

        typeof order.assignedDriver ===
        "string"

          ? order.assignedDriver

          : (
              order.assignedDriver?.id ||
              order.assignedDriver?._id ||
              ""
            );


      const isMine =
        String(assignedDriverId) ===
        String(driver._id);


      const isAvailable =
        !order.assignedDriver &&
        [
          "En attente",
          "Confirmée",
          "Préparation"
        ].includes(
          order.status
        );


      const isDelivered =
        order.status ===
        "Livrée";


      const isCancelled =
        order.status ===
        "Annulée";


      const address =
        clientAddresses[
          order._id
        ] ||

        order.address ||

        "Localisation GPS du client";


      const distance =
        distances[
          order._id
        ] ||
        "--";


      const eta =
        etas[
          order._id
        ] ||
        "--";


      return (

        <article
          key={
            order._id
          }

          className={`
            order-card
            ${
              isAvailable
                ? "available-card"
                : ""
            }
            ${
              isMine
                ? "mine-card"
                : ""
            }
          `}
        >

          {/* HEADER */}

          <div className="order-header">

            <div className="client-info">

              <div
                className={
                  isMine
                    ? "order-icon green"
                    : "order-icon blue"
                }
              >

                <FaBoxOpen />

              </div>


              <div className="client-name">

                <h3>

                  {order.customerName ||
                    "Client"}

                </h3>

                <span>

                  #{String(
                    order._id
                  ).slice(-8)}

                </span>

              </div>

            </div>


            <div
              className={`
                status
                ${
                  isDelivered
                    ? "status-delivered"
                    : isCancelled
                    ? "status-cancelled"
                    : isMine
                    ? "status-active"
                    : "status-available"
                }
              `}
            >

              {isDelivered && (
                <>
                  <FaCheckCircle />
                  LIVRÉE
                </>
              )}

              {isCancelled && (
                <>
                  <FaTimesCircle />
                  ANNULÉE
                </>
              )}

              {isMine &&
                !isDelivered &&
                !isCancelled && (
                  <>
                    <FaTruck />
                    EN LIVRAISON
                  </>
                )}

              {isAvailable && (
                <>
                  <FaCircle />
                  DISPONIBLE
                </>
              )}

            </div>

          </div>


          {/* TOTAL */}

          <div className="total-box">

            <div>

              <small>
                TOTAL COMMANDE
              </small>

              <strong>

                {Number(
                  order.total || 0
                ).toLocaleString(
                  "fr-FR"
                )}

                {" "}FCFA

              </strong>

            </div>


            <div className="items-count">

              <FaBox />

              {order.items?.length ||
                0}

            </div>

          </div>


          {/* DESTINATION */}

          <div className="destination">

            <div className="section-label">

              <FaMapMarkerAlt />

              DESTINATION

            </div>


            <p>

              {address}

            </p>


            {order.location?.lat !==
              undefined &&

              order.location?.lng !==
              undefined && (

                <a

                  href={
                    `https://www.google.com/maps/dir/?api=1&destination=${order.location.lat},${order.location.lng}`
                  }

                  target="_blank"

                  rel="noreferrer"

                  className="map-button"

                >

                  <FaRoute />

                  OUVRIR L'ITINÉRAIRE

                  <FaChevronRight />

                </a>

              )}

          </div>


          {/* TELEPHONE */}

          {order.phone && (

            <a

              href={
                `tel:${order.phone}`
              }

              className="phone-button"

            >

              <div className="phone-icon">

                <FaPhoneAlt />

              </div>


              <div>

                <small>
                  CLIENT
                </small>

                <strong>
                  {order.phone}
                </strong>

              </div>


              <FaChevronRight />

            </a>

          )}


          {/* ETA */}

          <div className="eta-grid">

            <div className="eta-card purple">

              <FaClock />

              <div>

                <small>
                  ETA
                </small>

                <strong>
                  {eta}
                </strong>

              </div>

            </div>


            <div className="eta-card">

              <FaRoad />

              <div>

                <small>
                  DISTANCE
                </small>

                <strong>
                  {distance}
                </strong>

              </div>

            </div>

          </div>


          {/* PRODUITS */}

          {order.items?.length >
            0 && (

              <div className="products">

                <div className="section-label">

                  <FaBoxOpen />

                  PRODUITS

                </div>


                {order.items
                  .slice(
                    0,
                    4
                  )
                  .map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="product"
                        key={
                          index
                        }
                      >

                        {item.image ? (

                          <img
                            src={
                              item.image
                            }
                            alt=""
                            onError={
                              e => {

                                e.currentTarget.style.display =
                                  "none";

                              }
                            }
                          />

                        ) : (

                          <div className="product-placeholder">

                            <FaBox />

                          </div>

                        )}


                        <div>

                          <strong>

                            {item.name}

                          </strong>

                          <span>

                            Quantité ×
                            {item.quantity}

                          </span>

                        </div>

                      </div>

                    )
                  )}


                {order.items.length >
                  4 && (

                  <div className="more-products">

                    +
                    {order.items.length -
                      4}

                    {" "}autres produits

                  </div>

                )}

              </div>

            )}


          {/* ACTIONS */}

          <div className="actions">


            {/* DISPONIBLE */}

            {isAvailable && (

              <>

                <button

                  className="accept-button"

                  onClick={() =>
                    acceptOrder(
                      order._id
                    )
                  }

                >

                  <FaTruck />

                  ACCEPTER LA COMMANDE

                  <FaChevronRight />

                </button>


                <button

                  className="refuse-button"

                  onClick={() =>
                    refuseOrder(
                      order._id
                    )
                  }

                >

                  <FaBan />

                  IGNORER

                </button>

              </>

            )}


            {/* MA LIVRAISON */}

            {isMine &&
              !isDelivered &&
              !isCancelled && (

                <>

                  <button

                    className="gps-button"

                    onClick={() => {

                      startDriverGPS(
                        order._id
                      );

                      setIsTracking(
                        true
                      );

                      notify(
                        "Votre position est maintenant synchronisée.",
                        "success",
                        "GPS activé"
                      );

                    }}

                  >

                    <FaLocationArrow />

                    GPS EN DIRECT

                    <FaSatelliteDish />

                  </button>


                  <div className="action-grid">

                    <button

                      className="done-button"

                      onClick={() =>
                        finishDelivery(
                          order._id
                        )
                      }

                    >

                      <FaCheckCircle />

                      LIVRAISON TERMINÉE

                    </button>


                    <button

                      className="cancel-button"

                      onClick={() =>
                        cancelOrder(
                          order._id
                        )
                      }

                    >

                      <FaTimesCircle />

                      ANNULER

                    </button>

                  </div>

                </>

              )}


            {/* LIVRÉE */}

            {isDelivered && (

              <button

                className="delete-button"

                onClick={() =>
                  deleteOrder(
                    order._id
                  )
                }

              >

                <FaTrashAlt />

                SUPPRIMER

              </button>

            )}

          </div>

        </article>

      );

    };


  // ====================================================
  // 🎨 INTERFACE
  // ====================================================

  return (

    <>

      {/* ================================================
          🔔 NOTIFICATION
      ================================================= */}

      {notification && (

        <div
          className={`
            professional-notification
            notification-${notification.type}
          `}
        >

          <div className="notification-icon">

            {notification.type ===
              "success"

              ? <FaCheckCircle />

              : notification.type ===
                "error"

              ? <FaExclamationTriangle />

              : <FaSatelliteDish />

            }

          </div>


          <div className="notification-content">

            <strong>

              {notification.title}

            </strong>

            <span>

              {notification.message}

            </span>

          </div>


          <button
            className="notification-close"
            onClick={
              closeNotification
            }
          >

            ×

          </button>


          <div className="notification-progress" />

        </div>

      )}


      {/* ================================================
          🚚 PAGE
      ================================================= */}

      <div className="driver-page">


        {/* BACKGROUND */}

        <div className="background-icons">

          <FaTruck />

          <FaBoxOpen />

          <FaMapMarkerAlt />

          <FaMotorcycle />

          <FaShippingFast />

        </div>


        <main className="driver-container">


          {/* ==========================================
              HEADER
          =========================================== */}

          <header className="driver-header">

            <div className="header-top">

              <div className="brand">

                <div className="brand-icon">

                  <FaTruck />

                </div>


                <div>

                  <small>
                    KONAN SHOPPING
                  </small>

                  <h1>
                    Centre Livreur
                  </h1>

                </div>

              </div>


              <div className="online-badge">

                <FaCircle />

                EN LIGNE

              </div>

            </div>


            <div className="welcome">

              <div>

                <strong>

                  Bonjour{" "}

                  {driver.name ||
                    "Livreur"} 👋

                </strong>

                <span>

                  Gérez vos livraisons
                  depuis votre centre.

                </span>

              </div>


              <div className="profile">

                {driver.photo ? (

                  <img

                    src={
                      getDriverPhotoUrl(
                        driver.photo
                      )
                    }

                    alt={
                      driver.name ||
                      "Livreur"
                    }

                    onError={
                      e => {

                        e.currentTarget.style.display =
                          "none";

                        const parent =
                          e.currentTarget.parentElement;

                        if (
                          parent &&
                          !parent.querySelector(
                            ".profile-fallback"
                          )
                        ) {

                          const fallback =
                            document.createElement(
                              "div"
                            );

                          fallback.className =
                            "profile-fallback";

                          fallback.innerHTML =
                            "👤";

                          parent.appendChild(
                            fallback
                          );

                        }

                      }
                    }

                  />

                ) : (

                  <FaUser />

                )}

              </div>

            </div>

          </header>


          {/* ==========================================
              TELEGRAM
          =========================================== */}

          <section className="telegram-card">

            <div className="telegram-info">

              <div className="telegram-icon">

                <FaTelegramPlane />

              </div>


              <div>

                <strong>

                  Notifications Telegram

                </strong>

                <span>

                  {telegramConnected

                    ? telegramUsername
                      ? `@${telegramUsername}`
                      : "Telegram connecté"

                    : "Recevez les nouvelles commandes immédiatement."

                  }

                </span>

              </div>

            </div>


            {telegramConnected ? (

              <div className="telegram-connected">

                <FaCheckCircle />

                CONNECTÉ

              </div>

            ) : (

              <button

                className="telegram-button"

                onClick={
                  connectTelegram
                }

                disabled={
                  connectingTelegram
                }

              >

                <FaTelegramPlane />

                {connectingTelegram

                  ? "CONNEXION..."

                  : "CONNECTER TELEGRAM"

                }

              </button>

            )}

          </section>


          {/* ==========================================
              STATS
          =========================================== */}

          <section className="stats">

            <div className="stat-card">

              <div className="stat-icon blue">

                <FaClipboardList />

              </div>

              <div>

                <strong>

                  {availableOrders.length}

                </strong>

                <span>
                  DISPONIBLES
                </span>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon green">

                <FaTruck />

              </div>

              <div>

                <strong>

                  {myActiveOrders.length}

                </strong>

                <span>
                  MES LIVRAISONS
                </span>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon purple">

                <FaTrophy />

              </div>

              <div>

                <strong>

                  {deliveredOrders.length}

                </strong>

                <span>
                  LIVRÉES
                </span>

              </div>

            </div>

          </section>


          {/* ==========================================
              GPS
          =========================================== */}

          {isTracking && (

            <div className="gps-banner">

              <div className="gps-left">

                <FaSatelliteDish />

                <div>

                  <strong>
                    GPS EN DIRECT
                  </strong>

                  <span>

                    Votre position est
                    synchronisée.

                  </span>

                </div>

              </div>


              <div className="live-badge">

                <FaCircle />

                LIVE

              </div>

            </div>

          )}


          {/* ==========================================
              FILTRES
          =========================================== */}

          <nav className="filters">

            {[
              {
                id:
                  "all",

                label:
                  "Toutes",

                icon:
                  <FaClipboardList />,

                count:
                  availableOrders.length +
                  myActiveOrders.length

              },

              {
                id:
                  "available",

                label:
                  "Disponibles",

                icon:
                  <FaExclamationTriangle />,

                count:
                  availableOrders.length

              },

              {
                id:
                  "active",

                label:
                  "Mes livraisons",

                icon:
                  <FaTruck />,

                count:
                  myActiveOrders.length

              },

              {
                id:
                  "delivered",

                label:
                  "Livrées",

                icon:
                  <FaCheckCircle />,

                count:
                  deliveredOrders.length

              }

            ].map(
              tab => (

                <button

                  key={
                    tab.id
                  }

                  className={
                    activeSection ===
                    tab.id
                      ? "filter active"
                      : "filter"
                  }

                  onClick={() =>
                    setActiveSection(
                      tab.id
                    )
                  }

                >

                  {tab.icon}

                  <span>
                    {tab.label}
                  </span>

                  <b>
                    {tab.count}
                  </b>

                </button>

              )
            )}

          </nav>


          {/* ==========================================
              SECTION TITLE
          =========================================== */}

          <div className="section-head">

            <div>

              <h2>

                {activeSection ===
                  "available"

                  ? "Commandes disponibles"

                  : activeSection ===
                    "active"

                  ? "Mes livraisons"

                  : activeSection ===
                    "delivered"

                  ? "Livraisons terminées"

                  : "Centre des commandes"

                }

              </h2>


              <span>

                {displayedOrders.length}

                {" "}

                commande(s)

              </span>

            </div>


            <button

              className="refresh-button"

              onClick={
                syncDriverCenter
              }

              disabled={
                isRefreshing
              }

            >

              <FaSyncAlt
                className={
                  isRefreshing
                    ? "spin"
                    : ""
                }
              />

              <span>
                Actualiser
              </span>

            </button>

          </div>


          {/* ==========================================
              COMMANDES
          =========================================== */}

          <section className="orders">

            {displayedOrders.length ===
              0 ? (

              <div className="empty">

                <div className="empty-icon">

                  {activeSection ===
                    "available"

                    ? <FaBoxOpen />

                    : activeSection ===
                      "active"

                    ? <FaMotorcycle />

                    : <FaClipboardList />

                  }

                </div>


                <h3>

                  {activeSection ===
                    "available"

                    ? "Aucune commande disponible"

                    : activeSection ===
                      "active"

                    ? "Aucune livraison en cours"

                    : "Aucune commande"

                  }

                </h3>


                <p>

                  Les nouvelles commandes
                  apparaîtront automatiquement ici.

                </p>

              </div>

            ) : (

              displayedOrders.map(
                renderOrder
              )

            )}

          </section>

        </main>

      </div>


      {/* =================================================
          CSS
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
        }

        body {
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background:#f8fafc;
        }

        button,
        input {
          font-family:inherit;
        }


        /* ============================================
           PAGE
        ============================================= */

        .driver-page {

          min-height:100vh;

          width:100%;

          overflow-x:hidden;

          background:
            linear-gradient(
              180deg,
              #eef4ff 0%,
              #f8fafc 48%,
              #ffffff 100%
            );

          padding:20px;

          position:relative;

          color:#0f172a;

        }


        .driver-container {

          width:100%;

          max-width:1180px;

          margin:0 auto;

          position:relative;

          z-index:2;

        }


        /* ============================================
           BACKGROUND
        ============================================= */

        .background-icons {

          position:fixed;

          inset:0;

          pointer-events:none;

          overflow:hidden;

          z-index:0;

        }

        .background-icons svg {

          position:absolute;

          color:#2563eb;

          opacity:.025;

        }

        .background-icons svg:nth-child(1) {

          width:180px;
          height:180px;

          top:5%;
          left:2%;

          transform:rotate(-12deg);

        }

        .background-icons svg:nth-child(2) {

          width:150px;
          height:150px;

          top:35%;
          right:2%;

        }

        .background-icons svg:nth-child(3) {

          width:140px;
          height:140px;

          bottom:25%;
          left:2%;

        }

        .background-icons svg:nth-child(4) {

          width:150px;
          height:150px;

          bottom:5%;
          right:5%;

        }

        .background-icons svg:nth-child(5) {

          width:110px;
          height:110px;

          top:60%;
          left:45%;

        }


        /* ============================================
           HEADER
        ============================================= */

        .driver-header {

          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #4338ca 55%,
              #6d28d9
            );

          color:white;

          border-radius:24px;

          padding:24px;

          box-shadow:
            0 20px 50px
            rgba(37,99,235,.18);

          margin-bottom:14px;

        }

        .header-top {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:20px;

        }

        .brand {

          display:flex;

          align-items:center;

          gap:14px;

          min-width:0;

        }

        .brand-icon {

          width:52px;

          height:52px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:16px;

          background:
            rgba(255,255,255,.15);

          font-size:24px;

        }

        .brand small {

          display:block;

          font-size:10px;

          letter-spacing:1.8px;

          font-weight:900;

          opacity:.75;

        }

        .brand h1 {

          margin:4px 0 0;

          font-size:25px;

          font-weight:900;

          line-height:1.1;

        }

        .online-badge {

          display:flex;

          align-items:center;

          gap:7px;

          padding:9px 13px;

          border-radius:999px;

          background:
            rgba(255,255,255,.14);

          font-size:11px;

          font-weight:900;

          white-space:nowrap;

        }

        .online-badge svg {

          color:#4ade80;

          font-size:8px;

        }

        .welcome {

          margin-top:22px;

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:20px;

        }

        .welcome strong {

          display:block;

          font-size:17px;

          font-weight:800;

        }

        .welcome span {

          display:block;

          margin-top:5px;

          font-size:12px;

          opacity:.78;

        }

        .profile {

          width:58px;

          height:58px;

          flex-shrink:0;

          overflow:hidden;

          border-radius:50%;

          display:flex;

          align-items:center;

          justify-content:center;

          background:
            rgba(255,255,255,.16);

          border:
            2px solid
            rgba(255,255,255,.35);

          font-size:22px;

        }

        .profile img {

          width:100%;

          height:100%;

          object-fit:cover;

        }

        .profile-fallback {

          width:100%;

          height:100%;

          display:flex;

          align-items:center;

          justify-content:center;

          font-size:22px;

        }


        /* ============================================
           TELEGRAM
        ============================================= */

        .telegram-card {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:20px;

          background:white;

          border:1px solid #e2e8f0;

          border-radius:18px;

          padding:16px 18px;

          margin-bottom:14px;

          box-shadow:
            0 8px 25px
            rgba(15,23,42,.05);

        }

        .telegram-info {

          display:flex;

          align-items:center;

          gap:13px;

          min-width:0;

        }

        .telegram-icon {

          width:46px;

          height:46px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:14px;

          background:
            linear-gradient(
              135deg,
              #229ed9,
              #168ac1
            );

          color:white;

          font-size:22px;

        }

        .telegram-info strong {

          display:block;

          font-size:14px;

          font-weight:900;

        }

        .telegram-info span {

          display:block;

          margin-top:4px;

          color:#64748b;

          font-size:11px;

        }

        .telegram-button {

          min-height:42px;

          border:0;

          border-radius:11px;

          padding:0 16px;

          display:flex;

          align-items:center;

          justify-content:center;

          gap:8px;

          color:white;

          background:
            linear-gradient(
              135deg,
              #229ed9,
              #168ac1
            );

          font-size:11px;

          font-weight:900;

          cursor:pointer;

          white-space:nowrap;

        }

        .telegram-button:disabled {

          opacity:.55;

          cursor:not-allowed;

        }

        .telegram-connected {

          display:flex;

          align-items:center;

          gap:7px;

          padding:10px 14px;

          border-radius:999px;

          color:#15803d;

          background:#dcfce7;

          font-size:11px;

          font-weight:900;

          white-space:nowrap;

        }


        /* ============================================
           STATS
        ============================================= */

        .stats {

          display:grid;

          grid-template-columns:
            repeat(3,1fr);

          gap:12px;

          margin-bottom:14px;

        }

        .stat-card {

          display:flex;

          align-items:center;

          gap:13px;

          background:white;

          border:1px solid #e2e8f0;

          border-radius:17px;

          padding:16px;

          box-shadow:
            0 8px 24px
            rgba(15,23,42,.04);

        }

        .stat-icon {

          width:45px;

          height:45px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:13px;

          font-size:18px;

        }

        .stat-icon.blue {

          color:#2563eb;

          background:#dbeafe;

        }

        .stat-icon.green {

          color:#16a34a;

          background:#dcfce7;

        }

        .stat-icon.purple {

          color:#7c3aed;

          background:#ede9fe;

        }

        .stat-card strong {

          display:block;

          font-size:24px;

          line-height:1;

          font-weight:950;

        }

        .stat-card span {

          display:block;

          margin-top:5px;

          color:#64748b;

          font-size:10px;

          font-weight:900;

        }


        /* ============================================
           GPS
        ============================================= */

        .gps-banner {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:15px;

          padding:14px 17px;

          margin-bottom:14px;

          border-radius:15px;

          border:1px solid #86efac;

          background:#dcfce7;

        }

        .gps-left {

          display:flex;

          align-items:center;

          gap:11px;

        }

        .gps-left > svg {

          color:#16a34a;

          font-size:22px;

        }

        .gps-left strong {

          display:block;

          color:#166534;

          font-size:12px;

          font-weight:950;

        }

        .gps-left span {

          display:block;

          margin-top:3px;

          color:#15803d;

          font-size:10px;

        }

        .live-badge {

          display:flex;

          align-items:center;

          gap:5px;

          padding:7px 10px;

          color:white;

          background:#22c55e;

          border-radius:999px;

          font-size:9px;

          font-weight:950;

        }


        /* ============================================
           FILTERS
        ============================================= */

        .filters {

          display:flex;

          gap:8px;

          overflow-x:auto;

          scrollbar-width:none;

          padding-bottom:4px;

          margin-bottom:15px;

        }

        .filters::-webkit-scrollbar {

          display:none;

        }

        .filter {

          min-height:40px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          gap:7px;

          padding:0 13px;

          border:1px solid #dbe3ee;

          border-radius:999px;

          background:white;

          color:#475569;

          font-size:11px;

          font-weight:900;

          cursor:pointer;

        }

        .filter b {

          min-width:20px;

          height:20px;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:50%;

          background:#f1f5f9;

          font-size:9px;

        }

        .filter.active {

          color:white;

          border-color:transparent;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

        }

        .filter.active b {

          color:#2563eb;

          background:white;

        }


        /* ============================================
           SECTION
        ============================================= */

        .section-head {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:15px;

          margin-bottom:12px;

        }

        .section-head h2 {

          margin:0;

          font-size:20px;

          font-weight:950;

        }

        .section-head span {

          display:block;

          margin-top:4px;

          color:#64748b;

          font-size:11px;

        }

        .refresh-button {

          min-height:40px;

          display:flex;

          align-items:center;

          justify-content:center;

          gap:7px;

          padding:0 13px;

          border:1px solid #dbe3ee;

          border-radius:11px;

          background:white;

          color:#2563eb;

          font-size:10px;

          font-weight:900;

          cursor:pointer;

        }

        .refresh-button:disabled {

          opacity:.5;

        }

        .spin {

          animation:
            spin .8s linear infinite;

        }

        @keyframes spin {

          from {
            transform:rotate(0deg);
          }

          to {
            transform:rotate(360deg);
          }

        }


        /* ============================================
           ORDERS
        ============================================= */

        .orders {

          display:grid;

          grid-template-columns:
            repeat(2,minmax(0,1fr));

          gap:14px;

        }


        /* ============================================
           CARD
        ============================================= */

        .order-card {

          min-width:0;

          background:white;

          border:1px solid #e2e8f0;

          border-radius:18px;

          padding:16px;

          box-shadow:
            0 8px 25px
            rgba(15,23,42,.05);

        }

        .available-card {

          border-color:
            rgba(37,99,235,.20);

        }

        .mine-card {

          border-color:
            rgba(22,163,74,.22);

        }


        /* ============================================
           ORDER HEADER
        ============================================= */

        .order-header {

          display:flex;

          align-items:flex-start;

          justify-content:space-between;

          gap:10px;

        }

        .client-info {

          display:flex;

          align-items:center;

          gap:10px;

          min-width:0;

        }

        .order-icon {

          width:43px;

          height:43px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:12px;

          color:white;

          font-size:18px;

        }

        .order-icon.blue {

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

        }

        .order-icon.green {

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

        }

        .client-name {

          min-width:0;

        }

        .client-name h3 {

          margin:0;

          max-width:230px;

          overflow:hidden;

          text-overflow:ellipsis;

          white-space:nowrap;

          font-size:14px;

          font-weight:950;

        }

        .client-name span {

          display:block;

          margin-top:3px;

          color:#64748b;

          font-size:10px;

        }


        /* ============================================
           STATUS
        ============================================= */

        .status {

          flex-shrink:0;

          display:flex;

          align-items:center;

          gap:5px;

          padding:7px 9px;

          border-radius:999px;

          font-size:8px;

          font-weight:950;

          white-space:nowrap;

        }

        .status-available {

          color:#92400e;

          background:#fef3c7;

        }

        .status-active {

          color:#1d4ed8;

          background:#dbeafe;

        }

        .status-delivered {

          color:#15803d;

          background:#dcfce7;

        }

        .status-cancelled {

          color:#b91c1c;

          background:#fee2e2;

        }


        /* ============================================
           TOTAL
        ============================================= */

        .total-box {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

          margin-top:12px;

          padding:12px;

          border-radius:12px;

          background:
            linear-gradient(
              135deg,
              #f8fafc,
              #eef4ff
            );

        }

        .total-box small {

          display:block;

          color:#64748b;

          font-size:8px;

          font-weight:900;

        }

        .total-box strong {

          display:block;

          margin-top:3px;

          color:#4f46e5;

          font-size:17px;

          font-weight:950;

        }

        .items-count {

          display:flex;

          align-items:center;

          gap:6px;

          color:#64748b;

          font-size:11px;

          font-weight:800;

        }


        /* ============================================
           DESTINATION
        ============================================= */

        .destination {

          margin-top:10px;

          padding:12px;

          border:1px solid #edf1f6;

          border-radius:12px;

          background:#f8fafc;

        }

        .section-label {

          display:flex;

          align-items:center;

          gap:6px;

          color:#64748b;

          font-size:9px;

          font-weight:950;

          letter-spacing:.3px;

        }

        .section-label svg {

          color:#2563eb;

        }

        .destination p {

          margin:7px 0 0;

          color:#0f172a;

          font-size:11px;

          line-height:1.5;

          font-weight:700;

        }

        .map-button {

          width:100%;

          min-height:38px;

          margin-top:9px;

          display:flex;

          align-items:center;

          justify-content:center;

          gap:7px;

          color:white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          border-radius:10px;

          text-decoration:none;

          font-size:9px;

          font-weight:950;

        }

        .map-button svg:last-child {

          margin-left:auto;

          margin-right:10px;

        }


        /* ============================================
           PHONE
        ============================================= */

        .phone-button {

          min-height:47px;

          display:flex;

          align-items:center;

          gap:10px;

          margin-top:9px;

          padding:7px 10px;

          border-radius:11px;

          color:white;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

          text-decoration:none;

        }

        .phone-icon {

          width:32px;

          height:32px;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:8px;

          background:
            rgba(255,255,255,.15);

        }

        .phone-button small {

          display:block;

          font-size:8px;

          opacity:.8;

          font-weight:900;

        }

        .phone-button strong {

          display:block;

          margin-top:2px;

          font-size:11px;

        }

        .phone-button > svg {

          margin-left:auto;

        }


        /* ============================================
           ETA
        ============================================= */

        .eta-grid {

          display:grid;

          grid-template-columns:
            1fr 1fr;

          gap:8px;

          margin-top:9px;

        }

        .eta-card {

          min-height:54px;

          display:flex;

          align-items:center;

          gap:8px;

          padding:10px;

          border:1px solid #e2e8f0;

          border-radius:10px;

          background:white;

        }

        .eta-card > svg {

          color:#2563eb;

          font-size:16px;

        }

        .eta-card.purple {

          color:white;

          border:0;

          background:
            linear-gradient(
              135deg,
              #5b3df5,
              #7c4dff
            );

        }

        .eta-card.purple > svg {

          color:white;

        }

        .eta-card small {

          display:block;

          font-size:8px;

          font-weight:900;

          opacity:.75;

        }

        .eta-card strong {

          display:block;

          margin-top:2px;

          font-size:12px;

          font-weight:950;

        }


        /* ============================================
           PRODUCTS
        ============================================= */

        .products {

          margin-top:10px;

        }

        .product {

          min-height:45px;

          display:flex;

          align-items:center;

          gap:8px;

          padding:6px;

          margin-top:5px;

          border:1px solid #edf1f6;

          border-radius:9px;

          background:#f8fafc;

        }

        .product img,
        .product-placeholder {

          width:37px;

          height:37px;

          flex-shrink:0;

          border-radius:7px;

          object-fit:cover;

          background:#e2e8f0;

        }

        .product-placeholder {

          display:flex;

          align-items:center;

          justify-content:center;

          color:#94a3b8;

        }

        .product strong {

          display:block;

          max-width:240px;

          overflow:hidden;

          text-overflow:ellipsis;

          white-space:nowrap;

          font-size:9px;

        }

        .product span {

          display:block;

          margin-top:2px;

          color:#64748b;

          font-size:8px;

        }

        .more-products {

          margin-top:6px;

          color:#64748b;

          text-align:center;

          font-size:9px;

        }


        /* ============================================
           ACTIONS
        ============================================= */

        .actions {

          display:flex;

          flex-direction:column;

          gap:8px;

          margin-top:11px;

        }

        .actions button {

          min-height:44px;

          border:0;

          border-radius:10px;

          display:flex;

          align-items:center;

          justify-content:center;

          gap:7px;

          font-size:10px;

          font-weight:950;

          cursor:pointer;

        }

        .accept-button {

          width:100%;

          color:white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

        }

        .accept-button svg:last-child {

          margin-left:auto;

          margin-right:12px;

        }

        .refuse-button {

          width:100%;

          color:#64748b;

          background:white;

          border:1px solid #e2e8f0 !important;

        }

        .gps-button {

          width:100%;

          color:white;

          background:
            linear-gradient(
              135deg,
              #5b3df5,
              #7c4dff
            );

        }

        .gps-button svg:last-child {

          margin-left:auto;

          margin-right:12px;

        }

        .action-grid {

          display:grid;

          grid-template-columns:
            1fr 1fr;

          gap:8px;

        }

        .done-button {

          color:white;

          background:
            linear-gradient(
              135deg,
              #22c55e,
              #16a34a
            );

        }

        .cancel-button {

          color:white;

          background:
            linear-gradient(
              135deg,
              #ef4444,
              #dc2626
            );

        }

        .delete-button {

          width:100%;

          color:white;

          background:
            linear-gradient(
              135deg,
              #111827,
              #1e293b
            );

        }


        /* ============================================
           EMPTY
        ============================================= */

        .empty {

          grid-column:
            1 / -1;

          padding:65px 25px;

          text-align:center;

          background:white;

          border:1px solid #e2e8f0;

          border-radius:18px;

        }

        .empty-icon {

          width:70px;

          height:70px;

          margin:0 auto;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:20px;

          color:#2563eb;

          background:#eff6ff;

          font-size:28px;

        }

        .empty h3 {

          margin:16px 0 7px;

          font-size:17px;

          font-weight:950;

        }

        .empty p {

          max-width:400px;

          margin:0 auto;

          color:#64748b;

          font-size:11px;

          line-height:1.6;

        }


        /* ============================================
           NOTIFICATION
        ============================================= */

        .professional-notification {

          position:fixed;

          top:20px;

          right:20px;

          z-index:999999;

          width:min(
            410px,
            calc(100vw - 30px)
          );

          min-height:72px;

          display:flex;

          align-items:center;

          gap:12px;

          padding:12px 14px;

          overflow:hidden;

          background:
            rgba(255,255,255,.98);

          backdrop-filter:
            blur(20px);

          border:
            1px solid
            rgba(148,163,184,.18);

          border-radius:16px;

          box-shadow:
            0 20px 55px
            rgba(15,23,42,.18);

          animation:
            notificationIn
            .3s
            ease-out;

        }

        @keyframes notificationIn {

          from {

            opacity:0;

            transform:
              translateY(-10px)
              translateX(15px)
              scale(.97);

          }

          to {

            opacity:1;

            transform:
              translateY(0)
              translateX(0)
              scale(1);

          }

        }

        .notification-icon {

          width:42px;

          height:42px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:12px;

          font-size:18px;

        }

        .notification-success
        .notification-icon {

          color:#15803d;

          background:#dcfce7;

        }

        .notification-error
        .notification-icon {

          color:#dc2626;

          background:#fee2e2;

        }

        .notification-info
        .notification-icon {

          color:#2563eb;

          background:#dbeafe;

        }

        .notification-content {

          min-width:0;

          flex:1;

        }

        .notification-content strong {

          display:block;

          color:#0f172a;

          font-size:12px;

          font-weight:950;

        }

        .notification-content span {

          display:block;

          margin-top:3px;

          color:#64748b;

          font-size:11px;

          line-height:1.4;

          font-weight:600;

        }

        .notification-close {

          width:28px;

          height:28px;

          flex-shrink:0;

          border:0;

          border-radius:8px;

          background:#f1f5f9;

          color:#64748b;

          font-size:18px;

          cursor:pointer;

        }

        .notification-progress {

          position:absolute;

          left:0;

          bottom:0;

          width:100%;

          height:3px;

          background:#2563eb;

          transform-origin:left;

          animation:
            notificationProgress
            4.5s
            linear forwards;

        }

        .notification-success
        .notification-progress {

          background:#22c55e;

        }

        .notification-error
        .notification-progress {

          background:#ef4444;

        }

        @keyframes notificationProgress {

          from {
            transform:scaleX(1);
          }

          to {
            transform:scaleX(0);
          }

        }


        /* ============================================
           TABLET
        ============================================= */

        @media (
          max-width:900px
        ) {

          .orders {

            grid-template-columns:1fr;

          }

          .driver-container {

            max-width:720px;

          }

        }


        /* ============================================
           MOBILE
        ============================================= */

        @media (
          max-width:600px
        ) {

          .driver-page {

            padding:8px;

          }

          .driver-header {

            padding:17px;

            border-radius:18px;

          }

          .header-top {

            gap:10px;

          }

          .brand {

            gap:9px;

          }

          .brand-icon {

            width:42px;

            height:42px;

            border-radius:12px;

            font-size:19px;

          }

          .brand small {

            font-size:8px;

            letter-spacing:1px;

          }

          .brand h1 {

            font-size:19px;

          }

          .online-badge {

            padding:7px 9px;

            font-size:8px;

          }

          .welcome {

            margin-top:16px;

          }

          .welcome strong {

            font-size:14px;

          }

          .welcome span {

            font-size:10px;

          }

          .profile {

            width:48px;

            height:48px;

          }


          .telegram-card {

            align-items:flex-start;

            flex-direction:column;

            padding:13px;

          }

          .telegram-info {

            width:100%;

          }

          .telegram-icon {

            width:40px;

            height:40px;

            font-size:18px;

          }

          .telegram-info strong {

            font-size:12px;

          }

          .telegram-info span {

            font-size:9px;

            line-height:1.4;

          }

          .telegram-button {

            width:100%;

            min-height:42px;

            font-size:10px;

          }

          .telegram-connected {

            width:100%;

            justify-content:center;

            font-size:10px;

          }


          .stats {

            gap:6px;

          }

          .stat-card {

            flex-direction:column;

            justify-content:center;

            text-align:center;

            gap:6px;

            padding:10px 5px;

          }

          .stat-icon {

            width:34px;

            height:34px;

            font-size:14px;

          }

          .stat-card strong {

            font-size:19px;

          }

          .stat-card span {

            font-size:7px;

          }


          .gps-banner {

            padding:11px;

          }

          .gps-left > svg {

            font-size:18px;

          }

          .gps-left strong {

            font-size:10px;

          }

          .gps-left span {

            font-size:8px;

          }


          .filters {

            gap:6px;

          }

          .filter {

            min-height:38px;

            padding:0 11px;

            font-size:9px;

          }


          .section-head h2 {

            font-size:17px;

          }

          .section-head span {

            font-size:9px;

          }

          .refresh-button {

            width:40px;

            padding:0;

          }

          .refresh-button span {

            display:none;

          }


          .orders {

            grid-template-columns:1fr;

            gap:10px;

          }


          .order-card {

            padding:13px;

            border-radius:15px;

          }

          .client-name h3 {

            max-width:150px;

            font-size:13px;

          }

          .client-name span {

            font-size:9px;

          }

          .order-icon {

            width:39px;

            height:39px;

            font-size:16px;

          }

          .status {

            padding:6px 7px;

            font-size:7px;

          }


          .total-box strong {

            font-size:16px;

          }


          .destination p {

            font-size:10px;

          }


          .actions button {

            min-height:46px;

            font-size:10px;

            padding-left:10px;

            padding-right:10px;

          }

          .order-card,
          .destination,
          .products,
          .total-box {

            overflow:hidden;

          }

          .destination p,
          .product strong,
          .notification-content span {

            overflow-wrap:anywhere;

          }


          .professional-notification {

            top:10px;

            right:10px;

            left:10px;

            width:auto;

          }

        }


        /* ============================================
           SMALL PHONE
        ============================================= */

        @media (
          max-width:380px
        ) {

          .driver-page {

            padding:5px;

          }

          .driver-header {

            padding:13px;

          }

          .brand h1 {

            font-size:17px;

          }

          .online-badge {

            font-size:7px;

            padding:6px;

          }

          .profile {

            width:43px;

            height:43px;

          }

          .stat-card {

            padding:8px 3px;

          }

          .stat-card strong {

            font-size:17px;

          }

          .stat-card span {

            font-size:6px;

          }

          .filter {

            font-size:8px;

            padding:0 9px;

          }

          .order-card {

            padding:11px;

          }

          .status {

            font-size:6px;

          }

        }


        /* ============================================
           DESKTOP
        ============================================= */

        @media (
          min-width:1200px
        ) {

          .orders {

            grid-template-columns:
              repeat(
                3,
                minmax(0,1fr)
              );

          }

        }

      `}</style>

    </>

  );

}