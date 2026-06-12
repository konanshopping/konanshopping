import axios from "axios";

import {
  useState,
  useEffect,
} from "react";

import emailjs from "@emailjs/browser";

import Confetti from "react-confetti";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import {
  FaShoppingCart,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaMoneyBillWave,
  FaTruck,
  FaLock,
  FaCheckCircle,
  FaBoxOpen,
  FaTag
} from "react-icons/fa";

import {
  FaCreditCard,
  FaRocket,
  FaSpinner
} from "react-icons/fa";


import {
  FaWallet,
  FaShieldAlt
} from "react-icons/fa";

function Checkout() {

const user = JSON.parse(
  localStorage.getItem("user")
);

const clientId =
  user?._id ||
  localStorage.getItem("guestId");

const navigate = useNavigate();

const [location, setLocation] = useState(null);

  // =========================
  // STATES
  // ========================

  const [cart, setCart] =
    useState([]);
 

  const [customerName,
    setCustomerName] =
    useState("");

  const [city, setCity] =
    useState("");

  const [district,
    setDistrict] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address,
    setAddress] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [showConfetti,
    setShowConfetti] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [success,
    setSuccess] =
    useState(false);

  const [paymentMethod,
    setPaymentMethod] =
    useState(
      "Paiement à la livraison"
    );

  const [coupon,
    setCoupon] =
    useState("");

  const [discount,
    setDiscount] =
    useState(0);

useEffect(() => {

  // =====================
  // PANIER COMPLET BOUTIQUE
  // =====================

  const checkoutCart =

    JSON.parse(

      localStorage.getItem(

        `checkoutCart_${clientId}`

      )

    );

  if (
    checkoutCart &&
    checkoutCart.length > 0
  ) {

    setCart(checkoutCart);

    return;

  }

  // =====================
  // ACHAT DIRECT
  // =====================

  const checkoutProduct =

    JSON.parse(

      localStorage.getItem(

        `checkoutProduct_${clientId}`

      )

    );

  if (
    checkoutProduct &&
    !localStorage.getItem(
      `cart_${clientId}`
    )
  ) {

    setCart([
      checkoutProduct
    ]);

    return;

  }

  // =====================
  // PANIER NORMAL CLIENT
  // =====================

  const clientCartKey =
    `cart_${clientId}`;
  const savedCart =

    JSON.parse(

      localStorage.getItem(
        clientCartKey
      )

    ) || [];

  setCart(savedCart);

}, []);

  // =========================
  // TOTALS
  // =========================

  const total = cart.reduce(

    (acc, item) =>

      acc +

      (Number(item.price) || 0) *

      (Number(item.quantity) || 1),

    0
  );

  // =========================
// LIVRAISON
// =========================

const shipping =

  total >= 50000

    ? 0

    : city === ""

    ? 0

    : city === "Douala"

    ? 2000

    : city === "Yaoundé"

    ? 1500

    : city === "Bafoussam"

    ? 2500

    : 3000;

  const finalTotal =

  total +

  shipping -

  discount;

  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = (id) => {

  const updated =

    cart.filter(
      (item) =>
        item._id !== id
    );

  setCart(updated);

  console.log("Après suppression =", updated);
console.log("Taille =", updated.length);

  // =====================
  // CLIENT CONNECTÉ
  // =====================

  const user =

    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const clientId =

    user?._id ||

    localStorage.getItem(
      "guestId"
    );

  // =====================
  // PANIER PRIVÉ CLIENT
  // =====================

  const clientCartKey =
    `cart_${clientId}`;

  localStorage.setItem(

    clientCartKey,

    JSON.stringify(updated)

  );

  // =====================
  // UPDATE COUNT
  // =====================

  localStorage.setItem(

    "cartCount",

    updated.length

  );

  // =====================
  // EVENT UPDATE
  // =====================

  window.dispatchEvent(
    new Event("cartUpdated")
  );

};

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = (
    id,
    type
  ) => {

    const updated =
      cart.map((item) => {

        if (
          item._id === id
        ) {

          return {

            ...item,

            quantity:

              type === "plus"

                ? item.quantity + 1

                : Math.max(
                    1,
                    item.quantity - 1
                  ),
          };

        }

        return item;

      });

    setCart(updated);

    localStorage.setItem(
  `cart_${clientId}`,
  JSON.stringify(updated)
);

  };

  // =========================
  // COUPON
  // =========================

  const applyCoupon =
  async () => {

    try {

      const res =
        await axios.post(

          "https://konanshopping-production.up.railway.app/apply-coupon",

          {

            code: coupon,

            total,

          }

        );

      setDiscount(
        res.data.discount
      );

      toast.success(
        "Coupon appliqué ✅"
      );

    }

    catch (err) {

      toast.error(

        err.response?.data
          ?.message ||

        "Coupon invalide"

      );

    }

  };

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async () => {

    // VALIDATION

    if (

      !customerName ||

      !phone ||

      !email ||

      !address ||

      !city ||

      !district ||

      cart.length === 0

    ) {

      toast.warning(
        "Veuillez remplir toutes les informations obligatoires ⚠️"
      );

      return;

    }

    try {

      setLoading(true);

      // SAVE ORDER

console.log(location);

const driver = JSON.parse(
  localStorage.getItem("driver")
);

const user = JSON.parse(
  localStorage.getItem("user")
);

await axios.post(

  "https://konanshopping-production.up.railway.app/orders",

  {

    userId:
      user?._id || null,

    

    customerName,

    phone,

    email,

    address,

    city,

    district,

    lat: location?.lat,
    lng: location?.lng,

    paymentMethod,

    items: cart,

    total: finalTotal,

    shipping,

    status: "En attente",

    // =====================
    // DRIVER
    // =====================

    driverName:
driver?.name || "",

driverPhone:
driver?.phone || "",

driverPhoto:
driver?.photo || "",

  }

);

      // EMAIL

      await emailjs.send(

        "service_0jsiozi",

        "template_tq69cv9",

        {

          name: customerName,

          email: email,

          order_id: Date.now(),

          payment: paymentMethod,

          products: cart

            .map(

              (item) =>

                `${item.name} x${item.quantity} - ${item.price} FCFA`

            )

            .join("\n"),

          subtotal: total,

          shipping: shipping,

          total: finalTotal,

        },

        "IwYaZmIgiiz6YIWck"

      );

      // SUCCESS

      setShowConfetti(true);

      setSuccess(true);

      setTimeout(() => {

        setShowConfetti(false);

      }, 10000);

      localStorage.removeItem(
  "cart"
);

localStorage.removeItem(
  `checkoutCart_${clientId}`
);

localStorage.removeItem(
  `checkoutProduct_${clientId}`
);

localStorage.removeItem(
  `cart_${clientId}`
);

setCart([]);

console.log("Avant suppression");
console.log(localStorage.getItem(`checkoutCart_${clientId}`));

localStorage.removeItem(`checkoutCart_${clientId}`);

console.log("Après suppression");
console.log(localStorage.getItem(`checkoutCart_${clientId}`));

console.log(localStorage);

      setTimeout(() => {

  navigate("/success");

}, 2500);

    }

    catch (err) {

      console.log(err);

      toast.error(
        "Erreur lors de la commande ❌"
      );

    }

    finally {

      setLoading(false);

    }

  };

const cardStyle = {

  background: "white",

  padding:
    window.innerWidth < 768
      ? "22px"
      : "28px",

  borderRadius: "26px",

  boxShadow:
    "0 12px 35px rgba(0,0,0,0.05)",

  border:
    "1px solid rgba(255,255,255,0.8)",

  backdropFilter: "blur(10px)",
};

if (!Array.isArray(cart)) {
  return <h1>Erreur panier</h1>;
}


  // =========================
  // UI
  // =========================

console.log("Cart =", cart);
console.log("Cart length =", cart.length);

  return (

    <>

   {showConfetti && (
  <Confetti
    numberOfPieces={500}
    recycle={false}
  />
)}

      <div
        style={{
          minHeight: "100vh",

          background:
            "linear-gradient(135deg,#f9fafb,#eef2ff)",

          padding:
            window.innerWidth < 768
              ? "20px"
              : "50px",

          fontFamily: "Arial",
        }}
      >

        {/* TITLE */}

        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "35px",
  }}
