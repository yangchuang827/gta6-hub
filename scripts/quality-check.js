/**
 * GTA6 Hub - Quality Check Script (CLI gate)
 *
 * Scans all auto-generated article JSON files in src/data/auto/
 * and validates them against the shared quality rules (see quality-lib.js).
 *
 * Usage: node scripts/quality-check.js [--delete-failed]
 *   --delete-failed : remove FAILED articles so only good ones ship.
 */
import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { checkArticleData } from './quality-lib.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUTO_DIR = join(__dirname, '..', 'src', 'data', 'auto');

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
      const { issues, warnings } = checkArticleData(data);

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
