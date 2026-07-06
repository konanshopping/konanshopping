import { Link } from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import {

  FaArrowLeft,

  FaMoneyBillWave,

  FaTruck,

  FaShieldAlt,

  FaMobileAlt,

  FaCreditCard,

  FaCheckCircle,

  FaLock,

  FaHeadset,

  FaQuestionCircle,

  FaStore,

  FaChevronRight,

  FaClock,

  FaBoxOpen,

  FaInfoCircle,

  FaWallet,

  FaUniversity,

  FaReceipt,

} from "react-icons/fa";

function Paiement() {

const [isMobile, setIsMobile] =
useState(window.innerWidth < 768);

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

return (

<div
style={{
minHeight:"100vh",

width:"100%",

background:"#F6F9FF",

overflowX:"hidden",

padding:
isMobile
?"0"
:"24px",
}}
>

{/* ================= HEADER + HERO ================= */}

<div
style={{
position:"relative",
overflow:"hidden",
background:"linear-gradient(135deg,#2563EB,#1E3A8A)",
borderRadius:isMobile?"0":"34px",
padding:isMobile?"24px 20px 36px":"50px",
color:"#FFFFFF",
boxShadow:"0 20px 45px rgba(37,99,235,.22)",
}}
>

{/* CERCLES */}

<div
style={{
position:"absolute",
top:"-150px",
right:"-120px",
width:"320px",
height:"320px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<div
style={{
position:"absolute",
bottom:"-90px",
left:"-80px",
width:"220px",
height:"220px",
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
gap:"10px",
textDecoration:"none",
color:"#FFFFFF",
fontWeight:"900",
fontSize:"16px",
marginBottom:"35px",
position:"relative",
zIndex:2,
}}
>

<FaArrowLeft/>

Retour

</Link>

{/* CONTENU */}

<div
style={{
display:"flex",
flexDirection:isMobile?"column":"row",
justifyContent:"space-between",
alignItems:"center",
gap:isMobile?"28px":"50px",
position:"relative",
zIndex:2,
}}
>

{/* TEXTE */}

<div
style={{
flex:1,
width:"100%",
}}
>

<div
style={{
display:"inline-flex",
alignItems:"center",
gap:"10px",
padding:"10px 18px",
borderRadius:"50px",
background:"rgba(255,255,255,.12)",
fontWeight:"900",
fontSize:"13px",
marginBottom:"20px",
}}
>

<FaShieldAlt/>

PAIEMENT SÉCURISÉ

</div>

<h1
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"34px":"56px",
lineHeight:"1.1",
}}
>

Paiement simple

<br/>

<span
style={{
color:"#BFDBFE",
}}
>

et sécurisé

</span>

</h1>

<p
style={{
marginTop:"22px",
fontSize:"16px",
lineHeight:"30px",
opacity:.96,
maxWidth:"620px",
}}
>

Chez <b>KONAN SHOPPING CAMEROUN</b>, vous payez uniquement après réception de votre commande. Vérifiez votre colis avant de remettre votre paiement.

</p>

<Link
to="/boutique"
style={{
marginTop:"30px",
display:"inline-flex",
alignItems:"center",
justifyContent:"center",
gap:"10px",
padding:"16px 28px",
background:"#FFFFFF",
color:"#2563EB",
fontWeight:"900",
textDecoration:"none",
borderRadius:"18px",
boxShadow:"0 10px 25px rgba(0,0,0,.12)",
}}
>

<FaStore/>

Découvrir la boutique

</Link>

</div>

{/* ICÔNE */}

<div
style={{
width:isMobile?"120px":"170px",
height:isMobile?"120px":"170px",
borderRadius:"35px",
background:"rgba(255,255,255,.12)",
display:"flex",
justifyContent:"center",
alignItems:"center",
backdropFilter:"blur(12px)",
}}
>

<FaMoneyBillWave
style={{
fontSize:isMobile?"58px":"82px",
color:"#FFD54A",
}}
/>

</div>

</div>

</div>

{/* ================= PAIEMENT PRINCIPAL ================= */}

<div
style={{
marginTop:"30px",
marginBottom:"34px",
}}
>

<div
style={{
background:"#FFFFFF",

borderRadius:isMobile?"24px":"30px",

padding:isMobile?"22px":"34px",

border:"1px solid #E8EEF9",

boxShadow:"0 12px 35px rgba(15,23,42,.06)",
}}
>

{/* HEADER */}

<div
style={{
display:"flex",

justifyContent:"space-between",

alignItems:isMobile?"flex-start":"center",

flexDirection:isMobile?"column":"row",

gap:"18px",

marginBottom:"26px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"16px",
}}
>

<div
style={{
width:isMobile?"68px":"80px",

height:isMobile?"68px":"80px",

borderRadius:"22px",

background:"#EEF4FF",

display:"flex",

justifyContent:"center",

alignItems:"center",

color:"#2563EB",

fontSize:isMobile?"30px":"38px",
}}
>

<FaTruck/>

</div>

<div>

<h2
style={{
margin:0,

fontSize:isMobile?"24px":"34px",

fontWeight:"900",

color:"#111827",
}}
>

Paiement à la livraison

</h2>

<p
style={{
marginTop:"8px",

marginBottom:0,

fontSize:"15px",

lineHeight:"28px",

color:"#6B7280",
}}
>

Payez uniquement lorsque votre commande
vous est remise.

</p>

</div>

</div>

<div
style={{
padding:"10px 18px",

borderRadius:"40px",

background:"#DCFCE7",

display:"flex",

alignItems:"center",

gap:"8px",

fontWeight:"900",

color:"#15803D",

fontSize:"14px",
}}
>

<FaCheckCircle/>

Disponible

</div>

</div>

{/* CONTENU */}

<div
style={{
display:"grid",

gridTemplateColumns:
isMobile
?"1fr"
:"repeat(2,1fr)",

gap:"18px",
}}
>

{[
{
icon:<FaBoxOpen/>,
title:"Vérifiez votre colis",
text:"Contrôlez votre commande avant de payer.",
color:"#2563EB",
},

{
icon:<FaMoneyBillWave/>,
title:"Paiement après réception",
text:"Aucun paiement n'est demandé avant la livraison.",
color:"#16A34A",
},

{
icon:<FaShieldAlt/>,
title:"Paiement sécurisé",
text:"Une solution simple et fiable pour tous nos clients.",
color:"#7C3AED",
},

{
icon:<FaHeadset/>,
title:"Assistance",
text:"Notre équipe reste disponible avant et après votre commande.",
color:"#F59E0B",
},

].map((item,index)=>(

<div
key={index}
style={{
display:"flex",

alignItems:"flex-start",

gap:"14px",

padding:"18px",

background:"#F8FAFD",

borderRadius:"18px",

border:"1px solid #EEF2F7",
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

color:item.color,

fontSize:"22px",

flexShrink:0,
}}
>

{item.icon}

</div>

<div>

<h3
style={{
margin:"0 0 6px",

fontWeight:"900",

fontSize:"16px",

color:"#111827",
}}
>

{item.title}

</h3>

<p
style={{
margin:0,

fontSize:"14px",

lineHeight:"24px",

color:"#6B7280",
}}
>

{item.text}

</p>

</div>

</div>

))}

</div>

</div>

</div>

{/* ================= AUTRES MOYENS DE PAIEMENT ================= */}

<div
style={{
marginBottom:"36px",
}}
>

{/* TITRE */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
marginBottom:"22px",
}}
>

<div
style={{
width:"52px",
height:"52px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaWallet/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"26px":"34px",
color:"#111827",
}}
>

Autres moyens de paiement

</h2>

<p
style={{
margin:"6px 0 0",
fontSize:"14px",
color:"#6B7280",
}}
>

De nouvelles solutions seront bientôt disponibles.

</p>

</div>

</div>

{/* CARTES */}

<div
style={{
display:"grid",

gridTemplateColumns:
isMobile
?"1fr"
:"repeat(3,1fr)",

gap:"18px",
}}
>

{[

{

icon:<FaMobileAlt/>,

title:"Orange Money",

status:"Bientôt disponible",

color:"#F97316",

bg:"#FFF7ED",

},

{

icon:<FaMobileAlt/>,

title:"MTN Mobile Money",

status:"Bientôt disponible",

color:"#FACC15",

bg:"#FEFCE8",

},

{

icon:<FaCreditCard/>,

title:"Carte bancaire",

status:"Bientôt disponible",

color:"#2563EB",

bg:"#EEF4FF",

},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",

borderRadius:"24px",

padding:"24px",

border:"1px solid #E5E7EB",

boxShadow:"0 8px 25px rgba(15,23,42,.05)",

transition:".3s",
}}
>

<div
style={{
width:"70px",
height:"70px",
borderRadius:"20px",
background:item.bg,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"30px",
color:item.color,
marginBottom:"18px",
}}
>

{item.icon}

</div>

<h3
style={{
margin:"0 0 10px",
fontWeight:"900",
fontSize:"20px",
color:"#111827",
}}
>

{item.title}

</h3>

<p
style={{
margin:"0 0 20px",
fontSize:"14px",
lineHeight:"24px",
color:"#6B7280",
}}
>

Ce moyen de paiement sera bientôt disponible sur KONAN SHOPPING.

</p>

<div
style={{
display:"inline-flex",
alignItems:"center",
gap:"8px",
padding:"10px 16px",
borderRadius:"40px",
background:"#FEF3C7",
color:"#92400E",
fontWeight:"800",
fontSize:"13px",
}}
>

<FaClock/>

{item.status}

</div>

</div>

))}

