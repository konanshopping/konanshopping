import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaEye,
  FaChevronDown,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";

import {
  MdLocalShipping,
} from "react-icons/md";

function MyOrders() {

  const [orders, setOrders] =
    useState([]);

  const [
    recommendedProducts,
    setRecommendedProducts,
  ] = useState([]);

  const [filter, setFilter] =
    useState("Tous");

  const navigate =
    useNavigate();

  useEffect(() => {

    const user =
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      );

    if (!user) return;

    // LOAD ORDERS

    axios

      .get(
        `https://konanshopping.onrender.com/my-orders/${user._id}`
      )

      .then((res) => {

        setOrders(res.data);

      })

      .catch((err) => {

        console.log(err);

      });

    // LOAD PRODUCTS

    axios

      .get(
        "https://konanshopping.onrender.com/products"
      )

      .then((res) => {

        setRecommendedProducts(
          res.data.slice(0, 8)
        );

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  // FILTERS

  const filteredOrders =
    filter === "Tous"
      ? orders
      : orders.filter(
          (order) =>
            order.status ===
            filter
        );

  // STATS

  const pendingOrders =
    orders.filter(
      (o) =>
        o.status ===
        "En attente"
    ).length;

  const shippedOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Expédiée"
    ).length;

  const deliveredOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Livrée"
    ).length;

  const cancelledOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Annulée"
    ).length;

  // STATUS STYLE

  const getStatusStyle =
    (status) => {

      switch (status) {

        case "Livrée":
          return {
            background:
              "#DCFCE7",
            color:
              "#16A34A",
          };

        case "Expédiée":
          return {
            background:
              "#DBEAFE",
            color:
              "#2563EB",
          };

        case "Annulée":
          return {
            background:
              "#FEE2E2",
            color:
              "#DC2626",
          };

        default:
          return {
            background:
              "#FEF3C7",
            color:
              "#D97706",
          };

      }

    };

  return (

    <div
      style={{
        background:
          "#F8F8FC",

        minHeight:
          "100vh",

        padding:
          window.innerWidth <
          768
            ? "12px"
            : "20px",
      }}
    >

      {/* HERO */}

      <div
        style={{
          background:
            "#F5F3FF",

          border:
            "1px solid #E9E5FF",

          borderRadius:
            "30px",

          padding:
            window.innerWidth <
            768
              ? "20px"
              : "35px",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          flexWrap: "wrap",

          gap: "25px",

          marginBottom:
            "25px",
        }}
      >

        <div
          style={{
            flex: 1,
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: "18px",

              marginBottom:
                "20px",
            }}
          >

            <div
              style={{
                width: "85px",

                height:
                  "85px",

                borderRadius:
                  "24px",

                background:
                  "white",

                display:
                  "flex",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                boxShadow:
                  "0 8px 25px rgba(124,58,237,0.12)",
              }}
            >

              <FaBoxOpen
                style={{
                  fontSize:
                    "42px",

                  color:
                    "#7C3AED",
                }}
              />

            </div>

            <div>

              <h1
                style={{
                  fontSize:
                    window.innerWidth <
                    768
                      ? "38px"
                      : "58px",

                  fontWeight:
                    "900",

                  color:
                    "#111827",

                  marginBottom:
                    "8px",
                }}
              >
                Mes commandes
              </h1>

              <p
                style={{
                  color:
                    "#4B5563",

                  fontSize:
                    "16px",
                }}
              >
                Suivez vos achats,
                livraisons et
                commandes Konan
                Shopping en temps
                réel.
              </p>

            </div>

          </div>

          {/* STATS */}

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                window.innerWidth <
                768
                  ? "1fr 1fr"
                  : "repeat(4,1fr)",

              gap: "14px",
            }}
          >

            {/* TOTAL */}

            <div
              style={{
                background:
                  "white",

                borderRadius:
                  "22px",

                padding:
                  "18px",

                display:
                  "flex",

                gap: "14px",

                alignItems:
                  "center",
              }}
            >

              <FaClipboardList
                style={{
                  color:
                    "#7C3AED",

                  fontSize:
                    "28px",
                }}
              />

              <div>

                <h2
                  style={{
                    fontSize:
                      "30px",

                    fontWeight:
                      "900",

                    color:
                      "#111827",
                  }}
                >
                  {
                    orders.length
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#6B7280",

                    fontSize:
                      "13px",
                  }}
                >
                  Total commandes
                </p>

              </div>

            </div>

            {/* SHIPPED */}

            <div
              style={{
                background:
                  "white",

                borderRadius:
                  "22px",

                padding:
                  "18px",

                display:
                  "flex",

                gap: "14px",

                alignItems:
                  "center",
              }}
            >

              <FaTruck
                style={{
                  color:
                    "#2563EB",

                  fontSize:
                    "28px",
                }}
              />

              <div>

                <h2
                  style={{
                    fontSize:
                      "30px",

                    fontWeight:
                      "900",

                    color:
                      "#111827",
                  }}
                >
                  {
                    shippedOrders
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#6B7280",

                    fontSize:
                      "13px",
                  }}
                >
                  En livraison
                </p>

              </div>

            </div>

            {/* DELIVERED */}

            <div
              style={{
                background:
                  "white",

                borderRadius:
                  "22px",

                padding:
                  "18px",

                display:
                  "flex",

                gap: "14px",

                alignItems:
                  "center",
              }}
            >

              <FaCheckCircle
                style={{
                  color:
                    "#16A34A",

                  fontSize:
                    "28px",
                }}
              />

              <div>

                <h2
                  style={{
                    fontSize:
                      "30px",

                    fontWeight:
                      "900",

                    color:
                      "#111827",
                  }}
                >
                  {
                    deliveredOrders
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#6B7280",

                    fontSize:
                      "13px",
                  }}
                >
                  Livrées
                </p>

              </div>

            </div>

            {/* CANCELLED */}

            <div
              style={{
                background:
                  "white",

                borderRadius:
                  "22px",

                padding:
                  "18px",

                display:
                  "flex",

                gap: "14px",

                alignItems:
                  "center",
              }}
            >

              <FaTimesCircle
                style={{
                  color:
                    "#DC2626",

                  fontSize:
                    "28px",
                }}
              />

              <div>

                <h2
                  style={{
                    fontSize:
                      "30px",

                    fontWeight:
                      "900",

                    color:
                      "#111827",
                  }}
                >
                  {
                    cancelledOrders
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#6B7280",

                    fontSize:
                      "13px",
                  }}
                >
                  Annulées
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FILTERS */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          flexWrap: "wrap",

          gap: "14px",

          marginBottom:
            "22px",
        }}
      >

        <div
          style={{
            display: "flex",

            gap: "12px",

            flexWrap:
              "wrap",
          }}
        >

          {[
  {
    name: "Tous",
    count: orders.length,
  },

  {
    name: "Expédiée",
    count: shippedOrders,
  },

  {
    name: "Livrée",
    count: deliveredOrders,
  },

  {
    name: "Annulée",
    count: cancelledOrders,
  },

].map((item) => (

           <button
  key={item.name}

  onClick={() =>
    setFilter(item.name)
  }

              style={{
                border: "none",

                padding:
                  "14px 22px",

                borderRadius:
                  "18px",

                fontWeight:
                  "700",

                cursor:
                  "pointer",

                background:
  filter === item.name
                    ? "#7C3AED"
                    : "white",

                color:
                  filter === item.name
                    ? "white"
                    : "#111827",

                boxShadow:
                  "0 5px 18px rgba(0,0,0,0.05)",
              }}
            >
              <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>

  <span>
    {item.name}
  </span>

  <div
    style={{
      background:
        filter === item.name
          ? "rgba(255,255,255,0.2)"
          : "#EEE",

      padding: "3px 8px",

      borderRadius: "20px",

      fontSize: "12px",

      fontWeight: "800",
    }}
  >
    {item.count}
  </div>

</div>
            </button>

          ))}

        </div>

      </div>

      {/* TABLE */}

      <div
        style={{
          background:
            "white",

          borderRadius:
            "28px",

          overflow:
            "hidden",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >

        <div
          style={{
            padding:
              "24px",

            borderBottom:
              "1px solid #F1F1F1",
          }}
        >

          <h2
            style={{
              fontSize:
                "28px",

              fontWeight:
                "900",

              color:
                "#111827",
            }}
          >
            Historique de vos commandes
          </h2>

        </div>

        {filteredOrders.map(
          (order, index) => (

            <div
              key={index}

              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  window.innerWidth <
                  768
                    ? "1fr"
                    : "1.2fr 1fr 1.2fr 1fr 1fr 1fr",

                gap: "18px",

                padding:
                  "22px",

                alignItems:
                  "center",

                borderBottom:
                  "1px solid #F5F5F5",
              }}
            >

              {/* ID */}

              <div>

                <h3
                  style={{
                    fontWeight:
                      "900",

                    color:
                      "#111827",

                    marginBottom:
                      "6px",
                  }}
                >
                  #
                  {order._id.slice(
                    -8
                  )}
                </h3>

                <p
                  style={{
                    color:
                      "#6B7280",

                    fontSize:
                      "13px",
                  }}
                >
                  {
                    order.items
                      ?.length
                  }
                  {" "}
                  articles
                </p>

              </div>

              {/* DATE */}

              <div>

                <h3
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </h3>

              </div>

              {/* PRODUCTS */}

              <div
                style={{
                  display:
                    "flex",

                  gap: "8px",
                }}
              >

                {(order.items || [])
                  .slice(0, 3)
                  .map(
                    (
                      item,
                      i
                    ) => (

                      <img
                        key={i}

                        src={
                          item.image
                        }

                        alt=""

                        style={{
                          width:
                            "55px",

                          height:
                            "55px",

                          borderRadius:
                            "14px",

                          objectFit:
                            "cover",
                        }}
                      />

                    )
                  )}

              </div>

              {/* PRICE */}

              <div>

                <h2
                  style={{
                    color:
                      "#7C3AED",

                    fontWeight:
                      "900",
                  }}
                >
                  {
                    order.total
                  }
                  {" "}
                  FCFA
                </h2>

              </div>

              {/* STATUS */}

              <div>

                <div
                  style={{
                    ...getStatusStyle(
                      order.status
                    ),

                    padding:
                      "10px 16px",

                    borderRadius:
                      "30px",

                    fontWeight:
                      "700",

                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    gap: "8px",
                  }}
                >

                  {order.status ===
                  "Livrée" ? (
                    <FaCheckCircle />
                  ) : order.status ===
                    "Expédiée" ? (
                    <FaTruck />
                  ) : (
                    <FaTimesCircle />
                  )}

                  {
                    order.status
                  }

                </div>

              </div>

              {/* BUTTON */}

              <div>

                <button
                  onClick={() =>
                    navigate(
                      `/track-order/${order._id}`
                    )
                  }

                  style={{
                    border:
                      "2px solid #E9E5FF",

                    background:
                      "white",

                    color:
                      "#7C3AED",

                    padding:
                      "12px 18px",

                    borderRadius:
                      "14px",

                    fontWeight:
                      "700",

                    cursor:
                      "pointer",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "8px",
                  }}
                >

                  <FaEye />

                  Voir détails

                </button>

              </div>

            </div>

          )
        )}

      </div>

      {/* FOOTER */}

      <div
        style={{
          marginTop: "30px",

          background:
            "white",

          borderRadius:
            "24px",

          padding: "24px",

          display: "grid",

          gridTemplateColumns:
            window.innerWidth <
            768
              ? "1fr 1fr"
              : "repeat(4,1fr)",

          gap: "20px",
        }}
      >

        <div>

          <FaShieldAlt
            style={{
              color:
                "#7C3AED",

              fontSize:
                "28px",

              marginBottom:
                "12px",
            }}
          />

          <h3>
            Paiement sécurisé
          </h3>

          <p
            style={{
              color:
                "#6B7280",

              fontSize:
                "14px",
            }}
          >
            Transactions protégées
          </p>

        </div>

        <div>

          <FaTruck
            style={{
              color:
                "#2563EB",

              fontSize:
                "28px",

              marginBottom:
                "12px",
            }}
          />

          <h3>
            Livraison rapide
          </h3>

          <p
            style={{
              color:
                "#6B7280",

              fontSize:
                "14px",
            }}
          >
            Partout au Cameroun
          </p>

        </div>

        <div>

          <FaHeadset
            style={{
              color:
                "#7C3AED",

              fontSize:
                "28px",

              marginBottom:
                "12px",
            }}
          />

          <h3>
            Support 24/7
          </h3>

          <p
            style={{
              color:
                "#6B7280",

              fontSize:
                "14px",
            }}
          >
            Assistance premium
          </p>

        </div>

        <div>

          <FaCheckCircle
            style={{
              color:
                "#16A34A",

              fontSize:
                "28px",

              marginBottom:
                "12px",
            }}
          />

          <h3>
            Satisfaction garantie
          </h3>

          <p
            style={{
              color:
                "#6B7280",

              fontSize:
                "14px",
            }}
          >
            Qualité assurée
          </p>

        </div>

      </div>

    </div>

  );

}

export default MyOrders;