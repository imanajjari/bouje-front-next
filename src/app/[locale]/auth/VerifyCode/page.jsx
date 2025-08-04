'use client';

import { useEffect, useState } from "react";
import Footer from "../../../../components/common/Footer";
import Header from "../../../../components/common/Header";
import HeroBanner from "../../../../components/common/HeroBanner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from 'sonner';
import { verifyPhoneCode } from "../../api/auth/auth"; // تابع جدید مناسب این مسیر
import { useTranslations } from "next-intl";

export default function VerifyCodePage() {
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const t = useTranslations("navbar");

  useEffect(() => {
    const phoneFromUrl = searchParams.get("phone");
    if (phoneFromUrl) {
      setPhoneNumber(phoneFromUrl);
    } else {
      toast.error("شماره تلفن یافت نشد.");
      router.push(`/${locale}/auth/SignIn`);
    }
  }, [searchParams, router]);

  const handleVerifyCode = async () => {
    if (!verifyCode) {
      toast.error("لطفاً کد تایید را وارد کنید.");
      return;
    }
  
    setLoading(true);
  
    const result = await verifyPhoneCode(phoneNumber, verifyCode);
  
    setLoading(false);
  
    if (result.success) {
      toast.success(result.message || "ورود با موفقیت انجام شد.");
      router.push(`/${locale}/profile`);
    } else {
      toast.error(result.message || "خطا در تأیید کد.");
    }
  };
  

  return (
    <div dir="rtl">
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
      <HeroBanner
        imageSrc="/images/HeroShortStandard_Gucci-LIDO-TIERI-APR25-07A-01v2-8bit-JIM3-ME-EXT_001_Default.avif"
        fallbackColor="#FF0000FF"
        title="تایید کد ورود"
        description=""
      />

      <div className="w-full p-10 flex self-center justify-center ">
        <div className="w-full p-10 md:w-1/2">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">ورود کد تایید</h1>
          <p className="text-lg text-gray-600 mb-6">
            کد تایید ارسال‌شده به شماره <strong>{phoneNumber}</strong> را وارد کنید.
          </p>

          <div className="mb-6">
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="کد تایید"
              className="w-full border border-gray-300 p-4 rounded-md text-right text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition duration-300"
            />
          </div>

          <button
            onClick={handleVerifyCode}
            className={`w-full bg-black text-white px-6 py-3 rounded-md text-lg font-semibold transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
            disabled={loading}
          >
            {loading ? "در حال ارسال..." : "ارسال کد تایید"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
