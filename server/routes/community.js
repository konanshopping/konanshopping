const express = require("express");

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");



const CommunityPost = require("../models/CommunityPost");

const CommunityComment = require("../models/CommunityComment");

const CommunityStory = require("../models/CommunityStory");

const CommunityConversation =

  require("../models/CommunityConversation");



const CommunityMessage =

  require("../models/CommunityMessage");

const CommunityNotification =

  require("../models/CommunityNotification");



const CommunityGroup =

  require("../models/CommunityGroup");



const CommunityPage =

  require("../models/CommunityPage");



const CommunityEvent =

  require("../models/CommunityEvent");



const User = require("../models/User");



const {

  cloudinary,

  uploadCommunityImage,

  uploadCommunityVideo,

  uploadCommunityMedia,

} = require("../middleware/communityUpload");



const router = express.Router();



/* =========================================================

   HELPERS

========================================================= */



const getUserId = (req) => {

  return req.communityUserId || null;

};



const getCommunityToken = (req) => {

  const authHeader = String(

    req.headers.authorization || ""

  );



  if (authHeader.startsWith("Bearer ")) {

    return authHeader.slice(7).trim();

  }



  const legacyToken =

    typeof req.headers.token === "string"

      ? req.headers.token.trim()

      : "";



  return legacyToken || null;

};



const COMMUNITY_JWT_SECRET =

  process.env.JWT_SECRET ||

  process.env.USER_JWT_SECRET ||

  "";



if (!COMMUNITY_JWT_SECRET) {

  throw new Error(

    "COMMUNITY JWT secret is missing. Configure JWT_SECRET or USER_JWT_SECRET."

  );

}



const verifyCommunityToken = (token) => {

  if (!token) return null;



  try {

    return jwt.verify(

      token,

      COMMUNITY_JWT_SECRET,

      {

        algorithms: ["HS256"],

      }

    );

  } catch {

    return null;

  }

};



const resolveCommunityIdentity = (payload) => {

  const candidate =

    payload?.sub ||

    payload?.id ||

    payload?._id ||

    null;



  return candidate &&

    mongoose.Types.ObjectId.isValid(candidate)

    ? String(candidate)

    : null;

};



const communityOptionalAuth = (req, res, next) => {

  const token = getCommunityToken(req);



  if (token) {

    const payload =

      verifyCommunityToken(token);



    const userId =

      resolveCommunityIdentity(payload);



    if (userId) {

      req.communityUserId = userId;

      req.communityAuth = payload;

    }

  }



  next();

};



const communityAuth = (req, res, next) => {

  if (!req.communityUserId) {

    return res.status(401).json({

      success: false,

      message:

        "Authentification Community requise.",

    });

  }



  next();

};



const COMMUNITY_RATE_WINDOW_MS =

  60 * 1000;



const COMMUNITY_RATE_MAX =

  120;



const COMMUNITY_RATE_STORE_MAX =

  10000;



const communityRateStore = new Map();



const communityRateLimit = (req, res, next) => {

  const key =

    `${req.communityUserId || "anonymous"}:${req.ip || "unknown"}`;



  const now = Date.now();

  const current =

    communityRateStore.get(key);



  if (

    !current ||

    now - current.startedAt >=

      COMMUNITY_RATE_WINDOW_MS

  ) {

    if (

    !current &&

    communityRateStore.size >=

      COMMUNITY_RATE_STORE_MAX

  ) {

    const oldestKey =

      communityRateStore.keys().next().value;

    if (oldestKey) {

      communityRateStore.delete(oldestKey);

    }

  }



  communityRateStore.set(key, {

      startedAt: now,

      count: 1,

    });



    return next();

  }



  current.count += 1;



  if (

    current.count >

    COMMUNITY_RATE_MAX

  ) {

    return res.status(429).json({

      success: false,

      message:

        "Trop de requêtes Community. Réessayez dans quelques instants.",

    });

  }



  next();

};



const cleanCommunityText = (

  value,

  maxLength

) => {

  if (typeof value !== "string") {

    return "";

  }



  return value

    .replace(/**\0**/g, "")

    .trim()

    .slice(0, maxLength);

};



const isValidObjectId = (id) => {

  return Boolean(id && mongoose.Types.ObjectId.isValid(id));

};



const cleanCommunityUrl = (value, maxLength = 2000) => {

  if (typeof value !== "string") {

    return "";

  }

  return value.trim().slice(0, maxLength);

};



const cleanCommunityAttachments = (attachments) => {

  if (!Array.isArray(attachments)) {

    return [];

  }



  return attachments

    .slice(0, 10)

    .filter((item) => item && typeof item === "object")

    .map((item) => ({

      type: cleanCommunityText(item.type, 30),

      url: cleanCommunityUrl(item.url),

      publicId: cleanCommunityText(item.publicId, 300),

      thumbnail: cleanCommunityUrl(item.thumbnail),

      name: cleanCommunityText(item.name, 200),

      mimeType: cleanCommunityText(item.mimeType, 100),

    }))

    .filter((item) => item.url || item.publicId);

};



// =========================================================

// COMMUNITY SECURITY GATE

// GET routes may remain public when appropriate.

// Every POST/PUT/PATCH/DELETE requires a valid JWT.

// Identity is always derived from the verified token.

// =========================================================

router.use(communityOptionalAuth);



router.use((req, res, next) => {

  if (

    req.method === "GET" ||

    req.method === "HEAD" ||

    req.method === "OPTIONS"

  ) {

    return next();

  }



  return communityAuth(

    req,

    res,

    () =>

      communityRateLimit(

        req,

        res,

        next

      )

  );

});



const formatUser = (user) => {

  if (!user) {

    return {

      _id: null,

      id: null,

      name: "Membre",

      email: "",

      avatar: "",

    };

  }



  return {

    _id: user._id,

    id: user._id,

    name:

      user.name ||

      user.fullName ||

      user.username ||

      user.email ||

      "Membre",

    avatar: user.avatar || "",

  };

};



