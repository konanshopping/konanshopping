import { useEffect, useState } from "react";
import axios from "axios";

export default function ShippedOrders() {

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
              "En livraison"

        );

      setOrders(filtered);

    }

    catch(err){

      console.log(err);

    }

  };

  fetchOrders();

}, []);

  return (

    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "18px",
      }}
    >

      {/* HEADER */}

      <div
  style={{
    background:
      "linear-gradient(135deg,#3b82f6,#2563eb)",

    padding:
      window.innerWidth < 768
        ? "22px"
        : "28px",

    borderRadius: "24px",

    color: "white",

    marginBottom: "25px",

    position: "relative",

    overflow: "hidden",

    boxShadow:
      "0 12px 30px rgba(37,99,235,0.18)",
  }}
>

  {/* GLOW */}

  <div
    style={{
      position: "absolute",

      top: "-90px",

      right: "-90px",

      width: "180px",

      height: "180px",

      borderRadius: "50%",

      background:
        "rgba(255,255,255,0.07)",
    }}
  />

  {/* CONTENT */}

  <div
    style={{
      position: "relative",

      zIndex: 2,

      display: "flex",

      alignItems: "center",

      gap: "14px",
    }}
  >

    {/* ICON */}

    <div
      style={{
        width: "58px",

        height: "58px",

        borderRadius: "18px",

        background:
          "rgba(255,255,255,0.12)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        backdropFilter: "blur(10px)",
      }}
    >

      <i
        className="fa-solid fa-truck-fast"
        style={{
          fontSize: "24px",

          color: "white",
        }}
      ></i>

    </div>

    {/* TEXT */}

    <div>

      <h1
        style={{
          margin: 0,

          fontSize:
            window.innerWidth < 768
              ? "24px"
              : "30px",

          fontWeight: "800",

          letterSpacing: "-0.5px",
        }}
      >
        Commandes expédiées
      </h1>

      <p
        style={{
          marginTop: "6px",

          fontSize: "14px",

          opacity: 0.9,

          lineHeight: "24px",
        }}
      >
        Consultez toutes vos commandes
        déjà envoyées.
      </p>

    </div>

  </div>

</div>

{/* AUCUNE COMMANDE */}

{orders.length === 0 && (

  <div
    style={{
      background: "white",

      padding:
        window.innerWidth < 768
          ? "45px 20px"
          : "55px 30px",

      borderRadius: "24px",

      textAlign: "center",

      boxShadow:
        "0 8px 25px rgba(0,0,0,0.05)",
    }}
  >

    {/* ICON */}

    <div
      style={{
        width: "95px",

        height: "95px",

        margin: "0 auto 22px auto",

        borderRadius: "50%",

        background:
          "linear-gradient(135deg,#DBEAFE,#BFDBFE)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",
      }}
    >

      <i
        className="fa-solid fa-box-open"
        style={{
          fontSize: "42px",

          color: "#2563eb",
        }}
      ></i>

    </div>

    {/* TITLE */}

    <h2
      style={{
        marginTop: "10px",

        fontSize: "24px",

        fontWeight: "700",

        color: "#111827",
      }}
    >
      Aucune commande expédiée
    </h2>

    {/* TEXT */}

    <p
      style={{
        color: "#6b7280",

        marginTop: "10px",

        fontSize: "15px",

        lineHeight: "28px",

        maxWidth: "420px",

        marginLeft: "auto",

        marginRight: "auto",
      }}
    >
      Vos commandes expédiées
      apparaîtront ici dès
      leur envoi.
    </p>

  </div>

)}

      {/* COMMANDES */}

      {orders.map((order) => (

        <div
          key={order._id}

          style={{
            background: "white",
            borderRadius: "20px",
            padding: "18px",
            marginBottom: "18px",

            boxShadow:
              "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >

          {/* TOP */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",

              alignItems: "center",

              marginBottom: "15px",
            }}
          >

            <div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  color: "#111827",
                }}
              >
                {order.customerName}
              </h2>

              <p
                style={{
                  marginTop: "4px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                {order.phone}
              </p>

            </div>

            <div
              style={{
                background: "#dbeafe",
                color: "#2563eb",

                padding:
                  "8px 14px",

                borderRadius: "50px",

                fontSize: "13px",

                fontWeight: "600",
              }}
            >
              Expédiée
            </div>

          </div>

          {/* PRODUITS */}

          {order.items.map(
            (item, index) => (

              <div
                key={index}

                style={{
                  display: "flex",
                  gap: "14px",

                  background: "#f9fafb",

                  padding: "12px",

                  borderRadius: "15px",

                  marginBottom: "12px",
                }}
              >

                <img
                  src={item.image}

                  alt=""

                  style={{
                    width: "75px",
                    height: "75px",

                    borderRadius: "12px",

                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    flex: 1,
                  }}
                >

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: "#111827",
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      marginTop: "5px",
                    }}
                  >
                    Quantité :
                    {item.quantity}
                  </p>

                  <h2
                    style={{
                      color: "#2563eb",
                      marginTop: "5px",
                      fontSize: "18px",
                    }}
                  >
                    {item.price} FCFA
                  </h2>

                </div>

              </div>

            )
          )}

          {/* FOOTER */}

          <div
            style={{
              marginTop: "10px",

              borderTop:
                "1px solid #e5e7eb",

              paddingTop: "12px",

              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",
            }}
          >

            <div
              style={{
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              📍 {order.city}
            </div>

            <h2
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "20px",
              }}
            >
              {order.total} FCFA
            </h2>

          </div>

        </div>

      ))}

    </div>

  );

}