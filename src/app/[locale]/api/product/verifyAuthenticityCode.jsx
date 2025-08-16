import { API_BASE_URL } from "../config";

  // بررسی کد اصالت
  export const verifyAuthenticityCode = async (code) => {
    const url = `${API_BASE_URL}/api/verify/?code=${code}`;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to verify authenticity code: " + errorText);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("🚨 Error verifying authenticity code:", error);
      throw error;
    }
  };