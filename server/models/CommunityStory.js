const mongoose = require("mongoose");

const communityStorySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    media: {
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
      },

      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    text: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    visibility: {
      type: String,
      enum: ["public", "members"],
      default: "public",
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Suppression automatique après expiration
communityStorySchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
  "CommunityStory",
  communityStorySchema
);