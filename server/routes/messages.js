const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

// ======================================================
// 🔐 SÉCURITÉ DES MESSAGES
// Compatible avec le middleware de sécurité de index.js
// ======================================================

const {
  rateLimit,
  requireAdmin,
  requireSelfOrAdmin,
} = require("../middleware/security");

const messageWriteLimiter = rateLimit({
  name: "messages-write",
  windowMs: 10 * 60 * 1000,
  max: 30,
});

const messageReadLimiter = rateLimit({
  name: "messages-read",
  windowMs: 10 * 60 * 1000,
  max: 120,
});

const cleanText = (value, maxLength) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const isValidId = (value) =>
  typeof value === "string" &&
  mongoose.isValidObjectId(value);

// ======================================================
// 📤 ENVOYER UN MESSAGE
// ADMIN UNIQUEMENT
// ======================================================

router.post(
  "/",
  messageWriteLimiter,
  requireAdmin,
  async (req, res) => {

    try {

      const title =
        cleanText(req.body?.title, 200);

      const content =
        cleanText(req.body?.content, 5000);

      const target =
        req.body?.target === "new"
          ? "new"
          : "all";

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: "Titre et contenu requis",
        });
      }

      let recipients = [];

      // ==========================================
      // 🆕 NOUVEAUX CLIENTS
      // ==========================================

      if (target === "new") {

        const lastMessage =
          await Message.findOne()
            .sort({
              createdAt: -1,
            })
            .select("createdAt")
            .lean();

        let dateLimit = null;

        if (lastMessage) {
          dateLimit =
            lastMessage.createdAt;
        }

        const query = dateLimit
          ? {
              registerDate: {
                $gt: dateLimit,
              },
            }
          : {};

        const newUsers =
          await User.find(query)
            .select("_id")
            .limit(100000)
            .lean();

        recipients =
          newUsers.map(
            (user) => user._id
          );
      }

      // ==========================================
      // 💾 CRÉATION DU MESSAGE
      // ==========================================

      const message =
        await Message.create({

          title,

          content,

          target,

          recipients,

        });

      return res.status(201).json(
        message
      );

    } catch (error) {

      console.error(
        "Erreur création message:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

// ======================================================
// 📥 RÉCUPÉRER LES MESSAGES
// ======================================================

router.get(
  "/",
  messageReadLimiter,
  async (req, res) => {

    try {

      const requestedUserId =
        typeof req.query?.userId === "string"
          ? req.query.userId.trim()
          : "";

      // ==========================================
      // 🔐 ADMIN / HISTORIQUE GLOBAL
      // Aucun userId = tous les messages
      // ==========================================

      if (!requestedUserId) {

        // Cette route globale doit rester réservée
        // à l'administration.
        if (!req.admin?.role) {
          return res.status(403).json({
            success: false,
            message: "Accès refusé",
          });
        }

        const messages =
          await Message.find()
            .sort({
              createdAt: -1,
            })
            .lean();

        return res.json(
          messages
        );
      }

      // ==========================================
      // 🔐 CLIENT : UNIQUEMENT SES PROPRES MESSAGES
      // ==========================================

      if (
        !isValidId(requestedUserId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Utilisateur invalide",
        });
      }

      const authenticatedUserId =
        req.user?.sub ||
        req.user?.id ||
        req.admin?.sub ||
        req.admin?.id ||
        "";

      const isAdmin =
        req.admin?.role === "admin" ||
        String(req.admin?.sub || "") === "admin";

      if (
        !authenticatedUserId &&
        !isAdmin
      ) {
        return res.status(401).json({
          success: false,
          message: "Authentification requise",
        });
      }

      if (
        !isAdmin &&
        String(authenticatedUserId) !==
          String(requestedUserId)
      ) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé",
        });
      }

      const user =
        await User.findById(
          requestedUserId
        ).select(
          "registerDate createdAt"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable",
        });
      }

      const registerDate =
        user.registerDate ||
        user.createdAt;

      // ==========================================
      // 📬 MESSAGES AUTORISÉS
      // ==========================================

      const messages =
        await Message.find({

          $or: [

            {
              $and: [

                {
                  createdAt: {
                    $gte: registerDate,
                  },
                },

                {
                  $or: [
                    {
                      target: "all",
                    },
                    {
                      target: {
                        $exists: false,
                      },
                    },
                  ],
                },

              ],
            },

            {
              target: "new",
              recipients:
                user._id,
            },

          ],

        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.json(
        messages
      );

    } catch (error) {

      console.error(
        "Erreur récupération messages:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

// ======================================================
// 👁️ MARQUER UN MESSAGE COMME LU
// ======================================================

router.put(
  "/:id/read",
  messageWriteLimiter,
  async (req, res) => {

    try {

      const messageId =
        typeof req.params.id === "string"
          ? req.params.id.trim()
          : "";

      if (!isValidId(messageId)) {
        return res.status(400).json({
          success: false,
          message: "Message invalide",
        });
      }

      const authenticatedUserId =
        req.user?.sub ||
        req.user?.id ||
        "";

      if (!authenticatedUserId) {
        return res.status(401).json({
          success: false,
          message: "Authentification requise",
        });
      }

      const message =
        await Message.findById(
          messageId
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            "Message introuvable",
        });
      }

      if (
        !Array.isArray(message.readBy)
      ) {
        message.readBy = [];
      }

      if (
        !message.readBy.some(
          (id) =>
            String(id) ===
            String(authenticatedUserId)
        )
      ) {

        message.readBy.push(
          authenticatedUserId
        );

        await message.save();
      }

      return res.json(
        message
      );

    } catch (error) {

      console.error(
        "Erreur lecture message:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

// ======================================================
// 🗑️ MASQUER UN MESSAGE POUR L'UTILISATEUR
// ======================================================

router.put(
  "/:id/delete",
  messageWriteLimiter,
  async (req, res) => {

    try {

      const messageId =
        typeof req.params.id === "string"
          ? req.params.id.trim()
          : "";

      if (!isValidId(messageId)) {
        return res.status(400).json({
          success: false,
          message: "Message invalide",
        });
      }

      const authenticatedUserId =
        req.user?.sub ||
        req.user?.id ||
        "";

      if (!authenticatedUserId) {
        return res.status(401).json({
          success: false,
          message: "Authentification requise",
        });
      }

      const message =
        await Message.findById(
          messageId
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            "Message introuvable",
        });
      }

      if (
        !Array.isArray(message.deletedBy)
      ) {
        message.deletedBy = [];
      }

      if (
        !message.deletedBy.some(
          (id) =>
            String(id) ===
            String(authenticatedUserId)
        )
      ) {

        message.deletedBy.push(
          authenticatedUserId
        );

        await message.save();
      }

      return res.json({
        success: true,
      });

    } catch (error) {

      console.error(
        "Erreur suppression message:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

// ======================================================
// ✏️ MODIFIER UN MESSAGE
// ADMIN UNIQUEMENT
// ======================================================

router.put(
  "/:id",
  messageWriteLimiter,
  requireAdmin,
  async (req, res) => {

    try {

      const messageId =
        typeof req.params.id === "string"
          ? req.params.id.trim()
          : "";

      if (!isValidId(messageId)) {
        return res.status(400).json({
          success: false,
          message: "Message invalide",
        });
      }

      const message =
        await Message.findById(
          messageId
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            "Message introuvable",
        });
      }

      if (
        req.body?.title !== undefined
      ) {

        const title =
          cleanText(
            req.body.title,
            200
          );

        if (!title) {
          return res.status(400).json({
            success: false,
            message: "Titre invalide",
          });
        }

        message.title =
          title;
      }

      if (
        req.body?.content !== undefined
      ) {

        const content =
          cleanText(
            req.body.content,
            5000
          );

        if (!content) {
          return res.status(400).json({
            success: false,
            message: "Contenu invalide",
          });
        }

        message.content =
          content;
      }

      if (
        req.body?.target !== undefined
      ) {

        if (
          req.body.target !== "new" &&
          req.body.target !== "all"
        ) {
          return res.status(400).json({
            success: false,
            message: "Cible invalide",
          });
        }

        message.target =
          req.body.target;
      }

      message.updatedAt =
        new Date();

      await message.save();

      return res.json(
        message
      );

    } catch (error) {

      console.error(
        "Erreur modification message:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

// ======================================================
// 🗑️ SUPPRIMER DÉFINITIVEMENT UN MESSAGE
// ADMIN UNIQUEMENT
// ======================================================

router.delete(
  "/:id",
  messageWriteLimiter,
  requireAdmin,
  async (req, res) => {

    try {

      const messageId =
        typeof req.params.id === "string"
          ? req.params.id.trim()
          : "";

      if (!isValidId(messageId)) {
        return res.status(400).json({
          success: false,
          message: "Message invalide",
        });
      }

      const message =
        await Message.findByIdAndDelete(
          messageId
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            "Message introuvable",
        });
      }

      return res.json({
        success: true,
        message:
          "Message supprimé définitivement",
      });

    } catch (error) {

      console.error(
        "Erreur suppression message:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  }
);

module.exports = router;