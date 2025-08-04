'use client';

import { useState } from "react";
import { submitCheckoutInfo } from "../../../services/checkout/checkoutService";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { createOrder } from "../../../services/order/orderService";
import { startFakePayment } from "../../../services/payment/paymentService";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const [form, setForm] = useState({
    phone_number: "",
    address: "",
    postal_code: "",
    landline_number: "",
  });
  const [loading, setLoading] = useState(false);
  
  const t = useTranslations("checkout");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  

  
    try {
      // 1. ثبت اطلاعات سفارش
      const checkoutRes = await submitCheckoutInfo(form);

  
      // 2. ثبت سفارش
      const orderRes = await createOrder();

      const orderId = orderRes.id;
  
      // 3. شروع پرداخت
      const paymentRes = await startFakePayment(orderId);

      const referenceId = paymentRes.reference_id;
  
      // 4. نمایش ref یا انتقال به تأیید پرداخت
      toast.success(t("submitSuccess"));
  
      // می‌تونی به صفحه‌ای مثل /payment/verify?ref=... منتقل بشی
      // router.push(`/checkout/verify?ref=${referenceId}`);
      router.push(`/${locale}`);

    } catch (err) {
      console.error("❌ خطا در چرخه سفارش:", err);
      toast.error(t("submitError"));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
      
      {/* Luxury Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-16 pt-28">
          
          {/* Elegant Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">
              {t("title")}
            </h1>
            <div className="w-24 h-px bg-gray-900 mx-auto mb-8"></div>
            <p className="text-gray-600 font-light text-lg">
              لطفاً اطلاعات خود را با دقت وارد کنید
            </p>
          </div>

          {/* Luxury Form Container */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Phone Number */}
                  <div className="group">
                    <label 
                      htmlFor="phone_number" 
                      className="block text-sm font-medium text-gray-700 mb-3 tracking-wide"
                    >
                      {t("phone")}*
                    </label>
                    <div className="relative">
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="text"
                        value={form.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-4 text-lg focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors duration-300 placeholder-gray-400"
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      />
                      <div className="absolute bottom-0 left-0 h-0.5 bg-gray-900 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="group">
                    <label 
                      htmlFor="address" 
                      className="block text-sm font-medium text-gray-700 mb-3 tracking-wide"
                    >
                      {t("address")}*
                    </label>
                    <div className="relative">
                      <textarea
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="w-full border-2 border-gray-200 rounded-lg bg-gray-50 px-4 py-4 text-lg focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300 resize-none placeholder-gray-400"
                        placeholder="آدرس کامل خود را وارد کنید..."
                      />
                    </div>
                  </div>

                  {/* Postal Code & Landline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                      <label 
                        htmlFor="postal_code" 
                        className="block text-sm font-medium text-gray-700 mb-3 tracking-wide"
                      >
                        {t("postal")}*
                      </label>
                      <div className="relative">
                        <input
                          id="postal_code"
                          name="postal_code"
                          type="text"
                          value={form.postal_code}
                          onChange={handleChange}
                          required
                          className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-4 text-lg focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors duration-300 placeholder-gray-400"
                          placeholder="۱۲۳۴۵۶۷۸۹۰"
                        />
                        <div className="absolute bottom-0 left-0 h-0.5 bg-gray-900 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                      </div>
                    </div>

                    <div className="group">
                      <label 
                        htmlFor="landline_number" 
                        className="block text-sm font-medium text-gray-700 mb-3 tracking-wide"
                      >
                        {t("landline")}
                      </label>
                      <div className="relative">
                        <input
                          id="landline_number"
                          name="landline_number"
                          type="text"
                          value={form.landline_number}
                          onChange={handleChange}
                          className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-0 py-4 text-lg focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors duration-300 placeholder-gray-400"
                          placeholder="۰۲۱۱۲۳۴۵۶۷۸"
                        />
                        <div className="absolute bottom-0 left-0 h-0.5 bg-gray-900 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full bg-gray-900 text-white py-4 rounded-none hover:bg-gray-800 transition-all duration-300 font-light tracking-widest text-sm uppercase overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10">
                        {loading ? "در حال پردازش..." : t("submit")}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      
                      {/* Loading spinner */}
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Security Note */}
                  <div className="text-center pt-4">
                    <p className="text-xs text-gray-500 font-light">
                      اطلاعات شما با بالاترین سطح امنیت محافظت می‌شود
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>پردازش امن و سریع</span>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>پشتیبانی ۲۴/۷</span>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}