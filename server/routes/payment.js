const express = require("express");

const axios = require("axios");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");



const Product = require("../models/product");

const Coupon = require("../models/Coupon");

const User = require("../models/User");



const {

  rateLimit,

} = require("../middleware/security");



const router = express.Router();



// ======================================================

// 🔐 MONETBIL — CONFIGURATION SÉCURISÉE

// ======================================================



const MONETBIL_API_URL =

  process.env.MONETBIL_API_URL ||

  "https://api.monetbil.com/payment/v1/placePayment";



const MONETBIL_NOTIFY_URL =

  process.env.MONETBIL_NOTIFY_URL ||

  "https://konanshopping.com/payment/notify";



const MONETBIL_RETURN_URL =

  process.env.MONETBIL_RETURN_URL ||

  "https://konanshopping.vercel.app/payment-success";



const MONETBIL_CANCEL_URL =

  process.env.MONETBIL_CANCEL_URL ||

  "https://konanshopping.vercel.app/checkout";



// ======================================================

// 🚦 RATE LIMIT

// ======================================================



const paymentCreationLimiter = rateLimit({

  name: "monetbil-create",

  windowMs: 10 * 60 * 1000,

  max: 15,

});



// ======================================================

// 🧹 VALIDATION

// ======================================================



function cleanString(value, maxLength = 200) {

  if (typeof value !== "string") return "";

  return value.trim().slice(0, maxLength);

}



function isValidAmount(value) {

  const amount = Number(value);

  return (

    Number.isFinite(amount) &&

    Number.isInteger(amount) &&

    amount > 0 &&

    amount <= 1000000000

  );

}



function normalizePhone(value) {

  if (typeof value !== "string") return "";



  const phone = value

    .trim()

    .replace(/\s+/g, "")

    .replace(/^\+/, "");



  if (!/^\d{9,15}$/.test(phone)) return "";

  return phone;

}



function isValidEmail(value) {

  if (typeof value !== "string") return false;

  const email = value.trim();

  if (email.length > 254) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}



function getAuthenticatedUserId(req) {

  // Étape Cookie-only : le JWT utilisateur est lu uniquement depuis
  // le cookie HttpOnly ks_user_token.
  const token =
    typeof req.cookies?.ks_user_token === "string"
      ? req.cookies.ks_user_token.trim()
      : "";

  if (!token) return null;

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    const error = new Error("JWT_SECRET manquant");
    error.status = 503;
    throw error;
  }

  try {
    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      issuer: process.env.JWT_ISSUER || "konanshopping",
      audience: process.env.JWT_AUDIENCE || "konanshopping-web",
    });

    const userId = String(payload?.sub || payload?.id || "").trim();
    return userId || null;
  } catch (error) {
    const authError = new Error("Authentification invalide");
    authError.status = 401;
    throw authError;
  }
}



// ======================================================

// 🔐 SIGNATURE MONETBIL

// ======================================================



function monetbilSign(serviceSecret, params) {

  const sortedKeys = Object.keys(params)

    .filter((key) => key !== "sign")

    .sort();



  let concatenated = "";



  for (const key of sortedKeys) {

    const value = params[key];



    if (value === undefined || value === null) continue;



    if (Array.isArray(value)) {

      for (const item of value) concatenated += String(item);

    } else {

      concatenated += String(value);

    }

  }



  return crypto

    .createHash("md5")

    .update(String(serviceSecret) + concatenated, "utf8")

    .digest("hex");

}



function verifyMonetbilSignature(params) {

  const secret = process.env.MONETBIL_SERVICE_SECRET;

  if (!secret) return false;



  const receivedSign =

    typeof params?.sign === "string"

      ? params.sign.trim().toLowerCase()

      : "";



  if (!/^[a-f0-9]{32}$/.test(receivedSign)) return false;



  const expectedSign = monetbilSign(secret, params).toLowerCase();



  return crypto.timingSafeEqual(

    Buffer.from(receivedSign, "utf8"),

    Buffer.from(expectedSign, "utf8")

  );

}



