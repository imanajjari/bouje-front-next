'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import StructuredData from '../StructuredData'; 

export default function ContactStructuredData() {
  const params = useParams();
  const locale = (params?.locale ) || 'fa';
  const t = useTranslations("contact");

  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "لوکس برند",
        url: "https://yourwebsite.com",
        logo: "https://yourwebsite.com/images/logo.png",
        description: t('hero.description'),
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+982112345678",
            contactType: "Customer Service",
            areaServed: "IR",
            availableLanguage: ["Persian", "English", "Arabic"],
            email: "contact@luxbrand.ir",
          }
        ],
        sameAs: [
          "https://instagram.com/luxbrand",
          "https://linkedin.com/company/luxbrand"
        ]
      }}
    />
  );
}
