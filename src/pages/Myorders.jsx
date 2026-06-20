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
        `https://konanshopping-production.up.railway.app/my-orders/${user._id}`
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
        "https://konanshopping-production.up.railway.app/products"
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
      background: "#F8FAFC",

      minHeight: "100vh",

      width: "100%",

      maxWidth: "100vw",

      overflowX: "hidden",

      padding:
        window.innerWidth < 768
          ? "10px"
          : "20px",

      boxSizing: "border-box",
    }}
  >

     {/* HERO */}

<div
  style={{
    background:
      "linear-gradient(135deg,#FFFFFF,#F8FAFC)",

    border:
      "1px solid #E5E7EB",

    borderRadius: "24px",

    padding:
      window.innerWidth < 768
        ? "18px"
        : "30px",

    display: "flex",

    alignItems: "center",

    gap:
      window.innerWidth < 768
        ? "14px"
        : "22px",

    marginBottom: "20px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  }}
>
 
  {/* ICÔNE */}

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "65px"
          : "85px",

      height:
        window.innerWidth < 768
          ? "65px"
          : "85px",

      borderRadius: "18px",

      background:
        "linear-gradient(135deg,#2563EB,#1D4ED8)",

      display: "flex",

      justifyContent: "center",

      alignItems: "center",

      flexShrink: 0,

      boxShadow:
        "0 10px 25px rgba(37,99,235,0.20)",
    }}
  >

    <FaBoxOpen
      style={{
        fontSize:
          window.innerWidth < 768
            ? "28px"
            : "38px",

        color: "#fff",
      }}
    />

  </div>

  {/* TEXTE */}

  <div
    style={{
      flex: 1,
    }}
  >

    <h1
      style={{
        fontSize:
          window.innerWidth < 768
            ? "30px"
            : "58px",

        fontWeight: "900",

        color: "#111827",

        margin: 0,

        lineHeight: 1.1,
      }}
    >
      Mes commandes
    </h1>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "14px"
            : "16px",

        marginTop: "8px",

        marginBottom: 0,

        lineHeight: "1.5",
      }}
    >
      Suivez vos achats, livraisons et
      commandes Konan Shopping en temps réel.
    </p>

  </div>

</div>




{/* STATS */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      window.innerWidth < 768
        ? "repeat(2,1fr)"
        : "repeat(4,1fr)",

    gap:
      window.innerWidth < 768
        ? "10px"
        : "16px",

    marginTop: "10px",
  }}
>

           {/* TOTAL */}

<div
  style={{
    background:
      "linear-gradient(180deg,#FFFFFF,#FAFAFA)",

    border:
      "1px solid #EEF2F7",

    borderRadius: "18px",

    padding:
      window.innerWidth < 768
        ? "12px"
        : "18px",

    display: "flex",

    gap:
      window.innerWidth < 768
        ? "10px"
        : "14px",

    alignItems: "center",

    minHeight:
      window.innerWidth < 768
        ? "85px"
        : "105px",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.04)",

    transition:
      "all .3s ease",
  }}
>

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "42px"
          : "52px",

      height:
        window.innerWidth < 768
          ? "42px"
          : "52px",

      borderRadius: "14px",

      background:
        "#EEF2FF",

      display: "flex",

      justifyContent:
        "center",

      alignItems:
        "center",

      flexShrink: 0,
    }}
  >

    <FaClipboardList
      style={{
        color: "#2563EB",

        fontSize:
          window.innerWidth < 768
            ? "18px"
            : "24px",
      }}
    />

  </div>

  <div>

    <h2
      style={{
        fontSize:
          window.innerWidth < 768
            ? "24px"
            : "30px",

        fontWeight: "900",

        color: "#111827",

        margin: 0,

        lineHeight: 1,
      }}
    >
      {orders.length}
    </h2>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "12px"
            : "13px",

        marginTop: "6px",

        marginBottom: 0,

        fontWeight: "500",
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
      "linear-gradient(180deg,#FFFFFF,#FAFAFA)",

    border:
      "1px solid #EEF2F7",

    borderRadius: "18px",

    padding:
      window.innerWidth < 768
        ? "12px"
        : "18px",

    display: "flex",

    gap:
      window.innerWidth < 768
        ? "10px"
        : "14px",

    alignItems: "center",

    minHeight:
      window.innerWidth < 768
        ? "85px"
        : "105px",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.04)",

    transition:
      "all .3s ease",
  }}
