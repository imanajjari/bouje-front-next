import { API_BASE_URL } from "../../app/[locale]/api/config";

export async function getAboutPageData(locale = "fa") {
  try {
    // حالا فقط یک بار /api داریم
    const response = await fetch(`${API_BASE_URL}/api/about/?lang=${locale}`, {
      // اگر در بک‌اند پارامتر زبان ندارید، '?lang=...' را حذف کنید
      method: "GET",
      // پیشنهاد برای سِوِر کامپوننت‌ها؛ در صورت نیاز تغییر بدهید
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Fetch error: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("خطا در دریافت اطلاعات درباره ما:", error);
    return null;
  }
}
