'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { User, Heart, History, ShoppingCart, ShieldCheck, LogOut } from "lucide-react";

import Header from "../../../components/common/Header";
import HeroBanner from "../../../components/common/HeroBanner";
import Footer from "../../../components/common/Footer";
import { getProfile, logoutUserWithBlacklist } from "../api/auth/auth";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { locale } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("خطا در دریافت پروفایل:", err);
        setError("مشکلی در دریافت اطلاعات پروفایل رخ داد.");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUserWithBlacklist(router, locale);
    } catch (e) {
      console.error("Logout error:", e.message);
    }
  };

  return (
    <div>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
      <HeroBanner
        imageSrc="/images/HeroShortStandard_Gucci-LIDO-TIERI-APR25-07A-01v2-8bit-JIM3-ME-EXT_001_Default.avif"
        fallbackColor="#FF0000FF"
        title={`خوش آمدید ${profile?.full_name || "کاربر"}`}
        description="مجموعه‌ای از کیف‌های مردانه شامل کیف‌های مسافرتی، اداری، دستی، کمری و کوله‌پشتی در رنگ‌ها و متریال‌های مختلف."
      />

      <div className="px-6 md:px-20 py-12 space-y-10 mt-10" dir="rtl">
        <h1 className="text-4xl font-light tracking-wide">پروفایل من</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProfileCard title="ویرایش اطلاعات کاربری" href={`/${locale}/profile/edit`} icon={<User className="w-6 h-6" />} />
          <ProfileCard title="تاریخچه خرید" href={`/${locale}/profile/orders`} icon={<History className="w-6 h-6" />} />
          <ProfileCard title="سبد خرید من" href={`/${locale}/cart`} icon={<ShoppingCart className="w-6 h-6" />} />
          <ProfileCard title="بررسی اصالت کالا" href={`/${locale}/profile/authentication`} icon={<ShieldCheck className="w-6 h-6" />} />

          <div
            onClick={handleLogout}
            className="border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer bg-white space-y-3 flex items-center gap-4"
          >
            <div className="text-gray-500">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-medium">خروج از حساب</h2>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProfileCard({ title, href, icon }) {
  return (
    <Link href={href}>
      <div className="border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer bg-white space-y-3 flex items-center gap-4">
        <div className="text-gray-500">{icon}</div>
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
    </Link>
  );
}
