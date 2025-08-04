'use client';

import {Globe} from 'lucide-react';
import {usePathname, useRouter} from 'next/navigation';
import {useState, useTransition} from 'react';





const supportedLocales = ['fa', 'en', 'ar'];

export default function LanguageSwitcher({scrolled,iconColor}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentLocale = pathname.split('/')[1];

  const changeLocale = (newLocale) => {
    if (newLocale === currentLocale) return;

    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <div className="relative group">
      <button
        aria-label="Change Language"
        className="hover:opacity-80 transition p-1"
        onClick={()=>{setIsOpen(!isOpen)
        }}
      >
        <Globe size={20} color={scrolled ? "#000000FF" : iconColor} />
      </button>

      {/* منوی زبان */}
      {isOpen&&
      <div className={`absolute top-8 ${currentLocale=="en"?"right-0":"left-0"} bg-white shadow-md rounded-md border px-2 py-1 transition-all duration-200 z-50`}>
        {supportedLocales.map((locale) => (
          <button
          key={locale}
          onClick={() => changeLocale(locale)}
          className={`block px-3 py-1 text-sm rounded hover:bg-gray-100 transition ${
            currentLocale === locale ? 'font-bold text-black' : 'text-gray-600'
            }`}
            >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
      }
    </div>
  );
}
