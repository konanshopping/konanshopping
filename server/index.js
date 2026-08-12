const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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

const xml = require("xml");

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

  const paymentRoutes = require("./routes/payment");

const Coupon =
  require("./models/Coupon");

  const couponRoutes = require("./routes/couponRoutes");

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

// ======================================================
// 🚚 TELEGRAM LIVREUR — MESSAGE INDIVIDUEL
// ======================================================

async function sendDriverTelegramMessage(
  chatId,
  message
) {

  try {

    if (!chatId) {

      console.log(
        "⚠️ Aucun Telegram associé à ce livreur."
      );

      return false;

    }


    await axios.post(

      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,

      {

        chat_id:
          chatId,

        text:
          message,

        disable_web_page_preview:
          false,

      }

    );


    return true;


  } catch (err) {

    console.error(

      "❌ TELEGRAM DRIVER ERROR:",

      err.response?.data ||
      err.message

    );

    return false;

  }

}

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const User = require("./models/User");

const Chat = require("./models/Chat");


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

app.use("/api/payment", paymentRoutes);

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

// ======================================================
// 🤖 TELEGRAM — WEBHOOK LIVREURS
// ======================================================

app.post(
  "/telegram/webhook",
  async (req, res) => {

    try {

      const message =
        req.body?.message;

      // Telegram peut envoyer d'autres types
      // d'updates. On les ignore simplement.

      if (!message) {
        return res.sendStatus(200);
      }


      const chatId =
        message.chat?.id;

      const username =
        message.from?.username || "";

      const text =
        message.text || "";


      if (!chatId) {
        return res.sendStatus(200);
      }


      // ==================================================
      // 🔗 CONNEXION LIVREUR
      // FORMAT :
      // /start driver_TOKEN
      // ==================================================

      if (
        text.startsWith("/start driver_")
      ) {

        const token =
          text
            .replace(
              "/start driver_",
              ""
            )
            .trim();


        if (!token) {

          await sendDriverTelegramMessage(

            chatId,

            `
❌ CONNEXION IMPOSSIBLE

Le lien de connexion est invalide.

Retournez dans votre
🚚 Centre Livreur KONAN SHOPPING
et générez un nouveau lien.
            `

          );

          return res.sendStatus(200);
        }


        // ==============================================
        // 🔍 RECHERCHER LE LIVREUR
        // ==============================================

        const driver =
          await Driver.findOne({

            telegramConnectToken:
              token,

            telegramConnectExpires: {
              $gt: new Date()
            }

          });


        // ==============================================
        // ❌ TOKEN INVALIDE / EXPIRÉ
        // ==============================================

        if (!driver) {

          await sendDriverTelegramMessage(

            chatId,

            `
❌ LIEN EXPIRÉ

Ce lien de connexion n'est plus valide.

🚚 Retournez dans votre Centre Livreur
KONAN SHOPPING et générez un nouveau
lien de connexion Telegram.
            `

          );

          return res.sendStatus(200);
        }


        // ==============================================
        // 🔐 ENREGISTRER TELEGRAM
        // ==============================================

        driver.telegramChatId =
          String(chatId);

        driver.telegramUsername =
          username;

        driver.telegramConnected =
          true;

        driver.telegramConnectedAt =
          new Date();

        // Le token devient inutilisable
        // après la connexion.

        driver.telegramConnectToken =
          null;

        driver.telegramConnectExpires =
          null;


        await driver.save();


        // ==============================================
        // 🎉 CONFIRMATION
        // ==============================================

        await sendDriverTelegramMessage(

          chatId,

          `
🎉 TELEGRAM CONNECTÉ

🚚 KONAN SHOPPING
CENTRE LIVREUR

Bonjour ${driver.name} 👋

Votre compte livreur est maintenant
connecté à Telegram.

━━━━━━━━━━━━━━━━━━

🟢 NOTIFICATIONS
ACTIVÉES

🚨 Vous recevrez ici les nouvelles
commandes disponibles.

⚡ Le premier livreur à accepter
une commande sera automatiquement
assigné à celle-ci.

━━━━━━━━━━━━━━━━━━

📱 CENTRE LIVREUR

https://konanshopping.com/driver

━━━━━━━━━━━━━━━━━━

🏪 KONAN SHOPPING CAMEROUN
          `

        );


        console.log(
          `📲 Telegram connecté : ${driver.name} | Chat ID : ${chatId}`
        );


        return res.sendStatus(200);

      }


      // ==================================================
      // 👋 /start SIMPLE
      // ==================================================

      if (
        text.trim() === "/start"
      ) {

        await sendDriverTelegramMessage(

          chatId,

          `
👋 BIENVENUE CHEZ KONAN SHOPPING

🚚 Vous êtes sur le bot du
Centre Livreur.

Pour connecter votre compte :

1️⃣ Connectez-vous à votre Centre Livreur
2️⃣ Cliquez sur « Connecter Telegram »
3️⃣ Ouvrez le lien Telegram généré
4️⃣ Appuyez sur START

🔐 La connexion sera automatique.
          `

        );

      }


      return res.sendStatus(200);


    } catch (err) {

      console.error(
        "❌ TELEGRAM WEBHOOK ERROR:",
        err
      );

      // Toujours répondre 200 à Telegram
      // pour éviter des répétitions inutiles.

      return res.sendStatus(200);

    }

  }
);

