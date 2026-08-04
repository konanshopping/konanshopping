const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(

  {

    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    resetToken: String,

    resetTokenExpire: Date,

    // ADMIN

    isAdmin: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // STATUS USER

    status: {
      type: String,
      default: "Connecté",
    },

    // LAST LOGIN

    lastLogin: {
      type: Date,
      default: Date.now,
    },

    // FAVORIS

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // COMMANDES

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // DATE D'INSCRIPTION

    registerDate: {
      type: Date,
      default: Date.now,
    },

    // COUPONS DÉJÀ UTILISÉS

    usedCoupons: {
      type: [String],
      default: [],
    },

    // COUPONS PERSONNALISÉS

userCoupons: [
  {
    code: String,

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: Date,

    used: {
      type: Boolean,
      default: false,
    },
  },
],

  },

  {
    timestamps: true,
  }

);

module.exports = mongoose.model(
  "User",
  userSchema
);