import { Helmet } from "react-helmet-async";

export default function SeoMeta({
  title,
  description,
  image,
  url,
  keywords = "",
  type = "website",
}) {
  return (
    <Helmet>
      {/* Titre */}
      <title>{title}</title>

      {/* SEO */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="KONAN SHOPPING" />
      <meta property="og:locale" content="fr_CM" />

      {/* Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:title"
        content={title}
      />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta
        name="twitter:image"
        content={image}
      />
    </Helmet>
  );
}