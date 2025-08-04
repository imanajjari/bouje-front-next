// src/components/IntlProviderWrapper.js
'use client';
import {NextIntlClientProvider} from 'next-intl';
import {useEffect, useState} from 'react';
import {LuxuryLoadingAnimation } from '../components/common/LuxuryLoadingAnimation'
export default function IntlProviderWrapper({locale, children}) {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    import(`../locales/${locale}.json`)
      .then((mod) => setMessages(mod.default))
      .catch(() => setMessages({}));
  }, [locale]);

  if (!messages) return <LuxuryLoadingAnimation iconColor="#000000" />;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
