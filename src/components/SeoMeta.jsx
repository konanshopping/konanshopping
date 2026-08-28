import { Helmet } from "react-helmet-async";

const SITE_URL = "https://konanshopping.com";
const SITE_NAME = "KONAN SHOPPING";
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;

export default function SeoMeta({
  title,
  description,
  image,
  url,
  keywords = "",
  type = "website",
  noIndex = false,
}) {
  // =========================================================
  // NORMALISATION
  // =========================================================

  const finalTitle =
    typeof title === "string" && title.trim()
      ? title.trim()
      : `${SITE_NAME} | Boutique en ligne au Cameroun`;

  const finalDescription =
    typeof description === "string" && description.trim()
      ? description.trim()
      : "KONAN SHOPPING est une boutique en ligne au Cameroun proposant une large sélection de produits, avec livraison rapide et paiement à la livraison.";

  const finalImage =
    typeof image === "string" && image.trim()
      ? image.trim()
      : DEFAULT_IMAGE;

  let finalUrl =
    typeof url === "string" && url.trim()
      ? url.trim()
      : SITE_URL;

  // =========================================================
  // URL ABSOLUE
  // =========================================================

  if (finalUrl.startsWith("/")) {
    finalUrl = `${SITE_URL}${finalUrl}`;
  }

  // =========================================================
  // IMAGE ABSOLUE
  // =========================================================

  let finalImageUrl = finalImage;

  if (finalImageUrl.startsWith("/")) {
    finalImageUrl = `${SITE_URL}${finalImageUrl}`;
  }

  // =========================================================
  // ROBOTS
  // =========================================================

  const robotsContent = noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  // =========================================================
  // TYPE OPEN GRAPH
  // =========================================================

  const ogType =
    type === "product" ? "product" : "website";

  // =========================================================
  // RENDU SEO
  // =========================================================

  return (
    <Helmet>

      {/* =====================================================
          HTML / LANGUE
      ====================================================== */}

      <html lang="fr" />

      {/* =====================================================
          TITLE
      ====================================================== */}

      <title>{finalTitle}</title>

      {/* =====================================================
          META DESCRIPTION
      ====================================================== */}

      <meta
        name="description"
        content={finalDescription}
      />

      {/* =====================================================
          ROBOTS
      ====================================================== */}

      <meta
        name="robots"
        content={robotsContent}
      />

      <meta
        name="googlebot"
        content={robotsContent}
      />

      {/* =====================================================
          KEYWORDS
          Conservé pour compatibilité avec ton système.
      ====================================================== */}

      {keywords.trim() && (
        <meta
          name="keywords"
          content={keywords.trim()}
        />
      )}

      {/* =====================================================
          CANONICAL
      ====================================================== */}

      <link
        rel="canonical"
        href={finalUrl}
      />

      {/* =====================================================
          OPEN GRAPH
      ====================================================== */}

      <meta
        property="og:locale"
        content="fr_CM"
      />

      <meta
        property="og:type"
        content={ogType}
      />

      <meta
        property="og:site_name"
        content={SITE_NAME}
      />

      <meta
        property="og:title"
        content={finalTitle}
      />

      <meta
        property="og:description"
        content={finalDescription}
      />

      <meta
        property="og:url"
        content={finalUrl}
      />

      <meta
        property="og:image"
        content={finalImageUrl}
      />

      <meta
        property="og:image:alt"
        content={finalTitle}
      />

      {/* =====================================================
          TWITTER / X
      ====================================================== */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={finalTitle}
      />

      <meta
        name="twitter:description"
        content={finalDescription}
      />

      <meta
        name="twitter:image"
        content={finalImageUrl}
      />

      <meta
        name="twitter:image:alt"
        content={finalTitle}
      />

      {/* =====================================================
          MOBILE / BRANDING
      ====================================================== */}

      <meta
        name="theme-color"
        content="#2563EB"
      />

      {/* =====================================================
          REFERRER
      ====================================================== */}

      <meta
        name="referrer"
        content="strict-origin-when-cross-origin"
      />

    </Helmet>
  );
}