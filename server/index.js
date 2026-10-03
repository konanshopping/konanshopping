const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Product = require("./models/product")
const Order = require("./models/Order");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const nodemailer = require("nodemailer");

const cookieParser = require("cookie-parser");

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

const {
  rateLimit,
  requireAdmin,
  requireUser,
  requireUserOrAdmin,
  requireSelfOrAdmin,
  requireDriverSelf,
  requireDriverSelfOrAdmin,
  requireDriverOrAdmin,
  securityHeaders
} = require("./middleware/security");

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const aiRoutes =
  require("./ai");

  const communityRoutes = require("./routes/community");

  const paymentRoutes = require("./routes/payment");

  const socialRoutes =
  require("./routes/socialRoutes");

  const tiktokRoutes =
  require("./routes/tiktokRoutes");

const Coupon =
  require("./models/Coupon");

  const couponRoutes = require("./routes/couponRoutes");

  const Visitor =
  require("./models/Visitor");

  const SocialPost =
  require("./models/SocialPost");

  const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("SMTP configuré :", process.env.EMAIL_USER ? "OUI" : "NON");

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

// ======================================================
// 🚚 TELEGRAM — NOTIFIER TOUS LES LIVREURS CONNECTÉS
// ======================================================

async function notifyDriversNewOrder(order) {

  try {

    // ==========================================
    // 🚚 LIVREURS CONNECTÉS À TELEGRAM
    // ==========================================

    const drivers = await Driver.find({

      telegramConnected: true,

      telegramChatId: {
        $exists: true,
        $nin: ["", null],
      },

    });


    if (!drivers.length) {

      console.log(
        "ℹ️ Aucun livreur connecté à Telegram."
      );

      return;

    }


    console.log(
      `📲 ${drivers.length} livreur(s) connecté(s) à Telegram.`
    );


    // ==========================================
    // 📋 RÉFÉRENCE
    // ==========================================

    const orderRef =
      `KS-${order._id
        .toString()
        .slice(-6)
        .toUpperCase()}`;


    // ==========================================
    // 📦 PRODUITS
    // ==========================================

    const products =
      (order.items || [])
        .map((item) => {

          return `▪️ ${item.name}
📦 Quantité : x${item.quantity}
💰 Prix : ${Number(
            item.price || 0
          ).toLocaleString("fr-FR")} FCFA`;

        })
        .join("\n\n");


    // ==========================================
    // 🚨 MESSAGE LIVREUR
    // ==========================================

    const message = `

🚨 NOUVELLE COMMANDE

🚚 KONAN SHOPPING
CENTRE LIVREUR

━━━━━━━━━━━━━━━━━━

📋 COMMANDE
${orderRef}

👤 CLIENT
${order.customerName || "Non renseigné"}

📞 TÉLÉPHONE
${order.phone || "Non renseigné"}

📍 ADRESSE
${order.address || "Non renseignée"}

🏙️ VILLE
${order.city || "Non renseignée"}

📌 QUARTIER
${order.district || "Non renseigné"}

━━━━━━━━━━━━━━━━━━

📦 PRODUITS

${products || "Aucun produit"}

━━━━━━━━━━━━━━━━━━

💰 TOTAL

${Number(
  order.total || 0
).toLocaleString("fr-FR")} FCFA

━━━━━━━━━━━━━━━━━━

⚡ ACTION REQUISE

🥇 Le premier livreur qui accepte
la commande sera automatiquement
assigné.

🔒 Une fois acceptée, elle devient
indisponible pour les autres livreurs.

━━━━━━━━━━━━━━━━━━

📲 CENTRE LIVREUR

https://konanshopping.com/driver

🚚 Soyez le premier à accepter !

🏪 KONAN SHOPPING CAMEROUN

`;


    // ==========================================
    // 📲 ENVOI À CHAQUE LIVREUR
    // ==========================================

    for (const driver of drivers) {

      try {

        const sent =
          await sendDriverTelegramMessage(

            driver.telegramChatId,

            message

          );


        if (sent) {

          console.log(
            `✅ Notification envoyée à ${driver.name}`
          );

        } else {

          console.log(
            `⚠️ Notification non envoyée à ${driver.name}`
          );

        }

      } catch (err) {

        console.error(
          `❌ Telegram ${driver.name}:`,
          err.response?.data ||
          err.message
        );

      }

    }


  } catch (err) {

    console.error(
      "❌ ERREUR NOTIFICATION LIVREURS :",
      err
    );

  }

}

// ======================================================
// 🔄 TELEGRAM — COMMANDE REDEVENUE DISPONIBLE
// ======================================================

async function notifyDriversOrderAvailableAgain(
  order,
  cancelledDriverId = null
) {

  try {

    // ==========================================
    // 🚚 LIVREURS TELEGRAM CONNECTÉS
    // ==========================================

    const drivers =
      await Driver.find({

        telegramConnected: true,

        telegramChatId: {
          $exists: true,
          $nin: ["", null],
        },

      });


    if (!drivers.length) {

      console.log(
        "ℹ️ Aucun livreur connecté à Telegram."
      );

      return;

    }


    // ==========================================
    // 📋 RÉFÉRENCE COMMANDE
    // ==========================================

    const orderRef =
      `KS-${order._id
        .toString()
        .slice(-6)
        .toUpperCase()}`;


    // ==========================================
    // 📦 PRODUITS
    // ==========================================

    const products =
      (order.items || [])
        .map((item) => {

          return (
            `▪️ ${item.name || "Produit"}\n` +

            `📦 Quantité : x${item.quantity || 1}\n` +

            `💰 Prix : ${
              Number(
                item.price || 0
              ).toLocaleString("fr-FR")
            } FCFA`
          );

        })
        .join("\n\n");


    // ==========================================
    // 🚨 MESSAGE TELEGRAM
    // ==========================================

    const message = `

🔄 COMMANDE REDEVENUE DISPONIBLE

🚚 KONAN SHOPPING
CENTRE LIVREUR

━━━━━━━━━━━━━━━━━━

⚠️ UNE COMMANDE VIENT D'ÊTRE LIBÉRÉE

Le livreur précédemment assigné
a annulé cette livraison.

La commande est maintenant
à nouveau disponible.

━━━━━━━━━━━━━━━━━━

📋 COMMANDE

${orderRef}

👤 CLIENT

${order.customerName || "Non renseigné"}

📞 TÉLÉPHONE

${order.phone || "Non renseigné"}

📍 ADRESSE

${order.address || "Non renseignée"}

🏙️ VILLE

${order.city || "Non renseignée"}

📌 QUARTIER

${order.district || "Non renseigné"}

━━━━━━━━━━━━━━━━━━

📦 PRODUITS

${products || "Aucun produit"}

━━━━━━━━━━━━━━━━━━

💰 TOTAL

${Number(
  order.total || 0
).toLocaleString("fr-FR")} FCFA

━━━━━━━━━━━━━━━━━━

⚡ ACTION REQUISE

🥇 Le premier livreur qui accepte
la commande sera automatiquement
assigné.

🔒 Dès qu'un livreur l'accepte,
elle devient indisponible
pour les autres.

━━━━━━━━━━━━━━━━━━

📲 CENTRE LIVREUR

https://konanshopping.com/driver

🚚 Soyez le premier à accepter !

🏪 KONAN SHOPPING CAMEROUN

`;


    // ==========================================
    // 📲 ENVOYER AUX LIVREURS
    // ==========================================

    for (
      const driver of drivers
    ) {

      try {

        // ======================================
        // 🚫 NE PAS RENOTIFIER LE LIVREUR
        // QUI VIENT D'ANNULER
        // ======================================

        if (
          cancelledDriverId &&
          String(driver._id) ===
          String(cancelledDriverId)
        ) {

          console.log(
            `ℹ️ ${driver.name} exclu de la notification d'annulation.`
          );

          continue;

        }


        // ======================================
        // 📲 ENVOI TELEGRAM
        // ======================================

        const sent =
          await sendDriverTelegramMessage(

            driver.telegramChatId,

            message

          );


        if (sent) {

          console.log(
            `✅ Commande ${orderRef} `
            + `renotifiée à ${driver.name}`
          );

        } else {

          console.log(
            `⚠️ Notification non envoyée à ${driver.name}`
          );

        }

      } catch (err) {

        console.error(

          `❌ Telegram ${driver.name}:`,

          err.response?.data ||
          err.message

        );

      }

    }

  } catch (err) {

    console.error(
      "❌ ERREUR NOTIFICATION COMMANDE LIBÉRÉE :",
      err
    );

  }

}

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const User = require("./models/User");

const Chat = require("./models/Chat");


const app = express();

const server = http.createServer(app);

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin non autorisée"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
  // Limite la taille maximale d'un paquet Socket.IO pour réduire les abus.
  maxHttpBufferSize: 64 * 1024,
});

// ======================================================
// 🔐 AUTHENTIFICATION SOCKET.IO
// ======================================================

function getSocketToken(socket) {
  const authToken = socket.handshake?.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) {
    return authToken.trim();
  }

  const header = socket.handshake?.headers?.authorization || "";
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    return header.slice(7).trim() || null;
  }

  return null;
}

function verifySocketToken(token) {
  if (!token) {
    throw new Error("Token Socket.IO manquant");
  }

  const secrets = [
    { secret: process.env.JWT_SECRET, role: "user" },
    { secret: process.env.ADMIN_JWT_SECRET, role: "admin" },
    { secret: process.env.DRIVER_JWT_SECRET, role: "driver" },
  ];

  for (const entry of secrets) {
    if (!entry.secret) continue;

    try {
      const payload = jwt.verify(token, entry.secret, {
        algorithms: ["HS256"],
      });

      return {
        ...payload,
        role: payload.role || entry.role,
      };
    } catch (_) {
      // On essaie le secret suivant sans révéler lequel a échoué.
    }
  }

  throw new Error("Token Socket.IO invalide ou expiré");
}

