import { Helmet } from "react-helmet-async";

export default function SeoOrganization() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",

    "@id": "https://konanshopping.com/#organization",

    name: "KONAN SHOPPING",
    alternateName: "KONAN SHOPPING CAMEROUN",

    url: "https://konanshopping.com/",

    logo: {
      "@type": "ImageObject",
      "@id": "https://konanshopping.com/#logo",
      url: "https://konanshopping.com/logo.jpg",
      contentUrl: "https://konanshopping.com/logo.jpg",
      width: 512,
      height: 512,
      caption: "KONAN SHOPPING CAMEROUN",
    },

    image: {
      "@type": "ImageObject",
      url: "https://konanshopping.com/logo.jpg",
      contentUrl: "https://konanshopping.com/logo.jpg",
    },

    description:
      "KONAN SHOPPING est une boutique en ligne au Cameroun proposant une large sélection de produits avec livraison rapide à Yaoundé et dans plusieurs villes du Cameroun, ainsi que le paiement à la livraison.",

    slogan: "Votre boutique en ligne fiable au Cameroun",

    address: {
      "@type": "PostalAddress",
      streetAddress: "Odza Borne 10",
      addressLocality: "Yaoundé",
      addressRegion: "Centre",
      addressCountry: "CM",
    },

    areaServed: [
      {
        "@type": "Country",
        name: "Cameroun",
      },
      {
        "@type": "City",
        name: "Yaoundé",
      },
      {
        "@type": "City",
        name: "Douala",
      },
    ],

    contactPoint: [
      {
        "@type": "ContactPoint",
        "@id": "https://konanshopping.com/#contact-primary",
        telephone: "+237691016720",
        contactType: "customer service",
        areaServed: "CM",
        availableLanguage: ["fr"],
      },
      {
        "@type": "ContactPoint",
        "@id": "https://konanshopping.com/#contact-secondary",
        telephone: "+237694641329",
        contactType: "customer service",
        areaServed: "CM",
        availableLanguage: ["fr"],
      },
    ],

    sameAs: [
      "https://www.tiktok.com/@konanshoppingcameroun",
      "https://www.instagram.com/konan_shopping_cameroun",
      "https://www.facebook.com/profile.php?id=61556244694432",
    ],
  };

  return (
    <Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </Helmet>
  );
}