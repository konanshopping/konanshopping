import { Helmet } from "react-helmet-async";

function Home() {
  return (
    <>
      <Helmet>
        <title>
          KONAN SHOPPING Cameroun | Boutique en ligne
        </title>

        <meta
          name="description"
          content="KONAN SHOPPING est une boutique en ligne au Cameroun proposant une livraison rapide et un paiement à la livraison."
        />

        <script type="application/ld+json">
          {JSON.stringify({
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
          })}
        </script>
      </Helmet>

      <div>
        <h1>Accueil KONAN SHOPPING 🇨🇲</h1>
      </div>
    </>
  );
}

export default Home;