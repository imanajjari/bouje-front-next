import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { fetchMasterBlogCategories } from '../../services/magazine/magazineService';

export default async function SearchBarSSR({ locale, searchParams }) {
  const t = await getTranslations({ locale, namespace: 'magazine' });
  const masterCategories = await fetchMasterBlogCategories();
  const query = searchParams?.search ?? '';

  return (
    <>
      <section
        className="relative flex flex-col items-center w-full py-12 bg-white overflow-hidden"
        aria-labelledby="magazine-search-heading"
      >
        {/* Wave Animation Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-200 to-transparent animate-wave-fade" />
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-gray-300 to-transparent animate-wave-fade-slow" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full">
          {/* ----- تیتر ----- */}
          <h2
            id="magazine-search-heading"
            className="mb-6 px-4 text-center text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed"
          >
            {t('titleText')}
          </h2>

          {/* ----- فرم جستجو ----- */}
          <form
            role="search"
            action={`/${locale}/magazine`}
            method="GET"
            className="w-full flex justify-center px-4"
          >
            <div className="flex w-full max-w-xl bg-white rounded-md shadow-md overflow-hidden transition-all duration-300 border border-gray-300 focus-within:ring-2 focus-within:ring-green-600">
              <label htmlFor="magazine-search" className="sr-only">
                {t('search')}
              </label>
              <input
                id="magazine-search"
                type="text"
                name="search"
                defaultValue={query}
                placeholder={t('searchPlaceholder')}
                className="flex-1 px-5 py-3 focus:outline-none text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 transition-all duration-200 font-medium"
              >
                {t('search')}
              </button>
            </div>
          </form>

          {/* ----- دسته‌بندی‌ها ----- */}
          {masterCategories.length > 0 && (
            <nav
              aria-label="Magazine categories"
              className="mt-8 w-full flex flex-wrap justify-center gap-3 px-4"
            >
              <ul className="flex flex-wrap gap-3 justify-center">
                {masterCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/${locale}/magazine/category/${cat.slug}`}
                      className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-black hover:text-white transition-all duration-200 shadow-md"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>

      {/* Wave Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes wave-fade {
            0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
          }
          
          @keyframes wave-fade-slow {
            0%, 100% { opacity: 0; transform: scale(1.1) rotate(0deg); }
            50% { opacity: 0.8; transform: scale(0.9) rotate(-180deg); }
          }
          
          .animate-wave-fade {
            animation: wave-fade 15s ease-in-out infinite;
          }
          
          .animate-wave-fade-slow {
            animation: wave-fade-slow 20s ease-in-out infinite;
          }
        `
      }} />
    </>
  );
}