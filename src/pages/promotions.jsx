import { Link } from "react-router-dom";

import axios from "axios";

import { useState, useEffect } from "react";

import {
  FaChevronLeft,
  FaFire,
  FaClock,
  FaTags,
  FaBolt,
  FaShieldAlt,
  FaShoppingBag,
  FaCrown,
} from "react-icons/fa";

import {
  FaUsers,
  FaDownload,
} from "react-icons/fa";

import {
FaTruck,
FaMoneyBillWave,
FaUndoAlt,
FaHeadset,
FaStar,
FaCheckCircle,
} from "react-icons/fa";

function Promotions() {

  const [hours, setHours] = useState(2);

  const [minutes, setMinutes] = useState(59);

  const [seconds, setSeconds] = useState(59);

  useEffect(() => {

    const timer = setInterval(() => {

      setSeconds((prev) => {

        if (prev > 0) return prev - 1;

        setMinutes((m) => {

          if (m > 0) return m - 1;

          setHours((h) => {

            if (h > 0) return h - 1;

            return 23;

          });

          return 59;

        });

        return 59;

      });

    },1000);

    return ()=>clearInterval(timer);

  },[]);

  const cities = [
  "Yaoundé",
  "Douala",
  "Bafoussam",
  "Garoua",
  "Bertoua",
  "Kribi",
  "Ebolowa",
  "Ngaoundéré",
  "Limbe",
  "Buea",
];

const firstNames = [
  "Jean",
  "Marie",
  "Paul",
  "Kevin",
  "Sarah",
  "David",
  "Aline",
  "Brice",
  "Vanessa",
  "Junior",
];

   const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {

  axios
    .get("https://konanshopping-production.up.railway.app/products")
    .then((res) => {

      setProducts(res.data);

      setLoading(false);

    })
    .catch((err) => {

      console.log(err);

      setLoading(false);

    });

}, []);

const [notification, setNotification] = useState(null);

useEffect(() => {

  if(products.length===0) return;

  const interval = setInterval(()=>{

    const product =
      products[
        Math.floor(Math.random()*products.length)
      ];

    const city =
      cities[
        Math.floor(Math.random()*cities.length)
      ];

    const person =
      firstNames[
        Math.floor(Math.random()*firstNames.length)
      ];

    const minutesAgo =
      Math.floor(Math.random()*5)+1;

    setNotification({
      product,
      city,
      person,
      minutesAgo,
    });

  },4000);

  return ()=>clearInterval(interval);

},[products]);

const [stats, setStats] = useState({
  users: 12458,
  downloads: 8392,
  orders: 2654,
  satisfaction: 98,
});

