const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    media: [
      {
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

        thumbnail: {
          type: String,
          default: "",
        },
      },
    ],

    type: {
      type: String,
      enum: [
        "post",
        "photo",
        "video",
        "poll",
        "shared",
      ],
      default: "post",
    },

    poll: {
      question: {
        type: String,
        default: "",
      },

      options: [
        {
          text: {
            type: String,
            required: true,
          },

          votes: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
        },
      ],

      multipleChoice: {
        type: Boolean,
        default: false,
      },
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    shares: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    visibility: {
      type: String,
      enum: ["public", "members"],
      default: "public",
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

communityPostSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model(
  "CommunityPost",
  communityPostSchema
);