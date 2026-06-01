import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

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
} from "react-icons/fa";

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
    path: "/orders/pending",
  },

  {
    icon: <FaTruck />,
    title: "Expédiées",
    path: "/orders/shipped",
  },

  {
    icon: <FaCheckCircle />,
    title: "Livrées",
    path: "/orders/delivered",
  },

  {
    icon: <FaTimesCircle />,
    title: "Annulées",
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

        background: "#f5f7ff",

        paddingBottom: "110px",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#4f46e5,#7c3aed)",

          padding: "22px 16px",

          borderBottomLeftRadius: "24px",

          borderBottomRightRadius: "24px",

          color: "white",

          boxShadow:
            "0 10px 30px rgba(79,70,229,0.25)",
        }}
      >

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",
          }}
        >

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "14px",
            }}
          >

          <label
  style={{
    cursor: "pointer",
  }}
>

  <input
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
        "rgba(255,255,255,0.2)",

      display: "flex",

      justifyContent:
        "center",

      alignItems: "center",

      fontSize: "26px",

      border:
        "2px solid rgba(255,255,255,0.4)",
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
      "👤"
    )}

  </div>

</label>

            <div>

              <h2
                style={{
                  margin: 0,

                  fontSize: "20px",

                  fontWeight: "800",
                }}
              >
                {user.name}
              </h2>

              <p
                style={{
                  marginTop: "4px",

                  opacity: 0.9,

                  fontSize: "13px",
                }}
              >
                {user.email}
              </p>

            </div>

          </div>

     <button
  onClick={() => {

    const confirmLogout =
      window.confirm(
        "Voulez-vous vous déconnecter ?"
      );

    // SI OUI
    if (confirmLogout) {

      // SUPPRIME UNIQUEMENT USER

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      // REDIRECTION

      navigate("/");

    }

    // SI NON
    else {

      return;

    }

  }}

  style={{
    border: "none",

    background:
      "linear-gradient(135deg,#EF4444,#DC2626)",

    width: "42px",

    height: "42px",

    borderRadius: "14px",

    color: "white",

    fontSize: "18px",

    cursor: "pointer",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    boxShadow:
      "0 8px 20px rgba(239,68,68,0.35)",

    transition: "0.3s",
  }}

  onMouseEnter={(e) => {

    e.target.style.transform =
      "scale(1.08)";

  }}

  onMouseLeave={(e) => {

    e.target.style.transform =
      "scale(1)";

  }}
>

  <i className="fa-solid fa-right-from-bracket"></i>

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

              style={{
                background: "white",

                borderRadius: "18px",

                padding: "14px",

                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                justifyContent:
                  "center",

                gap: "10px",

                cursor: "pointer",

                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.04)",

                transition: "0.3s",
              }}
            >

              <div
  style={{
    fontSize: "20px",
    color: "#5b3cc4",
    marginBottom: "8px",
  }}
>
  {item.icon}
</div>

              <span
                style={{
                  fontSize: "14px",

                  fontWeight: "700",

                  color: "#111827",

                  textAlign: "center",
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
          background: "white",

          margin: "0 16px",

          borderRadius: "20px",

          padding: "16px",

          boxShadow:
            "0 6px 20px rgba(0,0,0,0.04)",
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

              fontSize: "22px",

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

              color: "#6d28d9",

              fontWeight: "700",

              fontSize: "14px",
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

            gap: "12px",
          }}
        >

          {orders.map((item, index) => (
  <div
    key={index}
    onClick={() => navigate(item.path)}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      padding: "12px",
      cursor: "pointer",
    }}
  >

                <div
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {item.icon}
                </div>

                <span
                  style={{
                    fontSize: "12px",

                    color: "#6b7280",

                    textAlign: "center",
                  }}
                >
                  {item.title}
                </span>

              </div>

            )
          )}

        </div>

      </div>

      {/* IA SECTION */}

      <div
        style={{
          margin: "18px 16px",

          background:
            "linear-gradient(135deg,#6d28d9,#4f46e5)",

          borderRadius: "20px",

          padding: "18px",

          color: "white",

          boxShadow:
            "0 10px 30px rgba(109,40,217,0.25)",
        }}
      >

        <h2
          style={{
            margin: 0,

            fontSize: "18px",

            marginBottom: "10px",
          }}
        >
          ✨ IA Konan Shopping
        </h2>

        <p
          style={{
            opacity: 0.9,

            lineHeight: "1.5",

            fontSize: "14px",

            marginBottom: "18px",
          }}
        >
          Découvrez des recommandations
          intelligentes adaptées à vos
          goûts et vos achats.
        </p>

        <button
          onClick={() =>
            navigate("/ai")
          }

          style={{
            border: "none",

            background: "white",

            color: "#4f46e5",

            padding: "10px 16px",

            borderRadius: "14px",

            fontWeight: "800",

            cursor: "pointer",
          }}
        >
          Explorer l'IA
        </button>

      </div>

      {/* FEATURES */}

      <div
        style={{
          background: "white",

          margin: "0 16px",

          borderRadius: "20px",

          padding: "16px",

          boxShadow:
            "0 6px 20px rgba(0,0,0,0.04)",
        }}
      >

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: "20px",
          }}
        >

          <h2
            style={{
              margin: 0,

              fontSize: "22px",

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

            gap: "12px",
          }}
        >

          {features.map(
            (item, index) => (

              <div
                key={index}

                onClick={() =>
                  navigate(item.path)
                }

                style={{
                  display: "flex",

                  flexDirection:
                    "column",

                  alignItems:
                    "center",

                  gap: "10px",

                  cursor: "pointer",

                  padding: "12px",

                  borderRadius: "16px",

                  transition: "0.3s",
                }}
              >

                <div
                  style={{
                    fontSize: "24px",
                  }}
                >
                  {item.icon}
                </div>

                <span
                  style={{
                    fontSize: "12px",

                    textAlign: "center",

                    color: "#111827",

                    fontWeight: "600",
                  }}
                >
                  {item.title}
                </span>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}

export default Account;