import {
  useEffect,
  useState,
  useMemo
} from "react";

import AiMode from "./pages/AiMode";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import axios from "axios";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Boutique from "./pages/Boutique";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import UserLogin from "./pages/UserLogin";

import Success from "./pages/Success";

import Favorites from "./pages/Favorites";
import Account from "./pages/Account";

import ForgotPassword
from "./pages/ForgotPassword";

import Message from "./pages/Message";

import ResetPassword
from "./pages/ResetPassword";

import AdminMessages from "./pages/AdminMessages";

import ProductDetails from "./pages/ProductDetails";

import MyOrders
from "./pages/Myorders";

import Coupons from "./pages/Coupons";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {

  FaBoxOpen,

  FaWhatsapp,

  FaExclamationTriangle,

  FaStar,

  FaFire,

  FaCrown,

  FaMicrophone,

  FaCamera,

  FaCheck,

  FaSpinner,

  FaRobot,

  FaCheckCircle

} from "react-icons/fa";

import {

  FaSearch,

  FaHome,

  FaThLarge,

  FaComments,

  FaShoppingCart,

  FaUser,

} from "react-icons/fa";

import {
  FaHeart,
  FaUserCircle,
} from "react-icons/fa";

import { FaFireAlt } from "react-icons/fa";

import Messages from "./pages/Messages";

import PendingOrders from "./pages/PendingOrders";
import ShippedOrders from "./pages/ShippedOrders";
import DeliveredOrders from "./pages/DeliveredOrders";
import CancelledOrders from "./pages/CancelledOrders";

import OrderDetails
from "./pages/OrderDetails";

import TrackOrder from "./pages/TrackOrder";

import DriverTracking
from "./pages/DriverTracking";

import DriverRegister
from "./pages/DriverRegister";

import DriverLogin
from "./pages/DriverLogin";

import Drivers from "./pages/Drivers";

import AdminProducts
from "./pages/AdminProducts";

import AdminClients
from "./pages/AdminClients";

import AdminStats from "./pages/AdminStats";

import AdminOrders
from "./pages/AdminOrders";

import AdminSettings from "./pages/AdminSettings";

import Deliveries from "./pages/Deliveries";

