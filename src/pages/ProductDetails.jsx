import {
  useParams,
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

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

function ProductDetails() {

const navigate = useNavigate();

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

const getProduct = async () => {

  try {

    const res = await axios.get(
      `https://konanshopping-production.up.railway.app/product/${id}`
    );

    setProduct(res.data);

    const response =
      await axios.get(
        "https://konanshopping-production.up.railway.app/products"
      );

    const similar =
      response.data.filter(
        (item) =>

          item.category ===
            res.data.category &&

          item._id !==
            res.data._id
      );

    setSimilarProducts(similar);

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

// =========================
// LOADING
// =========================

if (!product)

  return (

    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        fontSize: "22px",

        fontWeight: "700",

        color: "#4f46e5",
      }}
    >
      Chargement...
    </div>

  );

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

  `https://konanshopping-production.up.railway.app/product/${id}/review`,

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

return (

<div
  style={{
    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "26px",

    fontFamily:
      "Arial",
  }}
>

{/* BACK */}

<Link
  to="/boutique"

  style={{
    textDecoration: "none",

    color: "#4f46e5",

    fontWeight: "700",

    fontSize: "14px",
  }}
>
← Retour boutique
</Link>

{/* PRODUCT CARD */}

<div
  style={{
    marginTop: "20px",

    background: "white",

    borderRadius: "24px",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "22px",

    display: "grid",

    gridTemplateColumns:
      window.innerWidth < 768
        ? "1fr"
        : "1fr 1fr",

    gap:
      window.innerWidth < 768
        ? "18px"
        : "24px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  }}
>

{/* IMAGE */}

<div
  style={{
    width: "100%",

    height:
      window.innerWidth < 768
        ? "340px"
        : "520px",

    overflow: "hidden",

    borderRadius: "22px",

    background:
      "linear-gradient(135deg,#f9fafb,#eef2ff)",

    position: "relative",
  }}
>

<img
  src={product.image}

  alt=""

  style={{
    width: "100%",

    height: "100%",

    objectFit: "cover",

    display: "block",

    transition: "0.4s",
  }}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "scale(1.05)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "scale(1)";

  }}
/>

</div>

{/* CONTENT */}

<div>

<p
  style={{
    color: "#6b7280",

    fontSize: "13px",

    marginBottom: "8px",

    fontWeight: "600",
  }}
>
<FaGem /> {product.category}
</p>

<h1
  style={{
    fontSize:
      window.innerWidth < 768
        ? "28px"
        : "38px",

    marginBottom: "14px",

    color: "#111827",

    fontWeight: "900",

    lineHeight: "1.2",
  }}
>
  {product.name}
</h1>

<div
  style={{
    display: "flex",

    alignItems: "center",

    justifyContent:
      "space-between",

    flexWrap: "wrap",

    gap: "12px",

    marginBottom: "18px",
  }}
>

{/* LEFT */}

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "10px",
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

    padding: "8px 12px",

    borderRadius: "999px",

    border:
      "1px solid rgba(245,158,11,0.15)",

    boxShadow:
      "0 4px 12px rgba(245,158,11,0.08)",
  }}
>

{[...Array(5)].map(
(_, index) => {

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
    fontSize: "13px",

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

}
)}

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
    fontSize: "16px",

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
Basé sur{" "}

{product.reviews?.length || 0}

avis
</p>

</div>

</div>


</div>

<h2
  style={{
    color: "#4f46e5",

    fontSize:
      window.innerWidth < 768
        ? "30px"
        : "40px",

    marginBottom: "18px",

    fontWeight: "900",
  }}
>
  {product.price} FCFA
</h2>

<p
  style={{
    color: "#4b5563",

    lineHeight: "1.7",

    marginBottom: "24px",

    fontSize: "14px",
  }}
>
  {product.description ||

    "Produit premium disponible sur Konan Shopping Cameroun."}
</p>

{/* FEATURES */}

<div
  style={{
    display: "flex",

    flexWrap: "wrap",

    gap: "10px",

    marginBottom: "22px",
  }}
>

<div style={badgeStyle}>
  <FaTruck />
  Livraison rapide
</div>

<div style={badgeStyle}>
  <FaShieldAlt />
  Paiement sécurisé
</div>

<div style={badgeStyle}>
  <FaGem />
  Premium
</div>

</div>

{/* BUTTONS */}

<div
  style={{
    display: "flex",

    gap: "12px",

    flexWrap: "wrap",

    alignItems: "center",
  }}
>

{/* ADD TO CART */}

<button
  onClick={addToCart}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-3px)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)";

  }}

  style={{
    flex: 1,

    border: "none",

    background:
      "linear-gradient(135deg,#6d28d9,#4f46e5)",

    color: "white",

    padding:
      window.innerWidth < 768
        ? "14px"
        : "16px",

    borderRadius: "16px",

    fontWeight: "800",

    fontSize: "14px",

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
  Ajouter
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

  e.currentTarget.style.transform =
    "translateY(-3px)";

}}

