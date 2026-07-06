import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

import { io } from "socket.io-client";

import {

FaBars,

FaSearch,

FaBell,

FaUsers,

FaGlobeAfrica,

FaCheckCircle,

FaUserCircle,

} from "react-icons/fa";

import {
FaBullhorn,
FaHeart,
FaCommentDots,
FaShareAlt,
} from "react-icons/fa";

import {
  FaComments,
  FaSmile,
  FaImage,
  FaShieldAlt
} from "react-icons/fa";

import {
FaCamera,
FaReply,
FaBookmark,
FaFlag,
} from "react-icons/fa";

import {
FaUserFriends,
FaGem,
FaCrown,
FaStar,
FaCircle,
FaMapMarkerAlt,
FaMedal,
} from "react-icons/fa";

import {
  FaPaperclip,
  FaPaperPlane,
  FaMicrophone,
  FaEllipsisV,
} from "react-icons/fa";

import {
  FaCog,
  FaEnvelope,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";

import {
FaThumbsUp,
FaLaugh,
FaEllipsisH,
FaEye,
} from "react-icons/fa";

const socket = io(
  "https://konanshopping-production.up.railway.app"
);

function Community() {

const [isMobile, setIsMobile] =
useState(window.innerWidth < 768);

const [messages, setMessages] = useState([]);

const [message, setMessage] = useState("");

const [onlineUsers, setOnlineUsers] = useState(0);

const [typing, setTyping] = useState("");

useEffect(() => {

const handleResize = () => {

setIsMobile(
window.innerWidth < 768
);

};

window.addEventListener(
"resize",
handleResize
);

return () =>
window.removeEventListener(
"resize",
handleResize
);

}, []);

useEffect(() => {

  socket.emit("join", {
    name: "Utilisateur",
  });

  socket.on("onlineUsers", (count) => {
    setOnlineUsers(count);
  });

  socket.on("newMessage", (msg) => {
    setMessages((old) => [...old, msg]);
  });

  socket.on("typing", (user) => {
    setTyping(user.name);

    setTimeout(() => {
      setTyping("");
    }, 2000);
  });

  return () => {
    socket.off("onlineUsers");
    socket.off("newMessage");
    socket.off("typing");
  };

}, []);

return (

<div
style={{
minHeight:"100vh",
width:"100%",
background:"#F5F8FF",
overflowX:"hidden",
paddingBottom:"90px",
}}
>

{/* ================= HEADER ================= */}

<div
style={{
background:"#071A45",
padding:"18px 18px 22px",
color:"#fff",
boxShadow:"0 8px 25px rgba(0,0,0,.15)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
}}
>

{/* MENU + LOGO */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<FaBars
style={{
fontSize:"24px",
cursor:"pointer",
}}
/>

<img
src="/logo.jpg"
alt="logo"
style={{
width:"46px",
height:"46px",
borderRadius:"14px",
objectFit:"cover",
}}
/>

<div>

<div
translate="no"
style={{
display:"flex",
alignItems:"center",
gap:"6px",
fontWeight:"900",
fontSize:"24px",
}}
>

KONAN SHOPPING

<FaCheckCircle
style={{
fontSize:"15px",
color:"#3B82F6",
}}
/>

</div>

<div
style={{
fontSize:"12px",
opacity:.8,
}}
>

Communauté officielle

</div>

</div>

</div>

{/* ACTIONS */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"18px",
}}
>

<FaSearch
style={{
fontSize:"22px",
cursor:"pointer",
}}
/>

<div
style={{
position:"relative",
}}
>

<FaBell
style={{
fontSize:"22px",
cursor:"pointer",
}}
/>

<div
style={{
position:"absolute",
top:"-6px",
right:"-7px",
background:"#2563EB",
color:"#fff",
width:"18px",
height:"18px",
borderRadius:"50%",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:"10px",
fontWeight:"900",
}}
>

3

</div>

</div>

<img
src="/default-avatar.png"
alt="profil"
style={{
width:"42px",
height:"42px",
borderRadius:"50%",
border:"2px solid white",
objectFit:"cover",
}}
/>

</div>

</div>

</div>

{/* ================= HERO ================= */}

<div
style={{
padding:"18px",
}}
>

<div
style={{
background:"linear-gradient(135deg,#2563EB,#1D4ED8)",
borderRadius:"24px",
padding:"22px",
color:"#fff",
boxShadow:"0 15px 35px rgba(37,99,235,.22)",
position:"relative",
overflow:"hidden",
}}
>

<div
style={{
position:"absolute",
right:"-40px",
top:"-40px",
width:"180px",
height:"180px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<div
style={{
display:"flex",
alignItems:"center",
gap:"16px",
position:"relative",
zIndex:2,
}}
>

<div
style={{
width:"68px",
height:"68px",
borderRadius:"18px",
background:"rgba(255,255,255,.12)",
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"32px",
}}
>

<FaGlobeAfrica/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:"28px",
}}
>

Communauté KONAN SHOPPING

</h2>

<p
style={{
margin:"8px 0",
display:"flex",
alignItems:"center",
gap:"8px",
fontWeight:"700",
fontSize:"15px",
}}
>

<span
style={{
width:"10px",
height:"10px",
borderRadius:"50%",
background:"#22C55E",
display:"inline-block",
}}
></span>

1 248 membres en ligne

</p>

<p
style={{
margin:0,
fontSize:"15px",
opacity:.95,
}}

>

Chat mondial entre tous les utilisateurs.

</p>

</div>

</div>

</div>

</div>

{/* ================= RECHERCHE ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"22px",
}}
>

<div
style={{
background:"#FFFFFF",
borderRadius:"18px",
padding:"14px 18px",
display:"flex",
alignItems:"center",
gap:"12px",
border:"1px solid #E5E7EB",
boxShadow:"0 6px 20px rgba(15,23,42,.05)",
}}
>

<FaSearch
style={{
fontSize:"18px",
color:"#9CA3AF",
}}
/>

<input
type="text"
placeholder="Rechercher un membre ou un message..."
style={{
flex:1,
border:"none",
outline:"none",
background:"transparent",
fontSize:"15px",
color:"#111827",
}}
/>

</div>

</div>

{/* ================= RACCOURCIS ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"24px",
}}
>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"12px",
}}
>

{[
{
icon:<FaBullhorn/>,
title:"Annonces",
color:"#2563EB",
},

{
icon:<FaImage/>,
title:"Photos",
color:"#EC4899",
},

{
icon:<FaUsers/>,
title:"Membres",
color:"#16A34A",
},

{
icon:<FaShieldAlt/>,
title:"Règles",
color:"#F59E0B",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"18px",
padding:"16px 8px",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:"10px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 20px rgba(15,23,42,.05)",
}}
>

<div
style={{
width:"52px",
height:"52px",
borderRadius:"16px",
background:`${item.color}15`,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"22px",
color:item.color,
}}
>

{item.icon}

</div>

<span
style={{
fontSize:"13px",
fontWeight:"800",
textAlign:"center",
color:"#111827",
}}
>

{item.title}

</span>

</div>

))}

</div>

</div>

{/* ================= STATISTIQUES ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"28px",
}}
>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:"14px",
}}
>

{[
{
title:"Messages",
value:"18 425",
color:"#2563EB",
},

{
title:"Membres",
value:"6 842",
color:"#16A34A",
},

{
title:"Photos",
value:"2 186",
color:"#EC4899",
},

{
title:"En ligne",
value:"1 248",
color:"#F59E0B",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"20px",
padding:"18px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 20px rgba(15,23,42,.05)",
}}
>

<div
style={{
fontSize:"13px",
fontWeight:"700",
color:"#6B7280",
marginBottom:"8px",
}}
>

{item.title}

</div>

<div
style={{
fontSize:"26px",
fontWeight:"900",
color:item.color,
}}
>

{item.value}

</div>

</div>

))}

</div>

</div>

{/* ================= ANNONCES OFFICIELLES ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"28px",
}}
>

{/* TITRE */}

<div
style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
marginBottom:"16px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
}}
>

<div
style={{
width:"48px",
height:"48px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaBullhorn/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:"22px",
color:"#111827",
}}
>

Annonces KONAN SHOPPING

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
color:"#6B7280",
}}
>

