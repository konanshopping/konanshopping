import { Link } from "react-router-dom";

import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaChevronLeft,
  FaCheckCircle,
} from "react-icons/fa";

import {
  FaClipboardList,
  FaBullseye,
  FaCookieBite,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";

import { FaMoneyBillWave } from "react-icons/fa";

function PrivacyPolicy() {

  return (

<div
  style={{
    minHeight: "100vh",
    background: "#F6F8FC",
    padding:
      window.innerWidth < 768
        ? "8px"
        : "22px",
  }}
>

{/* ================= HERO ================= */}

<div
  style={{
    background:
      "linear-gradient(135deg,#4B2E83,#2563EB)",

    borderRadius:
      window.innerWidth < 768
        ? "16px"
        : "24px",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "30px",

    color: "#FFF",

    boxShadow:
      "0 8px 22px rgba(37,99,235,.15)",

    marginBottom: "12px",

    position: "relative",

    overflow: "hidden",
  }}
>

  {/* REFLET */}

  <div
    style={{
      position: "absolute",
      top: "-55px",
      right: "-55px",
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      background: "rgba(255,255,255,.08)",
    }}
  />

  {/* RETOUR */}

  <Link
    to="/"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      textDecoration: "none",
      color: "#FFF",
      fontWeight: "700",
      fontSize: "11px",
      marginBottom: "12px",
    }}
  >

    <FaChevronLeft size={11} />

    Accueil

  </Link>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap:
        window.innerWidth < 768
          ? "10px"
          : "16px",
    }}
  >

    {/* ICONE */}

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "46px"
            : "66px",

        height:
          window.innerWidth < 768
            ? "46px"
            : "66px",

        borderRadius: "14px",

        background:
          "rgba(255,255,255,.15)",

        backdropFilter: "blur(10px)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        flexShrink: 0,
      }}
    >

      <FaShieldAlt
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
          margin: 0,

          fontWeight: "900",

          fontSize:
            window.innerWidth < 768
              ? "20px"
              : "36px",

          lineHeight: "1.15",
        }}
      >

        Politique de confidentialité

      </h1>

      <p
        style={{
          marginTop: "6px",
          marginBottom: 0,
          opacity: .95,

          fontSize:
            window.innerWidth < 768
              ? "12px"
              : "15px",

          lineHeight:
            window.innerWidth < 768
              ? "20px"
              : "25px",

          maxWidth: "540px",
        }}
      >

        Chez <b translate="no">KONAN SHOPPING CAMEROUN</b>,
        la protection de vos données personnelles est notre priorité.

      </p>

    </div>

  </div>

</div>

{/* ================= INTRODUCTION ================= */}

<div
  style={{
    background: "#FFF",

    borderRadius:
      window.innerWidth < 768
        ? "14px"
        : "18px",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "22px",

    boxShadow:
      "0 2px 10px rgba(0,0,0,.04)",

    border: "1px solid #EEF2F7",

    marginBottom: "14px",
  }}
>

  <h2
    style={{
      margin: 0,

      marginBottom: "10px",

      display: "flex",

      alignItems: "center",

      gap: "8px",

      color: "#111827",

      fontWeight: "800",

      fontSize:
        window.innerWidth < 768
          ? "17px"
          : "21px",
    }}
  >

    <FaShieldAlt
      style={{
        color: "#2563EB",
        fontSize:
          window.innerWidth < 768
            ? "17px"
            : "20px",
      }}
    />

    Notre engagement

  </h2>

  <p
    style={{
      margin: 0,

      color: "#6B7280",

      fontSize:
        window.innerWidth < 768
          ? "12px"
          : "14px",

      lineHeight:
        window.innerWidth < 768
          ? "22px"
          : "26px",
    }}
  >

    Nous protégeons les informations personnelles de nos clients selon les meilleures pratiques de sécurité numérique.

    <br /><br />

    Les données collectées servent uniquement à traiter vos commandes, organiser la livraison, améliorer nos services et communiquer avec vous lorsque cela est nécessaire.

  </p>

