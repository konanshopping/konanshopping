import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaShoppingCart,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaMoneyBillWave,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaUser
} from "react-icons/fa";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    axios
      .get("https://konanshopping-production.up.railway.app/orders")
      .then((res) => {

        setOrders(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);

const updateStatus = async (
  id,
  status
) => {

  try {

    await axios.put(
      `https://konanshopping-production.up.railway.app/orders/${id}`,
      {
        status,
      }
    );

    setOrders(

      orders.map((order) =>

        order._id === id
          ? {
              ...order,
              status,
            }
          : order

      )

    );

  } catch (err) {

    console.log(err);

  }

};

  return (

<div
  style={{
    minHeight: "100vh",
    background: "#F8FAFC",
    padding:
      window.innerWidth < 768
        ? "15px"
        : "30px",
  }}
>

  {/* HEADER */}

  <div
    style={{
      background:
        "linear-gradient(135deg,#2563EB,#1D4ED8)",

      padding: "20px",

      borderRadius: "24px",

      color: "#FFF",

      marginBottom: "25px",

      boxShadow:
        "0 10px 30px rgba(37,99,235,0.15)",
    }}
  >

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "14px",
      }}
    >

      <FaShoppingCart
        style={{
          fontSize: "30px",
        }}
      />

      <div>

        <h1
          style={{
            margin: 0,

            fontSize:
              window.innerWidth < 768
                ? "22px"
                : "30px",

            fontWeight: "900",
          }}
        >
          Commandes Clients
        </h1>

        <p
          style={{
            margin: "5px 0 0 0",

            opacity: 0.9,
          }}
        >
          Gestion des commandes
        </p>

      </div>

    </div>

  </div>

  {orders.map((order) => (

    <div
      key={order._id}
      style={{
        background: "#FFF",

        padding: "18px",

        borderRadius: "24px",

        marginBottom: "18px",

        border:
          "1px solid #E5E7EB",

        boxShadow:
          "0 8px 25px rgba(15,23,42,0.05)",
      }}
    >

      {/* CLIENT */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "12px",

          marginBottom: "15px",
        }}
      >

        <div>

          <h2
            style={{
              margin: 0,

              display: "flex",

              alignItems: "center",

              gap: "8px",

              color: "#111827",

              fontSize: "20px",

              fontWeight: "800",
            }}
          >

            <FaUser
              style={{
                color: "#2563EB",
              }}
            />

            {order.customerName}

          </h2>

          <p
            style={{
              display: "flex",

              alignItems: "center",

              gap: "8px",

              color: "#64748B",

              marginTop: "8px",
            }}
          >

            <FaPhoneAlt />

            {order.phone}

          </p>

          <p
            style={{
              display: "flex",

              alignItems: "center",

              gap: "8px",

              color: "#64748B",
            }}
          >

            <FaMapMarkerAlt />

            {order.address}

          </p>

        </div>

        {/* STATUS */}

        <div
          style={{
            display: "inline-flex",

            alignItems: "center",

            gap: "8px",

            padding: "10px 14px",

            borderRadius: "999px",

            background:
              order.status === "Livrée"
                ? "#DCFCE7"
                : order.status === "En livraison"
                ? "#DBEAFE"
                : "#FEF3C7",

            color:
              order.status === "Livrée"
                ? "#15803D"
                : order.status === "En livraison"
                ? "#2563EB"
                : "#92400E",

            fontWeight: "800",

            fontSize: "13px",
          }}
        >

          {order.status === "Livrée" ? (
            <FaCheckCircle />
          ) : order.status === "En livraison" ? (
            <FaTruck />
          ) : (
            <FaClock />
          )}

          {order.status}

        </div>

      </div>

      {/* PRODUITS */}

      <h3
        style={{
          display: "flex",

          alignItems: "center",

          gap: "8px",

          color: "#111827",

          marginBottom: "15px",
        }}
      >

        <FaBoxOpen />

        Produits

      </h3>

      {order.products.map((item, index) => (

        <div
          key={index}
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            padding: "12px",

            marginBottom: "10px",

            borderRadius: "14px",

            background: "#F8FAFC",

            border:
              "1px solid #E5E7EB",
          }}
        >

          <span
            style={{
              fontWeight: "600",
            }}
          >
            {item.name}
          </span>

          <strong
            style={{
              color: "#2563EB",
            }}
          >
            {item.price} FCFA
          </strong>

        </div>

      ))}

      {/* TOTAL */}

      <div
        style={{
          marginTop: "20px",

          paddingTop: "15px",

          borderTop:
            "1px solid #E5E7EB",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "12px",
        }}
      >

        <div>

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "8px",

              color: "#64748B",

              fontSize: "13px",
            }}
          >

            <FaMoneyBillWave />

            Montant total

          </div>

          <h2
            style={{
              margin: "5px 0 0 0",

              color: "#111827",

              fontWeight: "900",
            }}
          >
            {order.total} FCFA
          </h2>

        </div>

      </div>

      {/* ACTIONS */}

      <div
        style={{
          marginTop: "18px",

          display: "flex",

          gap: "10px",

          flexWrap: "wrap",
        }}
      >

        <button
          onClick={() =>
            updateStatus(
              order._id,
              "En livraison"
            )
          }
          style={{
            border: "none",

            background:
              "linear-gradient(135deg,#2563EB,#1D4ED8)",

            color: "#FFF",

            padding: "12px 16px",

            borderRadius: "14px",

            fontWeight: "800",

            cursor: "pointer",
          }}
        >

          <FaTruck
            style={{
              marginRight: "8px",
            }}
          />

          En livraison

        </button>

        <button
          onClick={() =>
            updateStatus(
              order._id,
              "Livrée"
            )
          }
          style={{
            border: "none",

            background:
              "linear-gradient(135deg,#22C55E,#16A34A)",

            color: "#FFF",

            padding: "12px 16px",

            borderRadius: "14px",

            fontWeight: "800",

            cursor: "pointer",
          }}
        >

          <FaCheckCircle
            style={{
              marginRight: "8px",
            }}
          />

          Livrée

        </button>

      </div>

    </div>

  ))}

</div>

);

}

export default Orders;