// ======================================================
// 🔗 CONFIGURER LE WEBHOOK TELEGRAM
// ======================================================

app.get(
  "/telegram/setup-webhook",
  async (req, res) => {

    try {

      const webhookUrl =
        "https://konanshopping.com/telegram/webhook";


      const response =
        await axios.get(

          `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/setWebhook`,

          {
            params: {
              url: webhookUrl,
            },
          }

        );


      console.log(
        "🤖 WEBHOOK TELEGRAM :",
        response.data
      );


      res.json({

        success:
          response.data.ok,

        telegram:
          response.data,

        webhook:
          webhookUrl,

      });


    } catch (err) {

      console.error(
        "❌ ERREUR WEBHOOK TELEGRAM :",
        err.response?.data ||
        err.message
      );


      res.status(500).json({

        success: false,

        message:
          "Impossible de configurer le webhook Telegram",

        error:
          err.response?.data ||
          err.message,

      });

    }

  }
);

// ======================================================
// 🔎 VÉRIFIER LE WEBHOOK TELEGRAM
// ======================================================

app.get(
  "/telegram/webhook-info",
  async (req, res) => {

    try {

      const response =
        await axios.get(

          `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getWebhookInfo`

        );


      res.json(
        response.data
      );


    } catch (err) {

      console.error(
        "❌ WEBHOOK INFO ERROR:",
        err.response?.data ||
        err.message
      );


      res.status(500).json({

        success: false,

        error:
          err.response?.data ||
          err.message,

      });

    }

  }
);

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
    "https://konanshopping.com/" +
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

app.get("/product-sitemap.xml", async (req, res) => {
  try {
    const products = await Product.find();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    products.forEach((product) => {
      sitemap += `
  <url>
    <loc>https://konanshopping.com/product/${product._id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur");
  }
});

app.get("/feed.xml", async (req, res) => {
  try {
    const products = await Product.find();

const filteredProducts = products.filter((product) => {
  const text = `${product.name} ${product.description || ""} ${product.category || ""}`.toLowerCase();

  return (
    !text.includes("louis vuitton") &&
    !text.includes("louis vuiton") &&
    !text.includes("lv")
  );
});

    const feed = [
      {
        _attr: {
          version: "2.0",
          "xmlns:g": "http://base.google.com/ns/1.0",
        },
      },
      {
        channel: [
          { title: "KONAN SHOPPING CAMEROUN" },
          { link: "https://konanshopping.com" },
          {
            description:
              "Boutique en ligne KONAN SHOPPING Cameroun",
          },

          ...filteredProducts.map((product) => ({
            item: [
              { "g:id": product._id.toString() },
              { title: product.name },
              { description: product.description || "" },
              {
                link:
                  `https://konanshopping.com/product/${product._id}`,
              },
              { "g:image_link": product.image },
              {
                "g:availability": "in stock",
              },
              {
                "g:price":
                  `${product.price} XAF`,
              },
              {
                "g:condition": "new",
              },
              {
                "g:brand":
                  "KONAN SHOPPING",
              },
              {
                "g:product_type":
                  product.category || "Divers",
              },
            ],
          })),
        ],
      },
    ];

    res.set("Content-Type", "application/xml");
    res.send(
      '<?xml version="1.0" encoding="UTF-8"?>' +
      xml({ rss: feed })
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Erreur");
  }
});

