import "./AdminStats.css";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
  FaEye,
} from "react-icons/fa";

function AdminStats() {

  // =========================
  // STATES
  // =========================

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [visitors, setVisitors] =
    useState([]);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {

    fetchAllData();

  }, []);

  const fetchAllData =
    async () => {

      try {

        // PRODUCTS

        const productsRes =
          await axios.get(
            "https://konanshopping.onrender.com/products"
          );

        setProducts(
          productsRes.data
        );

        // USERS

        const usersRes =
          await axios.get(
            "https://konanshopping.onrender.com/users"
          );

        setUsers(
          usersRes.data
        );

        // VISITORS

        const visitorsRes =
          await axios.get(
            "https://konanshopping.onrender.com/visitors"
          );

        setVisitors(
          visitorsRes.data
        );

        // ORDERS

        try {

          const ordersRes =
            await axios.get(
              "https://konanshopping.onrender.com/orders"
            );

          setOrders(
            ordersRes.data
          );

        } catch {

          setOrders([]);

        }

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // TOTAL REVENUE
  // =========================

  const totalRevenue =
    orders.reduce(
      (
        total,
        order
      ) =>

        total +
        (
          Number(
            order.total
          ) || 0
        ),

      0
    );

  // =========================
  // TOTAL ORDERS
  // =========================

  const totalOrders =
    orders.length;

  // =========================
  // TOTAL USERS
  // =========================

  const totalUsers =
    users.length;

  // =========================
  // TOTAL VISITORS
  // =========================

  const totalVisitors =
    visitors.length;

  // =========================
  // PRODUCTS BY CATEGORY
  // =========================

  const categoryMap = {};

  products.forEach(
    (product) => {

      const cat =
        product.category ||
        "Autres";

      if (
        categoryMap[cat]
      ) {

        categoryMap[cat]++;

      } else {

        categoryMap[cat] = 1;

      }

    }
  );

  const categoryData =
    Object.keys(
      categoryMap
    ).map((key) => ({

      name:key,

      value:
        categoryMap[key],

    }));

  // =========================
  // VISITORS BY COUNTRY
  // =========================

  const countryMap = {};

  visitors.forEach(
    (visitor) => {

      const country =
        visitor.country ||
        "Inconnu";

      if (
        countryMap[country]
      ) {

        countryMap[country]++;

      } else {

        countryMap[country] = 1;

      }

    }
  );

  const visitorsData =
    Object.keys(
      countryMap
    ).map((key) => ({

      country:key,

      visiteurs:
        countryMap[key],

    }));

  // =========================
  // MONTHLY SALES
  // =========================

  const salesMap = {

    Jan:0,
    Fev:0,
    Mar:0,
    Avr:0,
    Mai:0,
    Juin:0,
    Juil:0,
    Aout:0,
    Sept:0,
    Oct:0,
    Nov:0,
    Dec:0,

  };

  orders.forEach(
    (order) => {

      const date =
        new Date(
          order.createdAt
        );

      const month =
        date.getMonth();

      const months = [

        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Aout",
        "Sept",
        "Oct",
        "Nov",
        "Dec",

      ];

      const monthName =
        months[month];

      salesMap[
        monthName
      ] +=
        Number(
          order.total
        ) || 0;

    }
  );

  const salesData =
    Object.keys(
      salesMap
    ).map((key) => ({

      month:key,

      ventes:
        salesMap[key],

    }));

  // =========================
  // COLORS
  // =========================

  const COLORS = [

    "#4F46E5",
    "#06B6D4",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",

  ];

  // =========================
  // RETURN
  // =========================

  return (

    <div className="adminStats">

      {/* HEADER */}

      <div className="statsHeader">

        <div>

          <h1>

            Dashboard Analytics

          </h1>

          <p>

            Statistiques réelles
            de votre boutique ecommerce

          </p>

        </div>

      </div>

      {/* CARDS */}

      <div className="statsCards">

        {/* REVENUS */}

        <div className="statsCard">

          <div className="cardIcon blue">

            <FaMoneyBillWave />

          </div>

          <div>

            <p>

              Revenus

            </p>

            <h2>

              {
                totalRevenue.toLocaleString()
              } FCFA

            </h2>

          </div>

        </div>

        {/* COMMANDES */}

        <div className="statsCard">

          <div className="cardIcon green">

            <FaShoppingCart />

          </div>

          <div>

            <p>

              Commandes

            </p>

            <h2>

              {totalOrders}

            </h2>

          </div>

        </div>

        {/* USERS */}

        <div className="statsCard">

          <div className="cardIcon purple">

            <FaUsers />

          </div>

          <div>

            <p>

              Utilisateurs

            </p>

            <h2>

              {totalUsers}

            </h2>

          </div>

        </div>

        {/* VISITORS */}

        <div className="statsCard">

          <div className="cardIcon orange">

            <FaEye />

          </div>

          <div>

            <p>

              Visiteurs

            </p>

            <h2>

              {totalVisitors}

            </h2>

          </div>

        </div>

      </div>

      {/* CHARTS */}

      <div className="chartsGrid">

        {/* SALES */}

        <div className="chartBox">

          <h2>

            Revenus mensuels

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              data={salesData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="ventes"
                stroke="#4F46E5"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* CATEGORY PIE */}

        <div className="chartBox">

          <h2>

            Produits par catégorie

          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={
                  categoryData
                }
                dataKey="value"
                outerRadius={100}
                label
              >

                {categoryData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

{/* LEGENDE */}

<div className="chartLegend">

  {categoryData.map((item, index) => {

    const colors = [
      "#4F46E5",
      "#22C55E",
      "#F59E0B",
      "#EF4444",
      "#06B6D4",
      "#8B5CF6",
    ];

    return (

      <div
        key={index}
        className="legendItem"
      >

        <span
          className="legendColor"
          style={{
            background:
              colors[
                index %
                colors.length
              ],
          }}
        ></span>

        <p>

          {item.name}

          <strong>
            {" "}
            ({item.value})
          </strong>

        </p>

      </div>

    );

  })}

</div>

        </div>

        {/* VISITORS */}

        <div className="chartBox full">

          <h2>

            Visiteurs par pays

          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={
                visitorsData
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="country"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="visiteurs"
                fill="#4F46E5"
                radius={[8,8,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* RECENT PRODUCTS */}

      <div className="recentProducts">

        <h2>

          Produits récents

        </h2>

        <div className="recentGrid">

          {products
            .slice(0,6)
            .map(
              (
                product,
                index
              ) => (

                <div
                  key={index}
                  className="recentCard"
                >

                  <img
                    src={
                      product.image
                    }
                    alt=""
                  />

                  <h3>

                    {
                      product.name
                    }

                  </h3>

                  <p>

                    {
                      product.price
                    } FCFA

                  </p>

                  <span>

                    {
                      product.category
                    }

                  </span>

                </div>

              )
            )}

        </div>

      </div>

    </div>

  );

}

export default AdminStats;