function Home() {

const [favoritesCount,
setFavoritesCount] =
useState(0);

useEffect(() => {

  const updateFavorites =
    () => {

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

      const favoritesKey =
        `favorites_${clientId}`;

      const favorites =

        JSON.parse(
          localStorage.getItem(
            favoritesKey
          )
        ) || [];

      setFavoritesCount(
        favorites.length
      );

    };

  // LOAD INITIAL

  updateFavorites();

  // LIVE UPDATE

  window.addEventListener(
    "favoritesUpdated",
    updateFavorites
  );

  return () => {

    window.removeEventListener(
      "favoritesUpdated",
      updateFavorites
    );

  };

}, []);

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

const favoritesKey =
  `favorites_${clientId}`;

const [likedProducts, setLikedProducts] =
  useState([]);

useEffect(() => {

  const favorites =
    JSON.parse(
      localStorage.getItem(
        "favorites"
      )
    ) || [];

  setLikedProducts(
    favorites.map(
      (item) => item._id
    )
  );

}, []);

const admin =
  JSON.parse(
    localStorage.getItem(
      "admin"
    )
  );

const placeholders = [
  "Que recherchez-vous aujourd’hui ?",
  "Jordan 4",
  "Chemise",
  "Sac à dos",
  "Chaussures Nike",
  "Montre",
  "T-shirts",

  "🔥 Promotion Samsung -20%",

"📱 Nouveaux iPhone disponibles",

"👟 Découvrez nos Nike",

"⌚ Montres tendance 2026",

"Creé un compte konanshopping",

"Béneficie de JUSQU A",

"5000FCFA OFFERT PREMIER ACHAT",

"🚚 Livraison rapide partout au Cameroun"

];

const [loading,
setLoading] =
useState(false);

const [placeholderIndex, setPlaceholderIndex] =
  useState(0);

useEffect(()=>{

  trackVisitor();

},[]);

const trackVisitor =
  async()=>{

    try{

      // GEO LOCALISATION IP

      const response =
  await fetch(
    "https://ipapi.co/json/"
  );

const geo =
  await response.json();

console.log(geo);

      await axios.post(

        "https://konanshopping-production.up.railway.app/track-visitor",

        {

          ip: geo.ip,

          country:
            geo.country,

          city:
            geo.city,

          device:
            navigator.userAgent,

        }

      );

    }

    catch(err){

      console.log(err);

    }

};

useEffect(() => {

  const interval = setInterval(() => {

    setPlaceholderIndex((prev) =>
      (prev + 1) % placeholders.length
    );

  }, 2000);

  return () => clearInterval(interval);

}, []);

const [image,setImage] =
useState(null);

const [showAlert, setShowAlert] =
  useState(false);

const [aiProducts,
setAiProducts] =
useState([]);

  const [products, setProducts] =
    useState([]);

    const [suggestions, setSuggestions] =
useState([]);

  const [cart, setCart] =
  useState(() => {

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

    const cartKey =
      `cart_${clientId}`;

    const savedCart =

      localStorage.getItem(
        cartKey
      );

    return savedCart
      ? JSON.parse(savedCart)
      : [];

  });

  const [search, setSearch] =
    useState("");

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const recognition =
  SpeechRecognition
    ? new SpeechRecognition()
    : null;

recognition.lang = "fr-FR";

const startVoice = () => {

  if (!recognition) {
    alert("Recherche vocale non supportée");
    return;
  }

  recognition.start();

  recognition.onresult = (event) => {

    const text =
      event.results[0][0].transcript;

    setSearch(text);

  };

};

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState("Tous");

  useEffect(() => {

    axios
      .get("https://konanshopping-production.up.railway.app/products")

      .then((res) => {

        setProducts(res.data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  const [addedProduct, setAddedProduct] =
useState(null);

useEffect(() => {
  console.log("addedProduct =", addedProduct);
}, [addedProduct]);

  const addToCart = (product) => {

  const user =

    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  // =====================
  // IDENTIFIANT CLIENT
  // =====================

  const clientId =

    user?._id ||

    localStorage.getItem(
      "guestId"
    ) ||

    (() => {

      const newGuestId =

        "guest_" +
        Date.now();

      localStorage.setItem(
        "guestId",
        newGuestId
      );

      return newGuestId;

    })();

  // =====================
  // PANIER PRIVÉ CLIENT
  // =====================

  const cartKey =
    `cart_${clientId}`;

  const existingProduct =

    cart.find(
      (item) =>
        item._id === product._id
    );

  let updatedCart = [];

  // =====================
  // PRODUIT EXISTE
  // =====================

  if (existingProduct) {

    updatedCart = cart.map(
      (item) =>

        item._id === product._id

          ? {

              ...item,

              quantity:
                (item.quantity || 1) + 1,

            }

          : item

    );

  }

  // =====================
  // NOUVEAU PRODUIT
  // =====================

  else {

    updatedCart = [

      ...cart,

      {

        ...product,

        quantity: 1,

      },

    ];

  }

  // =====================
  // UPDATE STATE
  // =====================

  setCart(updatedCart);

  // =====================
  // SAVE CLIENT CART
  // =====================

  localStorage.setItem(

    cartKey,

    JSON.stringify(
      updatedCart
    )

  );

  // =====================
  // UPDATE COUNT
  // =====================

  localStorage.setItem(

    "cartCount",

    updatedCart.length

  );

  // =====================
  // EVENT UPDATE
  // =====================

  window.dispatchEvent(
    new Event("cartUpdated")
  );

};

const [visibleProducts, setVisibleProducts] =
  useState(8);

const randomizedProducts = useMemo(() => {
  return [...products].sort(
    () => Math.random() - 0.5
  );
}, [products]);

useEffect(() => {
const handleScroll = () => {
    if (
      window.innerHeight +
        window.scrollY >=
      document.body.offsetHeight - 300
    ) {
      setVisibleProducts((prev) =>
        prev + 4
      );
    }
  };

window.addEventListener("scroll", handleScroll);

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );
}, []);

const searchProducts =
async()=>{

try{

setLoading(true);

// =====================
// SI IMAGE
// =====================

if(image){

const formData =
new FormData();

formData.append(
"image",
image
);

const res =
await axios.post(

"https://konanshopping-production.up.railway.app/products/ai-search",

formData

);

console.log(res.data);

setAiProducts(
res.data.products
);

}

// =====================
// SI TEXTE
// =====================

else if(search.trim() !== ""){

const res =
await axios.get(

`https://konanshopping-production.up.railway.app/products/search/${search}`

);

setProducts(
res.data
);

}

// =====================
// RIEN
// =====================

else{

  setShowAlert(true);

}

setLoading(false);

}

catch(err){

console.log(err);

setLoading(false);

}

};

console.log(document.documentElement.scrollHeight);
console.log(window.innerHeight);


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f7",
        fontFamily: "Arial",
        width: "100%",
        maxWidth: "100%",
      }}
    >

<input
  type="file"

  accept="image/*"

  id="imageUpload"

  style={{
    display: "none",
  }}

  onChange={(e) => {

    const file =
      e.target.files[0];

    setImage(file);

  }}
/>

    
{/* HEADER */}

<div
  style={{
    background: "white",

    padding:
      window.innerWidth < 768
        ? "10px"
        : "12px 22px",

    borderBottom:
      "1px solid #ececec",
  }}
>

  {/* TOP NAV */}

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      gap: "12px",

      flexWrap: "nowrap",
    }}
  >

    {/* LOGO */}

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "8px",
      }}
    >

      <img
        src="/logo.jpg"
        alt=""

        style={{
          width: "35px",

          height: "35px",

          objectFit: "cover",

          borderRadius: "10px",
        }}
      />

      <div>

        <h1
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#1f1b4b",
            fontWeight: "900",
            lineHeight: "1.1",
          }}
        >
          KONAN
        </h1>

        <h2
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#5b3cc4",
            fontWeight: "900",
            lineHeight: "1.1",
          }}
        >
          SHOPPING
        </h2>

      </div>

    </div>

   {/* SEARCH */}

    <div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    minWidth: "0",
    marginLeft: "8px",
    marginRight: "8px",
  }}
>

      <div
style={{
width:"100%",
maxWidth:
window.innerWidth < 768
? "180px"
: "350px",
background:"white",
position:"relative",
borderRadius:"50px",
display:"flex",
alignItems:"center",
overflow:"hidden",
boxShadow:
"0 3px 10px rgba(0,0,0,0.06)",
}}
>

        <input
          type="text"

          placeholder={placeholders[placeholderIndex]}

          value={search}

          onChange={(e) => {

const value =
e.target.value;

setSearch(value);

if(value.trim()){

const filtered =

products.filter(product =>

product.name
.toLowerCase()
.includes(
value.toLowerCase()
)

);

setSuggestions(
filtered.slice(0,5)
);

}

else{

setSuggestions([]);

}

}}

          style={{
  flex: 1,
  border: "none",
  outline: "none",
  padding: "8px 12px",
  fontSize: "13px",
  background: "transparent",

  color: "#111827",
  WebkitTextFillColor: "#111827",
  caretColor: "#4B2E83",
}}
  />

        <button
          style={{
            width: "38px",
            height: "38px",
            border: "none",
            background: "#4B2E83",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <FaSearch />
        </button>

      </div>

      {suggestions.length > 0 && (

<div
style={{
position:"absolute",
top:"55px",
left:0,
right:0,
background:"#fff",
borderRadius:"18px",
boxShadow:
"0 10px 30px rgba(0,0,0,.12)",
zIndex:999,
overflow:"hidden"
}}
>

{suggestions.map(product => (

<div

key={product._id}

onClick={() => {

setSearch(product.name);

setSuggestions([]);

window.location.href =
`/product/${product._id}`;

}}

style={{
display:"flex",
alignItems:"center",
gap:"10px",
padding:"12px",
cursor:"pointer",
borderBottom:
"1px solid #f3f4f6"
}}
>

<img
src={product.image}
alt=""
style={{
width:"40px",
height:"40px",
borderRadius:"10px",
objectFit:"cover"
}}
/>

<div>

<div
style={{
fontSize:"13px",
fontWeight:"700",
color:"#111827"
}}
>

{product.name}

</div>

<div
style={{
fontSize:"11px",
color:"#6b7280"
}}
>

{Number(
product.price
).toLocaleString()}
FCFA

</div>

</div>

</div>

))}

</div>

)}

    </div>

{/* ICONS */}

<div
  style={{
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexShrink: 0,
  }}
>

  {/* FAVORIS */}

  <Link
    to="/favorites"
    style={{
      textDecoration: "none",
      color: "#111827",
    }}
  >

    <div
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >

      <FaHeart
        style={{
          fontSize: "18px",
        }}
      />

      {favoritesCount > 0 && (

        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",

            width: "16px",
            height: "16px",

            borderRadius: "50%",

            background: "#5b3cc4",

            color: "#fff",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            fontSize: "9px",
            fontWeight: "700",

            boxShadow:
              "0 2px 8px rgba(91,60,196,0.3)",
          }}
        >
          {favoritesCount}
        </span>

      )}

    </div>

  </Link>

  {/* PANIER */}

  <Link
    to="/checkout"
    state={{ cart }}
    style={{
      textDecoration: "none",
      color: "#111827",
    }}
  >

    <div
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >

      <FaShoppingCart
        style={{
          fontSize: "18px",
        }}
      />

      <span
        style={{
          position: "absolute",
          top: "-4px",
          right: "-4px",

          width: "16px",
          height: "16px",

          borderRadius: "50%",

          background: "#5b3cc4",

          color: "#fff",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          fontSize: "9px",
          fontWeight: "700",

          boxShadow:
            "0 2px 8px rgba(91,60,196,0.3)",
        }}
      >
        {cart.reduce(
          (total, item) =>
            total + (item.quantity || 1),
          0
        )}
      </span>

    </div>

  </Link>

  {/* COMPTE */}

  <Link
    to="/account"
    style={{
      textDecoration: "none",
      color: "#111827",
    }}
  >

    <div
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >

      <FaUserCircle
        style={{
          fontSize: "18px",
        }}
      />

    </div>

  </Link>

</div>

  </div>

  {/* TABS */}

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "14px",
      overflowX: "auto",
      paddingBottom: "4px",
    }}
  >

    {[
      {
        name: "AI Mode",
        link: "/ai-mode",
      },

      {
        name: "Produits",
        link: "/boutique",
      },

      {
  name: "Boutique",
  link: "/boutique",
},

...(admin ? [

  {
    name: "Admin",
    link: "/admin-login",
  },

  {
    name: "Livreur",
    link: "/driver-login",
  },

  {
    name: "Livreurs",
    link: "/drivers",
  },

] : [])

].map((item, index) => (

  <Link
  key={index}

  to={item.link}

  style={{
    textDecoration: "none",
  }}
>

        <button
          style={{
            border: "none",

            background:
              index === 1
                ? "#4B2E83"
                : "#f3f4f6",

            color:
              index === 1
                ? "white"
                : "#111827",

            padding: "8px 14px",

            borderRadius: "12px",

            fontWeight: "700",

            fontSize: "11px",

            cursor: "pointer",

            whiteSpace: "nowrap",
          }}
        >
          {item.name}
        </button>

      </Link>

    ))}

  </div>

</div>

{/* BIG SEARCH */}

<div
  style={{
    background: "#FFFFFF",
    borderRadius: "18px",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    gap: image ? "5px" : "8px",
    marginTop: "14px",
    marginBottom: "18px",
    border: "1px solid #F1F5F9",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
    overflow: "hidden",
  }}
