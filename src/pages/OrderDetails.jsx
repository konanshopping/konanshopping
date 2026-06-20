import { useEffect, useState } from "react";

import {
  FaBoxOpen,
  FaMoneyBillWave,
  FaShoppingBag,
  FaHashtag,
  FaTruck,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBox,
  FaEye,
} from "react-icons/fa";

import axios from "axios";

import { useParams } from "react-router-dom";

export default function OrderDetails() {

  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  useEffect(() => {

    axios

      .get(
        `https://konanshopping-production.up.railway.app/order/${id}`
      )

      .then((res) => {

        console.log(res.data);

        setOrder(res.data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, [id]);

  if (!order) {

  return (

    <div
      style={{
        background: "#F5F7FB",
        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "20px",
      }}
    >

      <div
        style={{
          background: "#FFFFFF",

          padding: "24px",

          borderRadius: "20px",

          boxShadow:
            "0 8px 25px rgba(15,23,42,0.05)",

          display: "flex",

          alignItems: "center",

          gap: "12px",

          border:
            "1px solid #E5E7EB",
        }}
      >

        <FaBoxOpen
          style={{
            fontSize: "22px",

            color: "#7C3AED",
          }}
        />

        <div>

          <div
            style={{
              color: "#111827",

              fontWeight: "800",

              fontSize: "16px",
            }}
          >
            Chargement...
          </div>

          <div
            style={{
              color: "#64748B",

              fontSize: "13px",

              marginTop: "4px",
            }}
          >
            Récupération des détails de la commande
          </div>

        </div>

      </div>

    </div>

  );

}

  const products =
    order.items || order.products || [];

  return (

    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "15px",
      }}
    >

      {/* MAIN CARD */}

      <div
        style={{
          background: "white",

          borderRadius: "18px",

          padding: "20px",

          boxShadow:
            "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >

  {/* HEADER */}

<div
  style={{
    display: "flex",

    justifyContent: "space-between",

    alignItems:
      window.innerWidth < 768
        ? "flex-start"
        : "center",

    flexWrap: "wrap",

    gap: "12px",

    paddingBottom: "16px",

    marginBottom: "16px",

    borderBottom:
      "1px solid #F1F5F9",
  }}
>

  {/* LEFT */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "12px",

      flex: 1,

      minWidth: 0,
    }}
  >

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "50px"
            : "58px",

        height:
          window.innerWidth < 768
            ? "50px"
            : "58px",

        borderRadius: "16px",

        background:
          "linear-gradient(135deg,#EEF2FF,#DDD6FE)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        flexShrink: 0,
      }}
    >

      <FaBoxOpen
        style={{
          fontSize:
            window.innerWidth < 768
              ? "22px"
              : "26px",

          color: "#7C3AED",
        }}
      />

    </div>

    <div
      style={{
        minWidth: 0,
      }}
    >

      <h1
        style={{
          margin: 0,

          color: "#111827",

          fontSize:
            window.innerWidth < 768
              ? "20px"
              : "24px",

          fontWeight: "900",

          lineHeight: 1.2,
        }}
      >
        Détails commande
      </h1>

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "6px",

          marginTop: "5px",

          color: "#64748B",

          fontSize: "12px",

          fontWeight: "500",
        }}
      >

        <FaHashtag />

        {order._id}

      </div>

    </div>

  </div>

  {/* STATUS */}

  <div
    style={{
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

      padding: "8px 14px",

      borderRadius: "999px",

      fontWeight: "800",

      fontSize: "12px",

      display: "flex",

      alignItems: "center",

      gap: "6px",

      border:
        order.status === "Livrée"
          ? "1px solid #BBF7D0"
          : order.status === "En livraison"
          ? "1px solid #BFDBFE"
          : "1px solid #FCD34D",
    }}
  >

    {
      order.status === "Livrée"
        ? <FaCheckCircle />
        : order.status === "En livraison"
        ? <FaTruck />
        : <FaBoxOpen />
    }

    {order.status}

  </div>

</div>


{/* PRODUITS */}

{products.map((item, index) => (

  <div
    key={index}
    style={{
      display: "flex",

      alignItems: "center",

      justifyContent: "space-between",

      gap: "12px",

      padding: "12px 0",

      borderBottom:
        index !== products.length - 1
          ? "1px solid #F1F5F9"
          : "none",
    }}
  >

    {/* LEFT */}

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "12px",

        flex: 1,

        minWidth: 0,
      }}
    >

     <img
  src={
    (
      item.image ||
      item.product?.image ||
      item.productImage
    )?.includes("localhost:5000")

      ? (
          item.image ||
          item.product?.image ||
          item.productImage
        ).replace(
          "http://localhost:5000",
          "https://konanshopping-production.up.railway.app"
        )

      : (
          item.image ||
          item.product?.image ||
          item.productImage ||
          "/logo.jpg"
        )
  }

  alt={
    item.name ||
    item.product?.name
  }

  onError={(e) => {
    e.target.src = "/logo.jpg";
  }}

  style={{
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    flexShrink: 0,
  }}
/>

      <div
        style={{
          flex: 1,

          minWidth: 0,
        }}
      >

        <h3
          style={{
            margin: 0,

            color: "#111827",

            fontSize: "15px",

            fontWeight: "700",

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {
            item.name ||
            item.product?.name
          }
        </h3>

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "6px",

            marginTop: "6px",

            color: "#64748B",

            fontSize: "12px",
          }}
        >

          <FaBox />

          Qté : {item.quantity || 1}

        </div>

      </div>

    </div>

    {/* PRIX */}

    <div
      style={{
        color: "#4F46E5",

        fontWeight: "800",

        fontSize:
          window.innerWidth < 768
            ? "15px"
            : "17px",

        whiteSpace: "nowrap",
      }}
    >
      {
        item.price ||
        item.product?.price
      } FCFA
    </div>

  </div>

))}

        {/* FOOTER */}

<div
  style={{
    marginTop: "16px",

    paddingTop: "16px",

    borderTop: "1px solid #E5E7EB",

    display: "flex",

    justifyContent: "space-between",

    alignItems:
      window.innerWidth < 768
        ? "flex-start"
        : "center",

    flexDirection:
      window.innerWidth < 768
        ? "column"
        : "row",

    gap: "14px",
  }}
>

  {/* TOTAL */}

  <div>

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "6px",

        color: "#64748B",

        fontSize: "12px",

        fontWeight: "600",
      }}
    >

      <FaMoneyBillWave
        style={{
          color: "#4F46E5",
        }}
      />

      Total commande

    </div>

    <h2
      style={{
        margin: "6px 0 0 0",

        color: "#111827",

        fontSize:
          window.innerWidth < 768
            ? "22px"
            : "28px",

        fontWeight: "900",
      }}
    >
      {order.total} FCFA
    </h2>

  </div>

  {/* BUTTON */}

  <button
    onClick={() =>
      window.location.href =
      `/track-order/${order._id}`
    }
    style={{
      background:
        "linear-gradient(135deg,#4F46E5,#7C3AED)",

      color: "#FFFFFF",

      border: "none",

      padding:
        window.innerWidth < 768
          ? "12px 16px"
          : "12px 20px",

      borderRadius: "12px",

      fontWeight: "800",

      fontSize: "14px",

      cursor: "pointer",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

      gap: "8px",

      width:
        window.innerWidth < 768
          ? "100%"
          : "auto",
    }}
  >

    <FaTruck />

    Suivre commande

  </button>

</div>

      </div>

    </div>

  );

}
export default  OrderDetails;