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
padding:isMobile?"0":"24px",
}}
>

{/* ================= HERO ================= */}

<div
style={{
position:"relative",
overflow:"hidden",

background:"linear-gradient(135deg,#2563EB,#1E40AF)",

borderRadius:isMobile?"0":"32px",

padding:isMobile?"18px 18px 28px":"46px",

color:"#FFF",

boxShadow:"0 14px 40px rgba(37,99,235,.18)",
}}
>

{/* BULLES */}

<div
style={{
position:"absolute",
top:"-140px",
right:"-110px",
width:"260px",
height:"260px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<div
style={{
position:"absolute",
bottom:"-80px",
left:"-70px",
width:"180px",
height:"180px",
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
gap:"8px",
color:"#FFF",
textDecoration:"none",
fontWeight:"800",
fontSize:"15px",
marginBottom:"22px",
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

gap:isMobile?"20px":"40px",

position:"relative",

zIndex:2,
}}
>

{/* TEXTE */}

<div
style={{
flex:1,
}}
>

<div
style={{
display:"inline-flex",

alignItems:"center",

gap:"8px",

padding:"8px 15px",

borderRadius:"50px",

background:"rgba(255,255,255,.12)",

fontWeight:"800",

fontSize:"12px",

marginBottom:"18px",
}}
>

<FaShieldAlt/>

PAIEMENT SÉCURISÉ

</div>

<h1
style={{
margin:0,

fontSize:isMobile?"30px":"54px",

fontWeight:"900",

lineHeight:"1.12",

letterSpacing:"-.5px",
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
marginTop:"18px",

fontSize:"15px",

lineHeight:"28px",

maxWidth:"520px",

opacity:.95,
}}
>

Chez <b>KONAN SHOPPING CAMEROUN</b>, payez uniquement après réception de votre commande.

Vérifiez votre colis avant de remettre votre paiement.

</p>

<div
style={{
display:"flex",
flexWrap:"wrap",
gap:"10px",
marginTop:"20px",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"8px",
padding:"8px 14px",
borderRadius:"40px",
background:"rgba(255,255,255,.14)",
fontWeight:"700",
fontSize:"12px",
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
padding:"8px 14px",
borderRadius:"40px",
background:"rgba(255,255,255,.14)",
fontWeight:"700",
fontSize:"12px",
}}
>

<FaCheckCircle/>

100% Vérifiable

</div>

</div>

<Link
to="/boutique"
style={{
marginTop:"24px",

display:"inline-flex",

alignItems:"center",

justifyContent:"center",

gap:"10px",

padding:"14px 22px",

background:"#FFF",

color:"#2563EB",

fontWeight:"900",

fontSize:"15px",

textDecoration:"none",

borderRadius:"16px",

boxShadow:"0 8px 24px rgba(0,0,0,.15)",
}}
>

<FaStore/>

Découvrir la boutique

<FaChevronRight/>

</Link>

</div>

{/* ICÔNE */}

<div
style={{
width:isMobile?"92px":"145px",

height:isMobile?"92px":"145px",

borderRadius:isMobile?"24px":"32px",

background:"rgba(255,255,255,.12)",

display:"flex",

justifyContent:"center",

alignItems:"center",

backdropFilter:"blur(12px)",

boxShadow:"0 10px 25px rgba(0,0,0,.12)",
}}
>

<FaMoneyBillWave
style={{
fontSize:isMobile?"42px":"70px",
color:"#FFD54A",
}}
/>

</div>

</div>

</div>

{/* ================= PAIEMENT PRINCIPAL ================= */}

<div
  style={{
    marginTop: "22px",
    marginBottom: "28px",
  }}
>
  <div
    style={{
      background: "#FFFFFF",

      borderRadius: isMobile ? "20px" : "28px",

      padding: isMobile ? "18px" : "30px",

      border: "1px solid #E8EEF9",

      boxShadow: "0 8px 24px rgba(15,23,42,.05)",
    }}
  >
    {/* HEADER */}

    <div
      style={{
        display: "flex",

        justifyContent: "space-between",

        alignItems: isMobile ? "flex-start" : "center",

        flexDirection: isMobile ? "column" : "row",

        gap: "14px",

        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "14px",
        }}
      >
        <div
          style={{
            width: isMobile ? "56px" : "72px",

            height: isMobile ? "56px" : "72px",

            borderRadius: "18px",

            background: "#EEF4FF",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            color: "#2563EB",

            fontSize: isMobile ? "24px" : "34px",
          }}
        >
          <FaTruck />
        </div>

        <div>
          <h2
            style={{
              margin: 0,

              fontSize: isMobile ? "21px" : "30px",

              fontWeight: "900",

              color: "#111827",
            }}
          >
            Paiement à la livraison
          </h2>

          <p
            style={{
              marginTop: "6px",

              marginBottom: 0,

              fontSize: "14px",

              lineHeight: "25px",

              color: "#6B7280",
            }}
          >
            Payez uniquement lorsque votre commande vous est remise.
          </p>
        </div>
      </div>

      <div
        style={{
          padding: "8px 14px",

          borderRadius: "40px",

          background: "#DCFCE7",

          display: "flex",

          alignItems: "center",

          gap: "6px",

          fontWeight: "800",

          color: "#15803D",

          fontSize: "12px",
        }}
      >
        <FaCheckCircle />

        Disponible
      </div>
    </div>

    {/* CONTENU */}

    <div
      style={{
        display: "grid",

        gridTemplateColumns: isMobile
          ? "1fr"
          : "repeat(2,1fr)",

        gap: "14px",
      }}
    >
      {[
        {
          icon: <FaBoxOpen />,
          title: "Vérifiez votre colis",
          text: "Contrôlez votre commande avant de payer.",
          color: "#2563EB",
        },

        {
          icon: <FaMoneyBillWave />,
          title: "Paiement après réception",
          text: "Aucun paiement avant la livraison.",
          color: "#16A34A",
        },

        {
          icon: <FaShieldAlt />,
          title: "Paiement sécurisé",
          text: "Une solution simple et fiable.",
          color: "#7C3AED",
        },

        {
          icon: <FaHeadset />,
          title: "Assistance 7j/7",
          text: "Notre équipe reste disponible.",
          color: "#F59E0B",
        },
      ].map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",

            alignItems: "flex-start",

            gap: "12px",

            padding: "14px",

            background: "#F8FAFD",

            borderRadius: "16px",

            border: "1px solid #EEF2F7",

            transition: ".3s",
          }}
        >
          <div
            style={{
              width: "44px",

              height: "44px",

              borderRadius: "14px",

              background: `${item.color}15`,

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              color: item.color,

              fontSize: "18px",

              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>

          <div>
            <h3
              style={{
                margin: "0 0 4px",

                fontWeight: "800",

                fontSize: "15px",

                color: "#111827",
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                margin: 0,

                fontSize: "13px",

                lineHeight: "22px",

                color: "#6B7280",
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
    marginBottom: "28px",
  }}
>
  {/* TITRE */}

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "18px",
    }}
  >
    <div
      style={{
        width: isMobile ? "46px" : "52px",
        height: isMobile ? "46px" : "52px",
        borderRadius: "14px",
        background: "#EEF4FF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#2563EB",
        fontSize: isMobile ? "20px" : "22px",
      }}
    >
      <FaWallet />
    </div>

    <div>
      <h2
        style={{
          margin: 0,
          fontWeight: "900",
          fontSize: isMobile ? "22px" : "30px",
          color: "#111827",
        }}
      >
        Autres moyens de paiement
      </h2>

      <p
        style={{
          margin: "4px 0 0",
          fontSize: "13px",
          color: "#6B7280",
        }}
      >
        Disponibles prochainement.
      </p>
    </div>
  </div>

  {/* CARTES */}

  <div
    style={{
      display: "grid",

      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(3,1fr)",

      gap: "14px",
    }}
  >
    {[
      {
        icon: <FaMobileAlt />,
        title: "Orange Money",
        status: "Bientôt disponible",
        color: "#F97316",
        bg: "#FFF7ED",
      },

      {
        icon: <FaMobileAlt />,
        title: "MTN Mobile Money",
        status: "Bientôt disponible",
        color: "#FACC15",
        bg: "#FEFCE8",
      },

      {
        icon: <FaCreditCard />,
        title: "Carte bancaire",
        status: "Bientôt disponible",
        color: "#2563EB",
        bg: "#EEF4FF",
      },
    ].map((item, index) => (
      <div
        key={index}
        style={{
          background: "#FFFFFF",

          borderRadius: "18px",

          padding: "18px",

          border: "1px solid #E5E7EB",

          boxShadow: "0 8px 22px rgba(15,23,42,.05)",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "16px",
            background: item.bg,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            color: item.color,
            marginBottom: "14px",
          }}
        >
          {item.icon}
        </div>

        <h3
          style={{
            margin: "0 0 8px",
            fontWeight: "900",
            fontSize: "17px",
            color: "#111827",
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            margin: "0 0 16px",
            fontSize: "13px",
            lineHeight: "22px",
            color: "#6B7280",
          }}
        >
          Disponible prochainement sur KONAN SHOPPING.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "40px",
            background: "#FEF3C7",
            color: "#92400E",
            fontWeight: "800",
            fontSize: "12px",
          }}
        >
          <FaClock />

          {item.status}
        </div>
      </div>
    ))}
  </div>
</div>

{/* ================= COMMENT ÇA FONCTIONNE ? ================= */}

<div
  style={{
    marginBottom: "32px",
  }}
>
  {/* TITRE */}

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "18px",
    }}
  >
    <div
      style={{
        width: isMobile ? "46px" : "52px",
        height: isMobile ? "46px" : "52px",
        borderRadius: "14px",
        background: "#EEF4FF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#2563EB",
        fontSize: isMobile ? "20px" : "22px",
      }}
    >
      <FaInfoCircle />
    </div>

    <div>
      <h2
        style={{
          margin: 0,
          fontWeight: "900",
          fontSize: isMobile ? "22px" : "30px",
          color: "#111827",
        }}
      >
        Comment ça fonctionne ?
      </h2>

      <p
        style={{
          margin: "4px 0 0",
          fontSize: "13px",
          color: "#6B7280",
        }}
      >
        Commandez en seulement 4 étapes.
      </p>
    </div>
  </div>

  {/* ÉTAPES */}

  <div
    style={{
      display: "grid",

      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(4,1fr)",

      gap: "14px",
    }}
  >
    {[
      {
        icon: <FaStore />,
        step: "01",
        title: "Commande",
        text: "Choisissez vos produits.",
        color: "#2563EB",
      },

      {
        icon: <FaBoxOpen />,
        step: "02",
        title: "Préparation",
        text: "Nous préparons votre colis.",
        color: "#7C3AED",
      },

      {
        icon: <FaTruck />,
        step: "03",
        title: "Livraison",
        text: "Recevez votre commande.",
        color: "#16A34A",
      },

      {
        icon: <FaMoneyBillWave />,
        step: "04",
        title: "Paiement",
        text: "Payez après vérification.",
        color: "#F59E0B",
      },
    ].map((item, index) => (
      <div
        key={index}
        style={{
          background: "#FFFFFF",

          borderRadius: "18px",

          padding: "18px",

          border: "1px solid #EEF2F7",

          boxShadow: "0 8px 22px rgba(15,23,42,.05)",

          position: "relative",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "14px",
            fontSize: "28px",
            fontWeight: "900",
            color: "#EEF2F7",
          }}
        >
          {item.step}
        </div>

        <div
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            background: `${item.color}15`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "22px",
            color: item.color,
            marginBottom: "14px",
          }}
        >
          {item.icon}
        </div>

        <h3
          style={{
            margin: "0 0 8px",
            fontSize: "16px",
            fontWeight: "900",
            color: "#111827",
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            lineHeight: "22px",
            color: "#6B7280",
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
marginBottom:"32px",
}}
>

{/* TITRE */}

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
width:isMobile?"46px":"52px",
height:isMobile?"46px":"52px",
borderRadius:"14px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:isMobile?"20px":"22px",
}}
>

