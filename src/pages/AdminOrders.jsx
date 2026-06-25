import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  FaShoppingCart,
  FaClock,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

import "./AdminOrders.css";

function AdminOrders() {

  // =========================
  // STATES
  // =========================

  const [orders, setOrders] =
    useState([]);

  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const res =
          await axios.get(
            "https://konanshopping-production.up.railway.app/orders"
          );

        setOrders(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        await axios.put(
          `https://konanshopping-production.up.railway.app/orders/${id}`,
          {
            status,
          }
        );

        fetchOrders();

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // RETURN
  // =========================

  return (

    <div className="adminOrders">

      {/* =========================
   HEADER PREMIUM
========================= */}

<div className="ordersTop">

  <div className="ordersLeft">

    <div className="ordersBadge">

      <FaShoppingCart />

      <span>

        Gestion Premium

      </span>

    </div>

    <h1>

      Gestion des commandes

    </h1>

    <p>

      Gérez toutes les commandes, suivez leur évolution
      et mettez à jour leur statut en temps réel.

    </p>

  </div>

  <div className="ordersRight">

    <button className="ordersBtn">

      <FaCheckCircle />

      Tableau des commandes

    </button>

  </div>

</div>

      {/* =========================
   STATS PREMIUM
========================= */}

<div className="ordersStats">

  {/* TOTAL */}

  <div className="orderCard">

    <div className="orderLeft">

      <p className="cardMini">

        Total commandes

      </p>

      <h2>

        {orders.length}

      </h2>

      <div className="cardBottom">

        <FaShoppingCart />

        <span>

          Toutes les commandes

        </span>

      </div>

    </div>

    <div className="icon blue">

      <FaShoppingCart />

    </div>

  </div>

  {/* EN ATTENTE */}

  <div className="orderCard">

    <div className="orderLeft">

      <p className="cardMini">

        En attente

      </p>

      <h2>

        {
          orders.filter(
            (o) =>
              o.status === "En attente"
          ).length
        }

      </h2>

      <div className="cardBottom">

        <FaClock />

        <span>

          À traiter

        </span>

      </div>

    </div>

    <div className="icon orange">

      <FaClock />

    </div>

  </div>

  {/* LIVRAISON */}

  <div className="orderCard">

    <div className="orderLeft">

      <p className="cardMini">

        En livraison

      </p>

      <h2>

        {
          orders.filter(
            (o) =>
              o.status === "Livraison"
          ).length
        }

      </h2>

      <div className="cardBottom">

        <FaTruck />

        <span>

          Livraison active

        </span>

      </div>

    </div>

    <div className="icon purple">

      <FaTruck />

    </div>

  </div>

  {/* LIVRÉES */}

  <div className="orderCard">

    <div className="orderLeft">

      <p className="cardMini">

        Livrées

      </p>

      <h2>

        {
          orders.filter(
            (o) =>
              o.status === "Livrée"
          ).length
        }

      </h2>

      <div className="cardBottom">

        <FaCheckCircle />

        <span>

          Terminées

        </span>

      </div>

    </div>

    <div className="icon green">

      <FaCheckCircle />

    </div>

  </div>

</div>

      {/* TABLE */}

      <div className="ordersTable">

  <div className="tableHeader">

    <div>

      <p className="tableMini">

        <FaShoppingCart
          style={{
            marginRight:"6px",
            color:"#7c3aed"
          }}
        />

        COMMANDES

      </p>

      <h2>

        Toutes les commandes

      </h2>

    </div>

    <button className="tableBtn">

      <FaCheckCircle />

      Synchronisé

    </button>

  </div>

  <table className="premiumTable">

          <thead>

            <tr>

              <th>
                Client
              </th>

              <th>
                Produits
              </th>

              <th>
                Adresse
              </th>

              <th>
                Total
              </th>

              <th>
                Statut
              </th>

              <th>
                Date
              </th>

            </tr>

          </thead>

          <tbody>

  {orders.map((order, index) => (

    <tr
  key={index}
  className="orderRow"
>

      {/* CLIENT */}

      <td>

        <div className="customerBox">

          <div className="customerAvatar">

            <img
              src="/logo.jpg"
              alt="Konan Shopping"
            />

          </div>

          <div className="customerInfo">

            <h4 className="customerName">

  {order.customerName}

</h4>

            <p>

              {order.phone}

            </p>

          </div>

        </div>

      </td>

{/* PRODUITS */}

<td>

  <div className="productsList">

    {order.items?.map((item, i) => (

      <div
        key={i}
        className="productItem"
      >

        <img
          src={item.image}
          alt={item.name}
        />

        <div className="productDetails">

          <h5>

            {item.name}

          </h5>

          <p>

            <FaShoppingCart
              style={{
                marginRight: "6px",
                color: "#7c3aed",
              }}
            />

            Quantité : {item.quantity}

          </p>

        </div>

      </div>

    ))}

  </div>

</td>


      {/* ADRESSE */}

      <td>

        <div className="addressBox">

  <h5>

    📍 {order.city}

  </h5>

  <p>

    {order.district}

  </p>

</div>

      </td>

      {/* TOTAL */}

      <td>

        <strong className="priceText"
          style={{
            color:"#16a34a",
            fontSize:"15px"
          }}
        >

          {Number(order.total).toLocaleString()} FCFA

        </strong>

      </td>

      {/* STATUS */}

      <td>

        <select
    className="statusSelect"
    value={order.status}
    onChange={(e)=>
        updateStatus(
            order._id,
            e.target.value
        )
    }
>

          <option>

            En attente

          </option>

          <option>

            Préparation

          </option>

          <option>

            Livraison

          </option>

          <option>

            Livrée

          </option>

          <option>

            Annulée

          </option>

        </select>

      </td>

      {/* DATE */}

      <td>

       <div className="dateBadge">

    <FaClock
        style={{
            marginRight:"6px"
        }}
    />

    {new Date(
        order.createdAt
    ).toLocaleDateString()}

</div>

      </td>

    </tr>

  ))}

</tbody>

        </table>

      </div>

    </div>

  );

}

export default AdminOrders;