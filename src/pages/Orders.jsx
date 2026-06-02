import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    axios
      .get("https://konanshopping.onrender.com/orders")
      .then((res) => {

        setOrders(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);

const updateStatus = async (
  id,
  status
) => {

  try {

    await axios.put(
      `https://konanshopping.onrender.com/orders/${id}`,
      {
        status,
      }
    );

    setOrders(

      orders.map((order) =>

        order._id === id
          ? {
              ...order,
              status,
            }
          : order

      )

    );

  } catch (err) {

    console.log(err);

  }

};

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <h1
        style={{
          marginBottom: "40px",
        }}
      >
        Commandes Clients 📦
      </h1>

      {orders.map((order) => (

        <div
          key={order._id}
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "25px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >

          <h2>{order.customerName}</h2>

          <p>
            📞 {order.phone}
          </p>

          <p>
            📍 {order.address}
          </p>

          <h3
            style={{
              marginTop: "20px",
            }}
          >
            Produits
          </h3>

          {order.products.map((item, index) => (

            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >

              <span>{item.name}</span>

              <strong>
                {item.price} FCFA
              </strong>

            </div>

          ))}

          <h2
            style={{
              marginTop: "25px",
            }}
          >
            Total : {order.total} FCFA
          </h2>

          <p
            style={{
              marginTop: "15px",
              color: "orange",
              fontWeight: "bold",
            }}
          >
            {order.status}
          </p>

            <div
            style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
            }}
            >

            <button
                onClick={() =>
                updateStatus(
                    order._id,
                    "En livraison"
                )
                }
            >
                En livraison
            </button>

            <button
                onClick={() =>
                updateStatus(
                    order._id,
                    "Livrée"
                )
                }
            >
                Livrée
            </button>

            </div>

        </div>

      ))}

    </div>

  );

}

export default Orders;