<FaShieldAlt/>

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

Pourquoi choisir KONAN SHOPPING ?

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
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
?"repeat(2,minmax(0,1fr))"
:"repeat(4,1fr)",

gap:"14px",
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
title:"Paiement livraison",
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

borderRadius:"18px",

padding:isMobile?"16px 12px":"20px",

border:"1px solid #EEF2F7",

boxShadow:"0 6px 18px rgba(15,23,42,.05)",

textAlign:"center",

transition:".3s",
}}
>

<div
style={{
width:isMobile?"48px":"56px",

height:isMobile?"48px":"56px",

margin:"0 auto 12px",

borderRadius:"16px",

background:`${item.color}15`,

display:"flex",

justifyContent:"center",

alignItems:"center",

fontSize:isMobile?"20px":"24px",

color:item.color,
}}
>

{item.icon}

</div>

<h3
style={{
margin:0,

fontWeight:"800",

fontSize:isMobile?"13px":"15px",

lineHeight:isMobile?"20px":"22px",

color:"#111827",
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
marginBottom:"32px",
}}
>

{/* TITRE */}

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
width:isMobile?"46px":"52px",
height:isMobile?"46px":"52px",
borderRadius:"14px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:isMobile?"20px":"22px",
}}
>

<FaQuestionCircle/>

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

