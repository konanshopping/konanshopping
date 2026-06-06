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

import ProductDetails from "./pages/ProductDetails";

import MyOrders
from "./pages/Myorders";

import Coupons from "./pages/Coupons";

import {

  FaBoxOpen,

  FaWhatsapp,

  FaStar,

  FaFire,

  FaCrown,

  FaMicrophone,

  FaCamera,

  FaCheck

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

"🎁 Offres spéciales Konan Shopping",

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
  new SpeechRecognition();

recognition.lang = "fr-FR";

const startVoice = () => {

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

  window.addEventListener(
    "scroll",
    handleScroll
  );

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

alert(
"Ajoutez une image ou écrivez un produit"
);

}

setLoading(false);

}

catch(err){

console.log(err);

setLoading(false);

}

};

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

      flexWrap: "wrap",
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
          width: "42px",

          height: "42px",

          objectFit: "cover",

          borderRadius: "10px",
        }}
      />

      <div>

        <h1
          style={{
            margin: 0,
            fontSize: "14px",
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
            fontSize: "14px",
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
        minWidth: "220px",
      }}
    >

      <div
style={{
width:"100%",
maxWidth:"430px",
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
            padding: "10px 14px",
            fontSize: "13px",
            background: "transparent",
          }}
        />

        <button
          style={{
            width: "45px",
            height: "42px",
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
        gap: "14px",
        alignItems: "center",
      }}
    >

      <div
        style={{
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <Link

          to="/favorites"

          style={{
            textDecoration: "none",
            color: "#111827",
          }}

        >

          <div>

            <div
  style={{
    fontSize: "18px",
    position: "relative",
  }}
>

  <FaHeart />

  {favoritesCount > 0 && (

    <span

      style={{

        position: "absolute",

        top: "-8px",

        right: "-10px",

        background: "#ef4444",

        color: "white",

        minWidth: "18px",

        height: "18px",

        borderRadius: "50%",

        fontSize: "10px",

        fontWeight: "800",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        padding: "0 4px",

        boxShadow:
          "0 4px 10px rgba(239,68,68,0.35)",

      }}

    >

    {favoritesCount}

    </span>

  )}

</div>

            <p
              style={{
                margin: 0,
                fontSize: "10px",
              }}
            >
              Favoris
            </p>

          </div>

        </Link>

      </div>

      <Link
        to="/checkout"
        state={{ cart }}

        style={{
          textDecoration: "none",
          color: "black",
        }}
      >

        <div
          style={{
            textAlign: "center",
            position: "relative",
          }}
        >

          <div
            style={{
              fontSize: "18px",
            }}
          >
            <FaShoppingCart />
          </div>

          <div
            style={{
              position: "absolute",
              top: "-4px",
              right: "-2px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#5b3cc4",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "9px",
              fontWeight: "bold",
            }}
          >
            {cart.reduce(
              (total, item) =>
                total +
                (item.quantity || 1),
              0
            )}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "10px",
            }}
          >
            Panier
          </p>

        </div>

      </Link>

      <div
        style={{
          textAlign: "center",
          cursor: "pointer",
        }}
      >

        <Link
          to="/account"
          style={{
            textDecoration: "none",
            color: "#111827",
          }}
        >

          <div
            style={{
              fontSize: "18px",
            }}
          >
            <FaUserCircle />
          </div>

          <div
            style={{
              fontSize: "10px",
            }}
          >
            Compte
          </div>

        </Link>

      </div>

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
    background: "white",

    borderRadius: "18px",

    padding: "10px 14px",

    display: "flex",

    alignItems: "center",

    gap: "10px",

    marginTop: "18px",

    marginBottom: "18px",

    border: "1px solid #ececec",

    boxShadow:
      "0 3px 10px rgba(0,0,0,0.04)",
  }}
