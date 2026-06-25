const express = require("express");
const Product = require("./models/product")
const Order = require("./models/Order");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const nodemailer = require("nodemailer");

const path = require("path");
const productRoutes =
require("./routes/products");

const ordersRoutes =
  require("./routes/orders");

  const crypto = require("crypto");

const Driver =
  require("./models/Driver");

  const messageRoutes =
  require("./routes/messages");

const orderRoutes =
require("./routes/orders");

const axios = require("axios");

require("dotenv").config();

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const aiRoutes =
  require("./ai");

const Coupon =
  require("./models/Coupon");

  const Visitor =
  require("./models/Visitor");

  const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "OK" : "UNDEFINED");

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP VERIFY ERROR");
    console.log(error);
  } else {
    console.log("SMTP READY");
  }
});

const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient =
  SibApiV3Sdk.ApiClient.instance;

defaultClient.authentications[
  "api-key"
].apiKey = process.env.BREVO_API_KEY;

const apiInstance =
  new SibApiV3Sdk.TransactionalEmailsApi();


async function sendTelegramMessage(message) {

  try {

    await axios.post(

      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,

      {
        chat_id:
          process.env.TELEGRAM_CHAT_ID,

        text: message,
      }

    );

  } catch (err) {

    console.log(err);

  }

}

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const User = require("./models/User");

const Chat = require("./models/Chat");


const app = express();

app.use(cors());
app.use(express.json({
  limit: "50mb"
}));

app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

const cloudinary =
require("cloudinary").v2;

cloudinary.config({

  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,

});

module.exports =
cloudinary;

const {
  CloudinaryStorage
} = require(
  "multer-storage-cloudinary"
);

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

const reviewStorage =
new CloudinaryStorage({

  cloudinary,

  params: {

    folder:
      "konanshopping_reviews",

    allowed_formats: [
      "jpg",
      "png",
      "jpeg",
      "webp",
    ],

  },

});

const reviewUpload =
multer({

  storage:
    reviewStorage,

});

const Tesseract =
  require("tesseract.js");

// ==========================
// ADMIN
// ==========================

const ADMIN = {
  email: "konanshoppingcameroun@gmail.com",

  // Mot de passe crypté
  // Mot de passe réel :
  // konan123

  password: "konan123",
};

// ==========================
// HOME
// ==========================

app.get("/", (req, res) => {

  res.send("Serveur KONAN SHOPPING actif 🚀");

});

// ==========================
// LOGIN ADMIN
// ==========================

app.post("/admin-login", async (req, res) => {

  const { email, password } = req.body;

  // Vérification email
  if (email !== ADMIN.email) {

    return res.status(401).json({
      message: "Email incorrect",
    });

  }

  // Vérification mot de passe
  if (password !== "konan123") {

    return res.status(401).json({
      message: "Mot de passe incorrect",
    });

  }

  // Création token
  const token = jwt.sign(
    {
      email: ADMIN.email,
    },
    "KONAN_SECRET_KEY",
    {
      expiresIn: "7d",
    }
  );

  // Réponse
  res.json({

  token,

  message:
    "Connexion réussie 🚀",

  user: {

    _id: "admin",

    name:
      "Konan Admin",

    email:
      ADMIN.email,

    role:
      "admin",

  },

});

});

// ==========================
// ROUTE ADMIN PROTÉGÉE
// ==========================

app.get("/admin", (req, res) => {

  const authHeader = req.headers.authorization;

  // Vérifie si token existe
  if (!authHeader) {

    return res.status(401).json({
      message: "Token manquant",
    });

  }

  // Extraction token
  const token = authHeader.split(" ")[1];

  try {

    // Vérification token
    const verified = jwt.verify(
      token,
      "KONAN_SECRET_KEY"
    );

    res.json({
      message: "Bienvenue Admin 🔥",
      admin: verified.email,
    });

  } catch (err) {

    res.status(403).json({
      message: "Token invalide",
    });

  }

});

