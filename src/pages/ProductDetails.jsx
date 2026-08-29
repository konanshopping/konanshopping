import {
  useParams,
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { Helmet } from "react-helmet-async";

import { toast } from "react-toastify";

import {
  useNavigate,
} from "react-router-dom";

import {

  FaHeart,

  FaShoppingCart,

  FaBolt,

  FaStar,

  FaTruck,

  FaShieldAlt,

  FaGem,

  FaCommentDots,

  FaArrowLeft,

  FaThumbsUp,

  FaThumbsDown,

  FaUserCircle,

  FaCheckCircle,

  FaReply,
  FaImage,

} from "react-icons/fa";

import { FaClock } from "react-icons/fa";

import { FaTrophy } from "react-icons/fa";

import SeoProduct from "../components/SeoProduct";

import SeoMeta from "../components/SeoMeta";

import SeoBreadcrumb from "../components/SeoBreadcrumb";

function ProductDetails() {

const navigate = useNavigate();


   const [mobile, setMobile] = useState(
  window.innerWidth <= 768
);

useEffect(() => {
  const handleResize = () => {
    setMobile(window.innerWidth <= 768);
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

const getTimeAgo = (date) => {
  const seconds = Math.floor(
    (new Date() - new Date(date)) / 1000
  );

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (minutes < 1)
    return "à l'instant";

  if (minutes < 60)
    return `il y a ${minutes} min`;

  if (hours < 24)
    return `il y a ${hours} h`;

  if (days < 7)
    return `il y a ${days} jour${days > 1 ? "s" : ""}`;

  return `il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
};

// =========================
// CLIENT ID
// =========================

const user =
  JSON.parse(
    localStorage.getItem("user")
  );


const clientId =

  user?._id ||

  localStorage.getItem(
    "guestId"
  ) ||

  (() => {

    const newGuestId =
      "guest_" + Date.now();

    localStorage.setItem(
      "guestId",
      newGuestId
    );

    return newGuestId;

  })();

// =========================
// STORAGE KEYS
// =========================

const cartKey =
  `cart_${clientId}`;

const favoritesKey =
  `favorites_${clientId}`;

const { id } = useParams();

const [product, setProduct] =
  useState(null);

const [similarProducts,
setSimilarProducts] =
  useState([]);

 const reviews = product?.reviews || [];

const totalReviews = reviews.length;

const fiveStars = reviews.filter(
(r) => r.rating === 5
).length;

const fourStars = reviews.filter(
(r) => r.rating === 4
).length;

const threeStars = reviews.filter(
(r) => r.rating === 3
).length;

const twoStars = reviews.filter(
(r) => r.rating === 2
).length;

const oneStar = reviews.filter(
(r) => r.rating === 1
).length;

const [reviewName,
setReviewName] =
  useState("");

const [reviewComment,
setReviewComment] =
  useState("");

  const [replyText,
setReplyText] =
useState("");

const [reviewRating,
setReviewRating] =
  useState(5);

  const [reviewImages,
setReviewImages] =
useState([]);

const [selectedImage,
setSelectedImage] =
useState(null);

const [openReply, setOpenReply] =
  useState(null);

  const [clickSound] = useState(
  () => new Audio("/sounds/click.mp3")
);

const playClick = () => {
  clickSound.currentTime = 0;
  clickSound.volume = 0.5;
  clickSound.play().catch(() => {});
};

const openProduct = (_id) => {
  playClick();

  navigate(`/product/${_id}`);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const [showAllReviews, setShowAllReviews] = useState(false);

const getProduct = async () => {

  try {

    const res = await axios.get(
  `https://konanshopping.com/api/product/${id}`
);

    setProduct(res.data);

    const response =
      await axios.get(
        "https://konanshopping.com/api/products"
      );

    const similar =
  response.data.filter(
    (item) =>
      item.category ===
        res.data.category &&

      item._id !==
        res.data._id
  );

// =========================
// MÉLANGE ALÉATOIRE
// =========================
// Tous les produits sont conservés.
// Seul leur ordre est mélangé.

const shuffledSimilar =
  [...similar].sort(
    () => Math.random() - 0.5
  );

setSimilarProducts(
  shuffledSimilar
);

  }

  catch (error) {

    console.log(error);

  }

};

// =========================
// LOAD PRODUCT
// =========================

useEffect(() => {

  getProduct();

}, [id]);

useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [id]);

// =========================
// LOADING
// =========================

if (!product)
  return (
    <>
      <style>{`
        @keyframes spin {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }

        @keyframes pulse {

          0%, 100% {
            transform:
              translate(-50%, -50%)
              scale(1);

            box-shadow:
              0 0 10px
              rgba(75,46,131,.15);
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.08);

            box-shadow:
              0 0 24px
              rgba(124,58,237,.35);
          }

        }

        @keyframes fade {

          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }

        }

        @keyframes shimmer {

          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }

        }
      `}</style>

      <div
        style={{
          position: "fixed",

          inset: 0,

          background: "#fff",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          flexDirection: "column",

          zIndex: 999999,

          animation: "fade .35s ease",
        }}
      >

        {/* LOADER */}

        <div
          style={{
            position: "relative",

            width:
              mobile
                ? "74px"
                : "90px",

            height:
              mobile
                ? "74px"
                : "90px",
          }}
        >

          {/* CERCLE */}

          <div
            style={{
              position: "absolute",

              inset: 0,

              border:
                "3px solid #ECECF8",

              borderTop:
                "3px solid #4B2E83",

              borderRight:
                "3px solid #7C3AED",

              borderRadius: "50%",

              animation:
                "spin .85s linear infinite",
            }}
          />

          {/* LOGO */}

          <div
            style={{
              position: "absolute",

              top: "50%",

              left: "50%",

              transform:
                "translate(-50%,-50%)",

              width:
                mobile
                  ? "46px"
                  : "56px",

              height:
                mobile
                  ? "46px"
                  : "56px",

              borderRadius: "50%",

              overflow: "hidden",

              background: "#fff",

              border: "2px solid #fff",

              animation:
                "pulse 1.8s ease-in-out infinite",

              boxShadow:
                "0 8px 22px rgba(75,46,131,.18)",
            }}
          >

            <img
              src="/logo.jpg"

              alt="Konan Shopping"

              style={{
                width: "100%",

                height: "100%",

                objectFit: "cover",

                display: "block",

              }}
            />

          </div>

        </div>

        {/* TEXTE */}

        <div
          translate="no"
          style={{
            marginTop: "18px",

            fontSize:
              mobile
                ? "11px"
                : "12px",

            fontStyle: "italic",

            fontWeight: "600",

            letterSpacing: "1.2px",

            textTransform: "lowercase",

            background:
              "linear-gradient(90deg,#B8BCC8 20%,#4B2E83 50%,#B8BCC8 80%)",

            backgroundSize:
              "200% auto",

            WebkitBackgroundClip:
              "text",

            WebkitTextFillColor:
              "transparent",

            animation:
              "shimmer 1.8s linear infinite",

            userSelect: "none",
          }}
        >
          Chargement produits...
        </div>

      </div>
    </>
  );

    const productUrl = `https://konanshopping.com/product/${product._id}`;

const productImage = product.image;

const averageRating =
  product.reviews?.length > 0
    ? (
        product.reviews.reduce(
          (t, r) => t + r.rating,
          0
        ) / product.reviews.length
      ).toFixed(1)
    : "5";

// =========================
// ADD TO CART
// =========================

const addToCart = () => {

  const cart =

    JSON.parse(
      localStorage.getItem(
        cartKey
      )
    ) || [];

  const existing =
    cart.find(
      (item) =>
        item._id === product._id
    );

  if (existing) {

    existing.quantity += 1;

  }

  else {

    cart.push({

      ...product,

      quantity: 1,

    });

  }

  localStorage.setItem(

    cartKey,

    JSON.stringify(cart)

  );

  localStorage.setItem(

    "cartCount",

    cart.length

  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  toast.success(
    "Produit ajouté 🛒"
  );

};

// =========================
// FAVORITES
// =========================

const addToFavorites = () => {

  let favorites =

    JSON.parse(
      localStorage.getItem(
        favoritesKey
      )
    ) || [];

  const exists =
    favorites.find(
      (item) =>
        item._id === product._id
    );

  if (exists) {

    favorites =
      favorites.filter(
        (item) =>
          item._id !== product._id
      );

  }

  else {

    favorites.push(product);

  }

  localStorage.setItem(

    favoritesKey,

    JSON.stringify(favorites)

  );

  window.dispatchEvent(
    new Event(
      "favoritesUpdated"
    )
  );

};

// =========================
// REVIEW
// =========================

const submitReview =
async () => {

  // VALIDATION

  if (

    !reviewName ||

    !reviewComment ||

    !reviewRating

  ) {

    toast.warning(
      "Veuillez remplir tous les champs ⚠️"
    );

    return;

  }

  try {

    // FORM DATA

   const formData = new FormData();

formData.append(
  "clientId",
  clientId
);

formData.append(
  "name",
  reviewName
);

formData.append(
  "rating",
  reviewRating
);

formData.append(
  "comment",
  reviewComment
);

reviewImages.forEach(
  (image) => {

    formData.append(
      "images",
      image
    );

  }
);

await axios.post(
  `https://konanshopping.com/api/product/${id}/review`,

  formData,

  {

    headers: {

      "Content-Type":
        "multipart/form-data",

    },

  }

);

    toast.success(
      "Avis ajouté avec succès ⭐"
    );

    // RESET FORM

    setReviewName("");

    setReviewComment("");

    setReviewRating(5);

    setReviewImages([]);

    // RELOAD PRODUCT

   getProduct();

  }

  catch (err) {

    console.log(err);

  toast.error(

      err.response?.data?.message ||

      "Erreur avis ❌"

    );

  }

};

// =====================================================
// 🛍️ KONAN SHOPPING CAMEROUN
// DESCRIPTION PREMIUM ET PROFESSIONNELLE PAR CATÉGORIE
// =====================================================

const getProductDescription = (product) => {

  // ==========================================
  // INFORMATIONS PRINCIPALES
  // ==========================================

  const name =
    product?.name?.trim() ||
    "Ce produit";

  const category =
    product?.category?.trim() ||
    "";

  const price =
    Number(
      product?.promoPrice ??
      product?.price ??
      product?.originalPrice ??
      0
    ) || 0;

  const formattedPrice =
    price > 0
      ? new Intl.NumberFormat(
          "fr-FR"
        ).format(price)
      : null;


  // ==========================================
  // 💰 PRIX
  // ==========================================

  const priceText = formattedPrice
    ? `Disponible au prix de ${formattedPrice} FCFA.`
    : "Prix disponible sur demande.";


  // ==========================================
  // 🚚 LIVRAISON KONAN SHOPPING
  // ==========================================

  const deliveryText =
    `Commandez dès maintenant sur Konan Shopping Cameroun et profitez d'une expérience d'achat simple, rapide et sécurisée. Notre équipe vous accompagne tout au long de votre commande afin de vous garantir un excellent service et une livraison adaptée à vos besoins.`;


  // ==========================================
  // 📞 CONFIRMATION TAILLE VÊTEMENTS
  // ==========================================

  const sizeText =
    `Disponible en différentes tailles selon le modèle et les disponibilités. Afin de vous garantir la taille la plus adaptée, notre équipe vous contactera directement après votre commande pour confirmer votre taille avant la préparation et la livraison de votre article.`;


  // ==========================================
  // 👟 CONFIRMATION POINTURE CHAUSSURES
  // ==========================================

  const shoeSizeText =
    `Disponible en différentes pointures selon les modèles et les disponibilités. Après votre commande, notre équipe vous contactera directement afin de confirmer votre pointure avant la préparation de votre commande. Cette étape nous permet de vous livrer la pointure la plus adaptée et d'améliorer votre expérience d'achat.`;


  // ==========================================
  // 👕 DESCRIPTION PREMIUM VÊTEMENTS
  // ==========================================

  const clothingText = (type) =>
    `Découvrez ${name}, un(e) ${type} soigneusement sélectionné(e) par Konan Shopping Cameroun pour répondre aux exigences de style, de confort et de qualité de nos clients.

Pensé(e) pour s'intégrer facilement à votre quotidien, ce modèle vous permet de compléter votre garde-robe avec une pièce tendance, pratique et agréable à porter. Sa conception et son style en font un excellent choix pour différentes occasions, selon le modèle sélectionné.

${sizeText}

${priceText}

${deliveryText}`;


  // ==========================================
  // 👟 DESCRIPTION PREMIUM CHAUSSURES
  // ==========================================

  const shoeText = (type) =>
    `Découvrez ${name}, un(e) ${type} soigneusement sélectionné(e) par Konan Shopping Cameroun pour son style, son confort et son excellent potentiel d'utilisation au quotidien.

Ce modèle est idéal pour celles et ceux qui recherchent une chaussure capable d'apporter une touche moderne à leur look tout en restant confortable et pratique. Que ce soit pour vos sorties, votre quotidien ou pour compléter une tenue particulière, ${name} constitue un choix élégant et tendance.

${shoeSizeText}

${priceText}

${deliveryText}`;


  // ==========================================
  // 📝 DESCRIPTION PAR CATÉGORIE
  // ==========================================

  const descriptions = {


    // ==========================================
    // 👕 VÊTEMENTS & MODE
    // ==========================================

    "T-shirts":
      clothingText("T-shirt"),

    "Chemises":
      clothingText("chemise"),

    "Blouses":
      clothingText("blouse"),

    "Polos":
      clothingText("polo"),

    "Débardeurs":
      clothingText("débardeur"),

    "Pulls":
      clothingText("pull"),

    "Gilets":
      clothingText("gilet"),

    "Sweats":
      clothingText("sweat"),

    "Hoodies":
      clothingText("hoodie"),

    "Vestes":
      clothingText("veste"),

    "Blousons":
      clothingText("blouson"),

    "Manteaux":
      clothingText("manteau"),

    "Costumes":
      clothingText("costume"),

    "Blazers":
      clothingText("blazer"),

    "Robes":
      clothingText("robe"),

    "Jupes":
      clothingText("jupe"),

    "Pantalons":
      clothingText("pantalon"),

    "Jeans":
      clothingText("jean"),

    "Leggings":
      clothingText("legging"),

    "Shorts":
      clothingText("short"),

    "Combinaisons":
      clothingText("combinaison"),

    "Pyjamas":
      clothingText("pyjama"),

    "Sous-vêtements":
      clothingText("article de sous-vêtement"),

    "Lingerie":
      clothingText("article de lingerie"),

    "Chaussettes":
      `Découvrez ${name}, un article soigneusement sélectionné pour apporter confort et praticité à votre quotidien.

Grâce à son utilisation simple et agréable, ce produit constitue un excellent complément à votre garde-robe et à vos tenues.

${priceText}

${deliveryText}`,

    "Maillots de bain":
      clothingText("maillot de bain"),

    "Vêtements de sport":
      clothingText("vêtement de sport"),

    "Tenues de yoga":
      clothingText("tenue de yoga"),

    "Mode homme":
      `Découvrez ${name}, un article de mode pour homme sélectionné avec soin par Konan Shopping Cameroun.

Alliant style, confort et praticité, ce produit est idéal pour accompagner votre quotidien et vous aider à composer un look qui correspond à vos envies.

${sizeText}

${priceText}

${deliveryText}`,

    "Mode femme":
      `Découvrez ${name}, un article de mode pour femme soigneusement sélectionné pour celles qui souhaitent associer élégance, confort et tendance.

Son style polyvalent permet de l'intégrer facilement à différentes tenues et de l'adapter à votre quotidien selon vos envies.

${sizeText}

${priceText}

${deliveryText}`,

    "Mode enfant":
      `Découvrez ${name}, un article spécialement sélectionné pour accompagner les enfants avec confort et style.

Notre objectif est de proposer des articles pratiques et adaptés au quotidien, tout en tenant compte des besoins liés au confort et à la taille.

${sizeText}

${priceText}

${deliveryText}`,

    "Mode bébé":
      `Découvrez ${name}, un article soigneusement sélectionné pour le confort et le bien-être des bébés.

Pratique et adapté au quotidien, il constitue un excellent choix pour accompagner votre enfant avec confort.

${sizeText}

${priceText}

${deliveryText}`,


    // ==========================================
    // 👟 CHAUSSURES
    // ==========================================

    "Chaussures":
      shoeText("chaussure"),

    "Baskets":
      shoeText("basket"),

    "Chaussures de ville":
      shoeText("chaussure de ville"),

    "Bottes":
      shoeText("botte"),

    "Bottines":
      shoeText("bottine"),

    "Sandales":
      shoeText("sandale"),

    "Mocassins":
      shoeText("mocassin"),

    "Escarpins":
      shoeText("escarpin"),

    "Ballerines":
      shoeText("ballerine"),

    "Claquettes":
      shoeText("claquette"),


    // ==========================================
    // 👜 SACS & VOYAGES
    // ==========================================

    "Sacs à main":
      `Découvrez ${name}, un sac à main soigneusement sélectionné pour associer élégance, praticité et confort d'utilisation.

Idéal pour transporter vos essentiels tout en apportant une touche raffinée à votre style, ce modèle peut accompagner vos sorties, vos déplacements et votre quotidien selon vos besoins.

${priceText}

${deliveryText}`,

    "Sacs à dos":
      `Découvrez ${name}, un sac à dos pratique et polyvalent conçu pour accompagner vos déplacements au quotidien.

Il constitue une solution idéale pour transporter et organiser vos effets personnels à l'école, au travail, lors de vos sorties ou pendant vos déplacements.

${priceText}

${deliveryText}`,

    "Sacs de voyage":
      `Découvrez ${name}, un sac de voyage pratique et spacieux, sélectionné pour vous accompagner lors de vos déplacements.

Il offre une solution adaptée pour transporter vos effets personnels et préparer vos voyages avec davantage de simplicité.

${priceText}

${deliveryText}`,

    "Valises":
      `Découvrez ${name}, une valise sélectionnée pour faciliter l'organisation et le transport de vos affaires pendant vos déplacements.

Pratique et adaptée aux besoins du voyage, elle constitue un excellent choix pour préparer vos effets personnels avec plus de sérénité.

${priceText}

${deliveryText}`,

    "Portefeuilles":
      `Découvrez ${name}, un portefeuille pratique et élégant permettant d'organiser vos cartes, votre argent et vos documents essentiels.

Un accessoire idéal pour accompagner votre quotidien tout en apportant une touche de style à vos essentiels.

${priceText}

${deliveryText}`,


    // ==========================================
    // ⌚ ACCESSOIRES DE MODE
    // ==========================================

    "Ceintures":
      `Découvrez ${name}, une ceinture soigneusement sélectionnée pour compléter vos tenues avec élégance.

Pratique et polyvalente, elle vous permet d'ajouter une finition soignée à votre look tout en répondant aux besoins du quotidien.

${priceText}

${deliveryText}`,

    "Montres":
      `Découvrez ${name}, une montre sélectionnée pour son élégance et son style.

Plus qu'un simple accessoire, elle constitue un élément capable de compléter votre tenue et d'apporter une touche moderne à votre apparence.

${priceText}

${deliveryText}`,

    "Bijoux":
      `Découvrez ${name}, un bijou soigneusement sélectionné pour apporter une touche d'élégance et de personnalité à votre style.

Idéal pour compléter une tenue ou pour offrir, cet article vous permet de mettre en valeur votre look selon vos envies.

${priceText}

${deliveryText}`,

    "Lunettes":
      `Découvrez ${name}, un accessoire tendance sélectionné pour compléter votre style.

Son design et son utilisation permettent d'apporter une touche moderne à votre apparence et de s'intégrer facilement à différentes tenues.

${priceText}

${deliveryText}`,

    "Casquettes":
      `Découvrez ${name}, une casquette tendance et pratique, idéale pour compléter votre style au quotidien.

Elle constitue un excellent accessoire pour apporter une touche moderne et décontractée à vos tenues.

${priceText}

${deliveryText}`,

    "Chapeaux":
      `Découvrez ${name}, un chapeau soigneusement sélectionné pour compléter votre tenue avec élégance.

Son style permet d'apporter une touche distinctive à votre apparence et de créer un look plus personnel.

${priceText}

${deliveryText}`,

    "Écharpes":
      `Découvrez ${name}, une écharpe pratique et élégante, idéale pour compléter votre tenue avec style.

Elle peut accompagner différentes tenues et apporter davantage de confort selon vos besoins.

${priceText}

${deliveryText}`,

    "Foulards":
      `Découvrez ${name}, un foulard élégant et polyvalent qui vous permet d'ajouter une touche personnelle à votre style.

Un accessoire pratique pour varier vos tenues et exprimer votre élégance selon vos envies.

${priceText}

${deliveryText}`,

    "Gants":
      `Découvrez ${name}, une paire de gants sélectionnée pour associer confort et praticité.

Un accessoire utile et élégant pour compléter votre tenue et accompagner votre quotidien.

${priceText}

${deliveryText}`,

    "Accessoires":
      `Découvrez ${name}, un accessoire soigneusement sélectionné par Konan Shopping Cameroun.

Pratique et utile, il est conçu pour répondre à vos besoins et compléter votre équipement ou votre quotidien.

${priceText}

${deliveryText}`,

    "Accessoires de mode":
      `Découvrez ${name}, un accessoire de mode soigneusement sélectionné pour compléter votre style.

Il vous permet d'apporter une touche personnelle et élégante à votre look tout en restant pratique au quotidien.

${priceText}

${deliveryText}`,


    // ==========================================
    // ✨ COLLECTIONS
    // ==========================================

    "Luxe":
      `Découvrez ${name}, un article de notre collection Luxe, sélectionné pour les clients à la recherche d'un produit au style élégant et premium.

Cette sélection met en avant des articles capables d'apporter une touche distinctive à votre quotidien et à votre style.

${priceText}

${deliveryText}`,

    "Nouveautés":
      `Découvrez ${name}, l'une des nouveautés disponibles sur Konan Shopping Cameroun.

Notre sélection de nouveautés vous permet de découvrir régulièrement des articles tendance et soigneusement choisis pour répondre à vos besoins.

${priceText}

${deliveryText}`,

    "Promotions":
      `Profitez de ${name}, actuellement proposé dans le cadre de nos offres promotionnelles.

C'est une excellente occasion de commander un article soigneusement sélectionné à un prix avantageux, tout en bénéficiant du service Konan Shopping Cameroun.

${priceText}

${deliveryText}`
  };


  // ==========================================
  // 🔎 RECHERCHE DE LA CATÉGORIE
  // ==========================================

  const categoryKey =
    Object.keys(descriptions).find(
      (key) =>
        key
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
        ===
        category
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    );


  // ==========================================
  // 🌟 DESCRIPTION PAR DÉFAUT
  // ==========================================

  return (
    descriptions[categoryKey] ||

    `Découvrez ${name}, un produit soigneusement sélectionné par Konan Shopping Cameroun pour répondre aux besoins de nos clients.

Nous mettons un point d'honneur à proposer des articles pratiques, tendance et accessibles, afin de vous offrir une expérience d'achat simple et agréable.

${priceText}

${deliveryText}`
  );
};


return (

<>

<SeoProduct
  product={product}
  productUrl={productUrl}
  productImage={productImage}
  averageRating={averageRating}
/>

<SeoMeta
  title={`${product.name} - Acheter au Cameroun | KONAN SHOPPING`}
  description={`${product.name} disponible chez KONAN SHOPPING Cameroun. Livraison rapide, paiement à la livraison, meilleur prix au Cameroun.`}
  image={productImage}
  url={productUrl}
  type="product"
  keywords={`${product.name}, Cameroun, Yaoundé, Douala, boutique en ligne, KONAN SHOPPING, livraison, achat`}
/>

 <SeoBreadcrumb
      pageUrl={productUrl}
      items={[
        {
          name: "Accueil",
          url: "https://konanshopping.com/",
        },
        {
          name: "Boutique",
          url: "https://konanshopping.com/boutique",
        },
        ...(product.category
          ? [
              {
                name: product.category,
                url: "https://konanshopping.com/boutique",
              },
            ]
          : []),
        {
          name: product.name,
          url: productUrl,
        },
      ]}
    />

<div
  style={{
    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",

    padding: mobile ? "12px" : "26px",

    width: "100%",

    maxWidth: "1600px",

    margin: "0 auto",

    overflowX: "hidden",

    boxSizing: "border-box",

    fontFamily: "Arial",
  }}
>

{/* BACK */}

<button
  onClick={() => navigate(-1)}
  style={{
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    fontWeight: "700",
    fontSize: mobile ? "15px" : "14px",
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: mobile ? "8px" : "0",
  }}
>
  ← Retour
</button>

{/* PRODUCT CARD */}

<div
  style={{
    marginTop: "18px",

    background: "#fff",

    borderRadius: mobile ? "20px" : "24px",

    padding: mobile ? "12px" : "22px",

    display: "grid",

    gridTemplateColumns:
      mobile
        ? "1fr"
        : "1fr 1fr",

    gap: mobile ? "16px" : "24px",

    width: "100%",

    boxSizing: "border-box",

    overflow: "hidden",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  }}
>

{/* IMAGE */}

<div
  style={{
    width: "100%",

    height: mobile ? "320px" : "520px",

    overflow: "hidden",

    borderRadius: mobile ? "18px" : "22px",

    background:
      "linear-gradient(135deg,#f9fafb,#eef2ff)",

    position: "relative",
  }}
>

<img
  src={product.image}
  alt=""
  fetchPriority="high"
  decoding="async"

  onClick={() => {
    setSelectedImage(product.image);
  }}

  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "0.4s",
    cursor: "zoom-in",
  }}

  onMouseEnter={(e) => {
    if (!mobile) {
      e.currentTarget.style.transform =
        "scale(1.05)";
    }
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "scale(1)";
  }}
/>

</div>

{/* CONTENT */}

<div
  style={{
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    boxSizing: "border-box",
  }}
>

<p
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",

    color: "#6b7280",

    fontSize: mobile ? "14px" : "13px",

    marginBottom: "10px",

    fontWeight: "600",

    flexWrap: "wrap",
  }}
