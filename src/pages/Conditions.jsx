import { Link } from "react-router-dom";

import {
  FaFileContract,
  FaChevronLeft,
  FaShoppingBag,
  FaClipboardCheck,
  FaCheckCircle,
} from "react-icons/fa";

import {
  FaMoneyBillWave,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";

import {
  FaAward,
  FaBalanceScale,
  FaSyncAlt,
  FaHeadset,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

import { FaUndoAlt } from "react-icons/fa";

function Conditions() {

return (

<div
  style={{
    minHeight: "100vh",
    background: "#F5F7FB",
    padding:
      window.innerWidth < 768
        ? "6px"
        : "20px",
  }}
>

{/* ================= HERO ================= */}

<div
  style={{
    background:
      "linear-gradient(135deg,#4B2E83,#2563EB)",

    borderRadius:
      window.innerWidth < 768
        ? "14px"
        : "24px",

    padding:
      window.innerWidth < 768
        ? "13px"
        : "26px",

    color: "#FFF",

    position: "relative",

    overflow: "hidden",

    marginBottom: "12px",

    boxShadow:
      "0 8px 22px rgba(37,99,235,.15)",
  }}
>

  {/* REFLET */}

  <div
    style={{
      position: "absolute",

      top: "-45px",

      right: "-45px",

      width:
        window.innerWidth < 768
          ? "100px"
          : "140px",

      height:
        window.innerWidth < 768
          ? "100px"
          : "140px",

      borderRadius: "50%",

      background:
        "rgba(255,255,255,.08)",
    }}
  />

  {/* RETOUR */}

  <Link
    to="/"
    style={{
      display: "inline-flex",

      alignItems: "center",

      gap: "5px",

      textDecoration: "none",

      color: "#FFF",

      fontWeight: "700",

      fontSize:
        window.innerWidth < 768
          ? "10px"
          : "12px",

      marginBottom: "10px",

      opacity: .95,
    }}
  >

    <FaChevronLeft />

    Accueil

  </Link>

  {/* CONTENU */}

  <div
    style={{
      display: "flex",

      alignItems: "center",

      gap:
        window.innerWidth < 768
          ? "8px"
          : "16px",
    }}
  >

    {/* ICONE */}

    <div
      style={{
        width:
          window.innerWidth < 768
            ? "42px"
            : "62px",

        height:
          window.innerWidth < 768
            ? "42px"
            : "62px",

        borderRadius:
          window.innerWidth < 768
            ? "12px"
            : "16px",

        background:
          "rgba(255,255,255,.15)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        backdropFilter: "blur(10px)",

        border:
          "1px solid rgba(255,255,255,.18)",

        flexShrink: 0,
      }}
    >

      <FaFileContract
        style={{
          fontSize:
            window.innerWidth < 768
              ? "20px"
              : "30px",
        }}
      />

    </div>

    {/* TEXTE */}

    <div
      style={{
        flex: 1,
      }}
    >

      <h1
        style={{
          margin: 0,

          fontWeight: "900",

          lineHeight: "1.05",

          letterSpacing: "-.5px",

          fontSize:
            window.innerWidth < 768
              ? "18px"
              : "34px",
        }}
      >

        Conditions générales d'achat

      </h1>

      <p
        style={{
          marginTop: "5px",

          marginBottom: 0,

          color:
            "rgba(255,255,255,.92)",

          fontSize:
            window.innerWidth < 768
              ? "11px"
              : "14px",

          lineHeight:
            window.innerWidth < 768
              ? "18px"
              : "23px",

          maxWidth: "520px",
        }}
      >

        Chez{" "}

        <b translate="no">
          KONAN SHOPPING CAMEROUN
        </b>

        , nous garantissons une expérience d'achat simple, transparente et sécurisée avec paiement à la livraison.

      </p>

    </div>

  </div>

</div>

{/* ================= INTRODUCTION ================= */}

<div
style={{
background:"#FFFFFF",

borderRadius:
window.innerWidth < 768
? "16px"
: "20px",

padding:
window.innerWidth < 768
? "16px"
: "24px",

border:"1px solid #EEF2F7",

boxShadow:
"0 4px 15px rgba(0,0,0,.04)",

marginBottom:"16px",
}}
>

<h2
style={{
margin:0,
marginBottom:"12px",

display:"flex",

alignItems:"center",

gap:"8px",

fontWeight:"800",

color:"#111827",

fontSize:
window.innerWidth < 768
? "18px"
: "22px",
}}
>

<FaClipboardCheck
style={{
color:"#2563EB",
}}
/>

Notre engagement

</h2>

<p
style={{
margin:0,

color:"#6B7280",

fontSize:
window.innerWidth < 768
? "13px"
: "15px",

lineHeight:
window.innerWidth < 768
? "24px"
: "28px",
}}
>

Les présentes conditions générales définissent les règles applicables à toute commande effectuée sur <b translate="no">KONAN SHOPPING CAMEROUN</b>. Elles ont pour objectif de garantir une relation de confiance entre notre entreprise et nos clients.

</p>

</div>

{/* ================= PREMIÈRES CARTES ================= */}

<div
style={{
display:"grid",

gridTemplateColumns:
window.innerWidth < 768
? "1fr"
: "repeat(2,1fr)",

gap:
window.innerWidth < 768
? "12px"
: "18px",

marginBottom:"18px",
}}
>

{/* CARTE 1 */}

<div
style={{
background:"#FFFFFF",

borderRadius:"18px",

padding:
window.innerWidth < 768
? "16px"
: "22px",

border:"1px solid #EEF2F7",

boxShadow:"0 3px 12px rgba(0,0,0,.04)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"12px",
}}
>

<div
style={{
width:"42px",
height:"42px",
borderRadius:"12px",
background:"linear-gradient(135deg,#EEF2FF,#DBEAFE)",
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaShoppingBag
style={{
color:"#2563EB",
fontSize:"18px",
}}
/>

</div>

<h3
style={{
margin:0,
fontWeight:"800",
fontSize:"17px",
color:"#111827",
}}
>

Achats sécurisés

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

Toutes les commandes sont traitées avec le plus grand soin afin de garantir une expérience d'achat fiable et transparente.

</p>

</div>

{/* CARTE 2 */}

<div
style={{
background:"#FFFFFF",

borderRadius:"18px",

padding:
window.innerWidth < 768
? "16px"
: "22px",

border:"1px solid #EEF2F7",

boxShadow:"0 3px 12px rgba(0,0,0,.04)",
}}
>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"12px",
}}
>

<div
style={{
width:"42px",
height:"42px",
borderRadius:"12px",
background:"linear-gradient(135deg,#EEF2FF,#DBEAFE)",
display:"flex",
justifyContent:"center",
alignItems:"center",
}}
>

<FaCheckCircle
style={{
color:"#2563EB",
fontSize:"18px",
}}
/>

</div>

<h3
style={{
margin:0,
fontWeight:"800",
fontSize:"17px",
color:"#111827",
}}
>

Transparence

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

Nous communiquons clairement les informations concernant nos produits, nos prix, nos délais de livraison et nos services.

</p>

</div>

</div>

{/* ================= PRODUITS ================= */}

<div
  style={{
    display: "grid",
    gap: window.innerWidth < 768 ? "12px" : "18px",
    marginBottom: "16px",
  }}
>

  <div
    style={{
      background: "#FFFFFF",
      borderRadius: window.innerWidth < 768 ? "16px" : "20px",
      padding: window.innerWidth < 768 ? "15px" : "24px",
      border: "1px solid #EEF2F7",
      boxShadow: "0 3px 12px rgba(0,0,0,.04)",
    }}
  >

    <h2
      style={{
        margin: 0,
        marginBottom: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "800",
        color: "#111827",
        fontSize: window.innerWidth < 768 ? "18px" : "22px",
      }}
    >

      <FaShoppingBag
        style={{
          color: "#2563EB",
          fontSize: "20px",
        }}
      />

      Produits

    </h2>

    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >

      {[
        "Tous les produits sont présentés avec le plus grand soin.",
        "Les photos sont fournies à titre illustratif.",
        "Les caractéristiques peuvent évoluer selon les fabricants.",
        "Les prix affichés sont exprimés en FCFA.",
        "La disponibilité dépend du stock au moment de la commande.",
      ].map((item, index) => (

        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >

          <FaCheckCircle
            style={{
              color: "#2563EB",
              marginTop: "3px",
              flexShrink: 0,
            }}
          />

          <span
            style={{
              color: "#4B5563",
              fontSize: "13px",
              lineHeight: "23px",
            }}
          >
            {item}
          </span>

        </div>

      ))}

    </div>

  </div>

  {/* ================= COMMANDE ================= */}

  <div
    style={{
      background: "#FFFFFF",
      borderRadius: window.innerWidth < 768 ? "16px" : "20px",
      padding: window.innerWidth < 768 ? "15px" : "24px",
      border: "1px solid #EEF2F7",
      boxShadow: "0 3px 12px rgba(0,0,0,.04)",
    }}
  >

    <h2
      style={{
        margin: 0,
        marginBottom: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "800",
        color: "#111827",
        fontSize: window.innerWidth < 768 ? "18px" : "22px",
      }}
    >

      <FaClipboardCheck
        style={{
          color: "#2563EB",
          fontSize: "20px",
        }}
      />

      Commandes

    </h2>

    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >

      {[
        "Toute commande est considérée comme une demande d'achat.",
        "Une confirmation peut être effectuée par téléphone ou WhatsApp.",
        "KONAN SHOPPING se réserve le droit d'annuler une commande frauduleuse.",
        "Le client doit fournir des informations exactes pour permettre la livraison.",
        "La validation d'une commande implique l'acceptation des présentes conditions générales.",
      ].map((item, index) => (

        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >

          <FaCheckCircle
            style={{
              color: "#2563EB",
              marginTop: "3px",
              flexShrink: 0,
            }}
          />

          <span
            style={{
              color: "#4B5563",
              fontSize: "13px",
              lineHeight: "23px",
            }}
          >
            {item}
          </span>

        </div>

      ))}

    </div>

  </div>

</div>

{/* ================= PAIEMENT ================= */}

<div
  style={{
    display: "grid",
    gap: window.innerWidth < 768 ? "12px" : "18px",
    marginBottom: "16px",
  }}
>

  <div
    style={{
      background: "#FFFFFF",
      borderRadius: window.innerWidth < 768 ? "16px" : "20px",
      padding: window.innerWidth < 768 ? "15px" : "24px",
      border: "1px solid #EEF2F7",
      boxShadow: "0 3px 12px rgba(0,0,0,.04)",
    }}
  >

    <h2
      style={{
        margin: 0,
        marginBottom: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#111827",
        fontWeight: "800",
        fontSize: window.innerWidth < 768 ? "18px" : "22px",
      }}
    >

      <FaMoneyBillWave
        style={{
          color: "#2563EB",
          fontSize: "20px",
        }}
      />

      Paiement

    </h2>

    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >

      {[
        "Le paiement est effectué uniquement à la livraison.",
        "Le client vérifie son colis avant de régler.",
        "Les paiements sont acceptés en espèces ou selon les moyens proposés par KONAN SHOPPING.",
        "Aucun paiement anticipé n'est exigé sauf indication contraire.",
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
              marginTop:"3px",
              flexShrink:0,
            }}
          />

          <span
            style={{
              color:"#4B5563",
              fontSize:"13px",
              lineHeight:"23px",
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
      background:"#FFFFFF",
      borderRadius:window.innerWidth<768?"16px":"20px",
      padding:window.innerWidth<768?"15px":"24px",
      border:"1px solid #EEF2F7",
      boxShadow:"0 3px 12px rgba(0,0,0,.04)",
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
        fontSize:window.innerWidth<768?"18px":"22px",
      }}
    >

      <FaTruck
        style={{
          color:"#2563EB",
          fontSize:"20px",
        }}
      />

      Livraison

    </h2>

    <div
      style={{
        display:"grid",
        gap:"12px",
      }}
    >

      {[
        "Les livraisons sont effectuées partout au Cameroun.",
        "Les délais peuvent varier selon la destination.",
        "Le client doit être joignable lors de la livraison.",
        "Les frais de livraison sont communiqués avant validation de la commande.",
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
              marginTop:"3px",
              flexShrink:0,
            }}
          />

          <span
            style={{
              color:"#4B5563",
              fontSize:"13px",
              lineHeight:"23px",
            }}
          >
            {item}
          </span>

        </div>

      ))}

    </div>

  </div>

  {/* ================= ANNULATION ================= */}

  <div
    style={{
      background:"#FFFFFF",
      borderRadius:window.innerWidth<768?"16px":"20px",
      padding:window.innerWidth<768?"15px":"24px",
      border:"1px solid #EEF2F7",
      boxShadow:"0 3px 12px rgba(0,0,0,.04)",
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
        fontSize:window.innerWidth<768?"18px":"22px",
      }}
    >

      <FaTimesCircle
        style={{
          color:"#2563EB",
          fontSize:"20px",
        }}
      />

      Annulation d'une commande

    </h2>

    <div
      style={{
        display:"grid",
        gap:"12px",
      }}
    >

      {[
        "Le client peut demander l'annulation avant l'expédition.",
        "Une commande déjà en cours de livraison peut ne plus être annulable.",
        "KONAN SHOPPING peut annuler une commande en cas d'informations incorrectes ou de fraude.",
        "Le client sera informé de toute annulation dans les meilleurs délais.",
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
              marginTop:"3px",
              flexShrink:0,
            }}
          />

          <span
            style={{
              color:"#4B5563",
              fontSize:"13px",
              lineHeight:"23px",
            }}
          >
            {item}
          </span>

        </div>

      ))}

    </div>

  </div>