io.use((socket, next) => {
  try {
    const token = getSocketToken(socket);
    const user = verifySocketToken(token);

    if (!user.id && !user.sub) {
      return next(new Error("Identité utilisateur absente du token"));
    }

    socket.authUser = user;
    socket.authUserId = String(user.id || user.sub);

    next();
  } catch (error) {
    next(new Error("Authentification Socket.IO requise"));
  }
});

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(cookieParser());
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(rateLimit({ name: "global", windowMs: 15 * 60 * 1000, max: 600 }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ======================================================
// 🔐 SECURITY GATE — protège les routes sensibles sans
// modifier leur logique métier interne.
// ======================================================
function securityGate(req, res, next) {
  const pathName = req.path;
  const method = req.method;

  // Routes publiques nécessaires au fonctionnement de la boutique.
  const publicExact = new Set([
    "/",
    "/admin-login",
    "/register",
    "/login",
    "/forgot-password",
    "/apply-coupon",
    "/products",
    "/ai-chat",
    "/ai/search",
    "/track-visitor",
  ]);

  // Création de commande : le checkout invité reste public.
  // Si un token utilisateur est fourni, son identité sera vérifiée et
  // utilisée par la route /orders au lieu du userId envoyé par le client.
  if (method === "POST" && pathName === "/orders") {
    const authorization = String(req.headers.authorization || "");

    if (!authorization) return next();

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentification invalide." });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({ message: "Authentification invalide." });
    }

    try {
      req.user = jwt.verify(
        token,
        process.env.JWT_SECRET,
        {
          algorithms: ["HS256"],
          issuer: process.env.JWT_ISSUER || "konanshopping",
          audience: process.env.JWT_AUDIENCE || "konanshopping-web",
        }
      );

      return next();
    } catch (_) {
      return res.status(401).json({ message: "Authentification invalide." });
    }
  }

  if (method === "POST" && publicExact.has(pathName)) return next();
  if (method === "GET" && publicExact.has(pathName)) return next();
  if (pathName.startsWith("/reset-password/")) return next();
  if (pathName.startsWith("/product/") && method === "GET") return next();
  if (pathName.startsWith("/feed") || pathName.startsWith("/sitemap")) return next();
  if (pathName === "/uploads" || pathName.startsWith("/uploads/")) return next();

  // Webhooks externes: ils doivent être protégés par leur propre signature/secret.
  if (
    pathName === "/telegram/webhook" ||
    pathName === "/api/payment/notify" ||
    pathName === "/api/tiktok/callback"
  ) return next();

  // Routeurs montés séparément : on verrouille explicitement les opérations sensibles.
  if (pathName === "/api/payment/create" || pathName === "/api/payment/notify") {
    return next();
  }

  if (pathName === "/api/tiktok/callback") return next();
  if (pathName === "/api/tiktok/connect" || pathName.startsWith("/api/tiktok/")) {
    return requireAdmin(req, res, next);
  }

  if (pathName === "/api/orders" || pathName.startsWith("/api/orders/")) {
    return requireAdmin(req, res, next);
  }

  if (pathName === "/messages" && method === "GET") {
    if (req.query?.userId) return requireSelfOrAdmin("userId")(req, res, next);
    return requireAdmin(req, res, next);
  }

  if (pathName.startsWith("/messages")) {
    return requireAdmin(req, res, next);
  }

  if (pathName.startsWith("/products/") || pathName === "/products") {
    if (method === "GET") return next();
    return requireAdmin(req, res, next);
  }

  if (pathName.startsWith("/api/social")) {
    if (method === "GET") return next();
    return requireAdmin(req, res, next);
  }

  if (pathName === "/chat") {
    return requireUserOrAdmin(req, res, next);
  }

  if (pathName === "/upload") {
    return requireAdmin(req, res, next);
  }

  // Administration.
  const adminPrefixes = [
    "/admin",
    "/add-product",
    "/update-product/",
    "/delete-product/",
    "/order-delivered/",
    "/orders/status/",
    "/coupons/create-default",
    "/coupons",
    "/users",
    "/api/users",
    "/visitors",
    "/api/visitors",
    "/api/fix-images",
    "/fix-images",
    "/drivers",
    "/api/social/upload-video",
  ];
  if (adminPrefixes.some((prefix) => pathName === prefix || pathName.startsWith(prefix))) {
    return requireAdmin(req, res, next);
  }

  // Gestion d'une commande par l'administration.
  if ((pathName === "/orders" && method === "GET") ||
      (pathName.startsWith("/orders/") && method !== "POST")) {
    return requireAdmin(req, res, next);
  }

  // Ressources utilisateur personnelles.
  if (pathName.startsWith("/profile/")) {
    return requireSelfOrAdmin("id")(req, res, next);
  }

  if (pathName.startsWith("/favorites/") ||
      pathName.startsWith("/cart/") ||
      pathName.startsWith("/my-orders/")) {
    return requireSelfOrAdmin("userId")(req, res, next);
  }

  if (pathName.startsWith("/users/") || pathName.startsWith("/api/users/")) {
    return requireSelfOrAdmin("id")(req, res, next);
  }

  // Routes livreur: identité du livreur vérifiée par JWT.
  const driverPrefixes = [
    "/driver-orders",
    "/driver/my-orders/",
    "/driver/",
    "/driver-online/",
  ];
  if (pathName === "/driver-login" || pathName === "/driver-register") return next();

  if (pathName.startsWith("/driver/my-orders/")) {
    return requireDriverSelfOrAdmin("driverId")(req, res, next);
  }

  if (pathName.startsWith("/driver/") || pathName.startsWith("/driver-online/")) {
    return requireDriverSelfOrAdmin("driverId")(req, res, next);
  }

  if (pathName === "/driver-orders") {
    return requireDriverOrAdmin(req, res, next);
  }

  if (pathName.startsWith("/accept-order/") ||
      pathName.startsWith("/order-location/") ||
      pathName.startsWith("/driver-location/") ||
      pathName.startsWith("/driver-deliver/") ||
      pathName.startsWith("/driver-cancel/")) {
    return requireDriverSelfOrAdmin("driverId")(req, res, next);
  }

  if (pathName.startsWith("/delete-order/")) {
    return requireAdmin(req, res, next);
  }

  // Suivi d'une commande: authentification obligatoire.
  if (pathName.startsWith("/order/")) {
    return requireUserOrAdmin(req, res, next);
  }

  // Les avis peuvent être publiés par un visiteur (logique existante).
  // La route recalcule toutefois l'identité client côté serveur lorsqu'un JWT est présent.
  if (method === "POST" && /^\/product\/[^/]+\/review$/.test(pathName)) {
    return next();
  }

  // Toute autre route d'écriture non explicitement publique doit être authentifiée.
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return requireUserOrAdmin(req, res, next);
  }

  return next();
}

app.use(securityGate);

app.use("/api/payment", paymentRoutes);
app.use("/api/community", communityRoutes);

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

// ======================================================
// 🔐 PROTECTION DES UPLOADS IMAGES
// ======================================================

const IMAGE_UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

function imageFileFilter(req, file, cb) {

  const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

  const allowedExtensions = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ]);

  const extension =
    path.extname(String(file.originalname || "")).toLowerCase();

  if (
    !allowedMimeTypes.has(String(file.mimetype || "").toLowerCase()) ||
    !allowedExtensions.has(extension)
  ) {
    return cb(new Error("Type de fichier image non autorisé."));
  }

  return cb(null, true);
}

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
multer({
  storage,
  limits: {
    fileSize: IMAGE_UPLOAD_MAX_SIZE,
  },
  fileFilter: imageFileFilter,
});

// ======================================================
// 🎬 STOCKAGE VIDÉOS — RÉSEAUX SOCIAUX
// ======================================================

const videoStorage =
  new CloudinaryStorage({

    cloudinary,

    params: {

      folder:
        "konanshopping/social/videos",

      resource_type:
        "video",

      allowed_formats: [
        "mp4",
        "mov",
        "webm",
      ],

    },

  });

function videoFileFilter(req, file, cb) {

  const allowedMimeTypes = new Set([
    "video/mp4",
    "video/quicktime",
    "video/webm",
  ]);

  const allowedExtensions = new Set([
    ".mp4",
    ".mov",
    ".webm",
  ]);

  const extension =
    path.extname(String(file.originalname || "")).toLowerCase();

  if (
    !allowedMimeTypes.has(String(file.mimetype || "").toLowerCase()) ||
    !allowedExtensions.has(extension)
  ) {
    return cb(new Error("Type de vidéo non autorisé."));
  }

  return cb(null, true);
}

const uploadSocialVideo =
  multer({

    storage:
      videoStorage,

    limits: {

      // 100 Mo conservés pour ne pas réduire la fonctionnalité vidéo actuelle.
      fileSize:
        100 * 1024 * 1024,

    },

    fileFilter:
      videoFileFilter,

  });

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

  limits: {
    fileSize: IMAGE_UPLOAD_MAX_SIZE,
  },

  fileFilter:
    imageFileFilter,

});

const Tesseract =
  require("tesseract.js");

// ==========================
// ADMIN
// ==========================

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
};

// Secrets et identifiants sensibles doivent uniquement venir du fichier .env.
// Ne jamais les afficher dans les logs.

// ==========================
// HOME
// ==========================

app.get("/", (req, res) => {

  res.send("Serveur KONAN SHOPPING actif 🚀");

});

// ==========================
// LOGIN ADMIN
// ==========================

app.post("/admin-login", rateLimit({ name: "admin-login", windowMs: 15 * 60 * 1000, max: 8 }), async (req, res) => {

  try {
    const { email, password } = req.body || {};

    if (!email || !password || !ADMIN.email || !process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_JWT_SECRET) {
      return res.status(503).json({ message: "Configuration administrateur indisponible." });
    }

    if (String(email).trim().toLowerCase() !== String(ADMIN.email).trim().toLowerCase()) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const valid = await bcrypt.compare(String(password), process.env.ADMIN_PASSWORD_HASH);
    if (!valid) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const token = jwt.sign(
      {
        sub: "admin",
        email: ADMIN.email,
        role: "admin",
      },
      process.env.ADMIN_JWT_SECRET,
      {
        expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "8h",
        issuer: process.env.JWT_ISSUER || "konanshopping",
        audience: process.env.JWT_AUDIENCE || "konanshopping-web",
        algorithm: "HS256",
      }
    );

    return res.json({
      token,
      message: "Connexion réussie 🚀",
      user: {
        _id: "admin",
        name: "Konan Admin",
        email: ADMIN.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error.message);
    return res.status(500).json({ message: "Erreur serveur." });
  }

});

// ======================================================
// 🤖 TELEGRAM — WEBHOOK LIVREURS
// ======================================================

const telegramWebhookLimiter = rateLimit({
  name: "telegram-webhook",
  windowMs: 60 * 1000,
  max: 120,
});

app.post(
  "/telegram/webhook",
  telegramWebhookLimiter,
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

        const tokenHash =
          crypto
            .createHash("sha256")
            .update(token, "utf8")
            .digest("hex");

        const driver =
          await Driver.findOne({

            telegramConnectToken:
              tokenHash,

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
  requireAdmin,
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
          "Erreur serveur.",

      });

    }

  }
);

// ======================================================
// 🔎 VÉRIFIER LE WEBHOOK TELEGRAM
// ======================================================

app.get(
  "/telegram/webhook-info",
  requireAdmin,
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
          "Erreur serveur.",

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
      process.env.ADMIN_JWT_SECRET
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

const passwordResetRequestLimiter = rateLimit({
  name: "forgot-password",
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const passwordResetLimiter = rateLimit({
  name: "reset-password",
  windowMs: 15 * 60 * 1000,
  max: 10,
});

app.post(
  "/forgot-password",
  passwordResetRequestLimiter,
  async (req, res) => {

    const { email } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.json({
        message: "Si cette adresse existe, un email de récupération sera envoyé.",
      });
    }

    const token =
      crypto.randomBytes(32)
      .toString("hex");

    user.resetToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    user.resetTokenExpire =
      Date.now() +
      1000 * 60 * 30;

    await user.save();

    // envoi email ici

const resetUrl =
`${process.env.FRONTEND_URL || "https://konanshopping.com"}/reset-password/${token}`;

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
  passwordResetLimiter,
  async (req, res) => {
    try {

      const { token } =
        req.params;

      const { password } =
        req.body;

      const hashedResetToken =
        crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

      const user =
        await User.findOne({
          resetToken: hashedResetToken,
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
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
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
    const products = await Product.find()
      .select("_id updatedAt")
      .lean();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    products.forEach((product) => {
      const lastmod = product.updatedAt
        ? new Date(product.updatedAt).toISOString()
        : new Date().toISOString();

      sitemap += `
  <url>
    <loc>https://konanshopping.com/product/${product._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res
      .status(200)
      .set("Content-Type", "application/xml; charset=UTF-8")
      .send(sitemap);

  } catch (err) {
    console.error("❌ Erreur product-sitemap.xml :", err);

    res
      .status(500)
      .set("Content-Type", "application/xml; charset=UTF-8")
      .send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`);
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

        message: "Erreur serveur.",

      });

    }

  }
);

// ======================================================
// ✏️ MODIFIER PRODUIT
// ======================================================

app.put(
  "/update-product/:id",
  upload.single("image"),
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          success: false,
          message: "Produit introuvable",
        });

      }

      if (req.body.name !== undefined) {
        product.name =
          req.body.name;
      }

      if (req.body.price !== undefined) {
        product.price =
          Number(req.body.price);
      }

      if (req.body.category !== undefined) {
        product.category =
          req.body.category;
      }

      if (req.body.description !== undefined) {
        product.description =
          req.body.description;
      }

      if (req.file) {

        product.image =
          req.file.secure_url ||
          req.file.path;

      }

      await product.save();

      console.log(
        "✅ Produit modifié :",
        product._id
      );

      res.json({

        success: true,

        message:
          "Produit modifié avec succès",

        product,

      });

    } catch (error) {

      console.error(
        "❌ UPDATE PRODUCT ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Erreur lors de la modification du produit",

        error:
          "Erreur serveur.",

      });

    }

  }
);