useEffect(() => {

  const interval = setInterval(() => {

    setStats((prev)=>({

      users: prev.users + Math.floor(Math.random()*2),

      downloads: prev.downloads + Math.floor(Math.random()*2),

      orders: prev.orders + Math.floor(Math.random()*2),

      satisfaction:98,

    }));

  },6000);

  return ()=>clearInterval(interval);

},[]);


 return (

<div
style={{
minHeight:"100vh",
width:"100%",
background:"#F8FAFD",
overflowX:"hidden",
padding:window.innerWidth<768?"0":"24px",
}}
>

{/* ================= HERO ================= */}

<div
style={{
position:"relative",
overflow:"hidden",
background:"#FFFFFF",
borderRadius:window.innerWidth<768?"0":"30px",
padding:
window.innerWidth<768
?"22px 18px 30px"
:"40px",
boxShadow:
"0 10px 40px rgba(37,99,235,.08)",
}}
>

{/* CERCLES */}

<div
style={{
position:"absolute",
top:"-130px",
right:"-110px",
width:"340px",
height:"340px",
borderRadius:"50%",
background:"rgba(37,99,235,.05)",
}}
/>

<div
style={{
position:"absolute",
top:"30px",
right:"40px",
width:"8px",
height:"8px",
borderRadius:"50%",
background:"#7EA8FF",
}}
/>

<div
style={{
position:"absolute",
top:"80px",
right:"140px",
width:"6px",
height:"6px",
borderRadius:"50%",
background:"#A7C4FF",
}}
/>

{/* RETOUR */}

<Link
to="/account"
style={{
display:"inline-flex",
alignItems:"center",
gap:"8px",
textDecoration:"none",
color:"#0F172A",
fontWeight:"800",
fontSize:"17px",
marginBottom:"28px",
}}
>

<FaChevronLeft
style={{
fontSize:"20px",
}}
/>

Retour

</Link>

{/* CONTENU */}

<div
style={{
display:"flex",
flexDirection:
window.innerWidth<768
?"column"
:"row",
alignItems:"center",
justifyContent:"space-between",
gap:"30px",
}}
>

{/* TEXTE */}

<div
style={{
flex:1,
maxWidth:"520px",
}}
>

<div
style={{
display:"inline-flex",
alignItems:"center",
gap:"8px",
padding:"10px 18px",
borderRadius:"40px",
background:"#EEF4FF",
color:"#2563EB",
fontWeight:"900",
fontSize:"13px",
marginBottom:"22px",
}}
>

<FaBolt/>

OFFRES FLASH

</div>

<h1
style={{
margin:0,
fontSize:
window.innerWidth<768
?"48px"
:"56px",
fontWeight:"900",
lineHeight:"1.05",
color:"#07133B",
}}
>

Offres promotionnelles

<br/>

<span
style={{
color:"#2563EB",
}}
>

exclusives

</span>

</h1>

<div
style={{
width:"55px",
height:"4px",
borderRadius:"20px",
background:"#2563EB",
margin:"22px 0",
}}
/>

<p
style={{
margin:0,
fontSize:"18px",
lineHeight:"34px",
color:"#374151",
}}
>

Découvrez chaque jour des offres exceptionnelles sur une sélection de produits KONAN SHOPPING.

<br/><br/>

Les promotions sont disponibles pour une durée limitée.

<b
style={{
color:"#2563EB",
}}
>

 Ne les manquez pas !

</b>

</p>

{/* BADGES */}

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"18px",
marginTop:"35px",
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
width:"52px",
height:"52px",
borderRadius:"50%",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"20px",
}}
>

<FaTags/>

</div>

<div>

<div
style={{
fontWeight:"700",
color:"#111827",
}}
>

Réductions

</div>

<div
style={{
fontWeight:"900",
color:"#2563EB",
}}
>

jusqu'à 70%

</div>

</div>

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
}}
>

<div
style={{
width:"52px",
height:"52px",
borderRadius:"50%",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"20px",
}}
>

<FaShieldAlt/>

</div>

<div>

<div
style={{
fontWeight:"700",
}}
>

Paiement

</div>

<div
style={{
fontWeight:"900",
color:"#2563EB",
}}
>

à la livraison

</div>

</div>

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
}}
>

<div
style={{
width:"52px",
height:"52px",
borderRadius:"50%",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"20px",
}}
>

<FaShoppingBag/>

</div>

<div>

<div
style={{
fontWeight:"700",
}}
>

Produits

</div>

<div
style={{
fontWeight:"900",
color:"#2563EB",
}}
>

sélectionnés

</div>

</div>

</div>

</div>

</div>

{/* IMAGE */}

<div
style={{
flex:1,
display:"flex",
justifyContent:"center",
}}
>

<img
src="/promotion-hero.png"
alt="Promotion"
style={{
width:"100%",
maxWidth:"470px",
objectFit:"contain",
}}
/>

</div>

</div>

{/* ================= FIN DES PROMOTIONS ================= */}

<div
style={{
marginTop:"34px",
marginBottom:"30px",
background:"linear-gradient(135deg,#0D5BFF,#2563EB)",
borderRadius:"28px",
padding:
window.innerWidth<768
?"22px 18px"
:"34px",
position:"relative",
overflow:"hidden",
boxShadow:"0 20px 45px rgba(37,99,235,.28)",
}}
>

{/* REFLETS */}