Messages publiés par l'administration.

</p>

</div>

</div>

<div
style={{
padding:"8px 14px",
borderRadius:"40px",
background:"#DCFCE7",
color:"#15803D",
fontWeight:"800",
fontSize:"12px",
}}
>

OFFICIEL

</div>

</div>

{/* LISTE */}

{[
{
title:"🎉 Bienvenue dans la communauté",
message:"Discutez avec les autres clients, partagez vos expériences et découvrez les nouveautés KONAN SHOPPING.",
time:"Aujourd'hui • 09:30",
},

{
title:"🔥 Promotions du jour",
message:"Découvrez nos nouvelles offres exclusives disponibles pour une durée limitée.",
time:"Hier • 18:10",
},

{
title:"🚚 Livraison",
message:"Les livraisons sont disponibles dans plusieurs villes du Cameroun avec paiement à la livraison.",
time:"Hier • 11:45",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
border:"1px solid #EEF2F7",
borderRadius:"22px",
padding:"18px",
marginBottom:"14px",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
marginBottom:"12px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<img
src="/logo.jpg"
alt="Logo"
style={{
width:"48px",
height:"48px",
borderRadius:"16px",
objectFit:"cover",
}}
/>

<div>

<div
translate="no"
style={{
fontWeight:"900",
fontSize:"16px",
color:"#111827",
}}
>

KONAN SHOPPING

</div>

<div
style={{
fontSize:"12px",
color:"#6B7280",
}}
>

{item.time}

</div>

</div>

</div>

<div
style={{
padding:"6px 10px",
borderRadius:"30px",
background:"#EEF4FF",
color:"#2563EB",
fontWeight:"800",
fontSize:"11px",
}}
>

Admin

</div>

</div>

<h3
style={{
margin:"0 0 10px",
fontWeight:"900",
fontSize:"17px",
color:"#111827",
}}
>

{item.title}

</h3>

<p
style={{
margin:0,
fontSize:"14px",
lineHeight:"25px",
color:"#4B5563",
}}
>

{item.message}

</p>

<div
style={{
display:"flex",
alignItems:"center",
gap:"18px",
marginTop:"16px",
paddingTop:"14px",
borderTop:"1px solid #F3F4F6",
color:"#6B7280",
fontSize:"13px",
fontWeight:"700",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
}}
>

<FaHeart/>

248

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
}}
>

<FaCommentDots/>

82

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
}}
>