// AJOUTER COMMANDE
// 🔐 SÉCURITÉ : limitation dédiée + validation des données reçues.
// La commande invité reste possible : aucune authentification n'est imposée ici.
const orderCreationLimiter = rateLimit({
  name: "create-order",
  windowMs: 10 * 60 * 1000,
  max: 20,
});

app.post("/orders", orderCreationLimiter, async (req, res) => {

  try {

    // ======================================================
    // 🔐 VALIDATION SÉCURISÉE DE LA COMMANDE
    // ======================================================

    const body = req.body && typeof req.body === "object"
      ? req.body
      : {};

    const itemsInput = Array.isArray(body.items)
      ? body.items
      : [];

    if (itemsInput.length < 1 || itemsInput.length > 50) {
      return res.status(400).json({
        error: "Commande invalide.",
        message: "Le panier est vide ou contient trop d'articles.",
      });
    }

    const customerName = String(body.customerName || "").trim().slice(0, 120);
    const phone = String(body.phone || "").trim().slice(0, 40);
    const address = String(body.address || "").trim().slice(0, 300);
    const city = String(body.city || "").trim().slice(0, 100);
    const district = String(body.district || "").trim().slice(0, 120);

    // 🔐 SÉCURITÉ FINANCIÈRE
    // Les valeurs body.shipping et body.total viennent du navigateur.
    // Elles peuvent donc être modifiées par un attaquant et ne sont JAMAIS
    // utilisées comme source de vérité. Les montants seront recalculés
    // ci-dessous exclusivement à partir des produits MongoDB + règles métier.
    const clientShippingValue = Number(body.shipping);
    const clientTotalValue = Number(body.total);

    if (body.shipping !== undefined &&
        (!Number.isFinite(clientShippingValue) || clientShippingValue < 0 || clientShippingValue > 1000000)) {
      return res.status(400).json({
        error: "Commande invalide.",
        message: "Frais de livraison invalides.",
      });
    }

    if (body.total !== undefined &&
        (!Number.isFinite(clientTotalValue) || clientTotalValue < 0 || clientTotalValue > 1000000000)) {
      return res.status(400).json({
        error: "Commande invalide.",
        message: "Montant de commande invalide.",
      });
    }

    // 🔐 IDENTITÉ UTILISATEUR
    // Le userId envoyé par le navigateur n'est jamais considéré comme une
    // preuve d'identité. Pour une commande connectée, seul le JWT fait foi.
    // Sans JWT, la commande reste une commande invitée et userId est ignoré.
    let safeUserId = null;

    if (req.user?.sub || req.user?.id) {
      safeUserId = String(req.user.sub || req.user.id);
    }

    if (safeUserId && !mongoose.Types.ObjectId.isValid(String(safeUserId))) {
      return res.status(400).json({
        error: "Commande invalide.",
        message: "Identifiant utilisateur invalide.",
      });
    }

    if (safeUserId) {
      const existingUser = await User.findById(safeUserId).select("_id").lean();

      if (!existingUser) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Utilisateur introuvable.",
        });
      }
    }

    // 🔐 On recharge les produits depuis MongoDB afin qu'un client ne puisse
    // pas modifier le prix, le nom ou l'image d'un produit dans sa requête.
    const normalizedItems = [];

    for (const item of itemsInput) {
      const productId = String(item?._id || item?.productId || "").trim();
      const quantity = Number(item?.quantity);

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Un produit du panier est invalide.",
        });
      }

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Quantité de produit invalide.",
        });
      }

      const product = await Product.findById(productId)
        .select("name price image")
        .lean();

      if (!product) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Un produit du panier n'existe plus.",
        });
      }

      const serverPrice = Number(product.price);

      if (!Number.isFinite(serverPrice) || serverPrice < 0) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Prix produit invalide.",
        });
      }

      normalizedItems.push({
        productId: product._id,
        name: String(product.name || "Produit").slice(0, 200),
        image: String(product.image || "").slice(0, 2000),
        price: serverPrice,
        quantity,
      });
    }

    // ======================================================
    // 🔐 RECALCUL SERVEUR DES MONTANTS
    // ======================================================

    // Sous-total basé uniquement sur les prix relus depuis MongoDB.
    const subtotalValue = normalizedItems.reduce(
      (sum, item) =>
        sum + (Number(item.price) * Number(item.quantity)),
      0
    );

    if (!Number.isFinite(subtotalValue) || subtotalValue < 0 || subtotalValue > 1000000000) {
      return res.status(400).json({
        error: "Commande invalide.",
        message: "Sous-total invalide.",
      });
    }

    // Même règle métier que Checkout.jsx : la livraison dépend du sous-total.
    const calculatedShipping =
      subtotalValue >= 50000 ? 0 :
      city === "" ? 0 :
      city === "Douala" ? 2000 :
      city === "Yaoundé" ? 1500 :
      city === "Bafoussam" ? 2500 :
      3000;

    // 🔐 Le coupon est recalculé côté serveur au moment de la commande.
    // Ainsi, un attaquant ne peut pas modifier le montant envoyé par le frontend
    // pour obtenir une réduction artificielle.
    let calculatedDiscount = 0;
    const normalizedCouponCode = String(body.couponCode || "").trim().toUpperCase().slice(0, 50);

    if (normalizedCouponCode) {

      // Un coupon est lié à un compte dans la logique actuelle.
      if (!safeUserId) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Un compte est requis pour utiliser ce coupon.",
        });
      }

      const coupon = await Coupon.findOne({
        code: normalizedCouponCode,
      }).lean();

      if (!coupon) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Coupon invalide.",
        });
      }

      if (!coupon.active) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Coupon désactivé.",
        });
      }

      const couponUser = await User.findById(safeUserId)
        .select("usedCoupons registerDate orders")
        .lean();

      if (!couponUser) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Utilisateur introuvable.",
        });
      }

      const usedCoupons = Array.isArray(couponUser.usedCoupons)
        ? couponUser.usedCoupons
        : [];

      if (usedCoupons.includes(coupon.code)) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Vous avez déjà utilisé ce coupon.",
        });
      }

      const registerDate = new Date(couponUser.registerDate);
      if (Number.isNaN(registerDate.getTime())) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Date d'inscription invalide.",
        });
      }

      const expireDate = new Date(registerDate);
      switch (coupon.code) {
        case "LIVRAISON":
          expireDate.setDate(expireDate.getDate() + 1);
          break;
        case "KONAN10":
        case "WELCOME20":
          expireDate.setDate(expireDate.getDate() + 7);
          break;
        case "VIP50":
          expireDate.setDate(expireDate.getDate() + 30);
          break;
      }

      if (new Date() > expireDate) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Coupon expiré.",
        });
      }

      const usedCount = Number(coupon.usedCount || 0);
      const maxUses = Number(coupon.maxUses || 0);
      if (!Number.isFinite(usedCount) || usedCount < 0 ||
          !Number.isFinite(maxUses) || maxUses < 0 ||
          usedCount >= maxUses) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Coupon épuisé.",
        });
      }

      const minPurchase = Number(coupon.minPurchase || 0);
      if (!Number.isFinite(minPurchase) || minPurchase < 0 || subtotalValue < minPurchase) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: Number.isFinite(minPurchase) && minPurchase >= 0
            ? `Minimum ${minPurchase} FCFA requis`
            : "Configuration du coupon invalide",
        });
      }

      const userOrders = Array.isArray(couponUser.orders)
        ? couponUser.orders
        : [];

      if (coupon.code === "WELCOME20" && userOrders.length > 0) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Coupon réservé à la première commande.",
        });
      }

      const discountValue = Number(coupon.discountValue);
      if (!Number.isFinite(discountValue) || discountValue < 0) {
        return res.status(400).json({
          error: "Commande invalide.",
          message: "Configuration du coupon invalide.",
        });
      }

      if (coupon.discountType === "percent") {
        if (discountValue > 100) {
          return res.status(400).json({
            error: "Commande invalide.",
            message: "Configuration du coupon invalide.",
          });
        }
        calculatedDiscount = subtotalValue * (discountValue / 100);
      } else {
        calculatedDiscount = discountValue;
      }

      calculatedDiscount = Math.min(
        Math.max(calculatedDiscount, 0),
        subtotalValue
      );
    }

    // Même formule que le checkout actuel : sous-total + livraison - réduction.
    const calculatedTotal = Math.max(
      subtotalValue + calculatedShipping - calculatedDiscount,
      0
    );

    if (!Number.isFinite(calculatedTotal) || calculatedTotal > 1000000000) {
      return res.status(400).json({
        error: "Commande invalide.",
        message: "Montant final invalide.",
      });
    }

    // ======================================================
    // 📦 CRÉER LA COMMANDE
    // ======================================================

const order = new Order({

  // ====================================================
  // 👤 CLIENT
  // ====================================================

  customerName,

  userId:
    safeUserId,

  phone,

  address,

  city,

  district,


  // ====================================================
  // 🚚 LIVRAISON
  // ====================================================

  shipping:
    calculatedShipping,


  // ====================================================
  // 📦 PRODUITS
  // ====================================================

  items:
    normalizedItems,


  // ====================================================
  // 💰 TOTAL
  // ====================================================

  total:
    calculatedTotal,


  // ====================================================
  // 💳 PAIEMENT
  // ====================================================

  paymentMethod:
    String(
      body.paymentMethod ||
      "Paiement à la livraison"
    ).slice(0, 80),


  // ====================================================
  // 📍 POSITION DU CLIENT
  // ====================================================

  location: {

    lat:
      Number.isFinite(
        Number(body.lat)
      )
        ? Number(body.lat)
        : null,

    lng:
      Number.isFinite(
        Number(body.lng)
      )
        ? Number(body.lng)
        : null,

  },


  // ====================================================
  // 🚚 LIVREUR
  // ====================================================
  //
  // IMPORTANT :
  // AUCUN LIVREUR N'EST ASSIGNÉ À LA CRÉATION.
  //
  // ====================================================

  assignedDriver: {

    id: null,

    name: "",

    phone: "",

    photo: "",

    vehicle: "",

    plate: "",

  },


  // ====================================================
  // 📍 GPS LIVREUR
  // ====================================================

  driverLocation: {

    lat: null,

    lng: null,

    updatedAt: null,

  },


  // ====================================================
  // 🔐 QR UNIQUE DE LA COMMANDE
  // ====================================================

  deliveryQrToken:
    crypto
      .randomBytes(32)
      .toString("hex"),


  // ====================================================
  // 📷 QR PAS ENCORE UTILISÉ
  // ====================================================

  deliveryQrUsedAt:
    null,


  // ====================================================
  // 🕐 PAS ENCORE ACCEPTÉE
  // ====================================================

  acceptedAt:
    null,


  // ====================================================
  // 📦 STATUT
  // ====================================================

  status:
    "En attente",

});


// ======================================================
// 💾 ENREGISTRER
// ======================================================

await order.save();


// ======================================================
// 🧪 DEBUG
// ======================================================

console.log(
  "=========================================="
);

console.log(
  "🛒 NOUVELLE COMMANDE"
);

console.log(
  "📦 ID :",
  order._id
);

console.log(
  "📊 STATUS :",
  order.status
);

console.log(
  "🚚 LIVREUR :",
  order.assignedDriver
);

console.log(
  "🔐 QR :",
  order.deliveryQrToken
    ? "GÉNÉRÉ ✅"
    : "ABSENT ❌"
);

console.log(
  "📍 CLIENT :",
  order.location
);

console.log(
  "=========================================="
);

  // ===============================
// 🚚 NOTIFICATION TELEGRAM LIVREURS
// ===============================

notifyDriversNewOrder(order)
  .catch((err) => {

    console.error(
      "❌ ERREUR NOTIFICATION LIVREURS :",
      err
    );

  });

// ===============================
// AJOUTER LA COMMANDE AU CLIENT
// ===============================

if (safeUserId) {

  const update = {

    $push: {

      orders: order._id,

    },

  };

  // ===============================
  // SI UN COUPON A ÉTÉ UTILISÉ
  // ===============================

  if (normalizedCouponCode) {

    update.$addToSet = {

      usedCoupons:
        normalizedCouponCode,

    };

    // Incrémenter le nombre
    // d'utilisations du coupon

    await Coupon.findOneAndUpdate(

      {

        code:
          normalizedCouponCode,

      },

      {

        $inc: {

          usedCount: 1,

        },

      }

    );

  }

  await User.findByIdAndUpdate(

    safeUserId,

    update

  );

}

