'use client';

import { useTranslations } from 'next-intl';
import Logo from './Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];
  const t = useTranslations("footer");
  const links = t.raw("links");

  return (
    <footer className="bg-black text-gray-100 py-10 px-4" >
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h2 className="text-2xl text-white mb-3">{t("quote")}</h2>
      </div>

      {/* Links */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
        {links.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <ul>
              {section.items.map((item, index) => (
                <li key={index}>
                  <Link href={`/${locale}${item.href}`} className="text-[#9F9F9FFF] hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Logo */}
      <div className="flex justify-center">
        <Logo className="w-1/2" fillColor="#9F9F9FFF" />
      </div>

      {/* Legal */}
      <div className="max-w-6xl mx-auto text-center text-sm text-[#9F9F9FFF] mt-6">
        {t("legal.text")}
      </div>
    </footer>
  );
}
