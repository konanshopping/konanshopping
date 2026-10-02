const mongoose = require("mongoose");

const messageSchema =
  new mongoose.Schema({

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5000,
    },

    readBy: [
      {
        type: String,
        trim: true,
        maxlength: 254,
      },
    ],

    deletedBy: [
      {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],

    target: {
      type: String,

      enum: [
        "all",
        "new",
      ],

      default: "all",
    },

    recipients: [
      {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],

    createdAt: {
      type: Date,

      default: Date.now,
    },

  });

module.exports =
  mongoose.model(
    "Message",
    messageSchema
  );