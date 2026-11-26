import {

  useState,

  useEffect

} from "react";

import axios from "axios";

import {

  useNavigate

} from "react-router-dom";

import { toast } from "react-toastify";

import {

  FaHeart,

  FaTrash,

  FaShoppingCart,

  FaBoxOpen

} from "react-icons/fa";

import {

  FaBolt

} from "react-icons/fa";

const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;

const isValidObjectId = (value) =>

  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const safeParse = (value, fallback = null) => {

  try {

    return value ? JSON.parse(value) : fallback;

  } catch {

    return fallback;

  }

};

const safeStorageGet = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key, value) => {
  try {
    window.localStorage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
};

const safeStorageRemove = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Le navigateur peut bloquer le stockage local.
  }
};

const getStoredUser = () =>
  safeParse(safeStorageGet("user"), null);
const getStableGuestId = () => {
  let guestId = safeStorageGet("guestId");

  if (!guestId || !/^guest_[a-zA-Z0-9_-]{8,80}$/.test(guestId)) {
    let randomPart;

    try {
      randomPart = window.crypto?.randomUUID?.();
    } catch {
      randomPart = null;
    }

    if (!randomPart) {
      randomPart = `${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`;
    }

    guestId = `guest_${randomPart}`;
    safeStorageSet("guestId", guestId);
  }

  return guestId;
};

// Authentification par cookie HttpOnly
axios.defaults.withCredentials = true;

const getAuthConfig = () => ({
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.headers = config.headers || {};
  config.headers.Accept = "application/json";
  return config;
});

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error?.response?.status === 401) {

      safeStorageRemove("user");

      safeStorageRemove("token");

      safeStorageRemove("userToken");

    }

    return Promise.reject(error);

  }

);

const getErrorMessage = (error) => {

  if (error?.response?.status === 401) {

    return "Votre session a expiré. Veuillez vous reconnecter.";

  }

  if (error?.response?.status === 403) {

    return "Accès non autorisé.";

  }

  if (error?.response?.status === 429) {

    return "Trop de demandes. Veuillez patienter.";

  }

  if (error?.code === "ECONNABORTED") {

    return "La demande a expiré. Veuillez réessayer.";

  }

  return "Une erreur est survenue. Veuillez réessayer.";

};

