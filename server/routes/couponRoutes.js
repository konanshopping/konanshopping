const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = require("../models/User");

// ======================================================
// 🔐 SÉCURITÉ COUPON
// Compatible avec le middleware de sécurité de index.js
// ======================================================

const {
  rateLimit,
  requireSelfOrAdmin,
} = require("../middleware/security");

// Limite les tentatives de vérification de coupons
const couponApplyLimiter = rateLimit({
  name: "coupon-apply",
  windowMs: 10 * 60 * 1000,
  max: 20,
});

// ======================================================
// 🔐 VÉRIFIER UN COUPON
// ======================================================

router.post(
  "/apply",

  // Protection contre le brute-force / abus
  couponApplyLimiter,

  // L'identité doit correspondre au JWT.
  // Un client ne peut donc pas envoyer l'ID d'un autre utilisateur.
  requireSelfOrAdmin("userId"),

  async (req, res) => {
    try {

      // ==================================================
      // 📥 NETTOYAGE DES DONNÉES
      // ==================================================

      const body =
        req.body &&
        typeof req.body === "object"
          ? req.body
          : {};

      const code =
        typeof body.code === "string"
          ? body.code.trim().toUpperCase()
          : "";

      const total = Number(body.total);

      const userId =
        typeof body.userId === "string"
          ? body.userId.trim()
          : "";

      // ==================================================
      // 🛡️ VALIDATION
      // ==================================================

      if (
        !userId ||
        !mongoose.isValidObjectId(userId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Utilisateur invalide",
        });
      }

      if (
        !code ||
        code.length > 50
      ) {
        return res.status(400).json({
          success: false,
          message: "Code coupon invalide",
        });
      }

      if (
        !Number.isFinite(total) ||
        total < 0 ||
        total > 1000000000
      ) {
        return res.status(400).json({
          success: false,
          message: "Montant invalide",
        });
      }

      // ==================================================
      // 👤 UTILISATEUR
      // ==================================================

      const user =
        await User.findById(userId).select(
          "registerDate usedCoupons"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur introuvable",
        });
      }

      // ==================================================
      // 📅 DATE D'EXPIRATION
      // ==================================================

      const now = new Date();

      const registerDate =
        new Date(user.registerDate);

      if (Number.isNaN(registerDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Informations utilisateur invalides",
        });
      }

      // ==================================================
      // 🎁 WELCOME20
      // Logique originale conservée :
      // - valable 7 jours après l'inscription
      // - utilisable une seule fois
      // - réduction de 20 %
      // ==================================================

      if (code === "WELCOME20") {

        const expireDate =
          new Date(registerDate);

        expireDate.setDate(
          expireDate.getDate() + 7
        );

        if (now > expireDate) {
          return res.json({
            success: false,
            message: "Coupon expiré",
          });
        }

        const usedCoupons =
          Array.isArray(user.usedCoupons)
            ? user.usedCoupons
            : [];

        if (
          usedCoupons.includes("WELCOME20")
        ) {
          return res.json({
            success: false,
            message: "Coupon déjà utilisé",
          });
        }

        return res.json({
          success: true,
          discountType: "percent",
          discount: 20,
        });
      }

      // ==================================================
      // 💎 VIP50
      // Logique originale conservée :
      // - minimum 50 000 FCFA
      // - réduction fixe de 5 000 FCFA
      // ==================================================

      if (code === "VIP50") {

        if (total < 50000) {
          return res.json({
            success: false,
            message:
              "Minimum 50 000 FCFA",
          });
        }

        return res.json({
          success: true,
          discountType: "fixed",
          discount: 5000,
        });
      }

      // ==================================================
      // ❌ COUPON INVALIDE
      // ==================================================

      return res.json({
        success: false,
        message: "Coupon invalide",
      });

    } catch (err) {

      // Ne jamais exposer err.message au client
      console.error(
        "Erreur vérification coupon :",
        err
      );

      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

module.exports = router;