>

  <FaShoppingCart
    style={{
      fontSize:
        window.innerWidth < 768
          ? "38px"
          : "58px",

      color: "#5b6cff",
    }}
  />

  <h1
    style={{
      fontSize:
        window.innerWidth < 768
          ? "36px"
          : "58px",

      margin: 0,

      color: "#111827",

      fontWeight: "900",
    }}
  >
    Validation Commande
  </h1>

</div>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:

              window.innerWidth < 768

                ? "1fr"

                : "1.2fr 0.8fr",

            gap: "30px",
          }}
        >

          {/* LEFT */}

          <div
            style={cardStyle}
          >

            <h2
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
    color: "#111827",
  }}
>
  <FaUser
    style={{
      color: "#5b6cff",
    }}
  />

  Informations client
</h2>

            <div
  style={{
    position: "relative",
  }}
>

  <FaUser
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
      fontSize: "15px",
    }}
  />

  <input
    type="text"
    placeholder="Nom complet"
    required
    value={customerName}
    onChange={(e) =>
      setCustomerName(
        e.target.value
      )
    }
    style={{
      ...inputStyle,
      paddingLeft: "45px",
    }}
  />

</div>

        <div
  style={{
    ...inputStyle,

    display: "flex",

    alignItems: "center",

    padding: "0",

    overflow: "hidden",
  }}
>

  {/* INDICATIF */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap: "10px",

      padding: "0 15px",

      height: "100%",

      borderRight:
        "1px solid #eee",

      background: "#fafafa",

      minWidth: "150px",
    }}
  >

    <FaPhone
      style={{
        color: "#5b6cff",
        fontSize: "14px",
      }}
    />

    <select
      style={{
        border: "none",

        outline: "none",

        background: "transparent",

        fontWeight: "600",

        fontSize: "15px",

        cursor: "pointer",
      }}
    >

      <option>
        🇨🇲 +237
      </option>

      <option>
        🇫🇷 +33
      </option>

      <option>
        🇺🇸 +1
      </option>

      <option>
        🇳🇬 +234
      </option>

    </select>

  </div>

  {/* INPUT */}

  <input
    type="text"

    placeholder="Téléphone"

    required

    value={phone}

    onChange={(e) =>
      setPhone(
        e.target.value
      )
    }

    style={{
      flex: 1,

      border: "none",

      outline: "none",

      height: "50px",

      padding: "0 20px",

      fontSize: "15px",

      background: "white",
    }}
  />

</div>


           <div
  style={{
    position: "relative",
  }}
>

  <FaEnvelope
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
    }}
  />

  <input
    type="email"
    placeholder="Votre email"
    required
    value={email}
    onChange={(e) =>
      setEmail(
        e.target.value
      )
    }
    style={{
      ...inputStyle,
      paddingLeft: "45px",
    }}
  />

</div>

            <div
  style={{
    position: "relative",
  }}
>

  <FaMapMarkerAlt
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
    }}
  />

  <input
    type="text"
    placeholder="Adresse livraison"
    required
    value={address}
    onChange={(e) =>
      setAddress(
        e.target.value
      )
    }
    style={{
      ...inputStyle,
      paddingLeft: "45px",
    }}
  />

</div>

           <div
  style={{
    position: "relative",
    marginBottom: "20px",
  }}
>

  <FaCity
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
      fontSize: "15px",
      zIndex: 1,
    }}
  />

  <select
    required

    value={city}

    onChange={(e) =>
      setCity(
        e.target.value
      )
    }

    style={{
      ...inputStyle,

      paddingLeft: "45px",

      background:
        "linear-gradient(135deg,#ffffff,#f9fafb)",

      border:
        "1px solid #e5e7eb",

      borderRadius: "16px",

      boxShadow:
        "0 4px 10px rgba(0,0,0,0.03)",

      appearance: "none",

      cursor: "pointer",

      fontWeight: "500",
    }}
  >

    <option value="">
      Choisir une ville
    </option>

    <option value="Douala">
      Douala
    </option>

    <option value="Yaoundé">
      Yaoundé
    </option>

    <option value="Bafoussam">
      Bafoussam
    </option>

    <option value="Autres">
      Autres villes
    </option>

  </select>

</div>

            <div
  style={{
    position: "relative",
  }}
