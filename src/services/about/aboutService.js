import { API_BASE_URL } from "../../app/[locale]/api/config";

export async function getAboutPageData(locale = "fa") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/about/?lang=${locale}`, {
      next: { revalidate: 1 }, // 24h
    });

    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("خطا در دریافت اطلاعات درباره ما:", error);
    return null;
  }
}
