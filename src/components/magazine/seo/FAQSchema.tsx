// components/seo/FAQSchema.tsx (if your articles contain FAQs)
interface FAQ {
    question: string;
    answer: string;
  }
  
  interface FAQSchemaProps {
    faqs: FAQ[];
  }
  
  export default function FAQSchema({ faqs }: FAQSchemaProps) {
    if (!faqs || faqs.length === 0) return null;
  
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }