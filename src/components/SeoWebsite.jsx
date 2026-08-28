import { Helmet } from "react-helmet-async";

export default function SeoWebsite() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",

    "@id": "https://konanshopping.com/#website",

    name: "KONAN SHOPPING",
    alternateName: "KONAN SHOPPING CAMEROUN",

    url: "https://konanshopping.com/",

    description:
      "KONAN SHOPPING est une boutique en ligne au Cameroun proposant une large sélection de produits avec livraison rapide et paiement à la livraison.",

    inLanguage: "fr-CM",

    publisher: {
      "@id": "https://konanshopping.com/#organization",
    },

    copyrightHolder: {
      "@id": "https://konanshopping.com/#organization",
    },

    copyrightYear: new Date().getFullYear(),

    isAccessibleForFree: true,
  };

  return (
    <Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </Helmet>
  );
}