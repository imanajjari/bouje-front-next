// src/app/[locale]/page.js
export const revalidate = 300;
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import PromoBanner from "../../components/home/PromoBanner";
import ProductCarousel from "../../components/home/ProductCarousel";
import BrandServicesSection from "../../components/BrandServices/BrandServicesSection";
import { mapCollectionsToCarousel } from "../../utils/home/mapCollectionsToCarousel";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { homeService } from "../../services/home/homeService";



export async function generateMetadata(context) {
  const { locale } = await context.params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("home-title") || "خانه | فروشگاه بُوژ",
    description:
      t("home-description") ||
      "محصولات خاص و کالکشن‌های ویژه را با بهترین قیمت از فروشگاه ما ببینید.",
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title: t("home-title") || "خانه | فروشگاه بُوژ",
      description:
        t("home-description") ||
        "محصولات خاص و کالکشن‌های ویژه را با بهترین قیمت از فروشگاه ما ببینید.",
      images: [
        {
          url: "/images/og-image.jpg", // 👈 عکس OG یا hero.image؟
          width: 1200,
          height: 630,
          alt: "صفحه اصلی فروشگاه",
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}


export default async function Home(context) {
  const { locale } = await context.params;
  const t = await getTranslations({ locale, namespace: "home" });

  const [
    banners,
    blogServices,
    collections,
    featureBlocks,
    categoryBanners,
  ] = await Promise.all([
    homeService.getBanners(),
    homeService.getServices(),
    homeService.getCollections(),
    homeService.getFeatureBlocks(),
    homeService.getCategoryBanners(),
  ]);

  const hero = banners?.[0]
    ? banners[0]
    : {
        image: "/images/placeholder-hero.webp",
        title: "",
        link: "",
      };

  const categories = (categoryBanners ?? [])
    .slice(0, 3)
    .map((item, i) => ({
      id: item.id ?? i,
      image: item.image || null,
      slug:
        item.category?.slug ??
        item.category_slug ??
        item.slug ??
        "",
      name:
        item.category?.name ??
        item.category_name ??
        item.name ??
        "",
    }))
    .filter((c) => c.slug);

  const suggestedProducts = mapCollectionsToCarousel(collections, locale, 8);

  const truncateText = (text, maxLength = 80) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const serviceItems =
    blogServices?.map((s) => ({
      mediaType: s.blog_post.file ? "video" : "image",
      mediaSrc: s.blog_post.media,
      title: s.blog_post.title,
      description: truncateText(s.blog_post.summary),
      ctaText: t("read-more"),
      ctaHref: `/${locale}/blog/${s.blog_post.slug}`,
    })) ?? [];


    const fallbackCategories = [
      { slug: "men", label: t("category-men") },
      { slug: "women", label: t("category-women") },
      { slug: "accessories", label: t("category-accessories") },
    ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header logoAnimation iconColor="#FFFFFFFF" stickOnScrollOnly={false}/>

      {/* Hero */}
      <section className="relative w-full h-[100vh]">
        {hero.image && (
          <Image
            src={hero.image}
            alt={t("hero-alt") || "بنر اصلی"}
            fill
            className="object-cover bg-black"
            priority
          />
        )}
        {(hero.title || hero.link) && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center space-y-10">
            {hero.title && (
              <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
                {hero.title}
              </h1>
            )}
            {typeof hero.link === "string" && hero.link && (
              <Link
              href={`/${locale}${hero.link}`}
                className="bg-white text-black px-6 py-3 text-sm font-semibold shadow-lg rounded-none hover:bg-gray-100 transition"
              >
                {t("view-button")}
              </Link>
            )}
          </div>
        )}
      </section>

      {/* دسته‌بندی‌ها */}
      <section className="py-16 px-8 sm:px-20">
        <h2 className="text-2xl font-semibold mb-12 text-center text-black tracking-wider">
          {t("category")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categories.length
            ? categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/products?category=${cat.name}`}
                  className="relative group"
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={`دسته ${cat.name}`}
                      width={400}
                      height={400}
                      className="object-cover w-full h-[300px]"
                    />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white text-xl font-semibold">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))
            : fallbackCategories.map(({ slug, label }) => (
              <Link
                key={slug}
                href={`/${locale}/products?category=${slug}`}
                className="relative group"
              >
                <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
                  <span className="text-white text-xl">{label}</span>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* محصولات پیشنهادی */}
      <section className="py-16">
        <h2 className="text-center mb-5 text-2xl">{t("suggestions")}</h2>
        {suggestedProducts.length > 0 && (
          <ProductCarousel
            products={suggestedProducts}
            slidesPerView={{ default: 1.5, spacing: 10 }}
            breakpoints={{
              "(min-width: 768px)": { perView: 2.5, spacing: 40 },
              "(min-width: 1024px)": { perView: 2.5, spacing: 60 },
            }}
            blur={{ active: 0, adjacent: 0, others: 0 }}
            opacity={{ active: 1, adjacent: 0.4, others: 0.1 }}
            autoPlay
            autoPlayInterval={4000}
            showTitleMode="active"
            showPrice={false}
            showArrows={false}
          />
        )}
      </section>

      {/* بنرهای تبلیغاتی */}
      <div className="flex flex-col lg:flex-row gap-2 p-3">
        {(featureBlocks.length ? featureBlocks.slice(0, 2) : []).map((fb) => (
          <PromoBanner
            key={fb.id}
            imageSrc={fb.image}
            tag={fb.subtitle}
            title={fb.title}
            buttonText={fb.button_text}
            href={`/${locale}${fb.link}`}
          />
        ))}
      </div>

      {/* خدمات/بلاگ برند */}
      {serviceItems.length > 0 && (
        <BrandServicesSection
          sectionTitle={t("bouje-blog")}
          items={serviceItems}
        />
      )}

      <Footer />
    </div>
  );
}
