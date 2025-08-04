// components/seo/OrganizationSchema.tsx (for about page or footer)
interface OrganizationSchemaProps {
    name: string;
    url: string;
    description: string;
    logo: string;
    contactPoint?: {
      telephone: string;
      contactType: string;
      email: string;
    };
    sameAs?: string[];
  }
  
  export default function OrganizationSchema({ 
    name, 
    url, 
    description, 
    logo, 
    contactPoint, 
    sameAs 
  }: OrganizationSchemaProps) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": name,
      "description": description,
      "url": url,
      "logo": {
        "@type": "ImageObject",
        "url": logo
      },
      ...(contactPoint && {
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": contactPoint.telephone,
          "contactType": contactPoint.contactType,
          "email": contactPoint.email
        }
      }),
      ...(sameAs && { "sameAs": sameAs })
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }