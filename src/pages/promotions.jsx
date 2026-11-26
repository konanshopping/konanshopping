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









const API_BASE_URL =

  "https://konanshopping.com";



const API_TIMEOUT = 15000;

const MAX_PRODUCTS = 500;



const api = axios.create({

  baseURL: API_BASE_URL,

  timeout: API_TIMEOUT,

  headers: {

    Accept: "application/json",

  },

});



const normalizeProductsResponse = (data) => {

  const products =

    Array.isArray(data)

      ? data

      : Array.isArray(data?.products)

      ? data.products

      : Array.isArray(data?.data)

      ? data.data

      : [];



  return products

    .filter(

      (product) =>

        product &&

        typeof product === "object" &&

        typeof product._id === "string" &&

        product._id.trim() &&

        typeof product.name === "string" &&

        Number.isFinite(

          Number(product.price)

        )

    )

    .slice(0, MAX_PRODUCTS)

    .map((product) => ({

      ...product,

      price: Number(product.price),

      name: product.name.trim().slice(0, 300),

      image:

        typeof product.image === "string"

          ? product.image.trim().slice(0, 2000)

          : "",

    }));

};



function Promotions() {

  // Largeur réactive : les styles se recalculent aussi après rotation sur iOS.
  const [viewportWidth, setViewportWidth] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth : 1024)
  );

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", updateViewport, { passive: true });
    window.addEventListener("orientationchange", updateViewport, { passive: true });
    window.visualViewport?.addEventListener("resize", updateViewport, { passive: true });

    updateViewport();

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);







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

    let mounted = true;



    api

      .get("/api/products")

      .then((res) => {

        if (!mounted) return;



        const safeProducts =

          normalizeProductsResponse(res?.data);



        setProducts(safeProducts);

        setLoading(false);

      })

      .catch(() => {

        if (!mounted) return;



        setProducts([]);

        setLoading(false);

      });



    return () => {

      mounted = false;

    };

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
className="ks-promotions-page"
style={{

minHeight:"100vh",



width:"100%",



background:"color-mix(in srgb, var(--season-primary, #2563eb) 2%, white)",



overflowX:"hidden",



padding:



viewportWidth<768



?"0"



:"24px",



}}



>

<style>{`
  .ks-promotions-page {
    box-sizing: border-box;
    min-height: 100vh;
    min-height: 100svh;
    min-height: 100dvh;
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  .ks-promotions-page *,
  .ks-promotions-page *::before,
  .ks-promotions-page *::after {
    box-sizing: border-box;
  }

  .ks-promotions-page img {
    max-width: 100%;
  }

  .ks-promotions-page a,
  .ks-promotions-page button {
    touch-action: manipulation;
  }

  .ks-promotions-page a:focus-visible,
  .ks-promotions-page button:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--season-primary, #2563eb) 45%, transparent);
    outline-offset: 3px;
  }

  .ks-promotions-page h1,
  .ks-promotions-page h2,
  .ks-promotions-page h3,
  .ks-promotions-page p,
  .ks-promotions-page span,
  .ks-promotions-page b {
    overflow-wrap: anywhere;
  }

  @media (max-width: 767px) {
    .ks-promotions-page {
      padding-left: 0;
      padding-right: 0;
    }
    .ks-promotions-page footer {
      margin-bottom: calc(90px + env(safe-area-inset-bottom, 0px)) !important;
    }
    .ks-promotions-page button,
    .ks-promotions-page a {
      -webkit-touch-callout: none;
    }
  }

  @media (max-width: 380px) {
    .ks-promotions-page h1 {
      font-size: clamp(27px, 8.5vw, 34px) !important;
      line-height: 1.12 !important;
    }
    .ks-promotions-page h2 {
      overflow-wrap: anywhere;
    }
    .ks-promotions-page {
      font-size: 14px;
    }
  }

  @media (max-width: 340px) {
    .ks-promotions-page .ks-never-overflow {
      min-width: 0;
    }
  }

  @media (orientation: landscape) and (max-height: 500px) {
    .ks-promotions-page {
      min-height: 100svh;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ks-promotions-page *,
    .ks-promotions-page *::before,
    .ks-promotions-page *::after {
      scroll-behavior: auto !important;
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
    }
  }
`}</style>








