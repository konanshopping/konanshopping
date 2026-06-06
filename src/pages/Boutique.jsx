import { useEffect, useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate
} from "react-router-dom";

import { useLocation } from "react-router-dom";

import {
  FaShoppingBag,
  FaFire,
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaBolt,
  FaCrown,
  FaTags,
  FaTruck,
  FaSearch,
  FaChevronRight,
  FaCreditCard,
  FaWallet,
  FaBoxOpen,
  FaHome,
FaStore,
FaWhatsapp,
} from "react-icons/fa";

import {
  FaGem,
} from "react-icons/fa";

function Boutique() {

  // ================= HERO PROMOTIONS =================

const heroSlides = [

  {
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",

    title:
      "Nouvelle Collection",

    subtitle:
      "Découvrez les tendances premium 2026",

    badge:
      "Mode Premium",

    icon:
      <FaCrown />,
  },

  {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",

    title:
      "Promo Chaussures",

    subtitle:
      "Jusqu'à -40% sur plusieurs modèles",

    badge:
      "Offres Flash",

    icon:
      <FaBolt />,
  },

  {
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",

    title:
      "Livraison Express",

    subtitle:
      "Partout au Cameroun en 24H",

    badge:
      "Livraison Rapide",

    icon:
      <FaTruck />,
  },

  {
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",

    title:
      "Produits Exclusifs",

    subtitle:
      "Accessoires et styles haut de gamme",

    badge:
      "Konan Shopping",

    icon:
      <FaGem />,
  },

];

const [heroIndex, setHeroIndex] =
  useState(0);

useEffect(() => {

  const interval = setInterval(() => {

    setHeroIndex((prev) =>

      prev === heroSlides.length - 1
        ? 0
        : prev + 1

    );

  }, 4500);

  return () =>
    clearInterval(interval);

}, []);


const navigate = useNavigate();

const location = useLocation();

const params = new URLSearchParams(
  location.search
);

const selectedBrand =
  params.get("brand");

  const navStyle = {
    textDecoration: "none",
    color: "black",
    fontWeight: "bold",
  };

  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("Tous");

  const [search, setSearch] =
    useState("");

  const [
    selectedProduct,
    setSelectedProduct
  ] = useState(null);

const [wishlist, setWishlist] =
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

    const savedWishlist =

      localStorage.getItem(
        favoritesKey
      );

    return savedWishlist
      ? JSON.parse(savedWishlist)
      : [];

});

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

  useEffect(() => {

  const updateWishlist =
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

      const updatedWishlist =

        JSON.parse(
          localStorage.getItem(
            favoritesKey
          )
        ) || [];

      setWishlist(
        [...updatedWishlist]
      );

    };

  // LOAD INITIAL

  updateWishlist();

  // LIVE UPDATE

  window.addEventListener(
    "favoritesUpdated",
    updateWishlist
  );

  return () => {

    window.removeEventListener(
      "favoritesUpdated",
      updateWishlist
    );

  };

}, []);

  // TOTAL PANIER
const total = cart.reduce(
  (acc, item) =>
    acc +
    (Number(item.price) || 0) *
    (Number(item.quantity) || 1),
  0
);

// AJOUT PANIER

const playSound = () => {
  const audio = new Audio("/sounds/click.mp3");
  audio.volume = 0.6;

  audio.play();

  navigator.vibrate(100);
};

const addToCart = (product) => {

        playSound();

  const existingProduct = cart.find(
    (item) => item._id === product._id
  );

  if (existingProduct) {

    const updatedCart = cart.map(
      (item) =>

        item._id === product._id

          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }

          : item
    );

    setCart(updatedCart);

  } else {

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1,
        image: product.image,
      },
    ]);

  }

};

// ➕ AUGMENTER QUANTITÉ
const increaseQty = (index) => {

  const updatedCart = [...cart];

  updatedCart[index].quantity += 1;

  setCart(updatedCart);

};

// ➖ DIMINUER QUANTITÉ
const decreaseQty = (index) => {

  const updatedCart = [...cart];

  if (updatedCart[index].quantity > 1) {
    updatedCart[index].quantity -= 1;
  }

  setCart(updatedCart);

};

