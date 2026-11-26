import React, {
  useState,
  useEffect,
  useRef
} from "react";

import axios from "axios";
import { FaHeart } from "react-icons/fa";

import { Link } from "react-router-dom";

import {

  FaRobot,

  FaMicrophone,

  FaHome,

  FaShoppingCart,

  FaUser,

  FaStore,

  FaSearch,

  FaStar

} from "react-icons/fa";

import {

FaBrain,

FaGem,

FaBolt,

FaBullseye,

FaChartLine,

FaGlobeAfrica,

FaSpinner,

FaCheck

} from "react-icons/fa";

import {

FaEye,

FaTag

} from "react-icons/fa";

const API_BASE_URL = "https://konanshopping.com";

const API_TIMEOUT = 15000;

const AI_TIMEOUT = 30000;

const MAX_MESSAGE_LENGTH = 1000;

const MAX_HISTORY_MESSAGES = 30;

const MAX_HISTORY_TEXT_LENGTH = 2000;

const MAX_CART_ITEMS = 100;

const safeParse = (value, fallback = null) => {

  try {

    return value ? JSON.parse(value) : fallback;

  } catch {

    return fallback;

  }

};

// Stockage local tolérant aux restrictions de confidentialité du navigateur.
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

const safeStorageRemove = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Le site reste utilisable même si le stockage est bloqué.
  }
};

