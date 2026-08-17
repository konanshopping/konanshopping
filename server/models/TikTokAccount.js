const mongoose = require("mongoose");

const TikTokAccountSchema = new mongoose.Schema(
  {
    openId: {
      type: String,
      required: true,
      unique: true,
    },

    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
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
    },

    username: {
      type: String,
      default: "",
    },

    displayName: {
      type: String,
      default: "",
    },

    avatarUrl: {
      type: String,
      default: "",
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