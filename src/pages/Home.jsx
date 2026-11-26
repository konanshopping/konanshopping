import { Helmet } from "react-helmet-async";

function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KONAN SHOPPING",
    url: "https://konanshopping.com",
    logo: "https://konanshopping.com/logo.jpg",
    telephone: "+237694641329",
    email: "konanshoppingcameroun@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CM",
      addressLocality: "Yaoundé",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61556244694432",
      "https://www.instagram.com/konan_shopping_cameroun?igsh=MW9nYnRydGl1a3hoeg==",
      "https://www.tiktok.com/@konanshoppingcameroun?_r=1&_t=ZS-98PmJE3LEUG",
    ],
  };

  return (
    <>
      <Helmet>
        <title>KONAN SHOPPING Cameroun | Boutique en ligne</title>

        <meta
          name="description"
          content="KONAN SHOPPING est une boutique en ligne au Cameroun proposant une livraison rapide et un paiement à la livraison."
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large"
        />

        <link rel="canonical" href="https://konanshopping.com/" />

        <meta
          property="og:title"
          content="KONAN SHOPPING Cameroun | Boutique en ligne"
        />

        <meta
          property="og:description"
          content="KONAN SHOPPING est une boutique en ligne au Cameroun proposant une livraison rapide et un paiement à la livraison."
        />

        <meta property="og:url" content="https://konanshopping.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://konanshopping.com/logo.jpg"
        />
        <meta property="og:site_name" content="KONAN SHOPPING" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="KONAN SHOPPING Cameroun | Boutique en ligne"
        />
        <meta
          name="twitter:description"
          content="KONAN SHOPPING est une boutique en ligne au Cameroun proposant une livraison rapide et un paiement à la livraison."
        />
        <meta
          name="twitter:image"
          content="https://konanshopping.com/logo.jpg"
        />

        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <main className="konan-home">
        <section className="konan-home__content" aria-labelledby="konan-home-title">
          <div className="konan-home__brand-mark" aria-hidden="true">
            <span>KS</span>
          </div>
          <p className="konan-home__eyebrow">KONAN SHOPPING CAMEROUN</p>
          <h1 id="konan-home-title">Accueil KONAN SHOPPING 🇨🇲</h1>
          <span className="konan-home__accent" aria-hidden="true" />
        </section>
      </main>

      <style>{`
        .konan-home {
          --konan-blue: #2563eb;
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          padding: max(24px, env(safe-area-inset-top))
            max(20px, env(safe-area-inset-right))
            max(24px, env(safe-area-inset-bottom))
            max(20px, env(safe-area-inset-left));
          box-sizing: border-box;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 12%, rgba(96, 165, 250, 0.16), transparent 32%),
            radial-gradient(circle at 88% 85%, rgba(37, 99, 235, 0.10), transparent 30%),
            linear-gradient(145deg, #f8fbff 0%, #ffffff 52%, #eef4ff 100%);
          color: #0f172a;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }

        .konan-home *,
        .konan-home *::before,
        .konan-home *::after {
          box-sizing: border-box;
        }

        .konan-home__content {
          width: min(100%, 760px);
          padding: clamp(28px, 6vw, 64px) clamp(20px, 5vw, 56px);
          border: 1px solid rgba(37, 99, 235, 0.10);
          border-radius: clamp(22px, 4vw, 34px);
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
          text-align: center;
          overflow-wrap: anywhere;
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
        }

        .konan-home__brand-mark {
          display: grid;
          place-items: center;
          width: clamp(68px, 15vw, 96px);
          height: clamp(68px, 15vw, 96px);
          margin: 0 auto 22px;
          border: 2px solid rgba(37, 99, 235, 0.18);
          border-radius: 50%;
          background: linear-gradient(145deg, #ffffff, #eff6ff);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);
          color: var(--konan-blue);
          font-size: clamp(22px, 5vw, 32px);
          font-weight: 900;
          letter-spacing: -1.5px;
        }

        .konan-home__eyebrow {
          margin: 0 0 12px;
          color: var(--konan-blue);
          font-size: clamp(10px, 2vw, 12px);
          font-weight: 800;
          letter-spacing: 0.18em;
          line-height: 1.5;
        }

        .konan-home h1 {
          max-width: 100%;
          margin: 0;
          color: #0f172a;
          font-size: clamp(25px, 5.2vw, 44px);
          font-weight: 850;
          line-height: 1.16;
          letter-spacing: -0.04em;
          overflow-wrap: break-word;
        }

        .konan-home__accent {
          display: block;
          width: clamp(54px, 10vw, 78px);
          height: 4px;
          margin: 22px auto 0;
          border-radius: 999px;
          background: linear-gradient(90deg, #2563eb, #60a5fa);
        }

        @media (max-width: 480px) {
          .konan-home__content {
            padding: 30px 20px;
            border-radius: 24px;
          }
          .konan-home__brand-mark {
            margin-bottom: 18px;
          }
        }

        @media (max-width: 360px) {
          .konan-home {
            padding-left: max(14px, env(safe-area-inset-left));
            padding-right: max(14px, env(safe-area-inset-right));
          }
          .konan-home__content {
            padding: 26px 15px;
          }
          .konan-home h1 {
            font-size: clamp(23px, 7vw, 27px);
          }
        }

        @media (max-height: 520px) and (orientation: landscape) {
          .konan-home {
            align-items: flex-start;
          }
          .konan-home__content {
            margin-block: 8px;
            padding-block: 22px;
          }
          .konan-home__brand-mark {
            width: 54px;
            height: 54px;
            margin-bottom: 12px;
          }
          .konan-home__accent {
            margin-top: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .konan-home *,
          .konan-home *::before,
          .konan-home *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}

export default Home;
