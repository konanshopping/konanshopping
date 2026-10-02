const mongoose =
  require("mongoose");

const CartSchema =
  new mongoose.Schema({

    userId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    productId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Product",

      required: true,

    },

    quantity: {

      type: Number,

      required: true,

      min: 1,

      max: 100,

      validate: {

        validator: Number.isInteger,

        message:
          "La quantité doit être un nombre entier.",

      },

    },

  }, {

    timestamps: true,

  });

module.exports =
  mongoose.model(
    "Cart",
    CartSchema
  );