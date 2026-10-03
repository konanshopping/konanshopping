const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    // 🔐 MOT DE PASSE
    password: {
      type: String,
      select: false,
    },

    // 🔐 TOKEN DE RÉINITIALISATION
    resetToken: {
      type: String,
      select: false,
    },

    resetTokenExpire: {
      type: Date,
      select: false,
    },

    // ADMIN

    isAdmin: {
      type: Boolean,
      default: false,
    },

    // ======================================================
    // 👥 COMMUNAUTÉ KONAN SHOPPING
    // ======================================================

    communityMember: {
      type: Boolean,
      default: true,
    },

    communityRole: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },

    communityJoinedAt: {
      type: Date,
      default: Date.now,
    },

    
    avatar: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1500000,
    },


    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },

    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    // STATUS USER

    status: {
      type: String,
      default: "Connecté",
      trim: true,
      maxlength: 50,
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
        code: {
          type: String,
          trim: true,
          maxlength: 50,
        },

        assignedAt: {
          type: Date,
          default: Date.now,
        },

        expiresAt: {
          type: Date,
          default: null,
        },

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