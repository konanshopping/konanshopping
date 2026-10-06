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



const getStoredUser = () =>

  safeParse(localStorage.getItem("user"), null);



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

      localStorage.removeItem("user");

      localStorage.removeItem("token");

      localStorage.removeItem("userToken");

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



  return (

    error?.response?.data?.message ||

    "Une erreur est survenue."

  );

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

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        localStorage.removeItem("userToken");

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







  const savedFavorites =



    safeParse(localStorage.getItem("favorites"), []) || [];







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







      const user = getStoredUser();







      const clientId =







        user?._id ||







        localStorage.getItem(



          "guestId"



        );







      const favoritesKey =



        `favorites_${clientId}`;







      const updatedFavorites =







        safeParse(localStorage.getItem(favoritesKey), []) || [];







      setFavorites(



        updatedFavorites



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







        localStorage.removeItem(



          "checkoutProduct"



        );







        const user = getStoredUser();







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







          safeParse(localStorage.getItem(clientCartKey), []) || [];







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







      localStorage.getItem(



        "guestId"



      ) ||







      (() => {







        const newGuestId =



          "guest_" + Date.now();







        localStorage.setItem(



          "guestId",



          newGuestId



        );







        return newGuestId;







      })();







    // =====================



    // PANIER CLIENT



    // =====================







    const cartKey =



      `cart_${clientId}`;







    let cart =



      safeParse(localStorage.getItem(cartKey), []) || [];







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







    localStorage.setItem(



      cartKey,



      JSON.stringify(cart)



    );







    // =====================



    // COMPTEUR PANIER



    // =====================







    localStorage.setItem(



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



    console.log("user =", user);







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







  console.log(



  "favorites =",



  favorites



);







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







  onClick={() =>



    buyNow(product)



  }







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