>

  <FaCity
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
      fontSize: "15px",
    }}
  />

  <input
    type="text"

    placeholder="Votre quartier"

    required

    value={district}

    onChange={(e) =>
      setDistrict(
        e.target.value
      )
    }

    style={{
      ...inputStyle,

      paddingLeft: "45px",

      background:
        "linear-gradient(135deg,#ffffff,#f9fafb)",

      border:
        "1px solid #e5e7eb",

      borderRadius: "16px",

      boxShadow:
        "0 4px 10px rgba(0,0,0,0.03)",

      transition: "0.3s",
    }}
  />

</div>

            {/* PAYMENT */}

<div
  style={{
    position: "relative",
    marginBottom: "20px",
  }}
>

  <FaMoneyBillWave
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
      fontSize: "15px",
      zIndex: 1,
    }}
  />

  <select
    value={paymentMethod}

    onChange={(e) =>
      setPaymentMethod(
        e.target.value
      )
    }

    style={{
      ...inputStyle,

      paddingLeft: "45px",

      background:
        "linear-gradient(135deg,#ffffff,#f9fafb)",

      border:
        "1px solid #e5e7eb",

      borderRadius: "16px",

      boxShadow:
        "0 4px 10px rgba(0,0,0,0.03)",

      appearance: "none",

      cursor: "pointer",
    }}
  >

    <option>
      Paiement à la livraison
    </option>

    <option>
      Orange Money
    </option>

    <option>
      MTN Mobile Money
    </option>

  </select>

</div>

{/* COUPON */}

<div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  }}
>

  <div
    style={{
      position: "relative",
      flex: 1,
    }}
  >

    <FaTag
      style={{
        position: "absolute",
        top: "18px",
        left: "15px",
        color: "#6b7280",
        fontSize: "15px",
      }}
    />

    <input
      type="text"

      placeholder="Code promo"

      value={coupon}

      onChange={(e) =>
        setCoupon(
          e.target.value
        )
      }

      style={{
        width: "100%",

        padding:
          "15px 15px 15px 45px",

        borderRadius: "16px",

        border:
          "1px solid #e5e7eb",

        background:
          "linear-gradient(135deg,#ffffff,#f9fafb)",

        boxShadow:
          "0 4px 10px rgba(0,0,0,0.03)",

        outline: "none",

        fontSize: "15px",
      }}
    />

  </div>

  <button

    onClick={applyCoupon}

    style={{
      padding: "15px 22px",

      border: "none",

      borderRadius: "16px",

      background:
        "linear-gradient(135deg,#6d28d9,#4f46e5)",

      color: "white",

      fontWeight: "800",

      cursor: "pointer",

      boxShadow:
        "0 8px 18px rgba(79,70,229,0.25)",

      transition: "0.3s",

      whiteSpace: "nowrap",
    }}

    onMouseEnter={(e) => {

      e.currentTarget.style.transform =
        "translateY(-2px)";

    }}

    onMouseLeave={(e) => {

      e.currentTarget.style.transform =
        "translateY(0px)";

    }}
  >
    🎁 Appliquer
  </button>

</div>

          </div>

          {/* RIGHT */}

          <div
            style={cardStyle}
          >

            <h2
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
    color: "#111827",
    fontSize: "28px",
    fontWeight: "800",
  }}
>
  <FaBoxOpen
    style={{
      color: "#5b6cff",
      fontSize: "28px",
    }}
  />

  Votre commande
</h2>

{cart.length === 0 && (

  <div
    style={{
      marginTop: "25px",
      padding: "40px 25px",
      borderRadius: "24px",
      background:
        "linear-gradient(135deg,#ffffff,#f8fafc)",
      border: "1px solid #e5e7eb",
      textAlign: "center",
      boxShadow:
        "0 10px 25px rgba(0,0,0,0.05)",
    }}
  >

    <FaShoppingCart
      style={{
        fontSize: "60px",
        color: "#cbd5e1",
        marginBottom: "15px",
      }}
    />

    <h2
      style={{
        margin: 0,
        color: "#111827",
        fontSize: "24px",
        fontWeight: "800",
      }}
    >
      Votre panier est vide
    </h2>

    <p
      style={{
        marginTop: "12px",
        color: "#6b7280",
        fontSize: "15px",
        lineHeight: "1.6",
      }}
    >
      Vous n'avez actuellement aucun produit dans votre panier.
      Parcourez notre boutique et ajoutez vos articles préférés pour passer commande.
    </p>

    <button
      onClick={() => navigate("/")}
      style={{
        marginTop: "20px",
        padding: "14px 25px",
        border: "none",
        borderRadius: "14px",
        background:
          "linear-gradient(135deg,#5b6cff,#7c4dff)",
        color: "white",
        fontWeight: "700",
        cursor: "pointer",
      }}
    >
      Continuer mes achats
    </button>

  </div>

)}

