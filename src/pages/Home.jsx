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

        <meta
          property="og:url"
          content="https://konanshopping.com/"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:image"
          content="https://konanshopping.com/logo.jpg"
        />

        <meta
          property="og:site_name"
          content="KONAN SHOPPING"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

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

      <div>
        <h1>Accueil KONAN SHOPPING 🇨🇲</h1>
      </div>
    </>
  );
}

export default Home;