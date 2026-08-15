/**
 * GTA6 Hub - AI Content Processor
 *
 * Reads fetched RSS items from cache/feeds.json,
 * processes them through Google Gemini API to generate
 * bilingual (Chinese + English) original articles,
 * and outputs JSON files to src/data/auto/
 *
 * Usage: node scripts/ai-process.js
 * Requires: GEMINI_API_KEY environment variable
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, 'cache');
const FEEDS_FILE = join(CACHE_DIR, 'feeds.json');
const OUTPUT_DIR = join(__dirname, '..', 'src', 'data', 'auto');
const PROCESSED_FILE = join(CACHE_DIR, 'processed-slugs.json');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set.');
  console.error('Get a free API key at: https://aistudio.google.com/app/apikey');
  console.error('Then run: export GEMINI_API_KEY=your_key_here');
  process.exit(1);
}

// Category mapping based on content keywords
const CATEGORY_KEYWORDS = {
  trailers: ['trailer', 'teaser', 'preview', 'footage', 'video', 'netflix', 'extended look'],
  gameplay: ['gameplay', 'feature', 'mechanic', 'combat', 'driving', 'weapon', 'system', 'multiplayer', 'online'],
  characters: ['character', 'lucia', 'jason', 'protagonist', 'npc', 'cast', 'voice actor', 'cal hampton'],
  guides: ['guide', 'tip', 'trick', 'walkthrough', 'how to', 'best', 'ranking', 'tier'],
  rumors: ['rumor', 'leak', 'rumour', 'speculation', 'reportedly', 'insider', 'claim', 'suggest'],
  news: [], // default
};

function inferCategory(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return cat;
  }
  return 'news';
}

function inferSourceType(sourceName, sourceType) {
  if (sourceType === 'official') return 'official';
  if (sourceType === 'community') return 'community';
  return 'media';
}

/**
 * Call Gemini API to generate bilingual article
 */
