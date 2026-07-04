import { Link } from "react-router-dom";

import {
  FaChevronLeft,
  FaInfoCircle,
  FaStore,
  FaCheckCircle,
  FaGlobeAfrica,
  FaUsers,
} from "react-icons/fa";

import {
  FaShoppingCart,
  FaSearch,
  FaClipboardCheck,
  FaCogs,
  FaShieldAlt
} from "react-icons/fa";

import {
  FaTruck,
  FaHome,
  FaBuilding,
  FaMapMarkedAlt,
  FaClock,
  FaMoneyBillWave,
  FaLock
} from "react-icons/fa";

import {
  FaAward,
  FaStar,
  FaHeadset,
  FaWhatsapp,
} from "react-icons/fa";

import {
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

function Address() {

return (

<div
style={{
minHeight:"100vh",
background:"#F5F7FB",
padding:
window.innerWidth < 768
? "8px"
: "22px",
}}
>

{/* ================= HERO ================= */}

<div
style={{
background:"linear-gradient(135deg,#4B2E83,#2563EB)",

borderRadius:
window.innerWidth < 768
? "16px"
: "26px",

padding:
window.innerWidth < 768
? "16px"
: "30px",

position:"relative",

overflow:"hidden",

color:"#FFFFFF",

boxShadow:
"0 10px 28px rgba(37,99,235,.18)",

marginBottom:"14px",
}}
>

<div
style={{
position:"absolute",
top:"-55px",
right:"-55px",
width:"140px",
height:"140px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<Link
to="/"
style={{
display:"inline-flex",
alignItems:"center",
gap:"6px",
textDecoration:"none",
color:"#FFFFFF",
fontWeight:"700",
fontSize:"11px",
marginBottom:"14px",
}}
>

<FaChevronLeft />

Retour à l'accueil

</Link>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<div
style={{
width:
window.innerWidth < 768
? "48px"
: "65px",

height:
window.innerWidth < 768
? "48px"
: "65px",

borderRadius:"14px",

background:"rgba(255,255,255,.15)",

display:"flex",

justifyContent:"center",

alignItems:"center",

backdropFilter:"blur(10px)",

flexShrink:0,
}}
>

<FaInfoCircle
style={{
fontSize:
window.innerWidth < 768
? "22px"
: "34px",
}}
/>

</div>

<div>

<h1
style={{
margin:0,
fontWeight:"900",
fontSize:
window.innerWidth < 768
? "21px"
: "36px",
lineHeight:"1.1",
}}
>

À propos de KONAN SHOPPING

</h1>

<p
style={{
marginTop:"6px",
marginBottom:0,
fontSize:
window.innerWidth < 768
? "12px"
: "15px",
lineHeight:"20px",
opacity:.95,
maxWidth:"560px",
}}
>

Découvrez le fonctionnement de
<b translate="no">
{" "}KONAN SHOPPING CAMEROUN
</b>,
nos services, notre processus de commande,
la livraison et nos engagements envers nos clients.

</p>

</div>

</div>

</div>

{/* ================= QUI SOMMES-NOUS ================= */}

<div
style={{
background:"#FFFFFF",

borderRadius:
window.innerWidth < 768
? "15px"
: "20px",

padding:
window.innerWidth < 768
? "15px"
: "24px",

border:"1px solid #EEF2F7",

boxShadow:"0 3px 12px rgba(0,0,0,.04)",

marginBottom:"14px",
}}
>

<h2
style={{
margin:0,
marginBottom:"14px",

display:"flex",
alignItems:"center",
gap:"10px",

color:"#111827",

fontWeight:"800",

fontSize:
window.innerWidth < 768
? "18px"
: "22px",
}}
>

<FaStore
style={{
color:"#2563EB",
}}
/>

Qui sommes-nous ?

</h2>

<p
style={{
margin:0,

color:"#6B7280",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:"24px",
}}
>

<b translate="no">
KONAN SHOPPING CAMEROUN
</b>
est une plateforme de commerce électronique
conçue pour permettre aux clients de commander
facilement des produits de qualité tout en bénéficiant
d'un paiement uniquement à la livraison.

Notre objectif est de proposer une expérience
d'achat simple, rapide, transparente et sécurisée
pour tous nos clients au Cameroun.

</p>

</div>

{/* ================= NOS VALEURS ================= */}

<div
style={{
display:"grid",

gridTemplateColumns:
window.innerWidth < 768
? "1fr"
: "repeat(2,1fr)",

gap:"12px",

marginBottom:"16px",
}}
>

{[
{
icon:<FaUsers />,
title:"Nos clients",
text:"La satisfaction de nos clients est au cœur de chacune de nos décisions.",
},

{
icon:<FaGlobeAfrica />,
title:"Notre mission",
text:"Faciliter les achats en ligne partout au Cameroun grâce à une livraison fiable.",
},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",

borderRadius:"16px",

padding:"15px",

border:"1px solid #EEF2F7",

boxShadow:"0 3px 10px rgba(0,0,0,.04)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"10px",
}}
>

<div
style={{
width:"42px",
height:"42px",
borderRadius:"12px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"18px",
}}
>

{item.icon}

</div>

<h3
style={{
margin:0,
fontSize:"16px",
fontWeight:"800",
color:"#111827",
}}
>

{item.title}

</h3>

</div>

<p
style={{
margin:0,
color:"#6B7280",
fontSize:"13px",
lineHeight:"23px",
}}
>

{item.text}

</p>

</div>

))}

</div>

{/* ================= COMMENT COMMANDER ================= */}

<div
  style={{
    background: "#FFFFFF",

    borderRadius:
      window.innerWidth < 768
        ? "16px"
        : "20px",

    padding:
      window.innerWidth < 768
        ? "16px"
        : "24px",

    border: "1px solid #EEF2F7",

    boxShadow:
      "0 3px 12px rgba(0,0,0,.04)",

    marginBottom: "14px",
  }}
>

  <h2
    style={{
      margin: 0,

      marginBottom: "16px",

      display: "flex",

      alignItems: "center",

      gap: "10px",

      color: "#111827",

      fontWeight: "800",

      fontSize:
        window.innerWidth < 768
          ? "18px"
          : "22px",
    }}
  >

    <FaShoppingCart
      style={{
        color: "#2563EB",
      }}
    />

    Comment passer une commande ?

  </h2>

  <div
    style={{
      display: "grid",

      gap: "14px",
    }}
  >

    {[
      {
        icon: <FaSearch />,
        title: "Choisissez vos produits",
        text: "Parcourez notre catalogue et ajoutez les articles souhaités à votre panier.",
      },

      {
        icon: <FaShoppingCart />,
        title: "Validez votre panier",
        text: "Contrôlez les quantités, appliquez un coupon si disponible puis confirmez votre commande.",
      },

      {
        icon: <FaMapMarkerAlt />,
        title: "Indiquez votre adresse",
        text: "Renseignez votre numéro de téléphone ainsi que votre adresse complète de livraison.",
      },

      {
        icon: <FaClipboardCheck />,
        title: "Confirmation",
        text: "Votre commande est immédiatement enregistrée dans notre système.",
      },

    ].map((item,index)=>(

      <div
        key={index}
        style={{
          display:"flex",

          alignItems:"flex-start",

          gap:"14px",
        }}
      >

        <div
          style={{
            width:"42px",

            height:"42px",

            borderRadius:"12px",

            background:"#EEF4FF",

            display:"flex",

            justifyContent:"center",

            alignItems:"center",

            color:"#2563EB",

            flexShrink:0,

            fontSize:"18px",
          }}
        >

          {item.icon}

        </div>

        <div>

          <h3
            style={{
              margin:0,

              color:"#111827",

              fontSize:"15px",

              fontWeight:"800",
            }}
          >

            {item.title}

          </h3>

          <p
            style={{
              marginTop:"4px",

              marginBottom:0,

              color:"#6B7280",

              fontSize:"13px",

              lineHeight:"22px",
            }}
          >

            {item.text}

          </p>

        </div>

      </div>

    ))}

  </div>

</div>

{/* ================= TRAITEMENT DE LA COMMANDE ================= */}

<div
  style={{
    background:"#FFFFFF",

    borderRadius:
      window.innerWidth<768
        ? "16px"
        : "20px",

    padding:
      window.innerWidth<768
        ? "16px"
        : "24px",

    border:"1px solid #EEF2F7",

    boxShadow:"0 3px 12px rgba(0,0,0,.04)",
  }}
>

  <h2
    style={{
      margin:0,

      marginBottom:"16px",

      display:"flex",

      alignItems:"center",

      gap:"10px",

      color:"#111827",

      fontWeight:"800",

      fontSize:
        window.innerWidth<768
          ? "18px"
          : "22px",
    }}
  >

    <FaCogs
      style={{
        color:"#2563EB",
      }}
    />

    Que se passe-t-il après votre commande ?

  </h2>

  <div
    style={{
      display:"grid",

      gap:"12px",
    }}
  >

    {[
      "Votre commande est reçue par notre équipe.",

      "Nos équipes vérifient la disponibilité des produits.",

      "Les articles sont préparés et soigneusement emballés.",

      "Un livreur est affecté à votre commande.",

      "Vous êtes contacté pour confirmer votre disponibilité.",

      "La commande est livrée à l'adresse indiquée.",

      "Vous payez uniquement après réception de votre commande.",

      "Votre commande est ensuite marquée comme livrée.",
    ].map((item,index)=>(

      <div
        key={index}
        style={{
          display:"flex",

          alignItems:"center",

          gap:"12px",
        }}
      >

        <FaCheckCircle
          style={{
            color:"#22C55E",

            fontSize:"16px",

            flexShrink:0,
          }}
        />

        <span
          style={{
            color:"#4B5563",

            fontSize:"13px",

            lineHeight:"22px",
          }}
        >

          {item}

        </span>

      </div>

    ))}

  </div>

</div>

{/* ================= LIVRAISON ================= */}

<div
  style={{
    marginTop: "14px",
    background: "#FFFFFF",
    borderRadius: window.innerWidth < 768 ? "16px" : "20px",
    padding: window.innerWidth < 768 ? "16px" : "24px",
    border: "1px solid #EEF2F7",
    boxShadow: "0 3px 12px rgba(0,0,0,.04)",
    marginBottom: "14px",
  }}
>

  <h2
    style={{
      margin: 0,
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#111827",
      fontWeight: "800",
      fontSize: window.innerWidth < 768 ? "18px" : "22px",
    }}
  >

    <FaTruck
      style={{
        color: "#2563EB",
      }}
    />

    Nos modes de livraison

  </h2>

  <div
    style={{
      display: "grid",
      gap: "14px",
    }}
  >

    {[
      {
        icon: <FaHome />,
        title: "Livraison à domicile",
        text: "Nous livrons directement à votre domicile ou à l'adresse indiquée lors de votre commande.",
      },

      {
        icon: <FaBuilding />,
        title: "Livraison au bureau",
        text: "Vous pouvez choisir de recevoir votre commande sur votre lieu de travail.",
      },

      {
        icon: <FaMapMarkedAlt />,
        title: "Livraison partout au Cameroun",
        text: "Nous organisons la livraison dans plusieurs villes et régions du Cameroun selon les zones desservies.",
      },

      {
        icon: <FaClock />,
        title: "Délais de livraison",
        text: "Le délai dépend de votre localisation et vous est communiqué après la confirmation de votre commande.",
      },

    ].map((item,index)=>(

      <div
        key={index}
        style={{
          display:"flex",
          gap:"14px",
          alignItems:"flex-start",
        }}
      >

        <div
          style={{
            width:"42px",
            height:"42px",
            borderRadius:"12px",
            background:"#EEF4FF",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            color:"#2563EB",
            flexShrink:0,
            fontSize:"18px",
          }}
        >

          {item.icon}

        </div>

        <div>

          <h3
            style={{
              margin:0,
              color:"#111827",
              fontWeight:"800",
              fontSize:"15px",
            }}
          >

            {item.title}

          </h3>

          <p
            style={{
              marginTop:"4px",
              marginBottom:0,
              color:"#6B7280",
              fontSize:"13px",
              lineHeight:"22px",
            }}
          >

            {item.text}

          </p>

        </div>

      </div>

    ))}

  </div>

</div>

{/* ================= PAIEMENT ================= */}

<div
  style={{
    background:"linear-gradient(135deg,#2563EB,#4B2E83)",
    borderRadius:window.innerWidth<768?"16px":"22px",
    padding:window.innerWidth<768?"18px":"28px",
    color:"#FFFFFF",
    boxShadow:"0 12px 30px rgba(37,99,235,.18)",
  }}
>

  <div
    style={{
      display:"flex",
      alignItems:"center",
      gap:"12px",
      marginBottom:"16px",
    }}
  >

    <div
      style={{
        width:"52px",
        height:"52px",
        borderRadius:"14px",
        background:"rgba(255,255,255,.15)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
      }}
    >

      <FaMoneyBillWave
        style={{
          fontSize:"24px",
        }}
      />

    </div>

    <div>

      <h2
        style={{
          margin:0,
          fontWeight:"900",
          fontSize:
            window.innerWidth<768
              ? "20px"
              : "26px",
        }}
      >

        Paiement sécurisé

      </h2>

      <p
        style={{
          marginTop:"4px",
          marginBottom:0,
          opacity:.95,
          fontSize:"13px",
          lineHeight:"22px",
        }}
      >

        Chez KONAN SHOPPING, aucun paiement n'est demandé avant la livraison.

      </p>

    </div>

  </div>

  <div
    style={{
      display:"grid",
      gap:"12px",
    }}
  >

    {[
      "Vous commandez librement sur notre plateforme.",
      "Notre équipe confirme votre commande.",
      "Le livreur prépare votre livraison.",
      "Vous vérifiez votre commande à la réception.",
      "Le paiement est effectué uniquement à la livraison.",
      "Aucun acompte n'est exigé.",
    ].map((item,index)=>(

      <div
        key={index}
        style={{
          display:"flex",
          alignItems:"center",
          gap:"10px",
        }}
      >

        <FaCheckCircle
          style={{
            color:"#FFFFFF",
            flexShrink:0,
          }}
        />

        <span
          style={{
            fontSize:"13px",
            lineHeight:"22px",
          }}
        >

          {item}

        </span>

      </div>

    ))}

  </div>

</div>

{/* ================= NOS ENGAGEMENTS ================= */}

<div
  style={{
    marginTop: "14px",

    background: "#FFFFFF",

    borderRadius:
      window.innerWidth < 768
        ? "16px"
        : "20px",

    padding:
      window.innerWidth < 768
        ? "16px"
        : "24px",

    border: "1px solid #EEF2F7",

    boxShadow:
      "0 3px 12px rgba(0,0,0,.04)",

    marginBottom: "14px",
  }}
>

<h2
style={{
margin:0,
marginBottom:"16px",

display:"flex",
alignItems:"center",
gap:"10px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth<768
? "18px"
: "22px",
}}
>

<FaAward
style={{
color:"#2563EB",
}}
/>

Nos engagements

</h2>

<div
style={{
display:"grid",
gap:"14px",
}}
>

{[
"Produits soigneusement sélectionnés.",
"Prix transparents sans frais cachés.",
"Paiement uniquement à la livraison.",
"Livraison rapide selon votre ville.",
"Service client disponible avant et après votre achat.",
"Protection de vos données personnelles.",
].map((item,index)=>(

<div
key={index}
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<FaCheckCircle
style={{
color:"#22C55E",
fontSize:"16px",
}}
/>

<span
style={{
fontSize:"13px",
color:"#4B5563",
lineHeight:"22px",
}}
>

{item}

</span>

</div>

))}

</div>

</div>

{/* ================= POURQUOI NOUS CHOISIR ================= */}

<div
style={{
background:"#FFFFFF",

borderRadius:
window.innerWidth<768
? "16px"
: "20px",

padding:
window.innerWidth<768
? "16px"
: "24px",

border:"1px solid #EEF2F7",

boxShadow:"0 3px 12px rgba(0,0,0,.04)",

marginBottom:"14px",
}}
>

<h2
style={{
margin:0,
marginBottom:"16px",

display:"flex",
alignItems:"center",
gap:"10px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth<768
? "18px"
: "22px",
}}
>

<FaStar
style={{
color:"#2563EB",
}}
/>

Pourquoi choisir KONAN SHOPPING ?

</h2>

<div
style={{
display:"grid",

gridTemplateColumns:
window.innerWidth<768
? "1fr"
: "repeat(2,1fr)",

gap:"14px",
}}
>

{[
{
icon:<FaShieldAlt />,
title:"Fiabilité",
text:"Des produits sélectionnés auprès de vendeurs sérieux.",
},

{
icon:<FaTruck />,
title:"Livraison",
text:"Livraison rapide selon votre localisation.",
},

{
icon:<FaHeadset />,
title:"Support",
text:"Une assistance disponible pour répondre à vos questions.",
},

{
icon:<FaLock />,
title:"Sécurité",
text:"Vos informations personnelles restent protégées.",
},

].map((item,index)=>(

<div
key={index}
style={{
display:"flex",
gap:"12px",
}}
>

<div
style={{
width:"42px",
height:"42px",
borderRadius:"12px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
flexShrink:0,
fontSize:"18px",
}}
>

{item.icon}

</div>

<div>

<h3
style={{
margin:0,
fontWeight:"800",
fontSize:"15px",
color:"#111827",
}}
>

{item.title}

</h3>

<p
style={{
marginTop:"4px",
marginBottom:0,
fontSize:"13px",
lineHeight:"22px",
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

{/* ================= SERVICE CLIENT ================= */}

<div
style={{
background:"linear-gradient(135deg,#2563EB,#4B2E83)",

borderRadius:
window.innerWidth<768
? "18px"
: "22px",

padding:
window.innerWidth<768
? "20px"
: "30px",

color:"#FFFFFF",

textAlign:"center",

boxShadow:
"0 12px 30px rgba(37,99,235,.18)",
}}
>

<div
style={{
width:"60px",
height:"60px",
margin:"0 auto 16px",

borderRadius:"50%",

background:"rgba(255,255,255,.15)",

display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaHeadset
style={{
fontSize:"28px",
}}
/>

</div>

<h2
style={{
margin:0,
fontWeight:"900",
fontSize:
window.innerWidth<768
? "22px"
: "30px",
}}
>

Un service client à votre écoute

</h2>

<p
style={{
marginTop:"12px",
marginBottom:"20px",

fontSize:"13px",

lineHeight:"24px",

opacity:.95,

maxWidth:"620px",

marginInline:"auto",
}}
>

Notre équipe accompagne chaque client avant,
pendant et après la livraison afin de garantir
une expérience d'achat simple, rapide et fiable.

</p>

<a
href="https://wa.me/237694641329"

target="_blank"

rel="noreferrer"

style={{
display:"inline-flex",

alignItems:"center",

gap:"10px",

padding:"14px 24px",

background:"#FFFFFF",

color:"#2563EB",

borderRadius:"14px",

fontWeight:"800",

textDecoration:"none",

fontSize:"14px",
}}
>

<FaWhatsapp />

Contacter le service client

</a>

</div>

{/* ================= FAQ ================= */}

<div
  style={{
    marginTop: "14px",

    background: "#FFFFFF",

    borderRadius:
      window.innerWidth < 768
        ? "16px"
        : "20px",

    padding:
      window.innerWidth < 768
        ? "16px"
        : "24px",

    border: "1px solid #EEF2F7",

    boxShadow:
      "0 3px 12px rgba(0,0,0,.04)",

    marginBottom: "14px",
  }}
>

<h2
style={{
margin:0,
marginBottom:"18px",

display:"flex",
alignItems:"center",
gap:"10px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth<768
? "18px"
: "22px",
}}
>

<FaQuestionCircle
style={{
color:"#2563EB",
}}
/>

Questions fréquentes

</h2>

<div
style={{
display:"grid",
gap:"16px",
}}
>

{[
{
q:"Comment suivre ma commande ?",
r:"Après validation, notre équipe vous contacte et vous informe de l'évolution de votre livraison."
},

{
q:"Quand dois-je payer ?",
r:"Le paiement s'effectue uniquement lors de la livraison après réception de votre commande."
},

{
q:"Puis-je modifier ma commande ?",
r:"Oui, tant que la préparation de votre commande n'a pas commencé."
},

{
q:"Comment contacter KONAN SHOPPING ?",
r:"Vous pouvez nous joindre directement via WhatsApp, téléphone ou e-mail."
},

].map((item,index)=>(

<div
key={index}
style={{
paddingBottom:"14px",
borderBottom:
index!==3
?"1px solid #EEF2F7"
:"none",
}}
>

<h3
style={{
margin:0,
marginBottom:"6px",
color:"#111827",
fontWeight:"700",
fontSize:"15px",
}}
>

{item.q}

</h3>

<p
style={{
margin:0,
color:"#6B7280",
fontSize:"13px",
lineHeight:"23px",
}}
>

{item.r}

</p>

</div>

))}

</div>

</div>

{/* ================= CONTACT ================= */}

<div
style={{
background:"linear-gradient(135deg,#2563EB,#4B2E83)",

borderRadius:
window.innerWidth<768
?"18px"
:"24px",

padding:
window.innerWidth<768
?"20px"
:"30px",

color:"#FFFFFF",

boxShadow:
"0 12px 35px rgba(37,99,235,.18)",

marginBottom:"16px",
}}
>

<h2
style={{
marginTop:0,
marginBottom:"18px",
fontWeight:"900",
fontSize:
window.innerWidth<768
?"22px"
:"30px",
textAlign:"center",
}}
>

Nous contacter

</h2>

<div
style={{
display:"grid",

gridTemplateColumns:
window.innerWidth<768
?"1fr"
:"repeat(2,1fr)",

gap:"16px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<FaMapMarkerAlt
style={{
fontSize:"20px",
}}
/>

<div>

<b>Adresse</b>

<br/>

ODZA Borne 10
Yaoundé - Cameroun

</div>

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<FaPhoneAlt
style={{
fontSize:"18px",
}}
/>

<div>

<b>Téléphone</b>

<br/>

+237 694 64 13 29 / +237 6 91 01 67 20

</div>

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<FaWhatsapp
style={{
fontSize:"20px",
}}
/>

<div>

<b>WhatsApp</b>

<br/>

Disponible 7j/7

</div>

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
}}
>

<FaEnvelope
style={{
fontSize:"18px",
}}
/>

<div>

<b>Email</b>

<br/>

konanshoppingcameroun@gmail.com

</div>

</div>

</div>

<a
href="https://wa.me/237694641329"

target="_blank"

rel="noreferrer"

style={{
marginTop:"22px",

display:"flex",

justifyContent:"center",

alignItems:"center",

gap:"10px",

height:"48px",

background:"#FFFFFF",

color:"#2563EB",

textDecoration:"none",

borderRadius:"14px",

fontWeight:"800",

fontSize:"14px",
}}
>

<FaWhatsapp />

Discuter avec notre équipe

</a>

</div>

{/* ================= FOOTER ================= */}

<div
style={{
background:"#FFFFFF",

borderRadius:"18px",

padding:"18px",

border:"1px solid #EEF2F7",

boxShadow:"0 3px 12px rgba(0,0,0,.04)",

textAlign:"center",
}}
>

<p
style={{
margin:0,

fontSize:"13px",

color:"#6B7280",

lineHeight:"24px",
}}
>

<b translate="no">

KONAN SHOPPING CAMEROUN

</b>

est une plateforme de commerce électronique
spécialisée dans la vente en ligne de produits
de qualité avec un paiement sécurisé à la livraison.

<br/><br/>

© {new Date().getFullYear()}

<b translate="no">

{" "}KONAN SHOPPING CAMEROUN

</b>

<br/>

Tous droits réservés.

</p>

</div>

</div>

);

}

export default Address;