const toggleWishlist =
  async (product) => {

    const user =

      JSON.parse(
        localStorage.getItem(
          "user"
        )
      );

    // ======================
    // IDENTIFIANT CLIENT
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

    // ======================
    // FAVORITES KEY
    // ======================

    const favoritesKey =
      `favorites_${clientId}`;

    let favorites =

      JSON.parse(
        localStorage.getItem(
          favoritesKey
        )
      ) || [];

    // ======================
    // CHECK EXISTS
    // ======================

    const exists =

      favorites.find(
        (item) =>
          item._id === product._id
      );

    // ======================
    // REMOVE FAVORITE
    // ======================

    if (exists) {

      favorites =

        favorites.filter(
          (item) =>
            item._id !== product._id
        );

      // ======================
      // DELETE SERVER
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

      // ======================
      // SAVE LOCAL
      // ======================

      localStorage.setItem(

        favoritesKey,

        JSON.stringify(
          favorites
        )

      );

      // ======================
      // UPDATE STATE
      // ======================

      setWishlist([...favorites]);

      // ======================
      // FAVORITES COUNT
      // ======================


      // ======================
      // UPDATE UI
      // ======================

      window.dispatchEvent(
        new Event("favoritesUpdated")
      );

      return;

    }

    // ======================
    // ADD FAVORITE
    // ======================

    const alreadyAdded = favorites.some(
  (item) =>
    item._id === product._id
);

if (!alreadyAdded) {

  favorites.push(product);

}

    // ======================
    // SAVE SERVER
    // ======================

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

    // ======================
    // SAVE LOCAL
    // ======================

    localStorage.setItem(

      favoritesKey,

      JSON.stringify(
        favorites
      )

    );

    // ======================
    // UPDATE STATE
    // ======================

    setWishlist([...favorites]);

    // ======================
    // FAVORITES COUNT
    // ======================

    // ======================
    // UPDATE UI
    // ======================

    window.dispatchEvent(
      new Event("favoritesUpdated")
    );

  };

  // SUPPRIMER PANIER

  const removeFromCart = (indexToRemove) => {

    const updatedCart = cart.filter(
      (_, index) =>
        index !== indexToRemove
    );

    setCart(updatedCart);

  };

  // RECUP PRODUITS

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

 // ==============================
// SAVE PANIER CLIENT
// ==============================

useEffect(() => {

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

  localStorage.setItem(

    cartKey,

    JSON.stringify(cart)

  );

  localStorage.setItem(

    "cartCount",

    cart.length

  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

}, [cart]);

// ==============================
// SAVE FAVORIS CLIENT
// ==============================

useEffect(() => {

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

  localStorage.setItem(

    favoritesKey,

    JSON.stringify(wishlist)

  );

}, [wishlist]);

  // PRODUITS SIMILAIRES

  const similarProducts =
    selectedProduct
      ? products.filter(
          (p) =>
            p.category ===
              selectedProduct.category &&
            p._id !==
              selectedProduct._id
        )
      : [];

  // FILTRE

  const filteredProducts =
  products.filter((product) => {

    const matchCategory =
      selectedCategory === "Tous"
        ? true
        : product.category ===
          selectedCategory;

    const matchSearch =
      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchBrand =
      selectedBrand
        ? product.name
            .toLowerCase()
            .includes(
              selectedBrand.toLowerCase()
            )
        : true;

    return (
      matchCategory &&
      matchSearch &&
      matchBrand
    );

});

const [randomProducts, setRandomProducts] =
  useState([]);

useEffect(() => {

  if (filteredProducts.length > 0) {

    setRandomProducts(
      [...filteredProducts].sort(
        () => Math.random() - 0.5
      )
    );

  }

}, [products]);

  return (

    <div
  style={{
    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",

    padding:
      window.innerWidth < 768
        ? "8px"
        : "16px",

    fontFamily:
      "'Poppins', Arial, sans-serif",
  }}
>

  {/* NAVBAR PREMIUM */}

  <div
    style={{
      background:
        "rgba(255,255,255,0.88)",

      backdropFilter: "blur(18px)",

      WebkitBackdropFilter:
        "blur(18px)",

      borderRadius:
        window.innerWidth < 768
          ? "16px"
          : "20px",

      padding:
        window.innerWidth < 768
          ? "6px 8px"
          : "10px 16px",

      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      flexWrap: "wrap",

      gap: "12px",

      marginBottom: "20px",

      boxShadow:
        "0 10px 25px rgba(91,108,255,0.06)",

      border:
        "1px solid rgba(255,255,255,0.7)",

      position: "sticky",

      top: "8px",

      zIndex: 1000,
    }}
  >

    {/* LOGO */}

    <Link
      to="/"

      style={{
        textDecoration: "none",
      }}
    >

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",
        }}
      >

        {/* LOGO IMAGE */}

        <div
          style={{
            width:
              window.innerWidth < 768
                ? "32px"
                : "42px",

            height:
              window.innerWidth < 768
                ? "32px"
                : "42px",

            borderRadius: "14px",

            overflow: "hidden",

            background: "white",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            boxShadow:
              "0 6px 15px rgba(91,108,255,0.10)",

            border:
              "1px solid #eef2ff",
          }}
        >

          <img
            src="/logo.jpg"

            alt="Konan Shopping"

            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

        </div>

        {/* TEXT */}

        <div>

          <h2
            style={{
              margin: 0,

              fontSize:
                window.innerWidth < 768
                  ? "15px"
                  : "20px",

              fontWeight: "700",

              lineHeight: "1",

              background:
                "linear-gradient(135deg,#111827,#5b6cff)",

              WebkitBackgroundClip:
                "text",

              WebkitTextFillColor:
                "transparent",
            }}
          >
            KONAN SHOPPING
          </h2>

          <p
            style={{
              margin: 0,

              marginTop: "3px",

              color: "#6b7280",

              fontSize: "8px",

              fontWeight: "500",

              letterSpacing: "0.4px",
            }}
          >
            habilleur des stars
          </p>

        </div>

      </div>

    </Link>

    <div
  style={{
    display: "flex",
    alignItems: "center",
    flex: 1,
    gap: "10px",
  }}
