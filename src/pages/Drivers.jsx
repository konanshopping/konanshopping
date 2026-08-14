import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Navigate,
} from "react-router-dom";

import {
  FaTruck,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCar,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaCircle,
  FaCalendarCheck,
  FaRoute,
  FaMotorcycle,
  FaSyncAlt,
  FaExclamationTriangle,
  FaTimes,
  FaMap,
  FaLocationArrow,
  FaRulerHorizontal,
  FaBoxOpen,
} from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// ======================================================
// 🌐 API
// ======================================================

const API =
  "https://konanshopping.com";


// ======================================================
// 🗺️ ICÔNE LIVREUR
// ======================================================

const driverMapIcon =
  new L.Icon({

    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/854/854894.png",

    iconSize: [
      42,
      42,
    ],

    iconAnchor: [
      21,
      21,
    ],

    popupAnchor: [
      0,
      -21,
    ],

  });


// ======================================================
// 📍 RECENTRER LA CARTE
// ======================================================

function RouteMapController({
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
      14,
      {
        duration: 1,
      }
    );

  }, [
    map,
    position,
  ]);


  return null;

}


// ======================================================
// 📏 DISTANCE ENTRE DEUX POINTS
// ======================================================

function calculateDistance(
  lat1,
  lng1,
  lat2,
  lng2
) {

  const R =
    6371;


  const dLat =
    (
      lat2 -
      lat1
    ) *
    Math.PI /
    180;


  const dLng =
    (
      lng2 -
      lng1
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
      dLng / 2
    ) *
    Math.sin(
      dLng / 2
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
// 📏 DISTANCE TOTALE DU TRAJET
// ======================================================

function calculateTotalRouteDistance(
  route
) {

  if (
    !Array.isArray(route) ||
    route.length < 2
  ) {

    return 0;

  }


  let total =
    0;


  for (
    let i = 1;
    i < route.length;
    i++
  ) {

    const previous =
      route[i - 1];

    const current =
      route[i];


    const lat1 =
      Number(
        previous.lat
      );

    const lng1 =
      Number(
        previous.lng
      );

    const lat2 =
      Number(
        current.lat
      );

    const lng2 =
      Number(
        current.lng
      );


    if (
      !Number.isFinite(lat1) ||
      !Number.isFinite(lng1) ||
      !Number.isFinite(lat2) ||
      !Number.isFinite(lng2)
    ) {

      continue;

    }


    total +=
      calculateDistance(
        lat1,
        lng1,
        lat2,
        lng2
      );

  }


  return total;

}


// ======================================================
// 🖼️ IMAGE LIVREUR
// ======================================================

function getDriverPhoto(
  photo
) {

  if (!photo) {

    return "";

  }


  const value =
    String(
      photo
    ).trim();


  if (!value) {

    return "";

  }


  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    )
  ) {

    return value;

  }


  if (
    value.startsWith("/")
  ) {

    return `${API}${value}`;

  }


  return value;

}


// ======================================================
// 🚚 DRIVERS
// ======================================================

