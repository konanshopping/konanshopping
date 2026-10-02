const mongoose = require("mongoose");

const communityPageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 150,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      default: "Général",
      trim: true,
      maxlength: 100,
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

    website: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      maxlength: 254,
    },

    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    owner: {
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

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    followersCount: {
      type: Number,
      default: 0,
      min: 0,

      validate: {
        validator: Number.isInteger,
        message:
          "followersCount doit être un nombre entier.",
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

    verified: {
      type: Boolean,
      default: false,
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

communityPageSchema.index({
  name: "text",
  description: "text",
  username: "text",
});

module.exports = mongoose.model(
  "CommunityPage",
  communityPageSchema
);