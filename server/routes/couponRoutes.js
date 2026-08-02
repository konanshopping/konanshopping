const express = require("express");
const router = express.Router();

const User = require("../models/User");

// Vérifier un coupon
router.post("/apply", async (req, res) => {

  try {

    const { userId, code, total } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    // Date d'expiration
    const now = new Date();

    let expireDate = new Date(user.registerDate);

    // Exemple de coupons
    if (code === "WELCOME20") {

      expireDate.setDate(expireDate.getDate() + 7);

      if (now > expireDate) {
        return res.json({
          success: false,
          message: "Coupon expiré",
        });
      }

      if (user.usedCoupons.includes(code)) {
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

    return res.json({
      success: false,
      message: "Coupon invalide",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });

  }

});

module.exports = router;