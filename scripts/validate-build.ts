import { promises as fs } from 'fs';
import path from 'path';

interface ValidationError {
  file: string;
  type: 'error' | 'warning';
  message: string;
}

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const errors: ValidationError[] = [];

async function main() {
  console.log('🔍 Starting build validation...\n');

  const htmlFiles = await collectHtmlFiles(DIST_DIR);
  console.log(`📄 Found ${htmlFiles.length} HTML files to validate\n`);

  for (const filePath of htmlFiles) {
    await validateFile(filePath);
  }

  // Report results
  console.log('\n' + '='.repeat(60));
  if (errors.length === 0) {
    console.log('✅ Build validation passed! No issues found.');
    process.exit(0);
  } else {
    const errorCount = errors.filter((e) => e.type === 'error').length;
    const warningCount = errors.filter((e) => e.type === 'warning').length;

    console.log(`❌ Build validation found ${errorCount} errors and ${warningCount} warnings:\n`);

    for (const error of errors) {
      const icon = error.type === 'error' ? '❌' : '⚠️';
      console.log(`${icon} ${error.file}`);
      console.log(`   ${error.message}\n`);
    }

    process.exit(errorCount > 0 ? 1 : 0);
  }
}

async function validateFile(filePath: string) {
  const html = await fs.readFile(filePath, 'utf-8');
  const relativePath = path.relative(DIST_DIR, filePath);

  // Skip stats.html as it's not a content page
  if (relativePath === 'stats.html') return;

  // 1. Check for absolute favicon paths (not relative)
  const faviconMatches = html.match(/href=["']\.\/favicon/g);
  if (faviconMatches) {
    errors.push({
      file: relativePath,
      type: 'error',
      message: `Found relative favicon path(s): ${faviconMatches.join(', ')}. Should be absolute (/favicon.svg)`,
    });
  }

  // 2. Check canonical URL exists and has no query parameters
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonicalMatch) {
    errors.push({
      file: relativePath,
      type: 'error',
      message: 'Missing canonical URL',
    });
  } else {
    const canonicalUrl = canonicalMatch[1] ?? '';
    if (canonicalUrl.includes('?')) {
      errors.push({
        file: relativePath,
        type: 'error',
        message: `Canonical URL contains query parameters: ${canonicalUrl}`,
      });
    }
  }

  // 3. Check for essential meta tags
  const requiredMeta = [
    { name: 'description', pattern: /<meta[^>]+name="description"[^>]+content="[^"]+"/g },
    { name: 'og:title', pattern: /<meta[^>]+property="og:title"[^>]+content="[^"]+"/g },
    { name: 'og:description', pattern: /<meta[^>]+property="og:description"[^>]+content="[^"]+"/g },
    { name: 'og:url', pattern: /<meta[^>]+property="og:url"[^>]+content="[^"]+"/g },
    { name: 'og:image', pattern: /<meta[^>]+property="og:image"[^>]+content="[^"]+"/g },
  ];

  for (const meta of requiredMeta) {
    if (!meta.pattern.test(html)) {
      errors.push({
        file: relativePath,
        type: 'error',
        message: `Missing required meta tag: ${meta.name}`,
      });
    }
  }

  // 4. Check for duplicate meta tags (same name/property)
  const metaTags = html.match(/<meta[^>]+>/g) || [];
  const metaIdentifiers = new Set<string>();

  for (const tag of metaTags) {
    const nameMatch = tag.match(/name="([^"]+)"/);
    const propertyMatch = tag.match(/property="([^"]+)"/);
    const identifier = nameMatch ? `name:${nameMatch[1]}` : propertyMatch ? `property:${propertyMatch[1]}` : null;

    if (identifier) {
      if (metaIdentifiers.has(identifier)) {
        errors.push({
          file: relativePath,
          type: 'warning',
          message: `Duplicate meta tag found: ${identifier}`,
        });
      }
      metaIdentifiers.add(identifier);
    }
  }

  // 5. Check for title tag
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch || (titleMatch[1] ?? '').trim().length === 0) {
    errors.push({
      file: relativePath,
      type: 'error',
      message: 'Missing or empty <title> tag',
    });
  }

  // 6. Check for structured data (ld+json)
  const structuredDataMatches = html.match(/<script type="application\/ld\+json">/g);
  if (!structuredDataMatches || structuredDataMatches.length === 0) {
    errors.push({
      file: relativePath,
      type: 'warning',
      message: 'No structured data (JSON-LD) found',
    });
  }

  // 7. Verify OG image and canonical URLs are absolute (not relative)
  const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  const ogImageUrl = ogImageMatch?.[1] ?? '';
  if (ogImageMatch && !ogImageUrl.startsWith('http')) {
    errors.push({
      file: relativePath,
      type: 'error',
      message: `OG image URL is not absolute: ${ogImageUrl}`,
    });
  }

  const ogUrlMatch = html.match(/<meta property="og:url" content="([^"]+)"/);
  const ogUrl = ogUrlMatch?.[1] ?? '';
  if (ogUrlMatch && !ogUrl.startsWith('http')) {
    errors.push({
      file: relativePath,
      type: 'error',
      message: `OG URL is not absolute: ${ogUrl}`,
    });
  }
}

async function collectHtmlFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.')) continue;
      files.push(...(await collectHtmlFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

main().catch((error) => {
  console.error('[validate-build] Unexpected error:', error);
  process.exit(1);
});
