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
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaChartLine,
  FaFileAlt,
  FaEnvelope,
  FaStore,
  FaCrown,
  FaFire,
  FaArrowUp,
  FaEye,
  FaPhone,
  FaClipboardCheck,
  FaUserCircle,
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
            "https://konanshopping-production.up.railway.app/orders"
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
            "https://konanshopping-production.up.railway.app/products"
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
      name: "Livrée",
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
        `https://konanshopping-production.up.railway.app/delete-product/${id}`
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
        `https://konanshopping-production.up.railway.app/update-product/${id}`,
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
          "https://konanshopping-production.up.railway.app/upload",
          formData
        );

      const imageUrl =
        uploadRes.data.imageUrl;

      await axios.post(
        "https://konanshopping-production.up.railway.app/add-product",
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

  {/* LOGO */}

  <div>

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
          SHOPPING CAMEROUN
        </span>

      </div>

    </div>

    {/* TITRE */}

    <div
      style={{
        padding: "0 22px",
        marginBottom: "14px",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: "#94a3b8",
        fontWeight: "700",
      }}
    >
      Administration
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
          navigate("/admin-orders")
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

        <span>
          Produits
        </span>

      </button>

      <button
        onClick={() =>
          navigate("/admin-messages")
        }
      >

        <FaEnvelope />

        <span>
          Messages
        </span>

      </button>

      <button
        onClick={() =>
          navigate("/admin-clients")
        }
      >

        <FaUsers />

        <span>
          Clients
        </span>

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
        className="menuLink"
      >

        <FaCog />

        <span>
          Paramètres
        </span>

      </Link>

    </div>

  </div>

  {/* CARD PREMIUM */}

  <div
    style={{
      margin: "20px",
      padding: "20px",
      borderRadius: "20px",
      background:
        "linear-gradient(135deg,#7c3aed,#8b5cf6)",
      color: "#fff",
      boxShadow:
        "0 15px 35px rgba(124,58,237,0.35)",
    }}
  >

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px",
      }}
    >

      <FaCrown
        style={{
          fontSize: "22px",
        }}
      />

      <h3
        style={{
          margin: 0,
          fontSize: "17px",
        }}
      >
        Dashboard Premium
      </h3>

    </div>

    <p
      style={{
        fontSize: "13px",
        lineHeight: "1.6",
        opacity: 0.95,
      }}
    >
      Gérez les commandes,
      produits, clients,
      livraisons et revenus
      depuis un tableau de bord
      moderne.
    </p>

    <button
      style={{
        width: "100%",
        height: "44px",
        border: "none",
        borderRadius: "12px",
        marginTop: "12px",
        background: "#fff",
        color: "#7c3aed",
        fontWeight: "700",
        cursor: "pointer",
      }}
    >

      <FaStore
        style={{
          marginRight: "8px",
        }}
      />

      Voir Analytics

    </button>

  </div>

</div>

    {/* MAIN */}

    <div className="main">

      {/* TOPBAR */}

<div className="topbar">

  {/* GAUCHE */}

  <div className="topLeft">

    <div className="welcomeBox">

      <div className="welcomeBadge">

        <FaChartPie />

        <span>
          Tableau de bord Premium
        </span>

      </div>

      <h1>

        Bonjour Konan

      </h1>

      <p className="welcomeText">

        Suivez vos ventes,
        commandes, clients et
        performances en temps réel.

      </p>

    </div>

  </div>

  {/* DROITE */}

  <div className="topActions">

    {/* RECHERCHE */}

    <div className="searchBox">

      <FaSearch
        className="searchIcon"
      />

      <input
        type="text"
        placeholder="Rechercher un produit, commande ou client..."
      />

    </div>

    {/* NOTIFICATIONS */}

    <button
      className="notif"
    >

      <FaBell />

      <div
        className="notifDot"
      >

        3

      </div>

    </button>

    {/* PROFIL ADMIN */}

    <div
      className="adminProfile"
    >

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

    <div className="statHeader">

      <div>

        <p className="statMini">
          Revenus Totaux
        </p>

        <h2>
          {totalRevenue.toLocaleString()}
          FCFA
        </h2>

      </div>

      <div className="statIcon green">

        <FaMoneyBillWave />

      </div>

    </div>

    <div className="statFooter">

      <span className="positive">

        +12%

      </span>

      <p>
        Croissance ce mois
      </p>

    </div>

  </div>

  {/* COMMANDES */}

  <div className="statCard ordersCard">

    <div className="statHeader">

      <div>

        <p className="statMini">
          Commandes
        </p>

        <h2>
          {orders.length}
        </h2>

      </div>

      <div className="statIcon blue">

        <FaShoppingCart />

      </div>

    </div>

    <div className="statFooter">

      <span className="purpleText">

        +8%

      </span>

      <p>
        Commandes enregistrées
      </p>

    </div>

  </div>

  {/* CLIENTS */}

  <div className="statCard clientsCard">

    <div className="statHeader">

      <div>

        <p className="statMini">
          Clients
        </p>

        <h2>
          {uniqueClients}
        </h2>

      </div>

      <div className="statIcon orange">

        <FaUsers />

      </div>

    </div>

    <div className="statFooter">

      <span className="orangeText">

        +5%

      </span>

      <p>
        Clients actifs
      </p>

    </div>

  </div>

  {/* PRODUITS */}

  <div className="statCard productCard">

    <div className="statHeader">

      <div>

        <p className="statMini">
          Produits
        </p>

        <h2>
          {products.length}
        </h2>

      </div>

      <div className="statIcon purple">

        <FaBox />

      </div>

    </div>

    <div className="statFooter">

      <span className="greenText">

        Actif

      </span>

      <p>
        Produits en boutique
      </p>

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

          <FaChartLine
            style={{
              marginRight: "6px",
            }}
          />

          ANALYTICS

        </p>

        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <FaMoneyBillWave
            color="#16a34a"
          />

          Revenus & Performances

        </h3>

      </div>

      <button className="chartBtn">

        <FaFileAlt />

        Rapport

      </button>

    </div>

    {/* STATS */}

    <div className="chartNumbers">

      <div className="numberBox">

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >

          <FaMoneyBillWave
            color="#16a34a"
          />

          <span>
            Revenus
          </span>

        </div>

        <h2>

          {totalRevenue.toLocaleString()}
          FCFA

        </h2>

        <p>

          Revenus réels

        </p>

      </div>

      <div className="numberBox purpleBox">

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >

          <FaShoppingCart
            color="#7c3aed"
          />

          <span>
            Commandes
          </span>

        </div>

        <h2>

          {orders.length}

        </h2>

        <p>

          Commandes enregistrées

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

          <FaChartPie
            style={{
              marginRight: "6px",
            }}
          />

          COMMANDES

        </p>

        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <FaChartPie
            color="#7c3aed"
          />

          Statistiques des commandes

        </h3>

      </div>

    </div>

    {/* PIE */}

