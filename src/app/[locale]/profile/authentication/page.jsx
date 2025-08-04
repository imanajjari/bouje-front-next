'use client';

import Footer from "../../../../components/common/Footer";
import Header from "../../../../components/common/Header";
import HeroBanner from "../../../../components/common/HeroBanner";
import { useState } from "react";
import { productService } from "../../../../services/product/productService";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AuthenticationPage() {
  const [authCode, setAuthCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const checkAuthenticity = async () => {
    if (!authCode) {
      setError("لطفاً کد اصالت را وارد کنید.");
      return;
    }

    setLoading(true);
    setProduct(null);
    setError("");

    try {
      const result = await productService.checkProductAuthenticity(authCode);
      if (result) {
        setProduct(result);
      } else {
        setError("کالا با این کد اصالت یافت نشد.");
      }
    } catch {
      setError("مشکلی در بررسی اصالت پیش آمد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />

      <HeroBanner
        imageSrc="/images/HeroShortStandard_Gucci-LIDO-TIERI-APR25-07A-01v2-8bit-JIM3-ME-EXT_001_Default.avif"
        fallbackColor="#FF0000FF"
        title="بررسی اصالت کالا"
        description="با وارد کردن کد اصالت، از اصل بودن محصول خود مطمئن شوید."
      />

      <div className="w-full flex justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">احراز اصالت محصول</h2>

          <div className="flex gap-4">
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="کد اصالت محصول را وارد کنید"
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-sm"
            />
            <button
              onClick={checkAuthenticity}
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-lg text-sm font-medium transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : null}
              بررسی
            </button>
          </div>

          {/* نمایش پیام خطا */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg animate-fade-in">
              <XCircle size={20} /> {error}
            </div>
          )}

          {/* نمایش اطلاعات در صورت تأیید اصالت */}
          {product && (
            <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded-lg space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <CheckCircle size={20} /> اصالت محصول تایید شد!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><strong>نام کالا:</strong> {product.name}</div>
                <div><strong>کد محصول:</strong> {product.product_code}</div>
                <div><strong>توضیحات:</strong> {product.description}</div>
                <div><strong>قیمت:</strong> {product.price} تومان</div>
                <div><strong>رنگ:</strong> {product.variant?.color?.name} ({product.variant?.color?.hex_code})</div>
                <div><strong>سایز:</strong> {product.variant?.size}</div>
                <div><strong>موجودی انبار:</strong> {product.variant?.stock}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
