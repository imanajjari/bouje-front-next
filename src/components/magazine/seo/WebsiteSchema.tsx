// components/seo/WebsiteSchema.tsx (optional, for homepage)
interface WebsiteSchemaProps {
    siteName: string;
    siteUrl: string;
    description: string;
    locale: string;
  }
  
  export default function WebsiteSchema({ siteName, siteUrl, description, locale }: WebsiteSchemaProps) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "description": description,
      "url": siteUrl,
      "inLanguage": locale,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/images/logo.png`
        }
      }
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }