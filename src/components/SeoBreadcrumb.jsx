import { Helmet } from "react-helmet-async";

export default function SeoBreadcrumb({
  items = [],
}) {
  if (!items.length) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context":
            "https://schema.org",
          "@type":
            "BreadcrumbList",
          itemListElement:
            items.map(
              (item, index) => ({
                "@type":
                  "ListItem",
                position: index + 1,
                name: item.name,
                item: item.url,
              })
            ),
        })}
      </script>
    </Helmet>
  );
}