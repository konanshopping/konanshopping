const express = require("express");

const multer =
require("multer");

const axios =
require("axios");

const router =
express.Router();

const Product =
require("../models/product");

// ======================
// CLOUDINARY
// ======================

const cloudinary =
require("cloudinary").v2;

const {
CloudinaryStorage,
} = require(
"multer-storage-cloudinary"
);

// ======================
// CONFIG CLOUDINARY
// ======================

cloudinary.config({

cloud_name:
process.env.CLOUDINARY_CLOUD_NAME,

api_key:
process.env.CLOUDINARY_API_KEY,

api_secret:
process.env.CLOUDINARY_API_SECRET,

});

// ======================
// MULTER STORAGE
// ======================

const storage =
new CloudinaryStorage({

cloudinary,

params: {

folder:
"konanshopping",

allowed_formats: [
"jpg",
"png",
"jpeg",
"webp",
],

},

});

const upload =
multer({ storage });

// ======================
// TOUS LES PRODUITS
// ======================

router.get(

"/",

async(req,res)=>{

try{

const products =
await Product.find();

res.json(products);

}

catch(err){

console.log(err);

res.status(500).json({

error:
"Erreur serveur",

});

}

}

);

// ======================
// RECHERCHE NOM
// ======================

router.get(

"/search/:name",

async(req,res)=>{

try{

const keyword =
req.params.name;

const products =
await Product.find({

$or:[

{

name:{

$regex: keyword,

$options:"i",

},

},

{

category:{

$regex: keyword,

$options:"i",

},

},

{

description:{

$regex: keyword,

$options:"i",

},

},

],

});

res.json(products);

}

catch(err){

console.log(err);

res.status(500).json({

error:
"Erreur recherche",

});

}

}

);

// ======================
// IA IMAGE SEARCH
// ======================

router.post(

"/ai-search",

upload.single("image"),

async(req,res)=>{

try{

// ======================
// IMAGE CLOUDINARY URL
// ======================

const image =
req.file.path;

// ======================
// HUGGINGFACE API
// ======================

const response =
await axios.post(

"https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224",

{
inputs: image,
},

{

headers:{

Authorization:
`Bearer ${process.env.HF_TOKEN}`,

},

}

);

// ======================
// LABEL IA
// ======================

const keyword =
response.data[0]?.label || "";

console.log(
"Mot IA :",
keyword
);

// ======================
// RECHERCHE MONGODB
// ======================

const products =
await Product.find({

$or:[

{

name:{

$regex: keyword,

$options:"i",

},

},

{

category:{

$regex: keyword,

$options:"i",

},

},

{

description:{

$regex: keyword,

$options:"i",

},

},

],

});

// ======================
// RESPONSE
// ======================

res.json({

success:true,

keyword,

count:
products.length,

products,

});

}

catch(err){

console.log(

err.response?.data ||
err.message

);

res.status(500).json({

error:
err.response?.data ||
err.message,

});

}

}

);

// ======================
// ADD REVIEW
// ======================
router.post(

"/:id/review",

upload.array(
"images",
5
),

async(req,res)=>{

try{

const product =
await Product.findById(
req.params.id
);

if(!product){

return res.status(404).json({

message:
"Produit introuvable",

});

}

const {

clientId,

name,

rating,

comment,

} = req.body;

// REVIEW IMAGES

const images =

req.files?.map(
(file)=> file.path
) || [];

// VALIDATION

if(

!clientId ||

!name ||

!rating ||

!comment

){

return res.status(400).json({

message:
"Tous les champs sont obligatoires",

});

}

// CHECK REVIEW EXIST

const alreadyReviewed =

product.reviews.find(

(review)=>

review.clientId ===
clientId

);

if(alreadyReviewed){

return res.status(400).json({

message:
"Vous avez déjà donné un avis",

});

}

// VERIFIED PURCHASE

const Order =
require("../models/order");

const hasPurchased =
await Order.findOne({

userId: clientId,

"items._id":
product._id,

});

// NEW REVIEW

product.reviews.push({

clientId,

name,

rating,

comment,

images,

verifiedPurchase:
!!hasPurchased,

likes: [],

dislikes: [],

replies: [],

createdAt:
new Date(),

});

// SAVE

await product.save();

res.json({

success:true,

message:
"Avis ajouté avec succès",

product,

});

}

catch(err){

console.log(err);

res.status(500).json({

message:
"Erreur avis",

});

}

}

);

// ======================
// LIKE REVIEW
// ======================

router.put(

"/:productId/review/:reviewId/like",

async(req,res)=>{

try{

const { clientId } =
req.body;

const product =
await Product.findById(
req.params.productId
);

const review =
product.reviews.id(
req.params.reviewId
);

// REMOVE DISLIKE

review.dislikes =
review.dislikes.filter(

(id)=> id !== clientId

);

// TOGGLE LIKE

if(

review.likes.includes(
clientId
)

){

review.likes =
review.likes.filter(

(id)=>
id !== clientId

);

}

else{

review.likes.push(
clientId
);

}

await product.save();

res.json(review);

}

catch(err){

console.log(err);

res.status(500).json({

message:
"Erreur like",

});

}

}

);

// ======================
// DISLIKE REVIEW
// ======================

router.put(

"/:productId/review/:reviewId/dislike",

async(req,res)=>{

try{

const { clientId } =
req.body;

const product =
await Product.findById(
req.params.productId
);

const review =
product.reviews.id(
req.params.reviewId
);

// REMOVE LIKE

review.likes =
review.likes.filter(

(id)=> id !== clientId

);

// TOGGLE DISLIKE

if(

review.dislikes.includes(
clientId
)

){

review.dislikes =
review.dislikes.filter(

(id)=>
id !== clientId

);

}

else{

review.dislikes.push(
clientId
);

}

await product.save();

res.json(review);

}

catch(err){

console.log(err);

res.status(500).json({

message:
"Erreur dislike",

});

}

}

);

// ======================
// REPLY REVIEW
// ======================

router.post(

"/:productId/review/:reviewId/reply",

async(req,res)=>{

try{

const {

clientId,

name,

comment,

} = req.body;

const product =
await Product.findById(
req.params.productId
);

const review =
product.reviews.id(
req.params.reviewId
);

// PUSH REPLY

review.replies.push({

clientId,

name,

comment,

});

await product.save();

res.json({

success:true,

review,

});

}

catch(err){

console.log(err);

res.status(500).json({

message:
"Erreur réponse",

});

}

}

);

module.exports = router;