app.post(
  "/add-product",
  upload.single("image"),
  async (req, res) => {

    try {

      console.log("===== AJOUT PRODUIT =====");
      console.log("BODY :", req.body);
      console.log("FILE :", req.file);

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "Aucune image reçue."
        });

      }

      const product = new Product({

        name: req.body.name,

        price: Number(req.body.price),

        category: req.body.category || "",

        description: req.body.description || "",

        image: req.file.path || req.file.secure_url,

      });

      await product.save();

      console.log("Produit enregistré :", product);

      res.status(201).json({

        success: true,

        message: "Produit ajouté avec succès",

        product,

      });

    } catch (err) {

      console.error("===== ERREUR AJOUT PRODUIT =====");
      console.error(err);

      res.status(500).json({

        success: false,

        message: err.message,

      });

    }

  }
);

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

// ===============================
// AJOUTER LA COMMANDE AU CLIENT
// ===============================

if (req.body.userId) {

  const update = {

    $push: {

      orders: order._id,

    },

  };

  // ===============================
  // SI UN COUPON A ÉTÉ UTILISÉ
  // ===============================

  if (req.body.couponCode) {

    update.$addToSet = {

      usedCoupons:
        req.body.couponCode.toUpperCase(),

    };

    // Incrémenter le nombre
    // d'utilisations du coupon

    await Coupon.findOneAndUpdate(

      {

        code:
          req.body.couponCode.toUpperCase(),

      },

      {

        $inc: {

          usedCount: 1,

        },

      }

    );

  }

  await User.findByIdAndUpdate(

    req.body.userId,

    update

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

      // Si c'est un ancien compte
if (!user.registerDate) {
  user.registerDate = new Date();
  await user.save();
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

    createdAt: user.createdAt,

    registerDate: user.registerDate,

    usedCoupons: user.usedCoupons,

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

  "items.productId": req.params.id,

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

app.post("/coupons/create-default", async (req, res) => {

  try {

    const coupons = [

      {
        code: "KONAN10",
        discountType: "percent",
        discountValue: 10,
        minPurchase: 20000,
        maxUses: 9999,
        active: true,
      },

      {
        code: "WELCOME20",
        discountType: "percent",
        discountValue: 20,
        minPurchase: 30000,
        maxUses: 9999,
        active: true,
      },

      {
        code: "VIP50",
        discountType: "fixed",
        discountValue: 5000,
        minPurchase: 50000,
        maxUses: 9999,
        active: true,
      },

      {
        code: "LIVRAISON",
        discountType: "fixed",
        discountValue: 1500,
        minPurchase: 10000,
        maxUses: 9999,
        active: true,
      }

    ];

    await Coupon.insertMany(coupons, {
      ordered: false,
    });

    res.json({
      message: "Coupons créés"
    });

  } catch (err) {

    console.log(err);

    res.json({
      message: "Les coupons existent déjà."
    });

  }

});

app.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find({ active: true });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
});

app.post("/coupons", async (req, res) => {
  try {
    const coupon = new Coupon(req.body);

    await coupon.save();

    res.json(coupon);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Erreur serveur",
    });

  }
});

app.delete("/coupons/:id", async (req, res) => {

  await Coupon.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Coupon supprimé",
  });

});

// ==========================
// ==========================
// VERIFIER COUPON
// ==========================

console.log("Je suis juste avant apply-coupon");

