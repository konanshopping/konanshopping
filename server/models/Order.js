const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  customerName: String,

  phone: String,

  address: String,

  city: String,

  district: String,

  shipping: Number,

 items: [
  {
    productId: String,

    name: String,

    image: String,

    price: Number,

    quantity: Number,
  },
],

  total: Number,

driverLocation: {

  lat: {
    type: Number,
    default: 4.0511,
  },

  lng: {
    type: Number,
    default: 9.7679,
  },

},

driverId: {

  type:
    mongoose.Schema.Types.ObjectId,

  ref: "Driver",

},

driver: {

  name: String,

  phone: String,

  photo: String,

},

  status: {
    type: String,
    default: "En attente",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model(
  "Order",
  OrderSchema
);