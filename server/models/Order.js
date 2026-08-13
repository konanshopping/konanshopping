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
  // 💳 MODE DE PAIEMENT
  // ====================================================

  paymentMethod: {
    type: String,
    default: "Paiement à la livraison",
  },


  // ====================================================
  // 📍 POSITION DU LIVREUR
  // ====================================================

  driverLocation: {

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


  // ====================================================
  // 🚚 LIVREUR ASSIGNÉ — NOUVEAU SYSTÈME
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
  // 🔗 ANCIEN DRIVER ID
  // ====================================================
  //
  // On le conserve pour éviter de casser
  // les anciennes parties de ton application.
  //
  // ====================================================

  driverId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref:
      "Driver",

    default:
      null,

  },


  // ====================================================
  // 🚚 ANCIEN OBJET DRIVER
  // ====================================================
  //
  // Compatibilité avec ton ancien système.
  //
  // ====================================================

  driver: {

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
  // 🔐 QR UNIQUE DE LA COMMANDE
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
  // 🕐 DATE D'ACCEPTATION
  // ====================================================

  acceptedAt: {

    type: Date,

    default: null,

  },


  // ====================================================
  // ✅ DATE DE LIVRAISON
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
  // 📅 DATE DE CRÉATION
  // ====================================================

  createdAt: {

    type: Date,

    default: Date.now,

  },

});


// ======================================================
// 📤 EXPORT
// ======================================================

module.exports =
  mongoose.model(
    "Order",
    OrderSchema
  );