app.post(

  "/apply-coupon",

  async (req, res) => {

    console.log("BODY =", req.body);

    console.log("ROUTE APPLY COUPON CHARGÉE");

    try {

      const {

        code,

        total,

        userId,

      } = req.body;

      // =====================
      // RECHERCHE COUPON
      // =====================

const coupons = await Coupon.find();

console.log("Tous les coupons :", coupons);

      const coupon =
        await Coupon.findOne({

          code:
            code.toUpperCase(),

        });

        console.log("Coupon trouvé :", coupon);

      if (!coupon) {

        return res.status(404).json({

          message:
            "Coupon invalide",

        });

      }


      // =====================
      // RECHERCHE UTILISATEUR
      // =====================

      console.log("userId =", userId);
console.log("Type =", typeof userId);
console.log("Je vais chercher l'utilisateur");
      const user =
        await User.findById(userId);

      if (!user) {

        return res.status(404).json({

          message:
            "Utilisateur introuvable",

        });

      }

      // =====================
      // COUPON DÉJÀ UTILISÉ
      // =====================

      if (
        user.usedCoupons.includes(
          coupon.code
        )
      ) {

        return res.status(400).json({

          message:
            "Vous avez déjà utilisé ce coupon",

        });

      }

      // =====================
      // COUPON ACTIF
      // =====================

      if (!coupon.active) {

        return res.status(400).json({

          message:
            "Coupon désactivé",

        });

      }

      // =====================
      // EXPIRATION SELON
      // DATE D'INSCRIPTION
      // =====================

      let expireDate =
        new Date(user.registerDate);

      switch (coupon.code) {

        case "LIVRAISON":

          expireDate.setDate(
            expireDate.getDate() + 1
          );

          break;

        case "KONAN10":

          expireDate.setDate(
            expireDate.getDate() + 7
          );

          break;

        case "WELCOME20":

          expireDate.setDate(
            expireDate.getDate() + 7
          );

          break;

        case "VIP50":

          expireDate.setDate(
            expireDate.getDate() + 30
          );

          break;

      }

      if (
        new Date() > expireDate
      ) {

        return res.status(400).json({

          message:
            "Coupon expiré",

        });

      }

      // =====================
      // LIMITE GLOBALE
      // =====================

      if (
        coupon.usedCount >=
        coupon.maxUses
      ) {

        return res.status(400).json({

          message:
            "Coupon épuisé",

        });

      }

      // =====================
      // ACHAT MINIMUM
      // =====================

      if (
        total <
        coupon.minPurchase
      ) {

        return res.status(400).json({

          message:
            `Minimum ${coupon.minPurchase} FCFA requis`,

        });

      }

      // =====================
      // PREMIÈRE COMMANDE
      // (WELCOME20)
      // =====================

      if (
        coupon.code ===
          "WELCOME20" &&
        user.orders.length > 0
      ) {

        return res.status(400).json({

          message:
            "Coupon réservé à la première commande",

        });

      }

      // =====================
      // CALCUL RÉDUCTION
      // =====================

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
          Math.max(
            total - discount,
            0
          ),

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

 console.log("Je suis juste après apply-coupon");

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

// ======================================================
// 📲 GÉNÉRER LE LIEN TELEGRAM DU LIVREUR
// ======================================================

app.post(
  "/driver/:id/telegram-connect",
  async (req, res) => {

    try {

      const driver =
        await Driver.findById(
          req.params.id
        );


      if (!driver) {

        return res.status(404).json({

          success: false,

          message:
            "Livreur introuvable"

        });

      }


      // ==========================================
      // 🔐 TOKEN UNIQUE
      // ==========================================

      const token =
        crypto
          .randomBytes(24)
          .toString("hex");


      driver.telegramConnectToken =
        token;

      driver.telegramConnectExpires =
        new Date(
          Date.now() +
          10 * 60 * 1000
        );


      await driver.save();


      // ==========================================
      // 🤖 NOM DU BOT
      // ==========================================

      const botUsername =
        process.env.TELEGRAM_BOT_USERNAME;


      if (!botUsername) {

        return res.status(500).json({

          success: false,

          message:
            "TELEGRAM_BOT_USERNAME manque dans le fichier .env"

        });

      }


      const telegramUrl =
        `https://t.me/${botUsername}?start=driver_${token}`;


      console.log(
        `📲 Lien Telegram généré pour ${driver.name}`
      );


      return res.json({

        success: true,

        telegramUrl,

        expiresIn:
          600

      });


    } catch (err) {

      console.error(
        "❌ TELEGRAM CONNECT ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Erreur serveur"

      });

    }

  }
);

// ======================================================
// 🚚 ACCEPTER UNE COMMANDE
// ======================================================

app.put(
  "/accept-order/:id",
  async (req, res) => {

    try {

      const {
        driverId,
        driverName,
        driverPhone,
        driverPhoto,
        driverVehicle
      } = req.body;


      // ============================================
      // VALIDATION LIVREUR
      // ============================================

      if (!driverId) {

        return res.status(400).json({

          success: false,

          message:
            "Livreur non identifié"

        });

      }


      // ============================================
      // ACCEPTATION ATOMIQUE
      // ============================================

      const order =
        await Order.findOneAndUpdate(

          {

            _id:
              req.params.id,

            // La commande doit être disponible

            status: {
              $in: [
                "En attente",
                "Confirmée",
                "Préparation"
              ]
            },

            // Aucun livreur ne doit déjà
            // être assigné

            $or: [

              {
                assignedDriver:
                  { $exists: false }
              },

              {
                assignedDriver:
                  null
              }

            ]

          },

          {

            $set: {

              status:
                "En livraison",

              assignedDriver: {

                id:
                  driverId,

                name:
                  driverName || "",

                phone:
                  driverPhone || "",

                photo:
                  driverPhoto || "",

                vehicle:
                  driverVehicle || ""

              },

              acceptedAt:
                new Date()

            }

          },

          {
            new: true
          }

        );


      // ============================================
      // COMMANDE NON DISPONIBLE
      // ============================================

      if (!order) {

        const existingOrder =
          await Order.findById(
            req.params.id
          );


        if (!existingOrder) {

          return res.status(404).json({

            success: false,

            message:
              "Commande introuvable"

          });

        }


        return res.status(409).json({

          success: false,

          message:
            "Cette commande a déjà été prise par un autre livreur.",

          alreadyAssigned: true,

          assignedDriver:
            existingOrder.assignedDriver || null

        });

      }


      // ============================================
      // SUCCÈS
      // ============================================

      console.log(
        `🚚 Commande ${order._id} acceptée par ${driverName}`
      );


      return res.json({

        success: true,

        message:
          "Commande acceptée avec succès",

        order

      });


    } catch (err) {

      console.error(
        "❌ ACCEPT ORDER ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Erreur serveur lors de l'acceptation"

      });

    }

  }
);

// ======================================================
// 📦 COMMANDES DISPONIBLES POUR LES LIVREURS
// ======================================================

app.get(
  "/driver-orders",
  async (req, res) => {

    try {

      const orders =
        await Order.find({

          status: {
            $in: [
              "En attente",
              "Confirmée",
              "Préparation"
            ]
          },

          $or: [

            {
              assignedDriver:
                { $exists: false }
            },

            {
              assignedDriver:
                null
            }

          ]

        })
        .sort({
          createdAt: -1
        });


      res.json({

        success: true,

        count:
          orders.length,

        orders

      });


    } catch (err) {

      console.error(
        "❌ DRIVER ORDERS ERROR:",
        err
      );


      res.status(500).json({

        success: false,

        message:
          "Erreur récupération commandes"

      });

    }

  }
);

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

// ======================================================
// 📍 GPS DU LIVREUR
// ======================================================

app.put(
  "/order-location/:orderId",
  async (req, res) => {

    try {

      const {
        driverId,
        lat,
        lng
      } = req.body;


      // ============================================
      // VALIDATION
      // ============================================

      if (!driverId) {

        return res.status(400).json({

          success: false,

          message:
            "Livreur non identifié"

        });

      }


      if (
        lat === undefined ||
        lng === undefined
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Coordonnées GPS manquantes"

        });

      }


      // ============================================
      // VÉRIFIER LE LIVREUR
      // ============================================

      const order =
        await Order.findOneAndUpdate(

          {

            _id:
              req.params.orderId,

            "assignedDriver.id":
              driverId,

            status:
              "En livraison"

          },

          {

            $set: {

              driverLocation: {

                lat:
                  Number(lat),

                lng:
                  Number(lng),

                updatedAt:
                  new Date()

              }

            }

          },

          {
            new: true
          }

        );


      // ============================================
      // PAS AUTORISÉ
      // ============================================

      if (!order) {

        return res.status(403).json({

          success: false,

          message:
            "Vous n'êtes pas le livreur assigné à cette commande."

        });

      }


      // ============================================
      // OK
      // ============================================

      return res.json({

        success: true,

        order

      });


    } catch (err) {

      console.error(
        "❌ GPS ERROR:",
        err
      );


      res.status(500).json({

        success: false,

        message:
          "Erreur serveur GPS"

      });

    }

  }
);

