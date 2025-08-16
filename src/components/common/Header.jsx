"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "../../components/common/Logo";
import MobileMenu from "../../components/common/MobileMenu";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE_URL } from "../../app/[locale]/api/config";
import { TokenStorage } from "../../services/storage/tokenStorage";
import { refreshToken } from "../../app/[locale]/api/auth/auth";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../language/LanguageSwitcher";
import SearchOverlay from "../../components/common/SearchOverlay";
import { getCartItemCount } from "../../services/cart/cartService";
import PdfDropdown from "../pdf/PdfDropdown";




export default function Header({
  logoAnimation = false,
  iconColor="#FF0000FF",
  stickOnScrollOnly =false
}) {
  const [scrolled, setScrolled] = useState(false);
  const [logoAnimationScrolled, setLogoAnimationScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);



  const scrollOffsetRef = useRef(0);

  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const t = useTranslations("navbar");

  useEffect(() => {
    if (searchOpen) {
      if (window.scrollY === 0) {
        // ذخیره مقدار اسکرول
        scrollOffsetRef.current = 100;
        // اسکرول به پایین
        window.scrollTo({
          top: scrollOffsetRef.current,
          behavior: "smooth",
        });
      } else {
        // اگر بالا نبود، هیچ‌کاری نمی‌کنیم
        scrollOffsetRef.current = 0;
      }
      document.body.style.overflow = 'hidden';
    } else {
      // وقتی پنجره بسته شد و قبلاً اسکرول کرده بودیم
      if (scrollOffsetRef.current > 0) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        scrollOffsetRef.current = 0;
      }
      document.body.style.overflow = '';
    }
    // پاک‌سازی در صورت خروج از کامپوننت (برای اطمینان)
  return () => {
    document.body.style.overflow = '';
  };
  }, [searchOpen]);

  useEffect(() => {
    async function fetchCartCount() {
      try {
        const count = await getCartItemCount();
        setCartCount(count);
      } catch (err) {
        console.error("خطا در دریافت تعداد سبد:", err);
        setCartCount(0);
      }
    }

    fetchCartCount();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);     
      if (logoAnimation) {
        setLogoAnimationScrolled(window.scrollY > 50);
      } else {
        setLogoAnimationScrolled(true); // لوگو ثابته
      }
    };
  
    // مقدار اولیه در لحظه اولین رندر:
    onScroll();
  
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  const toggleSearch = () => setSearchOpen((prev) => !prev);

  const handleProfileClick = async () => {
    const accessTokenStorage = await TokenStorage.getAccessToken();
    const refreshTokenStorage = await TokenStorage.getRefreshToken();

    if (!accessTokenStorage || !refreshTokenStorage) {

      router.push(`/${locale}/auth/SignIn`);
      return;
    }

    try {
      // یک تست ساده برای اعتبار سنجی توکن با فراخوانی پروفایل
      const response = await fetch(`${API_BASE_URL}/api/profile/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessTokenStorage}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push(`/${locale}/profile`);
      } else if (response.status === 401) {
        // تلاش برای رفرش توکن
        try {
          await refreshToken();
          router.push(`/${locale}/profile`);
        } catch {
          router.push(`/${locale}/auth/SignIn`);
        }
      } else {
        router.push(`/${locale}/auth/SignIn`);
      }
    } catch (error) {
      console.error("❌ خطا در بررسی پروفایل", error);
      router.push(`/${locale}/auth/SignIn`);
    }
  };



  const handleShoppingClick = () => {
    router.push(`/${locale}/cart`);
  };
  


  return (
    <>
<header
  className={`w-full z-50 transition-all duration-300 ${
    scrolled
      ? "fixed top-0 bg-white/80 backdrop-blur-md shadow-sm py-4"
      : `${stickOnScrollOnly ? "relative" : "fixed"} py-4`
  }`}
>

        <div className="relative flex items-center justify-between max-w-7xl mx-auto px-4 md:px-6">

          {/* منوی چپ یا دکمه همبرگری */}
          <div className="flex items-center gap-4">
            {/* لینک‌ها فقط در دسکتاپ (lg: یعنی از 1024px به بالا) */}
            <div className="hidden lg:flex gap-6 text-sm font-medium transition-colors "
                 style={{ color: scrolled ? "#4E4E4EFF" : iconColor }}>
              <Link href={`/${locale}`} className="hover:opacity-70 transition">
        {t('index')}
      </Link>
      <Link href={`/${locale}/products`} className="hover:opacity-70 transition">
        {t('shop')}
      </Link>
      <Link href={`/${locale}/magazine`} className="hover:opacity-70 transition">
        {t('magazine')}
      </Link>
      <Link href={`/${locale}/about-us`} className="hover:opacity-70 transition">
        {t('about-us')}
      </Link>
      <Link href={`/${locale}/contact-us`} className="hover:opacity-70 transition">
        {t('contact-us')}
      </Link>
      <PdfDropdown locale={locale} />
            </div>

            {/* دکمه همبرگری در موبایل و تبلت (زیر lg) */}
            <button
              className="block lg:hidden text-black hover:opacity-70 transition"
              onClick={() => setMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} color={scrolled ? "#000000FF" : iconColor} />
            </button>
          </div>

          {/* لوگو وسط */}
          
          <Logo
  className={`absolute left-1/2 top-1/2 -translate-x-1/2 transition-all duration-400 ${
    logoAnimationScrolled
      ?
       "-translate-y-1/2 scale-40 sm:scale-30"
       :"-translate-y-[-60px] lg:scale-[2] md:-translate-y-[-120px] md:scale-[1] scale-80"
  }`}
  fillColor={logoAnimationScrolled ? "#000000FF" : iconColor}
/>


{/* آیکون‌های سمت راست */}
<div className="flex items-center gap-4 md:gap-6 text-black ">
{/* سبد خرید */}
<button
  onClick={handleShoppingClick}
  className="relative hover:opacity-70 transition cursor-pointer"
  aria-label="Shopping Bag"
>
  <div className="relative">
    <ShoppingBag size={20} color={scrolled ? "#000000FF" : iconColor} />
    {/* {cartCount > 0 && (
      <span className={`absolute -top-2 -right-2 ${scrolled ? "bg-black text-white" : "bg-white"}   text-xs px-1.5 py-0.5 rounded-full`}>
        {cartCount}
      </span>
    )} */}
  </div>
</button>


  {/* پروفایل */}
  <button
    onClick={handleProfileClick}
    className="hover:opacity-70 transition md:inline-flex cursor-pointer"
    aria-label="Profile"
  >
    <User size={20} color={scrolled ? "#000000FF" : iconColor} />
  </button>

  {/* سرچ */}
  <button
    onClick={toggleSearch}
    className="hover:opacity-70 transition cursor-pointer"
    aria-label="Search"
  >
    <Search size={20} color={scrolled ? "#000000FF" : iconColor} />
  </button>
  {/* <LanguageSwitcher scrolled={scrolled} iconColor={iconColor}/> */}
</div>

        </div>
      </header>

      {/* منوی موبایل/تبلت */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} locale={locale}/>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />


    </>
  );
}
