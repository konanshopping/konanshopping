const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================================================
   COMMUNITY — IMAGES
========================================================= */

const communityImageStorage =
  new CloudinaryStorage({
    cloudinary,

    params: {
      folder: "konanshopping/community/images",

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
      ],
    },
  });

const uploadCommunityImage =
  multer({
    storage: communityImageStorage,

    limits: {
      fileSize: 15 * 1024 * 1024,
    },
  });


/* =========================================================
   COMMUNITY — VIDÉOS
========================================================= */

const communityVideoStorage =
  new CloudinaryStorage({
    cloudinary,

    params: {
      folder:
        "konanshopping/community/videos",

      resource_type: "video",

      allowed_formats: [
        "mp4",
        "mov",
        "webm",
      ],
    },
  });

const uploadCommunityVideo =
  multer({
    storage: communityVideoStorage,

    limits: {
      fileSize: 100 * 1024 * 1024,
    },
  });

  // ======================================================
// 📸🎥 UPLOAD MEDIA COMMUNITY — IMAGE OU VIDÉO
// ======================================================

const communityMediaStorage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: (req, file) => {
      return file.mimetype.startsWith("video/")
        ? "konanshopping/community/videos"
        : "konanshopping/community/images";
    },

    resource_type: (req, file) => {
      return file.mimetype.startsWith("video/")
        ? "video"
        : "image";
    },

    allowed_formats: (req, file) => {
      return file.mimetype.startsWith("video/")
        ? ["mp4", "mov", "webm"]
        : ["jpg", "jpeg", "png", "webp"];
    },
  },
});

const uploadCommunityMedia = multer({
  storage: communityMediaStorage,

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  cloudinary,
  uploadCommunityImage,
  uploadCommunityVideo,
  uploadCommunityMedia,
};