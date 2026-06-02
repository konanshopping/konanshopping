import { useEffect, useState } from "react";
import axios from "axios";

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

        `https://konanshopping.onrender.com/my-orders/${user._id}`

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
      "linear-gradient(135deg,#2563eb,#4f46e5,#7c3aed)",

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
      "0 12px 30px rgba(79,70,229,0.18)",
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
        className="fa-solid fa-hourglass-half"
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
        Commandes en attente
      </h1>

      <p
        style={{
          marginTop: "6px",

          fontSize: "14px",

          opacity: 0.9,

          lineHeight: "24px",
        }}
      >
        Consultez vos commandes
        en cours de traitement.
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
          "linear-gradient(135deg,#EEF2FF,#E0E7FF)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",
      }}
    >

      <i
        className="fa-solid fa-box-open"
        style={{
          fontSize: "42px",

          color: "#4f46e5",
        }}
      ></i>

    </div>

    {/* TITLE */}

    <h2
      style={{
        color: "#111827",

        fontSize: "24px",

        fontWeight: "700",

        marginBottom: "10px",
      }}
    >
      Aucune commande
    </h2>

    {/* TEXT */}

    <p
      style={{
        color: "#6b7280",

        fontSize: "15px",

        lineHeight: "28px",

        maxWidth: "420px",

        margin: "0 auto",
      }}
    >
      Vous n’avez actuellement
      aucune commande en attente.
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
    background: "white",

    borderRadius: "25px",

    padding: "20px",

    marginBottom: "25px",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.06)",

    cursor: "pointer",

    transition: "0.3s",
  }}
>

          {/* TOP */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >

            <div>

              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "24px",
                }}
              >
                Commande
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  marginTop: "5px",
                }}
              >
                {order._id}
              </p>

            </div>

            <div
              style={{
                background: "#fef3c7",

                color: "#92400e",

                padding: "10px 18px",

                borderRadius: "999px",

                fontWeight: "bold",

                fontSize: "14px",
              }}
            >
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

                  alignItems: "center",

                  border:
                    "1px solid #eee",

                  borderRadius: "18px",

                  padding: "15px",

                  marginBottom: "15px",
                }}
              >

                {/* LEFT */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >

                  <img
                    src={item.image}

                    alt={item.name}

                    style={{
                      width: "85px",

                      height: "85px",

                      objectFit:
                        "cover",

                      borderRadius:
                        "15px",
                    }}
                  />

                  <div>

                    <h3
                      style={{
                        margin: 0,
                        color: "#111827",
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        marginTop: "8px",
                        color: "#6b7280",
                      }}
                    >
                      Quantité :
                      {" "}
                      {item.quantity || 1}
                    </p>

                  </div>

                </div>

                {/* RIGHT */}

                <h2
                  style={{
                    color: "#4f46e5",
                    fontSize: "22px",
                  }}
                >
                  {item.price}
                  {" "}
                  FCFA
                </h2>

              </div>

            )
          )}

          {/* FOOTER */}

          <div
            style={{
              borderTop:
                "1px solid #eee",

              paddingTop: "20px",

              marginTop: "10px",

              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",
            }}
          >

            <strong
              style={{
                fontSize: "18px",
              }}
            >
              Total
            </strong>

            <strong
              style={{
                fontSize: "28px",
                color: "#111827",
              }}
            >
              {order.total}
              {" "}
              FCFA
            </strong>

          </div>

        </div>

      ))}

    </div>

  );

}