const formatPost = (post, currentUserId = null) => {

  const likes = Array.isArray(post.likes) ? post.likes : [];

  const saves = Array.isArray(post.saves) ? post.saves : [];



  const liked =

    currentUserId &&

    likes.some(

      (id) => String(id) === String(currentUserId)

    );



  const saved =

    currentUserId &&

    saves.some(

      (id) => String(id) === String(currentUserId)

    );



  return {

    id: post._id,

    _id: post._id,



    content: post.text || "",

    text: post.text || "",



    type: post.type || "post",



    media: Array.isArray(post.media)

      ? post.media

      : [],



    poll: post.poll || null,



    author: post.author

      ? formatUser(post.author)

      : null,



    likesCount: likes.length,

    commentsCount: Number(

      post.commentsCount || 0

    ),

    sharesCount: Number(

      post.shares || 0

    ),



    liked: Boolean(liked),

    saved: Boolean(saved),



    visibility:

      post.visibility || "public",



    createdAt: post.createdAt,

    updatedAt: post.updatedAt,

  };

};





/* =========================================================

   TEST

========================================================= */



router.get("/test", (req, res) => {

  res.json({

    success: true,

    message: "Community API fonctionne correctement",

  });

});





/* =========================================================

   GET POSTS

   GET /api/community/posts

========================================================= */



router.get("/posts", async (req, res) => {

  try {

    const currentUserId =

      getUserId(req);



    const posts = await CommunityPost.find({

      isDeleted: false,

      visibility: {

        $in: ["public", "members"],

      },

    })

      .sort({ createdAt: -1 })

      .limit(100)

      .populate({

        path: "author",

        select:

          "_id name avatar username fullName",

      })

      .lean();



    const formattedPosts = posts.map((post) =>

      formatPost(post, currentUserId)

    );



    res.json({

      success: true,

      posts: formattedPosts,

      count: formattedPosts.length,

    });

  } catch (error) {

    console.error(

      "Community GET posts:",

      error

    );



    res.status(500).json({

      success: false,

      message:

        "Impossible de charger les publications.",

    });

  }

});





/* =========================================================

   CREATE POST

   POST /api/community/posts

========================================================= */



router.post("/posts", async (req, res) => {

  try {

    const {

      text = "",

      type = "text",

      poll = null,

      media = [],

    } = req.body;



    const authorId = getUserId(req);



    if (!isValidObjectId(authorId)) {

      return res.status(401).json({

        success: false,

        message:

          "Utilisateur Community non identifié.",

      });

    }



    const author = await User.findById(

      authorId

    ).select(

      "_id name avatar username fullName"

    );



    if (!author) {

      return res.status(404).json({

        success: false,

        message:

          "Utilisateur introuvable.",

      });

    }



    const cleanText =

      cleanCommunityText(

        text,

        5000

      );



    const cleanMedia = Array.isArray(media)

      ? media

          .filter(Boolean)

          .map((item) => ({

            type:

              item?.type === "video"

                ? "video"

                : "image",



            url:

              typeof item?.url === "string"

                ? item.url

                : "",



            publicId:

              typeof item?.publicId === "string"

                ? item.publicId

                : "",



            thumbnail:

              typeof item?.thumbnail ===

              "string"

                ? item.thumbnail

                : "",

          }))

          .filter(

            (item) => item.url

          )

      : [];



    const cleanPoll =

      poll &&

      Array.isArray(poll.options)

        ? {

            question:

              typeof poll.question ===

              "string"

                ? cleanCommunityText(

                    poll.question,

                    300

                  )

                : "",



            options: poll.options

              .map((option) => ({

                text:

                  typeof option?.text ===

                  "string"

                    ? cleanCommunityText(

                        option.text,

                        200

                      )

                    : "",

                votes: [],

              }))

              .filter(

                (option) => option.text

              ),



            multipleChoice:

              Boolean(

                poll.multipleChoice

              ),

          }

        : undefined;



    if (

      !cleanText &&

      !cleanMedia.length &&

      !cleanPoll?.options?.length

    ) {

      return res.status(400).json({

        success: false,

        message:

          "La publication est vide.",

      });

    }



    let postType = "post";



    if (cleanPoll?.options?.length) {

      postType = "poll";

    } else if (

      cleanMedia.some(

        (item) => item.type === "video"

      )

    ) {

      postType = "video";

    } else if (cleanMedia.length) {

      postType = "photo";

    }



    const post =

      await CommunityPost.create({

        author: author._id,



        text: cleanText,



        type: postType,



        media: cleanMedia,



        poll: cleanPoll,



        likes: [],

        saves: [],

        shares: 0,

        commentsCount: 0,



        visibility: "public",



        isDeleted: false,

      });



    await post.populate({

      path: "author",

      select:

        "_id name avatar username fullName",

    });



    res.status(201).json({

      success: true,



      post: formatPost(

        post,

        author._id

      ),

    });

  } catch (error) {

    console.error(

      "Community CREATE post:",

      error

    );



    res.status(500).json({

      success: false,

      message:

        "Impossible de publier la publication.",

    });

  }

});





/* =========================================================

   LIKE / UNLIKE

   POST /api/community/posts/:postId/like

========================================================= */



router.post(

  "/posts/:postId/like",

  async (req, res) => {

    try {

      const { postId } = req.params;



      const userId = getUserId(req);



      if (

        !isValidObjectId(postId) ||

        !isValidObjectId(userId)

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Publication ou utilisateur invalide.",

        });

      }



      const post =

        await CommunityPost.findOne({

          _id: postId,

          isDeleted: false,

        });



      if (!post) {

        return res.status(404).json({

          success: false,

          message:

            "Publication introuvable.",

        });

      }



      const alreadyLiked =

        post.likes.some(

          (id) =>

            String(id) ===

            String(userId)

        );



      if (alreadyLiked) {

        post.likes.pull(userId);

      } else {

        post.likes.addToSet(userId);

      }



      await post.save();



      res.json({

        success: true,



        liked: !alreadyLiked,



        likesCount:

          post.likes.length,

      });

    } catch (error) {

      console.error(

        "Community LIKE:",

        error

      );



      res.status(500).json({

        success: false,

        message:

          "Impossible de modifier la réaction.",

      });

    }

  }

);





