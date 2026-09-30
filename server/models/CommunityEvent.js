const mongoose = require("mongoose");

const communityEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    cover: {
      type: String,
      default: "",
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPage",
      default: null,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityGroup",
      default: null,
    },

    location: {
      name: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },

      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },

      online: {
        type: Boolean,
        default: false,
      },

      onlineUrl: {
        type: String,
        default: "",
      },
    },

    startAt: {
      type: Date,
      required: true,
      index: true,
    },

    endAt: {
      type: Date,
      default: null,
    },

    category: {
      type: String,
      default: "Général",
      trim: true,
    },

    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        status: {
          type: String,
          enum: ["interested", "going", "not_going"],
          default: "interested",
        },
      },
    ],

    attendeesCount: {
      type: Number,
      default: 0,
    },

    visibility: {
      type: String,
      enum: ["public", "members", "private"],
      default: "public",
    },

    isCancelled: {
      type: Boolean,
      default: false,
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

communityEventSchema.index({
  title: "text",
  description: "text",
});

communityEventSchema.index({
  startAt: 1,
});

module.exports = mongoose.model(
  "CommunityEvent",
  communityEventSchema
);