const orderRef = `KS-${Date.now()}`;

await sendTelegramMessage(`

🛒 NOUVELLE COMMANDE

━━━━━━━━━━━━━━━━━━

📋 Commande : ${orderRef}

👤 Client : ${customerName}

📞 ${phone}

📍 ${address}

🏙️ ${city}

📌 ${district}

━━━━━━━━━━━━━━━━━━

📦 PRODUITS

${(normalizedItems)
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
${body.paymentMethod || "À la livraison"}

🚚 Livraison :
${Number(
  calculatedShipping
).toLocaleString()} FCFA

💰 TOTAL :
${Number(
  calculatedTotal
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

${customerName}

📞 Téléphone

${phone}

📍 Adresse

${address}

🏙️ Ville

${city}

📌 Quartier

${district}

💳 Paiement

${body.paymentMethod || "Paiement à la livraison"}

━━━━━━━━━━━━━━━━━━━━

📦 PRODUITS COMMANDÉS

${(normalizedItems)
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
${(normalizedItems).reduce(
  (total, item) =>
    total + item.quantity,
  0
)}

🚚 Livraison :
${Number(
  calculatedShipping
).toLocaleString()} FCFA

💰 TOTAL :
${Number(
  calculatedTotal
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
        `${process.env.ULTRAMSG_BASE_URL || "https://api.ultramsg.com/instance174320"}/messages/chat`,
        {
          token:
            process.env.ULTRAMSG_TOKEN,

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
      `${process.env.ULTRAMSG_BASE_URL || "https://api.ultramsg.com/instance174320"}/messages/image`,
      {
        token:
          process.env.ULTRAMSG_TOKEN,

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
  `${process.env.ULTRAMSG_BASE_URL || "https://api.ultramsg.com/instance174320"}/messages/chat`,
  {
    token: process.env.ULTRAMSG_TOKEN,
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

const registerRateLimiter = rateLimit({
  name: "register",
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post(
  "/register",
  registerRateLimiter,

  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      // NORMALISER L'EMAIL
      const normalizedEmail = String(email || "")
        .trim()
        .toLowerCase();

      // EMAIL EXISTE
      const existingUser = await User.findOne({
        email: normalizedEmail,
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

          email: normalizedEmail,

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

  process.env.JWT_SECRET,

  {

    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    issuer: process.env.JWT_ISSUER || "konanshopping",
    audience: process.env.JWT_AUDIENCE || "konanshopping-web",
    algorithm: "HS256",

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

const loginRateLimiter = rateLimit({
  name: "login",
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post(
  "/login",
  loginRateLimiter,

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

    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      issuer: process.env.JWT_ISSUER || "konanshopping",
      audience: process.env.JWT_AUDIENCE || "konanshopping-web",
      algorithm: "HS256",
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

const aiChatRateLimiter = rateLimit({
  name: "ai-chat",
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/ai-chat", aiChatRateLimiter, async (req, res) => {

  try {

   const {
  message,
  history = []
} = req.body;

    if (typeof message !== "string" || message.length === 0 || message.length > 2000) {
      return res.status(400).json({ error: "Message invalide." });
    }

    if (!Array.isArray(history) || history.length > 40) {
      return res.status(400).json({ error: "Historique invalide." });
    }

    const safeHistory = history.map((item) => {
      if (!item || typeof item !== "object") return {};

      return {
        role: typeof item.role === "string" ? item.role.slice(0, 20) : "",
        text: typeof item.text === "string" ? item.text.slice(0, 2000) : "",
        products: Array.isArray(item.products) ? item.products.slice(0, 12) : [],
      };
    });

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

safeHistory

.filter(
msg => msg.role === "user"
)

.slice(-1)[0]?.text || "";

const previousSearch =

safeHistory

.filter(
msg => msg.role === "user"
)

.slice(-2,-1)[0]?.text || "";

const previousProducts =

safeHistory

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

    // ======================================================
    // 🔐 PROTECTION PROFIL — WHITELIST
    // Le client ne peut modifier que les champs de profil
    // autorisés. Les champs sensibles sont ignorés.
    // ======================================================

    const allowedFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "district",
      "avatar",
    ];

    const profileUpdate = {};

    for (const field of allowedFields) {

      if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {

        const value = req.body[field];

        if (typeof value !== "string") {
          return res.status(400).json({
            error: `Le champ ${field} doit être une chaîne de caractères`,
          });
        }

        if (value.length > 500) {
          return res.status(400).json({
            error: `Le champ ${field} est trop long`,
          });
        }

        profileUpdate[field] = value.trim();
      }
    }

    if (Object.keys(profileUpdate).length === 0) {
      return res.status(400).json({
        error: "Aucune donnée de profil autorisée à modifier",
      });
    }

    // Validation email uniquement lorsqu'il est modifié.
    if (Object.prototype.hasOwnProperty.call(profileUpdate, "email")) {
      const email = profileUpdate.email.toLowerCase();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailOk) {
        return res.status(400).json({
          error: "Adresse email invalide",
        });
      }

      profileUpdate.email = email;
    }

    const updatedUser =
      await User.findByIdAndUpdate(

        req.params.id,

        { $set: profileUpdate },

        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedUser) {
      return res.status(404).json({
        error: "Utilisateur introuvable",
      });
    }

    // 🔒 Ne jamais renvoyer le mot de passe au navigateur.
    const safeUser = updatedUser.toObject
      ? updatedUser.toObject()
      : { ...updatedUser };

    delete safeUser.password;
    delete safeUser.resetToken;
    delete safeUser.resetPasswordToken;

    res.json(safeUser);

  }

  catch (error) {

    // Ne pas exposer les détails internes de Mongo/Mongoose.
    if (error?.name === "ValidationError") {
      return res.status(400).json({
        error: "Données de profil invalides",
      });
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        error: "Cette adresse email est déjà utilisée",
      });
    }

    res.status(500).json({
      error: "Erreur update",
    });

  }

});

app.post("/favorites", async (req, res) => {

  try {

    const requestedUserId =
      typeof req.body?.userId === "string"
        ? req.body.userId.trim()
        : "";

    // Un client connecté ne peut jamais modifier les favoris d'un autre client.
    // L'administrateur conserve la possibilité d'agir sur un userId fourni.
    const userId =
      req.admin?.role === "admin"
        ? requestedUserId
        : String(req.user?.sub || "").trim();

    const { productId } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        error: "Utilisateur non authentifié.",
      });
    }

    if (!productId || !mongoose.isValidObjectId(String(productId))) {
      return res.status(400).json({
        error: "Produit invalide.",
      });
    }

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

    const requestedUserId =
      typeof req.body?.userId === "string"
        ? req.body.userId.trim()
        : "";

    // Un client connecté ne peut jamais enregistrer un panier sous l'identité d'un autre.
    // L'administrateur conserve la logique existante d'intervention sur un userId.
    const userId =
      req.admin?.role === "admin"
        ? requestedUserId
        : String(req.user?.sub || "").trim();

    const { productId, quantity } = req.body;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        error: "Utilisateur non authentifié.",
      });
    }

    if (!productId || !mongoose.isValidObjectId(String(productId))) {
      return res.status(400).json({
        error: "Produit invalide.",
      });
    }

    const safeQuantity = Number(quantity);
    if (!Number.isInteger(safeQuantity) || safeQuantity < 1 || safeQuantity > 100) {
      return res.status(400).json({
        error: "Quantité invalide.",
      });
    }

    const newCart = new Cart({

      userId,
      productId,
      quantity: safeQuantity,

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

const chatRateLimiter = rateLimit({
  name: "chat",
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/chat", chatRateLimiter, async (req, res) => {

  try {

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const safeBody = { ...body };

    // Un client connecté ne peut pas envoyer un message sous l'identité d'un autre.
    if (req.user?.sub) {
      safeBody.userId = String(req.user.sub);
      if (safeBody.clientId) safeBody.clientId = String(req.user.sub);
      if (req.user.email) safeBody.email = String(req.user.email);
    }

    const chat = new Chat(safeBody);

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

    let messages;

    if (req.admin) {
      messages = await Chat.find();
    } else if (req.user?.sub) {
      const userId = String(req.user.sub);
      const email = String(req.user.email || "");
      const filters = [{ userId }, { clientId: userId }];
      if (email) filters.push({ email });
      messages = await Chat.find({ $or: filters });
    } else {
      return res.status(401).json({ error: "Authentification requise." });
    }

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


      // ==================================================
      // 🛒 VÉRIFIER SI L'AUTEUR A ACHETÉ LE PRODUIT
      // ==================================================

      let hasPurchased = null;

      const authenticatedClientId =
        req.user?.sub && mongoose.Types.ObjectId.isValid(String(req.user.sub))
          ? String(req.user.sub)
          : null;

      const requestedClientId =
        typeof req.body.clientId === "string"
          ? req.body.clientId.trim().slice(0, 100)
          : "";

      // JWT prioritaire. Les visiteurs gardent leur identifiant guest pour préserver
      // la possibilité de laisser un avis sans compte.
      const clientId =
        authenticatedClientId ||
        (requestedClientId.startsWith("guest_") ? requestedClientId : `guest_${crypto.randomBytes(12).toString("hex")}`);


      // ==================================================
      // 👤 CLIENT CONNECTÉ
      // ==================================================

      if (

        clientId &&

        !String(clientId).startsWith(
          "guest_"
        ) &&

        mongoose.Types.ObjectId.isValid(
          clientId
        )

      ) {

        hasPurchased =
          await Order.findOne({

            userId:
              clientId,

            "items.productId":
              req.params.id,

          });

      }


      // ==================================================
      // ⭐ CRÉER L'AVIS
      // ==================================================

      const review = {

        clientId:
          clientId,

        name:
          req.body.name,

        rating:
          Number(
            req.body.rating
          ),

        comment:
          req.body.comment,

        verifiedPurchase:
          !!hasPurchased,

        images:
          req.files
            ? req.files.map(
                (file) =>
                  file.path
              )
            : [],

      };


      // ==================================================
      // 💾 AJOUTER L'AVIS AU PRODUIT
      // ==================================================

      product.reviews.push(
        review
      );


      await product.save();


      // ==================================================
      // 📤 RÉPONSE
      // ==================================================

      res.json(
        product
      );


    } catch (err) {

      console.log(
        "❌ ERREUR AJOUT AVIS :",
        err
      );


      res.status(500).json({

        message:
          "Erreur serveur",

        error:
          "Erreur serveur.",

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
// 🔐 VERIFIER COUPON — VERSION SÉCURISÉE
// ==========================

const couponCheckLimiter = rateLimit({
  name: "apply-coupon",
  windowMs: 10 * 60 * 1000,
  max: 20,
});

console.log("Je suis juste avant apply-coupon");

app.post(

  "/apply-coupon",

  couponCheckLimiter,

  // Le système de coupon original exige déjà un compte utilisateur.
  // On conserve donc cette logique, mais l'identité est maintenant
  // vérifiée par le JWT au lieu de faire confiance au userId envoyé.
  requireSelfOrAdmin("userId"),

  async (req, res) => {

    try {

      const body = req.body && typeof req.body === "object"
        ? req.body
        : {};

      const rawCode =
        typeof body.code === "string"
          ? body.code.trim().toUpperCase()
          : "";

      const rawTotal = Number(body.total);
      const userId =
        typeof body.userId === "string"
          ? body.userId.trim()
          : body.userId;

      // =====================
      // VALIDATION ENTRÉE
      // =====================

      if (!rawCode || rawCode.length > 50) {

        return res.status(400).json({

          message:
            "Code coupon invalide",

        });

      }

      if (
        !Number.isFinite(rawTotal) ||
        rawTotal < 0 ||
        rawTotal > 1000000000
      ) {

        return res.status(400).json({

          message:
            "Montant invalide",

        });

      }

      if (!userId || !mongoose.isValidObjectId(userId)) {

        return res.status(400).json({

          message:
            "Utilisateur invalide",

        });

      }

      // =====================
      // RECHERCHE COUPON
      // =====================

      const coupon =
        await Coupon.findOne({

          code: rawCode,

        }).lean();

      if (!coupon) {

        return res.status(404).json({

          message:
            "Coupon invalide",

        });

      }

      // =====================
      // RECHERCHE UTILISATEUR
      // =====================

      const user =
        await User.findById(userId).select(
          "usedCoupons registerDate orders"
        );

      if (!user) {

        return res.status(404).json({

          message:
            "Utilisateur introuvable",

        });

      }

      // =====================
      // COUPON DÉJÀ UTILISÉ
      // =====================

      const usedCoupons =
        Array.isArray(user.usedCoupons)
          ? user.usedCoupons
          : [];

      if (
        usedCoupons.includes(
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

      const registerDate =
        new Date(user.registerDate);

      if (Number.isNaN(registerDate.getTime())) {

        return res.status(400).json({

          message:
            "Date d'inscription invalide",

        });

      }

      let expireDate =
        new Date(registerDate);

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

      const usedCount =
        Number(coupon.usedCount || 0);

      const maxUses =
        Number(coupon.maxUses || 0);

      if (
        !Number.isFinite(usedCount) ||
        usedCount < 0 ||
        !Number.isFinite(maxUses) ||
        maxUses < 0 ||
        usedCount >= maxUses
      ) {

        return res.status(400).json({

          message:
            "Coupon épuisé",

        });

      }

      // =====================
      // ACHAT MINIMUM
      // =====================

      const minPurchase =
        Number(coupon.minPurchase || 0);

      if (
        !Number.isFinite(minPurchase) ||
        minPurchase < 0
      ) {

        return res.status(400).json({

          message:
            "Configuration du coupon invalide",

        });

      }

      if (
        rawTotal <
        minPurchase
      ) {

        return res.status(400).json({

          message:
            `Minimum ${minPurchase} FCFA requis`,

        });

      }

      // =====================
      // PREMIÈRE COMMANDE
      // (WELCOME20)
      // =====================

      const orders =
        Array.isArray(user.orders)
          ? user.orders
          : [];

      if (
        coupon.code ===
          "WELCOME20" &&
        orders.length > 0
      ) {

        return res.status(400).json({

          message:
            "Coupon réservé à la première commande",

        });

      }

      // =====================
      // VALIDATION CONFIGURATION
      // =====================

      const discountValue =
        Number(coupon.discountValue);

      if (
        !Number.isFinite(discountValue) ||
        discountValue < 0
      ) {

        return res.status(400).json({

          message:
            "Configuration du coupon invalide",

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

        if (discountValue > 100) {

          return res.status(400).json({

            message:
              "Configuration du coupon invalide",

          });

        }

        discount =
          rawTotal *
          (
            discountValue /
            100
          );

      }

      else {

        discount =
          discountValue;

      }

      // Un coupon ne peut jamais produire un total négatif.
      discount = Math.min(
        Math.max(discount, 0),
        rawTotal
      );

      const finalTotal =
        Math.max(
          rawTotal - discount,
          0
        );

      // =====================
      // RÉPONSE SÉCURISÉE
      // =====================

      // On ne renvoie pas le document Mongoose complet.
      // Seules les informations nécessaires au checkout sont exposées.
      const safeCoupon = {
        _id: coupon._id,
        code: coupon.code,
        active: Boolean(coupon.active),
        discountType: coupon.discountType,
        discountValue,
        minPurchase,
      };

      return res.json({

        success: true,

        discount,

        finalTotal,

        coupon: safeCoupon,

      });

    }

    catch (err) {

      console.error(
        "❌ APPLY COUPON ERROR:",
        err?.message || "Erreur inconnue"
      );

      return res.status(500).json({

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

app.use(
  "/api/social",
  socialRoutes
);

app.use(
  "/api/tiktok",
  tiktokRoutes
);

const aiSearchRateLimiter = rateLimit({
  name: "ai-search",
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

app.get("/ai/search", aiSearchRateLimiter, async (req, res) => {

  try {

    const rawQuery =
      typeof req.query.q === "string"
        ? req.query.q.trim().slice(0, 100)
        : "";

    if (!rawQuery) {
      return res.json([]);
    }

    const query = escapeRegex(rawQuery);

    const products = await Product.find({
      name: {
        $regex: query,
        $options: "i"
      }
    }).limit(100);

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

// ======================================================
// 📦 TRACK ORDER CLIENT
// 🚚 RÉCUPÉRER LA COMMANDE + LIVREUR + GPS + QR
// ======================================================

app.get(
  "/order/:id",

  async (req, res) => {

    try {

      console.log(
        "======================================"
      );

      console.log(
        "📦 TRACK ORDER"
      );

      console.log(
        "🆔 Commande :",
        req.params.id
      );


      // ==================================================
      // 🔎 RECHERCHER LA COMMANDE
      // ==================================================

      const order =
        await Order.findById(
          req.params.id
        );


      // ==================================================
      // ❌ COMMANDE INTROUVABLE
      // ==================================================

      if (!order) {

        console.log(
          "❌ Commande introuvable"
        );

        return res.status(404).json({

          success: false,

          error:
            "Commande introuvable"

        });

      }


      // ==================================================
      // 🔐 CONTRÔLE D'ACCÈS À LA COMMANDE
      // Admin : accès complet
      // Client : uniquement ses propres commandes
      // Livreur : uniquement les commandes qui lui sont assignées
      // ==================================================

      const requesterId = String(
        req.user?.sub ||
        req.user?.id ||
        ""
      );

      const isAdmin =
        req.admin?.role === "admin" ||
        String(req.admin?.sub || "") === "admin";

      const authenticatedDriverId = String(
        req.driver?.sub ||
        req.driver?.id ||
        ""
      );

      const isDriver =
        req.driver?.role === "driver" ||
        Boolean(authenticatedDriverId);

      if (!isAdmin) {

        if (isDriver) {

          if (
            !authenticatedDriverId ||
            !order.assignedDriver?.id ||
            String(order.assignedDriver.id) !==
              authenticatedDriverId
          ) {
            return res.status(403).json({
              success: false,
              error: "Accès refusé à cette commande"
            });
          }

        } else {

          if (
            !requesterId ||
            !order.userId ||
            String(order.userId) !== requesterId
          ) {
            return res.status(403).json({
              success: false,
              error: "Accès refusé à cette commande"
            });
          }
        }
      }


      // ==================================================
      // 🚚 LIVREUR ASSIGNÉ
      // ==================================================

      let assignedDriver = null;


      if (order.assignedDriver) {

        assignedDriver = {

          id:
            order.assignedDriver.id
              ? String(
                  order.assignedDriver.id
                )
              : "",

          name:
            order.assignedDriver.name ||
            "",

          phone:
            order.assignedDriver.phone ||
            "",

          photo:
            order.assignedDriver.photo ||
            "",

          vehicle:
            order.assignedDriver.vehicle ||
            "",

          plate:
            order.assignedDriver.plate ||
            ""

        };

      }


      // ==================================================
      // 📦 OBJET TRACKING
      // ==================================================

      const trackingOrder = {

        _id:
          order._id,

        userId:
          order.userId,

        customerName:
          order.customerName,

        phone:
          order.phone,

        address:
          order.address,

        city:
          order.city,

        district:
          order.district,

        shipping:
          order.shipping,

        items:
          order.items,

        total:
          order.total,

        status:
          order.status,


        // ==================================================
        // 🚚 LIVREUR
        // ==================================================

        assignedDriver:
          assignedDriver,


        // ==================================================
        // 📍 POSITION DU LIVREUR
        // ==================================================

        driverLocation:
          order.driverLocation || null,


        // ==================================================
        // 🔐 QR CODE
        // ==================================================

        deliveryQrToken:
          order.deliveryQrToken || null,

        deliveryQrUsedAt:
          order.deliveryQrUsedAt || null,


        // ==================================================
        // 🕐 DATES
        // ==================================================

        acceptedAt:
          order.acceptedAt || null,

        deliveredAt:
          order.deliveredAt || null,

        createdAt:
          order.createdAt

      };


      // ==================================================
      // 🧪 LOGS
      // ==================================================

      console.log(
        "📊 STATUS :",
        trackingOrder.status
      );

      console.log(
        "🚚 DRIVER :",
        trackingOrder.assignedDriver
      );

      console.log(
        "📍 GPS :",
        trackingOrder.driverLocation
      );

      console.log(
        "🔐 QR :",
        trackingOrder.deliveryQrToken
          ? "PRÉSENT ✅"
          : "ABSENT ❌"
      );


      // ==================================================
      // 📤 RÉPONSE
      // ==================================================

      return res.json({

        success: true,

        order:
          trackingOrder

      });


    } catch (error) {

      console.error(
        "❌ TRACK ORDER ERROR :",
        error
      );

      return res.status(500).json({

        success: false,

        error:
          "Erreur serveur"

      });

    }

  }
);

// ======================================================
// 🔐 SÉCURITÉ ACTIONS LIVREUR
// ======================================================

const driverActionLimiter = rateLimit({
  name: "driver-action",
  windowMs: 10 * 60 * 1000,
  max: 60,
});

const driverLocationLimiter = rateLimit({
  name: "driver-location",
  windowMs: 10 * 60 * 1000,
  max: 600,
});

// =========================
// DRIVER LOCATION
// =========================

app.put(
  "/driver-location/:id",
  driverLocationLimiter,
  async (req, res) => {

    try {

      const {
        driverId,
        lat,
        lng,
      } = req.body;

      const authenticatedDriverId =
        getAuthenticatedDriverId(req);

      if (!driverId || !authenticatedDriverId || String(driverId) !== authenticatedDriverId) {
        return res.status(403).json({
          success: false,
          message: "Accès livreur refusé.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de commande invalide.",
        });
      }

      const coordinates =
        validateDriverCoordinates(lat, lng);

      if (!coordinates) {
        return res.status(400).json({
          success: false,
          message: "Coordonnées GPS invalides.",
        });
      }

      const order =
        await Order.findOneAndUpdate(
          {
            _id: req.params.id,
            "assignedDriver.id": authenticatedDriverId,
            status: "En livraison",
          },
          {
            $set: {
              driverLocation: {
                lat: coordinates.latitude,
                lng: coordinates.longitude,
                updatedAt: new Date(),
              },
            },
          },
          {
            new: true,
          }
        );

      if (!order) {
        return res.status(403).json({
          success: false,
          message: "Vous n'êtes pas le livreur assigné à cette commande.",
        });
      }

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

app.post("/driver-login", rateLimit({ name: "driver-login", windowMs: 15 * 60 * 1000, max: 10 }), async (req, res) => {

  try {
    const driver = await Driver.findOne({ email: req.body.email });

    if (!driver) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    let validPassword = false;
    const storedPassword = String(driver.password || "");

    if (/^\$2[aby]\$/.test(storedPassword)) {
      validPassword = await bcrypt.compare(String(req.body.password || ""), storedPassword);
    } else {
      // Migration transparente des anciens mots de passe en clair.
      validPassword = storedPassword === String(req.body.password || "");
      if (validPassword) {
        driver.password = await bcrypt.hash(String(req.body.password), 12);
        await driver.save();
      }
    }

    if (!validPassword) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    if (!process.env.DRIVER_JWT_SECRET) {
      return res.status(503).json({ message: "Authentification livreur indisponible." });
    }

    const token = jwt.sign(
      {
        sub: String(driver._id),
        id: String(driver._id),
        role: "driver",
        email: driver.email,
      },
      process.env.DRIVER_JWT_SECRET,
      {
        expiresIn: process.env.DRIVER_JWT_EXPIRES_IN || "12h",
        issuer: process.env.JWT_ISSUER || "konanshopping",
        audience: process.env.JWT_AUDIENCE || "konanshopping-web",
        algorithm: "HS256",
      }
    );

    const safeDriver = driver.toObject();
    delete safeDriver.password;
    delete safeDriver.telegramToken;

    return res.json({
      ...safeDriver,
      token,
    });

  } catch (error) {
    console.error("DRIVER LOGIN ERROR:", error.message);
    return res.status(500).json({ message: "Erreur serveur." });
  }

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

      console.log(
        "📲 TELEGRAM CONNECT"
      );

      console.log(
        "👤 Driver ID :",
        req.params.id
      );

      // ==================================================
      // 🔐 VÉRIFICATION CONFIGURATION TELEGRAM
      // ==================================================

      const botUsername =
        String(
          process.env.TELEGRAM_BOT_USERNAME || ""
        ).trim();

      console.log(
        "🤖 TELEGRAM_BOT_USERNAME :",
        botUsername
          ? "✅ DISPONIBLE"
          : "❌ MANQUANT"
      );

      if (!botUsername) {

        return res.status(500).json({

          success: false,

          message:
            "TELEGRAM_BOT_USERNAME manque dans le fichier .env"

        });

      }

      // ==================================================
      // 👤 RECHERCHER LE LIVREUR
      // ==================================================

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

      // ==================================================
      // 🔐 GÉNÉRER UN TOKEN UNIQUE
      // ==================================================

      const token =
        crypto
          .randomBytes(24)
          .toString("hex");

      // ==================================================
      // 🔐 HACHER LE TOKEN AVANT STOCKAGE
      // ==================================================

      const tokenHash =
        crypto
          .createHash("sha256")
          .update(token, "utf8")
          .digest("hex");

      // ==================================================
      // 💾 ENREGISTRER LE TOKEN HACHÉ
      // ==================================================

      driver.telegramConnectToken =
        tokenHash;

      driver.telegramConnectExpires =
        new Date(
          Date.now() +
          10 * 60 * 1000
        );

      await driver.save();

      // ==================================================
      // 🤖 NETTOYER LE NOM DU BOT
      // ==================================================

      const cleanBotUsername =
        botUsername
          .replace(/^@/, "")
          .trim();

      // ==================================================
      // 🔗 LIEN TELEGRAM
      // ==================================================

      const telegramUrl =
        `https://t.me/${cleanBotUsername}?start=driver_${token}`;

      console.log(
        `✅ Lien Telegram généré pour ${driver.name}`
      );

      // ==================================================
      // 📤 RÉPONSE
      // ==================================================

      return res.json({

        success: true,

        telegramUrl,

        expiresIn: 600

      });

    } catch (err) {

      console.error(
        "❌ TELEGRAM CONNECT ERROR:",
        err.response?.data ||
        err.message ||
        err
      );

      return res.status(500).json({

        success: false,

        message:
          "Erreur serveur lors de la connexion Telegram"

      });

    }

  }
);


