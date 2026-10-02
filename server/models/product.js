const mongoose =
  require("mongoose");

const ProductSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 250,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      image: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2000,
      },

      category: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100,
      },

      description: {
        type: String,
        default: "",
        trim: true,
        maxlength: 10000,
      },

      reviews: [
        {
          clientId: {
            type: String,
            trim: true,
            maxlength: 100,
          },

          name: {
            type: String,
            trim: true,
            maxlength: 150,
          },

          rating: {
            type: Number,
            min: 1,
            max: 5,

            validate: {
              validator:
                Number.isInteger,

              message:
                "La note doit être un nombre entier entre 1 et 5.",
            },
          },

          comment: {
            type: String,
            trim: true,
            maxlength: 2000,
          },

          images: [
            {
              type: String,
              trim: true,
              maxlength: 2000,
            },
          ],

          verifiedPurchase: {
            type: Boolean,
            default: false,
          },

          likes: [
            {
              type: String,
              trim: true,
              maxlength: 100,
            },
          ],

          dislikes: [
            {
              type: String,
              trim: true,
              maxlength: 100,
            },
          ],

          replies: [
            {
              clientId: {
                type: String,
                trim: true,
                maxlength: 100,
              },

              name: {
                type: String,
                trim: true,
                maxlength: 150,
              },

              comment: {
                type: String,
                trim: true,
                maxlength: 2000,
              },

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
    },

    {
      // =====================================================
      // DATES AUTOMATIQUES DU PRODUIT
      // =====================================================

      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Product",
    ProductSchema
  );