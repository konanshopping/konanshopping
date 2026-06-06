import { useEffect, useState } from "react";
import axios from "axios";

export default function DeliveredOrders() {

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
              "Livrée"

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
      "linear-gradient(135deg,#22c55e,#16a34a)",

    padding:
      window.innerWidth < 768
        ? "20px"
        : "24px",

    borderRadius: "22px",

    color: "white",

    marginBottom: "22px",

    position: "relative",

    overflow: "hidden",

    boxShadow:
      "0 10px 25px rgba(34,197,94,0.16)",
  }}
>

  {/* GLOW */}

  <div
    style={{
      position: "absolute",

      top: "-70px",

      right: "-70px",

      width: "150px",

      height: "150px",

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

      display: "flex",

      alignItems: "center",

      gap: "12px",
    }}
  >

    {/* ICON */}

    <div
      style={{
        width: "52px",

        height: "52px",

        borderRadius: "16px",

        background:
          "rgba(255,255,255,0.12)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        backdropFilter: "blur(8px)",
      }}
    >

      <i
        className="fa-solid fa-circle-check"
        style={{
          fontSize: "22px",

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
              ? "22px"
              : "27px",

          fontWeight: "800",

          letterSpacing: "-0.4px",
        }}
      >
        Commandes livrées
      </h1>

      <p
        style={{
          marginTop: "5px",

          fontSize: "13px",

          opacity: 0.9,

          lineHeight: "22px",
        }}
      >
        Toutes vos commandes
        déjà reçues avec succès.
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
          ? "40px 18px"
          : "48px 26px",

      borderRadius: "22px",

      textAlign: "center",

      boxShadow:
        "0 6px 20px rgba(0,0,0,0.04)",
    }}
  >

    {/* ICON */}

    <div
      style={{
        width: "82px",

        height: "82px",

        margin: "0 auto 20px auto",

        borderRadius: "50%",

        background:
          "linear-gradient(135deg,#DCFCE7,#BBF7D0)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",
      }}
    >

      <i
        className="fa-solid fa-box-open"
        style={{
          fontSize: "34px",

          color: "#16a34a",
        }}
      ></i>

    </div>

    {/* TITLE */}

    <h2
      style={{
        marginTop: "8px",

        fontSize: "22px",

        fontWeight: "700",

        color: "#111827",
      }}
    >
      Aucune commande livrée
    </h2>

    {/* TEXT */}

    <p
      style={{
        color: "#6b7280",

        marginTop: "8px",

        fontSize: "14px",

        lineHeight: "25px",

        maxWidth: "360px",

        marginLeft: "auto",

        marginRight: "auto",
      }}
    >
      Vos commandes livrées
      apparaîtront ici après
      réception.
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
                background: "#dcfce7",
                color: "#16a34a",

                padding:
"8px 14px",

                borderRadius: "50px",

                fontSize: "13px",

                fontWeight: "600",
              }}
            >
              Livrée
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
                      color: "#16a34a",
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