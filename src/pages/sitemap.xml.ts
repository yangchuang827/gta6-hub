import type { APIRoute } from 'astro';
import { getArticles, categories, siteConfig } from '@data/articles';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = siteConfig.url;
  const zhArticles = getArticles('zh');
  const enArticles = getArticles('en');
  const articleSlugs = [...new Set([...zhArticles.map(a => a.slug), ...enArticles.map(a => a.slug)])];

  const staticPages = [
    { zhPath: '/', enPath: '/en/', priority: '1.0', changefreq: 'daily' },
    { zhPath: '/news', enPath: '/en/news', priority: '0.9', changefreq: 'daily' },
    { zhPath: '/about', enPath: '/en/about', priority: '0.5', changefreq: 'monthly' },
    { zhPath: '/privacy', enPath: '/en/privacy', priority: '0.3', changefreq: 'yearly' },
  ];

  const categoryPages = categories.map((cat) => ({
    zhPath: `/category/${cat.slug}`,
    enPath: `/en/category/${cat.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const articlePages = articleSlugs.map((slug) => {
    const article = zhArticles.find(a => a.slug === slug) || enArticles.find(a => a.slug === slug);
    return {
      zhPath: `/news/${slug}`,
      enPath: `/en/news/${slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: article?.updated || article?.date || new Date().toISOString().split('T')[0],
    };
  });

  const allPages = [...staticPages, ...categoryPages, ...articlePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages
  .map(
    (page) => {
      const zhUrl = `${baseUrl}${page.zhPath}`;
      const enUrl = `${baseUrl}${page.enPath}`;
      const lastmod = page.lastmod || new Date().toISOString().split('T')[0];
      return `  <url>
    <loc>${zhUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="zh" href="${zhUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${zhUrl}"/>
  </url>
  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="zh" href="${zhUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${zhUrl}"/>
  </url>`;
    }
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
