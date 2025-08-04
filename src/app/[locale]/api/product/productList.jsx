// لیست محصولات
export const listProducts = async () => {
    const url = "https://bouje-back.onrender.com/api/products/products/";
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to fetch product list: " + errorText);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("🚨 Error fetching product list:", error);
      throw error;
    }
  };
  

  