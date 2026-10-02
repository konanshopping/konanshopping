const express = require("express");

const multer = require("multer");

const axios = require("axios");

const mongoose = require("mongoose");



const router = express.Router();



const Product =

  require("../models/product");



const Order =

  require("../models/Order");

const User =
  require("../models/User");



// ======================

// 🔐 SÉCURITÉ

// ======================



const {

  rateLimit,

} = require("../middleware/security");



const productReadLimiter = rateLimit({

  name: "products-read",

  windowMs: 10 * 60 * 1000,

  max: 300,

});



const reviewLimiter = rateLimit({

  name: "reviews-write",

  windowMs: 10 * 60 * 1000,

  max: 30,

});



const aiSearchLimiter = rateLimit({

  name: "products-ai-search",

  windowMs: 10 * 60 * 1000,

  max: 20,

});



const isValidId = (value) =>

  typeof value === "string" &&

  mongoose.isValidObjectId(value);



const cleanText = (value, maxLength) => {

  if (typeof value !== "string") return "";

  return value.trim().slice(0, maxLength);

};



const escapeRegex = (value) =>

  String(value).replace(

    /[.*+?^${}()|[**\\]\\\**]/g,

    "\\\\$&"

  );



// ======================

// ☁️ CLOUDINARY

// ======================



const cloudinary =

  require("cloudinary").v2;



cloudinary.config({



  cloud_name:

    process.env.CLOUDINARY_CLOUD_NAME,



  api_key:

    process.env.CLOUDINARY_API_KEY,



  api_secret:

    process.env.CLOUDINARY_API_SECRET,



});



// ======================

// 📤 MULTER CLOUDINARY

// ======================



const storage =

  new (

    require("multer-storage-cloudinary")

      .CloudinaryStorage

  )({



    cloudinary,



    params: {



      folder:

        "konanshopping",



      allowed_formats: [

        "jpg",

        "png",

        "jpeg",

        "webp",

      ],



    },



  });



const upload =

  multer({



    storage,



    limits: {

      fileSize:

        5 * 1024 * 1024,



      files: 5,

    },



    fileFilter:

      (req, file, cb) => {



        const allowedMimeTypes = [

          "image/jpeg",

          "image/png",

          "image/webp",

        ];



        const allowedExtensions = [

          ".jpg",

          ".jpeg",

          ".png",

          ".webp",

        ];



        const originalName =

          typeof file.originalname === "string"

            ? file.originalname.toLowerCase()

            : "";



        const extension =

          originalName.includes(".")

            ? originalName.slice(

                originalName.lastIndexOf(".")

              )

            : "";



        if (

          !allowedMimeTypes.includes(

            file.mimetype

          ) ||

          !allowedExtensions.includes(

            extension

          )

        ) {

          return cb(

            new Error(

              "Type de fichier non autorisé"

            )

          );

        }



        cb(null, true);

      },



  });



// ======================

// 🧹 MULTER ERREURS

// ======================



const handleUploadError = (

  err,

  req,

  res,

  next

) => {



  if (

    err instanceof multer.MulterError

  ) {



    return res.status(400).json({

      success: false,

      message:

        "Fichier invalide ou trop volumineux",

    });

  }



  if (err) {



    return res.status(400).json({

      success: false,

      message:

        "Fichier non autorisé",

    });

  }



  next();

};



// ======================

// 🛍️ TOUS LES PRODUITS

// PUBLIC

// ======================



router.get(

  "/",

  productReadLimiter,

  async (req, res) => {



    try {



      const products =

        await Product.find();



      return res.json(

        products

      );



    } catch (err) {



      console.error(

        "Erreur produits:",

        err

      );



      return res.status(500).json({

        error:

          "Erreur serveur",

      });

    }

  }

);



// ======================

// 🛍️ PRODUIT PAR ID

// PUBLIC

// ======================



router.get(

  "/:id",

  productReadLimiter,

  async (req, res) => {



    try {



      const productId =

        typeof req.params.id === "string"

          ? req.params.id.trim()

          : "";



      if (

        !isValidId(productId)

      ) {

        return res.status(400).json({

          message:

            "Produit invalide",

        });

      }



      const product =

        await Product.findById(

          productId

        );



      if (!product) {

        return res.status(404).json({

          message:

            "Produit introuvable",

        });

      }



      return res.json(

        product

      );



    } catch (err) {



      console.error(

        "Erreur produit:",

        err

      );



      return res.status(500).json({

        message:

          "Erreur serveur",

      });

    }

  }

);



// ======================

// 🔎 RECHERCHE NOM

// PUBLIC

// ======================



router.get(

  "/search/:name",

  productReadLimiter,

  async (req, res) => {



    try {



      const keyword =

        cleanText(

          req.params.name,

          100

        );



      if (!keyword) {

        return res.json([]);

      }



      const safeKeyword =

        escapeRegex(keyword);



      const products =

        await Product.find({



          $or: [



            {

              name: {

                $regex:

                  safeKeyword,

                $options: "i",

              },

            },



            {

              category: {

                $regex:

                  safeKeyword,

                $options: "i",

              },

            },



            {

              description: {

                $regex:

                  safeKeyword,

                $options: "i",

              },

            },



          ],



        }).limit(100);



      return res.json(

        products

      );



    } catch (err) {



      console.error(

        "Erreur recherche produits:",

        err

      );



      return res.status(500).json({

        error:

          "Erreur recherche",

      });

    }

  }

);



// ======================

// 🤖 IA IMAGE SEARCH

// ======================



router.post(

  "/ai-search",

  aiSearchLimiter,

  upload.single("image"),

  async (req, res, next) => {



    try {



      if (

        !req.file ||

        !req.file.path

      ) {

        return res.status(400).json({

          success: false,

          error:

            "Image obligatoire",

        });

      }



      if (!process.env.HF_TOKEN) {

        console.error(

          "HF_TOKEN non configuré"

        );



        return res.status(503).json({

          success: false,

          error:

            "Service IA temporairement indisponible",

        });

      }



      // ======================

      // IMAGE CLOUDINARY

      // ======================



      const image =

        req.file.path;



      // ======================

      // HUGGINGFACE

      // ======================



      const response =

        await axios.post(



          "https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224",



          {

            inputs:

              image,

          },



          {

            headers: {

              Authorization:

                `Bearer ${process.env.HF_TOKEN}`,

            },



            timeout:

              15000,



            maxContentLength:

              2 * 1024 * 1024,



            maxBodyLength:

              2 * 1024 * 1024,

          }

        );



      const keyword =

        cleanText(

          response.data?.[0]?.label,

          100

        );



      if (!keyword) {

        return res.json({

          success: true,

          keyword: "",

          count: 0,

          products: [],

        });

      }



      console.log(

        "Mot IA:",

        keyword

      );



      const safeKeyword =

        escapeRegex(keyword);



      const products =

        await Product.find({



          $or: [



            {

              name: {

                $regex:

                  safeKeyword,

                $options: "i",

              },

            },



            {

              category: {

                $regex:

                  safeKeyword,

                $options: "i",

              },

            },



            {

              description: {

                $regex:

                  safeKeyword,

                $options: "i",

              },

            },



          ],



        }).limit(100);



      return res.json({



        success: true,



        keyword,



        count:

          products.length,



        products,



      });



    } catch (err) {



      console.error(

        "Erreur recherche IA:",

        err.response?.status ||

          err.code ||

          err.message

      );



      return res.status(500).json({

        success: false,

        error:

          "Erreur service IA",

      });

    }

  }

);



// ======================

// ⭐ AJOUTER UN AVIS

// PUBLIC COMME DANS LA LOGIQUE ORIGINALE

// ======================



router.post(

  "/:id/review",

  reviewLimiter,

  upload.array(

    "images",

    5

  ),

  async (req, res, next) => {



    try {



      const productId =

        typeof req.params.id === "string"

          ? req.params.id.trim()

          : "";



      if (

        !isValidId(productId)

      ) {

        return res.status(400).json({

          message:

            "Produit invalide",

        });

      }



      const product =

        await Product.findById(

          productId

        );



      if (!product) {

        return res.status(404).json({

          message:

            "Produit introuvable",

        });

      }



      const clientId =

        typeof req.body?.clientId === "string"

          ? req.body.clientId.trim()

          : "";



      const name =

        cleanText(

          req.body?.name,

          100

        );



      const rating =

        Number(req.body?.rating);



      const comment =

        cleanText(

          req.body?.comment,

          2000

        );



      const images =

        req.files?.map(

          (file) => file.path

        ) || [];



      // ======================

      // VALIDATION

      // ======================



      if (

        !clientId ||

        !isValidId(clientId) ||

        !name ||

        !comment ||

        !Number.isInteger(rating) ||

        rating < 1 ||

        rating > 5

      ) {

        return res.status(400).json({

          message:

            "Données avis invalides",

        });

      }



      // ======================

      // SI UN JWT UTILISATEUR

      // EST PRÉSENT, IL DOIT

      // CORRESPONDRE AU CLIENTID

      // ======================



      const authenticatedUserId =

        req.user?.sub ||

        req.user?.id ||

        "";



      if (

        authenticatedUserId &&

        String(authenticatedUserId) !==

          String(clientId)

      ) {

        return res.status(403).json({

          message:

            "Accès refusé",

        });

      }



      // ======================

      // CLIENT EXISTANT

      // ======================



      const reviewUser =

        await User.findById(

          clientId

        ).select(

          "_id name"

        );



      if (!reviewUser) {

        return res.status(404).json({

          message:

            "Utilisateur introuvable",

        });

      }



      // ======================

      // AVIS EXISTANT

      // ======================



      const alreadyReviewed =

        product.reviews.find(

          (review) =>

            String(review.clientId) ===

            String(clientId)

        );



      if (alreadyReviewed) {

        return res.status(400).json({

          message:

            "Vous avez déjà donné un avis",

        });

      }



      // ======================

      // ACHAT VÉRIFIÉ

      // ======================



      const hasPurchased =

        await Order.exists({



          userId:

            clientId,



          "items._id":

            product._id,



        });



      // ======================

      // NOUVEL AVIS

      // ======================



      product.reviews.push({



        clientId,



        name,



        rating,



        comment,



        images,



        verifiedPurchase:

          Boolean(hasPurchased),



        likes: [],



        dislikes: [],



        replies: [],



        createdAt:

          new Date(),



      });



      await product.save();



      return res.json({



        success: true,



        message:

          "Avis ajouté avec succès",



        product,



      });



    } catch (err) {



      console.error(

        "Erreur avis:",

        err

      );



      return res.status(500).json({

        message:

          "Erreur avis",

      });

    }

  }

);



// ======================

// 👍 LIKE REVIEW

// ======================



router.put(

  "/:productId/review/:reviewId/like",

  reviewLimiter,

  async (req, res) => {



    try {



      const productId =

        typeof req.params.productId === "string"

          ? req.params.productId.trim()

          : "";



      const reviewId =

        typeof req.params.reviewId === "string"

          ? req.params.reviewId.trim()

          : "";



      if (

        !isValidId(productId) ||

        !isValidId(reviewId)

      ) {

        return res.status(400).json({

          message:

            "Avis invalide",

        });

      }



      const authenticatedUserId =

        req.user?.sub ||

        req.user?.id ||

        "";



      const clientId =

        authenticatedUserId ||

        (

          typeof req.body?.clientId === "string"

            ? req.body.clientId.trim()

            : ""

        );



      if (

        !clientId ||

        !isValidId(clientId)

      ) {

        return res.status(401).json({

          message:

            "Utilisateur requis",

        });

      }



      if (

        authenticatedUserId &&

        String(authenticatedUserId) !==

          String(clientId)

      ) {

        return res.status(403).json({

          message:

            "Accès refusé",

        });

      }



      const product =

        await Product.findById(

          productId

        );



      if (!product) {

        return res.status(404).json({

          message:

            "Produit introuvable",

        });

      }



      const review =

        product.reviews.id(

          reviewId

        );



      if (!review) {

        return res.status(404).json({

          message:

            "Avis introuvable",

        });

      }



      if (!Array.isArray(review.likes)) {

        review.likes = [];

      }



      if (!Array.isArray(review.dislikes)) {

        review.dislikes = [];

      }



      review.dislikes =

        review.dislikes.filter(

          (id) =>

            String(id) !==

            String(clientId)

        );



      if (

        review.likes.some(

          (id) =>

            String(id) ===

            String(clientId)

        )

      ) {



        review.likes =

          review.likes.filter(

            (id) =>

              String(id) !==

              String(clientId)

          );



      } else {



        review.likes.push(

          clientId

        );

      }



      await product.save();



      return res.json(

        review

      );



    } catch (err) {



      console.error(

        "Erreur like:",

        err

      );



      return res.status(500).json({

        message:

          "Erreur like",

      });

    }

  }

);



// ======================

// 👎 DISLIKE REVIEW

// ======================



router.put(

  "/:productId/review/:reviewId/dislike",

  reviewLimiter,

  async (req, res) => {



    try {



      const productId =

        typeof req.params.productId === "string"

          ? req.params.productId.trim()

          : "";



      const reviewId =

        typeof req.params.reviewId === "string"

          ? req.params.reviewId.trim()

          : "";



      if (

        !isValidId(productId) ||

        !isValidId(reviewId)

      ) {

        return res.status(400).json({

          message:

            "Avis invalide",

        });

      }



      const authenticatedUserId =

        req.user?.sub ||

        req.user?.id ||

        "";



      const clientId =

        authenticatedUserId ||

        (

          typeof req.body?.clientId === "string"

            ? req.body.clientId.trim()

            : ""

        );



      if (

        !clientId ||

        !isValidId(clientId)

      ) {

        return res.status(401).json({

          message:

            "Utilisateur requis",

        });

      }



      if (

        authenticatedUserId &&

        String(authenticatedUserId) !==

          String(clientId)

      ) {

        return res.status(403).json({

          message:

            "Accès refusé",

        });

      }



      const product =

        await Product.findById(

          productId

        );



      if (!product) {

        return res.status(404).json({

          message:

            "Produit introuvable",

        });

      }



      const review =

        product.reviews.id(

          reviewId

        );



      if (!review) {

        return res.status(404).json({

          message:

            "Avis introuvable",

        });

      }



      if (!Array.isArray(review.likes)) {

        review.likes = [];

      }



      if (!Array.isArray(review.dislikes)) {

        review.dislikes = [];

      }



      review.likes =

        review.likes.filter(

          (id) =>

            String(id) !==

            String(clientId)

        );



      if (

        review.dislikes.some(

          (id) =>

            String(id) ===

            String(clientId)

        )

      ) {



        review.dislikes =

          review.dislikes.filter(

            (id) =>

              String(id) !==

              String(clientId)

          );



      } else {



        review.dislikes.push(

          clientId

        );

      }



      await product.save();



      return res.json(

        review

      );



    } catch (err) {



      console.error(

        "Erreur dislike:",

        err

      );



      return res.status(500).json({

        message:

          "Erreur dislike",

      });

    }

  }

);



// ======================

// 💬 RÉPONSE À UN AVIS

// ======================



router.post(

  "/:productId/review/:reviewId/reply",

  reviewLimiter,

  async (req, res) => {



    try {



      const productId =

        typeof req.params.productId === "string"

          ? req.params.productId.trim()

          : "";



      const reviewId =

        typeof req.params.reviewId === "string"

          ? req.params.reviewId.trim()

          : "";



      if (

        !isValidId(productId) ||

        !isValidId(reviewId)

      ) {

        return res.status(400).json({

          message:

            "Avis invalide",

        });

      }



      const clientId =

        typeof req.body?.clientId === "string"

          ? req.body.clientId.trim()

          : "";



      const name =

        cleanText(

          req.body?.name,

          100

        );



      const comment =

        cleanText(

          req.body?.comment,

          2000

        );



      if (

        !clientId ||

        !isValidId(clientId) ||

        !name ||

        !comment

      ) {

        return res.status(400).json({

          message:

            "Données réponse invalides",

        });

      }



      const authenticatedUserId =

        req.user?.sub ||

        req.user?.id ||

        "";



      if (

        authenticatedUserId &&

        String(authenticatedUserId) !==

          String(clientId)

      ) {

        return res.status(403).json({

          message:

            "Accès refusé",

        });

      }



      const product =

        await Product.findById(

          productId

        );



      if (!product) {

        return res.status(404).json({

          message:

            "Produit introuvable",

        });

      }



      const review =

        product.reviews.id(

          reviewId

        );



      if (!review) {

        return res.status(404).json({

          message:

            "Avis introuvable",

        });

      }



      if (!Array.isArray(review.replies)) {

        review.replies = [];

      }



      review.replies.push({



        clientId,



        name,



        comment,



      });



      await product.save();



      return res.json({



        success: true,



        review,



      });



    } catch (err) {



      console.error(

        "Erreur réponse:",

        err

      );



      return res.status(500).json({

        message:

          "Erreur réponse",

      });

    }

  }

);



// ======================================================

// 🛡️ ERREURS MULTER

// ======================================================



router.use(

  handleUploadError

);



module.exports = router;