import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaHourglassHalf,
  FaBoxOpen,
  FaClipboardList,
  FaShoppingBag,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";

export default function PendingOrders() {

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {

  const fetchOrders = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await axios.get(

        `https://konanshopping-production.up.railway.app/my-orders/${user._id}`

      );

      const filtered =
        res.data.filter(

          (o) =>

            o.status ===
              "En attente"

            ||

            o.status ===
              "En livraison"

        );

      setOrders(filtered);

    }

    catch (err) {

      console.log(err);

    }

  };

  fetchOrders();

}, []);

;

  return (

    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "20px",
      }}
    >

     {/* HEADER */}

<div
  style={{
    background:
      "linear-gradient(135deg,#2563EB,#1D4ED8)",

    padding:
      window.innerWidth < 768
        ? "20px"
        : "30px",

    borderRadius: "28px",

    color: "#FFFFFF",

    marginBottom: "25px",

    position: "relative",

    overflow: "hidden",

    boxShadow:
      "0 15px 35px rgba(37,99,235,0.18)",

    border:
      "1px solid rgba(255,255,255,0.08)",
  }}
>

  {/* GLOW 1 */}

  <div
    style={{
      position: "absolute",

      top: "-70px",

      right: "-70px",

      width: "180px",

      height: "180px",

      borderRadius: "50%",

      background:
        "rgba(255,255,255,0.08)",
    }}
  />

  {/* GLOW 2 */}

  <div
    style={{
      position: "absolute",

      bottom: "-50px",

      left: "-50px",

      width: "140px",

      height: "140px",

      borderRadius: "50%",

      background:
        "rgba(255,255,255,0.05)",
    }}
  />

  {/* CONTENT */}

  <div
    style={{
      position: "relative",

      zIndex: 2,

      display: "flex",

      alignItems: "center",

      gap:
        window.innerWidth < 768
          ? "14px"
          : "18px",
    }}
  >

    {/* ICON */}

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "60px"
            : "70px",

        height:
          window.innerWidth < 768
            ? "60px"
            : "70px",

        borderRadius: "20px",

        background:
          "rgba(255,255,255,0.15)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        backdropFilter: "blur(12px)",

        border:
          "1px solid rgba(255,255,255,0.15)",

        flexShrink: 0,
      }}
    >

      <FaHourglassHalf
        style={{
          fontSize:
            window.innerWidth < 768
              ? "24px"
              : "28px",

          color: "#FFFFFF",
        }}
      />

    </div>

    {/* TEXT */}

    <div
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "8px",

          flexWrap: "wrap",
        }}
      >

        <h1
          style={{
            margin: 0,

            fontSize:
              window.innerWidth < 768
                ? "24px"
                : "32px",

            fontWeight: "900",

            lineHeight: 1.1,

            letterSpacing: "-0.8px",
          }}
        >
          Commandes en attente
        </h1>

        <div
          style={{
            background:
              "rgba(255,255,255,0.15)",

            padding: "5px 10px",

            borderRadius: "999px",

            fontSize: "10px",

            fontWeight: "800",

            border:
              "1px solid rgba(255,255,255,0.15)",
          }}
        >
          EN COURS
        </div>

      </div>

      <p
        style={{
          marginTop: "8px",

          marginBottom: 0,

          fontSize:
            window.innerWidth < 768
              ? "13px"
              : "15px",

          opacity: 0.95,

          lineHeight: "22px",

          maxWidth: "500px",
        }}
      >
        Consultez vos commandes en cours de traitement
        et suivez leur évolution en temps réel.
      </p>

    </div>

  </div>

</div>

{/* AUCUNE COMMANDE */}

