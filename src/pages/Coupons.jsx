import { useState } from "react";

import { FaGift } from "react-icons/fa";

import {
  FaTag,
  FaBullseye,
  FaClock,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

function Coupons() {

  const [copied, setCopied] =
    useState("");

  // USER

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  // REGISTER DATE

  const registerDate =
    user.registerDate ||
    Date.now();

  // TIME

  const oneDay =
    24 * 60 * 60 * 1000;

  const sevenDays =
    7 * oneDay;

  const thirtyDays =
    30 * oneDay;

  // COUPONS

  const coupons = [

    {
      code: "KONAN10",

      discount: "10% OFF",

      description:
        "Réduction sur tous les produits",

      condition:
        "Dès 20 000 FCFA",

      expire:
        new Date(
          registerDate +
            sevenDays
        ).toLocaleDateString(),

      color:
        "linear-gradient(135deg,#7c3aed,#4f46e5)",
    },

    {
      code: "LIVRAISON",

      discount:
        "Livraison gratuite",

      description:
        "Livraison offerte au Cameroun",

      condition:
        "24h après inscription",

      expire:
        new Date(
          registerDate +
            oneDay
        ).toLocaleDateString(),

      color:
        "linear-gradient(135deg,#ec4899,#db2777)",
    },

    {
      code: "WELCOME20",

      discount: "20% OFF",

      description:
        "Réduction nouveaux clients",

      condition:
        "1ère commande uniquement",

      expire:
        new Date(
          registerDate +
            sevenDays
        ).toLocaleDateString(),

      color:
        "linear-gradient(135deg,#f59e0b,#ea580c)",
    },

    {
      code: "VIP50",

      discount:
        "5000 FCFA",

      description:
        "Réduction achats premium",

      condition:
        "Clients VIP seulement",

      expire:
        new Date(
          registerDate +
            thirtyDays
        ).toLocaleDateString(),

      color:
        "linear-gradient(135deg,#10b981,#059669)",
    },

  ];

  // COPY

  const copyCoupon = (
    code
  ) => {

    navigator.clipboard.writeText(
      code
    );

    setCopied(code);

    setTimeout(() => {

      setCopied("");

    }, 2000);

  };

  return (

    <div
      style={{
        minHeight: "100vh",

        background: "#f5f7ff",

        padding: "12px",
      }}
    >

     {/* HEADER PREMIUM */}

<div
  style={{
    background:
      "linear-gradient(135deg,#FFFFFF,#F8FAFC)",

    border: "1px solid #E5E7EB",

    borderRadius: "22px",

    padding:
      window.innerWidth < 768
        ? "16px"
        : "24px",

    display: "flex",

    alignItems: "center",

    gap:
      window.innerWidth < 768
        ? "16px"
        : "24px",

    marginBottom: "28px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  }}
>

  {/* ICON */}

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "60px"
          : "78px",

      height:
        window.innerWidth < 768
          ? "60px"
          : "78px",

      borderRadius: "22px",

      background:
        "linear-gradient(135deg,#2563EB,#1D4ED8)",

      display: "flex",

      justifyContent: "center",

      alignItems: "center",

      flexShrink: 0,

      boxShadow:
        "0 12px 28px rgba(37,99,235,0.25)",
    }}
  >
    <FaGift
      style={{
        color: "#FFFFFF",

        fontSize:
          window.innerWidth < 768
            ? "32px"
            : "40px",
      }}
    />
  </div>

  {/* CONTENT */}

  <div
    style={{
      flex: 1,
    }}
  >

    <div
      style={{
        display: "inline-flex",

        alignItems: "center",

        gap: "6px",

        background: "#EEF2FF",

        color: "#2563EB",

        padding: "6px 12px",

        borderRadius: "999px",

        fontSize: "12px",

        fontWeight: "800",

        marginBottom: "10px",
      }}
    >
      OFFRES EXCLUSIVES
    </div>

    <h1
      style={{
        fontSize:
          window.innerWidth < 768
            ? "26px"
            : "38px",

        fontWeight: "900",

        color: "#111827",

        margin: 0,

        lineHeight: 1.1,
      }}
    >
      Coupons Konan
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

        lineHeight: "1.6",
      }}
    >
      Profitez de réductions exclusives,
      livraisons gratuites et avantages
      réservés aux clients Konan Shopping.
    </p>

  </div>

</div>

{/* COUPONS */}

<div
  style={{
    display: "grid",

    gap: "18px",

    marginTop: "10px",
  }}
>

  {coupons.map(
    (coupon, index) => (

      <div
        key={index}

        style={{
          background:
            coupon.color,

          borderRadius: "20px",

          padding:
            window.innerWidth < 768
              ? "16px"
              : "20px",

          color: "#FFFFFF",

          position: "relative",

          overflow: "hidden",

          border:
            "1px solid rgba(255,255,255,0.15)",

          boxShadow:
            "0 12px 30px rgba(0,0,0,0.10)",

          minHeight:
            window.innerWidth < 768
              ? "180px"
              : "210px",
        }}
      >

        {/* DECORATION */}

        <div
          style={{
            position: "absolute",

            top: "-50px",

            right: "-50px",

            width: "150px",

            height: "150px",

            borderRadius: "50%",

            background:
              "rgba(255,255,255,0.10)",
          }}
        />

        <div
          style={{
            position: "absolute",

            bottom: "-40px",

            left: "-40px",

            width: "120px",

            height: "120px",

            borderRadius: "50%",

            background:
              "rgba(255,255,255,0.08)",
          }}
        />

        {/* BADGE */}

        <div
          style={{
            position: "absolute",

            top: "16px",

            right: "16px",

            background:
              "rgba(255,255,255,0.15)",

            backdropFilter:
              "blur(10px)",

            padding: "8px 12px",

            borderRadius: "999px",

            fontSize: "11px",

            fontWeight: "800",
          }}
        >
          <FaGift />
{" "}Coupon Premium
        </div>

        {/* CONTENT */}

        <div
          style={{
            position: "relative",

            zIndex: 2,
          }}
        >

          {/* REDUCTION */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "10px",

              marginBottom: "10px",
            }}
          >

            <FaTag
              style={{
                fontSize:
                  window.innerWidth < 768
                    ? "20px"
                    : "24px",
              }}
            />

            <h2
              style={{
                margin: 0,

                fontSize:
                  window.innerWidth < 768
                    ? "24px"
                    : "30px",

                fontWeight: "900",

                lineHeight: 1,
              }}
            >
              {coupon.discount}
            </h2>

          </div>

          {/* DESCRIPTION */}

          <p
            style={{
              opacity: 0.95,

              marginBottom: "12px",

              fontSize:
                window.innerWidth < 768
                  ? "13px"
                  : "15px",

              lineHeight: "1.5",
            }}
          >
            {coupon.description}
          </p>

       

          {/* CONDITION */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "8px",

              marginBottom: "8px",

              fontSize: "13px",

              fontWeight: "600",
            }}
          >

            <FaBullseye />

            {coupon.condition}

          </div>

          {/* EXPIRATION */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "8px",

              marginBottom: "14px",

              fontSize: "12px",

              opacity: 0.9,
            }}
          >

            <FaClock />

            Expire le {coupon.expire}

          </div>

          {/* CODE */}

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              gap: "10px",

              background:
                "rgba(255,255,255,0.15)",

              backdropFilter:
                "blur(12px)",

              padding: "10px 12px",

              borderRadius: "12px",
            }}
          >

            <div>

              <p
                style={{
                  margin: 0,

                  fontSize: "11px",

                  opacity: 0.8,
                }}
              >
                CODE PROMO
              </p>

              <h3
                style={{
                  margin: 0,

                  marginTop: "4px",

                  fontSize:
                    window.innerWidth < 768
                      ? "16px"
                      : "20px",

                  fontWeight: "900",

                  letterSpacing: "1px",
                }}
              >
                {coupon.code}
              </h3>

            </div>

            <button
              onClick={() =>
                copyCoupon(
                  coupon.code
                )
              }

              style={{
                border: "none",

                background: "#FFFFFF",

                color: "#111827",

                padding:
                  window.innerWidth < 768
                    ? "8px 12px"
                    : "10px 14px",

                borderRadius: "12px",

                fontWeight: "800",

                fontSize: "12px",

                cursor: "pointer",

                display: "flex",

                alignItems: "center",

                gap: "6px",

                minWidth: "80px",

                justifyContent:
                  "center",

                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >

              {copied ===
              coupon.code ? (
                <>
                  <FaCheck />
                  Copié
                </>
              ) : (
                <>
                  <FaCopy />
                  Copier
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    )
  )}

</div>

      </div>

   

  );

}

export default Coupons;