<FaShareAlt/>

Partager

</div>

</div>

</div>

))}

</div>

{/* ================= CHAT MONDIAL ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"28px",
}}
>

{/* HEADER */}

<div
style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
marginBottom:"18px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<div
style={{
width:"50px",
height:"50px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"22px",
color:"#2563EB",
}}
>

<FaComments/>

</div>

<div>

<h2
style={{
margin:0,
fontSize:"22px",
fontWeight:"900",
color:"#111827",
}}
>

Chat mondial

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
color:"#6B7280",
}}
>

Discutez avec tous les membres.

</p>

</div>

</div>

<div
style={{
background:"#DCFCE7",
padding:"8px 14px",
borderRadius:"30px",
fontWeight:"800",
fontSize:"12px",
color:"#15803D",
}}
>

🟢 En direct

</div>

</div>

{/* MESSAGES */}

{[
{
name:"Kevin",
city:"Douala",
message:"Bonjour à tous 👋 Qui a déjà commandé les écouteurs Bluetooth ?",
time:"10:24",
verified:true,
},

{
name:"Grâce",
city:"Yaoundé",
message:"Oui 😊 Je les ai reçus hier. Très bonne qualité.",
time:"10:26",
verified:true,
},

{
name:"Junior",
city:"Bafoussam",
message:"La livraison a été très rapide 🚚",
time:"10:29",
verified:false,
},

].map((msg,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"22px",
padding:"16px",
marginBottom:"14px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
marginBottom:"12px",
}}
>

<img
src="/default-avatar.png"
alt=""
style={{
width:"50px",
height:"50px",
borderRadius:"50%",
objectFit:"cover",
}}
/>

<div
style={{
flex:1,
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
fontWeight:"900",
fontSize:"15px",
color:"#111827",
}}
>

{msg.name}

{msg.verified && (

<FaCheckCircle
style={{
color:"#2563EB",
fontSize:"14px",
}}
/>

)}

</div>

<div
style={{
fontSize:"12px",
color:"#6B7280",
}}
>

📍 {msg.city} • {msg.time}

</div>

</div>

</div>

<p
style={{
margin:0,
fontSize:"15px",
lineHeight:"26px",
color:"#374151",
}}
>

{msg.message}

</p>

<div
style={{
display:"flex",
alignItems:"center",
gap:"18px",
marginTop:"14px",
paddingTop:"12px",
borderTop:"1px solid #F3F4F6",
fontSize:"13px",
fontWeight:"700",
color:"#6B7280",
}}
>

<span>❤️ 12</span>

<span>👍 4</span>

<span>💬 Répondre</span>

</div>

</div>

))}

