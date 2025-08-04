export function getDefaultMetadata(locale) {
    const titles = {
      fa: 'فروشگاه بوج | خرید آنلاین مد و فشن',
      en: 'Bouje Store | Online Fashion & Style',
    };
  
    const descriptions = {
      fa: 'خرید جدیدترین لباس‌ها، کفش‌ها و اکسسوری‌ها با ارسال سریع.',
      en: 'Shop the latest clothes, shoes and accessories with fast shipping.',
    };
  
    return {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
    };
  }
  