app.post(
  "/forgot-password",
  async (req, res) => {

    const { email } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res.status(404).json({
        message:
          "Aucun compte trouvé",
      });

    }

    const token =
      crypto.randomBytes(32)
      .toString("hex");

    user.resetToken =
      token;

    user.resetTokenExpire =
      Date.now() +
      1000 * 60 * 30;

    await user.save();

    // envoi email ici

const resetUrl =
`https://konanshopping-npgy.vercel.app/reset-password/${token}`;

await apiInstance.sendTransacEmail({

  sender: {
    name: "Konan Shopping Cameroun",
    email: "konanshoppingcameroun@gmail.com",
  },

  to: [
    {
      email: user.email,
    },
  ],

  subject: "Réinitialisation du mot de passe",

  htmlContent: `

<div style="font-family:Arial,sans-serif;padding:20px">

  <h2 style="color:#2563eb">
    Konan Shopping
  </h2>

  <p>
    Bonjour ${user.name},
  </p>

  <p>
    Nous avons reçu une demande de réinitialisation de votre mot de passe.
  </p>

  <p>
    Cliquez sur le bouton ci-dessous :
  </p>

  <a
    href="${resetUrl}"
    style="
      background:#2563eb;
      color:white;
      padding:14px 24px;
      border-radius:10px;
      text-decoration:none;
      display:inline-block;
      font-weight:bold;
    "
  >
    Réinitialiser mon mot de passe
  </a>

  <p style="margin-top:20px">
    Ce lien expirera dans 30 minutes.
  </p>

</div>

  `,

});

res.json({
  message: "Email de récupération envoyé",
});

  }
);

app.post(
  "/reset-password/:token",
  async (req, res) => {
    try {

      const { token } =
        req.params;

      const { password } =
        req.body;

      const user =
        await User.findOne({
          resetToken: token,
          resetTokenExpire: {
            $gt: Date.now(),
          },
        });

      if (!user) {

        return res.status(400).json({
          message:
            "Lien expiré ou invalide",
        });

      }

      if (
        !password ||
        password.length < 6
      ) {

        return res.status(400).json({
          message:
            "Le mot de passe doit contenir au moins 6 caractères",
        });

      }

      const bcrypt =
        require("bcryptjs");

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user.password =
        hashedPassword;

      user.resetToken =
        undefined;

      user.resetTokenExpire =
        undefined;

      await user.save();

const authToken = jwt.sign(
  {
    id: user._id,
    isAdmin: user.isAdmin,
  },
  "KONAN_SECRET",
  {
    expiresIn: "30d",
  }
);

res.json({
  success: true,
  message:
    "Mot de passe modifié avec succès ✅",
  token: authToken,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  },
});

    } catch (err) {

      console.error(
        "RESET PASSWORD ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Erreur serveur",
      });

    }
  }
);

// ==========================
// SERVER
// ==========================
app.post(
  "/upload",
  upload.single("image"),
  (req, res) => {

    res.json({
  imageUrl:
    req.file.secure_url ||
    "https://konanshopping-production.up.railway.app/" +
    req.file.path,
});

  }
);

// RECUPERER PRODUITS
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find()

    res.json(products)

  } catch (err) {
    console.log(err)
  }
})

app.post(
  "/add-product",
  upload.single("image"),
  async (req, res) => {

    try {

      console.log("BODY :", req.body);
      console.log("FILE :", req.file);

      if (!req.file) {
        return res.status(400).json({
          error: "Aucune image reçue"
        });
      }

      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description || "",
        image: req.file.path,
      });

      console.log("PRODUCT :", product);

      await product.save();

      res.json(product);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: err.message
      });

    }

});

