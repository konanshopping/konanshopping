import {

  useEffect,

  useState

} from "react";



import axios from "axios";



// ============================================================

// COUCHE DE SÉCURITÉ — AdminOrders

// Logique métier et affichage conservés.

// ============================================================



const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;



const ALLOWED_STATUSES = [

  "En attente",

  "Préparation",

  "Livraison",

  "Livrée",

  "Annulée",

];



const safeParse = (value, fallback = null) => {

  try {

    return value ? JSON.parse(value) : fallback;

  } catch {

    return fallback;

  }

};



const getStoredAdmin = () => {

  try {

    return safeParse(localStorage.getItem("admin"), null);

  } catch {

    return null;

  }

};



const isValidObjectId = (id) =>

  typeof id === "string" &&

  /^[a-f\d]{24}$/i.test(id);



const normalizeOrdersResponse = (data) =>

  Array.isArray(data) ? data : [];



const normalizeStatus = (status) =>

  ALLOWED_STATUSES.includes(status)

    ? status

    : null;



const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: API_TIMEOUT,

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

    const status = error?.response?.status;



    if (status === 401 || status === 403) {

      try {

        localStorage.removeItem("token");

        localStorage.removeItem("admin");

      } catch {

        // Ne bloque pas l'application si localStorage est indisponible.

      }



      if (

        typeof window !== "undefined" &&

        window.location.pathname !== "/admin-login"

      ) {

        window.location.href = "/admin-login";

      }

    }



    return Promise.reject(error);

  }

);



const requireAdminSession = () => {

  const admin = getStoredAdmin();



  if (!admin) {

    if (

      typeof window !== "undefined" &&

      window.location.pathname !== "/admin-login"

    ) {

      window.location.replace("/admin-login");

    }



    return false;

  }



  return true;

};







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



    if (!requireAdminSession()) {

      return;

    }



    fetchOrders();



  }, []);



  const fetchOrders =

    async () => {



      try {



        const res =

          await api.get("/api/orders");



        setOrders(

          normalizeOrdersResponse(res.data)

        );



      } catch (err) {



        console.error(

          "Erreur lors du chargement des commandes.",

          err?.message || "Erreur inconnue"

        );



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



        if (!requireAdminSession()) {

          return;

        }



        if (!isValidObjectId(id)) {

          return;

        }



        const safeStatus =

          normalizeStatus(status);



        if (!safeStatus) {

          return;

        }



        await api.put(

          `/api/orders/${id}`,

          {

            status: safeStatus,

          }

        );



        fetchOrders(); 



      } catch (err) {



        console.error(

          "Erreur lors de la mise à jour de la commande.",

          err?.message || "Erreur inconnue"

        );



      }



    }; 



  // ========================= 

  // RETURN 

  // ========================= 



  return ( 



    <div className="adminOrders"> 



      {/* ========================= 

   HEADER PREMIUM 

\========================= \*/} 



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



    <button

      type="button"

      className="ordersBtn"

    > 



      <FaCheckCircle /> 



      Tableau des commandes 



    </button> 



  </div> 



</div> 



      {/* ========================= 

   STATS PREMIUM 

\========================= \*/} 



<div className="ordersStats"> 



  {/* TOTAL \*/} 



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



  {/* EN ATTENTE \*/} 



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



  {/* LIVRAISON \*/} 



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



  {/* LIVRÉES \*/} 



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



      {/* TABLE \*/} 



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



    <button

      type="button"

      className="tableBtn"

    > 



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



      {/* CLIENT \*/} 



      <td> 



        <div className="customerBox"> 



          <div className="customerAvatar"> 



            <img

              src="/logo.jpg"

              alt="Konan Shopping"

              loading="lazy"

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



{/* PRODUITS \*/} 



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





      {/* ADRESSE \*/} 



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



      {/* TOTAL \*/} 



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



      {/* STATUS \*/} 



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



      {/* DATE \*/} 



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