// ======================================================
// ✅ LIVRER UNE COMMANDE
// ======================================================

app.put(
  "/driver-deliver/:orderId",
  async (req, res) => {

    try {

      const {
        driverId
      } = req.body;


      if (!driverId) {

        return res.status(400).json({

          success: false,

          message:
            "Livreur non identifié"

        });

      }


      const order =
        await Order.findOneAndUpdate(

          {

            _id:
              req.params.orderId,

            "assignedDriver.id":
              driverId,

            status:
              "En livraison"

          },

          {

            $set: {

              status:
                "Livrée",

              deliveredAt:
                new Date()

            }

          },

          {
            new: true
          }

        );


      if (!order) {

        return res.status(403).json({

          success: false,

          message:
            "Vous n'êtes pas autorisé à livrer cette commande."

        });

      }


      console.log(
        `✅ Commande ${order._id} livrée par ${driverId}`
      );


      res.json({

        success: true,

        message:
          "Commande livrée avec succès",

        order

      });


    } catch (err) {

      console.error(
        "❌ DELIVERY ERROR:",
        err
      );


      res.status(500).json({

        success: false,

        message:
          "Erreur serveur"

      });

    }

  }
);

// ======================================================
// ❌ ANNULER / ABANDONNER UNE LIVRAISON
// ======================================================

