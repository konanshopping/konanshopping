import { useEffect, useState } from "react";



import { useNavigate } from "react-router-dom";



import axios from "axios";



import {



  FaBoxOpen,



  FaShippingFast,



  FaMapMarkerAlt,



  FaMoneyBillWave,



  FaBox,



} from "react-icons/fa";







import { FaTruckFast } from "react-icons/fa6";







import {



  FaClipboardList



} from "react-icons/fa6";







/* =========================================================

   🔐 SÉCURITÉ FRONTEND

   Le backend reste l'autorité finale.

\========================================================= */



const API_BASE_URL = "https://konanshopping.com/api";

const API_TIMEOUT = 15000;

const MAX_USER_ID_LENGTH = 24;

const MAX_STORED_USER_LENGTH = 10000;



const getAuthToken = () => {

  try {

    if (typeof window === "undefined" || !window.localStorage) {

      return "";

    }



    const token = window.localStorage.getItem("token");



    return typeof token === "string"

      ? token.trim()

      : "";

  } catch {

    return "";

  }

};



const getStoredUser = () => {

  try {

    if (typeof window === "undefined" || !window.localStorage) {

      return null;

    }



    const raw = window.localStorage.getItem("user");



    if (

      !raw ||

      raw.length > MAX_STORED_USER_LENGTH

    ) {

      return null;

    }



    const parsed = JSON.parse(raw);



    if (

      parsed === null ||

      typeof parsed !== "object" ||

      Array.isArray(parsed)

    ) {

      return null;

    }



    return parsed;

  } catch {

    return null;

  }

};



const isValidObjectId = (value) => {

  const id = String(value ?? "").trim();



  return (

    id.length === MAX_USER_ID_LENGTH &&

    /^[a-fA-F0-9]{24}$/.test(id)

  );

};



const normalizeOrdersResponse = (data) => {

  if (!Array.isArray(data)) {

    return [];

  }



  return data.filter(

    (order) =>

      order &&

      typeof order === "object" &&

      !Array.isArray(order)

  );

};



const safeServerMessage = (error) => {

  const message = error?.response?.data?.message;



  if (

    typeof message !== "string" ||

    !message.trim()

  ) {

    return "";

  }



  return message.trim().slice(0, 300);

};



const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: API_TIMEOUT,

  headers: {

    Accept: "application/json",

  },

});



api.interceptors.request.use(

  (config) => {

    const token = getAuthToken();



    if (!token) {

      return Promise.reject(

        new Error("Session utilisateur absente.")

      );

    }



    config.headers = config.headers || {};

    config.headers.Authorization = `Bearer ${token}`;



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

        "Votre session a expiré ou l'accès à vos commandes est refusé.";

    } else if (

      error?.code === "ECONNABORTED"

    ) {

      error.userMessage =

        "Le serveur met trop de temps à répondre.";

    } else if (!error?.response) {

      error.userMessage =

        "Impossible de contacter le serveur.";

    }



    return Promise.reject(error);

  }

);