>
<FaGem /> {product.category}
</p>

<h1
  style={{
    fontSize: mobile ? "30px" : "38px",

    marginBottom: "16px",

    color: "#111827",

    fontWeight: "900",

    lineHeight: "1.2",

    wordBreak: "break-word",
  }}
>
  {product.name}
</h1>

<div
  style={{
    display: "flex",

    alignItems: mobile ? "flex-start" : "center",

    justifyContent: "space-between",

    flexDirection: mobile ? "column" : "row",

    gap: mobile ? "15px" : "12px",

    marginBottom: "20px",

    width: "100%",
  }}
>

{/* LEFT */}

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "12px",

    flexWrap: "wrap",
  }}
>

{/* STARS */}

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "4px",

    background:
      "linear-gradient(135deg,#fff7ed,#fffbeb)",

    padding: mobile ? "7px 10px" : "8px 12px",

    borderRadius: "999px",

    border:
      "1px solid rgba(245,158,11,0.15)",

    boxShadow:
      "0 4px 12px rgba(245,158,11,0.08)",
  }}
>

{[...Array(5)].map((_, index) => {

const averageRating =

product.reviews?.length > 0

? (

product.reviews.reduce(

(total, review) =>

total + review.rating,

0

) /

product.reviews.length

)

: 0;

return (

<FaStar
  key={index}

  style={{
    fontSize: mobile ? "14px" : "13px",

    color:
      index <
      Math.round(
        averageRating
      )

        ? "#f59e0b"

        : "#d1d5db",

    filter:
      index <
      Math.round(
        averageRating
      )

        ? "drop-shadow(0 2px 6px rgba(245,158,11,0.35))"

        : "none",
  }}
/>

);

})}

