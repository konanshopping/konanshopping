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
FaGift,
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
background:"#F5F7FB",
padding:
window.innerWidth<768
?"10px"
:"24px",
}}
>

{/* ================= HERO ================= */}

<div
style={{
position:"relative",

overflow:"hidden",

background:
"linear-gradient(135deg,#4B2E83,#2563EB)",

borderRadius:
window.innerWidth<768
?"20px"
:"30px",

padding:
window.innerWidth<768
?"18px"
:"34px",

boxShadow:
"0 18px 45px rgba(37,99,235,.18)",

marginBottom:"18px",

color:"#FFFFFF",
}}
>

{/* REFLETS */}

<div
style={{
position:"absolute",
top:"-70px",
right:"-70px",
width:"180px",
height:"180px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<div
style={{
position:"absolute",
bottom:"-70px",
left:"-70px",
width:"150px",
height:"150px",
borderRadius:"50%",
background:"rgba(255,255,255,.05)",
}}
/>

{/* RETOUR */}

<Link
to="/account"
style={{
display:"inline-flex",
alignItems:"center",
gap:"7px",
textDecoration:"none",
color:"#FFFFFF",
fontWeight:"700",
fontSize:"12px",
marginBottom:"18px",
}}
>

<FaChevronLeft/>

Retour

</Link>

{/* CONTENU */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"14px",
}}
>

<div
style={{
width:
window.innerWidth<768
?"60px"
:"76px",

height:
window.innerWidth<768
?"60px"
:"76px",

borderRadius:"18px",

background:"rgba(255,255,255,.16)",

display:"flex",

justifyContent:"center",

alignItems:"center",

backdropFilter:"blur(12px)",

flexShrink:0,
}}
>

<FaGift
style={{
fontSize:
window.innerWidth<768
?"28px"
:"38px",

color:"#FFD54A",
}}
/>

</div>

<div
style={{
flex:1,
}}
>

<div
style={{
display:"inline-flex",
alignItems:"center",
gap:"6px",
padding:"6px 12px",
borderRadius:"50px",
background:"rgba(255,255,255,.14)",
fontSize:"11px",
fontWeight:"800",
marginBottom:"10px",
}}
>

<FaFire/>

OFFRES FLASH

</div>

<h1
style={{
margin:0,

fontWeight:"900",

lineHeight:"1.1",

fontSize:
window.innerWidth<768
?"24px"
:"42px",
}}
>

Promotions exclusives

</h1>

<p
style={{
marginTop:"8px",

marginBottom:0,

fontSize:
window.innerWidth<768
?"13px"
:"16px",

lineHeight:"22px",

maxWidth:"560px",

opacity:.95,
}}
>

Découvrez chaque jour des offres exceptionnelles sur une sélection de produits KONAN SHOPPING. Les promotions sont disponibles pour une durée limitée.

</p>

</div>

</div>

{/* ================= BADGES ================= */}

<div
style={{
display:"flex",

flexWrap:"wrap",

gap:"10px",

marginTop:"18px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
padding:"8px 12px",
borderRadius:"50px",
background:"rgba(255,255,255,.15)",
fontSize:"12px",
fontWeight:"700",
}}
>

<FaBolt color="#FFD54A"/>

Réductions jusqu'à 70%

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
padding:"8px 12px",
borderRadius:"50px",
background:"rgba(255,255,255,.15)",
fontSize:"12px",
fontWeight:"700",
}}
>

<FaShoppingBag/>

Produits sélectionnés

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"6px",
padding:"8px 12px",
borderRadius:"50px",
background:"rgba(255,255,255,.15)",
fontSize:"12px",
fontWeight:"700",
}}
>

<FaShieldAlt/>

Paiement à la livraison

</div>

</div>

{/* ================= COMPTE À REBOURS ================= */}

<div
style={{
marginTop:"22px",

padding:
window.innerWidth<768
?"15px"
:"20px",

background:"rgba(255,255,255,.14)",

borderRadius:"18px",

backdropFilter:"blur(10px)",

border:"1px solid rgba(255,255,255,.18)",
}}
>

<div
style={{
display:"flex",

justifyContent:"space-between",

alignItems:"center",

flexWrap:"wrap",

gap:"12px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
fontWeight:"800",
}}
>

<FaClock/>

Fin des promotions

</div>

<div
style={{
display:"flex",
gap:"8px",
}}
>

