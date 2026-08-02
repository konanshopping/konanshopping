import axios from "axios";

import {
  useState,
  useEffect,
} from "react";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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

    const [mobile, setMobile] = useState(
  window.innerWidth <= 768
);

useEffect(() => {
  const handleResize = () => {
    setMobile(window.innerWidth <= 768);
  };

  window.addEventListener(
    "resize",
    handleResize
  );

  return () =>
    window.removeEventListener(
      "resize",
      handleResize
    );
}, []);

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

  setCart([...updated]);

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

  localStorage.setItem(
  `checkoutCart_${clientId}`,
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
    ? Number(item.quantity || 1) + 1
    : Math.max(
        1,
        Number(item.quantity || 1) - 1
      )
          };

        }

        return item;

      });

    setCart([...updated]);

console.log(
  "State après update =",
  updated
);

    localStorage.setItem(
  `cart_${clientId}`,
  JSON.stringify(updated)
);

localStorage.setItem(
  `checkoutCart_${clientId}`,
  JSON.stringify(updated)
);

  };


  // =========================
  // COUPON
  // =========================

  const applyCoupon =
  async () => {

    try {

     const res = await axios.post(
  "https://konanshopping.com/api/apply-coupon",
  {
    code: coupon,
    total,
    userId: user?._id,
  }
);

      setDiscount(
        res.data.discount
      );

      setCoupon(res.data.coupon.code);

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

// =====================
// PAIEMENT MONETBIL
// =====================

if (
  paymentMethod === "Orange Money" ||
  paymentMethod === "MTN Mobile Money"
) {

  console.log("Paiement Monetbil...");

  console.log("Téléphone envoyé :", phone);

  const phoneNumber = phone.replace("+", "");

  const res = await axios.post(
  "https://konanshopping.com/api/payment/create",
  {
    amount: finalTotal,
    phone: phoneNumber,
    name: customerName,
    email,

    address,
    city,
    district,

    paymentMethod,

    shipping,

    total: finalTotal,

    items: cart,

    userId: user?._id || null
  }
);

console.log("Réponse Monetbil :", res.data);

  if (res.data.payment_url) {

    window.location.href =
      res.data.payment_url;

    return;

  }

}

      // SAVE ORDER

console.log(location);

const driver = JSON.parse(
  localStorage.getItem("driver")
);


await axios.post(

  "https://konanshopping.com/api/orders",

  {

    userId:
      user?._id || null,

    couponCode: coupon || null,

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

  console.log("ERREUR COMPLETE :", err);

  console.log("Réponse :", err.response);

  console.log("Data :", err.response?.data);

  toast.error("Erreur lors de la commande ❌");

}

    finally {

      setLoading(false);

    }

  };

const cardStyle = {
  background: "#fff",

  width: "100%",

  maxWidth: "100%",

  overflow: "hidden",

  boxSizing: "border-box",

  padding: mobile ? "18px" : "30px",

  borderRadius: mobile ? "20px" : "26px",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.06)",

  border:
    "1px solid rgba(0,0,0,0.04)",
};

if (!Array.isArray(cart)) {
  return <h1>Erreur panier</h1>;
}


  // =========================
  // UI
  // =========================

console.log("Cart =", cart);
console.log("Cart length =", cart.length);

console.log(
  "Render total =",
  total
);

console.log("Cart state =", cart);

console.log(
  "Checkout cart =",
  JSON.parse(
    localStorage.getItem(
      `checkoutCart_${clientId}`
    )
  )
);

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
        minHeight: "100dvh",

        background:
          "linear-gradient(135deg,#f9fafb,#eef2ff)",

        padding: mobile ? "0" : "50px",

        maxWidth: mobile ? "100%" : "1600px",

        margin: mobile ? "0" : "0 auto",

        overflowX: "hidden",

        width: "100%",

        boxSizing: "border-box",

        fontFamily: "Arial",
      }}
    >

      {/* TITLE */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",

          marginBottom: mobile ? "0" : "35px",

          padding: mobile ? "20px" : "0",
        }}
      >

        <FaShoppingCart
          style={{
            fontSize: mobile ? "32px" : "58px",
            lineHeight: "1",
            color: "#5b6cff",
          }}
        />

        <h1
          style={{
            fontSize:
              mobile ? "28px" : "58px",

            margin: 0,

            color: "#111827",

            fontWeight: "900",

            lineHeight: "1",

            maxWidth: "100%",

            wordBreak: "break-word",
          }}
        >
          Validation Commande
        </h1>

      </div>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            mobile
              ? "1fr"
              : "minmax(0,1.2fr) minmax(0,0.8fr)",

          gap: mobile ? "0" : "30px",

          width: "100%",
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
    width: "100%",
  }}
