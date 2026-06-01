const mongoose =
  require("mongoose");

const couponSchema =
  new mongoose.Schema({

    code: {
      type: String,
      unique: true,
    },

    discountType: {
      type: String,

      enum: [
        "percent",
        "fixed",
      ],

      default: "percent",
    },

    discountValue: Number,

    minPurchase: {
      type: Number,
      default: 0,
    },

    expiresAt: Date,

    maxUses: {
      type: Number,
      default: 9999,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },

  },

  {
    timestamps: true,
  }

);

module.exports =
  mongoose.model(
    "Coupon",
    couponSchema
  );