/* =========================================================

   SAVE / UNSAVE

   POST /api/community/posts/:postId/save

========================================================= */



router.post(

  "/posts/:postId/save",

  async (req, res) => {

    try {

      const { postId } = req.params;



      const userId = getUserId(req);



      if (

        !isValidObjectId(postId) ||

        !isValidObjectId(userId)

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Publication ou utilisateur invalide.",

        });

      }



      const post =

        await CommunityPost.findOne({

          _id: postId,

          isDeleted: false,

        });



      if (!post) {

        return res.status(404).json({

          success: false,

          message:

            "Publication introuvable.",

        });

      }



      const alreadySaved =

        post.saves.some(

          (id) =>

            String(id) ===

            String(userId)

        );



      if (alreadySaved) {

        post.saves.pull(userId);

      } else {

        post.saves.addToSet(userId);

      }



      await post.save();



      res.json({

        success: true,



        saved: !alreadySaved,

      });

    } catch (error) {

      console.error(

        "Community SAVE:",

        error

      );



      res.status(500).json({

        success: false,

        message:

          "Impossible de modifier l'enregistrement.",

      });

    }

  }

);





/* =========================================================

   SHARE

   POST /api/community/posts/:postId/share

========================================================= */



router.post(

  "/posts/:postId/share",

  async (req, res) => {

    try {

      const { postId } = req.params;



      if (!isValidObjectId(postId)) {

        return res.status(400).json({

          success: false,

          message:

            "Publication invalide.",

        });

      }



      const post =

        await CommunityPost.findOneAndUpdate(

          {

            _id: postId,

            isDeleted: false,

          },

          {

            $inc: {

              shares: 1,

            },

          },

          {

            new: true,

          }

        );



      if (!post) {

        return res.status(404).json({

          success: false,

          message:

            "Publication introuvable.",

        });

      }



      res.json({

        success: true,



        sharesCount:

          post.shares || 0,

      });

    } catch (error) {

      console.error(

        "Community SHARE:",

        error

      );



      res.status(500).json({

        success: false,

        message:

          "Impossible de partager la publication.",

      });

    }

  }

);





/* =========================================================

   GET COMMENTS

   GET /api/community/posts/:postId/comments

========================================================= */



router.get(

  "/posts/:postId/comments",

  async (req, res) => {

    try {

      const { postId } = req.params;



      if (!isValidObjectId(postId)) {

        return res.status(400).json({

          success: false,

          message:

            "Publication invalide.",

        });

      }



      const comments =

        await CommunityComment.find({

          post: postId,

          isDeleted: false,

        })

          .sort({ createdAt: 1 })

          .populate({

            path: "author",

            select:

              "_id name avatar username fullName",

          })

          .lean();



      const formattedComments =

        comments.map((comment) => ({

          id: comment._id,

          _id: comment._id,



          post: comment.post,



          text: comment.text,



          author: formatUser(

            comment.author

          ),



          parentComment:

            comment.parentComment,



          likesCount:

            Number(

              comment.likesCount || 0

            ),



          repliesCount:

            Number(

              comment.repliesCount || 0

            ),



          createdAt:

            comment.createdAt,



          updatedAt:

            comment.updatedAt,

        }));



      res.json({

        success: true,



        comments:

          formattedComments,



        count:

          formattedComments.length,

      });

    } catch (error) {

      console.error(

        "Community GET comments:",

        error

      );



      res.status(500).json({

        success: false,

        message:

          "Impossible de charger les commentaires.",

      });

    }

  }

);





/* =========================================================

   CREATE COMMENT

   POST /api/community/posts/:postId/comments

========================================================= */



router.post(

  "/posts/:postId/comments",

  async (req, res) => {

    try {

      const { postId } = req.params;



      const userId = getUserId(req);



      const text =

        cleanCommunityText(

          req.body?.text,

          2000

        );



      const parentComment =

        typeof req.body?.parentComment ===

        "string"

          ? req.body.parentComment.trim()

          : null;



      if (!isValidObjectId(postId)) {

        return res.status(400).json({

          success: false,

          message:

            "Publication invalide.",

        });

      }



      if (!isValidObjectId(userId)) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      if (!text) {

        return res.status(400).json({

          success: false,

          message:

            "Le commentaire est vide.",

        });

      }



      const post =

        await CommunityPost.findOne({

          _id: postId,

          isDeleted: false,

        });



      if (!post) {

        return res.status(404).json({

          success: false,

          message:

            "Publication introuvable.",

        });

      }



      const author =

        await User.findById(

          userId

        ).select(

          "_id name avatar username fullName"

        );



      if (!author) {

        return res.status(404).json({

          success: false,

          message:

            "Utilisateur introuvable.",

        });

      }



      if (

        parentComment &&

        !isValidObjectId(parentComment)

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Commentaire parent invalide.",

        });

      }



      const comment =

        await CommunityComment.create({

          post: post._id,



          author: author._id,



          text,



          parentComment:

            parentComment || null,



          likes: [],



          likesCount: 0,



          repliesCount: 0,



          isDeleted: false,

        });



      if (parentComment) {

        await CommunityComment.findByIdAndUpdate(

          parentComment,

          {

            $inc: {

              repliesCount: 1,

            },

          }

        );

      }



      post.commentsCount =

        Number(

          post.commentsCount || 0

        ) + 1;



      await post.save();



      await comment.populate({

        path: "author",

        select:

          "_id name avatar username fullName",

      });



      res.status(201).json({

        success: true,



        comment: {

          id: comment._id,

          _id: comment._id,



          post: comment.post,



          text: comment.text,



          author: formatUser(

            comment.author

          ),



          parentComment:

            comment.parentComment,



          likesCount:

            comment.likesCount,



          repliesCount:

            comment.repliesCount,



          createdAt:

            comment.createdAt,



          updatedAt:

            comment.updatedAt,

        },



        commentsCount:

          post.commentsCount,

      });

    } catch (error) {

      console.error(

        "Community CREATE comment:",

        error

      );



      res.status(500).json({

        success: false,

        message:

          "Impossible de publier le commentaire.",

      });

    }

  }

);







/* =========================================================

   STORIES

========================================================= */



const formatStory = (story, currentUserId = null) => {

  if (!story) return null;



  const viewers = Array.isArray(story.viewers)

    ? story.viewers

    : [];



  const viewed = currentUserId

    ? viewers.some(

        (viewer) =>

          String(viewer.user) === String(currentUserId)

      )

    : false;



  return {

    id: story._id,

    _id: story._id,



    author: story.author

      ? formatUser(story.author)

      : null,



    media: {

      type: story.media?.type || "image",

      url: story.media?.url || "",

      publicId: story.media?.publicId || "",

    },



    text: story.text || "",



    viewersCount: viewers.length,

    viewed,



    visibility:

      story.visibility || "public",



    expiresAt: story.expiresAt,



    createdAt: story.createdAt,

    updatedAt: story.updatedAt,

  };

};





/* =========================================================

   GET STORIES

   GET /api/community/stories

========================================================= */



router.get("/stories", async (req, res) => {

  try {

    const currentUserId =

      getUserId(req);



    const stories =

      await CommunityStory.find({

        isDeleted: false,

        expiresAt: {

          $gt: new Date(),

        },

        visibility: {

          $in: ["public", "members"],

        },

      })

        .sort({ createdAt: -1 })

        .limit(200)

        .populate({

          path: "author",

          select:

            "_id name avatar username fullName",

        })

        .lean();



    const formattedStories =

      stories.map((story) =>

        formatStory(story, currentUserId)

      );



    return res.json({

      success: true,

      stories: formattedStories,

      count: formattedStories.length,

    });



  } catch (error) {

    console.error(

      "Community GET stories:",

      error

    );



    return res.status(500).json({

      success: false,

      message:

        "Impossible de charger les stories.",

    });

  }

});





/* =========================================================

   CREATE STORY

   POST /api/community/stories

========================================================= */



router.post(

  "/stories",

  uploadCommunityMedia.single("file"),



  async (req, res) => {

    try {

      const userId =

        getUserId(req);



      if (!isValidObjectId(userId)) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur Community non identifié.",

        });

      }



      const user =

        await User.findById(userId).select(

          "_id name avatar username fullName"

        );



      if (!user) {

        return res.status(404).json({

          success: false,

          message:

            "Utilisateur introuvable.",

        });

      }



      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:

            "Aucun fichier reçu.",

        });

      }



      const isVideo =

        req.file.mimetype &&

        req.file.mimetype.startsWith("video/");



      const mediaType =

        isVideo ? "video" : "image";



      const expiresAt = new Date(

        Date.now() +

          24 * 60 * 60 * 1000

      );



      const story =

        await CommunityStory.create({

          author: user._id,



          media: {

            type: mediaType,

            url:

              req.file.path ||

              req.file.secure_url ||

              "",

            publicId:

              req.file.filename ||

              req.file.public_id ||

              "",

          },



          text:

            cleanCommunityText(

                req.body?.text,

                1000

              ),



          visibility:

            req.body?.visibility === "members"

              ? "members"

              : "public",



          expiresAt,

          isDeleted: false,

        });



      await story.populate({

        path: "author",

        select:

          "_id name avatar username fullName",

      });



      const formattedStory =

        formatStory(

          story,

          user._id

        );



      const io =

        req.app.get("io");



      if (io) {

        io.emit(

          "community:newStory",

          formattedStory

        );

      }



      return res.status(201).json({

        success: true,

        story: formattedStory,

      });



    } catch (error) {

      console.error(

        "Community CREATE story:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de créer la story.",

        error:

          process.env.NODE_ENV === "development"

            ? error.message

            : undefined,

      });

    }

  }

);





/* =========================================================

   VIEW STORY

   POST /api/community/stories/:storyId/view

========================================================= */



router.post(

  "/stories/:storyId/view",

  async (req, res) => {

    try {

      const { storyId } =

        req.params;



      const userId =

        getUserId(req);



      if (!isValidObjectId(storyId)) {

        return res.status(400).json({

          success: false,

          message:

            "Story invalide.",

        });

      }



      if (!isValidObjectId(userId)) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      const story =

        await CommunityStory.findOne({

          _id: storyId,

          isDeleted: false,

        });



      if (!story) {

        return res.status(404).json({

          success: false,

          message:

            "Story introuvable.",

        });

      }



      if (

        String(story.author) !==

        String(userId)

      ) {

        const alreadyViewed =

          story.viewers.some(

            (viewer) =>

              String(viewer.user) ===

              String(userId)

          );



        if (!alreadyViewed) {

          story.viewers.push({

            user: userId,

            viewedAt: new Date(),

          });



          await story.save();

        }

      }



      return res.json({

        success: true,

        viewed: true,

        viewersCount:

          story.viewers.length,

      });



    } catch (error) {

      console.error(

        "Community STORY VIEW:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible d'enregistrer la vue.",

      });

    }

  }

);





/* =========================================================

   DELETE STORY

   DELETE /api/community/stories/:storyId

========================================================= */



router.delete(

  "/stories/:storyId",

  async (req, res) => {

    try {

      const { storyId } =

        req.params;



      const userId =

        getUserId(req);



      if (!isValidObjectId(storyId)) {

        return res.status(400).json({

          success: false,

          message:

            "Story invalide.",

        });

      }



      if (!isValidObjectId(userId)) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      const story =

        await CommunityStory.findById(

          storyId

        );



      if (!story) {

        return res.status(404).json({

          success: false,

          message:

            "Story introuvable.",

        });

      }



      if (

        String(story.author) !==

        String(userId)

      ) {

        return res.status(403).json({

          success: false,

          message:

            "Vous ne pouvez supprimer que vos propres stories.",

        });

      }



      story.isDeleted = true;

      await story.save();



      const io =

        req.app.get("io");



      if (io) {

        io.emit(

          "community:storyDeleted",

          { storyId }

        );

      }



      return res.json({

        success: true,

        message:

          "Story supprimée.",

      });



    } catch (error) {

      console.error(

        "Community DELETE story:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de supprimer la story.",

      });

    }

  }

);



