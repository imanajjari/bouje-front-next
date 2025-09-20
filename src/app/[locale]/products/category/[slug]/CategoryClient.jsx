"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "../../../../../components/cart/ProductCard";
import Header from "../../../../../components/common/Header";
import HeroBanner from "../../../../../components/common/HeroBanner";
import Footer from "../../../../../components/common/Footer";
import ProductFilter from "../../../../../components/product/ProductFilter";
import { productService } from "../../../../../services/product/productService";

export default function CategoryClient({
  initialProducts,
  allProducts,
  categoryInfo,
  locale,
  queryString,
  q,
  colors,
  categories,
  sizes,
  slug,
  searchParams,
}) {
  const [products, setProducts] = useState(initialProducts || []);
  const [min, setMin] = useState(10);
  const [max, setMax] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts?.length === 10);
  const observerRef = useRef(null);

  // ریست محصولات در صورت تغییر فیلترها، جستجو یا slug
  useEffect(() => {
    setProducts(initialProducts || []);
    setMin(10);
    setMax(20);
    setHasMore(initialProducts?.length === 10);
  }, [initialProducts, queryString, q, slug]);

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
      observer.disconnect();
    };
  }, [hasMore, isLoading]);

  // تابع بارگذاری محصولات بیشتر
  const loadMoreProducts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    console.log(`بارگذاری محصولات جدید: min=${min}, max=${max}, q=${q}, queryString=${queryString}, slug=${slug}`);

    try {
      let newProducts = [];

      if (q) {
        newProducts = await productService.searchProductsWithRange(q, min, max);
        newProducts = newProducts.filter(product =>
          product.categories.some(cat => cat.slug === slug)
        );
      } else if (queryString) {
        newProducts = await productService.listProductsWithFilters(`category=${slug}&${queryString}&min=${min}&max=${max}`);
      } else {
        newProducts = await productService.getProductsByCategory(slug, min, max);
      }

      console.log(`محصولات جدید دریافت‌شده:`, newProducts.length);

      const uniqueNewProducts = newProducts.filter(
        (newProduct) => !products.some((existing) => existing.id === newProduct.id)
      );

      console.log(`محصولات منحصربه‌فرد جدید:`, uniqueNewProducts.length);

      if (uniqueNewProducts.length > 0) {
        setProducts((prev) => [...prev, ...uniqueNewProducts]);
        setMin((prevMin) => prevMin + 10);
        setMax((prevMax) => prevMax + 10);
        setHasMore(uniqueNewProducts.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("خطا در بارگذاری محصولات بیشتر:", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // استخراج رنگ‌های یکتا
  const getUniqueColors = (variants) => {
    if (!variants) return [];
    const map = new Map();
    variants.forEach((v) => {
      if (v.color && !map.has(v.color.name)) {
        map.set(v.color.name, v.color);
      }
    });
    return Array.from(map.values());
  };

  return (
    <div className="flex flex-col min-h-screen bg-white" dir="rtl">
      <Header logoAnimation={false} iconColor="#000000" />

      <HeroBanner
        imageSrc={categoryInfo?.image || "/images/fallback.jpg"}
        fallbackColor="#FF0000FF"
        title={categoryInfo?.name || `دسته ${slug}`}
        description={categoryInfo?.description || "محصولات این دسته را مشاهده می‌کنید"}
      />

      <ProductFilter
        colors={colors}
        categories={categories}
        sizes={sizes}
        priceLimits={{ min: 0, max: 20_000_000 }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-2 py-4 gap-3">
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
      {!hasMore && products.length > 0 && (
        <div className="text-center py-4 text-gray-500">تمام محصولات نمایش داده شد.</div>
      )}

      <Footer />
    </div>
  );
}