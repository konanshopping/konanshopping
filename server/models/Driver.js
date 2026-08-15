const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({

  // ==========================================
  // 👤 INFORMATIONS LIVREUR
  // ==========================================

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    default: "",
  },

  vehicle: {
    type: String,
    default: "",
  },

  plate: {
    type: String,
    default: "",
  },

  photo: {
    type: String,
    default: "",
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
    },

    lng: {
      type: Number,
      default: 9.7679,
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
    },

    // 📍 Longitude
    lng: {
      type: Number,
      required: true,
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
},

telegramUsername: {
  type: String,
  default: "",
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
},

telegramConnectExpires: {
  type: Date,
  default: null,
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