function validateDriverCoordinates(lat, lng) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

function getAuthenticatedDriverId(req) {
  return String(
    req.driver?.sub ||
    req.driver?.id ||
    ""
  );
}

// ======================================================
// 🚚 ACCEPTER UNE COMMANDE
// 🔒 PREMIER LIVREUR QUI CLIQUE = LIVREUR ASSIGNÉ
// ======================================================

app.put(
  "/accept-order/:id",
  driverActionLimiter,
  async (req, res) => {

    try {

      const {
        driverId
      } = req.body;


      // ==================================================
      // 🔐 VALIDATION
      // ==================================================

      const authenticatedDriverId =
        getAuthenticatedDriverId(req);

      if (!driverId || !authenticatedDriverId || String(driverId) !== authenticatedDriverId) {

        return res.status(403).json({

          success: false,

          message:
            "Accès livreur refusé."

        });

      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de commande invalide."
        });
      }

      // ==================================================
      // 👨‍🚚 RÉCUPÉRER LE VRAI LIVREUR
      // ==================================================

      const driver =
        await Driver.findById(
          driverId
        );


      if (!driver) {

        return res.status(404).json({

          success: false,

          message:
            "Livreur introuvable"

        });

      }


      // ==================================================
      // 🧪 DEBUG LIVREUR
      // ==================================================

      console.log(
        "=========================================="
      );

      console.log(
        "🚚 LIVREUR QUI ESSAIE D'ACCEPTER"
      );

      console.log(
        "🆔 ID :",
        driver._id
      );

      console.log(
        "👤 NOM :",
        driver.name
      );

      console.log(
        "📞 TÉLÉPHONE :",
        driver.phone
      );

      console.log(
        "📷 PHOTO :",
        driver.photo
      );

      console.log(
        "🏍️ VÉHICULE :",
        driver.vehicle
      );

      console.log(
        "🔢 PLAQUE :",
        driver.plate
      );

      console.log(
        "=========================================="
      );


      // ==================================================
      // 🚚 OBJET LIVREUR
      // ==================================================

      const assignedDriver = {

        id:
          driver._id,

        name:
          driver.name || "",

        phone:
          driver.phone || "",

        photo:
          driver.photo || "",

        vehicle:
          driver.vehicle || "",

        plate:
          driver.plate || ""

      };


      // ==================================================
      // 🔒 ACCEPTATION ATOMIQUE
      // ==================================================
      //
      // IMPORTANT :
      // Le premier livreur qui exécute cette requête
      // gagne.
      //
      // Si un autre livreur a déjà pris la commande,
      // cette requête retourne null.
      //
      // ==================================================

      const order =
        await Order.findOneAndUpdate(

          {

            _id:
              req.params.id,

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
              },

              {
                "assignedDriver.id":
                  null
              }

            ]

          },

          {

            $set: {

              // ========================================
              // 📦 STATUT
              // ========================================

              status:
                "En livraison",


              // ========================================
              // 🚚 LIVREUR
              // ========================================

              assignedDriver:
                assignedDriver,


              // ========================================
              // 🕐 ACCEPTATION
              // ========================================

              acceptedAt:
                new Date()

            }

          },

          {
            new: true
          }

        );


      // ==================================================
      // ❌ COMMANDE DÉJÀ PRISE
      // ==================================================

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


        console.log(
          `⚠️ Commande ${req.params.id} déjà prise`
        );


        return res.status(409).json({

          success: false,

          message:
            "Cette commande a déjà été prise par un autre livreur.",

          alreadyAssigned:
            true,

          assignedDriver:
            existingOrder.assignedDriver ||
            null

        });

      }


      // ==================================================
      // 🧪 CONFIRMATION
      // ==================================================

      console.log(
        "=========================================="
      );

      console.log(
        "✅ COMMANDE ACCEPTÉE"
      );

      console.log(
        "📦 COMMANDE :",
        order._id
      );

      console.log(
        "📊 STATUS :",
        order.status
      );

      console.log(
        "🚚 ASSIGNED DRIVER :",
        order.assignedDriver
      );

      console.log(
        "=========================================="
      );


      // ==================================================
      // 📤 RÉPONSE
      // ==================================================

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
          "Erreur serveur lors de l'acceptation",

        error:
          "Erreur serveur."

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

          // ============================================
          // 📦 COMMANDES QUI PEUVENT ÊTRE ACCEPTÉES
          // ============================================

          status: {
            $in: [
              "En attente",
              "Confirmée",
              "Préparation"
            ]
          },

          // ============================================
          // 🚚 AUCUN LIVREUR RÉELLEMENT ASSIGNÉ
          // ============================================

          $or: [

            // Anciennes commandes
            {
              assignedDriver: {
                $exists: false
              }
            },

            // assignedDriver = null
            {
              assignedDriver: null
            },

            // Nouveau système :
            // assignedDriver existe mais
            // aucun ID de livreur
            {
              "assignedDriver.id": null
            }

          ]

        })

        .sort({
          createdAt: -1
        });


      // ============================================
      // 🧪 DEBUG
      // ============================================

      console.log(
        "=========================================="
      );

      console.log(
        "📦 COMMANDES DISPONIBLES :",
        orders.length
      );

      orders.forEach(
        (order) => {

          console.log(
            "🛒",
            order._id.toString(),
            "| STATUS:",
            order.status,
            "| DRIVER:",
            order.assignedDriver?.id
              ? order.assignedDriver.id.toString()
              : "AUCUN"
          );

        }
      );

      console.log(
        "=========================================="
      );


      // ============================================
      // 📤 RÉPONSE
      // ============================================

      return res.json({

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

      return res.status(500).json({

        success: false,

        message:
          "Erreur récupération commandes",

        error:
          "Erreur serveur."

      });

    }

  }
);

