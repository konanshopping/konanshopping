import {
  useState,
  useEffect
} from "react";

import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
  FaBoxOpen
} from "react-icons/fa";

import {
  FaBolt
} from "react-icons/fa";

function Favorites() {

  const navigate =
    useNavigate();

  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  useEffect(() => {

    // ======================
    // CLIENT CONNECTÉ
    // ======================

    if (user?._id) {

      axios
        .get(
          `http://localhost:5000/favorites/${user._id}`
        )

        .then((res) => {

          setFavorites(res.data);

        })

        .catch((err) => {

          console.log(err);

        })

        .finally(() => {

          setLoading(false);

        });

    }

    // ======================
    // CLIENT NON CONNECTÉ
    // ======================

    else {

      const savedFavorites =
        JSON.parse(
          localStorage.getItem(
            "favorites"
          )
        ) || [];

      setFavorites(savedFavorites);

      setLoading(false);

    }

  }, []);

  // =========================
  // FAVORITES COUNT
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "favoritesCount",
      favorites.length
    );

  }, [favorites]);

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

      const updatedFavorites =

        JSON.parse(
          localStorage.getItem(
            favoritesKey
          )
        ) || [];

      setFavorites(
        updatedFavorites
      );

    };

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

        localStorage.removeItem(
          "checkoutProduct"
        );

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

        const clientCartKey =
          `cart_${clientId}`;

        let clientCart =

          JSON.parse(
            localStorage.getItem(
              clientCartKey
            )
          ) || [];

        // =====================
        // VERIFIER EXISTE
        // =====================

        const alreadyExists =

          clientCart.find(
            (item) =>
              item._id === product._id
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

          localStorage.setItem(

            clientCartKey,

            JSON.stringify(
              clientCart
            )

          );

        }

        // =====================
        // UPDATE COUNT
        // =====================

        localStorage.setItem(

          "cartCount",

          clientCart.length

        );

        // =====================
        // EVENT UPDATE
        // =====================

        window.dispatchEvent(
          new Event("cartUpdated")
        );

        alert(
          "✅ Produit ajouté au panier"
        );

      }

      catch (err) {

        console.log(err);

      }

    };

  // =========================
  // REMOVE FAVORITE
  // =========================

  const removeFavorite =
  async (productId) => {

    try {

      await axios.delete(

        `http://localhost:5000/favorites/${user._id}/${productId}`

      );

      const updatedFavorites =
        favorites.filter(
          (item) =>
            item._id !== productId
        );

      // UPDATE STATE

      setFavorites(
        updatedFavorites
      );

      // =====================
      // CLIENT ID
      // =====================

      const clientId =

        user?._id ||

        localStorage.getItem(
          "guestId"
        );

      // =====================
      // FAVORITES KEY
      // =====================

      const favoritesKey =
        `favorites_${clientId}`;

      // =====================
      // SAVE LOCAL
      // =====================

      localStorage.setItem(

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

        localStorage.removeItem(
          "favoritesCount"
        );

      }

      else {

        localStorage.setItem(

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
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(180deg,#f8fafc,#ffffff)",

        padding: "22px",

        fontFamily:
          "'Inter', sans-serif",
      }}
    >

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

            <FaHeart color="#2563eb" />

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
              "linear-gradient(135deg,#2563eb,#3b82f6)",

            color: "white",

            padding: "10px 16px",

            borderRadius: "14px",

            fontWeight: "700",

            fontSize: "13px",

            boxShadow:
              "0 8px 18px rgba(37,99,235,0.20)",

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

              color: "#2563eb",
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
                "linear-gradient(135deg,#16a34a,#22c55e)",

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
                key={index}

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

                    color: "#2563eb",

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

                      color: "#2563eb",

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

  onClick={() => {

    localStorage.setItem(

      "checkoutProduct",

      JSON.stringify({

        ...product,

        quantity: 1

      })

    );

    removeFavorite(
      product._id
    );

    navigate("/checkout");

  }}

  style={{

    flex: 1,

    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",

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
      "0 6px 15px rgba(37,99,235,0.22)",

    transition:
      "all 0.3s ease",

    transform:
      "translateY(0px)",

  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-2px)";

    e.currentTarget.style.boxShadow =
      "0 10px 22px rgba(37,99,235,0.32)";

    e.currentTarget.style.opacity =
      "0.94";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)";

    e.currentTarget.style.boxShadow =
      "0 6px 15px rgba(37,99,235,0.22)";

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
      "#eff6ff",

    color: "#2563eb",

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
      "0 4px 10px rgba(37,99,235,0.08)",
  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-2px) scale(1.05)";

    e.currentTarget.style.background =
      "#2563eb";

    e.currentTarget.style.color =
      "white";

    e.currentTarget.style.boxShadow =
      "0 8px 18px rgba(37,99,235,0.22)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px) scale(1)";

    e.currentTarget.style.background =
      "#eff6ff";

    e.currentTarget.style.color =
      "#2563eb";

    e.currentTarget.style.boxShadow =
      "0 4px 10px rgba(37,99,235,0.08)";

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