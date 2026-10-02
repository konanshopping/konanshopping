import axios from "axios";

// ======================================================
// 🔐 AUTHENTIFICATION AUTOMATIQUE DES REQUÊTES FRONTEND
// ======================================================
// Le backend vérifie réellement les JWT.
// Cette couche évite d'oublier le header Authorization dans
// les nombreux appels Axios existants, sans modifier leur logique.

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function getRequestPath(config) {
  try {
    return new URL(
      config?.url || "",
      window.location.origin
    ).pathname;
  } catch (_) {
    return String(config?.url || "");
  }
}

function isDriverRequest(pathname) {
  return (
    pathname.startsWith("/driver/") ||
    pathname === "/driver-orders" ||
    pathname.startsWith("/driver-online/") ||
    pathname.startsWith("/accept-order/") ||
    pathname.startsWith("/order-location/") ||
    pathname.startsWith("/driver-location/") ||
    pathname.startsWith("/driver-deliver/") ||
    pathname.startsWith("/driver-cancel/")
  );
}

function getAuthToken(config) {
  const pathname = getRequestPath(config);

  // Les routes livreur utilisent DRIVER_JWT_SECRET côté serveur.
  if (isDriverRequest(pathname)) {
    const driver = readJSON("driver");
    return driver?.token || localStorage.getItem("driverToken") || null;
  }

  // Les routes utilisateur/admin utilisent le token correspondant
  // stocké par les écrans de connexion existants.
  return localStorage.getItem("token");
}

axios.interceptors.request.use(
  (config) => {
    if (!config || typeof window === "undefined") {
      return config;
    }

    // Ne jamais écraser un Authorization explicitement fourni par
    // un appel existant.
    const hasAuthorization =
      config.headers?.Authorization ||
      config.headers?.authorization;

    if (!hasAuthorization) {
      const token = getAuthToken(config);

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);