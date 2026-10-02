const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    discountType: {
      type: String,
      enum: [
        "percent",
        "fixed",
        "shipping",
      ],
      default: "percent",
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    condition: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    color: {
      type: String,
      default: "",
      trim: true,
      maxlength: 50,
    },

    days: {
      type: Number,
      default: 7,
      min: 0,

      validate: {
        validator: Number.isInteger,
        message:
          "days doit être un nombre entier.",
      },
    },

    minPurchase: {
      type: Number,
      default: 0,
      min: 0,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    maxUses: {
      type: Number,
      default: 9999,
      min: 1,

      validate: {
        validator: Number.isInteger,
        message:
          "maxUses doit être un nombre entier.",
      },
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,

      validate: {
        validator: Number.isInteger,
        message:
          "usedCount doit être un nombre entier.",
      },
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