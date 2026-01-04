// src/i18n/request.js
import {getRequestConfig} from "next-intl/server";
import {supportedLocales, defaultLocale} from "./settings";

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = supportedLocales.includes(locale) ? locale : defaultLocale;

  let messages;
  try {
    messages = (await import(`../locales/${resolvedLocale}.json`)).default;
  } catch (e) {
    messages = (await import(`../locales/${defaultLocale}.json`)).default;
  }

  return {
    locale: resolvedLocale,
    messages
  };
});

