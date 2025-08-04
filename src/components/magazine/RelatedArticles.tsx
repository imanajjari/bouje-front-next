// components/magazine/RelatedArticles.tsx
import Image from 'next/image';
import Link from 'next/link';

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  locale: string;
}

export default function RelatedArticles({ articles, locale }: RelatedArticlesProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Related Articles</h3>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${locale}/magazine/${article.slug}`}
            className="block group"
          >
            <div className="flex gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">{article.category}</p>
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                  {article.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}