>

  {/* CAMERA */}

  <button
    onClick={() =>
      document
        .getElementById("imageUpload")
        .click()
    }
    style={{
      width: "38px",
      height: "38px",
      border: "none",
      borderRadius: "10px",
      background: "#F5F3FF",
      color: "#4B2E83",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    <FaCamera size={15} />
  </button>

  {/* INPUT */}

  <div
    style={{
      flex: 1,
      minWidth: image ? "80px" : "140px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "#F9FAFB",
      borderRadius: "12px",
      padding: image ? "0 6px" : "0 10px",
      height: "38px",
      overflow: "hidden",
    }}
  >

    <FaSearch
      style={{
        color: "#9CA3AF",
        fontSize: "12px",
        flexShrink: 0,
      }}
    />

    <input
      type="text"
      placeholder={placeholders[placeholderIndex]}
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      style={{
        flex: 1,
        minWidth: 0,
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "12px",
        color: "#111827",
        WebkitTextFillColor: "#111827",
        caretColor: "#4B2E83",
      }}
    />

  </div>

  {/* MICRO */}

  <button
    onClick={startVoice}
    style={{
      width: "38px",
      height: "38px",
      border: "none",
      borderRadius: "10px",
      background: "#F5F3FF",
      color: "#4B2E83",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    <FaMicrophone size={15} />
  </button>

  {/* IMAGE */}

  {image && (

    <div
      style={{
        position: "relative",
        width: "45px",
        height: "45px",
        flexShrink: 0,
      }}
    >

      <img
        src={URL.createObjectURL(image)}
        alt=""
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "10px",
          objectFit: "cover",
          boxShadow:
            "0 3px 10px rgba(0,0,0,.08)",
        }}
      />

      <button
        onClick={() =>
          setImage(null)
        }
        style={{
          position: "absolute",
          top: "-4px",
          right: "-4px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "none",
          background: "#EF4444",
          color: "#FFFFFF",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "8px",
          fontWeight: "700",
        }}
      >
        ✕
      </button>

    </div>

  )}

  {/* RECHERCHE */}

  <button
    onClick={searchProducts}
    disabled={loading}
    style={{
      border: "none",
      background:
        "linear-gradient(135deg,#4B2E83,#6D28D9)",
      color: "#FFFFFF",
      height: "38px",
      minWidth: image ? "38px" : "95px",
      padding: image ? "0 10px" : "0 12px",
      borderRadius: "12px",
      fontWeight: "700",
      fontSize: "11px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "5px",
      boxShadow:
        "0 4px 12px rgba(75,46,131,.18)",
      flexShrink: 0,
      whiteSpace: "nowrap",
    }}
  >

    {loading ? (
      <>
        <FaSpinner
          className="spin"
          size={11}
        />
        {!image && "Recherche..."}
      </>
    ) : (
      <>
        <FaSearch size={11} />
        {!image && "Rechercher"}
      </>
    )}

  </button>

</div>

   {/* QUICK ACTIONS */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      window.innerWidth < 768
        ? "repeat(2,1fr)"
        : "repeat(4,1fr)",

    gap: "12px",

    marginBottom: "22px",
  }}
>


  {/* CATEGORIES */}

  <Link
    to="/boutique"

    style={{
      textDecoration: "none",
    }}
  >

    <div
      style={quickCard}
    >

      <div
        style={{
          fontSize: "26px",
          marginBottom: "10px",
        }}
      >
        <FaBoxOpen />
      </div>

      <h3 style={quickTitle}>
        Explorer catégories
      </h3>

    </div>

  </Link>

  {/* DEVIS */}

  <a
    href="https://wa.me/237694641329"

    target="_blank"

    style={{
      textDecoration: "none",
    }}
  >

    <div
      style={quickCard}
    >

      <div
        style={{
          fontSize: "26px",
          marginBottom: "10px",
        }}
      >
        <FaWhatsapp />
      </div>

      <h3 style={quickTitle}>
        Whatsapp
      </h3>

    </div>

  </a>

  {/* PRODUITS */}

  <Link
    to="/boutique"

    style={{
      textDecoration: "none",
    }}
  >

    <div
      style={quickCard}
    >

      <div
        style={{
          fontSize: "26px",
          marginBottom: "10px",
        }}
      >
       <FaFire />
      </div>

      <h3 style={quickTitle}>
        Produits populaires
      </h3>

    </div>

  </Link>

  {/* OFFRES */}

  <Link
    to="/boutique"

    style={{
      textDecoration: "none",
    }}
  >

    <div
      style={quickCard}
    >

      <div
        style={{
          fontSize: "26px",
          marginBottom: "10px",
        }}
      >
<FaCrown />
      </div>

      <h3 style={quickTitle}>
        Offres exclusives
      </h3>

    </div>

  </Link>

</div>

       {/* CATEGORIES */}

<div
  style={{
    marginBottom: "35px",
  }}
>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    }}
  >

    <h2
      style={{
        margin: 0,
        fontSize: "22px",
        fontWeight: "800",
        color: "#1f2937",
      }}
    >
      Catégories
    </h2>

    <Link
      to="/boutique"
      style={{
        textDecoration: "none",
      }}
    >

      <button
       style={{
          border: "none",

          background: "#4B2E83",

          color: "white",

          padding: "8px 14px",

          borderRadius: "12px",

          fontWeight: "700",

          fontSize: "12px",

          cursor: "pointer",

          boxShadow:
            "0 4px 12px rgba(75,46,131,0.15)",

          transition: "0.3s",
        }}
      >
        Voir tout
      </button>

    </Link>

  </div>

  <div
    style={{
      display: "flex",
      gap: "8px",
      overflowX: "auto",
      paddingBottom: "8px",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    }}
  >

    {[
      "Tous",

      ...new Set(
        products.map(
          (product) =>
            product.category
        )
      ),

    ].map((category, index) => (

      <button
        key={index}

        onClick={() =>
          setSelectedCategory(
            category
          )
        }

        style={{
          border: "none",

          background:
            selectedCategory === category
              ? "#4B2E83"
              : "#FFFFFF",

          color:
            selectedCategory === category
              ? "#FFFFFF"
              : "#374151",

          padding: "10px 18px",

          borderRadius: "14px",

          fontWeight: "700",

          cursor: "pointer",

          fontSize: "12px",

          whiteSpace: "nowrap",

          boxShadow:
            selectedCategory === category
              ? "0 6px 15px rgba(75,46,131,0.18)"
              : "0 3px 10px rgba(0,0,0,0.04)",

          transition: "all 0.25s ease",
        }}
      >
        {category}
      </button>

    ))}

  </div>

