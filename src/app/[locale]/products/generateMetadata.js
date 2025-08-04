// app/[locale]/products/generateMetadata.ts


import { listProducts } from "../api/product/productList";

export async function generateMetadata(context) {
  const params = await context.params;
  const locale = params.locale;
  const all = await listProducts();          // فراخوانی روی سرور
  const top10 = all.slice(0, 10);

  const title = locale === "fa" ? "کیف‌های مردانه" : "Men’s Bags";
  const desc  = locale === "fa"
    ? "خرید آنلاین انواع کیف مردانه در طرح‌ها و رنگ‌های متنوع."
    : "Shop men’s travel, briefcase and backpack styles in various colours.";

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://luxbrand.ir/${locale}/products`,
    },
    openGraph: {
      title,
      description: desc,
      images: ["https://luxbrand.ir/images/og-products.jpg"],
      locale,
    },
    other: {
      scripts: [
        {
          id: "itemlist-jsonld",
          type: "application/ld+json",
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type":   "ItemList",
            itemListElement: top10.map((p, i) => ({
              "@type":   "ListItem",
              position:  i + 1,
              url:       `https://luxbrand.ir/${locale}/products/${p.id}`,
              name:      p.name,
              image:     p.image,
            })),
          }),
        },
      ],
    },
  };
}