// AJOUTER COMMANDE
app.post("/orders", async (req, res) => {

  try {

    const order = new Order({

  customerName: req.body.customerName,

userId: req.body.userId,

  phone: req.body.phone,

  address: req.body.address,

  city: req.body.city,

  district: req.body.district,

  shipping: req.body.shipping,

  items: req.body.items.map(item => ({

  productId: item._id,

  name: item.name,

  image: item.image,

  price: item.price,

  quantity: item.quantity,

})),

  total: req.body.total,

  status: "En attente",

  location: {

    lat: req.body.lat,

    lng: req.body.lng,

  },

  driver: {

  name: req.body.driverName,

  phone: req.body.driverPhone,

  photo: req.body.driverPhoto,

},

});

    await order.save();

if (req.body.userId) {

  await User.findByIdAndUpdate(

    req.body.userId,

    {

      $push: {

        orders: order._id,

      },

    }

  );

}

const orderRef = `KS-${Date.now()}`;

await sendTelegramMessage(`

🛒 NOUVELLE COMMANDE

━━━━━━━━━━━━━━━━━━

📋 Commande : ${orderRef}

👤 Client : ${req.body.customerName}

📞 ${req.body.phone}

📍 ${req.body.address}

🏙️ ${req.body.city}

📌 ${req.body.district}

━━━━━━━━━━━━━━━━━━

📦 PRODUITS

${(req.body.items || [])
  .map(
    (p) =>

`▪️ ${p.name}
📦 x${p.quantity}
💰 ${Number(
  p.price
).toLocaleString()} FCFA`
  )
  .join("\n\n")}

━━━━━━━━━━━━━━━━━━

💳 Paiement :
${req.body.paymentMethod || "À la livraison"}

🚚 Livraison :
${Number(
  req.body.shipping || 0
).toLocaleString()} FCFA

💰 TOTAL :
${Number(
  req.body.total || 0
).toLocaleString()} FCFA

━━━━━━━━━━━━━━━━━━

⏰ ${new Date().toLocaleString("fr-FR")}

🏪 KONAN SHOPPING CAMEROUN

`);

for (const item of order.items) {

  console.log("BOT =", BOT_TOKEN);

  console.log("CHAT =", CHAT_ID);

  console.log(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`
  );

  console.log("IMAGE =", item.image);

  if (item.image) {

    try {

      const response = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
        {
          chat_id: CHAT_ID,

          photo: item.image,

          caption: `📦 ${item.name}

💰 ${Number(item.price).toLocaleString()} FCFA

📦 Quantité : ${item.quantity}`
        }
      );

      console.log(
        "PHOTO ENVOYÉE ✅",
        response.data
      );

    } catch (err) {

      console.log(
        "ERREUR PHOTO ❌",
        err.response?.data || err.message
      );

    }

  }

}

    // ===============================
    // WHATSAPP NOTIFICATION
    // ===============================

    try {

      const message = `

╔════════════════════════════╗
      🏪 KONAN SHOPPING
╚════════════════════════════╝

🔔 NOUVELLE COMMANDE

📦 Référence : KS-${Date.now()}

━━━━━━━━━━━━━━━━━━━━

👤 CLIENT

${req.body.customerName}

📞 Téléphone

${req.body.phone}

📍 Adresse

${req.body.address}

🏙️ Ville

${req.body.city}

📌 Quartier

${req.body.district}

💳 Paiement

${req.body.paymentMethod || "Paiement à la livraison"}

━━━━━━━━━━━━━━━━━━━━

📦 PRODUITS COMMANDÉS

${(req.body.items || [])
  .map(
    (p) =>

`▪️ ${p.name}

   Quantité : ${p.quantity}

   Prix : ${Number(
     p.price
   ).toLocaleString()} FCFA`
  )
  .join("\n\n")}

━━━━━━━━━━━━━━━━━━━━

📊 RÉSUMÉ

🛒 Articles :
${(req.body.items || []).reduce(
  (total, item) =>
    total + item.quantity,
  0
)}

🚚 Livraison :
${Number(
  req.body.shipping || 0
).toLocaleString()} FCFA

💰 TOTAL :
${Number(
  req.body.total || 0
).toLocaleString()} FCFA

━━━━━━━━━━━━━━━━━━━━

⚡ ACTION REQUISE

✅ Vérifier le stock

✅ Préparer la commande

✅ Assigner un livreur

✅ Contacter le client

━━━━━━━━━━━━━━━━━━━━

🕒 ${new Date().toLocaleString(
  "fr-FR"
)}

🏪 KONAN SHOPPING CAMEROUN

`;

      await axios.post(
        "https://api.ultramsg.com/instance174320/messages/chat",
        {
          token:
            "tjsbbnge72azvqj1",

          to:
            "237694641329",

          body: message,
        }
      );

      console.log(
        "WhatsApp envoyé ✅"
      );

      for (const item of req.body.items) {

  if (item.image) {

    await axios.post(
      "https://api.ultramsg.com/instance174320/messages/image",
      {
        token:
          "tjsbbnge72azvqj1",

        to:
          "237694641329",

        image:
          item.image,

        caption: `

📦 ${item.name}

💰 ${Number(
  item.price
).toLocaleString()} FCFA

📦 Quantité :
${item.quantity}

🏪 KONAN SHOPPING

        `,
      }
    );

  }

}

console.log(
  "WhatsApp + photos envoyés ✅"
);

    } catch (err) {

      console.log(
      "Erreur WhatsApp",
      err.response?.data || err.message
    );

    }

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Erreur serveur",
    });

  }

});

app.put("/order-delivered/:id", async (req, res) => {

  const order =
    await Order.findByIdAndUpdate(

      req.params.id,

      {
        status: "Livrée",
      },

      { new: true }

    );

  res.json(order);

});

// RECUPERER COMMANDES
app.get(

  "/orders",

  async(req,res)=>{

    try{

      const orders =
        await Order.find()

        .sort({createdAt:-1});

      res.json(orders);

    }

    catch(err){

      console.log(err);

      res.status(500).json({

        message:
          "Erreur serveur"

      });

    }

});

app.get(
  "/my-orders/:userId",

  async (req, res) => {

    try {

      const orders =
        await Order.find({
          userId:
            req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(orders);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error:
          "Erreur serveur",
      });

    }

  }
);

// COMMANDES PAR STATUS

app.get(
  "/orders/status/:status",

  async (req, res) => {

    try {

      const orders =
        await Order.find({
          status: req.params.status,
        }).sort({
          createdAt: -1,
        });

      res.json(orders);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: "Erreur serveur",
      });

    }

  }
);


// MODIFIER STATUS
app.put("/orders/:id", async (req, res) => {

  try {

    const { status } = req.body;

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    const message = `
🚚 MISE À JOUR COMMANDE

Bonjour ${updatedOrder.customerName},

Votre commande est maintenant :

${status}

KONAN SHOPPING CAMEROUN
`;

await axios.post(
  "https://api.ultramsg.com/instance174320/messages/chat",
  {
    token: "tjsbbnge72azvqj1",
    to: updatedOrder.phone,
    body: message
  }
);

    res.json(updatedOrder);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Erreur serveur"
    });

  }

});

app.post(
  "/register",

  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      // EMAIL EXISTE

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({

          message:
            "Compte déjà existant",

        });

      }

      // HASH PASSWORD

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // CREATE USER

      const user =
        new User({

          name,

          email,

          password:
            hashedPassword,

        });

      await user.save();

      // RESPONSE

      // TOKEN

const token = jwt.sign(

  {

    id: user._id,

    email: user.email,

    loginTime: Date.now(),

  },

  "KONAN_SECRET",

  {

    expiresIn: "365d",

  }

);

// RESPONSE

res.json({

  message:
    "Compte créé ✅",

  token,

  user: {

    _id:
      user._id,

    name:
      user.name,

    email:
      user.email,

    isAdmin:
      user.isAdmin,

  },

});

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        error:
          "Erreur serveur",

      });

    }

  }
);

app.post(
  "/login",

  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      // USER

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(400).json({

          message:
            "Compte introuvable",

        });

      }

      // CHECK PASSWORD

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {

        return res.status(400).json({

          message:
            "Mot de passe incorrect",

        });

      }

      // TOKEN

     const token =
  jwt.sign(

    {

      id: user._id,

      email: user.email,

      loginTime: Date.now(),

    },

    "KONAN_SECRET",

    {
      expiresIn: "365d",
    }
  );

      // RESPONSE

     res.json({

  token,

  user: {

    _id: user._id,

    name: user.name,

    email: user.email,

    isAdmin: user.isAdmin,

  },

});

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        error:
          "Erreur login",

      });

    }

  }
);

app.post("/ai-chat", async (req, res) => {

console.log(req.body);

  try {

   const {
  message,
  history = []
} = req.body;

console.log(
  "Historique :",
  history
);

    const search =
      message.toLowerCase();

      const wantsRecommendation =

search.includes("conseille")

||

search.includes("recommande")

||

search.includes("meilleur")

||

search.includes("top");

      const lastUserMessage =

history

.filter(
msg => msg.role === "user"
)

.slice(-1)[0]?.text || "";

console.log(
"Dernier message :",
lastUserMessage
);

const previousSearch =

history

.filter(
msg => msg.role === "user"
)

.slice(-2,-1)[0]?.text || "";

const previousProducts =

history

.filter(
msg =>
msg.role === "ai"
&&
msg.products
)

.slice(-1)[0]?.products || [];

const wantsSimilar =

search.includes("similaire")

||

search.includes("ressemble")

||

search.includes("comme celui-ci")

||

search.includes("alternative");

const referenceProduct =

previousProducts[0] || null;

let contextualSearch = search;

if (

search.includes("moins cher")

||

search.includes("le meilleur")

||

search.includes("recommande")

) {

contextualSearch =

`${lastUserMessage} ${search}`;

}

if (

search.includes("premier")

||

search.includes("deuxième")

||

search.includes("ajoute")

||

search.includes("panier")

) {

contextualSearch =

`${previousSearch} ${search}`;

}

    const products =
      await Product.find();

    // =========================
    // MOTS CLES
    // =========================

  const keywords =
contextualSearch
.toLowerCase()
.replace(/[^\w\s]/g, "")
.split(" ")
.filter(word => word.length > 2);

    // =========================
    // MATCH PRODUITS
    // =========================

    let selectedProduct = null;

if (

search.includes("premier")

&&

previousProducts.length > 0

) {

selectedProduct =
previousProducts[0];

}

if (

search.includes("deuxième")

&&

previousProducts.length > 1

) {

selectedProduct =
previousProducts[1];

}

   const matchedProducts =

products

.map((product) => {

const productText =

`
${product.name}
${product.category}
${product.description || ""}
`

.toLowerCase();

let score = 0;

keywords.forEach((word) => {

if (
productText.includes(word)
) {

score++;

}

});

return {

...product._doc,

score,

};

})

.filter(
(product) =>
product.score > 0
)

.sort(
(a, b) =>
b.score - a.score
);

const rankedProducts =

matchedProducts.map(product => ({

...product,

reviewCount:
product.reviews?.length || 0,

aiScore:

(product.reviews?.length || 0) * 5

+

(product.score || 0)

}));

const bestProduct =

rankedProducts

.sort(
(a,b) =>
b.aiScore - a.aiScore
)[0];

    // =========================
    // IA SMART RESPONSE
    // =========================

    let aiReply =
      " Konan AI analyse votre demande...";

      if (

wantsRecommendation

&&

bestProduct

) {

aiReply =

` Mon choix principal est :

${bestProduct.name}

 ${Number(
bestProduct.price
).toLocaleString()} FCFA

 ${bestProduct.category}

 ${
bestProduct.reviewCount
} avis client(s)

C'est actuellement le produit que je recommande le plus selon votre recherche.`;

}

else if (matchedProducts.length > 0){

const firstProduct =
matchedProducts[0];

aiReply =

` Bonjour,

Je suis Konan AI, votre conseiller personnel chez Konan Shopping Cameroun.

J'ai analysé votre demande et j'ai trouvé ${matchedProducts.length} produit(s) correspondant à ce que vous recherchez.

 Mon premier choix pour vous est :

${firstProduct.name}

 Prix :
${Number(firstProduct.price).toLocaleString()} FCFA

 Catégorie :
${firstProduct.category}

 Je vous affiche maintenant les produits les plus pertinents afin que vous puissiez comparer et choisir celui qui vous convient le mieux.

Si vous le souhaitez, je peux également :

 Ajouter un produit au panier

 Préparer votre commande

Trouver une option moins chère

 Recommander les meilleures ventes

Je reste à votre disposition.`;

}

else {

aiReply =

` Bonjour,

Je suis Konan AI, votre conseiller personnel chez Konan Shopping Cameroun.

Je n'ai malheureusement trouvé aucun produit correspondant exactement à votre demande.

 Je vous recommande d'essayer une recherche plus précise.

Par exemple :

 iPhone

 Nike

 Montre

 Sac

 Costume

Robe

Je peux également vous proposer des alternatives similaires disponibles dans notre catalogue.`;

}

    // =========================
    // PRODUITS
    // =========================

    let response = "";

    if (
      matchedProducts.length > 0
    ) {

      response =
        matchedProducts

          .slice(0, 6)

          .map(
            (product) =>

              `
 ${product.name}

 ${product.price} FCFA

 ${product.category}
`
          )

          .join("\n");

    }

    else {

      response =
        " Aucun produit trouvé actuellement.";

    }

    // =========================
    // IA AJOUT PANIER AUTO
    // =========================

    let addToCart = null;

if (

search.includes("ajoute")

||

search.includes("panier")

||

search.includes("acheter")

) {

if (

selectedProduct

) {

addToCart =
selectedProduct;

aiReply =

` Très bien.

${selectedProduct.name}

a été sélectionné.

${Number(
selectedProduct.price
).toLocaleString()} FCFA

${selectedProduct.category}

Le produit est prêt à être ajouté au panier.`;

}

else if (

matchedProducts.length > 0

) {

addToCart =
matchedProducts[0];

}

}

    // =========================
    // IA RECOMMANDATION
    // =========================

    let recommendations = [];

if (matchedProducts.length > 0) {

  recommendations =
    matchedProducts.slice(0, 12);

}
else {

  recommendations =
    products
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

}

    // =========================
    // RESPONSE FINAL
    // =========================

   const productCards = matchedProducts.map(product => ({

  _id: product._id,

  name: product.name,

  price: product.price,

  image: product.image,

  category: product.category,

  description:
    product.description || "",

  reviews:
    product.reviews || [],

  reviewCount:
    product.reviews?.length || 0

}));

res.json({

  reply:
`${aiReply}

${response}`,

  addToCart,

  recommendations,

  products:
productCards.map(product => ({
  ...product,
  reviews:
    products.find(
      p => p._id.toString() === product._id.toString()
    )?.reviews || []
})),

  totalFound:
    matchedProducts.length

});

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      error:
        "Erreur Konan AI",

    });

  }

});

