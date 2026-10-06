const jwt = require("jsonwebtoken");



const WINDOW_MS = 15 * 60 * 1000;

const buckets = new Map();



/*

 * ============================================================

 * 🔐 AUTHENTIFICATION — ÉTAPE 1

 * ============================================================

 *

 * Objectif de cette étape :

 * - préparer l'authentification par cookies HttpOnly ;

 * - conserver TEMPORAIREMENT le Bearer pour ne pas casser

 *   le frontend actuel ;

 * - privilégier systématiquement le cookie lorsqu'il existe ;

 * - conserver les 3 rôles séparés :

 *      user   -> JWT_SECRET

 *      admin  -> ADMIN_JWT_SECRET

 *      driver -> DRIVER_JWT_SECRET

 *

 * ⚠️ Cette étape est transitoire.

 * Le Bearer sera supprimé après migration complète du frontend.

 */



const COOKIE_NAMES = Object.freeze({

  user: "ks_user_token",

  admin: "ks_admin_token",

  driver: "ks_driver_token",

});



function getClientKey(req) {

  /*

   * NGINX est déjà configuré avec X-Forwarded-For.

   * Express utilise également trust proxy dans index.js.

   *

   * On prend le premier IP de X-Forwarded-For.

   */

  const forwarded = req.headers["x-forwarded-for"];



  const ip =

    (forwarded

      ? String(forwarded).split(",")[0].trim()

      : req.ip) || "unknown";



  return ip;

}



function rateLimit(options = {}) {

  const windowMs = options.windowMs || WINDOW_MS;

  const max = options.max || 120;

  const name = options.name || "global";



  return (req, res, next) => {

    const key = `${name}:${getClientKey(req)}`;

    const now = Date.now();



    let bucket = buckets.get(key);



    if (!bucket || now - bucket.start >= windowMs) {

      bucket = {

        start: now,

        count: 0,

      };



      buckets.set(key, bucket);

    }



    bucket.count += 1;



    res.setHeader("X-RateLimit-Limit", max);

    res.setHeader(

      "X-RateLimit-Remaining",

      Math.max(0, max - bucket.count)

    );



    if (bucket.count > max) {

      return res.status(429).json({

        message: "Trop de requêtes. Réessayez plus tard.",

      });

    }



    next();

  };

}



/*

 * Évite que la Map de rate-limit ne grossisse indéfiniment

 * sur un serveur longuement actif.

 */

setInterval(() => {

  const now = Date.now();



  for (const [key, bucket] of buckets.entries()) {

    if (now - bucket.start > 60 * 60 * 1000) {

      buckets.delete(key);

    }

  }

}, 30 * 60 * 1000).unref();



function requireEnv(name) {

  const value = process.env[name];



  if (!value || value.length < 32) {

    throw new Error(

      `Configuration de sécurité manquante ou trop faible: ${name}`

    );

  }



  return value;

}



/*

 * ============================================================

 * 🍪 COOKIE JWT

 * ============================================================

 *

 * cookie-parser est déjà chargé dans ton index.js avant les

 * middlewares de sécurité.

 *

 * On ne lit donc JAMAIS le contenu du cookie côté frontend.

 * HttpOnly empêchera JavaScript d'y accéder.

 */

function extractCookieToken(req, cookieName) {

  const token = req.cookies?.[cookieName];



  if (typeof token !== "string") {

    return null;

  }



  const cleanToken = token.trim();



  return cleanToken || null;

}



/*

 * ============================================================

 * 🔄 BEARER — COMPATIBILITÉ TEMPORAIRE

 * ============================================================

 *

 * Le Bearer est conservé UNIQUEMENT pendant la migration.

 *

 * Important :

 * - cookie présent -> priorité au cookie ;

 * - cookie absent -> ancien Bearer autorisé temporairement.

 *

 * Une fois le frontend entièrement migré, cette fonction et

 * tous les fallbacks Bearer seront supprimés.

 */

/*
 * ============================================================
 * 🍪 AUTHENTIFICATION COOKIE UNIQUEMENT — ÉTAPE 7/8
 * ============================================================
 *
 * Le JWT est désormais lu exclusivement depuis le cookie HttpOnly.
 * Aucun header Authorization: Bearer n'est accepté.
 *
 * On conserve exactement les mêmes rôles et secrets :
 * - user   -> JWT_SECRET
 * - admin  -> ADMIN_JWT_SECRET
 * - driver -> DRIVER_JWT_SECRET
 */

function getToken(req, cookieName) {
  const cookieToken = extractCookieToken(req, cookieName);

  if (cookieToken) {
    return {
      token: cookieToken,
      source: "cookie",
    };
  }

  return {
    token: null,
    source: null,
  };
}