{cart.map((item, index) => (
  <div
    key={item._id}

    style={{
      display: "flex",

      alignItems: "center",

      gap: "18px",

      marginTop: "20px",

      background:
        "linear-gradient(135deg,#ffffff,#f8faff)",

      padding: "18px",

      borderRadius: "22px",

      boxShadow:
        "0 8px 20px rgba(0,0,0,0.04)",

      border:
        "1px solid #eef2ff",
    }}
  >

    {/* IMAGE */}

    <img
      src={item.image}

      alt=""

      style={{
        width: "90px",

        height: "90px",

        objectFit: "cover",

        borderRadius: "18px",

        background: "#f3f4f6",

        padding: "5px",
      }}
    />

    {/* CONTENT */}

    <div
      style={{
        flex: 1,
      }}
    >

      <h3
        style={{
          margin: 0,
          fontSize: "18px",
          color: "#111827",
        }}
      >
        {item.name}
      </h3>

      <p
        style={{
          color: "#6b7280",
          marginTop: "8px",
          fontSize: "15px",
        }}
      >
        {item.price} FCFA
      </p>

      {/* BADGE */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#eef2ff,#f5f3ff)",

          padding: "6px 12px",

          borderRadius: "10px",

          display: "inline-block",

          marginTop: "10px",

          color: "#5b6cff",

          fontWeight: "700",

          fontSize: "12px",
        }}
      >
        Produit premium
      </div>

      {/* QUANTITY */}

      <div
        style={{
          display: "flex",

          gap: "12px",

          alignItems: "center",

          marginTop: "15px",
        }}
      >

        <button
          onClick={() =>
            updateQuantity(
              item._id,
              "minus"
            )
          }

          style={{
            width: "35px",

            height: "35px",

            borderRadius: "50%",

            border: "none",

            background: "#eef2ff",

            color: "#5b6cff",

            fontSize: "18px",

            fontWeight: "bold",

            cursor: "pointer",
          }}
        >
          -
        </button>

        <span
          style={{
            fontWeight: "700",
            fontSize: "16px",
          }}
        >
          {item.quantity}
        </span>

        <button
          onClick={() =>
            updateQuantity(
              item._id,
              "plus"
            )
          }

          style={{
            width: "35px",

            height: "35px",

            borderRadius: "50%",

            border: "none",

            background:
              "linear-gradient(135deg,#5b6cff,#7c4dff)",

            color: "white",

            fontSize: "18px",

            fontWeight: "bold",

            cursor: "pointer",
          }}
        >
          +
        </button>

      </div>

    </div>

    {/* REMOVE */}

    <button
      onClick={() =>
        removeItem(
          item._id
        )
      }

      style={{
        border: "none",

        background:
          "linear-gradient(135deg,#ef4444,#dc2626)",

        color: "white",

        width: "42px",

        height: "42px",

        borderRadius: "14px",

        cursor: "pointer",

        fontWeight: "bold",

        fontSize: "16px",

        boxShadow:
          "0 8px 18px rgba(239,68,68,0.25)",
      }}
    >
      ✕
    </button>

  </div>

))}

{/* TOTAL */}

<div
  style={{
    marginTop: "35px",

    background:
      "linear-gradient(135deg,#ffffff,#eef2ff)",

    padding:
      window.innerWidth < 768
        ? "22px"
        : "30px",

    borderRadius: "28px",

    boxShadow:
      "0 15px 35px rgba(91,108,255,0.10)",

    border:
      "1px solid rgba(255,255,255,0.8)",

    backdropFilter: "blur(12px)",

    position: "relative",

    overflow: "hidden",
  }}
