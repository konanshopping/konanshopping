const mongoose =
  require("mongoose");

const DriverSchema =
  new mongoose.Schema({

    name: String,

    email: String,

    password: String,

    phone: String,

    city: String,

    vehicle: String,

    plate: String,

    photo: {
      type: String,
      default: "",
    },

    available: {
      type: Boolean,
      default: true,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    currentLocation: {

      lat: {
        type: Number,
        default: 4.0511,
      },

      lng: {
        type: Number,
        default: 9.7679,
      },

    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

  });

module.exports =
  mongoose.model(
    "Driver",
    DriverSchema
  );