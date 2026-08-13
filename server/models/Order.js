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
  },

  phone: {
    type: String,
    default: "",
  },

  address: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    default: "",
  },

  district: {
    type: String,
    default: "",
  },

  shipping: {
    type: Number,
    default: 0,
  },


  // ====================================================
  // 📦 PRODUITS
  // ====================================================

  items: [
    {

      productId: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },

      price: {
        type: Number,
        default: 0,
      },

      quantity: {
        type: Number,
        default: 1,
      },

    },
  ],


  // ====================================================
  // 💰 TOTAL
  // ====================================================

  total: {
    type: Number,
    default: 0,
  },


  // ====================================================
  // 💳 PAIEMENT
  // ====================================================

  paymentMethod: {
    type: String,
    default: "Paiement à la livraison",
  },


  // ====================================================
  // 📍 POSITION DU CLIENT
  // ====================================================
  //
  // Cette position sert à afficher la destination
  // du client sur la carte.
  //
  // ====================================================

  location: {

    lat: {
      type: Number,
      default: null,
    },

    lng: {
      type: Number,
      default: null,
    },

  },


  // ====================================================
  // 📍 POSITION DU LIVREUR
  // ====================================================

  driverLocation: {

    lat: {
      type: Number,
      default: null,
    },

    lng: {
      type: Number,
      default: null,
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
    },

    phone: {
      type: String,
      default: "",
    },

    photo: {
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

  },


  // ====================================================
  // 🔐 QR UNIQUE
  // ====================================================

  deliveryQrToken: {

    type: String,

    unique: true,

    sparse: true,

    index: true,

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