<div className="smallPie">

  <PieChart
    width={260}
    height={260}
  >

    <Pie
      data={pieData}
      innerRadius={70}
      outerRadius={100}
      paddingAngle={4}
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

  {/* CENTRE */}

  <div
    style={{
      position: "absolute",
      textAlign: "center",
    }}
  >

    <h2
      style={{
        margin: 0,
        fontSize: "26px",
        fontWeight: "800",
        color: "#0f172a",
      }}
    >
      {orders.length}
    </h2>

    <p
      style={{
        margin: 0,
        color: "#64748b",
        fontSize: "12px",
      }}
    >
      Commandes
    </p>

  </div>

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

        <div
          className="legendLeft"
        >

          <span
            style={{
              background:
                item.color,
            }}
          />

          <div>

            <h5
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#0f172a",
                fontWeight: "700",
              }}
            >
              {item.name}
            </h5>

            <small
              style={{
                color: "#94a3b8",
                fontSize: "11px",
              }}
            >
              Statut commande
            </small>

          </div>

        </div>

        <strong
          style={{
            color: "#0f172a",
            fontSize: "16px",
          }}
        >

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

    <div className="tableTop">

      <div>

        <p className="tableMini">

          <FaShoppingCart
            style={{
              marginRight: "6px",
              color: "#7c3aed",
            }}
          />

          COMMANDES

        </p>

        <h3>

          Commandes récentes

        </h3>

      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >

        <button
          className="tableBtn"
        >

          <FaEye />

          Voir tout

        </button>

        <button
          className="tableBtn"
        >

          <FaEdit />

          Gérer

        </button>

      </div>

    </div>

    {/* TABLE */}

    <div className="tableWrapper">

      <table>

        <thead>

          <tr>

            <th>

              <FaUserCircle
                style={{
                  marginRight: "6px",
                }}
              />

              Client

            </th>

            <th>

              <FaPhone
                style={{
                  marginRight: "6px",
                }}
              />

              Téléphone

            </th>

            <th>

              <FaMoneyBillWave
                style={{
                  marginRight: "6px",
                }}
              />

              Total

            </th>

            <th>

              <FaBox
                style={{
                  marginRight: "6px",
                }}
              />

              Produits

            </th>

            <th>

              <FaClipboardCheck
                style={{
                  marginRight: "6px",
                }}
              />

              Statut

            </th>

          </tr>

        </thead>

        <tbody>

          {orders
            .slice(0, 8)
            .map((order, index) => (

              <tr key={index}>

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

                <td>
                  {order.phone}
                </td>

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

                <td>

                  <div className="productCount">

                    <FaBox
                      style={{
                        marginRight: "5px",
                      }}
                    />

                    {
                      order.items
                        ?.length || 0
                    }

                    {" "}
                    produits

                  </div>

                </td>

                <td>

                  <span
                    className={`statusBadge ${order.status}`}
                  >

                    {order.status}

                  </span>

                </td>

              </tr>

            ))}

        </tbody>

      </table>

    </div>

  </div>

  {/* PRODUITS */}

  <div className="productsCard">

    <div className="tableTop">

      <div>

        <p className="tableMini">

          <FaFire
            style={{
              marginRight: "6px",
              color: "#f97316",
            }}
          />

          PRODUITS

        </p>

        <h3>

          Produits populaires

        </h3>

      </div>

      <button
        className="tableBtn"
      >

        <FaChartLine />

        Tendances

      </button>

    </div>

    {/* PRODUCTS */}

<div className="productsList">

  {topSellingProducts
    .slice(0, 5)
    .map(([name, qty], index) => {

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

          <div
            className="productRank"
          >
            #{index + 1}
          </div>

          <img
            src={product?.image}
            alt=""
          />

          <div className="productInfo">

            <h4>

              <FaBox
                style={{
                  marginRight: "6px",
                  color: "#7c3aed",
                }}
              />

              {name}

            </h4>

            <p>

              <FaMoneyBillWave
                style={{
                  marginRight: "5px",
                }}
              />

              {product?.price}
              FCFA

            </p>

          </div>

          <div className="salesBox">

            <strong>
              {qty}
            </strong>

            <span>
              ventes
            </span>

          </div>

        </div>

      );

    })}

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

  <div className="cardHeader">

    <h3>

      <FaPlusCircle
        style={{
          marginRight: "8px",
          color: "#7c3aed",
        }}
      />

      Ajouter un produit

    </h3>

    <span className="cardBadge">

      Catalogue

    </span>

  </div>

  <input
    type="text"
    placeholder="Nom du produit"
    value={name}
    onChange={(e) =>
      setName(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Prix en FCFA"
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

    <FaPlus />

    Ajouter le produit

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

        <div className="productImageWrapper">

          <img
            src={product.image}
            alt=""
          />

        </div>

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

              <FaCheckCircle />

              Sauvegarder

            </button>

          </>

        ) : (

          <>

            <h4>

              <FaBox
                style={{
                  marginRight: "6px",
                  color: "#7c3aed",
                }}
              />

              {product.name}

            </h4>

            <p>

              <FaMoneyBillWave
                style={{
                  marginRight: "5px",
                }}
              />

              {product.price}
              FCFA

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

                <FaEdit />

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

                <FaTrash />

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