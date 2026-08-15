/**
 * GTA6 Hub - RSS News Fetcher
 *
 * Fetches GTA6-related news from multiple RSS sources,
 * deduplicates against previously processed items,
 * and outputs new items to scripts/cache/feeds.json
 *
 * Usage: node scripts/fetch-rss.js
 */

import RSSParser from 'rss-parser';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, 'cache');
const FEEDS_FILE = join(CACHE_DIR, 'feeds.json');
const PROCESSED_FILE = join(CACHE_DIR, 'processed-slugs.json');

const parser = new RSSParser({
  timeout: 15000,
  headers: {
    'User-Agent': 'GTA6Hub-Bot/1.0 (news aggregator)',
  },
});

// RSS sources - English gaming news that may contain GTA6 content
const RSS_SOURCES = [
  {
    name: 'Rockstar Newswire',
    url: 'https://www.rockstargames.com/newswire/feed.xml',
    type: 'official',
    priority: 'P0',
    // Official Rockstar feed - all articles are relevant
    filter: null,
  },
  {
    name: 'Reddit r/GTA6',
    url: 'https://www.reddit.com/r/GTA6/.rss',
    type: 'community',
    priority: 'P1',
    filter: null,
  },
  {
    name: 'IGN Games',
    url: 'https://feeds.ign.com/ign/games-all',
    type: 'media',
    priority: 'P0',
    filter: ['gta 6', 'gta6', 'grand theft auto vi', 'grand theft auto 6', 'rockstar'],
  },
  {
    name: 'GameRant',
    url: 'https://gamerant.com/feed/',
    type: 'media',
    priority: 'P1',
    filter: ['gta 6', 'gta6', 'grand theft auto vi', 'grand theft auto 6', 'rockstar'],
  },
  {
    name: 'Polygon',
    url: 'https://www.polygon.com/rss/index.xml',
    type: 'media',
    priority: 'P1',
    filter: ['gta 6', 'gta6', 'grand theft auto vi', 'grand theft auto 6', 'rockstar'],
  },
  {
    name: 'Eurogamer',
    url: 'https://www.eurogamer.net/feed',
    type: 'media',
    priority: 'P1',
    filter: ['gta 6', 'gta6', 'grand theft auto vi', 'grand theft auto 6', 'rockstar'],
  },
  {
    name: 'Push Square',
    url: 'https://www.pushsquare.com/feeds/news',
    type: 'media',
    priority: 'P2',
    filter: ['gta 6', 'gta6', 'grand theft auto vi', 'grand theft auto 6', 'rockstar'],
  },
];

// Keywords for GTA6 relevance filtering
const GTA6_KEYWORDS = [
  'gta 6', 'gta6', 'gta vi', 'gtavi',
  'grand theft auto vi', 'grand theft auto 6',
  'rockstar games', 'rockstar',
  'vice city', 'leonida',
  'jason and lucia', 'lucia gta',
];

/**
 * Check if an article title/content is GTA6-related
 */
function isGTA6Related(item, filterKeywords) {
  const text = `${item.title || ''} ${item.contentSnippet || item.content || ''}`.toLowerCase();

  // If source has specific filter keywords, use those
  if (filterKeywords) {
    return filterKeywords.some((kw) => text.includes(kw));
  }

  // Otherwise use global GTA6 keywords
  return GTA6_KEYWORDS.some((kw) => text.includes(kw));
}

/**
 * Generate a slug from a title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

import { titleSimilarity, SIMILARITY_THRESHOLD } from './title-sim.js';

// ---------------------------------------------------------------------------
// Title-similarity dedup: two items with near-identical titles describe the
// same story (esp. common on Reddit where the same topic gets re-posted).
// ---------------------------------------------------------------------------

/**
 * Load titles of already-generated articles (from src/data/auto/*.zh.json)
 * so we can skip news whose story has already been published.
 */
function loadExistingTitles() {
  const AUTO_DIR = join(__dirname, '..', 'src', 'data', 'auto');
  const titles = [];
  if (!existsSync(AUTO_DIR)) return titles;
  for (const f of readdirSync(AUTO_DIR)) {
    if (!f.endsWith('.zh.json')) continue;
    try {
      const data = JSON.parse(readFileSync(join(AUTO_DIR, f), 'utf-8'));
      if (data.title) titles.push(data.title);
    } catch {
      // skip unparseable file
    }
  }
  return titles;
}

/**
 * Load previously processed slugs
 */
function loadProcessedSlugs() {
  if (existsSync(PROCESSED_FILE)) {
    try {
      return new Set(JSON.parse(readFileSync(PROCESSED_FILE, 'utf-8')));
    } catch {
      return new Set();
    }
  }
  return new Set();
}