>

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "42px"
          : "52px",

      height:
        window.innerWidth < 768
          ? "42px"
          : "52px",

      borderRadius: "14px",

      background:
        "#DBEAFE",

      display: "flex",

      justifyContent:
        "center",

      alignItems:
        "center",

      flexShrink: 0,
    }}
  >

    <FaTruck
      style={{
        color: "#2563EB",

        fontSize:
          window.innerWidth < 768
            ? "18px"
            : "24px",
      }}
    />

  </div>

  <div>

    <h2
      style={{
        fontSize:
          window.innerWidth < 768
            ? "24px"
            : "30px",

        fontWeight: "900",

        color: "#111827",

        margin: 0,

        lineHeight: 1,
      }}
    >
      {shippedOrders}
    </h2>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "12px"
            : "13px",

        marginTop: "6px",

        marginBottom: 0,

        fontWeight: "500",
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
      "linear-gradient(180deg,#FFFFFF,#FAFAFA)",

    border:
      "1px solid #EEF2F7",

    borderRadius: "18px",

    padding:
      window.innerWidth < 768
        ? "12px"
        : "18px",

    display: "flex",

    gap:
      window.innerWidth < 768
        ? "10px"
        : "14px",

    alignItems: "center",

    minHeight:
      window.innerWidth < 768
        ? "85px"
        : "105px",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.04)",

    transition:
      "all .3s ease",
  }}
>

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "42px"
          : "52px",

      height:
        window.innerWidth < 768
          ? "42px"
          : "52px",

      borderRadius: "14px",

      background:
        "#DCFCE7",

      display: "flex",

      justifyContent:
        "center",

      alignItems:
        "center",

      flexShrink: 0,
    }}
  >

    <FaCheckCircle
      style={{
        color: "#16A34A",

        fontSize:
          window.innerWidth < 768
            ? "18px"
            : "24px",
      }}
    />

  </div>

  <div>

    <h2
      style={{
        fontSize:
          window.innerWidth < 768
            ? "24px"
            : "30px",

        fontWeight: "900",

        color: "#111827",

        margin: 0,

        lineHeight: 1,
      }}
    >
      {deliveredOrders}
    </h2>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "12px"
            : "13px",

        marginTop: "6px",

        marginBottom: 0,

        fontWeight: "500",
      }}
    >
      Livrée
    </p>

  </div>

</div>

           {/* CANCELLED */}

<div
  style={{
    background:
      "linear-gradient(180deg,#FFFFFF,#FAFAFA)",

    border:
      "1px solid #EEF2F7",

    borderRadius: "18px",

    padding:
      window.innerWidth < 768
        ? "12px"
        : "18px",

    display: "flex",

    gap:
      window.innerWidth < 768
        ? "10px"
        : "14px",

    alignItems: "center",

    minHeight:
      window.innerWidth < 768
        ? "85px"
        : "105px",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.04)",

    transition:
      "all .3s ease",
  }}
>

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "42px"
          : "52px",

      height:
        window.innerWidth < 768
          ? "42px"
          : "52px",

      borderRadius: "14px",

      background:
        "#FEE2E2",

      display: "flex",

      justifyContent:
        "center",

      alignItems:
        "center",

      flexShrink: 0,
    }}
  >

    <FaTimesCircle
      style={{
        color: "#DC2626",

        fontSize:
          window.innerWidth < 768
            ? "18px"
            : "24px",
      }}
    />

  </div>

  <div>

    <h2
      style={{
        fontSize:
          window.innerWidth < 768
            ? "24px"
            : "30px",

        fontWeight: "900",

        color: "#111827",

        margin: 0,

        lineHeight: 1,
      }}
    >
      {cancelledOrders}
    </h2>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "12px"
            : "13px",

        marginTop: "6px",

        marginBottom: 0,

        fontWeight: "500",
      }}
    >
      Annulées
    </p>

  </div>

</div>

</div>




{/* FILTERS */}

<div
  style={{
    marginTop: "12px",

    marginBottom:
      window.innerWidth < 768
        ? "28px"
        : "35px",

    overflowX: "auto",

    scrollbarWidth: "none",

    msOverflowStyle: "none",
  }}