>

  <FaUser
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
      fontSize: "15px",
      zIndex: 1,
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
      width: "100%",
      boxSizing: "border-box",
    }}
  />

</div>

<div
  style={{
    position: "relative",
    marginBottom: "20px",
    width: "100%",
  }}
>
  <FaPhone
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
      fontSize: "15px",
      zIndex: 10,
      pointerEvents: "none",
    }}
  />

  <PhoneInput
    international
    defaultCountry="CM"
    value={phone}
    onChange={setPhone}
    placeholder="Numéro de téléphone"

    style={{
      ...inputStyle,
      paddingLeft: "45px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      boxSizing: "border-box",
    }}

    numberInputProps={{
      style: {
        border: "none",
        outline: "none",
        width: "100%",
        background: "transparent",
        fontSize: mobile ? "15px" : "16px",
        color: "#111827",
      },
    }}
  />
</div>

<div
  style={{
    position: "relative",
    width: "100%",
  }}
>

  <FaEnvelope
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
      zIndex: 1,
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
      width: "100%",
      boxSizing: "border-box",
    }}
  />

</div>

<div
  style={{
    position: "relative",
    width: "100%",
  }}
>

  <FaMapMarkerAlt
    style={{
      position: "absolute",
      top: "18px",
      left: "15px",
      color: "#6b7280",
      zIndex: 1,
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
      width: "100%",
      boxSizing: "border-box",
    }}
  />

</div>

<div
  style={{
    position: "relative",
    marginBottom: "20px",
    width: "100%",
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

      width: "100%",

      boxSizing: "border-box",

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
    width: "100%",
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

      width: "100%",

      boxSizing: "border-box",

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
    width: "100%",
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

      width: "100%",

      boxSizing: "border-box",

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

    flexDirection: mobile ? "column" : "row",

    gap: "12px",

    marginTop: "10px",

    width: "100%",
  }}
