import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


export default function DriverTracking() {

  const [orders, setOrders] =
    useState([]);

  const [isTracking,
    setIsTracking] =
      useState(false);

const [clientAddress, setClientAddress] =
  useState("Localisation du client...");

const [distance, setDistance] =
  useState("0 km");

const [eta, setEta] =
  useState("0 min");

  // =========================
  // LOAD ORDERS
  // =========================

 useEffect(() => {

  const fetchOrders =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/orders"
          );

        // NOUVELLE COMMANDE

        if (
          res.data.length >
          orders.length
        ) {

          const audio =
  new Audio(
    "/sounds/click.mp3"
  );

audio.volume = 1;

audio.play();

          toast.success(
  "🚚 Nouvelle commande !"
);

        }

        setOrders(res.data);

// =========================
// ETA + DISTANCE
// =========================

if (
  navigator.geolocation &&
  res.data[0]?.location
) {

  navigator.geolocation.getCurrentPosition(
    (pos) => {

      const driverLat =
        pos.coords.latitude;

      const driverLng =
        pos.coords.longitude;

      const clientLat =
        res.data[0].location.lat;

      const clientLng =
        res.data[0].location.lng;

      const km =
        calculateDistance(
          driverLat,
          driverLng,
          clientLat,
          clientLng
        );

      setDistance(
        `${km.toFixed(1)} km`
      );

      // vitesse moyenne scooter

      const speed = 35;

      const minutes =
        Math.max(
          1,
          Math.round(
            (km / speed) * 60
          )
        );

      setEta(
        `${minutes} min`
      );

    }
  );

}

        // =========================
// CLIENT GPS ADDRESS
// =========================

if (
  res.data[0]?.location?.lat &&
  res.data[0]?.location?.lng
) {

  try {

    const geoRes =
      await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${res.data[0].location.lat}&lon=${res.data[0].location.lng}`
      );

    if (geoRes.data?.display_name) {

      setClientAddress(
        geoRes.data.display_name
      );

    }

  } catch (err) {

    console.log(
      "Erreur géolocalisation",
      err
    );

  }

}

      } catch (err) {

        console.log(err);

      }

    };

  // LOAD FIRST

  fetchOrders();

  // AUTO REFRESH

  const interval =
    setInterval(() => {

      fetchOrders();

    }, 5000);

  return () =>
    clearInterval(interval);

}, [orders.length]);

  // =========================
  // START DELIVERY
  // =========================

  const startTracking =
  async (orderId) => {

    console.log("START OK");

    try {

      // =========================
      // UPDATE STATUS
      // =========================

   const driver = JSON.parse(
  localStorage.getItem("driver") || "null"
);

if (!driver) {
  alert("Chauffeur non connecté");
  return;
}

await axios.put(

  `http://localhost:5000/accept-order/${orderId}`,

  {

    driverId: driver._id,

    driverName: driver.name,

    driverPhone: driver.phone,

    driverPhoto: driver.photo,

    driverVehicle: driver.vehicle,

  }

);

      // =========================
      // UPDATE LOCAL STATE
      // =========================

      setOrders(

        orders.map((o) =>

          o._id === orderId

            ? {
                ...o,
                status:
                  "En livraison",
              }

            : o

        )

      );

      setIsTracking(true);

      // =========================
      // START GPS
      // =========================

      navigator.geolocation.watchPosition(

        async (position) => {

          try {

            const lat =
              position.coords.latitude;

            const lng =
              position.coords.longitude;

            await axios.put(

              `http://localhost:5000/order-location/${orderId}`,

              {

                lat,

                lng,

              }

            );

          } catch (err) {

            console.log(err);

          }

        },

        (err) => {

          console.log(err);

        },

        {

          enableHighAccuracy: true,

          maximumAge: 0,

          timeout: 5000,

        }

      );

      alert(
        "🚚 Livraison démarrée"
      );

    } catch (err) {

      console.log(err);

    }

  };

  // =========================
  // FINISH DELIVERY
  // =========================

  const finishDelivery =
    async (orderId) => {

      try {

        await axios.put(
  `http://localhost:5000/update-order-status/${orderId}`,
  {
    status: "Livrée",
  }
);

alert("✅ Commande livrée");

setOrders(
  orders.map((o) =>
    o._id === orderId
      ? {
          ...o,
          status: "Livrée",
        }
      : o
  )
);

      } catch (err) {

        console.log(err);

      }

    };

const deleteOrder =
  async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/delete-order/${id}`
      );

      setOrders(
        orders.filter(
          (o) => o._id !== id
        )
      );

    } catch (err) {

      console.log(err);

    }

  };

    const cancelOrder =
  async (orderId) => {

    try {

      await axios.put(
        `http://localhost:5000/update-order-status/${orderId}`,
        {
          status: "Annulée",
        }
      );

      alert(
        "❌ Commande annulée"
      );

      setOrders(

        orders.filter(
          (o) =>
            o._id !== orderId
        )

      );

    } catch (err) {

      console.log(err);

    }

  };

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

