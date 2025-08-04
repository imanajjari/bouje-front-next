'use client';

import { useState, useEffect } from "react";
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import ProductCard from "../../../../../components/cart/ProductCard";
import ProductFilter from "../../../../../components/product/ProductFilter";
import Header from "../../../../../components/common/Header";
import HeroBanner from "../../../../../components/common/HeroBanner";
import Footer from "../../../../../components/common/Footer";
import { productService } from "../../../../../services/product/productService";
import Head from "next/head";

export default function CategoryPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug;
  const locale = pathname.split('/')[1];

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Get query parameters for filtering
        const { q, category: categoryFilter, color, min_price, max_price, size, stock } = Object.fromEntries(searchParams);

        // Always fetch base category products and all categories first
        const [allProductList, allCategories] = await Promise.all([
          productService.getProductsByCategory(slug),
          productService.getAllCategories(),
        ]);



        // Handle search vs filters differently (similar to main products page)
        if (q) {
          // Use search API for text search

          try {
            let searchResults = await productService.searchProducts(q);
            
            // Filter search results to only include products from this category
            const categoryProducts = searchResults.filter(product => 
              product.categories.some(cat => cat.slug === slug)
            );
            

            
            // Apply other filters client-side if they exist
            if (categoryFilter || color || min_price || max_price || size || stock) {

              const finalProducts = categoryProducts.filter(product => {
                // Category filter (different from current category)
                if (categoryFilter && !product.categories.some(cat => cat.name === categoryFilter)) return false;
                
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
              setProducts(finalProducts);
            } else {
              setProducts(categoryProducts);
            }
          } catch (error) {
            console.error('Error in search:', error);
            setProducts(allProductList);
          }
        } else if (categoryFilter || color || min_price || max_price || size || stock) {
          // Use filter API for other filters
          const filtersObj = {
            // Don't include 'q' as we handle search separately
            ...(categoryFilter && { category: categoryFilter }),
            ...(color && { color }),
            ...(min_price && { min_price }),
            ...(max_price && { max_price }),
            ...(size && { size }),
            ...(stock && { stock }),
          };

          const queryString = new URLSearchParams(filtersObj).toString();

          try {
            const filteredProducts = await productService.listProductsWithFilters(`category=${slug}&${queryString}`);
            setProducts(filteredProducts);
          } catch (error) {
  
            // Fallback to showing all products in category
            setProducts(allProductList);
          }
        } else {
          // No additional filters, show all products in this category

          setProducts(allProductList);
        }

        setAllProducts(allProductList);
        
        // Set category info
        const category = allCategories.find(cat => cat.slug === slug);
        setCategoryInfo(category || null);
      } catch (err) {
        console.error("خطا در گرفتن اطلاعات:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, searchParams]);

  // Extract unique filter options from products
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
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: products.slice(0, 10).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `/${locale}/products/${p.id}`,
                name: p.name,
                image: p.image,
              })),
            }),
          }}
        />
      </Head>

      <Header logoAnimation={false} iconColor="#000000" />

      <HeroBanner
        imageSrc={categoryInfo?.image || "/images/fallback.jpg"}
        fallbackColor="#FF0000FF"
        title={categoryInfo?.name || `دسته ${slug}`}
        description={categoryInfo?.description || "محصولات این دسته را مشاهده می‌کنید"}
      />

      {/* Filter System */}
      <ProductFilter
        colors={colors}
        categories={categories}
        sizes={sizes}
        priceLimits={{ min: 0, max: 20_000_000 }}
      />

      {loading ? (
        <div className="text-center py-8">در حال بارگذاری محصولات...</div>
      ) : (
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
      )}

      <Footer />
    </div>
  );
}
