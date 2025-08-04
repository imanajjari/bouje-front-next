// app/[locale]/magazine/[slug]/page.tsx
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import VideoPlayer from "../../../../components/common/VideoPlayer";
import AparatRawEmbed from "../../../../components/common/AparatRawEmbed";
import ArticleSchema from "../../../../components/magazine/seo/ArticleSchema";
import BreadcrumbSchema from "../../../../components/magazine/seo/BreadcrumbSchema";
import ReadingProgress from "../../../../components/magazine/ReadingProgress";
import CommentSection from "../../../../components/magazine/CommentSection";
import PopularCategories from "../../../../components/magazine/PopularCategories";
import NewsletterSubscription from "../../../../components/magazine/NewsletterSubscription";
import Header from "../../../../components/common/Header";
import Footer from "../../../../components/common/Footer";
import { transformBlogPost} from "../../../../utils/magazine/transformBlogPost";
import { fetchBlogPostBySlug, fetchBlogPosts } from "../../../../services/magazine/magazineService";



// Enhanced metadata generation with complete SEO optimization
export async function generateMetadata(context) {
  const params = await context.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'magazineDetail' });
  
  // In production, fetch actual article data
  const article = await getArticleData(params.slug, params.locale);
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
  const articleUrl = `${baseUrl}/${params.locale}/magazine/${params.slug}`;
  
  return {
    title: `${article.title} | ${t('siteName')}`,
    description: article.excerpt,
    keywords: article.tags?.join(', '),
    authors: [{ name: article.author.name }],
    creator: article.author.name,
    publisher: t('siteName'),
    category: article.category,
    
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      siteName: t('siteName'),
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
        {
          url: article.featuredImage,
          width: 1080,
          height: 1080,
          alt: article.title,
        }
      ],
      locale: params.locale,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category,
      tags: article.tags,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
      creator: `@${article.author.twitter || 'yourhandle'}`,
    },
    
    alternates: {
      canonical: articleUrl,
      languages: {
        'en': `${baseUrl}/en/magazine/${params.slug}`,
        'fa': `${baseUrl}/fa/magazine/${params.slug}`,
      },
    },
    
    other: {
      'article:published_time': article.publishedAt,
      'article:modified_time': article.updatedAt,
      'article:section': article.category,
      'article:tag': article.tags?.join(','),
    },
  };
}

// Generate static params for better performance
export async function generateStaticParams() {
  // In production, fetch all article slugs from your CMS/database
  const articles = await getAllArticleSlugs();
  
  return articles.map((article) => ({
    slug: article.slug,
  }));
}



async function getArticleData(slug, locale) {
  const raw = await fetchBlogPostBySlug(slug);
  return transformBlogPost(raw, locale);
}

async function getAllArticleSlugs() {
  const posts = await fetchBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function MagazineDetailPage(context) {
  const params = await context.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'magazineDetail' });
  const article = await getArticleData(params.slug, params.locale);


  if (!article) {
    notFound();
  }

  const breadcrumbItems = [
    { name: t('home'), url: `/${params.locale}` },
    { name: t('magazine'), url: `/${params.locale}/magazine` },
    { name: article.category, url: `/${params.locale}/magazine/category/${article?.mainCategory?.toLowerCase()}` },
    { name: article.title, url: `/${params.locale}/magazine/${params.slug}` }
  ];

  const isRTL = params.locale === 'fa';

  return (
    <>
    <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
      {/* Structured Data */}
      <ArticleSchema article={article} locale={params.locale} />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Reading Progress Indicator */}
      <ReadingProgress />
      
      <article 
        className={`max-w-4xl mx-auto px-4 py-8 lg:py-12 ${isRTL ? 'text-right' : 'text-left'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Breadcrumb Navigation */}
        {/* <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className={`mx-2 ${isRTL ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {index === breadcrumbItems.length - 1 ? (
                  <span className="font-medium text-gray-900">{item.name}</span>
                ) : (
                  <Link href={item.url} className="hover:text-gray-900 transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav> */}

        {/* Article Header */}
        <header className="mb-8">
          {article.mainCategory &&
          <div className="mb-4">
            <Link 
              href={`/${params.locale}/magazine/category/${article.categories[0]?.slug}`}
              className="inline-block px-3 py-1 text-xs font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
              >
              {article.mainCategory}
            </Link>
          </div>
            }
          
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900">
            {article.title}
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-6">
            {article.summary}
          </p>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString(params.locale === 'fa' ? 'fa-IR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {/* <span>•</span>
            <span>{article.views} {t('viewsRead')}</span>
            <span>•</span> */}
            {/* <span>{article.likes} {t('likes')}</span>
            <span>•</span>
            <span>{article.shares} {t('shares')}</span> */}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags?.map((tag) => (
              <Link
                key={tag}
                href={`/${params.locale}/magazine/tag/${tag.toLowerCase()}`}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
   
            {/* Video Section */}
            {article.videoAparat && (
  <div className="mb-8">
    <AparatRawEmbed html={article.videoAparat} />
  </div>
)}

            {/* Article Content */}
            <div 
              className="prose prose-lg prose-gray max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Image Gallery */}
            {article.gallery && article.gallery.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">{t('gallery')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {article.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Section */}
            <CommentSection articleId={article.id} locale={params.locale} />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Newsletter Subscription */}
              <NewsletterSubscription locale={params.locale} />
              
              
              {/* Popular Tags */}
              <PopularCategories />
              
            </div>
          </aside>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-4">
            {/* <p>{t('details.footerNote')}</p> */}
            <p className="mt-2">
              {t('lastUpdated')}: {new Date(article.updatedAt).toLocaleDateString(params.locale === 'fa' ? 'fa-IR' : 'en-US')}
            </p>
          </div>
          
          {/* Legal/Copyright */}
          {/* <div className="text-xs text-gray-400">
            <p>© 2025 {t('siteName')}. {t('allRightsReserved')}</p>
          </div> */}
        </footer>
      </article>

      {/* Structured Data for FAQ if applicable */}
      {/* Add FAQ schema here if your articles contain FAQs */}
      <Footer />
    </>
  );
}