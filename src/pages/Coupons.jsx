import { useState } from "react";

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

      {/* HEADER */}

      <div
        style={{
          marginBottom: "14px",
        }}
      >

        <h1
          style={{
            color: "#111827",

            marginBottom: "2px",

            fontSize: "21px",

            fontWeight: "800",
          }}
        >
          🎁 Coupons Konan
        </h1>

        <p
          style={{
            color: "#6b7280",

            fontSize: "12px",

            margin: 0,
          }}
        >
          Réductions exclusives
          disponibles
        </p>

      </div>

      {/* COUPONS */}

      <div
        style={{
          display: "grid",

          gap: "12px",
        }}
      >

        {coupons.map(
          (coupon, index) => (

            <div
              key={index}

              style={{
                background:
                  coupon.color,

                borderRadius: "18px",

                padding: "14px",

                color: "white",

                position: "relative",

                overflow: "hidden",

                boxShadow:
                  "0 4px 14px rgba(0,0,0,0.08)",
              }}
            >

              {/* PREMIUM CIRCLES */}

              <div
                style={{
                  position: "absolute",

                  top: "-30px",

                  right: "-30px",

                  width: "70px",

                  height: "70px",

                  borderRadius: "50%",

                  background:
                    "rgba(255,255,255,0.08)",
                }}
              />

              <div
                style={{
                  position: "absolute",

                  bottom: "-20px",

                  left: "-20px",

                  width: "55px",

                  height: "55px",

                  borderRadius: "50%",

                  background:
                    "rgba(255,255,255,0.06)",
                }}
              />

              {/* CONTENT */}

              <div
                style={{
                  position: "relative",

                  zIndex: 2,
                }}
              >

                {/* DISCOUNT */}

                <h2
                  style={{
                    margin: 0,

                    fontSize: "20px",

                    fontWeight: "900",

                    marginBottom: "5px",
                  }}
                >
                  {coupon.discount}
                </h2>

                {/* DESCRIPTION */}

                <p
                  style={{
                    opacity: 0.95,

                    marginBottom: "8px",

                    fontSize: "12px",

                    lineHeight: "1.3",
                  }}
                >
                  {coupon.description}
                </p>

                {/* CONDITION */}

                <p
                  style={{
                    margin: 0,

                    fontSize: "11px",

                    opacity: 0.9,

                    marginBottom: "3px",
                  }}
                >
                  🎯 {coupon.condition}
                </p>

                {/* EXPIRE */}

                <p
                  style={{
                    margin: 0,

                    fontSize: "10px",

                    opacity: 0.85,

                    marginBottom: "10px",
                  }}
                >
                  ⏳ Expire le :
                  {" "}
                  {coupon.expire}
                </p>

                {/* CODE BOX */}

                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    alignItems: "center",

                    gap: "8px",

                    background:
                      "rgba(255,255,255,0.14)",

                    padding: "8px 10px",

                    borderRadius: "12px",

                    backdropFilter:
                      "blur(10px)",
                  }}
                >

                  <div>

                    <p
                      style={{
                        margin: 0,

                        fontSize: "9px",

                        opacity: 0.8,
                      }}
                    >
                      CODE
                    </p>

                    <h3
                      style={{
                        margin: 0,

                        marginTop: "2px",

                        letterSpacing: "1px",

                        fontSize: "14px",

                        fontWeight: "800",
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

                      background: "white",

                      color: "#111827",

                      padding:
                        "8px 12px",

                      borderRadius: "10px",

                      fontWeight: "800",

                      fontSize: "11px",

                      cursor: "pointer",

                      minWidth: "72px",
                    }}
                  >

                    {copied ===
                    coupon.code
                      ? "Copié ✅"
                      : "Copier"}

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