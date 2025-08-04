import { API_BASE_URL } from "../../app/[locale]/api/config";

export async function fetchPdfCollection(locale = "fa") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pdf/collection/`, {
      headers: {
        "Accept-Language": locale,
      },
      next: { revalidate: 60 }, // اگر نیاز به ISR دارید
    });

    if (!res.ok) {
      throw new Error(`خطا در دریافت فایل‌های PDF: ${res.status}`);
    }

    const data = await res.json();
    return data; // شامل collection_title و items
  } catch (error) {
    console.error("fetchPdfCollection error:", error);
    return null;
  }
}


export async function getPdfById(id, locale = "fa") {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pdf/collection/`);
      if (!res.ok) throw new Error("خطا در دریافت لیست PDF");
  
      const data = await res.json();
      const item = data.items.find((item) => item.id.toString() === id.toString());
      return item;
    } catch (err) {
      console.error("getPdfById error:", err);
      return null;
    }
  }