{[
{value:hours,label:"H"},
{value:minutes,label:"M"},
{value:seconds,label:"S"},
].map((item,index)=>(

<div
key={index}
style={{
width:
window.innerWidth<768
?"65px"
:"78px",

padding:"10px",

background:"#FFFFFF",

borderRadius:"14px",

textAlign:"center",
}}
>

<div
style={{
fontSize:
window.innerWidth<768
?"22px"
:"28px",

fontWeight:"900",

color:"#2563EB",
}}
>

{String(item.value).padStart(2,"0")}

</div>

<div
style={{
fontSize:"11px",

fontWeight:"700",

color:"#6B7280",
}}
>

{item.label}

</div>

</div>

))}

</div>

</div>

</div>

{/* ================= PRODUITS EN PROMOTION ================= */}

<div
  style={{
    marginTop: "22px",
    marginBottom: "22px",
  }}
>

  {/* TITRE */}

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
      flexWrap: "wrap",
      gap: "10px",
    }}
  >

    <div>

      <h2
        style={{
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#111827",
          fontWeight: "900",
          fontSize:
            window.innerWidth < 768
              ? "20px"
              : "26px",
        }}
      >

        <FaFire
          style={{
            color: "#EF4444",
          }}
        />

        Promotions du jour

      </h2>

      <p
        style={{
          margin: "4px 0 0",
          color: "#6B7280",
          fontSize: "13px",
        }}
      >

        Offres limitées jusqu'à épuisement des stocks.

      </p>

    </div>

    <div
      style={{
        background: "#EEF2FF",
        color: "#2563EB",
        padding: "8px 14px",
        borderRadius: "30px",
        fontWeight: "800",
        fontSize: "12px",
      }}
    >

      Jusqu'à -70%

    </div>

  </div>

  {/* LISTE PRODUITS */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        window.innerWidth < 768
          ? "repeat(2,1fr)"
          : "repeat(auto-fill,minmax(240px,1fr))",
      gap: "14px",
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
          borderRadius:"18px",
          overflow:"hidden",
          border:"1px solid #EEF2F7",
          boxShadow:"0 4px 15px rgba(0,0,0,.05)",
          transition:".25s",
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
                ?"160px"
                :"220px",
              objectFit:"cover",
            }}
          />

          {/* BADGE */}

          <div
            style={{
              position:"absolute",
              top:"10px",
              left:"10px",
              background:"#EF4444",
              color:"#FFFFFF",
              padding:"6px 10px",
              borderRadius:"30px",
              fontSize:"11px",
              fontWeight:"800",
            }}
          >

            -{reduction}%

          </div>

          {/* FLASH */}

          <div
            style={{
              position:"absolute",
              top:"10px",
              right:"10px",
              width:"34px",
              height:"34px",
              borderRadius:"50%",
              background:"rgba(255,255,255,.92)",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
            }}
          >

            <FaBolt
              color="#F59E0B"
            />

          </div>

        </div>

        {/* INFOS */}

        <div
          style={{
            padding:"14px",
          }}
        >

          <h3
            style={{
              margin:0,
              color:"#111827",
              fontWeight:"800",
              fontSize:"14px",
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
              gap:"8px",
              marginTop:"10px",
            }}
          >

            <span
              style={{
                color:"#2563EB",
                fontWeight:"900",
                fontSize:"18px",
              }}
            >

              {product.price.toLocaleString()} FCFA

            </span>

            <span
              style={{
                textDecoration:"line-through",
                color:"#9CA3AF",
                fontSize:"12px",
              }}
            >

              {oldPrice.toLocaleString()} FCFA

            </span>

          </div>

          <button
            style={{
              marginTop:"14px",
              width:"100%",
              height:"42px",
              border:"none",
              borderRadius:"12px",
              background:
              "linear-gradient(135deg,#2563EB,#4B2E83)",
              color:"#FFFFFF",
              fontWeight:"800",
              cursor:"pointer",
            }}
          >

            Voir le produit

          </button>

        </div>

      </div>

      </Link>

      );

    })}

  </div>

</div>

{/* ================= NOTIFICATION ACHAT ================= */}