</div>

{/* PRODUITS */}

<div
  style={{
    marginBottom: "35px",
  }}
>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    }}
  >

    <h2
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",

        margin: 0,

        fontSize: "22px",

        fontWeight: "800",

        color: "#1f2937",
      }}
    >
      Meilleures offres

      <FaFireAlt
        style={{
          color: "#ff6b00",

          fontSize: "22px",

          filter:
            "drop-shadow(0 3px 8px rgba(255,107,0,0.25))",
        }}
      />
    </h2>

    <Link
      to="/boutique"
      style={{
        textDecoration: "none",
      }}
    >

      <button
        style={{
          border: "none",

          background: "#4B2E83",

          color: "white",

          padding: "8px 14px",

          borderRadius: "12px",

          fontWeight: "700",

          fontSize: "12px",

          cursor: "pointer",

          boxShadow:
            "0 4px 12px rgba(75,46,131,0.15)",

          transition: "0.3s",
        }}
      >
        Voir tout
      </button>

    </Link>

  </div>

  {/* GRID */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      window.innerWidth < 768
        ? "repeat(2,1fr)"
        : "repeat(auto-fill,minmax(240px,1fr))",

    gap: "14px",

    width: "100%",
  }}
>

{aiProducts.length > 0 && (

<div
style={{
marginBottom:"20px",
gridColumn:"1/-1",
}}
>

<h2
style={{
display:"flex",
alignItems:"center",
gap:"8px",

fontSize:"20px",

fontWeight:"800",

color:"#111827",

marginBottom:"10px",
}}
>

<FaRobot
style={{
color:"#4B2E83",
}}
/>

Résultats IA

</h2>

</div>

)}

{aiProducts.length === 0
&& image && (

<div
style={{

background:"#FFFFFF",

padding:"25px",

borderRadius:"20px",

textAlign:"center",

marginBottom:"20px",

gridColumn:"1/-1",

boxShadow:
"0 4px 15px rgba(0,0,0,0.05)",

border:
"1px solid #F3F4F6",

}}

>

<div
style={{

width:"80px",

height:"80px",

margin:"0 auto 18px auto",

borderRadius:"50%",

background:
"linear-gradient(135deg,#EEF2FF,#E0E7FF)",

display:"flex",

justifyContent:"center",

alignItems:"center",

boxShadow:
"0 4px 12px rgba(79,70,229,0.12)",

}}

>

<FaRobot
style={{
fontSize:"36px",
color:"#4F46E5",
}}
/>

</div>

<h2
style={{

color:"#111827",

fontSize:"22px",

fontWeight:"800",

marginBottom:"8px",

}}
>

Aucun produit similaire trouvé

</h2>

<p
style={{

color:"#6B7280",

lineHeight:"24px",

fontSize:"14px",

maxWidth:"400px",

margin:"0 auto",

}}
>

Essayez une autre image ou utilisez une photo plus claire pour améliorer la recherche IA.

</p>

</div>

)}