onMouseLeave={(e) => {

  e.currentTarget.style.transform =
    "translateY(0px)";

}}

style={{
  flex: 1,

  border: "none",

  background:
    "#111827",

  color: "white",

  padding:
    window.innerWidth < 768
      ? "14px"
      : "16px",

  borderRadius: "16px",

  fontWeight: "800",

  fontSize: "14px",

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
  Acheter
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

    padding:
      window.innerWidth < 768
        ? "10px"
        : "12px",

    borderRadius: "20px",

    border:
      "1px solid rgba(99,102,241,0.08)",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.04)",

    position: "relative",
  }}
>

{/* HEADER */}

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "10px",

    marginBottom: "18px",
  }}
>

<div>

<h3
  style={{
    margin: 0,

    color: "#111827",

    fontSize:
      window.innerWidth < 768
        ? "14px"
        : "16px",

    fontWeight: "900",

    display: "flex",

    alignItems: "center",

    gap: "8px",
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
    marginTop: "4px",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "500",
    lineHeight: "1.5",
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

    gap: "10px",
  }}
>

<input
  type="text"

  placeholder="Votre nom"

  value={reviewName}

  onChange={(e) =>
    setReviewName(
      e.target.value
    )
  }

  style={inputStyle}
/>

<textarea
  placeholder="Votre commentaire..."

  value={reviewComment}

  onChange={(e) =>
    setReviewComment(
      e.target.value
    )
  }

  style={{
    ...inputStyle,

    height: "70px",

    resize: "none",

    lineHeight: "1.6",
  }}
/>

<div
  style={{
    marginTop: "10px",
  }}
>

<label
  style={{
    display: "flex",

    alignItems: "center",

    gap: "8px",

    background:
      "#f9fafb",

    border:
      "1px dashed #c7d2fe",

    padding: "10px",

    borderRadius: "10px",

    cursor: "pointer",

    fontSize: "12px",

    fontWeight: "700",

    color: "#4f46e5",

    width: "fit-content",
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
      color: "green",
      fontWeight: "700",
      marginTop: "8px",
    }}
  >
    {reviewImages.length} photo(s) sélectionnée(s)
  </p>
)}

</div>

<select
  value={reviewRating}

  onChange={(e) =>
    setReviewRating(
      e.target.value
    )
  }

  style={{
    ...inputStyle,

    cursor: "pointer",

    fontWeight: "700",
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

    e.currentTarget.style.transform =
      "translateY(-2px)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)";

  }}

  style={{
    marginTop: "2px",

    border: "none",

    background:
      "linear-gradient(135deg,#6d28d9,#4f46e5)",

    color: "white",

    padding:
      window.innerWidth < 768
        ? "10px"
        : "11px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "800",

    fontSize: "13px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

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

  // Avis le plus utile en premier

if (
  (b.likes?.length || 0) !==
  (a.likes?.length || 0)
)
  return (
    (b.likes?.length || 0) -
    (a.likes?.length || 0)
  );

  // Achat vérifié en premier

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

  // Meilleure note en premier

  if (b.rating !== a.rating)
    return b.rating - a.rating;

  // Plus récent en premier

  return (
    new Date(b.createdAt) -
    new Date(a.createdAt)
  );

})

