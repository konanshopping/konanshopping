import {
  useState,
  useRef,
  useEffect
} from "react";

import axios from "axios";

import {
  FaCloudUploadAlt,
  FaVideo,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTrash,
  FaPaperPlane,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaHashtag,
  FaImage,
} from "react-icons/fa";

import "./AdminSocial.css";


function AdminSocial() {

  // =====================================================
  // 🌐 URL API
  // =====================================================

  const API_URL =
    "https://konanshopping.com";


  // =====================================================
  // 🎬 VIDÉO
  // =====================================================

  const [video, setVideo] =
    useState(null);

  const [videoPreview, setVideoPreview] =
    useState("");


  // =====================================================
  // 📝 CONTENU
  // =====================================================

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [hashtags, setHashtags] =
    useState("");


  // =====================================================
  // 📱 PLATEFORMES
  // =====================================================

  const [selectedPlatforms, setSelectedPlatforms] =
    useState([]);


  // =====================================================
  // 🚀 PUBLICATION
  // =====================================================

  const [publishing, setPublishing] =
    useState(false);

  const [published, setPublished] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // 📚 HISTORIQUE
  // =====================================================

  const [socialPosts, setSocialPosts] =
    useState([]);

  const [loadingPosts, setLoadingPosts] =
    useState(true);

  const [postsError, setPostsError] =
    useState("");


  // =====================================================
  // 📁 INPUT VIDÉO
  // =====================================================

  const fileInputRef =
    useRef(null);


  // =====================================================
  // 📱 PLATEFORMES
  // =====================================================

  const platforms = [

    {
      id: "facebook",
      name: "Facebook",
      icon: <FaFacebook />,
      color: "#1877F2",
    },

    {
      id: "instagram",
      name: "Instagram",
      icon: <FaInstagram />,
      color: "#E1306C",
    },

    {
      id: "tiktok",
      name: "TikTok",
      icon: <FaTiktok />,
      color: "#111111",
    },

    {
      id: "youtube",
      name: "YouTube",
      icon: <FaYoutube />,
      color: "#FF0000",
    },

  ];


  // =====================================================
  // 📚 CHARGER HISTORIQUE
  // =====================================================

  useEffect(() => {

    let cancelled = false;


    const loadSocialPosts = async () => {

      try {

        setLoadingPosts(true);

        setPostsError("");


        console.log(
          "📚 Chargement des publications sociales..."
        );


        const response =
          await axios.get(
            `${API_URL}/api/social`,
            {
              timeout: 30000,
            }
          );


        console.log(
          "📱 SOCIAL POSTS :",
          response.data
        );


        if (cancelled) {
          return;
        }


        if (
          response.data?.success
        ) {

          setSocialPosts(
            Array.isArray(
              response.data.posts
            )
              ? response.data.posts
              : []
          );

        } else {

          setSocialPosts([]);

        }

      }

      catch (error) {

        if (cancelled) {
          return;
        }


        console.error(
          "❌ CHARGEMENT SOCIAL POSTS :",
          error
        );


        setPostsError(
          error?.response?.data?.message ||
          "Impossible de récupérer les publications."
        );

      }

      finally {

        if (!cancelled) {

          setLoadingPosts(false);

        }

      }

    };


    loadSocialPosts();


    return () => {

      cancelled = true;

    };

  }, []);


  // =====================================================
  // 🎬 SÉLECTION VIDÉO
  // =====================================================

  const handleVideoChange = (e) => {

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    setError("");

    setPublished(false);


    // ===================================================
    // TYPE
    // ===================================================

    if (
      !file.type.startsWith("video/")
    ) {

      setError(
        "Veuillez sélectionner une vidéo valide."
      );


      if (fileInputRef.current) {

        fileInputRef.current.value =
          "";

      }


      return;

    }


    // ===================================================
    // TAILLE
    // ===================================================

    if (
      file.size >
      200 * 1024 * 1024
    ) {

      setError(
        "La vidéo ne doit pas dépasser 200 MB."
      );


      if (fileInputRef.current) {

        fileInputRef.current.value =
          "";

      }


      return;

    }


    // ===================================================
    // SUPPRIMER ANCIEN APERÇU
    // ===================================================

    if (videoPreview) {

      URL.revokeObjectURL(
        videoPreview
      );

    }


    const preview =
      URL.createObjectURL(
        file
      );


    setVideo(file);

    setVideoPreview(
      preview
    );

  };


  // =====================================================
  // 🗑️ SUPPRIMER VIDÉO
  // =====================================================

  const removeVideo = () => {

    if (videoPreview) {

      URL.revokeObjectURL(
        videoPreview
      );

    }


    setVideo(null);

    setVideoPreview("");

    setPublished(false);

    setError("");


    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";

    }

  };


  // =====================================================
  // 📱 PLATEFORME
  // =====================================================

  const togglePlatform = (
    platform
  ) => {

    setSelectedPlatforms(
      (prev) => {

        if (
          prev.includes(platform)
        ) {

          return prev.filter(
            (item) =>
              item !== platform
          );

        }


        return [
          ...prev,
          platform,
        ];

      }
    );


    setPublished(false);

  };


  // =====================================================
  // #️⃣ HASHTAGS
  // =====================================================

  const prepareHashtags = () => {

    return hashtags
      .split(/\s+/)
      .map(
        (tag) =>
          tag.trim()
      )
      .filter(Boolean);

  };


  // =====================================================
  // 🚀 PUBLICATION
  // =====================================================

  const handlePublish = async () => {

    setError("");

    setPublished(false);


    // ===================================================
    // VIDÉO
    // ===================================================

    if (!video) {

      setError(
        "Veuillez sélectionner une vidéo avant de publier."
      );

      return;

    }


    // ===================================================
    // PLATEFORMES
    // ===================================================

    if (
      selectedPlatforms.length === 0
    ) {

      setError(
        "Sélectionnez au moins un réseau social."
      );

      return;

    }


    setPublishing(true);


    try {

      // =================================================
      // 1️⃣ FORM DATA
      // =================================================

      const formData =
        new FormData();


      formData.append(
        "video",
        video
      );


      console.log(
        "=========================================="
      );

      console.log(
        "🎬 SOCIAL STUDIO"
      );

      console.log(
        "🎬 Upload de la vidéo..."
      );


      // =================================================
      // 2️⃣ CLOUDINARY
      // =================================================

      const uploadResponse =
        await axios.post(

          `${API_URL}/api/social/upload-video`,

          formData,

          {

            headers: {
              "Content-Type":
                "multipart/form-data",
            },

            timeout:
              180000,

          }

        );


      console.log(
        "✅ UPLOAD RESPONSE :",
        uploadResponse.data
      );


      if (
        !uploadResponse.data?.success
      ) {

        throw new Error(

          uploadResponse.data?.message ||

          "La vidéo n'a pas pu être uploadée."

        );

      }


      const uploadedVideo =
        uploadResponse.data?.video;


      if (
        !uploadedVideo?.url
      ) {

        throw new Error(
          "Cloudinary n'a pas retourné l'URL de la vidéo."
        );

      }


      console.log(
        "☁️ CLOUDINARY URL :",
        uploadedVideo.url
      );


      // =================================================
      // 3️⃣ HASHTAGS
      // =================================================

      const hashtagArray =
        prepareHashtags();


      // =================================================
      // 4️⃣ PLATEFORMES
      // =================================================

      const platformsData = {

        facebook:
          selectedPlatforms.includes(
            "facebook"
          ),

        instagram:
          selectedPlatforms.includes(
            "instagram"
          ),

        tiktok:
          selectedPlatforms.includes(
            "tiktok"
          ),

        youtube:
          selectedPlatforms.includes(
            "youtube"
          ),

      };


      console.log(
        "📱 PLATEFORMES :",
        platformsData
      );


      // =================================================
      // 5️⃣ MONGODB
      // =================================================

      console.log(
        "💾 Enregistrement SocialPost..."
      );


      const postResponse =
        await axios.post(

          `${API_URL}/api/social`,

          {

            videoUrl:
              uploadedVideo.url,

            videoPublicId:
              uploadedVideo.publicId ||
              null,

            thumbnailUrl:
              uploadedVideo.thumbnailUrl ||
              null,

            title:
              title.trim(),

            description:
              description.trim(),

            hashtags:
              hashtagArray,

            platforms:
              platformsData,

          },

          {

            timeout:
              30000,

          }

        );


      console.log(
        "✅ SOCIAL POST RESPONSE :",
        postResponse.data
      );


      if (
        !postResponse.data?.success
      ) {

        throw new Error(

          postResponse.data?.message ||

          "Impossible d'enregistrer la publication."

        );

      }


      // =================================================
      // 6️⃣ AJOUT IMMÉDIAT À L'HISTORIQUE
      // =================================================

      const createdPost =
        postResponse.data?.post;


      if (createdPost) {

        setSocialPosts(
          (prev) => [

            createdPost,

            ...prev,

          ]
        );

      }


      // =================================================
      // 7️⃣ SUCCÈS
      // =================================================

      setPublished(true);


      console.log(
        "🎉 PUBLICATION ENREGISTRÉE AVEC SUCCÈS"
      );


      console.log(
        "🆔 SOCIAL POST :",
        createdPost?._id
      );


    }

    catch (error) {

      console.error(
        "❌ SOCIAL PUBLISH ERROR :",
        error
      );


      let message =
        "Une erreur est survenue pendant l'envoi de la vidéo.";


      if (
        error?.response?.data?.message
      ) {

        message =
          error.response.data.message;

      }

      else if (
        error?.message
      ) {

        message =
          error.message;

      }


      setError(message);

    }

    finally {

      setPublishing(false);

    }

  };


  // =====================================================
  // 🧹 NETTOYAGE URL VIDÉO
  // =====================================================

  useEffect(() => {

    return () => {

      if (videoPreview) {

        URL.revokeObjectURL(
          videoPreview
        );

      }

    };

  }, [videoPreview]);


  // =====================================================
  // 🏷️ LABEL STATUT
  // =====================================================

  const getStatusLabel = (
    status
  ) => {

    switch (status) {

      case "published":
        return "Publié";

      case "publishing":
        return "Publication";

      case "uploading":
        return "Upload";

      case "partial":
        return "Partiellement publié";

      case "failed":
        return "Échec";

      case "draft":
      default:
        return "Brouillon";

    }

  };


  // =====================================================
  // 📅 DATE
  // =====================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "Date inconnue";
    }


    try {

      return new Date(
        date
      ).toLocaleString(
        "fr-FR",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );

    }

    catch {

      return "Date inconnue";

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-social-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-social-header">

        <div>

          <div className="admin-social-badge">

            <FaPaperPlane />

            SOCIAL STUDIO

          </div>


          <h1>
            Centre de publication
          </h1>


          <p>
            Publiez vos contenus KONAN SHOPPING
            sur plusieurs réseaux depuis un seul espace.
          </p>

        </div>


        <div className="admin-social-header-icon">

          <FaVideo />

        </div>

      </div>



      {/* =================================================
          ERREUR
      ================================================= */}

      {error && (

        <div className="social-alert error">

          <FaExclamationCircle />

          <span>
            {error}
          </span>

        </div>

      )}



      {/* =================================================
          SUCCÈS
      ================================================= */}

      {published && (

        <div className="social-alert success">

          <FaCheckCircle />

          <span>
            La vidéo a été enregistrée avec succès.
          </span>

        </div>

      )}



      {/* =================================================
          CRÉATION
      ================================================= */}

      <div className="admin-social-grid">


        {/* =================================================
            GAUCHE
        ================================================= */}

        <div className="social-main-column">


          {/* =================================================
              VIDÉO
          ================================================= */}

          <div className="social-card">

            <div className="social-card-header">

              <div>

                <h2>
                  Votre contenu
                </h2>

                <p>
                  Ajoutez la vidéo que vous souhaitez publier.
                </p>

              </div>

              <FaVideo />

            </div>


            {!video ? (

              <button
                type="button"
                className="video-upload-zone"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <div className="upload-icon">

                  <FaCloudUploadAlt />

                </div>


                <h3>
                  Importer une vidéo
                </h3>


                <p>
                  Cliquez pour sélectionner votre vidéo
                </p>


                <span>
                  MP4, MOV, AVI • 200 MB maximum
                </span>

              </button>

            ) : (

              <div className="video-preview-container">

                <video
                  src={videoPreview}
                  controls
                  playsInline
                  className="social-video-preview"
                />


                <div className="video-info">

                  <div>

                    <strong>
                      {video.name}
                    </strong>

                    <span>
                      {(
                        video.size /
                        1024 /
                        1024
                      ).toFixed(2)}
                      {" "}MB
                    </span>

                  </div>


                  <button
                    type="button"
                    onClick={removeVideo}
                    className="remove-video-button"
                  >

                    <FaTrash />

                    Supprimer

                  </button>

                </div>

              </div>

            )}


            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={
                handleVideoChange
              }
              style={{
                display: "none",
              }}
            />

          </div>



          {/* =================================================
              INFORMATIONS
          ================================================= */}

          <div className="social-card">

            <div className="social-card-header">

              <div>

                <h2>
                  Informations de publication
                </h2>

                <p>
                  Préparez le contenu qui accompagnera votre vidéo.
                </p>

              </div>

              <FaImage />

            </div>


            {/* TITRE */}

            <div className="social-field">

              <label>
                Titre
              </label>


              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Ex : Nouvelle collection disponible 🔥"
                maxLength={150}
              />


              <div className="field-counter">

                {title.length}/150

              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="social-field">

              <label>
                Description
              </label>


              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Écrivez la description de votre publication..."
                rows={6}
                maxLength={2200}
              />


              <div className="field-counter">

                {description.length}/2200

              </div>

            </div>


            {/* HASHTAGS */}

            <div className="social-field">

              <label>

                <FaHashtag />

                Hashtags

              </label>


              <input
                type="text"
                value={hashtags}
                onChange={(e) =>
                  setHashtags(
                    e.target.value
                  )
                }
                placeholder="#KonanShopping #Cameroun #Shopping"
              />


              <small>
                Séparez les hashtags par des espaces.
              </small>

            </div>

          </div>



          {/* =================================================
              APERÇU
          ================================================= */}

          <div className="social-card">

            <div className="social-card-header">

              <div>

                <h2>
                  Aperçu
                </h2>

                <p>
                  Vérifiez votre contenu avant publication.
                </p>

              </div>

              <FaCheckCircle />

            </div>


            <div className="publication-preview">

              {videoPreview ? (

                <video
                  src={videoPreview}
                  controls
                  playsInline
                />

              ) : (

                <div className="preview-empty">

                  <FaVideo />

                  <span>
                    Votre vidéo apparaîtra ici
                  </span>

                </div>

              )}


              <div className="preview-content">

                <strong>

                  {title ||
                    "Titre de votre publication"}

                </strong>


                <p>

                  {description ||
                    "Votre description apparaîtra ici..."}

                </p>


                {hashtags && (

                  <div className="preview-hashtags">

                    {hashtags}

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>



        {/* =================================================
            DROITE
        ================================================= */}

        <aside className="social-sidebar">


          {/* =================================================
              RÉSEAUX
          ================================================= */}

          <div className="social-card">

            <div className="social-card-header">

              <div>

                <h2>
                  Réseaux sociaux
                </h2>

                <p>
                  Où souhaitez-vous publier ?
                </p>

              </div>

            </div>


            <div className="platform-list">

              {platforms.map(
                (platform) => {

                  const selected =
                    selectedPlatforms.includes(
                      platform.id
                    );


                  return (

                    <button
                      type="button"
                      key={
                        platform.id
                      }
                      onClick={() =>
                        togglePlatform(
                          platform.id
                        )
                      }
                      className={`platform-card ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                    >

                      <div
                        className="platform-icon"
                        style={{
                          color:
                            platform.color,
                        }}
                      >

                        {platform.icon}

                      </div>


                      <div className="platform-info">

                        <strong>
                          {platform.name}
                        </strong>

                        <span>

                          {selected
                            ? "Sélectionné"
                            : "Non sélectionné"}

                        </span>

                      </div>


                      <div
                        className={`platform-check ${
                          selected
                            ? "active"
                            : ""
                        }`}
                      >

                        {selected && (

                          <FaCheckCircle />

                        )}

                      </div>

                    </button>

                  );

                }
              )}

            </div>


            <div className="selected-count">

              {selectedPlatforms.length}

              {" réseau"}

              {selectedPlatforms.length > 1
                ? "x"
                : ""}

              {" sélectionné"}

              {selectedPlatforms.length > 1
                ? "s"
                : ""}

            </div>

          </div>



          {/* =================================================
              PUBLICATION
          ================================================= */}

          <div className="social-card">

            <div className="social-card-header">

              <div>

                <h2>
                  Publication
                </h2>

                <p>
                  Enregistrez votre contenu.
                </p>

              </div>

              <FaClock />

            </div>


            <div className="publish-mode">

              <div className="publish-mode-icon">

                <FaPaperPlane />

              </div>


              <div>

                <strong>
                  Préparation de la publication
                </strong>

                <span>
                  La vidéo sera d'abord enregistrée
                  dans votre espace sécurisé.
                </span>

              </div>

            </div>


            <button
              type="button"
              className="publish-button"
              onClick={
                handlePublish
              }
              disabled={
                publishing
              }
            >

              {publishing ? (

                <>

                  <span className="social-spinner" />

                  Upload en cours...

                </>

              ) : (

                <>

                  <FaPaperPlane />

                  Enregistrer la publication

                </>

              )}

            </button>

          </div>



          {/* =================================================
              SÉCURITÉ
          ================================================= */}

          <div className="social-security">

            <FaCheckCircle />

            <div>

              <strong>
                Publication sécurisée
              </strong>

              <span>
                Vos contenus restent contrôlés depuis
                votre espace administrateur.
              </span>

            </div>

          </div>

        </aside>

      </div>



      {/* =====================================================
          📚 HISTORIQUE
      ===================================================== */}

      <div className="social-history-card">


        <div className="social-history-header">

          <div>

            <div className="social-history-title">

              <FaClock />

              <h2>
                Publications récentes
              </h2>

            </div>


            <p>
              Retrouvez ici les contenus enregistrés
              dans votre Social Studio.
            </p>

          </div>


          <div className="social-history-count">

            {socialPosts.length}

          </div>

        </div>



        {/* =================================================
            CHARGEMENT
        ================================================= */}

        {loadingPosts ? (

          <div className="social-history-loading">

            <span className="social-spinner dark" />

            Chargement des publications...

          </div>

        ) : postsError ? (

          <div className="social-history-empty error">

            <FaExclamationCircle />

            {postsError}

          </div>

        ) : socialPosts.length === 0 ? (

          <div className="social-history-empty">

            <FaVideo />

            <strong>
              Aucune publication
            </strong>

            <span>
              Vos prochaines publications apparaîtront ici.
            </span>

          </div>

        ) : (

          <div className="social-post-list">

            {socialPosts.map(
              (post) => (

                <div
                  className="social-post-item"
                  key={post._id}
                >


                  {/* =========================================
                      VIDÉO
                  ========================================= */}

                  <div className="social-post-media">

                    {post.videoUrl ? (

                      <video
                        src={
                          post.videoUrl
                        }
                        muted
                        playsInline
                        controls
                      />

                    ) : (

                      <div className="social-post-no-video">

                        <FaVideo />

                      </div>

                    )}

                  </div>



                  {/* =========================================
                      INFORMATIONS
                  ========================================= */}

                  <div className="social-post-info">


                    <div className="social-post-top">

                      <div>

                        <h3>

                          {post.title ||
                            "Sans titre"}

                        </h3>


                        <p>

                          {post.description ||
                            "Aucune description"}

                        </p>

                      </div>


                      <span
                        className={`social-status ${
                          post.status ||
                          "draft"
                        }`}
                      >

                        {getStatusLabel(
                          post.status
                        )}

                      </span>

                    </div>



                    {/* =======================================
                        RÉSEAUX
                    ======================================= */}

                    <div className="social-post-platforms">

                      {post.platforms?.facebook && (

                        <span className="social-platform facebook">

                          <FaFacebook />

                          Facebook

                        </span>

                      )}


                      {post.platforms?.instagram && (

                        <span className="social-platform instagram">

                          <FaInstagram />

                          Instagram

                        </span>

                      )}


                      {post.platforms?.tiktok && (

                        <span className="social-platform tiktok">

                          <FaTiktok />

                          TikTok

                        </span>

                      )}


                      {post.platforms?.youtube && (

                        <span className="social-platform youtube">

                          <FaYoutube />

                          YouTube

                        </span>

                      )}

                    </div>



                    {/* =======================================
                        HASHTAGS
                    ======================================= */}

                    {Array.isArray(
                      post.hashtags
                    ) &&
                    post.hashtags.length > 0 && (

                      <div className="social-post-hashtags">

                        {post.hashtags.map(
                          (
                            tag,
                            index
                          ) => (

                            <span
                              key={
                                index
                              }
                            >

                              {tag}

                            </span>

                          )
                        )}

                      </div>

                    )}



                    {/* =======================================
                        DATE
                    ======================================= */}

                    <div className="social-post-date">

                      <FaClock />

                      {formatDate(
                        post.createdAt
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}


export default AdminSocial;