{/* ================= HERO ================= */}







<div



style={{



position:"relative",



overflow:"hidden",



background:"#FFFFFF",







width:"100%",







borderRadius:



viewportWidth<768



?"0"



:"32px",







padding:



viewportWidth<768



?"18px 16px 28px"



:"42px",







boxShadow:



viewportWidth<768



?"none"



:"0 10px 40px color-mix(in srgb, var(--season-primary, #2563eb) 8%, transparent)",



}}



>







{/* CERCLES */}







<div



style={{



position:"absolute",



top:"-120px",



right:"-100px",



width:"300px",



height:"300px",



borderRadius:"50%",



background:"color-mix(in srgb, var(--season-primary, #2563eb) 5%, transparent)",



}}



/>







<div



style={{



position:"absolute",



top:"34px",



right:"40px",



width:"8px",



height:"8px",



borderRadius:"50%",



background:"color-mix(in srgb, var(--season-secondary, #3b82f6) 72%, white)",



}}



/>







<div



style={{



position:"absolute",



top:"74px",



right:"120px",



width:"6px",



height:"6px",



borderRadius:"50%",



background:"color-mix(in srgb, var(--season-secondary, #3b82f6) 52%, white)",



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



fontSize:



viewportWidth<768



?"15px"



:"17px",



marginBottom:"24px",



}}



>







<FaChevronLeft



style={{



fontSize:"18px",



}}



/>







Retour







</Link>







{/* CONTENU */}







<div



style={{



display:"flex",



flexDirection:



viewportWidth<768



?"column"



:"row",



alignItems:



viewportWidth<768



?"flex-start"



:"center",



justifyContent:"space-between",



gap:



viewportWidth<768



?"24px"



:"40px",



}}



>







{/* TEXTE */}







<div



style={{



flex:1,



width:"100%",



maxWidth:



viewportWidth<768



?"100%"



:"520px",



zIndex:2,



position:"relative",



}}



>







<div



style={{



display:"inline-flex",



alignItems:"center",



gap:"8px",



padding:"8px 16px",



borderRadius:"40px",



background:"color-mix(in srgb, var(--season-primary, #2563eb) 8%, white)",



color:"var(--season-primary, #2563eb)",



fontWeight:"900",



fontSize:"12px",



marginBottom:"18px",



}}



>







<FaBolt/>







OFFRES FLASH







</div>







<h1



style={{



margin:0,







fontSize:



viewportWidth<768



?"36px"



:"56px",







fontWeight:"900",







lineHeight:"1.1",







color:"#07133B",



}}



>







Offres promotionnelles







<br/>







<span



style={{



color:"var(--season-primary, #2563eb)",



}}



>







exclusives







</span>







</h1>







<div



style={{



width:"60px",



height:"4px",



borderRadius:"20px",



background:"var(--season-primary, #2563eb)",



margin:"18px 0",



}}



/>







<p



style={{



margin:0,







fontSize:



viewportWidth<768



?"16px"



:"18px",







lineHeight:



viewportWidth<768



?"29px"



:"34px",







color:"#4B5563",



}}



>







Découvrez chaque jour des offres exceptionnelles sur une sélection de produits KONAN SHOPPING.







<br/><br/>







Les promotions sont disponibles pour une durée limitée.







<b



style={{



color:"var(--season-primary, #2563eb)",



}}



>







Ne les manquez pas !







</b>







</p>







{/* BADGES */}







<div



  style={{



    display: "grid",







    gridTemplateColumns:



      viewportWidth < 768



        ? "repeat(3,1fr)"



        : "repeat(3,1fr)",







    gap:



      viewportWidth < 768



        ? "8px"



        : "18px",







    marginTop: "28px",







    width: "100%",



  }}