.map(
  (review, index) => (

      <div
        key={index}

        style={{
  marginTop: "8px",

  background: "white",

  padding: "10px",

  borderRadius: "10px",

  border:
    "1px solid #eef2ff",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.03)",
}}
      >

        {/* TOP */}

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            flexWrap: "wrap",

            gap: "8px",
          }}
        >

          <div>

            <strong
              style={{
                fontSize: "12px",

                color: "#111827",

                fontWeight: "800",

                display: "flex",

                alignItems: "center",

                gap: "6px",
              }}
            >
              <FaUserCircle
                style={{
                  color: "#6366f1",
                }}
              />

              {review.name}
            </strong>

            {index === 0 &&
(review.likes?.length || 0) > 0 && (

<div
  style={{
    marginTop: "4px",

    display: "flex",

    alignItems: "center",

    gap: "5px",

    color: "#f59e0b",

    fontSize: "10px",

    fontWeight: "800",
  }}
>
  <FaTrophy />

  Avis le plus utile

</div>

)}

{review.verifiedPurchase && (

<div
  style={{
    marginTop: "8px",

    background:
      "linear-gradient(135deg,#ecfdf5,#dcfce7)",

    color: "#166534",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "10px",

    fontWeight: "800",

    width: "fit-content",

    display: "flex",

    alignItems: "center",

    gap: "6px",

    border:
      "1px solid rgba(34,197,94,0.15)",

    boxShadow:
      "0 4px 12px rgba(34,197,94,0.10)",

    letterSpacing: "0.3px",
  }}
>

<div
  style={{
    width: "18px",

    height: "18px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg,#22c55e,#16a34a)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "white",

    fontSize: "9px",

    boxShadow:
      "0 4px 10px rgba(34,197,94,0.25)",
  }}
>
✓
</div>

<span>
Achat vérifié
</span>

</div>

)}

            <div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "8px",

    marginTop: "8px",
  }}
>

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "3px",

    color: "#f59e0b",

    fontSize: "12px",
  }}
>

{[...Array(5)].map(
(_,index)=>(

<FaStar
  key={index}

  style={{
    opacity:
      index < review.rating
        ? 1
        : 0.25,

    filter:
      index < review.rating
        ? "drop-shadow(0 2px 4px rgba(245,158,11,0.35))"
        : "none",
  }}
/>

)

)}

</div>

<span
  style={{
    fontSize: "11px",

    fontWeight: "700",

    color: "#111827",

    background:
      "#f9fafb",

    padding: "4px 8px",

    borderRadius: "999px",

    border:
      "1px solid #e5e7eb",
  }}
>
{review.rating}.0
</span>

</div>

          </div>

          {/* VERIFIED */}

          <div
            style={{
              background:
                "linear-gradient(135deg,#dcfce7,#bbf7d0)",

              color: "#166534",

              padding: "6px 10px",

              borderRadius: "10px",

              fontSize: "10px",

              fontWeight: "800",

              display: "flex",

              alignItems: "center",

              gap: "5px",
            }}
          >
            <FaCheckCircle />

            Vérifié
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
    fontSize: "12px",
    color: "#4b5563",
    marginTop: "6px",
    lineHeight: "1.4",
    marginBottom: 0,
    cursor: "pointer",
    fontWeight: "500",
  }}
>
  {review.comment}
</p>
        {review.images &&
review.images.length > 0 && (

<div
  style={{
    display: "flex",

    gap: "10px",

    flexWrap: "wrap",

    marginTop: "7px",
  }}
>

{review.images.map(

(img,index)=>(

<img
  key={index}

  src={img}

  alt=""

  onClick={()=>
    setSelectedImage(img)
  }

  style={{
    width:
      window.innerWidth < 768
        ? "55px"
        : "65px",

    height:
      window.innerWidth < 768
        ? "55px"
        : "65px",

    objectFit: "cover",

    borderRadius: "8px",

    cursor: "pointer",

    border:
      "1px solid #e5e7eb",

    boxShadow:
      "0 6px 14px rgba(0,0,0,0.05)",

    transition: "0.3s",
  }}

  onMouseEnter={(e)=>{

    e.currentTarget.style.transform =
      "scale(1.05)";

  }}

  onMouseLeave={(e)=>{

    e.currentTarget.style.transform =
      "scale(1)";

  }}
/>

)

)}

</div>

)}

{/* ACTIONS */}