>
  {/* SEARCH */}

      <div
        style={{
          position: "relative",
        }}
      >

        <FaSearch
          style={{
            position: "absolute",

            top: "11px",

            left: "14px",

            color: "#9ca3af",

            fontSize: "13px",
          }}
        />

        <input
          type="text"

          placeholder="Rechercher..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={{
            padding:
              "8px 14px 8px 34px",

            borderRadius: "30px",

            border:
              "1px solid #e5e7eb",

            width:
              window.innerWidth < 768
                ? "140px"
                : "220px",

            outline: "none",

            fontSize: "13px",

            fontWeight: "500",

            background:
              "linear-gradient(135deg,#fff,#f9fafb)",

            boxShadow:
              "0 3px 10px rgba(0,0,0,0.03)",

            transition: "0.3s",
          }}
        />

      </div>

      </div>

      {/* PANIER */}

      <Link
        to="/checkout"

        style={{
          position: "relative",

          textDecoration: "none",
        }}
      >

        <div
          style={{
            width: "36px",

            height: "36px",

            borderRadius: "14px",

            background:
              "linear-gradient(135deg,#111827,#374151)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            color: "white",

            fontSize: "15px",

            boxShadow:
              "0 8px 18px rgba(0,0,0,0.12)",
          }}
        >
          <FaShoppingCart />
        </div>

        {cart.length > 0 && (

          <div
            style={{
              position: "absolute",

              top: "-4px",

              right: "-4px",

              width: "20px",

              height: "20px",

              borderRadius: "50%",

              background:
                "linear-gradient(135deg,#ef4444,#dc2626)",

              color: "white",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: "10px",

              fontWeight: "700",

              border:
                "2px solid white",
            }}
          >
            {cart.length}
          </div>

        )}

      </Link>

    </div>

<div
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginTop: "15px",
    marginBottom: "40px",
  }}
>

{/* MENU */}

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap:
          window.innerWidth < 768
            ? "8px"
            : "14px",

        flexWrap: "wrap",
      }}
    >

      {/* NAVIGATION */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap:
            window.innerWidth < 768
              ? "20px"
              : "30px",
        }}
      >

        <Link
          to="/"

          style={{
            ...navStyle,

            display: "flex",

            alignItems: "center",

            gap: "6px",

            background:
              "#f8fafc",

            padding: "8px 12px",

            borderRadius: "12px",

            color: "#374151",

            fontWeight: "600",

            fontSize: "13px",
          }}
        >
          <FaHome />

          Accueil
        </Link>

        <Link
          to="/boutique"

          style={{
            ...navStyle,

            display: "flex",

            alignItems: "center",

            gap: "6px",

            background:
              "linear-gradient(135deg,#5b6cff,#7c4dff)",

            padding: "8px 12px",

            borderRadius: "12px",

            color: "white",

            fontWeight: "600",

            fontSize: "13px",

            boxShadow:
              "0 8px 18px rgba(91,108,255,0.18)",
          }}
        >
          <FaStore />

          Boutique
        </Link>

        <a
          href="https://wa.me/237694641329"

          style={{
            ...navStyle,

            display: "flex",

            alignItems: "center",

            gap: "6px",

            background:
              "#f0fdf4",

            padding: "8px 12px",

            borderRadius: "12px",

            color: "#16a34a",

            fontWeight: "600",

            fontSize: "13px",
          }}
        >
          <FaWhatsapp />

          Contact
        </a>

      </div>

      </div>

      </div>

      

{/* HERO */}

<div
  style={{
    height:
      window.innerWidth < 768
        ? "210px"
        : "260px",

    borderRadius: "34px",

    overflow: "hidden",

    position: "relative",

    marginBottom: "35px",

    boxShadow:
      "0 25px 60px rgba(0,0,0,0.18)",

    background: "#111827",
  }}