</div>

{/* NOTE */}

<div>

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "6px",
  }}
>

<span
  style={{
    fontSize: mobile ? "18px" : "16px",

    fontWeight: "900",

    color: "#111827",
  }}
>

{

product.reviews?.length > 0

? (

product.reviews.reduce(

(total, review) =>

total + review.rating,

0

) /

product.reviews.length

).toFixed(1)

: "0.0"

}

</span>

<span
  style={{
    color: "#6b7280",

    fontSize: "12px",

    fontWeight: "600",
  }}
>
/ 5
</span>

</div>

<p
  style={{
    margin: 0,

    marginTop: "2px",

    color: "#6b7280",

    fontSize: "11px",

    fontWeight: "500",
  }}
>
Basé sur {product.reviews?.length || 0} avis
</p>

</div>

</div>

</div>

<h2
  style={{
    color: "#4f46e5",

    fontSize: mobile ? "32px" : "40px",

    marginBottom: "18px",

    fontWeight: "900",

    wordBreak: "break-word",
  }}
>
  {product.price} FCFA
</h2>

<p
  style={{
    color: "#4b5563",

    lineHeight: "1.8",

    marginBottom: "24px",

    fontSize: mobile ? "15px" : "14px",

    wordBreak: "break-word",
  }}
>
  {getProductDescription(product)}