// ======================================================
// 🚚 COMMANDES DU LIVREUR CONNECTÉ
// ======================================================
// Retourne uniquement les commandes appartenant
// à ce livreur.
//
// Statuts récupérés :
// 🟠 En livraison
// 🟢 Livrée
// ======================================================

app.get(
  "/driver/my-orders/:driverId",

  async (req, res) => {

    try {

      const {
        driverId
      } = req.params;


      // ==================================================
      // 🔐 VALIDATION
      // ==================================================

      if (!driverId) {

        return res.status(400).json({

          success: false,

          message:
            "ID du livreur manquant"

        });

      }


      // ==================================================
      // 👨‍🚚 VÉRIFIER QUE LE LIVREUR EXISTE
      // ==================================================

      const driver =
        await Driver.findById(
          driverId
        );


      if (!driver) {

        return res.status(404).json({

          success: false,

          message:
            "Livreur introuvable"

        });

      }


      // ==================================================
      // 📦 RÉCUPÉRER SES COMMANDES
      // ==================================================

      const orders =
        await Order.find({

          // ==============================================
          // 🚚 LIVREUR ASSIGNÉ
          // ==============================================

          "assignedDriver.id":
            driver._id,


          // ==============================================
          // 📦 COMMANDES DU LIVREUR
          // ==============================================

          status: {

            $in: [

              "En livraison",

              "Livrée"

            ]

          }

        })

        .sort({

          createdAt: -1

        });


      // ==================================================
      // 🧪 DEBUG
      // ==================================================

      console.log(
        "=========================================="
      );

      console.log(
        "🚚 COMMANDES DU LIVREUR"
      );

      console.log(
        "👤 LIVREUR :",
        driver.name
      );

      console.log(
        "🆔 ID :",
        driver._id
      );

      console.log(
        "📦 COMMANDES :",
        orders.length
      );

      console.log(
        "=========================================="
      );


      // ==================================================
      // 📊 COMPTEURS
      // ==================================================

      const enLivraison =
        orders.filter(
          (order) =>
            order.status ===
            "En livraison"
        ).length;


      const livrees =
        orders.filter(
          (order) =>
            order.status ===
            "Livrée"
        ).length;


      // ==================================================
      // 📤 RÉPONSE
      // ==================================================

      return res.json({

        success: true,

        count:
          orders.length,

        statistics: {

          enLivraison,

          livrees,

          total:
            orders.length

        },

        orders

      });


    } catch (err) {

      console.error(
        "❌ DRIVER MY ORDERS ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Erreur récupération commandes du livreur",

        error:
          "Erreur serveur."

      });

    }

  }
);

// ======================================================
// 🚚 LIVREURS + STATISTIQUES
// ======================================================

