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

module.exports = router;