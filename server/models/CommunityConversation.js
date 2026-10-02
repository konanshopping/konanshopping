const mongoose =
  require("mongoose");

const communityConversationSchema =
  new mongoose.Schema(
    {
      type: {
        type: String,

        enum: [
          "private",
          "group"
        ],

        default: "private",

        index: true,
      },

      name: {
        type: String,

        default: "",

        trim: true,

        maxlength: 150,
      },

      avatar: {
        type: String,

        default: "",

        trim: true,

        maxlength: 500,
      },

      participants: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User",

          required: true,
        },
      ],

      admins: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User",
        },
      ],

      lastMessage: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "CommunityMessage",

        default: null,
      },

      lastMessageAt: {
        type: Date,

        default: null,

        index: true,
      },

      unreadCounts: {
        type: Map,

        of: {
          type: Number,

          min: 0,

          validate: {
            validator:
              Number.isInteger,

            message:
              "Le compteur de messages non lus doit être un entier.",
          },
        },

        default: {},
      },

      isArchived: {
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

communityConversationSchema.index({
  participants: 1,
  lastMessageAt: -1,
});

module.exports =
  mongoose.model(
    "CommunityConversation",
    communityConversationSchema
  );