{/* ZONE D'ÉCRITURE */}

<div
style={{
background:"#FFFFFF",
borderRadius:"22px",
padding:"16px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
background:"#F8FAFC",
borderRadius:"16px",
padding:"14px",
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<input
placeholder="Écrivez un message..."
style={{
flex:1,
border:"none",
outline:"none",
background:"transparent",
fontSize:"15px",
}}
/>

<FaSmile
style={{
fontSize:"20px",
color:"#6B7280",
cursor:"pointer",
}}
/>

<FaImage
style={{
fontSize:"20px",
color:"#6B7280",
cursor:"pointer",
}}
/>

<div
style={{
width:"46px",
height:"46px",
borderRadius:"14px",
background:"#2563EB",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#FFFFFF",
cursor:"pointer",
}}
>

<FaPaperPlane/>

</div>

</div>

<div
style={{
marginTop:"14px",
padding:"14px",
background:"#FEF3C7",
borderRadius:"16px",
fontSize:"13px",
lineHeight:"22px",
color:"#92400E",
fontWeight:"700",
}}
>

🔒 Vous devez avoir effectué au moins une commande livrée pour envoyer des messages, réagir ou partager des photos.

</div>

</div>

</div>

{/* ================= OUTILS DU CHAT ================= */}

<div
style={{
padding:"0 18px",
marginTop:"24px",
marginBottom:"28px",
}}
>

{/* ACTIONS */}

<div
style={{
display:"grid",
gridTemplateColumns:isMobile?"repeat(4,1fr)":"repeat(8,1fr)",
gap:"12px",
marginBottom:"22px",
}}
>

{[
{
icon:<FaSmile/>,
title:"Emojis",
color:"#F59E0B",
},

{
icon:<FaImage/>,
title:"Photos",
color:"#EC4899",
},

{
icon:<FaCamera/>,
title:"Caméra",
color:"#2563EB",
},

{
icon:<FaPaperPlane/>,
title:"Envoyer",
color:"#16A34A",
},

{
icon:<FaHeart/>,
title:"J'aime",
color:"#EF4444",
},

{
icon:<FaReply/>,
title:"Répondre",
color:"#7C3AED",
},

{
icon:<FaBookmark/>,
title:"Favoris",
color:"#0891B2",
},

{
icon:<FaFlag/>,
title:"Signaler",
color:"#F97316",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"18px",
padding:"14px 8px",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:"8px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
width:"46px",
height:"46px",
borderRadius:"14px",
background:`${item.color}15`,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"20px",
color:item.color,
}}
>

{item.icon}

</div>

<span
style={{
fontSize:"12px",
fontWeight:"800",
textAlign:"center",
color:"#111827",
}}
>

{item.title}

</span>

</div>

))}

</div>

{/* RÈGLES */}

<div
style={{
background:"#FFFFFF",
borderRadius:"22px",
padding:"18px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"16px",
}}
>

<div
style={{
width:"50px",
height:"50px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"22px",
color:"#2563EB",
}}
>

<FaShieldAlt/>

</div>

<div>

<h3
style={{
margin:0,
fontWeight:"900",
fontSize:"18px",
color:"#111827",
}}
>

Règles de la communauté

</h3>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
color:"#6B7280",
}}
>

Pour garantir une bonne ambiance.

</p>

</div>

</div>

<div
style={{
display:"flex",
flexDirection:"column",
gap:"12px",
fontSize:"14px",
lineHeight:"24px",
color:"#374151",
}}
>

<div>✅ Respectez tous les membres.</div>

<div>🚫 Aucun spam ni publicité.</div>

<div>📷 Partagez uniquement des contenus appropriés.</div>

<div>🛍️ Les avis doivent concerner KONAN SHOPPING.</div>

<div>🛡️ Les administrateurs peuvent supprimer un contenu inapproprié.</div>

