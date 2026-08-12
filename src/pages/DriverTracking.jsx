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
  FaLink,
  FaWifi,
  FaBan,
  FaArrowRight,
  FaUserCircle
} from "react-icons/fa";


const API =
  "https://konanshopping.com";


export default function DriverTracking() {

  // =========================================================
  // 🔔 NOTIFICATIONS PREMIUM
  // =========================================================

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
      success: "Opération réussie",
      error: "Une erreur est survenue",
      info: "Information"
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


  // =========================================================
  // STATES
  // =========================================================

  const [orders, setOrders] =
    useState([]);

  // Liste dédiée aux commandes réellement disponibles
  // renvoyée par GET /driver-orders.
  const [availableOrdersState, setAvailableOrdersState] =
    useState([]);

  // Liste dédiée aux commandes appartenant au livreur.
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

  const previousOrderIds =
    useRef([]);

  const audioRef =
    useRef(null);

  const watchIdsRef =
    useRef({});

  const mountedRef =
    useRef(true);


  // =========================================================
  // LOAD DRIVER
  // =========================================================

  useEffect(() => {

    try {

      const savedDriver =
        JSON.parse(
          localStorage.getItem("driver") || "null"
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

      console.log(
        "Erreur driver localStorage :",
        error
      );

      localStorage.removeItem("driver");

      setDriver(null);

    }

  }, []);


  // =========================================================
  // CLEAN COMPONENT
  // =========================================================

  useEffect(() => {

    mountedRef.current = true;

    return () => {

      mountedRef.current = false;

      Object.values(
        watchIdsRef.current
      ).forEach(
        watchId => {

          try {

            navigator.geolocation.clearWatch(
              watchId
            );

          } catch {}

        }
      );

      watchIdsRef.current = {};

    };

  }, []);


  // =========================================================
  // DISTANCE
  // =========================================================

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


  // =========================================================
  // REVERSE GEOCODING
  // =========================================================

  const getClientAddress = async (
    order
  ) => {

    if (
      !order?.location?.lat ||
      !order?.location?.lng
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
        "Reverse GPS :",
        error
      );

    }

  };


  // =========================================================
  // DISTANCE + ETA
  // =========================================================

  const calculateOrderDistance = (
    order
  ) => {

    if (
      !order?.location?.lat ||
      !order?.location?.lng
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

            order.location.lat,
            order.location.lng

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

        // vitesse moyenne
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
          "GPS distance :",
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


  // =========================================================
  // LOAD ORDERS
  // =========================================================

  // =========================================================
  // 📦 COMMANDES DISPONIBLES
  // =========================================================
  // Ton backend possède une route dédiée :
  // GET /driver-orders
  //
  // Elle ne renvoie que les commandes encore libres.
  // =========================================================

  const fetchAvailableOrders = async () => {

    try {

      const response =
        await axios.get(
          `${API}/driver-orders`
        );

      const list =
        Array.isArray(response.data)
          ? response.data
          : (
              Array.isArray(response.data?.orders)
                ? response.data.orders
                : []
            );

      if (!mountedRef.current) {
        return list;
      }

      setAvailableOrdersState(
        list
      );

      // Charger adresse / distance pour les nouvelles cartes.
      list.forEach(
        order => {

          if (
            order.location?.lat !== undefined &&
            order.location?.lng !== undefined
          ) {

            calculateOrderDistance(order);
            getClientAddress(order);

          }

        }
      );

      return list;

    } catch (error) {

      console.log(
        "Commandes disponibles :",
        error
      );

      return [];

    }

  };


  // =========================================================
  // 🚚 MES LIVRAISONS
  // =========================================================
  // On utilise /api/orders comme source des commandes complètes
  // puis on garde uniquement celles appartenant au livreur.
  // =========================================================

  const fetchMyDeliveries = async () => {

    try {

      const response =
        await axios.get(
          `${API}/api/orders`
        );

      const list =
        Array.isArray(response.data)
          ? response.data
          : (
              Array.isArray(response.data?.orders)
                ? response.data.orders
                : []
            );

      const mine =
        list.filter(
          order => {

            const assignedId =
              typeof order.assignedDriver === "string"
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

      if (!mountedRef.current) {
        return mine;
      }

      setMyDeliveries(
        mine
      );

      // Garder aussi la liste globale pour l'historique.
      setOrders(
        list
      );

      mine.forEach(
        order => {

          if (
            order.location?.lat !== undefined &&
            order.location?.lng !== undefined
          ) {

            calculateOrderDistance(order);
            getClientAddress(order);

          }

        }
      );

      return mine;

    } catch (error) {

      console.log(
        "Mes livraisons :",
        error
      );

      return [];

    }

  };


  // =========================================================
  // 🔄 CENTRE LIVREUR
  // =========================================================

  const syncDriverCenter = async () => {

    await Promise.all([
      fetchAvailableOrders(),
      fetchMyDeliveries()
    ]);

  };


  // =========================================================
  // AUTO REFRESH
  // =========================================================

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

    return () =>
      clearInterval(interval);

  }, [driver?._id]);


  // =========================================================
  // TELEGRAM
  // =========================================================

  const connectTelegram = async () => {

    if (!driver?._id) {

      notify(
        "Livreur non connecté",
        "error"
      );

      return;

    }

    try {

      setConnectingTelegram(true);

      const response =
        await axios.post(

          `${API}/driver/${driver._id}/telegram-connect`

        );

      if (
        response.data?.success &&
        response.data?.telegramUrl
      ) {

        const telegramUrl =
          response.data.telegramUrl;

        /*
          On ouvre Telegram.

          Sur mobile :
          → application Telegram

          Sur PC :
          → Telegram Web / application
        */

        window.open(
          telegramUrl,
          "_blank",
          "noopener,noreferrer"
        );

        notify(
        "Ouvrez Telegram pour terminer la connexion.",
        "success"
      );

      } else {

        notify(
        "Impossible de générer le lien Telegram.",
        "error"
      );

      }

    } catch (error) {

      console.log(
        "Telegram connect :",
        error
      );

      notify(
        error.response?.data?.message ||

        "Impossible de connecter Telegram.",
        "error"
      );

    } finally {

      setConnectingTelegram(false);

    }

  };


  // =========================================================
  // ACCEPT ORDER
  // =========================================================

  const acceptOrder = async (
    orderId
  ) => {

    if (!driver) {

      notify(
        "Livreur non connecté",
        "error"
      );

      return;

    }

    const currentOrder =
      orders.find(
        order =>
          order._id === orderId
      );

    if (!currentOrder) {

      notify(
        "Commande introuvable",
        "error"
      );

      return;

    }

    // =====================================================
    // VERIFICATION LOCALE
    // =====================================================

    if (
      currentOrder.assignedDriver &&
      String(
        typeof currentOrder.assignedDriver === "string"
          ? currentOrder.assignedDriver
          : currentOrder.assignedDriver?.id ||
            currentOrder.assignedDriver?._id ||
            ""
      ) !== String(driver._id)
    ) {

      notify(
        "Cette commande a déjà été prise.",
        "error"
      );

      syncDriverCenter();

      return;

    }

    if (
      String(
        typeof currentOrder.assignedDriver === "string"
          ? currentOrder.assignedDriver
          : currentOrder.assignedDriver?.id ||
            currentOrder.assignedDriver?._id ||
            ""
      ) === String(driver._id)
    ) {

      notify(
        "Cette commande vous est déjà attribuée.",
        "info"
      );

      return;

    }

    try {

      /*
        IMPORTANT :

        Le backend doit effectuer le verrouillage
        atomique.

        Si un autre livreur gagne la course :
        backend → HTTP 409
      */

      const response =
        await axios.put(

          `${API}/api/accept-order/${orderId}`,

          {

            driverId:
              driver._id,

            driverName:
              driver.name,

            driverPhone:
              driver.phone,

            driverPhoto:
              driver.photo,

            driverVehicle:
              driver.vehicle

          }

        );

      const acceptedOrder =
        response.data?.order ||
        response.data?.data ||
        response.data;

      // =====================================================
      // UPDATE LOCAL
      // =====================================================

      // Retirer immédiatement la commande de la liste
      // DISPONIBLE de ce livreur.
      setAvailableOrdersState(
        previous =>
          previous.filter(
            order =>
              order._id !== orderId
          )
      );

      setOrders(
        previous =>

          previous.map(
            order =>

              order._id === orderId

                ? {

                    ...order,

                    ...(acceptedOrder || {}),

                    // =================================================
                    // ÉTAT LOCAL IMMÉDIAT
                    // =================================================
                    // Le badge passe de DISPONIBLE à EN LIVRAISON.
                    // assignedDriver identifie précisément le livreur
                    // qui vient de prendre la commande.
                    // =================================================

                    status:
                      "En livraison",

                    assignedDriver:

                      acceptedOrder?.assignedDriver ||

                      {

                        id:
                          driver._id,

                        name:
                          driver.name,

                        phone:
                          driver.phone,

                        photo:
                          driver.photo,

                        vehicle:
                          driver.vehicle

                      }

                  }

                : order

          )

      );

      // Placer immédiatement la commande dans
      // MES LIVRAISONS sans attendre le prochain polling.
      setMyDeliveries(
        previous => {

          const exists =
            previous.some(
              order =>
                order._id === orderId
            );

          const localOrder =
            {
              ...currentOrder,
              ...(acceptedOrder || {}),
              status:
                "En livraison",
              assignedDriver:
                acceptedOrder?.assignedDriver ||
                {
                  id:
                    driver._id,
                  name:
                    driver.name || "",
                  phone:
                    driver.phone || "",
                  photo:
                    driver.photo || "",
                  vehicle:
                    driver.vehicle || ""
                }
            };

          return exists
            ? previous.map(
                order =>
                  order._id === orderId
                    ? localOrder
                    : order
              )
            : [
                ...previous,
                localOrder
              ];

        }
      );

      notify(
        "Commande acceptée ! Elle est maintenant dans « Mes livraisons ».",
        "success"
      );

      // =====================================================
      // PASSER AUTOMATIQUEMENT SUR « MES LIVRAISONS »
      // =====================================================

      setActiveSection("active");

      // =====================================================
      // GPS
      // =====================================================

      startDriverGPS(
        orderId
      );

      setIsTracking(true);

      // =====================================================
      // ACTUALISATION SERVEUR
      // =====================================================

      // Le backend est la source de vérité.
      // Après acceptation, assignedDriver = ce livreur
      // et status = "En livraison".
      //
      // Pour les autres livreurs, la même commande
      // disparaît de availableOrders dès que leur
      // prochain fetch reçoit assignedDriver.
      // =====================================================

      setTimeout(
        () => {
          syncDriverCenter();
        },
        300
      );

    } catch (error) {

      console.log(
        "Erreur acceptation :",
        error
      );

      // =====================================================
      // COMMANDE DÉJÀ PRISE
      // =====================================================

      if (
        error.response?.status === 409
      ) {

        setAvailableOrdersState(
          previous =>
            previous.filter(
              order =>
                order._id !== orderId
            )
        );

        notify(
        "Cette commande vient d'être acceptée par un autre livreur.",
        "error"
      );

        /*
          Très important :
          on recharge immédiatement les commandes.

          Elle disparaîtra de la liste.
        */

        syncDriverCenter();

        return;

      }

      notify(
        error.response?.data?.error ||

        error.response?.data?.message ||

        "Impossible d'accepter la commande.",
        "error"
      );

    }

  };


  // =========================================================
  // GPS LIVREUR
  // =========================================================

  const startDriverGPS = (
    orderId
  ) => {

    if (
      !navigator.geolocation
    ) {

      notify(
        "La géolocalisation n'est pas disponible.",
        "error"
      );

      return;

    }

    // arrêter ancien tracking
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
              "GPS serveur :",
              error
            );

          }

        },

        error => {

          console.log(
            "GPS :",
            error
          );

        },

        {

          enableHighAccuracy: true,

          maximumAge: 0,

          timeout: 10000

        }

      );

    watchIdsRef.current[orderId] =
      watchId;

  };


  // =========================================================
  // REFUSER
  // =========================================================

  const refuseOrder = (
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
        "Commande ignorée",
        "info"
      );

  };


  // =========================================================
  // FINISH DELIVERY
  // =========================================================

  const finishDelivery =
    async (
      orderId
    ) => {

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

        setOrders(
          previous =>

            previous.map(
              order =>

                order._id === orderId

                  ? {

                      ...order,

                      status:
                        "Livrée"

                    }

                  : order

            )

        );

        setIsTracking(false);

        notify(
        "Commande livrée avec succès",
        "success"
      );

        syncDriverCenter();

      } catch (error) {

        console.log(
          error
        );

        notify(
        "Impossible de terminer la livraison",
        "error"
      );

      }

    };


  // =========================================================
  // CANCEL DRIVER DELIVERY
  // IMPORTANT:
  // Le livreur ne doit PAS mettre la commande "Annulée".
  // Elle doit redevenir "En attente" et être disponible
  // pour tous les livreurs.
  // =========================================================

  const cancelOrder =
    async (
      orderId
    ) => {

      if (!driver?._id) {

        notify(
        "Livreur non connecté",
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
            "Impossible d'annuler la livraison"
          );

        }

        // =====================================================
        // ARRÊTER LE GPS DE CETTE COMMANDE
        // =====================================================

        stopGPS(
          orderId
        );

        // =====================================================
        // RETIRER IMMÉDIATEMENT LA COMMANDE DE MES LIVRAISONS
        // =====================================================

        setOrders(
          previous =>
            previous.map(
              order =>

                order._id === orderId

                  ? {

                      ...order,

                      status:
                        "En attente",

                      // Le backend supprime assignedDriver.
                      assignedDriver:
                        undefined

                    }

                  : order

            )

        );

        // =====================================================
        // SI PLUS AUCUNE LIVRAISON N'EST ACTIVE
        // =====================================================

        setIsTracking(
          previous => {

            const stillTracking =
              orders.some(
                order =>
                  order._id !== orderId &&
                  order.assignedDriver?.id ===
                    driver._id &&
                  order.status !== "Livrée" &&
                  order.status !== "Annulée"
              );

            return stillTracking;

          }
        );

        // =====================================================
        // MESSAGE
        // =====================================================

        notify(
        "↩️ Commande remise à disposition pour tous les livreurs.",
        "success"
      );

        // =====================================================
        // RECHARGEMENT SERVEUR
        // =====================================================

        await syncDriverCenter();

      } catch (error) {

        console.log(
          "❌ DRIVER CANCEL ERROR:",
          error
        );

        // La commande peut avoir été modifiée
        // entre-temps par un autre processus.

        if (
          error.response?.status === 409
        ) {

          notify(
        error.response?.data?.message ||
            "Cette livraison ne peut plus être annulée.",
        "error"
      );

          await syncDriverCenter();

          return;

        }

        notify(
        error.response?.data?.message ||

          error.response?.data?.error ||

          error.message ||

          "Impossible d'annuler la livraison",
        "error"
      );

      }

    };


  // =========================================================
  // STOP GPS
  // =========================================================

  const stopGPS = (
    orderId
  ) => {

    if (
      watchIdsRef.current[orderId]
    ) {

      try {

        navigator.geolocation.clearWatch(
          watchIdsRef.current[orderId]
        );

      } catch {}

      delete watchIdsRef.current[
        orderId
      ];

    }

  };


  // =========================================================
  // DELETE
  // =========================================================

  const deleteOrder =
    async (
      orderId
    ) => {

      try {

        await axios.delete(

          `${API}/api/delete-order/${orderId}`

        );

        setOrders(
          previous =>

            previous.filter(
              order =>
                order._id !==
                orderId
            )

        );

        notify(
        "Commande supprimée",
        "success"
      );

      } catch (error) {

        console.log(
          error
        );

        notify(
        "Impossible de supprimer la commande",
        "error"
      );

      }

    };


  // =========================================================
  // DRIVER NOT CONNECTED
  // =========================================================

  if (!driver) {

    return (

      <div className="driver-page">

        <div className="empty-login">

          <div className="empty-login-icon">

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

          .driver-page {
            min-height:100vh;
            background:#f4f7fb;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            font-family:Inter,system-ui,sans-serif;
          }

          .empty-login {
            width:100%;
            max-width:380px;
            background:white;
            padding:35px 25px;
            border-radius:24px;
            text-align:center;
            box-shadow:0 20px 60px rgba(15,23,42,.10);
          }

          .empty-login-icon {
            width:70px;
            height:70px;
            margin:auto;
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:20px;
            background:linear-gradient(135deg,#2563eb,#4f46e5);
            color:white;
            font-size:28px;
          }

          .empty-login h2 {
            margin:18px 0 5px;
            font-size:22px;
          }

          .empty-login p {
            margin:0;
            color:#64748b;
            font-size:13px;
          }

        `}</style>

      </div>

    );

  }


  // =========================================================
  // FILTERS
  // =========================================================

  const availableOrders =
    availableOrdersState.filter(
      order =>

        !refusedOrders.includes(
          order._id
        ) &&

        order.status !== "Livrée" &&

        order.status !== "Annulée"

    );


  const myActiveOrders =
    myDeliveries.filter(
      order =>

        order.status !== "Livrée" &&

        order.status !== "Annulée"

    );


  const deliveredOrders =
    myDeliveries.filter(
      order =>
        order.status === "Livrée"
    );


  const myOrders =
    myDeliveries;


  let displayedOrders =
    availableOrders;


  if (
    activeSection === "all"
  ) {

    displayedOrders =
      [
        ...availableOrders,
        ...myActiveOrders
      ];

  }


  if (
    activeSection === "available"
  ) {

    displayedOrders =
      availableOrders;

  }


  if (
    activeSection === "active"
  ) {

    displayedOrders =
      myActiveOrders;

  }


  if (
    activeSection === "delivered"
  ) {

    displayedOrders =
      deliveredOrders;

  }


  // =========================================================
  // ORDER CARD
  // =========================================================

  const renderOrder = (
    order
  ) => {

    const assignedDriverId =
      typeof order.assignedDriver === "string"
        ? order.assignedDriver
        : order.assignedDriver?.id ||
          order.assignedDriver?._id;

    const isMine =
      String(assignedDriverId || "") ===
      String(driver._id);

    const isAvailable =
      !order.assignedDriver;

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
        key={order._id}
        className={
          `order-card ${
            isAvailable
              ? "available-card"
              : isMine
              ? "mine-card"
              : ""
          }`
        }
      >

        {/* HEADER */}

        <div className="order-top">

          <div className="client-block">

            <div
              className={
                `order-icon ${
                  isAvailable
                    ? "blue-icon"
                    : "green-icon"
                }`
              }
            >

              <FaBoxOpen />

            </div>

            <div>

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
            className={
              `status-pill ${
                isDelivered
                  ? "delivered"
                  : isCancelled
                  ? "cancelled"
                  : isMine
                  ? "active"
                  : "available"
              }`
            }
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
              TOTAL
            </small>

            <strong>
              {order.total || 0}
              {" "}
              FCFA
            </strong>

          </div>

          <div className="mini-data">

            <span>
              <FaBox />
              {order.items?.length || 0}
            </span>

          </div>

        </div>


        {/* DESTINATION */}

        <div className="destination-box">

          <div className="label">

            <FaMapMarkerAlt />

            DESTINATION

          </div>

          <p>
            {address}
          </p>

          {order.location?.lat &&
            order.location?.lng && (

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

              <FaArrowRight />

            </a>

          )}

        </div>


        {/* PHONE */}

        {order.phone && (

          <a
            href={
              `tel:${order.phone}`
            }

            className="phone-button"
          >

            <div className="phone-symbol">

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

        <div className="eta-row">

          <div className="eta-box purple">

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


          <div className="eta-box">

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


        {/* PRODUCTS */}

        {order.items?.length > 0 && (

          <div className="products">

            <div className="label">

              <FaBoxOpen />

              PRODUITS

            </div>

            {order.items
              .slice(0, 4)
              .map(
                (
                  item,
                  index
                ) => (

                  <div
                    className="product-row"
                    key={index}
                  >

                    {item.image ? (

                      <img
                        src={item.image}
                        alt=""
                      />

                    ) : (

                      <div className="no-image">
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

            {order.items.length > 4 && (

              <div className="more-products">

                +
                {order.items.length - 4}
                {" "}
                autres produits

              </div>

            )}

          </div>

        )}


        {/* ACTIONS */}

        <div className="actions">

          {/* AVAILABLE */}

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

                ACCEPTER

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

                REFUSER

              </button>

            </>

          )}


          {/* MY ORDER */}

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

                  setIsTracking(true);

                  notify(
        "GPS activé",
        "success"
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

                  LIVRÉE

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


          {/* DELIVERED */}

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


  // =========================================================
  // MAIN
  // =========================================================

  return (
    <>
      {notification && (
        <div
          role="alert"
          aria-live="polite"
          onClick={closeNotification}
          style={{
            position: "fixed",
            top: "18px",
            right: "18px",
            zIndex: 999999,
            width: "min(390px, calc(100vw - 28px))",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid rgba(148,163,184,0.18)",
            borderRadius: "18px",
            boxShadow: "0 20px 55px rgba(15,23,42,0.18)",
            padding: "13px 14px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            animation: "driverNotificationIn .32s cubic-bezier(.2,.8,.2,1)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              minWidth: "42px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              background:
                notification.type === "success"
                  ? "linear-gradient(135deg,#dcfce7,#bbf7d0)"
                  : notification.type === "error"
                    ? "linear-gradient(135deg,#fee2e2,#fecaca)"
                    : "linear-gradient(135deg,#dbeafe,#bfdbfe)",
              color:
                notification.type === "success"
                  ? "#15803d"
                  : notification.type === "error"
                    ? "#dc2626"
                    : "#2563eb"
            }}
          >
            {notification.type === "success"
              ? <FaCheckCircle />
              : notification.type === "error"
                ? <FaExclamationTriangle />
                : <FaSatelliteDish />}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "900",
                color: "#0f172a",
                marginBottom: "3px"
              }}
            >
              {notification.title}
            </div>

            <div
              style={{
                fontSize: "12px",
                lineHeight: 1.45,
                color: "#64748b",
                fontWeight: "600",
                wordBreak: "break-word"
              }}
            >
              {notification.message}
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeNotification();
            }}
            aria-label="Fermer"
            style={{
              width: "28px",
              height: "28px",
              minWidth: "28px",
              border: "none",
              borderRadius: "9px",
              background: "#f1f5f9",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "900"
            }}
          >
            ×
          </button>

          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: "3px",
              width: "100%",
              background:
                notification.type === "success"
                  ? "#22c55e"
                  : notification.type === "error"
                    ? "#ef4444"
                    : "#3b82f6",
              transformOrigin: "left",
              animation: "driverNotificationProgress 4.5s linear forwards"
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes driverNotificationIn {
          from {
            opacity: 0;
            transform: translate3d(25px,-8px,0) scale(.96);
          }
          to {
            opacity: 1;
            transform: translate3d(0,0,0) scale(1);
          }
        }

        @keyframes driverNotificationProgress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }

        @media (max-width: 600px) {
          .driver-page {
            padding-top: 76px;
          }
        }
      `}</style>

    <div className="driver-page">

      {/* BACKGROUND ICONS */}

      <div className="background-icons">

        <FaTruck />

        <FaBoxOpen />

        <FaMapMarkerAlt />

        <FaMotorcycle />

        <FaShippingFast />

      </div>


      <main className="driver-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="driver-header">

          <div className="header-main">

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


            <div className="online">

              <FaCircle />

              EN LIGNE

            </div>

          </div>


          <div className="welcome">

            <div>

              <strong>
                Bonjour{" "}
                {driver.name ||
                  "Livreur"}
              </strong>

              <span>
                Gérez vos livraisons depuis votre centre.
              </span>

            </div>


            <div className="profile">

              {driver.photo ? (

                <img
                  src={driver.photo}
                  alt=""
                />

              ) : (

                <FaUser />

              )}

            </div>

          </div>

        </header>


        {/* =================================================
            TELEGRAM
        ================================================= */}

        <section className="telegram-card">

          <div className="telegram-left">

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
                : "CONNECTER TELEGRAM"}

            </button>

          )}

        </section>


        {/* =================================================
            STATS
        ================================================= */}

        <section className="stats">

          <div className="stat">

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


          <div className="stat">

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


          <div className="stat">

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


        {/* =================================================
            GPS
        ================================================= */}

        {isTracking && (

          <div className="gps-banner">

            <div>

              <FaSatelliteDish />

              <div>

                <strong>
                  GPS EN DIRECT
                </strong>

                <span>
                  Position du livreur synchronisée
                </span>

              </div>

            </div>

            <b>
              <FaCircle />
              LIVE
            </b>

          </div>

        )}


        {/* =================================================
            FILTER
        ================================================= */}

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


        {/* =================================================
            TITLE
        ================================================= */}

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
            className="refresh"
            onClick={() =>
              syncDriverCenter()
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

          </button>

        </div>


        {/* =================================================
            ORDERS
        ================================================= */}

        <section className="orders">

          {displayedOrders.length ===
          0 ? (

            <div className="empty">

              <div>

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

                Les nouvelles commandes apparaîtront automatiquement ici.

              </p>

            </div>

          ) : (

            displayedOrders.map(
              renderOrder
            )

          )}

        </section>

      </main>


      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing:border-box;
        }

        body {
          margin:0;
        }

        .driver-page {

          min-height:100vh;

          width:100%;

          overflow-x:hidden;

          background:
            linear-gradient(
              180deg,
              #f1f5ff 0%,
              #f8fafc 45%,
              #ffffff 100%
            );

          padding:12px;

          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color:#0f172a;

          position:relative;

        }


        /* BACKGROUND */

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

          width:150px;

          height:150px;

          top:5%;

          left:2%;

          transform:rotate(-12deg);

        }

        .background-icons svg:nth-child(2) {

          width:130px;

          height:130px;

          top:35%;

          right:2%;

          transform:rotate(15deg);

        }

        .background-icons svg:nth-child(3) {

          width:120px;

          height:120px;

          bottom:25%;

          left:2%;

        }

        .background-icons svg:nth-child(4) {

          width:140px;

          height:140px;

          bottom:5%;

          right:5%;

        }

        .background-icons svg:nth-child(5) {

          width:100px;

          height:100px;

          top:60%;

          left:45%;

        }


        .driver-container {

          width:100%;

          max-width:1200px;

          margin:auto;

          position:relative;

          z-index:1;

        }


        /* HEADER */

        .driver-header {

          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #4338ca 55%,
              #6d28d9
            );

          border-radius:20px;

          padding:17px;

          color:white;

          box-shadow:
            0 15px 35px
            rgba(37,99,235,.15);

          margin-bottom:9px;

        }

        .header-main {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

        }

        .brand {

          display:flex;

          align-items:center;

          gap:10px;

          min-width:0;

        }

        .brand-icon {

          width:43px;

          height:43px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:13px;

          background:
            rgba(255,255,255,.15);

          font-size:20px;

        }

        .brand small {

          display:block;

          font-size:8px;

          font-weight:900;

          letter-spacing:1.4px;

          opacity:.75;

        }

        .brand h1 {

          margin:2px 0 0;

          font-size:21px;

          font-weight:950;

        }

        .online {

          display:flex;

          align-items:center;

          gap:5px;

          padding:7px 9px;

          border-radius:999px;

          background:
            rgba(255,255,255,.13);

          font-size:8px;

          font-weight:900;

          white-space:nowrap;

        }

        .online svg {

          color:#4ade80;

          font-size:6px;

        }

        .welcome {

          margin-top:13px;

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

        }

        .welcome strong {

          display:block;

          font-size:13px;

        }

        .welcome span {

          display:block;

          margin-top:3px;

          font-size:9px;

          opacity:.75;

        }

        .profile {

          width:40px;

          height:40px;

          border-radius:50%;

          overflow:hidden;

          display:flex;

          align-items:center;

          justify-content:center;

          flex-shrink:0;

          background:
            rgba(255,255,255,.15);

          border:
            2px solid
            rgba(255,255,255,.3);

        }

        .profile img {

          width:100%;

          height:100%;

          object-fit:cover;

        }


        /* TELEGRAM */

        .telegram-card {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

          padding:9px 11px;

          margin-bottom:9px;

          background:white;

          border:1px solid #e3eaf4;

          border-radius:14px;

          box-shadow:
            0 7px 20px
            rgba(15,23,42,.04);

        }

        .telegram-left {

          display:flex;

          align-items:center;

          gap:8px;

          min-width:0;

        }

        .telegram-icon {

          width:34px;

          height:34px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:10px;

          color:white;

          background:
            linear-gradient(
              135deg,
              #229ed9,
              #168ac1
            );

          font-size:15px;

        }

        .telegram-left strong {

          display:block;

          font-size:9px;

          font-weight:950;

        }

        .telegram-left span {

          display:block;

          margin-top:2px;

          color:#64748b;

          font-size:7px;

        }

        .telegram-button {

          display:flex;

          align-items:center;

          justify-content:center;

          gap:5px;

          border:0;

          border-radius:9px;

          padding:8px 10px;

          color:white;

          background:
            linear-gradient(
              135deg,
              #229ed9,
              #168ac1
            );

          font-size:7px;

          font-weight:950;

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

          gap:5px;

          padding:7px 9px;

          border-radius:999px;

          background:#dcfce7;

          color:#15803d;

          font-size:7px;

          font-weight:950;

          white-space:nowrap;

        }


        /* STATS */

        .stats {

          display:grid;

          grid-template-columns:
            repeat(3,1fr);

          gap:7px;

          margin-bottom:9px;

        }

        .stat {

          background:white;

          border:1px solid #e5eaf2;

          border-radius:13px;

          padding:9px;

          display:flex;

          align-items:center;

          gap:8px;

          box-shadow:
            0 6px 18px
            rgba(15,23,42,.035);

        }

        .stat-icon {

          width:32px;

          height:32px;

          border-radius:9px;

          display:flex;

          align-items:center;

          justify-content:center;

          flex-shrink:0;

          font-size:13px;

        }

        .stat-icon.blue {

          background:#dbeafe;

          color:#2563eb;

        }

        .stat-icon.green {

          background:#dcfce7;

          color:#16a34a;

        }

        .stat-icon.purple {

          background:#ede9fe;

          color:#7c3aed;

        }

        .stat strong {

          display:block;

          font-size:17px;

          line-height:1;

          font-weight:950;

        }

        .stat span {

          display:block;

          margin-top:3px;

          color:#64748b;

          font-size:6px;

          font-weight:950;

        }


        /* GPS */

        .gps-banner {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

          margin-bottom:9px;

          padding:9px 11px;

          border-radius:13px;

          background:#dcfce7;

          border:1px solid #86efac;

        }

        .gps-banner > div {

          display:flex;

          align-items:center;

          gap:8px;

        }

        .gps-banner > div > svg {

          color:#16a34a;

          font-size:16px;

        }

        .gps-banner strong {

          display:block;

          color:#166534;

          font-size:8px;

          font-weight:950;

        }

        .gps-banner span {

          display:block;

          color:#15803d;

          margin-top:2px;

          font-size:7px;

        }

        .gps-banner b {

          display:flex;

          align-items:center;

          gap:4px;

          padding:5px 7px;

          color:white;

          background:#22c55e;

          border-radius:999px;

          font-size:6px;

        }


        /* FILTER */

        .filters {

          display:flex;

          gap:5px;

          overflow-x:auto;

          scrollbar-width:none;

          padding-bottom:3px;

          margin-bottom:8px;

        }

        .filters::-webkit-scrollbar {

          display:none;

        }

        .filter {

          flex-shrink:0;

          display:flex;

          align-items:center;

          gap:4px;

          padding:7px 9px;

          border:1px solid #e2e8f0;

          border-radius:999px;

          background:white;

          color:#475569;

          font-size:7px;

          font-weight:950;

          cursor:pointer;

        }

        .filter b {

          min-width:15px;

          height:15px;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:50%;

          background:#f1f5f9;

          font-size:6px;

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


        /* SECTION */

        .section-head {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

          margin-bottom:8px;

        }

        .section-head h2 {

          margin:0;

          font-size:15px;

          font-weight:950;

        }

        .section-head span {

          display:block;

          margin-top:2px;

          color:#64748b;

          font-size:7px;

        }

        .refresh {

          width:33px;

          height:33px;

          display:flex;

          align-items:center;

          justify-content:center;

          border:1px solid #e2e8f0;

          border-radius:10px;

          background:white;

          color:#2563eb;

          cursor:pointer;

        }

        .refresh:disabled {

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


        /* ORDERS */

        .orders {

          display:grid;

          grid-template-columns:
            repeat(2,minmax(0,1fr));

          gap:9px;

        }


        /* CARD */

        .order-card {

          min-width:0;

          padding:10px;

          background:
            rgba(255,255,255,.98);

          border:1px solid #e3e8f0;

          border-radius:15px;

          box-shadow:
            0 7px 20px
            rgba(15,23,42,.045);

        }

        .available-card {

          border-color:
            rgba(37,99,235,.18);

        }

        .mine-card {

          border-color:
            rgba(22,163,74,.18);

        }


        /* ORDER TOP */

        .order-top {

          display:flex;

          align-items:flex-start;

          justify-content:space-between;

          gap:6px;

        }

        .client-block {

          display:flex;

          align-items:center;

          gap:7px;

          min-width:0;

        }

        .order-icon {

          width:33px;

          height:33px;

          flex-shrink:0;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:9px;

          color:white;

          font-size:13px;

        }

        .blue-icon {

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

        }

        .green-icon {

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

        }

        .client-block h3 {

          max-width:170px;

          margin:0;

          overflow:hidden;

          text-overflow:ellipsis;

          white-space:nowrap;

          font-size:11px;

          font-weight:950;

        }

        .client-block span {

          display:block;

          margin-top:2px;

          color:#64748b;

          font-size:6px;

        }


        /* STATUS */

        .status-pill {

          flex-shrink:0;

          display:flex;

          align-items:center;

          gap:3px;

          padding:5px 6px;

          border-radius:999px;

          font-size:5px;

          font-weight:950;

        }

        .status-pill.available {

          color:#92400e;

          background:#fef3c7;

        }

        .status-pill.active {

          color:#1d4ed8;

          background:#dbeafe;

        }

        .status-pill.delivered {

          color:#15803d;

          background:#dcfce7;

        }

        .status-pill.cancelled {

          color:#b91c1c;

          background:#fee2e2;

        }


        /* TOTAL */

        .total-box {

          display:flex;

          align-items:center;

          justify-content:space-between;

          margin-top:7px;

          padding:8px;

          border-radius:10px;

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

          font-size:5px;

          font-weight:950;

        }

        .total-box strong {

          display:block;

          margin-top:2px;

          color:#4f46e5;

          font-size:14px;

          font-weight:950;

        }

        .mini-data {

          display:flex;

          align-items:center;

          gap:5px;

          color:#64748b;

          font-size:7px;

        }

        .mini-data span {

          display:flex;

          align-items:center;

          gap:3px;

        }


        /* DESTINATION */

        .destination-box {

          margin-top:7px;

          padding:8px;

          border:1px solid #edf1f6;

          border-radius:10px;

          background:#f8fafc;

        }

        .label {

          display:flex;

          align-items:center;

          gap:4px;

          color:#64748b;

          font-size:5px;

          font-weight:950;

          letter-spacing:.3px;

        }

        .label svg {

          color:#2563eb;

          font-size:8px;

        }

        .destination-box p {

          margin:5px 0 0;

          color:#0f172a;

          font-size:8px;

          font-weight:700;

          line-height:1.35;

        }

        .map-button {

          margin-top:6px;

          width:100%;

          display:flex;

          align-items:center;

          justify-content:center;

          gap:5px;

          padding:7px;

          border-radius:8px;

          color:white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          text-decoration:none;

          font-size:6px;

          font-weight:950;

        }

        .map-button svg:last-child {

          margin-left:auto;

        }


        /* PHONE */

        .phone-button {

          display:flex;

          align-items:center;

          gap:7px;

          margin-top:6px;

          padding:7px;

          border-radius:9px;

          color:white;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

          text-decoration:none;

        }

        .phone-symbol {

          width:27px;

          height:27px;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:7px;

          background:
            rgba(255,255,255,.15);

          font-size:9px;

        }

        .phone-button small {

          display:block;

          font-size:5px;

          opacity:.8;

          font-weight:950;

        }

        .phone-button strong {

          display:block;

          margin-top:1px;

          font-size:8px;

        }

        .phone-button > svg {

          margin-left:auto;

          font-size:7px;

        }


        /* ETA */

        .eta-row {

          display:grid;

          grid-template-columns:
            1fr 1fr;

          gap:5px;

          margin-top:6px;

        }

        .eta-box {

          display:flex;

          align-items:center;

          gap:6px;

          padding:7px;

          border:1px solid #e2e8f0;

          border-radius:9px;

          background:white;

        }

        .eta-box > svg {

          color:#2563eb;

          font-size:11px;

        }

        .eta-box.purple {

          border:0;

          color:white;

          background:
            linear-gradient(
              135deg,
              #5b3df5,
              #7c4dff
            );

        }

        .eta-box.purple > svg {

          color:white;

        }

        .eta-box small {

          display:block;

          font-size:5px;

          font-weight:950;

          opacity:.7;

        }

        .eta-box strong {

          display:block;

          margin-top:1px;

          font-size:11px;

          font-weight:950;

        }


        /* PRODUCTS */

        .products {

          margin-top:7px;

        }

        .product-row {

          display:flex;

          align-items:center;

          gap:6px;

          padding:4px;

          margin-top:4px;

          border-radius:8px;

          background:#f8fafc;

          border:1px solid #edf1f6;

        }

        .product-row img,
        .no-image {

          width:31px;

          height:31px;

          flex-shrink:0;

          border-radius:6px;

          object-fit:cover;

          background:#e2e8f0;

        }

        .no-image {

          display:flex;

          align-items:center;

          justify-content:center;

          color:#94a3b8;

          font-size:9px;

        }

        .product-row strong {

          display:block;

          max-width:190px;

          overflow:hidden;

          text-overflow:ellipsis;

          white-space:nowrap;

          font-size:7px;

        }

        .product-row span {

          display:block;

          margin-top:1px;

          color:#64748b;

          font-size:5px;

        }

        .more-products {

          margin-top:4px;

          color:#64748b;

          font-size:6px;

          text-align:center;

        }


        /* ACTIONS */

        .actions {

          display:flex;

          flex-direction:column;

          gap:5px;

          margin-top:7px;

        }

        .actions button {

          min-height:34px;

          border:0;

          border-radius:9px;

          display:flex;

          align-items:center;

          justify-content:center;

          gap:5px;

          font-family:inherit;

          font-size:6px;

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

        }

        .action-grid {

          display:grid;

          grid-template-columns:
            1fr 1fr;

          gap:5px;

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


        /* EMPTY */

        .empty {

          grid-column:
            1 / -1;

          padding:45px 20px;

          text-align:center;

          background:white;

          border:1px solid #e5eaf2;

          border-radius:17px;

        }

        .empty > div {

          width:55px;

          height:55px;

          margin:auto;

          display:flex;

          align-items:center;

          justify-content:center;

          border-radius:17px;

          color:#2563eb;

          background:#eff6ff;

          font-size:22px;

        }

        .empty h3 {

          margin:11px 0 4px;

          font-size:13px;

          font-weight:950;

        }

        .empty p {

          margin:0 auto;

          max-width:350px;

          color:#64748b;

          font-size:8px;

          line-height:1.5;

        }


        /* TABLET */

        @media (
          max-width:900px
        ) {

          .orders {

            grid-template-columns:
              1fr;

          }

          .driver-container {

            max-width:720px;

          }

        }


        /* MOBILE */

        @media (
          max-width:600px
        ) {

          .driver-page {

            padding:7px;

          }

          .driver-header {

            padding:13px;

            border-radius:16px;

          }

          .brand-icon {

            width:38px;

            height:38px;

            font-size:17px;

          }

          .brand h1 {

            font-size:17px;

          }

          .brand small {

            font-size:6px;

          }

          .online {

            padding:6px 7px;

            font-size:6px;

          }

          .telegram-card {

            align-items:flex-start;

            padding:9px;

          }

          .telegram-button {

            padding:8px;

            font-size:6px;

          }

          .telegram-left strong {

            font-size:8px;

          }

          .telegram-left span {

            font-size:6px;

          }

          .stats {

            gap:4px;

          }

          .stat {

            flex-direction:column;

            text-align:center;

            justify-content:center;

            gap:4px;

            padding:7px 4px;

          }

          .stat-icon {

            width:28px;

            height:28px;

            font-size:11px;

          }

          .stat strong {

            font-size:15px;

          }

          .stat span {

            font-size:5px;

          }

          .orders {

            grid-template-columns:1fr;

          }

          .order-card {

            padding:9px;

          }

        }


        /* SMALL MOBILE */

        @media (
          max-width:380px
        ) {

          .driver-page {

            padding:5px;

          }

          .driver-header {

            padding:11px;

          }

          .brand h1 {

            font-size:16px;

          }

          .telegram-button {

            padding:7px;

          }

          .telegram-button {

            font-size:5px;

          }

          .order-card {

            padding:8px;

          }

        }


        /* LARGE DESKTOP */

        @media (
          min-width:1200px
        ) {

          .driver-page {

            padding:18px;

          }

          .orders {

            grid-template-columns:
              repeat(3,minmax(0,1fr));

          }

        }

      `}</style>

    </div>

  </>

  );

}