>

  <button

    onClick={() =>

      document
        .getElementById(
          "imageUpload"
        )
        .click()

    }

    style={{
      border: "none",
      background: "transparent",
      fontSize: "18px",
      cursor: "pointer",
    }}
  >
    <FaCamera />
  </button>

  <input
    type="text"

   placeholder={placeholders[placeholderIndex]}

    value={search}

    onChange={(e) =>
      setSearch(e.target.value)
    }

    style={{
      flex: 1,

      border: "none",

      outline: "none",

      fontSize: "13px",

      padding: "6px 0",

      background: "transparent",
    }}
  />

  <button

    onClick={startVoice}

    style={{
      border: "none",
      background: "transparent",
      fontSize: "18px",
      cursor: "pointer",
    }}
  >
    <FaMicrophone />
  </button>

  {image && (

  <div
    style={{
      position: "relative",

      width: "90px",

      marginTop: "15px",
    }}
  >

    {/* IMAGE */}

    <img

      src={URL.createObjectURL(image)}

      alt=""

      style={{

        width: "90px",

        height: "90px",

        borderRadius: "18px",

        objectFit: "cover",

        boxShadow:
          "0 8px 20px rgba(0,0,0,0.12)",
      }}

    />

    {/* DELETE BUTTON */}

    <button

      onClick={() => {

        setImage(null);

      }}

      style={{

        position: "absolute",

        top: "-8px",

        right: "-8px",

        width: "28px",

        height: "28px",

        borderRadius: "50%",

        border: "none",

        background:
          "#ef4444",

        color: "white",

        cursor: "pointer",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        fontSize: "14px",

        fontWeight: "bold",

        boxShadow:
          "0 4px 10px rgba(239,68,68,0.35)",
      }}

    >

      ✕

    </button>

  </div>

)}

  <button

onClick={searchProducts}
    style={{
      border: "none",

      background: "#4B2E83",

      color: "white",

      padding: "10px 16px",

      borderRadius: "12px",

      fontWeight: "700",

      fontSize: "12px",

      cursor: "pointer",
    }}
  >
    {loading
? "Recherche..."
: "Rechercher"}
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
      marginBottom: "18px",
    }}
  >

    <h2
      style={{
        margin: 0,
        fontSize: "19px",
        color: "#111827",
        fontWeight: "800",
      }}
    >
      Catégories
    </h2>

    <button
      style={{
        border: "none",
        background: "transparent",
        color: "#4B2E83",
        fontWeight: "700",
        cursor: "pointer",
      }}
    >
      Voir tout
    </button>

  </div>

  <div
    style={{
      display: "flex",
      gap: "10px",
      overflowX: "auto",
      paddingBottom: "8px",
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
            selectedCategory ===
            category
              ? "#4B2E83"
              : "white",

          color:
            selectedCategory ===
            category
              ? "white"
              : "#111827",

          padding: "10px 16px",

          borderRadius: "12px",

          fontWeight: "700",

          cursor: "pointer",

          fontSize: "13px",

          whiteSpace: "nowrap",

          boxShadow:
            "0 4px 15px rgba(0,0,0,0.05)",
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
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: "22px",
    }}
  >

    <h2
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "800",
    color: "#1f2937",
  }}
>
  Meilleures offres

  <FaFireAlt
    style={{
      color: "#ff6b00",
      fontSize: "24px",
      filter:
        "drop-shadow(0 4px 10px rgba(255,107,0,0.35))",
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
          padding: "12px 18px",
          borderRadius: "16px",
          fontWeight: "700",
          cursor: "pointer",
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
          : "repeat(auto-fit,minmax(260px,1fr))",

      gap: "18px",
    }}
  >

{aiProducts.length > 0 && (

<div
style={{
marginBottom:"25px",
}}
>

<h2
style={{
fontSize:"22px",

fontWeight:"800",

color:"#111827",

marginBottom:"20px",
}}
>

Résultats IA 🔥

</h2>

</div>

)}

