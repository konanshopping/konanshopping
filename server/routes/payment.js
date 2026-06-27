const express = require("express");
const axios = require("axios");

const router = express.Router();

// =============================
// CRÉER UN PAIEMENT MONETBIL
// =============================

router.post("/create", async (req, res) => {

  try {

    const {
      amount,
      phone,
      name,
      email
    } = req.body;

    const paymentRef =
      Date.now().toString();

    const response =
      await axios.post(

        "https://api.monetbil.com/payment/v1/placePayment",

        {

          service:
            process.env.MONETBIL_SERVICE_KEY,

          amount,

          currency: "XAF",

          phone,

          locale: "fr",

          country: "CM",

          item_ref: paymentRef,

          payment_ref: paymentRef,

          user: name,

          email,

          // ==========================
          // URLS DE RETOUR
          // ==========================

          notify_url:
            "https://konanshopping-production.up.railway.app/api/payment/notify",

          return_url:
            "https://konanshopping.vercel.app/payment-success",

          cancel_url:
            "https://konanshopping.vercel.app/checkout"

        },

        {

          headers: {

            Authorization:
              process.env.MONETBIL_SERVICE_SECRET

          }

        }

      );

    res.json(response.data);

  }

  catch (err) {

    console.log(err.response?.data);

    res
      .status(500)
      .json(
        err.response?.data ||
        err.message
      );

  }

});

// =============================
// NOTIFICATION MONETBIL
// =============================

router.post("/notify", async (req, res) => {

  console.log(
    "Paiement reçu :",
    req.body
  );

  // Ici nous enregistrerons
  // automatiquement la commande
  // après validation du paiement.

  res.sendStatus(200);

});

module.exports = router;