// /app/[locale]/magazine/category/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { mapPostsToGalleryItems } from '../../../../../utils/magazine/mapPostsToGalleryItems';
import GalleryGrid from '../../../../../components/magazine/GalleryGrid';
import {
  fetchBlogPostsByCategory,
  fetchBlogCategories          
} from '../../../../../services/magazine/magazineService';
import Header from '../../../../../components/common/Header';
import Footer from '../../../../../components/common/Footer';
import HeroBanner from '../../../../../components/common/HeroBanner';

/* --------- meta --------- */
export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: 'magazine' });

  // جزئیات دسته
  const categories = await fetchBlogCategories();
  const category   = categories.find(c => c.slug === slug);

  // اگر دسته وجود نداشت
  if (!category) {
    return {
      title: t('CategoryNotFound'),
      description: t('CategoryNotFound'),
      robots: 'noindex',
    };
  }

  const title       = `${t('category')}: ${category.name}`;
  const description = category.description || t('pageDescription'); // یا fallback عمومی
  const ogImage     = category.image
    ? {
        url: category.image,
        width: 1200,
        height: 630,
        alt: title,
      }
    : {
        url: '/images/og-fallback.jpg',
        width: 1200,
        height: 630,
        alt: title,
      };

  const canonicalUrl = `/${locale}/magazine/category/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [ogImage],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  };
}


/* -------------------------- page ------------------------ */
export default async function CategoryPage({ params }) {
  // هم‌زمان پست‌های این کتگوری و لیست کتگوری‌ها را بگیر
  const [rawPosts, categories] = await Promise.all([
    fetchBlogPostsByCategory(params.slug),
    fetchBlogCategories(),
  ]);

  const category = categories.find(c => c.slug === params.slug);
  if (!category) notFound();

  const posts = mapPostsToGalleryItems(rawPosts);
  if (!posts.length) notFound();

  const t = await getTranslations({ locale: params.locale, namespace: 'magazine' });

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />

      {/* هدر کتگوری با تصویر و نام */}
      <HeroBanner
  imageSrc={category?.image || "/images/fallback.jpg"}
  fallbackColor="#FF0000FF"
  title={category?.name || `دسته ${slug}`}
  description={ ""}
/>


<main className="max-w-6xl mx-auto px-4 pb-8 pt-10" aria-labelledby="category-heading">
        {/* توضیح کتگوری (اختیاری) */}
        {category.description && (
          <p className="mb-6 text-gray-600 leading-relaxed">{category.description}</p>
        )}

        <GalleryGrid
          sectionTitle={t('StayWithUs')}
          items={posts}
          locale={params.locale}
        />
      </main>

      <Footer />
    </>
  );
}