app.put(
  "/driver-cancel/:orderId",
  async (req, res) => {

    try {

      const {
        driverId
      } = req.body;


      const order =
        await Order.findOneAndUpdate(

          {

            _id:
              req.params.orderId,

            "assignedDriver.id":
              driverId,

            status:
              "En livraison"

          },

          {

            $set: {

              status:
                "En attente",

              assignedDriver:
                null,

              cancelledAt:
                new Date()

            }

          },

          {
            new: true
          }

        );


      if (!order) {

        return res.status(403).json({

          success: false,

          message:
            "Impossible d'annuler cette livraison."

        });

      }


      res.json({

        success: true,

        message:
          "Commande remise à disposition",

        order

      });


    } catch (err) {

      console.error(err);


      res.status(500).json({

        success: false,

        message:
          "Erreur serveur"

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
  "/messages",
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

app.get("/api/fix-images", async (req, res) => {
  try {
    const products = await Product.find();

    let count = 0;

    for (const product of products) {
      if (!product.image) continue;

      const oldImage = product.image;

      product.image = oldImage
        .replace(
          "https://konanshopping-production.up.railway.app/uploads/",
          "https://konanshopping.com/uploads/"
        )
        .replace(
          "http://localhost:5000/uploads/",
          "https://konanshopping.com/uploads/"
        )
        .replace(
          "https://konanshopping.onrender.com/uploads/",
          "https://konanshopping.com/uploads/"
        );

      if (product.image !== oldImage) {
        await product.save();
        count++;
      }
    }

    res.send(`✅ ${count} produits corrigés`);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.get("/fix-images", async (req, res) => {
  const products = await Product.find();

  let count = 0;

  for (const p of products) {
    if (!p.image) continue;

    const old = p.image;

    p.image = old
      .replace(
        /https:\/\/konanshopping-production\.up\.railway\.app\/uploads\//g,
        "https://konanshopping.com/uploads/"
      )
      .replace(
        /http:\/\/localhost:5000\/uploads\//g,
        "https://konanshopping.com/uploads/"
      );

    if (old !== p.image) {
      await p.save();
      count++;
    }
  }

  res.send(`Produits corrigés : ${count}`);
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

// =====================================
// CHAT MONDIAL SOCKET.IO
// =====================================

let onlineUsers = 0;

io.on("connection", (socket) => {

  console.log("🟢 Utilisateur connecté :", socket.id);

  onlineUsers++;

  io.emit("onlineUsers", onlineUsers);

  socket.on("joinCommunity", (user) => {

    socket.user = user;

    io.emit("userJoined", user);

  });

  socket.on("sendMessage", (message) => {

    io.emit("newMessage", message);

  });

  socket.on("typing", (user) => {

    socket.broadcast.emit("typing", user);

  });

  socket.on("disconnect", () => {

    console.log("🔴 Déconnexion :", socket.id);

    onlineUsers--;

    if (onlineUsers < 0) onlineUsers = 0;

    io.emit("onlineUsers", onlineUsers);

  });

});

// =========================
// START SERVER
// =========================

mongoose
  .connect(process.env.MONGO_URI)

  .then(async () => {

    console.log("MongoDB Atlas connecté ✅");
console.log("Base utilisée :", mongoose.connection.name);
console.log("URI :", process.env.MONGO_URI);

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

    server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});

  })

  .catch((err) => {

    console.log(err);

  });