>

  {/* SLIDES */}

  {heroSlides.map((slide, index) => (

    <div
      key={index}

      style={{
        position: "absolute",

        inset: 0,

        backgroundImage:
          `url(${slide.image})`,

        backgroundSize: "cover",

        backgroundPosition: "center",

        opacity:
          heroIndex === index
            ? 1
            : 0,

        transition:
          "opacity 1.5s ease-in-out",

        transform: "scale(1.04)",
      }}
    >

      {/* OVERLAY */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(to right,rgba(0,0,0,0.72),rgba(0,0,0,0.18))",
        }}
      />

      {/* CONTENT */}

      <div
        style={{
          position: "absolute",

          left:
            window.innerWidth < 768
              ? "22px"
              : "38px",

          bottom:
            window.innerWidth < 768
              ? "22px"
              : "34px",

          color: "white",

          zIndex: 2,
        }}
      >

        {/* BADGE */}

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "8px",

            width: "fit-content",

            padding: "8px 16px",

            borderRadius: "50px",

            background:
              "rgba(255,255,255,0.15)",

            backdropFilter:
              "blur(12px)",

            border:
              "1px solid rgba(255,255,255,0.15)",

            marginBottom: "16px",

            fontSize: "12px",

            fontWeight: "800",

            letterSpacing: "0.4px",
          }}
        >

          {slide.icon}

          {slide.badge}

        </div>

        {/* TITLE */}

        <h1
          style={{
            margin: 0,

            fontSize:
              window.innerWidth < 768
                ? "32px"
                : "52px",

            fontWeight: "900",

            lineHeight: 1.05,

            letterSpacing: "-1px",
          }}
        >
          {slide.title}
        </h1>

        {/* SUBTITLE */}

        <p
          style={{
            marginTop: "14px",

            fontSize:
              window.innerWidth < 768
                ? "14px"
                : "18px",

            color:
              "rgba(255,255,255,0.92)",

            maxWidth: "520px",

            lineHeight: "28px",

            fontWeight: "500",
          }}
        >
          {slide.subtitle}
        </p>

        {/* BUTTONS */}

        <div
          style={{
            display: "flex",

            gap: "14px",

            marginTop: "20px",

            flexWrap: "wrap",
          }}
        >

          <button
            style={{
              padding:
                window.innerWidth < 768
                  ? "12px 18px"
                  : "14px 24px",

              border: "none",

              borderRadius: "18px",

              background:
                "linear-gradient(135deg,#5b6cff,#7c4dff)",

              color: "white",

              fontWeight: "800",

              cursor: "pointer",

              display: "flex",

              alignItems: "center",

              gap: "10px",

              fontSize: "14px",

              boxShadow:
                "0 12px 25px rgba(91,108,255,0.35)",
            }}
          >

            <FaFire />

            Voir les offres

          </button>

          <button
            style={{
              padding:
                window.innerWidth < 768
                  ? "12px 18px"
                  : "14px 24px",

              borderRadius: "18px",

              border:
                "1px solid rgba(255,255,255,0.18)",

              background:
                "rgba(255,255,255,0.10)",

              color: "white",

              backdropFilter:
                "blur(10px)",

              fontWeight: "700",

              cursor: "pointer",

              display: "flex",

              alignItems: "center",

              gap: "10px",

              fontSize: "14px",
            }}
          >

            <FaShoppingBag />

            Explorer

          </button>

        </div>

      </div>

    </div>

  ))}

  {/* INDICATORS */}

  <div
    style={{
      position: "absolute",

      bottom: "20px",

      right: "20px",

      display: "flex",

      gap: "8px",

      zIndex: 10,
    }}
  >

    {heroSlides.map((_, index) => (

      <div
        key={index}

        style={{
          width:
            heroIndex === index
              ? "30px"
              : "10px",

          height: "10px",

          borderRadius: "50px",

          background:

            heroIndex === index

              ? "white"

              : "rgba(255,255,255,0.35)",

          transition: "0.35s",
        }}
      />

    ))}

  </div>

</div>

{cart.length > 0 && (

<>
  
{/* =========================
   PANIER PREMIUM MODERNE
========================= */}

<div
  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-3px)";

    e.currentTarget.style.boxShadow =
      "0 25px 60px rgba(91,108,255,0.12)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)";

    e.currentTarget.style.boxShadow =
      "0 12px 35px rgba(0,0,0,0.06)";

  }}

  style={{
    background:
      "linear-gradient(135deg,#ffffff,#f8fbff)",

    padding:
      window.innerWidth < 768
        ? "18px"
        : "24px",

    borderRadius: "30px",

    marginBottom: "35px",

    boxShadow:
      "0 12px 35px rgba(0,0,0,0.06)",

    border:
      "1px solid #edf2ff",

    position: "relative",

    overflow: "hidden",

    transition: "0.35s",
  }}