{(aiProducts.length > 0
? aiProducts
: randomizedProducts)

.filter((product) => {

const matchSearch =
product.name
.toLowerCase()
.includes(
search.toLowerCase()
);

const matchCategory =
selectedCategory === "Tous"
? true
: product.category ===
selectedCategory;

return (
matchSearch &&
matchCategory
);

})

.slice(0, visibleProducts)

.map((product) => (

<Link
to={`/product/${product._id}`}
key={product._id}
style={{
textDecoration:"none",
color:"#111827",
}}
>

<div
style={{
background:"#FFFFFF",

borderRadius:"16px",

overflow:"hidden",

border:
"1px solid #F3F4F6",

boxShadow:
"0 4px 12px rgba(0,0,0,0.05)",

cursor:"pointer",

transition:"all .25s ease",

position:"relative",
}}
>

{/* IMAGE */}

<div
style={{
background:"#F9FAFB",
padding:"10px",
}}
>

<img
src={product.image}
alt={product.name}

style={{
width:"100%",

height:
window.innerWidth < 768
? "160px"
: "200px",

objectFit:"cover",

borderRadius:"10px",

display:"block",
}}
/>

</div>

{/* FAVORIS */}

<button

  onClick={async (e) => {

    e.preventDefault();

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    // ======================
    // FAVORIS LOCAL
    // ======================

    const clientId =

      user?._id ||

      localStorage.getItem(
        "guestId"
      ) ||

      (() => {

        const newGuestId =

          "guest_" +
          Date.now();

        localStorage.setItem(
          "guestId",
          newGuestId
        );

        return newGuestId;

      })();

    const favoritesKey =
      `favorites_${clientId}`;

    let favorites =

      JSON.parse(
        localStorage.getItem(
          favoritesKey
        )
      ) || [];

    const alreadyExists =
      favorites.find(
        (item) =>
          item._id === product._id
      );

    // ======================
    // RETIRER FAVORI
    // ======================

    if (alreadyExists) {

  favorites =

    favorites.filter(
      (item) =>
        item._id !== product._id
    );

  // ======================
  // DELETE FAVORITE SERVER
  // ======================

  if (user?._id) {

    try {

      await axios.delete(

        `https://konanshopping-production.up.railway.app/favorites/${user._id}/${product._id}`

      );

    }

    catch(err){

      console.log(err);

    }

  }

}

    // ======================
    // AJOUTER FAVORI
    // ======================

    else {

      favorites.push(product);

      // CLIENT CONNECTÉ

      if (user?._id) {

        try {

          await axios.post(
            "https://konanshopping-production.up.railway.app/favorites",
            {

              userId: user._id,

              productId:
                product._id,

            }
          );

        }

        catch(err){

          console.log(err);

        }

      }

    }

    // ======================
    // SAVE LOCALSTORAGE
    // ======================

    localStorage.setItem(

      favoritesKey,

      JSON.stringify(favorites)

    );

    // ======================
    // FAVORITES COUNT
    // ======================

    localStorage.setItem(

      "favoritesCount",

      favorites.length

    );

    // ======================
    // UPDATE UI
    // ======================

    window.dispatchEvent(
      new Event("favoritesUpdated")
    );

window.dispatchEvent(
  new StorageEvent("storage")
);

  }}

  style={{

    position: "absolute",

    top: "12px",

    right: "12px",

    width: "34px",

    height: "34px",

    borderRadius: "50%",

    border: "none",

    background:

JSON.parse(
  localStorage.getItem(
    favoritesKey
  )
)?.find(
  (item) =>
    item._id === product._id
)

? "#2563eb"

: "#f3f4f6",

    color:

JSON.parse(
  localStorage.getItem(
    favoritesKey
  )
)?.find(
  (item) =>
    item._id === product._id
)

? "white"

: "#9ca3af",

    fontSize: "15px",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    transition: "all 0.3s ease",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.10)",

    zIndex: "10",

  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "scale(1.08)";

    e.currentTarget.style.boxShadow =
      "0 10px 22px rgba(37,99,235,0.18)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "scale(1)";

    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(0,0,0,0.10)";

  }}

>

  <FaHeart

style={{

color:

JSON.parse(
localStorage.getItem(
favoritesKey
)
)?.find(
(item) =>
item._id === product._id
)

? "white"

: "#9ca3af",

transition: "0.3s",

filter:

JSON.parse(
localStorage.getItem(
favoritesKey
)
)?.find(
(item) =>
item._id === product._id
)

? "drop-shadow(0 2px 8px rgba(255,255,255,0.35))"

: "none",

}}

/>

</button>


  {/* CONTENT */}

  <div
    style={{
      padding: "14px", // réduit
    }}
  >

    <p
      style={{
        color: "#6b7280",
        fontSize: "12px", // réduit
        marginBottom: "6px",
      }}
    >
      {product.category}
    </p>

    <h3
      style={{
        margin: 0,

        fontSize:
          window.innerWidth < 768
            ? "15px"
            : "18px", // réduit

        color: "#111827",

        marginBottom: "8px",

        lineHeight: "1.3",
      }}
    >
      {product.name}
    </h3>

   <div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "5px",

    marginBottom: "8px",

    flexWrap: "wrap",
  }}
>

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "2px",
  }}
>

{[...Array(5)].map(
(_, index) => {

const averageRating =

product.reviews?.length > 0

? (

product.reviews.reduce(

(total, review)=>

total + review.rating,

0

) /

product.reviews.length

)

: 0;

return (

<FaStar
  key={index}

  style={{
    fontSize: "10px",

    color:
      index <
      Math.round(
        averageRating
      )

        ? "#f59e0b"

        : "#d1d5db",
  }}
/>

);

}
)}

</div>

<span
  style={{
    color: "#111827",

    fontSize: "11px",

    fontWeight: "800",
  }}
>

{

product.reviews?.length > 0

? (

product.reviews.reduce(

(total, review)=>

total + review.rating,

0

) /

product.reviews.length

).toFixed(1)

: "0.0"

}

</span>

<span
  style={{
    color: "#6b7280",

    fontSize: "11px",

    fontWeight: "500",
  }}
>

(

{product.reviews?.length || 0}

avis )

</span>

</div>

    <h2
      style={{
        margin: 0,

        color: "#4B2E83",

        fontSize:
          window.innerWidth < 768
            ? "18px"
            : "24px", // réduit

        marginBottom: "14px",

        fontWeight: "900",
      }}
    >
      {product.price} FCFA
    </h2>

    <div
      style={{
        display: "flex",
        gap: "8px", // réduit
      }}
    >
    

  <button
onClick={(e) => {

  e.preventDefault();
  e.stopPropagation();

  addToCart(product);

  setAddedProduct(product._id);

  setTimeout(() => {
    setAddedProduct(null);
  }, 1500);

}}
style={{
  flex:1,
  border:"1px solid #e5e7eb",

  background:
  addedProduct === product._id
  ? "#10b981"
  : "white",

  color:
  addedProduct === product._id
  ? "#ffffff"
  : "#111827",

  padding:"10px",

  borderRadius:"12px",

  fontWeight:"700",

  fontSize:"12px",

  cursor:"pointer",

  transition:"all .25s ease",

  transform:
  addedProduct === product._id
  ? "scale(1.03)"
  : "scale(1)",

  boxShadow:
  addedProduct === product._id
  ? "0 6px 15px rgba(16,185,129,.25)"
  : "none",
}}
>
{
addedProduct === product._id
? "✓ Ajouté"
: "Ajouter"
}
</button>

      <button
        style={{
          flex: 1,

          border: "none",

          background:
            "linear-gradient(135deg,#6d28d9,#4f46e5)",

          color: "white",

          padding: "10px", // réduit

          borderRadius: "12px", // réduit

          fontWeight: "700",

          fontSize: "12px", // réduit

          cursor: "pointer",
        }}
      >
        Buy Now
      </button>

    </div>

