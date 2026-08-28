import { Helmet } from "react-helmet-async";

const SITE_URL = "https://konanshopping.com";

export default function SeoBreadcrumb({
  items = [],
  pageUrl = null,
}) {
  // =========================================================
  // VALIDATION
  // =========================================================

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  // =========================================================
  // NORMALISATION
  // =========================================================

  const normalizedItems = items
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.name === "string" &&
        item.name.trim().length > 0
    )
    .map((item) => {
      const name = item.name.trim();

      let url = item.url;

      if (typeof url === "string" && url.trim()) {
        url = url.trim();

        // URL relative → URL absolue
        if (url.startsWith("/")) {
          url = `${SITE_URL}${url}`;
        }
      } else {
        url = undefined;
      }

      return {
        name,
        url,
      };
    });

  // =========================================================
  // SUPPRESSION DES DOUBLONS
  // =========================================================

  const uniqueItems = normalizedItems.filter(
    (item, index, array) =>
      index ===
      array.findIndex(
        (current) =>
          current.name === item.name &&
          current.url === item.url
      )
  );

  if (uniqueItems.length === 0) {
    return null;
  }

  // =========================================================
  // URL DE LA PAGE
  // =========================================================

  let canonicalPageUrl = pageUrl;

  if (
    typeof canonicalPageUrl !== "string" ||
    !canonicalPageUrl.trim()
  ) {
    canonicalPageUrl =
      uniqueItems[uniqueItems.length - 1]?.url ||
      SITE_URL;
  }

  if (canonicalPageUrl.startsWith("/")) {
    canonicalPageUrl = `${SITE_URL}${canonicalPageUrl}`;
  }

  canonicalPageUrl = canonicalPageUrl.replace(/\/$/, "");

  // =========================================================
  // IDENTIFIANT UNIQUE DU BREADCRUMB
  // =========================================================

  const breadcrumbId = `${canonicalPageUrl}/#breadcrumb`;

  // =========================================================
  // SCHEMA.ORG
  // =========================================================

  const breadcrumbSchema = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    "@id": breadcrumbId,

    itemListElement: uniqueItems.map(
      (item, index) => ({
        "@type": "ListItem",

        position: index + 1,

        name: item.name,

        ...(item.url
          ? {
              item: item.url,
            }
          : {}),
      })
    ),
  };

  // =========================================================
  // RENDU
  // =========================================================

  return (
    <Helmet>
      <script
        type="application/ld+json"
        key={`konan-shopping-breadcrumb-${canonicalPageUrl}`}
      >
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}