>

  {/* BACKGROUND GLOW */}

  <div
    style={{
      position: "absolute",

      top: "-120px",

      right: "-120px",

      width: "260px",

      height: "260px",

      borderRadius: "50%",

      background:
        "rgba(91,108,255,0.08)",

      filter: "blur(60px)",
    }}
  />

  {/* TOP LINE */}

  <div
    style={{
      position: "absolute",

      top: 0,

      left: 0,

      width: "100%",

      height: "5px",

      background:
        "linear-gradient(90deg,#5b6cff,#7c4dff,#9333ea)",
    }}
  />

  {/* HEADER */}

  <div
    style={{
      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      flexWrap: "wrap",

      gap: "15px",

      position: "relative",

      zIndex: 2,
    }}
  >

    {/* LEFT */}

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "14px",
      }}
    >

      {/* ICON */}

      <div
        style={{
          width:
            window.innerWidth < 768
              ? "50px"
              : "56px",

          height:
            window.innerWidth < 768
              ? "50px"
              : "56px",

          borderRadius: "18px",

          background:
            "linear-gradient(135deg,#5b6cff,#7c4dff)",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          boxShadow:
            "0 12px 25px rgba(91,108,255,0.25)",
        }}
      >

        <FaShoppingCart
          style={{
            color: "white",

            fontSize:
              window.innerWidth < 768
                ? "20px"
                : "24px",
          }}
        />

      </div>

      {/* TEXT */}

      <div>

        <h2
          style={{
            margin: 0,

            fontSize:
              window.innerWidth < 768
                ? "23px"
                : "28px",

            fontWeight: "900",

            color: "#111827",

            letterSpacing: "-0.5px",
          }}
        >
          Mon Panier
        </h2>

        <p
          style={{
            margin: 0,

            marginTop: "4px",

            color: "#6b7280",

            fontSize: "13px",

            fontWeight: "500",
          }}
        >
          🛍️ Vos produits sélectionnés avec livraison premium
        </p>

      </div>

    </div>

    {/* BADGES */}

    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "10px",

        flexWrap: "wrap",
      }}
    >

    

      <div
        style={{
          background:
            "linear-gradient(135deg,#eef2ff,#f5f3ff)",

          color: "#5b6cff",

          padding: "12px 16px",

          borderRadius: "16px",

          fontWeight: "800",

          fontSize: "13px",

          display: "flex",

          alignItems: "center",

          gap: "8px",

          border:
            "1px solid #dbeafe",

          boxShadow:
            "0 4px 12px rgba(91,108,255,0.10)",
        }}
      >

        <FaBoxOpen />

        {cart.length} article(s)

      </div>

      {/* TOTAL */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#111827,#374151)",

          color: "white",

          padding: "12px 16px",

          borderRadius: "16px",

          fontWeight: "800",

          fontSize: "13px",

          display: "flex",

          alignItems: "center",

          gap: "8px",

          boxShadow:
            "0 10px 20px rgba(0,0,0,0.15)",
        }}
      >

        <FaWallet />

        {total} FCFA

      </div>

    </div>

  </div>

  {/* LIVRAISON */}

  <div
    style={{
      marginTop: "22px",

      background:
        "linear-gradient(135deg,#f8faff,#eef2ff)",

      padding: "18px",

      borderRadius: "22px",

      border:
        "1px solid #dbeafe",
    }}
  >

    <div
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        alignItems: "center",

        marginBottom: "12px",

        flexWrap: "wrap",

        gap: "10px",
      }}
    >

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",
        }}
      >

        <FaTruck
          style={{
            color: "#5b6cff",

            fontSize: "18px",
          }}
        />

        <span
          style={{
            fontWeight: "700",

            color: "#374151",

            fontSize: "13px",
          }}
        >
          Livraison offerte dès 50 000 FCFA
        </span>

      </div>

      <span
        style={{
          fontWeight: "800",

          color: "#5b6cff",

          fontSize: "13px",
        }}
      >
        {Math.min(
          Math.floor((total / 50000) * 100),
          100
        )}%
      </span>

    </div>

    {/* BAR */}

    <div
      style={{
        width: "100%",

        height: "10px",

        background: "#dbeafe",

        borderRadius: "999px",

        overflow: "hidden",
      }}
    >

      <div
        style={{
          width: `${Math.min(
            (total / 50000) * 100,
            100
          )}%`,

          height: "100%",

          borderRadius: "999px",

          background:
            "linear-gradient(90deg,#5b6cff,#7c4dff,#9333ea)",

          transition: "0.4s",

          boxShadow:
            "0 0 25px rgba(91,108,255,0.35)",
        }}
      />

    </div>

    <p
      style={{
        margin: 0,

        marginTop: "12px",

        fontSize: "13px",

        color: "#6b7280",

        fontWeight: "600",
      }}
    >

      {total >= 50000

        ? "🎉 Livraison offerte débloquée"

        : `🛒 Ajoutez encore ${
            50000 - total
          } FCFA pour débloquer la livraison offerte`}

    </p>

  </div>

 

