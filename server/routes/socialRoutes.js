const express = require("express");

const router = express.Router();

const SocialPost =
  require("../models/SocialPost");


// ======================================================
// 📱 RÉCUPÉRER TOUTES LES PUBLICATIONS
// ======================================================

router.get("/", async (req, res) => {

  try {

    const posts =
      await SocialPost
        .find()
        .sort({
          createdAt: -1,
        });

    res.json({

      success: true,

      posts,

    });

  } catch (error) {

    console.error(
      "❌ SOCIAL GET POSTS:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Erreur lors de la récupération des publications",

    });

  }

});


// ======================================================
// 📱 RÉCUPÉRER UNE PUBLICATION
// ======================================================

router.get("/:id", async (req, res) => {

  try {

    const post =
      await SocialPost.findById(
        req.params.id
      );

    if (!post) {

      return res.status(404).json({

        success: false,

        message:
          "Publication introuvable",

      });

    }

    res.json({

      success: true,

      post,

    });

  } catch (error) {

    console.error(
      "❌ SOCIAL GET POST:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Erreur serveur",

    });

  }

});


// ======================================================
// 📝 CRÉER UNE PUBLICATION
// ======================================================

router.post("/", async (req, res) => {

  try {

    const {

      videoUrl,
      videoPublicId,
      thumbnailUrl,

      title,
      description,
      hashtags,

      platforms,

    } = req.body;


    if (!videoUrl) {

      return res.status(400).json({

        success: false,

        message:
          "URL de la vidéo manquante",

      });

    }


    const post =
      await SocialPost.create({

        videoUrl,

        videoPublicId:
          videoPublicId || null,

        thumbnailUrl:
          thumbnailUrl || null,

        title:
          title || "",

        description:
          description || "",

        hashtags:
          Array.isArray(hashtags)
            ? hashtags
            : [],

        platforms:
          platforms || {},

        status:
          "draft",

      });


    res.status(201).json({

      success: true,

      message:
        "Publication créée",

      post,

    });

  } catch (error) {

    console.error(
      "❌ SOCIAL CREATE POST:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Erreur lors de la création de la publication",

      error:
        error.message,

    });

  }

});


// ======================================================
// ✏️ MODIFIER UNE PUBLICATION
// ======================================================

router.put("/:id", async (req, res) => {

  try {

    const post =
      await SocialPost.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true,
        }

      );


    if (!post) {

      return res.status(404).json({

        success: false,

        message:
          "Publication introuvable",

      });

    }


    res.json({

      success: true,

      message:
        "Publication mise à jour",

      post,

    });

  } catch (error) {

    console.error(
      "❌ SOCIAL UPDATE POST:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Erreur lors de la modification",

    });

  }

});


// ======================================================
// 🗑️ SUPPRIMER UNE PUBLICATION
// ======================================================

router.delete("/:id", async (req, res) => {

  try {

    const post =
      await SocialPost.findByIdAndDelete(
        req.params.id
      );


    if (!post) {

      return res.status(404).json({

        success: false,

        message:
          "Publication introuvable",

      });

    }


    res.json({

      success: true,

      message:
        "Publication supprimée",

    });

  } catch (error) {

    console.error(
      "❌ SOCIAL DELETE POST:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Erreur lors de la suppression",

    });

  }

});


module.exports = router;