// ============================================================

// 💬 KONAN COMMUNITY — CONVERSATIONS & MESSAGES

// ============================================================



function formatConversation(conversation, currentUserId) {

  if (!conversation) return null;



  const currentId = String(currentUserId || "");



  const participants = Array.isArray(conversation.participants)

    ? conversation.participants

    : [];



  const otherParticipant =

    conversation.type === "private"

      ? participants.find(

          (participant) =>

            String(participant?._id || participant?.id) !== currentId

        )

      : null;



  let unread = 0;



  try {

    unread = Number(

      conversation.unreadCounts?.get?.(currentId) ||

      conversation.unreadCounts?.[currentId] ||

      0

    );

  } catch {

    unread = 0;

  }



  return {

    id: conversation._id,



    type: conversation.type,



    name:

      conversation.name ||

      otherParticipant?.name ||

      otherParticipant?.fullName ||

      "Conversation",



    avatar:

      conversation.avatar ||

      otherParticipant?.avatar ||

      "",



    user: otherParticipant

      ? {

          id: otherParticipant._id,

          name:

            otherParticipant.name ||

            otherParticipant.fullName ||

            otherParticipant.username ||

            "Membre",

          avatar: otherParticipant.avatar || "",

          verified: Boolean(otherParticipant.verified),

          online: Boolean(otherParticipant.online),

        }

      : null,



    participants: participants.map((participant) => ({

      id: participant?._id || participant?.id,

      name:

        participant?.name ||

        participant?.fullName ||

        participant?.username ||

        "Membre",

      avatar: participant?.avatar || "",

      verified: Boolean(participant?.verified),

    })),



    admins: conversation.admins || [],



    lastMessage: conversation.lastMessage || null,



    lastMessageAt: conversation.lastMessageAt || null,



    unread,



    createdAt: conversation.createdAt,

    updatedAt: conversation.updatedAt,

  };

}





function formatMessage(message, currentUserId) {

  if (!message) return null;



  const sender = message.sender || {};



  return {

    id: message._id,



    conversation:

      message.conversation?._id ||

      message.conversation ||

      null,



    text: message.isDeleted

      ? "Message supprimé"

      : message.text || "",



    attachments: message.attachments || [],



    replyTo: message.replyTo

      ? {

          id: message.replyTo._id,

          text: message.replyTo.text || "",

          sender: message.replyTo.sender

            ? {

                id: message.replyTo.sender._id,

                name:

                  message.replyTo.sender.name ||

                  message.replyTo.sender.fullName ||

                  "Membre",

                avatar:

                  message.replyTo.sender.avatar || "",

              }

            : null,

        }

      : null,



    reactions: message.reactions || [],



    readBy: message.readBy || [],



    sender: {

      id: sender._id || sender.id,



      name:

        sender.name ||

        sender.fullName ||

        sender.username ||

        "Membre",



      avatar: sender.avatar || "",



      verified: Boolean(sender.verified),

    },



    senderId: sender._id || sender.id,



    me:

      Boolean(

        currentUserId &&

        String(sender._id || sender.id) ===

          String(currentUserId)

      ),



    isEdited: Boolean(message.isEdited),



    isDeleted: Boolean(message.isDeleted),



    createdAt: message.createdAt,



    updatedAt: message.updatedAt,



    time: message.createdAt

      ? new Date(message.createdAt).toLocaleTimeString(

          "fr-FR",

          {

            hour: "2-digit",

            minute: "2-digit",

          }

        )

      : "",

  };

}





// ============================================================

// GET — MES CONVERSATIONS

// ============================================================



router.get(

  "/conversations",

  communityAuth,

  async (req, res) => {



    try {



      const currentUserId = getUserId(req);



      if (!currentUserId) {

        return res.status(401).json({

          success: false,

          message: "Utilisateur non identifié.",

        });

      }



      if (!isValidObjectId(currentUserId)) {

        return res.status(400).json({

          success: false,

          message: "Identifiant utilisateur invalide.",

        });

      }



      const conversations =

        await CommunityConversation

          .find({

            participants: currentUserId,

            isDeleted: { $ne: true },

          })

          .populate(

            "participants",

            "name fullName username avatar verified"

          )

          .sort({

            lastMessageAt: -1,

            updatedAt: -1,

          });



      return res.json({

        success: true,



        conversations:

          conversations.map((conversation) =>

            formatConversation(

              conversation,

              currentUserId

            )

          ),



        count: conversations.length,

      });



    } catch (error) {



      console.error(

        "❌ COMMUNITY GET CONVERSATIONS:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de charger les conversations.",

      });



    }



  }

);





// ============================================================

// POST — CRÉER / RÉCUPÉRER UNE CONVERSATION PRIVÉE

// ============================================================