</div>

</div>

{/* ================= COMMENT ÇA FONCTIONNE ? ================= */}

<div
style={{
marginBottom:"38px",
}}
>

{/* TITRE */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
marginBottom:"24px",
}}
>

<div
style={{
width:"52px",
height:"52px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaInfoCircle/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"26px":"34px",
color:"#111827",
}}
>

Comment ça fonctionne ?

</h2>

<p
style={{
margin:"6px 0 0",
fontSize:"14px",
color:"#6B7280",
}}
>

Achetez en quelques étapes simples.

</p>

</div>

</div>

{/* ÉTAPES */}

<div
style={{
display:"grid",

gridTemplateColumns:
isMobile
?"1fr"
:"repeat(4,1fr)",

gap:"18px",
}}
>

{[

{
icon:<FaStore/>,
step:"01",
title:"Passez votre commande",
text:"Choisissez vos produits et confirmez votre commande.",
color:"#2563EB",
},

{
icon:<FaBoxOpen/>,
step:"02",
title:"Préparation",
text:"Notre équipe prépare soigneusement votre colis.",
color:"#7C3AED",
},

{
icon:<FaTruck/>,
step:"03",
title:"Livraison",
text:"Le livreur vous contacte puis vous remet votre colis.",
color:"#16A34A",
},

{
icon:<FaMoneyBillWave/>,
step:"04",
title:"Paiement",
text:"Vérifiez votre commande puis payez le livreur.",
color:"#F59E0B",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",

borderRadius:"24px",

padding:"24px",

border:"1px solid #EEF2F7",

boxShadow:"0 8px 25px rgba(15,23,42,.05)",

position:"relative",

overflow:"hidden",
}}
>

<div
style={{
position:"absolute",
top:"16px",
right:"18px",
fontSize:"38px",
fontWeight:"900",
color:"#EEF2F7",
}}
>

{item.step}

</div>

<div
style={{
width:"64px",
height:"64px",
borderRadius:"18px",
background:`${item.color}15`,
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"28px",
color:item.color,
marginBottom:"18px",
}}
>

{item.icon}

</div>

<h3
style={{
margin:"0 0 10px",
fontSize:"18px",
fontWeight:"900",
color:"#111827",
}}
>

{item.title}

</h3>

<p
style={{
margin:0,
fontSize:"14px",
lineHeight:"24px",
color:"#6B7280",
}}
>

{item.text}

</p>

</div>

))}

