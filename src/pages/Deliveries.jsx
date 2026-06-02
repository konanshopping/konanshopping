import React, {
  useEffect,
  useState,
} from "react";

import "./Deliveries.css";

import {
  FaTruck,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaMotorcycle,
  FaMoneyBillWave,
  FaBoxOpen,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

export default function Deliveries() {

  // =========================
  // STATES
  // =========================

  const [orders, setOrders] =
    useState([]);

  const [drivers, setDrivers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // =========================
  // STATS
  // =========================

  const totalDeliveries =
    orders.length;

  const deliveredCount =
    orders.filter(
      (o) =>
        o.status ===
        "Livrée"
    ).length;

  const pendingCount =
    orders.filter(
      (o) =>
        o.status !==
        "Livrée"
    ).length;

  // =========================
  // LOAD ORDERS
  // =========================

  useEffect(() => {

    fetch(
      "https://konanshopping.onrender.com/api/orders"
    )
      .then((res) =>
        res.json()
      )

      .then((data) => {

        setOrders(data);

        setLoading(false);

      })

      .catch((err) => {

        console.log(err);

        setLoading(false);

      });

  }, []);

  // =========================
  // LOAD DRIVERS
  // =========================

  useEffect(() => {

    fetch(
      "https://konanshopping.onrender.com/api/drivers"
    )
      .then((res) =>
        res.json()
      )

      .then((data) => {

        setDrivers(data);

      })

      .catch((err) =>
        console.log(err)
      );

  }, []);

  // =========================
  // ASSIGN DRIVER
  // =========================

  const assignDriver =
    async (
      orderId,
      driverId
    ) => {

      try {

        const res =
          await fetch(

            `https://konanshopping.onrender.com/api/orders/${orderId}/assign-driver`,

            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                driverId,
              }),
            }

          );

        const data =
          await res.json();

        alert(data.message);

        window.location.reload();

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // FILTERED ORDERS
  // =========================

  const filteredOrders =
    orders.filter((order) =>

      order.customerName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      order.city
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      order.items?.[0]?.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="deliveriesLoading">

        Chargement des livraisons...

      </div>

    );

  }

  // =========================
  // RETURN
  // =========================

  return (

    <div className="deliveriesPage">

      {/* HEADER */}

      <div className="deliveriesHeader">

        <div>

          <h1>
            🚚 Gestion des Livraisons
          </h1>

          <p>
            Suivi professionnel des
            commandes KonanShopping
            Cameroun
          </p>

        </div>

        <button className="newDeliveryBtn">

          <FaPlus />

          Nouvelle livraison

        </button>

      </div>

      {/* STATS */}

      <div className="deliveryStats">

        <div className="statCard">

          <FaTruck />

          <div>

            <h2>
              {totalDeliveries}
            </h2>

            <p>
              Livraisons
            </p>

          </div>

        </div>

        <div className="statCard">

          <FaCheckCircle />

          <div>

            <h2>
              {deliveredCount}
            </h2>

            <p>
              Livrées
            </p>

          </div>

        </div>

        <div className="statCard">

          <FaClock />

          <div>

            <h2>
              {pendingCount}
            </h2>

            <p>
              En cours
            </p>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="searchBox">

        <FaSearch />

        <input
          type="text"
          placeholder="Rechercher une livraison..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>

      {/* ORDERS */}

      <div className="deliveriesGrid">

        {filteredOrders.map(
          (order) => (

            <div
              key={order._id}
              className="deliveryCard"
            >

              {/* IMAGE */}

              <img
                src={
                  order.items?.[0]
                    ?.image
                }
                alt=""
                className="deliveryImage"
              />

              {/* TOP */}

              <div className="deliveryTop">

                <div>

                  <h2>

                    {
                      order.items?.[0]
                        ?.name
                    }

                  </h2>

                  <p>

                    Client :
                    {
                      order.customerName
                    }

                  </p>

                </div>

                <div
                  className={
                    order.status ===
                    "Livrée"
                      ? "statusDone"
                      : "statusPending"
                  }
                >

                  {order.status ===
                  "Livrée" ? (
                    <>

                      <FaCheckCircle />

                      Livrée

                    </>
                  ) : (
                    <>

                      <FaClock />

                      {
                        order.status
                      }

                    </>
                  )}

                </div>

              </div>

              {/* INFOS */}

              <div className="deliveryInfos">

                <div className="infoRow">

                  <FaPhone />

                  <span>
                    {order.phone}
                  </span>

                </div>

                <div className="infoRow">

                  <FaMapMarkerAlt />

                  <span>

                    {order.city},

                    {" "}

                    {
                      order.district
                    }

                  </span>

                </div>

                <div className="infoRow">

                  <FaBoxOpen />

                  <span>

                    {
                      order.address
                    }

                  </span>

                </div>

              </div>

              {/* DRIVER */}

              <div className="driverCard">

                <h3>

                  <FaMotorcycle />

                  Livreur assigné

                </h3>

                {order.driver ? (

                  <div className="driverBox">

                    <img
                      src={
                        order.driver
                          ?.photo
                      }
                      alt=""
                      className="driverPhoto"
                    />

                    <div>

                      <h4>

                        {
                          order.driver
                            ?.name
                        }

                      </h4>

                      <p>

                        {
                          order.driver
                            ?.phone
                        }

                      </p>

                    </div>

                  </div>

                ) : (

                  <p className="noDriver">

                    Aucun livreur
                    assigné

                  </p>

                )}

              </div>

              {/* ASSIGN DRIVER */}

              <select

                className="driverSelect"

                onChange={(e) =>
                  assignDriver(
                    order._id,
                    e.target.value
                  )
                }

              >

                <option>
                  Choisir livreur
                </option>

                {drivers.map(
                  (driver) => (

                    <option
                      key={
                        driver._id
                      }

                      value={
                        driver._id
                      }
                    >

                      {
                        driver.name
                      }

                    </option>

                  )
                )}

              </select>

              {/* GPS */}

              <div className="gpsBox">

                <h4>
                  📍 Position GPS
                </h4>

                <p>

                  Latitude :
                  {
                    order
                      .driverLocation
                      ?.lat
                  }

                </p>

                <p>

                  Longitude :
                  {
                    order
                      .driverLocation
                      ?.lng
                  }

                </p>

              </div>

              {/* PRICE */}

              <div className="priceBox">

                <FaMoneyBillWave />

                <h2>

                  {order.total}
                  FCFA

                </h2>

              </div>

              {/* BUTTONS */}

              <div className="deliveryButtons">

                {/* START */}

                <button

                  className="assignBtn"

                  onClick={async () => {

                    try {

                      await fetch(

                        `https://konanshopping.onrender.com/api/orders/${order._id}`,

                        {
                          method:
                            "PUT",

                          headers: {
                            "Content-Type":
                              "application/json",
                          },

                          body: JSON.stringify({
                            status:
                              "En cours",
                          }),
                        }

                      );

                      setOrders(
                        (prev) =>

                          prev.map(
                            (o) =>

                              o._id ===
                              order._id

                                ? {
                                    ...o,
                                    status:
                                      "En cours",
                                  }

                                : o

                          )

                      );

                    } catch (err) {

                      console.log(
                        err
                      );

                    }

                  }}
                >

                  🚚 Démarrer

                </button>

                {/* DELIVERED */}

                <button

                  className="trackBtn"

                  onClick={async () => {

                    try {

                      await fetch(

                        `https://konanshopping.onrender.com/api/orders/${order._id}`,

                        {
                          method:
                            "PUT",

                          headers: {
                            "Content-Type":
                              "application/json",
                          },

                          body: JSON.stringify({
                            status:
                              "Livrée",
                          }),
                        }

                      );

                      setOrders(
                        (prev) =>

                          prev.map(
                            (o) =>

                              o._id ===
                              order._id

                                ? {
                                    ...o,
                                    status:
                                      "Livrée",
                                  }

                                : o

                          )

                      );

                    } catch (err) {

                      console.log(
                        err
                      );

                    }

                  }}
                >

                  ✅ Livrée

                </button>

                {/* CANCEL */}

                <button

                  className="cancelBtn"

                  onClick={async () => {

                    try {

                      await fetch(

                        `https://konanshopping.onrender.com/api/orders/${order._id}`,

                        {
                          method:
                            "DELETE",
                        }

                      );

                      setOrders(
                        (prev) =>

                          prev.filter(
                            (o) =>
                              o._id !==
                              order._id
                          )

                      );

                    } catch (err) {

                      console.log(
                        err
                      );

                    }

                  }}
                >

                  ❌ Annuler

                </button>

              </div>

              {/* DELETE BUTTON */}

              {order.status ===
                "Livrée" && (

                <button

                  onClick={async () => {

                    try {

                      await fetch(

                        `https://konanshopping.onrender.com/api/orders/${order._id}`,

                        {
                          method:
                            "DELETE",
                        }

                      );

                      setOrders(
                        (prev) =>

                          prev.filter(
                            (o) =>
                              o._id !==
                              order._id
                          )

                      );

                    } catch (err) {

                      console.log(
                        err
                      );

                    }

                  }}

                  style={{
                    width: "100%",
                    marginTop:
                      "14px",
                    background:
                      "linear-gradient(135deg,#111827,#1f2937)",
                    color:
                      "white",
                    border:
                      "none",
                    padding:
                      "16px",
                    borderRadius:
                      "16px",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                    fontSize:
                      "15px",
                    boxShadow:
                      "0 8px 20px rgba(0,0,0,0.25)",
                  }}
                >

                  🗑️ Supprimer définitivement

                </button>

              )}

            </div>

          )
        )}

      </div>

    </div>

  );

}