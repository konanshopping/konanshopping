import { useEffect, useState } from "react";

import {

FaBoxOpen,

FaMoneyBillWave,

FaShoppingBag,

FaHashtag,

FaTruck,

FaCheckCircle

} from "react-icons/fa";

import axios from "axios";

import { useParams } from "react-router-dom";

export default function OrderDetails() {

  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  useEffect(() => {

    axios

      .get(
        `https://konanshopping-production.up.railway.app/order/${id}`
      )

      .then((res) => {

        console.log(res.data);

        setOrder(res.data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, [id]);

  if (!order) {

    return (

      <div
        style={{
          padding: "30px",
        }}
      >
        Chargement...
      </div>

    );

  }

  const products =
    order.items || order.products || [];

  return (

    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "15px",
      }}
    >

      {/* MAIN CARD */}

      <div
        style={{
          background: "white",

          borderRadius: "18px",

          padding: "20px",

          boxShadow:
            "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >

        {/* HEADER */}

          <div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
flexWrap: "wrap",
gap: "15px",
}}
>

<div>

<div
style={{
display: "flex",
alignItems: "center",
gap: "12px",
}}
>

<FaBoxOpen
style={{
fontSize: "30px",
color: "#7C3AED",
}}
/>

<h1
style={{
margin: 0,
fontSize: "28px",
color: "#111827",
fontWeight: "800",
}}
>

Détails commande

</h1>

</div>

<p
style={{
color: "#6b7280",
marginTop: "10px",
fontSize: "14px",
display: "flex",
alignItems: "center",
gap: "8px",
}}
>

<FaHashtag
style={{
color: "#9ca3af",
}}
/>

ID : {order._id}

</p>

</div>

<div
style={{
background:
order.status === "Livrée"
? "#dcfce7"
: order.status === "Expédiée"
? "#dbeafe"
: "#fef3c7",

color:
order.status === "Livrée"
? "#166534"
: order.status === "Expédiée"
? "#1d4ed8"
: "#92400e",

padding: "10px 18px",

borderRadius: "999px",

fontWeight: "bold",

fontSize: "13px",

display: "flex",

alignItems: "center",

gap: "8px",

boxShadow:
"0 4px 10px rgba(0,0,0,0.05)",
}}
>

{

order.status === "Livrée"

? <FaCheckCircle />

: order.status === "Expédiée"

? <FaTruck />

: <FaBoxOpen />

}

{order.status}

</div>

</div>


        {/* PRODUCTS */}

        {products.map((item, index) => (

          <div
            key={index}

            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              border:
                "1px solid #eee",

              borderRadius: "15px",

              padding: "12px",

              marginBottom: "12px",
            }}
          >

            {/* LEFT */}

            <div
              style={{
                display: "flex",

                gap: "15px",

                alignItems: "center",
              }}
            >

              <img
                src={
                  item.image ||
                  item.product?.image ||
                  item.productImage
                }

                alt={
                  item.name ||
                  item.product?.name
                }

                style={{
                  width: "75px",

                  height: "75px",

                  objectFit:
                    "cover",

                  borderRadius:
                    "14px",

                  border:
                    "1px solid #eee",
                }}
              />

              <div>

                <h2
                  style={{
                    margin: 0,
                    color: "#111827",
                    fontSize: "18px",
                  }}
                >
                  {
                    item.name ||
                    item.product?.name
                  }
                </h2>

                <p
                  style={{
                    color: "#6b7280",
                    marginTop: "6px",
                    fontSize: "14px",
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
                fontSize: "20px",
              }}
            >
              {
                item.price ||
                item.product?.price
              }
              {" "}
              FCFA
            </h2>

          </div>

        ))}

        {/* FOOTER */}

        <div
          style={{
            marginTop: "25px",

            paddingTop: "20px",

            borderTop:
              "1px solid #eee",

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",
          }}
        >

          <div>

            <p
              style={{
                color: "#6b7280",
                margin: 0,
                fontSize: "14px",
              }}
            >
              Total commande
            </p>

            <h1
              style={{
                marginTop: "5px",
                color: "#111827",
                fontSize: "28px",
              }}
            >
              {order.total}
              {" "}
              FCFA
            </h1>

          </div>

          <button
  onClick={() =>
    window.location.href =
  `/track-order/${order._id}`
  }

  style={{
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",

    color: "white",

    border: "none",

    padding: "12px 20px",

    borderRadius: "12px",

    fontWeight: "bold",

    cursor: "pointer",
  }}
>
  Suivre commande
</button>

        </div>

      </div>

    </div>

  );

}