</div>

</div>

{/* ================= POURQUOI CHOISIR KONAN SHOPPING ================= */}

<div
style={{
marginBottom:"40px",
}}
>

{/* TITRE */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
marginBottom:"24px",
}}
>

<div
style={{
width:"52px",
height:"52px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaShieldAlt/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"26px":"34px",
color:"#111827",
}}
>

Pourquoi choisir KONAN SHOPPING ?

</h2>

<p
style={{
margin:"6px 0 0",
fontSize:"14px",
color:"#6B7280",
}}
>

Achetez en toute confiance avec nos engagements.

</p>

</div>

</div>

{/* CARTES */}

<div
style={{
display:"grid",

gridTemplateColumns:
isMobile
?"repeat(2,1fr)"
:"repeat(4,1fr)",

gap:"18px",
}}
>

{[

{
icon:<FaShieldAlt/>,
title:"Paiement sécurisé",
color:"#2563EB",
},

{
icon:<FaCheckCircle/>,
title:"Vérification avant paiement",
color:"#16A34A",
},

{
icon:<FaTruck/>,
title:"Livraison rapide",
color:"#F59E0B",
},

{
icon:<FaHeadset/>,
title:"Support 7j/7",
color:"#7C3AED",
},

{
icon:<FaLock/>,
title:"Protection des données",
color:"#DC2626",
},

{
icon:<FaMoneyBillWave/>,
title:"Paiement à la livraison",
color:"#0891B2",
},

{
icon:<FaClock/>,
title:"Traitement rapide",
color:"#EC4899",
},

{
icon:<FaStore/>,
title:"Service Premium",
color:"#F97316",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",

borderRadius:"22px",

padding:
isMobile
?"18px"
:"24px",

border:"1px solid #EEF2F7",

boxShadow:"0 8px 22px rgba(15,23,42,.05)",

textAlign:"center",

transition:".3s",
}}
>

<div
style={{
width:
isMobile
?"56px"
:"64px",

height:
isMobile
?"56px"
:"64px",

margin:"0 auto 16px",

borderRadius:"18px",

background:`${item.color}15`,

display:"flex",

justifyContent:"center",

alignItems:"center",

fontSize:
isMobile
?"24px"
:"28px",

color:item.color,
}}
>

{item.icon}

</div>

<h3
style={{
margin:0,
fontWeight:"800",
fontSize:
isMobile
?"14px"
:"16px",
color:"#111827",
lineHeight:"24px",
}}
>

{item.title}

</h3>

</div>

))}

