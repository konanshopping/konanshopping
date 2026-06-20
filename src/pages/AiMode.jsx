import React, {
  useState,
  useEffect
} from "react";

import axios from "axios";

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

function AiMode() {

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

const user = JSON.parse(
  localStorage.getItem("user")
);

const userId = user?._id;

const [listening,setListening] =
useState(false);

const [thinking,setThinking] =
useState(false);

const [pulse,setPulse] =
useState(false);

const [products,setProducts] =
useState([]);

const [reply,setReply] =
useState("");

const [featuredProducts,
setFeaturedProducts] =
useState([]);

useEffect(() => {

const loadProducts =
async () => {

try {

const res =
await axios.get(
"https://konanshopping-production.up.railway.app/products"
);

setFeaturedProducts(
res.data.slice(0,8)
);

}

catch(err){

console.log(err);

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

const addToCart = (product) => {

  playSound();

  const existingProduct =
    cart.find(
      (item) =>
      item._id === product._id
    );

  if (existingProduct) {

    const updatedCart =
      cart.map((item)=>

        item._id === product._id

        ? {

          ...item,

          quantity:
          item.quantity + 1

        }

        : item

      );

    setCart(updatedCart);

  }

  else {

    setCart([

      ...cart,

      {

        ...product,

        quantity:1,

        image:
        product.image

      }

    ]);

  }

};

const [cart, setCart] =
useState(() => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const clientId =

    user?._id ||

    localStorage.getItem("guestId") ||

    (() => {

      const newGuestId =
        "guest_" + Date.now();

      localStorage.setItem(
        "guestId",
        newGuestId
      );

      return newGuestId;

    })();

  const cartKey =
    `cart_${clientId}`;

  const savedCart =
    localStorage.getItem(cartKey);

  return savedCart
    ? JSON.parse(savedCart)
    : [];

});

useEffect(() => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const clientId =

    user?._id ||

    localStorage.getItem("guestId");

  const cartKey =
    `cart_${clientId}`;

  localStorage.setItem(
    cartKey,
    JSON.stringify(cart)
  );

}, [cart]);

const startVoice = ()=>{

const recognition =
new window.webkitSpeechRecognition();

recognition.lang =
"fr-FR";

recognition.continuous =
false;

recognition.interimResults =
false;

setListening(true);
setPulse(true);

recognition.start();

recognition.onresult =
async(event)=>{

const voiceText =
event.results[0][0]
.transcript;

setLastCommand(
voiceText
);

setListening(false);
setPulse(false);

await sendMessage(
voiceText
);

};

recognition.onerror =
()=>{

setListening(false);
setPulse(false);

};

};

const sendMessage =
async(message)=>{

if(!message) return;

setThinking(true);

try{

const res =
await axios.post(
"https://konanshopping-production.up.railway.app/ai-chat",
{
message,

history: messages
}
);

setReply(
res.data.reply
);

setProducts(
res.data.products ||
res.data.recommendations ||
[]
);

const aiMessage = {

role:"ai",

text:res.data.reply,

products:
res.data.products || []

};

const userMessage = {

role:"user",

text:message

};

setMessages(prev=>[
...prev,
userMessage,
aiMessage
]);

const speech =
new SpeechSynthesisUtterance(
  res.data.Reply
);

speech.lang =
"fr-FR";

window
.speechSynthesis
.speak(speech);

}
catch(err){

console.log(err);

}

setThinking(false);

};

return (

<div
style={{
minHeight:"100vh",
background:
"linear-gradient(180deg,#f8fbff,#ffffff)",
position:"relative",
overflow:"hidden"
}}
>

{/* HEADER PREMIUM */}

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
"0 6px 18px rgba(37,99,235,.15)"
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

color:"#111827",

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

color:"#2563eb",

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
"linear-gradient(135deg,#2563eb,#1d4ed8)",

padding:
window.innerWidth < 768
? "8px 12px"
: "9px 14px",

borderRadius:"999px",

color:"#fff",

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
"0 6px 18px rgba(37,99,235,.20)"
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
"radial-gradient(circle,rgba(37,99,235,.12),transparent 70%)",

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
"radial-gradient(circle at 30% 30%,#ffffff,#93c5fd,#3b82f6,#2563eb,#1e3a8a)",

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
color="#ffffff"
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

color:"#2563eb",

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
"linear-gradient(135deg,#2563eb,#60a5fa)",

display:"flex",

justifyContent:"center",

alignItems:"center",

color:"#fff",

flexShrink:0,

boxShadow:
"0 4px 10px rgba(37,99,235,.20)",
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

? "#ffffff"

: "linear-gradient(135deg,#2563eb,#1d4ed8)",

color:

msg.role === "ai"

? "#111827"

: "#ffffff",

padding:"12px 14px",

borderRadius:

msg.role === "ai"

? "16px 16px 16px 5px"

: "16px 16px 5px 16px",

boxShadow:

msg.role === "ai"

? "0 3px 12px rgba(0,0,0,.04)"

: "0 6px 15px rgba(37,99,235,.15)",

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
? "1px solid #E5E7EB"
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
? "#2563eb"
: "#ffffff",
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

color:"#fff",

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

color:"#111827",
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

background:"#FFFFFF",

border:"1px solid #E5E7EB",

padding:"12px",

borderRadius:"16px",

cursor:"pointer",

display:"flex",

alignItems:"center",

gap:"10px",

textAlign:"left",

boxShadow:
"0 4px 12px rgba(0,0,0,.04)",

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

color:"#111827",

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

color:"#2563EB",

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

color:"#111827",
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
background:"#fff",

borderRadius:"18px",

overflow:"hidden",

cursor:"pointer",

border:"1px solid #EEF2F7",

boxShadow:
"0 6px 18px rgba(0,0,0,.05)",

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

<div
style={{
position:"absolute",

top:"10px",

right:"10px",

background:"#FFFFFF",

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
color="#2563EB"
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

background:"#EFF6FF",

color:"#2563EB",

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

color:"#111827",

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

color:"#2563EB",

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

color:"#6B7280",
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

{showFooter && (

<div
style={{
position:"fixed",

bottom:"10px",

left:"50%",

transform:"translateX(-50%)",

width:"94%",

maxWidth:"500px",

background:"rgba(255,255,255,.96)",

backdropFilter:"blur(20px)",

WebkitBackdropFilter:"blur(20px)",

border:"1px solid rgba(229,231,235,.8)",

borderRadius:"20px",

padding:"8px 6px",

display:"flex",

justifyContent:"space-between",

alignItems:"center",

boxShadow:
"0 8px 30px rgba(0,0,0,.08)",

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

color:"#2563EB",
}}
>

<div
style={{
width:"40px",

height:"40px",

borderRadius:"12px",

background:
"linear-gradient(135deg,#2563EB,#1D4ED8)",

display:"flex",

justifyContent:"center",

alignItems:"center",

color:"#FFF",

boxShadow:
"0 6px 18px rgba(37,99,235,.20)",
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

background:"#FFFFFF",

border:"1px solid #E5E7EB",

padding:"14px",

borderRadius:"16px",

fontSize:"14px",

fontWeight:"700",

cursor:"pointer",

boxShadow:
"0 4px 12px rgba(0,0,0,.04)",

color:"#111827",

transition:"all .25s ease",
};

const bottomStyle = {

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

gap:"3px",

textDecoration:"none",

color:"#64748B",

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
background: #F8FBFF;
font-family:
Inter,
system-ui,
sans-serif;
}

::-webkit-scrollbar {
width: 4px;
}

::-webkit-scrollbar-thumb {
background: #CBD5E1;
border-radius: 20px;
}

`}
</style>

export default AiMode;