const getGuestId = () => {
  const existing = normalizeText(safeStorageGet("guestId"), 100);
  if (existing) return existing;

  const generated = `guest_${(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2)}`
  )}`;
  safeStorageSet("guestId", generated);
  return generated;
};

const getCurrentClientId = () => {
  const storedUser = safeParse(safeStorageGet("user"), null);
  return normalizeText(storedUser?._id, 100) || getGuestId();
};

const normalizeText = (value, maxLength) =>

  typeof value === "string"

    ? value.trim().slice(0, maxLength)

    : "";

const isValidProduct = (product) =>

  Boolean(

    product &&

      typeof product === "object" &&

      typeof product._id === "string" &&

      product._id.length > 0

  );

const normalizeProductList = (value) =>

  Array.isArray(value)

    ? value.filter(isValidProduct).slice(0, 100)

    : [];

const normalizeHistory = (value) =>

  Array.isArray(value)

    ? value

        .filter(

          (item) =>

            item &&

            (item.role === "user" || item.role === "ai") &&

            typeof item.text === "string"

        )

        .slice(-MAX_HISTORY_MESSAGES)

        .map((item) => ({

          role: item.role,

          text: normalizeText(item.text, MAX_HISTORY_TEXT_LENGTH),

          products: normalizeProductList(item.products).slice(0, 12).map((product) => ({ _id: product._id }))

        }))

    : [];

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest"
  }
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.headers = config.headers || {};
  config.headers.Accept = "application/json";
  return config;
});

const normalizeCart = (items) =>

  Array.isArray(items)

    ? items

        .filter(isValidProduct)

        .slice(0, MAX_CART_ITEMS)

        .map((item) => ({

          ...item,

          quantity:

            Number.isFinite(Number(item.quantity)) &&

            Number(item.quantity) > 0

              ? Math.min(Math.floor(Number(item.quantity)), 99)

              : 1

        }))

    : [];

function AiMode() {

const requestInProgress = useRef(false);

const [adding,setAdding] =

useState(null);

const [hover,setHover] =

useState(false);

const [showFooter, setShowFooter] =

useState(true);

useEffect(() => {

let timer;

const handleInteraction = () => {

setShowFooter(true);

clearTimeout(timer);

timer = setTimeout(() => {

setShowFooter(false);

}, 3000);

};

window.addEventListener(

"click",

handleInteraction

);

window.addEventListener(

"touchstart",

handleInteraction

);

handleInteraction();

return () => {

window.removeEventListener(

"click",

handleInteraction

);

window.removeEventListener(

"touchstart",

handleInteraction

);

};

}, []);

const user = safeParse(safeStorageGet("user"), null);

const userId = user?._id;

const [listening,setListening] =

useState(false);

const [thinking,setThinking] =

useState(false);

const [pulse,setPulse] =

useState(false);

const [products,setProducts] =

useState([]);

const [favoriteIds, setFavoriteIds] = useState(() => {
  const clientId = getCurrentClientId();
  const saved = normalizeProductList(
    safeParse(safeStorageGet(`favorites_${clientId}`), [])
  );
  return saved.map((item) => String(item._id));
});

const [favoriteNotice, setFavoriteNotice] = useState("");

const [reply,setReply] =

useState("");

const [featuredProducts,

setFeaturedProducts] =

useState([]);

const [inputText, setInputText] = useState("");
const [pendingRedirect, setPendingRedirect] = useState(null);

useEffect(() => {

const loadProducts =

async () => {

try {

const res =

await api.get("/api/products");

setFeaturedProducts(normalizeProductList(res.data).slice(0, 8));

}

catch(err){

console.error("Erreur AiMode :", err?.response?.status || "API");

}

};

loadProducts();

}, []);

const [messages,setMessages] =

useState([

{

role:"ai",

text:

"👋 Bonjour, je suis Konan AI. Touchez le micro et dites-moi ce que vous recherchez."

}

]);

const [lastCommand,

setLastCommand] =

useState("");

const addToCart = async (product) => {
  if (!isValidProduct(product)) throw new Error("Produit invalide.");
  const productId = String(product._id);
  const currentUser = safeParse(safeStorageGet("user"), null);
  const loggedIn = Boolean(currentUser?._id);

  // Le panier local est la source partagée avec Checkout et la boutique.
  setCart((previous) => {
    const current = normalizeCart(previous);
    const found = current.find((item) => String(item._id) === productId);
    if (found) {
      return current.map((item) => String(item._id) === productId
        ? { ...item, quantity: Math.min(99, (Number(item.quantity) || 1) + 1) }
        : item);
    }
    return normalizeCart([...current, { ...product, quantity: 1 }]);
  });

  // Pour un compte connecté, synchronise aussi avec le backend.
  // Pour un visiteur, le panier est conservé dans cart_guestId.
  if (loggedIn) {
    try {
      await api.post("/api/cart", { productId, quantity: 1 });
    } catch (error) {
      console.warn("Panier local conservé ; synchronisation serveur à vérifier.", error?.response?.status || "réseau");
    }
  }
  return true;
};

const addToFavorites = async (product) => {
  if (!isValidProduct(product)) {
    throw new Error("Produit invalide.");
  }

  const productId = String(product._id);
  const currentUser = safeParse(safeStorageGet("user"), null);
  const clientId = normalizeText(currentUser?._id, 100) || getGuestId();
  const favoritesKey = `favorites_${clientId}`;

  // Enregistrement local immédiat, également disponible aux visiteurs.
  const saved = normalizeProductList(
    safeParse(safeStorageGet(favoritesKey), [])
  );
  const alreadySaved = saved.some(
    (item) => String(item._id) === productId
  );
  const updated = alreadySaved
    ? saved
    : [...saved, product].slice(-100);

  const localSaved = safeStorageSet(
    favoritesKey,
    JSON.stringify(updated)
  );
  if (!localSaved) {
    throw new Error("Le navigateur ne permet pas d'enregistrer ce favori.");
  }

  safeStorageSet("favoritesCount", String(updated.length));
  setFavoriteIds((previous) =>
    previous.includes(productId) ? previous : [...previous, productId]
  );

  try {
    window.dispatchEvent(new CustomEvent("favoritesUpdated", {
      detail: { favorites: updated, clientId }
    }));
  } catch {
    try { window.dispatchEvent(new Event("favoritesUpdated")); } catch {}
  }

  // Le serveur identifie le client grâce au cookie HttpOnly.
  if (currentUser?._id) {
    try {
      await api.post("/api/favorites", { productId });
      return { savedLocally: true, serverSynced: true, alreadySaved };
    } catch (error) {
      console.warn(
        "Favori conservé localement ; synchronisation serveur échouée.",
        error?.response?.status || error?.message || "réseau"
      );
      return {
        savedLocally: true,
        serverSynced: false,
        alreadySaved,
        status: error?.response?.status || null
      };
    }
  }

  return { savedLocally: true, serverSynced: false, alreadySaved };
};

const performAssistantAction = async (action) => {
  if (!action || typeof action !== "object") return;
  if (action.type === "navigate") {
    const allowed = new Set(["/checkout", "/favorites", "/boutique"]);
    if (allowed.has(action.destination)) window.location.assign(action.destination);
    return;
  }
  const product = action.product;
  if (!isValidProduct(product) || String(product._id) !== String(action.productId)) return;
  if (action.type === "add_to_cart") {
    await addToCart(product);
    setPendingRedirect({ path: "/checkout", label: "Ouvrir mon panier" });
    setMessages((prev) => [...prev, {
      role: "ai",
      text: `${product.name} a bien été ajouté à votre panier. Souhaitez-vous que je vous redirige vers votre panier pour vérifier votre commande ?`,
      products: [product],
      actionPrompt: "checkout"
    }].slice(-MAX_HISTORY_MESSAGES * 2));
  } else if (action.type === "add_to_favorites") {
    const favoriteResult = await addToFavorites(product);
    setPendingRedirect({ path: "/favorites", label: "Voir mes favoris" });
    const favoriteMessage = favoriteResult.serverSynced
      ? `${product.name} a bien été ajouté à vos favoris et synchronisé avec votre compte ❤️ Voulez-vous ouvrir votre liste de favoris ?`
      : `${product.name} est enregistré dans les favoris de cet appareil ❤️${safeParse(safeStorageGet("user"), null)?._id ? " La synchronisation avec votre compte n'a pas abouti : vérifiez votre connexion puis réessayez." : " Connectez-vous pour retrouver vos favoris sur vos autres appareils."} Voulez-vous ouvrir votre liste de favoris ?`;
    setMessages((prev) => [...prev, {
      role: "ai",
      text: favoriteMessage,
      products: [product],
      actionPrompt: "favorites"
    }].slice(-MAX_HISTORY_MESSAGES * 2));
  }
};

const handleRedirectAnswer = (answer) => {
  if (!pendingRedirect) return false;
  const normalized = normalizeText(answer, 100).toLowerCase();
  if (/^(oui|ouais|ok|okay|d accord|vas y|bien sur|je veux|yes)\b/.test(normalized)) {
    const destination = pendingRedirect.path;
    setPendingRedirect(null);
    window.location.assign(destination);
    return true;
  }
  if (/^(non|pas maintenant|plus tard|pas besoin)\b/.test(normalized)) {
    setMessages((prev) => [...prev, { role: "user", text: answer }, { role: "ai", text: "Très bien. Je reste disponible si vous souhaitez continuer vos achats." }].slice(-MAX_HISTORY_MESSAGES * 2));
    setPendingRedirect(null);
    return true;
  }
  return false;
};

const [cart, setCart] = useState(() => {
  const clientId = getCurrentClientId();
  const savedCart = safeParse(
    safeStorageGet(`cart_${clientId}`),
    []
  );
  return normalizeCart(savedCart);
});

useEffect(() => {
  const clientId = getCurrentClientId();
  safeStorageSet(
    `cart_${clientId}`,
    JSON.stringify(normalizeCart(cart))
  );

  // Informe les autres composants de la boutique du changement de panier.
  try {
    window.dispatchEvent(new CustomEvent("cartUpdated", {
      detail: { cart: normalizeCart(cart), clientId }
    }));
  } catch {
    // Le panier reste sauvegardé même si les événements ne sont pas disponibles.
  }
}, [cart]);

useEffect(() => {
  const handleStorage = (event) => {
    if (event.key !== `cart_${getCurrentClientId()}` || !event.newValue) return;
    setCart(normalizeCart(safeParse(event.newValue, [])));
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}, []);

const startVoice = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    window.alert("La reconnaissance vocale n'est pas disponible sur ce navigateur. Vous pouvez continuer par écrit.");
    return;
  }

  if (listening || thinking) return;

  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.continuous = false;
  recognition.interimResults = false;

  setListening(true);
  setPulse(true);

  recognition.onresult = async (event) => {
    const voiceText = normalizeText(
      event?.results?.[0]?.[0]?.transcript,
      MAX_MESSAGE_LENGTH
    );
    if (voiceText) {
      setLastCommand(voiceText);
      await sendMessage(voiceText);
    }
  };

  recognition.onerror = () => {
    setListening(false);
    setPulse(false);
  };

  recognition.onend = () => {
    setListening(false);
    setPulse(false);
  };

  try {
    recognition.start();
  } catch {
    setListening(false);
    setPulse(false);
  }
};

const sendMessage = async (message) => {
  const cleanMessage = normalizeText(message, MAX_MESSAGE_LENGTH);
  if (!cleanMessage || requestInProgress.current) return;
  if (handleRedirectAnswer(cleanMessage)) return;

  requestInProgress.current = true;
  setThinking(true);

  const userMessage = {
    role: "user",
    text: cleanMessage
  };

  try {
    const res = await api.post(
      "/api/ai-chat",
      {
        message: cleanMessage,
        history: normalizeHistory(messages)
      },
      {
        timeout: AI_TIMEOUT
      }
    );

    const safeReply = normalizeText(res.data?.reply, 5000);
    if (!safeReply) {
      throw new Error("Réponse IA invalide");
    }

    const recommendedProducts = normalizeProductList(
      res.data?.products || res.data?.recommendations || []
    );

    setReply(safeReply);
    setProducts(recommendedProducts);

    const aiMessage = {
      role: "ai",
      text: safeReply,
      products: recommendedProducts
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      aiMessage
    ].slice(-MAX_HISTORY_MESSAGES * 2));

    if (res.data?.action) {
      try {
        await performAssistantAction(res.data.action);
      } catch (actionError) {
        setMessages((prev) => [...prev, { role: "ai", text: "Je n'ai pas pu terminer cette action. Vous pouvez réessayer depuis la boutique." }].slice(-MAX_HISTORY_MESSAGES * 2));
      }
    }

    if ("speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function") {
      try {
        const speech = new window.SpeechSynthesisUtterance(safeReply);
        speech.lang = "fr-FR";
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
      } catch {
        // La réponse écrite reste disponible si la synthèse vocale échoue.
      }
    }
  } catch (err) {
    console.error("Erreur AiMode :", err?.response?.status || "API");
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        role: "ai",
        text: "Désolé, je rencontre momentanément un problème de connexion. Réessaie dans quelques instants."
      }
    ].slice(-MAX_HISTORY_MESSAGES * 2));
  } finally {
    requestInProgress.current = false;
    setThinking(false);
  }
};

return (

<div

style={{

minHeight:"100vh",

background:

"linear-gradient(180deg,var(--season-surface-soft),var(--season-surface))",

position:"relative",

overflow:"hidden"

}}

>

{/* HEADER PREMIUM — couleurs pilotées par le thème saisonnier */}

<div

style={{

padding:"14px 16px",

display:"flex",

justifyContent:"space-between",

alignItems:"center",

gap:"10px"

}}

>

{/* LOGO + NOM */}

<div

style={{

display:"flex",

alignItems:"center",

gap:"10px"

}}

>

<div

style={{

width:

window.innerWidth < 768

? "46px"

: "52px",

height:

window.innerWidth < 768

? "46px"

: "52px",

borderRadius:"14px",

overflow:"hidden",

flexShrink:0,

boxShadow:

"0 6px 18px var(--season-glow)"

}}

>

<img

src="/logo.jpg"

alt="Konan Shopping"

style={{

width:"100%",

height:"100%",

objectFit:"cover"

}}

/>

</div>

<div>

<h1

style={{

margin:0,

fontSize:

window.innerWidth < 768

? "17px"

: "20px",

fontWeight:"900",

color:"var(--season-text)",

lineHeight:"1"

}}

>

KONAN

</h1>

<p

style={{

marginTop:"3px",

fontSize:"10px",

fontWeight:"700",

color:"var(--season-primary)",

display:"flex",

alignItems:"center",

gap:"5px"

}}

>

<FaGlobeAfrica size={10} />

SHOPPING CAMEROUN

</p>

</div>

</div>

{/* BADGE IA */}

<div

style={{

background:

"linear-gradient(135deg,var(--season-primary),var(--season-secondary))",

padding:

window.innerWidth < 768

? "8px 12px"

: "9px 14px",

borderRadius:"999px",

color:"var(--season-surface)",

fontWeight:"700",

fontSize:

window.innerWidth < 768

? "11px"

: "12px",

display:"flex",

alignItems:"center",

gap:"6px",

whiteSpace:"nowrap",

boxShadow:

"0 6px 18px var(--season-glow)"

}}

>

<FaBrain size={11} />

IA Konan

</div>

</div>

{/* HALO ARRIÈRE PLAN */}

<div

style={{

position:"absolute",

top:"80px",

left:"50%",

transform:"translateX(-50%)",

width:

window.innerWidth < 768

? "350px"

: "550px",

height:

window.innerWidth < 768

? "350px"

: "550px",

borderRadius:"50%",

background:

"radial-gradient(circle,var(--season-glow),transparent 70%)",

filter:"blur(50px)",

zIndex:0,

}}

/>

{/* IA ORB */}

<div

style={{

display:"flex",

justifyContent:"center",

alignItems:"center",

height:

window.innerWidth < 768

? "60vh"

: "70vh",

}}

>

<div
className="konan-ai-seasonal-sphere"
onClick={startVoice}

onMouseEnter={() =>

setHover(true)

}

onMouseLeave={() =>

setHover(false)

}

style={{

width:

window.innerWidth < 768

? "180px"

: "230px",

height:

window.innerWidth < 768

? "180px"

: "230px",

borderRadius:"50%",

cursor:"pointer",

display:"flex",

justifyContent:"center",

alignItems:"center",

background:

"radial-gradient(circle at 30% 30%,var(--season-surface),var(--season-accent),var(--season-decoration),var(--season-primary),var(--season-secondary))",

boxShadow:

pulse

? `