function verifyJwt(token, secret, expectedRole) {

  const payload = jwt.verify(token, secret, {

    algorithms: ["HS256"],

    issuer:

      process.env.JWT_ISSUER || "konanshopping",

    audience:

      process.env.JWT_AUDIENCE || "konanshopping-web",

  });



  if (expectedRole && payload.role !== expectedRole) {

    const error = new Error("Rôle insuffisant");

    error.status = 403;

    throw error;

  }



  return payload;

}



/*

 * ============================================================

 * 👑 ADMIN

 * ============================================================

 */

function requireAdmin(req, res, next) {

  try {

    const auth = getToken(req, COOKIE_NAMES.admin);



    if (!auth.token) {

      return res.status(401).json({

        message: "Authentification administrateur requise.",

      });

    }



    req.admin = verifyJwt(

      auth.token,

      requireEnv("ADMIN_JWT_SECRET"),

      "admin"

    );



    /*

     * Utile pour l'audit/debug interne.

     * Ne contient jamais le JWT.

     */

    req.authSource = auth.source;



    next();

  } catch (error) {

    return res.status(error.status || 401).json({

      message: "Accès administrateur refusé.",

    });

  }

}



/*

 * ============================================================

 * 👤 USER

 * ============================================================

 */

function requireUser(req, res, next) {

  try {

    const auth = getToken(req, COOKIE_NAMES.user);



    if (!auth.token) {

      return res.status(401).json({

        message: "Authentification requise.",

      });

    }



    req.user = verifyJwt(

      auth.token,

      requireEnv("JWT_SECRET")

    );



    req.authSource = auth.source;



    next();

  } catch (error) {

    return res.status(error.status || 401).json({

      message: "Authentification invalide.",

    });

  }

}



/*

 * ============================================================

 * 👤 USER OU 👑 ADMIN

 * ============================================================

 */

function requireUserOrAdmin(req, res, next) {

  try {

    /*

     * Admin en priorité.

     * Cela conserve le comportement logique des routes

     * accessibles aux deux rôles.

     */

    const adminAuth = getToken(

      req,

      COOKIE_NAMES.admin

    );



    if (adminAuth.token) {

      try {

        req.admin = verifyJwt(

          adminAuth.token,

          requireEnv("ADMIN_JWT_SECRET"),

          "admin"

        );



        req.authSource = adminAuth.source;



        return next();

      } catch (_) {

        /*

         * Si un cookie admin existe mais est invalide,

         * on essaie le cookie utilisateur.

         */

      }

    }



    const userAuth = getToken(

      req,

      COOKIE_NAMES.user

    );



    if (!userAuth.token) {

      return res.status(401).json({

        message: "Authentification requise.",

      });

    }



    req.user = verifyJwt(

      userAuth.token,

      requireEnv("JWT_SECRET")

    );



    req.authSource = userAuth.source;



    return next();

  } catch (error) {

    return res.status(error.status || 401).json({

      message: "Authentification invalide.",

    });

  }

}



/*

 * ============================================================

 * 👤 PROPRIÉTAIRE OU 👑 ADMIN

 * ============================================================

 */

function requireSelfOrAdmin(paramName = "id") {

  return (req, res, next) => {

    try {

      const adminAuth = getToken(

        req,

        COOKIE_NAMES.admin

      );



      if (adminAuth.token) {

        try {

          req.admin = verifyJwt(

            adminAuth.token,

            requireEnv("ADMIN_JWT_SECRET"),

            "admin"

          );



          req.authSource = adminAuth.source;



          return next();

        } catch (_) {}

      }



      const userAuth = getToken(

        req,

        COOKIE_NAMES.user

      );



      if (!userAuth.token) {

        return res.status(401).json({

          message: "Authentification requise.",

        });

      }



      const user = verifyJwt(

        userAuth.token,

        requireEnv("JWT_SECRET")

      );



      const tokenUserId = String(

        user.sub || user.id || ""

      );



      const requestedUserId = String(

        req.params[paramName] ||

        req.body?.[paramName] ||

        req.params.userId ||

        req.body?.userId ||

        ""

      );



      if (

        !tokenUserId ||

        !requestedUserId ||

        tokenUserId !== requestedUserId

      ) {

        return res.status(403).json({

          message: "Accès refusé.",

        });

      }



      req.user = user;

      req.authSource = userAuth.source;



      return next();

    } catch (error) {

      return res.status(error.status || 401).json({

        message: "Authentification invalide.",

      });

    }

  };

}



/*

 * ============================================================

 * 🚚 LIVREUR LUI-MÊME

 * ============================================================

 */