{notification && (

<div
style={{
position:"fixed",

bottom:
window.innerWidth<768
?"95px"
:"30px",

left:
window.innerWidth<768
?"12px"
:"30px",

zIndex:99999,

maxWidth:
window.innerWidth<768
?"310px"
:"360px",

background:"#FFFFFF",

borderRadius:"18px",

padding:"12px",

display:"flex",

alignItems:"center",

gap:"12px",

border:"1px solid #E5E7EB",

boxShadow:
"0 12px 30px rgba(0,0,0,.15)",

animation:"fadeIn .4s ease",
}}
>

<img
src={notification.product.image}
alt=""
style={{
width:"54px",
height:"54px",
borderRadius:"12px",
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
marginBottom:"4px",
}}
>

<FaShoppingBag
style={{
color:"#2563EB",
fontSize:"13px",
}}
/>

<span
style={{
fontWeight:"800",
fontSize:"12px",
color:"#111827",
}}
>

Nouvelle commande

</span>

</div>

<p
style={{
margin:0,
fontSize:"12px",
lineHeight:"18px",
color:"#4B5563",
}}
>

<b>{notification.person}</b> à{" "}

<b>{notification.city}</b>

vient d'acheter

<b>
{" "}
{notification.product.name}
</b>

</p>

<div
style={{
marginTop:"5px",
display:"flex",
alignItems:"center",
gap:"6px",
fontSize:"11px",
color:"#9CA3AF",
}}
>

<FaClock/>

Il y a {notification.minutesAgo} min

</div>

</div>

<div
style={{
width:"10px",
height:"10px",
borderRadius:"50%",
background:"#22C55E",
}}
/>

</div>

)}

{/* ================= STATISTIQUES ================= */}

<div
style={{
marginTop:"24px",
marginBottom:"24px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
marginBottom:"14px",
}}
>

<h2
style={{
margin:0,
display:"flex",
alignItems:"center",
gap:"8px",
fontWeight:"900",
fontSize:
window.innerWidth<768
?"20px"
:"26px",
color:"#111827",
}}
>

<FaUsers color="#2563EB"/>

KONAN SHOPPING en chiffres

</h2>

</div>

<div
style={{
display:"grid",

gridTemplateColumns:
window.innerWidth<768
?"repeat(2,1fr)"
:"repeat(4,1fr)",

gap:"14px",
}}
>

{[
{
icon:<FaUsers/>,
value:stats.users.toLocaleString(),
label:"Utilisateurs",
color:"#2563EB",
},

{
icon:<FaDownload/>,
value:stats.downloads.toLocaleString(),
label:"Téléchargements",
color:"#7C3AED",
},

{
icon:<FaCheckCircle/>,
value:stats.orders.toLocaleString(),
label:"Commandes",
color:"#16A34A",
},

{
icon:<FaStar/>,
value:`${stats.satisfaction}%`,
label:"Satisfaction",
color:"#F59E0B",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",

borderRadius:"18px",

padding:
window.innerWidth<768
?"16px"
:"22px",

border:"1px solid #EEF2F7",

boxShadow:"0 4px 15px rgba(0,0,0,.05)",

textAlign:"center",
}}
>

<div
style={{
width:"52px",
height:"52px",
margin:"0 auto 12px",
borderRadius:"50%",
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

<h3
style={{
margin:"0",
fontWeight:"900",
fontSize:
window.innerWidth<768
?"22px"
:"28px",
color:"#111827",
}}
>

{item.value}

</h3>

<p
style={{
margin:"6px 0 0",
fontSize:"13px",
color:"#6B7280",
fontWeight:"600",
}}
>

{item.label}

</p>

</div>

))}

</div>

</div>

{/* ================= POURQUOI CHOISIR KONAN SHOPPING ================= */}

<div
style={{
marginTop:"26px",
marginBottom:"26px",
}}
>

<div
style={{
marginBottom:"16px",
}}
>

<h2
style={{
margin:0,
display:"flex",
alignItems:"center",
gap:"8px",
fontWeight:"900",
fontSize:
window.innerWidth<768
?"20px"
:"26px",
color:"#111827",
}}
>

<FaShieldAlt
style={{
color:"#2563EB",
}}
/>

Pourquoi choisir KONAN SHOPPING ?

</h2>

<p
style={{
marginTop:"6px",
marginBottom:0,
fontSize:"13px",
color:"#6B7280",
lineHeight:"22px",
}}
>

Achetez en toute confiance grâce à nos engagements envers chaque client.

</p>

</div>