router.post(

  "/conversations/private",

  async (req, res) => {



    try {



      const currentUserId =

        getUserId(req);



      const { participantId } =

        req.body;



      if (!currentUserId || !participantId) {

        return res.status(400).json({

          success: false,

          message:

            "Les deux utilisateurs sont requis.",

        });

      }



      if (

        !isValidObjectId(currentUserId) ||

        !isValidObjectId(participantId)

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Identifiant utilisateur invalide.",

        });

      }



      if (

        String(currentUserId) ===

        String(participantId)

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Vous ne pouvez pas créer une conversation avec vous-même.",

        });

      }



      const users =

        await User.find({

          _id: {

            $in: [

              currentUserId,

              participantId,

            ],

          },

        }).select(

          "name fullName username avatar verified"

        );



      if (users.length !== 2) {

        return res.status(404).json({

          success: false,

          message:

            "Un des utilisateurs n'existe pas.",

        });

      }



      let conversation =

        await CommunityConversation

          .findOne({

            type: "private",



            participants: {

              $all: [

                currentUserId,

                participantId,

              ],

            },



            $expr: {

              $eq: [

                {

                  $size: "$participants",

                },

                2,

              ],

            },



            isDeleted: {

              $ne: true,

            },

          })

          .populate(

            "participants",

            "name fullName username avatar verified"

          );



      let created = false;



      if (!conversation) {



        conversation =

          await CommunityConversation.create({

            type: "private",



            participants: [

              currentUserId,

              participantId,

            ],



            admins: [

              currentUserId,

            ],



            unreadCounts: {

              [String(currentUserId)]: 0,

              [String(participantId)]: 0,

            },

          });



        created = true;



        conversation =

          await CommunityConversation

            .findById(conversation._id)

            .populate(

              "participants",

              "name fullName username avatar verified"

            );

      }



      return res.status(created ? 201 : 200).json({

        success: true,



        created,



        conversation:

          formatConversation(

            conversation,

            currentUserId

          ),

      });



    } catch (error) {



      console.error(

        "❌ COMMUNITY PRIVATE CONVERSATION:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de créer la conversation.",

      });



    }



  }

);





// ============================================================

// POST — CRÉER UN GROUPE

// ============================================================



router.post(

  "/conversations/group",

  async (req, res) => {



    try {



      const currentUserId =

        getUserId(req);



      const {

        name,

        participants = [],

        avatar = "",

      } = req.body;



      const cleanGroupName =

        cleanCommunityText(name, 100);



      const cleanGroupAvatar =

        cleanCommunityUrl(avatar, 2000);



      if (!currentUserId) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      if (!cleanGroupName) {

        return res.status(400).json({

          success: false,

          message:

            "Le nom du groupe est requis.",

        });

      }



      if (!Array.isArray(participants)) {

        return res.status(400).json({

          success: false,

          message:

            "La liste des participants est invalide.",

        });

      }



      if (participants.length > 99) {

        return res.status(400).json({

          success: false,

          message:

            "Le groupe contient trop de participants.",

        });

      }



      const participantIds = [

        currentUserId,

        ...participants,

      ]

        .map((id) => String(id))

        .filter(

          (id, index, array) =>

            array.indexOf(id) === index

        );



      if (

        participantIds.some(

          (id) => !isValidObjectId(id)

        )

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Un identifiant de participant est invalide.",

        });

      }



      if (participantIds.length < 2) {

        return res.status(400).json({

          success: false,

          message:

            "Un groupe doit contenir au moins deux membres.",

        });

      }



      const users =

        await User.find({

          _id: {

            $in: participantIds,

          },

        }).select(

          "name fullName username avatar verified"

        );



      if (

        users.length !== participantIds.length

      ) {

        return res.status(404).json({

          success: false,

          message:

            "Un ou plusieurs participants n'existent pas.",

        });

      }



      const unreadCounts = {};



      participantIds.forEach((id) => {

        unreadCounts[id] = 0;

      });



      const conversation =

        await CommunityConversation.create({

          type: "group",



          name:

            cleanGroupName,

          avatar:

            cleanGroupAvatar,



          participants:

            participantIds,



          admins: [

            currentUserId,

          ],



          unreadCounts,

        });



      const populated =

        await CommunityConversation

          .findById(conversation._id)

          .populate(

            "participants",

            "name fullName username avatar verified"

          );



      return res.status(201).json({

        success: true,



        conversation:

          formatConversation(

            populated,

            currentUserId

          ),

      });



    } catch (error) {



      console.error(

        "❌ COMMUNITY CREATE GROUP:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de créer le groupe.",

      });



    }



  }

);





// ============================================================

// GET — MESSAGES D'UNE CONVERSATION

// ============================================================



router.get(

  "/conversations/:conversationId/messages",

  communityAuth,

  async (req, res) => {



    try {



      const currentUserId =

        getUserId(req);



      const {

        conversationId,

      } = req.params;



      if (!currentUserId) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      if (

        !isValidObjectId(

          conversationId

        )

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Conversation invalide.",

        });

      }



      const conversation =

        await CommunityConversation.findOne({

          _id: conversationId,



          participants:

            currentUserId,



          isDeleted: {

            $ne: true,

          },

        });



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:

            "Conversation introuvable ou accès refusé.",

        });

      }



      const limit = Math.min(

        Math.max(

          Number(req.query.limit) || 50,

          1

        ),

        100

      );



      const messages =

        await CommunityMessage

          .find({

            conversation:

              conversationId,



            isDeleted: {

              $ne: true,

            },

          })

          .populate(

            "sender",

            "name fullName username avatar verified"

          )

          .populate({

            path: "replyTo",

            populate: {

              path: "sender",

              select:

                "name fullName username avatar verified",

            },

          })

          .sort({

            createdAt: -1,

          })

          .limit(limit);



      messages.reverse();



      return res.json({

        success: true,



        messages:

          messages.map((message) =>

            formatMessage(

              message,

              currentUserId

            )

          ),



        count: messages.length,

      });



    } catch (error) {



      console.error(

        "❌ COMMUNITY GET MESSAGES:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de charger les messages.",

      });



    }



  }

);





// ============================================================

// POST — ENVOYER UN MESSAGE

// ============================================================