Questions fréquentes

</h2>

<p
style={{
margin:"4px 0 0",
fontSize:"13px",
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
gap:"14px",
}}
>

{[

{

question:"Quand dois-je payer ma commande ?",

answer:"Le paiement s'effectue uniquement lors de la livraison après vérification de votre colis.",

icon:<FaMoneyBillWave/>,

},

{

question:"Puis-je vérifier mon colis ?",

answer:"Oui, vérifiez votre commande avant de payer le livreur.",

icon:<FaBoxOpen/>,

},

{

question:"Quels moyens de paiement acceptez-vous ?",

answer:"Le paiement à la livraison est disponible. Orange Money, MTN MoMo et Carte bancaire arrivent bientôt.",

icon:<FaCreditCard/>,

},

{

question:"Mes données sont-elles sécurisées ?",

answer:"Oui, toutes vos informations sont protégées.",

icon:<FaLock/>,

},

].map((item,index)=>(

<div
key={index}
style={{
background:"#FFFFFF",
borderRadius:"18px",
padding:isMobile?"16px":"22px",
border:"1px solid #EEF2F7",
boxShadow:"0 6px 18px rgba(15,23,42,.05)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"12px",
marginBottom:"10px",
}}
>

<div
style={{
width:"44px",
height:"44px",
borderRadius:"14px",
background:"#EEF4FF",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#2563EB",
fontSize:"18px",
flexShrink:0,
}}
>

{item.icon}

</div>

<h3
style={{
margin:0,
fontWeight:"800",
fontSize:isMobile?"15px":"17px",
lineHeight:"24px",
color:"#111827",
}}
>

{item.question}

</h3>

</div>

<p
style={{
margin:0,
paddingLeft:isMobile?"0":"56px",
fontSize:"13px",
lineHeight:"23px",
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
marginBottom:"30px",

background:"linear-gradient(135deg,#2563EB,#1E40AF)",

borderRadius:isMobile?"22px":"30px",

padding:isMobile?"22px 18px":"40px",

textAlign:"center",

position:"relative",

overflow:"hidden",

color:"#FFFFFF",

boxShadow:"0 14px 35px rgba(37,99,235,.22)",
}}
>

{/* BULLES */}

<div
style={{
position:"absolute",
top:"-110px",
left:"-110px",
width:"220px",
height:"220px",
borderRadius:"50%",
background:"rgba(255,255,255,.08)",
}}
/>

<div
style={{
position:"absolute",
bottom:"-80px",
right:"-80px",
width:"180px",
height:"180px",
borderRadius:"50%",
background:"rgba(255,255,255,.05)",
}}
/>

{/* ICÔNE */}

<div
style={{
width:isMobile?"70px":"90px",

height:isMobile?"70px":"90px",

margin:"0 auto 18px",

borderRadius:"22px",

background:"rgba(255,255,255,.15)",

display:"flex",

justifyContent:"center",

alignItems:"center",

backdropFilter:"blur(10px)",

position:"relative",

zIndex:2,
}}
>

<FaStore
style={{
fontSize:isMobile?"34px":"46px",
color:"#FFD54A",
}}
/>

</div>

{/* TITRE */}

<h2
style={{
margin:0,

fontWeight:"900",

fontSize:isMobile?"26px":"40px",

position:"relative",

zIndex:2,
}}
>

Achetez en toute confiance

</h2>

<p
style={{
margin:"16px auto 22px",

maxWidth:"620px",

fontSize:isMobile?"15px":"17px",

lineHeight:"28px",

opacity:.95,

position:"relative",

zIndex:2,
}}
>

Des milliers de Camerounais font confiance à

<b translate="no"> KONAN SHOPPING CAMEROUN</b>.

Profitez d'une livraison rapide et d'un paiement uniquement à la livraison.

</p>

<div
style={{
display:"flex",

justifyContent:"center",

flexWrap:"wrap",

gap:"10px",

marginBottom:"22px",

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
gap:"6px",
padding:"8px 14px",
borderRadius:"40px",
background:"rgba(255,255,255,.14)",
fontWeight:"700",
fontSize:"12px",
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
gap:"8px",

padding:
isMobile
?"14px 22px"
:"16px 30px",

background:"#FFFFFF",

color:"#2563EB",

fontWeight:"900",

fontSize:
isMobile
?"14px"
:"16px",

textDecoration:"none",

borderRadius:"16px",

boxShadow:"0 8px 24px rgba(0,0,0,.15)",

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
marginTop:"16px",

marginBottom:
isMobile
?"88px"
:"20px",

background:"#FFFFFF",

borderRadius:
isMobile
?"24px 24px 0 0"
:"30px",

padding:
isMobile
?"24px 18px"
:"40px",

border:"1px solid #EEF2F7",

boxShadow:"0 8px 24px rgba(15,23,42,.05)",
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
?"64px"
:"82px",

height:
isMobile
?"64px"
:"82px",

borderRadius:"18px",

objectFit:"cover",

boxShadow:"0 8px 18px rgba(37,99,235,.15)",
}}
/>

<h2
translate="no"
style={{
marginTop:"14px",
marginBottom:"6px",

fontWeight:"900",

fontSize:
isMobile
?"22px"
:"32px",

color:"#111827",
}}
>

KONAN SHOPPING

</h2>

<p
style={{
margin:0,

maxWidth:"560px",

textAlign:"center",

fontSize:"14px",

lineHeight:"24px",

color:"#6B7280",
}}
>

Votre boutique en ligne de confiance au Cameroun.

Paiement à la livraison • Livraison rapide • Support 7j/7

</p>

</div>

{/* LIENS */}

<div
style={{
marginTop:"26px",

display:"flex",

justifyContent:"center",

flexWrap:"wrap",

gap:"14px",
}}
>

<Link
to="/boutique"
style={{
display:"flex",
alignItems:"center",
gap:"6px",
textDecoration:"none",
fontWeight:"800",
fontSize:"14px",
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
gap:"6px",
textDecoration:"none",
fontWeight:"800",
fontSize:"14px",
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
gap:"6px",
textDecoration:"none",
fontWeight:"800",
fontSize:"14px",
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
gap:"6px",
textDecoration:"none",
fontWeight:"800",
fontSize:"14px",
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
gap:"6px",
textDecoration:"none",
fontWeight:"800",
fontSize:"14px",
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
marginTop:"26px",

padding:"16px",

borderRadius:"18px",

background:"#F8FAFC",

display:"grid",

gridTemplateColumns:
isMobile
?"repeat(2,minmax(0,1fr))"
:"repeat(4,1fr)",

gap:"14px",
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
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:"6px",

fontWeight:"700",

fontSize:"12px",

color:item.color,

textAlign:"center",
}}
>

<div
style={{
fontSize:"20px",
}}
>

{item.icon}

</div>

{item.text}

</div>

))}

</div>

{/* COPYRIGHT */}

<div
style={{
marginTop:"24px",

paddingTop:"18px",

borderTop:"1px solid #E5E7EB",

textAlign:"center",
}}
>

<p
style={{
margin:0,

fontSize:"12px",

lineHeight:"22px",

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