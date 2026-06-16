const mongoose = require("mongoose");

const messageSchema =
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    readBy: [
      {
        type: String,
      },
    ],

    deletedBy: [
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