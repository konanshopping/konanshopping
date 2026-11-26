import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";
import { toast } from "react-toastify";

// ======================================================
// 🔐 AUTHENTIFICATION — LOGIQUE BACKEND CONSERVÉE
// ======================================================

const API_BASE_URL = "https://konanshopping.com/api";
const API_TIMEOUT = 15000;
const LOGIN_ENDPOINT = "/login";
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 256;

const normalizeEmail = (value) =>
  String(value ?? "").trim().toLowerCase();

const isValidEmail = (value) =>
  value.length > 0 &&
  value.length <= MAX_EMAIL_LENGTH &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidLoginResponse = (data) =>
  data &&
  typeof data === "object" &&
  data.user &&
  typeof data.user === "object";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ======================================================
// 🔔 NOTIFICATIONS PROFESSIONNELLES
// Nécessite le ToastContainer react-toastify déjà présent
// dans l'application.
// ======================================================

const toastStyle = {
  borderRadius: "14px",
  padding: "14px 16px",
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: "14px",
  fontWeight: 600,
  boxShadow: "0 12px 35px rgba(15, 23, 42, 0.14)",
};

const toastOptions = {
  position: "top-center",
  autoClose: 3800,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const notifySuccess = (message) => {
  toast.dismiss();
  toast.success(message, {
    ...toastOptions,
    style: {
      ...toastStyle,
      color: "#166534",
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
    },
  });
};

const notifyError = (message) => {
  toast.dismiss();
  toast.error(message, {
    ...toastOptions,
    style: {
      ...toastStyle,
      color: "#991b1b",
      background: "#fff7f7",
      border: "1px solid #fecaca",
    },
  });
};

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);

  // Intro visuelle uniquement : elle ne touche pas au processus de connexion.
  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) {
      setIntroVisible(false);
      return undefined;
    }

    const introTimer = window.setTimeout(() => {
      setIntroVisible(false);
    }, 3900);

    return () => window.clearTimeout(introTimer);
  }, []);

  const login = async () => {
    if (loading) return;

    const normalizedEmail = normalizeEmail(email);

    // Ne jamais trim le mot de passe : les espaces peuvent être valides.
    const enteredPassword = String(password ?? "");

    if (!normalizedEmail || !enteredPassword) {
      notifyError("Veuillez remplir tous les champs.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      notifyError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    if (enteredPassword.length > MAX_PASSWORD_LENGTH) {
      notifyError("Le mot de passe saisi est trop long.");
      return;
    }

    try {
      setLoading(true);

      // Backend réel : POST /login
      const res = await api.post(LOGIN_ENDPOINT, {
        email: normalizedEmail,
        password: enteredPassword,
      });

      if (!isValidLoginResponse(res.data)) {
        throw new Error("Réponse de connexion invalide");
      }

      const { user } = res.data;

      // SUCCESS
      notifySuccess("Bienvenue sur Konan Shopping !");

      // ADMIN
      if (user.isAdmin) {
        localStorage.setItem("admin", JSON.stringify(user));

        setTimeout(() => {
          window.location.href = "/admin";
        }, 1500);
      }
      // CLIENT
      else {
        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          window.location.href = "/account";
        }, 1500);
      }
    } catch (err) {
      const serverMessage =
        typeof err?.response?.data?.message === "string"
          ? err.response.data.message.trim()
          : "";

      const networkMessage =
        !err?.response && err?.message
          ? "Impossible de joindre le serveur. Vérifiez votre connexion."
          : "";

      notifyError(
        serverMessage || networkMessage || "Erreur de connexion. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  return (
    <main className="ks-login-page">

      {introVisible && (
        <div className="ks-intro" role="status" aria-label="Bienvenue chez Konan Shopping">
          <div className="ks-intro-glow ks-intro-glow-one" />
          <div className="ks-intro-glow ks-intro-glow-two" />


          <div className="ks-intro-center">
            <div className="ks-intro-stage">
              <div className="ks-intro-cart" aria-hidden="true">
                <svg
                  className="ks-real-cart"
                  viewBox="0 0 420 310"
                  role="presentation"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="ksCartMetal" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset=".42" stopColor="#c9d7e8" />
                      <stop offset="1" stopColor="#8298b4" />
                    </linearGradient>
                    <linearGradient id="ksCartBlue" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#48a0ff" />
                      <stop offset="1" stopColor="#1454c4" />
                    </linearGradient>
                    <linearGradient id="ksCartRed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ff8b83" />
                      <stop offset="1" stopColor="#d92e4b" />
                    </linearGradient>
                    <linearGradient id="ksCartGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#ffe49a" />
                      <stop offset="1" stopColor="#e69b26" />
                    </linearGradient>
                    <linearGradient id="ksCartShoe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffffff" />
                      <stop offset="1" stopColor="#dce9fa" />
                    </linearGradient>
                    <clipPath id="ksCartBasketClip">
                      <path d="M105 105 L354 105 L326 225 Q323 238 308 238 L145 238 Q132 238 128 225 Z" />
                    </clipPath>
                    <filter id="ksCartShadow" x="-30%" y="-30%" width="160%" height="180%">
                      <feGaussianBlur stdDeviation="7" />
                    </filter>
                  </defs>

                  {/* Ombre au sol */}
                  <ellipse cx="230" cy="278" rx="132" ry="13" fill="#020b1b" opacity=".28" filter="url(#ksCartShadow)" />

                  {/* Poignée et structure */}
                  <path d="M50 38 L91 38 Q101 38 105 49 L119 104" fill="none" stroke="#d9e8fb" strokeWidth="13" strokeLinecap="round" />
                  <path d="M50 38 L91 38 Q101 38 105 49 L119 104" fill="none" stroke="url(#ksCartMetal)" strokeWidth="7" strokeLinecap="round" />
                  <path d="M42 29 L62 29" stroke="#ffffff" strokeWidth="15" strokeLinecap="round" />
                  <path d="M42 29 L62 29" stroke="#6f8baa" strokeWidth="7" strokeLinecap="round" />

                  {/* Articles colorés qui tombent dans le panier */}
                  <g className="ks-svg-item ks-svg-item-shoe">
                    <path d="M130 87 Q143 75 158 82 L180 103 Q193 111 214 112 Q226 114 228 127 L224 139 L126 139 Q116 135 119 124 Z" fill="url(#ksCartShoe)" stroke="#91a9c8" strokeWidth="3" />
                    <path d="M139 91 L157 96 L172 111 L198 119" fill="none" stroke="#2475df" strokeWidth="5" strokeLinecap="round" />
                    <path d="M126 129 Q169 137 224 128" fill="none" stroke="#173d70" strokeWidth="5" strokeLinecap="round" />
                    <path d="M151 101 L166 106 M160 95 L175 102" stroke="#e54b5d" strokeWidth="3" strokeLinecap="round" />
                  </g>

                  <g className="ks-svg-item ks-svg-item-shirt">
                    <path d="M228 57 L250 47 L266 58 L284 47 L309 64 L295 91 L284 85 L287 133 L235 133 L239 85 L226 93 L211 68 Z" fill="#f3f6fc" stroke="#9eb4d0" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M250 48 Q257 70 266 58" fill="none" stroke="#e34e68" strokeWidth="5" strokeLinecap="round" />
                    <path d="M246 90 L279 90" stroke="#d5e2f3" strokeWidth="3" />
                  </g>

                  <g className="ks-svg-item ks-svg-item-bag">
                    <path d="M303 91 L350 91 L357 150 Q357 158 348 158 L305 158 Q297 158 298 150 Z" fill="url(#ksCartRed)" stroke="#ffd1d5" strokeWidth="3" />
                    <path d="M314 96 Q314 67 330 67 Q346 67 346 96" fill="none" stroke="#f7d6d9" strokeWidth="7" strokeLinecap="round" />
                    <path d="M312 112 L344 112" stroke="#ffccd0" strokeWidth="3" opacity=".7" />
                    <path d="M322 125 L335 125" stroke="#fff2f3" strokeWidth="3" strokeLinecap="round" />
                  </g>

                  <g className="ks-svg-item ks-svg-item-box">
                    <path d="M177 38 L222 38 L222 83 L177 83 Z" fill="url(#ksCartGold)" stroke="#fff0c9" strokeWidth="3" />
                    <path d="M199 38 L199 83 M177 55 L222 55" stroke="#fff6dc" strokeWidth="5" />
                    <path d="M199 38 C181 21 179 12 190 12 C201 12 202 27 199 38 C205 20 220 14 224 23 C228 33 211 38 199 38" fill="#f8d58b" stroke="#fff0c9" strokeWidth="2" />
                  </g>

                  {/* Cuve du chariot : métal brillant et grille */}
                  <path d="M105 105 L354 105 L326 225 Q323 238 308 238 L145 238 Q132 238 128 225 Z" fill="rgba(21,91,174,.20)" stroke="#f3f8ff" strokeWidth="10" strokeLinejoin="round" />
                  <path d="M105 105 L354 105 L326 225 Q323 238 308 238 L145 238 Q132 238 128 225 Z" fill="none" stroke="url(#ksCartMetal)" strokeWidth="5" strokeLinejoin="round" />
                  <g clipPath="url(#ksCartBasketClip)" stroke="#d7e7fb" strokeWidth="4" opacity=".72">
                    <path d="M145 102 L163 242 M184 102 L197 242 M223 102 L231 242 M262 102 L265 242 M301 102 L298 242 M340 102 L328 242" />
                    <path d="M101 139 L347 139 M112 176 L338 176 M122 211 L330 211" />
                  </g>
                  <path d="M114 111 L346 111" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity=".9" />

                  {/* Châssis et roues */}
                  <path d="M139 239 L132 264 L302 264 L316 238" fill="none" stroke="url(#ksCartMetal)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M132 263 L119 278 M302 263 L314 278" stroke="#dceaff" strokeWidth="8" strokeLinecap="round" />
                  <g className="ks-svg-wheel">
                    <circle cx="119" cy="279" r="16" fill="#102d52" stroke="#e7f1ff" strokeWidth="7" />
                    <circle cx="119" cy="279" r="5" fill="#8fb7e8" />
                  </g>
                  <g className="ks-svg-wheel">
                    <circle cx="314" cy="279" r="16" fill="#102d52" stroke="#e7f1ff" strokeWidth="7" />
                    <circle cx="314" cy="279" r="5" fill="#8fb7e8" />
                  </g>
                </svg>
              </div>

            </div>

          </div>
        </div>
      )}
      <div className="ks-login-orb ks-login-orb-top" aria-hidden="true" />
      <div className="ks-login-orb ks-login-orb-bottom" aria-hidden="true" />
      <div className="ks-login-pattern" aria-hidden="true" />

      <section className="ks-login-shell" aria-labelledby="ks-login-title">
        <div className="ks-login-topline" />

        <div className="ks-login-layout">
          <aside className="ks-login-brand-panel">
            <div className="ks-login-brand-inner">
              <img
                src="/logo.jpg"
                alt="Konan Shopping"
                className="ks-login-brand-logo"
              />
              <span className="ks-login-brand-label">KONAN SHOPPING CAMEROUN</span>
              <h2>
                Le shopping,
                <br />
                en toute <span>simplicité.</span>
              </h2>
              <p>
                Retrouvez vos articles préférés, suivez vos commandes et
                profitez d'une expérience d'achat pensée pour vous.
              </p>

              <div className="ks-login-showcase">
                <div className="ks-login-showcase-top">
                  <span className="ks-login-showcase-dot" />
                  <span>SÉLECTION KONAN SHOPPING</span>
                  <span className="ks-login-showcase-line" />
                </div>
                <div className="ks-login-showcase-content">
                  <div className="ks-login-showcase-mark">KS</div>
                  <div>
                    <strong>Votre style. Votre univers.</strong>
                    <small>Mode • Sneakers • Accessoires</small>
                  </div>
                  <span className="ks-login-showcase-arrow">↗</span>
                </div>
              </div>

              <div className="ks-login-brand-points">
                <div>
                  <span className="ks-login-point-icon">
                    <FaShieldAlt />
                  </span>
                  <span>
                    <strong>Compte protégé</strong>
                    <small>Connexion sécurisée</small>
                  </span>
                </div>
                <div>
                  <span className="ks-login-point-icon">
                    <FaHeadset />
                  </span>
                  <span>
                    <strong>À votre écoute</strong>
                    <small>Une équipe à votre service</small>
                  </span>
                </div>
              </div>
            </div>
            <span className="ks-login-brand-footer">
              L'habilleur des stars.
            </span>
          </aside>

          <div className="ks-login-form-panel">
            <header className="ks-login-header">
              <div className="ks-login-mobile-logo">
                <img src="/logo.jpg" alt="Konan Shopping" />
              </div>
              <span className="ks-login-eyebrow">
                <span />
                ESPACE CLIENT
              </span>
              <h1 id="ks-login-title">Heureux de vous revoir.</h1>
              <p>
                Connectez-vous pour accéder à votre compte et retrouver votre
                expérience Konan Shopping.
              </p>
            </header>

            <form className="ks-login-form" onSubmit={handleSubmit}>
              <div className="ks-login-field">
                <label htmlFor="ks-login-email">Adresse e-mail</label>
                <div className="ks-login-input">
                  <FaEnvelope aria-hidden="true" />
                  <input
                    id="ks-login-email"
                    type="email"
                    name="email"
                    placeholder="exemple@email.com"
                    value={email}
                    maxLength={MAX_EMAIL_LENGTH}
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={loading}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="ks-login-field">
                <label htmlFor="ks-login-password">Mot de passe</label>
                <div className="ks-login-input">
                  <FaLock aria-hidden="true" />
                  <input
                    id="ks-login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Votre mot de passe"
                    value={password}
                    maxLength={MAX_PASSWORD_LENGTH}
                    autoComplete="current-password"
                    disabled={loading}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="ks-login-eye"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    aria-pressed={showPassword}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="ks-login-forgot">
                <span>Mot de passe oublié ?</span>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/forgot-password";
                  }}
                >
                  Réinitialiser
                </button>
              </div>

              <button
                type="submit"
                className="ks-login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="ks-login-spinner" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <span className="ks-login-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="ks-login-divider">
              <span />
              <small>OU</small>
              <span />
            </div>

            <button
              type="button"
              className="ks-login-create"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              <FaUserPlus aria-hidden="true" />
              Créer un compte
              <span className="ks-login-arrow">→</span>
            </button>

            <button
              type="button"
              className="ks-login-home"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <FaArrowLeft aria-hidden="true" />
              Retour à l'accueil
            </button>

            <div className="ks-login-security">
              <span className="ks-login-security-icon">
                <FaShieldAlt aria-hidden="true" />
              </span>
              <span>
                <strong>Votre compte en sécurité</strong>
                <small>
                  Vos informations sont traitées de manière sécurisée.
                </small>
              </span>
            </div>

            <footer className="ks-login-footer">
              <span>© 2026 Konan Shopping Cameroun</span>
              <span>Une expérience d'achat simple et fiable.</span>
            </footer>
          </div>
        </div>
      </section>

      <style>{`

        /* INTRO ANIMÉE DU PANIER KONAN SHOPPING */
        .ks-intro {
          position: fixed;
          z-index: 9999;
          inset: 0;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 38%, rgba(38, 111, 226, .16), transparent 42%),
            linear-gradient(145deg, #071a36 0%, #0b2d61 52%, #0d438e 100%);
          color: #fff;
          animation: ks-intro-exit .65s ease 3.2s forwards;
        }
        .ks-intro-glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(95px);
          opacity: .23;
          pointer-events: none;
        }
        .ks-intro-glow-one { top: -260px; left: -130px; background: #4c91ff; }
        .ks-intro-glow-two { right: -190px; bottom: -270px; background: #65a9ff; }
        .ks-intro-skip {
          position: absolute;
          z-index: 3;
          top: max(24px, env(safe-area-inset-top));
          right: max(25px, env(safe-area-inset-right));
          padding: 10px 14px;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          color: rgba(255,255,255,.85);
          font: inherit;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-tap-highlight-color: transparent;
        }
        .ks-intro-skip span { margin-left: 7px; color: #9cc5ff; }
        .ks-intro-center {
          position: relative;
          display: flex;
          width: min(92vw, 620px);
          flex-direction: column;
          align-items: center;
          text-align: center;
          transform: translateY(12px);
          animation: ks-intro-center-in .6s ease both;
        }
        .ks-intro-stage {
          position: relative;
          display: grid;
          width: min(82vw, 390px);
          height: 260px;
          place-items: center;
          perspective: 900px;
        }
        .ks-intro-cart {
          position: absolute;
          top: 22px;
          left: 50%;
          width: 224px;
          height: 190px;
          transform: translateX(-50%);
          animation: ks-intro-cart-morph 3.2s cubic-bezier(.7,0,.2,1) forwards;
        }
        .ks-intro-handle {
          position: absolute;
          top: 19px;
          left: 12px;
          width: 45px;
          height: 72px;
          border: 7px solid #d9eaff;
          border-right: 0;
          border-bottom: 0;
          border-radius: 13px 0 0;
          transform: skewY(10deg);
          opacity: 0;
          animation: ks-intro-handle-draw .55s ease .12s forwards;
        }
        .ks-intro-basket {
          position: absolute;
          top: 45px;
          right: 9px;
          width: 185px;
          height: 105px;
          overflow: hidden;
          border: 7px solid #eaf3ff;
          border-top-width: 6px;
          border-radius: 7px 7px 24px 24px;
          background: linear-gradient(155deg, rgba(255,255,255,.17), rgba(255,255,255,.035));
          box-shadow: 0 18px 42px rgba(0,0,0,.18), inset 0 0 25px rgba(255,255,255,.05);
          transform: skewX(-7deg);
          clip-path: inset(0 100% 0 0);
          animation: ks-intro-basket-draw .7s cubic-bezier(.2,.8,.2,1) .35s forwards,
                     ks-intro-basket-fold .55s ease 2.55s forwards;
        }
        .ks-intro-basket::before,
        .ks-intro-basket::after {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 5px;
          content: "";
          background: rgba(211,232,255,.5);
        }
        .ks-intro-basket::before { left: 33%; }
        .ks-intro-basket::after { left: 66%; }
        .ks-intro-basket-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 25%, rgba(255,255,255,.12) 48%, transparent 70%);
          transform: translateX(-110%);
          animation: ks-intro-shine .8s ease 1.1s forwards;
        }
        .ks-intro-product {
          position: absolute;
          z-index: 2;
          bottom: 11px;
          display: grid;
          place-items: center;
          opacity: 0;
          filter: drop-shadow(0 5px 5px rgba(0,0,0,.18));
        }
        .ks-intro-product-shoe { left: 12px; width: 55px; height: 49px; animation: ks-intro-drop .55s cubic-bezier(.2,.8,.2,1) .95s forwards; }
        .ks-intro-product-shirt { left: 66px; width: 48px; height: 60px; animation: ks-intro-drop .55s cubic-bezier(.2,.8,.2,1) 1.25s forwards; }
        .ks-intro-product-bag { left: 113px; width: 42px; height: 58px; animation: ks-intro-drop .55s cubic-bezier(.2,.8,.2,1) 1.5s forwards; }
        .ks-intro-product-box { left: 145px; width: 30px; height: 43px; animation: ks-intro-drop .55s cubic-bezier(.2,.8,.2,1) 1.72s forwards; }
        .ks-intro-shoe-shape {
          position: absolute; bottom: 4px; width: 52px; height: 21px;
          border: 3px solid #0e3975; border-radius: 17px 18px 8px 8px;
          background: linear-gradient(145deg, #fff, #b8d7ff);
          transform: rotate(-13deg);
        }
        .ks-intro-shoe-shape::after {
          position: absolute; right: 3px; bottom: 3px; width: 20px; height: 3px;
          content: ""; border-radius: 5px; background: #2d75d7;
        }
        .ks-intro-shirt-shape {
          width: 43px; height: 48px; background: #f7fbff;
          clip-path: polygon(25% 0, 42% 8%, 58% 8%, 76% 0, 100% 22%, 82% 39%, 72% 31%, 72% 100%, 27% 100%, 27% 31%, 17% 39%, 0 22%);
          filter: drop-shadow(0 2px 1px #8eb8ec);
        }
        .ks-intro-bag-shape {
          position: relative; width: 38px; height: 40px; margin-top: 13px;
          border: 3px solid #d6e8ff; border-radius: 5px 5px 9px 9px;
          background: linear-gradient(145deg, #4c91e9, #174b9c);
        }
        .ks-intro-bag-shape::before {
          position: absolute; top: -15px; left: 8px; width: 16px; height: 15px;
          content: ""; border: 3px solid #d6e8ff; border-bottom: 0; border-radius: 12px 12px 0 0;
        }
        .ks-intro-box-shape {
          width: 29px; height: 33px; border: 2px solid #dceaff; border-radius: 4px;
          background: linear-gradient(135deg, #e9f3ff 0 45%, #8db9f2 46% 54%, #c7defb 55%);
        }
        .ks-intro-cart-base {
          position: absolute; top: 158px; left: 55px; width: 150px; height: 7px;
          border-radius: 8px; background: #d9eaff; opacity: 0;
          animation: ks-intro-base-in .3s ease .75s forwards;
        }
        .ks-intro-wheel {
          position: absolute; top: 174px; width: 19px; height: 19px;
          border: 5px solid #d9eaff; border-radius: 50%; background: #1a4b8e;
          opacity: 0; animation: ks-intro-wheel-in .3s ease .8s forwards;
        }
        .ks-intro-wheel-left { left: 69px; }
        .ks-intro-wheel-right { right: 24px; }
        .ks-intro-login-card {
          position: absolute;
          top: 18px;
          left: 50%;
          display: flex;
          width: min(82vw, 300px);
          min-height: 218px;
          flex-direction: column;
          gap: 9px;
          padding: 17px 19px;
          border: 1px solid rgba(222,235,255,.95);
          border-radius: 17px;
          background: #fff;
          color: #102747;
          text-align: left;
          box-shadow: 0 28px 70px rgba(0,0,0,.28);
          opacity: 0;
          transform: translate(-50%, 18px) scale(.78);
          animation: ks-intro-card-form .75s cubic-bezier(.16,1,.3,1) 2.45s forwards;
        }
        .ks-intro-card-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; color: #174eaa; font-size: 9px; font-weight: 900; letter-spacing: .1em; }
        .ks-intro-card-brand img { width: 25px; height: 25px; border-radius: 7px; object-fit: contain; }
        .ks-intro-login-card > strong { color: #0c2140; font-size: 15px; font-weight: 850; }
        .ks-intro-login-card > small { margin-top: -5px; color: #8090a5; font-size: 8px; }
        .ks-intro-card-field {
          display: flex; align-items: center; height: 28px; padding: 0 9px;
          border: 1px solid #e6edf6; border-radius: 6px; color: #9aa8ba; font-size: 8px;
        }
        .ks-intro-card-field i { width: 8px; height: 8px; margin-right: 7px; border: 1.5px solid #8fa4c0; border-radius: 50%; }
        .ks-intro-card-field b { margin-left: auto; color: #8394aa; font-size: 8px; letter-spacing: 1px; }
        .ks-intro-card-button {
          display: flex; align-items: center; justify-content: space-between; height: 29px;
          margin-top: 1px; padding: 0 10px; border-radius: 6px;
          background: linear-gradient(100deg, #1455c5, #287ced); color: #fff;
          font-size: 8px; font-weight: 850; letter-spacing: .06em;
        }
        .ks-intro-card-button span { font-size: 13px; }
        .ks-intro-copy { margin-top: 5px; animation: ks-intro-copy-in .55s ease .3s both; }
        .ks-intro-overline { color: #9fc5ff; font-size: 9px; font-weight: 850; letter-spacing: .2em; }
        .ks-intro-copy h2 { margin: 9px 0 6px; color: #fff; font-size: clamp(25px, 5vw, 34px); font-weight: 850; letter-spacing: -1px; }
        .ks-intro-copy p { margin: 0; color: rgba(230,241,255,.72); font-size: 11px; letter-spacing: .04em; }
        .ks-intro-loader { width: 118px; height: 3px; margin-top: 27px; overflow: hidden; border-radius: 9px; background: rgba(255,255,255,.18); }
        .ks-intro-loader span { display: block; width: 100%; height: 100%; border-radius: inherit; background: #a9ceff; transform: scaleX(0); transform-origin: left; animation: ks-intro-progress 3s ease forwards; }

        @keyframes ks-intro-center-in { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(12px); } }
        @keyframes ks-intro-copy-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ks-intro-handle-draw { to { opacity: 1; } }
        @keyframes ks-intro-basket-draw { to { clip-path: inset(0 0 0 0); } }
        @keyframes ks-intro-base-in { to { opacity: 1; } }
        @keyframes ks-intro-wheel-in { to { opacity: 1; transform: translateY(0); } }
        @keyframes ks-intro-drop {
          0% { opacity: 0; transform: translateY(-65px) rotate(-18deg) scale(.7); }
          75% { opacity: 1; transform: translateY(5px) rotate(4deg) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
        }
        @keyframes ks-intro-shine { to { transform: translateX(110%); } }
        @keyframes ks-intro-basket-fold {
          to { opacity: 0; transform: translateY(24px) scale(.7); clip-path: inset(0 0 100% 0); }
        }
        @keyframes ks-intro-cart-morph {
          0%, 70% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, 30px) scale(.72); }
        }
        @keyframes ks-intro-card-form {
          0% { opacity: 0; transform: translate(-50%, 22px) scale(.72); }
          70% { opacity: 1; transform: translate(-50%, -2px) scale(1.025); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes ks-intro-progress { to { transform: scaleX(1); } }
        @keyframes ks-intro-exit { to { opacity: 0; visibility: hidden; pointer-events: none; } }

        @media (max-width: 480px) {
          .ks-intro-stage { height: 235px; }
          .ks-intro-cart { transform: translateX(-50%) scale(.88); }
          .ks-intro-login-card { top: 10px; }
          .ks-intro-copy h2 { font-size: 27px; }
          .ks-intro-skip { top: max(16px, env(safe-area-inset-top)); right: 15px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ks-intro { display: none !important; }
        }
        .ks-login-page,
        .ks-login-page * { box-sizing: border-box; }

        .ks-login-page {
          --ks-navy: #071a36;
          --ks-blue: #1769e8;
          --ks-blue-deep: #104db8;
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          padding: max(34px, env(safe-area-inset-top)) 28px
            max(34px, env(safe-area-inset-bottom));
          overflow: hidden;
          background:
            radial-gradient(ellipse at 12% 8%, rgba(44, 116, 232, .10), transparent 34%),
            radial-gradient(ellipse at 90% 92%, rgba(44, 116, 232, .08), transparent 32%),
            #f4f7fc;
          color: #101828;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .ks-login-orb {
          position: absolute; z-index: -2; width: 440px; height: 440px;
          border-radius: 50%; filter: blur(100px); pointer-events: none; opacity: .28;
        }
        .ks-login-orb-top { top: -280px; left: -190px; background: #4b8ff5; }
        .ks-login-orb-bottom { right: -230px; bottom: -280px; background: #76a9f7; }
        .ks-login-pattern {
          position: absolute; z-index: -2; inset: 0; opacity: .13; pointer-events: none;
          background-image: radial-gradient(#6b91c9 .65px, transparent .65px);
          background-size: 27px 27px;
          mask-image: linear-gradient(to bottom, #000, transparent 82%);
        }

        .ks-login-shell {
          position: relative; width: min(100%, 1120px); overflow: hidden;
          border: 1px solid rgba(219, 228, 241, .95); border-radius: 25px;
          background: #fff;
          box-shadow: 0 34px 100px rgba(10, 35, 75, .13), 0 8px 28px rgba(10, 35, 75, .045);
          animation: ks-login-enter .65s cubic-bezier(.16, 1, .3, 1) both;
        }
        .ks-login-topline { height: 4px; background: linear-gradient(90deg, #0c3476, #2879ed 52%, #9bc4ff); }
        .ks-login-layout { display: grid; grid-template-columns: minmax(320px, .92fr) minmax(0, 1.08fr); min-height: 690px; }

        .ks-login-brand-panel {
          position: relative; display: flex; flex-direction: column; justify-content: space-between;
          min-width: 0; padding: 54px 48px 38px; overflow: hidden; color: #fff;
          background:
            radial-gradient(circle at 88% 13%, rgba(85, 153, 255, .22), transparent 31%),
            linear-gradient(148deg, #0b2855 0%, #0b3476 52%, #1055b8 100%);
        }
        .ks-login-brand-panel::before,
        .ks-login-brand-panel::after {
          position: absolute; content: ""; border: 1px solid rgba(255,255,255,.10);
          border-radius: 50%; pointer-events: none;
        }
        .ks-login-brand-panel::before { width: 480px; height: 480px; right: -300px; bottom: -180px; }
        .ks-login-brand-panel::after { width: 340px; height: 340px; right: -230px; bottom: -110px; }
        .ks-login-brand-inner, .ks-login-brand-footer { position: relative; z-index: 1; }
        .ks-login-brand-logo {
          display: block; width: 92px; height: 92px; margin-bottom: 42px; padding: 7px;
          border: 1px solid rgba(255,255,255,.8); border-radius: 24px; background: #fff;
          object-fit: contain; box-shadow: 0 15px 34px rgba(0,0,0,.18);
        }
        .ks-login-brand-label {
          display: block; margin-bottom: 17px; color: #bcd6ff; font-size: 10px;
          font-weight: 850; letter-spacing: .19em;
        }
        .ks-login-brand-panel h2 {
          margin: 0; color: #fff; font-size: clamp(34px, 3.4vw, 46px);
          font-weight: 850; line-height: 1.08; letter-spacing: -1.8px;
        }
        .ks-login-brand-panel h2 span { color: #91bdff; }
        .ks-login-brand-panel p {
          max-width: 340px; margin: 20px 0 27px; color: rgba(237,244,255,.78);
          font-size: 13px; line-height: 1.85;
        }

        .ks-login-showcase {
          max-width: 365px; margin: 0 0 30px; padding: 16px 17px 17px;
          border: 1px solid rgba(255,255,255,.17); border-radius: 15px;
          background: linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.055));
          box-shadow: 0 14px 34px rgba(0,0,0,.10); backdrop-filter: blur(10px);
        }
        .ks-login-showcase-top { display: flex; align-items: center; gap: 8px; color: #c9ddff; font-size: 8px; font-weight: 850; letter-spacing: .16em; }
        .ks-login-showcase-dot { width: 6px; height: 6px; border-radius: 50%; background: #7db4ff; box-shadow: 0 0 0 4px rgba(125,180,255,.13); }
        .ks-login-showcase-line { flex: 1; height: 1px; margin-left: 5px; background: rgba(255,255,255,.2); }
        .ks-login-showcase-content { display: flex; align-items: center; gap: 13px; margin-top: 17px; }
        .ks-login-showcase-mark {
          display: grid; flex: 0 0 42px; width: 42px; height: 42px; place-items: center;
          border: 1px solid rgba(255,255,255,.28); border-radius: 12px;
          background: rgba(255,255,255,.13); color: #fff; font-size: 13px; font-weight: 900; letter-spacing: -.04em;
        }
        .ks-login-showcase-content > div:nth-child(2) { display: flex; flex: 1; flex-direction: column; gap: 5px; min-width: 0; }
        .ks-login-showcase-content strong { color: #fff; font-size: 12px; font-weight: 800; }
        .ks-login-showcase-content small { color: #c0d8ff; font-size: 10px; }
        .ks-login-showcase-arrow { color: #a8ccff; font-size: 20px; }
        .ks-login-brand-points { display: grid; gap: 15px; }
        .ks-login-brand-points > div { display: flex; align-items: center; gap: 12px; }
        .ks-login-point-icon {
          display: grid; flex: 0 0 38px; width: 38px; height: 38px; place-items: center;
          border: 1px solid rgba(255,255,255,.17); border-radius: 12px;
          background: rgba(255,255,255,.09); color: #dceaff; font-size: 14px;
        }
        .ks-login-brand-points > div > span:last-child { display: flex; flex-direction: column; gap: 3px; }
        .ks-login-brand-points strong { color: #fff; font-size: 11px; font-weight: 800; }
        .ks-login-brand-points small { color: rgba(226,238,255,.65); font-size: 10px; }
        .ks-login-brand-footer { color: rgba(226,238,255,.65); font-size: 10px; font-weight: 750; letter-spacing: .09em; text-transform: uppercase; }

        .ks-login-form-panel {
          display: flex; flex-direction: column; justify-content: center; min-width: 0;
          padding: 58px clamp(42px, 5.5vw, 76px) 38px;
        }
        .ks-login-header { margin-bottom: 34px; }
        .ks-login-mobile-logo { display: none; }
        .ks-login-eyebrow {
          display: inline-flex; align-items: center; gap: 9px; margin-bottom: 15px;
          color: #2369d7; font-size: 9px; font-weight: 900; letter-spacing: .19em;
        }
        .ks-login-eyebrow > span { width: 7px; height: 7px; border-radius: 50%; background: #2879ed; box-shadow: 0 0 0 4px rgba(40,121,237,.10); }
        .ks-login-header h1 {
          margin: 0; color: #0b1e3a; font-size: clamp(30px, 3vw, 39px);
          font-weight: 850; line-height: 1.12; letter-spacing: -1.55px;
        }
        .ks-login-header p { max-width: 410px; margin: 13px 0 0; color: #718096; font-size: 12px; line-height: 1.8; }
        .ks-login-form { display: flex; flex-direction: column; gap: 20px; }
        .ks-login-field label { display: block; margin: 0 0 9px 2px; color: #263b59; font-size: 11px; font-weight: 800; }
        .ks-login-input {
          display: flex; align-items: center; width: 100%; min-width: 0; height: 57px; padding: 0 16px;
          border: 1px solid #e0e7f0; border-radius: 11px; background: #fbfcfe; color: #8da0b8;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .ks-login-input:focus-within { border-color: #6da5f4; background: #fff; box-shadow: 0 0 0 4px rgba(37,99,235,.08); }
        .ks-login-input > svg { flex: 0 0 auto; margin-right: 13px; color: #8297b4; font-size: 14px; }
        .ks-login-input input {
          flex: 1; width: 100%; min-width: 0; height: 100%; padding: 0; border: 0; outline: 0;
          background: transparent; color: #12243e; font: inherit; font-size: 16px;
          -webkit-appearance: none; appearance: none;
        }
        .ks-login-input input::placeholder { color: #a6b2c2; font-size: 12px; }
        .ks-login-eye {
          display: grid; flex: 0 0 36px; width: 36px; height: 36px; place-items: center;
          margin-left: 5px; padding: 0; border: 0; border-radius: 9px; background: transparent;
          color: #8293aa; font-size: 15px; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .ks-login-eye:hover { background: #edf4ff; color: #1769e8; }
        .ks-login-forgot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: -5px; color: #94a0b1; font-size: 10px; }
        .ks-login-forgot button { padding: 7px 0 7px 7px; border: 0; background: transparent; color: #1769e8; font: inherit; font-size: 11px; font-weight: 850; cursor: pointer; }
        .ks-login-submit, .ks-login-create, .ks-login-home {
          position: relative; display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; min-height: 55px; padding: 12px 42px; border-radius: 11px;
          font: inherit; font-size: 12px; font-weight: 850; cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
          touch-action: manipulation; -webkit-tap-highlight-color: transparent;
        }
        .ks-login-submit {
          margin-top: 2px; border: 0; background: linear-gradient(110deg, #1455c5, #2479ed);
          color: #fff; box-shadow: 0 10px 23px rgba(23,105,232,.21);
        }
        .ks-login-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 29px rgba(23,105,232,.27); }
        .ks-login-submit:active:not(:disabled), .ks-login-create:active, .ks-login-home:active { transform: scale(.99); }
        .ks-login-submit:disabled { opacity: .68; cursor: wait; box-shadow: none; }
        .ks-login-arrow { position: absolute; right: 18px; font-size: 17px; opacity: .8; transition: transform .2s ease; }
        .ks-login-submit:hover .ks-login-arrow, .ks-login-create:hover .ks-login-arrow { transform: translateX(4px); }
        .ks-login-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: ks-login-spin .7s linear infinite; }
        .ks-login-divider { display: flex; align-items: center; gap: 13px; margin: 22px 0 16px; }
        .ks-login-divider span { flex: 1; height: 1px; background: #edf0f5; }
        .ks-login-divider small { color: #a0aaba; font-size: 9px; font-weight: 900; letter-spacing: 1.3px; }
        .ks-login-create { border: 1px solid #c9dcf8; background: #fff; color: #175fc9; }
        .ks-login-create:hover { transform: translateY(-2px); border-color: #8bb7f5; background: #f8fbff; box-shadow: 0 8px 20px rgba(37,99,235,.07); }
        .ks-login-home { min-height: 43px; margin-top: 9px; border: 1px solid #edf0f4; background: #fff; color: #7a8798; font-size: 11px; font-weight: 750; }
        .ks-login-home:hover { border-color: #d6e0ed; background: #f9fbfd; color: #354761; }
        .ks-login-security {
          display: flex; align-items: center; gap: 11px; margin-top: 24px; padding: 13px 14px;
          border: 1px solid #e3edf9; border-radius: 11px; background: #f8fbff;
        }
        .ks-login-security-icon { display: grid; flex: 0 0 32px; width: 32px; height: 32px; place-items: center; border-radius: 9px; background: #eaf2ff; color: #2369d7; font-size: 13px; }
        .ks-login-security > span:last-child { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .ks-login-security strong { color: #214f91; font-size: 10px; font-weight: 850; }
        .ks-login-security small { color: #7d8ba0; font-size: 9px; line-height: 1.5; }
        .ks-login-footer { display: flex; flex-direction: column; gap: 5px; margin-top: 21px; padding-top: 16px; border-top: 1px solid #eff2f6; text-align: center; }
        .ks-login-footer span:first-child { color: #718096; font-size: 9px; font-weight: 750; }
        .ks-login-footer span:last-child { color: #a2adbb; font-size: 9px; }
        .ks-login-submit:focus-visible, .ks-login-create:focus-visible, .ks-login-home:focus-visible,
        .ks-login-eye:focus-visible, .ks-login-forgot button:focus-visible { outline: 3px solid rgba(37,99,235,.28); outline-offset: 3px; }

        @keyframes ks-login-enter { from { opacity: 0; transform: translateY(18px) scale(.992); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes ks-login-spin { to { transform: rotate(360deg); } }

        @media (min-width: 1450px) {
          .ks-login-shell { width: min(100%, 1180px); }
          .ks-login-layout { min-height: 720px; }
          .ks-login-brand-panel { padding: 64px 56px 42px; }
          .ks-login-form-panel { padding-right: 82px; padding-left: 82px; }
        }
        @media (max-width: 900px) {
          .ks-login-layout { grid-template-columns: minmax(245px, .82fr) minmax(0, 1.18fr); min-height: 650px; }
          .ks-login-brand-panel { padding: 42px 30px 30px; }
          .ks-login-form-panel { padding: 42px 36px 30px; }
          .ks-login-brand-logo { width: 82px; height: 82px; margin-bottom: 32px; }
        }
        @media (max-width: 700px) {
          .ks-login-page { align-items: stretch; padding: max(13px, env(safe-area-inset-top)) 11px max(13px, env(safe-area-inset-bottom)); }
          .ks-login-shell { width: 100%; max-width: 520px; margin: auto; border-radius: 19px; }
          .ks-login-layout { display: block; min-height: 0; }
          .ks-login-brand-panel { display: none; }
          .ks-login-form-panel { padding: 29px 24px 22px; }
          .ks-login-mobile-logo { display: grid; place-items: center; margin-bottom: 17px; }
          .ks-login-mobile-logo img { width: 75px; height: 75px; padding: 5px; border: 1px solid #e4edf9; border-radius: 20px; background: #fff; object-fit: contain; box-shadow: 0 8px 22px rgba(37,99,235,.10); }
          .ks-login-header { margin-bottom: 25px; text-align: center; }
          .ks-login-header h1 { font-size: clamp(27px, 7vw, 34px); letter-spacing: -1px; }
          .ks-login-header p { margin-right: auto; margin-left: auto; font-size: 11px; line-height: 1.7; }
          .ks-login-eyebrow { justify-content: center; }
          .ks-login-form { gap: 16px; }
          .ks-login-input { height: 55px; }
          .ks-login-submit, .ks-login-create { min-height: 53px; }
          .ks-login-security { margin-top: 20px; }
        }
        @media (max-width: 380px) {
          .ks-login-page { padding-right: 7px; padding-left: 7px; }
          .ks-login-form-panel { padding: 24px 17px 19px; }
          .ks-login-header h1 { font-size: 26px; }
          .ks-login-forgot { font-size: 9px; }
        }
        @media (max-height: 720px) and (min-width: 701px) {
          .ks-login-page { align-items: flex-start; }
          .ks-login-layout { min-height: 0; }
          .ks-login-brand-panel, .ks-login-form-panel { padding-top: 30px; padding-bottom: 25px; }
          .ks-login-brand-logo { width: 76px; height: 76px; margin-bottom: 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ks-login-page *, .ks-login-page *::before, .ks-login-page *::after {
            animation-duration: .01ms !important; animation-iteration-count: 1 !important;
            scroll-behavior: auto !important; transition-duration: .01ms !important;
          }
        }

        /* =====================================================
           FINITION RESPONSIVE — iOS / MOBILE / GRANDS ÉCRANS
           ===================================================== */
        .ks-intro {
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          padding:
            max(18px, env(safe-area-inset-top))
            max(16px, env(safe-area-inset-right))
            max(18px, env(safe-area-inset-bottom))
            max(16px, env(safe-area-inset-left));
          box-sizing: border-box;
          isolation: isolate;
        }
        .ks-intro::before {
          position: absolute;
          z-index: -1;
          inset: 0;
          content: "";
          opacity: .2;
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse at center, #000 10%, transparent 78%);
          pointer-events: none;
        }
        .ks-intro-center {
          width: min(94vw, 760px);
          transform: translateY(0);
          animation: none !important;
        }
        .ks-intro-stage {
          width: min(88vw, 460px);
          height: clamp(210px, 34vh, 300px);
          height: clamp(210px, 34svh, 300px);
          perspective: 1100px;
          transform-style: preserve-3d;
        }
        .ks-intro-cart {
          transform: translateX(-50%) rotateX(2deg) rotateY(-5deg);
          transform-origin: 50% 70%;
          filter: drop-shadow(0 24px 22px rgba(0,0,0,.2));
        }
        .ks-intro-basket {
          border-width: 6px;
          border-radius: 8px 8px 22px 22px;
          background:
            repeating-linear-gradient(90deg, transparent 0 25px, rgba(219,237,255,.16) 26px 28px),
            linear-gradient(155deg, rgba(255,255,255,.24), rgba(255,255,255,.055));
          box-shadow:
            0 20px 36px rgba(0,0,0,.22),
            inset 0 2px 5px rgba(255,255,255,.2),
            inset 0 -12px 20px rgba(0,20,55,.16);
          transform: skewX(-7deg) rotateX(-2deg);
        }
        .ks-intro-basket::before,
        .ks-intro-basket::after {
          width: 3px;
          background: rgba(225,239,255,.38);
          box-shadow: 1px 0 2px rgba(0,0,0,.12);
        }
        .ks-intro-product {
          filter: drop-shadow(0 8px 5px rgba(0,0,0,.24));
          transform-style: preserve-3d;
        }
        .ks-intro-shoe-shape {
          box-shadow: inset 0 -4px 0 rgba(26,76,139,.13), 0 2px 0 rgba(255,255,255,.8);
        }
        .ks-intro-shirt-shape {
          background: linear-gradient(135deg, #fff 0%, #e7f0fb 65%, #b9d2f1 100%);
        }
        .ks-intro-bag-shape {
          box-shadow: inset 4px 0 8px rgba(255,255,255,.18), 0 5px 9px rgba(0,0,0,.16);
        }
        .ks-intro-box-shape {
          box-shadow: inset 4px 3px 5px rgba(255,255,255,.65), 2px 5px 8px rgba(0,0,0,.14);
        }
        .ks-intro-wheel {
          box-shadow: inset 0 0 0 2px rgba(255,255,255,.12), 0 3px 6px rgba(0,0,0,.2);
        }
        .ks-intro-copy h2 {
          text-shadow: 0 5px 24px rgba(0,0,0,.2);
        }
        .ks-intro-login-card {
          box-shadow: 0 34px 85px rgba(0,0,0,.34), 0 5px 18px rgba(0,0,0,.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .ks-login-page {
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          box-sizing: border-box;
          padding:
            max(24px, env(safe-area-inset-top))
            max(22px, env(safe-area-inset-right))
            max(24px, env(safe-area-inset-bottom))
            max(22px, env(safe-area-inset-left));
          overflow-x: clip;
        }
        .ks-login-shell {
          width: min(100%, 1120px);
          margin-inline: auto;
        }
        .ks-login-layout {
          min-height: min(720px, calc(100dvh - 64px));
          grid-template-columns: minmax(300px, .88fr) minmax(390px, 1.12fr);
        }
        .ks-login-brand-panel,
        .ks-login-form-panel { min-width: 0; }
        .ks-login-form-panel {
          padding-top: clamp(36px, 5vh, 64px);
          padding-bottom: clamp(28px, 4vh, 44px);
        }
        .ks-login-input input {
          font-size: 16px !important;
          -webkit-text-size-adjust: 100%;
        }
        .ks-login-submit, .ks-login-create, .ks-login-home, .ks-login-eye,
        .ks-intro-skip {
          touch-action: manipulation;
          -webkit-appearance: none;
          appearance: none;
        }

        @media (min-width: 1600px) {
          .ks-login-shell { width: min(100%, 1240px); }
          .ks-login-layout { min-height: min(780px, calc(100dvh - 96px)); }
          .ks-login-brand-panel { padding: 76px 66px 50px; }
          .ks-login-form-panel { padding-inline: clamp(76px, 7vw, 112px); }
          .ks-login-header h1 { font-size: clamp(38px, 2.7vw, 46px); }
          .ks-login-header p { font-size: 14px; }
          .ks-login-form { gap: 23px; }
          .ks-login-input { height: 62px; }
          .ks-login-submit, .ks-login-create { min-height: 60px; font-size: 13px; }
        }
        @media (min-width: 701px) and (max-width: 1050px) {
          .ks-login-page { padding-inline: 18px; }
          .ks-login-layout { grid-template-columns: minmax(230px, .78fr) minmax(0, 1.22fr); }
          .ks-login-brand-panel { padding-inline: 26px; }
          .ks-login-form-panel { padding-inline: clamp(26px, 4vw, 42px); }
        }
        @media (max-width: 700px) {
          .ks-login-page {
            display: flex;
            align-items: center;
            justify-content: center;
            padding:
              max(12px, env(safe-area-inset-top))
              max(10px, env(safe-area-inset-right))
              max(12px, env(safe-area-inset-bottom))
              max(10px, env(safe-area-inset-left));
          }
          .ks-login-shell {
            width: 100%;
            max-width: 500px;
            margin: auto;
            border-radius: 22px;
          }
          .ks-login-form-panel {
            padding: clamp(23px, 5vh, 36px) clamp(18px, 5.5vw, 28px) 22px;
          }
          .ks-login-header { margin-bottom: clamp(19px, 3.5vh, 27px); }
          .ks-login-mobile-logo img {
            width: clamp(64px, 17vw, 78px);
            height: clamp(64px, 17vw, 78px);
          }
          .ks-login-form { gap: clamp(14px, 2.5vh, 18px); }
          .ks-login-security { margin-top: 17px; }
          .ks-login-footer { margin-top: 17px; }
          .ks-intro-center { width: min(94vw, 560px); }
          .ks-intro-stage {
            width: min(94vw, 410px);
            height: clamp(190px, 31svh, 250px);
          }
          .ks-intro-cart { transform: translateX(-50%) scale(.88); }
          .ks-intro-login-card { width: min(78vw, 290px); }
          .ks-intro-copy h2 { font-size: clamp(23px, 6vw, 30px); }
          .ks-intro-copy p { font-size: 12px; }
        }
        @media (max-width: 390px) {
          .ks-login-page { padding-inline: 8px; }
          .ks-login-shell { border-radius: 18px; }
          .ks-login-form-panel { padding-inline: 16px; }
          .ks-login-header h1 { font-size: clamp(25px, 7vw, 29px); }
          .ks-intro-stage { height: 190px; }
          .ks-intro-cart { transform: translateX(-50%) scale(.78); }
          .ks-intro-login-card { width: min(82vw, 270px); padding: 14px 15px; }
          .ks-intro-copy p { max-width: 270px; }
        }
        @media (max-height: 760px) and (max-width: 700px) {
          .ks-login-page { align-items: flex-start; }
          .ks-login-shell { margin-block: 8px; }
          .ks-login-form-panel { padding-top: 18px; padding-bottom: 17px; }
          .ks-login-mobile-logo { margin-bottom: 10px; }
          .ks-login-mobile-logo img { width: 58px; height: 58px; }
          .ks-login-header { margin-bottom: 17px; }
          .ks-login-header p { margin-top: 8px; }
          .ks-login-security { padding: 10px 12px; }
          .ks-login-footer { margin-top: 12px; padding-top: 12px; }
          .ks-intro-stage { height: 180px; }
          .ks-intro-cart { transform: translateX(-50%) scale(.76); }
          .ks-intro-copy { margin-top: 0; }
        }
        @supports (-webkit-touch-callout: none) {
          .ks-login-page {
            min-height: -webkit-fill-available;
            -webkit-overflow-scrolling: touch;
          }
          .ks-intro { min-height: -webkit-fill-available; }
          .ks-login-input input { border-radius: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ks-intro { animation: none !important; }
          .ks-intro *, .ks-intro *::before, .ks-intro *::after {
            animation: none !important;
            transition: none !important;
          }
        }


        /* INTRO ÉPURÉE : SEUL LE CHARIOT RESTE À L'ÉCRAN */
        .ks-intro-cart {
          animation: none !important;
          opacity: 1 !important;
          width: min(92vw, 430px);
          height: clamp(230px, 34vh, 300px);
          height: clamp(230px, 34svh, 300px);
          top: 0;
          display: grid;
          place-items: center;
          transform: translateX(-50%);
          filter: drop-shadow(0 22px 26px rgba(0,0,0,.24));
        }
        .ks-real-cart {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .ks-svg-item {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          filter: drop-shadow(0 7px 5px rgba(0,0,0,.2));
        }
        .ks-svg-item-shoe { animation: ks-svg-drop .68s cubic-bezier(.16,.85,.25,1) .65s forwards; }
        .ks-svg-item-shirt { animation: ks-svg-drop .68s cubic-bezier(.16,.85,.25,1) .95s forwards; }
        .ks-svg-item-bag { animation: ks-svg-drop .68s cubic-bezier(.16,.85,.25,1) 1.22s forwards; }
        .ks-svg-item-box { animation: ks-svg-drop .68s cubic-bezier(.16,.85,.25,1) 1.48s forwards; }
        .ks-svg-wheel { transform-box: fill-box; transform-origin: center; animation: ks-wheel-roll 1.1s ease-in-out 1.8s both; }
        @keyframes ks-svg-drop {
          0% { opacity: 0; transform: translateY(-105px) rotate(-18deg) scale(.72); }
          68% { opacity: 1; transform: translateY(9px) rotate(5deg) scale(1.04); }
          84% { transform: translateY(-4px) rotate(-2deg) scale(.99); }
          100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
        }
        @keyframes ks-wheel-roll {
          0%,100% { transform: rotate(0); }
          35% { transform: rotate(90deg); }
          70% { transform: rotate(180deg); }
        }
        @media (max-width: 700px) {
          .ks-intro-cart {
            width: min(96vw, 390px);
            height: clamp(205px, 31svh, 260px);
          }
        }
        @media (max-width: 390px) {
          .ks-intro-cart { width: min(100vw, 350px); height: 205px; }
        }
        @media (max-height: 760px) and (max-width: 700px) {
          .ks-intro-cart { height: 195px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ks-svg-item, .ks-svg-wheel { animation: none !important; opacity: 1; }
        }



        /* =====================================================
           VERSION PREMIUM — ZOOM DU CHARIOT + CARTE DE CONNEXION
           Modifications visuelles uniquement : aucune logique
           d'authentification, API ou sécurité n'est modifiée.
           ===================================================== */

        /* Le chariot garde son animation de zoom jusqu'à la transition */
        .ks-intro-cart {
          animation: ks-cart-premium-zoom 3.2s cubic-bezier(.18,.72,.22,1) both !important;
          transform-origin: 50% 58%;
          will-change: transform, opacity;
        }

        @keyframes ks-cart-premium-zoom {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(.62) rotateX(7deg) rotateY(-8deg);
          }
          18% {
            opacity: 1;
            transform: translateX(-50%) scale(.82) rotateX(4deg) rotateY(-5deg);
          }
          52% {
            opacity: 1;
            transform: translateX(-50%) scale(1.04) rotateX(2deg) rotateY(-3deg);
          }
          70% {
            opacity: 1;
            transform: translateX(-50%) scale(.98) rotateX(2deg) rotateY(-3deg);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1.22) rotateX(0) rotateY(0);
          }
        }

        /* Carte principale : sobre, nette et haut de gamme */
        .ks-login-shell {
          width: min(100%, 1160px);
          border: 1px solid #e7edf5;
          border-radius: 26px;
          background: #fff;
          box-shadow:
            0 32px 90px rgba(13, 42, 82, .10),
            0 8px 24px rgba(13, 42, 82, .045);
          overflow: hidden;
        }

        .ks-login-topline {
          height: 4px;
          background: linear-gradient(90deg, #0b2e66 0%, #1769e8 55%, #a8ccff 100%);
        }

        .ks-login-layout {
          grid-template-columns: minmax(290px, .86fr) minmax(390px, 1.14fr);
          min-height: 660px;
        }

        .ks-login-brand-panel {
          padding: clamp(38px, 4.4vw, 62px);
          background:
            radial-gradient(circle at 88% 12%, rgba(116, 174, 255, .18), transparent 31%),
            linear-gradient(150deg, #09234b 0%, #0b3474 58%, #1054b2 100%);
        }

        .ks-login-brand-logo {
          width: 82px;
          height: 82px;
          margin-bottom: 38px;
          border-radius: 20px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, .16);
        }

        .ks-login-brand-panel h2 {
          font-size: clamp(32px, 3.2vw, 43px);
          letter-spacing: -1.5px;
          line-height: 1.12;
        }

        .ks-login-brand-panel p {
          max-width: 350px;
          font-size: 13px;
          line-height: 1.8;
        }

        .ks-login-showcase {
          border-color: rgba(255,255,255,.14);
          border-radius: 14px;
          background: rgba(255,255,255,.075);
          box-shadow: none;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .ks-login-brand-points {
          gap: 13px;
        }

        .ks-login-point-icon {
          border-radius: 11px;
          background: rgba(255,255,255,.10);
        }

        .ks-login-form-panel {
          padding: clamp(42px, 5vw, 68px) clamp(34px, 5.2vw, 76px) 34px;
          background: #fff;
        }

        .ks-login-header {
          margin-bottom: 30px;
        }

        .ks-login-eyebrow {
          margin-bottom: 13px;
          font-size: 9px;
          letter-spacing: .17em;
        }

        .ks-login-header h1 {
          color: #10233f;
          font-size: clamp(29px, 2.8vw, 38px);
          letter-spacing: -1.35px;
        }

        .ks-login-header p {
          max-width: 390px;
          margin-top: 11px;
          color: #758399;
          font-size: 12px;
          line-height: 1.75;
        }

        .ks-login-form {
          gap: 18px;
        }

        .ks-login-field label {
          margin-bottom: 8px;
          color: #263b59;
          font-size: 11px;
          font-weight: 750;
        }

        .ks-login-input {
          height: 56px;
          padding-inline: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fbfcfe;
          box-shadow: inset 0 1px 1px rgba(15, 23, 42, .015);
        }

        .ks-login-input:focus-within {
          border-color: #75a8f2;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, .075);
        }

        .ks-login-input > svg {
          color: #8294ad;
        }

        .ks-login-input input {
          color: #142641;
          font-size: 16px;
        }

        .ks-login-input input::placeholder {
          color: #a4afbf;
          font-size: 12px;
        }

        .ks-login-eye {
          border-radius: 9px;
        }

        .ks-login-forgot {
          margin-top: -3px;
          color: #8794a7;
          font-size: 10px;
        }

        .ks-login-forgot button {
          color: #1769d2;
          font-size: 11px;
        }

        .ks-login-submit,
        .ks-login-create,
        .ks-login-home {
          min-height: 54px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
        }

        .ks-login-submit {
          margin-top: 3px;
          background: linear-gradient(105deg, #1557c5, #2478e9);
          box-shadow: 0 9px 20px rgba(23, 105, 232, .18);
        }

        .ks-login-submit:hover:not(:disabled) {
          box-shadow: 0 13px 25px rgba(23, 105, 232, .23);
        }

        .ks-login-divider {
          margin: 19px 0 14px;
        }

        .ks-login-create {
          border-color: #d7e4f5;
          color: #175fc9;
          background: #fff;
        }

        .ks-login-create:hover {
          border-color: #a9c8f2;
          background: #f8fbff;
        }

        .ks-login-home {
          min-height: 43px;
          margin-top: 8px;
          border-color: #edf1f6;
          color: #748197;
          background: #fff;
        }

        .ks-login-security {
          margin-top: 21px;
          padding: 12px 13px;
          border-color: #e7eef8;
          border-radius: 12px;
          background: #f8faff;
        }

        .ks-login-security-icon {
          border-radius: 9px;
          background: #eaf2ff;
        }

        .ks-login-footer {
          margin-top: 18px;
          padding-top: 14px;
          border-color: #edf1f6;
        }

        /* Tablettes et écrans intermédiaires */
        @media (min-width: 701px) and (max-width: 1050px) {
          .ks-login-shell {
            width: min(100%, 940px);
            border-radius: 22px;
          }

          .ks-login-layout {
            grid-template-columns: minmax(230px, .78fr) minmax(0, 1.22fr);
            min-height: 620px;
          }

          .ks-login-brand-panel {
            padding: 36px 26px 30px;
          }

          .ks-login-form-panel {
            padding: 38px clamp(25px, 4vw, 42px) 28px;
          }
        }

        /* Mobiles, y compris Safari iOS */
        @media (max-width: 700px) {
          .ks-login-page {
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            align-items: center;
            padding:
              max(12px, env(safe-area-inset-top))
              max(10px, env(safe-area-inset-right))
              max(12px, env(safe-area-inset-bottom))
              max(10px, env(safe-area-inset-left));
          }

          .ks-login-shell {
            width: 100%;
            max-width: 500px;
            margin: auto;
            border-radius: 20px;
            box-shadow:
              0 20px 55px rgba(13, 42, 82, .09),
              0 4px 14px rgba(13, 42, 82, .035);
          }

          .ks-login-layout {
            display: block;
            min-height: 0;
          }

          .ks-login-brand-panel {
            display: none;
          }

          .ks-login-form-panel {
            display: flex;
            padding:
              clamp(22px, 5svh, 34px)
              clamp(17px, 5vw, 27px)
              max(20px, env(safe-area-inset-bottom));
          }

          .ks-login-mobile-logo {
            display: grid;
            place-items: center;
            margin-bottom: 15px;
          }

          .ks-login-mobile-logo img {
            width: 68px;
            height: 68px;
            padding: 5px;
            border: 1px solid #e8eef7;
            border-radius: 18px;
            background: #fff;
            object-fit: contain;
            box-shadow: 0 7px 19px rgba(37, 99, 235, .08);
          }

          .ks-login-header {
            margin-bottom: 23px;
            text-align: center;
          }

          .ks-login-eyebrow {
            justify-content: center;
            margin-bottom: 11px;
          }

          .ks-login-header h1 {
            font-size: clamp(26px, 7vw, 33px);
            letter-spacing: -1px;
            line-height: 1.14;
          }

          .ks-login-header p {
            max-width: 340px;
            margin: 10px auto 0;
            font-size: 11px;
            line-height: 1.65;
          }

          .ks-login-form {
            gap: 16px;
          }

          .ks-login-input {
            height: 54px;
            border-radius: 11px;
          }

          .ks-login-submit,
          .ks-login-create {
            min-height: 52px;
          }

          .ks-login-security {
            margin-top: 18px;
          }

          .ks-login-footer {
            margin-top: 15px;
            padding-top: 13px;
          }

          .ks-intro-stage {
            width: min(94vw, 410px);
          }

          .ks-intro-cart {
            width: min(96vw, 390px);
            height: clamp(205px, 31svh, 260px);
          }
        }

        @media (max-width: 390px) {
          .ks-login-page {
            padding-inline: 8px;
          }

          .ks-login-shell {
            border-radius: 18px;
          }

          .ks-login-form-panel {
            padding-inline: 16px;
          }

          .ks-login-mobile-logo img {
            width: 62px;
            height: 62px;
          }

          .ks-login-header h1 {
            font-size: 26px;
          }

          .ks-login-forgot {
            font-size: 9px;
          }

          .ks-intro-cart {
            width: min(100vw, 350px);
            height: 205px;
          }
        }

        /* Grands écrans : proportions équilibrées, sans étirer le formulaire */
        @media (min-width: 1450px) {
          .ks-login-shell {
            width: min(100%, 1220px);
          }

          .ks-login-layout {
            min-height: min(740px, calc(100dvh - 80px));
            grid-template-columns: minmax(330px, .88fr) minmax(440px, 1.12fr);
          }

          .ks-login-brand-panel {
            padding: 68px 62px 44px;
          }

          .ks-login-form-panel {
            padding-inline: clamp(66px, 6vw, 96px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ks-intro-cart {
            animation: none !important;
            transform: translateX(-50%) scale(1) !important;
          }
        }



        /* =====================================================
           CORRECTIONS FINALES — SAFARI iOS / RESPONSIVE
           CSS uniquement : aucune modification de l'authentification.
           ===================================================== */

        .ks-login-page,
        .ks-login-shell,
        .ks-login-layout,
        .ks-login-form-panel,
        .ks-login-brand-panel,
        .ks-login-form,
        .ks-login-field,
        .ks-login-input {
          min-width: 0;
        }

        .ks-login-page {
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
          -webkit-text-size-adjust: 100%;
        }

        .ks-login-shell {
          max-width: 100%;
        }

        .ks-login-input input {
          min-width: 0;
          max-width: 100%;
          font-size: 16px !important;
          line-height: normal;
        }

        .ks-login-submit,
        .ks-login-create,
        .ks-login-home,
        .ks-login-eye,
        .ks-login-forgot button {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .ks-login-brand-panel,
        .ks-login-form-panel {
          overflow-wrap: anywhere;
        }

        .ks-login-mobile-logo img,
        .ks-login-brand-logo {
          max-width: 100%;
        }

        @media (max-width: 700px) {
          .ks-login-page {
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            align-items: flex-start;
            padding-top: max(14px, env(safe-area-inset-top));
            padding-right: max(10px, env(safe-area-inset-right));
            padding-bottom: max(18px, env(safe-area-inset-bottom));
            padding-left: max(10px, env(safe-area-inset-left));
          }

          .ks-login-shell {
            flex: 0 0 auto;
            width: 100%;
            margin-top: auto;
            margin-bottom: auto;
          }

          .ks-login-layout {
            width: 100%;
          }

          .ks-login-form-panel {
            width: 100%;
            padding-bottom: max(20px, env(safe-area-inset-bottom));
          }

          .ks-login-input {
            width: 100%;
          }

          .ks-login-forgot {
            flex-wrap: wrap;
          }

          .ks-login-submit,
          .ks-login-create,
          .ks-login-home {
            min-height: 48px;
          }

          .ks-login-footer {
            overflow-wrap: anywhere;
          }
        }

        @media (max-width: 360px) {
          .ks-login-page {
            padding-right: max(7px, env(safe-area-inset-right));
            padding-left: max(7px, env(safe-area-inset-left));
          }

          .ks-login-form-panel {
            padding-right: 14px;
            padding-left: 14px;
          }

          .ks-login-forgot {
            align-items: flex-start;
            gap: 4px 8px;
          }

          .ks-login-header h1 {
            font-size: 24px;
          }
        }

        @media (max-height: 620px) and (max-width: 700px) {
          .ks-login-page {
            align-items: flex-start;
          }

          .ks-login-shell {
            margin-top: 8px;
            margin-bottom: 8px;
          }

          .ks-login-form-panel {
            padding-top: 18px;
          }

          .ks-login-mobile-logo {
            margin-bottom: 8px;
          }

          .ks-login-mobile-logo img {
            width: 52px;
            height: 52px;
          }

          .ks-login-header {
            margin-bottom: 16px;
          }
        }

        @supports (-webkit-touch-callout: none) {
          .ks-login-page {
            min-height: -webkit-fill-available;
          }

          .ks-login-input input {
            font-size: 16px !important;
            -webkit-appearance: none;
            appearance: none;
          }

          .ks-login-submit,
          .ks-login-create,
          .ks-login-home,
          .ks-login-eye {
            -webkit-appearance: none;
            appearance: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ks-login-page *,
          .ks-login-page *::before,
          .ks-login-page *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }


        /* =====================================================
           AJUSTEMENTS FINALS — CLAVIER iOS / PETITS ÉCRANS
           Styles uniquement : logique et sécurité inchangées.
           ===================================================== */
        .ks-login-page {
          min-width: 0;
          overscroll-behavior-y: contain;
          -webkit-overflow-scrolling: touch;
        }

        .ks-login-page img,
        .ks-login-page svg {
          max-width: 100%;
        }

        .ks-login-form-panel,
        .ks-login-header,
        .ks-login-footer,
        .ks-login-security {
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .ks-login-input {
          min-width: 0;
        }

        .ks-login-input input {
          min-width: 0;
          width: 1%;
          flex: 1 1 0%;
          font-size: 16px !important;
          line-height: 1.35;
        }

        .ks-login-eye,
        .ks-login-forgot button,
        .ks-login-submit,
        .ks-login-create,
        .ks-login-home {
          flex-shrink: 0;
          touch-action: manipulation;
        }

        .ks-intro {
          width: 100%;
          width: 100vw;
          overflow: hidden;
          overflow: clip;
        }

        @media (max-width: 700px) {
          .ks-login-page {
            display: flex;
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            height: auto;
            align-items: flex-start;
            justify-content: center;
            overflow-y: auto;
            padding-top: max(12px, env(safe-area-inset-top));
            padding-bottom: max(18px, env(safe-area-inset-bottom));
          }

          .ks-login-shell {
            flex: 0 0 auto;
            width: 100%;
            max-width: 500px;
            margin: auto;
          }

          .ks-login-form-panel {
            width: 100%;
            min-width: 0;
          }

          .ks-login-header h1 {
            max-width: 100%;
            overflow-wrap: anywhere;
          }

          .ks-login-forgot {
            min-width: 0;
          }

          .ks-login-forgot span,
          .ks-login-forgot button {
            min-width: 0;
            overflow-wrap: anywhere;
          }

          .ks-login-security small,
          .ks-login-footer span {
            overflow-wrap: anywhere;
          }

          .ks-login-submit,
          .ks-login-create,
          .ks-login-home {
            min-height: 48px;
          }
        }

        @media (max-width: 700px) and (orientation: landscape) {
          .ks-login-page {
            align-items: flex-start;
            padding-top: max(10px, env(safe-area-inset-top));
          }

          .ks-login-shell {
            margin-top: 8px;
            margin-bottom: 8px;
          }

          .ks-login-form-panel {
            padding-top: 18px;
            padding-bottom: max(18px, env(safe-area-inset-bottom));
          }

          .ks-login-mobile-logo {
            margin-bottom: 8px;
          }

          .ks-login-mobile-logo img {
            width: 48px;
            height: 48px;
          }

          .ks-login-header {
            margin-bottom: 14px;
          }
        }

        @media (max-width: 350px) {
          .ks-login-form-panel {
            padding-right: 12px;
            padding-left: 12px;
          }

          .ks-login-input {
            padding-right: 10px;
            padding-left: 10px;
          }

          .ks-login-input > svg {
            margin-right: 9px;
          }

          .ks-login-header h1 {
            font-size: 23px;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .ks-login-submit,
          .ks-login-create,
          .ks-login-home,
          .ks-login-eye,
          .ks-login-forgot button {
            -webkit-tap-highlight-color: transparent;
          }

          .ks-login-submit:hover:not(:disabled),
          .ks-login-create:hover,
          .ks-login-home:hover {
            transform: none;
          }
        }

        @supports (height: 100dvh) {
          @media (max-width: 700px) {
            .ks-login-page {
              min-height: 100dvh;
            }
          }
        }


        /* =====================================================
           CORRECTION DÉFINITIVE — UN SEUL CONTENEUR DE SCROLL
           La page de connexion occupe la fenêtre et devient
           l'unique zone défilante. Le document parent ne défile
           plus en parallèle. Authentification et sécurité intactes.
           ===================================================== */
        .ks-login-page {
          position: fixed !important;
          inset: 0 !important;
          z-index: 1;
          display: flex;
          align-items: flex-start !important;
          justify-content: center;
          width: 100% !important;
          height: 100vh !important;
          height: 100dvh !important;
          min-height: 0 !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding:
            max(24px, env(safe-area-inset-top))
            max(22px, env(safe-area-inset-right))
            max(24px, env(safe-area-inset-bottom))
            max(22px, env(safe-area-inset-left));
          overflow-x: hidden !important;
          overflow-y: auto !important;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          box-sizing: border-box !important;
        }

        .ks-login-page > .ks-login-shell {
          flex: 0 0 auto;
          margin: auto;
        }

        @media (max-width: 700px) {
          .ks-login-page {
            padding:
              max(12px, env(safe-area-inset-top))
              max(10px, env(safe-area-inset-right))
              max(18px, env(safe-area-inset-bottom))
              max(10px, env(safe-area-inset-left));
          }

          .ks-login-page > .ks-login-shell {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
          }
        }

        /* =====================================================
           THEME SAISONNIER KONAN SHOPPING
           Couleurs pilotées par ThemeProvider, comme App.jsx.
           Couche visuelle uniquement : aucune logique ni sécurité
           d'authentification n'est modifiée.
           Les effets réalistes propres à chaque saison seront
           ajoutés dans une étape séparée.
           ===================================================== */

        .ks-login-page {
          --ks-theme-primary: var(--season-primary, #5B3CC4);
          --ks-theme-secondary: var(--season-secondary, #7C4DFF);
          --ks-theme-decoration: var(--season-decoration, #9B83E8);
          --ks-theme-page: var(--season-page, #f5f5f7);
          --ks-theme-surface: var(--season-surface, #ffffff);
          --ks-theme-text: var(--season-text, #172033);
          --ks-theme-muted: var(--season-muted, #718096);
          --ks-theme-border: var(--season-border, #e5e7eb);
          --ks-theme-glow: var(--season-glow, rgba(91,60,196,.14));
          background:
            radial-gradient(ellipse at 12% 8%, var(--ks-theme-glow), transparent 34%),
            radial-gradient(ellipse at 90% 92%, var(--ks-theme-glow), transparent 32%),
            var(--ks-theme-page);
          color: var(--ks-theme-text);
        }

        .ks-intro {
          background:
            radial-gradient(ellipse at 50% 38%, var(--ks-theme-glow), transparent 42%),
            linear-gradient(145deg, var(--ks-theme-primary, #5B3CC4), var(--ks-theme-secondary, #7C4DFF));
        }

        .ks-intro-glow-one,
        .ks-intro-glow-two {
          background: var(--ks-theme-decoration, #9B83E8);
        }

        .ks-login-shell {
          border-color: var(--ks-theme-border);
          background: var(--ks-theme-surface);
        }

        .ks-login-topline {
          background: linear-gradient(
            90deg,
            var(--ks-theme-primary),
            var(--ks-theme-secondary) 58%,
            var(--ks-theme-decoration)
          );
        }

        .ks-login-brand-panel {
          background:
            radial-gradient(circle at 88% 12%, var(--ks-theme-glow), transparent 31%),
            linear-gradient(150deg, var(--ks-theme-primary), var(--ks-theme-secondary));
        }

        .ks-login-brand-label,
        .ks-login-brand-panel h2 span,
        .ks-login-showcase-top,
        .ks-login-showcase-dot,
        .ks-login-showcase-arrow {
          color: var(--ks-theme-decoration);
        }

        .ks-login-showcase-dot {
          background: var(--ks-theme-decoration);
          box-shadow: 0 0 0 4px var(--ks-theme-glow);
        }

        .ks-login-form-panel {
          background: var(--ks-theme-surface);
        }

        .ks-login-eyebrow,
        .ks-login-forgot button,
        .ks-login-create,
        .ks-login-security-icon {
          color: var(--ks-theme-primary);
        }

        .ks-login-eyebrow > span {
          background: var(--ks-theme-primary);
          box-shadow: 0 0 0 4px var(--ks-theme-glow);
        }

        .ks-login-header h1 {
          color: var(--ks-theme-text);
        }

        .ks-login-header p,
        .ks-login-forgot {
          color: var(--ks-theme-muted);
        }

        .ks-login-input {
          border-color: var(--ks-theme-border);
          background: var(--ks-theme-page);
        }

        .ks-login-input:focus-within {
          border-color: var(--ks-theme-primary);
          box-shadow: 0 0 0 4px var(--ks-theme-glow);
          background: var(--ks-theme-surface);
        }

        .ks-login-submit {
          background: linear-gradient(
            110deg,
            var(--ks-theme-primary),
            var(--ks-theme-secondary)
          );
          box-shadow: var(--season-button-shadow, 0 10px 23px var(--ks-theme-glow));
        }

        .ks-login-submit:hover:not(:disabled) {
          box-shadow: 0 15px 29px var(--ks-theme-glow);
        }

        .ks-login-create {
          border-color: var(--ks-theme-border);
          background: var(--ks-theme-surface);
        }

        .ks-login-create:hover {
          border-color: var(--ks-theme-primary);
          background: var(--ks-theme-page);
          box-shadow: 0 8px 20px var(--ks-theme-glow);
        }

        .ks-login-security {
          border-color: var(--ks-theme-border);
          background: var(--ks-theme-page);
        }

        .ks-login-security-icon {
          background: var(--ks-theme-glow);
        }

        .ks-login-security strong {
          color: var(--ks-theme-primary);
        }

        .ks-login-brand-panel h2 span {
          color: var(--ks-theme-decoration);
        }

        .ks-login-submit:focus-visible,
        .ks-login-create:focus-visible,
        .ks-login-home:focus-visible,
        .ks-login-eye:focus-visible,
        .ks-login-forgot button:focus-visible {
          outline-color: var(--ks-theme-primary);
        }

        @media (prefers-reduced-motion: reduce) {
          .ks-login-page *,
          .ks-login-page *::before,
          .ks-login-page *::after,
          .ks-intro *,
          .ks-intro *::before,
          .ks-intro *::after {
            transition-duration: .01ms !important;
          }
        }


      `}</style>
    </main>
  );
}

export default UserLogin;
