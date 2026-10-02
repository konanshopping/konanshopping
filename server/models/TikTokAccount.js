const mongoose = require("mongoose");

const TikTokAccountSchema = new mongoose.Schema(
  {
    openId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 255,
    },

    // 🔐 Secret OAuth
    accessToken: {
      type: String,
      required: true,
      select: false,
    },

    // 🔐 Secret OAuth
    refreshToken: {
      type: String,
      required: true,
      select: false,
    },

    accessTokenExpiresAt: {
      type: Date,
      required: true,
    },

    refreshTokenExpiresAt: {
      type: Date,
      default: null,
    },

    scope: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    username: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    displayName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    avatarUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "TikTokAccount",
    TikTokAccountSchema
  );