{cart.map((item, index) => (

  <div
    key={index}

    onMouseEnter={(e) => {

      e.currentTarget.style.transform =
        "translateY(-3px)";

      e.currentTarget.style.boxShadow =
        "0 15px 30px rgba(0,0,0,0.07)";

    }}

    onMouseLeave={(e) => {

      e.currentTarget.style.transform =
        "translateY(0px)";

      e.currentTarget.style.boxShadow =
        "none";

    }}

    style={{
      marginTop: "20px",

      background: "white",

      borderRadius: "24px",

      padding:
        window.innerWidth < 768
          ? "14px"
          : "18px",

      display: "flex",

      alignItems: "center",

      gap:
        window.innerWidth < 768
          ? "12px"
          : "18px",

      border:
        "1px solid #eef2ff",

      transition: "0.3s",
    }}
  >

  {/* IMAGE */}

  <div
    style={{
      width: "100%",

      height:
        window.innerWidth < 768
          ? "220px"
          : "260px",

      overflow: "hidden",

      borderRadius: "18px",

      background: "#f3f4f6",
    }}
  >

    <img
      src={item.image}
      alt=""

      style={{
        width: "100%",

        height: "100%",

        objectFit: "contain",

        display: "block",
      }}
    />

  </div>

    {/* CONTENT */}

    <div
      style={{
        flex: 1,
      }}
    >

      <h4
        style={{
          margin: 0,

          fontSize:
            window.innerWidth < 768
              ? "15px"
              : "17px",

          fontWeight: "800",

          color: "#111827",
        }}
      >
        {item.name}
      </h4>

      <p
        style={{
          marginTop: "6px",

          marginBottom: "12px",

          color: "#6b7280",

          fontSize: "13px",
        }}
      >
        💎 {Number(item.price)} FCFA × {item.quantity}
      </p>

      {/* QUANTITY */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",
        }}
      >

        <button
          onClick={() =>
            decreaseQty(index)
          }

          style={{
            width: "34px",

            height: "34px",

            borderRadius: "12px",

            border: "none",

            background:
              "linear-gradient(135deg,#111827,#374151)",

            color: "white",

            cursor: "pointer",

            fontWeight: "900",
          }}
        >
          −
        </button>

        <span
          style={{
            fontWeight: "800",

            minWidth: "20px",

            textAlign: "center",

            color: "#111827",
          }}
        >
          {item.quantity}
        </span>

        <button
          onClick={() =>
            increaseQty(index)
          }

          style={{
            width: "34px",

            height: "34px",

            borderRadius: "12px",

            border: "none",

            background:
              "linear-gradient(135deg,#5b6cff,#7c4dff)",

            color: "white",

            cursor: "pointer",

            fontWeight: "900",
          }}
        >
          +
        </button>

      </div>

    </div>

    {/* RIGHT */}

    <div
      style={{
        display: "flex",

        flexDirection: "column",

        alignItems: "flex-end",

        gap: "12px",
      }}
    >

      <button
        onClick={() =>
          removeFromCart(index)
        }

        style={{
          width: "36px",

          height: "36px",

          borderRadius: "12px",

          border: "none",

          background:
            "linear-gradient(135deg,#ef4444,#dc2626)",

          color: "white",

          cursor: "pointer",

          fontWeight: "900",

          boxShadow:
            "0 10px 20px rgba(239,68,68,0.18)",
        }}
      >
        ✕
      </button>

      <strong
        style={{
          fontSize:
            window.innerWidth < 768
              ? "15px"
              : "18px",

          color: "#111827",
        }}
      >
        {item.price * item.quantity} FCFA
      </strong>

    </div>

  </div>

))}

  {/* FOOTER */}

  <div
    style={{
      marginTop: "28px",

      paddingTop: "24px",

      borderTop:
        "1px solid #eef2ff",

      display: "flex",

      justifyContent:
        "space-between",

      alignItems: "center",

      flexWrap: "wrap",

      gap: "18px",
    }}
  >

    {/* TOTAL */}

    <div>

      <p
        style={{
          margin: 0,

          color: "#6b7280",

          fontSize: "13px",

          fontWeight: "600",
        }}
      >
        💳 Total de votre commande
      </p>

      <h1
        style={{
          margin: 0,

          marginTop: "5px",

          fontSize:
            window.innerWidth < 768
              ? "28px"
              : "36px",

          color: "#111827",

          fontWeight: "900",
        }}
      >
        {total} FCFA
      </h1>

    </div>

    {/* BTN */}

    <Link
  to="/checkout"

  onClick={() => {

    playSound();

    localStorage.setItem(

      `checkoutCart_${clientId}`,

      JSON.stringify(cart)

    );

  }}


      style={{
        width:
          window.innerWidth < 768
            ? "100%"
            : "320px",

        textDecoration: "none",
      }}
    >

      <button
        onMouseEnter={(e) => {

          e.currentTarget.style.transform =
            "translateY(-3px) scale(1.02)";

          e.currentTarget.style.boxShadow =
            "0 20px 35px rgba(91,108,255,0.30)";

        }}

        onMouseLeave={(e) => {

          e.currentTarget.style.transform =
            "translateY(0px) scale(1)";

          e.currentTarget.style.boxShadow =
            "0 12px 25px rgba(91,108,255,0.18)";

        }}

        style={{
          width: "100%",

          padding: "18px",

          border: "none",

          borderRadius: "20px",

          background:
            "linear-gradient(135deg,#5b6cff,#7c4dff,#9333ea)",

          color: "white",

          cursor: "pointer",

          fontWeight: "900",

          fontSize: "15px",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          gap: "12px",

          transition: "0.35s",

          boxShadow:
            "0 12px 25px rgba(91,108,255,0.18)",
        }}
      >

        <FaCreditCard />

        Commander maintenant

      </button>

    </Link>

  </div>

</div>

</>
)}
      {/* SHOP */}

      <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    width: "100%",
  }}
>

{/* SIDEBAR CATÉGORIES AUTO */}

<div
  style={{
    marginBottom: "35px",

    overflow: "hidden",

    position: "relative",
  }}