{orders.length === 0 && (

  <div
    style={{
      background: "#FFFFFF",

      padding:
        window.innerWidth < 768
          ? "40px 20px"
          : "60px 35px",

      borderRadius: "28px",

      textAlign: "center",

      border: "1px solid #E5E7EB",

      boxShadow:
        "0 15px 35px rgba(15,23,42,0.06)",

      overflow: "hidden",

      position: "relative",
    }}
  >

    {/* GLOW */}

    <div
      style={{
        position: "absolute",

        top: "-60px",

        right: "-60px",

        width: "150px",

        height: "150px",

        borderRadius: "50%",

        background:
          "rgba(37,99,235,0.05)",
      }}
    />

    {/* ICON */}

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "90px"
            : "110px",

        height:
          window.innerWidth < 768
            ? "90px"
            : "110px",

        margin: "0 auto 24px",

        borderRadius: "28px",

        background:
          "linear-gradient(135deg,#EEF2FF,#DBEAFE)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        boxShadow:
          "0 12px 25px rgba(37,99,235,0.10)",
      }}
    >

      <FaBoxOpen
        style={{
          fontSize:
            window.innerWidth < 768
              ? "40px"
              : "50px",

          color: "#2563EB",
        }}
      />

    </div>

    {/* BADGE */}

    <div
      style={{
        display: "inline-flex",

        alignItems: "center",

        gap: "8px",

        background: "#EFF6FF",

        color: "#2563EB",

        padding: "8px 14px",

        borderRadius: "999px",

        fontSize: "12px",

        fontWeight: "800",

        marginBottom: "18px",
      }}
    >

      <FaClipboardList />

      Historique vide

    </div>

    {/* TITLE */}

    <h2
      style={{
        color: "#111827",

        fontSize:
          window.innerWidth < 768
            ? "24px"
            : "30px",

        fontWeight: "900",

        marginBottom: "12px",

        lineHeight: 1.2,
      }}
    >
      Aucune commande en attente
    </h2>

    {/* TEXT */}

    <p
      style={{
        color: "#64748B",

        fontSize:
          window.innerWidth < 768
            ? "14px"
            : "16px",

        lineHeight: "28px",

        maxWidth: "500px",

        margin: "0 auto",

        fontWeight: "500",
      }}
    >
      Vous n'avez actuellement aucune commande en cours
      de traitement. Toutes vos nouvelles commandes
      apparaîtront ici automatiquement.
    </p>

  </div>

)}

{/* COMMANDES */}

{orders.map((order) => (

<div
  key={order._id}
  onClick={() =>
    window.location.href =
      `/order/${order._id}`
  }
  style={{
    background: "#FFFFFF",
    borderRadius: "28px",
    padding: "20px",
    marginBottom: "25px",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.06)",
    border: "1px solid #E5E7EB",
    cursor: "pointer",
  }}
>

{/* TOP */}

<div
  style={{
    display: "flex",

    justifyContent: "space-between",

    alignItems:
      window.innerWidth < 768
        ? "flex-start"
        : "center",

    gap: "12px",

    flexWrap: "wrap",

    marginBottom: "20px",

    paddingBottom: "16px",

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
          "linear-gradient(135deg,#DBEAFE,#BFDBFE)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        flexShrink: 0,
      }}
    >

      <FaClipboardList
        style={{
          color: "#2563EB",

          fontSize:
            window.innerWidth < 768
              ? "20px"
              : "24px",
        }}
      />

    </div>

    <div
      style={{
        minWidth: 0,
      }}
    >

      <h2
        style={{
          margin: 0,

          color: "#0F172A",

          fontSize:
            window.innerWidth < 768
              ? "18px"
              : "24px",

          fontWeight: "900",
        }}
      >
        Commande
      </h2>

      <p
        style={{
          color: "#64748B",

          marginTop: "6px",

          marginBottom: 0,

          fontSize:
            window.innerWidth < 768
              ? "11px"
              : "13px",

          fontWeight: "600",

          overflow: "hidden",

          textOverflow: "ellipsis",

          whiteSpace: "nowrap",

          maxWidth:
            window.innerWidth < 768
              ? "180px"
              : "320px",
        }}
      >
        #{order._id}
      </p>

    </div>

  </div>

  {/* STATUS */}

  <div
    style={{
      background: "#FEF3C7",

      color: "#92400E",

      padding:
        window.innerWidth < 768
          ? "8px 12px"
          : "10px 16px",

      borderRadius: "999px",

      fontWeight: "800",

      fontSize:
        window.innerWidth < 768
          ? "12px"
          : "13px",

      display: "flex",

      alignItems: "center",

      gap: "6px",

      border:
        "1px solid #FCD34D",
    }}
  >

    <FaHourglassHalf />

    En attente

  </div>

</div>

          {/* PRODUITS */}

{order.items?.map(
  (item, index) => (

    <div
      key={index}

      style={{
        display: "flex",

        justifyContent:
          "space-between",

        alignItems:
          window.innerWidth < 768
            ? "flex-start"
            : "center",

        flexDirection:
          window.innerWidth < 768
            ? "column"
            : "row",

        gap: "15px",

        border:
          "1px solid #E5E7EB",

        borderRadius: "20px",

        padding:
          window.innerWidth < 768
            ? "14px"
            : "18px",

        marginBottom: "15px",

        background: "#FFFFFF",

        boxShadow:
          "0 6px 20px rgba(15,23,42,0.04)",
      }}
    >

      {/* LEFT */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "14px",

          width: "100%",
        }}
      >

        {/* IMAGE */}

        <div
          style={{
            position: "relative",

            flexShrink: 0,
          }}
        >

          <img
            src={item.image}

            alt={item.name}

            style={{
              width:
                window.innerWidth < 768
                  ? "80px"
                  : "95px",

              height:
                window.innerWidth < 768
                  ? "80px"
                  : "95px",

              objectFit: "cover",

              borderRadius: "18px",

              border:
                "1px solid #E5E7EB",
            }}
          />

          <div
            style={{
              position: "absolute",

              top: "-6px",

              right: "-6px",

              background:
                "#2563EB",

              color: "#FFFFFF",

              width: "24px",

              height: "24px",

              borderRadius: "50%",

              display: "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              fontSize: "11px",

              fontWeight: "900",
            }}
          >
            {index + 1}
          </div>

        </div>

        {/* INFOS */}

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

              background:
                "#EFF6FF",

              color: "#2563EB",

              padding: "5px 10px",

              borderRadius: "999px",

              fontSize: "11px",

              fontWeight: "800",

              marginBottom: "8px",
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
                  ? "15px"
                  : "17px",

              fontWeight: "800",

              lineHeight: 1.4,
            }}
          >
            {item.name}
          </h3>

          <div
            style={{
              marginTop: "10px",

              display: "inline-flex",

              alignItems: "center",

              gap: "6px",

              background:
                "#F8FAFC",

              border:
                "1px solid #E2E8F0",

              padding: "6px 10px",

              borderRadius: "999px",

              color: "#475569",

              fontSize: "12px",

              fontWeight: "700",
            }}
          >

            <FaBoxOpen />

            Quantité :
            {" "}
            {item.quantity || 1}

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div
        style={{
          width:
            window.innerWidth < 768
              ? "100%"
              : "auto",

          textAlign:
            window.innerWidth < 768
              ? "left"
              : "right",
        }}
      >

        <p
          style={{
            margin: 0,

            color: "#94A3B8",

            fontSize: "11px",

            fontWeight: "700",

            textTransform:
              "uppercase",
          }}
        >
          Prix
        </p>

        <h2
          style={{
            margin: "6px 0 0 0",

            color: "#2563EB",

            fontSize:
              window.innerWidth < 768
                ? "22px"
                : "26px",

            fontWeight: "900",
          }}
        >
          {item.price}
          {" "}
          FCFA
        </h2>

      </div>

    </div>

  )
)}

          {/* FOOTER */}

