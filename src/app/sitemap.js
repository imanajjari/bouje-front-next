// app/sitemap.js
import { productService } from "../services/product/productService";
import {
  fetchBlogPosts,
  fetchBlogCategories,
  fetchPopularBlogData,
} from "../services/magazine/magazineService";

// هر چند وقت یک‌بار سایت‌مپ دوباره ساخته شود (ثانیه)
export const revalidate = 60 * 60; // 1h

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // زبان‌های فعال پروژه‌ات
  const locales = ["fa"]; // اگر چندزبانه‌ای، مثل ["fa","en","ar"]

  // مسیرهای استاتیک (نسبت به /[locale])
  const staticPaths = [
    "",              // صفحه اصلی
    "products",      // لیست محصولات
    "about-us",
    "contact-us",
    "magazine",      // لیست مجله/بلاگ
    "cart",
    "checkout",
    "profile",
  ];

  const urls = [];

  // helper برای افزودن URL چندزبانه
  const addLocalized = (path, {
    lastModified = new Date(),
    changeFrequency = "weekly",
    priority = 0.7,
  } = {}) => {
    for (const locale of locales) {
      const url = path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;
      urls.push({ url, lastModified, changeFrequency, priority });
    }
  };

  // 1) صفحات استاتیک
  for (const p of staticPaths) {
    addLocalized(p, {
      lastModified: new Date(),
      changeFrequency: p === "" ? "daily" : "weekly",
      priority: p === "" ? 1.0 : 0.7,
    });
  }

  // 2) محصولات
  try {
    const productsResp = await productService.listProductsWithFilters("page_size=1000");
    const products = Array.isArray(productsResp)
      ? productsResp
      : Array.isArray(productsResp?.results)
        ? productsResp.results
        : [];

    for (const p of products) {
      const slug = p.slug ?? String(p.id ?? "");
      if (!slug) continue;

      const lastmodRaw = p.updated_at || p.display_date || new Date().toISOString();
      const lastModified = new Date(lastmodRaw);

      addLocalized(`products/${encodeURIComponent(slug)}`, {
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch (e) {
    console.error("Sitemap(products):", e?.message || e);
  }

  // 3) بلاگ/مجله
  try {
    // 3.1) لیست پست‌ها (می‌تونی limit رو بیشتر کنی یا صفحه‌بندی سمت سرور بسازی)
    const posts = await fetchBlogPosts({ limit: 1000 });
    for (const post of posts) {
      const slug = post.slug ?? String(post.id ?? "");
      if (!slug) continue;

      const lastmodRaw = post.updated_at || post.created_at || new Date().toISOString();
      const lastModified = new Date(lastmodRaw);

      addLocalized(`magazine/${encodeURIComponent(slug)}`, {
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // 3.2) دسته‌بندی‌های بلاگ
    const categories = await fetchBlogCategories();
    for (const cat of categories) {
      const cslug = cat.slug ?? String(cat.id ?? "");
      if (!cslug) continue;

      addLocalized(`magazine/category/${encodeURIComponent(cslug)}`, {
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    // 3.3) تگ‌های محبوب (برای مسیر /magazine/tag/[slug])
    const popular = await fetchPopularBlogData(); // { tags: string[], categories: [...] }
    if (Array.isArray(popular?.tags)) {
      for (const tag of popular.tags) {
        if (!tag) continue;
        addLocalized(`magazine/tag/${encodeURIComponent(tag)}`, {
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch (e) {
    console.error("Sitemap(magazine):", e?.message || e);
  }

  return urls;
}