<div
style={{
position:"absolute",
right:"-120px",
top:"-80px",
width:"280px",
height:"280px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<div
style={{
position:"absolute",
right:"60px",
bottom:"-40px",
width:"220px",
height:"220px",
borderRadius:"50%",
background:"rgba(255,255,255,.05)",
}}
/>

{/* TITRE */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
marginBottom:"24px",
color:"#FFFFFF",
fontWeight:"900",
fontSize:
window.innerWidth<768
?"24px"
:"30px",
}}
>

<div
style={{
width:"46px",
height:"46px",
borderRadius:"50%",
background:"rgba(255,255,255,.15)",
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaClock
style={{
fontSize:"22px",
}}
/>

</div>

Fin des promotions

</div>

{/* CONTENU */}

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
gap:"20px",
flexWrap:
window.innerWidth<768
?"nowrap"
:"wrap",
}}
>

{/* TIMER */}

<div
style={{
display:"flex",
alignItems:"center",
gap:
window.innerWidth<768
?"10px"
:"18px",
}}
>

{[
{
value:hours,
label:"HEURES",
},

{
value:minutes,
label:"MINUTES",
},

{
value:seconds,
label:"SECONDES",
},

].map((item,index)=>(

<div
key={index}
style={{
display:"flex",
alignItems:"center",
gap:"10px",
}}
>

<div
style={{
width:
window.innerWidth<768
?"86px"
:"110px",

height:
window.innerWidth<768
?"110px"
:"130px",

background:"#FFFFFF",

borderRadius:"22px",

display:"flex",

flexDirection:"column",

justifyContent:"center",

alignItems:"center",

boxShadow:"0 12px 30px rgba(0,0,0,.18)",
}}
>

<div
style={{
fontSize:
window.innerWidth<768
?"52px"
:"64px",

fontWeight:"900",

color:"#0D5BFF",

lineHeight:1,
}}
>

{String(item.value).padStart(2,"0")}

</div>

<div
style={{
marginTop:"12px",
fontWeight:"700",
fontSize:"14px",
color:"#4B5563",
}}
>

{item.label}

</div>

</div>

{index<2 && (

<div
style={{
fontSize:"48px",
fontWeight:"900",
color:"#FFFFFF",
marginBottom:"24px",
}}
>

:

</div>

)}

</div>

))}

</div>

{/* ICÔNE */}

<div
style={{
display:
window.innerWidth<768
?"none"
:"flex",

justifyContent:"center",

alignItems:"center",

flex:1,
}}
>

<div
style={{
width:"170px",
height:"170px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaTags
style={{
fontSize:"80px",
color:"rgba(255,255,255,.18)",
}}
/>

</div>

</div>

</div>

</div>

{/* ================= NOTIFICATION ACHAT ================= */}

{notification && (

<div
style={{
marginBottom:"28px",
background:"#FFFFFF",
borderRadius:"24px",
padding:
window.innerWidth<768
?"16px"
:"20px",
display:"flex",
alignItems:"center",
justifyContent:"space-between",
gap:"16px",
boxShadow:"0 10px 35px rgba(15,23,42,.08)",
border:"1px solid #EEF2F7",
}}
>

{/* IMAGE */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"16px",
flex:1,
}}
>

<img
src={notification.product.image}
alt={notification.product.name}
style={{
width:
window.innerWidth<768
?"74px"
:"88px",
height:
window.innerWidth<768
?"74px"
:"88px",
borderRadius:"18px",
objectFit:"cover",
background:"#F8FAFC",
flexShrink:0,
}}
/>

{/* TEXTE */}

<div
style={{
flex:1,
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
marginBottom:"6px",
}}
>

<div
style={{
width:"28px",
height:"28px",
borderRadius:"50%",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaShoppingBag
style={{
color:"#2563EB",
fontSize:"14px",
}}
/>

</div>

<span
style={{
fontWeight:"900",
fontSize:
window.innerWidth<768
?"18px"
:"20px",
color:"#111827",
}}
>

Nouvelle commande

</span>

</div>

<p
style={{
margin:"0",
fontSize:
window.innerWidth<768
?"17px"
:"18px",
fontWeight:"600",
lineHeight:"30px",
color:"#374151",
}}
>

<b>{notification.person}</b>

{" "}à{" "}

<b>{notification.city}</b>

vient d'acheter

</p>

<div
style={{
marginTop:"4px",
fontWeight:"900",
fontSize:
window.innerWidth<768
?"18px"
:"19px",
color:"#2563EB",
}}
>

{notification.product.name}

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
marginTop:"10px",
color:"#6B7280",
fontSize:"14px",
}}
>

<FaClock/>

Il y a {notification.minutesAgo} minutes

</div>

</div>

</div>

{/* ETAT */}

<div
style={{
display:"flex",
alignItems:"center",
justifyContent:"center",
paddingLeft:"10px",
}}
>

<div
style={{
width:"16px",
height:"16px",
borderRadius:"50%",
background:"#22C55E",
boxShadow:"0 0 12px rgba(34,197,94,.5)",
}}
/>

</div>

</div>

)}

{/* ================= PRODUITS EN PROMOTION ================= */}

<div
style={{
marginBottom:"34px",
}}
>

{/* HEADER */}

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
width:"40px",
height:"40px",
borderRadius:"50%",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaFire
style={{
color:"#2563EB",
fontSize:"20px",
}}
/>

</div>

<h2
style={{
margin:0,
fontSize:
window.innerWidth<768
?"28px"
:"32px",
fontWeight:"900",
color:"#111827",
}}
>

Promotions du jour

</h2>

</div>

<Link
to="/boutique"
style={{
textDecoration:"none",
display:"flex",
alignItems:"center",
gap:"8px",
color:"#2563EB",
fontWeight:"800",
fontSize:"16px",
}}
>

Voir tout

<FaChevronLeft
style={{
transform:"rotate(180deg)",
}}
/>

</Link>

</div>

{/* LISTE */}

<div
style={{
display:"grid",
gridTemplateColumns:
window.innerWidth<768
?"repeat(2,1fr)"
:"repeat(auto-fill,minmax(280px,1fr))",
gap:"18px",
}}
>

{products.map((product,index)=>{

const reduction=[20,25,30,35,40,50][index%6];

const oldPrice=Math.round(
product.price/(1-reduction/100)
);

return(

<Link
key={product._id}
to={`/product/${product._id}`}
style={{
textDecoration:"none",
}}
>

<div
style={{
background:"#FFFFFF",
borderRadius:"24px",
overflow:"hidden",
boxShadow:"0 10px 30px rgba(15,23,42,.08)",
border:"1px solid #EEF2F7",
transition:".3s",
}}
>

{/* IMAGE */}

<div
style={{
position:"relative",
background:"#F8FAFC",
}}
>

<img
src={product.image}
alt={product.name}
style={{
width:"100%",
height:
window.innerWidth<768
?"220px"
:"280px",
objectFit:"cover",
}}
/>

{/* REDUCTION */}

<div
style={{
position:"absolute",
top:"14px",
left:"14px",
background:"#2563EB",
color:"#FFFFFF",
padding:"8px 14px",
borderRadius:"12px",
fontWeight:"900",
fontSize:"14px",
}}
>

-{reduction}%

</div>

{/* FAVORI */}

<div
style={{
position:"absolute",
top:"14px",
right:"14px",
width:"46px",
height:"46px",
borderRadius:"50%",
background:"#FFFFFF",
display:"flex",
justifyContent:"center",
alignItems:"center",
boxShadow:"0 8px 20px rgba(0,0,0,.10)",
}}
>

<FaTags
style={{
fontSize:"18px",
color:"#6B7280",
}}
/>

</div>

</div>

{/* INFOS */}

<div
style={{
padding:"18px",
}}
>

<h3
style={{
margin:"0 0 14px",
fontSize:"22px",
fontWeight:"900",
color:"#111827",
overflow:"hidden",
whiteSpace:"nowrap",
textOverflow:"ellipsis",
}}
>

{product.name}

</h3>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"18px",
}}
>

<span
style={{
fontSize:"28px",
fontWeight:"900",
color:"#2563EB",
}}
>

{product.price.toLocaleString()} FCFA

</span>

<span
style={{
fontSize:"18px",
textDecoration:"line-through",
color:"#9CA3AF",
}}
>

{oldPrice.toLocaleString()} FCFA

</span>

</div>

<button
style={{
width:"100%",
height:"52px",
border:"none",
borderRadius:"16px",
background:"linear-gradient(135deg,#2563EB,#1D4ED8)",
color:"#FFFFFF",
fontWeight:"900",
fontSize:"16px",
cursor:"pointer",
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:"10px",
}}
>

<FaShoppingBag/>

Voir le produit

</button>

</div>

</div>

</Link>

);

})}

