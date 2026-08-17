const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const TikTokAccount =
  require("../models/TikTokAccount");

const router = express.Router();


// ======================================================
// 🔐 CONNECTER LE COMPTE TIKTOK
// ======================================================

router.get("/connect", (req, res) => {

  try {

    const clientKey =
      process.env.TIKTOK_CLIENT_KEY;

    const redirectUri =
      process.env.TIKTOK_REDIRECT_URI;


    // ==================================================
    // ⚙️ VÉRIFICATION CONFIGURATION
    // ==================================================

    if (
      !clientKey ||
      !redirectUri
    ) {

      return res.status(500).json({

        success: false,

        message:
          "Configuration TikTok incomplète.",

      });

    }


    // ==================================================
    // 🔐 STATE DE SÉCURITÉ
    // ==================================================

    const state =
      crypto
        .randomBytes(32)
        .toString("hex");


    // ==================================================
    // 🍪 COOKIE TEMPORAIRE
    // ==================================================

    res.cookie(
      "tiktok_oauth_state",
      state,
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge:
          10 * 60 * 1000,
      }
    );


    // ==================================================
    // 🔑 PERMISSIONS
    // ==================================================

    const scope =
      "user.info.basic,video.publish";


    // ==================================================
    // 🔗 PARAMÈTRES OAUTH
    // ==================================================

    const params =
      new URLSearchParams({

        client_key:
          clientKey,

        response_type:
          "code",

        scope,

        redirect_uri:
          redirectUri,

        state,

      });


    const authorizationUrl =
      `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;


    console.log(
      "=========================================="
    );

    console.log(
      "🔗 REDIRECTION VERS TIKTOK"
    );

    console.log(
      authorizationUrl
    );

    console.log(
      "=========================================="
    );


    return res.redirect(
      authorizationUrl
    );

  }

  catch (error) {

    console.error(
      "❌ TIKTOK CONNECT ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Erreur lors de la connexion TikTok.",

    });

  }

});


// ======================================================
// 🔄 CALLBACK TIKTOK
// ======================================================

router.get(
  "/callback",
  async (req, res) => {

    try {

      const {
        code,
        state,
        error,
        error_description,
      } = req.query;


      // ==================================================
      // ❌ UTILISATEUR REFUSE
      // ==================================================

      if (error) {

        console.error(
          "❌ TIKTOK AUTH ERROR:",
          error,
          error_description
        );


        return res.redirect(
          "https://konanshopping.com/admin/social?tiktok=error"
        );

      }


      // ==================================================
      // 🔐 VÉRIFICATION STATE
      // ==================================================

      const savedState =
        req.cookies?.tiktok_oauth_state;


      if (
        !state ||
        !savedState ||
        state !== savedState
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Échec de la vérification de sécurité TikTok.",

        });

      }


      // ==================================================
      // 🧹 SUPPRIMER LE COOKIE
      // ==================================================

      res.clearCookie(
        "tiktok_oauth_state"
      );


      // ==================================================
      // 🔑 CODE MANQUANT
      // ==================================================

      if (!code) {

        return res.status(400).json({

          success: false,

          message:
            "Code d'autorisation TikTok manquant.",

        });

      }


      // ==================================================
      // 🔄 ÉCHANGER LE CODE CONTRE LES TOKENS
      // ==================================================

      const tokenResponse =
        await axios.post(

          "https://open.tiktokapis.com/v2/oauth/token/",

          new URLSearchParams({

            client_key:
              process.env.TIKTOK_CLIENT_KEY,

            client_secret:
              process.env.TIKTOK_CLIENT_SECRET,

            code,

            grant_type:
              "authorization_code",

            redirect_uri:
              process.env.TIKTOK_REDIRECT_URI,

          }).toString(),

          {

            headers: {

              "Content-Type":
                "application/x-www-form-urlencoded",

            },

            timeout:
              30000,

          }

        );


      const tokenData =
        tokenResponse.data;


      // ==================================================
      // 📊 LOGS
      // ==================================================

      console.log(
        "=========================================="
      );

      console.log(
        "🎵 TIKTOK AUTHENTIFICATION RÉUSSIE"
      );

      console.log(
        "OPEN ID :",
        tokenData?.open_id
      );

      console.log(
        "ACCESS TOKEN :",
        tokenData?.access_token
          ? "REÇU"
          : "ABSENT"
      );

      console.log(
        "REFRESH TOKEN :",
        tokenData?.refresh_token
          ? "REÇU"
          : "ABSENT"
      );

      console.log(
        "SCOPE :",
        tokenData?.scope
      );

      console.log(
        "=========================================="
      );


      // ==================================================
      // 🛑 VÉRIFICATION TOKENS
      // ==================================================

      if (
        !tokenData?.access_token ||
        !tokenData?.refresh_token ||
        !tokenData?.open_id
      ) {

        throw new Error(
          "TikTok n'a pas retourné tous les tokens nécessaires."
        );

      }


      // ==================================================
      // 💾 ENREGISTRER LE COMPTE
      // ==================================================

      const now =
        Date.now();


      await TikTokAccount.findOneAndUpdate(

        {
          openId:
            tokenData.open_id,
        },

        {

          openId:
            tokenData.open_id,

          accessToken:
            tokenData.access_token,

          refreshToken:
            tokenData.refresh_token,

          accessTokenExpiresAt:
            new Date(
              now +
              (
                tokenData.expires_in *
                1000
              )
            ),

          refreshTokenExpiresAt:
            tokenData.refresh_expires_in
              ? new Date(
                  now +
                  (
                    tokenData.refresh_expires_in *
                    1000
                  )
                )
              : null,

          scope:
            tokenData.scope ||
            "",

          connectedAt:
            new Date(),

        },

        {

          upsert: true,

          new: true,

        }

      );


      // ==================================================
      // ✅ RETOUR VERS ADMIN SOCIAL
      // ==================================================

      return res.redirect(
        "https://konanshopping.com/admin/social?tiktok=connected"
      );

    }

    catch (error) {

      console.error(
        "❌ TIKTOK CALLBACK ERROR:",
        error.response?.data ||
        error.message
      );


      return res.redirect(
        "https://konanshopping.com/admin/social?tiktok=error"
      );

    }

  }
);


module.exports =
  router;