</p>

{/* FEATURES */}

<div
  style={{
    display: "flex",

    flexWrap: "wrap",

    gap: mobile ? "8px" : "10px",

    marginBottom: "22px",

    width: "100%",
  }}
>

<div
  style={{
    ...badgeStyle,
    flex: mobile ? "1 1 calc(50% - 8px)" : "unset",
    justifyContent: "center",
    boxSizing: "border-box",
  }}
>
  <FaTruck />
  Livraison rapide
</div>

<div
  style={{
    ...badgeStyle,
    flex: mobile ? "1 1 calc(50% - 8px)" : "unset",
    justifyContent: "center",
    boxSizing: "border-box",
  }}
>
  <FaShieldAlt />
  Paiement sécurisé
</div>

<div
  style={{
    ...badgeStyle,
    flex: mobile ? "1 1 100%" : "unset",
    justifyContent: "center",
    boxSizing: "border-box",
  }}
>
  <FaGem />
  Premium
</div>

</div>

{/* BUTTONS */}

<div
  style={{
    display: "flex",

    flexDirection: mobile ? "column" : "row",

    gap: "12px",

    alignItems: "stretch",

    width: "100%",
  }}
>

{/* ADD TO CART */}

<button
  onClick={addToCart}

  onMouseEnter={(e) => {
    if (!mobile) {
      e.currentTarget.style.transform =
        "translateY(-3px)";
    }
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px)";
  }}

  style={{
    flex: 1,

    width: "100%",

    border: "none",

    background:
      "linear-gradient(135deg,#6d28d9,#4f46e5)",

    color: "white",

    padding: mobile ? "16px" : "16px",

    borderRadius: "16px",

    fontWeight: "800",

    fontSize: mobile ? "15px" : "14px",

    cursor: "pointer",

    transition: "0.3s",

    boxShadow:
      "0 10px 25px rgba(79,70,229,0.20)",
  }}
