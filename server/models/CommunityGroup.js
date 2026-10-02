const mongoose = require("mongoose");

const communityGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    avatar: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    cover: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },

    category: {
      type: String,
      default: "Général",
      trim: true,
      maxlength: 100,
    },

    rules: [
      {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 500,
      },
    ],

    memberCount: {
      type: Number,
      default: 0,
      min: 0,

      validate: {
        validator: Number.isInteger,
        message:
          "memberCount doit être un nombre entier.",
      },
    },

    postsCount: {
      type: Number,
      default: 0,
      min: 0,

      validate: {
        validator: Number.isInteger,
        message:
          "postsCount doit être un nombre entier.",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
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

communityGroupSchema.index({
  name: "text",
  description: "text",
});

module.exports = mongoose.model(
  "CommunityGroup",
  communityGroupSchema
);