import { Helmet } from "react-helmet-async";

export default function SeoProduct({
  product,
  productUrl,
  productImage,
  averageRating,
}) {
  if (!product) return null;

  // =========================================================
  // DONNÉES DU PRODUIT
  // =========================================================

  const productName =
    product.name?.trim() || "Produit KONAN SHOPPING";

  const productDescription =
    product.description?.trim() ||
    `${productName} disponible sur KONAN SHOPPING, votre boutique en ligne au Cameroun.`;

  const image =
    productImage ||
    product.image ||
    "https://konanshopping.com/logo.jpg";

  const url =
    productUrl ||
    `https://konanshopping.com/product/${product._id}`;

  const price = Number(product.price);

  // =========================================================
  // AVIS
  // =========================================================

  const reviews = Array.isArray(product.reviews)
    ? product.reviews
    : [];

  const calculatedRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total + Number(review.rating || 0),
          0
        ) / reviews.length
      : 0;

  const rating =
    Number(averageRating) > 0
      ? Number(averageRating)
      : calculatedRating;

  // =========================================================
  // STRUCTURED DATA — PRODUCT
  // =========================================================

  const productSchema = {
    "@context": "https://schema.org",

    "@type": "Product",

    "@id": `${url}#product`,

    name: productName,

    url: url,

    description: productDescription,

    image: [image],

    sku: String(product._id),

    ...(product.category
      ? {
          category: product.category,
        }
      : {}),

    ...(product.brand
      ? {
          brand: {
            "@type": "Brand",
            name: product.brand,
          },
        }
      : {
          brand: {
            "@type": "Brand",
            name: "KONAN SHOPPING",
          },
        }),

    // =======================================================
    // OFFRE
    // =======================================================

    ...(Number.isFinite(price) && price >= 0
      ? {
          offers: {
            "@type": "Offer",

            "@id": `${url}#offer`,

            url: url,

            price: price.toString(),

            priceCurrency: "XAF",

            // DISPONIBILITÉ CONSERVÉE POUR TOUS LES PRODUITS
            availability:
              "https://schema.org/InStock",

            itemCondition:
              "https://schema.org/NewCondition",

            seller: {
              "@id":
                "https://konanshopping.com/#organization",
            },
          },
        }
      : {}),

    // =======================================================
    // NOTE ET AVIS
    // =======================================================

    ...(reviews.length > 0 && rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",

            ratingValue:
              Number(rating).toFixed(1),

            bestRating: "5",

            worstRating: "1",

            reviewCount:
              reviews.length,
          },
        }
      : {}),
  };

  return (
    <Helmet>

      {/* =====================================================
          TITLE SEO
      ====================================================== */}

      <title>
        {productName} | KONAN SHOPPING Cameroun
      </title>

      {/* =====================================================
          META DESCRIPTION
      ====================================================== */}

      <meta
        name="description"
        content={productDescription}
      />

      {/* =====================================================
          CANONICAL
      ====================================================== */}

      <link
        rel="canonical"
        href={url}
      />

      {/* =====================================================
          OPEN GRAPH
      ====================================================== */}

      <meta
        property="og:type"
        content="product"
      />

      <meta
        property="og:title"
        content={`${productName} | KONAN SHOPPING`}
      />

      <meta
        property="og:description"
        content={productDescription}
      />

      <meta
        property="og:url"
        content={url}
      />

      <meta
        property="og:image"
        content={image}
      />

      <meta
        property="og:site_name"
        content="KONAN SHOPPING"
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
        content={`${productName} | KONAN SHOPPING`}
      />

      <meta
        name="twitter:description"
        content={productDescription}
      />

      <meta
        name="twitter:image"
        content={image}
      />

      {/* =====================================================
          SCHEMA.ORG PRODUCT
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

    </Helmet>
  );
}