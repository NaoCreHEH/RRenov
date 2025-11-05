import { Helmet } from "react-helmet-async";

interface SeoHelmetProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: "website" | "article" | "business";
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  structuredData?: Record<string, any>;
}

/**
 * SeoHelmet Optimisé
 * - Meta tags complets pour SEO
 * - Open Graph pour les réseaux sociaux
 * - Twitter Card
 * - Structured Data (JSON-LD)
 * - Canonical URLs
 */
export default function SeoHelmet({
  title,
  description,
  keywords = "rénovation, aménagement de combles, gyproc, enduit, plafonnage, BTP, entrepreneur, Belgique",
  url = typeof window !== "undefined" ? window.location.href : "",
  image = "/optimized/EDES.webp",
  type = "website",
  author,
  publishedDate,
  modifiedDate,
  structuredData,
}: SeoHelmetProps) {
  const fullTitle = `${title} | Rommelaere Rénov`;
  const siteUrl = "https://rommelaere-renov.com"; // À remplacer par votre domaine

  // Structured Data par défaut (Entreprise)
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Rommelaere Rénov",
    description: "Spécialiste en aménagement de combles, Gyproc, enduit et retouche sur plafonnage",
    url: siteUrl,
    logo: `${siteUrl}/optimized/EDES.webp`,
    image: image,
    address: {
      "@type": "PostalAddress",
      streetAddress: "À compléter",
      addressLocality: "À compléter",
      postalCode: "À compléter",
      addressCountry: "BE",
    },
    telephone: "À compléter",
    email: "À compléter",
    sameAs: [
      "https://www.facebook.com/people/Rommelaere-Renov/100064883967078/",
    ],
    priceRange: "€€",
    areaServed: "BE",
    knowsAbout: [
      "Aménagement de combles",
      "Gyproc",
      "Enduit",
      "Retouche sur plafonnage",
      "Rénovation",
    ],
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Titre et description */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || "Rommelaere Rénov"} />

      {/* Viewport et charset */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={url || siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Rommelaere Rénov" />
      <meta property="og:locale" content="fr_BE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || siteUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article metadata (si applicable) */}
      {publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}

      {/* Robots et indexation */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Preconnect pour les ressources externes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
    </Helmet>
  );
}
