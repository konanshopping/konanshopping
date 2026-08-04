import { useState, useEffect } from "react";
import axios from "axios";

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

const [coupons, setCoupons] = useState([]);

  // USER

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

    console.log(user);
console.log("registerDate =", user.registerDate);
console.log("createdAt =", user.createdAt);

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


  // COPY

 const copyCoupon = async (code) => {

  try {

    if (navigator.clipboard && window.isSecureContext) {

      await navigator.clipboard.writeText(code);

    } else {

const input = document.createElement("textarea");

      input.value = code;

      document.body.appendChild(input);

      input.select();

      document.execCommand("copy");

      document.body.removeChild(input);

    }

    setCopied(code);

    setTimeout(() => {

      setCopied("");

    }, 2000);

  } catch (error) {

    console.error(error);

    alert("Impossible de copier le code.");

  }

};

useEffect(() => {
  axios
    .get("https://konanshopping.com/api/coupons")
    .then((res) => {

      console.log("Coupons MongoDB :", res.data);

      const data = res.data.map((coupon) => {

        const expireTime =
          new Date(registerDate).getTime() +
          (coupon.days || 7) * 24 * 60 * 60 * 1000;

        return {
          ...coupon,
          expire: new Date(expireTime),
          expired: Date.now() >= expireTime,
          used: (user.usedCoupons || []).includes(coupon.code),
        };

      });

      setCoupons(data);

    })
    .catch((err) => {
      console.log(err);
    });

}, [registerDate, user]);

const getRemainingText = (expireDate) => {

  const now = new Date();

  const end = expireDate;

  const diff = end - now;

  if (diff <= 0) return "Expiré";

  const days = Math.ceil(
    diff / (1000 * 60 * 60 * 24)
  );

  if (days === 1)
    return "Expire demain";

  if (days === 0)
    return "Expire aujourd'hui";

  return `Expire dans ${days} jours`;

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

    background: coupon.used
      ? "#374151"
      : coupon.expired
      ? "#DC2626"
      : "#16A34A",

    color: "#fff",

    padding: "8px 12px",

    borderRadius: "999px",

    fontSize: "11px",

    fontWeight: "800",

    display: "flex",

    alignItems: "center",

    gap: "6px",
  }}
>
  {coupon.used ? (
    <>
      <FaCheck />
      Déjà utilisé
    </>
  ) : coupon.expired ? (
    <>
      <FaClock />
      Expiré
    </>
  ) : (
    <>
      <FaGift />
      Disponible
    </>
  )}
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

              color: coupon.expired
  ? "#FCA5A5"
  : "#FFFFFF",

fontWeight: "700",
            }}
          >

            <FaClock />

            {getRemainingText(coupon.expire)}

          </div>

<div
  style={{
    marginTop: "10px",
  }}
>
  <div
    style={{
      height: "6px",
      borderRadius: "999px",
      background: "rgba(255,255,255,.25)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${Math.max(
          0,
          Math.min(
            100,
            (() => {

              const total =
                coupon.code === "LIVRAISON"
                  ? 1
                  : coupon.code === "VIP50"
                  ? 30
                  : 7;

              const expire =
                new Date(coupon.expire);

              const remaining =
                Math.ceil(
                  (expire - new Date()) /
                  (1000 * 60 * 60 * 24)
                );

              return (remaining / total) * 100;

            })()
          )
        )}%`,

        height: "100%",

        borderRadius: "999px",

        background:
          coupon.expired
            ? "#ef4444"
            : "#22c55e",

        transition: ".5s",
      }}
    />
  </div>
</div>

{/* CODE */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
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

  {coupon.used ? (

    <div
      style={{
        background: "#374151",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "12px",
        fontWeight: "800",
        fontSize: "12px",
      }}
    >
      ✓ Déjà utilisé
    </div>

  ) : coupon.expired ? (

    <div
      style={{
        background: "#DC2626",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "12px",
        fontWeight: "800",
        fontSize: "12px",
      }}
    >
      Expiré
    </div>

  ) : (

    <button
      onClick={() => copyCoupon(coupon.code)}
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
        justifyContent: "center",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      {copied === coupon.code ? (
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

  )}

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