</div>

{/* ================= GARANTIE ================= */}

<div
  style={{
    display: "grid",
    gap: window.innerWidth < 768 ? "12px" : "18px",
  }}
>

  <div
    style={{
      background: "#FFFFFF",
      borderRadius: window.innerWidth < 768 ? "16px" : "20px",
      padding: window.innerWidth < 768 ? "15px" : "24px",
      border: "1px solid #EEF2F7",
      boxShadow: "0 3px 12px rgba(0,0,0,.04)",
    }}
  >

    <h2
      style={{
        margin: 0,
        marginBottom: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#111827",
        fontWeight: "800",
        fontSize: window.innerWidth < 768 ? "18px" : "22px",
      }}
    >

      <FaAward
        style={{
          color: "#2563EB",
          fontSize: "20px",
        }}
      />

      Garantie

    </h2>

    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >

      {[
        "Nos produits sont vérifiés avant expédition.",
        "Tout défaut constaté à la livraison doit être signalé immédiatement.",
        "Les produits endommagés après réception ne sont pas couverts.",
        "Chaque demande est étudiée individuellement par notre service client.",
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
              marginTop:"3px",
              flexShrink:0,
            }}
          />

          <span
            style={{
              color:"#4B5563",
              fontSize:"13px",
              lineHeight:"23px",
            }}
          >
            {item}
          </span>

        </div>

      ))}

    </div>

  </div>

  {/* ================= RESPONSABILITÉ ================= */}

  <div
    style={{
      background:"#FFFFFF",
      borderRadius:window.innerWidth<768?"16px":"20px",
      padding:window.innerWidth<768?"15px":"24px",
      border:"1px solid #EEF2F7",
      boxShadow:"0 3px 12px rgba(0,0,0,.04)",
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
        fontSize:window.innerWidth<768?"18px":"22px",
      }}
    >

      <FaBalanceScale
        style={{
          color:"#2563EB",
          fontSize:"20px",
        }}
      />

      Responsabilité

    </h2>

    <p
      style={{
        margin:0,
        color:"#6B7280",
        fontSize:"13px",
        lineHeight:"24px",
      }}
    >

      KONAN SHOPPING s'engage à fournir des informations exactes concernant ses produits.
      Toutefois, nous ne pouvons être tenus responsables des retards liés aux transporteurs,
      aux cas de force majeure ou à toute utilisation inappropriée des produits après leur livraison.

    </p>

  </div>

  {/* ================= REMBOURSEMENT ================= */}

<div
  style={{
    marginTop: "12px",

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

      gap: "10px",

      color: "#111827",

      fontWeight: "800",

      fontSize:
        window.innerWidth < 768
          ? "18px"
          : "22px",
    }}
  >

    <FaUndoAlt
      style={{
        color: "#2563EB",
        fontSize: "20px",
      }}
    />

    Politique de remboursement

  </h2>

  <p
    style={{
      margin: 0,

      color: "#6B7280",

      fontSize: "13px",

      lineHeight: "24px",
    }}
  >

    Chez{" "}

    <b translate="no">
      KONAN SHOPPING CAMEROUN
    </b>

    , votre satisfaction est notre priorité.
    Si un produit livré présente un défaut de fabrication
    ou ne correspond pas à votre commande,
    vous pouvez demander un remplacement
    ou un remboursement après vérification par notre équipe.

  </p>

  <div
    style={{
      marginTop: "16px",

      display: "grid",

      gap: "12px",
    }}
  >

    {[
      "Le produit doit être retourné dans son état d'origine.",
      "Toute demande doit être signalée dans les 48 heures suivant la livraison.",
      "Les produits endommagés après réception ne sont pas remboursables.",
      "Les frais de retour peuvent être pris en charge si l'erreur provient de KONAN SHOPPING.",
      "Chaque demande est étudiée individuellement par notre service client.",
    ].map((item, index) => (

      <div
        key={index}
        style={{
          display: "flex",

          alignItems: "flex-start",

          gap: "10px",
        }}
      >

        <FaCheckCircle
          style={{
            color: "#2563EB",

            marginTop: "3px",

            flexShrink: 0,
          }}
        />

        <span
          style={{
            color: "#4B5563",

            fontSize: "13px",

            lineHeight: "23px",
          }}
        >

          {item}

        </span>

      </div>

    ))}

  </div>

