import { useTranslations } from "next-intl";

interface StructuredDataProps {
  type: "website" | "webapp" | "product" | "faq";
  locale: string;
}

export default function StructuredData({ type, locale }: StructuredDataProps) {
  const t = useTranslations();
  const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://freeqwenimage.com";

  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Free Qwen Image",
    "alternateName": "Qwen Image",
    "url": siteUrl,
    "description": t("metadata.description"),
    "inLanguage": locale,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Free Qwen Image",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
        "width": 512,
        "height": 512
      }
    }
  });

  const generateWebAppSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Qwen Image",
    "description": t("metadata.description"),
    "url": siteUrl,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "AI Image Generation",
      "Text to Image",
      "Free to Use",
      "High Quality Output",
      "Multi-language Support"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "2.6.0",
    "creator": {
      "@type": "Organization",
      "name": "Free Qwen Image"
    }
  });

  const generateProductSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Free Qwen Image - AI Image Generator",
    "description": t("metadata.description"),
    "brand": {
      "@type": "Brand",
      "name": "Free Qwen Image"
    },
    "category": "AI Software",
    "image": `${siteUrl}/og-image.jpg`,
    "url": siteUrl,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  });

  const generateFAQSchema = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Free Qwen Image?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Free Qwen Image is a powerful AI image generator based on the Qwen model that creates high-quality images from text descriptions."
        }
      },
      {
        "@type": "Question", 
        "name": "Is Free Qwen Image really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Free Qwen Image offers free image generation with basic features. Premium plans are available for advanced features and higher usage limits."
        }
      },
      {
        "@type": "Question",
        "name": "What image formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Free Qwen Image supports common image formats including PNG, JPEG, and WebP. All images are generated in high quality."
        }
      }
    ]
  });

  let schema;
  
  switch (type) {
    case "website":
      schema = generateWebsiteSchema();
      break;
    case "webapp":
      schema = generateWebAppSchema();
      break;
    case "product":
      schema = generateProductSchema();
      break;
    case "faq":
      schema = generateFAQSchema();
      break;
    default:
      schema = generateWebsiteSchema();
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}