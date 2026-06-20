import {
  useState,
  useEffect,
  useRef
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  FaHeart,
  FaBoxOpen,
  FaGift,
  FaComments,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaRobot,
  FaBullseye,
  FaArrowRight,
  FaUserCircle
} from "react-icons/fa";

import {
  FaCamera,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

import {
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

import { FaEnvelope } from "react-icons/fa";

function Account() {

const logout = () => {

  localStorage.removeItem(
    "user"
  );

  localStorage.removeItem(
    "token"
  );

  window.location.href =
    "/login";

};

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (!user) {

    window.location.href =
      "/login";

    return null;

  }

  const [activeTab, setActiveTab] =
    useState("account");

const [profileImage, setProfileImage] =
  useState(
    localStorage.getItem(
      "profileImage"
    ) || ""
  );

  const [showPhotoModal,
  setShowPhotoModal] =
  useState(false);

  const fileInputRef =
  useRef(null);

const [showLogoutModal,
  setShowLogoutModal] =
  useState(false);

  const [unreadCount, setUnreadCount] =
  useState(0);

  const [pendingOrders, setPendingOrders] =
  useState(0);

const [shippedOrders, setShippedOrders] =
  useState(0);

const [deliveredOrders, setDeliveredOrders] =
  useState(0);

const [cancelledOrders, setCancelledOrders] =
  useState(0);

  useEffect(() => {

  const loadMessages =
    async () => {

      try {

        const res =
          await axios.get(
            "https://konanshopping-production.up.railway.app/api/messages"
          );

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const unread =
          res.data.filter(
            (msg) =>
              !(
                msg.readBy || []
              ).includes(
                user._id
              )
          );

        setUnreadCount(
          unread.length
        );

      } catch (err) {

        console.log(err);

      }

    };

  loadMessages();

  const loadOrders = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const res = await axios.get(
      `https://konanshopping-production.up.railway.app/my-orders/${user._id}`
    );

    const orders = res.data;

    setPendingOrders(
      orders.filter(
        (o) => o.status === "En attente"
      ).length
    );

    setShippedOrders(
      orders.filter(
        (o) => o.status === "En livraison"
      ).length
    );

    setDeliveredOrders(
      orders.filter(
        (o) => o.status === "Livrée"
      ).length
    );

    setCancelledOrders(
      orders.filter(
        (o) => o.status === "Annulée"
      ).length
    );

  } catch (err) {

    console.log(err);

  }

};

loadOrders();

}, []);

  const quickActions = [
  {
    icon: <FaHeart />,
    title: "Favoris",
    path: "/favorites",
  },

  {
    icon: <FaBoxOpen />,
    title: "Commandes",
    path: "/my-orders",
  },

  {
    icon: <FaGift />,
    title: "Coupons",
    path: "/coupons",
  },

  {
    icon: <FaComments />,
    title: "Messages",
    path: "/messages",
  },
];

const orders = [
  {
    icon: <FaClock />,
    title: "En attente",
    count: pendingOrders,
    path: "/orders/pending",
  },

  {
    icon: <FaTruck />,
    title: "Expédiées",
    count: shippedOrders,
    path: "/orders/shipped",
  },

  {
    icon: <FaCheckCircle />,
    title: "Livrée",
    count: deliveredOrders,
    path: "/orders/delivered",
  },

  {
    icon: <FaTimesCircle />,
    title: "Annulées",
    count: cancelledOrders,
    path: "/orders/cancelled",
  },
];

const features = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Adresse",
    path: "/address",
  },

  {
    icon: <FaCreditCard />,
    title: "Paiement",
    path: "/payment",
  },

  {
    icon: <FaRobot />,
    title: "IA Shopping",
    path: "/ai",
  },

  {
    icon: <FaBullseye />,
    title: "Promotions",
    path: "/promotions",
  },
];

return (

  <div
    style={{
      minHeight: "100vh",

      background:
        "linear-gradient(to bottom,#eef2ff,#f8fafc)",

      paddingBottom: "110px",

      overflowX: "hidden",
    }}
  >

    {/* HEADER */}

    <div
      style={{
        background:
          "linear-gradient(135deg,#4f46e5,#7c3aed)",

        padding: "14px 16px 22px",

        borderBottomLeftRadius: "28px",

        borderBottomRightRadius: "28px",

        color: "white",

        boxShadow:
          "0 12px 30px rgba(79,70,229,0.25)",

        position: "relative",

        overflow: "hidden",
      }}
    >

      {/* Décoration */}

      <div
        style={{
          position: "absolute",

          top: "-40px",

          right: "-30px",

          width: "110px",

          height: "110px",

          borderRadius: "50%",

          background:
            "rgba(255,255,255,0.08)",
        }}
      />

      <div
        style={{
          position: "absolute",

          bottom: "-35px",

          left: "-25px",

          width: "85px",

          height: "85px",

          borderRadius: "50%",

          background:
            "rgba(255,255,255,0.05)",
        }}
      />

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          position: "relative",

          zIndex: 2,
        }}
      >

        <div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "10px",

    flex: 1,

    minWidth: 0,
  }}
>

<label
  onClick={(e) => {

    if (profileImage) {

      e.preventDefault();

      e.stopPropagation();

      setShowPhotoModal(
        true
      );

      return;
    }

  }}

  style={{
    cursor: "pointer",
    position: "relative",
    flexShrink: 0,
  }}
>

 <input
  ref={fileInputRef}

  id="profileInput"

  type="file"

  accept="image/*"

  style={{
    display: "none",
  }}

  onChange={(e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setProfileImage(
        reader.result
      );

      localStorage.setItem(
        "profileImage",
        reader.result
      );

    };

    reader.readAsDataURL(file);

  }}
/>

  <div
  style={{
    width: "58px",

    height: "58px",

    borderRadius: "50%",

    overflow: "hidden",

    background:
      "rgba(255,255,255,0.15)",

    display: "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    fontSize: "24px",

    border:
      "3px solid rgba(255,255,255,0.35)",

    boxShadow:
      "0 12px 30px rgba(0,0,0,0.18)",

    backdropFilter:
      "blur(10px)",
  }}
>

    {profileImage ? (

      <img
        src={profileImage}

        alt=""

        style={{
          width: "100%",

          height: "100%",

          objectFit: "cover",
        }}
      />

    ) : (

  <FaUserCircle
    style={{
      fontSize: "32px",

      color:
        "rgba(255,255,255,0.9)",
    }}
  />

)}

  </div>

</label>

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
      gap: "6px",
      marginBottom: "4px",
    }}
  >

    <h2
      style={{
        margin: 0,
        fontSize: "17px",
        fontWeight: "800",
        color: "#fff",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        letterSpacing: "-0.3px",
      }}
    >
      {user.name}
    </h2>

    <FaCheckCircle
      style={{
        color: "#22c55e",
        fontSize: "15px",
        flexShrink: 0,
        filter:
          "drop-shadow(0 2px 6px rgba(34,197,94,0.35))",
      }}
    />

  </div>

  <p
    style={{
      margin: 0,
      fontSize: "12px",
      color: "rgba(255,255,255,0.85)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontWeight: "500",
    }}
  >
    {user.email}
  </p>

</div>
</div>

<button
  onClick={() =>
    navigate("/message")
  }

  style={{
    position: "relative",

    border:
      "1px solid rgba(255,255,255,0.15)",

    background:
      "rgba(255,255,255,0.12)",

    backdropFilter:
      "blur(12px)",

    WebkitBackdropFilter:
      "blur(12px)",

    width: "38px",

    height: "38px",

    borderRadius: "12px",

    color: "#fff",

    cursor: "pointer",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.12)",

    flexShrink: 0,

    marginRight: "8px",

    transition:
      "all 0.25s ease",
  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-2px)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0)";

  }}
>

  <FaEnvelope
    style={{
      fontSize: "15px",
    }}
  />

  <span
    style={{
      position: "absolute",

      top: "-4px",

      right: "-4px",

      minWidth: "16px",

      height: "16px",

      borderRadius: "999px",

      background:
        "rgba(255,255,255,0.25)",

      backdropFilter:
        "blur(10px)",

      border:
        "1px solid rgba(255,255,255,0.25)",

      color: "#fff",

      fontSize: "9px",

      fontWeight: "700",

      display: "flex",

      justifyContent: "center",

      alignItems: "center",
    }}
  >
    {unreadCount}
  </span>

</button>

    <button
  onClick={() =>
    setShowLogoutModal(
      true
    )
  }

  style={{
    border: "1px solid rgba(255,255,255,0.15)",

    background:
      "rgba(255,255,255,0.12)",

    backdropFilter:
      "blur(12px)",

    WebkitBackdropFilter:
      "blur(12px)",

    width: "38px",

    height: "38px",

    borderRadius: "12px",

    color: "#fff",

    fontSize: "15px",

    cursor: "pointer",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.12)",

    flexShrink: 0,

    transition:
      "all 0.25s ease",
  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-2px)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0)";

  }}
>

  <i
    className="fa-solid fa-right-from-bracket"
    style={{
      fontSize: "15px",
    }}
  />

</button>
</div>
</div>

      {/* QUICK ACTIONS */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      "repeat(4,1fr)",

    gap: "10px",

    padding: "16px",

    marginTop: "-12px",
  }}
>

  {quickActions.map(
    (item, index) => (

      <div
        key={index}

        onClick={() =>
          navigate(item.path)
        }

        onTouchStart={(e) => {

          e.currentTarget.style.transform =
            "scale(0.97)";

        }}

        onTouchEnd={(e) => {

          e.currentTarget.style.transform =
            "scale(1)";

        }}

        style={{
          background:
            "rgba(255,255,255,0.95)",

          borderRadius: "20px",

          padding: "16px 10px",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent:
            "center",

          gap: "8px",

          cursor: "pointer",

          border:
            "1px solid rgba(99,102,241,0.08)",

          boxShadow:
            "0 10px 25px rgba(0,0,0,0.06)",

          backdropFilter:
            "blur(10px)",

          minHeight: "95px",

          transition:
            "all 0.25s ease",
        }}
      >

        <div
          style={{
            width: "42px",

            height: "42px",

            borderRadius: "14px",

            background:
              "linear-gradient(135deg,#ede9fe,#ddd6fe)",

            display: "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            fontSize: "18px",

            color: "#5b3cc4",

            boxShadow:
              "0 6px 15px rgba(91,60,196,0.15)",
          }}
        >
          {item.icon}
        </div>

        <span
          style={{
            fontSize: "12px",

            fontWeight: "700",

            color: "#111827",

            textAlign: "center",

            lineHeight: "1.3",
          }}
        >
          {item.title}
        </span>

      </div>

    )
  )}

</div>

{/* MES COMMANDES */}

<div
  style={{
    background:
      "rgba(255,255,255,0.95)",

    margin: "0 16px",

    borderRadius: "24px",

    padding: "18px",

    border:
      "1px solid rgba(99,102,241,0.08)",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",

    backdropFilter:
      "blur(10px)",
  }}
>

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: "18px",
    }}
  >

    <h2
      style={{
        margin: 0,

        fontSize: "18px",

        fontWeight: "800",

        color: "#111827",
      }}
    >
      Mes commandes
    </h2>

    <Link
      to="/my-orders"

      style={{
        textDecoration:
          "none",

        color: "#5b3cc4",

        fontWeight: "700",

        fontSize: "13px",
      }}
    >
      Voir tout
    </Link>

  </div>

  <div
    style={{
      display: "grid",

      gridTemplateColumns:
        "repeat(4,1fr)",

      gap: "10px",
    }}
  >

    {orders.map((item, index) => (

      <div
        key={index}

        onClick={() =>
          navigate(item.path)
        }

        onTouchStart={(e) => {

          e.currentTarget.style.transform =
            "scale(0.97)";

        }}

        onTouchEnd={(e) => {

          e.currentTarget.style.transform =
            "scale(1)";

        }}

        style={{
          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent:
            "center",

          gap: "8px",

          padding: "12px 6px",

          cursor: "pointer",

          borderRadius: "16px",

          transition:
            "all 0.25s ease",
        }}
      >

        <div
  style={{
    position: "relative",

    width: "42px",
    height: "42px",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg,#ede9fe,#ddd6fe)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "18px",

    color: "#5b3cc4",

    boxShadow:
      "0 6px 15px rgba(91,60,196,0.15)",
  }}
>

  {item.icon}

  <span
    style={{
      position: "absolute",

      top: "-5px",

      right: "-5px",

      minWidth: "18px",

      height: "18px",

      borderRadius: "999px",

      background:
        "rgba(255,255,255,0.25)",

      backdropFilter:
        "blur(10px)",

      WebkitBackdropFilter:
        "blur(10px)",

      border:
        "1px solid rgba(255,255,255,0.35)",

      color: "#5b3cc4",

      fontSize: "10px",

      fontWeight: "800",

      display: "flex",

      justifyContent: "center",

      alignItems: "center",

      boxShadow:
        "0 4px 10px rgba(91,60,196,0.15)",
    }}
  >
    {item.count}
  </span>

</div>

        <span
          style={{
            fontSize: "11px",

            color: "#4b5563",

            textAlign: "center",

            fontWeight: "600",

            lineHeight: "1.3",
          }}
        >
          {item.title}
        </span>

      </div>

    ))}

  </div>

</div>

    {/* IA SECTION */}

<div
  style={{
    margin: "16px",

    background:
      "linear-gradient(135deg,rgba(96,165,250,0.95),rgba(59,130,246,0.88))",

    backdropFilter:
      "blur(20px)",

    WebkitBackdropFilter:
      "blur(20px)",

    border:
      "1px solid rgba(255,255,255,0.25)",

    borderRadius: "22px",

    padding: "16px",

    color: "#fff",

    position: "relative",

    overflow: "hidden",

    boxShadow:
      "0 12px 30px rgba(59,130,246,0.20)",
  }}
>

  {/* Décoration */}

  <div
    style={{
      position: "absolute",

      top: "-35px",

      right: "-35px",

      width: "90px",

      height: "90px",

      borderRadius: "50%",

      background:
        "rgba(255,255,255,0.12)",
    }}
  />

  <div
    style={{
      position: "absolute",

      bottom: "-30px",

      left: "-30px",

      width: "70px",

      height: "70px",

      borderRadius: "50%",

      background:
        "rgba(255,255,255,0.08)",
    }}
  />

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "10px",

      marginBottom: "10px",

      position: "relative",

      zIndex: 2,
    }}
  >

    <div
      style={{
        width: "40px",

        height: "40px",

        borderRadius: "12px",

        background:
          "rgba(255,255,255,0.18)",

        display: "flex",

        justifyContent:
          "center",

        alignItems:
          "center",
      }}
    >

      <FaRobot
        style={{
          fontSize: "18px",
        }}
      />

    </div>

    <div>

      <h2
        style={{
          margin: 0,

          fontSize: "16px",

          fontWeight: "800",
        }}
      >
        IA Konan Shopping
      </h2>

      <span
        style={{
          fontSize: "11px",

          opacity: 0.9,
        }}
      >
        Assistant intelligent
      </span>

    </div>

  </div>

  <p
    style={{
      fontSize: "12px",

      lineHeight: "1.6",

      marginBottom: "14px",

      opacity: 0.95,

      position: "relative",

      zIndex: 2,
    }}
  >
    Découvrez des recommandations
    personnalisées selon vos goûts,
    vos recherches et vos achats.
  </p>

  <button
    onClick={() =>
      navigate("/ai")
    }

    style={{
      border: "none",

      background:
        "rgba(255,255,255,0.95)",

      color: "#2563eb",

      height: "40px",

      padding: "0 14px",

      borderRadius: "12px",

      fontWeight: "800",

      fontSize: "12px",

      cursor: "pointer",

      display: "flex",

      alignItems: "center",

      gap: "8px",

      position: "relative",

      zIndex: 2,

      boxShadow:
        "0 6px 15px rgba(255,255,255,0.20)",
    }}
  >

    <FaRobot />

    Explorer l'IA

    <FaArrowRight />

  </button>

</div>

      {/* FEATURES */}

<div
  style={{
    background:
      "rgba(255,255,255,0.95)",

    margin: "0 16px",

    borderRadius: "24px",

    padding: "18px",

    border:
      "1px solid rgba(99,102,241,0.08)",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",

    backdropFilter:
      "blur(10px)",
  }}
>

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      marginBottom: "18px",
    }}
  >

    <h2
      style={{
        margin: 0,

        fontSize: "18px",

        fontWeight: "800",

        color: "#111827",
      }}
    >
      Plus de fonctionnalités
    </h2>

  </div>

  <div
    style={{
      display: "grid",

      gridTemplateColumns:
        "repeat(4,1fr)",

      gap: "10px",
    }}
  >

    {features.map(
      (item, index) => (

        <div
          key={index}

          onClick={() =>
            navigate(item.path)
          }

          onTouchStart={(e) => {

            e.currentTarget.style.transform =
              "scale(0.97)";

          }}

          onTouchEnd={(e) => {

            e.currentTarget.style.transform =
              "scale(1)";

          }}

          style={{
            display: "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap: "8px",

            cursor: "pointer",

            padding: "12px 6px",

            borderRadius: "16px",

            transition:
              "all 0.25s ease",
          }}
        >

          <div
            style={{
              width: "42px",

              height: "42px",

              borderRadius: "14px",

              background:
                "linear-gradient(135deg,#dbeafe,#bfdbfe)",

              display: "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              fontSize: "18px",

              color: "#2563eb",

              boxShadow:
                "0 6px 15px rgba(37,99,235,0.15)",
            }}
          >
            {item.icon}
          </div>

          <span
            style={{
              fontSize: "11px",

              textAlign: "center",

              color: "#374151",

              fontWeight: "600",

              lineHeight: "1.3",
            }}
          >
            {item.title}
          </span>

        </div>

      )
    )}

  </div>

</div>

     {showPhotoModal && (

  <div
    onClick={() =>
      setShowPhotoModal(false)
    }

    style={{
      position: "fixed",
      inset: 0,

      background:
        "rgba(0,0,0,0.35)",

      backdropFilter:
        "blur(10px)",

      WebkitBackdropFilter:
        "blur(10px)",

      display: "flex",

      justifyContent:
        "center",

      alignItems:
        "center",

      zIndex: 9999,

      padding: "20px",
    }}
  >

    <div
      onClick={(e) =>
        e.stopPropagation()
      }

      style={{
        width: "82%",

        maxWidth: "260px",

        background:
          "rgba(255,255,255,0.95)",

        backdropFilter:
          "blur(20px)",

        WebkitBackdropFilter:
          "blur(20px)",

        border:
          "1px solid rgba(255,255,255,0.45)",

        borderRadius: "20px",

        padding: "16px 14px",

        textAlign: "center",

        boxShadow:
          "0 15px 40px rgba(0,0,0,0.15)",
      }}
    >

      <div
        style={{
          width: "50px",

          height: "50px",

          margin: "0 auto 12px",

          borderRadius: "50%",

          background:
            "rgba(79,70,229,0.12)",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",
        }}
      >

        <FaUserCircle
          style={{
            color: "#4f46e5",

            fontSize: "26px",
          }}
        />

      </div>

      <h3
        style={{
          margin: 0,

          fontSize: "16px",

          fontWeight: "800",

          color: "#0f172a",
        }}
      >
        Photo de profil
      </h3>

      <p
        style={{
          marginTop: "8px",

          marginBottom: "14px",

          fontSize: "12px",

          lineHeight: "1.5",

          color: "#374151",

          fontWeight: "500",
        }}
      >
        Gérez votre photo de profil
        Konan Shopping.
      </p>

      <button
        onClick={() => {

          fileInputRef.current?.click();

          setShowPhotoModal(
            false
          );

        }}

        style={{
          width: "100%",

          height: "40px",

          border: "none",

          borderRadius: "12px",

          background:
            "linear-gradient(135deg,#4f46e5,#4338ca)",

          color: "#fff",

          fontWeight: "700",

          fontSize: "12px",

          cursor: "pointer",

          marginBottom: "8px",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          gap: "6px",

          boxShadow:
            "0 8px 20px rgba(79,70,229,0.25)",
        }}
      >

        <FaCamera />

        Modifier la photo

      </button>

      <button
        onClick={() => {

          setProfileImage("");

          localStorage.removeItem(
            "profileImage"
          );

          setShowPhotoModal(
            false
          );

        }}

        style={{
          width: "100%",

          height: "40px",

          border: "none",

          borderRadius: "12px",

          background:
            "linear-gradient(135deg,#ef4444,#dc2626)",

          color: "#fff",

          fontWeight: "700",

          fontSize: "12px",

          cursor: "pointer",

          marginBottom: "8px",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          gap: "6px",

          boxShadow:
            "0 8px 20px rgba(239,68,68,0.25)",
        }}
      >

        <FaTrash />

        Supprimer la photo

      </button>

    </div>

  </div>

)}

