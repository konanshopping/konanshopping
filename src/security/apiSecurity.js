import axios from "axios";

// ======================================================
// 🔐 AUTHENTIFICATION FRONTEND PAR COOKIE HTTPONLY
// ======================================================
// Le frontend ne lit plus les JWT.
// Le navigateur envoie automatiquement les cookies HttpOnly.
// Le backend vérifie ensuite le JWT correspondant.
//
// Cela fonctionne pour :
// - 👤 Utilisateur
// - 👑 Administrateur
// - 🚚 Livreur
//
// Aucun token sensible n'est récupéré depuis localStorage.
// ======================================================

axios.defaults.withCredentials = true;

// ======================================================
// 🌐 INTERCEPTEUR GLOBAL AXIOS
// ======================================================
// Toutes les requêtes Axios utilisent automatiquement
// les cookies HttpOnly.
//
// On ne modifie pas les headers Authorization existants
// puisque le nouveau système n'en a plus besoin.
// ======================================================

axios.interceptors.request.use(
  (config) => {
    if (!config || typeof window === "undefined") {
      return config;
    }

    // Autorise l'envoi automatique des cookies HttpOnly.
    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error)
);