export default function Drivers() {

  // ====================================================
  // 🔐 ADMIN
  // ====================================================

  const admin =
    JSON.parse(
      localStorage.getItem(
        "admin"
      )
    );


  // ====================================================
  // 📦 LIVREURS
  // ====================================================

  const [
    drivers,
    setDrivers,
  ] = useState([]);


  // ====================================================
  // 🔄 CHARGEMENT
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
  // 🗑️ SUPPRESSION
  // ====================================================

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);


  // ====================================================
  // 🗺️ LIVREUR SÉLECTIONNÉ POUR LE TRAJET
  // ====================================================

  const [
    selectedDriver,
    setSelectedDriver,
  ] = useState(null);


  // ====================================================
  // 🗺️ TRAJET
  // ====================================================

  const [
    routeData,
    setRouteData,
  ] = useState(null);


  // ====================================================
  // 🔄 CHARGEMENT TRAJET
  // ====================================================

  const [
    routeLoading,
    setRouteLoading,
  ] = useState(false);


  // ====================================================
  // ❌ ERREUR TRAJET
  // ====================================================

  const [
    routeError,
    setRouteError,
  ] = useState("");


  // ====================================================
  // 📡 RÉCUPÉRER LES LIVREURS
  // ====================================================

  const fetchDrivers =
    async () => {

      try {

        setLoading(true);

        setError("");


        const res =
          await axios.get(
            `${API}/api/drivers`
          );


        setDrivers(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );


      } catch (err) {

        console.error(
          "❌ ERREUR LIVREURS :",
          err
        );


        setError(
          "Impossible de récupérer les livreurs."
        );

      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // 🚀 CHARGEMENT INITIAL
  // ====================================================

  useEffect(() => {

    fetchDrivers();

  }, []);


  // ====================================================
  // 🗺️ CHARGER LE TRAJET DU JOUR
  // ====================================================

  const fetchDriverRoute =
    async (
      driver
    ) => {

      try {

        setSelectedDriver(
          driver
        );

        setRouteData(
          null
        );

        setRouteError(
          ""
        );

        setRouteLoading(
          true
        );


        const res =
          await axios.get(

            `${API}/api/driver/${driver._id}/today-route`

          );


        if (
          !res.data?.success
        ) {

          throw new Error(
            res.data?.message ||
            "Impossible de récupérer le trajet."
          );

        }


        setRouteData(
          res.data
        );


      } catch (err) {

        console.error(
          "❌ ERREUR TRAJET :",
          err
        );


        setRouteError(

          err?.response?.data
            ?.message ||

          err?.message ||

          "Impossible de récupérer le trajet du jour."

        );

      } finally {

        setRouteLoading(
          false
        );

      }

    };


  // ====================================================
  // ❌ FERMER TRAJET
  // ====================================================

  const closeRoute =
    () => {

      setSelectedDriver(
        null
      );

      setRouteData(
        null
      );

      setRouteError(
        ""
      );

    };


  // ====================================================
  // 🗑️ SUPPRIMER LIVREUR
  // ====================================================

  const deleteDriver =
    async (
      id
    ) => {

      if (
        !window.confirm(
          "Voulez-vous vraiment supprimer définitivement ce livreur ?"
        )
      ) {

        return;

      }


      try {

        setDeletingId(
          id
        );


        await axios.delete(
          `${API}/api/drivers/${id}`
        );


        setDrivers(
          (
            currentDrivers
          ) =>
            currentDrivers.filter(
              (
                driver
              ) =>
                driver._id !== id
            )
        );


        if (
          selectedDriver?._id ===
          id
        ) {

          closeRoute();

        }


      } catch (err) {

        console.error(
          "❌ SUPPRESSION LIVREUR :",
          err
        );


        alert(
          "Impossible de supprimer ce livreur."
        );

      } finally {

        setDeletingId(
          null
        );

      }

    };


  // ====================================================
  // 📊 STATISTIQUES GÉNÉRALES
  // ====================================================

  const globalStats =
    useMemo(() => {

      const total =
        drivers.length;


      const online =
        drivers.filter(
          (
            driver
          ) =>
            driver.isOnline ===
            true
        ).length;


      const available =
        drivers.filter(
          (
            driver
          ) =>
            driver.available ===
            true
        ).length;


      const totalDelivered =
        drivers.reduce(
          (
            total,
            driver
          ) => {

            return (
              total +
              Number(
                driver?.stats
                  ?.totalDelivered ||
                0
              )
            );

          },
          0
        );


      const deliveredToday =
        drivers.reduce(
          (
            total,
            driver
          ) => {

            return (
              total +
              Number(
                driver?.stats
                  ?.deliveredToday ||
                0
              )
            );

          },
          0
        );


      const inDelivery =
        drivers.reduce(
          (
            total,
            driver
          ) => {

            return (
              total +
              Number(
                driver?.stats
                  ?.inDelivery ||
                0
              )
            );

          },
          0
        );


      return {

        total,

        online,

        available,

        totalDelivered,

        deliveredToday,

        inDelivery,

      };

    }, [
      drivers,
    ]);


  // ====================================================
  // 🔐 PROTECTION ADMIN
  // ====================================================

  if (!admin) {

    return (

      <Navigate
        to="/"
        replace
      />

    );

  }


  // ====================================================
  // ⏳ LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="drivers-page">

        <div className="drivers-loading">

          <div className="loading-icon">

            <FaTruck />

          </div>

          <h2>
            Chargement des livreurs
          </h2>

          <p>
            Récupération des informations...
          </p>

          <div
            className="loading-spinner"
          />

        </div>


        <style>{`

          * {
            box-sizing: border-box;
          }

          .drivers-page {
            min-height: 100vh;
            padding: 24px;
            background:
              linear-gradient(
                180deg,
                #eff6ff 0%,
                #f8fafc 45%,
                #ffffff 100%
              );
            font-family:
              Inter,
              system-ui,
              sans-serif;
          }

          .drivers-loading {
            width: 100%;
            max-width: 430px;
            margin: 80px auto;
            padding: 35px 25px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            text-align: center;
            box-shadow:
              0 20px 60px
              rgba(15,23,42,.08);
          }

          .loading-icon {
            width: 70px;
            height: 70px;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            background:
              linear-gradient(
                135deg,
                #2563eb,
                #4f46e5
              );
            color: white;
            font-size: 28px;
          }

          .drivers-loading h2 {
            margin: 20px 0 7px;
            color: #0f172a;
            font-size: 20px;
            font-weight: 900;
          }

          .drivers-loading p {
            margin: 0;
            color: #64748b;
            font-size: 13px;
          }

          .loading-spinner {
            width: 34px;
            height: 34px;
            margin: 25px auto 0;
            border:
              3px solid #dbeafe;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation:
              driverSpin .8s linear infinite;
          }

          @keyframes driverSpin {
            to {
              transform: rotate(360deg);
            }
          }

        `}</style>

      </div>

    );

  }


  // ====================================================
  // 🖥️ INTERFACE
  // ====================================================

  return (

    <div className="drivers-page">

      <div className="drivers-container">

        {/* ============================================
            HEADER
        ============================================ */}

        <header
          className="drivers-header"
        >

          <div
            className="header-left"
          >

            <div
              className="header-icon"
            >

              <FaTruck />

            </div>


            <div>

              <span
                className="eyebrow"
              >
                ADMINISTRATION
              </span>


              <h1>
                Gestion des livreurs
              </h1>


              <p>
                Contrôlez et suivez votre
                équipe de livraison.
              </p>

            </div>

          </div>


          <button
            className="refresh-button"
            onClick={
              fetchDrivers
            }
            disabled={
              loading
            }
          >

            <FaSyncAlt />

            <span>
              Actualiser
            </span>

          </button>

        </header>


        {/* ============================================
            ERREUR
        ============================================ */}

        {error && (

          <div
            className="error-banner"
          >

            <FaExclamationTriangle />

            <span>
              {error}
            </span>

            <button
              onClick={
                fetchDrivers
              }
            >
              Réessayer
            </button>

          </div>

        )}


        {/* ============================================
            STATISTIQUES
        ============================================ */}

        <section
          className="global-stats"
        >

          <StatCard
            icon={
              <FaTruck />
            }
            label="Livreurs"
            value={
              globalStats.total
            }
            className="blue"
          />


          <StatCard
            icon={
              <FaCircle />
            }
            label="En ligne"
            value={
              globalStats.online
            }
            className="green"
          />


          <StatCard
            icon={
              <FaCheckCircle />
            }
            label="Livrées"
            value={
              globalStats.totalDelivered
            }
            className="purple"
          />


          <StatCard
            icon={
              <FaCalendarCheck />
            }
            label="Aujourd'hui"
            value={
              globalStats.deliveredToday
            }
            className="orange"
          />


          <StatCard
            icon={
              <FaMotorcycle />
            }
            label="En livraison"
            value={
              globalStats.inDelivery
            }
            className="red"
          />

        </section>


        {/* ============================================
            LISTE
        ============================================ */}

        <section
          className="drivers-section"
        >

          <div
            className="section-heading"
          >

            <div>

              <span>
                ÉQUIPE DE LIVRAISON
              </span>

              <h2>
                Vos livreurs
              </h2>

            </div>


            <div
              className="driver-count"
            >

              {drivers.length}

              <span>
                livreur
                {drivers.length > 1
                  ? "s"
                  : ""}
              </span>

            </div>

          </div>


          {drivers.length === 0 ? (

            <div
              className="empty-state"
            >

              <div
                className="empty-icon"
              >

                <FaTruck />

              </div>

              <h3>
                Aucun livreur
              </h3>

              <p>
                Aucun livreur n'est
                actuellement enregistré.
              </p>

            </div>

          ) : (

            <div
              className="drivers-grid"
            >

              {drivers.map(
                (
                  driver
                ) => {

                  const stats =
                    driver.stats ||
                    {};


                  const photo =
                    getDriverPhoto(
                      driver.photo
                    );


                  return (

                    <article
                      key={
                        driver._id
                      }
                      className="driver-card"
                    >

                      {/* ==========================
                          PROFIL
                      ========================== */}

                      <div
                        className="driver-top"
                      >

                        <div
                          className="driver-avatar"
                        >

                          {photo ? (

                            <img
                              src={photo}
                              alt={
                                driver.name ||
                                "Livreur"
                              }
                              onError={(
                                event
                              ) => {

                                event
                                  .currentTarget
                                  .style
                                  .display =
                                  "none";

                              }}
                            />

                          ) : (

                            <FaUser />

                          )}

                        </div>


                        <div
                          className="driver-main-info"
                        >

                          <div
                            className="driver-name-row"
                          >

                            <h3>
                              {driver.name ||
                                "Livreur"}
                            </h3>


                            <span
                              className={
                                driver.isOnline
                                  ? "online-badge"
                                  : "offline-badge"
                              }
                            >

                              <FaCircle />

                              {driver.isOnline
                                ? "En ligne"
                                : "Hors ligne"}

                            </span>

                          </div>


                          <p
                            className="driver-email"
                          >

                            {driver.email ||
                              "Email non renseigné"}

                          </p>

                        </div>

                      </div>


                      {/* ==========================
                          INFORMATIONS
                      ========================== */}

                      <div
                        className="driver-details"
                      >

                        <InfoRow
                          icon={
                            <FaPhoneAlt />
                          }
                          label="Téléphone"
                          value={
                            driver.phone ||
                            "Non renseigné"
                          }
                        />


                        <InfoRow
                          icon={
                            <FaMapMarkerAlt />
                          }
                          label="Ville"
                          value={
                            driver.city ||
                            "Non renseignée"
                          }
                        />


                        <InfoRow
                          icon={
                            <FaCar />
                          }
                          label="Véhicule"
                          value={
                            driver.vehicle ||
                            "Non renseigné"
                          }
                        />


                        <InfoRow
                          icon={
                            <FaTruck />
                          }
                          label="Plaque"
                          value={
                            driver.plate ||
                            "Non renseignée"
                          }
                        />

                      </div>


                      {/* ==========================
                          STATISTIQUES
                      ========================== */}

                      <div
                        className="driver-stats"
                      >

                        <MiniStat
                          icon={
                            <FaCheckCircle />
                          }
                          value={
                            stats.totalDelivered ||
                            0
                          }
                          label="Total livré"
                          type="blue"
                        />


                        <MiniStat
                          icon={
                            <FaCalendarCheck />
                          }
                          value={
                            stats.deliveredToday ||
                            0
                          }
                          label="Aujourd'hui"
                          type="green"
                        />


                        <MiniStat
                          icon={
                            <FaMotorcycle />
                          }
                          value={
                            stats.inDelivery ||
                            0
                          }
                          label="En cours"
                          type="orange"
                        />

                      </div>


                      {/* ==========================
                          DERNIÈRE LIVRAISON
                      ========================== */}

                      {stats.lastDeliveredAt && (

                        <div
                          className="last-delivery"
                        >

                          <FaClock />

                          <div>

                            <span>
                              Dernière livraison
                            </span>

                            <strong>
                              {new Date(
                                stats.lastDeliveredAt
                              ).toLocaleString(
                                "fr-FR",
                                {
                                  day:
                                    "2-digit",
                                  month:
                                    "2-digit",
                                  year:
                                    "numeric",
                                  hour:
                                    "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              )}
                            </strong>

                          </div>

                        </div>

                      )}


                      {/* ==========================
                          ACTIONS
                      ========================== */}

                      <div
                        className="driver-actions"
                      >

                        <button
                          className="route-button"
                          onClick={() =>
                            fetchDriverRoute(
                              driver
                            )
                          }
                        >

                          <FaRoute />

                          Voir le trajet

                        </button>


                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteDriver(
                              driver._id
                            )
                          }
                          disabled={
                            deletingId ===
                            driver._id
                          }
                        >

                          {deletingId ===
                          driver._id ? (

                            <FaSyncAlt
                              className="button-spin"
                            />

                          ) : (

                            <FaTrash />

                          )}


                          {deletingId ===
                          driver._id
                            ? "Suppression..."
                            : "Supprimer"}

                        </button>

                      </div>

                    </article>

                  );

                }
              )}

            </div>

          )}

        </section>

      </div>


      {/* ==================================================
          🗺️ MODALE TRAJET
      ================================================== */}

      {selectedDriver && (

        <div
          className="route-overlay"
          onMouseDown={(
            event
          ) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeRoute();

            }

          }}
        >

          <div
            className="route-modal"
          >

            {/* =========================================
                HEADER CARTE
            ========================================= */}

            <div
              className="route-modal-header"
            >

              <div
                className="route-driver-profile"
              >

                <div
                  className="route-driver-avatar"
                >

                  {getDriverPhoto(
                    selectedDriver.photo
                  ) ? (

                    <img
                      src={
                        getDriverPhoto(
                          selectedDriver.photo
                        )
                      }
                      alt={
                        selectedDriver.name ||
                        "Livreur"
                      }
                    />

                  ) : (

                    <FaUser />

                  )}

                </div>


                <div>

                  <span>
                    TRAJET DU JOUR
                  </span>

                  <h2>
                    {selectedDriver.name ||
                      "Livreur"}
                  </h2>

                  <p>
                    <FaMapMarkerAlt />
                    {" "}
                    {selectedDriver.city ||
                      "Ville non renseignée"}
                  </p>

                </div>

              </div>


              <button
                className="close-route"
                onClick={
                  closeRoute
                }
                aria-label="Fermer"
              >

                <FaTimes />

              </button>

            </div>


            {/* =========================================
                INFOS TRAJET
            ========================================= */}

            {routeData && (

              <div
                className="route-summary"
              >

                <RouteSummaryCard
                  icon={
                    <FaRoute />
                  }
                  label="Points GPS"
                  value={
                    routeData.count ||
                    0
                  }
                />


                <RouteSummaryCard
                  icon={
                    <FaRulerHorizontal />
                  }
                  label="Distance"
                  value={
                    `${calculateTotalRouteDistance(
                      routeData.route
                    ).toFixed(2)} km`
                  }
                />


                <RouteSummaryCard
                  icon={
                    <FaBoxOpen />
                  }
                  label="Commandes"
                  value={
                    new Set(
                      (
                        routeData.route ||
                        []
                      )
                        .map(
                          (
                            point
                          ) =>
                            point.orderId
                              ? String(
                                  point.orderId
                                )
                              : null
                        )
                        .filter(Boolean)
                    ).size
                  }
                />

              </div>

            )}


            {/* =========================================
                CONTENU CARTE
            ========================================= */}

            <div
              className="route-map-wrapper"
            >

              {routeLoading ? (

                <div
                  className="route-loading"
                >

                  <div
                    className="route-loading-icon"
                  >

                    <FaRoute />

                  </div>

                  <strong>
                    Chargement du trajet
                  </strong>

                  <span>
                    Récupération des positions
                    GPS de la journée...
                  </span>

                  <div
                    className="loading-spinner"
                  />

                </div>

              ) : routeError ? (

                <div
                  className="route-empty"
                >

                  <div
                    className="route-empty-icon error"
                  >

                    <FaExclamationTriangle />

                  </div>

                  <strong>
                    Impossible de charger
                    le trajet
                  </strong>

                  <span>
                    {routeError}
                  </span>

                  <button
                    className="retry-route"
                    onClick={() =>
                      fetchDriverRoute(
                        selectedDriver
                      )
                    }
                  >

                    <FaSyncAlt />

                    Réessayer

                  </button>

                </div>

              ) : !routeData ||
                !Array.isArray(
                  routeData.route
                ) ||
                routeData.route.length ===
                  0 ? (

                <div
                  className="route-empty"
                >

                  <div
                    className="route-empty-icon"
                  >

                    <FaMap />

                  </div>

                  <strong>
                    Aucun trajet enregistré
                  </strong>

                  <span>
                    Aucune position GPS n'a
                    encore été enregistrée
                    aujourd'hui pour ce livreur.
                  </span>

                </div>

              ) : (

                <DriverRouteMap
                  route={
                    routeData.route
                  }
                  driver={
                    selectedDriver
                  }
                />

              )}

            </div>


            {/* =========================================
                FOOTER
            ========================================= */}

            <div
              className="route-modal-footer"
            >

              <div>

                <FaLocationArrow />

                <span>
                  Les données affichées
                  proviennent des positions GPS
                  réellement transmises par le
                  livreur.
                </span>

              </div>


              <button
                onClick={() =>
                  fetchDriverRoute(
                    selectedDriver
                  )
                }
                disabled={
                  routeLoading
                }
              >

                <FaSyncAlt />

                Actualiser

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          CSS
      ================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .drivers-page {
          min-height: 100vh;
          width: 100%;
          padding: 24px;
          background:
            linear-gradient(
              180deg,
              #eff6ff 0%,
              #f8fafc 35%,
              #ffffff 100%
            );
          color: #0f172a;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          overflow-x: hidden;
        }

        .drivers-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .drivers-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
        }

        .header-icon {
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );
          color: white;
          font-size: 24px;
          box-shadow:
            0 12px 30px
            rgba(37,99,235,.20);
        }

        .eyebrow {
          display: block;
          margin-bottom: 3px;
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .drivers-header h1 {
          margin: 0;
          font-size: 28px;
          line-height: 1.15;
          font-weight: 950;
        }

        .drivers-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .refresh-button {
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 16px;
          border: 1px solid #dbeafe;
          border-radius: 13px;
          background: #ffffff;
          color: #2563eb;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        /* ==========================================
           ERROR
        ========================================== */

        .error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding: 13px 15px;
          border: 1px solid #fecaca;
          border-radius: 14px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 12px;
          font-weight: 700;
        }

        .error-banner span {
          flex: 1;
        }

        .error-banner button {
          border: none;
          background: #dc2626;
          color: white;
          padding: 8px 12px;
          border-radius: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        /* ==========================================
           GLOBAL STATS
        ========================================== */

        .global-stats {
          display: grid;
          grid-template-columns:
            repeat(5,minmax(0,1fr));
          gap: 12px;
          margin-bottom: 25px;
        }

        /* ==========================================
           SECTION
        ========================================== */

        .drivers-section {
          width: 100%;
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 15px;
        }

        .section-heading > div:first-child span {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .section-heading h2 {
          margin: 4px 0 0;
          font-size: 21px;
          font-weight: 950;
        }

        .driver-count {
          display: flex;
          align-items: baseline;
          gap: 4px;
          padding: 8px 12px;
          border-radius: 11px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #2563eb;
          font-size: 15px;
          font-weight: 950;
        }

        .driver-count span {
          color: #64748b;
          font-size: 10px;
          font-weight: 700;
        }

        /* ==========================================
           GRID
        ========================================== */

        .drivers-grid {
          display: grid;
          grid-template-columns:
            repeat(3,minmax(0,1fr));
          gap: 15px;
        }

        /* ==========================================
           CARD
        ========================================== */

        .driver-card {
          min-width: 0;
          padding: 17px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 21px;
          box-shadow:
            0 10px 30px
            rgba(15,23,42,.055);
        }

        .driver-top {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          padding-bottom: 15px;
          border-bottom: 1px solid #f1f5f9;
        }

        .driver-avatar {
          width: 65px;
          height: 65px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #eff6ff
            );
          color: #2563eb;
          font-size: 25px;
        }

        .driver-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .driver-main-info {
          min-width: 0;
          flex: 1;
        }

        .driver-name-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
        }

        .driver-name-row h3 {
          min-width: 0;
          margin: 0;
          color: #0f172a;
          font-size: 16px;
          font-weight: 950;
          overflow-wrap: anywhere;
        }

        .online-badge,
        .offline-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 7px;
          border-radius: 8px;
          font-size: 8px;
          font-weight: 900;
          white-space: nowrap;
        }

        .online-badge {
          background: #dcfce7;
          color: #15803d;
        }

        .offline-badge {
          background: #f1f5f9;
          color: #64748b;
        }

        .online-badge svg,
        .offline-badge svg {
          font-size: 6px;
        }

        .driver-email {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 9px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ==========================================
           DETAILS
        ========================================== */

        .driver-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 13px;
        }

        /* ==========================================
           STATS
        ========================================== */

        .driver-stats {
          display: grid;
          grid-template-columns:
            repeat(3,minmax(0,1fr));
          gap: 7px;
          margin-top: 13px;
        }

        /* ==========================================
           LAST DELIVERY
        ========================================== */

        .last-delivery {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 10px;
          padding: 10px;
          border-radius: 12px;
          background: #f8fafc;
          color: #64748b;
        }

        .last-delivery > svg {
          flex-shrink: 0;
          color: #2563eb;
        }

        .last-delivery span {
          display: block;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 800;
        }

        .last-delivery strong {
          display: block;
          margin-top: 2px;
          color: #334155;
          font-size: 10px;
          font-weight: 900;
        }

        /* ==========================================
           ACTIONS
        ========================================== */

        .driver-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 13px;
        }

        .route-button,
        .delete-button {
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: none;
          border-radius: 12px;
          padding: 0 10px;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .route-button {
          background: #eff6ff;
          color: #2563eb;
        }

        .delete-button {
          background: #fef2f2;
          color: #dc2626;
        }

        .delete-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .button-spin {
          animation:
            driverSpin .8s linear infinite;
        }

        /* ==========================================
           EMPTY
        ========================================== */

        .empty-state {
          padding: 55px 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          text-align: center;
        }

        .empty-icon {
          width: 65px;
          height: 65px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 26px;
        }

        .empty-state h3 {
          margin: 15px 0 5px;
          font-size: 18px;
          font-weight: 950;
        }

        .empty-state p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
        }

        /* ==========================================
           ROUTE OVERLAY
        ========================================== */

        .route-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background:
            rgba(15,23,42,.62);
          backdrop-filter:
            blur(5px);
        }

        .route-modal {
          width: 100%;
          max-width: 1100px;
          height: min(90vh,850px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #ffffff;
          border-radius: 24px;
          box-shadow:
            0 30px 90px
            rgba(15,23,42,.30);
        }

        .route-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 18px;
          border-bottom: 1px solid #e2e8f0;
        }

        .route-driver-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .route-driver-avatar {
          width: 54px;
          height: 54px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 16px;
          background: #dbeafe;
          color: #2563eb;
          font-size: 21px;
        }

        .route-driver-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .route-driver-profile span {
          display: block;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .route-driver-profile h2 {
          margin: 3px 0;
          color: #0f172a;
          font-size: 17px;
          font-weight: 950;
        }

        .route-driver-profile p {
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 0;
          color: #64748b;
          font-size: 9px;
          font-weight: 700;
        }

        .close-route {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 12px;
          background: #f1f5f9;
          color: #475569;
          cursor: pointer;
          font-size: 16px;
        }

        /* ==========================================
           ROUTE SUMMARY
        ========================================== */

        .route-summary {
          display: grid;
          grid-template-columns:
            repeat(3,1fr);
          gap: 8px;
          padding: 10px 15px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        /* ==========================================
           MAP
        ========================================== */

        .route-map-wrapper {
          position: relative;
          flex: 1;
          min-height: 0;
          background: #eef2f7;
        }

        .route-map-wrapper
        .leaflet-container {
          width: 100%;
          height: 100%;
        }

        .route-loading,
        .route-empty {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          text-align: center;
        }

        .route-loading-icon,
        .route-empty-icon {
          width: 65px;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          border-radius: 18px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 25px;
        }

        .route-empty-icon.error {
          background: #fef2f2;
          color: #dc2626;
        }

        .route-loading strong,
        .route-empty strong {
          color: #0f172a;
          font-size: 16px;
          font-weight: 950;
        }

        .route-loading span,
        .route-empty span {
          max-width: 400px;
          margin-top: 6px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        .retry-route {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 15px;
          padding: 11px 15px;
          border: none;
          border-radius: 11px;
          background: #2563eb;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        /* ==========================================
           FOOTER ROUTE
        ========================================== */

        .route-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 15px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .route-modal-footer > div {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          color: #64748b;
          font-size: 9px;
          font-weight: 700;
        }

        .route-modal-footer > div svg {
          flex-shrink: 0;
          color: #2563eb;
        }

        .route-modal-footer button {
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-shrink: 0;
          padding: 0 12px;
          border: none;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        /* ==========================================
           TABLET
        ========================================== */

        @media (max-width:1100px) {

          .global-stats {
            grid-template-columns:
              repeat(3,1fr);
          }

          .drivers-grid {
            grid-template-columns:
              repeat(2,minmax(0,1fr));
          }

        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width:700px) {

          .drivers-page {
            padding: 10px;
          }

          .drivers-header {
            align-items: stretch;
            flex-direction: column;
            gap: 12px;
          }

          .header-left {
            align-items: flex-start;
          }

          .header-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            font-size: 20px;
          }

          .drivers-header h1 {
            font-size: 21px;
          }

          .drivers-header p {
            font-size: 10px;
            line-height: 1.5;
          }

          .refresh-button {
            width: 100%;
          }

          .global-stats {
            grid-template-columns:
              repeat(2,minmax(0,1fr));
            gap: 8px;
          }

          .drivers-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .driver-card {
            border-radius: 17px;
            padding: 13px;
          }

          .route-overlay {
            padding: 0;
            align-items: stretch;
          }

          .route-modal {
            height: 100vh;
            max-height: none;
            border-radius: 0;
          }

          .route-modal-header {
            padding:
              10px 11px;
          }

          .route-driver-avatar {
            width: 46px;
            height: 46px;
            border-radius: 13px;
          }

          .route-driver-profile h2 {
            font-size: 14px;
          }

          .route-summary {
            grid-template-columns:
              repeat(3,1fr);
            padding: 7px;
          }

          .route-modal-footer {
            padding: 8px;
          }

          .route-modal-footer > div {
            font-size: 8px;
          }

          .route-modal-footer button {
            min-height: 38px;
          }

        }

        /* ==========================================
           PETIT MOBILE
        ========================================== */

        @media (max-width:420px) {

          .drivers-page {
            padding: 7px;
          }

          .drivers-header h1 {
            font-size: 18px;
          }

          .eyebrow {
            font-size: 8px;
          }

          .driver-avatar {
            width: 56px;
            height: 56px;
            border-radius: 15px;
          }

          .driver-name-row h3 {
            font-size: 14px;
          }

          .driver-details {
            grid-template-columns: 1fr;
          }

          .driver-actions {
            grid-template-columns: 1fr;
          }

          .route-button,
          .delete-button {
            min-height: 46px;
          }

          .route-driver-profile p {
            display: none;
          }

          .route-modal-footer > div span {
            display: none;
          }

        }

      `}</style>

    </div>

  );

}


// ======================================================
// 🗺️ CARTE DU TRAJET
// ======================================================

function DriverRouteMap({
  route,
  driver,
}) {

  // ====================================================
  // 📍 POINTS VALIDES
  // ====================================================

  const validPoints =
    useMemo(() => {

      if (
        !Array.isArray(route)
      ) {

        return [];

      }


      return route
        .map(
          (
            point,
            index
          ) => {

            const lat =
              Number(
                point.lat
              );

            const lng =
              Number(
                point.lng
              );


            if (
              !Number.isFinite(lat) ||
              !Number.isFinite(lng)
            ) {

              return null;

            }


            return {

              ...point,

              lat,

              lng,

              index,

            };

          }
        )
        .filter(Boolean);

    }, [
      route,
    ]);


  // ====================================================
  // 📍 CENTRE
  // ====================================================

  const center =
    validPoints.length > 0
      ? [
          validPoints[
            validPoints.length - 1
          ].lat,

          validPoints[
            validPoints.length - 1
          ].lng,
        ]
      : [
          4.0511,
          9.7679,
        ];


  // ====================================================
  // 📍 POLYLINE
  // ====================================================

  const positions =
    validPoints.map(
      (
        point
      ) => [
        point.lat,
        point.lng,
      ]
    );


  const firstPoint =
    validPoints[0];


  const lastPoint =
    validPoints[
      validPoints.length - 1
    ];


  return (

    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={true}
      zoomControl={false}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      <ZoomControl
        position="bottomright"
      />


      <RouteMapController
        position={center}
      />


      {/* ==========================================
          TRAJET RÉEL
      ========================================== */}

      {positions.length >= 2 && (

        <>

          <Polyline
            positions={
              positions
            }
            pathOptions={{
              color:
                "#60A5FA",
              weight:
                10,
              opacity:
                0.22,
              lineCap:
                "round",
            }}
          />


          <Polyline
            positions={
              positions
            }
            pathOptions={{
              color:
                "#2563EB",
              weight:
                4,
              opacity:
                1,
              lineCap:
                "round",
            }}
          />

        </>

      )}


      {/* ==========================================
          PREMIER POINT
      ========================================== */}

      {firstPoint && (

        <CircleMarker
          center={[
            firstPoint.lat,
            firstPoint.lng,
          ]}
          radius={8}
          pathOptions={{
            color:
              "#ffffff",
            weight:
              3,
            fillColor:
              "#16A34A",
            fillOpacity:
              1,
          }}
        >

          <Popup>

            <strong>
              Début du trajet
            </strong>

            <div
              style={{
                marginTop:
                  "5px",
                fontSize:
                  "11px",
              }}
            >

              {formatRouteTime(
                firstPoint.recordedAt
              )}

            </div>

          </Popup>

        </CircleMarker>

      )}


      {/* ==========================================
          DERNIER POINT
      ========================================== */}

      {lastPoint && (

        <Marker
          position={[
            lastPoint.lat,
            lastPoint.lng,
          ]}
          icon={
            driverMapIcon
          }
        >

          <Popup>

            <div
              style={{
                minWidth:
                  "170px",
              }}
            >

              <strong>
                {driver?.name ||
                  "Livreur"}
              </strong>


              <div
                style={{
                  marginTop:
                    "5px",
                  fontSize:
                    "11px",
                }}
              >

                <FaLocationArrow />
                {" "}
                Dernière position

              </div>


              <div
                style={{
                  marginTop:
                    "5px",
                  fontSize:
                    "11px",
                }}
              >

                {formatRouteTime(
                  lastPoint.recordedAt
                )}

              </div>


              {lastPoint.orderId && (

                <div
                  style={{
                    marginTop:
                      "5px",
                    fontSize:
                      "10px",
                  }}
                >

                  <FaBoxOpen />
                  {" "}
                  Commande :
                  {" "}
                  {String(
                    lastPoint.orderId
                  ).slice(-8).toUpperCase()}

                </div>

              )}

            </div>

          </Popup>

        </Marker>

      )}


      {/* ==========================================
          POINTS GPS
      ========================================== */}

      {validPoints
        .filter(
          (
            point,
            index
          ) =>
            index %
              Math.max(
                1,
                Math.ceil(
                  validPoints.length /
                  80
                )
              ) ===
            0
        )
        .map(
          (
            point
          ) => (

            <CircleMarker
              key={
                `${point._id || point.index}-${point.recordedAt}`
              }
              center={[
                point.lat,
                point.lng,
              ]}
              radius={3}
              pathOptions={{
                color:
                  "#2563EB",
                fillColor:
                  "#ffffff",
                fillOpacity:
                  1,
                weight:
                  1,
              }}
            >

              <Popup>

                <strong>
                  Position GPS
                </strong>


                <div
                  style={{
                    marginTop:
                      "5px",
                    fontSize:
                      "10px",
                  }}
                >

                  {formatRouteTime(
                    point.recordedAt
                  )}

                </div>


                {point.orderId && (

                  <div
                    style={{
                      marginTop:
                        "5px",
                        fontSize:
                          "10px",
                    }}
                  >

                    <FaBoxOpen />
                    {" "}
                    Commande :
                    {" "}
                    {String(
                      point.orderId
                    )
                      .slice(-8)
                      .toUpperCase()}

                  </div>

                )}

              </Popup>

            </CircleMarker>

          )
        )}

    </MapContainer>

  );

}


// ======================================================
// 🕐 FORMAT HEURE GPS
// ======================================================

function formatRouteTime(
  value
) {

  if (!value) {

    return "--";

  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "--";

  }


  return date.toLocaleTimeString(
    "fr-FR",
    {
      hour:
        "2-digit",
      minute:
        "2-digit",
      second:
        "2-digit",
    }
  );

}


// ======================================================
// 📊 STAT CARD
// ======================================================

function StatCard({
  icon,
  label,
  value,
  className,
}) {

  return (

    <div
      className={
        `stat-card ${
          className || ""
        }`
      }
    >

      <div
        className="stat-icon"
      >

        {icon}

      </div>


      <div
        className="stat-content"
      >

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>


      <style>{`

        .stat-card {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          box-shadow:
            0 7px 22px
            rgba(15,23,42,.045);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 15px;
        }

        .stat-content {
          min-width: 0;
        }

        .stat-content strong {
          display: block;
          color: #0f172a;
          font-size: 18px;
          line-height: 1;
          font-weight: 950;
        }

        .stat-content span {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-card.blue .stat-icon {
          background: #dbeafe;
          color: #2563eb;
        }

        .stat-card.green .stat-icon {
          background: #dcfce7;
          color: #16a34a;
        }

        .stat-card.purple .stat-icon {
          background: #ede9fe;
          color: #7c3aed;
        }

        .stat-card.orange .stat-icon {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-card.red .stat-icon {
          background: #fee2e2;
          color: #dc2626;
        }

      `}</style>

    </div>

  );

}


// ======================================================
// 📋 INFO ROW
// ======================================================

function InfoRow({
  icon,
  label,
  value,
}) {

  return (

    <div
      className="info-row"
    >

      <div
        className="info-row-icon"
      >

        {icon}

      </div>


      <div
        className="info-row-content"
      >

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>


      <style>{`

        .info-row {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px;
          border-radius: 11px;
          background: #f8fafc;
        }

        .info-row-icon {
          width: 27px;
          height: 27px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 10px;
        }

        .info-row-content {
          min-width: 0;
        }

        .info-row-content span {
          display: block;
          color: #94a3b8;
          font-size: 7px;
          font-weight: 800;
        }

        .info-row-content strong {
          display: block;
          margin-top: 2px;
          color: #334155;
          font-size: 9px;
          font-weight: 900;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

      `}</style>

    </div>

  );

}


// ======================================================
// 📊 MINI STAT
// ======================================================

function MiniStat({
  icon,
  value,
  label,
  type,
}) {

  return (

    <div
      className={
        `mini-stat ${
          type || ""
        }`
      }
    >

      <div
        className="mini-stat-icon"
      >

        {icon}

      </div>


      <strong>
        {value}
      </strong>


      <span>
        {label}
      </span>


      <style>{`

        .mini-stat {
          min-width: 0;
          padding: 9px 5px;
          border-radius: 12px;
          text-align: center;
          background: #f8fafc;
        }

        .mini-stat-icon {
          margin-bottom: 3px;
          font-size: 10px;
        }

        .mini-stat strong {
          display: block;
          color: #0f172a;
          font-size: 15px;
          font-weight: 950;
        }

        .mini-stat span {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 7px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mini-stat.blue .mini-stat-icon {
          color: #2563eb;
        }

        .mini-stat.green .mini-stat-icon {
          color: #16a34a;
        }

        .mini-stat.orange .mini-stat-icon {
          color: #d97706;
        }

      `}</style>

    </div>

  );

}


// ======================================================
// 🗺️ RÉSUMÉ TRAJET
// ======================================================

function RouteSummaryCard({
  icon,
  label,
  value,
}) {

  return (

    <div
      className="route-summary-card"
    >

      <div
        className="route-summary-icon"
      >

        {icon}

      </div>


      <div>

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>


      <style>{`

        .route-summary-card {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .route-summary-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 12px;
        }

        .route-summary-card strong {
          display: block;
          color: #0f172a;
          font-size: 13px;
          font-weight: 950;
        }

        .route-summary-card span {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 7px;
          font-weight: 800;
        }

        @media (max-width:420px) {

          .route-summary-card {
            padding: 7px 5px;
            gap: 5px;
          }

          .route-summary-icon {
            width: 27px;
            height: 27px;
            font-size: 10px;
          }

          .route-summary-card strong {
            font-size: 11px;
          }

          .route-summary-card span {
            font-size: 6px;
          }

        }

      `}</style>

    </div>

  );

}