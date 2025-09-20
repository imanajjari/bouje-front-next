import { productService } from "../../../services/product/productService";
import { API_BASE_URL } from "../api/config";
import ProductsClient from "./ProductsClient"; // کامپوننت کلاینت جدید

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bouje.ir';
  const awaitedParams = await params;
  const locale = awaitedParams.locale ?? 'fa';

  return {
    title: 'خرید کیف‌های مردانه | فروشگاه BOUJE',
    description:
      'مجموعه‌ای از کیف‌های مردانه شامل کیف‌های مسافرتی، اداری، دستی، کمری و کوله‌پشتی در رنگ‌ها و متریال‌های مختلف.',
    openGraph: {
      title: 'خرید کیف‌های مردانه',
      description:
        'مجموعه‌ای از کیف‌های مردانه شامل کیف‌های مسافرتی، اداری، دستی، کمری و کوله‌پشتی در رنگ‌ها و متریال‌های مختلف.',
      images: [
        `${baseUrl}/images/HeroRegularStandard_Gucci-LIDO-TIERI-APR25-250314-GUCCI-HIRES-51G-07-04-JIM2-8bit-JIM3_001_Default.avif`,
      ],
    },
    twitter: { card: 'summary_large_image' },
    alternates: {
      canonical: `${baseUrl}/${locale}/products`,
      languages: {
        'fa': `${baseUrl}/fa/products`,
        'en': `${baseUrl}/en/products`,
      },
    },
  };
}

export default async function ProductPage({ searchParams, params }) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const locale = awaitedParams.locale;

  // دریافت بنر بالا
  let topBanner = null;
  try {
    topBanner = await productService.getTopBanner();
  } catch (err) {
    console.warn("🟠 استفاده از بنر پیش‌فرض");
  }

  // ساخت Query-String برای فیلترها
  const { q, category, color, min_price, max_price, size, stock } = awaitedSearchParams;
  const filtersObj = {
    ...(category && { category }),
    ...(color && { color }),
    ...(min_price && { min_price }),
    ...(max_price && { max_price }),
    ...(size && { size }),
    ...(stock && { stock }),
  };
  const queryString = new URLSearchParams(filtersObj).toString();

  // دریافت محصولات اولیه
  let allProducts = [];
  let initialProducts = [];
  try {
    allProducts = await productService.listProducts(0, 1000); // برای فیلترها
    if (q) {
      initialProducts = await productService.searchProducts(q);
      if (queryString) {
        initialProducts = initialProducts.filter((product) => {
          if (category && !product.categories.some((cat) => cat.name === category)) return false;
          if (color && !product.variants.some((variant) => variant.color.name === color)) return false;
          const price = parseFloat(product.price);
          if (min_price && price < parseFloat(min_price)) return false;
          if (max_price && price > parseFloat(max_price)) return false;
          if (size && !product.variants.some((variant) => variant.size === size)) return false;
          return true;
        });
      }
    } else if (queryString) {
      initialProducts = await productService.listProductsWithFilters(queryString);
    } else {
      initialProducts = await productService.listProducts(0, 10);
    }
  } catch (err) {
    console.error("خطا در دریافت محصولات اولیه:", err);
  }

  // استخراج گزینه‌های فیلتر
  const getUnique = (arr, keyFn) =>
    Array.from(new Map(arr.map((item) => [keyFn(item), item])).values());

  const colors = getUnique(
    allProducts.flatMap((p) => p.variants.map((v) => v.color)),
    (c) => c.name
  );

  const categories = getUnique(
    allProducts.flatMap((p) => p.categories),
    (c) => c.slug
  );

  const sizes = getUnique(
    allProducts.flatMap((p) => p.variants.map((v) => v.size)),
    (s) => s
  );

  return (
    <ProductsClient
      initialProducts={initialProducts}
      allProducts={allProducts}
      topBanner={topBanner}
      locale={locale}
      queryString={queryString}
      q={q}
      colors={colors}
      categories={categories}
      sizes={sizes}
      searchParams={awaitedSearchParams}
    />
  );
}