<div
style={{
display:"grid",

gridTemplateColumns:
window.innerWidth<768
?"repeat(2,1fr)"
:"repeat(4,1fr)",

gap:"14px",
}}
>

{[
{
icon:<FaTruck/>,
title:"Livraison rapide",
text:"Livraison rapide partout au Cameroun.",
color:"#2563EB",
},

{
icon:<FaMoneyBillWave/>,
title:"Paiement",
text:"Paiement uniquement à la livraison.",
color:"#16A34A",
},

{
icon:<FaUndoAlt/>,
title:"Remboursement",
text:"Retour possible selon nos conditions.",
color:"#F59E0B",
},

{
icon:<FaHeadset/>,
title:"Support 7j/7",
text:"Notre équipe vous accompagne.",
color:"#7C3AED",
},

{
icon:<FaShieldAlt/>,
title:"Sécurité",
text:"Vos données sont protégées.",
color:"#DC2626",
},

{
icon:<FaCheckCircle/>,
title:"Qualité",
text:"Produits soigneusement sélectionnés.",
color:"#0891B2",
},

{
icon:<FaGift/>,
title:"Promotions",
text:"Des offres chaque semaine.",
color:"#EC4899",
},

{
icon:<FaStar/>,
title:"Clients satisfaits",
text:"Des milliers de clients nous font confiance.",
color:"#FACC15",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",

border:"1px solid #EEF2F7",

borderRadius:"18px",

padding:
window.innerWidth<768
?"16px"
:"22px",

boxShadow:
"0 5px 16px rgba(0,0,0,.05)",

textAlign:"center",

transition:".25s",
}}
>

<div
style={{
width:"56px",

height:"56px",

margin:"0 auto 14px",

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
margin:"0 0 8px",

fontSize:"15px",

fontWeight:"800",

color:"#111827",
}}
>

{item.title}

</h3>

<p
style={{
margin:0,

fontSize:"12px",

lineHeight:"20px",

color:"#6B7280",
}}
>

{item.text}

</p>

</div>

))}

</div>

</div>

{/* ================= BANNIÈRE FINALE ================= */}

<div
style={{
marginTop:"26px",
marginBottom:"28px",

background:"linear-gradient(135deg,#2563EB,#4B2E83)",

borderRadius:
window.innerWidth<768
?"20px"
:"28px",

padding:
window.innerWidth<768
?"22px 18px"
:"38px",

color:"#FFFFFF",

textAlign:"center",

position:"relative",

overflow:"hidden",

boxShadow:"0 18px 45px rgba(37,99,235,.20)",
}}
>

{/* REFLETS */}

