// RRenov/client/src/components/SeoHelmet.tsx
import { Helmet } from "react-helmet-async";

interface SeoHelmetProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
}

export default function SeoHelmet({
  title,
  description,
  keywords = "rénovation, aménagement de combles, gyproc, enduit, plafonnage, BTP, entrepreneur",
  url = window.location.href,
}: SeoHelmetProps) {
  const fullTitle = `${title} | Rommelaere Rénov`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/logo-rr.svg" /> 

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="/logo-rr.svg" /> 
    </Helmet>
  );
}
