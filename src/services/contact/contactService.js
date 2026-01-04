import { API_BASE_URL } from "../../app/[locale]/api/config";

/**
 * دریافت اطلاعات صفحه تماس با ما
 * @returns {Promise<Object|null>}
 */
export async function getContactPageData(locale = "fa") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/contact/?lang=${locale}`, {
      next: { revalidate: 86400 }, // 24h
    });

    if (!res.ok) throw new Error(`GET /contact failed with ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error("خطا در دریافت اطلاعات تماس با ما:", error);
    return null;
  }
}

/**
 * ارسال پیام تماس با ما
 * @param {Object} formData - { full_name, email, message }
 * @returns {Promise<Object>} - response یا error
 */
export async function sendContactMessage(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/contact/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "خطا در ارسال پیام");
    }

    return await res.json();
  } catch (error) {
    console.error("خطا در ارسال پیام تماس با ما:", error);
    return { error: error.message };
  }
}
