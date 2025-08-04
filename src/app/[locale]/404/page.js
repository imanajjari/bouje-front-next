// src/app/[locale]/404/page.js
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Custom404() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale || 'en';
  const originalPath = searchParams.get('original');

  const messages = {
    en: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      originalPath: originalPath ? `You tried to access: ${originalPath}` : '',
      backHome: 'Back to Home',
      backButton: 'Go Back',
      suggestions: 'You might be looking for:',
      links: {
        home: 'Home',
        shop: 'Shop',
        magazine: 'Magazine',
        about: 'About Us',
        contact: 'Contact Us'
      }
    },
    fa: {
      title: 'صفحه یافت نشد',
      description: 'صفحه مورد نظر شما وجود ندارد.',
      originalPath: originalPath ? `شما سعی کردید به این آدرس دسترسی پیدا کنید: ${originalPath}` : '',
      backHome: 'بازگشت به خانه',
      backButton: 'بازگشت',
      suggestions: 'ممکن است به دنبال این موارد باشید:',
      links: {
        home: 'خانه',
        shop: 'فروشگاه',
        magazine: 'مجله',
        about: 'درباره ما',
        contact: 'تماس با ما'
      }
    },
    ar: {
      title: 'الصفحة غير موجودة',
      description: 'الصفحة التي تبحث عنها غير موجودة.',
      originalPath: originalPath ? `حاولت الوصول إلى: ${originalPath}` : '',
      backHome: 'العودة للرئيسية',
      backButton: 'العودة',
      suggestions: 'قد تبحث عن:',
      links: {
        home: 'الرئيسية',
        shop: 'المتجر',
        magazine: 'المجلة',
        about: 'من نحن',
        contact: 'اتصل بنا'
      }
    }
  };

  const currentMessages = messages[locale] || messages.en;
  const isRTL = ['fa', 'ar'].includes(locale);

  const quickLinks = [
    { key: 'home', href: `/${locale}` },
    { key: 'shop', href: `/${locale}/products` },
    { key: 'magazine', href: `/${locale}/magazine` },
    { key: 'about', href: `/${locale}/about-us` },
    { key: 'contact', href: `/${locale}/contact-us` }
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* خط‌های تزئینی گوچی */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-500 to-black"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-500 to-black"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-black via-gray-500 to-black"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-black via-gray-500 to-black"></div>
      </div>

      <div className="max-w-2xl w-full bg-gray-50 border border-gray-200 shadow-2xl p-12 text-center relative">
        {/* لوگوی تزئینی */}
        <div className="absolute top-6 left-6 right-6 flex justify-center">
          <div className="w-16 h-1 bg-black"></div>
        </div>

        {/* آیکون 404 به سبک گوچی */}
        <div className="relative mb-12">
          <div className="text-8xl font-light text-gray-300 select-none tracking-wider">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-black bg-white flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-black" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* عنوان و توضیحات */}
        <h1 className="text-4xl font-light text-black mb-6 tracking-wide">
          {currentMessages.title}
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed font-light text-lg">
          {currentMessages.description}
        </p>

        {/* مسیر اصلی که کاربر سعی کرده */}
        {originalPath && (
          <div className="mb-8 p-6 bg-gray-100 border border-gray-300">
            <p className="text-sm text-gray-700 font-light">
              {currentMessages.originalPath}
            </p>
          </div>
        )}

        {/* دکمه‌های اصلی */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link 
            href={`/${locale}`}
            className="flex-1 bg-black text-white py-4 px-8 font-light hover:bg-gray-800 transition-all duration-300 tracking-wider text-sm uppercase border-2 border-black hover:border-gray-800"
          >
            {currentMessages.backHome}
          </Link>
          
          <button
            onClick={() => router.back()}
            className="flex-1 bg-white text-black py-4 px-8 font-light hover:bg-gray-100 transition-all duration-300 tracking-wider text-sm uppercase border-2 border-black hover:border-gray-600"
          >
            {currentMessages.backButton}
          </button>
        </div>

        {/* لینک‌های سریع */}
        <div className="border-t border-gray-300 pt-8">
          <p className="text-gray-700 mb-6 font-light text-sm uppercase tracking-wider">
            {currentMessages.suggestions}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="py-3 px-6 bg-white text-black hover:bg-black hover:text-white transition-all duration-300 text-sm font-light border border-gray-400 hover:border-black tracking-wide uppercase"
              >
                {currentMessages.links[link.key]}
              </Link>
            ))}
          </div>
        </div>

        {/* خط تزئینی پایین */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-center">
          <div className="w-16 h-1 bg-black"></div>
        </div>
      </div>
    </div>
  );
}