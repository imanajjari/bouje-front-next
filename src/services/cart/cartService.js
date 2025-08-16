 // /src/services/cart/cartService.js

import { authFetch } from "../../app/[locale]/api/auth/auth";
import { API_BASE_URL } from "../../app/[locale]/api/config";



// get carts
export async function getCart() {
    const res = await authFetch(`${API_BASE_URL}/cart/`, {
      method: "GET",
    });
    return res.json();
  }

// Add item to cart
export async function addToCart(variantId, quantity) {
  const res = await authFetch(`${API_BASE_URL}/cart/add/`, {
    method: "POST",
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });
  return res.json();
}

// Update item in cart
export async function updateCart(variantId, quantity) {
  const res = await authFetch(`${API_BASE_URL}/cart/update/`, {
    method: "PUT",
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });
  return res.json();
}

// Remove item from cart
export async function removeFromCart(variantId) {
  const res = await authFetch(`${API_BASE_URL}/cart/remove/`, {
    method: "DELETE",
    body: JSON.stringify({ variant_id: variantId }),
  });
  return res.json();
}

// Count of Cart Item
export async function getCartItemCount() {
  const res = await authFetch(`${API_BASE_URL}/cart/`, {
    method: "GET",
  });

  const result = await res.json();

  const items = result?.data?.items ?? [];

  // مجموع quantity آیتم‌ها در سبد
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return count;
}
