import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/*
 * Sécurisation frontend :
 * - aucune donnée sensible n'est ajoutée à cette page ;
 * - lecture de localStorage protégée contre JSON invalide ;
 * - accès à window/localStorage encapsulé pour éviter les crashes navigateur ;
 * - checkoutProduct est supprimé comme dans la logique originale ;
 * - aucune route/API/backend inventée : cette page n'effectue aucun appel réseau.
 */

const readStoredUser = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }

    const rawUser = window.localStorage.getItem("user");

    if (!rawUser || rawUser.length > 10000) {
      return null;
    }

    const parsedUser = JSON.parse(rawUser);

    if (
      parsedUser === null ||
      typeof parsedUser !== "object" ||
      Array.isArray(parsedUser)
    ) {
      return null;
    }

    return parsedUser;
  } catch {
    return null;
  }
};

const clearCheckoutProduct = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("checkoutProduct");
    }
  } catch {
    // Ne jamais bloquer la page de confirmation à cause du stockage navigateur.
  }
};

const isMobileViewport = () => {
  try {
    return typeof window !== "undefined" && window.innerWidth <= 768;
  } catch {
    return false;
  }
};

function Success() {
  const [user] = useState(() => readStoredUser());
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());

  useEffect(() => {
    clearCheckoutProduct();

    // /success : un seul conteneur vertical de défilement.
    // Le document HTML est verrouillé ; le body prend le relais.
    // Tous les styles inline sont restaurés en quittant cette page.
    const html = typeof document !== "undefined" ? document.documentElement : null;
    const body = typeof document !== "undefined" ? document.body : null;

    const previousHtmlOverflow = html?.style.overflow ?? "";
    const previousHtmlOverflowY = html?.style.overflowY ?? "";
    const previousBodyOverflowY = body?.style.overflowY ?? "";
    const previousBodyHeight = body?.style.height ?? "";
    const previousBodyMinHeight = body?.style.minHeight ?? "";
    const previousBodyWebkitOverflowScrolling = body?.style.webkitOverflowScrolling ?? "";

    if (html) {
      html.style.overflow = "hidden";
      html.style.overflowY = "hidden";
    }
    if (body) {
      body.style.height = "100dvh";
      body.style.minHeight = "0";
      body.style.overflowY = "auto";
      body.style.webkitOverflowScrolling = "touch";
    }

    const handleResize = () => {
      setIsMobile(isMobileViewport());
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize, { passive: true });
      window.addEventListener("orientationchange", handleResize, { passive: true });
      window.visualViewport?.addEventListener("resize", handleResize, { passive: true });
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
      }

      if (html) {
        html.style.overflow = previousHtmlOverflow;
        html.style.overflowY = previousHtmlOverflowY;
      }
      if (body) {
        body.style.overflowY = previousBodyOverflowY;
        body.style.height = previousBodyHeight;
        body.style.minHeight = previousBodyMinHeight;
        body.style.webkitOverflowScrolling = previousBodyWebkitOverflowScrolling;
      }
    };
  }, []);

  return (
    <main className={`konan-success-page ${isMobile ? "is-mobile" : ""}`}>
      <div className="konan-success-orb konan-success-orb-one" />
      <div className="konan-success-orb konan-success-orb-two" />

      <section className="konan-success-card" aria-labelledby="success-title">
        <div className="konan-success-top-glow" />

        <div className="konan-success-content">
          {/* Icône animée de confirmation */}
          <div className="konan-success-icon-stage" aria-hidden="true">
            <span className="konan-success-ring konan-success-ring-one" />
            <span className="konan-success-ring konan-success-ring-two" />
            <span className="konan-success-spark konan-success-spark-one" />
            <span className="konan-success-spark konan-success-spark-two" />
            <span className="konan-success-spark konan-success-spark-three" />
            <div className="konan-success-icon">
              <i className="fa-solid fa-check" />
            </div>
          </div>

          <div className="konan-success-eyebrow">
            <span className="konan-success-eyebrow-dot" />
            Confirmation de commande
          </div>

          <h1 id="success-title" className="konan-success-title">
            Commande confirmée
          </h1>

          <p className="konan-success-description">
            Merci d’avoir commandé sur{" "}
            <strong>Konan Shopping Cameroun</strong>.
            <br />
            <br />
            Votre commande a été reçue avec succès et notre équipe prépare
            actuellement votre livraison.
            <br />
            <br />
            {user
              ? "Connectez-vous à votre compte afin de :"
              : "Créez un compte afin de :"}
          </p>

          {/* Avantages du compte */}
          <div className="konan-success-features">
            <div className="konan-success-feature">
              <div className="konan-success-feature-icon feature-purple">
                <i className="fa-solid fa-map-location-dot" aria-hidden="true" />
              </div>
              <div className="konan-success-feature-copy">
                <h3>Suivi commande en direct</h3>
                <p>Suivez l’évolution de votre livraison en temps réel.</p>
              </div>
              <i className="fa-solid fa-check konan-success-feature-check" aria-hidden="true" />
            </div>

            <div className="konan-success-feature">
              <div className="konan-success-feature-icon feature-green">
                <i className="fa-solid fa-bell-concierge" aria-hidden="true" />
              </div>
              <div className="konan-success-feature-copy">
                <h3>Notifications automatiques</h3>
                <p>Recevez les mises à jour de livraison instantanément.</p>
              </div>
              <i className="fa-solid fa-check konan-success-feature-check" aria-hidden="true" />
            </div>

            <div className="konan-success-feature">
              <div className="konan-success-feature-icon feature-blue">
                <i className="fa-solid fa-timeline" aria-hidden="true" />
              </div>
              <div className="konan-success-feature-copy">
                <h3>Historique commandes</h3>
                <p>Retrouvez facilement toutes vos commandes précédentes.</p>
              </div>
              <i className="fa-solid fa-check konan-success-feature-check" aria-hidden="true" />
            </div>
          </div>

          {/* État de la commande */}
          <div className="konan-success-status">
            <div className="konan-success-status-item">
              <p>
                <i className="fa-solid fa-box-open" aria-hidden="true" />
                Statut
              </p>
              <h3>
                <span className="konan-status-dot" />
                Confirmée
              </h3>
            </div>

            <div className="konan-success-status-divider" />

            <div className="konan-success-status-item">
              <p>
                <i className="fa-solid fa-truck-fast" aria-hidden="true" />
                Livraison
              </p>
              <h3 className="konan-delivery-status">En préparation</h3>
            </div>
          </div>

          {/* Actions existantes : destinations inchangées */}
          <div className="konan-success-actions">
            <Link to="/" className="konan-success-link">
              <button type="button" className="konan-success-button primary">
                <i className="fa-solid fa-shop" aria-hidden="true" />
                Retour accueil
                <i className="fa-solid fa-arrow-right konan-button-arrow" aria-hidden="true" />
              </button>
            </Link>

            <Link
              to={user ? "/account" : "/register"}
              className="konan-success-link"
            >
              <button type="button" className="konan-success-button secondary">
                <i className="fa-solid fa-id-card" aria-hidden="true" />
                {user ? "Rejoindre mon compte" : "Créer un compte"}
                <i className="fa-solid fa-arrow-right konan-button-arrow" aria-hidden="true" />
              </button>
            </Link>
          </div>

          <div className="konan-success-trust">
            <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            Merci de faire confiance à Konan Shopping
          </div>
        </div>
      </section>

      <style>{`
        .konan-success-page {
          --ks-blue: var(--season-primary, #2563eb);
          --ks-blue-dark: var(--season-secondary, #3b82f6);
          --ks-ink: #111827;
          --ks-muted: #64748b;
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          overflow: hidden;
          padding: max(28px, env(safe-area-inset-top)) 22px max(28px, env(safe-area-inset-bottom));
          background:
            radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--season-secondary, #3b82f6) 10%, transparent), transparent 42%),
            linear-gradient(135deg, color-mix(in srgb, var(--season-primary, #2563eb) 5%, white) 0%, #f8fafc 52%, color-mix(in srgb, var(--season-secondary, #3b82f6) 7%, white) 100%);
          color: var(--ks-ink);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .konan-success-page *,
        .konan-success-page *::before,
        .konan-success-page *::after {
          box-sizing: border-box;
        }

        .konan-success-orb {
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
          animation: konan-orb-float 9s ease-in-out infinite alternate;
        }

        .konan-success-orb-one {
          width: 430px;
          height: 430px;
          top: -220px;
          right: -130px;
          background: radial-gradient(circle, color-mix(in srgb, var(--season-primary, #2563eb) 12%, transparent), color-mix(in srgb, var(--season-primary, #2563eb) 0%, transparent) 70%);
        }

        .konan-success-orb-two {
          width: 480px;
          height: 480px;
          bottom: -270px;
          left: -190px;
          background: radial-gradient(circle, rgba(34,197,94,.09), rgba(34,197,94,0) 70%);
          animation-delay: -4s;
        }

        .konan-success-card {
          position: relative;
          width: 100%;
          max-width: 700px;
          overflow: hidden;
          border: 1px solid rgba(226,232,240,.88);
          border-radius: 32px;
          background: rgba(255,255,255,.97);
          box-shadow: 0 28px 90px rgba(30,64,175,.12), 0 5px 18px rgba(15,23,42,.035);
          text-align: center;
          animation: konan-card-enter 1.15s cubic-bezier(.16,1,.3,1) both;
        }

        .konan-success-top-glow {
          position: absolute;
          top: -175px;
          right: -105px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,.12), transparent 68%);
          pointer-events: none;
        }

        .konan-success-content {
          position: relative;
          padding: 48px 54px 30px;
        }

        /* Animation de confirmation : entrée, halo, anneaux et étincelles */
        .konan-success-icon-stage {
          position: relative;
          display: grid;
          place-items: center;
          width: 154px;
          height: 154px;
          margin: 0 auto 23px;
          animation: konan-icon-stage-enter 1.35s cubic-bezier(.16,1,.3,1) .12s both;
        }

        .konan-success-icon {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          width: 112px;
          height: 112px;
          border: 8px solid rgba(255,255,255,.95);
          border-radius: 50%;
          background: linear-gradient(145deg, #34d399 0%, #16a34a 100%);
          color: #fff;
          font-size: 48px;
          box-shadow: 0 15px 38px rgba(22,163,74,.28), inset 0 2px 4px rgba(255,255,255,.28);
          animation: konan-icon-pop 1.25s cubic-bezier(.17,.89,.32,1.35) .35s both,
                     konan-icon-breathe 3.4s ease-in-out 1.8s infinite;
        }

        .konan-success-icon i {
          opacity: 0;
          transform: scale(.35) rotate(-25deg);
          animation: konan-check-draw .65s cubic-bezier(.16,1,.3,1) .85s forwards;
        }

        .konan-success-ring {
          position: absolute;
          inset: 9px;
          border: 1px solid rgba(34,197,94,.28);
          border-radius: 50%;
          opacity: 0;
          animation: konan-ring-expand 1.8s ease-out .55s both;
        }

        .konan-success-ring-two {
          inset: 0;
          border-color: color-mix(in srgb, var(--season-primary, #2563eb) 18%, transparent);
          animation-delay: .85s;
        }

        .konan-success-spark {
          position: absolute;
          z-index: 3;
          width: 8px;
          height: 8px;
          border-radius: 3px;
          background: var(--season-secondary, #3b82f6);
          opacity: 0;
          animation: konan-sparkle 1.5s ease-out .8s both;
        }

        .konan-success-spark-one {
          top: 21px;
          right: 20px;
          background: #fbbf24;
          transform: rotate(25deg);
        }

        .konan-success-spark-two {
          bottom: 24px;
          left: 17px;
          width: 6px;
          height: 6px;
          background: #34d399;
          animation-delay: 1s;
        }

        .konan-success-spark-three {
          top: 42px;
          left: 9px;
          width: 5px;
          height: 5px;
          background: var(--season-secondary, #3b82f6);
          animation-delay: 1.15s;
        }

        .konan-success-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 11px;
          color: #16a34a;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .13em;
          text-transform: uppercase;
          opacity: 0;
          animation: konan-content-enter .8s ease-out 1s forwards;
        }

        .konan-success-eyebrow-dot,
        .konan-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,.12);
        }

        .konan-success-title {
          margin: 0;
          color: #111827;
          font-size: clamp(29px, 5vw, 43px);
          line-height: 1.12;
          letter-spacing: -1.5px;
          font-weight: 900;
          opacity: 0;
          animation: konan-content-enter .85s cubic-bezier(.16,1,.3,1) 1.12s forwards;
        }

        .konan-success-description {
          max-width: 510px;
          margin: 17px auto 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.8;
          opacity: 0;
          animation: konan-content-enter .85s cubic-bezier(.16,1,.3,1) 1.28s forwards;
        }

        .konan-success-description strong {
          color: var(--season-primary, #2563eb);
          font-weight: 850;
        }

        .konan-success-features {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-top: 29px;
          padding: 13px;
          border: 1px solid #edf1f7;
          border-radius: 21px;
          background: #fbfcfe;
          text-align: left;
          opacity: 0;
          animation: konan-content-enter .9s cubic-bezier(.16,1,.3,1) 1.42s forwards;
        }

        .konan-success-feature {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          padding: 12px 10px;
          border-radius: 14px;
          transition: background .25s ease, transform .25s ease;
        }

        .konan-success-feature:hover {
          transform: translateX(3px);
          background: #fff;
        }

        .konan-success-feature-icon {
          display: grid;
          place-items: center;
          flex: 0 0 47px;
          width: 47px;
          height: 47px;
          border-radius: 14px;
          font-size: 19px;
        }

        .feature-purple {
          color: var(--season-secondary, #3b82f6);
          background: color-mix(in srgb, var(--season-secondary, #3b82f6) 10%, transparent);
        }

        .feature-green {
          color: #16a34a;
          background: rgba(34,197,94,.11);
        }

        .feature-blue {
          color: var(--season-primary, #2563eb);
          background: color-mix(in srgb, var(--season-primary, #2563eb) 11%, transparent);
        }

        .konan-success-feature-copy {
          flex: 1;
          min-width: 0;
        }

        .konan-success-feature-copy h3 {
          margin: 0;
          color: #1e293b;
          font-size: 14px;
          line-height: 1.4;
          font-weight: 800;
        }

        .konan-success-feature-copy p {
          margin: 4px 0 0;
          color: #718096;
          font-size: 12px;
          line-height: 1.5;
        }

        .konan-success-feature-check {
          flex: 0 0 auto;
          margin: 0 5px;
          color: #22c55e;
          font-size: 13px;
        }

        .konan-success-status {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          align-items: center;
          gap: 18px;
          margin-top: 20px;
          padding: 20px 23px;
          border: 1px solid color-mix(in srgb, var(--season-primary, #2563eb) 12%, white);
          border-radius: 19px;
          background: linear-gradient(120deg, color-mix(in srgb, var(--season-primary, #2563eb) 5%, white), color-mix(in srgb, var(--season-secondary, #3b82f6) 4%, white));
          text-align: left;
          opacity: 0;
          animation: konan-content-enter .9s cubic-bezier(.16,1,.3,1) 1.58s forwards;
        }

        .konan-success-status-item p {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          color: #8492a6;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .konan-success-status-item p i {
          color: #64748b;
          font-size: 12px;
        }

        .konan-success-status-item h3 {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 9px 0 0;
          color: #15803d;
          font-size: 17px;
          font-weight: 850;
        }

        .konan-success-status-item h3 .konan-status-dot {
          width: 8px;
          height: 8px;
        }

        .konan-success-status-item h3.konan-delivery-status {
          color: var(--season-primary, #2563eb);
        }

        .konan-success-status-divider {
          width: 1px;
          height: 42px;
          background: #dce6f7;
        }

        .konan-success-actions {
          display: flex;
          gap: 12px;
          margin-top: 26px;
          opacity: 0;
          animation: konan-content-enter .9s cubic-bezier(.16,1,.3,1) 1.74s forwards;
        }

        .konan-success-link {
          flex: 1;
          min-width: 0;
          text-decoration: none;
        }

        .konan-success-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          min-height: 54px;
          padding: 13px 16px;
          border: 1px solid transparent;
          border-radius: 14px;
          color: #fff;
          font: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .konan-success-button.primary {
          background: linear-gradient(135deg, var(--season-primary, #2563eb), var(--season-secondary, #3b82f6));
          box-shadow: 0 9px 20px color-mix(in srgb, var(--season-primary, #2563eb) 20%, transparent);
        }

        .konan-success-button.secondary {
          background: linear-gradient(135deg, #64748b, #475569);
          box-shadow: 0 9px 20px rgba(71,85,105,.16);
        }

        .konan-success-button:hover {
          transform: translateY(-3px);
        }

        .konan-success-button.primary:hover {
          box-shadow: 0 13px 25px color-mix(in srgb, var(--season-primary, #2563eb) 28%, transparent);
        }

        .konan-success-button.secondary:hover {
          box-shadow: 0 13px 25px rgba(71,85,105,.23);
        }

        .konan-success-button:active {
          transform: translateY(-1px) scale(.99);
        }

        .konan-success-button:focus-visible {
          outline: 3px solid color-mix(in srgb, var(--season-primary, #2563eb) 32%, transparent);
          outline-offset: 3px;
        }

        .konan-button-arrow {
          margin-left: auto;
          opacity: .75;
          font-size: 11px;
          transition: transform .25s ease;
        }

        .konan-success-button:hover .konan-button-arrow {
          transform: translateX(3px);
        }

        .konan-success-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 24px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .025em;
          opacity: 0;
          animation: konan-content-enter .8s ease-out 1.9s forwards;
        }

        .konan-success-trust i {
          color: var(--season-secondary, #3b82f6);
        }

        @keyframes konan-card-enter {
          from { opacity: 0; transform: translateY(32px) scale(.975); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes konan-icon-stage-enter {
          from { opacity: 0; transform: translateY(18px) scale(.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes konan-icon-pop {
          0% { opacity: 0; transform: scale(.35) rotate(-18deg); }
          65% { opacity: 1; transform: scale(1.12) rotate(5deg); }
          82% { transform: scale(.96) rotate(-2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }

        @keyframes konan-check-draw {
          to { opacity: 1; transform: scale(1) rotate(0); }
        }

        @keyframes konan-icon-breathe {
          0%, 100% { box-shadow: 0 15px 38px rgba(22,163,74,.28), inset 0 2px 4px rgba(255,255,255,.28); }
          50% { box-shadow: 0 18px 48px rgba(22,163,74,.38), 0 0 0 9px rgba(34,197,94,.055), inset 0 2px 4px rgba(255,255,255,.28); }
        }

        @keyframes konan-ring-expand {
          0% { opacity: 0; transform: scale(.72); }
          25% { opacity: .8; }
          100% { opacity: 0; transform: scale(1.2); }
        }

        @keyframes konan-sparkle {
          0% { opacity: 0; transform: scale(.2) rotate(0); }
          35% { opacity: 1; transform: scale(1.25) rotate(90deg); }
          100% { opacity: 0; transform: scale(.4) rotate(180deg) translateY(-9px); }
        }

        @keyframes konan-content-enter {
          from { opacity: 0; transform: translateY(17px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes konan-orb-float {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(12px, -18px, 0); }
        }

        @media (max-width: 768px) {
          .konan-success-page {
            align-items: stretch;
            padding: max(16px, env(safe-area-inset-top)) 12px max(18px, env(safe-area-inset-bottom));
          }

          .konan-success-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: 560px;
            min-height: calc(100dvh - max(34px, env(safe-area-inset-top)) - max(34px, env(safe-area-inset-bottom)));
            margin: auto;
            border-radius: 25px;
          }

          .konan-success-content {
            padding: 31px 22px 23px;
          }

          .konan-success-icon-stage {
            width: 132px;
            height: 132px;
            margin-bottom: 17px;
          }

          .konan-success-icon {
            width: 96px;
            height: 96px;
            border-width: 7px;
            font-size: 41px;
          }

          .konan-success-description {
            margin-top: 13px;
            font-size: 13px;
            line-height: 1.7;
          }

          .konan-success-features {
            gap: 5px;
            margin-top: 21px;
            padding: 8px;
            border-radius: 17px;
          }

          .konan-success-feature {
            gap: 11px;
            padding: 10px 7px;
          }

          .konan-success-feature-icon {
            flex-basis: 42px;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            font-size: 17px;
          }

          .konan-success-feature-copy h3 {
            font-size: 12px;
          }

          .konan-success-feature-copy p {
            font-size: 10.5px;
          }

          .konan-success-status {
            gap: 12px;
            margin-top: 15px;
            padding: 16px 14px;
            border-radius: 16px;
          }

          .konan-success-status-item h3 {
            font-size: 14px;
          }

          .konan-success-actions {
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
          }

          .konan-success-button {
            min-height: 51px;
            font-size: 13px;
          }

          .konan-success-trust {
            margin-top: 18px;
          }
        }

        @media (max-width: 380px) {
          .konan-success-content {
            padding-right: 16px;
            padding-left: 16px;
          }

          .konan-success-title {
            font-size: 27px;
            letter-spacing: -.8px;
          }

          .konan-success-feature-check {
            display: none;
          }

          .konan-success-status {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .konan-success-status-divider {
            width: 100%;
            height: 1px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .konan-success-page *,
          .konan-success-page *::before,
          .konan-success-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }

          .konan-success-icon i,
          .konan-success-eyebrow,
          .konan-success-title,
          .konan-success-description,
          .konan-success-features,
          .konan-success-status,
          .konan-success-actions,
          .konan-success-trust {
            opacity: 1 !important;
            transform: none !important;
          }
        }

        /* Ajustements complémentaires iOS / Safari et écrans adaptatifs */
        .konan-success-page {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          padding-top: max(20px, env(safe-area-inset-top));
          padding-right: max(14px, env(safe-area-inset-right));
          padding-bottom: max(20px, env(safe-area-inset-bottom));
          padding-left: max(14px, env(safe-area-inset-left));
          /* La page ne crée aucune zone de défilement interne. */
          overflow: visible;
          overscroll-behavior: auto;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }

        .konan-success-card {
          width: min(100%, 700px);
          min-width: 0;
          flex: 0 0 auto;
        }

        .konan-success-content,
        .konan-success-feature,
        .konan-success-feature-copy,
        .konan-success-status-item,
        .konan-success-link {
          min-width: 0;
        }

        .konan-success-title,
        .konan-success-description,
        .konan-success-feature-copy h3,
        .konan-success-feature-copy p {
          overflow-wrap: anywhere;
        }

        .konan-success-button {
          touch-action: manipulation;
          max-width: 100%;
          min-width: 0;
        }

        .konan-success-page a {
          -webkit-tap-highlight-color: transparent;
        }

        @supports (min-height: 100dvh) {
          .konan-success-page {
            min-height: 100dvh;
          }
        }

        @media (max-width: 768px) {
          .konan-success-page {
            align-items: flex-start;
            padding-top: max(12px, env(safe-area-inset-top));
            padding-bottom: max(12px, env(safe-area-inset-bottom));
          }

          .konan-success-card {
            min-height: 0;
            margin-top: auto;
            margin-bottom: auto;
          }

          .konan-success-content {
            width: 100%;
            padding-left: clamp(15px, 5vw, 24px);
            padding-right: clamp(15px, 5vw, 24px);
          }

          .konan-success-actions {
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .konan-success-page {
            padding-right: max(10px, env(safe-area-inset-right));
            padding-left: max(10px, env(safe-area-inset-left));
          }

          .konan-success-content {
            padding-left: 14px;
            padding-right: 14px;
          }

          .konan-success-feature {
            gap: 8px;
          }

          .konan-success-feature-copy h3 {
            font-size: 11.5px;
          }
        }

        @media (max-height: 700px) and (max-width: 768px) {
          .konan-success-page {
            align-items: flex-start;
          }

          .konan-success-content {
            padding-top: 22px;
            padding-bottom: 20px;
          }

          .konan-success-icon-stage {
            width: 104px;
            height: 104px;
            margin-bottom: 12px;
          }

          .konan-success-icon {
            width: 78px;
            height: 78px;
            font-size: 33px;
          }

          .konan-success-features {
            margin-top: 15px;
          }

          .konan-success-actions {
            margin-top: 15px;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .konan-success-feature:hover,
          .konan-success-button:hover {
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}

export default Success;