</div>

</div>

{/* ================= QUESTIONS FRÉQUENTES ================= */}

<div
style={{
marginBottom:"40px",
}}
>

{/* TITRE */}

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
marginBottom:"24px",
}}
>

<div
style={{
width:"52px",
height:"52px",
borderRadius:"16px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"22px",
}}
>

<FaQuestionCircle/>

</div>

<div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"26px":"34px",
color:"#111827",
}}
>

Questions fréquentes

</h2>

<p
style={{
margin:"6px 0 0",
fontSize:"14px",
color:"#6B7280",
}}
>

Tout ce que vous devez savoir avant de payer.

</p>

</div>

</div>

{/* FAQ */}

<div
style={{
display:"flex",
flexDirection:"column",
gap:"18px",
}}
>

{[

{

question:"Quand dois-je payer ma commande ?",

answer:"Le paiement s'effectue uniquement lors de la livraison, après vérification de votre colis.",

icon:<FaMoneyBillWave/>,

},

{

question:"Puis-je vérifier mon colis avant de payer ?",

answer:"Oui. Vous pouvez contrôler votre commande avant de remettre votre paiement au livreur.",

icon:<FaBoxOpen/>,

},

{

question:"Quels moyens de paiement acceptez-vous ?",

answer:"Actuellement, le paiement à la livraison est disponible. Orange Money, MTN Mobile Money et les cartes bancaires seront bientôt disponibles.",

icon:<FaCreditCard/>,

},

{

question:"Mes informations sont-elles sécurisées ?",

answer:"Oui. Vos données personnelles sont protégées et utilisées uniquement pour le traitement de votre commande.",

icon:<FaLock/>,

},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"22px",
padding:isMobile?"20px":"26px",
border:"1px solid #EEF2F7",
boxShadow:"0 8px 22px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"14px",
marginBottom:"14px",
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
color:"#2563EB",
fontSize:"22px",
flexShrink:0,
}}
>

