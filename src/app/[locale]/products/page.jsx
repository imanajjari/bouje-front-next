import ProductCard from "../../../components/cart/ProductCard";
import Header from "../../../components/common/Header";
import HeroBanner from "../../../components/common/HeroBanner";
import Footer from "../../../components/common/Footer";
import ProductFilter from "../../../components/product/ProductFilter";
import { productService } from "../../../services/product/productService";
import CategoryList from "../../../components/product/ProductCategory";
import { API_BASE_URL } from "../api/config";


export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bouje.com';
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
  // Await the params and searchParams for Next.js 15
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  
  const locale = awaitedParams.locale;


  let topBanner = null;
try {
  topBanner = await productService.getTopBanner();
} catch (err) {
  console.warn("🟠 استفاده از بنر پیش‌فرض");
}

  /* ------------------ ۱) ساخت Query-String فیلتر ------------------ */
  const { q, category, color, min_price, max_price, size, stock } = awaitedSearchParams;

  const filtersObj = {
    // Don't include 'q' as we handle search separately
    ...(category && { category }),
    ...(color && { color }),
    ...(min_price && { min_price }),
    ...(max_price && { max_price }),
    ...(size && { size }),
    ...(stock && { stock }),
  };

  const queryString = new URLSearchParams(filtersObj).toString();
  
  /* ------------------ ۲) واکشی داده‌ها (متا + فیلترشده) ------------------ */
  let allProducts = [];
  let products = [];

  try {
    // Always fetch all products for filter options
    allProducts = await productService.listProducts();
    
    // Handle search vs filters differently
    if (q) {
      // Use search API for text search
      products = await productService.searchProducts(q);
      
      // Apply other filters client-side if they exist
      if (category || color || min_price || max_price || size || stock) {
        products = products.filter(product => {
          // Category filter
          if (category && !product.categories.some(cat => cat.name === category)) return false;
          
          // Color filter
          if (color && !product.variants.some(variant => variant.color.name === color)) return false;
          
          // Price filter
          const price = parseFloat(product.price);
          if (min_price && price < parseFloat(min_price)) return false;
          if (max_price && price > parseFloat(max_price)) return false;
          
          // Size filter
          if (size && !product.variants.some(variant => variant.size === size)) return false;
          
          return true;
        });
      }
    } else if (queryString) {
      // Use filter API for other filters
      products = await productService.listProductsWithFilters(queryString);
    } else {
      // No filters, show all products
      products = allProducts;
    }
    
  } catch (err) {
    console.error("Error fetching products");
  }

  /* ------------------ ۳) استخراج گزینه‌های دینامیک فیلتر ------------------ */
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

  /* رنگ‌های یکتا برای هر کارت محصول */
  const getUniqueColors = (variants) => {
    const map = new Map();
    variants.forEach((v) => {
      if (!map.has(v.color.name)) map.set(v.color.name, v.color);
    });
    return Array.from(map.values());
  };

  /* ------------------ ۴) رندر صفحه ------------------ */
  return (
    <div className="flex flex-col min-h-screen bg-white" dir="rtl">
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />

      <HeroBanner
  imageSrc={`${API_BASE_URL}${topBanner?.image}` || "/images/HeroRegularStandard_Gucci-LIDO-TIERI-APR25-250314-GUCCI-HIRES-51G-07-04-JIM2-8bit-JIM3_001_Default.avif"}
  fallbackColor="#FF0000FF"
  title={topBanner?.title || "کیف‌های مردانه"}
  description={topBanner?.text || "مجموعه‌ای از کیف‌های مردانه شامل کیف‌های مسافرتی، اداری، دستی، کمری و کوله‌پشتی در رنگ‌ها و متریال‌های مختلف."}
/>

                <CategoryList categories={categories} locale={locale} title="Collections"/>
      <main className="flex flex-col flex-1 px-2 py-4 gap-4">
                {/* پنل فیلتر در بالا */}
        {/* پنل فیلتر در بالا */}
        <ProductFilter
          colors={colors}
          categories={categories}
          sizes={sizes}
          priceLimits={{ min: 0, max: 20_000_000 }}
        />

        {/* لیست محصولات فیلترشده */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              imageSrc={product.image}
              title={product.name}
              price={product.price}
              colors={getUniqueColors(product.variants)}
              productLink={`/${locale}/products/${product.id}`}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}