</div>

{/* ================= PREMIÈRES CARTES ================= */}

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      window.innerWidth < 768
        ? "1fr"
        : "repeat(2,1fr)",

    gap:
      window.innerWidth < 768
        ? "12px"
        : "18px",

    marginBottom: "18px",
  }}
>

  {/* ================= CARTE 1 ================= */}

  <div
    style={{
      background: "#FFFFFF",

      borderRadius:
        window.innerWidth < 768
          ? "16px"
          : "20px",

      padding:
        window.innerWidth < 768
          ? "15px"
          : "22px",

      boxShadow:
        "0 3px 12px rgba(0,0,0,.04)",

      border: "1px solid #EEF2F7",
    }}
  >

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "42px"
            : "52px",

        height:
          window.innerWidth < 768
            ? "42px"
            : "52px",

        borderRadius: "12px",

        background:
          "linear-gradient(135deg,#EEF2FF,#DBEAFE)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: "12px",
      }}
    >

      <FaLock
        style={{
          color: "#2563EB",

          fontSize:
            window.innerWidth < 768
              ? "18px"
              : "22px",
        }}
      />

    </div>

    <h3
      style={{
        margin: "0 0 8px",

        color: "#111827",

        fontWeight: "800",

        fontSize:
          window.innerWidth < 768
            ? "16px"
            : "20px",
      }}
    >

      Protection des données

    </h3>

    <p
      style={{
        margin: 0,

        color: "#6B7280",

        lineHeight:
          window.innerWidth < 768
            ? "22px"
            : "26px",

        fontSize:
          window.innerWidth < 768
            ? "13px"
            : "14px",
      }}
    >

      Toutes les informations que vous partagez avec{" "}

      <b translate="no">
        KONAN SHOPPING
      </b>

      {" "}sont protégées contre tout accès non autorisé.

    </p>

  </div>

  {/* ================= CARTE 2 ================= */}

  <div
    style={{
      background: "#FFFFFF",

      borderRadius:
        window.innerWidth < 768
          ? "16px"
          : "20px",

      padding:
        window.innerWidth < 768
          ? "15px"
          : "22px",

      boxShadow:
        "0 3px 12px rgba(0,0,0,.04)",

      border: "1px solid #EEF2F7",
    }}
  >

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "42px"
            : "52px",

        height:
          window.innerWidth < 768
            ? "42px"
            : "52px",

        borderRadius: "12px",

        background:
          "linear-gradient(135deg,#EEF2FF,#DBEAFE)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        marginBottom: "12px",
      }}
    >

      <FaUserShield
        style={{
          color: "#2563EB",

          fontSize:
            window.innerWidth < 768
              ? "18px"
              : "22px",
        }}
      />

    </div>

    <h3
      style={{
        margin: "0 0 8px",

        color: "#111827",

        fontWeight: "800",

        fontSize:
          window.innerWidth < 768
            ? "16px"
            : "20px",
      }}
    >

      Respect de votre vie privée

    </h3>

    <p
      style={{
        margin: 0,

        color: "#6B7280",

        lineHeight:
          window.innerWidth < 768
            ? "22px"
            : "26px",

        fontSize:
          window.innerWidth < 768
            ? "13px"
            : "14px",
      }}
    >

      Vos données personnelles ne sont jamais revendues.
      Elles sont utilisées uniquement pour assurer le bon fonctionnement de nos services.

    </p>

  </div>

</div>

{/* ================= DONNÉES COLLECTÉES ================= */}

<div
  style={{
    marginTop: "16px",
    display: "grid",
    gap: window.innerWidth < 768 ? "12px" : "18px",
  }}
>

{/* ================= DONNÉES ================= */}

<div
  style={{
    background: "#FFFFFF",

    borderRadius:
      window.innerWidth < 768
        ? "16px"
        : "20px",

    padding:
      window.innerWidth < 768
        ? "15px"
        : "24px",

    border: "1px solid #EEF2F7",

    boxShadow:
      "0 3px 12px rgba(0,0,0,.04)",
  }}
>

<h2
  style={{
    margin: 0,

    marginBottom: "14px",

    display: "flex",

    alignItems: "center",

    gap: "8px",

    color: "#111827",

    fontWeight: "800",

    fontSize:
      window.innerWidth < 768
        ? "17px"
        : "22px",
  }}
>

<FaClipboardList
  style={{
    color: "#2563EB",

    fontSize:
      window.innerWidth < 768
        ? "18px"
        : "22px",
  }}
/>

Données collectées

</h2>

<div
  style={{
    display: "grid",
    gap: "10px",
  }}
>

{[
"Nom et prénom",
"Numéro de téléphone",
"Adresse de livraison",
"Ville et quartier",
"Adresse e-mail (si renseignée)",
"Historique des commandes",
"Préférences de navigation",
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
color:"#2563EB",
fontSize:
window.innerWidth < 768
? "15px"
: "17px",
flexShrink:0,
}}
/>

<span
style={{
color:"#4B5563",
fontSize:
window.innerWidth < 768
? "13px"
: "14px",
lineHeight:
window.innerWidth < 768
? "21px"
: "24px",
}}
>

{item}

</span>

</div>

))}

</div>

</div>

{/* ================= UTILISATION ================= */}

<div
style={{
background:"#FFFFFF",

borderRadius:
window.innerWidth < 768
? "16px"
: "20px",

padding:
window.innerWidth < 768
? "15px"
: "24px",

border:"1px solid #EEF2F7",

boxShadow:
"0 3px 12px rgba(0,0,0,.04)",
}}
>

<h2
style={{
margin:0,

marginBottom:"14px",

display:"flex",

alignItems:"center",

gap:"8px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth < 768
? "17px"
: "22px",
}}
>

<FaBullseye
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "18px"
: "22px",
}}
/>

Utilisation de vos informations

</h2>

<p
style={{
margin:0,

color:"#6B7280",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "22px"
: "26px",
}}
>

Les informations collectées sont utilisées uniquement pour :

</p>

<div
style={{
marginTop:"14px",

display:"grid",

gap:"10px",
}}
>

{[
"Traiter et confirmer vos commandes.",
"Préparer et assurer votre livraison.",
"Vous contacter concernant vos achats.",
"Améliorer la qualité de nos services.",
"Personnaliser votre expérience sur KONAN SHOPPING.",
"Garantir la sécurité de votre compte.",
].map((item,index)=>(

<div
key={index}
style={{
display:"flex",

alignItems:"flex-start",

gap:"10px",
}}
>

<FaCheckCircle
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "15px"
: "17px",

marginTop:"3px",

flexShrink:0,
}}
/>

<span
style={{
color:"#4B5563",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "21px"
: "24px",
}}
>

{item}

</span>

</div>

))}

</div>

</div>


{/* ================= SÉCURITÉ ================= */}

<div
  style={{
    background: "#FFFFFF",

    borderRadius:
      window.innerWidth < 768
        ? "16px"
        : "20px",

    padding:
      window.innerWidth < 768
        ? "15px"
        : "24px",

    border: "1px solid #EEF2F7",

    boxShadow:
      "0 3px 12px rgba(0,0,0,.04)",
  }}
>

<h2
style={{
margin:0,

marginBottom:"14px",

display:"flex",

alignItems:"center",

gap:"8px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth < 768
? "17px"
: "22px",
}}
>

<FaLock
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "18px"
: "22px",
}}
/>

Sécurité de vos données

</h2>

<p
style={{
margin:0,

color:"#6B7280",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "22px"
: "26px",
}}
>

Chez <b translate="no">KONAN SHOPPING CAMEROUN</b>,
nous appliquons des mesures de sécurité afin de protéger vos informations personnelles contre tout accès non autorisé, toute perte, modification ou utilisation frauduleuse.

</p>

<div
style={{
marginTop:"14px",

display:"grid",

gap:"10px",
}}
>

{[
"Accès sécurisé à vos informations.",
"Protection contre les accès non autorisés.",
"Surveillance continue des services.",
"Amélioration permanente de la sécurité.",
].map((item,index)=>(

<div
key={index}
style={{
display:"flex",

alignItems:"flex-start",

gap:"10px",
}}
>

<FaCheckCircle
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "15px"
: "17px",

marginTop:"3px",

flexShrink:0,
}}
/>

<span
style={{
color:"#4B5563",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "21px"
: "24px",
}}
>

{item}

</span>

</div>

))}

</div>

</div>

{/* ================= COOKIES ================= */}

<div
style={{
background:"#FFFFFF",

borderRadius:
window.innerWidth < 768
? "16px"
: "20px",

padding:
window.innerWidth < 768
? "15px"
: "24px",

border:"1px solid #EEF2F7",

boxShadow:
"0 3px 12px rgba(0,0,0,.04)",
}}
>

<h2
style={{
margin:0,

marginBottom:"14px",

display:"flex",

alignItems:"center",

gap:"8px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth < 768
? "17px"
: "22px",
}}
>

<FaCookieBite
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "18px"
: "22px",
}}
/>

Cookies

</h2>

<p
style={{
margin:0,

color:"#6B7280",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "22px"
: "26px",
}}
>

Notre site utilise des cookies afin d'améliorer votre navigation, mémoriser certaines préférences, analyser les performances et offrir une expérience plus fluide et personnalisée.

</p>

</div>

{/* ================= LIVRAISON ================= */}

<div
style={{
background:"#FFFFFF",

borderRadius:
window.innerWidth < 768
? "16px"
: "20px",

padding:
window.innerWidth < 768
? "15px"
: "24px",

border:"1px solid #EEF2F7",

boxShadow:
"0 3px 12px rgba(0,0,0,.04)",
}}
>

<h2
style={{
margin:0,

marginBottom:"14px",

display:"flex",

alignItems:"center",

gap:"8px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth < 768
? "17px"
: "22px",
}}
>

<FaTruck
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "18px"
: "22px",
}}
/>

Livraison

</h2>

<p
style={{
margin:0,

color:"#6B7280",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "22px"
: "26px",
}}
>

Les informations de livraison sont utilisées uniquement pour préparer, expédier et remettre votre commande dans les meilleures conditions. Elles ne sont jamais communiquées à des tiers non autorisés.

</p>

<div
style={{
marginTop:"14px",

display:"grid",

gap:"10px",
}}
>

{[
"Livraison rapide partout au Cameroun.",
"Paiement uniquement à la livraison.",
"Suivi complet de votre commande.",
"Protection de vos informations de livraison.",
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
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "15px"
: "17px",

flexShrink:0,
}}
/>

<span
style={{
color:"#4B5563",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "21px"
: "24px",
}}
>

{item}

</span>

</div>

))}

</div>

</div>

{/* ================= VOS DROITS ================= */}

<div
  style={{
    background: "#FFFFFF",

    borderRadius:
      window.innerWidth < 768
        ? "16px"
        : "20px",

    padding:
      window.innerWidth < 768
        ? "15px"
        : "24px",

    border: "1px solid #EEF2F7",

    boxShadow:
      "0 3px 12px rgba(0,0,0,.04)",
  }}
>

<h2
style={{
margin:0,

marginBottom:"14px",

display:"flex",

alignItems:"center",

gap:"8px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth < 768
? "17px"
: "22px",
}}
>

<FaUserShield
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "18px"
: "22px",
}}
/>

Vos droits

</h2>

<p
style={{
margin:0,

color:"#6B7280",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "22px"
: "26px",
}}
>