</div>

</div>

{/* ================= STATISTIQUES ================= */}

<div
style={{
marginBottom:"34px",
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
width:"42px",
height:"42px",
borderRadius:"50%",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaUsers
style={{
color:"#2563EB",
fontSize:"18px",
}}
/>

</div>

<h2
style={{
margin:0,
fontSize:
window.innerWidth<768
?"28px"
:"34px",
fontWeight:"900",
color:"#111827",
}}
>

KONAN SHOPPING

</h2>

</div>

</div>

<div
style={{
display:"grid",
gridTemplateColumns:
window.innerWidth<768
?"repeat(2,1fr)"
:"repeat(4,1fr)",
gap:"16px",
}}
>

{[
{
icon:<FaUsers/>,
title:"Clients",
value:stats.users.toLocaleString(),
color:"#2563EB",
},

{
icon:<FaShoppingBag/>,
title:"Commandes",
value:stats.orders.toLocaleString(),
color:"#16A34A",
},

{
icon:<FaDownload/>,
title:"Téléchargements",
value:stats.downloads.toLocaleString(),
color:"#7C3AED",
},

{
icon:<FaStar/>,
title:"Satisfaction",
value:`${stats.satisfaction}%`,
color:"#F59E0B",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"24px",
padding:"22px",
textAlign:"center",
border:"1px solid #EEF2F7",
boxShadow:"0 10px 30px rgba(15,23,42,.06)",
}}
>

<div
style={{
width:"60px",
height:"60px",
margin:"0 auto 16px",
borderRadius:"50%",
background:`${item.color}15`,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"24px",
color:item.color,
}}
>

{item.icon}

</div>

<h3
style={{
margin:"0",
fontSize:"28px",
fontWeight:"900",
color:"#111827",
}}
>

{item.value}

</h3>

<p
style={{
marginTop:"8px",
fontSize:"14px",
fontWeight:"700",
color:"#6B7280",
}}
>

{item.title}

</p>

</div>

))}