>



  {[



    {



      icon: <FaTags />,



      title: "Réductions",



      value: "Jusqu'à 70%",



    },







    {



      icon: <FaShieldAlt />,



      title: "Paiement",



      value: "À la livraison",



    },







    {



      icon: <FaShoppingBag />,



      title: "Produits",



      value: "Sélectionnés",



    },



  ].map((item, index) => (



    <div



      key={index}



      style={{



        background: "#FFFFFF",



        border: "1px solid #E5E7EB",



        borderRadius: "16px",







        padding:



          viewportWidth < 768



            ? "10px 6px"



            : "18px",







        display: "flex",







        flexDirection:



          viewportWidth < 768



            ? "column"



            : "row",







        alignItems: "center",







        justifyContent: "center",







        gap:



          viewportWidth < 768



            ? "8px"



            : "12px",







        textAlign: "center",







        boxShadow:



          "0 6px 18px rgba(15,23,42,.05)",







        minHeight:



          viewportWidth < 768



            ? "120px"



            : "auto",



      }}



    >



      <div



        style={{



          width:



            viewportWidth < 768



              ? "42px"



              : "52px",







          height:



            viewportWidth < 768



              ? "42px"



              : "52px",







          borderRadius: "50%",







          background: "color-mix(in srgb, var(--season-primary, #2563eb) 8%, white)",







          display: "flex",







          justifyContent: "center",







          alignItems: "center",







          color: "var(--season-primary, #2563eb)",







          fontSize:



            viewportWidth < 768



              ? "18px"



              : "20px",







          flexShrink: 0,



        }}



      >



        {item.icon}



      </div>







      <div>



        <div



          style={{



            fontWeight: "700",







            fontSize:



              viewportWidth < 768



                ? "12px"



                : "15px",







            color: "#111827",







            lineHeight: "16px",



          }}



        >



          {item.title}



        </div>







        <div



          style={{



            marginTop: "4px",







            fontWeight: "900",







            fontSize:



              viewportWidth < 768



                ? "12px"



                : "15px",







            color: "var(--season-primary, #2563eb)",







            lineHeight: "16px",



          }}



        >



          {item.value}



        </div>



      </div>



    </div>



  ))}



</div>







</div>



{/* LOGO HERO */}







<div



  style={{



    position: "absolute",







    top: viewportWidth < 768 ? "-85px" : "-130px",







    right: viewportWidth < 768 ? "-65px" : "-110px",







    width: viewportWidth < 768 ? "220px" : "340px",







    height: viewportWidth < 768 ? "220px" : "340px",







    borderRadius: "50%",







    display: "flex",







    justifyContent: "center",







    alignItems: "center",







    overflow: "hidden",







    zIndex: 1,







    pointerEvents: "none",



  }}



>







  <img



    src="/logo.jpg"



    alt="Promotion"



    style={{



      width: "100%",



      height: "100%",



      objectFit: "cover",



      borderRadius: "50%",



    }}



  />







</div>







</div>







{/* ================= FIN DES PROMOTIONS ================= */}







<div



style={{



marginTop:"28px",



marginBottom:"24px",



background:"linear-gradient(135deg,var(--season-primary, #2563eb),var(--season-primary, #2563eb))",



borderRadius:viewportWidth<768?"22px":"28px",



padding:viewportWidth<768?"20px 14px":"34px",



position:"relative",



overflow:"hidden",



boxShadow:"0 15px 35px color-mix(in srgb, var(--season-primary, #2563eb) 25%, transparent)",



}}



>







{/* REFLETS */}







<div



style={{



position:"absolute",



right:"-90px",



top:"-80px",



width:"220px",



height:"220px",



borderRadius:"50%",



background:"rgba(255,255,255,.08)",



}}



/>







<div



style={{



position:"absolute",



left:"-70px",



bottom:"-70px",



width:"170px",



height:"170px",



borderRadius:"50%",



background:"rgba(255,255,255,.05)",



}}



