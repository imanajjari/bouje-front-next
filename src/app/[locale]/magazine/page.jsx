import Footer from "../../../components/common/Footer";
import Header from "../../../components/common/Header";
import ProductCarousel from '../../../components/home/ProductCarousel';
import CannesRedCarpetSection from "../../../components/magazine/CannesRedCarpetSection";
import GalleryGrid from "../../../components/magazine/GalleryGrid";
import CollectionPosts from "../../../components/magazine/CollectionPosts";
import MustReadSection from "../../../components/magazine/MustReadSection";
import SearchBar from "../../../components/magazine/SearchBar";
import { fetchBlogCategories, fetchBlogCollections, fetchBlogPosts, searchBlogPosts } from "../../../services/magazine/magazineService";
import { mapPostsToGalleryItems } from "../../../utils/magazine/mapPostsToGalleryItems";
import { mapCollectionToProducts } from "../../../utils/magazine/mapCollectionToProducts";
import { getTranslations } from "next-intl/server";
import ReadingProgress from "../../../components/magazine/ReadingProgress";
import CategoryList from "../../../components/product/ProductCategory";

/* ----------- سئو: متادیتا ----------- */
export async function generateMetadata(context) {
  const { locale = 'fa' } = await context.params;
  const sp = await context.searchParams;

  // ممکن است sp یک URLSearchParams باشد یا یک آبجکت ساده
  const query = typeof sp?.get === 'function' ? (sp.get('search') ?? '') : (sp?.search ?? '');

  const t = await getTranslations({ locale, namespace: 'magazine' });

  return {
    title: query ? `${t('searchResultsFor', { query })}` : t('pageTitle'),
    description: query ? `${t('searchResultsDesc', { query })}` : t('pageDescription'),
    alternates: { canonical: `/${locale}/magazine` },
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      url: `/${locale}/magazine`,
      type: 'website',
    },
  };
}

export default async function MagazinePage(context) {
  const { locale = 'fa' } = await context.params;
  const searchParams = await context.searchParams;
  const Categories = await fetchBlogCategories();
  const t = await getTranslations({ locale, namespace: 'magazine' });

  const query = typeof searchParams?.get === 'function' ? (searchParams.get('search') ?? '') : (searchParams?.search ?? '');
  const rawPosts = query
    ? await searchBlogPosts({ query })
    : await fetchBlogPosts();

  const galleryItems = mapPostsToGalleryItems(rawPosts);
  const collections = await fetchBlogCollections();

  const mustReadItems = rawPosts
    .filter(post => post.featured_level === 4)
    .slice(-3)
    .map(post => ({
      category: post.categories?.[0]?.name || 'Uncategorized',
      title: post.title,
      author: 'Bouje Magazine',
      image: post.media,
      url: `/${locale}/magazine/${post.slug}`,
    }));

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
      {/* <ReadingProgress /> */}

      <main className="pt-20">
        <SearchBar locale={locale} searchParams={searchParams} />

        {!query && <CannesRedCarpetSection posts={rawPosts} locale={locale}/>}

        {!query && collections.map((collection) => (
          <section
            key={collection.id}
            className="px-4 py-10 max-w-screen-xl mx-auto"
            dir={collection.direction || 'rtl'}
          >
            <h2 className="text-center border-y p-2 m-2 text-xl font-bold md:text-4xl border-gray-400">
              {collection.title}
            </h2>

            <ProductCarousel
              products={mapCollectionToProducts(collection, locale)}
              slidesPerView={{
                default: 1.5,
                spacing: 10,
              }}
              breakpoints={{
                '(min-width: 425px)': {
                  perView: 3,
                  spacing: 10,
                },
                '(min-width: 768px)': {
                  perView: collection.posts.length < 3 ? 3.5 : 3,
                  spacing: 40,
                },
                '(min-width: 1024px)': {
                  perView: collection.posts.length < 3 ? 3.5 : 3,
                  spacing: 20,
                },
              }}
              blur={{
                active: 0,
                adjacent: 0,
                others: 0,
              }}
              opacity={{
                active: 1,
                adjacent: 1,
                others: 1,
              }}
              autoPlay={false}
              autoPlayInterval={4000}
              showTitleMode="all"
              showPrice={false}
              showArrows={true}
              direction={collection.direction || 'rtl'}
              arrowColor="#000000FF"
            />
          </section>
        ))}

        <CategoryList categories={Categories} locale={locale} title={t('topics')} baseUrl={'magazine/'}/>

        {!query && (
          <MustReadSection title={t("MustRead")} items={mustReadItems} />
        )}

        <GalleryGrid
          sectionTitle={
            query ? t('searchResultsFor', { query }) : t('StayWithUs')
          }
          items={galleryItems}
          locale={locale}
        />
      </main>

      <Footer />
    </>
  );
}
