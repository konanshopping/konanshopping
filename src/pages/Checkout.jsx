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

  FaTag,

  FaTrash

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

// Le cookie de session est envoyé automatiquement. L'identité réelle
// doit toujours être vérifiée par le backend, jamais par le localStorage.
const safeParse = (value, fallback = null) => {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const readStoredUser = () => {
  const stored = safeParse(localStorage.getItem("user"), null);
  return stored && typeof stored === "object" ? stored : null;
};

const getStableGuestId = () => {
  try {
    let id = localStorage.getItem("guestId");
    if (!id || !/^guest_[a-zA-Z0-9_-]{8,100}$/.test(id)) {
      const randomPart =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      id = `guest_${randomPart}`;
      localStorage.setItem("guestId", id);
    }
    return id;
  } catch {
    return `guest_${Date.now()}`;
  }
};

const normalizeCart = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) =>
      item &&
      typeof item === "object" &&
      /^[a-f\d]{24}$/i.test(String(item._id || ""))
    )
    .map((item) => ({
      ...item,
      quantity: Math.min(99, Math.max(1, Math.floor(Number(item.quantity) || 1))),
    }));
};

axios.defaults.withCredentials = true;


// Villes et principaux centres urbains proposés dans le sélecteur.
// Les localités absentes peuvent être saisies librement grâce au datalist.
const CAMEROON_CITIES = [
  "Yaoundé",
  "Douala",
  "Bafoussam",
  "Garoua",
  "Maroua",
  "Bamenda",
  "Bertoua",
  "Ebolowa",
  "Ngaoundéré",
  "Buea",
  "Kribi",
  "Limbe",
  "Kumba",
  "Nkongsamba",
  "Edéa",
  "Loum",
  "Mbanga",
  "Melong",
  "Dschang",
  "Foumban",
  "Mbouda",
  "Bangangté",
  "Bafang",
  "Kékem",
  "Tonga",
  "Baham",
  "Bandjoun",
  "Batié",
  "Bazou",
  "Batcham",
  "Penka-Michel",
  "Garoua-Boulaï",
  "Meiganga",
  "Tibati",
  "Tcholliré",
  "Poli",
  "Rey-Bouba",
  "Guider",
  "Figuil",
  "Mokolo",
  "Yagoua",
  "Kousséri",
  "Mora",
  "Kaélé",
  "Mindif",
  "Méri",
  "Bogo",
  "Pitoa",
  "Lagdo",
  "Banyo",
  "Bankim",
  "Ngaoundal",
  "Yokadouma",
  "Abong-Mbang",
  "Batouri",
  "Kenzou",
  "Belabo",
  "Dimako",
  "Minta",
  "Nanga-Eboko",
  "Akonolinga",
  "Mbalmayo",
  "Sangmélima",
  "Ambam",
  "Lolodorf",
  "Campo",
  "Mvangan",
  "Bafia",
  "Ntui",
  "Obala",
  "Monatélé",
  "Mbandjock",
  "Eséka",
  "Ngoumou",
  "Ombessa",
  "Yabassi",
  "Manjo",
  "Tombel",
  "Bangem",
  "Fontem",
  "Mamfe",
  "Tiko",
  "Muyuka",
  "Idenau",
  "Akwaya",
  "Wum",
  "Kumbo",
  "Nkambe",
  "Ndop",
  "Fundong",
  "Bali",
  "Batibo",
  "Mbengwi",
  "Bafut",
  "Santa",
  "Touboro"
];

function Checkout() {
const user = readStoredUser();
const guestId = getStableGuestId();
const clientId = user?._id || guestId;

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

  // Indique que le panier a terminé son chargement depuis le stockage local.
  const [cartReady, setCartReady] = useState(false);

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
  // Priorité au panier transmis depuis la boutique, puis au panier normal.
  const accountCartKey = `cart_${clientId}`;
  const accountCheckoutKey = `checkoutCart_${clientId}`;
  const guestCartKey = `cart_${guestId}`;
  const guestCheckoutKey = `checkoutCart_${guestId}`;

  const accountCheckout = normalizeCart(safeParse(localStorage.getItem(accountCheckoutKey), []));
  const accountCart = normalizeCart(safeParse(localStorage.getItem(accountCartKey), []));
  const guestCheckout = normalizeCart(safeParse(localStorage.getItem(guestCheckoutKey), []));
  const guestCart = normalizeCart(safeParse(localStorage.getItem(guestCartKey), []));
  const directProduct = safeParse(localStorage.getItem(`checkoutProduct_${clientId}`), null);

  let selectedCart =
    accountCheckout.length ? accountCheckout :
    accountCart.length ? accountCart :
    guestCheckout.length ? guestCheckout :
    guestCart.length ? guestCart :
    directProduct ? normalizeCart([{ ...directProduct, quantity: 1 }]) : [];

  // À la connexion, fusionne les articles du visiteur avec ceux du compte.
  if (user?._id && guestId !== clientId && (guestCart.length || guestCheckout.length)) {
    const merged = new Map();
    [...(guestCheckout.length ? guestCheckout : guestCart), ...selectedCart].forEach((item) => {
      const previous = merged.get(item._id);
      merged.set(item._id, {
        ...previous,
        ...item,
        quantity: Math.min(99, (previous?.quantity || 0) + (item.quantity || 1)),
      });
    });
    selectedCart = [...merged.values()];
    try {
      localStorage.setItem(accountCartKey, JSON.stringify(selectedCart));
      localStorage.setItem(accountCheckoutKey, JSON.stringify(selectedCart));
    } catch (error) {
      console.warn("Impossible de synchroniser le panier local.", error);
    }
  }

  setCart(selectedCart);
  setCartReady(true);
}, [clientId, guestId]);

// Persistance partagée avec l'accueil et la boutique.
useEffect(() => {
  if (!cartReady) return;
  try {
    const normalized = normalizeCart(cart);
    localStorage.setItem(`cart_${clientId}`, JSON.stringify(normalized));
    localStorage.setItem(`checkoutCart_${clientId}`, JSON.stringify(normalized));
    localStorage.setItem("cartCount", String(normalized.length));
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.warn("La synchronisation locale du panier a échoué.", error);
  }
}, [cart, cartReady, clientId]);

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

  // =====================

  // CLIENT CONNECTÉ

  // =====================

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

    ? Math.min(99, Number(item.quantity || 1) + 1)

    : Math.max(

        1,

        Number(item.quantity || 1) - 1

      )

          };

        }

        return item;

      });

    setCart([...updated]);

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

  const applyCoupon = async () => {

  try {

    const couponHeaders = {};

    const res = await axios.post(

      "https://konanshopping.com/api/apply-coupon",

      {

        code: coupon,

        total,


      },

      {
        withCredentials: true,
        headers: couponHeaders,
      }

    );

    setDiscount(res.data.discount);

    setCoupon(res.data.coupon.code);

    toast.success("Coupon appliqué ✅");

  } catch (err) {

    toast.error(

      err.response?.data?.message || "Coupon invalide"

    );

  }

};

  // =========================

  // PLACE ORDER

  // =========================

  const placeOrder = async () => {
    if (loading) return;

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

      // AUTHENTIFICATION COMMANDE

      // =====================

      const orderHeaders = {};

// =====================

// PAIEMENT MONETBIL

// =====================

if (

  paymentMethod === "Orange Money" ||

  paymentMethod === "MTN Mobile Money"

) {

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


      couponCode: coupon || null

  }

, {
        withCredentials: true,
        headers: orderHeaders,
      }

  );

  if (res.data.payment_url) {

    window.location.href =

      res.data.payment_url;

    return;

  }

}

      // SAVE ORDER

