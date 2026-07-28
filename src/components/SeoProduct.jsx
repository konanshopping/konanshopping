import { Helmet } from "react-helmet-async";

export default function SeoProduct({
  product,
  productUrl,
  productImage,
  averageRating,
}) {
  if (!product) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context":
            "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: [productImage],
          description:
            product.description,
          sku: product._id,
          brand: {
            "@type": "Brand",
            name: "KONAN SHOPPING",
          },
          aggregateRating: {
            "@type":
              "AggregateRating",
            ratingValue:
              averageRating,
            reviewCount:
              product.reviews
                ?.length || 0,
          },
          offers: {
            "@type": "Offer",
            url: productUrl,
            price:
              product.price,
            priceCurrency:
              "XAF",
            availability:
              "https://schema.org/InStock",
            itemCondition:
              "https://schema.org/NewCondition",
          },
        })}
      </script>
    </Helmet>
  );
}