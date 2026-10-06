import { useEffect, useState } from "react";

import axios from "axios";



import {

  FaShoppingCart,

  FaPhoneAlt,

  FaMapMarkerAlt,

  FaBoxOpen,

  FaMoneyBillWave,

  FaTruck,

  FaCheckCircle,

  FaClock,

  FaUser

} from "react-icons/fa";



/*

 * ============================================================

 * 🔐 SÉCURITÉ FRONTEND — ORDERS ADMIN

 * ============================================================

 * - Les endpoints /api/orders sont réservés à l'administration

 *   par le backend.

 * - Le JWT admin présent dans localStorage est envoyé en Bearer.

 * - Les identifiants MongoDB et les statuts sont validés avant

 *   toute modification.

 * - Les réponses serveur sont vérifiées avant utilisation.

 * - Aucun secret, mot de passe ou JWT n'est codé en dur ici.

 * - Le backend reste l'autorité finale pour l'autorisation.

 * ============================================================

 */



const API_BASE_URL = "https\://konanshopping.com";

const API_TIMEOUT = 15000;

const MAX_ORDERS = 500;



const ALLOWED_STATUSES = [

  "En attente",

  "En livraison",

  "Livrée",

  "Annulée",

  "Préparation"

];



const isValidObjectId = (value) => {

  if (typeof value !== "string") return false;

  return /^[a-fA-F0-9]{24}$/.test(value.trim());

};



// ======================================================
// 🔐 AUTHENTIFICATION ADMINISTRATEUR PAR COOKIE HTTPONLY
// ======================================================
// Le JWT admin n'est plus lu depuis localStorage.
// Le navigateur envoie automatiquement le cookie HttpOnly.
// La logique métier des commandes reste inchangée.
// ======================================================

axios.defaults.withCredentials = true;

const getStoredAdmin = () => {
  try {
    const raw = localStorage.getItem("admin");
    if (!raw) return null;

    const admin = JSON.parse(raw);

    if (!admin || typeof admin !== "object") {
      return null;
    }

    return admin;
  } catch {
    return null;
  }
};

const hasAdminSession = () => {
  const admin = getStoredAdmin();

  return Boolean(
    admin &&
    (admin.isAdmin === true || admin.role === "admin")
  );
};

const redirectToAdminLogin = () => {

  if (window.location.pathname !== "/admin-login") {

    window.location.href = "/admin-login";

  }

};



const normalizeOrders = (data) => {

  const list = Array.isArray(data)

    ? data

    : Array.isArray(data?.orders)

    ? data.orders

    : Array.isArray(data?.data)

    ? data.data

    : [];



  return list

    .filter(

      (order) =>

        order &&

        typeof order === "object" &&

        isValidObjectId(order._id)

    )

    .slice(0, MAX_ORDERS);

};



const getSafeServerMessage = (error) => {

  const message = error?.response?.data?.message;



  if (

    typeof message === "string" &&

    message.trim()

  ) {

    return message.trim().slice(0, 300);

  }



  return "";

};



const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config) return config;

    config.withCredentials = true;
    config.headers = config.headers || {};
    config.headers.Accept = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (

      error?.response?.status === 401 ||

      error?.response?.status === 403

    ) {

      error.userMessage =

        "Votre session administrateur a expiré ou cet accès est refusé.";

    } else if (error?.code === "ECONNABORTED") {

      error.userMessage =

        "Le serveur met trop de temps à répondre.";

    } else if (!error?.response) {

      error.userMessage =

        "Impossible de contacter le serveur.";

    }



    return Promise.reject(error);

  }

);



