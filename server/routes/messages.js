const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

/* Envoyer un message */

router.post("/", async (req, res) => {

  try {

    const {
      title,
      content,
      target,
    } = req.body;

    let recipients = [];

    // ==========================================
    // NOUVEAUX CLIENTS
    // ==========================================

    if (target === "new") {

      // Dernière communication envoyée
      const lastMessage =
        await Message.findOne()
          .sort({
            createdAt: -1,
          });

      let dateLimit = null;

      if (lastMessage) {

        dateLimit =
          lastMessage.createdAt;

      }

      // Clients inscrits depuis
      // la dernière communication

      const query = dateLimit
        ? {
            registerDate: {
              $gt: dateLimit,
            },
          }
        : {};

      const newUsers =
        await User.find(
          query
        ).select("_id");

      recipients =
        newUsers.map(
          (user) => user._id
        );

    }

    // ==========================================
    // CRÉATION DU MESSAGE
    // ==========================================

    const message =
      await Message.create({

        title,

        content,

        target:
          target === "new"
            ? "new"
            : "all",

        recipients,

      });

    res.status(201).json(
      message
    );

  } catch (error) {

    console.error(
      "Erreur création message:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });

  }

});

/* Récupérer tous les messages */

router.get("/", async (req, res) => {

  try {

    const { userId } = req.query;

    // ==========================================
    // ADMIN / HISTORIQUE GLOBAL
    // Aucun userId = tous les messages
    // ==========================================

    if (!userId) {

      const messages =
        await Message.find()
          .sort({
            createdAt: -1,
          });

      return res.json(
        messages
      );

    }

    // ==========================================
    // CLIENT
    // ==========================================

    const user =
      await User.findById(userId);

    if (!user) {

      return res
        .status(404)
        .json({
          message:
            "Utilisateur introuvable",
        });

    }

    // ==========================================
    // DATE D'INSCRIPTION
    // ==========================================

    const registerDate =
      user.registerDate ||
      user.createdAt;

    // ==========================================
    // MESSAGES AUTORISÉS
    // ==========================================

    const messages =
      await Message.find({

        $or: [

          // ======================================
          // 👥 TOUS LES CLIENTS
          // ======================================

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

          // ======================================
          // 🆕 NOUVEAUX CLIENTS
          // ======================================

          {
            target: "new",

            recipients:
              user._id,
          },

        ],

      })
      .sort({
        createdAt: -1,
      });

    return res.json(
      messages
    );

  } catch (error) {

    console.error(
      "Erreur récupération messages:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });

  }

});

/* Marquer un message comme lu */

router.put(
  "/:id/read",
  async (req, res) => {

    try {

      const { userId } =
        req.body;

      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {

        return res
          .status(404)
          .json({
            message:
              "Message introuvable",
          });

      }

      if (
        !message.readBy.includes(
          userId
        )
      ) {

        message.readBy.push(
          userId
        );

        await message.save();

      }

      res.json(
        message
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  }
);

router.put(
  "/:id/delete",
  async (req, res) => {

    try {

      const { userId } =
        req.body;

      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {

        return res
          .status(404)
          .json({
            message:
              "Message introuvable",
          });

      }

      if (
        !message.deletedBy.includes(
          userId
        )
      ) {

        message.deletedBy.push(
          userId
        );

        await message.save();

      }

      res.json({
        success: true,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  }
);

/* Modifier un message */

router.put("/:id", async (req, res) => {

  try {

    const {
      title,
      content,
      target,
    } = req.body;

    const message =
      await Message.findById(
        req.params.id
      );

    if (!message) {

      return res
        .status(404)
        .json({
          message:
            "Message introuvable",
        });

    }

    if (
      title !== undefined
    ) {
      message.title =
        title;
    }

    if (
      content !== undefined
    ) {
      message.content =
        content;
    }

    if (
      target !== undefined
    ) {
      message.target =
        target;
    }

    message.updatedAt =
      new Date();

    await message.save();

    res.json(
      message
    );

  } catch (error) {

    console.error(
      "Erreur modification message:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });

  }

});

/* Supprimer définitivement un message */

router.delete("/:id", async (req, res) => {

  try {

    const message =
      await Message.findByIdAndDelete(
        req.params.id
      );

    if (!message) {

      return res
        .status(404)
        .json({
          message:
            "Message introuvable",
        });

    }

    res.json({
      success: true,
      message:
        "Message supprimé définitivement",
    });

  } catch (error) {

    console.error(
      "Erreur suppression message:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });

  }

});

module.exports = router;