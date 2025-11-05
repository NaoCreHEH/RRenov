import { Router, Request, Response } from "express";

/**
 * Middleware SEO pour Express
 * - Sitemap.xml
 * - Robots.txt
 * - Meta tags dynamiques côté serveur
 */

export const seoRouter = Router();

// Sitemap.xml
seoRouter.get("/sitemap.xml", (req: Request, res: Response) => {
  const baseUrl = process.env.VITE_APP_DOMAIN || "https://rommelaere-renov.be";

  const pages = [
    { url: "/", priority: 1.0, changefreq: "weekly" },
    { url: "/services", priority: 0.8, changefreq: "monthly" },
    { url: "/projects", priority: 0.8, changefreq: "weekly" },
    { url: "/about", priority: 0.7, changefreq: "monthly" },
    { url: "/testimonials", priority: 0.7, changefreq: "weekly" },
    { url: "/contact", priority: 0.9, changefreq: "monthly" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});

// Robots.txt
seoRouter.get("/robots.txt", (req: Request, res: Response) => {
  const baseUrl = process.env.VITE_APP_DOMAIN || "https://rommelaere-renov.com";

  const robots = `# Robots.txt for Rommelaere Rénov
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /.well-known

# Crawl delay
Crawl-delay: 1

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Google Search Console
User-agent: Googlebot
Allow: /

# Bing
User-agent: Bingbot
Allow: /`;

  res.header("Content-Type", "text/plain");
  res.send(robots);
});

// Security headers pour SEO et sécurité
export function seoSecurityHeaders(req: Request, res: Response, next: Function) {
  // Sécurité
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Performance
  res.setHeader("Cache-Control", "public, max-age=3600");

  // CSP (Content Security Policy)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.manus.im"
  );

  next();
}

// Redirect HTTP to HTTPS (si en production)
export function httpsRedirect(req: Request, res: Response, next: Function) {
  if (process.env.NODE_ENV === "production" && req.header("x-forwarded-proto") !== "https") {
    res.redirect(301, `https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
}

// Compression middleware pour les images WebP
export function imageCompressionHeaders(req: Request, res: Response, next: Function) {
  if (req.path.endsWith(".webp")) {
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  next();
}
