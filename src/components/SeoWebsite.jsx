import { Helmet } from "react-helmet-async";

export default function SeoWebsite() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "KONAN SHOPPING",
          url: "https://konanshopping.com",
          inLanguage: "fr-CM",
        })}
      </script>
    </Helmet>
  );
}