Vous pouvez à tout moment exercer les droits suivants :

</p>

<div
style={{
marginTop:"14px",

display:"grid",

gap:"10px",
}}
>

{[
"Consulter vos informations personnelles.",
"Modifier vos données.",
"Demander la suppression de votre compte.",
"Demander l'effacement de vos données.",
"Obtenir des informations sur l'utilisation de vos données.",
].map((item,index)=>(

<div
key={index}
style={{
display:"flex",

alignItems:"flex-start",

gap:"10px",
}}
>

<FaCheckCircle
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "15px"
: "17px",

marginTop:"3px",

flexShrink:0,
}}
/>

<span
style={{
color:"#4B5563",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "21px"
: "24px",
}}
>

{item}

</span>

</div>

))}

</div>

</div>

{/* ================= POLITIQUE DE REMBOURSEMENT ================= */}

<div
style={{
background:"#FFFFFF",

borderRadius:
window.innerWidth < 768
? "16px"
: "20px",

padding:
window.innerWidth < 768
? "15px"
: "24px",

border:"1px solid #EEF2F7",

boxShadow:
"0 3px 12px rgba(0,0,0,.04)",
}}
>

<h2
style={{
margin:0,

marginBottom:"14px",

display:"flex",

alignItems:"center",

gap:"8px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth < 768
? "17px"
: "22px",
}}
>

<FaMoneyBillWave
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "18px"
: "22px",
}}
/>

Politique de remboursement

</h2>

<p
style={{
margin:0,

color:"#6B7280",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "22px"
: "26px",
}}
>

Chez <b translate="no">KONAN SHOPPING CAMEROUN</b>, le paiement s'effectue uniquement à la livraison. Nous invitons chaque client à vérifier soigneusement le produit avant de procéder au paiement.

</p>

<div
style={{
marginTop:"14px",

display:"grid",

gap:"10px",
}}
>

{[
"Le client peut vérifier le produit avant le paiement.",
"Un produit endommagé ou non conforme peut être refusé à la livraison.",
"Après validation et paiement, les remboursements sont étudiés uniquement en cas de défaut confirmé.",
"Les demandes sont examinées dans les meilleurs délais par notre service client.",
"Notre équipe reste disponible sur WhatsApp pour toute réclamation.",
].map((item,index)=>(

<div
key={index}
style={{
display:"flex",

alignItems:"flex-start",

gap:"10px",
}}
>

<FaCheckCircle
style={{
color:"#2563EB",

fontSize:
window.innerWidth < 768
? "15px"
: "17px",

marginTop:"3px",

flexShrink:0,
}}
/>

<span
style={{
color:"#4B5563",

fontSize:
window.innerWidth < 768
? "13px"
: "14px",

lineHeight:
window.innerWidth < 768
? "21px"
: "24px",
}}
>

{item}

</span>

</div>

))}

</div>

</div>

{/* ================= CONTACT ================= */}

<div
  style={{
    background:
      "linear-gradient(135deg,#2563EB,#4B2E83)",

    borderRadius:
      window.innerWidth < 768
        ? "18px"
        : "24px",

    padding:
      window.innerWidth < 768
        ? "18px 16px"
        : "30px",

    textAlign: "center",

    color: "#FFFFFF",

    boxShadow:
      "0 10px 25px rgba(37,99,235,.16)",

    overflow: "hidden",

    position: "relative",
  }}
