import type { APIRoute } from 'astro';
import { articles, siteConfig } from '@data/articles';

export const GET: APIRoute = ({ site }) => {
  const items = articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((article) => ({
      title: article.title,
      description: article.description,
      link: `${siteConfig.url}/news/${article.slug}`,
      pubDate: new Date(article.date).toUTCString(),
      guid: `${siteConfig.url}/news/${article.slug}`,
      category: article.category,
    }))
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <description>${siteConfig.description}</description>
    <link>${siteConfig.url}</link>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items
      .split('')
      .map(() => '')
      .join('')}
    ${articles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((article) => `    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.description}]]></description>
      <link>${siteConfig.url}/news/${article.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/news/${article.slug}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <category>${article.category}</category>
    </item>`)
      .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
