const mongoose = require("mongoose");

const communityNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "reply",
        "share",
        "follow",
        "message",
        "mention",
        "story",
        "group",
        "event",
        "system",
      ],
      required: true,
      index: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      default: null,
    },

    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityComment",
      default: null,
    },

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityConversation",
      default: null,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityGroup",
      default: null,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityEvent",
      default: null,
    },

    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

communityNotificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "CommunityNotification",
  communityNotificationSchema
);