<div
  style={{
    display: "flex",

    alignItems: "center",

    gap: "10px",

    marginTop: "12px",
  }}
>

{/* LIKE */}

<button

onClick={async () => {

try{

await axios.put(

`https://konanshopping-production.up.railway.app/product/${product._id}/review/${review._id}/like`,

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
  border: "none",

  background:
    "#eff6ff",

  color: "#2563eb",

  padding: "6px 10px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "700",

  display: "flex",

  alignItems: "center",

  gap: "6px",

  fontSize: "11px",

  transition: "0.3s",

  boxShadow:
    "0 4px 10px rgba(37,99,235,0.10)",
}}
>
<FaThumbsUp />

{review.likes?.length || 0}
</button>

{/* DISLIKE */}

<button

onClick={async () => {

try{

await axios.put(

`https://konanshopping-production.up.railway.app/product/${product._id}/review/${review._id}/dislike`,

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
  border: "none",

  background:
    "#fef2f2",

  color: "#ef4444",

  padding: "6px 10px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "700",

  display: "flex",

  alignItems: "center",

  gap: "6px",

  fontSize: "11px",

  transition: "0.3s",

  boxShadow:
    "0 4px 10px rgba(239,68,68,0.10)",
}}
>
<FaThumbsDown />

{review.dislikes?.length || 0}
</button>

<button
  onClick={() =>
    setOpenReply(
      openReply === review._id
        ? null
        : review._id
    )
  }
  style={{
    border: "none",
    background: "transparent",
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
  }}
>
  <FaReply />
  {review.replies?.length || 0}
</button>

</div>

{/* REPLY */}

{openReply === review._id && (

<div
  style={{
    marginTop: "14px",
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
  width: "100%",

  padding: "12px",

  borderRadius: "12px",

  border:
    "1px solid #e5e7eb",

  fontSize: "12px",

  outline: "none",

  resize: "none",

  height: "55px",

  background:
    "#f9fafb",
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

`https://konanshopping-production.up.railway.app/product/${product._id}/review/${review._id}/reply`,

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
  marginTop: "10px",

  border: "none",

  background:
    "linear-gradient(135deg,#6d28d9,#4f46e5)",

  color: "white",

  padding: "8px 12px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "11px",

  display: "flex",

  alignItems: "center",

  gap: "6px",
}}
>
<FaReply />

Répondre
</button>

</div>

)}

{/* REPLIES */}

{openReply === review._id &&
 review.replies?.map(

(reply,index)=>(

<div
  key={index}

  style={{
    marginTop: "12px",

    marginLeft: "18px",

    background:
      "#f9fafb",

    padding: "12px",

    borderRadius: "12px",

    border:
      "1px solid #eef2ff",
  }}
>

<strong
  style={{
    fontSize: "12px",

    color: "#111827",

    display: "flex",

    alignItems: "center",

    gap: "6px",
  }}
>
<FaUserCircle
  style={{
    color: "#6366f1",
  }}
/>

{reply.name}
</strong>

<p
  style={{
    marginTop: "8px",

    fontSize: "12px",

    color: "#4b5563",

    lineHeight: "1.6",

    marginBottom: 0,
  }}
>
{reply.comment}
</p>

</div>

)

)}

<div
  style={{
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginTop: "10px",
  }}
>

<span
  style={{
    fontSize: "11px",
    color: "#9ca3af",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  }}
>
<FaClock
  style={{
    marginRight: "5px",
  }}
/>

{getTimeAgo(review.createdAt)}
</span>

<div
  style={{
    display: "flex",

    gap: "6px",
  }}
>

<span
  style={{
    background: "#fff7ed",
    color: "#f59e0b",
    padding: "2px 4px",
    borderRadius: "999px",
    fontSize: "8px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    border: "1px solid #fde68a",
  }}
>
<FaStar />

{review.rating}/5
</span>

</div>

</div>

      </div>

    )
  )

) : (

  <div
    style={{
      marginTop: "18px",

      background: "white",

      padding: "18px",

      borderRadius: "16px",

      textAlign: "center",

      border:
        "1px dashed #d1d5db",
    }}
  >

    <FaCommentDots
      style={{
        fontSize: "30px",

        color: "#6366f1",

        marginBottom: "10px",
      }}
    />

    <h4
      style={{
        margin: 0,

        color: "#111827",

        fontSize: "15px",

        fontWeight: "800",
      }}
    >
      Aucun avis
    </h4>

    <p
      style={{
        color: "#6b7280",

        fontSize: "12px",

        marginTop: "6px",
      }}
    >
      Soyez le premier à donner votre avis
    </p>

  </div>

)}

