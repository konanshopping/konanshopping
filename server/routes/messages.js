const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

/* Envoyer un message */

router.post("/", async (req, res) => {

  try {

    const {
      title,
      content,
    } = req.body;

    const message =
      await Message.create({
        title,
        content,
      });

    res.status(201).json(
      message
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

});

/* Récupérer tous les messages */

router.get("/", async (req, res) => {

  try {

    const messages =
      await Message.find()
        .sort({
          createdAt: -1,
        });

    res.json(
      messages
    );

  } catch (error) {

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

module.exports = router;