/**
 * Fetch a single RSS feed with error handling
 */
async function fetchFeed(source) {
  try {
    console.log(`  Fetching: ${source.name}...`);
    const feed = await parser.parseURL(source.url);

    const items = (feed.items || [])
      .filter((item) => isGTA6Related(item, source.filter))
      .map((item) => ({
        title: item.title?.trim() || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        content: item.contentSnippet || item.content || item.summary || '',
        author: item.creator || item.author || source.name,
        categories: item.categories || [],
        source: source.name,
        sourceType: source.type,
        sourcePriority: source.priority,
      }))
      .filter((item) => item.title !== 'Untitled' && item.content.length > 50);

    console.log(`    Found ${items.length} GTA6-related items (out of ${feed.items?.length || 0} total)`);
    return items;
  } catch (err) {
    console.error(`    [ERROR] Failed to fetch ${source.name}: ${err.message}`);
    return [];
  }
}

/**
 * Main fetch function
 */
async function main() {
  console.log('=== GTA6 Hub RSS Fetcher ===\n');

  // Ensure cache directory exists
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }

  const processedSlugs = loadProcessedSlugs();
  console.log(`Previously processed: ${processedSlugs.size} articles\n`);

  // Titles of already-published articles → skip stories we've already covered
  const existingTitles = loadExistingTitles();
  console.log(`Existing articles on site: ${existingTitles.length}\n`);

  // Fetch all feeds in parallel
  console.log('Fetching RSS feeds...\n');
  const feedPromises = RSS_SOURCES.map((source) => fetchFeed(source));
  const feedResults = await Promise.allSettled(feedPromises);

  // Collect all new items
  const allItems = [];
  const seenLinks = new Set();

  for (const result of feedResults) {
    if (result.status !== 'fulfilled') continue;
    for (const item of result.value) {
      // Deduplicate by link
      if (item.link && seenLinks.has(item.link)) continue;
      if (item.link) seenLinks.add(item.link);

      // Generate slug and check if already processed
      const slug = generateSlug(item.title);
      if (processedSlugs.has(slug)) continue;

      // Skip stories whose title is too similar to an already-published article
      if (existingTitles.some((t) => titleSimilarity(item.title, t) >= SIMILARITY_THRESHOLD)) {
        continue;
      }

      allItems.push({
        ...item,
        slug,
      });
    }
  }

  // Deduplicate within this batch: if two fetched items tell the same story,
  // keep only the one from the higher-priority source (P0 > P1 > P2).
  const uniqueItems = [];
  for (const item of allItems) {
    const dup = uniqueItems.find((u) => titleSimilarity(u.title, item.title) >= SIMILARITY_THRESHOLD);
    if (dup) {
      const dupRank = dup.sourcePriority || 'P9';
      const itemRank = item.sourcePriority || 'P9';
      if (itemRank < dupRank) {
        // new item is from a better source → replace the duplicate
        uniqueItems.splice(uniqueItems.indexOf(dup), 1);
        uniqueItems.push(item);
      }
      continue;
    }
    uniqueItems.push(item);
  }

  // Source quota: cap low-value community sources so media/editorial sources dominate
  const SOURCE_QUOTA = { 'Reddit r/GTA6': 2 };
  const sourceCounts = {};
  const quotaItems = [];
  for (const item of uniqueItems) {
    const quota = SOURCE_QUOTA[item.source];
    const used = sourceCounts[item.source] || 0;
    if (quota !== undefined && used >= quota) continue;
    sourceCounts[item.source] = used + 1;
    quotaItems.push(item);
  }

  // Sort by date (newest first)
  quotaItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Limit to 20 items per run to avoid API rate limits
  const newItems = quotaItems.slice(0, 20);

  console.log(`\n=== Summary ===`);
  console.log(`Total GTA6 items found: ${allItems.length}`);
  console.log(`After same-batch dedup: ${uniqueItems.length}`);
  console.log(`After source quota: ${quotaItems.length}`);
  console.log(`New items (not yet processed): ${newItems.length}`);
  console.log(`Output: ${FEEDS_FILE}`);

  // Write only the NEW items to feeds.json for ai-process.js to consume.
  // IMPORTANT: Do NOT mark items as processed here. They are only marked
  // after ai-process.js successfully generates an article (see markProcessed).
  // Marking them early would "eat" the news if the AI step fails.
  writeFileSync(FEEDS_FILE, JSON.stringify(newItems, null, 2));

  console.log(`\nNext step: Run ai-process.js to generate articles from these feeds.`);

  return newItems.length;
}

main()
  .then((count) => {
    process.exit(count > 0 ? 0 : 0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
