import { authFetch } from "../../app/[locale]/api/auth/auth";
import { API_BASE_URL } from "../../app/[locale]/api/config";


// Create a new order
export async function createOrder() {
  const res = await authFetch(`${API_BASE_URL}/api/orders/create/`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return res.json();
}

// گرفتن لیست سفارش‌ها
export async function getOrders() {
  const res = await authFetch(`${API_BASE_URL}/api/orders/my-orders/`);
  if (!res.ok) throw new Error("خطا در دریافت سفارش‌ها");
  return await res.json();
}
