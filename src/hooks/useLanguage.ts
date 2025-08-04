// src/hooks/useLanguage.ts
'use client';

import {useRouter, usePathname} from 'next/navigation';

const supportedLocales = ['fa', 'en', 'ar'];

export default function useLanguage() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    if (!supportedLocales.includes(newLocale)) {
      console.warn(`Unsupported locale: ${newLocale}`);
      return;
    }

    const segments = pathname.split('/');
    segments[1] = newLocale; // تغییر اولین بخش مسیر به زبان جدید
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return {changeLanguage};
}