app.get("/profile/:id", async (req, res) => {

  try {

    const user = await User.findById(
      req.params.id
    );

    res.json(user);

  }

  catch (error) {

    res.status(500).json({
      error: "Erreur profil",
    });

  }

});

app.put("/profile/:id", async (req, res) => {

  try {

    const updatedUser =
      await User.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }
      );

    res.json(updatedUser);

  }

  catch (error) {

    res.status(500).json({
      error: "Erreur update",
    });

  }

});

app.post("/favorites", async (req, res) => {

  try {

    const {
      userId,
      productId,
    } = req.body;

    const user =
      await User.findById(userId);

    if (
      !user.favorites.includes(
        productId
      )
    ) {

      user.favorites.push(productId);

      await user.save();

    }

    res.json({
      message: "Favori ajouté ❤️",
    });

  }

  catch (error) {

    res.status(500).json({
      error: "Erreur favoris",
    });

  }

});

app.get("/favorites/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    const user =
      await User.findById(userId)
      .populate("favorites");

    if (!user) {

      return res.status(404).json({
        error: "Utilisateur introuvable",
      });

    }

    res.json(user.favorites);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Erreur favoris",
    });

  }

});

app.delete(
  "/favorites/:userId/:productId",

  async (req, res) => {

    try {

      const {
        userId,
        productId
      } = req.params;

      const user =
        await User.findById(userId);

      user.favorites =
        user.favorites.filter(
          (id) =>
            id.toString() !== productId
        );

      await user.save();

      res.json({
        message:
          "Favori supprimé ✅",
      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({
        error:
          "Erreur suppression favori",
      });

    }

  }
);

app.post("/cart", async (req, res) => {

  try {

    const {
      userId,
      productId,
      quantity
    } = req.body;

    const newCart = new Cart({

      userId,
      productId,
      quantity,

    });

    await newCart.save();

    res.json({
      message:
        "Produit ajouté au panier ✅"
    });

  }

  catch(err){

    console.log(err);

    res.status(500).json({
      error:
        "Erreur panier"
    });

  }

});

app.get(
  "/cart/:userId",

  async (req, res) => {

    try {

      const userId =
        req.params.userId;

      const cart =
        await Cart.find({
          userId
        }).populate(
          "productId"
        );

      res.json(cart);

    }

    catch(err){

      console.log(err);

      res.status(500).json({
        error:
          "Erreur panier"
      });

    }

  }
);

app.post("/chat", async (req, res) => {

  try {

    const chat = new Chat(req.body);

    await chat.save();

    res.json({
      message: "Message envoyé ✅",
    });

  }

  catch (error) {

    res.status(500).json({
      error: "Erreur chat",
    });

  }

});

app.get("/chat", async (req, res) => {

  try {

    const messages =
      await Chat.find();

    res.json(messages);

  }

  catch (error) {

    res.status(500).json({
      error: "Erreur messages",
    });

  }

});

app.get("/product/:id", async (req, res) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404).json({
        error:
          "Produit introuvable",
      });

    }

    res.json(product);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Erreur serveur produit",
    });

  }

});

