const mongoose =
  require("mongoose");

const chatSchema =
  new mongoose.Schema({

    sender: {

      type: String,

      required: true,

      trim: true,

      maxlength: 100,

    },

    receiver: {

      type: String,

      required: true,

      trim: true,

      maxlength: 100,

    },

    message: {

      type: String,

      required: true,

      trim: true,

      maxlength: 2000,

    },

    createdAt: {

      type: Date,

      default: Date.now,

    },

  });

module.exports =
  mongoose.model(
    "Chat",
    chatSchema
  );