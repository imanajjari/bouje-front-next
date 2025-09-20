// services/product/productService.js
import { API_BASE_URL } from '../../app/[locale]/api/config';

export const productService = {
   /** لیست همهٔ محصولات */
   async listProducts(min = 0, max = 10) {
    const url = `${API_BASE_URL}/api/products/products/?min=${min}&max=${max}`;
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error("Failed to fetch product list");
    return res.json();
  },

  // جستجو
  async searchProducts(query) {
    const url = `${API_BASE_URL}/api/products/search/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('خطا در جست‌وجوی محصول');
    return await res.json();
  },

  // اضافه کردن پشتیبانی از min و max برای جستجو
async searchProductsWithRange(query, min = 0, max = 10) {
  const url = `${API_BASE_URL}/api/products/search/?q=${encodeURIComponent(query)}&min=${min}&max=${max}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('خطا در جست‌وجوی محصول');
  return await res.json();
},
  // محصولات یک دسته
  async getProductsByCategory(categorySlug, min = 0, max = 10) {
    const url = `${API_BASE_URL}/api/products/category/${encodeURIComponent(categorySlug)}/?min=${min}&max=${max}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('خطا در دریافت محصولات دسته‌بندی شده');
    return await res.json();
  },

  // فهرست دسته‌ها
  async getAllCategories() {
    const url = `${API_BASE_URL}/api/products/categories/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('خطا در دریافت دسته‌ها');
    return await res.json();
  },


  async listProductsWithFilters(queryString) {
    let fullQuery = queryString;
    if (!queryString.includes('min=') || !queryString.includes('max=')) {
      const params = new URLSearchParams(queryString);
      params.append('min', '0');
      params.append('max', '10');
      fullQuery = params.toString();
    }
    const url = `${API_BASE_URL}/api/products/products/?${fullQuery}`;
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error("خطا در دریافت لیست محصولات با فیلتر");
    return res.json();
  },

  // دریافت محصولات محبوب
async getPopularProducts() {
  const url = `${API_BASE_URL}/api/products/products/popular/`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("خطا در دریافت محصولات محبوب");
  return await res.json();
},
  // محصولات مرتبط
  async getRelatedProducts(productId) {
    const url = `${API_BASE_URL}/api/products/products/${productId}/related/`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("خطا در دریافت محصولات مرتبط");
    return await res.json();
  },

  // بررسی اصالت کالا
  async checkProductAuthenticity(authCode) {
    const url = `${API_BASE_URL}/api/products/by-auth-code/${authCode}/`;
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        const data = await res.json();
        
        return data;
      } else if (res.status === 404) {
        console.warn("❌ محصولی با این کد اصالت پیدا نشد");
        return null;
      } else {
        const errorData = await res.json();
        console.error("🚨 خطا در بررسی اصالت:", errorData.detail);
        throw new Error(errorData.detail || "خطای نامشخص");
      }
    } catch (error) {
      console.error("🚨 خطا در ارتباط با سرور:", error.message);
      throw error;
    }
  },
    // بنر بالای صفحه
    async getTopBanner() {
      const url = `${API_BASE_URL}/api/products/top-banner/`;
      try {
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("خطا در دریافت بنر بالا");
  
        const data = await res.json();
        return data;
      } catch (err) {
        console.error("🚨 خطا در دریافت بنر بالا:", err.message);
        return null; // در صورت خطا مقدار null برمی‌گرداند
      }
    }
  
};