app.get("/drivers", async (req, res) => {

  try {

    // ================================================
    // 👨‍🚚 RÉCUPÉRER LES LIVREURS
    // ================================================

    const drivers =
      await Driver.find()
        // 🔐 Ne jamais charger les secrets d'authentification
        // du livreur pour cette réponse d'administration.
        // La logique des statistiques et du suivi reste inchangée.
        .select(
          "-password -telegramConnectToken -telegramConnectExpires"
        )
        .sort({
          createdAt: -1
        })
        .lean();


    // ================================================
    // 🟢 / ⚫ VÉRIFIER L'ÉTAT RÉEL DES LIVREURS
    // ================================================

    const now =
      Date.now();

    // Après 2 minutes sans activité GPS
    // le livreur est considéré hors ligne.
    const ONLINE_TIMEOUT =
      2 * 60 * 1000;


    const driversWithOnlineStatus =
      drivers.map(
        (driver) => {

          const lastOnline =
            driver.lastOnlineAt
              ? new Date(
                  driver.lastOnlineAt
                ).getTime()
              : 0;


          const isReallyOnline =
            lastOnline > 0 &&
            (
              now -
              lastOnline
            ) < ONLINE_TIMEOUT;


          return {

            ...driver,

            isOnline:
              isReallyOnline,

          };

        }
      );


    // ================================================
    // 📅 DÉBUT DE LA JOURNÉE
    // ================================================

    const startOfDay =
      new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );


    // ================================================
    // 📊 AJOUTER LES STATISTIQUES
    // ================================================

    const driversWithStats =
      await Promise.all(

        driversWithOnlineStatus.map(
          async (driver) => {

            const driverId =
              driver._id;


            // =========================================
            // 📦 TOTAL DES COMMANDES LIVRÉES
            // =========================================

            const totalDelivered =
              await Order.countDocuments({

                "assignedDriver.id":
                  driverId,

                status:
                  "Livrée"

              });


            // =========================================
            // 📅 COMMANDES LIVRÉES AUJOURD'HUI
            // =========================================

            const deliveredToday =
              await Order.countDocuments({

                "assignedDriver.id":
                  driverId,

                status:
                  "Livrée",

                deliveredAt: {
                  $gte:
                    startOfDay
                }

              });


            // =========================================
            // 🚚 COMMANDES EN COURS
            // =========================================

            const inDelivery =
              await Order.countDocuments({

                "assignedDriver.id":
                  driverId,

                status:
                  "En livraison"

              });


            // =========================================
            // 🕐 DERNIÈRE LIVRAISON
            // =========================================

            const lastDeliveredOrder =
              await Order.findOne({

                "assignedDriver.id":
                  driverId,

                status:
                  "Livrée",

                deliveredAt: {
                  $ne:
                    null
                }

              })
              .sort({

                deliveredAt:
                  -1

              })
              .select(
                "_id deliveredAt"
              )
              .lean();


            // =========================================
            // 📤 LIVREUR + STATISTIQUES
            // =========================================

            return {

              ...driver,

              stats: {

                totalDelivered,

                deliveredToday,

                inDelivery,

                lastDeliveredAt:
                  lastDeliveredOrder
                    ?.deliveredAt ||
                  null

              }

            };

          }

        )

      );


    // ================================================
    // 📤 RÉPONSE
    // ================================================

    res.json(
      driversWithStats
    );


  } catch (err) {

    console.error(
      "❌ DRIVERS ERROR:",
      err
    );


    res.status(500).json({

      success: false,

      error:
        "Erreur serveur",

      message:
        err.message

    });

  }

});

// ======================================================
// 🗺️ TRAJET DU LIVREUR POUR AUJOURD'HUI
// ======================================================

app.get(
  "/driver/:driverId/today-route",
  async (req, res) => {

    try {

      const {
        driverId
      } = req.params;


      // ==========================================
      // 🔐 VÉRIFIER LE LIVREUR
      // ==========================================

      const driver =
        await Driver.findById(
          driverId
        ).lean();


      if (!driver) {

        return res.status(404).json({

          success: false,

          message:
            "Livreur introuvable"

        });

      }


      // ==========================================
      // 📅 DÉBUT DE LA JOURNÉE
      // ==========================================

      const startOfDay =
        new Date();

      startOfDay.setHours(
        0,
        0,
        0,
        0
      );


      // ==========================================
      // 📅 FIN DE LA JOURNÉE
      // ==========================================

      const endOfDay =
        new Date();

      endOfDay.setHours(
        23,
        59,
        59,
        999
      );


      // ==========================================
      // 🗺️ HISTORIQUE GPS
      // ==========================================

      const history =
        Array.isArray(
          driver.locationHistory
        )
          ? driver.locationHistory
              .filter((point) => {

                const date =
                  new Date(
                    point.recordedAt ||
                    point.timestamp
                  );

                return (
                  date >= startOfDay &&
                  date <= endOfDay
                );

              })
              .sort(
                (a, b) =>
                  new Date(
                    a.recordedAt ||
                    a.timestamp
                  ) -
                  new Date(
                    b.recordedAt ||
                    b.timestamp
                  )
              )
          : [];


      // ==========================================
      // 📤 RÉPONSE
      // ==========================================

      return res.json({

        success: true,

        driver: {

          _id:
            driver._id,

          name:
            driver.name,

          photo:
            driver.photo,

          vehicle:
            driver.vehicle,

          plate:
            driver.plate,

          city:
            driver.city

        },

        date:
          startOfDay
            .toLocaleDateString(
              "fr-FR"
            ),

        count:
          history.length,

        route:
          history

      });


    } catch (err) {

      console.error(
        "❌ TODAY ROUTE ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Erreur récupération du trajet",

        error:
          "Erreur serveur."

      });

    }

  }
);

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

const driverRegisterRateLimiter = rateLimit({
  name: "driver-register",
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post(
  "/driver-register",
  driverRegisterRateLimiter,
  upload.single("photo"),
  async (req, res) => {

    try {

      const existingDriver =
        await Driver.findOne({
          email: req.body.email,
        });

      if (existingDriver) {

        return res.status(400).json({
          success: false,
          message: "Livreur existe déjà",
        });

      }

      // =====================================
      // 📸 PHOTO CLOUDINARY
      // =====================================

      const photoUrl =
        req.file?.secure_url ||
        req.file?.path ||
        "";

      // =====================================
      // 🚚 CREATION LIVREUR
      // =====================================

      const driver =
        new Driver({

          name:
            req.body.name,

          email:
            req.body.email,

          password:
            await bcrypt.hash(String(req.body.password || ""), 12),

          phone:
            req.body.phone,

          city:
            req.body.city,

          vehicle:
            req.body.vehicle,

          plate:
            req.body.plate,

          photo:
            photoUrl,

        });

      await driver.save();

      console.log(
        "🚚 LIVREUR CRÉÉ :",
        driver.name
      );

      console.log(
        "☁️ PHOTO CLOUDINARY :",
        photoUrl
      );

      const safeDriver = driver.toObject();
      delete safeDriver.password;
      delete safeDriver.telegramToken;

      return res.status(201).json({
        success: true,
        message: "Compte livreur créé avec succès",
        driver: safeDriver,
      });

    } catch (err) {

      console.error(
        "❌ DRIVER REGISTER ERROR:",
        err
      );

      return res.status(500).json({

        success: false,

        message:
          "Erreur inscription livreur",

        error:
          "Erreur serveur.",

      });

    }

  }
);

// ======================================================
// 📍 GPS DU LIVREUR
// ======================================================

app.put(
  "/order-location/:orderId",
  driverLocationLimiter,
  async (req, res) => {

    try {

      const {
        driverId,
        lat,
        lng
      } = req.body;

      const authenticatedDriverId =
        getAuthenticatedDriverId(req);


      // ============================================
      // VALIDATION
      // ============================================

      if (!driverId || !authenticatedDriverId || String(driverId) !== authenticatedDriverId) {

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


      if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de commande invalide"
        });
      }

      // ============================================
      // 🔢 CONVERTIR LES COORDONNÉES
      // ============================================

      const coordinates =
        validateDriverCoordinates(lat, lng);

      if (!coordinates) {

        return res.status(400).json({

          success: false,

          message:
            "Coordonnées GPS invalides"

        });

      }


      // ============================================
      // 🕐 DATE GPS
      // ============================================

      const now =
        new Date();


      // ============================================
      // 🚚 VÉRIFIER LA COMMANDE
      // ============================================

      const order =
        await Order.findOneAndUpdate(

          {

            _id:
              req.params.orderId,

            "assignedDriver.id":
              authenticatedDriverId,

            status:
              "En livraison"

          },

          {

            $set: {

              // ====================================
              // 📍 POSITION ACTUELLE DE LA COMMANDE
              // ====================================

              driverLocation: {

                lat:
                  coordinates.latitude,

                lng:
                  coordinates.longitude,

                updatedAt:
                  now

              }

            }

          },

          {
            new: true
          }

        );


      // ============================================
      // ❌ PAS AUTORISÉ
      // ============================================

      if (!order) {

        return res.status(403).json({

          success: false,

          message:
            "Vous n'êtes pas le livreur assigné à cette commande."

        });

      }


      // ============================================
      // 👨‍🚚 RÉCUPÉRER LE LIVREUR
      // ============================================

      const driver =
        await Driver.findById(
          authenticatedDriverId
        );


      if (!driver) {

        return res.status(404).json({

          success: false,

          message:
            "Livreur introuvable"

        });

      }

      // ============================================
// 🟢 LIVREUR ACTIF / EN LIGNE
// ============================================

driver.isOnline = true;

driver.lastOnlineAt = now;

      // ============================================
      // 📍 POSITION ACTUELLE DU LIVREUR
      // ============================================

      driver.currentLocation = {

        lat:
          latitude,

        lng:
          longitude,

        updatedAt:
          now

      };


      // ============================================
      // 🗺️ AJOUTER AU TRAJET
      // ============================================

      if (
        !Array.isArray(
          driver.locationHistory
        )
      ) {

        driver.locationHistory = [];

      }


      driver.locationHistory.push({

  lat: latitude,

  lng: longitude,

  orderId: order._id,

  recordedAt: now

});


      // ============================================
      // 💾 SAUVEGARDER LE LIVREUR
      // ============================================

      await driver.save();


      // ============================================
      // 🧪 DEBUG
      // ============================================

      console.log(
        "=========================================="
      );

      console.log(
        "📍 GPS LIVREUR"
      );

      console.log(
        "👨‍🚚 LIVREUR :",
        driver.name
      );

      console.log(
        "🆔 DRIVER ID :",
        driver._id
      );

      console.log(
        "📦 COMMANDE :",
        order._id
      );

      console.log(
        "📍 LAT :",
        latitude
      );

      console.log(
        "📍 LNG :",
        longitude
      );

      console.log(
        "🗺️ POINTS HISTORIQUE :",
        driver.locationHistory.length
      );

      console.log(
        "=========================================="
      );


      // ============================================
      // 📤 RÉPONSE
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


      return res.status(500).json({

        success: false,

        message:
          "Erreur serveur GPS"

      });

    }

  }
);

// ======================================================
// 🟢 STATUT EN LIGNE DU LIVREUR
// ======================================================