// =========================
// AJOUTER AVIS PRODUIT
// =========================

app.post(
  "/product/:id/review",
  upload.array("images", 5),
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          message:
            "Produit introuvable",

        });

      }

      const hasPurchased =
  await Order.findOne({

    userId: req.body.clientId,

    "items.productId":
      req.params.id,

  });

console.log(req.body);

      const review = {

  clientId: req.body.clientId,

  name: req.body.name,

  rating: Number(req.body.rating),

  comment: req.body.comment,

  verifiedPurchase:
  !!hasPurchased,

  images: req.files
    ? req.files.map(
        (file) => file.path
      )
    : [],

};

console.log("BODY =", req.body);
console.log("FILES =", req.files);
console.log("REVIEW =", review);


      product.reviews.push(review);

      await product.save();

      res.json(product);

    } catch (err) {

      console.log(err);

      res.status(500).json({

        message:
          "Erreur serveur",

      });

    }

  }
);

// VERIFIER COUPON

app.post(

  "/apply-coupon",

  async (req, res) => {

    try {

      const {
        code,
        total,
      } = req.body;

      const coupon =
        await Coupon.findOne({

          code:
            code.toUpperCase(),

        });

      // PAS TROUVÉ

      if (!coupon) {

        return res.status(404).json({

          message:
            "Coupon invalide",

        });

      }

      // DESACTIVE

      if (!coupon.active) {

        return res.status(400).json({

          message:
            "Coupon désactivé",

        });

      }

      // EXPIRÉ

      if (
        coupon.expiresAt &&
        new Date() >
          coupon.expiresAt
      ) {

        return res.status(400).json({

          message:
            "Coupon expiré",

        });

      }

      // LIMITE

      if (
        coupon.usedCount >=
        coupon.maxUses
      ) {

        return res.status(400).json({

          message:
            "Coupon épuisé",

        });

      }

      // MINIMUM

      if (
        total <
        coupon.minPurchase
      ) {

        return res.status(400).json({

          message:
            `Minimum ${coupon.minPurchase} FCFA requis`,
        });

      }

      // CALCUL

      let discount = 0;

      if (
        coupon.discountType ===
        "percent"
      ) {

        discount =
          total *
          (
            coupon.discountValue /
            100
          );

      }

      else {

        discount =
          coupon.discountValue;

      }

      res.json({

        success: true,

        discount,

        finalTotal:
          total - discount,

        coupon,

      });

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        error:
          "Erreur serveur",

      });

    }

  }
);