>

  {/* TOP LIGHT */}

  <div
    style={{
      position: "absolute",

      top: "-60px",

      right: "-60px",

      width: "180px",

      height: "180px",

      borderRadius: "50%",

      background:
        "rgba(91,108,255,0.10)",

      filter: "blur(10px)",
    }}
  />

  {/* HEADER */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginBottom: "25px",
    }}
  >

    <div>

      <p
        style={{
          margin: 0,

          color: "#6b7280",

          fontSize: "13px",

          fontWeight: "600",
        }}
      >
        💳 Résumé de la commande
      </p>

      <h2
        style={{
          margin: 0,

          marginTop: "4px",

          color: "#111827",

          fontSize:
            window.innerWidth < 768
              ? "24px"
              : "30px",

          fontWeight: "900",
        }}
      >
        Paiement sécurisé
      </h2>

    </div>

    <div
      style={{
        background:
          "linear-gradient(135deg,#5b6cff,#7c4dff)",

        width:
          window.innerWidth < 768
            ? "55px"
            : "65px",

        height:
          window.innerWidth < 768
            ? "55px"
            : "65px",

        borderRadius: "20px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        boxShadow:
          "0 10px 25px rgba(91,108,255,0.25)",
      }}
    >

      <FaWallet
        style={{
          color: "white",

          fontSize:
            window.innerWidth < 768
              ? "24px"
              : "28px",
        }}
      />

    </div>

  </div>

  {/* SOUS TOTAL */}

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      padding: "14px 0",

      borderBottom:
        "1px solid #dbeafe",
    }}
  >

    <div>

      <h3
        style={{
          margin: 0,

          color: "#374151",

          fontSize: "16px",

          fontWeight: "700",
        }}
      >
        Sous-total
      </h3>

      <p
        style={{
          margin: 0,

          marginTop: "3px",

          fontSize: "12px",

          color: "#9ca3af",
        }}
      >
        Articles sélectionnés
      </p>

    </div>

    <h3
      style={{
        margin: 0,

        color: "#111827",

        fontWeight: "900",
      }}
    >
      {total} FCFA
    </h3>

  </div>

  {/* LIVRAISON */}

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      padding: "14px 0",

      borderBottom:
        "1px solid #dbeafe",
    }}
  >

    <div>

      <h3
        style={{
          margin: 0,

          color: "#374151",

          fontSize: "16px",

          fontWeight: "700",
        }}
      >
        Livraison
      </h3>

      <p
        style={{
          margin: 0,

          marginTop: "3px",

          fontSize: "12px",

          color: "#9ca3af",
        }}
      >
        Expédition rapide Cameroun 🚚
      </p>

    </div>

    <h3
      style={{
        margin: 0,

        fontWeight: "900",

        color:
          shipping === 0
            ? "#16a34a"
            : "#111827",
      }}
    >

      {shipping === 0
        ? "Gratuite 🎉"
        : `${shipping} FCFA`}

    </h3>

  </div>

  {/* RÉDUCTION */}

  {discount > 0 && (

    <div
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        alignItems: "center",

        padding: "14px 0",

        borderBottom:
          "1px solid #dbeafe",
      }}
    >

      <div>

        <h3
          style={{
            margin: 0,

            color: "#16a34a",

            fontSize: "16px",

            fontWeight: "700",
          }}
        >
          Réduction
        </h3>

        <p
          style={{
            margin: 0,

            marginTop: "3px",

            fontSize: "12px",

            color: "#86efac",
          }}
        >
          Coupon appliqué ✅
        </p>

      </div>

      <h3
        style={{
          margin: 0,

          color: "#16a34a",

          fontWeight: "900",
        }}
      >
        -{discount} FCFA
      </h3>

    </div>

  )}

  {/* TOTAL FINAL */}

  <div
    style={{
      marginTop: "25px",

      padding:
        window.innerWidth < 768
          ? "18px"
          : "22px",

      borderRadius: "22px",

      background:
        "linear-gradient(135deg,#5b6cff,#7c4dff)",

      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      boxShadow:
        "0 15px 30px rgba(91,108,255,0.25)",
    }}
  >

    <div>

      <p
        style={{
          margin: 0,

          color:
            "rgba(255,255,255,0.75)",

          fontSize: "13px",
        }}
      >
        Montant total
      </p>

      <h2
        style={{
          margin: 0,

          marginTop: "4px",

          color: "white",

          fontSize:
            window.innerWidth < 768
              ? "26px"
              : "34px",

          fontWeight: "900",
        }}
      >
        {finalTotal} FCFA
      </h2>

    </div>

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "55px"
            : "65px",

        height:
          window.innerWidth < 768
            ? "55px"
            : "65px",

        borderRadius: "18px",

        background:
          "rgba(255,255,255,0.15)",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        backdropFilter: "blur(10px)",
      }}
    >

      <FaShieldAlt
        style={{
          color: "white",

          fontSize:
            window.innerWidth < 768
              ? "24px"
              : "28px",
        }}
      />

    </div>

  </div>

