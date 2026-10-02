const mongoose =
  require("mongoose");

const communityCommentSchema =
  new mongoose.Schema(
    {
      post: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "CommunityPost",

        required: true,

        index: true,

      },

      author: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },

      text: {

        type: String,

        required: true,

        trim: true,

        minlength: 1,

        maxlength: 2000,

      },

      parentComment: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "CommunityComment",

        default: null,

      },

      likes: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User",

        },

      ],

      likesCount: {

        type: Number,

        default: 0,

        min: 0,

        validate: {

          validator:
            Number.isInteger,

          message:
            "likesCount doit être un nombre entier.",

        },

      },

      repliesCount: {

        type: Number,

        default: 0,

        min: 0,

        validate: {

          validator:
            Number.isInteger,

          message:
            "repliesCount doit être un nombre entier.",

        },

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

communityCommentSchema.index({

  post: 1,

  createdAt: -1,

});

module.exports =
  mongoose.model(
    "CommunityComment",
    communityCommentSchema
  );