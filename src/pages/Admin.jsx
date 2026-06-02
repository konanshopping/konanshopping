import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  FaHome,
  FaBox,
  FaUsers,
  FaTruck,
  FaChartPie,
  FaCog,
  FaShoppingCart,
  FaMoneyBillWave,
  FaBell,
  FaSearch,
  FaPlus,
  FaEdit,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Link } from "react-router-dom";

import "./Admin.css";

function Admin() {

const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  useEffect(() => {

    fetchOrders();

    fetchProducts();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const res =
          await axios.get(
            "https://konanshopping.onrender.com/orders"
          );

        setOrders(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  const fetchProducts =
    async () => {

      try {

        const res =
          await axios.get(
            "https://konanshopping.onrender.com/products"
          );

        setProducts(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // REVENUS
  // =========================

  const totalRevenue =
    orders.reduce(
      (acc, order) =>
        acc +
        Number(order.total || 0),
      0
    );

  // =========================
  // CLIENTS UNIQUES
  // =========================

  const uniqueClients =
    [
      ...new Set(
        orders.map(
          (o) => o.phone
        )
      ),
    ].length;

  // =========================
  // STATUS
  // =========================

  const delivered =
    orders.filter(
      (o) =>
        o.status === "Livrée"
    ).length;

  const pending =
    orders.filter(
      (o) =>
        o.status ===
        "En attente"
    ).length;

  const shipping =
    orders.filter(
      (o) =>
        o.status ===
        "En livraison"
    ).length;

  const cancelled =
    orders.filter(
      (o) =>
        o.status ===
        "Annulée"
    ).length;

  // =========================
  // GRAPH VENTES REELLES
  // =========================

  const salesData = orders.map(
    (order) => ({

      day: new Date(
        order.createdAt
      ).toLocaleDateString(
        "fr-FR",
        {
          weekday: "short",
        }
      ),

      ventes: Number(
        order.total || 0
      ),

    })
  );

  // =========================
  // PIE DATA
  // =========================

  const pieData = [
    {
      name: "Livrées",
      value: delivered,
      color: "#7c3aed",
    },

    {
      name: "En livraison",
      value: shipping,
      color: "#8b5cf6",
    },

    {
      name: "En attente",
      value: pending,
      color: "#a78bfa",
    },

    {
      name: "Annulées",
      value: cancelled,
      color: "#c4b5fd",
    },
  ];

  // =========================
  // PRODUITS VENDUS REELS
  // =========================

  const soldProducts = {};

  orders.forEach((order) => {

    if (order.items) {

      order.items.forEach((item) => {

        if (
          soldProducts[item.name]
        ) {

          soldProducts[item.name]
          += item.quantity || 1;

        } else {

          soldProducts[item.name]
          = item.quantity || 1;

        }

      });

    }

  });

  const topSellingProducts =
    Object.entries(
      soldProducts
    ).sort(
      (a,b) => b[1] - a[1]
    );

const [name, setName] =
  useState("");

const [price, setPrice] =
  useState("");

const [image, setImage] =
  useState(null);

const [
  showProducts,
  setShowProducts
] = useState(false);

const [
  editingProduct,
  setEditingProduct
] = useState(null);

const [
  editName,
  setEditName
] = useState("");

const [
  editPrice,
  setEditPrice
] = useState("");

const deleteProduct =
  async (id) => {

    try {

      await axios.delete(
        `https://konanshopping.onrender.com/delete-product/${id}`
      );

      fetchProducts();

    } catch (err) {

      console.log(err);

    }

  };

const startEdit =
  (product) => {

    setEditingProduct(product._id);

    setEditName(product.name);

    setEditPrice(product.price);

  };

const saveEdit =
  async (id) => {

    try {

      await axios.put(
        `https://konanshopping.onrender.com/update-product/${id}`,
        {
          name: editName,
          price: editPrice,
        }
      );

      setEditingProduct(null);

      fetchProducts();

    } catch (err) {

      console.log(err);

    }

  };

const addProduct =
  async () => {

    try {

      const formData =
        new FormData();

      formData.append(
        "image",
        image
      );

      const uploadRes =
        await axios.post(
          "https://konanshopping.onrender.com/upload",
          formData
        );

      const imageUrl =
        uploadRes.data.imageUrl;

      await axios.post(
        "https://konanshopping.onrender.com/add-product",
        {
          name,
          price,
          image:imageUrl,
        }
      );

      fetchProducts();

      setName("");
      setPrice("");
      setImage(null);

      alert(
        "Produit ajouté ✅"
      );

    } catch (err) {

      console.log(err);

    }

  };

  return (

  <div className="admin">

    {/* SIDEBAR */}

    <div className="sidebar">

      <div>

        {/* LOGO */}

        <div className="logo">

          <img
            src="/logo.jpg"
            alt="Konan Shopping"
          />

          <div className="logoText">

            <h2>
              KONAN
            </h2>

            <span>
              SHOPPING
            </span>

          </div>

        </div>

        {/* MENU */}

        <div className="menu">

          <button className="active">

            <FaHome />

            <span>
              Tableau de bord
            </span>

          </button>

          <button
  onClick={() =>
    navigate(
      "/admin-orders"
    )
  }
>

  <FaShoppingCart />

  <span>
    Commandes
  </span>

</button>


   <button
  onClick={() =>
    window.location.href =
      "/admin-products"
  }
>

  <FaBox />

  Produits

</button>
<button
  onClick={() =>
    navigate("/admin-clients")
  }
>

  <FaUsers />

  Clients

</button>

          <button

  onClick={() =>
    navigate("/deliveries")
  }

>

  <FaTruck />

  <span>
    Livraisons
  </span>

</button>

          <button
  onClick={() =>
    navigate("/admin-stats")
  }
>

  <FaChartPie />

  <span>
    Statistiques
  </span>

</button>

         <Link
  to="/admin/settings"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 18px",
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
  }}
>

  <FaCog />

  <span>
    Paramètres
  </span>

</Link>

        </div>

      </div>

      {/* BUSINESS CARD */}

      <div className="businessCard">

        <div className="businessGlow" />

        <h3>

          Dashboard Premium 🚀

        </h3>

        <p>

          Gérez vos ventes,
          produits et livraisons
          avec une expérience
          professionnelle.

        </p>

        <button>

          Voir analytics

        </button>

      </div>

    </div>

    {/* MAIN */}

    <div className="main">

      {/* TOPBAR */}

      <div className="topbar">

        {/* LEFT */}

        <div className="topLeft">

          <div className="welcomeBox">

            <p className="welcomeMini">

              KONAN SHOPPING

            </p>

            <h1>

              Bonjour Konan 👋

            </h1>

            <p className="welcomeText">

              Voici les performances
              de votre boutique
              aujourd’hui.

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="topActions">

          {/* SEARCH */}

          <div className="searchBox">

            <FaSearch className="searchIcon" />

            <input
              type="text"
              placeholder="Rechercher..."
            />

          </div>

          {/* NOTIFICATION */}

          <div className="notif">

            <FaBell />

            <div className="notifDot">

              3

            </div>

          </div>

          {/* PROFILE */}

          <div className="adminProfile">

            <img
              src="/logo.jpg"
              alt="Konan Shopping"
            />

            <div>

              <h4>

                Konan Shopping

              </h4>

              <p>

                Administrateur

              </p>

            </div>

          </div>

        </div>

      </div>

        {/* =========================
   STATS PREMIUM
========================= */}

<div className="statsGrid">

  {/* REVENUS */}

  <div className="statCard revenueCard">

    <div className="statLeft">

      <p className="statMini">

        Revenus totaux

      </p>

      <h2>

        {totalRevenue.toLocaleString()}
        FCFA

      </h2>

      <div className="statBottom">

        <span className="positive">

          +12%

        </span>

        <p>

          Revenus réels
          ce mois

        </p>

      </div>

    </div>

    <div className="statIcon green">

      <FaMoneyBillWave />

    </div>

  </div>

  {/* COMMANDES */}

  <div className="statCard ordersCard">

    <div className="statLeft">

      <p className="statMini">

        Commandes

      </p>

      <h2>

        {orders.length}

      </h2>

      <div className="statBottom">

        <span className="purpleText">

          +8%

        </span>

        <p>

          Commandes
          enregistrées

        </p>

      </div>

    </div>

    <div className="statIcon blue">

      <FaShoppingCart />

    </div>

  </div>

  {/* CLIENTS */}

  <div className="statCard clientsCard">

    <div className="statLeft">

      <p className="statMini">

        Clients

      </p>

      <h2>

        {uniqueClients}

      </h2>

      <div className="statBottom">

        <span className="orangeText">

          +5%

        </span>

        <p>

          Clients actifs

        </p>

      </div>

    </div>

    <div className="statIcon orange">

      <FaUsers />

    </div>

  </div>

  {/* PRODUITS */}

  <div className="statCard productCard">

    <div className="statLeft">

      <p className="statMini">

        Produits

      </p>

      <h2>

        {products.length}

      </h2>

      <div className="statBottom">

        <span className="greenText">

          Active

        </span>

        <p>

          Boutique en ligne

        </p>

      </div>

    </div>

    <div className="statIcon purple">

      <FaBox />

    </div>

  </div>

</div>

     {/* =========================
   ULTRA PREMIUM CHARTS
========================= */}

<div className="charts">

  {/* SALES */}

  <div className="chartCard salesChart">

    {/* HEADER */}

    <div className="chartTop">

      <div>

        <p className="chartMini">

          ANALYTICS

        </p>

        <h3>

          Revenus &
          performances

        </h3>

      </div>

      <button className="chartBtn">

        <FaPlus />

        Rapport

      </button>

    </div>

    {/* STATS */}

    <div className="chartNumbers">

      <div className="numberBox">

        <h2>

          {totalRevenue.toLocaleString()}
          FCFA

        </h2>

        <p>

          Revenus réels

        </p>

      </div>

      <div className="numberBox purpleBox">

        <h2>

          {orders.length}

        </h2>

        <p>

          Commandes

        </p>

      </div>

    </div>

    {/* MINI CHART */}

    <div className="miniChart">

      <ResponsiveContainer>

        <AreaChart
          data={salesData}
        >

          <defs>

            <linearGradient
              id="premiumGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#8b5cf6"
                stopOpacity={0.45}
              />

              <stop
                offset="100%"
                stopColor="#8b5cf6"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#ede9fe"
          />

          <XAxis
            dataKey="day"
            tick={{
              fill:"#6b7280",
              fontSize:12,
            }}
          />

          <YAxis
            tick={{
              fill:"#6b7280",
              fontSize:12,
            }}
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="ventes"
            stroke="#7c3aed"
            fill="url(#premiumGradient)"
            strokeWidth={3}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  </div>

  {/* PIE */}

  <div className="chartCard pieCard">

    <div className="chartTop">

      <div>

        <p className="chartMini">

          COMMANDES

        </p>

        <h3>

          Statistiques

        </h3>

      </div>

    </div>

    {/* PIE */}

    <div className="smallPie">

      <PieChart
        width={210}
        height={210}
      >

        <Pie
          data={pieData}
          innerRadius={55}
          outerRadius={82}
          paddingAngle={5}
          dataKey="value"
        >

          {pieData.map(
            (
              entry,
              index
            ) => (

              <Cell
                key={index}
                fill={
                  entry.color
                }
              />

            )
          )}

        </Pie>

      </PieChart>

    </div>

    {/* LEGEND */}

    <div className="premiumLegend">

      {pieData.map(
        (
          item,
          index
        ) => (

          <div
            key={index}
            className="premiumLegendItem"
          >

            <div className="legendLeft">

              <span
                style={{
                  background:
                    item.color,
                }}
              />

              <p>

                {item.name}

              </p>

            </div>

            <strong>

              {item.value}

            </strong>

          </div>

        )
      )}

    </div>

  </div>

</div>

{/* =========================
   PREMIUM TABLE SECTION
========================= */}

<div className="bottomGrid">

  {/* COMMANDES */}

  <div className="ordersTable">

    {/* HEADER */}

    <div className="tableTop">

      <div>

        <p className="tableMini">

          COMMANDES

        </p>

        <h3>

          Commandes récentes

        </h3>

      </div>

      <button className="tableBtn">

        <FaEdit />

        Gérer

      </button>

    </div>

    {/* TABLE */}

    <div className="tableWrapper">

      <table>

        <thead>

          <tr>

            <th>
              Client
            </th>

            <th>
              Téléphone
            </th>

            <th>
              Total
            </th>

            <th>
              Produits
            </th>

            <th>
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {orders
            .slice(0,8)
            .map(
              (
                order,
                index
              ) => (

                <tr
                  key={index}
                >

                  {/* CLIENT */}

                  <td>

                    <div className="clientBox">

                      <div className="clientAvatar">

                        {
                          order.customerName?.charAt(0)
                        }

                      </div>

                      <div>

                        <h4>

                          {
                            order.customerName
                          }

                        </h4>

                        <p>

                          {
                            order.city ||
                            "Douala"
                          }

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* PHONE */}

                  <td>

                    {
                      order.phone
                    }

                  </td>

                  {/* TOTAL */}

                  <td>

                    <strong>

                      {
                        Number(
                          order.total || 0
                        ).toLocaleString()
                      }

                      {" "}
                      FCFA

                    </strong>

                  </td>

                  {/* PRODUCTS */}

                  <td>

                    <div className="productCount">

                      {
                        order.items
                        ?.length || 0
                      }

                      {" "}
                      produits

                    </div>

                  </td>

                  {/* STATUS */}

                  <td>

                    <span
                      className={`statusBadge ${order.status}`}
                    >

                      {
                        order.status
                      }

                    </span>

                  </td>

                </tr>

              )
            )}

        </tbody>

      </table>

    </div>

  </div>

  {/* PRODUITS */}

  <div className="productsCard">

    {/* HEADER */}

    <div className="tableTop">

      <div>

        <p className="tableMini">

          PRODUITS

        </p>

        <h3>

          Produits populaires

        </h3>

      </div>

    </div>

    {/* PRODUCTS */}

    <div className="productsList">

      {topSellingProducts
        .slice(0,5)
        .map(
          (
            [name, qty],
            index
          ) => {

            const product =
              products.find(
                (p) =>
                  p.name === name
              );

            return (

              <div
                key={index}
                className="premiumProduct"
              >

                {/* IMAGE */}

                <img
                  src={
                    product?.image
                  }
                  alt=""
                />

                {/* INFO */}

                <div className="productInfo">

                  <h4>

                    {name}

                  </h4>

                  <p>

                    {
                      product?.price
                    } FCFA

                  </p>

                </div>

                {/* SALES */}

                <div className="salesBox">

                  {qty}

                  <span>

                    ventes

                  </span>

                </div>

              </div>

            );

          }
        )}

    </div>

  </div>

</div>

{/* =========================
   PRODUITS PANEL
========================= */}

{showProducts && (

  <div className="productsManager">

    <div className="managerHeader">

      <h2>

        Gestion Produits

      </h2>

    </div>

    {/* AJOUT */}

    <div className="addProductCard">

      <h3>

        Ajouter un produit

      </h3>

      <input
        type="text"
        placeholder="Nom produit"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Prix"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
      />

      <input
        type="file"
        onChange={(e) =>
          setImage(
            e.target.files[0]
          )
        }
      />

      <button
        className="saveBtn"
        onClick={addProduct}
      >

        Ajouter Produit

      </button>

    </div>

    {/* LISTE */}

    <div className="productsGrid">

      {products.map(
        (product, index) => (

          <div
            key={index}
            className="productManageCard"
          >

            <img
              src={product.image}
              alt=""
            />

            {editingProduct ===
            product._id ? (

              <>

                <input
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value
                    )
                  }
                />

                <input
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(
                      e.target.value
                    )
                  }
                />

                <button
                  className="saveBtn"
                  onClick={() =>
                    saveEdit(
                      product._id
                    )
                  }
                >

                  Sauvegarder

                </button>

              </>

            ) : (

              <>

                <h4>

                  {
                    product.name
                  }

                </h4>

                <p>

                  {
                    product.price
                  } FCFA

                </p>

                <div className="manageBtns">

                  <button
                    className="editBtn"
                    onClick={() =>
                      startEdit(
                        product
                      )
                    }
                  >

                    Modifier

                  </button>

                  <button
                    className="deleteBtn"
                    onClick={() =>
                      deleteProduct(
                        product._id
                      )
                    }
                  >

                    Supprimer

                  </button>

                </div>

              </>

            )}

          </div>

        )
      )}

    </div>

  </div>

)}

</div>

</div>

  );

}

export default Admin;