function validateMonetbilNotification(params) {

  if (!params || typeof params !== "object") {

    return { valid: false, reason: "Notification invalide" };

  }



  const expectedService = process.env.MONETBIL_SERVICE_KEY;



  if (!expectedService) {

    return { valid: false, reason: "MONETBIL_SERVICE_KEY manquant" };

  }



  if (String(params.service || "") !== String(expectedService)) {

    return { valid: false, reason: "Service Monetbil invalide" };

  }



  if (!verifyMonetbilSignature(params)) {

    return { valid: false, reason: "Signature Monetbil invalide" };

  }



  const status = String(params.status || "").trim().toLowerCase();

  const allowedStatuses = ["success", "cancelled", "failed"];



  if (!allowedStatuses.includes(status)) {

    return { valid: false, reason: "Statut Monetbil invalide" };

  }



  if (String(params.currency || "").trim().toUpperCase() !== "XAF") {

    return { valid: false, reason: "Devise Monetbil invalide" };

  }



  if (!params.transaction_id && !params.transaction_uuid) {

    return { valid: false, reason: "Transaction Monetbil absente" };

  }



  if (!params.payment_ref && !params.item_ref) {

    return { valid: false, reason: "Référence de paiement absente" };

  }



  if (!isValidAmount(params.amount)) {

    return { valid: false, reason: "Montant Monetbil invalide" };

  }



  return { valid: true, status };

}



// ======================================================

// 🔐 RECALCUL FINANCIER CÔTÉ SERVEUR

// ======================================================



