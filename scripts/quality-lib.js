/**
 * GTA6 Hub - Shared Quality Check Library
 *
 * Single source of truth for article quality rules, used by both:
 *  - scripts/quality-check.js  (standalone CLI gate, --delete-failed mode)
 *  - scripts/ai-process.js     (inline self-heal loop: regenerate on reject)
 */

export const REQUIRED_FIELDS = ['slug', 'title', 'description', 'date', 'category', 'content', 'lang'];
export const VALID_CATEGORIES = ['news', 'trailers', 'gameplay', 'characters', 'guides', 'rumors'];
export const VALID_LANGS = ['zh', 'en'];
export const VALID_SOURCE_TYPES = ['official', 'media', 'community', 'rumor'];

// Minimum content lengths
export const MIN_ZH_CONTENT = 400; // Chinese characters
export const MIN_EN_CONTENT = 300; // English words
export const MIN_TITLE_LEN = 10;
export const MAX_TITLE_LEN = 80;
export const MIN_DESC_LEN = 50;
export const MAX_DESC_LEN = 200;

// Placeholder / hallucination markers that indicate the AI output is not real content
export const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/i, // word-boundary so "to-do"/"to do" are NOT flagged
  /lorem ipsum/i,
  /\[insert[^\]]*\]/i,
  /placeholder/i,
  /here\.?\.\.\./i,
  /XXX/i,
  /待补充/i,
  /待添加/i,
  /这里插入/i,
  /在此输入/i,
  /占位符/i,
  /your text here/i,
  /TBD/i,
];

export function countWords(text) {
  return text.trim().split(/\s+/).length;
}

export function countChineseChars(text) {
  // Remove markdown syntax, count Chinese characters
  const cleaned = text.replace(/[#*`\[\]()\-|>]/g, '');
  const chineseChars = cleaned.match(/[\u4e00-\u9fff]/g);
  return chineseChars ? chineseChars.length : 0;
}

/**
 * Validate one article object. Returns { issues, warnings }.
 * issues = critical (must fix / fail), warnings = acceptable but noteworthy.
 */
export function checkArticleData(data) {
  const issues = [];
  const warnings = [];
  const lang = data.lang;

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      issues.push(`Missing required field: ${field}`);
    }
  }

  // Check slug format
  if (data.slug) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      warnings.push(`Slug format may not be URL-safe: "${data.slug}"`);
    }
    if (!data.slug.includes('gta6') && !data.slug.includes('gta-6')) {
      warnings.push('Slug does not contain "gta6" (bad for SEO)');
    }
  }

  // Check title
  if (data.title) {
    if (data.title.length < MIN_TITLE_LEN) {
      issues.push(`Title too short (${data.title.length} chars, min ${MIN_TITLE_LEN})`);
    }
    if (data.title.length > MAX_TITLE_LEN) {
      warnings.push(`Title too long (${data.title.length} chars, max ${MAX_TITLE_LEN})`);
    }
    if (!data.title.toLowerCase().includes('gta') && !data.title.toLowerCase().includes('gta6')) {
      warnings.push('Title does not contain "GTA6" (bad for SEO)');
    }
  }

  // Check description
  if (data.description) {
    if (data.description.length < MIN_DESC_LEN) {
      warnings.push(`Description too short (${data.description.length} chars, min ${MIN_DESC_LEN})`);
    }
    if (data.description.length > MAX_DESC_LEN) {
      warnings.push(`Description too long (${data.description.length} chars, max ${MAX_DESC_LEN})`);
    }
  }

  // Check category
  if (data.category && !VALID_CATEGORIES.includes(data.category)) {
    issues.push(`Invalid category: "${data.category}". Valid: ${VALID_CATEGORIES.join(', ')}`);
  }

  // Check lang
  if (data.lang && !VALID_LANGS.includes(data.lang)) {
    issues.push(`Invalid lang: "${data.lang}". Valid: ${VALID_LANGS.join(', ')}`);
  }

  // Check sourceType
  if (data.sourceType && !VALID_SOURCE_TYPES.includes(data.sourceType)) {
    warnings.push(`Invalid sourceType: "${data.sourceType}". Valid: ${VALID_SOURCE_TYPES.join(', ')}`);
  }

  // Traceability: auto-generated articles MUST carry a source + sourceType so
  // readers can verify facts. Missing source = facts cannot be traced.
  if (!data.source) {
    issues.push('Missing source — article facts cannot be traced back to a news item');
  }
  if (!data.sourceType) {
    issues.push('Missing sourceType — cannot tell official/media/community/rumor');
  }

  // Check content length
  if (data.content) {
    if (lang === 'zh') {
      const charCount = countChineseChars(data.content);
      if (charCount < MIN_ZH_CONTENT) {
        warnings.push(`Chinese content too short (${charCount} chars, min ${MIN_ZH_CONTENT})`);
      }
    } else if (lang === 'en') {
      const wordCount = countWords(data.content);
      if (wordCount < MIN_EN_CONTENT) {
        warnings.push(`English content too short (${wordCount} words, min ${MIN_EN_CONTENT})`);
      }
    }
  }

  // Check tags
  if (!data.tags || data.tags.length === 0) {
    warnings.push('No tags specified');
  }

  // Check for placeholder / hallucination markers
  if (data.content) {
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(data.content)) {
        issues.push(`Content contains placeholder/hallucination marker: ${pattern}`);
      }
    }
  }

  // Rumor articles should be visibly marked as unconfirmed in title or content
  if (data.sourceType === 'rumor' || data.category === 'rumors') {
    const text = `${data.title} ${data.content}`;
    if (!/传闻|未经证实|rumor|unconfirmed|speculat|reportedly|leak/i.test(text)) {
      warnings.push('Rumor content is not clearly marked as unconfirmed');
    }
  }

  return { issues, warnings };
}
