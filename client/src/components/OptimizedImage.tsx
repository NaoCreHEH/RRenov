import { ImgHTMLAttributes } from "react";
import OptimizeImage from "./OptimizedImage";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string;
  lazy?: boolean;
  width?: number;
  height?: number;
}

/**
 * Composant OptimizedImage
 * - Utilise WebP si disponible, sinon fallback sur l'image originale
 * - Lazy loading par défaut
 * - Responsive et accessible
 * - Améliore les Core Web Vitals
 */
export default function OptimizedImage({
  src,
  alt,
  webpSrc,
  lazy = true,
  width,
  height,
  className = "",
  ...props
}: OptimizedImageProps) {
  // Générer automatiquement le chemin WebP si non fourni
  const autoWebpSrc = webpSrc || src.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  
  // Déterminer si on doit utiliser le chemin optimisé
  const useOptimized = src.startsWith("/") && !src.includes("/optimized/");
  const finalWebpSrc = useOptimized ? `/optimized${autoWebpSrc}` : autoWebpSrc;
  const finalSrc = useOptimized ? `/optimized${src}` : src;

  return (
    <picture>
      {/* WebP pour les navigateurs modernes */}
      <source
        srcSet={finalWebpSrc}
        type="image/webp"
        media="(min-width: 0px)"
      />
      {/* Fallback sur l'image originale */}
      <OptimizedImage
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        className={className}
        {...props}
        lazy
      />
    </picture>
  );
}