>

  <div
    style={{
      display: "flex",

      gap: "10px",

      flexWrap: "nowrap",

      minWidth: "max-content",

      paddingBottom: "4px",
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
          border:
            filter === item.name
              ? "none"
              : "1px solid #E5E7EB",

          padding:
            window.innerWidth < 768
              ? "10px 16px"
              : "14px 22px",

          borderRadius: "14px",

          fontWeight: "700",

          cursor: "pointer",

          background:
            filter === item.name
              ? "#2563EB"
              : "#FFFFFF",

          color:
            filter === item.name
              ? "white"
              : "#111827",

          boxShadow:
            filter === item.name
              ? "0 8px 20px rgba(37,99,235,0.18)"
              : "0 4px 12px rgba(0,0,0,0.04)",

          whiteSpace: "nowrap",

          flexShrink: 0,

          transition: "all .25s ease",
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
                  : "#EEF2F7",

              color:
                filter === item.name
                  ? "#FFFFFF"
                  : "#475569",

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
    background: "#FFFFFF",

    borderRadius: "24px",

    overflow: "hidden",

    border: "1px solid #EEF2F7",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.04)",
  }}
>

  {/* HEADER */}

  <div
    style={{
      padding:
        window.innerWidth < 768
          ? "18px"
          : "24px",

      borderBottom:
        "1px solid #F1F5F9",

      background:
        "linear-gradient(180deg,#FFFFFF,#FAFAFA)",
    }}
  >

    <h2
      style={{
        fontSize:
          window.innerWidth < 768
            ? "20px"
            : "28px",

        fontWeight: "900",

        color: "#111827",

        margin: 0,
      }}
    >
      Historique de vos commandes
    </h2>

    <p
      style={{
        color: "#6B7280",

        fontSize: "13px",

        marginTop: "6px",

        marginBottom: 0,
      }}
    >
      Consultez toutes vos commandes et leur statut en temps réel.
    </p>

  </div>

  {filteredOrders.map((order, index) => (

  <div
    key={index}
    style={{
      background: "#FFFFFF",
      border: "1px solid #EEF2F7",
      borderRadius: "20px",
      padding: "16px",
      marginBottom: "16px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
    }}
  >

    {/* HEADER */}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >

      <div
        style={{
          background: "#EEF2FF",
          color: "#2563EB",
          padding: "8px 14px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "800",
        }}
      >
        Commande #{order._id.slice(-8)}
      </div>

      <div
        style={{
          ...getStatusStyle(order.status),

          padding: "8px 12px",

          borderRadius: "999px",

          fontSize: "12px",

          fontWeight: "700",

          display: "flex",

          alignItems: "center",

          gap: "6px",
        }}
      >

        {order.status === "Livrée" ? (
          <FaCheckCircle />
        ) : order.status === "Expédiée" ? (
          <FaTruck />
        ) : (
          <FaTimesCircle />
        )}

        {order.status}

      </div>

    </div>

    {/* PRODUITS */}

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >

      {(order.items || []).map((item, i) => (

        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            borderRadius: "14px",
            background: "#F8FAFC",
            border: "1px solid #EEF2F7",
          }}
        >

          <img
            src={
              item.image?.includes("localhost:5000")
                ? item.image.replace(
                    "http://localhost:5000",
                    "https://konanshopping-production.up.railway.app"
                  )
                : item.image || "/logo.jpg"
            }

            alt={item.name}

            onError={(e) => {
              e.target.src = "/logo.jpg";
            }}

            style={{
              width: "70px",
              height: "70px",
              borderRadius: "12px",
              objectFit: "cover",
              border: "1px solid #E5E7EB",
              flexShrink: 0,
            }}
          />

          <div
            style={{
              flex: 1,
            }}
          >

            <h3
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              {item.name}
            </h3>

            <p
              style={{
                margin: "6px 0",
                color: "#6B7280",
                fontSize: "13px",
              }}
            >
              Quantité : {item.quantity}
            </p>

            <div
              style={{
                color: "#2563EB",
                fontWeight: "800",
                fontSize: "15px",
              }}
            >
              {item.price} FCFA
            </div>

          </div>

        </div>

      ))}

    </div>

    {/* INFOS COMMANDE */}

    <div
      style={{
        marginTop: "16px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        flexWrap: "wrap",

        gap: "10px",
      }}
    >

      <div>

        <p
          style={{
            margin: 0,
            color: "#94A3B8",
            fontSize: "12px",
          }}
        >
          Date
        </p>

        <strong>
          {new Date(
            order.createdAt
          ).toLocaleDateString(
            "fr-FR",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        </strong>

      </div>

      <div
        style={{
          textAlign: "right",
        }}
      >

        <p
          style={{
            margin: 0,
            color: "#94A3B8",
            fontSize: "12px",
          }}
        >
          Total
        </p>

        <h2
          style={{
            margin: 0,
            color: "#2563EB",
            fontWeight: "900",
            fontSize: "24px",
          }}
        >
          {order.total} FCFA
        </h2>

      </div>

    </div>

    {/* BOUTON */}

    <button
      onClick={() =>
        navigate(
          `/track-order/${order._id}`
        )
      }

      style={{
        width: "100%",

        marginTop: "18px",

        border: "none",

        background:
          "linear-gradient(135deg,#2563EB,#1D4ED8)",

        color: "#FFFFFF",

        padding: "13px",

        borderRadius: "14px",

        fontWeight: "700",

        cursor: "pointer",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        gap: "8px",

        boxShadow:
          "0 8px 20px rgba(37,99,235,0.20)",
      }}
    >

      <FaEye />

      Voir les détails

    </button>

  </div>

))}

      {/* FOOTER */}