async function generateArticle(feedItem, attempt = 1) {
  const category = inferCategory(feedItem.title, feedItem.content);
  const sourceType = inferSourceType(feedItem.source, feedItem.sourceType);

  const prompt = `You are a professional gaming editor for "GTA6 Hub", a bilingual (Chinese/English) GTA6 news website.

Your task: Transform the following raw news item into TWO original, high-quality articles (one in Chinese, one in English).

## Source Material
- Title: ${feedItem.title}
- Source: ${feedItem.source} (${sourceType})
- Date: ${feedItem.pubDate}
- Content: ${feedItem.content.substring(0, 3000)}

## Requirements

### For the Chinese article (中文版):
1. Write an ORIGINAL article (800-1200 Chinese characters), NOT a direct translation
2. Add analysis, context, and background information about GTA6
3. Use engaging, professional gaming media tone
4. Include an "编辑观点" (Editor's Take) section at the end (100-150 characters)
5. If there are data points (dates, numbers, prices), present them clearly
6. Use Markdown formatting with headers (##), lists, and emphasis

### For the English article:
1. Write an ORIGINAL article (600-900 words)
2. Same content as Chinese version but naturally written for English readers
3. Include an "Editor's Take" section at the end (50-80 words)
4. Use Markdown formatting

### SEO Metadata (generate for both):
- title_zh: SEO-friendly Chinese title (under 40 characters, include "GTA6")
- title_en: SEO-friendly English title (under 60 characters, include "GTA6")
- description_zh: Chinese meta description (120-150 characters)
- description_en: English meta description (120-150 characters)
- tags: 3-5 relevant tags (in English, lowercase)
- slug: URL-friendly slug (English, kebab-case, under 60 chars, include "gta6")

### Source Classification:
- If the source is Rockstar Games official: sourceType = "official"
- If from a gaming media outlet: sourceType = "media"
- If from Reddit/community: sourceType = "community"
- If the content is speculative/unverified: sourceType = "rumor"

## Output Format (STRICT JSON)
Return ONLY a valid JSON object, no markdown code blocks, no extra text:

{
  "slug": "gta6-...",
  "category": "${category}",
  "sourceType": "${sourceType}",
  "source": "${feedItem.source}",
  "tags": ["tag1", "tag2", "tag3"],
  "title_zh": "...",
  "description_zh": "...",
  "content_zh": "## Markdown content here...",
  "title_en": "...",
  "description_en": "...",
  "content_en": "## Markdown content here..."
}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Retry on transient server errors only (503 high demand).
      // 429 = quota exhausted (free tier), retrying just burns more quota — skip instead.
      if (attempt < 3 && response.status === 503) {
        const waitMs = 5000 * attempt;
        console.log(`  [RETRY ${attempt}/3] Gemini returned ${response.status}, retrying in ${waitMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, waitMs));
        return generateArticle(feedItem, attempt + 1);
      }
      throw new Error(`Gemini API error ${response.status}: ${errorText.substring(0, 500)}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini API returned empty response');
    }

    // Parse JSON response (Gemini with responseMimeType should return clean JSON)
    let article;
    try {
      article = JSON.parse(text);
    } catch {
      // Fallback: try to extract JSON from text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        article = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse Gemini response as JSON');
      }
    }

    return article;
  } catch (err) {
    // Retry on transient network failures (e.g. proxy hiccup, "fetch failed")
    if (attempt < 3 && /fetch failed|network|ECONN|ETIMEDOUT|ENOTFOUND/i.test(err.message)) {
      const waitMs = 5000 * attempt;
      console.log(`  [RETRY ${attempt}/3] Network error: ${err.message.substring(0, 80)}, retrying in ${waitMs / 1000}s...`);
      await new Promise((r) => setTimeout(r, waitMs));
      return generateArticle(feedItem, attempt + 1);
    }
    throw err;
  }

}

/**
 * Save article as JSON files (one per language)
 */
function saveArticle(article, feedItem) {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const slug = article.slug || feedItem.slug;

  // Save Chinese version
  const zhArticle = {
    slug,
    title: article.title_zh,
    description: article.description_zh,
    date,
    author: 'GTA6 Hub 编辑组',
    category: article.category,
    tags: article.tags || [],
    image: slug,
    content: article.content_zh,
    featured: false,
    source: article.source || feedItem.source,
    sourceType: article.sourceType || 'media',
    lang: 'zh',
    autoGenerated: true,
  };

  // Save English version
  const enArticle = {
    slug,
    title: article.title_en,
    description: article.description_en,
    date,
    author: 'GTA6 Hub Editorial',
    category: article.category,
    tags: article.tags || [],
    image: slug,
    content: article.content_en,
    featured: false,
    source: article.source || feedItem.source,
    sourceType: article.sourceType || 'media',
    lang: 'en',
    autoGenerated: true,
  };

  const zhPath = join(OUTPUT_DIR, `${slug}.zh.json`);
  const enPath = join(OUTPUT_DIR, `${slug}.en.json`);

  writeFileSync(zhPath, JSON.stringify(zhArticle, null, 2));
  writeFileSync(enPath, JSON.stringify(enArticle, null, 2));

  return { zhPath, enPath };
}

/**
 * Mark slugs as processed
 */
function markProcessed(slugs) {
  let processed = [];
  if (existsSync(PROCESSED_FILE)) {
    try {
      processed = JSON.parse(readFileSync(PROCESSED_FILE, 'utf-8'));
    } catch {
      processed = [];
    }
  }
  processed.push(...slugs);
  writeFileSync(PROCESSED_FILE, JSON.stringify([...new Set(processed)], null, 2));
}

/**
 * Main processing function
 */
async function main() {
  console.log('=== GTA6 Hub AI Content Processor ===\n');

  if (!existsSync(FEEDS_FILE)) {
    console.error('No feeds file found. Run fetch-rss.js first.');
    process.exit(1);
  }

  // Cap how many items we process per run to stay within free-tier quota.
  // The free tier for some keys (e.g. OAuth tokens) is only ~20 requests/day.
  const MAX_ITEMS = parseInt(process.env.MAX_ITEMS || '6', 10);

  let feedItems = JSON.parse(readFileSync(FEEDS_FILE, 'utf-8'));

  if (feedItems.length === 0) {
    console.log('No new feeds to process.');
    process.exit(0);
  }

  if (feedItems.length > MAX_ITEMS) {
    console.log(
      `Note: capping to first ${MAX_ITEMS} items (of ${feedItems.length}) to protect free-tier quota. Set MAX_ITEMS to change.`
    );
    feedItems = feedItems.slice(0, MAX_ITEMS);
  }

  console.log(`Found ${feedItems.length} feed items to process.\n`);

  let success = 0;
  let failed = 0;
  const processedSlugs = [];

  for (let i = 0; i < feedItems.length; i++) {
    const item = feedItems[i];
    console.log(`[${i + 1}/${feedItems.length}] Processing: ${item.title.substring(0, 60)}...`);

    try {
      // Rate limit: wait between API calls (Gemini free tier: 15 req/min)
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }

      const article = await generateArticle(item);
      const paths = saveArticle(article, item);
      processedSlugs.push(article.slug || item.slug);

      console.log(`  [OK] Saved: ${paths.zhPath}`);
      console.log(`       ZH: ${article.title_zh}`);
      console.log(`       EN: ${article.title_en}`);
      success++;
    } catch (err) {
      console.error(`  [FAIL] ${err.message}`);
      failed++;
    }
  }

  // Mark processed slugs
  markProcessed(processedSlugs);

  console.log(`\n=== Summary ===`);
  console.log(`Processed: ${feedItems.length}`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  if (success > 0) {
    console.log(`\nNext step: Review generated articles in src/data/auto/`);
    console.log(`Then run: npm run build && npm run preview`);
  } else if (feedItems.length > 0) {
    // All items failed — exit non-zero so the workflow fails visibly
    // rather than silently "succeeding" with zero articles.
    console.error(
      `\n[ERROR] All ${feedItems.length} items failed to process. ` +
      `Check GEMINI_API_KEY and network connectivity to Google API.`
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