let driver = null;

try {

  driver = JSON.parse(
    localStorage.getItem("driver")
  );

} catch (err) {

  console.log("Driver invalide");

  localStorage.removeItem("driver");

}

if (!driver) {

  return (
    <div>
      Chauffeur non connecté
    </div>
  );

}

const visibleOrders = orders.filter((order) => {

  return (

    !order.assignedDriver ||

    order.assignedDriver?.id === driver?._id

  );

});

return (
  <div
    style={{
      minHeight: "100vh",

      background:
        "linear-gradient(180deg,#eef4ff,#f8fbff,#ffffff)",

      padding: "12px",

      fontFamily: "'Inter', sans-serif",
    }}
  >

    {/* ========================= */}
    {/* HEADER PREMIUM */}
    {/* ========================= */}

    <div
      style={{
        background:
          "linear-gradient(135deg,#2563eb,#4f46e5)",

        borderRadius: "20px",

        padding: "16px",

        color: "white",

        marginBottom: "14px",

        boxShadow:
          "0 15px 35px rgba(37,99,235,0.20)",

        border:
          "1px solid rgba(255,255,255,0.18)",

        backdropFilter: "blur(16px)",
      }}
    >

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "14px",
        }}
      >

        {/* LEFT */}

        <div>

          <h1
            style={{
              margin: 0,

              fontSize: "24px",

              fontWeight: "900",

              letterSpacing: "-1px",

              display: "flex",

              alignItems: "center",

              gap: "10px",
            }}
          >

            <span
              style={{
                background:
                  "rgba(255,255,255,0.16)",

                width: "42px",

                height: "42px",

                borderRadius: "14px",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                fontSize: "20px",
              }}
            >
              🚚
            </span>

            Dashboard Livreur

          </h1>

          <p
            style={{
              marginTop: "6px",

              marginBottom: 0,

              opacity: 0.92,

              fontSize: "12px",
            }}
          >
            Gestion intelligente des livraisons
          </p>

        </div>

        {/* RIGHT */}

        <div
          style={{
            display: "flex",

            gap: "10px",

            flexWrap: "wrap",
          }}
        >

          {/* STATUS */}

          <div
            style={{
              background:
                "rgba(255,255,255,0.16)",

              borderRadius: "16px",

              padding: "10px 14px",

              minWidth: "120px",

              backdropFilter: "blur(10px)",
            }}
          >

            <div
              style={{
                fontSize: "10px",

                opacity: 0.85,
              }}
            >
              STATUS
            </div>

            <div
              style={{
                marginTop: "4px",

                fontWeight: "900",

                fontSize: "14px",
              }}
            >
              🟢 EN LIGNE
            </div>

          </div>

          {/* GPS */}

          <div
            style={{
              background:
                isTracking
                  ? "linear-gradient(135deg,#16a34a,#22c55e)"
                  : "linear-gradient(135deg,#64748b,#475569)",

              borderRadius: "16px",

              padding: "10px 14px",

              minWidth: "150px",

              boxShadow:
                isTracking
                  ? "0 8px 20px rgba(34,197,94,0.20)"
                  : "0 8px 20px rgba(100,116,139,0.15)",
            }}
          >

            <div
              style={{
                fontSize: "10px",

                opacity: 0.9,

                color: "white",
              }}
            >
              GPS TRACKING
            </div>

            <div
              style={{
                marginTop: "4px",

                fontWeight: "900",

                fontSize: "14px",

                color: "white",
              }}
            >
              {isTracking
                ? "📍 EN DIRECT"
                : "⭕ OFFLINE"}
            </div>

          </div>

        </div>

      </div>

    </div>

    {/* ========================= */}
    {/* GPS LIVE */}
    {/* ========================= */}

    {isTracking && (

      <div
        style={{
          background:
            "linear-gradient(135deg,#dcfce7,#bbf7d0)",

          borderRadius: "18px",

          padding: "12px 16px",

          marginBottom: "14px",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "10px",

          border: "1px solid #86efac",

          boxShadow:
            "0 8px 20px rgba(34,197,94,0.12)",
        }}
      >

        <div>

          <div
            style={{
              fontWeight: "900",

              color: "#166534",

              fontSize: "14px",
            }}
          >
            🟢 GPS actif
          </div>

          <div
            style={{
              marginTop: "3px",

              color: "#15803d",

              fontSize: "12px",
            }}
          >
            Position synchronisée en direct
          </div>

        </div>

        <div
          style={{
            background: "#22c55e",

            color: "white",

            padding: "6px 12px",

            borderRadius: "999px",

            fontWeight: "800",

            fontSize: "11px",
          }}
        >
          LIVE
        </div>

      </div>

    )}

    {/* ========================= */}
    {/* ORDERS */}
    {/* ========================= */}

    <div
      style={{
        display: "flex",

        flexDirection: "column",

        gap: "14px",
      }}
    >

      {visibleOrders.map((order) => (

        <div
          key={order._id}

          style={{
            background:
              "rgba(255,255,255,0.92)",

            backdropFilter:
              "blur(18px)",

            borderRadius: "20px",

            padding: "16px",

            boxShadow:
              "0 10px 25px rgba(15,23,42,0.05)",

            border:
              "1px solid rgba(255,255,255,0.7)",

            transition:
              "all 0.25s ease",
          }}
        >

        {/* TOP */}

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "flex-start",

    flexWrap: "wrap",

    gap: "8px",
  }}
>

  <div>

    <h2
      style={{
        margin: 0,

        fontSize: "18px",

        color: "#0f172a",

        fontWeight: "800",

        letterSpacing: "-0.5px",
      }}
    >
      📦 {order.customerName}
    </h2>

    <p
      style={{
        color: "#64748b",

        marginTop: "4px",

        fontSize: "11px",

        fontWeight: "500",
      }}
    >
      Commande #{order._id}
    </p>

  </div>

  <div
    style={{
      background:
        order.status === "Livrée"
          ? "#dcfce7"
          : "#fef3c7",

      color:
        order.status === "Livrée"
          ? "#15803d"
          : "#92400e",

      padding:
        "6px 12px",

      borderRadius:
        "999px",

      fontWeight:
        "800",

      fontSize:
        "11px",

      boxShadow:
        "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    {order.status}
  </div>

</div>

{/* INFOS */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(160px,1fr))",

    gap: "10px",

    marginTop: "14px",
  }}
>

  {/* PHONE */}

  <div
    style={{
      background: "#f8fafc",

      borderRadius: "16px",

      padding: "14px",

      border:
        "1px solid #eef2f7",
    }}
  >

    <p
      style={{
        margin: 0,

        color: "#64748b",

        fontSize: "10px",

        fontWeight: "800",

        letterSpacing: "1px",
      }}
    >
      📞 CLIENT
    </p>

    <a
      href={`tel:${order.phone}`}

      style={{
        marginTop: "10px",

        display: "flex",

        alignItems: "center",

        justifyContent:
          "space-between",

        textDecoration: "none",

        background:
          "linear-gradient(135deg,#16a34a,#22c55e)",

        color: "white",

        padding: "12px 14px",

        borderRadius: "14px",

        fontWeight: "700",

        fontSize: "12px",

        boxShadow:
          "0 8px 20px rgba(34,197,94,0.20)",
      }}
    >

      <span>
        📞 {order.phone}
      </span>

      <span>
        Appeler
      </span>

    </a>

  </div>

  {/* ADDRESS */}

  <div
    style={{
      background: "#f8fafc",

      borderRadius: "16px",

      padding: "14px",

      border:
        "1px solid #eef2f7",
    }}
  >

    <p
      style={{
        margin: 0,

        color: "#64748b",

        fontSize: "10px",

        fontWeight: "800",
      }}
    >
      📍 ADRESSE
    </p>

    <h3
      style={{
        marginTop: "8px",

        color: "#0f172a",

        fontSize: "13px",

        lineHeight: "1.4",

        fontWeight: "700",
      }}
    >
      {clientAddress}
    </h3>

    <a
href={`https://www.google.com/maps/dir/?api=1&destination=${order.location?.lat},${order.location?.lng}`}

  target="_blank"

  rel="noreferrer"

  style={{
    marginTop: "12px",

    display: "inline-flex",

    alignItems: "center",

    gap: "8px",

    textDecoration: "none",

    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",

    color: "white",

    padding: "10px 14px",

    borderRadius: "14px",

    fontWeight: "700",

    fontSize: "12px",

    boxShadow:
      "0 8px 20px rgba(37,99,235,0.20)",
  }}
>
  🗺 Ouvrir itinéraire
</a>

  </div>

  {/* TOTAL */}

  <div
    style={{
      background: "#f8fafc",

      borderRadius: "16px",

      padding: "14px",

      border:
        "1px solid #eef2f7",
    }}
  >

    <p
      style={{
        margin: 0,

        color: "#64748b",

        fontSize: "10px",

        fontWeight: "800",
      }}
    >
      💰 TOTAL
    </p>

    <h2
      style={{
        marginTop: "8px",

        color: "#5b3df5",

        fontWeight: "900",

        fontSize: "18px",
      }}
    >
      {order.total} FCFA
    </h2>

  </div>

</div>

{/* PRODUCTS */}

<div
  style={{
    marginTop: "14px",
  }}
>

  {(order.items || [])
    .map((item, index) => (

      <div
        key={index}

        style={{
          display: "flex",

          alignItems: "center",

          gap: "12px",

          background:
            "#f8fafc",

          borderRadius:
            "16px",

          padding: "12px",

          marginBottom:
            "10px",

          border:
            "1px solid #eef2f7",
        }}
      >

        <img
          src={item.image}

          alt=""

          style={{
            width: "52px",

            height: "52px",

            objectFit:
              "cover",

            borderRadius:
              "12px",
          }}
        />

        <div>

          <h3
            style={{
              margin: 0,

              color: "#111827",

              fontSize: "13px",

              fontWeight: "700",
            }}
          >
            {item.name}
          </h3>

          <p
            style={{
              color:
                "#64748b",

              marginTop:
                "4px",

              fontSize:
                "11px",
            }}
          >
            Quantité : x{item.quantity}
          </p>

        </div>

      </div>

    ))}

</div>

{/* ETA + DISTANCE */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "10px",

    marginTop: "14px",
  }}
>

  {/* ETA */}

  <div
    style={{
      background:
        "linear-gradient(135deg,#5b3df5,#7c4dff)",

      borderRadius:
        "16px",

      padding:
        "14px",

      color: "white",

      boxShadow:
        "0 8px 20px rgba(91,61,245,0.18)",
    }}
  >

    <p
      style={{
        margin: 0,

        fontSize: "10px",

        opacity: 0.9,

        fontWeight: "800",
      }}
    >
      ETA
    </p>

    <h2
      style={{
        marginTop: "6px",

        marginBottom: 0,

        fontSize: "22px",

        fontWeight: "900",
      }}
    >
      {eta}
    </h2>

  </div>

  {/* DISTANCE */}

  <div
    style={{
      background:
        "#ffffff",

      borderRadius:
        "16px",

      padding:
        "14px",

      border:
        "1px solid #e2e8f0",
    }}
  >

    <p
      style={{
        margin: 0,

        color: "#64748b",

        fontSize: "10px",

        fontWeight: "800",
      }}
    >
      DISTANCE
    </p>

    <h2
      style={{
        marginTop: "6px",

        marginBottom: 0,

        color: "#0f172a",

        fontSize: "22px",

        fontWeight: "900",
      }}
    >
      {distance}
    </h2>

  </div>