>

  <div
    style={{
      position: "relative",

      flex: 1,

      width: "100%",

      boxSizing: "border-box",
    }}
  >

    <FaTag
      style={{
        position: "absolute",
        top: "18px",
        left: "15px",
        color: "#6b7280",
        fontSize: "15px",
        zIndex: 1,
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

        boxSizing: "border-box",

        padding: "15px 15px 15px 45px",

        borderRadius: "16px",

        border: "1px solid #e5e7eb",

        background:
          "linear-gradient(135deg,#ffffff,#f9fafb)",

        boxShadow:
          "0 4px 10px rgba(0,0,0,0.03)",

        outline: "none",

        fontSize: "15px",

        color: "#111827",

        WebkitTextFillColor: "#111827",

        caretColor: "#4B2E83",

        fontWeight: "600",
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

      width: mobile ? "100%" : "auto",

      fontWeight: "800",

      cursor: "pointer",

      boxShadow:
        "0 8px 18px rgba(79,70,229,0.25)",

      transition: "0.3s",

      whiteSpace: "nowrap",

      boxSizing: "border-box",
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
      fontSize: mobile ? "22px" : "28px",
      fontWeight: "800",
      flexWrap: "wrap",
    }}
  >
    <FaBoxOpen
      style={{
        color: "#5b6cff",
        fontSize: mobile ? "24px" : "28px",
        flexShrink: 0,
      }}
    />

    Votre commande
  </h2>

  {cart.length === 0 ? (

    <div
      style={{
        marginTop: "25px",
        padding: mobile ? "30px 20px" : "40px 25px",
        borderRadius: mobile ? "20px" : "24px",
        background:
          "linear-gradient(135deg,#ffffff,#f8fafc)",
        border: "1px solid #e5e7eb",
        textAlign: "center",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.05)",

        width: "100%",
        boxSizing: "border-box",
      }}
    >

      <FaShoppingCart
        style={{
          fontSize: mobile ? "50px" : "60px",
          color: "#cbd5e1",
          marginBottom: "15px",
        }}
      />

      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: mobile ? "22px" : "24px",
          fontWeight: "800",
          wordBreak: "break-word",
        }}
      >
        Votre panier est vide
      </h2>

      <p
        style={{
          marginTop: "12px",
          color: "#6b7280",
          fontSize: mobile ? "14px" : "15px",
          lineHeight: "1.6",
          maxWidth: "100%",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        Aucun produit n'est actuellement dans votre panier.
        Découvrez nos meilleures offres et ajoutez vos articles préférés.
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

          width: mobile ? "100%" : "auto",
          boxSizing: "border-box",
        }}
      >
        Continuer mes achats
      </button>

    </div>

) : (

  <>

    {cart.map((item) => (
  <div
    key={item._id}
    style={{
      width: "100%",
      boxSizing: "border-box",
      overflow: "hidden",
      maxWidth: "100%",
      position: "relative",

      display: "flex",
      flexDirection: "row",
      alignItems: "center",

      gap: mobile ? "12px" : "18px",

      marginTop: "18px",

      background: "linear-gradient(135deg,#ffffff,#f8faff)",

      padding: mobile ? "12px" : "18px",

      borderRadius: mobile ? "16px" : "22px",

      boxShadow: "0 8px 20px rgba(0,0,0,0.04)",

      border: "1px solid #eef2ff",
    }}
  >

    {/* IMAGE */}

    <img
      src={item.image}
      alt=""
      style={{
        width: mobile ? "85px" : "90px",
        height: mobile ? "85px" : "90px",
        flexShrink: 0,
        objectFit: "cover",
        borderRadius: "15px",
        background: "#f3f4f6",
        padding: "4px",
      }}
    />

    {/* CONTENT */}

    <div
      style={{
        flex: 1,
        minWidth: 0,
        paddingRight: mobile ? "42px" : "60px",
      }}
    >

      <h3
        style={{
          margin: 0,
          fontSize: mobile ? "17px" : "18px",
          color: "#111827",
          fontWeight: "700",
          wordBreak: "break-word",
        }}
      >
        {item.name}
      </h3>

      <p
        style={{
          color: "#6b7280",
          margin: "6px 0",
          fontSize: "15px",
        }}
      >
        {item.price} FCFA
      </p>

      {/* BADGE */}

      <div
        style={{
          background: "linear-gradient(135deg,#eef2ff,#f5f3ff)",

          padding: "5px 10px",

          borderRadius: "8px",

          display: "inline-block",

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
          alignItems: "center",
          gap: "10px",
          marginTop: "12px",
        }}
      >

        <button
          onClick={() =>
            updateQuantity(item._id, "minus")
          }
          style={{
            width: "34px",
            height: "34px",
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
            updateQuantity(item._id, "plus")
          }
          style={{
            width: "34px",
            height: "34px",
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
        removeItem(item._id)
      }
      style={{
        position: "absolute",

        top: mobile ? "10px" : "18px",

        right: mobile ? "10px" : "18px",

        border: "none",

        background:
          "linear-gradient(135deg,#ef4444,#dc2626)",

        color: "white",

        width: mobile ? "34px" : "38px",

        height: mobile ? "34px" : "38px",

        borderRadius: "10px",

        cursor: "pointer",

        fontWeight: "bold",

        fontSize: mobile ? "15px" : "16px",
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

    padding: mobile ? "22px" : "30px",

    borderRadius: mobile ? "22px" : "28px",

    boxShadow:
      "0 15px 35px rgba(91,108,255,0.10)",

    border:
      "1px solid rgba(255,255,255,0.8)",

    backdropFilter: "blur(12px)",

    position: "relative",

    overflow: "hidden",

    width: "100%",

    boxSizing: "border-box",
  }}
>

  {/* TOP LIGHT */}

  <div
    style={{
      position: "absolute",

      top: "-60px",

      right: "-60px",

      width: mobile ? "140px" : "180px",

      height: mobile ? "140px" : "180px",

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

      justifyContent: "space-between",

      gap: "15px",

      marginBottom: "25px",

      flexWrap: mobile ? "wrap" : "nowrap",
    }}
  >

    <div
      style={{
        flex: 1,
        minWidth: 0,
      }}
    >

      <p
        style={{
          margin: 0,

          color: "#6b7280",

          fontSize: mobile ? "12px" : "13px",

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

          fontSize: mobile ? "24px" : "30px",

          fontWeight: "900",

          wordBreak: "break-word",
        }}
      >
        Paiement sécurisé
      </h2>

    </div>

    <div
      style={{
        background:
          "linear-gradient(135deg,#5b6cff,#7c4dff)",

        width: mobile ? "55px" : "65px",

        height: mobile ? "55px" : "65px",

        borderRadius: "20px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        flexShrink: 0,

        boxShadow:
          "0 10px 25px rgba(91,108,255,0.25)",
      }}
    >

      <FaWallet
        style={{
          color: "white",

          fontSize: mobile ? "24px" : "28px",
        }}
      />

    </div>

  </div>

  {/* SOUS TOTAL */}

<div
  style={{
    display: "flex",

    flexDirection: mobile ? "column" : "row",

    gap: "15px",

    justifyContent: "space-between",

    alignItems: mobile ? "flex-start" : "center",

    padding: "14px 0",

    borderBottom: "1px solid #dbeafe",

    width: "100%",
  }}
>

  <div
    style={{
      minWidth: 0,
    }}
  >

    <h3
      style={{
        margin: 0,

        color: "#374151",

        fontSize: "16px",

        fontWeight: "700",

        wordBreak: "break-word",
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

      wordBreak: "break-word",
    }}
  >
    {total} FCFA
  </h3>

</div>

{/* LIVRAISON */}

<div
  style={{
    display: "flex",

    flexDirection: mobile ? "column" : "row",

    gap: "15px",

    justifyContent: "space-between",

    alignItems: mobile ? "flex-start" : "center",

    padding: "14px 0",

    borderBottom: "1px solid #dbeafe",

    width: "100%",
  }}
>

  <div
    style={{
      minWidth: 0,
    }}
  >

    <h3
      style={{
        margin: 0,

        color: "#374151",

        fontSize: "16px",

        fontWeight: "700",

        wordBreak: "break-word",
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

      wordBreak: "break-word",
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

      flexDirection: mobile ? "column" : "row",

      gap: "15px",

      justifyContent: "space-between",

      alignItems: mobile ? "flex-start" : "center",

      padding: "14px 0",

      borderBottom: "1px solid #dbeafe",

      width: "100%",
    }}
  >

    <div
      style={{
        minWidth: 0,
      }}
    >

      <h3
        style={{
          margin: 0,

          color: "#16a34a",

          fontSize: "16px",

          fontWeight: "700",

          wordBreak: "break-word",
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

        wordBreak: "break-word",
      }}
    >
      -{discount} FCFA
    </h3>

  </div>

)}

{/* TOTAL FINAL */}

<div
  style={{
    marginTop: "22px",

    padding: mobile ? "16px" : "22px",

    borderRadius: mobile ? "18px" : "22px",

    background:
      "linear-gradient(135deg,#5b6cff,#7c4dff)",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "16px",

    width: "100%",

    boxSizing: "border-box",

    boxShadow:
      "0 12px 25px rgba(91,108,255,0.22)",
  }}
>

  {/* TEXTE */}

  <div
    style={{
      flex: 1,
      minWidth: 0,
    }}
  >

    <p
      style={{
        margin: 0,
        color: "rgba(255,255,255,0.75)",
        fontSize: "13px",
        fontWeight: "500",
      }}
    >
      Montant total
    </p>

    <h2
      style={{
        margin: "6px 0 0",

        color: "white",

        fontSize: mobile ? "24px" : "32px",

        fontWeight: "900",

        wordBreak: "break-word",
      }}
    >
      {finalTotal} FCFA
    </h2>

  </div>

  {/* ICÔNE */}

  <div
    style={{
      width: mobile ? "52px" : "62px",

      height: mobile ? "52px" : "62px",

      borderRadius: "16px",

      background: "rgba(255,255,255,0.18)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

      flexShrink: 0,
    }}
  >

    <FaShieldAlt
      style={{
        color: "#fff",

        fontSize: mobile ? "24px" : "30px",
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

      padding: mobile ? "18px" : "20px",

      borderRadius: "18px",

      marginTop: "25px",

      display: "flex",

      alignItems: mobile ? "flex-start" : "center",

      gap: "12px",

      fontWeight: "700",

      boxShadow:
        "0 8px 20px rgba(34,197,94,0.15)",

      width: "100%",

      boxSizing: "border-box",
    }}
  >
    <FaCheckCircle
      style={{
        fontSize: mobile ? "20px" : "22px",
        flexShrink: 0,
      }}
    />

    <span
      style={{
        wordBreak: "break-word",
      }}
    >
      Commande envoyée avec succès
    </span>
  </div>

)}

<div
  style={{
    background:
      "linear-gradient(135deg,#eef2ff,#f5f3ff)",

    padding: mobile ? "16px" : "18px",

    borderRadius: "18px",

    marginTop: "25px",

    display: "flex",

    alignItems: mobile ? "flex-start" : "center",

    gap: "15px",

    width: "100%",

    boxSizing: "border-box",
  }}
>

  <FaLock
    style={{
      fontSize: mobile ? "22px" : "24px",
      color: "#5b6cff",
      flexShrink: 0,
    }}
  />

  <div
    style={{
      minWidth: 0,
    }}
  >

    <h4
      style={{
        margin: 0,
        wordBreak: "break-word",
      }}
    >
      Paiement sécurisé
    </h4>

    <p
      style={{
        margin: 0,
        color: "#6b7280",
        fontSize: "14px",
        wordBreak: "break-word",
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

    padding: mobile ? "16px" : "17px",

    background:

      loading || cart.length === 0

        ? "#cbd5e1"

        : "linear-gradient(135deg,#6d28d9,#4f46e5)",

    color: "white",

    border: "none",

    borderRadius: "18px",

    fontSize: mobile ? "15px" : "16px",

    fontWeight: "800",

    cursor:

      loading || cart.length === 0

        ? "not-allowed"

        : "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "12px",

    flexWrap: "wrap",

    boxSizing: "border-box",

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

</>
)}

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

  maxWidth: "100%",

  overflow: "hidden",

  padding: "14px 16px",

  marginTop: "14px",

  borderRadius: "16px",

  border: "1px solid #e5e7eb",

  fontSize: window.innerWidth <= 768 ? "16px" : "15px",

  minHeight: "56px",

  outline: "none",

  background: "#fff",

  boxSizing: "border-box",

  color: "#111827",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.03)",

  appearance: "none",

  WebkitAppearance: "none",
};

export default Checkout;