export default function ShippedOrders() {







  const navigate = useNavigate();







  const [orders, setOrders] =



    useState([]);







  useEffect(() => {







  const fetchOrders = async () => {

      try {

        const user = getStoredUser();

        const token = getAuthToken();



        if (!token) {

          navigate("/login", { replace: true });

          return;

        }



        const userId = String(

          user?._id ?? ""

        ).trim();



        if (!isValidObjectId(userId)) {

          navigate("/login", { replace: true });

          return;

        }



        const res = await api.get(

          `/api/my-orders/${encodeURIComponent(userId)}`

        );



        const ordersData =

          normalizeOrdersResponse(res.data);



        const filtered =

          ordersData.filter(

            (o) =>

              o.status ===

              "En livraison"

          );



        setOrders(filtered);

      } catch (err) {

        if (

          err?.response?.status === 401 ||

          err?.response?.status === 403

        ) {

          navigate("/login", {

            replace: true,

          });

          return;

        }



        if (import.meta.env?.DEV) {

          const message =

            err?.userMessage ||

            safeServerMessage(err) ||

            "Erreur lors du chargement des commandes.";



          console.warn(

            "[ShippedOrders]",

            message

          );

        }

      }

    };



    fetchOrders();







}, []);







  return (







    <div



      style={{



        background: "#f5f7fb",



        minHeight: "100vh",



        padding: "18px",



      }}



    >







      {/* HEADER */}







<div



  style={{



    background:



      "linear-gradient(135deg,#3B82F6,#2563EB)",







    padding:



      window.innerWidth < 768



        ? "16px"



        : "22px",







    borderRadius: "20px",







    color: "#FFF",







    marginBottom: "18px",







    position: "relative",







    overflow: "hidden",







    boxShadow:



      "0 8px 20px rgba(37,99,235,0.15)",



  }}



>







  {/* GLOW */}







  <div



    style={{



      position: "absolute",



      top: "-60px",



      right: "-60px",



      width: "120px",



      height: "120px",



      borderRadius: "50%",



      background:



        "rgba(255,255,255,0.07)",



    }}



  />







  <div



    style={{



      position: "relative",



      zIndex: 2,



      display: "flex",



      alignItems: "center",



      justifyContent:



        "space-between",



      gap: "12px",



    }}



  >







    {/* LEFT */}







    <div



      style={{



        display: "flex",



        alignItems: "center",



        gap: "12px",



        flex: 1,



      }}



    >







      {/* ICON */}







      <div



        style={{



          width:



            window.innerWidth < 768



              ? "50px"



              : "58px",







          height:



            window.innerWidth < 768



              ? "50px"



              : "58px",







          borderRadius: "16px",







          background:



            "rgba(255,255,255,0.15)",







          display: "flex",







          justifyContent: "center",







          alignItems: "center",







          flexShrink: 0,



        }}



      >







        <FaTruckFast



          style={{



            fontSize:



              window.innerWidth < 768



                ? "22px"



                : "26px",







            color: "#FFFFFF",



          }}



        />







      </div>







      {/* TEXT */}







      <div



        style={{



          minWidth: 0,



        }}



      >







        <h1



          style={{



            margin: 0,







            fontSize:



              window.innerWidth < 768



                ? "18px"



                : "26px",







            fontWeight: "900",







            lineHeight: 1.2,



          }}



        >



          Commandes expédiées



        </h1>







        <p



          style={{



            margin: "4px 0 0 0",







            fontSize:



              window.innerWidth < 768



                ? "12px"



                : "14px",







            opacity: 0.95,







            lineHeight: "20px",



          }}



        >



          Consultez vos commandes en livraison et ouvrez leurs détails.



        </p>







      </div>







    </div>







    {/* BADGE */}







    <div



      style={{



        background:



          "rgba(255,255,255,0.15)",







        padding: "8px 12px",







        borderRadius: "999px",







        fontSize: "13px",







        fontWeight: "800",



      }}



    >



      {orders.length}



    </div>







  </div>







</div>







{/* AUCUNE COMMANDE */}







{orders.length === 0 && (







  <div



    style={{



      background: "#FFFFFF",







      padding:



        window.innerWidth < 768



          ? "32px 18px"



          : "45px 28px",







      borderRadius: "20px",







      textAlign: "center",







      border: "1px solid #E5E7EB",







      boxShadow:



        "0 8px 25px rgba(15,23,42,0.05)",







      position: "relative",







      overflow: "hidden",



    }}



  >







    {/* GLOW */}







    <div



      style={{



        position: "absolute",







        top: "-50px",







        right: "-50px",







        width: "120px",







        height: "120px",







        borderRadius: "50%",







        background:



          "rgba(37,99,235,0.05)",



      }}



    />







    {/* ICON */}







    <div



      style={{



        width:



          window.innerWidth < 768



            ? "75px"



            : "90px",







        height:



          window.innerWidth < 768



            ? "75px"



            : "90px",







        margin: "0 auto 18px",







        borderRadius: "22px",







        background:



          "linear-gradient(135deg,#DBEAFE,#BFDBFE)",







        display: "flex",







        justifyContent: "center",







        alignItems: "center",



      }}



    >







      <FaBoxOpen



        style={{



          fontSize:



            window.innerWidth < 768



              ? "34px"



              : "40px",







          color: "#2563EB",



        }}



      />







    </div>







    {/* BADGE */}







    <div



      style={{



        display: "inline-flex",







        alignItems: "center",







        gap: "8px",







        background: "#EFF6FF",







        color: "#2563EB",







        padding: "8px 14px",







        borderRadius: "999px",







        fontSize: "12px",







        fontWeight: "800",







        marginBottom: "16px",



      }}



    >







      <FaClipboardList />







      Historique vide







    </div>







    {/* TITLE */}







    <h2



      style={{



        color: "#111827",







        fontSize:



          window.innerWidth < 768



            ? "22px"



            : "28px",







        fontWeight: "900",







        marginBottom: "10px",







        lineHeight: 1.2,



      }}



    >



      Aucune commande en livraison



    </h2>







    {/* TEXT */}







    <p



      style={{



        color: "#64748B",







        fontSize:



          window.innerWidth < 768



            ? "14px"



            : "15px",







        lineHeight: "24px",







        maxWidth: "420px",







        margin: "0 auto",







        fontWeight: "500",



      }}



    >



      Les commandes en livraison apparaîtront ici



      automatiquement dès leur mise en livraison.



    </p>







  </div>







)}







      {/* COMMANDES */}







{orders.map((order) => (







<div



  key={order._id}



  onClick={() =>



    navigate(`/order/${order._id}`)



  }



  role="button"



  tabIndex={0}



  onKeyDown={(e) => {



    if (e.key === "Enter" || e.key === " ") {



      e.preventDefault();



      navigate(`/order/${order._id}`);



    }



  }}



  style={{



    background: "#FFFFFF",







    borderRadius: "20px",







    padding:



      window.innerWidth < 768



        ? "16px"



        : "18px",







    marginBottom: "16px",







    border: "1px solid #E5E7EB",







    boxShadow:



      "0 4px 12px rgba(15,23,42,0.05)",







    overflow: "hidden",







    cursor: "pointer",



    WebkitTapHighlightColor: "transparent",



    transition: "transform 0.18s ease, box-shadow 0.18s ease",



  }}



>







          {/* TOP */}







<div



  style={{



    display: "flex",







    justifyContent: "space-between",







    alignItems:



      window.innerWidth < 768



        ? "flex-start"



        : "center",







    gap: "12px",







    flexWrap: "wrap",







    marginBottom: "15px",







    paddingBottom: "14px",







    borderBottom:



      "1px solid #F1F5F9",



  }}



>







  <div



    style={{



      display: "flex",







      alignItems: "center",







      gap: "12px",







      flex: 1,







      minWidth: 0,



    }}



  >







    <div



      style={{



        width: "48px",







        height: "48px",







        borderRadius: "14px",







        background:



          "linear-gradient(135deg,#DBEAFE,#BFDBFE)",







        display: "flex",







        justifyContent: "center",







        alignItems: "center",







        flexShrink: 0,



      }}



    >







      <FaTruckFast



        style={{



          color: "#2563EB",







          fontSize: "22px",



        }}



      />







    </div>







    <div



      style={{



        minWidth: 0,



      }}



    >







      <h2



        style={{



          margin: 0,







          color: "#111827",







          fontSize:



            window.innerWidth < 768



              ? "17px"



              : "19px",







          fontWeight: "800",







          overflow: "hidden",







          textOverflow: "ellipsis",







          whiteSpace: "nowrap",



        }}



      >



        {order.customerName}



      </h2>







      <p



        style={{



          marginTop: "4px",







          marginBottom: 0,







          color: "#64748B",







          fontSize: "13px",







          fontWeight: "500",



        }}



      >



        {order.phone}



      </p>







    </div>







  </div>







  <div



    style={{



      background: "#DBEAFE",







      color: "#2563EB",







      padding: "8px 14px",







      borderRadius: "999px",







      fontSize: "12px",







      fontWeight: "800",







      display: "flex",







      alignItems: "center",







      gap: "6px",







      border:



        "1px solid #BFDBFE",



    }}



  >







    <FaShippingFast />







    En livraison







  </div>







</div>







          {/* PRODUITS */}







{order.items.map(



  (item, index) => (







    <div



      key={index}



      style={{



        display: "flex",



        alignItems: "center",



        justifyContent: "space-between",



        gap: "12px",







        padding: "12px 0",







        borderBottom:



          index !== order.items.length - 1



            ? "1px solid #F1F5F9"



            : "none",



      }}



    >







      {/* LEFT */}







      <div



        style={{



          display: "flex",



          alignItems: "center",



          gap: "12px",







          flex: 1,







          minWidth: 0,



        }}



      >







        <img



            src={



              item.image?.includes("localhost:5000")



                ? item.image.replace(



                    "http://localhost:5000",



                    "https://konanshopping.com/api/"



                  )



                : item.image || "/logo.jpg"



            }







            alt={item.name}







            onError={(e) => {



              e.target.src = "/logo.jpg";



            }}



          style={{



            width: "60px",



            height: "60px",







            borderRadius: "12px",







            objectFit: "cover",







            flexShrink: 0,



          }}



        />







        <div



          style={{



            flex: 1,



            minWidth: 0,



          }}



        >







          <h3



            style={{



              margin: 0,







              color: "#111827",







              fontSize: "15px",







              fontWeight: "700",







              overflow: "hidden",







              textOverflow: "ellipsis",







              whiteSpace: "nowrap",



            }}



          >



            {item.name}



          </h3>







          <div



            style={{



              display: "flex",



              alignItems: "center",



              gap: "6px",







              marginTop: "6px",







              color: "#64748B",







              fontSize: "12px",



            }}



          >







            <FaBox />







            Qté : {item.quantity}







          </div>







        </div>







      </div>







      {/* PRIX */}







      <div



        style={{



          color: "#2563EB",







          fontWeight: "800",







          fontSize:



            window.innerWidth < 768



              ? "15px"



              : "16px",







          whiteSpace: "nowrap",



        }}



      >



        {item.price} FCFA



      </div>







    </div>







  )



)}







{/* FOOTER */}







<div



  style={{



    marginTop: "14px",







    paddingTop: "14px",







    borderTop: "1px solid #E5E7EB",







    display: "flex",







    justifyContent: "space-between",







    alignItems:



      window.innerWidth < 768



        ? "flex-start"



        : "center",







    flexDirection:



      window.innerWidth < 768



        ? "column"



        : "row",







    gap: "12px",



  }}



>







  {/* ADRESSE */}







  <div



    style={{



      display: "flex",







      alignItems: "center",







      gap: "8px",







      color: "#64748B",







      fontSize: "13px",







      fontWeight: "600",



    }}



  >







    <FaMapMarkerAlt



      style={{



        color: "#2563EB",



      }}



    />







    {order.city}







  </div>







  {/* TOTAL */}







  <div



    style={{



      textAlign:



        window.innerWidth < 768



          ? "left"



          : "right",



    }}



  >







    <div



      style={{



        display: "flex",







        alignItems: "center",







        gap: "6px",







        color: "#64748B",







        fontSize: "12px",







        fontWeight: "600",







        justifyContent:



          window.innerWidth < 768



            ? "flex-start"



            : "flex-end",



      }}



    >







      <FaMoneyBillWave



        style={{



          color: "#2563EB",



        }}



      />







      Montant total







    </div>







    <h2



      style={{



        margin: "4px 0 0 0",







        color: "#111827",







        fontSize:



          window.innerWidth < 768



            ? "20px"



            : "24px",







        fontWeight: "900",



      }}



    >



      {order.total} FCFA



    </h2>







  </div>







</div>







</div>







))}







    </div>







  );







}