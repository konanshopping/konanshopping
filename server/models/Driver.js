const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({

  // ==========================================
  // 👤 INFORMATIONS LIVREUR
  // ==========================================

  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 150,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 254,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  phone: {
    type: String,
    default: "",
    trim: true,
    maxlength: 30,
  },

  city: {
    type: String,
    default: "",
    trim: true,
    maxlength: 100,
  },

  vehicle: {
    type: String,
    default: "",
    trim: true,
    maxlength: 100,
  },

  plate: {
    type: String,
    default: "",
    trim: true,
    maxlength: 50,
  },

  photo: {
    type: String,
    default: "",
    trim: true,
    maxlength: 500,
  },


  // ==========================================
  // 🟢 DISPONIBILITÉ
  // ==========================================

  available: {
    type: Boolean,
    default: true,
  },

  isOnline: {
    type: Boolean,
    default: false,
  },

  lastOnlineAt: {
    type: Date,
    default: null,
  },


  // ==========================================
  // 📍 POSITION ACTUELLE DU LIVREUR
  // ==========================================

  currentLocation: {

    lat: {
      type: Number,
      default: 4.0511,
      min: -90,
      max: 90,
    },

    lng: {
      type: Number,
      default: 9.7679,
      min: -180,
      max: 180,
    },

    updatedAt: {
      type: Date,
      default: null,
    },

  },


  // ==========================================
  // 🗺️ HISTORIQUE DU TRAJET DU LIVREUR
  // ==========================================

  locationHistory: [

    {

      // 📍 Latitude
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },

      // 📍 Longitude
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },

      // 📦 COMMANDE ASSOCIÉE À CETTE POSITION
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
      },

      // 🕐 Heure d'enregistrement
      recordedAt: {
        type: Date,
        default: Date.now,
      },

    },

  ],


  // ==========================================
  // 📲 TELEGRAM
  // ==========================================

  telegramChatId: {
    type: String,
    default: null,
    index: true,
    trim: true,
    maxlength: 100,
  },

  telegramUsername: {
    type: String,
    default: "",
    trim: true,
    maxlength: 100,
  },

  telegramConnected: {
    type: Boolean,
    default: false,
  },

  telegramConnectedAt: {
    type: Date,
    default: null,
  },

  telegramConnectToken: {
    type: String,
    default: null,
    select: false,
  },

  telegramConnectExpires: {
    type: Date,
    default: null,
    select: false,
  },


  // ==========================================
  // 📅 CRÉATION
  // ==========================================

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model(
  "Driver",
  DriverSchema
);