{showLogoutModal && (

  <div
    onClick={() =>
      setShowLogoutModal(
        false
      )
    }

    style={{
      position: "fixed",
      inset: 0,

      background:
        "rgba(0,0,0,0.35)",

      backdropFilter:
        "blur(12px)",

      WebkitBackdropFilter:
        "blur(12px)",

      display: "flex",

      justifyContent:
        "center",

      alignItems:
        "center",

      zIndex: 9999,

      padding: "20px",
    }}
  >

    <div
      onClick={(e) =>
        e.stopPropagation()
      }

      style={{
        width: "88%",

        maxWidth: "290px",

        background:
          "rgba(255,255,255,0.92)",

        backdropFilter:
          "blur(25px)",

        WebkitBackdropFilter:
          "blur(25px)",

        border:
          "1px solid rgba(255,255,255,0.45)",

        borderRadius: "24px",

        padding: "20px 18px",

        textAlign: "center",

        boxShadow:
          "0 20px 50px rgba(0,0,0,0.18)",
      }}
    >

      <div
        style={{
          width: "58px",

          height: "58px",

          margin: "0 auto 14px",

          borderRadius: "50%",

          background:
            "rgba(239,68,68,0.12)",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",
        }}
      >

        <FaExclamationTriangle
          style={{
            color: "#ef4444",

            fontSize: "24px",
          }}
        />

      </div>

      <h3
        style={{
          margin: 0,

          fontSize: "18px",

          fontWeight: "800",

          color: "#0f172a",
        }}
      >
        Déconnexion
      </h3>

      <p
        style={{
          marginTop: "10px",

          fontSize: "13px",

          lineHeight: "1.6",

          color: "#374151",

          fontWeight: "500",
        }}
      >
        Voulez-vous vraiment vous
        déconnecter de votre compte
        Konan Shopping ?
      </p>

      <div
        style={{
          display: "flex",

          gap: "10px",

          marginTop: "18px",
        }}
      >

        <button
          onClick={() =>
            setShowLogoutModal(
              false
            )
          }

          style={{
            flex: 1,

            height: "42px",

            border:
              "1px solid #e5e7eb",

            borderRadius: "14px",

            background:
              "#ffffff",

            color: "#111827",

            fontWeight: "700",

            fontSize: "13px",

            cursor: "pointer",

            display: "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            gap: "6px",
          }}
        >

          <FaTimes />

          Non

        </button>

        <button
          onClick={() => {

            localStorage.removeItem(
              "user"
            );

            localStorage.removeItem(
              "token"
            );

            navigate("/");

          }}

          style={{
            flex: 1,

            height: "42px",

            border: "none",

            borderRadius: "14px",

            background:
              "linear-gradient(135deg,#ef4444,#dc2626)",

            color: "#fff",

            fontWeight: "700",

            fontSize: "13px",

            cursor: "pointer",

            display: "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            gap: "6px",

            boxShadow:
              "0 8px 20px rgba(239,68,68,0.25)",
          }}
        >

          <FaSignOutAlt />

          Oui

        </button>

      </div>

    </div>

  </div>

)}

    </div>

  );

}

export default Account;