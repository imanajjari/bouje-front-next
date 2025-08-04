// /app/[locale]/magazine/tag/[slug]/page.jsx
import { fetchBlogPosts } from '../../../../../services/magazine/magazineService';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import GalleryGrid from '../../../../../components/magazine/GalleryGrid';
import { mapPostsToGalleryItems } from '../../../../../utils/magazine/mapPostsToGalleryItems';
import Header from '../../../../../components/common/Header';
import Footer from '../../../../../components/common/Footer';

/* ------------ SEO Metadata ------------ */
export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: 'magazine' });

  const title = `${t('tag')}: #${slug}`;
  const description = t('tagDescription', { tag: slug });

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/magazine/tag/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/magazine/tag/${slug}`,
      type: 'website',
      images: [
        {
          url: '/og-image-magazine.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/* ------------ Tag Page ------------ */
export default async function TagPage({ params }) {
  const { locale, slug } = params;

  const rawPosts = await fetchBlogPosts({ tag: slug });
  if (!rawPosts?.length) notFound();

  const posts = mapPostsToGalleryItems(rawPosts);
  const t = await getTranslations({ locale, namespace: 'magazine' });

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />

      <main className="max-w-6xl mx-auto px-4 pb-12 pt-24" aria-labelledby="tag-heading">
        {/* -------------- Breadcrumb -------------- */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm">
          <ol className="flex gap-1 text-gray-600">
            <li>
              <a href={`/${locale}/magazine`} className="hover:underline">
                {t('magazineHome')}
              </a>
              <span className="px-1">/</span>
            </li>
            <li className="font-semibold text-black">#{slug}</li>
          </ol>
        </nav>

        {/* -------------- Title -------------- */}
        <h1 id="tag-heading" className="text-3xl font-bold mb-8">
          #{slug}
        </h1>

        {/* -------------- Posts Grid -------------- */}
        <GalleryGrid
          sectionTitle={t('StayWithUs')}
          items={posts}
          locale={locale}
        />
      </main>

      <Footer />
    </>
  );
}
