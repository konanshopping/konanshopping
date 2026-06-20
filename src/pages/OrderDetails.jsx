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

        minHeight: "100dvh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "16px",
      }}
    >

      <div
        style={{
          background: "#FFFFFF",

          width: "100%",

          maxWidth: "340px",

          padding: "22px",

          borderRadius: "22px",

          border: "1px solid #E5E7EB",

          boxShadow:
            "0 10px 30px rgba(15,23,42,0.06)",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          textAlign: "center",
        }}
      >

        <div
          style={{
            width: "65px",

            height: "65px",

            borderRadius: "18px",

            background:
              "linear-gradient(135deg,#EEF2FF,#DDD6FE)",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            marginBottom: "14px",
          }}
        >

          <FaBoxOpen
            style={{
              fontSize: "28px",

              color: "#7C3AED",
            }}
          />

        </div>

        <h2
          style={{
            margin: 0,

            color: "#111827",

            fontSize: "18px",

            fontWeight: "900",
          }}
        >
          Chargement...
        </h2>

        <p
          style={{
            marginTop: "8px",

            marginBottom: 0,

            color: "#64748B",

            fontSize: "13px",

            lineHeight: "22px",
          }}
        >
          Récupération des détails de votre commande
        </p>

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
    flexDirection:
      window.innerWidth < 768
        ? "column"
        : "row",
    gap: "12px",
    paddingBottom: "14px",
    marginBottom: "16px",
    borderBottom: "1px solid #E5E7EB",
  }}
>

  {/* LEFT */}

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      width: "100%",
      minWidth: 0,
    }}
  >

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "44px"
            : "54px",

        height:
          window.innerWidth < 768
            ? "44px"
            : "54px",

        borderRadius: "14px",

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
              ? "18px"
              : "24px",

          color: "#7C3AED",
        }}
      />

    </div>

    <div
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >

      <h1
        style={{
          margin: 0,

          color: "#111827",

          fontSize:
            window.innerWidth < 768
              ? "17px"
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

          gap: "5px",

          marginTop: "4px",

          color: "#64748B",

          fontSize: "11px",

          overflow: "hidden",
        }}
      >

        <FaHashtag
          style={{
            fontSize: "10px",
          }}
        />

        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {order._id}
        </span>

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

      padding: "8px 12px",

      borderRadius: "999px",

      fontWeight: "800",

      fontSize: "11px",

      display: "flex",

      alignItems: "center",

      gap: "6px",

      border:
        order.status === "Livrée"
          ? "1px solid #BBF7D0"
          : order.status === "En livraison"
          ? "1px solid #BFDBFE"
          : "1px solid #FCD34D",

      alignSelf:
        window.innerWidth < 768
          ? "flex-start"
          : "center",
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
      background: "#FFFFFF",

      border:
        "1px solid #E5E7EB",

      borderRadius: "16px",

      padding: "12px",

      marginBottom: "12px",

      display: "flex",

      justifyContent: "space-between",

      alignItems: "center",

      gap: "12px",

      boxShadow:
        "0 2px 8px rgba(15,23,42,0.04)",
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
          width:
            window.innerWidth < 768
              ? "65px"
              : "75px",

          height:
            window.innerWidth < 768
              ? "65px"
              : "75px",

          objectFit: "cover",

          borderRadius: "14px",

          border:
            "1px solid #E5E7EB",

          flexShrink: 0,
        }}
      />

      <div
        style={{
          flex: 1,

          minWidth: 0,
        }}
      >

        <div
          style={{
            display: "inline-flex",

            alignItems: "center",

            gap: "6px",

            background: "#F5F3FF",

            color: "#7C3AED",

            padding: "4px 8px",

            borderRadius: "999px",

            fontSize: "10px",

            fontWeight: "700",

            marginBottom: "6px",
          }}
        >

          <FaShoppingBag />

          Produit

        </div>

        <h3
          style={{
            margin: 0,

            color: "#111827",

            fontSize:
              window.innerWidth < 768
                ? "14px"
                : "16px",

            fontWeight: "800",

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

          Quantité :
          {" "}
          {item.quantity || 1}

        </div>

      </div>

    </div>

    {/* PRIX */}

    <div
      style={{
        textAlign: "right",

        flexShrink: 0,
      }}
    >

      <div
        style={{
          fontSize: "11px",

          color: "#94A3B8",

          fontWeight: "600",
        }}
      >
        Prix
      </div>

      <div
        style={{
          color: "#4F46E5",

          fontWeight: "900",

          fontSize:
            window.innerWidth < 768
              ? "15px"
              : "18px",
        }}
      >
        {
          item.price ||
          item.product?.price
        } FCFA
      </div>

    </div>

  </div>

))}

        {/* FOOTER */}

<div
  style={{
    marginTop: "18px",

    background: "#F8FAFC",

    border: "1px solid #E2E8F0",

    borderRadius: "18px",

    padding: "16px",

    display: "flex",

    justifyContent: "space-between",

    alignItems:
      window.innerWidth < 768
        ? "stretch"
        : "center",

    flexDirection:
      window.innerWidth < 768
        ? "column"
        : "row",

    gap: "14px",
  }}
>

  {/* TOTAL */}

  <div
    style={{
      flex: 1,
    }}
  >

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "8px",

        color: "#64748B",

        fontSize: "12px",

        fontWeight: "700",
      }}
    >

      <FaMoneyBillWave
        style={{
          color: "#4F46E5",
        }}
      />

      Montant total

    </div>

    <h2
      style={{
        margin: "8px 0 0 0",

        color: "#111827",

        fontSize:
          window.innerWidth < 768
            ? "24px"
            : "30px",

        fontWeight: "900",

        lineHeight: 1,
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
          ? "14px"
          : "14px 22px",

      borderRadius: "14px",

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

      boxShadow:
        "0 8px 20px rgba(79,70,229,0.18)",
    }}
  >

    <FaTruck />

    Suivre la livraison

  </button>

</div>

      </div>

    </div>

  );

}