</div>

        {/* BUTTONS */}

<div
  style={{
    display: "flex",

    gap: "10px",

    marginTop: "16px",
  }}
>

  {/* START */}

  <button

    onClick={() =>
      startTracking(order._id)
    }

    disabled={
      order.status === "Livrée"
    }

    style={{
      flex: 1,

      background:
        "linear-gradient(135deg,#5b3df5,#7c4dff)",

      color: "white",

      border: "none",

      padding: "13px",

      borderRadius: "14px",

      fontWeight: "800",

      cursor:
        order.status === "Livrée"
          ? "not-allowed"
          : "pointer",

      opacity:
        order.status === "Livrée"
          ? 0.5
          : 1,

      fontSize: "13px",

      transition:
        "all 0.25s ease",

      boxShadow:
        "0 8px 20px rgba(91,61,245,0.25)",
    }}
  >
    🚚 Démarrer
  </button>

  {/* DELIVERED */}

  <button

    onClick={() =>
      finishDelivery(order._id)
    }

    style={{
      flex: 1,

      background:
        "linear-gradient(135deg,#22c55e,#16a34a)",

      color: "white",

      border: "none",

      padding: "13px",

      borderRadius: "14px",

      fontWeight: "800",

      cursor: "pointer",

      fontSize: "13px",

      transition:
        "all 0.25s ease",

      boxShadow:
        "0 8px 20px rgba(34,197,94,0.25)",
    }}
  >
    ✅ Livrée
  </button>

  {/* CANCEL */}

  <button

    onClick={() =>
      cancelOrder(order._id)
    }

    disabled={
      order.status === "Livrée"
    }

    style={{
      flex: 1,

      background:
        "linear-gradient(135deg,#ef4444,#dc2626)",

      color: "white",

      border: "none",

      padding: "13px",

      borderRadius: "14px",

      fontWeight: "800",

      cursor:
        order.status === "Livrée"
          ? "not-allowed"
          : "pointer",

      opacity:
        order.status === "Livrée"
          ? 0.5
          : 1,

      fontSize: "13px",

      transition:
        "all 0.25s ease",

      boxShadow:
        "0 8px 20px rgba(239,68,68,0.25)",
    }}
  >
    ❌ Annuler
  </button>

</div>

{/* DELETE BUTTON */}

{order.status ===
  "Livrée" && (

  <button

    onClick={() =>
      deleteOrder(order._id)
    }

    style={{
      width: "100%",

      marginTop: "12px",

      background:
        "linear-gradient(135deg,#111827,#1e293b)",

      color: "white",

      border: "none",

      padding: "13px",

      borderRadius: "14px",

      fontWeight: "800",

      cursor: "pointer",

      fontSize: "13px",

      transition:
        "all 0.25s ease",

      boxShadow:
        "0 8px 20px rgba(0,0,0,0.18)",
    }}
  >
    🗑 Supprimer définitivement
  </button>

)}

          </div>

        ))}

      </div>

    </div>

  );

}