</div>

{/* SUCCESS */}

{success && (

  <div
    style={{
      background:
        "linear-gradient(135deg,#dcfce7,#bbf7d0)",

      color: "#166534",

      padding: "20px",

      borderRadius: "18px",

      marginTop: "25px",

      display: "flex",

      alignItems: "center",

      gap: "12px",

      fontWeight: "700",

      boxShadow:
        "0 8px 20px rgba(34,197,94,0.15)",
    }}
  >
    <FaCheckCircle
      style={{
        fontSize: "22px",
      }}
    />

    Commande envoyée avec succès
  </div>

)}

<div
  style={{
    background:
      "linear-gradient(135deg,#eef2ff,#f5f3ff)",

    padding: "18px",

    borderRadius: "18px",

    marginTop: "25px",

    display: "flex",

    alignItems: "center",

    gap: "15px",
  }}
>

  <FaLock
    style={{
      fontSize: "24px",
      color: "#5b6cff",
    }}
  />

  <div>

    <h4
      style={{
        margin: 0,
      }}
    >
      Paiement sécurisé
    </h4>

    <p
      style={{
        margin: 0,
        color: "#6b7280",
        fontSize: "14px",
      }}
    >
      Vos données sont protégées
    </p>

  </div>

</div>

       {/* BUTTON */}

<button

  onClick={placeOrder}

  disabled={
    loading || cart.length === 0
  }

  style={{
    marginTop: "30px",

    width: "100%",

    padding: "17px",

    background:

      loading || cart.length === 0

        ? "#cbd5e1"

        : "linear-gradient(135deg,#6d28d9,#4f46e5)",

    color: "white",

    border: "none",

    borderRadius: "18px",

    fontSize: "16px",

    fontWeight: "800",

    cursor:

      loading || cart.length === 0

        ? "not-allowed"

        : "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "12px",

    boxShadow:

      loading || cart.length === 0

        ? "none"

        : "0 12px 25px rgba(79,70,229,0.35)",

    transition: "0.3s",

    letterSpacing: "0.5px",

    opacity:
      cart.length === 0
        ? 0.7
        : 1,
  }}

  onMouseEnter={(e) => {

    if (
      !loading &&
      cart.length > 0
    ) {

      e.currentTarget.style.transform =
        "translateY(-3px)";

      e.currentTarget.style.boxShadow =
        "0 18px 35px rgba(79,70,229,0.45)";

    }

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)";

    e.currentTarget.style.boxShadow =

      loading || cart.length === 0

        ? "none"

        : "0 12px 25px rgba(79,70,229,0.35)";

  }}
>

  {loading ? (

    <>
      <FaSpinner />
      Envoi...
    </>

  ) : cart.length === 0 ? (

    <>
      <FaShoppingCart />
      Panier vide
    </>

  ) : (

    <>
      <FaCreditCard />
      Commander maintenant

      <FaRocket />
    </>

  )}

</button>

          </div>

        </div>

      </div>

    </>

  );

}

// =========================
// STYLE
// =========================

const inputStyle = {

  width: "100%",

  padding: "14px 16px",

  marginTop: "14px",

  borderRadius: "16px",

  border: "1px solid #e5e7eb",

  fontSize: "15px",

  fontWeight: "500",

  outline: "none",

  background:
    "linear-gradient(135deg,#ffffff,#f9fafb)",

  boxSizing: "border-box",

  transition: "0.3s",

  color: "#111827",

  boxShadow:
    "0 4px 12px rgba(0,0,0,0.03)",

  height: "56px",
};

export default Checkout;