app.use("/ai", aiRoutes);

app.use(
  "/products",
  productRoutes
);

app.get("/ai/search", async (req, res) => {

  try {

    const query = req.query.q;

    const products = await Product.find({
      name: {
        $regex: query,
        $options: "i"
      }
    });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      error: "Erreur serveur"
    });

  }

});

app.get("/ai/test", (req, res) => {
  res.send("IA OK");
});

app.use("/orders", orderRoutes);

app.get(
  "/order/:id",

  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          error:
            "Commande introuvable",
        });

      }

      res.json(order);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error:
          "Erreur serveur",
      });

    }

  }
);

// =========================
// UPDATE ORDER STATUS
// =========================

app.put(
  "/update-order-status/:id",

  async (req, res) => {

    try {

      const updatedOrder =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            status:
              req.body.status,
          },

          {
            new: true,
          }

        );

      res.json(updatedOrder);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error:
          "Erreur serveur",
      });

    }

  }
);

// =========================
// DRIVER LOCATION
// =========================

app.put(
  "/driver-location/:id",

  async (req, res) => {

    try {

      const {
        lat,
        lng,
      } = req.body;

      const order =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            driverLocation: {
              lat,
              lng,
            },
          },

          {
            new: true,
          }

        );

      res.json(order);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

  }
);

