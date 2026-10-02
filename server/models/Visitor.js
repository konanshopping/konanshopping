const mongoose =
  require("mongoose");

const visitorSchema =
  new mongoose.Schema({

    ip: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    country: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    city: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    device: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    pagesVisited: {
      type: Number,
      default: 1,
      min: 0,

      validate: {
        validator: Number.isInteger,
        message:
          "pagesVisited doit être un nombre entier.",
      },
    },

    online: {
      type: Boolean,
      default: true,
    },

    lastVisit: {
      type: Date,
      default: Date.now,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

  });

module.exports =
  mongoose.model(
    "Visitor",
    visitorSchema
  );