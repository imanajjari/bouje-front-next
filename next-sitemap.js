// next-sitemap.js
/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'http://localhost:3000'; // آدرس دامنه‌ت رو دقیق بنویس
// const siteUrl = 'https://bouje.ir'; // آدرس دامنه‌ت رو دقیق بنویس

module.exports = {
  siteUrl,
  generateRobotsTxt: true, // ساخت robots.txt
  sitemapSize: 7000, // برای تقسیم‌بندی اگر صفحات زیاد داشتی
  changefreq: 'weekly', // فرکانس آپدیت محتوا (optional)
  priority: 0.7,
  trailingSlash: false,
  exclude: ['/404', '/500'], // صفحات خاص که نمی‌خوای توی سئو باشن
};