function Orders() {

  const [orders, setOrders] = useState([]);



  useEffect(() => {

    if (!hasAdminSession()) {

      redirectToAdminLogin();

      return;

    }



    let mounted = true;



    const fetchOrders = async () => {

      try {

        const res = await api.get("/api/orders");



        if (!mounted) return;



        const safeOrders = normalizeOrders(res?.data);



        setOrders(safeOrders);

      } catch (err) {

        if (!mounted) return;



        if (

          err?.response?.status === 401 ||

          err?.response?.status === 403

        ) {

          redirectToAdminLogin();

          return;

        }



        if (import.meta.env?.DEV) {

          console.warn(

            "Impossible de charger les commandes.",

            err?.userMessage ||

              getSafeServerMessage(err) ||

              "Erreur serveur"

          );

        }



        setOrders([]);

      }

    };



    fetchOrders();



    return () => {

      mounted = false;

    };

  }, []);



  const updateStatus = async (id, status) => {

    if (!hasAdminSession()) {

      redirectToAdminLogin();

      return;

    }



    if (!isValidObjectId(id)) {

      return;

    }



    if (

      typeof status !== "string" ||

      !ALLOWED_STATUSES.includes(status)

    ) {

      return;

    }



    try {

      await api.put(

        `/api/orders/${encodeURIComponent(id)}`,

        {

          status,

        }

      );



      setOrders((currentOrders) =>

        currentOrders.map((order) =>

          order._id === id

            ? {

                ...order,

                status,

              }

            : order

        )

      );

    } catch (err) {

      if (

        err?.response?.status === 401 ||

        err?.response?.status === 403

      ) {

        redirectToAdminLogin();

        return;

      }



      if (import.meta.env?.DEV) {

        console.warn(

          "Impossible de modifier le statut de la commande.",

          err?.userMessage ||

            getSafeServerMessage(err) ||

            "Erreur serveur"

        );

      }

    }

  };



  return (

    <div

      style={{

        minHeight: "100vh",

        background: "#F8FAFC",

        padding:

          window.innerWidth < 768

            ? "15px"

            : "30px",

      }}

    >

      {/* HEADER */}



      <div

        style={{

          background:

            "linear-gradient(135deg,#2563EB,#1D4ED8)",



          padding: "20px",



          borderRadius: "24px",



          color: "#FFF",



          marginBottom: "25px",



          boxShadow:

            "0 10px 30px rgba(37,99,235,0.15)",

        }}

      >

        <div

          style={{

            display: "flex",



            alignItems: "center",



            gap: "14px",

          }}

        >

          <FaShoppingCart

            style={{

              fontSize: "30px",

            }}

          />



          <div>

            <h1

              style={{

                margin: 0,



                fontSize:

                  window.innerWidth < 768

                    ? "22px"

                    : "30px",



                fontWeight: "900",

              }}

            >

              Commandes Clients

            </h1>



            <p

              style={{

                margin: "5px 0 0 0",



                opacity: 0.9,

              }}

            >

              Gestion des commandes

            </p>

          </div>

        </div>

      </div>



      {orders.map((order) => (

        <div

          key={order._id}

          style={{

            background: "#FFF",



            padding: "18px",



            borderRadius: "24px",



            marginBottom: "18px",



            border:

              "1px solid #E5E7EB",



            boxShadow:

              "0 8px 25px rgba(15,23,42,0.05)",

          }}

        >

          {/* CLIENT */}



          <div

            style={{

              display: "flex",



              justifyContent:

                "space-between",



              alignItems: "center",



              flexWrap: "wrap",



              gap: "12px",



              marginBottom: "15px",

            }}

          >

            <div>

              <h2

                style={{

                  margin: 0,



                  display: "flex",



                  alignItems: "center",



                  gap: "8px",



                  color: "#111827",



                  fontSize: "20px",



                  fontWeight: "800",

                }}

              >

                <FaUser

                  style={{

                    color: "#2563EB",

                  }}

                />



                {order.customerName}

              </h2>



              <p

                style={{

                  display: "flex",



                  alignItems: "center",



                  gap: "8px",



                  color: "#64748B",



                  marginTop: "8px",

                }}

              >

                <FaPhoneAlt />



                {order.phone}

              </p>



              <p

                style={{

                  display: "flex",



                  alignItems: "center",



                  gap: "8px",



                  color: "#64748B",

                }}

              >

                <FaMapMarkerAlt />



                {order.address}

              </p>

            </div>



            {/* STATUS */}



            <div

              style={{

                display: "inline-flex",



                alignItems: "center",



                gap: "8px",



                padding: "10px 14px",



                borderRadius: "999px",



                background:

                  order.status === "Livrée"

                    ? "#DCFCE7"

                    : order.status === "En livraison"

                    ? "#DBEAFE"

                    : "#FEF3C7",



                color:

                  order.status === "Livrée"

                    ? "#15803D"

                    : order.status === "En livraison"

                    ? "#2563EB"

                    : "#92400E",



                fontWeight: "800",



                fontSize: "13px",

              }}

            >

              {order.status === "Livrée" ? (

                <FaCheckCircle />

              ) : order.status === "En livraison" ? (

                <FaTruck />

              ) : (

                <FaClock />

              )}



              {order.status}

            </div>

          </div>



          {/* PRODUITS */}



          <h3

            style={{

              display: "flex",



              alignItems: "center",



              gap: "8px",



              color: "#111827",



              marginBottom: "15px",

            }}

          >

            <FaBoxOpen />



            Produits

          </h3>



          {Array.isArray(order.products) &&

            order.products.map((item, index) => (

              <div

                key={index}

                style={{

                  display: "flex",



                  justifyContent:

                    "space-between",



                  alignItems: "center",



                  padding: "12px",



                  marginBottom: "10px",



                  borderRadius: "14px",



                  background: "#F8FAFC",



                  border:

                    "1px solid #E5E7EB",

                }}

              >

                <span

                  style={{

                    fontWeight: "600",

                  }}

                >

                  {item.name}

                </span>



                <strong

                  style={{

                    color: "#2563EB",

                  }}

                >

                  {item.price} FCFA

                </strong>

              </div>

            ))}



          {/* TOTAL */}



          <div

            style={{

              marginTop: "20px",



              paddingTop: "15px",



              borderTop:

                "1px solid #E5E7EB",



              display: "flex",



              justifyContent:

                "space-between",



              alignItems: "center",



              flexWrap: "wrap",



              gap: "12px",

            }}

          >

            <div>

              <div

                style={{

                  display: "flex",



                  alignItems: "center",



                  gap: "8px",



                  color: "#64748B",



                  fontSize: "13px",

                }}

              >

                <FaMoneyBillWave />



                Montant total

              </div>



              <h2

                style={{

                  margin: "5px 0 0 0",



                  color: "#111827",



                  fontWeight: "900",

                }}

              >

                {order.total} FCFA

              </h2>

            </div>

          </div>



          {/* ACTIONS */}



          <div

            style={{

              marginTop: "18px",



              display: "flex",



              gap: "10px",



              flexWrap: "wrap",

            }}

          >

            <button

              type="button"

              onClick={() =>

                updateStatus(

                  order._id,

                  "En livraison"

                )

              }

              style={{

                border: "none",



                background:

                  "linear-gradient(135deg,#2563EB,#1D4ED8)",



                color: "#FFF",



                padding: "12px 16px",



                borderRadius: "14px",



                fontWeight: "800",



                cursor: "pointer",

              }}

            >

              <FaTruck

                style={{

                  marginRight: "8px",

                }}

              />



              En livraison

            </button>



            <button

              type="button"

              onClick={() =>

                updateStatus(

                  order._id,

                  "Livrée"

                )

              }

              style={{

                border: "none",



                background:

                  "linear-gradient(135deg,#22C55E,#16A34A)",



                color: "#FFF",



                padding: "12px 16px",



                borderRadius: "14px",



                fontWeight: "800",



                cursor: "pointer",

              }}

            >

              <FaCheckCircle

                style={{

                  marginRight: "8px",

                }}

              />



              Livrée

            </button>

          </div>

        </div>

      ))}

    </div>

  );

}



export default Orders;