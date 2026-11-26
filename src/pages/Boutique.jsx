import { useState, useEffect, useMemo } from "react";

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

FaFireAlt

} from "react-icons/fa";



import {

  FaGem,

} from "react-icons/fa";



import SeoBreadcrumb from "../components/SeoBreadcrumb";



function Boutique() {

// ======================================================
// 🔐 SÉCURITÉ FRONTEND — compatible avec le backend
// ======================================================

const API_BASE_URL = (
  import.meta.env?.VITE_API_URL || "https://konanshopping.com"
).replace(/\/$/, "");

const API_TIMEOUT = 15000;

const isValidObjectId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const safeParse = (value, fallback = null) => {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const readStoredUser = () => {
  try {
    const user = safeParse(localStorage.getItem("user"), null);
    return user && typeof user === "object" && isValidObjectId(String(user._id || "")) ? user : null;
  } catch {
    return null;
  }
};

const getStableGuestId = () => {
  try {
    let id = localStorage.getItem("guestId");
    if (!id || typeof id !== "string" || id.length > 120) {
      id = `guest_${window.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
      localStorage.setItem("guestId", id);
    }
    return id;
  } catch {
    return `guest_session_${Date.now()}`;
  }
};

const getClientStorageId = () => readStoredUser()?._id || getStableGuestId();

const readSafeArray = (key) => {
  try {
    const value = safeParse(localStorage.getItem(key), []);
    return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
  } catch {
    return [];
  }
};

const writeSafeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Stockage local indisponible (${key})`, error);
    return false;
  }
};

const normalizeCart = (items) => {
  const byId = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    if (!item || typeof item._id !== "string" || !item._id) continue;
    const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
    const previous = byId.get(item._id);
    byId.set(item._id, { ...(previous || {}), ...item, quantity: Math.min(99, quantity + (previous?.quantity || 0)) });
  }
  return [...byId.values()];
};

const normalizeFavorites = (items) => {
  const byId = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    if (item && typeof item._id === "string" && item._id) byId.set(item._id, item);
  }
  return [...byId.values()];
};

// Authentification par cookie HttpOnly
axios.defaults.withCredentials = true;

const getAuthConfig = () => ({
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.headers = config.headers || {};
  config.headers.Accept = "application/json";
  return config;
});




  // ================= HERO PROMOTIONS =================



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
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(
    () => typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", updateViewportWidth, { passive: true });
    window.addEventListener("orientationchange", updateViewportWidth, { passive: true });
    return () => {
      window.removeEventListener("resize", updateViewportWidth);
      window.removeEventListener("orientationchange", updateViewportWidth);
    };
  }, []);



  const [selectedCategory, setSelectedCategory] =

    useState("Tous");



  const [search, setSearch] =

    useState("");



  const [

    selectedProduct,

    setSelectedProduct

  ] = useState(null);



  const heroSlides = useMemo(() => {



  return [...products]

    .sort(() => Math.random() - 0.5)

    .slice(0, 5)

    .map((product) => ({



      _id: product._id,



      image: product.image || "/logo.jpg",



      title: product.name,



      subtitle:

        product.description ||

        `${Number(product.price).toLocaleString()} FCFA`,



      badge: product.category,



      price: product.price,



      category: product.category,



      brand: product.brand,



      icon: <FaFireAlt />,



    }));



}, [products]);



const [heroIndex, setHeroIndex] =

  useState(0);



useEffect(() => {



  if (heroSlides.length === 0) return;



  const interval = setInterval(() => {



    setHeroIndex((prev) =>

      prev >= heroSlides.length - 1

        ? 0

        : prev + 1

    );



  }, 4500);



  return () => clearInterval(interval);



}, [heroSlides]);



useEffect(() => {



  setHeroIndex(0);



}, [heroSlides]);