>

  {/* TITRE */}

  <h3
    style={{
      marginBottom: "20px",

      display: "flex",

      alignItems: "center",

      gap: "10px",

      fontSize:
        window.innerWidth < 768
          ? "20px"
          : "23px",

      fontWeight: "900",

      color: "#111827",
    }}
  >
    <FaTags
      style={{
        color: "#5b6cff",
      }}
    />

    Catégories

  </h3>

  {/* SLIDER */}

  <div
    style={{
      overflow: "hidden",

      width: "100%",
    }}
  >

    <div
      style={{
        display: "flex",

        gap: "10px",

        width: "max-content",

        animation:
          "scrollCategories 20s linear infinite",
      }}
    >

      {[
        "Tous",
        "Chaussures",
        "T-shirts",
        "Jeans",
        "Vestes",
        "Sacs",
        "Accessoires",

        // duplication pour boucle fluide
        "Tous",
        "Chaussures",
        "T-shirts",
        "Jeans",
        "Vestes",
        "Sacs",
        "Accessoires",
      ].map((cat, index) => (

        <div
          key={index}

          onClick={() =>
            setSelectedCategory(cat)
          }

          style={{
            flexShrink: 0,

            padding:
  window.innerWidth < 768
    ? "10px 16px"
    : "11px 18px",

            borderRadius: "14px",

            cursor: "pointer",

            display: "flex",

            alignItems: "center",

            gap: "10px",

            background:

              selectedCategory === cat

                ? "linear-gradient(135deg,#5b6cff,#7c4dff)"

                : "white",

            color:

              selectedCategory === cat

                ? "white"

                : "#111827",

            fontWeight: "700",

            transition: "0.3s",

            border:

              selectedCategory === cat

                ? "none"

                : "1px solid #e5e7eb",

            boxShadow:

              selectedCategory === cat

                ? "0 10px 25px rgba(91,108,255,0.25)"

                : "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >

          <span>{cat}</span>

          <FaChevronRight />

        </div>

      ))}

    </div>

  </div>

</div>

        {/* PRODUITS */}

        <div
          style={{
            flex: 1,
            display: "grid",
        gridTemplateColumns:
  window.innerWidth < 768
    ? "repeat(2, 1fr)"
    : "repeat(4, 1fr)",
            gap: window.innerWidth < 768 ? "15px" : "25px",
          }}
        >

       {randomProducts.map((product) => (

  <Link
    key={product._id}

    to={`/product/${product._id}`}

    style={{
      textDecoration: "none",
      color: "inherit",
    }}
  >

    <div

      onClick={() => {
        playSound();
      }}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-10px)";
      }}

      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";
      }}

     style={{
  background: "white",

  borderRadius: "18px",

  padding:
  window.innerWidth < 768
    ? "10px"
    : "16px",

  transition: "0.35s",

  cursor: "pointer",

  position: "relative",

  overflow: "hidden",

  width: "100%",
boxSizing: "border-box",

  border:
    "1px solid #eef2ff",

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.05)",

  display: "flex",

  flexDirection: "column",

minHeight:
  window.innerWidth < 768
    ? "330px"
    : "390px",
}}
    >

      <div
        onClick={(e) => {

          e.preventDefault();

          e.stopPropagation();

          toggleWishlist(product);

        }}

        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >

     {
(
  JSON.parse(
    localStorage.getItem(
      `favorites_${
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        )?._id ||

        localStorage.getItem(
          "guestId"
        )
      }`
    )
  ) || []
).some(
  (item) =>
    item._id === product._id
)
  ? <FaHeart color="blue" />
: <FaHeart color="#d1d5db" />
}

      </div>

  <div
  style={{
    background: "#f8f8fb",
    padding: "12px",
    borderRadius: "20px",
  }}
>
  <img
    src={product.image}
    alt=""
    style={{
      width: "100%",

      height:
        window.innerWidth < 768
          ? "140px"
          : "190px",

      objectFit: "cover",

      borderRadius: "15px",
    }}
  />
</div>

              <div
                style={{
                  marginTop: "20px",
                }}
              >

                <h3
                style={{
  marginTop: "16px",

  marginBottom: "5px",

  fontSize: "17px",

  fontWeight: "700",

  color: "#111827",
}}
                >
                {product.name}
                </h3>

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "5px",

    marginTop: "8px",

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
    fontSize: "11px",

    color:
      index <
      Math.round(
        averageRating
      )

        ? "#f59e0b"

        : "#d1d5db",

    filter:
      index <
      Math.round(
        averageRating
      )

        ? "drop-shadow(0 1px 3px rgba(245,158,11,0.25))"

        : "none",
  }}
/>

);

}
)}

</div>

<span
  style={{
    color: "#111827",

    fontSize: "12px",

    fontWeight: "800",

    marginLeft: "4px",
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

    fontWeight: "600",
  }}
>

(

{product.reviews?.length || 0}

avis )

</span>

