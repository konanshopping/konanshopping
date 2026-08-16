const mongoose = require("mongoose");

const SocialPostSchema = new mongoose.Schema(
  {

    // ======================================================
    // 🎬 VIDÉO
    // ======================================================

    videoUrl: {
      type: String,
      required: true,
    },

    videoPublicId: {
      type: String,
      default: null,
    },

    thumbnailUrl: {
      type: String,
      default: null,
    },

    // ======================================================
    // 📝 CONTENU
    // ======================================================

    title: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    hashtags: {
      type: [String],
      default: [],
    },

    // ======================================================
    // 📱 RÉSEAUX SÉLECTIONNÉS
    // ======================================================

    platforms: {

      facebook: {
        type: Boolean,
        default: false,
      },

      instagram: {
        type: Boolean,
        default: false,
      },

      tiktok: {
        type: Boolean,
        default: false,
      },

      youtube: {
        type: Boolean,
        default: false,
      },

    },

    // ======================================================
    // 📊 STATUT GLOBAL
    // ======================================================

    status: {

      type: String,

      enum: [
        "draft",
        "uploading",
        "publishing",
        "published",
        "partial",
        "failed",
      ],

      default: "draft",

    },

    // ======================================================
    // 📱 RÉSULTATS PAR RÉSEAU
    // ======================================================

    results: {

      facebook: {

        success: {
          type: Boolean,
          default: false,
        },

        postId: {
          type: String,
          default: null,
        },

        url: {
          type: String,
          default: null,
        },

        error: {
          type: String,
          default: null,
        },

      },

      instagram: {

        success: {
          type: Boolean,
          default: false,
        },

        postId: {
          type: String,
          default: null,
        },

        url: {
          type: String,
          default: null,
        },

        error: {
          type: String,
          default: null,
        },

      },

      tiktok: {

        success: {
          type: Boolean,
          default: false,
        },

        postId: {
          type: String,
          default: null,
        },

        url: {
          type: String,
          default: null,
        },

        error: {
          type: String,
          default: null,
        },

      },

      youtube: {

        success: {
          type: Boolean,
          default: false,
        },

        postId: {
          type: String,
          default: null,
        },

        url: {
          type: String,
          default: null,
        },

        error: {
          type: String,
          default: null,
        },

      },

    },

    // ======================================================
    // 📅 PUBLICATION
    // ======================================================

    publishedAt: {
      type: Date,
      default: null,
    },

  },

  {
    timestamps: true,
  }

);

module.exports =
  mongoose.model(
    "SocialPost",
    SocialPostSchema
  );