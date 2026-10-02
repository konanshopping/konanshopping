const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

/* =========================================================
   🔐 CLOUDINARY
========================================================= */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================================================
   🔐 VALIDATION MÉDIA COMMUNITY
   - Vérifie le MIME déclaré
   - Vérifie l'extension
   - Refuse les fichiers non supportés
========================================================= */

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
];

const VIDEO_EXTENSIONS = [
  "mp4",
  "mov",
  "webm",
];

const IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const VIDEO_MIMES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

function getExtension(filename = "") {
  const parts = String(filename).toLowerCase().split(".");
  return parts.length > 1
    ? parts.pop()
    : "";
}

function validateCommunityFile(file, expectedType = "media") {
  const mimetype = String(file?.mimetype || "").toLowerCase();
  const extension = getExtension(file?.originalname || "");

  const isImage =
    IMAGE_MIMES.includes(mimetype) &&
    IMAGE_EXTENSIONS.includes(extension);

  const isVideo =
    VIDEO_MIMES.includes(mimetype) &&
    VIDEO_EXTENSIONS.includes(extension);

  if (expectedType === "image" && !isImage) {
    throw new Error("Format image non autorisé");
  }

  if (expectedType === "video" && !isVideo) {
    throw new Error("Format vidéo non autorisé");
  }

  if (expectedType === "media" && !isImage && !isVideo) {
    throw new Error("Format média non autorisé");
  }

  return true;
}

/* =========================================================
   COMMUNITY — IMAGES
========================================================= */

const communityImageStorage =
  new CloudinaryStorage({
    cloudinary,

    params: {
      folder: "konanshopping/community/images",

      allowed_formats: IMAGE_EXTENSIONS,
    },
  });

const uploadCommunityImage =
  multer({
    storage: communityImageStorage,

    limits: {
      fileSize: 15 * 1024 * 1024,
      files: 1,
    },

    fileFilter: (req, file, cb) => {
      try {
        validateCommunityFile(file, "image");
        cb(null, true);
      } catch (error) {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "image"));
      }
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

      allowed_formats: VIDEO_EXTENSIONS,
    },
  });

const uploadCommunityVideo =
  multer({
    storage: communityVideoStorage,

    limits: {
      fileSize: 100 * 1024 * 1024,
      files: 1,
    },

    fileFilter: (req, file, cb) => {
      try {
        validateCommunityFile(file, "video");
        cb(null, true);
      } catch (error) {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "video"));
      }
    },
  });

/* =========================================================
   📸🎥 UPLOAD MEDIA COMMUNITY — IMAGE OU VIDÉO
========================================================= */

const communityMediaStorage =
  new CloudinaryStorage({
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
          ? VIDEO_EXTENSIONS
          : IMAGE_EXTENSIONS;
      },
    },
  });

const uploadCommunityMedia =
  multer({
    storage: communityMediaStorage,

    limits: {
      fileSize: 100 * 1024 * 1024,
      files: 1,
    },

    fileFilter: (req, file, cb) => {
      try {
        validateCommunityFile(file, "media");
        cb(null, true);
      } catch (error) {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "media"));
      }
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