<div>🔒 Seuls les clients ayant au moins une commande livrée peuvent écrire, réagir ou envoyer des photos.</div>

</div>

</div>

</div>

{/* ================= MEMBRES CONNECTÉS ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"30px",
}}
>

{/* TITRE */}

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"18px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
}}
>

<div
style={{
width:"48px",
height:"48px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaUserFriends/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"22px":"30px",
color:"#111827",
}}
>

Membres connectés

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
color:"#6B7280",
}}
>

1 248 utilisateurs en ligne

</p>

</div>

</div>

<div
style={{
padding:"8px 14px",
borderRadius:"40px",
background:"#DCFCE7",
fontWeight:"800",
fontSize:"12px",
color:"#16A34A",
}}
>

🟢 EN LIGNE

</div>

</div>

{/* LISTE */}

<div
style={{
display:"flex",
flexDirection:"column",
gap:"14px",
}}
>

{[

{
name:"Kevin Junior",
city:"Douala",
badge:"Premium",
icon:<FaCrown/>,
color:"#F59E0B",
online:true,
},

{
name:"Grâce N.",
city:"Yaoundé",
badge:"Client fidèle",
icon:<FaGem/>,
color:"#7C3AED",
online:true,
},

{
name:"Patrick",
city:"Bafoussam",
badge:"Client vérifié",
icon:<FaCheckCircle/>,
color:"#2563EB",
online:true,
},

{
name:"Vanessa",
city:"Garoua",
badge:"Nouveau",
icon:<FaStar/>,
color:"#16A34A",
online:false,
},

].map((user,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"22px",
padding:"16px",
display:"flex",
alignItems:"center",
justifyContent:"space-between",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"14px",
}}
>

<div
style={{
position:"relative",
}}
>

<img
src="/default-avatar.png"
alt=""
style={{
width:"60px",
height:"60px",
borderRadius:"50%",
objectFit:"cover",
}}
/>

<div
style={{
position:"absolute",
bottom:"2px",
right:"2px",
width:"14px",
height:"14px",
borderRadius:"50%",
background:user.online?"#22C55E":"#9CA3AF",
border:"2px solid #FFF",
}}
>

</div>

</div>

<div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
fontWeight:"900",
fontSize:"16px",
color:"#111827",
}}
>

{user.name}

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
marginTop:"5px",
fontSize:"13px",
color:"#6B7280",
}}
>

<FaMapMarkerAlt/>

{user.city}

</div>

</div>

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
padding:"8px 12px",
borderRadius:"40px",
background:`${user.color}15`,
color:user.color,
fontWeight:"800",
fontSize:"12px",
}}
>

{user.icon}

{user.badge}

</div>

</div>

))}

</div>

</div>