{aiProducts.length === 0
&& image && (

<div
style={{

background:"white",

padding:"30px",

borderRadius:"24px",

textAlign:"center",

marginBottom:"25px",

boxShadow:
"0 4px 15px rgba(0,0,0,0.05)",

border:
"1px solid #f3f4f6",

}}

>

{/* ICON */}

<div
style={{

width:"90px",

height:"90px",

margin:"0 auto 20px auto",

borderRadius:"50%",

background:
"linear-gradient(135deg,#EEF2FF,#E0E7FF)",

display:"flex",

justifyContent:"center",

alignItems:"center",

boxShadow:
"0 4px 15px rgba(79,70,229,0.12)",

}}

>

<i
className="fa-solid fa-robot"

style={{

fontSize:"40px",

color:"#4f46e5",

}}

></i>

</div>

{/* TITLE */}

<h2
style={{

color:"#111827",

fontSize:"24px",

fontWeight:"800",

marginBottom:"10px",

}}
>

Aucun produit similaire trouvé

</h2>

{/* TEXT */}

<p
style={{

color:"#6b7280",

marginTop:"10px",

lineHeight:"28px",

fontSize:"15px",

maxWidth:"420px",

marginLeft:"auto",

marginRight:"auto",

}}
>

Essayez une autre image
ou utilisez une photo plus
claire pour améliorer
la recherche IA.

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
          selectedCategory ===
          "Tous"

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
            textDecoration: "none",
            color: "black",
          }}
        >

          <div
  style={{
    background: "white",
    borderRadius: "18px", // réduit légèrement
    overflow: "hidden",
    boxShadow:
      "0 6px 20px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "0.3s",
    position: "relative",
  }}
>

  {/* IMAGE */}

  <div
    style={{
      background: "#f8f8fb",
      padding: "12px", // réduit
    }}
  >

    <img
      src={product.image}
      alt=""

      style={{
        width: "100%",

        height:
          window.innerWidth < 768
            ? "140px" // réduit
            : "190px", // réduit

        objectFit: "cover",
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

    width: "40px",

    height: "40px",

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

      : "white",

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

      : "#2563eb",

    fontSize: "18px",

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

: "#2563eb",

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

display:"flex",

alignItems:"center",

justifyContent:"center",

gap:"6px",

transition:"all .3s ease",

transform:

addedProduct === product._id

? "scale(1.03)"

: "scale(1)"
}}
>

{
addedProduct === product._id

? (
<>
<FaCheck />
Ajouté
</>
)

: (
<>
<FaShoppingCart />
Ajouter
</>
)
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

      ))}

  </div>

</div>

{/* BOTTOM NAVIGATION */}

<div
  style={{
  position: "fixed",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "90%",
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.4)",
  borderRadius: "22px",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "6px 0",
  zIndex: 999,
  boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
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
    icon: <FaComments />,
    name: "Messages",
    link: "https://wa.me/237694641329",
  },

  {
    icon: <FaShoppingCart />,
    name: "Panier",
    link: "/checkout",
  },

  {
    icon: <FaUser />,
    name: "Compte",
    link: "/account",
  },
  ].map((item, index) => (

    item.name === "Messages" ? (

      <a
        key={index}

        href={item.link}

        target="_blank"

        style={{
          textDecoration: "none",
        }}
      >

        <div

  className="bottomNavItem"
          style={{
            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            gap: "2px",

            cursor: "pointer",

            padding: "4px 10px",
borderRadius: "14px",
transition: "0.3s",
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
              fontSize: "10px",

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
          style={{
            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            gap: "4px",

            cursor: "pointer",

padding: "4px 10px",
borderRadius: "14px",
transition: "0.3s",

          }}
        >

          <div
          className="bottomNavIcon"
            style={{
              fontSize: "24px",
            }}
          >
            {item.icon}
          </div>

          <span
            style={{
              fontSize: "12px",

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
 );

}


function App() {

  useEffect(() => {

    // =========================
    // SCRIPT BOTPRESS
    // =========================

    const script1 =
      document.createElement("script");

    script1.src =
      "https://cdn.botpress.cloud/webchat/v3.6/inject.js";

    script1.async = true;

    document.body.appendChild(
      script1
    );

    // =========================
    // LOAD CONFIG APRÈS
    // =========================

    script1.onload = () => {

      const script2 =
        document.createElement("script");

      script2.src =
        "https://files.bpcontent.cloud/2025/01/25/16/20250125162805-WU2DYMW9.js";

      script2.defer = true;

      document.body.appendChild(
        script2
      );

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

      </Routes>

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