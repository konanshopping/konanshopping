import { Helmet } from "react-helmet-async";

export default function SeoOrganization() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KONAN SHOPPING",
          url: "https://konanshopping.com",
          logo: "https://konanshopping.com/logo.jpg",
          description:
            "Boutique en ligne au Cameroun avec paiement à la livraison.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Odza Borne 10",
            addressLocality: "Yaoundé",
            addressCountry: "CM",
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: "+237691016720/+237694641329",
            availableLanguage: ["fr"],
          },
        })}
      </script>
    </Helmet>
  );
}