function Favorites() {

  const navigate =

    useNavigate();

  const [favorites, setFavorites] =

    useState([]);

  const [loading, setLoading] =

    useState(true);

  const user = getStoredUser();

  useEffect(() => {

    // ======================

    // CLIENT CONNECTÉ

    // ======================

    if (user?._id) {

      const userId = String(user._id);

      if (!isValidObjectId(userId)) {

        safeStorageRemove("user");

        safeStorageRemove("token");

        safeStorageRemove("userToken");

        navigate("/login");

        setLoading(false);

        return;

      }

      api

        .get(`/api/favorites/${userId}`, getAuthConfig())

        .then((res) => {

          const data = Array.isArray(res?.data)

            ? res.data

            : [];

          setFavorites(data);

        })

        .catch((err) => {

          console.log(err);

          toast.error(getErrorMessage(err));

        })

        .finally(() => {

          setLoading(false);

        });

    }

    // ======================

    // CLIENT NON CONNECTÉ

    // ======================

else {
  const guestId = getStableGuestId();
  const favoritesKey = `favorites_${guestId}`;

  const savedFavorites =
    safeParse(safeStorageGet(favoritesKey), []);

  setFavorites(Array.isArray(savedFavorites) ? savedFavorites : []);

  setLoading(false);
}

  }, []);

  // =========================

  // FAVORITES COUNT

  // =========================

  useEffect(() => {

    safeStorageSet(

      "favoritesCount",

      favorites.length

    );

  }, [favorites]);

useEffect(() => {

  const updateFavorites =

    () => {

      const user = getStoredUser();

      const clientId =

        user?._id ||

        getStableGuestId();

      const favoritesKey =

        `favorites_${clientId}`;

      const parsedFavorites =
        safeParse(safeStorageGet(favoritesKey), []);

      setFavorites(
        Array.isArray(parsedFavorites) ? parsedFavorites : []
      );

    };

    updateFavorites();

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

  // =========================

  // ADD TO CART

  // =========================

  const addToCart =

    async (product) => {

      try {

        const productId = String(product?._id || "");

        if (!isValidObjectId(productId)) {

          toast.error("Produit invalide.");

          return;

        }

        safeStorageRemove(

          "checkoutProduct"

        );

        const user = getStoredUser();

        // =====================

        // IDENTIFIANT CLIENT

        // =====================

        const clientId =

          user?._id ||

          getStableGuestId() ||

          getStableGuestId();

        // =====================

        // PANIER PRIVÉ CLIENT

        // =====================

        const clientCartKey =

          `cart_${clientId}`;

        let clientCart =

          safeParse(safeStorageGet(clientCartKey), []) || [];

        // =====================

        // VERIFIER EXISTE

        // =====================

        const alreadyExists =

          clientCart.find(

            (item) =>

              String(item?._id) === productId

          );

        // =====================

        // AJOUT PRODUIT

        // =====================

        if (!alreadyExists) {

          const productData = {

            ...product,

            quantity: 1

          };

          clientCart.push(

            productData

          );

          safeStorageSet(

            clientCartKey,

            JSON.stringify(

              clientCart

            )

          );

        }

        // =====================

        // UPDATE COUNT

        // =====================

        safeStorageSet(

          "cartCount",

          clientCart.length

        );

        // =====================

        // EVENT UPDATE

        // =====================

        window.dispatchEvent(

          new Event("cartUpdated")

        );

        toast.success(

  "Produit ajouté au panier 🛒"

);

      }

      catch (err) {

        console.log(err);

      }

    };

    // =========================

// ACHETER MAINTENANT

// =========================

const buyNow = async (product) => {

  try {

    const productId = String(product?._id || "");

    if (!isValidObjectId(productId)) {

      toast.error("Produit invalide.");

      return;

    }

    const currentUser = getStoredUser();

    // =====================

    // IDENTIFIANT CLIENT

    // =====================

    const clientId =

      currentUser?._id ||

      getStableGuestId() ||

      getStableGuestId();

    // =====================

    // PANIER CLIENT

    // =====================

    const cartKey =

      `cart_${clientId}`;

    let cart =

      safeParse(safeStorageGet(cartKey), []) || [];

    // =====================

    // VÉRIFIER SI PRODUIT EXISTE

    // =====================

    const existing =

      cart.find(

        (item) =>

          String(item?._id) === productId

      );

    if (existing) {

      existing.quantity += 1;

    } else {

      cart.push({

        ...product,

        quantity: 1,

      });

    }

    // =====================

    // SAUVEGARDER LE PANIER

    // =====================

    safeStorageSet(

      cartKey,

      JSON.stringify(cart)

    );

    // =====================

    // COMPTEUR PANIER

    // =====================

    safeStorageSet(

      "cartCount",

      cart.length

    );

    // =====================

    // ACTUALISER L'INTERFACE

    // =====================

    window.dispatchEvent(

      new Event("cartUpdated")

    );

    // =====================

    // RETIRER DES FAVORIS

    // =====================

    await removeFavorite(

      product._id

    );

    // =====================

    // ALLER AU CHECKOUT

    // =====================

    navigate("/checkout");

  } catch (error) {

    console.log(

      "Erreur achat favori :",

      error

    );

  }

};

  // =========================

  // REMOVE FAVORITE

  // =========================

  const removeFavorite = async (productId) => {

  try {

    const safeProductId = String(productId || "");

    if (!isValidObjectId(safeProductId)) {

      toast.error("Produit invalide.");

      return;

    }
if (user?._id) {

      const userId = String(user._id);

      const favoriteProductId = safeProductId;

      if (!isValidObjectId(userId) || !isValidObjectId(favoriteProductId)) {

        throw new Error("Identifiant favori invalide.");

      }
await api.delete(

        `/api/favorites/${userId}/${favoriteProductId}`,

        getAuthConfig()

      );

    }

    const updatedFavorites =

      favorites.filter(

        (item) =>

          String(item?._id) !== safeProductId

      );

    setFavorites(updatedFavorites);

      // =====================

      // CLIENT ID

      // =====================

      const clientId =

        user?._id ||

        getStableGuestId();

      // =====================

      // FAVORITES KEY

      // =====================

      const favoritesKey =

        `favorites_${clientId}`;

      // =====================

      // SAVE LOCAL

      // =====================

      safeStorageSet(

        favoritesKey,

        JSON.stringify(

          updatedFavorites

        )

      );

      // =====================

      // UPDATE COUNT

      // =====================

      if (

        updatedFavorites.length <= 0

      ) {

        safeStorageRemove(

          "favoritesCount"

        );

      }

      else {

        safeStorageSet(

          "favoritesCount",

          updatedFavorites.length

        );

      }

      // =====================

      // UPDATE UI

      // =====================

      window.dispatchEvent(

        new Event(

          "favoritesUpdated"

        )

      );

    }

    catch (err) {

      console.log(err);

    }

  };
return (

    <div
      className="favorites-page"
      style={{

        minHeight: "100vh",

        background:

          "linear-gradient(180deg, color-mix(in srgb, var(--season-primary, #2563eb) 5%, white), #ffffff)",

        padding: "22px",

        fontFamily:

          "'Inter', sans-serif",

      }}

    >
      <style>{`
        .favorites-page {
          min-height: 100vh !important;
          min-height: 100svh !important;
          width: 100%;
          box-sizing: border-box;
          padding: clamp(12px, 3vw, 28px) !important;
          padding-bottom: max(20px, env(safe-area-inset-bottom)) !important;
          overflow-x: clip;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        .favorites-page *, .favorites-page *::before, .favorites-page *::after {
          box-sizing: border-box;
        }
        .favorites-page > div:first-of-type {
          min-width: 0;
          align-items: center;
        }
        .favorites-page h1 {
          font-size: clamp(23px, 4vw, 34px) !important;
          line-height: 1.15;
          flex-wrap: wrap;
          overflow-wrap: anywhere;
        }
        .favorites-page p, .favorites-page h3, .favorites-page h2 {
          overflow-wrap: anywhere;
        }
        .favorites-page > div[style*="grid"] {
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr)) !important;
          align-items: stretch;
          width: 100%;
        }
        .favorites-page > div[style*="grid"] > div {
          min-width: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          -webkit-tap-highlight-color: transparent;
        }
        .favorites-page > div[style*="grid"] > div > img {
          display: block;
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          touch-action: manipulation;
        }
        .favorites-page > div[style*="grid"] > div > div:last-child {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-width: 0;
        }
        .favorites-page > div[style*="grid"] > div > div:last-child > div {
          flex-wrap: wrap;
          align-items: stretch;
        }
        .favorites-page button {
          min-height: 44px;
          touch-action: manipulation;
          -webkit-appearance: none;
          appearance: none;
        }
        .favorites-page button:focus-visible,
        .favorites-page [role="button"]:focus-visible {
          outline: 3px solid color-mix(in srgb, var(--season-primary, #2563eb) 35%, transparent);
          outline-offset: 2px;
        }
        @media (hover: none), (pointer: coarse) {
          .favorites-page > div[style*="grid"] > div {
            transform: none !important;
          }
          .favorites-page img {
            transform: none !important;
          }
        }
        @media (max-width: 640px) {
          .favorites-page {
            padding: 14px !important;
          }
          .favorites-page > div:first-of-type {
            align-items: flex-start;
            margin-bottom: 20px !important;
            gap: 12px !important;
          }
          .favorites-page > div:first-of-type > div:last-child {
            max-width: 100%;
            align-self: flex-start;
          }
          .favorites-page > div[style*="grid"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          .favorites-page > div[style*="grid"] > div {
            border-radius: 15px !important;
          }
          .favorites-page > div[style*="grid"] > div > img {
            aspect-ratio: 1 / 1;
          }
          .favorites-page > div[style*="grid"] > div > div:last-child {
            padding: 11px !important;
          }
          .favorites-page h3 {
            font-size: 14px !important;
            line-height: 1.35;
          }
          .favorites-page > div[style*="grid"] p {
            font-size: 16px !important;
            margin-bottom: 0;
          }
          .favorites-page > div[style*="grid"] > div > div:last-child > div {
            gap: 6px !important;
          }
          .favorites-page > div[style*="grid"] button {
            min-width: 0;
            padding: 9px 7px !important;
            font-size: 10px !important;
          }
          .favorites-page > div[style*="grid"] button:last-child {
            flex: 0 0 40px !important;
            width: 40px !important;
          }
        }
        @media (max-width: 360px) {
          .favorites-page {
            padding: 10px !important;
          }
          .favorites-page > div[style*="grid"] {
            gap: 9px !important;
          }
          .favorites-page > div[style*="grid"] > div > div:last-child {
            padding: 9px !important;
          }
          .favorites-page > div[style*="grid"] > div > div:last-child > div {
            gap: 5px !important;
          }
          .favorites-page > div[style*="grid"] button {
            font-size: 9px !important;
            padding: 8px 5px !important;
          }
          .favorites-page > div[style*="grid"] button:last-child {
            flex-basis: 36px !important;
            width: 36px !important;
          }
        }
        @media (max-width: 300px) {
          .favorites-page > div[style*="grid"] {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .favorites-page > div[style*="grid"] {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .favorites-page *, .favorites-page *::before, .favorites-page *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* HEADER */}

      <div

        style={{

          display: "flex",

          justifyContent:

            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "15px",

          marginBottom: "28px",

        }}

      >

        <div>

          <h1

            style={{

              fontSize: "34px",

              fontWeight: "900",

              margin: 0,

              color: "#111827",

              display: "flex",

              alignItems: "center",

              gap: "10px",

            }}

          >

            <FaHeart color="var(--season-primary, #2563eb)" />

            Mes Favoris

          </h1>

          <p

            style={{

              color: "#6b7280",

              marginTop: "6px",

              fontSize: "14px",

            }}

          >

            Retrouvez rapidement

            vos produits préférés

          </p>

        </div>

        {/* TOTAL PRODUITS */}

        <div

          style={{

            background:

              "linear-gradient(135deg, var(--season-primary, #2563eb), var(--season-secondary, #3b82f6))",

            color: "white",

            padding: "10px 16px",

            borderRadius: "14px",

            fontWeight: "700",

            fontSize: "13px",

            boxShadow:

              "0 8px 18px color-mix(in srgb, var(--season-primary, #2563eb) 20%, transparent)",

            display: "flex",

            alignItems: "center",

            gap: "8px",

          }}

        >

          <FaBoxOpen />

          {favorites.length}

          {" "}produit(s)

        </div>

      </div>

      {/* LOADING */}

      {loading ? (

        <div

          style={{

            textAlign: "center",

            marginTop: "100px",

            fontSize: "18px",

            color: "#6b7280",

          }}

        >

          Chargement...

        </div>

      ) : favorites.length === 0 ? (

        // EMPTY STATE

        <div

          style={{

            background: "#fff",

            borderRadius: "28px",

            padding: "70px 20px",

            textAlign: "center",

            boxShadow:

              "0 12px 35px rgba(0,0,0,0.06)",

          }}

        >

          <div

            style={{

              fontSize: "80px",

              color: "var(--season-primary, #2563eb)",

            }}

          >

            <FaHeart />

          </div>

          <h2

            style={{

              marginTop: "18px",

              fontSize: "28px",

              color: "#111827",

              fontWeight: "800",

            }}

          >

            Aucun favori

          </h2>

          <p

            style={{

              marginTop: "10px",

              color: "#6b7280",

              fontSize: "15px",

            }}

          >

            Les produits que vous aimez

            apparaîtront ici.

          </p>

          <button

            onClick={() =>

              navigate("/boutique")

            }

            style={{

              marginTop: "24px",

              background:

                "linear-gradient(135deg, var(--season-primary, #2563eb), var(--season-secondary, #3b82f6))",

              color: "white",

              border: "none",

              padding: "13px 26px",

              borderRadius: "14px",

              fontWeight: "800",

              cursor: "pointer",

              fontSize: "14px",

              boxShadow:

                "0 10px 22px rgba(34,197,94,0.22)",

              transition:

                "0.3s ease",

            }}

          >

            Découvrir les produits

          </button>

        </div>

      ) : (

        // PRODUCTS GRID

        <div

          style={{

            display: "grid",

            gridTemplateColumns:

              "repeat(auto-fill,minmax(220px,1fr))",

            gap: "18px",

          }}

        >

          {favorites.map(

            (product, index) => (

              <div

                key={product?._id || index}

                style={{

                  background: "#fff",

                  borderRadius: "20px",

                  overflow: "hidden",

                  boxShadow:

                    "0 10px 25px rgba(0,0,0,0.05)",

                  transition:

                    "0.3s ease",

                  position: "relative",

                  cursor: "pointer",

                }}

                onMouseEnter={(e) => {

                  e.currentTarget.style.transform =

                    "translateY(-5px)";

                  e.currentTarget.style.boxShadow =

                    "0 18px 35px rgba(0,0,0,0.10)";

                }}

                onMouseLeave={(e) => {

                  e.currentTarget.style.transform =

                    "translateY(0px)";

                  e.currentTarget.style.boxShadow =

                    "0 10px 25px rgba(0,0,0,0.05)";

                }}

              >

                {/* FAVORITE BADGE */}

                <div

                  style={{

                    position: "absolute",

                    top: "12px",

                    right: "12px",

                    width: "36px",

                    height: "36px",

                    borderRadius: "50%",

                    background:

                      "rgba(255,255,255,0.96)",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    fontSize: "15px",

                    cursor: "pointer",

                    boxShadow:

                      "0 4px 12px rgba(0,0,0,0.08)",

                    color: "var(--season-primary, #2563eb)",

                    zIndex: 10,

                  }}

                  onClick={() =>

                    removeFavorite(

                      product._id

                    )

                  }

                >

                  <FaHeart />

                </div>

                {/* IMAGE */}

                <img

  src={product.image}

   alt=""

  onClick={() =>

    navigate(

      `/product/${product._id}`

    )

  }

  style={{

    width: "100%",

    height: "200px",

    objectFit: "cover",

    cursor: "pointer",

    transition:

      "0.3s ease",

  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =

      "scale(1.05)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =

      "scale(1)";

  }}

/>

                {/* CONTENT */}

                <div

                  style={{

                    padding: "14px",

                  }}

                >

                  <h3

                    style={{

                      fontSize: "17px",

                      fontWeight: "800",

                      color: "#111827",

                      margin: 0,

                    }}

                  >

                    {product.name}

                  </h3>

                  <p

                    style={{

                      marginTop: "8px",

                      color: "var(--season-primary, #2563eb)",

                      fontWeight: "900",

                      fontSize: "18px",

                    }}

                  >

                    {product.price}

                    {" "}FCFA

                  </p>

                  {/* BUTTONS */}

                  <div

                    style={{

                      display: "flex",

                      gap: "8px",

                      marginTop: "14px",

                    }}

                  >

                    {/* ADD TO CART */}

                    <button

  onClick={async () => {

    await addToCart(product);

    removeFavorite(

      product._id

    );

  }}

  style={{

    flex: 1,

    background:

      "linear-gradient(135deg,#111827,#1f2937)",

    color: "white",

    border: "none",

    padding: "10px 12px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "800",

    fontSize: "11px",

    boxShadow:

      "0 6px 15px rgba(0,0,0,0.10)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "6px",

    transition:

      "all 0.3s ease",

    transform:

      "translateY(0px)",

  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =

      "translateY(-2px)";

    e.currentTarget.style.boxShadow =

      "0 10px 20px rgba(0,0,0,0.18)";

    e.currentTarget.style.opacity =

      "0.92";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =

      "translateY(0px)";

    e.currentTarget.style.boxShadow =

      "0 6px 15px rgba(0,0,0,0.10)";

    e.currentTarget.style.opacity =

      "1";

  }}

>

  <FaShoppingCart

    style={{

      fontSize: "13px"

    }}

  />

  Ajouter

</button>

                    {/* BUY NOW */}

             <button

  onClick={() =>

    buyNow(product)

  }

  style={{

    flex: 1,

    background:

      "linear-gradient(135deg, var(--season-primary, #2563eb), var(--season-secondary, #3b82f6))",

    color: "white",

    border: "none",

    padding: "10px 12px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "800",

    fontSize: "11px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "6px",

    boxShadow:

      "0 6px 15px color-mix(in srgb, var(--season-primary, #2563eb) 22%, transparent)",

    transition:

      "all 0.3s ease",

    transform:

      "translateY(0px)",

  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =

      "translateY(-2px)";

    e.currentTarget.style.boxShadow =

      "0 10px 22px color-mix(in srgb, var(--season-primary, #2563eb) 32%, transparent)";

    e.currentTarget.style.opacity =

      "0.94";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =

      "translateY(0px)";

    e.currentTarget.style.boxShadow =

      "0 6px 15px color-mix(in srgb, var(--season-primary, #2563eb) 22%, transparent)";

    e.currentTarget.style.opacity =

      "1";

  }}

>

  <FaBolt

    style={{

      fontSize: "13px"

    }}

  />

  Acheter

</button>

{/* DELETE */}

<button

  onClick={() =>

    removeFavorite(

      product._id

    )

  }

  style={{

    width: "42px",

    background:

      "color-mix(in srgb, var(--season-primary, #2563eb) 8%, white)",

    color: "var(--season-primary, #2563eb)",

    border: "none",

    borderRadius: "12px",

    cursor: "pointer",

    fontSize: "15px",

    fontWeight: "700",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    transition:

      "all 0.3s ease",

    boxShadow:

      "0 4px 10px color-mix(in srgb, var(--season-primary, #2563eb) 8%, transparent)",

  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =

      "translateY(-2px) scale(1.05)";

    e.currentTarget.style.background =

      "var(--season-primary, #2563eb)";

    e.currentTarget.style.color =

      "white";

    e.currentTarget.style.boxShadow =

      "0 8px 18px color-mix(in srgb, var(--season-primary, #2563eb) 22%, transparent)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =

      "translateY(0px) scale(1)";

    e.currentTarget.style.background =

      "color-mix(in srgb, var(--season-primary, #2563eb) 8%, white)";

    e.currentTarget.style.color =

      "var(--season-primary, #2563eb)";

    e.currentTarget.style.boxShadow =

      "0 4px 10px color-mix(in srgb, var(--season-primary, #2563eb) 8%, transparent)";

  }}

>

  <FaTrash />

</button>

                  </div>

                </div>

              </div>

            )

          )}

        </div>

      )}

    </div>

  );

}

export default Favorites;