<div
style={{
position:"absolute",
top:"-70px",
left:"-70px",
width:"180px",
height:"180px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<div
style={{
position:"absolute",
bottom:"-80px",
right:"-80px",
width:"200px",
height:"200px",
borderRadius:"50%",
background:"rgba(255,255,255,.05)",
}}
/>

{/* ICÔNE */}

<div
style={{
width:
window.innerWidth<768
?"70px"
:"86px",

height:
window.innerWidth<768
?"70px"
:"86px",

margin:"0 auto 18px",

borderRadius:"50%",

background:"rgba(255,255,255,.15)",

display:"flex",

justifyContent:"center",

alignItems:"center",

backdropFilter:"blur(12px)",
}}
>

<FaGift
style={{
fontSize:
window.innerWidth<768
?"34px"
:"42px",

color:"#FFD54A",
}}
/>

</div>

{/* TITRE */}

<h2
style={{
margin:0,

fontWeight:"900",

fontSize:
window.innerWidth<768
?"24px"
:"38px",
}}
>

Profitez des meilleures offres

</h2>

<p
style={{
margin:"14px auto 22px",

maxWidth:"650px",

fontSize:
window.innerWidth<768
?"14px"
:"17px",

lineHeight:"28px",

opacity:.95,
}}
>

Des milliers de clients commandent déjà sur
<b translate="no"> KONAN SHOPPING CAMEROUN</b>.
Ne manquez pas nos promotions limitées et bénéficiez
de prix exceptionnels avec un paiement uniquement à la livraison.

</p>

{/* BADGES */}

<div
style={{
display:"flex",

justifyContent:"center",

flexWrap:"wrap",

gap:"12px",

marginBottom:"24px",
}}
>

{[
{
icon:<FaUsers/>,
text:"+12 000 utilisateurs",
},

{
icon:<FaShoppingBag/>,
text:"+2 500 commandes",
},

{
icon:<FaStar/>,
text:"98% satisfaction",
},

].map((item,index)=>(

<div
key={index}
style={{
display:"flex",
alignItems:"center",
gap:"8px",
padding:"10px 16px",
borderRadius:"30px",
background:"rgba(255,255,255,.15)",
fontWeight:"700",
fontSize:"13px",
}}
>

{item.icon}

{item.text}

</div>

))}

</div>

{/* BOUTON */}

<Link
to="/boutique"
style={{
display:"inline-flex",

alignItems:"center",

justifyContent:"center",

gap:"10px",

padding:
window.innerWidth<768
?"14px 24px"
:"16px 30px",

borderRadius:"16px",

background:"#FFFFFF",

color:"#2563EB",

textDecoration:"none",

fontWeight:"900",

fontSize:
window.innerWidth<768
?"14px"
:"16px",

boxShadow:"0 10px 25px rgba(0,0,0,.18)",
}}
>

<FaShoppingBag />

Découvrir les promotions

</Link>

</div>

{/* ================= BANDEAU DE CONFIANCE ================= */}

<div
style={{
marginBottom:"20px",
display:"grid",
gridTemplateColumns:
window.innerWidth<768
?"repeat(2,1fr)"
:"repeat(4,1fr)",
gap:"12px",
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

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
border:"1px solid #EEF2F7",
borderRadius:"16px",
padding:"16px",
display:"flex",
alignItems:"center",
gap:"10px",
boxShadow:"0 4px 12px rgba(0,0,0,.04)",
}}
>

<div
style={{
width:"42px",
height:"42px",
borderRadius:"50%",
background:`${item.color}15`,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"18px",
color:item.color,
flexShrink:0,
}}
>

{item.icon}

</div>

<div
style={{
fontWeight:"700",
fontSize:"13px",
color:"#111827",
lineHeight:"20px",
}}
>

{item.title}

</div>

</div>

))}

</div>

{/* ================= FOOTER ================= */}

<div
style={{
background:"#FFFFFF",
borderRadius:"20px",
padding:
window.innerWidth<768
?"20px 16px"
:"30px",
border:"1px solid #EEF2F7",
boxShadow:"0 4px 15px rgba(0,0,0,.04)",
textAlign:"center",
}}
>

<div
style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:"10px",
marginBottom:"12px",
}}
>

<img
src="/logo.jpg"
alt="Logo"
style={{
width:"42px",
height:"42px",
borderRadius:"12px",
objectFit:"cover",
}}
/>

<h2
translate="no"
style={{
margin:0,
fontWeight:"900",
fontSize:"20px",
color:"#111827",
}}
>

KONAN SHOPPING

</h2>

</div>

<p
style={{
margin:"0 auto 18px",
maxWidth:"520px",
fontSize:"13px",
lineHeight:"22px",
color:"#6B7280",
}}
>

Des promotions exclusives chaque semaine, une livraison rapide partout au Cameroun et un paiement uniquement à la livraison.

</p>

<div
style={{
display:"flex",
justifyContent:"center",
flexWrap:"wrap",
gap:"10px",
marginBottom:"18px",
}}
>

<Link
to="/privacy-policy"
style={{
textDecoration:"none",
color:"#2563EB",
fontWeight:"700",
fontSize:"13px",
}}
>

Politique de confidentialité

</Link>

<span style={{color:"#D1D5DB"}}>|</span>

<Link
to="/conditions"
style={{
textDecoration:"none",
color:"#2563EB",
fontWeight:"700",
fontSize:"13px",
}}
>

Conditions d'achat

</Link>

<span style={{color:"#D1D5DB"}}>|</span>

<a
href="https://wa.me/237694641329"
target="_blank"
rel="noreferrer"
style={{
textDecoration:"none",
color:"#16A34A",
fontWeight:"700",
fontSize:"13px",
}}
>

WhatsApp

</a>

</div>

<div
style={{
height:"1px",
background:"#EEF2F7",
marginBottom:"14px",
}}
/>

<p
style={{
margin:0,
fontSize:"12px",
color:"#9CA3AF",
lineHeight:"22px",
}}
>

© {new Date().getFullYear()} <b translate="no">KONAN SHOPPING CAMEROUN</b>

<br/>

Tous droits réservés.

</p>

</div>

</div>

</div>

);

}

export default Promotions;