const [wishlist, setWishlist] = useState(() => readSafeArray(`favorites_${getClientStorageId()}`));
const [cart, setCart] = useState(() => normalizeCart(readSafeArray(`cart_${getClientStorageId()}`)));

  // Synchronisation avec l'accueil, la page favoris et les autres onglets.
  useEffect(() => {
    const refreshSharedData = () => {
      const clientId = getClientStorageId();
      const nextWishlist = normalizeFavorites(readSafeArray(`favorites_${clientId}`));
      const nextCart = normalizeCart(readSafeArray(`cart_${clientId}`));
      setWishlist((previous) =>
        JSON.stringify(previous) === JSON.stringify(nextWishlist) ? previous : nextWishlist
      );
      setCart((previous) =>
        JSON.stringify(previous) === JSON.stringify(nextCart) ? previous : nextCart
      );
    };
    refreshSharedData();
    window.addEventListener("favoritesUpdated", refreshSharedData);
    window.addEventListener("cartUpdated", refreshSharedData);
    window.addEventListener("storage", refreshSharedData);
    return () => {
      window.removeEventListener("favoritesUpdated", refreshSharedData);
      window.removeEventListener("cartUpdated", refreshSharedData);
      window.removeEventListener("storage", refreshSharedData);
    };
  }, []);

  // Le compte connecté récupère aussi ses favoris conservés côté serveur.
  useEffect(() => {
    const user = readStoredUser();
    if (!user?._id) return;
    let cancelled = false;
    apiClient.get(`/api/favorites/${user._id}`, getAuthConfig())
      .then((response) => {
        if (cancelled || !Array.isArray(response.data)) return;
        const merged = normalizeFavorites([
          ...normalizeFavorites(response.data),
          ...readSafeArray(`favorites_${user._id}`)
        ]);
        writeSafeJSON(`favorites_${user._id}`, merged);
        setWishlist(merged);
        window.dispatchEvent(new Event("favoritesUpdated"));

        // Réconcilie les favoris locaux avec le compte sans envoyer d'identifiant client.
        Promise.allSettled(
          merged
            .filter((product) => isValidObjectId(product._id))
            .map((product) =>
              apiClient.post("/api/favorites", { productId: product._id }, getAuthConfig())
            )
        );
      })
      .catch((error) => console.warn("Synchronisation des favoris indisponible.", error));
    return () => { cancelled = true; };
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
  try {
    const audio = new Audio("/sounds/click.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(100);
  } catch {
    // Le son est facultatif et ne bloque jamais l'action.
  }
};



const addToCart = (product) => {
  if (!product || typeof product._id !== "string" || !product._id) return;
  setCart((previousCart) => {
    const current = normalizeCart(previousCart);
    const existing = current.find((item) => item._id === product._id);
    if (existing) return current.map((item) =>
      item._id === product._id
        ? { ...item, quantity: Math.min(99, (Number(item.quantity) || 1) + 1) }
        : item
    );
    return normalizeCart([...current, { ...product, quantity: 1 }]);
  });
};

// ➕ AUGMENTER QUANTITÉ

const increaseQty = (index) => {
  setCart((previous) => previous.map((item, itemIndex) =>
    itemIndex === index ? { ...item, quantity: Math.min(99, (Number(item.quantity) || 1) + 1) } : item
  ));
};

// ➖ DIMINUER QUANTITÉ
const decreaseQty = (index) => {
  setCart((previous) => previous.map((item, itemIndex) =>
    itemIndex === index ? { ...item, quantity: Math.max(1, (Number(item.quantity) || 1) - 1) } : item
  ));
};

const toggleWishlist = async (product) => {
  if (!product || typeof product._id !== "string" || !product._id) return;
  const user = readStoredUser();
  const clientId = user?._id || getStableGuestId();
  const favoritesKey = `favorites_${clientId}`;
  const current = normalizeFavorites(readSafeArray(favoritesKey));
  const exists = current.some((item) => item._id === product._id);
  const updated = exists
    ? current.filter((item) => item._id !== product._id)
    : normalizeFavorites([...current, product]);

  writeSafeJSON(favoritesKey, updated);
  setWishlist(updated);
  window.dispatchEvent(new Event("favoritesUpdated"));

  if (user?._id && isValidObjectId(product._id)) {
    try {
      if (exists) {
        await apiClient.delete(`/api/favorites/${user._id}/${product._id}`, getAuthConfig());
      } else {
        await apiClient.post("/api/favorites", { productId: product._id }, getAuthConfig());
      }
    } catch (error) {
      console.warn("Synchronisation serveur des favoris impossible.", error);
    }
  }
};

// SUPPRIMER PANIER



  const removeFromCart = (indexToRemove) => {
  setCart((previous) => previous.filter((_, index) => index !== indexToRemove));
};

// RECUP PRODUITS



  useEffect(() => {



    apiClient
      .get("/api/products")
      .then((res) => {

        const data = Array.isArray(res.data)
          ? res.data.filter(
              (product) =>
                product &&
                typeof product === "object" &&
                typeof product._id === "string"
            )
          : [];

        setProducts(data);

      })
      .catch((err) => {

        console.log(err);

        setProducts([]);

      })
      .finally(() => setIsLoadingProducts(false));



  }, []);



 // ==============================

// ==============================
// SAUVEGARDE ET SYNCHRONISATION PANIER
// ==============================
useEffect(() => {
  const clientId = getClientStorageId();
  const normalizedCart = normalizeCart(cart);
  writeSafeJSON(`cart_${clientId}`, normalizedCart);
  try { localStorage.setItem("cartCount", String(normalizedCart.length)); } catch {}
  window.dispatchEvent(new Event("cartUpdated"));
}, [cart]);

// ==============================
// SAUVEGARDE ET SYNCHRONISATION FAVORIS
// ==============================
useEffect(() => {
  writeSafeJSON(`favorites_${getClientStorageId()}`, normalizeFavorites(wishlist));
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



console.log(

  "Recherche:",

  search

);



console.log(

  "Résultats:",

  filteredProducts.length

);



const randomProducts = useMemo(

  () =>

    [...filteredProducts].sort(

      () => Math.random() - 0.5

    ),

  [

    products,

    selectedCategory,

    selectedBrand,

    search

  ]

);



const displayedProducts =

  search.trim()

    ? filteredProducts

    : randomProducts;

  const productsPerHorizontalRow = Math.max(2, Math.ceil(viewportWidth / 380) * 2);
  const productRows = useMemo(() => {
    const rows = [];
    for (let index = 0; index < displayedProducts.length; index += productsPerHorizontalRow) {
      rows.push(displayedProducts.slice(index, index + productsPerHorizontalRow));
    }
    return rows;
  }, [displayedProducts, productsPerHorizontalRow]);



  return (



      <>
    <style>{`
      @keyframes konanBoutiqueSpin { to { transform: rotate(360deg); } }
      .konan-boutique-spinner {
        width: 42px; height: 42px;
        border: 4px solid rgba(91,108,255,.16);
        border-top-color: #5b6cff; border-right-color: #7c4dff;
        border-radius: 50%; animation: konanBoutiqueSpin .8s linear infinite;
        flex: 0 0 auto;
      }
      .konan-products-horizontal-row {
        display: flex; flex-wrap: nowrap; gap: clamp(12px, 2vw, 22px);
        width: 100%; overflow-x: auto; overflow-y: hidden;
        padding: 5px 2px 16px; box-sizing: border-box;
        -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain;
        touch-action: pan-x pan-y; scroll-snap-type: x proximity;
        scrollbar-width: none;
      }
      .konan-products-horizontal-row::-webkit-scrollbar { display: none; }
      .konan-product-link {
        display: block;
        flex: 0 0 clamp(300px, 30vw, 380px);
        width: clamp(300px, 30vw, 380px);
        min-width: 0;
        scroll-snap-align: start;
        box-sizing: border-box;
      }
      @media (min-width: 768px) and (max-width: 1100px) {
        .konan-product-link {
          flex-basis: 42vw;
          width: 42vw;
        }
      }
      @media (max-width: 767px) {
        .konan-product-link {
          flex-basis: min(86vw, 360px);
          width: min(86vw, 360px);
        }
      }
      @media (max-width: 380px) {
        .konan-product-link {
          flex-basis: 88vw;
          width: 88vw;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .konan-boutique-spinner { animation-duration: 1.8s; }
      }
    `}</style>

    <SeoBreadcrumb

      pageUrl="https://konanshopping.com/boutique"

      items={[

        {

          name: "Accueil",

          url: "https://konanshopping.com/",

        },

        {

          name: "Boutique",

          url: "https://konanshopping.com/boutique",

        },

      ]}

    />





    <div

  style={{

    minHeight: "100vh",



    background:

      "var(--season-page, linear-gradient(135deg,#f8fafc,#eef2ff))",



    padding:

      viewportWidth < 768

        ? "8px"

        : "16px",



    fontFamily:

      "'Poppins', Arial, sans-serif",

  }}

>



 {/* NAVBAR PREMIUM */}



<div

  style={{

    background: "rgba(255,255,255,.92)",

    backdropFilter: "blur(18px)",

    WebkitBackdropFilter: "blur(18px)",



    borderRadius:

      viewportWidth < 768

        ? "18px"

        : "22px",



    padding:

      viewportWidth < 768

        ? "8px 10px"

        : "12px 18px",



    display: "flex",



    justifyContent: "space-between",



    alignItems: "center",



    flexWrap: "nowrap",



    gap:

      viewportWidth < 768

        ? "8px"

        : "18px",



    marginBottom: "20px",



    boxShadow:

      "0 12px 30px rgba(91,108,255,.08)",



    border:

      "1px solid rgba(255,255,255,.85)",



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

      flexShrink: 0,

    }}

  >



    <div

      style={{

        display: "flex",

        alignItems: "center",

        gap: "10px",

      }}

    >



      {/* IMAGE */}



      <div

        style={{

          width:

            viewportWidth < 768

              ? "38px"

              : "46px",



          height:

            viewportWidth < 768

              ? "38px"

              : "46px",



          borderRadius: "12px",



          overflow: "hidden",



          background: "#FFFFFF",



          display: "flex",



          alignItems: "center",



          justifyContent: "center",



          border: "1px solid #EEF2FF",



          boxShadow:

            "0 6px 15px rgba(91,108,255,.12)",

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



      {/* TEXTE */}



      <div>



        <h2

        translate="no"

          style={{

            margin: 0,



            fontSize:

              viewportWidth < 768

                ? "15px"

                : "20px",



            fontWeight: "800",



            lineHeight: "1",



            background:

              "linear-gradient(135deg,#111827,#5B6CFF)",



            WebkitBackgroundClip: "text",



            WebkitTextFillColor: "transparent",

          }}

        >

          KONAN SHOPPING

        </h2>



        <p

          style={{

            margin: 0,



            marginTop: "3px",



            color: "#6B7280",



            fontSize:

              viewportWidth < 768

                ? "9px"

                : "10px",



            fontWeight: "600",

          }}

        >

          Habilleur des stars

        </p>



      </div>



    </div>



  </Link>



  {/* SEARCH */}



  <div

    style={{

      display: "flex",

      alignItems: "center",

      flex: 1,

      justifyContent: "flex-end",

      minWidth: 0,

      gap: "8px",

    }}

  >



    <div

      style={{

        position: "relative",

        flex: 1,

        maxWidth:
          viewportWidth < 380
            ? "95px"
            : viewportWidth < 768
              ? "130px"
              : "240px",

      }}

    >



      <FaSearch

        style={{

          position: "absolute",

          top: "50%",

          left: "12px",

          transform: "translateY(-50%)",

          color: "var(--season-muted, #9CA3AF)",

          fontSize: "13px",

          pointerEvents: "none",

        }}

      />



      <input

        type="text"



        placeholder="Rechercher..."



        value={search}



        onChange={(e) =>

          setSearch(e.target.value)

        }



        style={{

          width: "100%",



          padding:

            "9px 14px 9px 34px",



          borderRadius: "30px",



          border:

            "1px solid var(--season-border, #E5E7EB)",



          outline: "none",



          fontSize:

            viewportWidth < 768

              ? "12px"

              : "13px",



          fontWeight: "500",



          background:

            "var(--season-surface, linear-gradient(135deg,#FFFFFF,#F9FAFB))",



          color: "#111827",



          boxShadow:

            "0 5px 15px rgba(0,0,0,.05)",



          transition: ".3s",

        }}



        onFocus={(e) => {



          e.target.style.border =

            "1px solid var(--season-primary, #5B6CFF)";



          e.target.style.boxShadow =

            "0 8px 20px var(--season-glow, rgba(91,108,255,.15))";



        }}



        onBlur={(e) => {



          e.target.style.border =

            "1px solid var(--season-border, #E5E7EB)";



          e.target.style.boxShadow =

            "0 5px 15px rgba(0,0,0,.05)";



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

      flexShrink: 0,

    }}

  >



    <div

      style={{

        width:

          viewportWidth < 768

            ? "40px"

            : "46px",



        height:

          viewportWidth < 768

            ? "40px"

            : "46px",



        borderRadius: "14px",



        background:

          "linear-gradient(135deg,#111827,#374151)",



        display: "flex",



        justifyContent: "center",



        alignItems: "center",



        color: "#FFFFFF",



        fontSize:

          viewportWidth < 768

            ? "16px"

            : "18px",



        boxShadow:

          "0 8px 20px rgba(0,0,0,.15)",

      }}

    >



      <FaShoppingCart />



    </div>



    {cart.length > 0 && (



      <div

        style={{

          position: "absolute",



          top: "-5px",



          right: "-5px",



          width:

            viewportWidth < 768

              ? "18px"

              : "20px",



          height:

            viewportWidth < 768

              ? "18px"

              : "20px",



          borderRadius: "50%",



          background:

            "linear-gradient(135deg,#EF4444,#DC2626)",



          color: "#FFFFFF",



          display: "flex",



          justifyContent: "center",



          alignItems: "center",



          fontSize: "9px",



          fontWeight: "800",



          border:

            "2px solid #FFFFFF",

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

    marginTop: "14px",

    marginBottom: "30px",

    padding: "0 12px",

    boxSizing: "border-box",

  }}

>



  {/* MENU */}



  <div

    style={{

      display: "flex",

      justifyContent: "center",

      width: "100%",

      maxWidth: "480px",

    }}

  >



    {/* NAVIGATION */}



    <div

      style={{

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        gap: viewportWidth < 768 ? "10px" : "18px",

        width: "100%",

      }}

    >



      {/* ACCUEIL */}



      <Link

        to="/"

        style={{

          ...navStyle,



          flex: 1,



          display: "flex",



          alignItems: "center",



          justifyContent: "center",



          gap: "6px",



          textDecoration: "none",



          background: "#FFFFFF",



          color: "#374151",



          height: viewportWidth < 768 ? "46px" : "50px",



          borderRadius: "16px",



          fontWeight: "700",



          fontSize: viewportWidth < 768 ? "14px" : "15px",



          boxShadow: "0 6px 16px rgba(0,0,0,.05)",



          border: "1px solid #EEF2F7",

        }}

      >



        <FaHome

          style={{

            fontSize: "17px",

          }}

        />



        Accueil



      </Link>



      {/* BOUTIQUE */}



      <Link

        to="/boutique"

        style={{

          ...navStyle,



          flex: 1,



          display: "flex",



          alignItems: "center",



          justifyContent: "center",



          gap: "6px",



          textDecoration: "none",



          background:

            "linear-gradient(135deg,var(--season-primary, #5B6CFF),var(--season-secondary, #7C4DFF))",



          color: "#FFFFFF",



          height: viewportWidth < 768 ? "46px" : "50px",



          borderRadius: "16px",



          fontWeight: "700",



          fontSize: viewportWidth < 768 ? "14px" : "15px",



          boxShadow:

            "0 10px 22px rgba(91,108,255,.28)",

        }}

      >



        <FaStore

          style={{

            fontSize: "17px",

          }}

        />



        Boutique



      </Link>



      {/* CONTACT */}



      <a

        href="https://wa.me/237694641329"

        style={{

          ...navStyle,



          flex: 1,



          display: "flex",



          alignItems: "center",



          justifyContent: "center",



          gap: "6px",



          textDecoration: "none",



          background: "#F0FDF4",



          color: "#16A34A",



          height: viewportWidth < 768 ? "46px" : "50px",



          borderRadius: "16px",



          fontWeight: "700",



          fontSize: viewportWidth < 768 ? "14px" : "15px",



          boxShadow:

            "0 6px 16px rgba(34,197,94,.12)",



          border: "1px solid #DCFCE7",

        }}

      >



        <FaWhatsapp

          style={{

            fontSize: "18px",

          }}

        />



        Contact



      </a>



    </div>



  </div>



</div>



{/* HERO */}



<div

  style={{

    height: viewportWidth < 360 ? "175px" : viewportWidth < 480 ? "190px" : viewportWidth < 768 ? "220px" : viewportWidth < 900 ? "260px" : "320px",



    borderRadius: "24px",



    overflow: "hidden",



    position: "relative",



    marginBottom: viewportWidth < 768 ? "20px" : "35px",



    boxShadow:

      "0 18px 42px rgba(0,0,0,0.16)",



    background: "#111827",

  }}

>



  {/* SLIDES */}



  {heroSlides.map((slide, index) => (



    <div

      key={index}
      role="button"
      tabIndex={heroIndex === index ? 0 : -1}
      aria-label={`Voir le produit ${slide.title}`}
      onClick={() => {
        if (heroIndex === index && slide._id) navigate(`/product/${slide._id}`);
      }}
      onKeyDown={(e) => {
        if (heroIndex === index && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          if (slide._id) navigate(`/product/${slide._id}`);
        }
      }}



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
        pointerEvents: heroIndex === index ? "auto" : "none",
        cursor: heroIndex === index ? "pointer" : "default",

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

            viewportWidth < 768

              ? "14px"

              : "38px",



          bottom:

            viewportWidth < 768

              ? "10px"

              : "28px",



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



            padding: viewportWidth < 768 ? "4px 9px" : "6px 12px",



            borderRadius: "50px",



            background:

              "rgba(255,255,255,0.15)",



            backdropFilter:

              "blur(12px)",



            border:

              "1px solid rgba(255,255,255,0.15)",



            marginBottom: viewportWidth < 768 ? "8px" : "16px",



            fontSize: viewportWidth < 768 ? "9px" : "11px",



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

              viewportWidth < 380

                ? "16px"
                : viewportWidth < 768
                  ? "18px"
                  : "40px",



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

            marginTop: viewportWidth < 768 ? "6px" : "14px",



            fontSize:

              viewportWidth < 768

                ? "10px"

                : "16px",



            color:

              "rgba(255,255,255,0.92)",



            maxWidth: viewportWidth < 768 ? "min(90%, 420px)" : "520px",



            lineHeight: viewportWidth < 768 ? "16px" : "22px",



            fontWeight: "500",

          }}

        >

          {slide.subtitle}

        </p>



        {/* BUTTONS */}



        <div

          style={{

            display: "flex",



            gap: viewportWidth < 768 ? "8px" : "14px",



            marginTop: viewportWidth < 768 ? "10px" : "20px",



            flexWrap: "wrap",

          }}

        >



          <button

          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${slide._id}`);
          }}

            style={{

              padding:

                viewportWidth < 768

                  ? "8px 12px"

                  : "14px 24px",



              border: "none",



              borderRadius: "18px",



              background:

                "linear-gradient(135deg,var(--season-primary, #5b6cff),var(--season-secondary, #7c4dff))",



              color: "white",



              fontWeight: "800",



              cursor: "pointer",



              display: "flex",



              alignItems: "center",



              gap: "10px",



              fontSize: viewportWidth < 768 ? "11px" : "14px",



              boxShadow:

                "0 12px 25px rgba(91,108,255,0.35)",

            }}

          >



            <FaFire />



            Voir les offres



          </button>



          <button

          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${slide._id}`);
          }}

            style={{

              padding:

                viewportWidth < 768

                  ? "8px 12px"

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



              fontSize: viewportWidth < 768 ? "11px" : "14px",

            }}

          >



            <FaShoppingBag />



            Explorer



          </button>



        </div>



      </div>



    </div>



  ))}

  {isLoadingProducts && heroSlides.length === 0 && (
    <div role="status" aria-live="polite" style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "12px", color: "#fff",
      background: "linear-gradient(135deg,#111827,#27346b)", zIndex: 5,
    }}>
      <div className="konan-boutique-spinner" />
      <span style={{ fontSize: "13px", fontWeight: 700 }}>Préparation de vos offres...</span>
    </div>
  )}

  {/* INDICATORS */}



  <div

    style={{

      position: "absolute",



      bottom: viewportWidth < 768 ? "10px" : "20px",



      right: viewportWidth < 768 ? "12px" : "20px",



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

              ? (viewportWidth < 768 ? "22px" : "30px")

              : (viewportWidth < 768 ? "7px" : "10px"),



          height: viewportWidth < 768 ? "7px" : "10px",



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

viewportWidth < 768

? "14px"

: "24px",



borderRadius:

viewportWidth < 768

? "20px"

: "30px",



marginBottom:

viewportWidth < 768

? "18px"

: "35px",



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

            viewportWidth < 768

              ? "50px"

              : "56px",



          height:

            viewportWidth < 768

              ? "50px"

              : "56px",



          borderRadius: "18px",



          background:

            "linear-gradient(135deg,var(--season-primary, #5b6cff),var(--season-secondary, #7c4dff))",



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

              viewportWidth < 768

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

              viewportWidth < 768

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



          color: "var(--season-primary, #5b6cff)",



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

            color: "var(--season-primary, #5b6cff)",



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



          color: "var(--season-primary, #5b6cff)",



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

      marginTop:

viewportWidth < 768

? "12px"

: "20px",



      background: "white",



      borderRadius: "24px",



      padding:

        viewportWidth < 768

          ? "10px"

          : "18px",



      display: "flex",



      alignItems: "center",



      gap:

        viewportWidth < 768

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

    width: viewportWidth < 768 ? "120px" : "170px",



    height: viewportWidth < 768 ? "120px" : "170px",



    flexShrink: 0,



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

    objectFit: "cover",

    objectPosition: "center",

    display: "block",

    borderRadius: "18px",

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

            viewportWidth < 768

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

              "linear-gradient(135deg,var(--season-primary, #5b6cff),var(--season-secondary, #7c4dff))",



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

            viewportWidth < 768

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

            viewportWidth < 768

              ? "24px"

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



    writeSafeJSON(`checkoutCart_${getClientStorageId()}`, normalizeCart(cart));



  }}





      style={{

        width:

          viewportWidth < 768

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



          padding:

viewportWidth < 768

? "15px"

: "18px",



          border: "none",



          borderRadius: "20px",



          background:

            "linear-gradient(135deg,var(--season-primary, #5b6cff),var(--season-secondary, #7c4dff),var(--season-decoration, #9333ea))",



          color: "white",



          cursor: "pointer",



          fontWeight: "900",



          fontSize:

viewportWidth < 768

? "14px"

: "15px",



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

    gap: "8px",

    width: "100%",

  }}

>



{/* SIDEBAR CATÉGORIES AUTO */}



<div

  style={{

    marginBottom: "12px",



    overflow: "hidden",



    position: "relative",

  }}

>



  {/* TITRE */}



  <h3

    style={{

      marginBottom: "12px",



      display: "flex",



      alignItems: "center",



      gap: "10px",



      fontSize:

        viewportWidth < 768

          ? "20px"

          : "23px",



      fontWeight: "900",



      color: "#111827",

    }}

  >

    <FaTags

      style={{

        color: "var(--season-primary, #5b6cff)",

      }}

    />



    Catégories



  </h3>



  {/* SLIDER */}



  <div

  className="categoriesContainer"



  onWheel={(e)=>{

      e.currentTarget.scrollLeft += e.deltaY;

  }}



  style={{

      width:"100%",

  }}

>



<div

translate="no"

className="categoriesSlider"

>



      {[

  "Tous",

  "T-shirts",

  "Chemises",

  "Blouses",

  "Polos",

  "Débardeurs",

  "Pulls",

  "Gilets",

  "Sweats",

  "Hoodies",

  "Vestes",

  "Blousons",

  "Manteaux",

  "Costumes",

  "Blazers",

  "Robes",

  "Jupes",

  "Pantalons",

  "Jeans",

  "Leggings",

  "Shorts",

  "Combinaisons",

  "Pyjamas",

  "Sous-vêtements",

  "Lingerie",

  "Chaussettes",

  "Maillots de bain",

  "Vêtements de sport",

  "Tenues de yoga",

  "Mode homme",

  "Mode femme",

  "Mode enfant",

  "Mode bébé",

  "Chaussures",

  "Baskets",

  "Chaussures de ville",

  "Bottes",

  "Bottines",

  "Sandales",

  "Mocassins",

  "Escarpins",

  "Ballerines",

  "Claquettes",

  "Sacs à main",

  "Sacs à dos",

  "Sacs de voyage",

  "Valises",

  "Portefeuilles",

  "Ceintures",

  "Montres",

  "Bijoux",

  "Lunettes",

  "Casquettes",

  "Chapeaux",

  "Écharpes",

  "Foulards",

  "Gants",

  "Accessoires",

  "Accessoires de mode",

  "Luxe",

  "Nouveautés",

  "Promotions",



  // duplication pour boucle fluide

  "Tous",

  "T-shirts",

  "Chemises",

  "Blouses",

  "Polos",

  "Débardeurs",

  "Pulls",

  "Gilets",

  "Sweats",

  "Hoodies",

  "Vestes",

  "Blousons",

  "Manteaux",

  "Costumes",

  "Blazers",

  "Robes",

  "Jupes",

  "Pantalons",

  "Jeans",

  "Leggings",

  "Shorts",

  "Combinaisons",

  "Pyjamas",

  "Sous-vêtements",

  "Lingerie",

  "Chaussettes",

  "Maillots de bain",

  "Vêtements de sport",

  "Tenues de yoga",

  "Mode homme",

  "Mode femme",

  "Mode enfant",

  "Mode bébé",

  "Chaussures",

  "Baskets",

  "Chaussures de ville",

  "Bottes",

  "Bottines",

  "Sandales",

  "Mocassins",

  "Escarpins",

  "Ballerines",

  "Claquettes",

  "Sacs à main",

  "Sacs à dos",

  "Sacs de voyage",

  "Valises",

  "Portefeuilles",

  "Ceintures",

  "Montres",

  "Bijoux",

  "Lunettes",

  "Casquettes",

  "Chapeaux",

  "Écharpes",

  "Foulards",

  "Gants",

  "Accessoires",

  "Accessoires de mode",

  "Luxe",

  "Nouveautés",

  "Promotions",

].map((cat, index) => (



        <div

          key={index}



          onClick={() =>

            setSelectedCategory(cat)

          }



          style={{

  flexShrink: 0,



  display: "flex",

  alignItems: "center",

  justifyContent: "center",



  gap: "6px",



  whiteSpace: "nowrap",



  padding:

    viewportWidth < 768

      ? "8px 14px"

      : "10px 18px",



  borderRadius: "30px",



  cursor: "pointer",



  background:

    selectedCategory === cat

      ? "var(--season-primary, #4B2E83)"

      : "#fff",



  color:

    selectedCategory === cat

      ? "#fff"

      : "#374151",



  fontWeight: "600",



  fontSize:

    viewportWidth < 768

      ? "12px"

      : "13px",



  border: "1px solid #ECECEC",



  boxShadow:

    selectedCategory === cat

      ? "0 6px 18px rgba(75,46,131,.18)"

      : "0 2px 8px rgba(0,0,0,.05)",



  transition: ".25s"

}}

        >



          <span>{cat}</span>



          <FaChevronRight

  style={{

    fontSize: "10px",

    opacity: 0.5,

  }}

/>



        </div>



      ))}



    </div>



  </div>



</div>



       {/* PRODUITS */}

<div
  style={{
    marginTop: "2px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
    minWidth: 0,
  }}
>
  {isLoadingProducts ? (
    <div role="status" aria-live="polite" style={{
      minHeight: "220px", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "14px",
      padding: "28px 16px", background: "rgba(255,255,255,.82)",
      border: "1px solid #e8edff", borderRadius: "22px",
      boxShadow: "0 12px 30px rgba(30,41,59,.06)",
    }}>
      <div className="konan-boutique-spinner" />
      <strong style={{ color: "#27346b", fontSize: "15px", textAlign: "center" }}>
        Chargement de nos produits...
      </strong>
      <span style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
        Nous préparons votre sélection KONAN SHOPPING
      </span>
    </div>
  ) : displayedProducts.length === 0 ? (
    products.length > 0 &&
    selectedCategory !== "Tous" &&
    !search.trim() &&
    !selectedBrand ? (
      <div
        role="status"
        aria-live="polite"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: viewportWidth < 600 ? "28px 16px" : "42px 28px",
          textAlign: "center",
          background: "linear-gradient(145deg,#ffffff,#f8faff)",
          borderRadius: "24px",
          color: "#374151",
          border: "1px solid #e3e9ff",
          boxShadow: "0 14px 35px rgba(30,41,59,.07)",
        }}
      >
        <div style={{
          width: "68px",
          height: "68px",
          margin: "0 auto 18px",
          borderRadius: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#fff7ed,#ffedd5)",
          color: "#ea580c",
          fontSize: "30px",
          boxShadow: "0 8px 20px rgba(234,88,12,.10)",
        }}>
          <FaBoxOpen />
        </div>

        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "30px",
          background: "#fff7ed",
          color: "#c2410c",
          fontSize: "11px",
          fontWeight: "800",
          letterSpacing: ".4px",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}>
          Stock temporairement épuisé
        </span>

        <h3 style={{
          margin: "0 0 10px",
          color: "#111827",
          fontSize: viewportWidth < 600 ? "19px" : "23px",
          fontWeight: "900",
          lineHeight: 1.3,
        }}>
          La catégorie « {selectedCategory} » revient bientôt !
        </h3>

        <p style={{
          maxWidth: "560px",
          margin: "0 auto 16px",
          color: "#6b7280",
          fontSize: "14px",
          lineHeight: 1.7,
        }}>
          Tous les articles de cette catégorie sont momentanément indisponibles.
          Notre équipe travaille à leur réapprovisionnement afin de vous proposer
          à nouveau vos articles préférés.
        </p>

        <div style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: "5px",
          padding: "12px 18px",
          marginBottom: "20px",
          borderRadius: "14px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}>
          <span style={{ color: "#6b7280", fontSize: "11px", fontWeight: "700" }}>
            DATE DE RÉAPPROVISIONNEMENT
          </span>
          <strong style={{ color: "#27346b", fontSize: "14px" }}>
            À confirmer auprès de notre service client
          </strong>
        </div>

        <p style={{
          margin: "0 auto 16px",
          color: "#6b7280",
          fontSize: "13px",
          lineHeight: 1.6,
        }}>
          Contactez-nous pour connaître la prochaine disponibilité ou être informé
          dès le retour des articles.
        </p>

        <a
          href={`https://wa.me/237694641329?text=${encodeURIComponent(
            `Bonjour KONAN SHOPPING, je souhaite connaître la date de réapprovisionnement de la catégorie : ${selectedCategory}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "9px",
            width: viewportWidth < 480 ? "100%" : "auto",
            maxWidth: "100%",
            boxSizing: "border-box",
            padding: "13px 20px",
            borderRadius: "14px",
            background: "linear-gradient(135deg,#16a34a,#15803d)",
            color: "#fff",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "800",
            boxShadow: "0 9px 20px rgba(22,163,74,.20)",
          }}
        >
          <FaWhatsapp style={{ fontSize: "19px" }} />
          Contacter le service client
        </a>
      </div>
    ) : (
      <div style={{
        padding: "35px 18px", textAlign: "center", background: "#fff",
        borderRadius: "20px", color: "#6b7280", border: "1px solid #eef2ff",
      }}>
        Aucun produit ne correspond à votre recherche.
      </div>
    )
  ) : (
    productRows.map((row, rowIndex) => (
      <div key={`product-row-${rowIndex}`} className="konan-products-horizontal-row">
        {row.map((product) => (



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

  e.currentTarget.style.transform = "translateY(-8px)";

  e.currentTarget.querySelector("img").style.transform = "scale(1.06)";

}}



onMouseLeave={(e) => {

  e.currentTarget.style.transform = "translateY(0)";

  e.currentTarget.querySelector("img").style.transform = "scale(1)";

}}



     style={{

  background: "white",



  borderRadius: "18px",



  padding:

  viewportWidth < 768

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

  viewportWidth < 768

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

  wishlist

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

    width: "100%",



    height:

      viewportWidth < 768

        ? "180px"

        : "240px",



    background: "#f8f8fb",



    borderRadius: "18px",



    overflow: "hidden",



    display: "flex",



    alignItems: "center",



    justifyContent: "center",

  }}

>

  <img

    src={product.image}

     alt=""

    style={{

      width: "100%",



      height: "100%",



      objectFit: "cover",



      objectPosition: "center",



      display: "block",



      transition: ".35s",

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

                    marginTop: "8px",

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



    padding: viewportWidth < 768 ? "10px" : "12px",



fontSize:

  viewportWidth < 768

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



    const clientId = getClientStorageId();
    const currentCart = normalizeCart(readSafeArray(`cart_${clientId}`));
    const existing = currentCart.find((item) => item._id === product._id);
    const nextCart = existing
      ? currentCart.map((item) => item._id === product._id
          ? { ...item, quantity: Math.min(99, (Number(item.quantity) || 1) + 1) }
          : item)
      : normalizeCart([...currentCart, { ...product, quantity: 1 }]);

    writeSafeJSON(`cart_${clientId}`, nextCart);
    writeSafeJSON(`checkoutCart_${clientId}`, nextCart);
    setCart(nextCart);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/checkout");



  }}



  style={{

    width: "100%",

    padding:

      viewportWidth < 768

        ? "10px"

        : "12px",



    fontSize:

      viewportWidth < 768

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
    ))
  )}
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

              width: "min(1000px, calc(100vw - 24px))",
              maxHeight: "90dvh",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              boxSizing: "border-box",
              background: "white",
              borderRadius: viewportWidth < 600 ? "18px" : "30px",
              padding: viewportWidth < 600 ? "16px" : viewportWidth < 900 ? "24px" : "40px",

            }}

          >



            <div

              style={{

                display: "flex",
                flexDirection: viewportWidth < 768 ? "column" : "row",
                gap: viewportWidth < 600 ? "16px" : "40px",

              }}

            >



              <img

                src={selectedProduct.image}

                 alt=""

                style={{

                  width: viewportWidth < 768 ? "100%" : "min(400px, 42%)",
                  maxWidth: "100%",
                  height: viewportWidth < 600 ? "min(72vw, 320px)" : viewportWidth < 900 ? "320px" : "400px",
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
                  gridTemplateColumns: viewportWidth < 560
                    ? "repeat(1,minmax(0,1fr))"
                    : viewportWidth < 900
                      ? "repeat(2,minmax(0,1fr))"
                      : "repeat(3,minmax(0,1fr))",
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



   </>

);



}



export default Boutique;