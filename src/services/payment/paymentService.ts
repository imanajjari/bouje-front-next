import { authFetch } from "../../app/[locale]/api/auth/auth";
import { API_BASE_URL } from "../../app/[locale]/api/config";

// Start fake payment process
export async function startFakePayment(orderId: number) {
  const res = await authFetch(`${API_BASE_URL}/api/payment/start/?order_id=${orderId}`, {
    method: "GET",
  });
  return res.json();
}

// Verify fake payment
export async function verifyFakePayment(referenceId: string) {
  const res = await authFetch(`${API_BASE_URL}/payment/fake/verify?ref=${referenceId}`, {
    method: "GET",
  });
  return res.json();
}