/>







{/* TITRE */}







<div



style={{



display:"flex",



alignItems:"center",



gap:"10px",



marginBottom:"18px",



color:"#FFF",



fontWeight:"900",



fontSize:viewportWidth<768?"20px":"30px",



}}



>







<div



style={{



width:viewportWidth<768?"42px":"48px",



height:viewportWidth<768?"42px":"48px",



borderRadius:"50%",



background:"rgba(255,255,255,.15)",



display:"flex",



justifyContent:"center",



alignItems:"center",



}}



>







<FaClock size={20}/>







</div>







Fin des promotions







</div>







{/* TIMER */}







<div



style={{



display:"flex",



justifyContent:"center",



alignItems:"center",



gap:viewportWidth<768?"6px":"18px",



}}



>







{[



{



value:hours,



label:"H",



},



{



value:minutes,



label:"M",



},



{



value:seconds,



label:"S",



},



].map((item,index)=>(







<div



key={index}



style={{



display:"flex",



alignItems:"center",



gap:viewportWidth<768?"6px":"12px",



}}



>







<div



style={{



width:viewportWidth<380?"68px":viewportWidth<768?"82px":"110px",



height:viewportWidth<380?"78px":viewportWidth<768?"92px":"130px",



background:"#FFF",



borderRadius:"18px",



display:"flex",



flexDirection:"column",



justifyContent:"center",



alignItems:"center",



boxShadow:"0 10px 25px rgba(0,0,0,.18)",



}}



>







<div



style={{



fontSize:viewportWidth<380?"32px":viewportWidth<768?"38px":"64px",



fontWeight:"900",



color:"var(--season-primary, #2563eb)",



lineHeight:1,



}}



>







{String(item.value).padStart(2,"0")}







</div>







<div



style={{



marginTop:"8px",



fontSize:viewportWidth<768?"11px":"14px",



fontWeight:"800",



color:"#6B7280",



}}



>







{item.label}







</div>







</div>







{index<2&&(







<div



style={{



fontSize:viewportWidth<768?"30px":"48px",



fontWeight:"900",



color:"#FFF",



}}



>







:







</div>







)}







</div>







))}







</div>







{/* MESSAGE */}







<div



style={{



marginTop:"20px",



textAlign:"center",



color:"#EAF2FF",



fontSize:viewportWidth<768?"13px":"15px",



lineHeight:"24px",



fontWeight:"600",



}}



>







<FaFire



style={{



marginRight:"8px",



color:"#FFD54A",



}}



/>







Profitez des meilleures offres avant la fin du compte à rebours.







</div>







</div>







{/* ================= NOTIFICATION ACHAT ================= */}







