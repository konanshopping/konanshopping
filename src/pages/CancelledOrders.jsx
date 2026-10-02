import { useEffect, useState } from "react";

import axios from "axios";

import {
  FaCircleXmark,
  FaBoxOpen,
  FaLocationDot,
  FaMoneyBillWave,
  FaBan,
} from "react-icons/fa6";

const API_BASE_URL = (
  import.meta.env?.VITE_API_URL || "https://konanshopping.com"
).replace(/\/$/, "");

const API_TIMEOUT = 15000;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    Accept: "application/json",
  },
});

const readStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return {};
    const parsedUser = JSON.parse(rawUser);
    return parsedUser && typeof parsedUser === "object" ? parsedUser : {};
  } catch {
    return {};
  }
};

const getAuthToken = () => {
  try {
    const keys = ["token", "userToken"];
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (typeof value === "string" && value.trim().length >= 20) {
        return value.trim();
      }
    }
  } catch {
    return null;
  }

  return null;
};

const getAuthConfig = () => {
  const token = getAuthToken();

  return {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

const isValidMongoId = (value) =>
  typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);

const isValidOrder = (order) =>
  order &&
  typeof order === "object" &&
  typeof order._id === "string" &&
  isValidMongoId(order._id);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      error.authError = true;
    }

    if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
      error.timeoutError = true;
    }

    return Promise.reject(error);
  }
);

export default function CancelledOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const user = readStoredUser();
        const userId = user?._id;

        if (!isValidMongoId(userId)) {
          if (!cancelled) setOrders([]);
          return;
        }

        const res = await apiClient.get(
          `/api/my-orders/${encodeURIComponent(userId)}`,
          getAuthConfig()
        );

        if (cancelled) return;

        const data = Array.isArray(res?.data) ? res.data : [];

        const filtered = data
          .filter(isValidOrder)
          .filter((o) => o.status === "Annulée");

        setOrders(filtered);
      } catch (err) {
        if (cancelled) return;

        console.error("Erreur lors du chargement des commandes annulées.", err);
        setOrders([]);
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);

return (



    <div

      style={{

        background: "#f5f7fb",

        minHeight: "100vh",

        padding: "18px",

      }}

    >



    {/\* HEADER \*/}



<div

  style={{

    background:

      "linear-gradient(135deg,#EF4444,#DC2626)",



    padding:

      window.innerWidth < 768

        ? "16px"

        : "22px",



    borderRadius: "20px",



    color: "#FFFFFF",



    marginBottom: "18px",



    position: "relative",



    overflow: "hidden",



    boxShadow:

      "0 8px 20px rgba(239,68,68,0.15)",

  }}

>



  {/\* GLOW \*/}



  <div

    style={{

      position: "absolute",



      top: "-60px",



      right: "-60px",



      width: "120px",



      height: "120px",



      borderRadius: "50%",



      background:

        "rgba(255,255,255,0.08)",

    }}

  />



  {/\* CONTENT \*/}



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



    {/\* LEFT \*/}



    <div

      style={{

        display: "flex",



        alignItems: "center",



        gap: "12px",



        flex: 1,

      }}

    >



      {/\* ICON \*/}



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



        <i

          className="fa-solid fa-circle-xmark"

          style={{

            fontSize:

              window.innerWidth < 768

                ? "22px"

                : "26px",



            color: "#FFFFFF",

          }}

        />



      </div>



      {/\* TEXT \*/}



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

          Commandes annulées

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

          Consultez toutes vos commandes annulées.

        </p>



      </div>



    </div>



    {/\* BADGE \*/}



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



{/\* AUCUNE COMMANDE \*/}



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



    {/\* GLOW \*/}



    <div

      style={{

        position: "absolute",



        top: "-50px",



        right: "-50px",



        width: "120px",



        height: "120px",



        borderRadius: "50%",



        background:

          "rgba(239,68,68,0.05)",

      }}

    />



    {/\* ICON \*/}



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

          "linear-gradient(135deg,#FEE2E2,#FECACA)",



        display: "flex",



        justifyContent: "center",



        alignItems: "center",

      }}

    >



      <i

        className="fa-solid fa-circle-xmark"

        style={{

          fontSize:

            window.innerWidth < 768

              ? "34px"

              : "40px",



          color: "#DC2626",

        }}

      />



    </div>



    {/\* BADGE \*/}



    <div

      style={{

        display: "inline-flex",



        alignItems: "center",



        gap: "8px",



        background: "#FEF2F2",



        color: "#DC2626",



        padding: "8px 14px",



        borderRadius: "999px",



        fontSize: "12px",



        fontWeight: "800",



        marginBottom: "16px",

      }}

    >



      <i className="fa-solid fa-ban"></i>



      Aucune annulation



    </div>



    {/\* TITLE \*/}



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

      Aucune commande annulée

    </h2>



    {/\* TEXT \*/}



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

      Les commandes annulées apparaîtront ici

      automatiquement lorsqu'une commande sera annulée.

    </p>



  </div>



)}



      {/\* COMMANDES \*/}



{orders.map((order) => (



<div

  key={order._id}



  onClick={() =>

    window.location.href =

      `/order/${order._id}`

  }



  style={{

    background: "#FFFFFF",



    borderRadius: "20px",



    padding:

      window.innerWidth < 768

        ? "14px"

        : "18px",



    marginBottom: "16px",



    border: "1px solid #E5E7EB",



    boxShadow:

      "0 4px 12px rgba(15,23,42,0.05)",



    cursor: "pointer",



    transition: "0.3s ease",

  }}

>



{/\* TOP \*/}



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



    marginBottom: "14px",



    paddingBottom: "14px",



    borderBottom:

      "1px solid #F1F5F9",

  }}

>



  {/\* CLIENT \*/}



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

          "linear-gradient(135deg,#FEE2E2,#FECACA)",



        display: "flex",



        justifyContent: "center",



        alignItems: "center",



        flexShrink: 0,

      }}

    >



      <i

        className="fa-solid fa-circle-xmark"

        style={{

          color: "#DC2626",



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

          margin: "4px 0 0 0",



          color: "#64748B",



          fontSize: "13px",



          fontWeight: "500",

        }}

      >

        {order.phone}

      </p>



    </div>



  </div>



  {/\* STATUS \*/}



  <div

    style={{

      background: "#FEE2E2",



      color: "#DC2626",



      padding: "8px 14px",



      borderRadius: "999px",



      fontSize: "12px",



      fontWeight: "800",



      display: "flex",



      alignItems: "center",



      gap: "6px",



      border:

        "1px solid #FECACA",

    }}

  >



    <i className="fa-solid fa-ban"></i>



    Annulée



  </div>



</div>



{/\* PRODUITS \*/}



{(Array.isArray(order.items) ? order.items : []).map(

  (item, index) => (



    <div

      key={index}

      style={{

        display: "flex",



        alignItems: "center",



        justifyContent:

          "space-between",



        gap: "12px",



        padding: "12px 0",



        borderBottom:

          index !==

          order.items.length - 1

            ? "1px solid #F1F5F9"

            : "none",

      }}

    >



      {/\* LEFT \*/}



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

              typeof item.image === "string" && item.image.includes("localhost:5000")

                ? item.image.replace(

                    "http://localhost:5000",

                    "https://konanshopping.com/api/"

                  )

                : item.image || "/logo.jpg"

            }



            alt={item.name}



            onError={(e) => {

              e.currentTarget.src = "/logo.jpg";

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



            <i className="fa-solid fa-box"></i>



            Qté : {item.quantity}



          </div>



        </div>



      </div>



      {/\* PRIX \*/}



      <div

        style={{

          color: "#DC2626",



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



         {/\* FOOTER \*/}



<div

  style={{

    marginTop: "14px",



    paddingTop: "14px",



    borderTop:

      "1px solid #E5E7EB",



    display: "flex",



    justifyContent:

      "space-between",



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



  {/\* ADRESSE \*/}



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



    <i

      className="fa-solid fa-location-dot"

      style={{

        color: "#DC2626",

      }}

    ></i>



    {order.city}



  </div>



  {/\* TOTAL \*/}



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



      <i

        className="fa-solid fa-money-bill-wave"

        style={{

          color: "#DC2626",

        }}

      ></i>



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