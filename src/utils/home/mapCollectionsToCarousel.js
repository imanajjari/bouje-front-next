/**
 * کالکشن‌های دریافتی را به آرایه‌ای از آیتم‌های مناسب ProductCarousel تبدیل می‌کند.
 * @param {Array} collections  آرایهٔ کالکشن‌ها با فیلد products[]
 * @param {string} locale      زبان فعلی برای ساخت URL
 * @param {number} limit       حداکثر تعداد آیتم خروجی (اختیاری)
 * @returns {Array<{title,image,price,url}>}
 */
export const mapCollectionsToCarousel = (collections, locale, limit = 12) =>
    (collections ?? [])
      .flatMap((c) => c.products ?? [])
      .slice(0, limit)   // مثلاً فقط ۱۲ محصول اول
      .map((p) => ({
        title: p.name,
        image: p.image || p.banner_image,              // اولویت با تصویر اصلی
        price: Number(p.price).toLocaleString("fa-IR") + " تومان",
        url: `/${locale}/products/${p.id}`             // یا اگر slug داری: p.slug
      }));
  