router.post(

  "/conversations/:conversationId/messages",

  async (req, res) => {



    try {



      const currentUserId =

        getUserId(req);



      const {

        conversationId,

        } = req.params;



      const {

        text = "",

        attachments = [],

        replyTo = null,

      } = req.body;



      const cleanAttachments =

        cleanCommunityAttachments(attachments);



      if (!currentUserId) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      if (

        !isValidObjectId(

          conversationId

        )

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Conversation invalide.",

        });

      }



      const conversation =

        await CommunityConversation.findOne({

          _id: conversationId,



          participants:

            currentUserId,



          isDeleted: {

            $ne: true,

          },

        });



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:

            "Conversation introuvable ou accès refusé.",

        });

      }



      const cleanText =

        cleanCommunityText(

          String(text || ""),

          5000

        );



      if (

        !cleanText &&

        !cleanAttachments.length

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Le message ne peut pas être vide.",

        });

      }



      let validReplyTo = null;



      if (replyTo) {



        if (

          !isValidObjectId(replyTo)

        ) {

          return res.status(400).json({

            success: false,

            message:

              "Message de réponse invalide.",

          });

        }



        const repliedMessage =

          await CommunityMessage.findOne({

            _id: replyTo,



            conversation:

              conversationId,

        });



        if (!repliedMessage) {

          return res.status(404).json({

            success: false,

            message:

              "Le message auquel vous répondez n'existe pas.",

          });

        }



        validReplyTo = repliedMessage._id;

      }



      const message =

        await CommunityMessage.create({

          conversation:

            conversationId,



          sender:

            currentUserId,



          text:

            cleanText,



          attachments:

            cleanAttachments,



          replyTo:

            validReplyTo,

        });



      conversation.lastMessage =

        cleanText ||

        (

          cleanAttachments.length

            ? "📎 Pièce jointe"

            : ""

        );



      conversation.lastMessageAt =

        new Date();



      for (

        const participantId of

        conversation.participants

      ) {



        const participantKey =

          String(participantId);



        if (

          participantKey !==

          String(currentUserId)

        ) {



          const currentUnread =

            Number(

              conversation

                .unreadCounts

                ?.get?.(

                  participantKey

                ) ||

              conversation

                .unreadCounts?.[

                  participantKey

                ] ||

              0

            );



          if (

            conversation.unreadCounts

              ?.set

          ) {



            conversation.unreadCounts.set(

              participantKey,

              currentUnread + 1

            );



          } else {



            conversation.unreadCounts =

              conversation.unreadCounts ||

              {};



            conversation.unreadCounts[

              participantKey

            ] =

              currentUnread + 1;

          }



        }



      }



      if (

        conversation.unreadCounts

          ?.set

      ) {

        conversation.unreadCounts.set(

          String(currentUserId),

          0

        );

      }



      await conversation.save();



      const populatedMessage =

        await CommunityMessage

          .findById(message._id)

          .populate(

            "sender",

            "name fullName username avatar verified"

          )

          .populate({

            path: "replyTo",

            populate: {

              path: "sender",

              select:

                "name fullName username avatar verified",

            },

          });



      const formatted =

        formatMessage(

          populatedMessage,

          currentUserId

        );



      const io =

        req.app.get("io");



      if (io) {



        io.to(

          `community:conversation:${conversationId}`

        ).emit(

          "community:newMessage",

          {

            conversationId,

            message: formatted,

          }

        );



      }



      return res.status(201).json({

        success: true,



        message:

          formatted,

      });



    } catch (error) {



      console.error(

        "❌ COMMUNITY SEND MESSAGE:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible d'envoyer le message.",

      });



    }



  }

);





// ============================================================

// POST — MARQUER LA CONVERSATION COMME LUE

// ============================================================



router.post(

  "/conversations/:conversationId/read",

  async (req, res) => {



    try {



      const currentUserId =

        getUserId(req);



      const {

        conversationId,

      } = req.params;



      if (!currentUserId) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      const conversation =

        await CommunityConversation.findOne({

          _id: conversationId,



          participants:

            currentUserId,



          isDeleted: {

            $ne: true,

          },

        });



      if (!conversation) {

        return res.status(404).json({

          success: false,

          message:

            "Conversation introuvable.",

        });

      }



      if (

        conversation.unreadCounts

          ?.set

      ) {



        conversation.unreadCounts.set(

          String(currentUserId),

          0

        );



      }



      await conversation.save();



      await CommunityMessage.updateMany(

        {

          conversation:

            conversationId,



          sender: {

            $ne: currentUserId,

          },



          readBy: {

            $ne: currentUserId,

          },

        },

        {

          $addToSet: {

            readBy:

              currentUserId,

          },

        }

      );



      return res.json({

        success: true,

        message:

          "Conversation marquée comme lue.",

      });



    } catch (error) {



      console.error(

        "❌ COMMUNITY READ CONVERSATION:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de marquer la conversation comme lue.",

      });



    }



  }

);





// ============================================================

// POST — RÉACTION À UN MESSAGE

// ============================================================



router.post(

  "/messages/:messageId/reaction",

  async (req, res) => {



    try {



      const currentUserId =

        getUserId(req);



      const {

        messageId,

      } = req.params;



      const {

        reaction,

      } = req.body;



      if (!currentUserId) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      if (

        !isValidObjectId(

          messageId

        )

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Message invalide.",

        });

      }



      if (

        (!reaction ||

        typeof reaction !== "string" ||

        reaction.trim().length > 30)

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Réaction invalide.",

        });

      }



      const message =

        await CommunityMessage

          .findById(messageId);



      if (!message) {

        return res.status(404).json({

          success: false,

          message:

            "Message introuvable.",

        });

      }



      const conversation =

        await CommunityConversation.findOne({

          _id:

            message.conversation,



          participants:

            currentUserId,



          isDeleted: {

            $ne: true,

          },

        });



      if (!conversation) {

        return res.status(403).json({

          success: false,

          message:

            "Accès refusé.",

        });

      }



      if (

        !Array.isArray(

          message.reactions

        )

      ) {

        message.reactions = [];

      }



      const existingIndex =

        message.reactions.findIndex(

          (item) =>

            String(

              item.user ||

              item.userId ||

              ""

            ) ===

              String(currentUserId)

        );



      if (

        existingIndex >= 0

      ) {



        if (

          String(

            message.reactions[

              existingIndex

            ].reaction

          ) ===

          reaction

        ) {



          message.reactions.splice(

            existingIndex,

            1

          );



        } else {



          message.reactions[

            existingIndex

          ].reaction =

            reaction;



        }



      } else {



        message.reactions.push({

          user:

            currentUserId,



          reaction,

        });



      }



      await message.save();



      const populated =

        await CommunityMessage

          .findById(message._id)

          .populate(

            "sender",

            "name fullName username avatar verified"

          );



      const formatted =

        formatMessage(

          populated,

          currentUserId

        );



      const io =

        req.app.get("io");



      if (io) {



        io.to(

          `community:conversation:${message.conversation}`

        ).emit(

          "community:messageReaction",

          {

            conversationId:

              message.conversation,

            message:

              formatted,

          }

        );



      }



      return res.json({

        success: true,

        message:

          formatted,

      });



    } catch (error) {



      console.error(

        "❌ COMMUNITY MESSAGE REACTION:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de modifier la réaction.",

      });



    }



  }

);





