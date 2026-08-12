import type { APIRoute } from 'astro';
import { articles, categories, siteConfig } from '@data/articles';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { url: `${baseUrl}/news`, priority: '0.9', changefreq: 'daily' },
    { url: `${baseUrl}/about`, priority: '0.5', changefreq: 'monthly' },
    { url: `${baseUrl}/privacy`, priority: '0.3', changefreq: 'yearly' },
  ];

  // Category pages
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  // Article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: article.updated || article.date,
  }));

  const allPages = [...staticPages, ...categoryPages, ...articlePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
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