</div>

</div>

</Link>

))
}

{/* BOTTOM NAVIGATION */}

<div
  style={{
    position: "fixed",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "92%",
    maxWidth: "500px",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "4px 0",
    zIndex: 999,
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  }}
>

  {[
    {
      icon: <FaHome />,
      name: "Accueil",
      link: "/",
    },

    {
      icon: <FaThLarge />,
      name: "Catégories",
      link: "/boutique",
    },

    {
      icon: <FaUser />,
      name: "Compte",
      link: "/account",
    },

    {
      icon: <FaShoppingCart />,
      name: "Panier",
      link: "/checkout",
    },

    {
      icon: <FaComments />,
      name: "Messages",
      link: "https://wa.me/237694641329",
    },

  ].map((item, index) => (

    item.name === "Messages" ? (

      <a
        key={index}
        href={item.link}
        target="_blank"
        rel="noreferrer"
        style={{
          textDecoration: "none",
        }}
      >

        <div
          className="bottomNavItem"

          onTouchStart={(e)=>{
            e.currentTarget.style.transform="scale(0.95)";
          }}

          onTouchEnd={(e)=>{
            e.currentTarget.style.transform="scale(1)";
          }}

          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1px",
            cursor: "pointer",
            padding: "3px 8px",
            borderRadius: "12px",
            transition: "0.2s ease",
          }}
        >

          <div
            className="bottomNavIcon"
            style={{
              fontSize: "20px",
            }}
          >
            {item.icon}
          </div>

          <span
            style={{
              fontSize: "9px",
              color:
                index === 0
                  ? "#4B2E83"
                  : "#6b7280",
              fontWeight:
                index === 0
                  ? "700"
                  : "500",
            }}
          >
            {item.name}
          </span>

        </div>

      </a>

    ) : (

      <Link
        key={index}
        to={item.link}
        state={
          item.name === "Panier"
            ? { cart }
            : undefined
        }
        style={{
          textDecoration: "none",
        }}
      >

        <div
          className="bottomNavItem"

          onTouchStart={(e)=>{
            e.currentTarget.style.transform="scale(0.95)";
          }}

          onTouchEnd={(e)=>{
            e.currentTarget.style.transform="scale(1)";
          }}

          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            cursor: "pointer",
            padding: "3px 8px",
            borderRadius: "12px",
            transition: "0.2s ease",
          }}
        >

          <div
            className="bottomNavIcon"
            style={{
              fontSize: "20px",
            }}
          >
            {item.icon}
          </div>

          <span
            style={{
              fontSize: "11px",
              color:
                index === 0
                  ? "#4B2E83"
                  : "#6b7280",
              fontWeight:
                index === 0
                  ? "700"
                  : "500",
            }}
          >
            {item.name}
          </span>

        </div>

      </Link>

    )

  ))}

</div>

  </div>
   
   </div>

   {
showAlert && (

<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "rgba(15,23,42,0.35)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter:
      "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999,
    padding: "20px",
  }}
>

  <div
    style={{
      background:
        "rgba(255,255,255,0.78)",
      backdropFilter:
        "blur(20px)",
      WebkitBackdropFilter:
        "blur(20px)",
      border:
        "1px solid rgba(255,255,255,0.4)",
      width: "85%",
      maxWidth: "290px",
      borderRadius: "24px",
      padding: "22px",
      textAlign: "center",
      boxShadow:
        "0 8px 32px rgba(31,38,135,.18)",
      animation:
        "fadeIn .25s ease",
    }}
  >

    {/* ICONE */}

    <div
      style={{
        width: "58px",
        height: "58px",
        margin:
          "0 auto 12px",
        borderRadius: "50%",
        background:
          "rgba(108,43,217,.08)",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
      }}
    >

      <FaSearch
        style={{
          fontSize: "22px",
          color: "#5B21B6",
        }}
      />

    </div>

    {/* TITRE */}

    <h3
      style={{
        color: "#111827",
        fontWeight: "800",
        fontSize: "18px",
        marginBottom: "8px",
      }}
    >
      KONAN SHOPPING
    </h3>

    {/* TEXTE */}

    <p
      style={{
        color: "#6B7280",
        lineHeight: "22px",
        fontSize: "13px",
        marginBottom: "18px",
      }}
    >
      Veuillez ajouter une image
      ou saisir un produit avant
      de lancer la recherche.
    </p>

    {/* BOUTON */}

    <button
      onClick={() =>
        setShowAlert(false)
      }
      style={{
        border: "none",
        width: "100%",
        height: "42px",
        borderRadius: "14px",
        background:
          "linear-gradient(135deg,#4B2E83,#7C3AED)",
        color: "#fff",
        fontWeight: "700",
        fontSize: "13px",
        cursor: "pointer",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        gap: "8px",
        boxShadow:
          "0 10px 25px rgba(91,33,182,.25)",
      }}
    >

      <FaCheckCircle />

      D'ACCORD

    </button>

  </div>