{notification && (







<div



style={{



marginBottom:"22px",



background:"#FFFFFF",



borderRadius:viewportWidth<768?"18px":"24px",



padding:viewportWidth<768?"14px":"20px",



display:"flex",



alignItems:"center",



justifyContent:"space-between",



gap:viewportWidth<768?"12px":"16px",



boxShadow:"0 8px 25px rgba(15,23,42,.08)",



border:"1px solid #EEF2F7",



width:"100%",



overflow:"hidden",



}}



>







{/* IMAGE + TEXTE */}







<div



style={{



display:"flex",



alignItems:"center",



gap:viewportWidth<768?"12px":"16px",



flex:1,



minWidth:0,



}}



>







<img



src={notification.product.image || "/logo.jpg"}



alt={notification.product.name}



style={{



width:viewportWidth<768?"60px":"88px",



height:viewportWidth<768?"60px":"88px",



borderRadius:viewportWidth<768?"14px":"18px",



objectFit:"cover",



background:"#F8FAFC",



flexShrink:0,



}}



/>







<div



style={{



flex:1,



minWidth:0,



}}



>







<div



style={{



display:"flex",



alignItems:"center",



gap:"8px",



marginBottom:"4px",



}}



>







<div



style={{



width:viewportWidth<768?"24px":"28px",



height:viewportWidth<768?"24px":"28px",



borderRadius:"50%",



background:"color-mix(in srgb, var(--season-primary, #2563eb) 8%, white)",



display:"flex",



justifyContent:"center",



alignItems:"center",



}}



>







<FaShoppingBag



style={{



color:"var(--season-primary, #2563eb)",



fontSize:viewportWidth<768?"12px":"14px",



}}



/>







</div>







<span



style={{



fontWeight:"900",



fontSize:viewportWidth<768?"15px":"20px",



color:"#111827",



}}



>







Nouvelle commande







</span>







</div>







<p



style={{



margin:0,



fontSize:viewportWidth<768?"13px":"17px",



fontWeight:"600",



lineHeight:viewportWidth<768?"20px":"30px",



color:"#374151",



}}



>







<b>{notification.person}</b>{" "}



à{" "}



<b>{notification.city}</b>{" "}



vient d'acheter







</p>







<div



style={{



marginTop:"4px",



fontWeight:"900",



fontSize:viewportWidth<768?"14px":"19px",



color:"var(--season-primary, #2563eb)",



overflow:"hidden",



whiteSpace:"nowrap",



textOverflow:"ellipsis",



}}



>







{notification.product.name}







</div>







<div



style={{



display:"flex",



alignItems:"center",



gap:"6px",



marginTop:"8px",



color:"#6B7280",



fontSize:viewportWidth<768?"11px":"14px",



}}



>







<FaClock/>







Il y a {notification.minutesAgo} min







</div>







</div>







</div>







{/* ETAT */}







<div



style={{



display:"flex",



justifyContent:"center",



alignItems:"center",



paddingLeft:viewportWidth<768?"4px":"10px",



flexShrink:0,



}}



>







<div



style={{



width:viewportWidth<768?"12px":"16px",



height:viewportWidth<768?"12px":"16px",



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



marginBottom:"28px",



width:"100%",



}}



>







{/* HEADER */}







<div



style={{



display:"flex",



justifyContent:"space-between",



alignItems:"center",



marginBottom:"18px",



gap:"10px",



flexWrap:"wrap",



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



width:viewportWidth<768?"34px":"40px",



height:viewportWidth<768?"34px":"40px",



borderRadius:"50%",



background:"color-mix(in srgb, var(--season-primary, #2563eb) 8%, white)",



display:"flex",



justifyContent:"center",



alignItems:"center",



flexShrink:0,



}}



>







<FaFire



style={{



color:"var(--season-primary, #2563eb)",



fontSize:viewportWidth<768?"16px":"20px",



}}



/>







</div>







<h2



style={{



margin:0,



fontSize:viewportWidth<768?"20px":"32px",



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



gap:"6px",



color:"var(--season-primary, #2563eb)",



fontWeight:"800",



fontSize:viewportWidth<768?"13px":"16px",



}}



>







Voir tout







<FaChevronLeft



style={{



transform:"rotate(180deg)",



fontSize:viewportWidth<768?"12px":"16px",



}}



/>







</Link>







</div>







{/* LISTE */}







<div



style={{



display:"grid",



gridTemplateColumns:



viewportWidth<768



?"repeat(2,minmax(0,1fr))"



:"repeat(auto-fill,minmax(280px,1fr))",



gap:viewportWidth<768?"12px":"18px",



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



borderRadius:viewportWidth<768?"16px":"24px",



overflow:"hidden",



boxShadow:"0 8px 24px rgba(15,23,42,.06)",



border:"1px solid #EEF2F7",



height:"100%",



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



src={product.image || "/logo.jpg"}



alt={product.name}



style={{



width:"100%",



height:viewportWidth<768?"145px":"280px",



objectFit:"cover",



}}



/>







{/* BADGE */}







<div



style={{



position:"absolute",



top:"10px",



left:"10px",



background:"var(--season-primary, #2563eb)",



color:"#FFFFFF",



padding:viewportWidth<768?"5px 10px":"8px 14px",



borderRadius:"10px",



fontWeight:"900",



fontSize:viewportWidth<768?"11px":"14px",



}}



>







-{reduction}%







</div>







{/* ICONE */}







<div



style={{



position:"absolute",



top:"10px",



right:"10px",



width:viewportWidth<768?"34px":"46px",



height:viewportWidth<768?"34px":"46px",



borderRadius:"50%",



background:"#FFFFFF",



display:"flex",



justifyContent:"center",



alignItems:"center",



boxShadow:"0 6px 15px rgba(0,0,0,.10)",



}}



>







<FaTags



style={{



fontSize:viewportWidth<768?"14px":"18px",



color:"#6B7280",



}}



/>







</div>







</div>







{/* INFOS */}







<div



style={{



padding:viewportWidth<768?"12px":"18px",



}}



>







<h3



style={{



margin:"0 0 10px",



fontSize:viewportWidth<768?"15px":"22px",



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



flexDirection:"column",



gap:"4px",



marginBottom:"12px",



}}



>







<span



style={{



fontSize:viewportWidth<768?"18px":"28px",



fontWeight:"900",



color:"var(--season-primary, #2563eb)",



}}



>







{product.price.toLocaleString()} FCFA







</span>







<span



style={{



fontSize:viewportWidth<768?"12px":"18px",



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



height:viewportWidth<768?"42px":"52px",



border:"none",



borderRadius:"12px",



background:"linear-gradient(135deg,var(--season-primary, #2563eb),var(--season-primary, #2563eb))",



color:"#FFFFFF",



fontWeight:"900",



fontSize:viewportWidth<768?"13px":"16px",



cursor:"pointer",



display:"flex",



justifyContent:"center",



alignItems:"center",



gap:"8px",



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



marginBottom:"28px",



width:"100%",



}}



>







<div



style={{



display:"flex",



alignItems:"center",



justifyContent:"space-between",



marginBottom:"18px",



flexWrap:"wrap",



gap:"10px",



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



width:viewportWidth<768?"36px":"42px",



height:viewportWidth<768?"36px":"42px",



borderRadius:"50%",



background:"color-mix(in srgb, var(--season-primary, #2563eb) 8%, white)",



display:"flex",



justifyContent:"center",



alignItems:"center",



}}



>







<FaUsers



style={{



color:"var(--season-primary, #2563eb)",



fontSize:viewportWidth<768?"16px":"18px",



}}



/>







</div>







<h2



style={{



margin:0,



fontSize:viewportWidth<768?"22px":"34px",



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



viewportWidth<768



?"repeat(2,minmax(0,1fr))"



:"repeat(4,1fr)",



gap:viewportWidth<768?"12px":"16px",



}}



>







{[



{



icon:<FaUsers/>,



title:"Clients",



value:stats.users.toLocaleString(),



color:"var(--season-primary, #2563eb)",



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



color:"var(--season-secondary, #3b82f6)",



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



borderRadius:viewportWidth<768?"18px":"24px",



padding:viewportWidth<768?"16px":"22px",



textAlign:"center",



border:"1px solid #EEF2F7",



boxShadow:"0 6px 18px rgba(15,23,42,.05)",



}}



>







<div



style={{



width:viewportWidth<768?"46px":"60px",



height:viewportWidth<768?"46px":"60px",



margin:"0 auto 12px",



borderRadius:"50%",



background:`color-mix(in srgb, ${item.color} 8%, white)`,



display:"flex",



justifyContent:"center",



alignItems:"center",



fontSize:viewportWidth<768?"18px":"24px",



color:item.color,



}}



>







{item.icon}







</div>







<h3



style={{



margin:0,



fontSize:viewportWidth<768?"20px":"28px",



fontWeight:"900",



color:"#111827",



}}



>







{item.value}







</h3>







<p



style={{



marginTop:"6px",



fontSize:viewportWidth<768?"12px":"14px",



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



marginBottom:"28px",



}}



>







<h2



style={{



marginBottom:"18px",



fontWeight:"900",



fontSize:viewportWidth<768?"22px":"34px",



color:"#111827",



}}



>







Pourquoi choisir KONAN SHOPPING ?







</h2>







<div



style={{



display:"grid",



gridTemplateColumns:



viewportWidth<768



?"repeat(2,minmax(0,1fr))"



:"repeat(4,1fr)",



gap:viewportWidth<768?"12px":"16px",



}}



>







{[



{



icon:<FaTruck/>,



title:"Livraison rapide",



color:"var(--season-primary, #2563eb)",



},







{



icon:<FaMoneyBillWave/>,



title:"Paiement à la livraison",



color:"#16A34A",



},







{



icon:<FaShieldAlt/>,



title:"Paiement sécurisé",



color:"var(--season-secondary, #3b82f6)",



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



borderRadius:viewportWidth<768?"18px":"24px",



padding:viewportWidth<768?"16px":"22px",



textAlign:"center",



border:"1px solid #EEF2F7",



boxShadow:"0 6px 18px rgba(15,23,42,.05)",



}}



>







<div



style={{



width:viewportWidth<768?"48px":"60px",



height:viewportWidth<768?"48px":"60px",



margin:"0 auto 14px",



borderRadius:"50%",



background:`color-mix(in srgb, ${item.color} 8%, white)`,



display:"flex",



justifyContent:"center",



alignItems:"center",



fontSize:viewportWidth<768?"18px":"24px",



color:item.color,



}}



>







{item.icon}







</div>







<h3



style={{



margin:0,



fontWeight:"800",



fontSize:viewportWidth<768?"13px":"16px",



color:"#111827",



lineHeight:"20px",



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



background:"linear-gradient(135deg,var(--season-primary, #2563eb),var(--season-secondary, #3b82f6))",



borderRadius:viewportWidth<768?"20px":"30px",



padding:viewportWidth<768?"22px 18px":"48px",



color:"#FFFFFF",



textAlign:"center",



marginBottom:"28px",



boxShadow:"0 15px 35px color-mix(in srgb, var(--season-primary, #2563eb) 22%, transparent)",



overflow:"hidden",



}}



>







<div



style={{



width:viewportWidth<768?"60px":"80px",



height:viewportWidth<768?"60px":"80px",



margin:"0 auto 18px",



borderRadius:"50%",



background:"rgba(255,255,255,.18)",



display:"flex",



justifyContent:"center",



alignItems:"center",



}}



>







<FaCrown



style={{



fontSize:viewportWidth<768?"30px":"40px",



color:"#FFD54A",



}}



/>







</div>







<h2



style={{



margin:0,



fontWeight:"900",



fontSize:viewportWidth<768?"24px":"42px",



lineHeight:"1.2",



}}



>







Profitez des meilleures offres







</h2>







<p



style={{



margin:"14px auto 22px",



maxWidth:"600px",



lineHeight:viewportWidth<768?"24px":"30px",



fontSize:viewportWidth<768?"14px":"16px",



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



gap:"8px",



padding:viewportWidth<768?"13px 22px":"16px 30px",



background:"#FFFFFF",



color:"var(--season-primary, #2563eb)",



textDecoration:"none",



fontWeight:"900",



fontSize:viewportWidth<768?"14px":"16px",



borderRadius:"14px",



width:viewportWidth<768?"100%":"auto",



maxWidth:"320px",



}}



>







<FaShoppingBag/>







Découvrir les promotions







</Link>







</div>







{/* ================= FOOTER ================= */}







<footer



style={{



marginTop:"30px",



marginBottom:viewportWidth<768?"90px":"20px",



background:"#FFFFFF",



borderRadius:viewportWidth<768?"20px":"30px",



padding:viewportWidth<768?"22px 16px":"40px",



boxShadow:"0 8px 25px rgba(15,23,42,.05)",



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



width:viewportWidth<768?"60px":"72px",



height:viewportWidth<768?"60px":"72px",



borderRadius:viewportWidth<768?"18px":"22px",



objectFit:"cover",



boxShadow:"0 8px 20px color-mix(in srgb, var(--season-primary, #2563eb) 15%, transparent)",



}}



/>







<h2



translate="no"



style={{



marginTop:"14px",



marginBottom:"8px",



fontSize:viewportWidth<768?"22px":"34px",



fontWeight:"900",



color:"#111827",



textAlign:"center",



}}



>







KONAN SHOPPING







</h2>







<p



style={{



margin:0,



textAlign:"center",



maxWidth:"520px",



fontSize:viewportWidth<768?"13px":"15px",



lineHeight:viewportWidth<768?"22px":"28px",



color:"#6B7280",



}}



>







Des milliers de Camerounais nous font confiance pour acheter leurs produits au meilleur prix avec une livraison rapide et un paiement uniquement à la livraison.







</p>







</div>







{/* LIENS */}







<div



style={{



marginTop:"24px",



display:"grid",



gridTemplateColumns:



viewportWidth<768



?"repeat(2,minmax(0,1fr))"



:"repeat(4,auto)",



justifyContent:"center",



gap:"14px",



}}



>







<Link



to="/boutique"



style={{



textDecoration:"none",



fontWeight:"800",



color:"var(--season-primary, #2563eb)",



display:"flex",



justifyContent:"center",



alignItems:"center",



gap:"8px",



fontSize:viewportWidth<768?"13px":"15px",



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



color:"var(--season-primary, #2563eb)",



display:"flex",



justifyContent:"center",



alignItems:"center",



gap:"8px",



fontSize:viewportWidth<768?"13px":"15px",



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



color:"var(--season-primary, #2563eb)",



display:"flex",



justifyContent:"center",



alignItems:"center",



gap:"8px",



fontSize:viewportWidth<768?"13px":"15px",



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



justifyContent:"center",



alignItems:"center",



gap:"8px",



fontSize:viewportWidth<768?"13px":"15px",



}}



>







<FaHeadset/>







WhatsApp







</a>







</div>







{/* ================= BANDEAU ================= */}







<div



style={{



marginTop:"24px",



padding:viewportWidth<768?"16px":"18px",



borderRadius:viewportWidth<768?"16px":"18px",



background:"#F8FAFC",



display:"grid",



gridTemplateColumns:



viewportWidth<768



?"repeat(1,1fr)"



:"repeat(3,1fr)",



gap:"14px",



border:"1px solid #EEF2F7",



}}



>







<div



style={{



display:"flex",



justifyContent:"center",



alignItems:"center",



gap:"8px",



fontWeight:"800",



color:"var(--season-primary, #2563eb)",



fontSize:viewportWidth<768?"14px":"16px",



}}



>







<FaTruck



style={{



fontSize:viewportWidth<768?"18px":"20px",



}}



/>







Livraison rapide







</div>







<div



style={{



display:"flex",



justifyContent:"center",



alignItems:"center",



gap:"8px",



fontWeight:"800",



color:"#16A34A",



fontSize:viewportWidth<768?"14px":"16px",



}}



>







<FaMoneyBillWave



style={{



fontSize:viewportWidth<768?"18px":"20px",



}}



/>







Paiement à la livraison







</div>







<div



style={{



display:"flex",



justifyContent:"center",



alignItems:"center",



gap:"8px",



fontWeight:"800",



color:"#F59E0B",



fontSize:viewportWidth<768?"14px":"16px",



}}



>







<FaStar



style={{



fontSize:viewportWidth<768?"18px":"20px",



}}



/>







Service Premium







</div>







</div>







{/* ================= COPYRIGHT ================= */}







<div



style={{



marginTop:"24px",



paddingTop:"20px",



borderTop:"1px solid #E5E7EB",



textAlign:"center",



}}



>







<p



style={{



margin:0,



fontSize:viewportWidth<768?"12px":"13px",



color:"#9CA3AF",



lineHeight:viewportWidth<768?"22px":"26px",



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