'use client';

import { useEffect, useState } from "react";
import { getCart, updateCart, removeFromCart } from "../../../services/cart/cartService";
import { toast } from "sonner";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import { API_BASE_URL } from "../api/config";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
      
      {/* Luxury Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-5xl mx-auto pt-24 pb-16 px-6">
          
          {/* Elegant Header */}
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
                <div key={item.id} className="group">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="p-8">
                      <div className="flex items-start gap-8">
                        
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative overflow-hidden rounded-lg bg-gray-50">
                            <Image
                              src={`${API_BASE_URL}${item.product_image}`}
                              alt={item.product_name}
                              width={140}
                              height={140}
                              className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow text-right">
                          <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-wide">
                            {item.product_name}
                          </h2>
                          
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-end items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{item.size}</span>
                              <span className="text-sm text-gray-500">:{t("size")}</span>
                            </div>
                            <div className="flex justify-end items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{item.color}</span>
                              <span className="text-sm text-gray-500">:{t("color")}</span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-end gap-4 mb-6">
                            <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2">
                              <button
                                disabled={loading}
                                onClick={() => handleUpdateQuantity(item.variant, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
                              >
                                <Minus className="w-4 h-4 text-gray-700" />
                              </button>
                              
                              <span className="font-medium text-gray-900 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                disabled={loading}
                                onClick={() => handleUpdateQuantity(item.variant, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
                              >
                                <Plus className="w-4 h-4 text-gray-700" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-xl font-medium text-gray-900">
                              {(item.product_price * item.quantity).toLocaleString()} تومان
                            </p>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleRemove(item.variant)}
                            disabled={loading}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-all duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-right flex-grow">
                      <p className="text-sm text-gray-600 mb-2 font-light tracking-wide">
                        {t("total")}
                      </p>
                      <p className="text-3xl font-light text-gray-900 tracking-wide">
                        {totalPrice.toLocaleString()} تومان
                      </p>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <div className="text-left">
                    <button
                      onClick={() => router.push(`/${locale}/checkout`)}
                      className="group relative bg-gray-900 text-white px-12 py-4 rounded-none hover:bg-gray-800 transition-all duration-300 font-light tracking-widest text-sm uppercase overflow-hidden"
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