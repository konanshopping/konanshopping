import { Link } from "react-router-dom";

import {
  useEffect
} from "react";

function Success() {

const user = JSON.parse(
localStorage.getItem("user")
);

  useEffect(() => {

  localStorage.removeItem(
    "checkoutProduct"
  );

}, []);

return (

<div
style={{

minHeight: "100vh",

background:
"linear-gradient(135deg,#EEF2FF,#F8FAFC)",

display: "flex",

justifyContent: "center",

alignItems: "center",

padding: "25px",

fontFamily: "Arial",

}}

>

{/* CARD */}

<div

style={{

width: "100%",

maxWidth: "620px",

background: "white",

borderRadius: "38px",

padding: "55px 40px",

position: "relative",

overflow: "hidden",

textAlign: "center",

boxShadow:
"0 25px 70px rgba(91,61,245,0.15)",

}}

>

{/* TOP GLOW */}

<div

style={{

position: "absolute",

width: "280px",

height: "280px",

background:
"rgba(124,58,237,0.10)",

borderRadius: "50%",

top: "-140px",

right: "-120px",

filter: "blur(10px)",

}}

/>

{/* SUCCESS ICON */}

<div

style={{

width: "130px",

height: "130px",

borderRadius: "50%",

margin: "0 auto",

background:
"linear-gradient(135deg,#22C55E,#16A34A)",

display: "flex",

justifyContent: "center",

alignItems: "center",

boxShadow:
"0 20px 45px rgba(34,197,94,0.35)",

}}

>

<i

className="fa-solid fa-circle-check"

style={{

color: "white",

fontSize: "60px",

}}

></i>

</div>

{/* TITLE */}

<h1

style={{

marginTop: "35px",

fontSize: "46px",

fontWeight: "900",

color: "#111827",

lineHeight: "55px",

marginBottom: "15px",

}}

>

Commande confirmée

</h1>

{/* DESCRIPTION */}

<p

style={{

color: "#6B7280",

fontSize: "17px",

lineHeight: "32px",

marginTop: "20px",

}}

>

Merci d’avoir commandé sur

<span

style={{

color: "#5B3DF5",

fontWeight: "800",

}}

>

{" "}
Konan Shopping Cameroun

</span>

.

<br /><br />

Votre commande a été reçue
avec succès et notre équipe
prépare actuellement votre livraison.

<br /><br />

{user
? "Connectez-vous à votre compte afin de :"
: "Créez un compte afin de :"}

</p>

{/* FEATURES */}

<div

style={{

marginTop: "30px",

textAlign: "left",

background: "#F9FAFB",

borderRadius: "24px",

padding: "25px",

}}

>

{/* ITEM */}

<div

style={{

display: "flex",

alignItems: "center",

gap: "15px",

marginBottom: "20px",

}}

>

<div

style={{

width: "50px",

height: "50px",

borderRadius: "16px",

background:
"rgba(124,58,237,0.12)",

display: "flex",

justifyContent: "center",

alignItems: "center",

}}

>

<i

className="fa-solid fa-map-location-dot"

style={{

color: "#7C3AED",

fontSize: "22px",

}}

></i>

</div>

<div>

<h3

style={{

margin: 0,

color: "#111827",

fontSize: "16px",

}}

>

Suivi commande en direct

</h3>

<p

style={{

marginTop: "5px",

color: "#6B7280",

fontSize: "14px",

}}

>

Suivez l’évolution de votre livraison en temps réel.

</p>

</div>

</div>

{/* ITEM */}

<div

style={{

display: "flex",

alignItems: "center",

gap: "15px",

marginBottom: "20px",

}}

>

<div

style={{

width: "50px",

height: "50px",

borderRadius: "16px",

background:
"rgba(34,197,94,0.12)",

display: "flex",

justifyContent: "center",

alignItems: "center",

}}

>

<i

className="fa-solid fa-bell-concierge"

style={{

color: "#16A34A",

fontSize: "22px",

}}

></i>

</div>

<div>

<h3

style={{

margin: 0,

color: "#111827",

fontSize: "16px",

}}

>

Notifications automatiques

</h3>

<p

style={{

marginTop: "5px",

color: "#6B7280",

fontSize: "14px",

}}

>

Recevez les mises à jour de livraison instantanément.

</p>

</div>

</div>

{/* ITEM */}

<div

style={{

display: "flex",

alignItems: "center",

gap: "15px",

}}

>

<div

style={{

width: "50px",

height: "50px",

borderRadius: "16px",

background:
"rgba(59,130,246,0.12)",

display: "flex",

justifyContent: "center",

alignItems: "center",

}}

>

<i

className="fa-solid fa-timeline"

style={{

color: "#2563EB",

fontSize: "22px",

}}

></i>

</div>

<div>

<h3

style={{

margin: 0,

color: "#111827",

fontSize: "16px",

}}

>

Historique commandes

</h3>

<p

style={{

marginTop: "5px",

color: "#6B7280",

fontSize: "14px",

}}

>

Retrouvez facilement toutes vos commandes précédentes.

</p>

</div>

</div>

</div>

{/* STATUS */}

<div

style={{

marginTop: "35px",

background:
"linear-gradient(135deg,#F5F3FF,#EEF2FF)",

borderRadius: "24px",

padding: "24px",

display: "grid",

gridTemplateColumns:
"1fr 1fr",

gap: "20px",

}}

>

{/* STATUS */}

<div>

<p

style={{

margin: 0,

color: "#6B7280",

fontSize: "13px",

}}

>

<i

className="fa-solid fa-box-open"

style={{

marginRight: "8px",

}}

></i>

Status

</p>

<h3

style={{

marginTop: "10px",

color: "#16A34A",

fontSize: "20px",

}}

>

Confirmée

</h3>

</div>

{/* DELIVERY */}

<div>

<p

style={{

margin: 0,

color: "#6B7280",

fontSize: "13px",

}}

>

<i

className="fa-solid fa-truck-fast"

style={{

marginRight: "8px",

}}

></i>

Livraison

</p>

<h3

style={{

marginTop: "10px",

color: "#5B3DF5",

fontSize: "20px",

}}

>

En préparation

</h3>

</div>

</div>

{/* BUTTONS */}

<div

style={{

display: "flex",

gap: "16px",

marginTop: "40px",

flexWrap: "wrap",

}}

>

{/* HOME */}

<Link

to="/"

style={{

flex: 1,

minWidth: "220px",

textDecoration: "none",

}}

>

<button

style={{

width: "100%",

background:
"linear-gradient(135deg,#5B3DF5,#7C4DFF)",

color: "white",

border: "none",

padding: "18px",

borderRadius: "20px",

fontWeight: "800",

cursor: "pointer",

fontSize: "16px",

boxShadow:
"0 15px 35px rgba(91,61,245,0.35)",

display: "flex",

justifyContent: "center",

alignItems: "center",

gap: "10px",

transition: "0.3s",

}}

>

<i className="fa-solid fa-shop"></i>

Retour accueil

</button>

</Link>

{/* ACCOUNT */}

<Link

to={
user
? "/account"
: "/register"
}

style={{

flex: 1,

minWidth: "220px",

textDecoration: "none",

}}

>

<button

style={{

width: "100%",

background:
"linear-gradient(135deg,#7C3AED,#4F46E5)",

color: "white",

border: "none",

padding: "18px",

borderRadius: "20px",

fontWeight: "800",

cursor: "pointer",

fontSize: "16px",

boxShadow:
"0 15px 35px rgba(124,58,237,0.35)",

display: "flex",

justifyContent: "center",

alignItems: "center",

gap: "10px",

transition: "0.3s",

}}

>

<i className="fa-solid fa-id-card"></i>

{user
? "Rejoindre mon compte"
: "Créer un compte"}

</button>

</Link>

</div>

</div>

</div>

);

}

export default Success;