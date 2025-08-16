'use client';

import { useEffect, useState } from "react";
import { getCart, updateCart, removeFromCart } from "../../../services/cart/cartService";
import { toast } from "sonner";
import Image from "next/image";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { API_BASE_URL } from "../api/config";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// ✅ کامپوننت جدید کارت
import CartItemCard from "../../../components/cart/CartItemCard";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const t = useTranslations("cart");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setItems(data.data.items);
      setTotalPrice(data.data.total_price);
    } catch (error) {
      toast.error(t("fetchError"));
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (variantId, newQty) => {
    if (newQty < 1) return;
    try {
      setLoading(true);
      await updateCart(String(variantId), newQty);
      await fetchCart();
    } catch (error) {
      toast.error(t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (variantId) => {
    try {
      setLoading(true);
      await removeFromCart(variantId);
      await fetchCart();
      toast.success(t("removeSuccess"));
    } catch (error) {
      toast.error(t("removeError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />

      {/* پس‌زمینه لوکس + پدینگ واکنش‌گرا */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" dir="rtl">
        <div className="max-w-5xl mx-auto pt-24 pb-16 px-4 sm:px-6">
          {/* هدر صفحه */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-wide">
              {t("title")}
            </h1>
            <div className="w-24 h-px bg-gray-900 mx-auto"></div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <p className="text-xl text-gray-600 font-light mb-8">{t("empty")}</p>
                <div className="w-16 h-px bg-gray-300 mx-auto"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  imageUrl={`${API_BASE_URL}${item.product_image}`}
                  loading={loading}
                  t={t}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                  dir="rtl"
                />
              ))}

              {/* بخش جمع کل */}
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-8">
                    <div className="text-right flex-grow">
                      <p className="text-sm text-gray-600 mb-2 font-light tracking-wide">
                        {t("total")}
                      </p>
                      <p className="text-2xl md:text-3xl font-light text-gray-900 tracking-wide">
                        {totalPrice.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>

                    {/* دکمه تمام‌عرض روی موبایل */}
                    <button
                      onClick={() => router.push(`/${locale}/checkout`)}
                      className="w-full md:w-auto group relative bg-gray-900 text-white px-6 md:px-12 py-3 md:py-4 rounded-none hover:bg-gray-800 transition-all duration-300 font-light tracking-widest text-sm uppercase overflow-hidden"
                    >
                      <span className="relative z-10">{t("checkoutButton")}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