{item.icon}

</div>

<h3
style={{
margin:0,
fontWeight:"900",
fontSize:isMobile?"16px":"18px",
color:"#111827",
lineHeight:"26px",
}}
>

{item.question}

</h3>

</div>

<p
style={{
margin:0,
paddingLeft:isMobile?"0":"64px",
fontSize:"15px",
lineHeight:"28px",
color:"#6B7280",
}}
>

{item.answer}

</p>

</div>

))}

</div>

</div>

{/* ================= BANNIÈRE PREMIUM ================= */}

<div
style={{
marginBottom:"36px",

background:"linear-gradient(135deg,#2563EB,#1E3A8A)",

borderRadius:isMobile?"28px":"34px",

padding:
isMobile
?"28px 22px"
:"50px",

textAlign:"center",

position:"relative",

overflow:"hidden",

color:"#FFFFFF",

boxShadow:"0 20px 50px rgba(37,99,235,.25)",
}}
>

{/* REFLETS */}

<div
style={{
position:"absolute",
top:"-120px",
left:"-120px",
width:"260px",
height:"260px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<div
style={{
position:"absolute",
bottom:"-100px",
right:"-90px",
width:"220px",
height:"220px",
borderRadius:"50%",
background:"rgba(255,255,255,.05)",
}}
/>

{/* ICÔNE */}

<div
style={{
width:
isMobile
?"82px"
:"100px",

height:
isMobile
?"82px"
:"100px",

margin:"0 auto 22px",

borderRadius:"24px",

background:"rgba(255,255,255,.15)",

display:"flex",

justifyContent:"center",

alignItems:"center",

backdropFilter:"blur(12px)",

position:"relative",

zIndex:2,
}}
>

<FaStore
style={{
fontSize:
isMobile
?"40px"
:"50px",

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
isMobile
?"30px"
:"46px",

position:"relative",

zIndex:2,
}}
>

Achetez en toute confiance

</h2>

{/* TEXTE */}

<p
style={{
margin:"18px auto 28px",

maxWidth:"700px",

fontSize:
isMobile
?"16px"
:"18px",

lineHeight:"30px",

opacity:.95,

position:"relative",

zIndex:2,
}}
>

Des milliers de Camerounais font déjà confiance à

<b translate="no">
{" "}KONAN SHOPPING CAMEROUN
</b>

pour leurs achats.

Profitez d'une livraison rapide,

d'un paiement uniquement à la livraison

et d'un service client toujours disponible.

</p>

{/* BADGES */}

<div
style={{
display:"flex",

justifyContent:"center",

flexWrap:"wrap",

gap:"12px",

marginBottom:"30px",

position:"relative",

zIndex:2,
}}
>

{[
{
icon:<FaShieldAlt/>,
text:"Paiement sécurisé",
},

{
icon:<FaTruck/>,
text:"Livraison rapide",
},

{
icon:<FaCheckCircle/>,
text:"Service fiable",
},

].map((item,index)=>(

<div
key={index}
style={{
display:"flex",
alignItems:"center",
gap:"8px",
padding:"10px 18px",
borderRadius:"40px",
background:"rgba(255,255,255,.15)",
fontWeight:"800",
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
isMobile
?"16px 28px"
:"18px 34px",

background:"#FFFFFF",

color:"#2563EB",

fontWeight:"900",

fontSize:
isMobile
?"15px"
:"17px",

textDecoration:"none",

borderRadius:"18px",

boxShadow:"0 10px 30px rgba(0,0,0,.18)",

position:"relative",

zIndex:2,
}}
>

<FaStore/>

Découvrir la boutique

<FaChevronRight/>

</Link>

</div>

{/* ================= FOOTER ================= */}

<footer
style={{
marginTop:"20px",

marginBottom:
isMobile
?"90px"
:"20px",

background:"#FFFFFF",

borderRadius:
isMobile
?"28px 28px 0 0"
:"32px",

padding:
isMobile
?"30px 22px"
:"45px",

border:"1px solid #EEF2F7",

boxShadow:"0 10px 35px rgba(15,23,42,.06)",
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
width:
isMobile
?"78px"
:"90px",

height:
isMobile
?"78px"
:"90px",

borderRadius:"22px",

objectFit:"cover",

boxShadow:"0 10px 25px rgba(37,99,235,.15)",
}}
/>

<h2
translate="no"
style={{
marginTop:"18px",
marginBottom:"8px",

fontWeight:"900",

fontSize:
isMobile
?"28px"
:"36px",

color:"#111827",
}}
>

KONAN SHOPPING

</h2>

<p
style={{
margin:0,

maxWidth:"650px",

textAlign:"center",

fontSize:"15px",

lineHeight:"28px",

color:"#6B7280",
}}
>

Votre boutique en ligne de confiance au Cameroun.

Profitez d'une livraison rapide,

d'un paiement uniquement à la livraison

et d'un service client disponible 7j/7.

</p>

</div>

{/* LIENS */}

<div
style={{
marginTop:"34px",

display:"flex",

justifyContent:"center",

flexWrap:"wrap",

gap:"18px",
}}
>

<Link
to="/boutique"
style={{
display:"flex",
alignItems:"center",
gap:"8px",
textDecoration:"none",
fontWeight:"800",
color:"#2563EB",
}}
>

<FaStore/>

Boutique

</Link>

<Link
to="/promotions"
style={{
display:"flex",
alignItems:"center",
gap:"8px",
textDecoration:"none",
fontWeight:"800",
color:"#2563EB",
}}
>

<FaMoneyBillWave/>

Promotions

</Link>

<Link
to="/conditions"
style={{
display:"flex",
alignItems:"center",
gap:"8px",
textDecoration:"none",
fontWeight:"800",
color:"#2563EB",
}}
>

<FaCheckCircle/>

Conditions

</Link>

<Link
to="/privacy-policy"
style={{
display:"flex",
alignItems:"center",
gap:"8px",
textDecoration:"none",
fontWeight:"800",
color:"#2563EB",
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
display:"flex",
alignItems:"center",
gap:"8px",
textDecoration:"none",
fontWeight:"800",
color:"#16A34A",
}}
>

<FaHeadset/>

WhatsApp

</a>

</div>

{/* BANDEAU */}

<div
style={{
marginTop:"34px",

padding:"20px",

borderRadius:"20px",

background:"#F8FAFC",

display:"grid",

gridTemplateColumns:
isMobile
?"repeat(2,1fr)"
:"repeat(4,1fr)",

gap:"16px",
}}
>

{[
{
icon:<FaTruck/>,
text:"Livraison rapide",
color:"#2563EB",
},

{
icon:<FaMoneyBillWave/>,
text:"Paiement livraison",
color:"#16A34A",
},

{
icon:<FaShieldAlt/>,
text:"Paiement sécurisé",
color:"#7C3AED",
},

{
icon:<FaHeadset/>,
text:"Support 7j/7",
color:"#F59E0B",
},

].map((item,index)=>(

<div
key={index}
style={{
display:"flex",
alignItems:"center",
justifyContent:"center",
gap:"8px",
fontWeight:"800",
fontSize:"14px",
color:item.color,
textAlign:"center",
}}
>

{item.icon}

{item.text}

</div>

))}

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

lineHeight:"26px",

color:"#9CA3AF",
}}
>

© {new Date().getFullYear()}{" "}

<b translate="no">
KONAN SHOPPING CAMEROUN
</b>

<br/>

Tous droits réservés.

</p>

</div>

</footer>

</div>

);

}

export default Paiement;