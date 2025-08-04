import { createMetadata } from '../../../lib/metadata';

const contentByLocale = {
  fa: {
    title: 'تماس با ما',
    description: 'برای هرگونه ارتباط با تیم لوکس برند از طریق اطلاعات تماس، فرم یا موقعیت مکانی در نقشه استفاده کنید.',
    keywords: ['تماس با ما', 'آدرس شرکت', 'فرم تماس', 'پشتیبانی'],
  },
  en: {
    title: 'Contact Us',
    description: 'Reach out to our Lux Brand team using contact info, form, or map location.',
    keywords: ['contact us', 'address', 'contact form', 'support'],
  },
  ar: {
    title: 'تواصل معنا',
    description: 'تواصل مع فريق لوكس براند من خلال المعلومات، النموذج أو موقع الخريطة.',
    keywords: ['تواصل معنا', 'العنوان', 'نموذج الاتصال', 'الدعم'],
  },
};

export async function generateMetadata(context) {
  const params = await context.params;
  const locale = params.locale || 'fa';
  const content = contentByLocale[locale] || contentByLocale.fa;

  return createMetadata({
    title: content.title,
    description: content.description,
    path: '/contact',
    locale: locale,
    keywords: content.keywords,
    image: '/images/HeroShortStandard_GucciContact.webp',
  });
}
