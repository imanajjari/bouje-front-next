// src/i18n/request.js
import { getRequestConfig } from 'next-intl/server';

const SUPPORTED_LOCALES = ['fa', 'en'];

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`⚠️ Unsupported or missing locale: ${locale}. Falling back to "fa".`);
    locale = 'fa';
  }

  const messages = await import(`../locales/${locale}.json`).then((mod) => mod.default);

  return {
    locale,
    messages
  };
});
