import { authFetch } from "../../app/[locale]/api/auth/auth";
import { API_BASE_URL } from "../../app/[locale]/api/config";



// ارسال اطلاعات مرحله‌ی checkout
export async function submitCheckoutInfo({
  phone_number,
  address,
  postal_code,
  landline_number,
}: {
  phone_number: string;
  address: string;
  postal_code: string;
  landline_number: string;
}) {
  const res = await authFetch(`${API_BASE_URL}/api/payment/checkout-info/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number,
      address,
      postal_code,
      landline_number,
    }),
  });

  return res.json();
}
