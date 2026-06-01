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
"http://localhost:5000/products"
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
"http://localhost:5000/ai-chat",
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
padding:"18px 20px",
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px"
}}
>

<div
style={{
width:"58px",
height:"58px",
borderRadius:"18px",
overflow:"hidden",
boxShadow:
"0 8px 20px rgba(37,99,235,.18)"
}}
>

<img
src="/logo.jpg"
alt=""
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
fontSize:"22px",
fontWeight:"900",
color:"#111827",
lineHeight:"1"
}}
>
KONAN
</h1>

<p
style={{
marginTop:"4px",
fontSize:"12px",
fontWeight:"700",
color:"#2563eb",
display:"flex",
alignItems:"center",
gap:"6px"
}}
>

<FaGlobeAfrica size={11}/>

SHOPPING CAMEROUN

</p>

</div>

</div>

<div
style={{
background:
"linear-gradient(135deg,#2563eb,#1d4ed8)",
padding:"10px 16px",
borderRadius:"40px",
color:"#fff",
fontWeight:"700",
fontSize:"13px",
display:"flex",
alignItems:"center",
gap:"8px",
boxShadow:
"0 6px 20px rgba(37,99,235,.25)"
}}
>

<FaBrain size={13}/>

IA KONAN SHOPPING

</div>

</div>

<div
style={{
position:"absolute",
top:"120px",
left:"50%",
transform:"translateX(-50%)",
width:"700px",
height:"700px",
borderRadius:"50%",
background:
"radial-gradient(circle,rgba(37,99,235,.15),transparent 70%)",
filter:"blur(40px)",
zIndex:0
}}
/>

{/* IA ORB */}

<div
style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"75vh"
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

width:"260px",

