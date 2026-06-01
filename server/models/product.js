const mongoose = require("mongoose");

const ProductSchema =
  new mongoose.Schema({

    name: String,

    price: Number,

    image: String,

    category: String,

    description: String,

  reviews: [

  {

    clientId: String,

    name: String,

    rating: Number,

    comment: String,

    images: [String],

    verifiedPurchase: {

      type: Boolean,

      default: false,

    },

    likes: [

      String,

    ],

    dislikes: [

      String,

    ],

    replies: [

      {

        clientId: String,

        name: String,

        comment: String,

        createdAt: {

          type: Date,

          default: Date.now,

        },

      },

    ],

    createdAt: {

      type: Date,

      default: Date.now,

    },

  },

],

});

module.exports = mongoose.model(

  "Product",

  ProductSchema

);