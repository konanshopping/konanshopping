import { useState, useRef } from "react";



import axios from "axios";



import {

  FaRobot,

  FaPaperPlane,

  FaComments,

  FaUser,

  FaSpinner,

} from "react-icons/fa";



// ======================================================

// 🔐 SÉCURITÉ CLIENT

// Compatible avec le backend actuel : POST /ai-chat

// ======================================================



const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;



const MAX_MESSAGE_LENGTH = 2000;

const MAX_HISTORY_ITEMS = 20;

const MAX_HISTORY_MESSAGE_LENGTH = 2000;

const MAX_PAGE_LENGTH = 300;



const sanitizeText = (value, maxLength) => {

  if (typeof value !== "string") return "";



  return value

    .replace(/\u0000/g, "")

    .trim()

    .slice(0, maxLength);

};



const normalizeHistory = (history) => {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-MAX_HISTORY_ITEMS)
    .map((message) => {
      if (!message || typeof message !== "object") return null;

      const role =
        message.sender === "user" || message.role === "user"
          ? "user"
          : message.sender === "ai" || message.role === "ai"
            ? "ai"
            : "";

      const text = sanitizeText(message.text, MAX_HISTORY_MESSAGE_LENGTH);
      if (!role || !text) return null;

      return {
        role,
        text,
        products: Array.isArray(message.products)
          ? message.products.slice(0, 12).map((product) => ({
              _id: sanitizeText(product?._id, 100),
            }))
          : [],
      };
    })
    .filter(Boolean);
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
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getGuestId = () => {
  const existing = sanitizeText(safeStorageGet("guestId"), 100);
  if (existing) return existing;

  const generated = `guest_${(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2)}`
  )}`;
  safeStorageSet("guestId", generated);
  return generated;
};

const getClientId = () => {
  const storedUser = safeParse(safeStorageGet("user"), null);
  return sanitizeText(storedUser?._id, 100) || getGuestId();
};

const normalizeProducts = (value) =>
  Array.isArray(value)
    ? value
        .filter((product) =>
          product &&
          typeof product === "object" &&
          typeof product._id === "string" &&
          product._id.length > 0
        )
        .slice(0, 12)
    : [];

// ======================================================
// 🔐 AUTHENTIFICATION PAR COOKIE HTTPONLY
// ======================================================
// Le JWT n'est plus lu depuis localStorage.
// Le navigateur envoie automatiquement le cookie HttpOnly.
// La logique de Konan IA reste inchangée.
// ======================================================

axios.defaults.withCredentials = true;

const getSafeServerMessage = (error) => {

  const status =

    error?.response?.status;



  if (status === 400) {

    return "Votre message est invalide ou trop long.";

  }



  if (status === 401) {

    return "Authentification invalide.";

  }



  if (status === 403) {

    return "Accès refusé.";

  }



  if (status === 429) {

    return "Trop de demandes. Veuillez patienter quelques instants.";

  }



  if (error?.code === "ECONNABORTED") {

    return "Le serveur IA met trop de temps à répondre.";

  }



  if (!error?.response) {

    return "Impossible de contacter le serveur IA.";

  }



  return "Erreur serveur IA ❌";

};



const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config) return config;

    config.withCredentials = true;
    config.headers = config.headers || {};
    config.headers.Accept = "application/json";

    return config;
  },
  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(

  (response) => response,



  (error) => {

    // Nettoyage d'un token manifestement refusé.

    // Cela ne modifie pas la logique de Konan IA.

    if (

      error?.response?.status === 401 ||

      error?.response?.status === 403

    ) {

      try {

        localStorage.removeItem("token");

      } catch {

        // Ne jamais bloquer le chat.

      }

    }



    return Promise.reject(error);

  }

);



function Messages() {

  const requestInProgress = useRef(false);
  const [products, setProducts] = useState([]);
  const [pendingRedirect, setPendingRedirect] = useState("");



  const [input, setInput] =

    useState("");



  const [loading, setLoading] =

    useState(false);



  const [messages, setMessages] =

    useState([



      {

        sender: "ai",



        text:

          "Bonjour 👋 Je suis Konan IA. Comment puis-je vous aider aujourd'hui ?",

      },



    ]);





    // ======================================================
  // ACTIONS PANIER / FAVORIS
  // L'identité réelle est toujours vérifiée par le backend.
  // ======================================================

  const addProductToCart = async (product) => {
    const clientId = getClientId();
    const cartKey = `cart_${clientId}`;
    const savedCart = safeParse(safeStorageGet(cartKey), []);
    const cart = Array.isArray(savedCart) ? savedCart : [];
    const exists = cart.some((item) => String(item?._id) === String(product._id));
    const updated = exists
      ? cart.map((item) => String(item?._id) === String(product._id)
          ? { ...item, quantity: Math.min(99, Math.max(1, Number(item.quantity) || 1) + 1) }
          : item)
      : [...cart, { ...product, quantity: 1 }].slice(0, 100);

    safeStorageSet(cartKey, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart: updated, clientId } }));

    const storedUser = safeParse(safeStorageGet("user"), null);
    if (storedUser?._id) {
      await api.post("/api/cart", { productId: product._id, quantity: 1 });
    }
  };

  const addProductToFavorites = async (product) => {
    const clientId = getClientId();
    const favoritesKey = `favorites_${clientId}`;
    const savedFavorites = safeParse(safeStorageGet(favoritesKey), []);
    const favorites = Array.isArray(savedFavorites) ? savedFavorites : [];
    const exists = favorites.some((item) => String(item?._id || item) === String(product._id));

    if (!exists) {
      const updated = [...favorites, product].slice(0, 200);
      safeStorageSet(favoritesKey, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { favorites: updated, clientId } }));
    }

    const storedUser = safeParse(safeStorageGet("user"), null);
    if (storedUser?._id) {
      await api.post("/api/favorites", { productId: product._id });
    }
  };

  const executeAssistantAction = async (action, recommendedProducts) => {
    if (!action || typeof action !== "object") return;

    if (action.type === "navigate") {
      if (["/checkout", "/favorites"].includes(action.destination)) {
        setPendingRedirect(action.destination);
      }
      return;
    }

    if (!["add_to_cart", "add_to_favorites"].includes(action.type)) return;

    const productId = sanitizeText(action.productId, 100);
    const product =
      recommendedProducts.find((item) => String(item._id) === productId) ||
      (action.product && String(action.product._id) === productId ? action.product : null);

    if (!product || !productId) return;

    if (action.type === "add_to_cart") {
      await addProductToCart(product);
      setPendingRedirect("/checkout");
      setMessages((prev) => [...prev, {
        sender: "ai",
        text: `${product.name} a été ajouté à votre panier. Voulez-vous ouvrir votre panier ?`,
      }].slice(-42));
    } else {
      await addProductToFavorites(product);
      setPendingRedirect("/favorites");
      setMessages((prev) => [...prev, {
        sender: "ai",
        text: `${product.name} a été ajouté à vos favoris. Voulez-vous voir vos favoris ?`,
      }].slice(-42));
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async () => {
    const currentInput = sanitizeText(input, MAX_MESSAGE_LENGTH);
    if (!currentInput || loading || requestInProgress.current) return;

    requestInProgress.current = true;
    const userMessage = { sender: "user", text: currentInput };
    const currentHistory = normalizeHistory(messages);

    setMessages((prev) => [...prev, userMessage].slice(-42));
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/ai-chat", {
        message: currentInput,
        currentPage: sanitizeText(window.location.pathname, MAX_PAGE_LENGTH),
        history: currentHistory,
      });

      const reply = typeof res?.data?.reply === "string"
        ? sanitizeText(res.data.reply, MAX_HISTORY_MESSAGE_LENGTH)
        : "";

      const recommendedProducts = normalizeProducts(
        res?.data?.products || res?.data?.recommendations || []
      );

      const aiMessage = {
        sender: "ai",
        text: reply || "Je n'ai pas trouvé de réponse.",
        products: recommendedProducts,
      };

      setMessages((prev) => [...prev, aiMessage].slice(-42));

      if (res?.data?.action) {
        try {
          await executeAssistantAction(res.data.action, recommendedProducts);
        } catch (actionError) {
          console.error("Action Konan IA non exécutée :", actionError?.response?.status || "API");
          setMessages((prev) => [...prev, {
            sender: "ai",
            text: "Je n'ai pas pu terminer cette action. Vous pouvez réessayer depuis la boutique.",
          }].slice(-42));
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, {
        sender: "ai",
        text: getSafeServerMessage(error),
      }].slice(-42));
    } finally {
      requestInProgress.current = false;
      setLoading(false);
    }
  };

  return (



    <div

      style={{

        minHeight: "100vh",

        background: "#F5F7FB",

        display: "flex",

        flexDirection: "column",

      }}

    >



      {/* HEADER */}



      <div

        style={{

          background:

            "linear-gradient(135deg,#4F46E5,#7C3AED)",



          padding: "16px 18px",



          display: "flex",



          alignItems: "center",



          gap: "12px",



          color: "#FFFFFF",



          boxShadow:

            "0 4px 20px rgba(79,70,229,0.15)",

        }}

      >



        <div

          style={{

            width: "44px",

            height: "44px",



            borderRadius: "14px",



            background:

              "rgba(255,255,255,0.15)",



            display: "flex",

            justifyContent: "center",

            alignItems: "center",



            backdropFilter:

              "blur(10px)",

          }}

        >



          <FaRobot

            style={{

              fontSize: "20px",

            }}

          />



        </div>



        <div>



          <h1

            style={{

              margin: 0,

              fontSize: "18px",

              fontWeight: "800",

            }}

          >

            Konan IA

          </h1>



          <p

            style={{

              margin:

                "2px 0 0 0",

              fontSize: "12px",

              opacity: 0.9,

            }}

          >

            Assistant intelligent

          </p>



        </div>



      </div>





      {/* CHAT */}



      <div

        style={{

          flex: 1,



          padding: "14px",



          display: "flex",



          flexDirection:

            "column",



          gap: "14px",



          overflowY: "auto",

        }}

      >



        {messages.map(

          (msg, index) => (



            <div

              key={index}

              style={{

                display: "flex",



                justifyContent:

                  msg.sender ===

                  "user"

                    ? "flex-end"

                    : "flex-start",

              }}

            >



              <div

                style={{

                  display: "flex",



                  alignItems:

                    "flex-end",



                  gap: "8px",



                  maxWidth: "90%",

                }}

              >



                {msg.sender ===

                  "ai" && (



                  <div

                    style={{

                      width: "34px",

                      height: "34px",



                      borderRadius:

                        "12px",



                      background:

                        "#EEF2FF",



                      display: "flex",



                      justifyContent:

                        "center",



                      alignItems:

                        "center",



                      color:

                        "#4F46E5",



                      flexShrink: 0,

                    }}

                  >



                    <FaRobot />



                  </div>



                )}



                <div

                  style={{

                    maxWidth: "100%",



                    padding:

                      "12px 14px",



                    borderRadius:

                      "18px",



                    background:

                      msg.sender ===

                      "user"



                        ? "linear-gradient(135deg,#4F46E5,#7C3AED)"



                        : "#FFFFFF",



                    color:

                      msg.sender ===

                      "user"



                        ? "#FFFFFF"



                        : "#111827",



                    fontSize: "14px",



                    lineHeight: "1.6",



                    boxShadow:

                      "0 4px 15px rgba(0,0,0,0.05)",



                    border:

                      msg.sender ===

                      "ai"



                        ? "1px solid #E5E7EB"



                        : "none",

                  }}

                >

                  {msg.text}
                  {Array.isArray(msg.products) && msg.products.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "10px", marginTop: "12px" }}>
                      {msg.products.slice(0, 8).map((product) => (
                        <div key={product._id} style={{ border: "1px solid #E5E7EB", borderRadius: "12px", padding: "9px", background: "#FFFFFF", color: "#111827", minWidth: 0 }}>
                          {product.image && <img src={product.image} alt={sanitizeText(product.name, 120)} loading="lazy" referrerPolicy="no-referrer" style={{ width: "100%", height: "105px", objectFit: "cover", borderRadius: "8px" }} />}
                          <div style={{ fontWeight: 800, fontSize: "12px", marginTop: "7px" }}>{sanitizeText(product.name, 120)}</div>
                          <div style={{ color: "#4F46E5", fontWeight: 800, fontSize: "12px", marginTop: "4px" }}>{Number(product.price || 0).toLocaleString("fr-FR")} FCFA</div>
                          <button type="button" onClick={() => { window.location.href = `/product/${encodeURIComponent(product._id)}`; }} style={{ width: "100%", marginTop: "8px", border: 0, borderRadius: "8px", padding: "8px", color: "#FFFFFF", background: "#4F46E5", fontWeight: 700, cursor: "pointer" }}>Voir le produit</button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>



                {msg.sender ===

                  "user" && (



                  <div

                    style={{

                      width: "34px",

                      height: "34px",



                      borderRadius:

                        "12px",



                      background:

                        "#EDE9FE",



                      display: "flex",



                      justifyContent:

                        "center",



                      alignItems:

                        "center",



                      color:

                        "#5B3CC4",



                      flexShrink: 0,

                    }}

                  >



                    <FaUser />



                  </div>



                )}



              </div>



            </div>



          )

        )}





        {/* LOADING */}



        {loading && (



          <div

            style={{

              display: "flex",

              justifyContent:

                "flex-start",

            }}

          >



            <div

              style={{

                display: "flex",



                alignItems:

                  "center",



                gap: "8px",



                background:

                  "#FFFFFF",



                padding:

                  "12px 16px",



                borderRadius:

                  "16px",



                border:

                  "1px solid #E5E7EB",



                color:

                  "#6B7280",



                fontSize: "14px",

              }}

            >



              <FaRobot

                style={{

                  color:

                    "#4F46E5",

                }}

              />



              Konan IA réfléchit...



            </div>



          </div>



        )}



      </div>





      {pendingRedirect && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", padding: "8px 14px", background: "#F5F7FB" }}>
          <button type="button" onClick={() => { const destination = pendingRedirect; setPendingRedirect(""); window.location.href = destination; }} style={{ border: 0, borderRadius: "10px", padding: "10px 16px", background: "#4F46E5", color: "#FFFFFF", fontWeight: 800, cursor: "pointer" }}>
            {pendingRedirect === "/checkout" ? "Ouvrir mon panier" : "Voir mes favoris"}
          </button>
          <button type="button" onClick={() => setPendingRedirect("")} style={{ border: "1px solid #D1D5DB", borderRadius: "10px", padding: "10px 16px", background: "#FFFFFF", color: "#374151", fontWeight: 700, cursor: "pointer" }}>Continuer</button>
        </div>
      )}

      {/* INPUT */}



      <div

        style={{

          padding: "14px",



          background:

            "#FFFFFF",



          borderTop:

            "1px solid #E5E7EB",



          boxShadow:

            "0 -4px 20px rgba(0,0,0,0.04)",

        }}

      >



        <div

          style={{

            display: "flex",



            alignItems:

              "center",



            gap: "10px",



            background:

              "#F8FAFC",



            border:

              "1px solid #E5E7EB",



            borderRadius:

              "18px",



            padding: "8px",

          }}

        >



          <input

            type="text"



            placeholder=

              "Posez votre question à Konan IA..."



            value={input}



            onChange={(e) =>

              setInput(

                e.target.value

              )

            }



            onKeyDown={(e) => {



              if (

                e.key ===

                "Enter"

              ) {



                sendMessage();



              }



            }}



            maxLength={

              MAX_MESSAGE_LENGTH

            }



            style={{

              flex: 1,



              border: "none",



              outline: "none",



              background:

                "transparent",



              padding:

                "10px 12px",



              fontSize: "14px",



              color:

                "#111827",

            }}

          />



          <button

            type="button"



            onClick={

              sendMessage

            }



            disabled={loading}



            aria-label=

              "Envoyer le message"



            style={{

              width: "46px",



              height: "46px",



              border: "none",



              borderRadius:

                "14px",



              background:

                loading

                  ? "#9CA3AF"

                  : "linear-gradient(135deg,#4F46E5,#7C3AED)",



              color: "#FFFFFF",



              cursor:

                loading

                  ? "not-allowed"

                  : "pointer",



              display: "flex",



              justifyContent:

                "center",



              alignItems:

                "center",



              boxShadow:

                "0 6px 18px rgba(79,70,229,0.25)",



              transition:

                "all .25s ease",



              opacity:

                loading ? 0.7 : 1,

            }}

          >



            {loading ? (



              <FaSpinner

                style={{

                  fontSize: "16px",

                  animation:

                    "spin 1s linear infinite",

                }}

              />



            ) : (



              <FaPaperPlane

                style={{

                  fontSize:

                    "16px",

                }}

              />



            )}



          </button>



        </div>



      </div>



    </div>



  );



}



export default Messages;