// ============================================================

// DELETE — SUPPRIMER SON MESSAGE

// ============================================================



router.delete(

  "/messages/:messageId",

  async (req, res) => {



    try {



      const currentUserId =

        getUserId(req);



      const {

        messageId,

      } = req.params;



      if (!currentUserId) {

        return res.status(401).json({

          success: false,

          message:

            "Utilisateur non identifié.",

        });

      }



      const message =

        await CommunityMessage.findOne({

          _id: messageId,



          sender:

            currentUserId,



          isDeleted: {

            $ne: true,

          },

        });



      if (!message) {

        return res.status(404).json({

          success: false,

          message:

            "Message introuvable ou suppression non autorisée.",

        });

      }



      message.isDeleted = true;



      message.text = "";



      message.attachments = [];



      await message.save();



      const formatted =

        formatMessage(

          message,

          currentUserId

        );



      const io =

        req.app.get("io");



      if (io) {



        io.to(

          `community:conversation:${message.conversation}`

        ).emit(

          "community:messageDeleted",

          {

            conversationId:

              message.conversation,



            messageId:

              message._id,

          }

        );



      }



      return res.json({

        success: true,



        message:

          formatted,

      });



    } catch (error) {



      console.error(

        "❌ COMMUNITY DELETE MESSAGE:",

        error

      );



      return res.status(500).json({

        success: false,

        message:

          "Impossible de supprimer le message.",

      });



    }



  }

);



// ============================================================

// 🚀 COMMUNITY — BOOTSTRAP

// GET /api/community/bootstrap

// ============================================================



router.get("/bootstrap", async (req, res) => {

  try {

    const currentUserId =

      getUserId(req);



    const stories = await CommunityStory.find({

      isDeleted: false,

      expiresAt: { $gt: new Date() },

      visibility: { $in: ["public", "members"] },

    })

      .sort({ createdAt: -1 })

      .limit(200)

      .populate({

        path: "author",

        select: "_id name avatar username fullName verified",

      })

      .lean();



    const contacts = await User.find({

      communityMember: true,

    })

      .select(

        "_id name avatar username fullName verified communityRole communityJoinedAt"

      )

      .sort({ communityJoinedAt: -1 })

      .limit(100)

      .lean();



    let notifications = [];

    if (isValidObjectId(currentUserId)) {

      notifications = await CommunityNotification.find({

        recipient: currentUserId,

      })

        .populate(

          "actor",

          "_id name avatar username fullName verified"

        )

        .sort({ createdAt: -1 })

        .limit(50)

        .lean();

    }



    let conversations = [];

    if (isValidObjectId(currentUserId)) {

      conversations = await CommunityConversation.find({

        participants: currentUserId,

        isDeleted: { $ne: true },

        isArchived: { $ne: true },

      })

        .populate(

          "participants",

          "_id name avatar username fullName verified"

        )

        .populate(

          "admins",

          "_id name avatar username fullName verified"

        )

        .sort({

          lastMessageAt: -1,

          updatedAt: -1,

        })

        .limit(100);

    }



    let groups = [];

    try {

      groups = await CommunityGroup.find({

        isDeleted: { $ne: true },

      })

        .sort({ updatedAt: -1 })

        .limit(100)

        .lean();

    } catch (groupError) {

      console.error(

        "⚠️ COMMUNITY GROUPS BOOTSTRAP:",

        groupError.message

      );

    }



    let pages = [];

    try {

      pages = await CommunityPage.find({

        isDeleted: { $ne: true },

      })

        .sort({ updatedAt: -1 })

        .limit(100)

        .lean();

    } catch (pageError) {

      console.error(

        "⚠️ COMMUNITY PAGES BOOTSTRAP:",

        pageError.message

      );

    }



    let events = [];

    try {

      events = await CommunityEvent.find({

        isDeleted: { $ne: true },

      })

        .sort({

          startAt: 1,

          createdAt: -1,

        })

        .limit(100)

        .lean();

    } catch (eventError) {

      console.error(

        "⚠️ COMMUNITY EVENTS BOOTSTRAP:",

        eventError.message

      );

    }



    // Pas de données fictives.

    const videos = [];

    const marketplaceProducts = [];

    const trends = [];



    let people = [];

    if (isValidObjectId(currentUserId)) {

      people = await User.find({

        communityMember: true,

        _id: { $ne: currentUserId },

      })

        .select(

          "_id name avatar username fullName verified communityRole communityJoinedAt"

        )

        .sort({ communityJoinedAt: -1 })

        .limit(50)

        .lean();

    }



    return res.json({

      success: true,



      stories: stories.map((story) =>

        formatStory(story, currentUserId)

      ),



      contacts,



      notifications,



      conversations: conversations.map((conversation) =>

        formatConversation(conversation, currentUserId)

      ),



      groups,



      pages,



      videos,



      events,



      marketplaceProducts,



      trends,



      people,

    });



  } catch (error) {

    console.error(

      "❌ COMMUNITY BOOTSTRAP ERROR:",

      error

    );



    return res.status(500).json({

      success: false,

      message:

        "Impossible de charger les données Community.",

      error:

        process.env.NODE_ENV === "production"

          ? undefined

          : error.message,

    });

  }

});





setInterval(() => {

  const now = Date.now();



  for (const [key, value] of communityRateStore.entries()) {

    if (

      now - value.startedAt >=

      COMMUNITY_RATE_WINDOW_MS

    ) {

      communityRateStore.delete(key);

    }

  }

}, COMMUNITY_RATE_WINDOW_MS).unref();



module.exports = router;