<div
  style={{
    marginTop: "24px",

    background: "#FFFFFF",

    border: "1px solid #EEF2F7",

    borderRadius: "20px",

    padding:
      window.innerWidth < 768
        ? "16px"
        : "24px",

    display: "grid",

    gridTemplateColumns:
      window.innerWidth < 768
        ? "repeat(2,1fr)"
        : "repeat(4,1fr)",

    gap:
      window.innerWidth < 768
        ? "14px"
        : "20px",

    boxShadow:
      "0 8px 25px rgba(0,0,0,0.04)",
  }}
>

  {/* PAIEMENT */}

  <div
    style={{
      textAlign: "center",
    }}
  >

    <FaShieldAlt
      style={{
        color: "#2563EB",

        fontSize:
          window.innerWidth < 768
            ? "22px"
            : "28px",

        marginBottom: "8px",
      }}
    />

    <h3
      style={{
        fontSize:
          window.innerWidth < 768
            ? "13px"
            : "15px",

        fontWeight: "700",

        color: "#111827",

        marginBottom: "4px",
      }}
    >
      Paiement sécurisé
    </h3>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "11px"
            : "13px",

        margin: 0,
      }}
    >
      Transactions protégées
    </p>

  </div>

  {/* LIVRAISON */}

  <div
    style={{
      textAlign: "center",
    }}
  >

    <FaTruck
      style={{
        color: "#2563EB",

        fontSize:
          window.innerWidth < 768
            ? "22px"
            : "28px",

        marginBottom: "8px",
      }}
    />

    <h3
      style={{
        fontSize:
          window.innerWidth < 768
            ? "13px"
            : "15px",

        fontWeight: "700",

        color: "#111827",

        marginBottom: "4px",
      }}
    >
      Livraison rapide
    </h3>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "11px"
            : "13px",

        margin: 0,
      }}
    >
      Partout au Cameroun
    </p>

  </div>

  {/* SUPPORT */}

  <div
    style={{
      textAlign: "center",
    }}
  >

    <FaHeadset
      style={{
        color: "#2563EB",

        fontSize:
          window.innerWidth < 768
            ? "22px"
            : "28px",

        marginBottom: "8px",
      }}
    />

    <h3
      style={{
        fontSize:
          window.innerWidth < 768
            ? "13px"
            : "15px",

        fontWeight: "700",

        color: "#111827",

        marginBottom: "4px",
      }}
    >
      Support 24/7
    </h3>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "11px"
            : "13px",

        margin: 0,
      }}
    >
      Assistance premium
    </p>

  </div>

  {/* GARANTIE */}

  <div
    style={{
      textAlign: "center",
    }}
  >

    <FaCheckCircle
      style={{
        color: "#16A34A",

        fontSize:
          window.innerWidth < 768
            ? "22px"
            : "28px",

        marginBottom: "8px",
      }}
    />

    <h3
      style={{
        fontSize:
          window.innerWidth < 768
            ? "13px"
            : "15px",

        fontWeight: "700",

        color: "#111827",

        marginBottom: "4px",
      }}
    >
      Satisfaction garantie
    </h3>

    <p
      style={{
        color: "#6B7280",

        fontSize:
          window.innerWidth < 768
            ? "11px"
            : "13px",

        margin: 0,
      }}
    >
      Qualité assurée
    </p>

  </div>

</div>

</div>

</div>
  );

}

export default MyOrders;