>
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }}
>
  <FaShoppingCart />
  Ajouter au panier
</div>
</button>

{/* BUY NOW */}

<button

onClick={() => {

 const cart =

JSON.parse(
localStorage.getItem(
`cart_${clientId}`
)
) || [];

// CHECK EXIST

const existing =
cart.find(
(item)=>
item._id === product._id
);

if(existing){

existing.quantity += 1;

}

else{

cart.push({

...product,

quantity: 1,

});

}

// SAVE CART

localStorage.setItem(

`cart_${clientId}`,

JSON.stringify(cart)

);

// UPDATE UI

window.dispatchEvent(
new Event("cartUpdated")
);

// REDIRECT

navigate("/checkout");

}}

onMouseEnter={(e) => {

if (!mobile) {

  e.currentTarget.style.transform =
    "translateY(-3px)";

}

}}

onMouseLeave={(e) => {

  e.currentTarget.style.transform =
    "translateY(0px)";

}}

style={{
  flex: 1,

  width: "100%",

  border: "none",

  background:
    "#111827",

  color: "white",

  padding: mobile ? "16px" : "16px",

  borderRadius: "16px",

  fontWeight: "800",

  fontSize: mobile ? "15px" : "14px",

  cursor: "pointer",

  transition: "0.3s",

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.12)",
}}
>
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }}
>
  <FaBolt />
  Acheter maintenant
</div>
</button>

</div>

</div>

</div>

{/* AVIS PREMIUM */}

<div
  style={{
    marginTop: "24px",

    background:
      "linear-gradient(135deg,#ffffff,#f8fafc)",

    padding: mobile ? "16px" : "20px",

    borderRadius: mobile ? "18px" : "20px",

    border:
      "1px solid rgba(99,102,241,0.08)",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.04)",

    position: "relative",

    width: "100%",

    boxSizing: "border-box",

    overflow: "hidden",
  }}
>

{/* HEADER */}

<div
  style={{
    display: "flex",

    justifyContent: "space-between",

    alignItems: mobile ? "flex-start" : "center",

    flexDirection: mobile ? "column" : "row",

    gap: "12px",

    marginBottom: "18px",
  }}
>

<div
  style={{
    width: "100%",
    minWidth: 0,
  }}
>

<h3
  style={{
    margin: 0,

    color: "#111827",

    fontSize: mobile ? "18px" : "16px",

    fontWeight: "900",

    display: "flex",

    alignItems: "center",

    gap: "8px",

    flexWrap: "wrap",
  }}
>
<FaStar
  style={{
    color: "#f59e0b",
  }}
/>

Avis clients
</h3>

<p
  style={{
    marginTop: "6px",

    color: "#6b7280",

    fontSize: mobile ? "13px" : "12px",

    fontWeight: "500",

    lineHeight: "1.6",

    wordBreak: "break-word",
  }}
>
⭐ {
product?.reviews?.length > 0
? (
product.reviews.reduce(
(total, review) =>
total + review.rating,
0
) /
product.reviews.length
).toFixed(1)
: "0.0"
} / 5 • {product?.reviews?.length || 0} avis vérifiés •
Votre avis compte pour la communauté Konan Shopping Cameroun.
</p>

</div>

</div>

{/* FORM */}

<div
  style={{
    display: "flex",

    flexDirection: "column",

    gap: "12px",

    width: "100%",
  }}
>

<input
  type="text"

  placeholder="Votre nom"

  value={reviewName}

  onChange={(e)=>
    setReviewName(
      e.target.value
    )
  }

  style={inputStyle}
/>

<textarea
  placeholder="Votre commentaire..."

  value={reviewComment}

  onChange={(e)=>
    setReviewComment(
      e.target.value
    )
  }

  style={{
    ...inputStyle,

    height: mobile ? "90px" : "70px",

    resize: "none",

    lineHeight: "1.6",
  }}
/>

<div
  style={{
    marginTop: "6px",
  }}
>

<label
  style={{
    display: "inline-flex",

    alignItems: "center",

    gap: "8px",

    background: "#f9fafb",

    border: "1px dashed #c7d2fe",

    padding: mobile ? "12px 16px" : "10px 14px",

    borderRadius: "12px",

    cursor: "pointer",

    fontSize: mobile ? "13px" : "12px",

    fontWeight: "700",

    color: "#4f46e5",

    maxWidth: "100%",

    boxSizing: "border-box",

    flexWrap: "wrap",
  }}
>

<FaImage
  style={{
    fontSize: "15px",
  }}
/>

Ajouter des photos

<input
  type="file"

  multiple

  accept="image/*"

  onChange={(e)=>

    setReviewImages(

      [...e.target.files]

    )

  }

  hidden
/>

</label>

{reviewImages.length > 0 && (

<p
  style={{
    color: "#16a34a",

    fontWeight: "700",

    marginTop: "10px",

    fontSize: mobile ? "13px" : "14px",
  }}
>
{reviewImages.length} photo(s) sélectionnée(s)
</p>

)}

</div>

<select
  value={reviewRating}

  onChange={(e)=>
    setReviewRating(
      e.target.value
    )
  }

 style={{
  ...inputStyle,
  cursor: "pointer",
  fontWeight: "700",
  height: mobile ? "54px" : "48px",
  minHeight: mobile ? "54px" : "48px",
  lineHeight: mobile ? "54px" : "48px",
  padding: "0 16px",
  fontSize: mobile ? "18px" : "15px",
  display: "flex",
  alignItems: "center",
}}
>

<option value={5}>
⭐⭐⭐⭐⭐ Excellent
</option>

<option value={4}>
⭐⭐⭐⭐ Très bon
</option>

<option value={3}>
⭐⭐⭐ Correct
</option>

<option value={2}>
⭐⭐ Moyen
</option>

<option value={1}>
⭐ Mauvais
</option>

</select>

{/* BUTTON */}

<button
  onClick={submitReview}

  onMouseEnter={(e) => {
    if (!mobile) {
      e.currentTarget.style.transform =
        "translateY(-2px)";
    }
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px)";
  }}

  style={{
    marginTop: "8px",

    width: "100%",

    border: "none",

    background:
      "linear-gradient(135deg,#6d28d9,#4f46e5)",

    color: "white",

    padding: mobile ? "15px" : "12px",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: "800",

    fontSize: mobile ? "15px" : "13px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    transition: "0.3s ease",

    boxShadow:
      "0 10px 20px rgba(79,70,229,0.16)",
  }}
>
  <FaStar />
  Publier l'avis
</button>

</div>

{/* LISTE AVIS */}

<div
  style={{
    marginTop: "22px",
  }}
>

{product.reviews &&
product.reviews.length > 0 ? (

[...(product.reviews || [])]

.sort((a, b) => {

if (
(b.likes?.length || 0) !==
(a.likes?.length || 0)
)
return (
(b.likes?.length || 0) -
(a.likes?.length || 0)
);

if (
a.verifiedPurchase &&
!b.verifiedPurchase
)
return -1;

if (
!a.verifiedPurchase &&
b.verifiedPurchase
)
return 1;

if (b.rating !== a.rating)
return b.rating - a.rating;

return (
new Date(b.createdAt) -
new Date(a.createdAt)
);

})

.slice(0, showAllReviews ? product.reviews.length : 2)
.map((review, index) => (

<div
  key={index}
  style={{
    marginTop: "12px",
    background: "#fff",
    padding: mobile ? "12px" : "14px",
    borderRadius: "16px",
    border: "1px solid #eef2ff",
    boxShadow: "0 6px 16px rgba(0,0,0,.05)",
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
  }}
>

{/* HEADER */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: mobile ? "8px" : "12px",
  }}
>

<div
  style={{
    display: "flex",
    gap: mobile ? "8px" : "12px",
    flex: 1,
    minWidth: 0,
  }}
>

<div
  style={{
    width: mobile ? "34px" : "38px",
    height: mobile ? "34px" : "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6d28d9,#4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
  }}
>
  <FaUserCircle size={mobile ? 18 : 22}/>
</div>

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
    gap:"6px",
    flexWrap:"wrap",
  }}
>

<strong
  style={{
    fontSize: mobile ? "14px" : "13px",
    fontWeight:"800",
    color:"#111827",
  }}
>
  {review.name}
</strong>

{review.verifiedPurchase && (

<div
  style={{
    background:"linear-gradient(135deg,#dcfce7,#bbf7d0)",
    color:"#166534",
    padding:"3px 8px",
    borderRadius:"999px",
    fontSize:"9px",
    fontWeight:"800",
    display:"flex",
    alignItems:"center",
    gap:"4px",
  }}
>

<FaCheckCircle/>

Vérifié

</div>

)}

</div>

{index===0 &&
(review.likes?.length||0)>0 && (

<div
  style={{
    marginTop:"3px",
    display:"flex",
    alignItems:"center",
    gap:"5px",
    fontSize:"10px",
    fontWeight:"800",
    color:"#f59e0b",
  }}
>

<FaTrophy/>

Avis le plus utile

</div>

)}

<div
  style={{
    display:"flex",
    alignItems:"center",
    gap:"6px",
    marginTop:"4px",
    flexWrap:"wrap",
  }}
>

<div
  style={{
    display:"flex",
    gap:"2px",
    color:"#f59e0b",
  }}
>

{[...Array(5)].map((_,i)=>(

<FaStar
  key={i}
  style={{
    fontSize: mobile ? "12px":"13px",
    opacity:i<review.rating?1:.25,
  }}
/>

))}

</div>

<span
  style={{
    background:"#f9fafb",
    border:"1px solid #e5e7eb",
    padding:"3px 8px",
    borderRadius:"999px",
    fontWeight:"700",
    fontSize:"11px",
  }}
>

{review.rating}.0

</span>

</div>

</div>

</div>

</div>

{/* COMMENT */}

<p
  onClick={() =>
    setOpenReply(
      openReply === review._id
        ? null
        : review._id
    )
  }
  style={{
    marginTop: "8px",
    marginBottom: 0,
    color: "#4b5563",
    fontSize: mobile ? "13px" : "13px",
    lineHeight: "1.5",
    cursor: "pointer",
    wordBreak: "break-word",
  }}
>
  {review.comment}
</p>

{/* IMAGES */}

{review.images &&
review.images.length > 0 && (

<div
  style={{
    display:"grid",
    gridTemplateColumns:
      mobile
        ? "repeat(4,1fr)"
        : "repeat(auto-fill,70px)",
    gap:"6px",
    marginTop:"10px",
  }}
>

{review.images.map((img,index)=>(

<img
  key={index}
  src={img}
  alt=""
  loading="lazy"
  decoding="async"
  onClick={() => setSelectedImage(img)}
  style={{
    width:"100%",
    aspectRatio:"1",
    objectFit:"cover",
    borderRadius:"8px",
    cursor:"pointer",
    border:"1px solid #e5e7eb",
    boxShadow:"0 3px 8px rgba(0,0,0,.05)",
    transition:".25s",
  }}
  onMouseEnter={(e)=>{
    if(!mobile){
      e.currentTarget.style.transform="scale(1.05)";
    }
  }}
  onMouseLeave={(e)=>{
    e.currentTarget.style.transform="scale(1)";
  }}
/>

))}

</div>

)}

{/* ACTIONS */}

<div
  style={{
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    gap:"8px",
    marginTop:"10px",
    flexWrap:"wrap",
  }}
>

<div
  style={{
    display:"flex",
    gap:"6px",
    flexWrap:"wrap",
  }}
>

{/* LIKE */}

<button
onClick={async()=>{

try{

await axios.put(

`https://konanshopping.com/api/product/${product._id}/review/${review._id}/like`,

{

clientId,

}

);

getProduct();

}

catch(err){

console.log(err);

}

}}

style={{
border:"none",
background:"#eff6ff",
color:"#2563eb",
padding: mobile ? "6px 10px" : "8px 12px",
borderRadius:"10px",
cursor:"pointer",
fontWeight:"700",
display:"flex",
alignItems:"center",
gap:"5px",
fontSize: mobile ? "11px" : "12px",
boxShadow:"0 2px 8px rgba(37,99,235,.10)",
}}
>

<FaThumbsUp/>

{review.likes?.length||0}

</button>

{/* DISLIKE */}

<button
onClick={async()=>{

try{

await axios.put(

`https://konanshopping.com/api/product/${product._id}/review/${review._id}/dislike`,

{

clientId,

}

);

getProduct();

}

catch(err){

console.log(err);

}

}}

style={{
border:"none",
background:"#fef2f2",
color:"#ef4444",
padding: mobile ? "6px 10px" : "8px 12px",
borderRadius:"10px",
cursor:"pointer",
fontWeight:"700",
display:"flex",
alignItems:"center",
gap:"5px",
fontSize: mobile ? "11px" : "12px",
boxShadow:"0 2px 8px rgba(239,68,68,.10)",
}}
>

<FaThumbsDown/>

{review.dislikes?.length||0}

</button>

{/* REPLY */}

<button
onClick={()=>
setOpenReply(
openReply===review._id
? null
: review._id
)
}

style={{
border:"none",
background:"#eef2ff",
color:"#4f46e5",
padding: mobile ? "6px 10px" : "8px 12px",
borderRadius:"10px",
cursor:"pointer",
fontWeight:"700",
display:"flex",
alignItems:"center",
gap:"5px",
fontSize: mobile ? "11px" : "12px",
}}
>

<FaReply/>

{review.replies?.length||0}

</button>

</div>

</div>

{/* REPLY */}

{openReply === review._id && (

<div
style={{
marginTop:"12px",
width:"100%",
}}
>

<textarea
placeholder="Répondre..."

value={replyText}

onChange={(e)=>
setReplyText(
e.target.value
)
}

style={{
width:"100%",
boxSizing:"border-box",
padding: mobile ? "12px" : "12px",
borderRadius:"12px",
border:"1px solid #e5e7eb",
fontSize: mobile ? "13px" : "12px",
outline:"none",
resize:"none",
height: mobile ? "75px" : "65px",
background:"#f9fafb",
lineHeight:"1.5",
color: "#111827",
}}
/>

<button

onClick={async()=>{

if(!replyText){

return toast.warning(
"Écrivez une réponse ⚠️"
);

}

try{

await axios.post(

`https://konanshopping.com/api/product/${product._id}/review/${review._id}/reply`,

{

clientId,

name:
user?.name ||
"Invité",

comment:
replyText,

}

);

setReplyText("");

getProduct();

toast.success(
"Réponse envoyée ✅"
);

}

catch(err){

console.log(err);

toast.error(
"Erreur lors de l'envoi"
);

}

}}

style={{
marginTop:"10px",
width:"100%",
border:"none",
background:"linear-gradient(135deg,#6d28d9,#4f46e5)",
color:"white",
padding: mobile ? "12px" : "14px",
borderRadius:"12px",
cursor:"pointer",
fontWeight:"700",
fontSize: mobile ? "13px" : "14px",
display:"flex",
alignItems:"center",
justifyContent:"center",
gap:"8px",
}}
>

<FaReply/>

Répondre

</button>

</div>

)}

{/* LISTE DES RÉPONSES */}

{openReply === review._id &&
review.replies?.map((reply,index)=>(

<div
key={index}
style={{
marginTop:"10px",
marginLeft: mobile ? "0" : "20px",
padding: mobile ? "10px" : "14px",
background:"#f8fafc",
border:"1px solid #eef2ff",
borderRadius:"12px",
boxSizing:"border-box",
}}
>

<strong
style={{
display:"flex",
alignItems:"center",
gap:"6px",
fontSize: mobile ? "12px" : "13px",
color:"#111827",
fontWeight:"700",
wordBreak:"break-word",
}}
>

<FaUserCircle
style={{
color:"#6366f1",
}}
/>

{reply.name}

</strong>

<p
style={{
marginTop:"6px",
marginBottom:0,
fontSize: mobile ? "12px" : "13px",
lineHeight:"1.5",
color:"#4b5563",
wordBreak:"break-word",
}}
>

{reply.comment}

</p>

</div>

))}

{/* FOOTER */}

<div
style={{
marginTop:"10px",
display:"flex",
justifyContent:"space-between",
alignItems:"center",
flexWrap:"wrap",
gap:"8px",
}}
>

<span
style={{
display:"flex",
alignItems:"center",
gap:"5px",
fontSize: mobile ? "11px" : "12px",
color:"#9ca3af",
fontWeight:"600",
}}
>

<FaClock/>

{getTimeAgo(review.createdAt)}

</span>

<span
style={{
display:"flex",
alignItems:"center",
gap:"4px",
background:"#fff7ed",
border:"1px solid #fde68a",
padding: mobile ? "4px 8px" : "5px 10px",
borderRadius:"999px",
fontSize: mobile ? "10px" : "11px",
fontWeight:"700",
color:"#f59e0b",
}}
>

<FaStar/>

{review.rating}/5

</span>

</div>

</div>


))

) : (

<div
style={{
marginTop:"18px",
padding: mobile ? "20px" : "26px",
background:"#fff",
borderRadius:"16px",
border:"1px dashed #d1d5db",
textAlign:"center",
boxShadow:"0 6px 16px rgba(0,0,0,.04)",
}}
>

<FaCommentDots
style={{
fontSize: mobile ? "34px" : "40px",
color:"#6366f1",
marginBottom:"10px",
}}
/>

<h4
style={{
margin:0,
fontSize: mobile ? "16px" : "18px",
fontWeight:"800",
color:"#111827",
}}
>

Aucun avis

</h4>

<p
style={{
marginTop:"6px",
marginBottom:0,
fontSize: mobile ? "13px" : "14px",
lineHeight:"1.5",
color:"#6b7280",
}}
>

Soyez le premier à donner votre avis ⭐

</p>

</div>

)}

{product.reviews.length > 2 && (
  <div
    style={{
      marginTop: "18px",
      textAlign: "center",
    }}
  >
    <button
      onClick={() => setShowAllReviews(!showAllReviews)}
      style={{
        background: "transparent",
        border: "none",
        color: "#5b21b6",
        fontWeight: "800",
        fontSize: "17px",
        cursor: "pointer",
      }}
    >
      {showAllReviews
        ? "Voir moins d'avis ▲"
        : `Voir plus de ${product.reviews.length - 2} avis ▼`}
    </button>
  </div>
)}

</div>

</div>

{/* PRODUITS SIMILAIRES */}

<div
  style={{
    marginTop: mobile ? "30px" : "40px",
  }}
>

<h2
  style={{
    fontSize: mobile ? "22px" : "30px",

    marginBottom: mobile ? "18px" : "22px",

    color: "#111827",

    fontWeight: "900",

    display: "flex",

    alignItems: "center",

    gap: "10px",

    flexWrap: "wrap",
  }}
>
<FaGem
  style={{
    color: "#7c3aed",
  }}
/>

Produits similaires
</h2>

