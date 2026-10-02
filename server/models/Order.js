const mongoose = require("mongoose");

// ======================================================
// 📦 ORDER SCHEMA — KONAN SHOPPING
// ======================================================

const OrderSchema = new mongoose.Schema({

  // ====================================================
  // 👤 CLIENT
  // ====================================================

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  customerName: {
    type: String,
    default: "",
    trim: true,
    maxlength: 150,
  },

  phone: {
    type: String,
    default: "",
    trim: true,
    maxlength: 30,
  },

  address: {
    type: String,
    default: "",
    trim: true,
    maxlength: 500,
  },

  city: {
    type: String,
    default: "",
    trim: true,
    maxlength: 100,
  },

  district: {
    type: String,
    default: "",
    trim: true,
    maxlength: 150,
  },

  shipping: {
    type: Number,
    default: 0,
    min: 0,
  },


  // ====================================================
  // 📦 PRODUITS
  // ====================================================

  items: [
    {

      productId: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100,
      },

      name: {
        type: String,
        default: "",
        trim: true,
        maxlength: 250,
      },

      image: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2000,
      },

      price: {
        type: Number,
        default: 0,
        min: 0,
      },

      quantity: {
        type: Number,
        default: 1,
        min: 1,
        max: 100,

        validate: {
          validator: Number.isInteger,
          message:
            "La quantité doit être un nombre entier.",
        },
      },

    },
  ],


  // ====================================================
  // 💰 TOTAL
  // ====================================================

  total: {
    type: Number,
    default: 0,
    min: 0,
  },


  // ====================================================
  // 💳 PAIEMENT
  // ====================================================

  paymentMethod: {
    type: String,
    default: "Paiement à la livraison",
    trim: true,
    maxlength: 100,
  },


  // ====================================================
  // 📍 POSITION DU CLIENT
  // ====================================================

  location: {

    lat: {
      type: Number,
      default: null,
      min: -90,
      max: 90,
    },

    lng: {
      type: Number,
      default: null,
      min: -180,
      max: 180,
    },

  },


  // ====================================================
  // 📍 POSITION DU LIVREUR
  // ====================================================

  driverLocation: {

    lat: {
      type: Number,
      default: null,
      min: -90,
      max: 90,
    },

    lng: {
      type: Number,
      default: null,
      min: -180,
      max: 180,
    },

    updatedAt: {
      type: Date,
      default: null,
    },

  },


  // ====================================================
  // 🚚 LIVREUR ASSIGNÉ
  // ====================================================

  assignedDriver: {

    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    name: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 30,
    },

    photo: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
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

  },


  // ====================================================
  // 🔐 QR UNIQUE
  // ====================================================

  deliveryQrToken: {

    type: String,

    unique: true,

    sparse: true,

    index: true,

    trim: true,

    maxlength: 500,

  },


  // ====================================================
  // 📷 QR UTILISÉ
  // ====================================================

  deliveryQrUsedAt: {

    type: Date,

    default: null,

  },


  // ====================================================
  // 🕐 ACCEPTATION
  // ====================================================

  acceptedAt: {

    type: Date,

    default: null,

  },


  // ====================================================
  // ✅ LIVRAISON
  // ====================================================

  deliveredAt: {

    type: Date,

    default: null,

  },


  // ====================================================
  // 📦 STATUT
  // ====================================================

  status: {

    type: String,

    default: "En attente",

    trim: true,

    maxlength: 50,

  },


  // ====================================================
  // 📅 CRÉATION
  // ====================================================

  createdAt: {

    type: Date,

    default: Date.now,

  },

});


module.exports =
  mongoose.model(
    "Order",
    OrderSchema
  );