</div>

  {/* ================= MODIFICATION ================= */}

  <div
    style={{
      background:"#FFFFFF",
      borderRadius:window.innerWidth<768?"16px":"20px",
      padding:window.innerWidth<768?"15px":"24px",
      border:"1px solid #EEF2F7",
      boxShadow:"0 3px 12px rgba(0,0,0,.04)",
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
        fontSize:window.innerWidth<768?"18px":"22px",
      }}
    >

      <FaSyncAlt
        style={{
          color:"#2563EB",
          fontSize:"20px",
        }}
      />

      Modification des conditions

    </h2>

    <p
      style={{
        margin:0,
        color:"#6B7280",
        fontSize:"13px",
        lineHeight:"24px",
      }}
    >

      KONAN SHOPPING CAMEROUN peut modifier les présentes conditions à tout moment afin
      d'améliorer ses services ou de se conformer aux évolutions légales. Les nouvelles
      conditions prennent effet dès leur publication sur le site.

    </p>

  </div>

  {/* ================= CONTACT ================= */}

  <div
    style={{
      background:"linear-gradient(135deg,#2563EB,#4B2E83)",
      borderRadius:window.innerWidth<768?"18px":"24px",
      padding:window.innerWidth<768?"20px":"32px",
      color:"#FFFFFF",
      textAlign:"center",
      boxShadow:"0 10px 28px rgba(37,99,235,.18)",
    }}
  >

    <div
      style={{
        width:window.innerWidth<768?"58px":"68px",
        height:window.innerWidth<768?"58px":"68px",
        margin:"0 auto 14px",
        borderRadius:"50%",
        background:"rgba(255,255,255,.15)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
      }}
    >

      <FaHeadset
        style={{
          fontSize:window.innerWidth<768?"24px":"30px",
        }}
      />

    </div>

    <h2
      style={{
        margin:0,
        fontWeight:"900",
        fontSize:window.innerWidth<768?"22px":"30px",
      }}
    >

      Besoin d'assistance ?

    </h2>

    <p
      style={{
        marginTop:"10px",
        marginBottom:"20px",
        opacity:.95,
        fontSize:"13px",
        lineHeight:"24px",
        maxWidth:"560px",
        marginInline:"auto",
      }}
    >

      Notre équipe reste disponible pour répondre à toutes vos questions concernant
      vos commandes, nos conditions de vente ou nos services.

    </p>

    <div
      style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexDirection:window.innerWidth<768?"column":"row",
        gap:"12px",
      }}
    >

      <a
        href="https://wa.me/237694641329"
        target="_blank"
        rel="noreferrer"
        style={{
          display:"flex",
          alignItems:"center",
          gap:"8px",
          padding:"12px 18px",
          borderRadius:"14px",
          textDecoration:"none",
          background:"#FFFFFF",
          color:"#2563EB",
          fontWeight:"800",
          fontSize:"13px",
        }}
      >

        <FaWhatsapp />

        WhatsApp

      </a>

      <a
        href="mailto: konanshoppingcameroun@gmail.com"
        style={{
          display:"flex",
          alignItems:"center",
          gap:"8px",
          padding:"12px 18px",
          borderRadius:"14px",
          textDecoration:"none",
          background:"rgba(255,255,255,.15)",
          color:"#FFFFFF",
          border:"1px solid rgba(255,255,255,.25)",
          fontWeight:"700",
          fontSize:"13px",
        }}
      >

        <FaEnvelope />

        konanshoppingcameroun@gmail.com

      </a>

    </div>

  </div>

  {/* ================= MISE À JOUR ================= */}

  <div
    style={{
      background:"#FFFFFF",
      borderRadius:window.innerWidth<768?"16px":"20px",
      padding:window.innerWidth<768?"15px":"22px",
      border:"1px solid #EEF2F7",
      textAlign:"center",
      boxShadow:"0 3px 12px rgba(0,0,0,.04)",
    }}
  >

    <p
      style={{
        margin:0,
        color:"#6B7280",
        fontSize:"13px",
        lineHeight:"24px",
      }}
    >

      Ces conditions générales de vente s'appliquent à l'ensemble des produits proposés par{" "}

      <b translate="no">
        KONAN SHOPPING CAMEROUN
      </b>

      .

      <br /><br />

      Dernière mise à jour :
      <b> Juillet 2026</b>

    </p>

  </div>

</div>

</div>

  );

}

export default Conditions;
