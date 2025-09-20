import { productService } from "../../../../../services/product/productService";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bouje.com';
  const { slug, locale } = await params;

  const categories = await productService.getAllCategories();
  const category = categories.find(cat => cat.slug === slug);
  const products = await productService.getProductsByCategory(slug, 0, 10);

  return {
    title: category ? `${category.name} | فروشگاه BOUJE` : 'دسته‌بندی محصولات',
    description: category?.description || 'محصولات متنوع در دسته‌بندی‌های مختلف را کاوش کنید.',
    openGraph: {
      title: category ? `${category.name}` : 'دسته‌بندی محصولات',
      description: category?.description || 'محصولات متنوع در دسته‌بندی‌های مختلف را کاوش کنید.',
      images: [category?.image || `${baseUrl}/images/fallback.jpg`],
    },
    twitter: { card: 'summary_large_image' },
    alternates: {
      canonical: `${baseUrl}/${locale}/products/category/${slug}`,
      languages: {
        'fa': `${baseUrl}/fa/products/category/${slug}`,
        'en': `${baseUrl}/en/products/category/${slug}`,
      },
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: products.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${baseUrl}/${locale}/products/${p.id}`,
        name: p.name,
        image: p.image,
      })),
    },
  };
}

export default async function CategoryPage({ searchParams, params }) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const slug = awaitedParams.slug;
  const locale = awaitedParams.locale;

  // ساخت Query-String برای فیلترها
  const { q, category: categoryFilter, color, min_price, max_price, size, stock } = awaitedSearchParams;
  const filtersObj = {
    ...(categoryFilter && { category: categoryFilter }),
    ...(color && { color }),
    ...(min_price && { min_price }),
    ...(max_price && { max_price }),
    ...(size && { size }),
    ...(stock && { stock }),
  };
  const queryString = new URLSearchParams(filtersObj).toString();

  // دریافت محصولات اولیه و داده‌های لازم
  let allProducts = [];
  let initialProducts = [];
  let categoryInfo = null;

  try {
    const [allProductList, allCategories] = await Promise.all([
      productService.getProductsByCategory(slug, 0, 1000), // برای فیلترها
      productService.getAllCategories(),
    ]);

    categoryInfo = allCategories.find(cat => cat.slug === slug) || null;

    if (q) {
      let searchResults = await productService.searchProductsWithRange(q, 0, 10);
      initialProducts = searchResults.filter(product =>
        product.categories.some(cat => cat.slug === slug)
      );

      if (queryString) {
        initialProducts = initialProducts.filter(product => {
          if (categoryFilter && !product.categories.some(cat => cat.name === categoryFilter)) return false;
          if (color && !product.variants.some(variant => variant.color.name === color)) return false;
          const price = parseFloat(product.price);
          if (min_price && price < parseFloat(min_price)) return false;
          if (max_price && price > parseFloat(max_price)) return false;
          if (size && !product.variants.some(variant => variant.size === size)) return false;
          return true;
        });
      }
    } else if (queryString) {
      initialProducts = await productService.listProductsWithFilters(`category=${slug}&${queryString}&min=0&max=10`);
    } else {
      initialProducts = await productService.getProductsByCategory(slug, 0, 10);
    }

    allProducts = allProductList;
  } catch (err) {
    console.error("خطا در دریافت اطلاعات دسته‌بندی:", err);
  }

  // استخراج گزینه‌های فیلتر
  const getUnique = (arr, keyFn) =>
    Array.from(new Map(arr.map((item) => [keyFn(item), item])).values());

  const colors = getUnique(
    allProducts.flatMap((p) => p.variants?.map((v) => v.color) || []),
    (c) => c?.name
  ).filter(Boolean);

  const categories = getUnique(
    allProducts.flatMap((p) => p.categories || []),
    (c) => c?.slug
  ).filter(Boolean);

  const sizes = getUnique(
    allProducts.flatMap((p) => p.variants?.map((v) => v.size) || []),
    (s) => s
  ).filter(Boolean);

  return (
    <CategoryClient
      initialProducts={initialProducts}
      allProducts={allProducts}
      categoryInfo={categoryInfo}
      locale={locale}
      queryString={queryString}
      q={q}
      colors={colors}
      categories={categories}
      sizes={sizes}
      slug={slug}
      searchParams={awaitedSearchParams}
    />
  );
}