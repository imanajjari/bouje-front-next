import { API_BASE_URL } from "../config";

export const getProductDetail = async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/products/${slug}/`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("خطا در دریافت جزئیات محصول: " + errorText);
      }
  
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error("❌ خطا در getProductDetail:", error);
      throw error;
    }
  };
  