async function calculateSecurePaymentAmount({

  itemsInput,

  city,

  couponCode,

  userId,

}) {

  if (!Array.isArray(itemsInput) || itemsInput.length < 1 || itemsInput.length > 50) {

    const error = new Error("Panier invalide");

    error.status = 400;

    throw error;

  }



  const normalizedItems = [];



  for (const item of itemsInput) {

    const productId = String(item?._id || item?.productId || "").trim();

    const quantity = Number(item?.quantity);



    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {

      const error = new Error("Produit invalide");

      error.status = 400;

      throw error;

    }



    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {

      const error = new Error("Quantité invalide");

      error.status = 400;

      throw error;

    }



    const product = await Product.findById(productId)

      .select("name price image")

      .lean();



    if (!product) {

      const error = new Error("Produit introuvable");

      error.status = 400;

      throw error;

    }



    const serverPrice = Number(product.price);



    if (!Number.isFinite(serverPrice) || serverPrice < 0) {

      const error = new Error("Prix produit invalide");

      error.status = 400;

      throw error;

    }



    normalizedItems.push({

      productId: product._id,

      name: String(product.name || "Produit").slice(0, 200),

      image: String(product.image || "").slice(0, 2000),

      price: serverPrice,

      quantity,

    });

  }



  const subtotal = normalizedItems.reduce(

    (sum, item) => sum + Number(item.price) * Number(item.quantity),

    0

  );



  if (!Number.isFinite(subtotal) || subtotal < 0 || subtotal > 1000000000) {

    const error = new Error("Sous-total invalide");

    error.status = 400;

    throw error;

  }



  const safeCity = String(city || "").trim().slice(0, 100);



  const shipping =

    subtotal >= 50000 ? 0 :

    safeCity === "" ? 0 :

    safeCity === "Douala" ? 2000 :

    safeCity === "Yaoundé" ? 1500 :

    safeCity === "Bafoussam" ? 2500 :

    3000;



  let discount = 0;

  const normalizedCouponCode = String(couponCode || "")

    .trim()

    .toUpperCase()

    .slice(0, 50);



  if (normalizedCouponCode) {

    if (!userId) {

      const error = new Error("Un compte est requis pour utiliser ce coupon");

      error.status = 400;

      throw error;

    }



    const user = await User.findById(userId)

      .select("usedCoupons registerDate orders")

      .lean();



    if (!user) {

      const error = new Error("Utilisateur introuvable");

      error.status = 400;

      throw error;

    }



    const coupon = await Coupon.findOne({

      code: normalizedCouponCode,

    }).lean();



    if (!coupon || !coupon.active) {

      const error = new Error("Coupon invalide");

      error.status = 400;

      throw error;

    }



    const usedCoupons = Array.isArray(user.usedCoupons)

      ? user.usedCoupons

      : [];



    if (usedCoupons.includes(coupon.code)) {

      const error = new Error("Vous avez déjà utilisé ce coupon");

      error.status = 400;

      throw error;

    }



    const registerDate = new Date(user.registerDate);



    if (Number.isNaN(registerDate.getTime())) {

      const error = new Error("Date d'inscription invalide");

      error.status = 400;

      throw error;

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

      const error = new Error("Coupon expiré");

      error.status = 400;

      throw error;

    }



    const usedCount = Number(coupon.usedCount || 0);

    const maxUses = Number(coupon.maxUses || 0);



    if (

      !Number.isFinite(usedCount) ||

      usedCount < 0 ||

      !Number.isFinite(maxUses) ||

      maxUses < 0 ||

      usedCount >= maxUses

    ) {

      const error = new Error("Coupon épuisé");

      error.status = 400;

      throw error;

    }



    const minPurchase = Number(coupon.minPurchase || 0);



    if (

      !Number.isFinite(minPurchase) ||

      minPurchase < 0 ||

      subtotal < minPurchase

    ) {

      const error = new Error(

        Number.isFinite(minPurchase) && minPurchase >= 0

          ? `Minimum ${minPurchase} FCFA requis`

          : "Configuration du coupon invalide"

      );

      error.status = 400;

      throw error;

    }



    const userOrders = Array.isArray(user.orders) ? user.orders : [];



    if (coupon.code === "WELCOME20" && userOrders.length > 0) {

      const error = new Error("Coupon réservé à la première commande");

      error.status = 400;

      throw error;

    }



    const discountValue = Number(coupon.discountValue);



    if (!Number.isFinite(discountValue) || discountValue < 0) {

      const error = new Error("Configuration du coupon invalide");

      error.status = 400;

      throw error;

    }



    if (coupon.discountType === "percent") {

      if (discountValue > 100) {

        const error = new Error("Configuration du coupon invalide");

        error.status = 400;

        throw error;

      }

      discount = subtotal * (discountValue / 100);

    } else {

      discount = discountValue;

    }



    discount = Math.min(Math.max(discount, 0), subtotal);

  }



  const calculatedTotal = Math.max(

    subtotal + shipping - discount,

    0

  );



  if (!Number.isFinite(calculatedTotal) || calculatedTotal <= 0 || calculatedTotal > 1000000000) {

    const error = new Error("Montant final invalide");

    error.status = 400;

    throw error;

  }



  const monetbilAmount = Math.round(calculatedTotal);



  if (!isValidAmount(monetbilAmount)) {

    const error = new Error("Montant Monetbil invalide");

    error.status = 400;

    throw error;

  }



  return {

    subtotal,

    shipping,

    discount,

    total: calculatedTotal,

    monetbilAmount,

    normalizedItems,

  };

}



// ======================================================

// 💳 CRÉER UN PAIEMENT MONETBIL

// ======================================================



