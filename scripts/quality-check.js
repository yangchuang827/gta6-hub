/**
 * GTA6 Hub - Quality Check Script
 *
 * Scans all auto-generated article JSON files in src/data/auto/
 * and validates them against quality standards.
 *
 * Usage: node scripts/quality-check.js
 */

import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTO_DIR = join(__dirname, '..', 'src', 'data', 'auto');

const REQUIRED_FIELDS = ['slug', 'title', 'description', 'date', 'category', 'content', 'lang'];
const VALID_CATEGORIES = ['news', 'trailers', 'gameplay', 'characters', 'guides', 'rumors'];
const VALID_LANGS = ['zh', 'en'];
const VALID_SOURCE_TYPES = ['official', 'media', 'community', 'rumor'];

// Placeholder / hallucination markers that indicate the AI output is not real content
const PLACEHOLDER_PATTERNS = [
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

// Minimum content lengths
const MIN_ZH_CONTENT = 400; // Chinese characters
const MIN_EN_CONTENT = 300; // English words
const MIN_TITLE_LEN = 10;
const MAX_TITLE_LEN = 80;
const MIN_DESC_LEN = 50;
const MAX_DESC_LEN = 200;

function countWords(text) {
  return text.trim().split(/\s+/).length;
}

function countChineseChars(text) {
  // Remove markdown syntax, count Chinese characters
  const cleaned = text.replace(/[#*`\[\]()\-|>]/g, '');
  const chineseChars = cleaned.match(/[\u4e00-\u9fff]/g);
  return chineseChars ? chineseChars.length : 0;
}

function checkArticle(filename, data) {
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

  // Check for placeholder / hallucination markers (expanded beyond TODO/lorem)
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

function main() {
  console.log('=== GTA6 Hub Quality Check ===\n');

  if (!existsSync(AUTO_DIR)) {
    console.log('No auto articles directory found. Nothing to check.');
    return;
  }

  const files = readdirSync(AUTO_DIR).filter((f) => f.endsWith('.json'));

  if (files.length === 0) {
    console.log('No auto-generated articles found. Nothing to check.');
    return;
  }

  console.log(`Checking ${files.length} article(s)...\n`);

  let totalIssues = 0;
  let totalWarnings = 0;
  const report = [];
  const deleteFailed = process.argv.includes('--delete-failed');

  for (const file of files) {
    const filepath = join(AUTO_DIR, file);
    try {
      const data = JSON.parse(readFileSync(filepath, 'utf-8'));
      const { issues, warnings } = checkArticle(file, data);

      const status = issues.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS';
      const icon = issues.length > 0 ? '✗' : warnings.length > 0 ? '⚠' : '✓';

      console.log(`${icon} [${status}] ${file}`);
      if (issues.length > 0) {
        console.log(`  Issues:`);
        issues.forEach((i) => console.log(`    - ${i}`));
      }
      if (warnings.length > 0) {
        console.log(`  Warnings:`);
        warnings.forEach((w) => console.log(`    - ${w}`));
      }

      totalIssues += issues.length;
      totalWarnings += warnings.length;

      // In --delete-failed mode, remove FAILED files so only good articles ship.
      if (status === 'FAIL' && deleteFailed) {
        try {
          unlinkSync(filepath);
          console.log(`  🗑️ Deleted failed article: ${file}`);
        } catch (e) {
          console.log(`  ⚠️ Could not delete ${file}: ${e.message}`);
        }
      }

      report.push({ file, status, issues, warnings, title: data.title });
    } catch (e) {
      console.log(`✗ [ERROR] ${file}: Failed to parse JSON - ${e.message}`);
      totalIssues++;
      report.push({ file, status: 'FAIL', issues: ['JSON parse error'], warnings: [], title: '' });
      if (deleteFailed) {
        try {
          unlinkSync(filepath);
          console.log(`  🗑️ Deleted unparseable article: ${file}`);
        } catch (e2) {
          console.log(`  ⚠️ Could not delete ${file}: ${e2.message}`);
        }
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Files checked: ${files.length}`);
  console.log(`Passed: ${report.filter((r) => r.status === 'PASS').length}`);
  console.log(`Warnings: ${report.filter((r) => r.status === 'WARN').length}`);
  console.log(`Failed: ${report.filter((r) => r.status === 'FAIL').length}`);
  console.log(`Total issues: ${totalIssues}`);
  console.log(`Total warnings: ${totalWarnings}`);

  // Exit policy:
  // - --delete-failed: bad files removed; if at least one good file remains, ship them (exit 0),
  //   otherwise fail (exit 1).
  // - default (no flag): any critical issue fails the run (exit 1).
  const failedCount = report.filter((r) => r.status === 'FAIL').length;
  if (totalIssues > 0) {
    if (deleteFailed && files.length - failedCount > 0) {
      console.log('\n⚠️ Failed articles removed; remaining articles will be published.');
      process.exit(0);
    }
    console.log('\n❌ Quality check failed - critical issues found.');
    process.exit(1);
  } else {
    console.log('\n✅ Quality check passed (warnings are OK).');
  }
}

main();
