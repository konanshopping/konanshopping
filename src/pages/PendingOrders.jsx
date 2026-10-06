import { useEffect, useState } from "react";



import axios from "axios";







import {



  FaHourglassHalf,



  FaBoxOpen,



  FaClipboardList,



  FaShoppingBag,



  FaMoneyBillWave,



  FaCheckCircle,



  FaTruck,



} from "react-icons/fa";









const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;

const MAX_USER_ID_LENGTH = 24;

const MAX_ORDERS = 200;



const getStoredUser = () => {

  try {

    const rawUser = localStorage.getItem("user");

    if (!rawUser) return null;



    const user = JSON.parse(rawUser);



    if (!user || typeof user !== "object") return null;



    return user;

  } catch {

    return null;

  }

};



// ======================================================
// 🔐 AUTHENTIFICATION PAR COOKIE HTTPONLY
// ======================================================
// Le frontend ne lit plus le JWT.
// Le navigateur envoie automatiquement le cookie HttpOnly.
// Le backend reste responsable de la vérification de la session.
// ======================================================

axios.defaults.withCredentials = true;

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
        "Votre session a expiré ou l'accès à vos commandes est refusé.";
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

const getSafeErrorMessage = (error) => {

  const message = error?.response?.data?.message;



  if (typeof message === "string" && message.trim()) {

    return message.trim().slice(0, 300);

  }



  if (typeof error?.userMessage === "string") {

    return error.userMessage;

  }



  return "Impossible de récupérer vos commandes.";

};



export default function PendingOrders() {







  const [orders, setOrders] =



    useState([]);







  useEffect(() => {







  const fetchOrders = async () => {

    try {

      const user = getStoredUser();

      const userId =

        typeof user?._id === "string" ? user._id.trim() : "";



      if (

        !userId ||

        userId.length > MAX_USER_ID_LENGTH ||

        !isValidObjectId(userId)

      ) {

        setOrders([]);

        return;

      }



      const response = await api.get(

        `/api/my-orders/${encodeURIComponent(userId)}`

      );



      const safeOrders = normalizeOrders(response?.data);



      const filtered = safeOrders.filter(

        (order) => order.status === "En attente"

      );



      setOrders(filtered);

    } catch (err) {

      if (import.meta?.env?.DEV) {

        console.warn("[PendingOrders]", getSafeErrorMessage(err));

      }



      setOrders([]);

    }

  };



  fetchOrders();







}, []);







;







return (







  <div



    style={{



      background: "#f5f7fb",



      minHeight: "100vh",



      padding: "20px",



    }}



  >







    {/* HEADER */}







    <div



      style={{



        background:



          "linear-gradient(135deg,#2563EB,#1D4ED8)",







        padding:



          window.innerWidth < 768



            ? "14px"



            : "18px",







        borderRadius: "18px",







        color: "#FFFFFF",







        marginBottom: "18px",







        position: "relative",







        overflow: "hidden",







        boxShadow:



          "0 8px 20px rgba(37,99,235,0.12)",



      }}



    >







      {/* GLOW */}







      <div



        style={{



          position: "absolute",







          top: "-40px",







          right: "-40px",







          width: "100px",







          height: "100px",







          borderRadius: "50%",







          background:



            "rgba(255,255,255,0.06)",



        }}



      />







      {/* CONTENT */}







      <div



        style={{



          position: "relative",







          zIndex: 2,







          display: "flex",







          alignItems: "center",







          gap: "12px",



        }}



      >







        {/* ICON */}







        <div



          style={{



            width:



              window.innerWidth < 768



                ? "45px"



                : "50px",







            height:



              window.innerWidth < 768



                ? "45px"



                : "50px",







            borderRadius: "14px",







            background:



              "rgba(255,255,255,0.15)",







            display: "flex",







            justifyContent: "center",







            alignItems: "center",







            flexShrink: 0,



          }}



        >







          <FaHourglassHalf



            style={{



              fontSize:



                window.innerWidth < 768



                  ? "18px"



                  : "20px",







              color: "#FFFFFF",



            }}



          />







        </div>







        {/* TEXT */}







        <div



          style={{



            flex: 1,



            minWidth: 0,



          }}



        >







          <h1



            style={{



              margin: 0,







              fontSize:



                window.innerWidth < 768



                  ? "20px"



                  : "24px",







              fontWeight: "800",







              lineHeight: 1.2,



            }}



          >



            Commandes en attente



          </h1>







          <p



            style={{



              margin: "4px 0 0 0",







              fontSize:



                window.innerWidth < 768



                  ? "12px"



                  : "13px",







              opacity: 0.9,







              lineHeight: "18px",



            }}



          >



            Suivez vos commandes en cours de traitement.



          </p>







        </div>







        {/* BADGE */}







        <div



          style={{



            background:



              "rgba(255,255,255,0.15)",







            padding: "5px 10px",







            borderRadius: "999px",







            fontSize: "11px",







            fontWeight: "700",



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



          ? "28px 18px"



          : "40px 25px",







      borderRadius: "20px",







      textAlign: "center",







      border: "1px solid #E5E7EB",







      boxShadow:



        "0 8px 20px rgba(15,23,42,0.05)",







      position: "relative",







      overflow: "hidden",



    }}



  >







    {/* GLOW */}







    <div



      style={{



        position: "absolute",







        top: "-40px",







        right: "-40px",







        width: "100px",







        height: "100px",







        borderRadius: "50%",







        background:



          "rgba(37,99,235,0.04)",



      }}



    />







    {/* ICON */}







    <div



      style={{



        width:



          window.innerWidth < 768



            ? "70px"



            : "85px",







        height:



          window.innerWidth < 768



            ? "70px"



            : "85px",







        margin: "0 auto 16px",







        borderRadius: "20px",







        background:



          "linear-gradient(135deg,#EEF2FF,#DBEAFE)",







        display: "flex",







        justifyContent: "center",







        alignItems: "center",



      }}



    >







      <FaBoxOpen



        style={{



          fontSize:



            window.innerWidth < 768



              ? "28px"



              : "34px",







          color: "#2563EB",



        }}



      />







    </div>







    {/* BADGE */}







    <div



      style={{



        display: "inline-flex",







        alignItems: "center",







        gap: "6px",







        background: "#EFF6FF",







        color: "#2563EB",







        padding: "6px 12px",







        borderRadius: "999px",







        fontSize: "11px",







        fontWeight: "700",







        marginBottom: "14px",



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



            ? "20px"



            : "24px",







        fontWeight: "800",







        marginBottom: "8px",







        lineHeight: 1.2,



      }}



    >



      Aucune commande en attente



    </h2>







    {/* TEXT */}







    <p



      style={{



        color: "#64748B",







        fontSize:



          window.innerWidth < 768



            ? "13px"



            : "14px",







        lineHeight: "22px",







        maxWidth: "420px",







        margin: "0 auto",



      }}



    >



      Vous n'avez actuellement aucune commande en cours de traitement.



    </p>







  </div>







)}







{/* COMMANDES */}







{orders.map((order) => (







<div



  key={order._id}



  onClick={() =>



    window.location.href =



      `/order/${order._id}`



  }



  style={{



    background: "#FFFFFF",







    borderRadius: "18px",







    padding: "16px",







    marginBottom: "16px",







    boxShadow:



      "0 4px 15px rgba(15,23,42,0.05)",







    border: "1px solid #E5E7EB",







    cursor: "pointer",







    transition: "0.3s",



  }}



>







{/* TOP */}







<div



  style={{



    display: "flex",







    justifyContent: "space-between",







    alignItems: "center",







    gap: "10px",







    marginBottom: "12px",







    paddingBottom: "12px",







    borderBottom:



      "1px solid #F1F5F9",



  }}



>







  {/* LEFT */}







  <div



    style={{



      display: "flex",







      alignItems: "center",







      gap: "10px",







      flex: 1,







      minWidth: 0,



    }}



  >







    {/* ICON */}







    <div



      style={{



        width: "42px",







        height: "42px",







        borderRadius: "12px",







        background:



          "#EFF6FF",







        display: "flex",







        justifyContent: "center",







        alignItems: "center",







        flexShrink: 0,



      }}



    >







      <FaClipboardList



        style={{



          color: "#2563EB",







          fontSize: "18px",



        }}



      />







    </div>







    {/* INFO */}







    <div



      style={{



        flex: 1,







        minWidth: 0,



      }}



    >







      <h2



        style={{



          margin: 0,







          color: "#0F172A",







          fontSize: "16px",







          fontWeight: "800",



        }}



      >



        Commande



      </h2>







      <p



        style={{



          color: "#64748B",







          margin: "3px 0 0 0",







          fontSize: "11px",







          overflow: "hidden",







          textOverflow: "ellipsis",







          whiteSpace: "nowrap",



        }}



      >



        #{order._id}



      </p>







    </div>







  </div>







  {/* STATUS */}







  <div



    style={{



      background: "#FEF3C7",







      color: "#92400E",







      padding: "6px 10px",







      borderRadius: "999px",







      fontSize: "11px",







      fontWeight: "700",







      display: "flex",







      alignItems: "center",







      gap: "5px",



    }}



  >







    <FaHourglassHalf />







    En attente







  </div>







</div>











{/* PRODUITS */}







<div



  style={{



    display: "flex",



    flexDirection: "column",



    gap: "10px",



    marginBottom: "15px",



  }}



>







  {order.items?.map((item, index) => (







    <div



      key={index}



      style={{



        display: "flex",



        alignItems: "center",



        justifyContent: "space-between",



        gap: "12px",







        padding: "10px",







        borderRadius: "14px",







        background: "#F8FAFC",







        border: "1px solid #E2E8F0",



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







        {/* IMAGE */}







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



          style={{



            width: "60px",



            height: "60px",



            objectFit: "cover",



            borderRadius: "12px",



            flexShrink: 0,



          }}



        />







        {/* INFOS */}







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







              fontSize: "14px",







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



              marginTop: "4px",







              display: "flex",







              alignItems: "center",







              gap: "5px",







              color: "#64748B",







              fontSize: "12px",



            }}



          >







            <FaBoxOpen />







            Qté : {item.quantity || 1}







          </div>







        </div>







      </div>







      {/* PRIX */}







      <div



        style={{



          textAlign: "right",



          flexShrink: 0,



        }}



      >







        <span



          style={{



            color: "#2563EB",







            fontSize: "14px",







            fontWeight: "800",



          }}



        >



          {item.price} FCFA



        </span>







      </div>







    </div>







  ))}







</div>







{/* FOOTER */}







<div



  style={{



    marginTop: "12px",







    paddingTop: "12px",







    borderTop:



      "1px solid #E5E7EB",







    display: "flex",







    justifyContent:



      "space-between",







    alignItems: "center",







    gap: "10px",







    flexWrap: "wrap",



  }}



>







  {/* TOTAL */}







  <div>







    <div



      style={{



        display: "flex",







        alignItems: "center",







        gap: "5px",







        color: "#64748B",







        fontSize: "11px",







        fontWeight: "600",



      }}



    >







      <FaMoneyBillWave



        style={{



          color: "#2563EB",



        }}



      />







      Total







    </div>







    <h2



      style={{



        margin: "4px 0 0 0",







        color: "#0F172A",







        fontSize:



          window.innerWidth < 768



            ? "22px"



            : "24px",







        fontWeight: "800",



      }}



    >



      {order.total} FCFA



    </h2>







  </div>







  {/* STATUS */}







  <div



    style={{



      background: "#DCFCE7",







      color: "#15803D",







      padding: "6px 10px",







      borderRadius: "999px",







      fontSize: "11px",







      fontWeight: "700",







      display: "flex",







      alignItems: "center",







      gap: "5px",



    }}



  >







    <FaCheckCircle />







    Enregistrée







  </div>







</div>







{/* BOUTON */}







<button



  style={{



    width: "100%",







    marginTop: "12px",







    border: "none",







    background:



      "linear-gradient(135deg,#2563EB,#1D4ED8)",







    color: "#FFFFFF",







    padding: "12px",







    borderRadius: "12px",







    fontWeight: "700",







    fontSize: "13px",







    cursor: "pointer",







    display: "flex",







    justifyContent: "center",







    alignItems: "center",







    gap: "8px",



  }}



>







  <FaTruck />







  Suivre la livraison







</button>







</div>







))}







    </div>







  );







}