</div>

</div>

{/* ================= NOS ENGAGEMENTS ================= */}

<div
style={{
marginBottom:"34px",
}}
>

<h2
style={{
marginBottom:"20px",
fontWeight:"900",
fontSize:
window.innerWidth<768
?"28px"
:"34px",
color:"#111827",
}}
>

Pourquoi choisir KONAN SHOPPING ?

</h2>

<div
style={{
display:"grid",
gridTemplateColumns:
window.innerWidth<768
?"repeat(2,1fr)"
:"repeat(4,1fr)",
gap:"16px",
}}
>

{[
{
icon:<FaTruck/>,
title:"Livraison rapide",
color:"#2563EB",
},

{
icon:<FaMoneyBillWave/>,
title:"Paiement à la livraison",
color:"#16A34A",
},

{
icon:<FaShieldAlt/>,
title:"Paiement sécurisé",
color:"#7C3AED",
},

{
icon:<FaHeadset/>,
title:"Support 7j/7",
color:"#F59E0B",
},

{
icon:<FaUndoAlt/>,
title:"Retour facile",
color:"#EF4444",
},

{
icon:<FaCheckCircle/>,
title:"Produits vérifiés",
color:"#0EA5E9",
},

{
icon:<FaFire/>,
title:"Promotions",
color:"#EC4899",
},

{
icon:<FaCrown/>,
title:"Qualité Premium",
color:"#FACC15",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"24px",
padding:"22px",
textAlign:"center",
border:"1px solid #EEF2F7",
boxShadow:"0 10px 25px rgba(15,23,42,.06)",
}}
>

<div
style={{
width:"60px",
height:"60px",
margin:"0 auto 18px",
borderRadius:"50%",
background:`${item.color}15`,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"24px",
color:item.color,
}}
>

{item.icon}

</div>

<h3
style={{
margin:"0",
fontWeight:"900",
fontSize:"16px",
color:"#111827",
}}
>

{item.title}

</h3>

</div>

))}

</div>

</div>

{/* ================= BANNIÈRE PREMIUM ================= */}

<div
style={{
background:"linear-gradient(135deg,#2563EB,#1E3A8A)",
borderRadius:"30px",
padding:
window.innerWidth<768
?"28px"
:"48px",
color:"#FFFFFF",
textAlign:"center",
marginBottom:"30px",
boxShadow:"0 20px 45px rgba(37,99,235,.25)",
}}
>