0 0 40px rgba(37,99,235,.6),

0 0 80px rgba(37,99,235,.4),

0 0 140px rgba(37,99,235,.25)

`

: `

0 0 20px rgba(37,99,235,.15),

0 0 60px rgba(37,99,235,.10)

`,

transform:

pulse

? "scale(1.06)"

: hover

? "scale(1.03)"

: "scale(1)",

transition:"all .35s ease",

position:"relative",

animation:

pulse

? "orbPulse 2s infinite"

: "floatOrb 4s ease-in-out infinite"

}}

>

{/* Aura 1 */}

<div

style={{

position:"absolute",

width:

window.innerWidth < 768

? "220px"

: "280px",

height:

window.innerWidth < 768

? "220px"

: "280px",

borderRadius:"50%",

border:

"2px solid rgba(96,165,250,.30)",

animation:

"rotateAura 12s linear infinite"

}}

/>

{/* Aura 2 */}

<div

style={{

position:"absolute",

width:

window.innerWidth < 768

? "260px"

: "320px",

height:

window.innerWidth < 768

? "260px"

: "320px",

borderRadius:"50%",

border:

"1.5px solid rgba(255,255,255,.18)",

animation:

"rotateAuraReverse 18s linear infinite"

}}

/>

{/* Aura 3 */}

<div

style={{

position:"absolute",

width:

window.innerWidth < 768

? "300px"

: "380px",

height:

window.innerWidth < 768

? "300px"

: "380px",

borderRadius:"50%",

border:

"1px solid rgba(96,165,250,.10)",

animation:

"rotateAura 25s linear infinite"

}}

/>

{/* CERVEAU IA */}

<FaBrain

size={

window.innerWidth < 768

? 60

: 85

}

color="var(--season-surface)"

style={{

filter:

"drop-shadow(0 0 15px rgba(255,255,255,.7))"

}}

/>

{/* ÉTAT IA */}

<div

style={{

position:"absolute",

bottom:

window.innerWidth < 768

? "-50px"

: "-60px",

display:"flex",

alignItems:"center",

gap:"6px",

color:"var(--season-primary)",

fontWeight:"700",

fontSize:

window.innerWidth < 768

? "13px"

: "15px",

}}

>

{

listening ? (

<>

<FaMicrophone />

<span>J'écoute...</span>

</>

) : thinking ? (

<>

<FaSpinner className="spin" />

<span>Analyse...</span>

</>

) : (

<>

<FaBrain />

<span>Prêt</span>

</>

)

}

</div>

</div>

</div>

{/* CONVERSATION */}

<div

style={{

maxWidth:"750px",

margin:"20px auto",

padding:"0 12px",

display:"flex",

flexDirection:"column",

gap:"10px",

}}

>

{messages.map((msg,index)=>(

<div

key={index}

style={{

display:"flex",

justifyContent:

msg.role === "user"

? "flex-end"

: "flex-start",

}}

>

<div

style={{

display:"flex",

alignItems:"flex-end",

gap:"8px",

maxWidth:"90%",

}}

>

{/* AVATAR IA */}

{msg.role === "ai" && (

<div

style={{

width:"30px",

height:"30px",

borderRadius:"50%",

background:

"linear-gradient(135deg,var(--season-primary),var(--season-decoration))",

display:"flex",

justifyContent:"center",

alignItems:"center",

color:"var(--season-surface)",

flexShrink:0,

boxShadow:

"0 4px 10px var(--season-glow)",

}}

>

<FaBrain size={12} />

</div>

)}

{/* BULLE */}

<div

style={{

background:

msg.role === "ai"

? "var(--season-surface)"

: "linear-gradient(135deg,var(--season-primary),var(--season-secondary))",

color:

msg.role === "ai"

? "var(--season-text)"

: "var(--season-surface)",

padding:"12px 14px",

borderRadius:

msg.role === "ai"

? "16px 16px 16px 5px"

: "16px 16px 5px 16px",

boxShadow:

msg.role === "ai"

? "0 3px 12px rgba(0,0,0,.04)"

: "0 6px 15px var(--season-glow)",

fontSize:

window.innerWidth < 768

? "13px"

: "14px",

lineHeight:"1.55",

fontWeight:"500",

maxWidth:

window.innerWidth < 768

? "100%"

: "550px",

wordBreak:"break-word",

border:

msg.role === "ai"

? "1px solid var(--season-border)"

: "none",

}}

>

{/* HEADER */}

<div

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

marginBottom:"8px",

paddingBottom:"6px",

borderBottom:

msg.role === "ai"

? "1px solid #F1F5F9"

: "none",

}}

>

<div

style={{

display:"flex",

alignItems:"center",

gap:"6px",

fontWeight:"700",

fontSize:"11px",

color:

msg.role === "ai"

? "var(--season-primary)"

: "var(--season-surface)",

}}

>

{

msg.role === "ai"

? (

<>

<FaBrain size={10} />

Konan AI

</>

)

: (

<>

<FaUser size={10} />

Vous

</>

)

}

</div>

<div

style={{

fontSize:"10px",

opacity:0.6,

fontWeight:"500",

}}

>

{new Date().toLocaleTimeString(

"fr-FR",

{

hour:"2-digit",

minute:"2-digit",

}

)}

</div>

</div>

{/* CONTENU */}

<div

style={{

whiteSpace:"pre-wrap",

fontSize:

window.innerWidth < 768

? "13px"

: "14px",

lineHeight:"1.6",

}}

>

{msg.text}

</div>

</div>

{/* AVATAR USER */}

{msg.role === "user" && (

<div

style={{

width:"30px",

height:"30px",

borderRadius:"50%",

background:

"linear-gradient(135deg,#111827,#374151)",

display:"flex",

justifyContent:"center",

alignItems:"center",

color:"var(--season-surface)",

flexShrink:0,

boxShadow:

"0 4px 10px rgba(0,0,0,.15)",

}}

>

<FaUser size={11} />

</div>

)}

</div>

</div>

))}

</div>

{messages.length <= 1 && (

<div

style={{

maxWidth:"900px",

margin:"25px auto",

padding:"0 14px",

}}

>

<h3

style={{

fontSize:"16px",

fontWeight:"800",

marginBottom:"14px",

color:"var(--season-text)",

}}

>

Suggestions populaires

</h3>

<div

style={{

display:"grid",

gridTemplateColumns:

window.innerWidth < 768

? "1fr"

: "repeat(auto-fit,minmax(220px,1fr))",

gap:"12px",

}}

>

{featuredProducts.map(

(product)=>(

<button

key={product._id}

onClick={() =>

sendMessage(

product.name

)

}

style={{

background:"var(--season-surface)",

border:"1px solid var(--season-border)",

padding:"12px",

borderRadius:"16px",

cursor:"pointer",

display:"flex",

alignItems:"center",

gap:"10px",

textAlign:"left",

boxShadow:

"0 4px 12px rgba(15,23,42,.04), 0 0 14px var(--season-glow)",

transition:"all .25s ease",

}}

>

<img

src={product.image}

 alt=""

style={{

width:"48px",

height:"48px",

borderRadius:"10px",

objectFit:"cover",

flexShrink:0,

}}

/>

<div

style={{

overflow:"hidden",

}}

>

<div

style={{

fontWeight:"700",

fontSize:"13px",

color:"var(--season-text)",

whiteSpace:"nowrap",

overflow:"hidden",

textOverflow:"ellipsis",

}}

>

{product.name}

</div>

<div

style={{

fontSize:"11px",

color:"var(--season-primary)",

fontWeight:"700",

marginTop:"4px",

}}

>

{Number(

product.price

).toLocaleString()}

FCFA

</div>

</div>

</button>

))

}

</div>

</div>

)}

{/* NOTIFICATION FAVORIS */}
{favoriteNotice && (
  <div
    role="status"
    style={{
      maxWidth: "760px",
      margin: "12px auto",
      padding: "11px 14px",
      borderRadius: "12px",
      background: "var(--season-accent)",
      color: "var(--season-secondary)",
      border: "1px solid var(--season-border)",
      fontSize: "13px",
      fontWeight: 700
    }}
  >
    {favoriteNotice}
  </div>
)}

{/* PRODUITS */}

{products.length > 0 && (

<div

style={{

padding:

window.innerWidth < 768

? "20px 12px"

: "30px 20px",

}}

>

<h2

style={{

textAlign:"center",

fontSize:

window.innerWidth < 768

? "20px"

: "28px",

fontWeight:"900",

marginBottom:"20px",

color:"var(--season-text)",

}}

>

Résultats trouvés

</h2>

<div

style={{

display:"grid",

gridTemplateColumns:

window.innerWidth < 768

? "repeat(2,1fr)"

: "repeat(auto-fit,minmax(230px,1fr))",

gap:

window.innerWidth < 768

? "12px"

: "18px",

}}

>

{products.map((product)=>(

<div

key={product._id}

onClick={() =>

window.location.href =

`/product/${product._id}`

}

style={{

background:"var(--season-surface)",

borderRadius:"18px",

overflow:"hidden",

cursor:"pointer",

border:"1px solid var(--season-border)",

boxShadow:

"0 6px 18px rgba(15,23,42,.05), 0 0 14px var(--season-glow)",

transition:"all .3s ease",

}}

>

{/* IMAGE */}

<div

style={{

position:"relative",

}}

>

<img

src={product.image}

alt={product.name}

style={{

width:"100%",

height:

window.innerWidth < 768

? "150px"

: "220px",

objectFit:"cover",

}}

/>

<button
  type="button"
  aria-label={favoriteIds.includes(String(product._id)) ? "Produit déjà dans les favoris" : "Ajouter aux favoris"}
  title={favoriteIds.includes(String(product._id)) ? "Déjà dans vos favoris" : "Ajouter aux favoris"}
  disabled={adding === product._id}
  onClick={async (event) => {
    event.stopPropagation();
    setAdding(product._id);
    setFavoriteNotice("");
    try {
      const result = await addToFavorites(product);
      setFavoriteNotice(
        result.serverSynced
          ? `${product.name} est enregistré dans vos favoris ❤️`
          : `${product.name} est enregistré sur cet appareil ❤️${safeParse(safeStorageGet("user"), null)?._id ? " Synchronisation du compte indisponible pour le moment." : " Connectez-vous pour synchroniser vos favoris."}`
      );
    } catch (error) {
      setFavoriteNotice(error?.message || "Impossible d'enregistrer ce favori.");
    } finally {
      setAdding(null);
    }
  }}
  style={{
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "38px",
    height: "38px",
    border: "none",
    borderRadius: "50%",
    background: "var(--season-surface)",
    color: favoriteIds.includes(String(product._id)) ? "#e11d48" : "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,.12)",
    cursor: adding === product._id ? "wait" : "pointer",
    zIndex: 2
  }}
>
  <FaHeart size={16} />
</button>

<div

style={{

position:"absolute",

top:"10px",

right:"10px",

background:"var(--season-surface)",

width:"32px",

height:"32px",

borderRadius:"50%",

display:"flex",

justifyContent:"center",

alignItems:"center",

boxShadow:

"0 4px 12px rgba(0,0,0,.08)",

}}

>

<FaEye

size={13}

color="var(--season-primary)"

/>

</div>

</div>

{/* INFOS */}

<div

style={{

padding:"14px",

}}

>

<div

style={{

display:"inline-flex",

alignItems:"center",

gap:"5px",

padding:"5px 8px",

borderRadius:"20px",

background:"var(--season-accent)",

color:"var(--season-primary)",

fontSize:"10px",

fontWeight:"700",

marginBottom:"10px",

}}

>

<FaTag size={10} />

{product.category}

</div>

<h3

style={{

fontSize:

window.innerWidth < 768

? "13px"

: "15px",

fontWeight:"800",

color:"var(--season-text)",

marginBottom:"8px",

overflow:"hidden",

display:"-webkit-box",

WebkitLineClamp:"2",

WebkitBoxOrient:"vertical",

minHeight:"38px",

}}

>

{product.name}

</h3>

<p

style={{

fontSize:

window.innerWidth < 768

? "18px"

: "22px",

fontWeight:"900",

color:"var(--season-primary)",

marginBottom:"10px",

}}

>

{Number(

product.price

).toLocaleString()}

 FCFA

</p>

<div

style={{

display:"flex",

alignItems:"center",

gap:"5px",

}}

>

<FaStar

size={12}

color="#F59E0B"

/>

<span

style={{

fontSize:"11px",

fontWeight:"600",

color:"var(--season-text)",

}}

>

{

product.reviews

? product.reviews.length

: 0

}

 avis

</span>

</div>

</div>

</div>

))}

</div>

</div>

)}

<div style={{ maxWidth: "760px", margin: "18px auto 110px", padding: "0 14px", position: "relative", zIndex: 5 }}>
  {pendingRedirect && (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
      <button type="button" onClick={() => { const path = pendingRedirect.path; setPendingRedirect(null); window.location.assign(path); }} style={{ ...suggestionStyle, background: "var(--season-primary)", color: "var(--season-surface)", border: "none" }}>{pendingRedirect.label}</button>
      <button type="button" onClick={() => setPendingRedirect(null)} style={suggestionStyle}>Continuer mes achats</button>
    </div>
  )}
  <form onSubmit={(event) => { event.preventDefault(); const value = inputText; setInputText(""); sendMessage(value); }} style={{ display: "flex", gap: "8px", alignItems: "center", background: "var(--season-surface)", border: "1px solid var(--season-border)", borderRadius: "18px", padding: "8px", boxShadow: "0 8px 28px var(--season-glow)" }}>
    <input value={inputText} onChange={(event) => setInputText(event.target.value.slice(0, MAX_MESSAGE_LENGTH))} placeholder="Écrivez à Konan AI : ex. trouve-moi une chaussure Nike…" maxLength={MAX_MESSAGE_LENGTH} aria-label="Votre message à Konan AI" style={{ flex: 1, minWidth: 0, border: "none", outline: "none", padding: "10px 8px", fontSize: "14px", background: "transparent", color: "var(--season-text)" }} />
    <button type="button" onClick={startVoice} aria-label="Parler à Konan AI" style={{ width: "42px", height: "42px", border: "none", borderRadius: "13px", background: "var(--season-accent)", color: "var(--season-primary)", cursor: "pointer" }}><FaMicrophone /></button>
    <button type="submit" disabled={thinking || !inputText.trim()} style={{ width: "42px", height: "42px", border: "none", borderRadius: "13px", background: thinking || !inputText.trim() ? "#94a3b8" : "var(--season-primary)", color: "var(--season-surface)", cursor: thinking || !inputText.trim() ? "not-allowed" : "pointer" }}>➤</button>
  </form>
  <p style={{ margin: "7px 4px 0", color: "#94a3b8", fontSize: "10px", textAlign: "center" }}>Konan AI peut vous aider à rechercher, comparer, ajouter au panier et gérer vos favoris.</p>
</div>

{showFooter && (

<div

style={{

position:"fixed",

bottom:"10px",

left:"50%",

transform:"translateX(-50%)",

width:"94%",

maxWidth:"500px",

background:"var(--season-surface)",

backdropFilter:"blur(20px)",

WebkitBackdropFilter:"blur(20px)",

border:"1px solid var(--season-border)",

borderRadius:"20px",

padding:"8px 6px",

display:"flex",

justifyContent:"space-between",

alignItems:"center",

boxShadow:

"0 8px 30px rgba(15,23,42,.08), 0 0 22px var(--season-glow)",

zIndex:999,

}}

>

<Link

to="/"

style={bottomStyle}

>

<FaHome size={17}/>

<span>Accueil</span>

</Link>

<Link

to="/boutique"

style={bottomStyle}

>

<FaStore size={17}/>

<span>Boutique</span>

</Link>

{/* IA */}

<Link

to="/ai-mode"

style={{

...bottomStyle,

color:"var(--season-primary)",

}}

>

<div

style={{

width:"40px",

height:"40px",

borderRadius:"12px",

background:

"linear-gradient(135deg,var(--season-primary),var(--season-secondary))",

display:"flex",

justifyContent:"center",

alignItems:"center",

color:"var(--season-surface)",

boxShadow:

"0 6px 18px var(--season-glow)",

}}

>

<FaRobot size={16}/>

</div>

<span

style={{

marginTop:"3px",

fontWeight:"800",

}}

>

IA

</span>

</Link>

<Link

to="/checkout"

style={bottomStyle}

>

<FaShoppingCart size={17}/>

<span>Panier</span>

</Link>

<Link

to="/user-login"

style={bottomStyle}

>

<FaUser size={17}/>

<span>Compte</span>

</Link>

</div>

)}

</div>

);

}

/* ========================= */

/* STYLES */

/* ========================= */

const suggestionStyle = {

background:"var(--season-surface)",

border:"1px solid var(--season-border)",

padding:"14px",

borderRadius:"16px",

fontSize:"14px",

fontWeight:"700",

cursor:"pointer",

boxShadow:

"0 4px 12px rgba(15,23,42,.04), 0 0 14px var(--season-glow)",

color:"var(--season-text)",

transition:"all .25s ease",

};

const bottomStyle = {

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

gap:"3px",

textDecoration:"none",

color:"var(--season-text)",

fontSize:"10px",

fontWeight:"700",

minWidth:"50px",

transition:"all .25s ease",

};

<style>

{`

@keyframes rotateAura {

from {

transform: rotate(0deg);

}

to {

transform: rotate(360deg);

}

}

@keyframes rotateAuraReverse {

from {

transform: rotate(360deg);

}

to {

transform: rotate(0deg);

}

}

@keyframes orbPulse {

0% {

transform: scale(1);

}

50% {

transform: scale(1.06);

}

100% {

transform: scale(1);

}

}

@keyframes floatOrb {

0% {

transform: translateY(0px);

}

50% {

transform: translateY(-8px);

}

100% {

transform: translateY(0px);

}

}

@keyframes spin {

from {

transform: rotate(0deg);

}

to {

transform: rotate(360deg);

}

}

.spin {

animation:

spin 1s linear infinite;

}

body {

margin: 0;

padding: 0;

background: var(--season-surface-soft);

font-family:

Inter,

system-ui,

sans-serif;

}

::-webkit-scrollbar {

width: 4px;

}

::-webkit-scrollbar-thumb {

background: var(--season-decoration);

border-radius: 20px;

}

`}

</style>

export default AiMode;