<div
  style={{
    display: "grid",

    gridTemplateColumns:
      mobile
        ? "repeat(2,minmax(0,1fr))"
        : "repeat(auto-fit,minmax(220px,1fr))",

    gap: mobile ? "12px" : "18px",

    width: "100%",
  }}
>

{similarProducts.map((item) => (

<div
  key={item._id}

  onMouseEnter={(e) => {

    if (!mobile) {

      e.currentTarget.style.transform =
        "translateY(-5px)";

      e.currentTarget.style.boxShadow =
        "0 18px 35px rgba(0,0,0,0.08)";

    }

  }}

  onMouseLeave={(e) => {

    if (!mobile) {

      e.currentTarget.style.transform =
        "translateY(0px)";

      e.currentTarget.style.boxShadow =
        "0 6px 18px rgba(0,0,0,0.05)";

    }

  }}

  style={{
    background: "white",

    borderRadius: mobile ? "14px" : "16px",

    overflow: "hidden",

    transition: "0.3s",

    width: "100%",

    boxSizing: "border-box",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.05)",
  }}
>

{/* IMAGE */}

<div
  onClick={() => openProduct(item._id)}
  style={{
    textDecoration: "none",
    cursor: "pointer",
  }}
>

<div
  style={{
    width: "100%",

    height: mobile ? "150px" : "220px",

    overflow: "hidden",

    background: "#f3f4f6",
  }}
>

<img
  src={item.image}

  alt=""

  loading="lazy"

  decoding="async"

  style={{
    width: "100%",

    height: "100%",

    objectFit: "cover",

    display: "block",

    transition: "0.3s",
  }}
/>

</div>

</div>

{/* CONTENT */}

<div
  style={{
    padding: mobile ? "12px" : "14px",

    width: "100%",

    boxSizing: "border-box",
  }}
>

<h3
  style={{
    color: "#111827",

    fontSize: mobile ? "14px" : "16px",

    marginBottom: "6px",

    fontWeight: "700",

    lineHeight: "1.35",

    minHeight: mobile ? "38px" : "44px",

    overflow: "hidden",

    display: "-webkit-box",

    WebkitLineClamp: 2,

    WebkitBoxOrient: "vertical",
  }}
>
  {item.name}
</h3>

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "4px",

    marginBottom: "10px",

    flexWrap: "wrap",

    fontSize: mobile ? "10px" : "11px",

    fontWeight: "700",
  }}
>

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "2px",

    color: "#f59e0b",
  }}
>

{[...Array(5)].map(
(_, index) => {

const averageRating =

item.reviews?.length > 0

? (

item.reviews.reduce(

(total, review)=>

total + review.rating,

0

) /

item.reviews.length

)

: 0;

return (

<FaStar
key={index}

style={{
fontSize: mobile ? "9px" : "10px",

color:
index <
Math.round(
averageRating
)

? "#f59e0b"

: "#d1d5db",

filter:
index <
Math.round(
averageRating
)

? "drop-shadow(0 1px 3px rgba(245,158,11,0.25))"

: "none",
}}
/>

);

}
)}

</div>

<span
style={{
color: "#111827",

fontWeight: "800",

marginLeft: "3px",
}}
>

{

item.reviews?.length > 0

? (

item.reviews.reduce(

(total, review)=>

total + review.rating,

0

) /

item.reviews.length

).toFixed(1)

: "0.0"

}

</span>

<span
style={{
color: "#9ca3af",

fontSize: mobile ? "9px" : "10px",

fontWeight: "600",
}}
>

({item.reviews?.length || 0})

</span>

</div>

<h2
style={{
color: "#111827",

fontSize: mobile ? "18px" : "20px",

fontWeight: "900",

marginBottom: "14px",

wordBreak: "break-word",
}}
>
{item.price} FCFA
</h2>

<button

onClick={() => {

const cart =

JSON.parse(
localStorage.getItem(
cartKey
)
) || [];

const existing =
cart.find(
(p) =>
p._id === item._id
);

if (existing) {

existing.quantity += 1;

}

else {

cart.push({

...item,

quantity: 1,

});

}

localStorage.setItem(

cartKey,

JSON.stringify(cart)

);

window.dispatchEvent(
new Event("cartUpdated")
);

toast.success(
"Produit ajouté au panier 🛒"
);

}}

style={{
width: "100%",

border: "none",

background:
"linear-gradient(135deg,#6d28d9,#4f46e5)",

color: "white",

padding: mobile ? "12px" : "13px",

borderRadius: "14px",

cursor: "pointer",

fontWeight: "800",

fontSize: mobile ? "12px" : "13px",

display: "flex",

alignItems: "center",

justifyContent: "center",

gap: "8px",

transition: "0.3s ease",

boxShadow:
"0 12px 24px rgba(79,70,229,0.18)",

letterSpacing: "0.3px",
}}

onMouseEnter={(e) => {

if(!mobile){

e.currentTarget.style.transform =
"translateY(-3px)";

e.currentTarget.style.boxShadow =
"0 18px 30px rgba(79,70,229,0.28)";

}

}}

onMouseLeave={(e) => {

if(!mobile){

e.currentTarget.style.transform =
"translateY(0px)";

e.currentTarget.style.boxShadow =
"0 12px 24px rgba(79,70,229,0.18)";

}

}}
>

<FaShoppingCart />

Ajouter

</button>

</div>

</div>

))}

</div>

</div>

</div>

{/* IMAGE MODAL */}

{selectedImage && (

<div

onClick={()=>
setSelectedImage(null)
}

style={{
position: "fixed",

top: 0,

left: 0,

width: "100%",

height: "100%",

background:
"rgba(0,0,0,0.82)",

display: "flex",

justifyContent:
"center",

alignItems:
"center",

zIndex: 9999,

padding: mobile ? "12px" : "20px",

backdropFilter:
"blur(8px)",
}}
>

<img
src={selectedImage}

alt=""

decoding="async"

style={{
maxWidth: "100%",

maxHeight: "90%",

borderRadius: mobile ? "14px" : "20px",

objectFit: "contain",

boxShadow:
"0 20px 50px rgba(0,0,0,0.45)",
}}
/>

</div>

)}

</>

);

}

const badgeStyle = {

background: "#eef2ff",

padding: window.innerWidth <= 768 ? "7px 10px" : "8px 12px",

borderRadius: "12px",

fontSize: window.innerWidth <= 768 ? "11px" : "12px",

fontWeight: "700",

color: "#4f46e5",

display: "flex",

alignItems: "center",

gap: "6px",

width: "fit-content",

flexWrap: "wrap",

};

const inputStyle = {

width: "100%",

boxSizing: "border-box",

padding: window.innerWidth <= 768 ? "14px 16px" : "15px 18px",

borderRadius: "18px",

border:
"1px solid rgba(229,231,235,0.9)",

marginTop: "14px",

fontSize: window.innerWidth <= 768 ? "16px" : "14px",

fontWeight: "500",

color: "#111827",

outline: "none",

background:
"linear-gradient(135deg,#ffffff,#f9fafb)",

boxShadow:
"0 4px 12px rgba(0,0,0,0.03)",

transition: "all 0.3s ease",

backdropFilter: "blur(10px)",

WebkitBackdropFilter:
"blur(10px)",

};

export default ProductDetails;