height:"260px",

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
0 0 50px rgba(37,99,235,.7),
0 0 100px rgba(37,99,235,.5),
0 0 180px rgba(37,99,235,.35),
0 0 260px rgba(37,99,235,.2)
`

: `
0 0 30px rgba(37,99,235,.2),
0 0 80px rgba(37,99,235,.15)
`,

transform:

pulse

? "scale(1.08)"

: hover

? "scale(1.04)"

: "scale(1)",

transition:"all .35s ease",

position:"relative",

animation:
pulse
? "orbPulse 2s infinite"
: "floatOrb 4s ease-in-out infinite"

}}

>

{/* Aura externe 1 */}

<div
style={{
position:"absolute",
width:"320px",
height:"320px",
borderRadius:"50%",
border:
"3px solid rgba(96,165,250,.35)",
animation:
"rotateAura 12s linear infinite"
}}
/>

{/* Aura externe 2 */}

<div
style={{
position:"absolute",
width:"360px",
height:"360px",
borderRadius:"50%",
border:
"2px solid rgba(255,255,255,.18)",
animation:
"rotateAuraReverse 18s linear infinite"
}}
/>

{/* Aura externe 3 */}

<div
style={{
position:"absolute",
width:"420px",
height:"420px",
borderRadius:"50%",
border:
"1px solid rgba(96,165,250,.12)",
animation:
"rotateAura 25s linear infinite"
}}
/>

{/* Cerveau IA */}

<FaBrain
size={95}
color="#ffffff"
style={{
filter:
"drop-shadow(0 0 20px rgba(255,255,255,.8))"
}}
/>

{/* ETAT IA */}

<div
style={{
position:"absolute",
bottom:"-65px",
display:"flex",
alignItems:"center",
gap:"8px",
color:"#2563eb",
fontWeight:"700",
fontSize:"15px"
}}
>

{
listening

? (
<>
<FaMicrophone />
<span>J'écoute...</span>
</>
)

: thinking

? (
<>
<FaSpinner
className="spin"
/>
<span>Analyse...</span>
</>
)

: (
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
maxWidth:"900px",
margin:"30px auto",
padding:"0 15px",
display:"flex",
flexDirection:"column",
gap:"12px"
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
: "flex-start"

}}

>

<div
style={{
display:"flex",
alignItems:"flex-start",
gap:"10px",
maxWidth:"85%"
}}
>

{/* AVATAR IA */}

{msg.role === "ai" && (

<div
style={{
width:"34px",
height:"34px",
borderRadius:"50%",
background:
"linear-gradient(135deg,#2563eb,#60a5fa)",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#fff",
flexShrink:0,
boxShadow:
"0 4px 12px rgba(37,99,235,.25)"
}}
>

<FaBrain size={14}/>

</div>

)}

{/* BULLE MESSAGE */}

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

padding:"14px 16px",

borderRadius:

msg.role === "ai"

? "18px 18px 18px 4px"

: "18px 18px 4px 18px",

boxShadow:

msg.role === "ai"

? "0 4px 15px rgba(0,0,0,.05)"

: "0 8px 20px rgba(37,99,235,.20)",

fontSize:"14px",

lineHeight:"1.6",

fontWeight:"500",

maxWidth:"600px",

wordBreak:"break-word"

}}

>

{/* HEADER */}

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"6px"
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
fontWeight:"700",
fontSize:"12px"
}}
>

{
msg.role === "ai"

? (
<>
<FaBrain size={11}/>
Konan AI
</>
)

: (
<>
<FaUser size={11}/>
Vous
</>
)

}

</div>

<div
style={{
fontSize:"10px",
opacity:.55
}}
>

{new Date().toLocaleTimeString(
"fr-FR",
{
hour:"2-digit",
minute:"2-digit"
}
)}

</div>

</div>

{/* CONTENU */}

<div
style={{
whiteSpace:"pre-wrap"
}}
>

{msg.text}

</div>

</div>

{/* AVATAR USER */}

{msg.role === "user" && (

<div
style={{
width:"34px",
height:"34px",
borderRadius:"50%",
background:
"linear-gradient(135deg,#111827,#374151)",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#fff",
flexShrink:0
}}
>

<FaUser size={13}/>

</div>

)}

</div>

</div>

))}

</div>

{messages.length <= 1 && (

<div
style={{
maxWidth:"1000px",
margin:"40px auto",
padding:"0 20px"
}}
>

<h3
style={{
fontSize:"18px",
fontWeight:"800",
marginBottom:"20px",
color:"#111827"
}}
>

Suggestions populaires

</h3>

<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",
gap:"15px"
}}
>

{featuredProducts.map(
(product)=>(
<button

key={product._id}

onClick={()=>
sendMessage(
product.name
)
}

style={{

background:"#fff",

border:"none",

padding:"15px",

borderRadius:"20px",

cursor:"pointer",

display:"flex",

alignItems:"center",

gap:"12px",

textAlign:"left",

boxShadow:
"0 8px 20px rgba(0,0,0,.05)",

transition:"0.3s"

}}

>

<img
src={product.image}
alt=""
style={{
width:"55px",
height:"55px",
borderRadius:"12px",
objectFit:"cover"
}}
/>

<div>

<div
style={{
fontWeight:"700",
fontSize:"14px",
color:"#111827"
}}
>

{product.name}

</div>

<div
style={{
fontSize:"12px",
color:"#6b7280"
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
padding:"30px 20px"
}}
>

<h2
style={{
textAlign:"center",
fontSize:"28px",
fontWeight:"900",
marginBottom:"30px",
color:"#111827"
}}
>

Résultats trouvés

</h2>

<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(260px,1fr))",
gap:"20px"
}}
>

{products.map((product)=>(

<div

key={product._id}

style={{

background:"#fff",

borderRadius:"24px",

overflow:"hidden",

cursor:"pointer",

boxShadow:
"0 10px 25px rgba(0,0,0,.06)",

transition:"all .3s ease"

}}

onClick={()=>
window.location.href =
`/product/${product._id}`
}

>

<div
style={{
position:"relative"
}}
>

<img

src={product.image}

alt={product.name}

style={{

width:"100%",

height:"240px",

objectFit:"cover"

}}

/>

<div
style={{
position:"absolute",
top:"12px",
right:"12px",
background:"#fff",
padding:"8px",
borderRadius:"50%",
boxShadow:
"0 5px 15px rgba(0,0,0,.08)"
}}
>

<FaEye
color="#2563eb"
/>

</div>

</div>

<div
style={{
padding:"18px"
}}
>

<div
style={{
display:"inline-flex",
alignItems:"center",
gap:"6px",
padding:"6px 10px",
borderRadius:"30px",
background:"#eff6ff",
color:"#2563eb",
fontSize:"12px",
fontWeight:"700",
marginBottom:"12px"
}}
>

<FaTag />

{product.category}

</div>

<h3
style={{
fontSize:"17px",
fontWeight:"800",
color:"#111827",
marginBottom:"10px",
minHeight:"50px"
}}
>

{product.name}

</h3>

<p
style={{
fontSize:"24px",
fontWeight:"900",
color:"#2563eb",
marginBottom:"12px"
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
justifyContent:"space-between",
alignItems:"center",
marginBottom:"15px"
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px"
}}
>

<FaStar
color="#f59e0b"
/>

<span
style={{
fontSize:"13px",
fontWeight:"600"
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

</div>


))}

</div>

</div>

)}

{showFooter && (

<div
style={{
position:"fixed",
bottom:"12px",
left:"50%",
transform:"translateX(-50%)",
width:"92%",
maxWidth:"520px",
background:"rgba(255,255,255,.92)",
backdropFilter:"blur(25px)",
borderRadius:"24px",
padding:"10px 8px",
display:"flex",
justifyContent:"space-between",
alignItems:"center",
boxShadow:
"0 12px 35px rgba(0,0,0,.10)",
zIndex:999,
transition:"all .4s ease"
}}
>

<Link
to="/"
style={bottomStyle}
>
<FaHome size={18}/>
<span>Accueil</span>
</Link>

<Link
to="/boutique"
style={bottomStyle}
>
<FaStore size={18}/>
<span>Boutique</span>
</Link>

<Link
to="/ai-mode"
style={{
...bottomStyle,
color:"#2563eb"
}}
>
<div
style={{
width:"42px",
height:"42px",
borderRadius:"14px",
background:
"linear-gradient(135deg,#2563eb,#1d4ed8)",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#fff",
boxShadow:
"0 8px 20px rgba(37,99,235,.25)"
}}
>
<FaRobot size={18}/>
</div>

<span
style={{
marginTop:"4px"
}}
>
IA
</span>

</Link>

<Link
to="/checkout"
style={bottomStyle}
>
<FaShoppingCart size={18}/>
<span>Panier</span>
</Link>

<Link
to="/user-login"
style={bottomStyle}
>
<FaUser size={18}/>
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

background:"#ffffff",

border:"none",

padding:"18px",

borderRadius:"20px",

fontSize:"16px",

fontWeight:"700",

cursor:"pointer",

boxShadow:
"0 10px 25px rgba(0,0,0,.06)",

color:"#111827",

transition:"0.3s"

};

const bottomStyle = {

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

gap:"4px",

textDecoration:"none",

color:"#6b7280",

fontSize:"11px",

fontWeight:"700",

minWidth:"55px",

transition:"all .3s ease"

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
transform: scale(1.08);
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
transform: translateY(-10px);
}

100% {
transform: translateY(0px);
}

}

@keyframes rotateAura {

from {
transform: rotate(0deg);
}

to {
transform: rotate(360deg);
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

`}

</style>

export default AiMode;