function requireDriverSelf(

  paramName = "driverId"

) {

  return (req, res, next) => {

    try {

      const auth = getToken(

        req,

        COOKIE_NAMES.driver

      );



      if (!auth.token) {

        return res.status(401).json({

          message: "Authentification livreur requise.",

        });

      }



      const payload = verifyJwt(

        auth.token,

        requireEnv("DRIVER_JWT_SECRET"),

        "driver"

      );



      const driverId = String(

        payload.sub || payload.id || ""

      );



      const requestedId = String(

        req.params[paramName] ||

        req.body?.[paramName] ||

        req.query?.[paramName] ||

        ""

      );



      if (

        !driverId ||

        !requestedId ||

        driverId !== requestedId

      ) {

        return res.status(403).json({

          message: "Accès livreur refusé.",

        });

      }



      req.driver = payload;

      req.authSource = auth.source;



      next();

    } catch (error) {

      return res.status(error.status || 401).json({

        message:

          "Authentification livreur invalide.",

      });

    }

  };

}



/*

 * ============================================================

 * 🚚 LIVREUR LUI-MÊME OU 👑 ADMIN

 * ============================================================

 */

function requireDriverSelfOrAdmin(

  paramName = "driverId"

) {

  return (req, res, next) => {

    try {

      const adminAuth = getToken(

        req,

        COOKIE_NAMES.admin

      );



      if (adminAuth.token) {

        try {

          req.admin = verifyJwt(

            adminAuth.token,

            requireEnv("ADMIN_JWT_SECRET"),

            "admin"

          );



          req.authSource = adminAuth.source;



          return next();

        } catch (_) {}

      }



      const driverAuth = getToken(

        req,

        COOKIE_NAMES.driver

      );



      if (!driverAuth.token) {

        return res.status(401).json({

          message: "Authentification requise.",

        });

      }



      const payload = verifyJwt(

        driverAuth.token,

        requireEnv("DRIVER_JWT_SECRET"),

        "driver"

      );



      const driverId = String(

        payload.sub || payload.id || ""

      );



      const requestedId = String(

        req.params[paramName] ||

        req.body?.[paramName] ||

        req.query?.[paramName] ||

        ""

      );



      if (

        !driverId ||

        !requestedId ||

        driverId !== requestedId

      ) {

        return res.status(403).json({

          message: "Accès livreur refusé.",

        });

      }



      req.driver = payload;

      req.authSource = driverAuth.source;



      return next();

    } catch (error) {

      return res.status(error.status || 401).json({

        message: "Authentification invalide.",

      });

    }

  };

}



/*

 * ============================================================

 * 🚚 LIVREUR OU 👑 ADMIN

 * ============================================================

 */

function requireDriverOrAdmin(

  req,

  res,

  next

) {

  try {

    const adminAuth = getToken(

      req,

      COOKIE_NAMES.admin

    );



    if (adminAuth.token) {

      try {

        req.admin = verifyJwt(

          adminAuth.token,

          requireEnv("ADMIN_JWT_SECRET"),

          "admin"

        );



        req.authSource = adminAuth.source;



        return next();

      } catch (_) {}

    }



    const driverAuth = getToken(

      req,

      COOKIE_NAMES.driver

    );



    if (!driverAuth.token) {

      return res.status(401).json({

        message: "Authentification requise.",

      });

    }



    req.driver = verifyJwt(

      driverAuth.token,

      requireEnv("DRIVER_JWT_SECRET"),

      "driver"

    );



    req.authSource = driverAuth.source;



    return next();

  } catch (error) {

    return res.status(error.status || 401).json({

      message: "Authentification invalide.",

    });

  }

}



/*

 * ============================================================

 * 🛡️ SECURITY HEADERS

 * ============================================================

 */

function securityHeaders(req, res, next) {

  res.setHeader(

    "X-Content-Type-Options",

    "nosniff"

  );



  res.setHeader(

    "X-Frame-Options",

    "DENY"

  );



  res.setHeader(

    "Referrer-Policy",

    "strict-origin-when-cross-origin"

  );



  res.setHeader(

    "Permissions-Policy",

    "camera=(), microphone=(), geolocation=(self)"

  );



  res.setHeader(

    "Cross-Origin-Opener-Policy",

    "same-origin"

  );



  /*

   * Ancien mécanisme XSS des navigateurs.

   * La bonne protection moderne repose notamment sur CSP.

   */

  res.setHeader(

    "X-XSS-Protection",

    "0"

  );



  /*

   * HSTS uniquement en production.

   */

  if (

    process.env.NODE_ENV === "production"

  ) {

    res.setHeader(

      "Strict-Transport-Security",

      "max-age=31536000; includeSubDomains"

    );

  }



  next();

}



module.exports = {

  rateLimit,

  requireAdmin,

  requireUser,

  requireUserOrAdmin,

  requireSelfOrAdmin,

  requireDriverSelf,

  requireDriverSelfOrAdmin,

  requireDriverOrAdmin,

  securityHeaders,

};