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
            "http://localhost:5000/orders"
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
          `http://localhost:5000/orders/${id}`,
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

      {/* HEADER */}

      <div className="ordersTop">

        <div>

          <h1>

            Gestion Commandes

          </h1>

          <p>

            Gérez toutes les
            commandes clients
            en temps réel

          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="ordersStats">

        {/* TOTAL */}

        <div className="orderCard">

          <div className="icon blue">

            <FaShoppingCart />

          </div>

          <div>

            <p>

              Total commandes

            </p>

            <h2>

              {orders.length}

            </h2>

          </div>

        </div>

        {/* EN ATTENTE */}

        <div className="orderCard">

          <div className="icon orange">

            <FaClock />

          </div>

          <div>

            <p>

              En attente

            </p>

            <h2>

              {
                orders.filter(
                  (o) =>
                    o.status ===
                    "En attente"
                ).length
              }

            </h2>

          </div>

        </div>

        {/* LIVRAISON */}

        <div className="orderCard">

          <div className="icon purple">

            <FaTruck />

          </div>

          <div>

            <p>

              Livraison

            </p>

            <h2>

              {
                orders.filter(
                  (o) =>
                    o.status ===
                    "Livraison"
                ).length
              }

            </h2>

          </div>

        </div>

        {/* LIVRE */}

        <div className="orderCard">

          <div className="icon green">

            <FaCheckCircle />

          </div>

          <div>

            <p>

              Livrées

            </p>

            <h2>

              {
                orders.filter(
                  (o) =>
                    o.status ===
                    "Livrée"
                ).length
              }

            </h2>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="ordersTable">

        <table>

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

            {orders.map(
              (
                order,
                index
              ) => (

                <tr key={index}>

                  {/* CLIENT */}

                  <td>

                    <div
                      className="customerBox"
                    >

                      <h4>

                        {
                          order.customerName
                        }

                      </h4>

                      <p>

                        {
                          order.phone
                        }

                      </p>

                    </div>

                  </td>

                  {/* PRODUITS */}

                  <td>

                    <div
                      className="productsList"
                    >

                      {order.items?.map(
                        (
                          item,
                          i
                        ) => (

                          <div
                            key={i}
                            className="productItem"
                          >

                            <img
                              src={
                                item.image
                              }
                              alt=""
                            />

                            <div>

                              <h5>

                                {
                                  item.name
                                }

                              </h5>

                              <p>

                                x
                                {
                                  item.quantity
                                }

                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </td>

                  {/* ADRESSE */}

                  <td>

                    <div>

                      <h5>

                        {
                          order.city
                        }

                      </h5>

                      <p>

                        {
                          order.district
                        }

                      </p>

                    </div>

                  </td>

                  {/* TOTAL */}

                  <td>

                    <strong>

                      {
                        order.total
                      } FCFA

                    </strong>

                  </td>

                  {/* STATUS */}

                  <td>

                    <select

                      value={
                        order.status
                      }

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

                    {
                      new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    }

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default AdminOrders;