app.put(
  "/driver-online/:driverId",
  async (req, res) => {

    try {

      const {
        isOnline
      } = req.body;


      if (typeof isOnline !== "boolean") {

        return res.status(400).json({

          success: false,

          message:
            "Statut en ligne invalide"

        });

      }


      const driver =
        await Driver.findByIdAndUpdate(

          req.params.driverId,

          {
            $set: {

              isOnline,

              "currentLocation.updatedAt":
                isOnline
                  ? new Date()
                  : null

            }

          },

          {
            new: true
          }

        );


      if (!driver) {

        return res.status(404).json({

          success: false,

          message:
            "Livreur introuvable"

        });

      }


      console.log(
        `🚚 ${driver.name} → ${
          isOnline
            ? "🟢 EN LIGNE"
            : "⚫ HORS LIGNE"
        }`
      );


      return res.json({

        success: true,

        isOnline:
          driver.isOnline

      });


    } catch (err) {

      console.error(
        "❌ DRIVER ONLINE ERROR:",
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
// ✅ LIVRER UNE COMMANDE
// 📷 QR CODE OU BOUTON "LIVRÉE"
// ======================================================

app.put(
  "/driver-deliver/:orderId",
  driverActionLimiter,
  async (req, res) => {

    try {

      const {
        driverId,
        deliveryQrToken
      } = req.body;

      const authenticatedDriverId =
        getAuthenticatedDriverId(req);


      // ==================================================
      // 🔐 VÉRIFIER LE LIVREUR
      // ==================================================

      if (!driverId || !authenticatedDriverId || String(driverId) !== authenticatedDriverId) {

        return res.status(400).json({

          success: false,

          message:
            "Livreur non identifié"

        });

      }


      // ==================================================
      // 🔎 RÉCUPÉRER LA COMMANDE
      // ==================================================

      const order =
        await Order.findOne({

          _id:
            req.params.orderId,

          "assignedDriver.id":
            authenticatedDriverId,

          status:
            "En livraison"

        });


      // ==================================================
      // ❌ COMMANDE NON AUTORISÉE
      // ==================================================

      if (!order) {

        return res.status(403).json({

          success: false,

          message:
            "Vous n'êtes pas autorisé à livrer cette commande."

        });

      }


      // ==================================================
      // 📷 VÉRIFICATION QR CODE
      // ==================================================

      if (deliveryQrToken) {


        // ================================================
        // 🚫 QR DÉJÀ UTILISÉ
        // ================================================

        if (order.deliveryQrUsedAt) {

          return res.status(400).json({

            success: false,

            message:
              "Ce QR Code a déjà été utilisé."

          });

        }


        // ================================================
        // ❌ QR INCORRECT
        // ================================================

        if (
          deliveryQrToken !==
          order.deliveryQrToken
        ) {

          return res.status(400).json({

            success: false,

            message:
              "QR Code invalide pour cette commande."

          });

        }

      }


      // ==================================================
      // ✅ LIVRER LA COMMANDE
      // ==================================================

      order.status =
        "Livrée";

      order.deliveredAt =
        new Date();


      // ==================================================
      // 📷 ENREGISTRER L'UTILISATION DU QR
      // ==================================================

      if (deliveryQrToken) {

        order.deliveryQrUsedAt =
          new Date();

      }


      // ==================================================
      // 💾 SAUVEGARDER
      // ==================================================

      await order.save();


      // ==================================================
      // 🧪 LOG
      // ==================================================

      console.log(
        "=========================================="
      );

      console.log(
        "✅ COMMANDE LIVRÉE"
      );

      console.log(
        "📦 COMMANDE :",
        order._id
      );

      console.log(
        "🚚 LIVREUR :",
        driverId
      );

      console.log(
        "📷 QR :",
        deliveryQrToken
          ? "UTILISÉ ✅"
          : "NON UTILISÉ — BOUTON LIVRÉE ✅"
      );

      console.log(
        "=========================================="
      );


      // ==================================================
      // 📤 RÉPONSE
      // ==================================================

      return res.json({

        success: true,

        message:
          deliveryQrToken
            ? "Commande livrée avec QR Code ✅"
            : "Commande livrée avec succès ✅",

        order

      });


    } catch (err) {

      console.error(
        "❌ DELIVERY ERROR:",
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
// 🔄 LIVREUR ANNULE SA LIVRAISON
// → LA COMMANDE REDEVIENT DISPONIBLE POUR TOUS
// ======================================================

app.put(
  "/driver-cancel/:orderId",
  driverActionLimiter,
  async (req, res) => {

    try {

      const {
        driverId
      } = req.body;

      const authenticatedDriverId =
        getAuthenticatedDriverId(req);


      // ================================================
      // VALIDATION
      // ================================================

      if (!driverId || !authenticatedDriverId || String(driverId) !== authenticatedDriverId) {

        return res.status(400).json({

          success: false,

          message:
            "Livreur non identifié"

        });

      }


      if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de commande invalide."
        });
      }

      // ================================================
      // ANNULATION ATOMIQUE
      // ================================================

      const order =
        await Order.findOneAndUpdate(

          {
            _id:
              req.params.orderId,

            // SEUL LE LIVREUR ASSIGNÉ
            // PEUT ANNULER

            "assignedDriver.id":
              authenticatedDriverId,

            // LA COMMANDE DOIT ÊTRE
            // EN LIVRAISON

            status:
              "En livraison"

          },

          {

            // ==========================================
            // 🔄 REMETTRE LA COMMANDE DISPONIBLE
            // ==========================================

            $set: {

              status:
                "En attente"

            },

            // ==========================================
            // 🧹 SUPPRIMER L'ANCIEN LIVREUR
            // ET L'ANCIENNE ANNULATION
            // ==========================================

            $unset: {

              assignedDriver:
                "",

              cancelledAt:
                ""

            }

          },

          {
            new: true
          }

        );


      // ================================================
      // ❌ COMMANDE NON TROUVÉE
      // ================================================

      if (!order) {

        return res.status(409).json({

          success: false,

          message:
            "Cette commande n'est plus assignée à ce livreur ou a déjà été modifiée."

        });

      }


      // ================================================
      // 📋 LOG
      // ================================================

      console.log(

        `🔄 Commande ${order._id} remise à disposition par le livreur ${driverId}`

      );


      // ================================================
      // 📲 TELEGRAM
      // → INFORMER LES LIVREURS
      // ================================================

      try {

        await notifyDriversOrderAvailableAgain(
          order,
          driverId
        );

      } catch (telegramError) {

        console.error(
          "⚠️ Erreur notification Telegram :",
          telegramError.message
        );

        // IMPORTANT :
        // Une erreur Telegram ne doit PAS
        // empêcher l'annulation de la commande.

      }


      // ================================================
      // ✅ RÉPONSE
      // ================================================

      return res.json({

        success: true,

        message:
          "Commande remise à disposition pour tous les livreurs",

        order

      });


    } catch (err) {

      console.error(
        "❌ DRIVER CANCEL ERROR:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Erreur serveur lors de l'annulation"

      });

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

      res.status(500).json({ message: "Erreur serveur." });

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

      res.status(500).json({ message: "Erreur serveur." });

    }

});

// VISITORS

const trackVisitorRateLimiter = rateLimit({
  name: "track-visitor",
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post(
  "/track-visitor",
  trackVisitorRateLimiter,

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

      res.status(500).json({ message: "Erreur serveur." });

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

      res.status(500).json({ message: "Erreur serveur." });

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

      res.status(500).json({ message: "Erreur serveur." });

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
        clientId: req.user?.sub || (typeof req.body.clientId === "string" ? req.body.clientId.trim().slice(0, 100) : "guest"),
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

      res.status(500).json({ message: "Erreur serveur." });

    }

  }
);

// ======================================================
// 🎬 UPLOAD VIDÉO RÉSEAUX SOCIAUX
// ======================================================

app.post(
  "/api/social/upload-video",

  uploadSocialVideo.single("video"),

  async (req, res) => {

    try {

      console.log(
        "=========================================="
      );

      console.log(
        "🎬 UPLOAD VIDÉO SOCIAL"
      );

      // Ne jamais journaliser le contenu complet de req.file :
      // cela peut exposer des métadonnées ou des chemins internes.
      console.log("📁 FICHIER VIDÉO REÇU");

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Aucune vidéo reçue",

        });

      }

      const videoUrl =
        req.file.secure_url ||
        req.file.path ||
        "";

      return res.json({

        success: true,

        message:
          "Vidéo uploadée avec succès",

        video: {

          url:
            videoUrl,

          publicId:
            req.file.public_id ||
            null,

          format:
            req.file.format ||
            null,

          duration:
            req.file.duration ||
            null,

          width:
            req.file.width ||
            null,

          height:
            req.file.height ||
            null,

        },

      });

    } catch (error) {

      console.error(
        "❌ SOCIAL VIDEO UPLOAD ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Erreur lors de l'upload de la vidéo",

        error:
          "Erreur serveur.",

      });

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

const socketMessageBuckets = new Map();

function allowSocketEvent(socket, eventName, max = 20, windowMs = 10_000) {
  const key = `${socket.authUserId}:${eventName}`;
  const now = Date.now();
  let bucket = socketMessageBuckets.get(key);

  if (!bucket || now - bucket.start >= windowMs) {
    bucket = { start: now, count: 0 };
    socketMessageBuckets.set(key, bucket);
  }

  bucket.count += 1;
  return bucket.count <= max;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of socketMessageBuckets.entries()) {
    if (now - bucket.start > 60_000) socketMessageBuckets.delete(key);
  }
}, 30_000).unref();

io.on("connection", (socket) => {

  console.log("🟢 Utilisateur connecté :", socket.id);

  onlineUsers++;

  io.emit("onlineUsers", onlineUsers);

  socket.on("joinCommunity", (user) => {

    if (!allowSocketEvent(socket, "joinCommunity", 5, 30_000)) return;

    // On conserve les informations d'affichage envoyées par le frontend,
    // mais l'identité technique vient toujours du JWT vérifié.
    const safeUser =
      user && typeof user === "object"
        ? { ...user }
        : {};

    safeUser.userId = socket.authUserId;
    if (safeUser.id !== undefined) safeUser.id = socket.authUserId;
    if (safeUser._id !== undefined) safeUser._id = socket.authUserId;

    socket.user = safeUser;

    io.emit("userJoined", safeUser);

  });

  socket.on("sendMessage", (message) => {

    // Anti-spam : maximum 20 messages / 10 secondes / utilisateur.
    if (!allowSocketEvent(socket, "sendMessage", 20, 10_000)) {
      return socket.emit("securityError", {
        message: "Trop de messages. Réessayez dans quelques secondes.",
      });
    }

    let safeMessage;

    if (message && typeof message === "object") {
      safeMessage = { ...message };
    } else {
      safeMessage = { text: String(message ?? "") };
    }

    // L'expéditeur ne peut plus être usurpé depuis le navigateur.
    safeMessage.userId = socket.authUserId;
    if (safeMessage.senderId !== undefined) safeMessage.senderId = socket.authUserId;
    if (safeMessage.authorId !== undefined) safeMessage.authorId = socket.authUserId;

    io.emit("newMessage", safeMessage);

  });

  socket.on("typing", (user) => {

    if (!allowSocketEvent(socket, "typing", 30, 10_000)) return;

    const safeUser =
      user && typeof user === "object"
        ? { ...user }
        : {};

    safeUser.userId = socket.authUserId;
    if (safeUser.id !== undefined) safeUser.id = socket.authUserId;
    if (safeUser._id !== undefined) safeUser._id = socket.authUserId;

    socket.broadcast.emit("typing", safeUser);

  });

  socket.on("disconnect", () => {

    console.log("🔴 Déconnexion :", socket.id);

    onlineUsers--;

    if (onlineUsers < 0) onlineUsers = 0;

    io.emit("onlineUsers", onlineUsers);

    // Nettoyage des compteurs de cet utilisateur.
    for (const key of socketMessageBuckets.keys()) {
      if (key.startsWith(`${socket.authUserId}:`)) {
        socketMessageBuckets.delete(key);
      }
    }

  });

});

// ======================================================
// 🔐 RÉPONSES D'ERREUR GLOBALES
// Ne jamais exposer les détails internes du serveur au client.
// ======================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Ressource introuvable.",
  });
});

app.use((err, req, res, next) => {
  console.error("❌ ERREUR SERVEUR INTERNE :", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    success: false,
    message: "Une erreur interne est survenue.",
  });
});

// ======================================================
// 🔐 ERREURS MULTER — ne jamais exposer les détails internes
// ======================================================

app.use((err, req, res, next) => {

  if (err && err.name === "MulterError") {

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "Fichier trop volumineux.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Fichier d'upload invalide.",
    });
  }

  if (
    err &&
    (err.message === "Type de fichier image non autorisé." ||
      err.message === "Type de vidéo non autorisé.")
  ) {
    return res.status(400).json({
      success: false,
      message: "Erreur serveur.",
    });
  }

  return next(err);
});

// =========================
// START SERVER
// =========================

const requiredSecurityEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "ADMIN_JWT_SECRET",
  "DRIVER_JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD_HASH",
  "ULTRAMSG_TOKEN",
];

for (const key of requiredSecurityEnv) {
  if (!process.env[key]) {
    console.error(`❌ Variable .env manquante: ${key}`);
    process.exit(1);
  }
}

for (const key of ["JWT_SECRET", "ADMIN_JWT_SECRET", "DRIVER_JWT_SECRET"]) {
  if (String(process.env[key]).length < 32) {
    console.error(`❌ Secret de sécurité trop court: ${key}`);
    process.exit(1);
  }
}

mongoose
  .connect(process.env.MONGO_URI)

  .then(async () => {

    console.log("MongoDB Atlas connecté ✅");
console.log("Base utilisée :", mongoose.connection.name);
console.log("Connexion MongoDB établie ✅");

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