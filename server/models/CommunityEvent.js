const mongoose = require("mongoose");

const communityEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
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
      trim: true,
      maxlength: 500,
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
        maxlength: 200,
      },

      address: {
        type: String,
        default: "",
        trim: true,
        maxlength: 500,
      },

      latitude: {
        type: Number,
        default: null,
        min: -90,
        max: 90,
      },

      longitude: {
        type: Number,
        default: null,
        min: -180,
        max: 180,
      },

      online: {
        type: Boolean,
        default: false,
      },

      onlineUrl: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },
    },

    startAt: {
      type: Date,
      required: true,
    },

    endAt: {
      type: Date,
      default: null,
    },

    category: {
      type: String,
      default: "Général",
      trim: true,
      maxlength: 100,
    },

    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        status: {
          type: String,
          enum: [
            "interested",
            "going",
            "not_going",
          ],
          default: "interested",
        },
      },
    ],

    attendeesCount: {
      type: Number,
      default: 0,
      min: 0,

      validate: {
        validator: Number.isInteger,
        message:
          "attendeesCount doit être un nombre entier.",
      },
    },

    visibility: {
      type: String,
      enum: [
        "public",
        "members",
        "private",
      ],
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