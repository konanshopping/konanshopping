import {
  useEffect,
  useRef,
  useState
} from "react";

import axios from "axios";

import {
  toast
} from "react-toastify";

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
  FaTimes,
  FaShippingFast,
  FaCircle
} from "react-icons/fa";


export default function DriverTracking() {

  // =====================================================
  // STATES
  // =====================================================

  const [orders, setOrders] = useState([]);

  const [isTracking, setIsTracking] =
    useState(false);

  const [clientAddresses, setClientAddresses] =
    useState({});

  const [distances, setDistances] =
    useState({});

  const [etas, setEtas] =
    useState({});

  const [activeSection, setActiveSection] =
    useState("all");

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [refusedOrders, setRefusedOrders] =
    useState([]);

  const [driver, setDriver] =
    useState(null);

  const previousOrderIds =
    useRef([]);

  const audioRef =
    useRef(null);

  const watchIdsRef =
    useRef({});


  // =====================================================
  // LOAD DRIVER
  // =====================================================

  useEffect(() => {

    try {

      const savedDriver =
        JSON.parse(
          localStorage.getItem("driver") || "null"
        );

      if (savedDriver) {
        setDriver(savedDriver);
      }

    } catch (err) {

      console.log("Driver invalide");

      localStorage.removeItem("driver");

    }

  }, []);


  // =====================================================
  // CALCUL DISTANCE
  // =====================================================

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


  // =====================================================
  // REVERSE GPS
  // =====================================================

  const getClientAddress =
    async (order) => {

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

        const geoRes =
          await axios.get(

            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${order.location.lat}&lon=${order.location.lng}`,

            {
              headers: {
                "Accept-Language": "fr"
              }
            }

          );

        if (
          geoRes.data?.display_name
        ) {

          setClientAddresses(
            previous => ({
              ...previous,
              [order._id]:
                geoRes.data.display_name
            })
          );

        }

      } catch (err) {

        console.log(
          "Erreur adresse GPS :",
          err
        );

      }

    };


  // =====================================================
  // CALCUL GPS POUR UNE COMMANDE
  // =====================================================

  const calculateOrderDistance =
    (order) => {

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

        (position) => {

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

        (err) => {

          console.log(
            "GPS distance :",
            err
          );

        },

        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000
        }

      );

    };


  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const fetchOrders =
    async (showLoader = false) => {

      try {

        if (showLoader) {
          setIsRefreshing(true);
        }

        const res =
          await axios.get(
            "https://konanshopping.com/api/orders"
          );

        const newOrders =
          Array.isArray(res.data)
            ? res.data
            : [];

        const currentIds =
          newOrders.map(
            order => order._id
          );

        const newIncomingOrders =
          previousOrderIds.current.length > 0

            ? newOrders.filter(
                order =>
                  !previousOrderIds.current.includes(
                    order._id
                  ) &&
                  !order.assignedDriver
              )

            : [];

        if (
          newIncomingOrders.length > 0
        ) {

          try {

            if (!audioRef.current) {

              audioRef.current =
                new Audio(
                  "/sounds/click.mp3"
                );

            }

            audioRef.current.volume = 1;

            await audioRef.current.play();

          } catch (audioError) {

            console.log(
              "Audio notification bloqué :",
              audioError
            );

          }

          toast.success(
            newIncomingOrders.length > 1
              ? "Nouvelles commandes disponibles"
              : "Nouvelle commande disponible"
          );

        }

        previousOrderIds.current =
          currentIds;

        setOrders(newOrders);


        // =================================================
        // GPS / ADRESSES
        // =================================================

        newOrders.forEach(
          order => {

            if (
              order.location?.lat &&
              order.location?.lng
            ) {

              calculateOrderDistance(order);

              getClientAddress(order);

            }

          }
        );

      } catch (err) {

        console.log(
          "Erreur chargement commandes :",
          err
        );

      } finally {

        setIsRefreshing(false);

      }

    };


  // =====================================================
  // INITIAL + AUTO REFRESH
  // =====================================================

  useEffect(() => {

    fetchOrders();

    const interval =
      setInterval(
        () => {
          fetchOrders();
        },
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);


  // =====================================================
  // START / ACCEPT DELIVERY
  // =====================================================

  const startTracking =
    async (orderId) => {

      if (!driver) {

        toast.error(
          "Chauffeur non connecté"
        );

        return;

      }

      try {

        const response =
          await axios.put(

            `https://konanshopping.com/api/accept-order/${orderId}`,

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
          response.data;


        // =================================================
        // UPDATE LOCAL
        // =================================================

        setOrders(
          previous =>
            previous.map(
              order =>

                order._id === orderId

                  ? {

                      ...order,

                      ...(acceptedOrder || {}),

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

        setIsTracking(true);


        // =================================================
        // GPS LIVE
        // =================================================

        if (
          navigator.geolocation
        ) {

          if (
            watchIdsRef.current[orderId]
          ) {

            navigator.geolocation.clearWatch(
              watchIdsRef.current[orderId]
            );

          }

          const watchId =
            navigator.geolocation.watchPosition(

              async (position) => {

                try {

                  const lat =
                    position.coords.latitude;

                  const lng =
                    position.coords.longitude;

                  await axios.put(

                    `https://konanshopping.com/api/order-location/${orderId}`,

                    {

                      driverId:
                        driver._id,

                      lat,

                      lng

                    }

                  );

                } catch (err) {

                  console.log(
                    "Erreur GPS serveur :",
                    err
                  );

                }

              },

              (err) => {

                console.log(
                  "Erreur GPS :",
                  err
                );

                toast.error(
                  "Impossible d'accéder au GPS"
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

          watchIdsRef.current[orderId] =
            watchId;

        }

        toast.success(
          "Livraison démarrée"
        );

        fetchOrders();

      } catch (err) {

        console.log(
          "Erreur acceptation :",
          err
        );

        if (
          err.response?.status === 409
        ) {

          toast.error(
            "Cette commande a déjà été prise."
          );

          fetchOrders();

          return;

        }

        toast.error(
          err.response?.data?.error ||
          "Impossible d'accepter cette commande."
        );

      }

    };


  // =====================================================
  // REFUSER
  // =====================================================

  const refuseOrder =
    (orderId) => {

      setRefusedOrders(
        previous => [
          ...previous,
          orderId
        ]
      );

      toast.info(
        "Commande ignorée"
      );

    };


  // =====================================================
  // FINISH DELIVERY
  // =====================================================

  const finishDelivery =
    async (orderId) => {

      try {

        await axios.put(

          `https://konanshopping.com/api/update-order-status/${orderId}`,

          {
            status:
              "Livrée"
          }

        );

        if (
          watchIdsRef.current[orderId]
        ) {

          navigator.geolocation.clearWatch(
            watchIdsRef.current[orderId]
          );

          delete watchIdsRef.current[
            orderId
          ];

        }

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

        toast.success(
          "Commande livrée avec succès"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Impossible de terminer la livraison"
        );

      }

    };


  // =====================================================
  // DELETE ORDER
  // =====================================================

  const deleteOrder =
    async (id) => {

      try {

        await axios.delete(

          `https://konanshopping.com/api/delete-order/${id}`

        );

        setOrders(
          previous =>
            previous.filter(
              order =>
                order._id !== id
            )
        );

        toast.success(
          "Commande supprimée"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Impossible de supprimer la commande"
        );

      }

    };


  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const cancelOrder =
    async (orderId) => {

      try {

        await axios.put(

          `https://konanshopping.com/api/update-order-status/${orderId}`,

          {
            status:
              "Annulée"
          }

        );

        if (
          watchIdsRef.current[orderId]
        ) {

          navigator.geolocation.clearWatch(
            watchIdsRef.current[orderId]
          );

          delete watchIdsRef.current[
            orderId
          ];

        }

        setOrders(
          previous =>
            previous.map(
              order =>

                order._id === orderId

                  ? {
                      ...order,
                      status:
                        "Annulée"
                    }

                  : order
            )
        );

        setIsTracking(false);

        toast.error(
          "Commande annulée"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Une erreur est survenue"
        );

      }

    };


  // =====================================================
  // CLEAN GPS
  // =====================================================

  useEffect(() => {

    return () => {

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

    };

  }, []);


  // =====================================================
  // DRIVER NOT CONNECTED
  // =====================================================

  if (!driver) {

    return (

      <div className="driver-login-empty">

        <div className="driver-login-card">

          <div className="driver-login-icon">
            <FaTruck />
          </div>

          <h2>
            Centre Livreur
          </h2>

          <p>
            Chauffeur non connecté
          </p>

        </div>

        <style>{`

          .driver-login-empty {
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;

            background:
              linear-gradient(
                135deg,
                #eef4ff,
                #f8fbff,
                #ffffff
              );

            font-family:
              Inter,
              system-ui,
              sans-serif;
          }

          .driver-login-card {
            width: 100%;
            max-width: 390px;
            background: #ffffff;
            border-radius: 22px;
            padding: 28px 22px;
            text-align: center;

            box-shadow:
              0 20px 55px
              rgba(15,23,42,.10);
          }

          .driver-login-icon {
            width: 65px;
            height: 65px;
            margin: 0 auto 15px;

            border-radius: 20px;

            display: flex;
            align-items: center;
            justify-content: center;

            background:
              linear-gradient(
                135deg,
                #2563eb,
                #4f46e5
              );

            color: white;
            font-size: 28px;

            box-shadow:
              0 12px 25px
              rgba(37,99,235,.20);
          }

          .driver-login-card h2 {
            margin: 0;
            color: #0f172a;
            font-size: 21px;
            font-weight: 900;
          }

          .driver-login-card p {
            color: #64748b;
            margin: 7px 0 0;
            font-size: 12px;
          }

        `}</style>

      </div>

    );

  }


  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const visibleOrders =
    orders.filter(
      order => {

        if (
          refusedOrders.includes(
            order._id
          ) &&
          !order.assignedDriver
        ) {
          return false;
        }

        if (
          order.assignedDriver &&
          order.assignedDriver.id !==
            driver._id
        ) {
          return false;
        }

        return true;

      }
    );


  // =====================================================
  // CATEGORIES
  // =====================================================

  const availableOrders =
    visibleOrders.filter(
      order =>
        !order.assignedDriver &&
        order.status !== "Livrée" &&
        order.status !== "Annulée"
    );

  const myActiveOrders =
    visibleOrders.filter(
      order =>
        order.assignedDriver?.id ===
        driver._id &&
        order.status !== "Livrée" &&
        order.status !== "Annulée"
    );

  const deliveredOrders =
    visibleOrders.filter(
      order =>
        order.assignedDriver?.id ===
        driver._id &&
        order.status === "Livrée"
    );


  // =====================================================
  // DISPLAY ORDERS
  // =====================================================

  let displayedOrders =
    visibleOrders;

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


  // =====================================================
  // ORDER CARD
  // =====================================================

  const renderOrder =
    (order) => {

      const isMine =
        order.assignedDriver?.id ===
        driver._id;

      const isAvailable =
        !order.assignedDriver;

      const isDelivered =
        order.status === "Livrée";

      const isCancelled =
        order.status === "Annulée";

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
            `driver-order-card ${
              isAvailable
                ? "available-card"
                : ""
            }`
          }
        >

          {/* HEADER */}

          <div className="order-header">

            <div className="order-client">

              <div
                className={
                  `order-main-icon ${
                    isAvailable
                      ? "blue-icon"
                      : "green-icon"
                  }`
                }
              >
                <FaBoxOpen />
              </div>

              <div className="order-client-text">

                <h2>
                  {order.customerName ||
                    "Client"}
                </h2>

                <span>
                  Commande #{order._id}
                </span>

              </div>

            </div>


            <div
              className={
                `order-status ${
                  isDelivered
                    ? "status-delivered"
                    : isCancelled
                    ? "status-cancelled"
                    : isMine
                    ? "status-active"
                    : "status-available"
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
                  <FaExclamationTriangle />
                  DISPONIBLE
                </>
              )}

            </div>

          </div>


          {/* TOTAL */}

          <div className="order-total-box">

            <div>

              <div className="small-label">
                MONTANT DE LA COMMANDE
              </div>

              <div className="order-total">
                {order.total || 0} FCFA
              </div>

            </div>

            <div className="order-mini-info">

              <span>
                <FaBox />
                {order.items?.length || 0}
              </span>

              {order.phone && (
                <span>
                  <FaPhoneAlt />
                  {order.phone}
                </span>
              )}

            </div>

          </div>


          {/* DESTINATION / PHONE */}

          <div className="order-info-grid">

            <div className="info-panel">

              <div className="info-label">

                <FaMapMarkerAlt />

                DESTINATION CLIENT

              </div>

              <div className="client-address">

                {address}

              </div>

              {order.location?.lat &&
                order.location?.lng && (

                <a
                  href={
                    `https://www.google.com/maps/dir/?api=1&destination=${order.location.lat},${order.location.lng}`
                  }

                  target="_blank"

                  rel="noreferrer"

                  className="maps-button"
                >

                  <FaRoute />

                  OUVRIR L'ITINÉRAIRE

                  <FaChevronRight
                    className="button-arrow"
                  />

                </a>

              )}

            </div>


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

                <div className="phone-content">

                  <span>
                    APPELER LE CLIENT
                  </span>

                  <strong>
                    {order.phone}
                  </strong>

                </div>

                <FaChevronRight />

              </a>

            )}

          </div>


          {/* ETA / DISTANCE */}

          <div className="eta-grid">

            <div
              className="eta-card eta-purple"
            >

              <div className="eta-icon">
                <FaClock />
              </div>

              <div>

                <span>
                  ETA
                </span>

                <strong>
                  {eta}
                </strong>

              </div>

            </div>


            <div
              className="eta-card eta-white"
            >

              <div
                className="eta-icon road-icon"
              >
                <FaRoad />
              </div>

              <div>

                <span>
                  DISTANCE
                </span>

                <strong>
                  {distance}
                </strong>

              </div>

            </div>

          </div>


          {/* PRODUCTS */}

          {order.items?.length > 0 && (

            <div className="products-section">

              <div className="section-label">

                <FaBoxOpen />

                PRODUITS DE LA COMMANDE

              </div>

              <div className="products-list">

                {order.items.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="product-item"
                    >

                      <img
                        src={item.image}
                        alt=""
                      />

                      <div className="product-info">

                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          Quantité ×{item.quantity}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* ACTIONS */}

          <div className="order-actions">

            {isAvailable && (

              <>

                <button
                  onClick={() =>
                    startTracking(
                      order._id
                    )
                  }

                  className="primary-action"
                >

                  <FaTruck />

                  <span>
                    ACCEPTER LA COMMANDE
                  </span>

                  <FaChevronRight />

                </button>


                <button
                  onClick={() =>
                    refuseOrder(
                      order._id
                    )
                  }

                  className="secondary-action"
                >

                  <FaTimesCircle />

                  REFUSER / IGNORER

                </button>

              </>

            )}


            {isMine &&
              !isDelivered &&
              !isCancelled && (

              <>

                <button
                  onClick={() =>
                    startTracking(
                      order._id
                    )
                  }

                  className="tracking-action"
                >

                  <FaLocationArrow />

                  DÉMARRER / ACTUALISER LE GPS

                  <FaSatelliteDish />

                </button>


                <div className="two-actions">

                  <button
                    onClick={() =>
                      finishDelivery(
                        order._id
                      )
                    }

                    className="delivered-action"
                  >

                    <FaCheckCircle />

                    LIVRÉE

                  </button>


                  <button
                    onClick={() =>
                      cancelOrder(
                        order._id
                      )
                    }

                    className="cancel-action"
                  >

                    <FaTimesCircle />

                    ANNULER

                  </button>

                </div>

              </>

            )}


            {isDelivered && (

              <button
                onClick={() =>
                  deleteOrder(
                    order._id
                  )
                }

                className="delete-action"
              >

                <FaTrashAlt />

                SUPPRIMER DÉFINITIVEMENT

              </button>

            )}

          </div>

        </article>

      );

    };


  // =====================================================
  // MAIN
  // =====================================================

  return (

    <div className="driver-page">

      {/* BACKGROUND */}

      <div className="background-decoration">

        <FaTruck className="bg-icon bg-truck" />

        <FaBoxOpen className="bg-icon bg-box" />

        <FaMapMarkerAlt className="bg-icon bg-map" />

        <FaMotorcycle className="bg-icon bg-bike" />

        <FaShippingFast className="bg-icon bg-shipping" />

      </div>


      <main className="driver-container">

        {/* HEADER */}

        <header className="driver-header">

          <div className="header-decoration">
            <FaTruck />
          </div>

          <div className="header-content">

            <div className="header-top">

              <div className="brand-area">

                <div className="brand-icon">
                  <FaTruck />
                </div>

                <div>

                  <span className="brand-small">
                    KONAN SHOPPING
                  </span>

                  <h1>
                    Centre Livreur
                  </h1>

                </div>

              </div>


              <div className="online-status">

                <FaCircle />

                EN LIGNE

              </div>

            </div>


            <div className="driver-welcome">

              <div>

                <div className="welcome-text">
                  Bonjour{" "}
                  {driver.name || "Livreur"}
                </div>

                <div className="welcome-subtitle">
                  Gestion professionnelle de vos livraisons
                </div>

              </div>

              <div className="driver-profile">

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

          </div>

        </header>


        {/* STATS */}

        <section className="stats-grid">

          <div className="stat-card stat-blue">

            <div className="stat-icon">
              <FaExclamationTriangle />
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


          <div className="stat-card stat-green">

            <div className="stat-icon">
              <FaTruck />
            </div>

            <div>
              <strong>
                {myActiveOrders.length}
              </strong>

              <span>
                EN COURS
              </span>
            </div>

          </div>


          <div className="stat-card stat-purple">

            <div className="stat-icon">
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


        {/* GPS */}

        {isTracking && (

          <section className="gps-live-banner">

            <div className="gps-live-left">

              <div className="gps-live-icon">
                <FaSatelliteDish />
              </div>

              <div>

                <strong>
                  GPS EN DIRECT
                </strong>

                <span>
                  Position du livreur synchronisée
                </span>

              </div>

            </div>

            <div className="live-badge">

              <FaCircle />

              LIVE

            </div>

          </section>

        )}


        {/* FILTER */}

        <nav className="filter-nav">

          {[
            {
              id: "all",
              label: "Toutes",
              icon: <FaClipboardList />,
              count: visibleOrders.length
            },

            {
              id: "available",
              label: "Disponibles",
              icon: <FaExclamationTriangle />,
              count: availableOrders.length
            },

            {
              id: "active",
              label: "Mes livraisons",
              icon: <FaTruck />,
              count: myActiveOrders.length
            },

            {
              id: "delivered",
              label: "Livrées",
              icon: <FaCheckCircle />,
              count: deliveredOrders.length
            }

          ].map(tab => (

            <button
              key={tab.id}

              onClick={() =>
                setActiveSection(
                  tab.id
                )
              }

              className={
                `filter-button ${
                  activeSection === tab.id
                    ? "filter-active"
                    : ""
                }`
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

          ))}

        </nav>


        {/* TITLE */}

        <div className="orders-title-row">

          <div>

            <h2>

              {activeSection === "available"
                ? "Commandes disponibles"

                : activeSection === "active"
                ? "Mes livraisons"

                : activeSection === "delivered"
                ? "Livraisons terminées"

                : "Centre des commandes"}

            </h2>

            <span>
              {displayedOrders.length} commande(s)
            </span>

          </div>


          <button
            onClick={() =>
              fetchOrders(true)
            }

            disabled={
              isRefreshing
            }

            className="refresh-button"
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


        {/* ORDERS */}

        <section className="orders-list">

          {displayedOrders.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">

                {activeSection === "available"

                  ? <FaBoxOpen />

                  : activeSection === "active"

                  ? <FaMotorcycle />

                  : <FaClipboardList />

                }

              </div>

              <h3>

                {activeSection === "available"
                  ? "Aucune commande disponible"

                  : activeSection === "active"
                  ? "Aucune livraison en cours"

                  : "Aucune commande"}

              </h3>

              <p>
                Les nouvelles commandes apparaîtront automatiquement ici.
              </p>

            </div>

          ) : (

            displayedOrders.map(
              order =>
                renderOrder(order)
            )

          )}

        </section>

      </main>


      {/* =====================================================
          CSS COMPACT + RESPONSIVE
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        .driver-page {

          min-height: 100vh;

          width: 100%;

          overflow-x: hidden;

          position: relative;

          background:
            linear-gradient(
              180deg,
              #eef4ff 0%,
              #f8fbff 45%,
              #ffffff 100%
            );

          padding: 12px;

          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color: #0f172a;

        }


        /* ================================================
           BACKGROUND
        ================================================ */

        .background-decoration {

          position: fixed;

          inset: 0;

          pointer-events: none;

          overflow: hidden;

          z-index: 0;

        }

        .bg-icon {

          position: absolute;

          color: #2563eb;

          opacity: .035;

        }

        .bg-truck {

          width: 110px;
          height: 110px;

          top: 5%;
          left: 3%;

          transform:
            rotate(-12deg);

        }

        .bg-box {

          width: 130px;
          height: 130px;

          top: 28%;
          right: 2%;

          transform:
            rotate(15deg);

        }

        .bg-map {

          width: 110px;
          height: 110px;

          top: 58%;
          left: 2%;

        }

        .bg-bike {

          width: 120px;
          height: 120px;

          bottom: 5%;
          right: 5%;

          transform:
            rotate(-8deg);

        }

        .bg-shipping {

          width: 90px;
          height: 90px;

          bottom: 30%;
          left: 42%;

        }


        /* ================================================
           CONTAINER
        ================================================ */

        .driver-container {

          width: 100%;

          max-width: 1180px;

          margin: 0 auto;

          position: relative;

          z-index: 1;

        }


        /* ================================================
           HEADER
        ================================================ */

        .driver-header {

          position: relative;

          overflow: hidden;

          border-radius: 20px;

          padding: 16px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #4338ca 55%,
              #6d28d9
            );

          box-shadow:
            0 14px 35px
            rgba(37,99,235,.16);

          margin-bottom: 10px;

        }

        .header-decoration {

          position: absolute;

          right: -30px;

          top: -50px;

          width: 180px;

          height: 180px;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 120px;

          opacity: .09;

          transform:
            rotate(12deg);

        }

        .header-content {

          position: relative;

          z-index: 2;

        }

        .header-top {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;

        }

        .brand-area {

          display: flex;

          align-items: center;

          gap: 10px;

          min-width: 0;

        }

        .brand-icon {

          width: 43px;
          height: 43px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            rgba(255,255,255,.15);

          border:
            1px solid
            rgba(255,255,255,.20);

          font-size: 20px;

          backdrop-filter:
            blur(10px);

        }

        .brand-small {

          display: block;

          font-size: 8px;

          font-weight: 800;

          letter-spacing: 1.3px;

          opacity: .78;

        }

        .brand-area h1 {

          margin: 2px 0 0;

          font-size: 21px;

          font-weight: 950;

          letter-spacing: -.6px;

        }

        .online-status {

          flex-shrink: 0;

          display: flex;

          align-items: center;

          gap: 5px;

          padding: 7px 9px;

          border-radius: 999px;

          background:
            rgba(255,255,255,.14);

          border:
            1px solid
            rgba(255,255,255,.15);

          font-size: 8px;

          font-weight: 900;

        }

        .online-status svg {

          font-size: 6px;

          color: #4ade80;

        }

        .driver-welcome {

          margin-top: 15px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;

        }

        .welcome-text {

          font-size: 13px;

          font-weight: 850;

        }

        .welcome-subtitle {

          margin-top: 3px;

          font-size: 9px;

          opacity: .78;

        }

        .driver-profile {

          width: 40px;
          height: 40px;

          flex-shrink: 0;

          border-radius: 50%;

          overflow: hidden;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            rgba(255,255,255,.18);

          border:
            2px solid
            rgba(255,255,255,.35);

          font-size: 15px;

        }

        .driver-profile img {

          width: 100%;
          height: 100%;

          object-fit: cover;

        }


        /* ================================================
           STATS COMPACT
        ================================================ */

        .stats-grid {

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 8px;

          margin-bottom: 10px;

        }

        .stat-card {

          background: white;

          border:
            1px solid #e7edf6;

          border-radius: 14px;

          padding: 10px;

          display: flex;

          align-items: center;

          gap: 8px;

          box-shadow:
            0 7px 20px
            rgba(15,23,42,.04);

        }

        .stat-icon {

          width: 34px;
          height: 34px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          font-size: 14px;

        }

        .stat-card strong {

          display: block;

          font-size: 18px;

          font-weight: 950;

          line-height: 1;

        }

        .stat-card span {

          display: block;

          margin-top: 3px;

          color: #64748b;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: .4px;

        }

        .stat-blue .stat-icon {
          background: #dbeafe;
          color: #2563eb;
        }

        .stat-blue strong {
          color: #2563eb;
        }

        .stat-green .stat-icon {
          background: #dcfce7;
          color: #16a34a;
        }

        .stat-green strong {
          color: #16a34a;
        }

        .stat-purple .stat-icon {
          background: #ede9fe;
          color: #7c3aed;
        }

        .stat-purple strong {
          color: #7c3aed;
        }


        /* ================================================
           GPS
        ================================================ */

        .gps-live-banner {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;

          padding: 10px 12px;

          margin-bottom: 10px;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #dcfce7,
              #bbf7d0
            );

          border:
            1px solid #86efac;

        }

        .gps-live-left {

          display: flex;

          align-items: center;

          gap: 8px;

          min-width: 0;

        }

        .gps-live-icon {

          width: 32px;
          height: 32px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

          font-size: 12px;

        }

        .gps-live-left strong {

          display: block;

          color: #166534;

          font-size: 9px;

          font-weight: 950;

        }

        .gps-live-left span {

          display: block;

          color: #15803d;

          font-size: 7px;

          margin-top: 2px;

        }

        .live-badge {

          display: flex;

          align-items: center;

          gap: 4px;

          padding: 5px 8px;

          flex-shrink: 0;

          border-radius: 999px;

          color: white;

          background: #22c55e;

          font-size: 7px;

          font-weight: 950;

        }

        .live-badge svg {
          font-size: 5px;
        }


        /* ================================================
           FILTER
        ================================================ */

        .filter-nav {

          display: flex;

          gap: 6px;

          overflow-x: auto;

          padding:
            1px 1px 5px;

          margin-bottom: 8px;

          scrollbar-width: none;

        }

        .filter-nav::-webkit-scrollbar {
          display: none;
        }

        .filter-button {

          flex-shrink: 0;

          display: flex;

          align-items: center;

          gap: 5px;

          border:
            1px solid #e4eaf2;

          background: white;

          color: #475569;

          padding: 7px 10px;

          border-radius: 999px;

          font-size: 8px;

          font-weight: 900;

          cursor: pointer;

          transition: .2s ease;

          box-shadow:
            0 4px 12px
            rgba(15,23,42,.035);

        }

        .filter-button b {

          min-width: 16px;

          height: 16px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 999px;

          background: #f1f5f9;

          font-size: 7px;

        }

        .filter-button svg {
          font-size: 9px;
        }

        .filter-active {

          border-color: transparent;

          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          box-shadow:
            0 6px 15px
            rgba(37,99,235,.15);

        }

        .filter-active b {

          color: #2563eb;

          background: white;

        }


        /* ================================================
           TITLE
        ================================================ */

        .orders-title-row {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 8px;

          margin-bottom: 8px;

        }

        .orders-title-row h2 {

          margin: 0;

          font-size: 16px;

          font-weight: 950;

          letter-spacing: -.4px;

        }

        .orders-title-row span {

          display: block;

          color: #64748b;

          font-size: 8px;

          margin-top: 3px;

        }

        .refresh-button {

          width: 34px;
          height: 34px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border:
            1px solid #e2e8f0;

          background: white;

          color: #2563eb;

          border-radius: 10px;

          cursor: pointer;

        }

        .refresh-button:disabled {

          opacity: .5;

          cursor: not-allowed;

        }

        .spin {

          animation:
            spin .8s linear infinite;

        }

        @keyframes spin {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }


        /* ================================================
           ORDERS LIST
        ================================================ */

        .orders-list {

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 10px;

        }


        /* ================================================
           COMPACT ORDER CARD
        ================================================ */

        .driver-order-card {

          position: relative;

          overflow: hidden;

          min-width: 0;

          background:
            rgba(255,255,255,.97);

          border:
            1px solid #e5eaf1;

          border-radius: 17px;

          padding: 11px;

          box-shadow:
            0 7px 20px
            rgba(15,23,42,.045);

          transition:
            transform .18s ease,
            box-shadow .18s ease;

        }

        .driver-order-card:hover {

          transform:
            translateY(-1px);

          box-shadow:
            0 12px 25px
            rgba(15,23,42,.07);

        }

        .available-card {

          border:
            1px solid
            rgba(37,99,235,.18);

          box-shadow:
            0 10px 25px
            rgba(37,99,235,.07);

        }


        /* ================================================
           ORDER HEADER
        ================================================ */

        .order-header {

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 7px;

        }

        .order-client {

          display: flex;

          align-items: center;

          gap: 7px;

          min-width: 0;

        }

        .order-main-icon {

          width: 35px;
          height: 35px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          color: white;

          font-size: 14px;

        }

        .blue-icon {

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          box-shadow:
            0 6px 14px
            rgba(37,99,235,.16);

        }

        .green-icon {

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

        }

        .order-client-text {
          min-width: 0;
        }

        .order-client-text h2 {

          margin: 0;

          color: #0f172a;

          font-size: 12px;

          font-weight: 900;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }

        .order-client-text span {

          display: block;

          color: #64748b;

          font-size: 7px;

          margin-top: 2px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }


        /* ================================================
           STATUS
        ================================================ */

        .order-status {

          flex-shrink: 0;

          display: flex;

          align-items: center;

          gap: 3px;

          padding: 5px 7px;

          border-radius: 999px;

          font-size: 6px;

          font-weight: 950;

        }

        .status-delivered {

          color: #15803d;

          background: #dcfce7;

        }

        .status-cancelled {

          color: #b91c1c;

          background: #fee2e2;

        }

        .status-active {

          color: #1d4ed8;

          background: #dbeafe;

        }

        .status-available {

          color: #92400e;

          background: #fef3c7;

        }


        /* ================================================
           TOTAL
        ================================================ */

        .order-total-box {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 7px;

          margin-top: 8px;

          padding: 9px;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #f8fafc,
              #eef4ff
            );

        }

        .small-label {

          color: #64748b;

          font-size: 6px;

          font-weight: 900;

          letter-spacing: .4px;

        }

        .order-total {

          margin-top: 2px;

          color: #4f46e5;

          font-size: 15px;

          font-weight: 950;

        }

        .order-mini-info {

          display: flex;

          flex-direction: column;

          align-items: flex-end;

          gap: 3px;

          color: #64748b;

          font-size: 7px;

        }

        .order-mini-info span {

          display: flex;

          align-items: center;

          gap: 3px;

        }

        .order-mini-info svg {

          color: #2563eb;

          font-size: 7px;

        }


        /* ================================================
           INFO
        ================================================ */

        .order-info-grid {

          display: grid;

          grid-template-columns: 1fr;

          gap: 6px;

          margin-top: 7px;

        }

        .info-panel {

          padding: 9px;

          border:
            1px solid #edf1f6;

          border-radius: 12px;

          background: #f8fafc;

        }

        .info-label {

          display: flex;

          align-items: center;

          gap: 4px;

          color: #64748b;

          font-size: 6px;

          font-weight: 950;

          letter-spacing: .4px;

        }

        .info-label svg {

          color: #2563eb;

          font-size: 8px;

        }

        .client-address {

          margin-top: 5px;

          color: #0f172a;

          font-size: 9px;

          font-weight: 700;

          line-height: 1.35;

        }

        .maps-button {

          width: 100%;

          margin-top: 7px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          padding: 8px;

          border-radius: 9px;

          text-decoration: none;

          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          font-size: 7px;

          font-weight: 900;

        }

        .button-arrow {

          margin-left: auto;

          font-size: 6px;

        }


        /* ================================================
           PHONE
        ================================================ */

        .phone-button {

          display: flex;

          align-items: center;

          gap: 7px;

          padding: 8px;

          border-radius: 11px;

          text-decoration: none;

          color: white;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

        }

        .phone-icon {

          width: 29px;
          height: 29px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 8px;

          background:
            rgba(255,255,255,.16);

          font-size: 10px;

        }

        .phone-content {

          min-width: 0;

          flex: 1;

        }

        .phone-content span {

          display: block;

          font-size: 6px;

          font-weight: 900;

          opacity: .8;

        }

        .phone-content strong {

          display: block;

          margin-top: 1px;

          font-size: 9px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }

        .phone-button > svg {

          font-size: 7px;

        }


        /* ================================================
           ETA
        ================================================ */

        .eta-grid {

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 6px;

          margin-top: 7px;

        }

        .eta-card {

          display: flex;

          align-items: center;

          gap: 6px;

          padding: 8px;

          border-radius: 11px;

        }

        .eta-purple {

          color: white;

          background:
            linear-gradient(
              135deg,
              #5b3df5,
              #7c4dff
            );

        }

        .eta-white {

          color: #0f172a;

          background: white;

          border:
            1px solid #e2e8f0;

        }

        .eta-icon {

          width: 28px;
          height: 28px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background:
            rgba(255,255,255,.15);

          font-size: 10px;

        }

        .road-icon {

          color: #2563eb;

          background: #dbeafe;

        }

        .eta-card span {

          display: block;

          font-size: 6px;

          font-weight: 900;

          opacity: .75;

        }

        .eta-card strong {

          display: block;

          margin-top: 1px;

          font-size: 13px;

          font-weight: 950;

        }


        /* ================================================
           PRODUCTS
        ================================================ */

        .products-section {

          margin-top: 8px;

        }

        .section-label {

          display: flex;

          align-items: center;

          gap: 4px;

          margin-bottom: 5px;

          color: #64748b;

          font-size: 6px;

          font-weight: 950;

          letter-spacing: .4px;

        }

        .section-label svg {

          color: #2563eb;

          font-size: 8px;

        }

        .products-list {

          display: flex;

          flex-direction: column;

          gap: 4px;

        }

        .product-item {

          display: flex;

          align-items: center;

          gap: 6px;

          padding: 5px;

          border:
            1px solid #edf1f6;

          border-radius: 9px;

          background: #f8fafc;

        }

        .product-item img {

          width: 34px;
          height: 34px;

          flex-shrink: 0;

          object-fit: cover;

          border-radius: 7px;

          background: #e2e8f0;

        }

        .product-info {

          min-width: 0;

        }

        .product-info strong {

          display: block;

          color: #111827;

          font-size: 8px;

          font-weight: 850;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }

        .product-info span {

          display: block;

          margin-top: 2px;

          color: #64748b;

          font-size: 6px;

        }


        /* ================================================
           ACTIONS
        ================================================ */

        .order-actions {

          margin-top: 8px;

          display: flex;

          flex-direction: column;

          gap: 5px;

        }

        .primary-action,
        .tracking-action,
        .delivered-action,
        .cancel-action,
        .delete-action,
        .secondary-action {

          border: none;

          min-height: 36px;

          border-radius: 10px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          font-family: inherit;

          font-size: 7px;

          font-weight: 950;

          cursor: pointer;

          transition:
            transform .15s ease;

        }

        .primary-action:active,
        .tracking-action:active,
        .delivered-action:active,
        .cancel-action:active,
        .delete-action:active,
        .secondary-action:active {

          transform:
            scale(.98);

        }

        .primary-action {

          width: 100%;

          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );

          box-shadow:
            0 7px 17px
            rgba(37,99,235,.16);

        }

        .primary-action svg:last-child {

          margin-left: auto;

        }

        .secondary-action {

          width: 100%;

          color: #64748b;

          background: white;

          border:
            1px solid #e2e8f0;

        }

        .tracking-action {

          width: 100%;

          color: white;

          background:
            linear-gradient(
              135deg,
              #5b3df5,
              #7c4dff
            );

          box-shadow:
            0 7px 17px
            rgba(91,61,245,.15);

        }

        .tracking-action svg:last-child {

          margin-left: auto;

        }

        .two-actions {

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 5px;

        }

        .delivered-action {

          color: white;

          background:
            linear-gradient(
              135deg,
              #22c55e,
              #16a34a
            );

        }

        .cancel-action {

          color: white;

          background:
            linear-gradient(
              135deg,
              #ef4444,
              #dc2626
            );

        }

        .delete-action {

          width: 100%;

          color: white;

          background:
            linear-gradient(
              135deg,
              #111827,
              #1e293b
            );

        }


        /* ================================================
           EMPTY
        ================================================ */

        .empty-state {

          grid-column:
            1 / -1;

          padding:
            40px 20px;

          text-align: center;

          border-radius: 18px;

          background: white;

          border:
            1px solid #e7edf5;

          box-shadow:
            0 10px 28px
            rgba(15,23,42,.04);

        }

        .empty-icon {

          width: 58px;
          height: 58px;

          margin:
            0 auto 12px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 18px;

          color: #2563eb;

          background: #eff6ff;

          font-size: 23px;

        }

        .empty-state h3 {

          margin: 0;

          color: #0f172a;

          font-size: 14px;

          font-weight: 950;

        }

        .empty-state p {

          max-width: 350px;

          margin:
            6px auto 0;

          color: #64748b;

          font-size: 9px;

          line-height: 1.5;

        }


        /* ================================================
           TABLET
        ================================================ */

        @media (max-width: 900px) {

          .driver-page {
            padding: 10px;
          }

          .orders-list {

            grid-template-columns:
              1fr;

          }

          .driver-container {
            max-width: 720px;
          }

        }


        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 600px) {

          .driver-page {

            padding: 7px;

            padding-bottom: 20px;

          }

          .driver-header {

            border-radius: 17px;

            padding: 13px;

          }

          .brand-icon {

            width: 39px;
            height: 39px;

            border-radius: 11px;

            font-size: 18px;

          }

          .brand-small {
            font-size: 7px;
          }

          .brand-area h1 {

            font-size: 18px;

          }

          .online-status {

            padding: 6px 7px;

            font-size: 7px;

          }

          .driver-welcome {

            margin-top: 12px;

          }

          .welcome-text {

            font-size: 11px;

          }

          .welcome-subtitle {

            font-size: 8px;

          }

          .driver-profile {

            width: 36px;
            height: 36px;

          }


          .stats-grid {

            gap: 5px;

          }

          .stat-card {

            padding: 8px 5px;

            flex-direction: column;

            justify-content: center;

            gap: 4px;

            text-align: center;

            border-radius: 12px;

          }

          .stat-icon {

            width: 29px;
            height: 29px;

            border-radius: 9px;

            font-size: 12px;

          }

          .stat-card strong {

            font-size: 16px;

          }

          .stat-card span {

            font-size: 6px;

          }


          .gps-live-banner {

            padding: 9px;

            border-radius: 13px;

          }

          .gps-live-icon {

            width: 30px;
            height: 30px;

          }

          .gps-live-left strong {
            font-size: 8px;
          }

          .gps-live-left span {
            font-size: 7px;
          }

          .live-badge {
            font-size: 7px;
          }


          .filter-button {

            padding: 7px 8px;

            font-size: 7px;

          }


          .orders-title-row h2 {

            font-size: 14px;

          }


          .driver-order-card {

            border-radius: 15px;

            padding: 9px;

          }


          .order-main-icon {

            width: 32px;
            height: 32px;

            border-radius: 9px;

            font-size: 12px;

          }

          .order-client-text h2 {

            font-size: 11px;

          }

          .order-status {

            padding: 5px 6px;

            font-size: 5px;

          }


          .order-total {

            font-size: 14px;

          }


          .eta-card {

            padding: 7px;

          }

          .eta-icon {

            width: 25px;
            height: 25px;

          }

          .eta-card strong {

            font-size: 12px;

          }


          .primary-action,
          .tracking-action,
          .delivered-action,
          .cancel-action,
          .delete-action,
          .secondary-action {

            min-height: 35px;

            font-size: 7px;

          }

        }


        /* ================================================
           VERY SMALL PHONES
        ================================================ */

        @media (max-width: 380px) {

          .driver-page {

            padding: 5px;

          }

          .driver-header {

            padding: 11px;

          }

          .brand-area {

            gap: 7px;

          }

          .brand-icon {

            width: 36px;
            height: 36px;

            font-size: 16px;

          }

          .brand-area h1 {

            font-size: 16px;

          }

          .online-status {

            padding: 5px 6px;

          }

          .stats-grid {

            gap: 4px;

          }

          .stat-card {

            padding: 7px 3px;

          }

          .stat-card strong {

            font-size: 15px;

          }

          .driver-order-card {

            padding: 8px;

          }

          .two-actions {

            gap: 4px;

          }

          .primary-action,
          .tracking-action,
          .delivered-action,
          .cancel-action,
          .delete-action,
          .secondary-action {

            font-size: 6px;

          }

        }


        /* ================================================
           DESKTOP LARGE
        ================================================ */

        @media (min-width: 1200px) {

          .driver-page {

            padding: 18px;

          }

          .driver-header {

            padding: 20px;

          }

          .orders-list {

            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 12px;

          }

          .driver-order-card {

            padding: 12px;

          }

        }

      `}</style>

    </div>

  );

}