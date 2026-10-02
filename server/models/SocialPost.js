const mongoose = require("mongoose");

const SocialPostSchema = new mongoose.Schema(
  {

    // ======================================================
    // 🎬 VIDÉO
    // ======================================================

    videoUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    videoPublicId: {
      type: String,
      default: null,
      trim: true,
      maxlength: 500,
    },

    thumbnailUrl: {
      type: String,
      default: null,
      trim: true,
      maxlength: 2000,
    },

    // ======================================================
    // 📝 CONTENU
    // ======================================================

    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    hashtags: {
      type: [String],
      default: [],

      validate: {
        validator: function (hashtags) {
          return (
            Array.isArray(hashtags) &&
            hashtags.length <= 100
          );
        },

        message:
          "Le nombre de hashtags est trop élevé.",
      },
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
          trim: true,
          maxlength: 500,
        },

        url: {
          type: String,
          default: null,
          trim: true,
          maxlength: 2000,
        },

        error: {
          type: String,
          default: null,
          trim: true,
          maxlength: 2000,
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
          trim: true,
          maxlength: 500,
        },

        url: {
          type: String,
          default: null,
          trim: true,
          maxlength: 2000,
        },

        error: {
          type: String,
          default: null,
          trim: true,
          maxlength: 2000,
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
          trim: true,
          maxlength: 500,
        },

        url: {
          type: String,
          default: null,
          trim: true,
          maxlength: 2000,
        },

        error: {
          type: String,
          default: null,
          trim: true,
          maxlength: 2000,
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
          trim: true,
          maxlength: 500,
        },

        url: {
          type: String,
          default: null,
          trim: true,
          maxlength: 2000,
        },

        error: {
          type: String,
          default: null,
          trim: true,
          maxlength: 2000,
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