<div
style={{
width:"80px",
height:"80px",
margin:"0 auto 20px",
borderRadius:"50%",
background:"rgba(255,255,255,.18)",
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaCrown
style={{
fontSize:"40px",
color:"#FFD54A",
}}
/>

</div>

<h2
style={{
margin:"0",
fontWeight:"900",
fontSize:
window.innerWidth<768
?"30px"
:"42px",
}}
>

Profitez des meilleures offres

</h2>

<p
style={{
margin:"16px auto 24px",
maxWidth:"650px",
lineHeight:"30px",
fontSize:"16px",
opacity:.95,
}}
>

Des milliers de clients font confiance à
<b translate="no"> KONAN SHOPPING CAMEROUN</b>.
Profitez de nos offres exclusives avec un paiement uniquement à la livraison.

</p>

<Link
to="/boutique"
style={{
display:"inline-flex",
alignItems:"center",
justifyContent:"center",
gap:"10px",
padding:"16px 30px",
background:"#FFFFFF",
color:"#2563EB",
textDecoration:"none",
fontWeight:"900",
fontSize:"16px",
borderRadius:"18px",
}}
>

<FaShoppingBag/>

Découvrir les promotions

</Link>

</div>

{/* ================= FOOTER ================= */}

<footer
style={{
marginTop:"32px",
marginBottom:
window.innerWidth<768
?"90px"
:"20px",
background:"#FFFFFF",
borderRadius:"30px",
padding:
window.innerWidth<768
?"28px 20px"
:"40px",
boxShadow:"0 10px 35px rgba(15,23,42,.06)",
border:"1px solid #EEF2F7",
}}
>

{/* LOGO */}

<div
style={{
display:"flex",
flexDirection:"column",
alignItems:"center",
}}
>

<img
src="/logo.jpg"
alt="Logo"
style={{
width:"72px",
height:"72px",
borderRadius:"22px",
objectFit:"cover",
boxShadow:"0 8px 20px rgba(37,99,235,.15)",
}}
/>

<h2
translate="no"
style={{
marginTop:"16px",
marginBottom:"8px",
fontSize:
window.innerWidth<768
?"28px"
:"34px",
fontWeight:"900",
color:"#111827",
}}
>

KONAN SHOPPING

</h2>

<p
style={{
margin:0,
textAlign:"center",
maxWidth:"600px",
fontSize:"15px",
lineHeight:"28px",
color:"#6B7280",
}}
>

Des milliers de Camerounais nous font confiance pour acheter
leurs produits au meilleur prix avec une livraison rapide
et un paiement uniquement à la livraison.

</p>

</div>

{/* LIENS */}

<div
style={{
marginTop:"30px",
display:"flex",
justifyContent:"center",
flexWrap:"wrap",
gap:"18px",
}}
>

<Link
to="/boutique"
style={{
textDecoration:"none",
fontWeight:"800",
color:"#2563EB",
display:"flex",
alignItems:"center",
gap:"8px",
}}
>

<FaShoppingBag/>

Boutique

</Link>

<Link
to="/conditions"
style={{
textDecoration:"none",
fontWeight:"800",
color:"#2563EB",
display:"flex",
alignItems:"center",
gap:"8px",
}}
>

<FaCheckCircle/>

Conditions

</Link>

<Link
to="/privacy-policy"
style={{
textDecoration:"none",
fontWeight:"800",
color:"#2563EB",
display:"flex",
alignItems:"center",
gap:"8px",
}}
>

<FaShieldAlt/>

Confidentialité

</Link>

<a
href="https://wa.me/237694641329"
target="_blank"
rel="noreferrer"
style={{
textDecoration:"none",
fontWeight:"800",
color:"#16A34A",
display:"flex",
alignItems:"center",
gap:"8px",
}}
>

<FaHeadset/>

WhatsApp

</a>

</div>

{/* BANDEAU */}

<div
style={{
marginTop:"30px",
padding:"18px",
borderRadius:"18px",
background:"#F8FAFC",
display:"flex",
justifyContent:"space-around",
flexWrap:"wrap",
gap:"16px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
fontWeight:"800",
color:"#2563EB",
}}
>

<FaTruck/>

Livraison rapide

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
fontWeight:"800",
color:"#16A34A",
}}
>

<FaMoneyBillWave/>

Paiement livraison

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
fontWeight:"800",
color:"#F59E0B",
}}
>

<FaStar/>

Service Premium

</div>

</div>

{/* COPYRIGHT */}

<div
style={{
marginTop:"30px",
paddingTop:"20px",
borderTop:"1px solid #E5E7EB",
textAlign:"center",
}}
>

<p
style={{
margin:0,
fontSize:"13px",
color:"#9CA3AF",
lineHeight:"26px",
}}
>

© {new Date().getFullYear()}{" "}
<b translate="no">KONAN SHOPPING CAMEROUN</b>

<br/>

Tous droits réservés.

</p>

</div>


</footer>

</div>

</div>
);

}

export default Promotions;