</div>

</div>

{/* PRODUITS SIMILAIRES */}

<div
  style={{
    marginTop: "40px",
  }}
>

<h2
  style={{
    fontSize:
      window.innerWidth < 768
        ? "24px"
        : "30px",

    marginBottom: "22px",

    color: "#111827",

    fontWeight: "900",

    display: "flex",

    alignItems: "center",

    gap: "10px",
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
      window.innerWidth < 768
        ? "repeat(2,1fr)"
        : "repeat(auto-fit,minmax(220px,1fr))",

    gap: "14px",
  }}
>

{similarProducts.map((item) => (

<div
  key={item._id}

  onMouseEnter={(e) => {

    e.currentTarget.style.transform =
      "translateY(-5px)";

    e.currentTarget.style.boxShadow =
      "0 18px 35px rgba(0,0,0,0.08)";

  }}

  onMouseLeave={(e) => {

    e.currentTarget.style.transform =
      "translateY(0px)";

    e.currentTarget.style.boxShadow =
      "0 6px 18px rgba(0,0,0,0.05)";

  }}

  style={{
    background: "white",

    borderRadius: "16px",

    overflow: "hidden",

    transition: "0.3s",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.05)",
  }}
>

{/* IMAGE */}

<Link
  to={`/product/${item._id}`}

  style={{
    textDecoration: "none",
  }}
>

<div
  style={{
    width: "100%",

    height:
      window.innerWidth < 768
        ? "180px"
        : "220px",

    overflow: "hidden",

    background:
      "#f3f4f6",
  }}
>

<img
  src={item.image}

  alt=""

  style={{
    width: "100%",

    height: "100%",

    objectFit: "cover",

    display: "block",
  }}
/>

</div>

</Link>

{/* CONTENT */}

<div
  style={{
    padding: "14px",
  }}
>

<h3
  style={{
    color: "#111827",

    fontSize: "16px",

    marginBottom: "6px",

    fontWeight: "700",
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

    fontSize: "11px",

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
    fontSize: "10px",

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

    fontSize: "10px",

    fontWeight: "600",
  }}
>

(

{item.reviews?.length || 0}

)

</span>

</div>

<h2
  style={{
    color: "#111827",

    fontSize: "20px",

    fontWeight: "900",

    marginBottom: "14px",
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

  padding: "13px",

  borderRadius: "16px",

  cursor: "pointer",

  fontWeight: "800",

  fontSize: "13px",

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

  e.currentTarget.style.transform =
    "translateY(-3px)";

  e.currentTarget.style.boxShadow =
    "0 18px 30px rgba(79,70,229,0.28)";

}}

onMouseLeave={(e) => {

  e.currentTarget.style.transform =
    "translateY(0px)";

  e.currentTarget.style.boxShadow =
    "0 12px 24px rgba(79,70,229,0.18)";

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

);

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

  padding: "20px",

  backdropFilter:
    "blur(8px)",
}}
>

<img
  src={selectedImage}

  alt=""

  style={{
    maxWidth: "95%",

    maxHeight: "92%",

    borderRadius: "20px",

    objectFit: "contain",

    boxShadow:
      "0 20px 50px rgba(0,0,0,0.45)",
  }}
/>

</div>

)}

}
const badgeStyle = {

  background: "#eef2ff",

  padding: "8px 12px",

  borderRadius: "12px",

  fontSize: "12px",

  fontWeight: "700",

  color: "#4f46e5",

  display: "flex",

  alignItems: "center",

  gap: "6px",

  width: "fit-content",

};

const inputStyle = {

  width: "100%",

  padding: "15px 18px",

  borderRadius: "18px",

  border:
    "1px solid rgba(229,231,235,0.9)",

  marginTop: "14px",

  fontSize: "14px",

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