</div>

)
}

   </div>
 );

}


function App() {

  const [chatPosition, setChatPosition] =
    useState({
      x: window.innerWidth - 90,
      y: window.innerHeight - 160,
    });

 useEffect(() => {

  const currentPath =
    window.location.pathname;

  // =========================
  // BOT UNIQUEMENT SUR /
  // =========================

  const existingBot =
    document.querySelector(
      ".bpChatContainer"
    );

  if (existingBot) {

    existingBot.style.display =
      currentPath === "/"
        ? "block"
        : "none";

  }

  if (currentPath !== "/") {
    return;
  }

  // =========================
  // ÉVITER LE DOUBLE CHARGEMENT
  // =========================

  if (
    document.querySelector(
      'script[src*="botpress"]'
    )
  ) {
    return;
  }

  // =========================
  // CHARGEMENT BOTPRESS
  // =========================

  const script1 =
    document.createElement("script");

  script1.src =
    "https://cdn.botpress.cloud/webchat/v3.6/inject.js";

  script1.async = true;

  document.body.appendChild(
    script1
  );

  script1.onload = () => {

    const script2 =
      document.createElement("script");

    script2.src =
      "https://files.bpcontent.cloud/2025/01/25/16/20250125162805-WU2DYMW9.js";

    script2.defer = true;

    document.body.appendChild(
      script2
    );

    script2.onload = () => {

      const waitBot =
        setInterval(() => {

          const botpress =
            document.querySelector(
              ".bpChatContainer"
            );

          if (!botpress) return;

          clearInterval(
            waitBot
          );

          // =========================
          // POSITION PROFESSIONNELLE
          // =========================

          botpress.style.position =
            "fixed";

          botpress.style.zIndex =
            "99999";

          // MOBILE

          if (
            window.innerWidth < 768
          ) {

            botpress.style.bottom =
              "170px";

            botpress.style.right =
              "15px";

          } else {

            // PC

            botpress.style.bottom =
              "30px";

            botpress.style.right =
              "30px";

          }

          // =========================
          // ANIMATION
          // =========================

          botpress.style.opacity =
            "0";

          botpress.style.transition =
            "opacity .4s ease";

          setTimeout(() => {

            botpress.style.opacity =
              "1";

          }, 300);

          // =========================
          // EMPÊCHER DISPARITION
          // =========================

          const keepVisible = setInterval(() => {

  if (!document.body.contains(botpress)) {
    clearInterval(keepVisible);
    return;
  }

  botpress.style.display = "block";
  botpress.style.visibility = "visible";

}, 3000);

        }, 500);

    };

  };

}, []);

  return (


    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/boutique"
          element={<Boutique />}
        />

        <Route
          path="/login"
          element={<UserLogin />}
        />

        <Route
          path="/admin-login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/user-login"
          element={<UserLogin />}
        />

<Route
  path="/ai-mode"
  element={<AiMode />}
/>

<Route
  path="/favorites"
  element={<Favorites />}
/>

<Route
  path="/account"
  element={<Account />}
/>

<Route
  path="/product/:id"
  element={<ProductDetails />}
/>

<Route
  path="/success"
  element={<Success />}
/>

<Route
  path="/my-orders"
  element={<MyOrders />}
/>

<Route
  path="/coupons"
  element={<Coupons />}
/>

<Route
  path="/messages"
  element={<Messages />}
/>

<Route
  path="/orders/pending"
  element={<PendingOrders />}
/>

<Route
  path="/orders/shipped"
  element={<ShippedOrders />}
/>

<Route
  path="/orders/delivered"
  element={<DeliveredOrders />}
/>

<Route
  path="/orders/cancelled"
  element={<CancelledOrders />}
/>

<Route
  path="/order/:id"
  element={<OrderDetails />}
/>

<Route
  path="/track-order/:id"
  element={<TrackOrder />}
/>

<Route
  path="/driver/:id"
  element={<DriverTracking />}
/>

<Route
  path="/driver-register"
  element={<DriverRegister />}
/>

<Route
  path="/driver-login"
  element={
    <DriverLogin />
  }
/>

<Route
  path="/driver-dashboard"
  element={
    <DriverTracking />
  }
/>

<Route
  path="/drivers"
  element={<Drivers />}
/>

<Route
  path="/admin-products"
  element={<AdminProducts />}
/>

<Route
  path="/admin-clients"
  element={<AdminClients />}
/>

<Route
  path="/admin-stats"
  element={<AdminStats />}
/>

<Route
  path="/admin-orders"
  element={<AdminOrders />}
/>

<Route
  path="/admin/settings"
  element={<AdminSettings />}
/>

<Route
  path="/deliveries"
  element={<Deliveries />}
/>

<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password/:token"
  element={
    <ResetPassword />
  }
/>

<Route
  path="/message"
  element={<Message />}
/>

<Route
  path="/admin-messages"
  element={<AdminMessages />}
/>

      </Routes>

<ToastContainer
  position="top-center"
  autoClose={2500}
  theme="colored"
/>

</BrowserRouter>

  );

}

const quickCard = {
  background: "white",

  borderRadius: "16px",

  padding: "16px 14px",

  boxShadow:
    "0 3px 10px rgba(0,0,0,0.04)",

  cursor: "pointer",

  transition: "0.3s",

  minHeight: "90px",

  border: "1px solid #f3f4f6",
};

const quickTitle = {
  margin: 0,

  fontSize: "13px",

  color: "#111827",

  lineHeight: "1.4",

  fontWeight: "700",
};

export default App;