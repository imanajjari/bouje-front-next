/**
 * محصولات مرتبط را به ساختار مورد نیاز ProductCarousel تبدیل می‌کند.
 * @param {Array} products آرایهٔ محصولات مرتبط
 * @param {string} locale  زبان فعلی
 * @returns {Array<{title,image,price,url}>}
 */
export function mapRelatedProductsToCarousel(products, locale) {
  return (products ?? []).map((p) => ({
    title: p.name,
    image: p.image || p.banner_image,
    price: Number(p.price).toLocaleString("fa-IR") + " تومان",
    url: `/${locale}/products/${p.id}`, // اگر slug داشتی، به جای id استفاده کن
  }));
}