await axios.post(

  "https://konanshopping.com/api/orders",

  {


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

  },

  {
        withCredentials: true,
        headers: orderHeaders,
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

localStorage.removeItem(`checkoutCart_${clientId}`);

      setTimeout(() => {

  navigate("/success");

}, 2500);

    }

   catch (err) {

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

return (

  <>

    {showConfetti && (

      <Confetti

        numberOfPieces={500}

        recycle={false}

      />

    )}

    <div
      className="checkout-ios-root"
      style={{

        minHeight: "100dvh",

        background:

          "linear-gradient(135deg,#f9fafb,color-mix(in srgb, var(--season-primary, #2563eb) 9%, white))",

        padding: mobile ? "0" : "50px",

        maxWidth: mobile ? "100%" : "1600px",

        margin: mobile ? "0" : "0 auto",

        overflowX: "hidden",

        width: "100%",

        boxSizing: "border-box",

        fontFamily: "Arial",

      }}

    >
      <style>{`
        .checkout-ios-root,
        .checkout-ios-root * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        .checkout-ios-root {
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          padding-left: max(0px, env(safe-area-inset-left));
          padding-right: max(0px, env(safe-area-inset-right));
          -webkit-text-size-adjust: 100%;
          overflow-x: clip;
        }

        .checkout-ios-root input,
        .checkout-ios-root select,
        .checkout-ios-root .PhoneInputInput {
          min-width: 0;
          min-height: 56px;
          height: 56px;
          font-size: 16px !important;
          line-height: 1.25;
          border-radius: 14px;
          -webkit-appearance: none;
          appearance: none;
        }

        .checkout-ios-root input:focus,
        .checkout-ios-root select:focus,
        .checkout-ios-root .PhoneInput:focus-within {
          outline: none;
          border-color: var(--season-primary, #2563eb);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--season-primary, #2563eb) 12%, transparent);
        }

        .checkout-ios-root .PhoneInput {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          min-width: 0;
          height: 56px;
          min-height: 56px;
          padding: 0 12px;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,.03);
        }

        .checkout-ios-root .PhoneInputCountry {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex: 0 0 auto;
          height: 100%;
          margin: 0;
        }

        .checkout-ios-root .PhoneInputCountrySelect {
          cursor: pointer;
          min-width: 28px;
          min-height: 42px;
        }

        .checkout-ios-root .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          overflow: hidden;
          border-radius: 3px;
          box-shadow: 0 0 0 1px rgba(15,23,42,.12);
        }

        .checkout-ios-root .PhoneInputCountryIcon img,
        .checkout-ios-root .PhoneInputCountryIcon--border {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .checkout-ios-root .PhoneInputInput {
          flex: 1 1 auto;
          width: 100%;
          min-width: 0;
          padding: 0 4px !important;
          margin: 0 !important;
          border: 0 !important;
          outline: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          color: #111827 !important;
          -webkit-text-fill-color: #111827;
        }

        .checkout-ios-root button,
        .checkout-ios-root a {
          touch-action: manipulation;
        }

        .checkout-product-card {
          position: relative;
          display: grid;
          grid-template-columns: 132px minmax(0, 1fr);
          align-items: stretch;
          gap: 18px;
          width: 100%;
          min-width: 0;
          margin-top: 16px;
          padding: 16px;
          border: 1px solid color-mix(in srgb, var(--season-primary, #2563eb) 12%, white);
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 8px 24px rgba(15,23,42,.055);
          transition: box-shadow .2s ease, border-color .2s ease, transform .2s ease;
        }

        .checkout-product-card:hover {
          border-color: color-mix(in srgb, var(--season-primary, #2563eb) 28%, white);
          box-shadow: 0 14px 30px rgba(15,23,42,.09);
          transform: translateY(-1px);
        }

        .checkout-product-image-button {
          display: block;
          width: 132px;
          min-width: 0;
          height: 150px;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 15px;
          background: #f3f6fb;
          cursor: pointer;
        }

        .checkout-product-image-button img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 7px;
          transition: transform .25s ease;
        }

        .checkout-product-image-button:hover img {
          transform: scale(1.045);
        }

        .checkout-product-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          padding-right: 42px;
        }

        .checkout-product-title {
          display: inline-block;
          width: fit-content;
          max-width: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          color: #111827;
          text-align: left;
          font-size: 17px;
          line-height: 1.4;
          font-weight: 800;
          cursor: pointer;
          overflow-wrap: anywhere;
        }

        .checkout-product-title:hover {
          color: var(--season-primary, #2563eb);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .checkout-product-price {
          margin: 7px 0 9px;
          color: var(--season-primary, #2563eb);
          font-size: 16px;
          font-weight: 800;
        }

        .checkout-product-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          min-width: 0;
        }

        .checkout-product-quantity {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 13px;
        }

        .checkout-product-quantity button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          min-width: 38px;
          min-height: 38px;
          padding: 0;
          line-height: 1;
          flex: 0 0 38px;
        }

        .checkout-product-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          min-width: 38px;
          min-height: 38px;
          padding: 0;
          line-height: 1;
        }

        @media (max-width: 900px) {
          .checkout-ios-root {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }

        @media (max-width: 600px) {
          .checkout-product-card {
            grid-template-columns: 112px minmax(0, 1fr);
            gap: 13px;
            padding: 12px;
            border-radius: 17px;
          }

          .checkout-product-image-button {
            width: 112px;
            height: 132px;
            align-self: center;
          }

          .checkout-product-content {
            padding-right: 30px;
          }

          .checkout-product-title {
            font-size: 15px;
            line-height: 1.35;
          }

          .checkout-product-price {
            font-size: 14px;
            margin: 5px 0 7px;
          }

          .checkout-product-quantity {
            gap: 8px;
            margin-top: 10px;
          }

          .checkout-product-quantity button {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
            flex-basis: 36px;
          }
        }

        @media (max-width: 380px) {
          .checkout-product-card {
            grid-template-columns: 88px minmax(0, 1fr);
            gap: 10px;
            padding: 10px;
          }

          .checkout-product-image-button {
            width: 88px;
            height: 112px;
          }

          .checkout-product-content {
            padding-right: 26px;
          }

          .checkout-product-title {
            font-size: 14px;
          }

          .checkout-product-price {
            font-size: 13px;
          }

          .checkout-product-remove {
            top: 8px !important;
            right: 8px !important;
            width: 30px !important;
            height: 30px !important;
            min-width: 30px;
            min-height: 30px;
          }
        }

        @media (hover: none) {
          .checkout-product-card:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .checkout-ios-root *,
          .checkout-ios-root *::before,
          .checkout-ios-root *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
          }
        }

        /* KONAN SHOPPING — finition professionnelle du checkout */
        .checkout-summary-card {
          align-self: start;
        }
        .checkout-summary-card > h2 {
          padding-bottom: 16px;
          border-bottom: 1px solid color-mix(in srgb, var(--season-primary, #2563eb) 9%, white);
        }
        .checkout-order-summary {
          border: 1px solid color-mix(in srgb, var(--season-primary, #2563eb) 12%, white) !important;
          background: #fff !important;
          box-shadow: 0 12px 32px rgba(15,23,42,.07) !important;
          padding: 22px !important;
          border-radius: 22px !important;
        }
        .checkout-delivery-info {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin: -5px 0 17px;
          padding: 13px 15px;
          border: 1px solid color-mix(in srgb, var(--season-primary, #2563eb) 22%, white);
          border-radius: 14px;
          background: color-mix(in srgb, var(--season-primary, #2563eb) 5%, white);
          color: #1e40af;
          font-size: 13px;
          line-height: 1.45;
        }
        .checkout-delivery-info > svg {
          flex: 0 0 auto;
          margin-top: 2px;
          font-size: 17px;
        }
        .checkout-delivery-info div {
          display: grid;
          gap: 3px;
          min-width: 0;
        }
        .checkout-delivery-info strong {
          color: #1e3a8a;
          font-size: 13px;
          font-weight: 800;
        }
        .checkout-delivery-info span {
          color: #52627a;
        }
        .checkout-ios-root input[list] {
          padding-right: 14px;
        }
        @media (min-width: 901px) {
          .checkout-summary-card {
            position: sticky;
            top: 24px;
          }
        }
        @media (max-width: 600px) {
          .checkout-summary-card {
            margin-top: 18px;
          }
          .checkout-order-summary {
            margin-top: 18px !important;
            padding: 17px !important;
            border-radius: 18px !important;
          }
          .checkout-delivery-info {
            margin-top: -7px;
            padding: 11px 12px;
          }
        }
      `}</style>

      {/***** TITLE *****/}

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

            color: "var(--season-primary, #2563eb)",

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

        {/***** LEFT *****/}

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

                color: "var(--season-primary, #2563eb)",

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

      top: "50%",

      left: "15px",

      transform: "translateY(-50%)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

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

      top: "50%",

      left: "15px",

      transform: "translateY(-50%)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

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

      top: "50%",

      left: "15px",

      transform: "translateY(-50%)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

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

      top: "50%",

      left: "15px",

      transform: "translateY(-50%)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

      color: "#6b7280",

      fontSize: "15px",

      zIndex: 1,

    }}

  />

  <input
    type="text"
    list="konan-cameroon-cities"
    required
    value={city}
    onChange={(e) => setCity(e.target.value)}
    placeholder="Choisir ou saisir une ville"
    autoComplete="address-level2"
    style={{
      ...inputStyle,
      width: "100%",
      boxSizing: "border-box",
      paddingLeft: "45px",
      background: "linear-gradient(135deg,#ffffff,#f9fafb)",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
      fontWeight: "500",
    }}
  />
  <datalist id="konan-cameroon-cities">
    {CAMEROON_CITIES.map((cityName) => (
      <option key={cityName} value={cityName} />
    ))}
  </datalist>

</div>

{city && (
  <div className="checkout-delivery-info" role="status" aria-live="polite">
    <FaTruck />
    <div>
      <strong>
        {shipping === 0
          ? "Livraison offerte"
          : city === "Yaoundé"
          ? "Zone Yaoundé"
          : city === "Douala"
          ? "Zone Douala"
          : city === "Bafoussam"
          ? "Zone Bafoussam"
          : "Zone nationale"}
      </strong>
      <span>
        {shipping === 0
          ? "Votre panier bénéficie de la livraison gratuite."
          : `Frais de livraison : ${shipping.toLocaleString("fr-FR")} FCFA. Le tarif est calculé automatiquement selon la zone.`}
      </span>
    </div>
  </div>
)}

<div

  style={{

    position: "relative",

    width: "100%",

  }}

>

  <FaCity

    style={{

      position: "absolute",

      top: "50%",

      left: "15px",

      transform: "translateY(-50%)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

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

      top: "50%",

      left: "15px",

      transform: "translateY(-50%)",

      display: "flex",

      alignItems: "center",

      justifyContent: "center",

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

        top: "50%",

        left: "15px",

        transform: "translateY(-50%)",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

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

        caretColor: "var(--season-primary, #2563eb)",

        fontWeight: "600",

      }}

    />

  </div>

  <button

    onClick={applyCoupon}

    style={{

      padding: "0 22px",

      minHeight: "56px",

      display: "inline-flex",

      alignItems: "center",

      justifyContent: "center",

      gap: "8px",

      border: "none",

      borderRadius: "16px",

      background:

        "linear-gradient(135deg,var(--season-secondary, #3b82f6),var(--season-primary, #2563eb))",

      color: "white",

      width: mobile ? "100%" : "auto",

      fontWeight: "800",

      cursor: "pointer",

      boxShadow:

        "0 8px 18px color-mix(in srgb, var(--season-primary, #2563eb) 25%, transparent)",

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

  className="checkout-summary-card"
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

        color: "var(--season-primary, #2563eb)",

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

            "linear-gradient(135deg,var(--season-primary, #2563eb),var(--season-secondary, #3b82f6))",

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
      <article
        key={item._id}
        className="checkout-product-card"
      >
        <button
          type="button"
          className="checkout-product-image-button"
          onClick={() => navigate(`/product/${item._id}`)}
          aria-label={`Voir le produit ${item.name || ""}`}
          title="Voir la fiche produit"
        >
          <img
            src={item.image}
            alt={item.name || "Produit Konan Shopping"}
            loading="lazy"
            decoding="async"
          />
        </button>

        <div className="checkout-product-content">
          <button
            type="button"
            className="checkout-product-title"
            onClick={() => navigate(`/product/${item._id}`)}
            title="Ouvrir la fiche produit"
          >
            {item.name}
          </button>

          <p className="checkout-product-price">
            {item.price} FCFA
          </p>

          <div className="checkout-product-meta">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "26px",
                padding: "4px 9px",
                borderRadius: "999px",
                background: "color-mix(in srgb, var(--season-primary, #2563eb) 9%, white)",
                color: "var(--season-primary, #2563eb)",
                fontSize: "11px",
                lineHeight: 1,
                fontWeight: 800,
              }}
            >
              <FaCheckCircle style={{ marginRight: "5px", flexShrink: 0 }} />
              Produit konanshopping
            </span>
          </div>

          <div className="checkout-product-quantity">
            <button
              type="button"
              onClick={() => updateQuantity(item._id, "minus")}
              aria-label={`Diminuer la quantité de ${item.name || "ce produit"}`}
              style={{
                borderRadius: "50%",
                border: "none",
                background: "color-mix(in srgb, var(--season-primary, #2563eb) 9%, white)",
                color: "var(--season-primary, #2563eb)",
                fontSize: "19px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              −
            </button>

            <span
              style={{
                minWidth: "22px",
                textAlign: "center",
                fontWeight: 800,
                fontSize: "15px",
                color: "#111827",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => updateQuantity(item._id, "plus")}
              aria-label={`Augmenter la quantité de ${item.name || "ce produit"}`}
              style={{
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(135deg,var(--season-primary, #2563eb),var(--season-secondary, #3b82f6))",
                color: "white",
                fontSize: "19px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          className="checkout-product-remove"
          onClick={() => removeItem(item._id)}
          aria-label={`Retirer ${item.name || "ce produit"} du panier`}
          title="Retirer du panier"
          style={{
            position: "absolute",
            top: mobile ? "10px" : "14px",
            right: mobile ? "10px" : "14px",
            border: "none",
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "white",
            borderRadius: "11px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            boxShadow: "0 4px 10px rgba(239,68,68,.18)",
          }}
        >
          <FaTrash style={{ fontSize: "13px" }} />
        </button>
      </article>
    ))}

{/* TOTAL */}

<div
  className="checkout-order-summary"
  style={{

    marginTop: "24px",

    background:

      "linear-gradient(135deg,#ffffff,color-mix(in srgb, var(--season-primary, #2563eb) 9%, white))",

    padding: mobile ? "22px" : "30px",

    borderRadius: mobile ? "22px" : "28px",

    boxShadow:

      "0 15px 35px color-mix(in srgb, var(--season-primary, #2563eb) 10%, transparent)",

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

        "color-mix(in srgb, var(--season-primary, #2563eb) 10%, transparent)",

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

          "linear-gradient(135deg,var(--season-primary, #2563eb),var(--season-secondary, #3b82f6))",

        width: mobile ? "55px" : "65px",

        height: mobile ? "55px" : "65px",

        borderRadius: "20px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        flexShrink: 0,

        boxShadow:

          "0 10px 25px color-mix(in srgb, var(--season-primary, #2563eb) 25%, transparent)",

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

    borderBottom: "1px solid color-mix(in srgb, var(--season-primary, #2563eb) 22%, white)",

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

    borderBottom: "1px solid color-mix(in srgb, var(--season-primary, #2563eb) 22%, white)",

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

      borderBottom: "1px solid color-mix(in srgb, var(--season-primary, #2563eb) 22%, white)",

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

      "linear-gradient(135deg,var(--season-primary, #2563eb),var(--season-secondary, #3b82f6))",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "16px",

    width: "100%",

    boxSizing: "border-box",

    boxShadow:

      "0 12px 25px color-mix(in srgb, var(--season-primary, #2563eb) 22%, transparent)",

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

      "linear-gradient(135deg,color-mix(in srgb, var(--season-primary, #2563eb) 9%, white),color-mix(in srgb, var(--season-secondary, #3b82f6) 5%, white))",

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

      color: "var(--season-primary, #2563eb)",

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

        : "linear-gradient(135deg,var(--season-secondary, #3b82f6),var(--season-primary, #2563eb))",

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

        : "0 12px 25px color-mix(in srgb, var(--season-primary, #2563eb) 35%, transparent)",

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

        "0 18px 35px color-mix(in srgb, var(--season-primary, #2563eb) 45%, transparent)";

    }

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =

      "translateY(0px)";

    e.currentTarget.style.boxShadow =

      loading || cart.length === 0

        ? "none"

        : "0 12px 25px color-mix(in srgb, var(--season-primary, #2563eb) 35%, transparent)";

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

  fontSize: "16px",

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