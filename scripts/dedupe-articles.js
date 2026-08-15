/**
 * GTA6 Hub - Duplicate Article Cleanup
 *
 * Scans src/data/auto/*.zh.json, groups articles by title similarity,
 * and deletes all but the highest-quality article per story (zh + en both).
 *
 * Usage: node scripts/dedupe-articles.js [--dry-run]
 *   --dry-run : only report what would be deleted, do not delete.
 */
import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { titleSimilarity, SIMILARITY_THRESHOLD } from './title-sim.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTO_DIR = join(__dirname, '..', 'src', 'data', 'auto');

// Source priority for tie-breaking: editorial/media sources rank above community
const SOURCE_RANK = {
  'Rockstar Newswire': 5,
  'IGN Games': 4,
  'Eurogamer': 4,
  'Polygon': 3,
  'GameRant': 3,
  'Push Square': 3,
  'Reddit r/GTA6': 1,
};

function qualityScore(data) {
  let score = data.content ? data.content.length : 0;
  score += (SOURCE_RANK[data.source] ?? 2) * 2000;
  if (data.title && /gta\s*6/i.test(data.title)) score += 500;
  if (data.description && data.description.length >= 50) score += 200;
  return score;
}

function main() {
  console.log('=== GTA6 Hub Duplicate Article Cleanup ===\n');

  if (!existsSync(AUTO_DIR)) {
    console.log('No auto articles directory found.');
    return;
  }

  const dryRun = process.argv.includes('--dry-run');
  const zhFiles = readdirSync(AUTO_DIR)
    .filter((f) => f.endsWith('.zh.json'))
    .sort();

  if (zhFiles.length === 0) {
    console.log('No articles to check.');
    return;
  }

  // Group articles by similarity (each group = one story)
  const groups = [];
  for (const file of zhFiles) {
    let data;
    try {
      data = JSON.parse(readFileSync(join(AUTO_DIR, file), 'utf-8'));
    } catch {
      continue;
    }

    let placed = false;
    for (const group of groups) {
      if (titleSimilarity(group.rep.data.title, data.title) >= SIMILARITY_THRESHOLD) {
        group.members.push({ file, data });
        if (qualityScore(data) > qualityScore(group.rep.data)) {
          group.rep = { file, data };
        }
        placed = true;
        break;
      }
    }
    if (!placed) {
      groups.push({ rep: { file, data }, members: [{ file, data }] });
    }
  }

  console.log(`Found ${zhFiles.length} Chinese articles in ${groups.length} unique stories\n`);

  let totalDeleted = 0;
  const storiesWithDuplicates = groups.filter((g) => g.members.length > 1);

  for (const group of groups) {
    if (group.members.length === 1) continue; // no duplicate, keep as-is

    const [slugOfRep] = group.rep.file.split('.');
    console.log(`📖 Story: ${group.rep.data.title}`);
    for (const member of group.members) {
      const keep = member.file === group.rep.file;
      const [slug] = member.file.split('.');
      console.log(`  ${keep ? '✅ KEEP' : '🗑️  DEL'} ${member.file}  (score ${qualityScore(member.data)})`);
      if (keep) continue;

      // Delete zh + en versions
      for (const lang of ['zh', 'en']) {
        const target = join(AUTO_DIR, `${slug}.${lang}.json`);
        if (existsSync(target)) {
          if (!dryRun) {
            try {
              unlinkSync(target);
            } catch (e) {
              console.log(`    ⚠️ Could not delete ${target}: ${e.message}`);
            }
          }
          totalDeleted++;
        }
      }
    }
    console.log('');
  }

  console.log(`=== Summary ===`);
  console.log(`Unique stories: ${groups.length}`);
  console.log(`Stories with duplicates: ${storiesWithDuplicates.length}`);
  console.log(`Files to delete: ${totalDeleted}${dryRun ? ' (DRY RUN — nothing deleted)' : ' (deleted)'}`);
}

main();