>

  {/* REFLET */}

  <div
    style={{
      position: "absolute",

      top: "-45px",

      right: "-45px",

      width: "120px",

      height: "120px",

      borderRadius: "50%",

      background:
        "rgba(255,255,255,.08)",
    }}
  />

  {/* ICÔNE */}

  <div
    style={{
      width:
        window.innerWidth < 768
          ? "56px"
          : "68px",

      height:
        window.innerWidth < 768
          ? "56px"
          : "68px",

      margin: "0 auto 14px",

      borderRadius: "50%",

      background:
        "rgba(255,255,255,.15)",

      backdropFilter: "blur(12px)",

      display: "flex",

      justifyContent: "center",

      alignItems: "center",
    }}
  >

    <FaWhatsapp
      style={{
        fontSize:
          window.innerWidth < 768
            ? "28px"
            : "34px",

        color: "#FFFFFF",
      }}
    />

  </div>

  {/* TITRE */}

  <h2
    style={{
      margin: 0,

      fontWeight: "900",

      fontSize:
        window.innerWidth < 768
          ? "21px"
          : "30px",
    }}
  >

    Besoin d'aide ?

  </h2>

  {/* DESCRIPTION */}

  <p
    style={{
      margin:
        window.innerWidth < 768
          ? "10px auto 18px"
          : "14px auto 24px",

      maxWidth: "500px",

      lineHeight:
        window.innerWidth < 768
          ? "22px"
          : "28px",

      fontSize:
        window.innerWidth < 768
          ? "13px"
          : "15px",

      opacity: .95,
    }}
  >

    Notre équipe est disponible pour répondre à toutes vos questions concernant vos commandes, vos données personnelles et nos services.

  </p>

  {/* BOUTON */}

  <a
    href="https://wa.me/237694641329"

    target="_blank"

    rel="noreferrer"

    style={{
      display: "inline-flex",

      alignItems: "center",

      justifyContent: "center",

      gap: "8px",

      padding:
        window.innerWidth < 768
          ? "12px 18px"
          : "14px 26px",

      background: "#FFFFFF",

      color: "#2563EB",

      borderRadius: "12px",

      textDecoration: "none",

      fontWeight: "800",

      fontSize:
        window.innerWidth < 768
          ? "13px"
          : "15px",

      boxShadow:
        "0 6px 18px rgba(0,0,0,.10)",

      transition: ".25s",
    }}
  >

    <FaWhatsapp />

    Contacter sur WhatsApp

  </a>

</div>

{/* ================= INFORMATIONS LÉGALES ================= */}

<div
  style={{
    marginTop: "18px",

    background: "#FFFFFF",

    borderRadius:
      window.innerWidth < 768
        ? "16px"
        : "20px",

    padding:
      window.innerWidth < 768
        ? "16px"
        : "22px",

    textAlign: "center",

    border: "1px solid #EEF2F7",

    boxShadow:
      "0 4px 15px rgba(0,0,0,.04)",
  }}
>

  <div
    style={{
      display: "flex",

      justifyContent: "center",

      alignItems: "center",

      gap: "8px",

      marginBottom: "10px",

      color: "#2563EB",

      fontWeight: "800",

      fontSize:
        window.innerWidth < 768
          ? "15px"
          : "17px",
    }}
  >

    <FaShieldAlt />

    Informations légales

  </div>

  <p
    style={{
      margin: 0,

      color: "#6B7280",

      fontSize:
        window.innerWidth < 768
          ? "12px"
          : "14px",

      lineHeight:
        window.innerWidth < 768
          ? "22px"
          : "26px",
    }}
  >

    Cette Politique de confidentialité s'applique à tous les services proposés par{" "}

    <b translate="no">
      KONAN SHOPPING CAMEROUN
    </b>

    .

    <br /><br />

    Nous nous réservons le droit de modifier cette politique afin de respecter les évolutions légales, réglementaires ou techniques. Toute mise à jour sera publiée sur cette page.

    <br /><br />

    Pour toute question concernant vos données personnelles ou l'exercice de vos droits, vous pouvez contacter notre service client via WhatsApp ou depuis la rubrique <b>Contact</b> du site.

    <br /><br />

    <span
      style={{
        color: "#111827",
        fontWeight: "700",
      }}
    >
      Dernière mise à jour :
    </span>{" "}

    <b>04 juillet 2026</b>

  </p>


</div>
</div>
</div>

);

}

export default PrivacyPolicy;
