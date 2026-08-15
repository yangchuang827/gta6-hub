/**
 * GTA6 Hub - Title Similarity Utilities
 *
 * Uses character bigrams (works for both Chinese and English, which word-level
 * tokenization fails at). Shared by scripts/fetch-rss.js (dedup before
 * processing) and scripts/dedupe-articles.js (cleanup of duplicates).
 */

export function normalizeTitle(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Character bigrams of a normalized title (no spaces).
 * Titles shorter than 4 chars produce no grams → similarity 0 (never flagged).
 */
export function charBigrams(text) {
  const norm = normalizeTitle(text).replace(/\s+/g, '');
  if (norm.length < 4) return new Set();
  const grams = new Set();
  for (let i = 0; i < norm.length - 1; i++) {
    grams.add(norm.slice(i, i + 2));
  }
  return grams;
}

/**
 * Jaccard similarity of two titles based on character bigram sets.
 * 0 = totally different, 1 = identical.
 */
export function titleSimilarity(a, b) {
  const ga = charBigrams(a);
  const gb = charBigrams(b);
  if (ga.size === 0 || gb.size === 0) return 0;
  let inter = 0;
  for (const g of ga) if (gb.has(g)) inter++;
  return inter / new Set([...ga, ...gb]).size;
}

export const SIMILARITY_THRESHOLD = 0.45; // above this → same story
