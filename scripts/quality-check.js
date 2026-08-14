/**
 * GTA6 Hub - Quality Check Script
 *
 * Scans all auto-generated article JSON files in src/data/auto/
 * and validates them against quality standards.
 *
 * Usage: node scripts/quality-check.js
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTO_DIR = join(__dirname, '..', 'src', 'data', 'auto');

const REQUIRED_FIELDS = ['slug', 'title', 'description', 'date', 'category', 'content', 'lang'];
const VALID_CATEGORIES = ['news', 'trailers', 'gameplay', 'characters', 'guides', 'rumors'];
const VALID_LANGS = ['zh', 'en'];
const VALID_SOURCE_TYPES = ['official', 'media', 'community', 'rumor'];

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

  // Check for placeholder content
  if (data.content && data.content.includes('TODO')) {
    issues.push('Content contains TODO placeholder');
  }
  if (data.content && data.content.includes('lorem ipsum')) {
    issues.push('Content contains lorem ipsum placeholder');
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

      report.push({ file, status, issues, warnings, title: data.title });
    } catch (e) {
      console.log(`✗ [ERROR] ${file}: Failed to parse JSON - ${e.message}`);
      totalIssues++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Files checked: ${files.length}`);
  console.log(`Passed: ${report.filter((r) => r.status === 'PASS').length}`);
  console.log(`Warnings: ${report.filter((r) => r.status === 'WARN').length}`);
  console.log(`Failed: ${report.filter((r) => r.status === 'FAIL').length}`);
  console.log(`Total issues: ${totalIssues}`);
  console.log(`Total warnings: ${totalWarnings}`);

  // Exit with error if any critical issues found
  if (totalIssues > 0) {
    console.log('\n❌ Quality check failed - critical issues found.');
    process.exit(1);
  } else {
    console.log('\n✅ Quality check passed (warnings are OK).');
  }
}

main();