<div
  style={{
    marginTop: "18px",

    paddingTop: "18px",

    borderTop:
      "1px solid #E5E7EB",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      window.innerWidth < 768
        ? "flex-start"
        : "center",

    flexDirection:
      window.innerWidth < 768
        ? "column"
        : "row",

    gap: "12px",
  }}
>

  {/* TOTAL */}

  <div>

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "8px",

        color: "#64748B",

        fontSize: "13px",

        fontWeight: "700",
      }}
    >

      <FaMoneyBillWave
        style={{
          color: "#2563EB",
        }}
      />

      Montant total

    </div>

    <h2
      style={{
        margin: "8px 0 0 0",

        color: "#0F172A",

        fontSize:
          window.innerWidth < 768
            ? "28px"
            : "34px",

        fontWeight: "900",

        lineHeight: 1,
      }}
    >
      {order.total}
      {" "}
      FCFA
    </h2>

  </div>

  {/* BADGE */}

  <div
    style={{
      background:
        "linear-gradient(135deg,#DCFCE7,#BBF7D0)",

      color: "#15803D",

      padding:
        window.innerWidth < 768
          ? "10px 14px"
          : "12px 18px",

      borderRadius: "999px",

      fontWeight: "800",

      fontSize:
        window.innerWidth < 768
          ? "12px"
          : "13px",

      display: "flex",

      alignItems: "center",

      gap: "8px",

      border:
        "1px solid #BBF7D0",
    }}
  >

    <FaCheckCircle />

    Commande enregistrée

  </div>

</div>

{/* BOUTON */}

<button
  style={{
    width: "100%",

    marginTop: "18px",

    border: "none",

    background:
      "linear-gradient(135deg,#2563EB,#1D4ED8)",

    color: "#FFFFFF",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "16px",

    borderRadius: "16px",

    fontWeight: "800",

    fontSize:
      window.innerWidth < 768
        ? "14px"
        : "15px",

    cursor: "pointer",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "10px",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.20)",
  }}
>

  <FaTruck />

  Voir les détails de livraison

</button>

</div>

))}

    </div>

  );

}