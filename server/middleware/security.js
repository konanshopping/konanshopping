const jwt = require("jsonwebtoken");

const WINDOW_MS = 15 * 60 * 1000;
const buckets = new Map();

function getClientKey(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (forwarded ? String(forwarded).split(",")[0].trim() : req.ip) || "unknown";
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
      bucket = { start: now, count: 0 };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - bucket.count));

    if (bucket.count > max) {
      return res.status(429).json({
        message: "Trop de requêtes. Réessayez plus tard.",
      });
    }

    next();
  };
}

// Évite que la Map de rate-limit ne grossisse indéfiniment sur un serveur longuement actif.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.start > 60 * 60 * 1000) buckets.delete(key);
  }
}, 30 * 60 * 1000).unref();

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(`Configuration de sécurité manquante ou trop faible: ${name}`);
  }
  return value;
}

function extractBearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

function verifyJwt(token, secret, expectedRole) {
  const payload = jwt.verify(token, secret, {
    algorithms: ["HS256"],
    issuer: process.env.JWT_ISSUER || "konanshopping",
    audience: process.env.JWT_AUDIENCE || "konanshopping-web",
  });

  if (expectedRole && payload.role !== expectedRole) {
    const error = new Error("Rôle insuffisant");
    error.status = 403;
    throw error;
  }

  return payload;
}

function requireAdmin(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ message: "Authentification administrateur requise." });
    req.admin = verifyJwt(token, requireEnv("ADMIN_JWT_SECRET"), "admin");
    next();
  } catch (error) {
    return res.status(error.status || 401).json({ message: "Accès administrateur refusé." });
  }
}

function requireUser(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ message: "Authentification requise." });
    req.user = verifyJwt(token, requireEnv("JWT_SECRET"));
    next();
  } catch (error) {
    return res.status(error.status || 401).json({ message: "Authentification invalide." });
  }
}

function requireUserOrAdmin(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ message: "Authentification requise." });

    try {
      req.admin = verifyJwt(token, requireEnv("ADMIN_JWT_SECRET"), "admin");
      return next();
    } catch (_) {}

    req.user = verifyJwt(token, requireEnv("JWT_SECRET"));
    return next();
  } catch (error) {
    return res.status(error.status || 401).json({ message: "Authentification invalide." });
  }
}

function requireSelfOrAdmin(paramName = "id") {
  return (req, res, next) => {
    try {
      const token = extractBearerToken(req);
      if (!token) return res.status(401).json({ message: "Authentification requise." });

      try {
        req.admin = verifyJwt(token, requireEnv("ADMIN_JWT_SECRET"), "admin");
        return next();
      } catch (_) {}

      const user = verifyJwt(token, requireEnv("JWT_SECRET"));
      const tokenUserId = String(user.sub || user.id || "");
      const requestedUserId = String(
        req.params[paramName] ||
        req.body?.[paramName] ||
        req.params.userId ||
        req.body?.userId ||
        ""
      );

      if (!tokenUserId || !requestedUserId || tokenUserId !== requestedUserId) {
        return res.status(403).json({ message: "Accès refusé." });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(error.status || 401).json({ message: "Authentification invalide." });
    }
  };
}

function requireDriverSelf(paramName = "driverId") {
  return (req, res, next) => {
    try {
      const token = extractBearerToken(req);
      if (!token) return res.status(401).json({ message: "Authentification livreur requise." });

      const payload = verifyJwt(token, requireEnv("DRIVER_JWT_SECRET"), "driver");
      const driverId = String(payload.sub || payload.id || "");
      const requestedId = String(
        req.params[paramName] || req.body?.[paramName] || req.query?.[paramName] || ""
      );

      if (!driverId || !requestedId || driverId !== requestedId) {
        return res.status(403).json({ message: "Accès livreur refusé." });
      }

      req.driver = payload;
      next();
    } catch (error) {
      return res.status(error.status || 401).json({ message: "Authentification livreur invalide." });
    }
  };
}

function requireDriverSelfOrAdmin(paramName = "driverId") {
  return (req, res, next) => {
    try {
      const token = extractBearerToken(req);
      if (!token) return res.status(401).json({ message: "Authentification requise." });

      try {
        req.admin = verifyJwt(token, requireEnv("ADMIN_JWT_SECRET"), "admin");
        return next();
      } catch (_) {}

      const payload = verifyJwt(token, requireEnv("DRIVER_JWT_SECRET"), "driver");
      const driverId = String(payload.sub || payload.id || "");
      const requestedId = String(
        req.params[paramName] || req.body?.[paramName] || req.query?.[paramName] || ""
      );

      if (!driverId || !requestedId || driverId !== requestedId) {
        return res.status(403).json({ message: "Accès livreur refusé." });
      }

      req.driver = payload;
      return next();
    } catch (error) {
      return res.status(error.status || 401).json({ message: "Authentification invalide." });
    }
  };
}

function requireDriverOrAdmin(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ message: "Authentification requise." });

    try {
      req.admin = verifyJwt(token, requireEnv("ADMIN_JWT_SECRET"), "admin");
      return next();
    } catch (_) {}

    req.driver = verifyJwt(token, requireEnv("DRIVER_JWT_SECRET"), "driver");
    next();
  } catch (error) {
    return res.status(error.status || 401).json({ message: "Authentification invalide." });
  }
}

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("X-XSS-Protection", "0");

  // HSTS uniquement lorsque le site est servi en HTTPS.
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
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