// =========================
// DRIVER LOGIN
// =========================

app.post("/driver-login", async (req, res) => {

  const driver =
    await Driver.findOne({
      email: req.body.email,
    });

  if (!driver) {

    return res.status(401).json({
      message:
        "Livreur introuvable",
    });

  }

  if (
    driver.password !==
    req.body.password
  ) {

    return res.status(401).json({
      message:
        "Mot de passe incorrect",
    });

  }

  res.json(driver);

});

// =========================
// DELETE ORDER
// =========================

app.delete(
  "/delete-order/:id",

  async (req, res) => {

    try {

      await Order.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Commande supprimée ✅",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error:
          "Erreur suppression",
      });

    }

  }
);

app.put("/accept-order/:id", async (req, res) => {

  try {

    const order = await Order.findByIdAndUpdate(

      req.params.id,

      {

        status: "En livraison",

        assignedDriver: {

          id: req.body.driverId,

          name: req.body.driverName,

          phone: req.body.driverPhone,

          photo: req.body.driverPhoto,

          vehicle: req.body.driverVehicle,

        },

      },

      { new: true }

    );

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Erreur serveur",
    });

  }

});

app.get("/drivers", async (req, res) => {

  try {

    const drivers = await Driver.find();

    res.json(drivers);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Erreur serveur",
    });

  }

});

app.delete("/drivers/:id", async (req, res) => {

  try {

    await Driver.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Erreur serveur",
    });

  }

});

app.post("/driver-register", async (req, res) => {

  try {

    const existingDriver =
      await Driver.findOne({
        email: req.body.email,
      });

    if (existingDriver) {

      return res.status(400).json({
        message:
          "Livreur existe déjà",
      });

    }

    const driver =
      new Driver({

        name: req.body.name,

        email: req.body.email,

        password:
          req.body.password,

        phone: req.body.phone,

        city: req.body.city,

        vehicle:
          req.body.vehicle,

        plate: req.body.plate,

        photo: req.body.photo,

      });

    await driver.save();

    res.json(driver);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }

});

app.put(
  "/order-location/:orderId",

  async (req, res) => {

    try {

      const order =
        await Order.findByIdAndUpdate(

          req.params.orderId,

          {
            driverLocation: {

              lat: req.body.lat,

              lng: req.body.lng,

            },

            status:
              "En livraison",
          },

          { new: true }

        );

      res.json(order);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error:
          "Erreur serveur",
      });

    }

  }
);

// UPDATE PRODUCT

app.put(
  "/update-product/:id",
  async (req, res) => {

    try {

      const updated =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new:true
          }
        );

      res.json(updated);

    } catch (err) {

      res.status(500).json(err);

    }

  }
);

// DELETE PRODUCT

app.delete(
  "/delete-product/:id",
  async (req, res) => {

    try {

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success:true
      });

    } catch (err) {

      res.status(500).json(err);

    }

  }
);

// USERS

app.get(
  "/users",
  async(req,res)=>{

    try{

      const users =
        await User.find();

      res.json(users);

    }catch(err){

      res.status(500).json(err);

    }

});

// VISITORS

