"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "../../../components/cart/ProductCard";
import Header from "../../../components/common/Header";
import HeroBanner from "../../../components/common/HeroBanner";
import Footer from "../../../components/common/Footer";
import ProductFilter from "../../../components/product/ProductFilter";
import { productService } from "../../../services/product/productService";
import CategoryList from "../../../components/product/ProductCategory";
import { API_BASE_URL } from "../api/config";

export default function ProductsClient({
  initialProducts,
  allProducts,
  topBanner,
  locale,
  queryString,
  q,
  colors,
  categories,
  sizes,
  searchParams,
}) {
  const [products, setProducts] = useState(initialProducts || []);
  const [min, setMin] = useState(10); // از 10 شروع می‌کنیم چون initialProducts تا 10 را دارد
  const [max, setMax] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts?.length === 10);
  const observerRef = useRef(null);

  // ریست محصولات در صورت تغییر فیلترها یا جستجو
  useEffect(() => {
    setProducts(initialProducts || []);
    setMin(10);
    setMax(20);
    setHasMore(initialProducts?.length === 10);
  }, [initialProducts, queryString, q]);

  // تنظیم Intersection Observer برای Infinite Scroll
  useEffect(() => {
    if (!hasMore || isLoading || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect(); // بهتر از unobserve، تمام observers را پاک می‌کند
    };
  }, [hasMore, isLoading]); // dependency اضافه شد: min و max را اضافه نکنید تا re-observe نشود

  // تابع بارگذاری محصولات بیشتر
  const loadMoreProducts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    console.log(`در حال بارگذاری محصولات جدید: min=${min}, max=${max}, q=${q}, queryString=${queryString}`); // دیباگ

    try {
      let newProducts = [];

      if (q) {
        // استفاده از searchProductsWithRange برای جلوگیری از مشکل encode
        newProducts = await productService.searchProductsWithRange(q, min, max);
      } else if (queryString) {
        // برای فیلترها
        newProducts = await productService.listProductsWithFilters(`${queryString}&min=${min}&max=${max}`);
      } else {
        // بدون فیلتر یا جستجو
        newProducts = await productService.listProducts(min, max);
      }

      console.log(`محصولات جدید دریافت‌شده:`, newProducts.length); // دیباگ

      // حذف محصولات تکراری (برای اطمینان)
      const uniqueNewProducts = newProducts.filter(
        (newProduct) => !products.some((existing) => existing.id === newProduct.id)
      );

      console.log(`محصولات منحصربه‌فرد جدید:`, uniqueNewProducts.length); // دیباگ

      if (uniqueNewProducts.length > 0) {
        setProducts((prev) => [...prev, ...uniqueNewProducts]);
        setMin((prevMin) => prevMin + 10);
        setMax((prevMax) => prevMax + 10);
        setHasMore(uniqueNewProducts.length === 10); // فقط اگر دقیق 10 باشد، hasMore true بماند
      } else {
        setHasMore(false); // اگر هیچ محصول جدیدی نبود، تمام شد
      }
    } catch (err) {
      console.error("خطا در بارگذاری محصولات بیشتر:", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // استخراج رنگ‌های یکتا برای هر کارت محصول
  const getUniqueColors = (variants) => {
    const map = new Map();
    variants.forEach((v) => {
      if (!map.has(v.color.name)) map.set(v.color.name, v.color);
    });
    return Array.from(map.values());
  };

  return (
    <div className="flex flex-col min-h-screen bg-white" dir="rtl">
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />

      <HeroBanner
        imageSrc={`${API_BASE_URL}${topBanner?.image}` || "/images/HeroRegularStandard_Gucci-LIDO-TIERI-APR25-250314-GUCCI-HIRES-51G-07-04-JIM2-8bit-JIM3_001_Default.avif"}
        fallbackColor="#FF0000FF"
        title={topBanner?.title || "کیف‌های مردانه"}
        description={topBanner?.text || "مجموعه‌ای از کیف‌های مردانه شامل کیف‌های مسافرتی، اداری، دستی، کمری و کوله‌پشتی در رنگ‌ها و متریال‌های مختلف."}
      />

      <CategoryList categories={categories} locale={locale} title="Collections" />

      <main className="flex flex-col flex-1 px-2 py-4 gap-4">
        <ProductFilter
          colors={colors}
          categories={categories}
          sizes={sizes}
          priceLimits={{ min: 0, max: 20_000_000 }}
        />

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

        {isLoading && <div className="text-center py-4">در حال بارگذاری...</div>}
        {hasMore && <div ref={observerRef} className="h-10 flex justify-center items-center"></div>}
        {!hasMore && products.length > 0 && <div className="text-center py-4 text-gray-500">تمام محصولات نمایش داده شد.</div>}
      </main>

      <Footer />
    </div>
  );
}