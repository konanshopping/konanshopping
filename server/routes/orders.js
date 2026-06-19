const express = require("express");

const router = express.Router();

const Order =
require("../models/Order");



// 🔥 Toutes les commandes

router.get("/", async (req, res) => {

  try {

    const orders =

      await Order.find()

        .populate("driver")

        .sort({
          createdAt: -1,
        });

    res.json(orders);

  } catch (error) {

    res.status(500).json({

      error:
        "Erreur serveur",

    });

  }

});



// 🔥 Commandes par statut

router.get(
  "/status/:status",

  async (req, res) => {

    try {

      const orders =
        await Order.find({
          status:
            req.params.status,
        });

      res.json(orders);

    } catch (error) {

      res.status(500).json({
        error:
          "Erreur serveur",
      });

    }

  }
);

router.put(
  "/orders/:id/assign-driver",

  async (req, res) => {

    try {

      const driver =
        await Driver.findById(
          req.body.driverId
        );

      const order =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            driverId:
              driver._id,

            driver: {

              name:
                driver.name,

              phone:
                driver.phone,

              photo:
                driver.photo,

            },

          },

          {
            new: true,
          }

        );

      res.json({

        message:
          "Livreur assigné",

        order,

      });

    } catch (error) {

      res.status(500).json({
        message:
          "Erreur serveur",
      });

    }

  }

);

// =========================
// AUTO LIVRÉ
// =========================

router.put(
  "/:id/status",

  async (req, res) => {

    try {

      const order =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            status: req.body.status,
          },

          {
            new: true,
          }

        );

      res.json(order);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: "Erreur serveur",
      });

    }

  }
);

module.exports = router;