app.post(
  "/track-visitor",

  async(req,res)=>{

    try{

      const {

  ip,

  country,

  city,

  device

} = req.body;

      const existingVisitor =
  await Visitor.findOne({
    ip
  });

if(!existingVisitor){

  const newVisitor =
    new Visitor({

      ip,
      country,
      city,
      device,

      pagesVisited:1,

      lastVisit:new Date(),

    });

  await newVisitor.save();

}else{

  existingVisitor.pagesVisited += 1;

  existingVisitor.lastVisit =
    new Date();

  await existingVisitor.save();

}

      res.json({
        success:true
      });

    }catch(err){

      res.status(500).json(err);

    }

});

app.get(
  "/api/users",
  async (req, res) => {

    try {

      const users =
        await User.find();

      res.json(users);

    } catch (err) {

      res.status(500).json(err);

    }

  }
);

app.get(
  "/visitors",

  async(req,res)=>{

    try{

      const visitors =
        await Visitor
          .find()
          .sort({_id:-1});

      res.json(visitors);

    }catch(err){

      res.status(500).json(err);

    }

});

app.use(
  "/api/orders",
  ordersRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.put(
  "/product/:productId/review/:reviewId/like",
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.productId
        );

      if (!product) {
        return res.status(404).json({
          message: "Produit introuvable",
        });
      }

      const review =
        product.reviews.id(
          req.params.reviewId
        );

      if (!review) {
        return res.status(404).json({
          message: "Avis introuvable",
        });
      }

      const clientId =
        req.body.clientId;

      if (
        !review.likes.includes(
          clientId
        )
      ) {

        review.likes.push(
          clientId
        );

        review.dislikes =
          review.dislikes.filter(
            (id) =>
              id !== clientId
          );

      }

      await product.save();

      res.json({
        likes:
          review.likes.length,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Erreur serveur",
      });

    }

  }
);

app.put(
  "/product/:productId/review/:reviewId/dislike",
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.productId
        );

      const review =
        product.reviews.id(
          req.params.reviewId
        );

      const clientId =
        req.body.clientId;

      if (
        !review.dislikes.includes(
          clientId
        )
      ) {

        review.dislikes.push(
          clientId
        );

        review.likes =
          review.likes.filter(
            (id) =>
              id !== clientId
          );

      }

      await product.save();

      res.json({
        dislikes:
          review.dislikes.length,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Erreur serveur",
      });

    }

  }
);

app.post(
  "/product/:productId/review/:reviewId/reply",
  async (req, res) => {
    try {

      const product =
        await Product.findById(
          req.params.productId
        );

      if (!product) {
        return res.status(404).json({
          message: "Produit introuvable",
        });
      }

      const review =
        product.reviews.id(
          req.params.reviewId
        );

      if (!review) {
        return res.status(404).json({
          message: "Avis introuvable",
        });
      }

      review.replies.push({
        clientId: req.body.clientId,
        name: req.body.name,
        comment: req.body.comment,
      });

      await product.save();

      res.json({
        message: "Réponse ajoutée",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Erreur serveur",
      });

    }
  }
);

app.get("/fix-images", async (req, res) => {
  try {
    const Product = require("./models/product");

    const products = await Product.find({
      $or: [
        { image: { $regex: "localhost:5000" } },
        { image: { $regex: "onrender.com" } },
      ],
    });

    for (const product of products) {

      product.image = product.image
        .replace(
          "http://localhost:5000",
          "https://konanshopping-production.up.railway.app"
        )
        .replace(
          "https://konanshopping.onrender.com",
          "https://konanshopping-production.up.railway.app"
        );

      await product.save();
    }

    res.send(`✅ ${products.length} produits corrigés`);

  } catch (err) {

    console.log(err);

    res.status(500).send("Erreur");

  }
});

// =========================
// PHOTO PROFIL UTILISATEUR
// =========================

app.put(
  "/users/:id/avatar",
  async (req, res) => {

    try {

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            avatar: req.body.avatar
          },
          {
            new: true
          }
        );

      res.json(user);

    } catch (err) {

      console.log(err);

      res.status(500).json(err);

    }

  }
);

app.get(
  "/users/:id",
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      res.json(user);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Erreur serveur",
      });

    }

  }
);

// =========================
// START SERVER
// =========================

mongoose
  .connect(process.env.MONGO_URI)

  .then(async () => {

    console.log(
      "MongoDB Atlas connecté ✅"
    );

    await Order.updateMany(
      {
        status: "Livré",
      },
      {
        $set: {
          status: "Livrée",
        },
      }
    );

    console.log(
      "Statuts corrigés ✅"
    );

    const PORT =
      process.env.PORT || 5000;

    app.listen(PORT, () => {

      console.log(
        `Serveur démarré sur le port ${PORT} 🚀`
      );

    });

  })

  .catch((err) => {

    console.log(err);

  });