{/* ================= BADGES ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"32px",
}}
>

<div
style={{
background:"#FFFFFF",
borderRadius:"24px",
padding:"20px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"18px",
}}
>

<div
style={{
width:"48px",
height:"48px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaMedal/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"22px":"28px",
color:"#111827",
}}
>

Badges des membres

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
color:"#6B7280",
}}
>

Récompenses de la communauté.

</p>

</div>

</div>

<div
style={{
display:"grid",
gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",
gap:"14px",
}}
>

{[
{
icon:<FaCheckCircle/>,
title:"Client vérifié",
color:"#2563EB",
},

{
icon:<FaGem/>,
title:"Client fidèle",
color:"#7C3AED",
},

{
icon:<FaCrown/>,
title:"Premium",
color:"#F59E0B",
},

{
icon:<FaStar/>,
title:"Ambassadeur",
color:"#16A34A",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#F8FAFC",
borderRadius:"18px",
padding:"18px",
textAlign:"center",
}}
>

<div
style={{
width:"58px",
height:"58px",
margin:"0 auto 12px",
borderRadius:"18px",
background:`${item.color}15`,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"26px",
color:item.color,
}}
>

{item.icon}

</div>

<div
style={{
fontWeight:"800",
fontSize:"14px",
color:"#111827",
}}
>

{item.title}

</div>

</div>

))}

</div>

</div>

</div>

{/* ================= NOTIFICATIONS ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"30px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"18px",
}}
>

<div
style={{
width:"48px",
height:"48px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaBell/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"22px":"30px",
color:"#111827",
}}
>

Notifications

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
color:"#6B7280",
}}
>

Vos dernières activités.

</p>

</div>

</div>

{[
{
icon:<FaEnvelope/>,
title:"Nouvelle réponse",
text:"Kevin a répondu à votre message.",
time:"Il y a 2 min",
color:"#2563EB",
},

{
icon:<FaCheckCircle/>,
title:"Commande livrée",
text:"Vous pouvez maintenant participer au chat.",
time:"Aujourd'hui",
color:"#16A34A",
},

{
icon:<FaClock/>,
title:"Nouvelle annonce",
text:"Une promotion vient d'être publiée.",
time:"Hier",
color:"#F59E0B",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"20px",
padding:"16px",
display:"flex",
alignItems:"center",
justifyContent:"space-between",
marginBottom:"14px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"14px",
}}
>

<div
style={{
width:"52px",
height:"52px",
borderRadius:"16px",
background:`${item.color}15`,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"22px",
color:item.color,
}}
>

{item.icon}

</div>

<div>

<h3
style={{
margin:"0 0 4px",
fontWeight:"900",
fontSize:"15px",
color:"#111827",
}}
>

{item.title}

</h3>

<p
style={{
margin:0,
fontSize:"13px",
color:"#6B7280",
}}
>

{item.text}

</p>

</div>

</div>

<div
style={{
fontSize:"12px",
fontWeight:"700",
color:"#9CA3AF",
}}
>

{item.time}

</div>

</div>

))}

</div>

{/* ================= MON PROFIL ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"30px",
}}
>

<div
style={{
background:"#FFFFFF",
borderRadius:"24px",
padding:"20px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"16px",
}}
>

<img
src="/default-avatar.png"
alt=""
style={{
width:"72px",
height:"72px",
borderRadius:"50%",
objectFit:"cover",
}}
/>

<div>

<h3
style={{
margin:0,
fontWeight:"900",
fontSize:"18px",
color:"#111827",
}}
>

Votre profil

</h3>

<p
style={{
margin:"6px 0",
fontSize:"13px",
color:"#6B7280",
}}
>

Client vérifié

</p>

<div
style={{
display:"inline-flex",
alignItems:"center",
gap:"6px",
padding:"6px 12px",
borderRadius:"30px",
background:"#DCFCE7",
color:"#15803D",
fontWeight:"800",
fontSize:"12px",
}}
>

<FaCheckCircle/>

En ligne

</div>

</div>

</div>

<div
style={{
width:"48px",
height:"48px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"20px",
cursor:"pointer",
}}
>

<FaCog/>

</div>

</div>

<div
style={{
marginTop:"18px",
display:"flex",
justifyContent:"space-between",
alignItems:"center",
paddingTop:"18px",
borderTop:"1px solid #EEF2F7",
fontWeight:"800",
fontSize:"14px",
cursor:"pointer",
}}
>

Modifier mon profil

<FaChevronRight/>

</div>

</div>

</div>

{/* ================= DISCUSSION EN TEMPS RÉEL ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"30px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
marginBottom:"18px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
}}
>

<div
style={{
width:"48px",
height:"48px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaComments/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"22px":"30px",
color:"#111827",
}}
>

Discussion en direct

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
color:"#6B7280",
}}
>

Tous les messages apparaissent instantanément.

</p>

</div>

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
padding:"8px 14px",
background:"#DCFCE7",
borderRadius:"30px",
fontWeight:"800",
fontSize:"12px",
color:"#15803D",
}}
>

🟢 LIVE

</div>

</div>

{/* MESSAGES */}

<div
style={{
display:"flex",
flexDirection:"column",
gap:"14px",
}}
>

