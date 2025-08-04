// components/seo/ArticleSchema.tsx
interface Article {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    category: string;
    tags?: string[];
    author: {
      id: string;
      name: string;
      bio: string;
      avatar: string;
    };
    publishedAt: string;
    updatedAt: string;
    readingTime: number;
  }
  
  interface ArticleSchemaProps {
    article: Article;
    locale: string;
  }
  
  export default function ArticleSchema({ article, locale }: ArticleSchemaProps) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt,
      "image": [
        `${baseUrl}${article.featuredImage}`,
        // Additional image formats for better SEO
        `${baseUrl}${article.featuredImage.replace('.webp', '-1x1.webp')}`,
        `${baseUrl}${article.featuredImage.replace('.webp', '-4x3.webp')}`,
        `${baseUrl}${article.featuredImage.replace('.webp', '-16x9.webp')}`
      ],
      "author": {
        "@type": "Person",
        "name": article.author.name,
        "description": article.author.bio,
        "image": `${baseUrl}${article.author.avatar}`,
        "url": `${baseUrl}/${locale}/authors/${article.author.id}`
      },
      "publisher": {
        "@type": "Organization",
        "name": "Your Magazine Name",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/images/logo.png`,
          "width": 600,
          "height": 60
        }
      },
      "datePublished": article.publishedAt,
      "dateModified": article.updatedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/${locale}/magazine/${article.id}`
      },
      "articleSection": article.category,
      "keywords": article.tags?.join(", "),
      "wordCount": article.content.replace(/<[^>]*>/g, '').split(' ').length,
      "timeRequired": `PT${article.readingTime}M`,
      "inLanguage": locale,
      "isAccessibleForFree": true,
      "creativeWorkStatus": "Published"
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }