
import { TokenStorage } from "../../../..//services/storage/tokenStorage";
import { API_BASE_URL } from "../config";
import { authFetch } from "../auth/auth";


export const getCart = async () => {
  const url = `${API_BASE_URL}/api/cart/`;

  const response = await authFetch(url, { method: "GET" });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("خطا در دریافت سبد خرید: " + errorText);
  }

  return await response.json();
};

export const addToCart = async ({ product_id, quantity }) => {
  const url = `${API_BASE_URL}/api/cart/add/`;

  const response = await authFetch(url, {
    method: "POST",
    body: JSON.stringify({ product_id, quantity }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("خطا در افزودن به سبد خرید: " + errorText);
  }

  return await response.json();
};

export const updateCartItem = async ({ product_id, quantity }) => {
  const url = `${API_BASE_URL}/api/cart/update/`;

  const response = await authFetch(url, {
    method: "PUT",
    body: JSON.stringify({ product_id, quantity }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("خطا در بروزرسانی آیتم سبد خرید: " + errorText);
  }

  return await response.json();
};

export const removeCartItem = async (product_id) => {
  const url = `${API_BASE_URL}/api/cart/remove/`;

  const response = await authFetch(url, {
    method: "DELETE",
    body: JSON.stringify({ product_id }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("خطا در حذف آیتم از سبد خرید: " + errorText);
  }

  return await response.json();
};