router.post(

  "/create",

  paymentCreationLimiter,

  async (req, res) => {

    try {

      const serviceKey = process.env.MONETBIL_SERVICE_KEY;

      const serviceSecret = process.env.MONETBIL_SERVICE_SECRET;



      if (!serviceKey || !serviceSecret) {

        return res.status(503).json({

          success: false,

          error: "Service de paiement temporairement indisponible.",

        });

      }



      const phone = normalizePhone(req.body?.phone);

      const name = cleanString(req.body?.name, 120);

      const email = cleanString(req.body?.email, 254).toLowerCase();

      const city = cleanString(req.body?.city, 100);

      const couponCode = cleanString(req.body?.couponCode, 50);

      const itemsInput = Array.isArray(req.body?.items)

        ? req.body.items

        : [];



      if (!phone) {

        return res.status(400).json({

          success: false,

          error: "Numéro de téléphone invalide.",

        });

      }



      if (name.length < 2 || name.length > 120) {

        return res.status(400).json({

          success: false,

          error: "Nom invalide.",

        });

      }



      if (email && !isValidEmail(email)) {

        return res.status(400).json({

          success: false,

          error: "Adresse email invalide.",

        });

      }



      // 🔐 Le montant envoyé par le navigateur est volontairement ignoré.

      // Le serveur recalcule le montant à partir de MongoDB.

      const userId = getAuthenticatedUserId(req);



      const calculation = await calculateSecurePaymentAmount({

        itemsInput,

        city,

        couponCode,

        userId,

      });



      const clientAmount = Number(req.body?.amount);



      if (

        !Number.isFinite(clientAmount) ||

        Math.round(clientAmount) !== calculation.monetbilAmount

      ) {

        return res.status(400).json({

          success: false,

          error: "Montant de paiement incorrect.",

        });

      }



      const paymentRef =

        `KS-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;



      const payload = {

        service: serviceKey,

        amount: calculation.monetbilAmount,

        currency: "XAF",

        phone,

        locale: "fr",

        country: "CM",

        item_ref: paymentRef,

        payment_ref: paymentRef,

        user: name,

        ...(email ? { email } : {}),

        notify_url: MONETBIL_NOTIFY_URL,

        return_url: MONETBIL_RETURN_URL,

        cancel_url: MONETBIL_CANCEL_URL,

      };



      const response = await axios.post(

        MONETBIL_API_URL,

        payload,

        {

          headers: {

            Authorization: serviceSecret,

            "Content-Type": "application/json",

            Accept: "application/json",

          },

          timeout: 15000,

          maxContentLength: 1024 * 1024,

          maxBodyLength: 1024 * 1024,

        }

      );



      if (!response || !response.data) {

        return res.status(502).json({

          success: false,

          error: "Réponse de paiement invalide.",

        });

      }



      return res.json(response.data);

    } catch (err) {

      const status = Number(err?.status);



      console.error(

        "❌ MONETBIL CREATE ERROR:",

        err?.response?.status || err?.code || status || "UNKNOWN"

      );



      if (status === 401) {

        return res.status(401).json({

          success: false,

          error: "Authentification invalide.",

        });

      }



      if (status === 400) {

        return res.status(400).json({

          success: false,

          error: err.message || "Données de paiement invalides.",

        });

      }



      return res.status(502).json({

        success: false,

        error: "Impossible de créer le paiement pour le moment.",

      });

    }

  }

);



// ======================================================

// 🔔 NOTIFICATION MONETBIL

// ======================================================



router.post(

  "/notify",

  async (req, res) => {

    try {

      const params = {

        ...(req.body || {}),

      };



      const validation = validateMonetbilNotification(params);



      if (!validation.valid) {

        return res.status(403).json({

          success: false,

          error: "Notification de paiement refusée.",

        });

      }



      console.log("✅ Notification Monetbil authentifiée:", {

        transaction_id: params.transaction_id

          ? String(params.transaction_id).slice(0, 80)

          : "",

        transaction_uuid: params.transaction_uuid

          ? String(params.transaction_uuid).slice(0, 80)

          : "",

        status: validation.status,

        amount: Number(params.amount),

        currency: String(params.currency),

        payment_ref: params.payment_ref

          ? String(params.payment_ref).slice(0, 120)

          : "",

        item_ref: params.item_ref

          ? String(params.item_ref).slice(0, 120)

          : "",

      });



      return res.sendStatus(200);

    } catch (err) {

      console.error(

        "❌ MONETBIL NOTIFY ERROR:",

        err?.message || "Erreur inconnue"

      );



      return res.status(500).json({

        success: false,

        error: "Erreur de traitement de la notification.",

      });

    }

  }

);



module.exports = router;