</div>
 

                <h2
                style={{
  marginTop: "10px",

  marginBottom: "15px",

  fontSize: "24px",

  fontWeight: "900",

  color: "#111827",
}}
                >
                {product.price} FCFA
                </h2>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "&(px",
                  }}
                >

      <button
  onClick={(e) => {

  e.preventDefault();

  e.stopPropagation();

  playSound();

  addToCart(product);

}}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-3px) scale(1.03)";

    e.currentTarget.style.boxShadow =
      "0 10px 20px rgba(91,108,255,0.25)";

    e.currentTarget.style.background =
      "#f8faff";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px) scale(1)";

    e.currentTarget.style.boxShadow =
      "none";

    e.currentTarget.style.background =
      "white";

  }}

  style={{
    flex: 1,

    padding: window.innerWidth < 768 ? "10px" : "12px",

fontSize:
  window.innerWidth < 768
    ? "12px"
    : "13px",

    borderRadius: "16px",

    border: "1px solid #e5e7eb",

    background: "white",

    color: "#111827",

    cursor: "pointer",

    fontWeight: "700",


    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    transition: "0.3s",
  }}
>

  <FaShoppingCart />

  Ajouter

</button>

<button

  onClick={(e) => {

e.preventDefault();

    e.stopPropagation();

    playSound();

    const user = JSON.parse(
  localStorage.getItem("user")
);

const clientId =

  user?._id ||

  localStorage.getItem(
    "guestId"
  );

localStorage.setItem(

  `checkoutProduct_${clientId}`,

  JSON.stringify(product)

);

    navigate(
  "/checkout",
  {
    state: {
      directBuy: true,
    },
  }
);

  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-3px) scale(1.03)";

    e.currentTarget.style.boxShadow =
      "0 12px 25px rgba(0,0,0,0.25)";

    e.currentTarget.style.background =
      "linear-gradient(135deg,#1f2937,#111827)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px) scale(1)";

    e.currentTarget.style.boxShadow =
      "0 6px 15px rgba(0,0,0,0.15)";

    e.currentTarget.style.background =
      "linear-gradient(135deg,#111827,#374151)";

  }}

  style={{
    width: "100%",

    padding: window.innerWidth < 768 ? "10px" : "12px",

fontSize:
  window.innerWidth < 768
    ? "12px"
    : "13px",

    flex: 1,

    borderRadius: "16px",

    border: "none",

    background:
      "linear-gradient(135deg,#111827,#374151)",

    color: "white",

    cursor: "pointer",

    fontWeight: "800",


    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    transition: "0.3s",

    boxShadow:
      "0 6px 15px rgba(0,0,0,0.15)",
  }}
>

  <FaBolt />

  Acheter

</button>
                </div>

              </div>

            </div>

  </Link>

))}

        </div>

      </div>

      {/* POPUP */}

      {selectedProduct && (

        <div
          onClick={() =>
            setSelectedProduct(null)
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "1000px",
              background: "white",
              borderRadius: "30px",
              padding: "40px",
            }}
          >

            <div
              style={{
                display: "flex",
                gap: "40px",
              }}
            >

              <img
                src={selectedProduct.image}
                alt=""
                style={{
                  width: "400px",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />

               {selectedProduct.video && (

                <video
                    controls
                    autoPlay
                    muted
                    loop
                    style={{
                    width: "100%",
                    marginTop: "20px",
                    borderRadius: "20px",
                    }}
                >

                    <source
                    src={selectedProduct.video}
                    type="video/mp4"
                    />

                </video>

                )}

              <div
                style={{
                  flex: 1,
                }}
              >

                <h1>
                  {selectedProduct.name}
                </h1>

                <h2
                  style={{
                    marginTop: "20px",
                    fontSize: "40px",
                  }}
                >
                  {selectedProduct.price} FCFA
                </h2>

                <p
                  style={{
                    marginTop: "20px",
                    color: "#666",
                    lineHeight: "30px",
                  }}
                >
                  Produit premium de haute qualité disponible chez KONAN SHOPPING CAMEROUN.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "30px",
                  }}
                >

                  <button
                   onClick={() => {
                    playSound();
                    addToCart(selectedProduct);
                    }}
                    style={{
                      flex: 1,
                      padding: "18px",
                      borderRadius: "40px",
                      border:
                        "1px solid #ddd",
                      background: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Ajouter au panier
                  </button>

                  <Link
                    to="/checkout"
                    state={{
                        cart: [selectedProduct],
                    }}
                    onClick={() => playSound()}
                    style={{
                      flex: 1,
                    }}
                  >

                    <button
                      style={{
                        width: "100%",
                        padding: "18px",
                        borderRadius: "40px",
                        border: "none",
                        background: "black",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Acheter
                    </button>

                  </Link>

                </div>

              </div>

            </div>

            {/* SIMILAIRES */}

            <div
              style={{
                marginTop: "50px",
              }}
            >

              <h2
                style={{
                  marginBottom: "20px",
                }}
              >
                Produits similaires
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3,1fr)",
                  gap: "20px",
                }}
              >

                {similarProducts
                  .slice(0, 3)
                  .map((item) => (

                    <div
                      key={item._id}

                      onClick={() =>
                        setSelectedProduct(item)
                      }

                      style={{
                        background: "#f7f7f7",
                        padding: "15px",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                    >

                      <img
                        src={item.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "15px",
                        }}
                      />

                      <h4
                        style={{
                          marginTop: "10px",
                          marginBottom: "5px",
                        }}
                      >
                        {item.name}
                      </h4>

                      <strong>
                        {item.price} FCFA
                      </strong>

                    </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default Boutique;