{[
{
user:"Kevin",
message:"Bonjour à tous 👋",
time:"15:20",
mine:false,
},

{
user:"Vous",
message:"Bonjour 👋",
time:"15:21",
mine:true,
},

].map((msg,index)=>(

<div
key={index}
style={{
display:"flex",
justifyContent:
msg.mine
?"flex-end"
:"flex-start",
}}
>

<div
style={{
maxWidth:"78%",
background:
msg.mine
?"#2563EB"
:"#FFFFFF",

color:
msg.mine
?"#FFFFFF"
:"#111827",

padding:"14px 16px",

borderRadius:
msg.mine
?"18px 18px 4px 18px"
:"18px 18px 18px 4px",

boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
fontWeight:"900",
fontSize:"13px",
marginBottom:"6px",
opacity:.9,
}}
>

{msg.user}

</div>

<div
style={{
fontSize:"15px",
lineHeight:"24px",
}}
>

{msg.message}

</div>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginTop:"10px",
fontSize:"11px",
opacity:.8,
}}
>

<span>{msg.time}</span>

<div
style={{
display:"flex",
gap:"10px",
fontSize:"13px",
}}
>

<FaHeart/>

<FaReply/>

</div>

</div>

</div>

</div>

))}

</div>

{/* SAISIE */}

<div
style={{
marginTop:"18px",
background:"#FFFFFF",
borderRadius:"22px",
padding:"14px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
}}
>

<FaSmile
style={{
fontSize:"20px",
color:"#6B7280",
cursor:"pointer",
}}
/>

<FaPaperclip
style={{
fontSize:"18px",
color:"#6B7280",
cursor:"pointer",
}}
/>

<FaImage
style={{
fontSize:"18px",
color:"#6B7280",
cursor:"pointer",
}}
/>

<input
type="text"
placeholder="Écrire un message..."
style={{
flex:1,
border:"none",
outline:"none",
fontSize:"15px",
background:"transparent",
}}
/>

<FaMicrophone
style={{
fontSize:"18px",
color:"#6B7280",
cursor:"pointer",
}}
/>

<button
style={{
width:"46px",
height:"46px",
border:"none",
borderRadius:"14px",
background:"#2563EB",
color:"#FFFFFF",
display:"flex",
justifyContent:"center",
alignItems:"center",
cursor:"pointer",
}}
>

<FaPaperPlane/>

</button>

</div>

</div>

</div>

{/* ================= INTERACTIONS ================= */}

<div
style={{
padding:"0 18px",
marginBottom:"30px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"18px",
}}
>

<div
style={{
width:"48px",
height:"48px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaBell/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"22px":"30px",
color:"#111827",
}}
>

Interactions

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
color:"#6B7280",
}}
>

Discutez comme sur les grandes applications.

</p>

</div>

</div>

{/* BARRE */}

<div
style={{
background:"#FFFFFF",
borderRadius:"22px",
padding:"18px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
justifyContent:"space-around",
alignItems:"center",
marginBottom:"20px",
}}
>

<FaSmile style={{fontSize:"24px",color:"#F59E0B"}}/>

<FaImage style={{fontSize:"24px",color:"#EC4899"}}/>

<FaCamera style={{fontSize:"24px",color:"#2563EB"}}/>

<FaPaperPlane style={{fontSize:"24px",color:"#16A34A"}}/>

</div>

<div
style={{
display:"flex",
justifyContent:"space-around",
alignItems:"center",
marginBottom:"20px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
fontWeight:"800",
fontSize:"14px",
color:"#EF4444",
}}
>

<FaHeart/>

128

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
fontWeight:"800",
fontSize:"14px",
color:"#2563EB",
}}
>

<FaThumbsUp/>

64

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
fontWeight:"800",
fontSize:"14px",
color:"#F59E0B",
}}
>

<FaLaugh/>

22

</div>

</div>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
paddingTop:"16px",
borderTop:"1px solid #EEF2F7",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
fontSize:"13px",
color:"#6B7280",
}}
>

<FaEye/>

Message vu par 18 personnes

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
}}
>

<FaReply
style={{
fontSize:"18px",
color:"#2563EB",
cursor:"pointer",
}}
/>

<FaEllipsisH
style={{
fontSize:"18px",
color:"#6B7280",
cursor:"pointer",
}}
/>

</div>

</div>

</div>

{/* EN TRAIN D'ÉCRIRE */}

<div
style={{
marginTop:"18px",
background:"#FFFFFF",
borderRadius:"20px",
padding:"16px",
display:"flex",
alignItems:"center",
gap:"12px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
width:"12px",
height:"12px",
borderRadius:"50%",
background:"#22C55E",
}}
>

</div>

<div
style={{
fontSize:"14px",
fontWeight:"700",
color:"#6B7280",
}}
>

Kevin est en train d'écrire...

</div>

</div>

</div>

</div>

  );

}

export default Community;