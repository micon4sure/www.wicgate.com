import { promises as fs } from 'fs';
import path from 'path';
import { PAGE_META, DEFAULT_SITE_URL, DEFAULT_OG_IMAGE } from '../src/content/pageMeta';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '../src/utils/structuredData';

interface ReplacementMeta {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
}

const DIST_DIR = path.resolve(process.cwd(), 'dist');

async function main() {
  const htmlFiles = await collectHtmlFiles(DIST_DIR);

  await Promise.all(
    htmlFiles.map(async (filePath) => {
      const routePath = deriveRoutePath(filePath);
      if (!routePath) return;

      const metaDefinition = PAGE_META[routePath];
      if (!metaDefinition) {
        console.warn(`⚠️  No metadata found for route: ${routePath}`);
        return;
      }

      const replacement: ReplacementMeta = {
        title: metaDefinition.title,
        description: metaDefinition.description,
        keywords: metaDefinition.keywords,
        canonical: metaDefinition.canonical || buildCanonical(routePath),
        ogImage: buildOgImage(metaDefinition.ogImage),
      };

      let html = await fs.readFile(filePath, 'utf-8');

      html = replaceTag(html, 'title', replacement.title);
      html = replaceMeta(html, 'name', 'description', replacement.description);
      html = replaceMeta(html, 'name', 'keywords', replacement.keywords);
      html = replaceMeta(html, 'property', 'og:title', replacement.title);
      html = replaceMeta(html, 'property', 'og:description', replacement.description);
      html = replaceMeta(html, 'property', 'og:url', replacement.canonical);
      html = replaceMeta(html, 'property', 'og:image', replacement.ogImage);
      html = replaceMeta(html, 'name', 'twitter:title', replacement.title);
      html = replaceMeta(html, 'name', 'twitter:description', replacement.description);
      html = replaceMeta(html, 'name', 'twitter:image', replacement.ogImage);
      html = replaceLink(html, 'rel', 'canonical', replacement.canonical);

      // Inject structured data (JSON-LD)
      html = injectStructuredData(html, routePath);

      await fs.writeFile(filePath, html);
    })
  );
}

function replaceTag(html: string, tagName: string, value: string): string {
  const escaped = escapeAttribute(value);
  const regex = new RegExp(`<${tagName}[^>]*>[^<]*</${tagName}>`);
  return html.replace(regex, `<${tagName}>${escaped}</${tagName}>`);
}

function replaceMeta(
  html: string,
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
): string {
  const escaped = escapeAttribute(content);
  const regex = new RegExp(
    `<meta ${attrName}="${escapeRegex(attrValue)}" content="[^"]*">`,
    'g'
  );
  return html.replace(regex, `<meta ${attrName}="${attrValue}" content="${escaped}">`);
}

function replaceLink(html: string, attrName: string, attrValue: string, href: string): string {
  const escaped = escapeAttribute(href);
  const regex = new RegExp(
    `<link ${attrName}="${escapeRegex(attrValue)}" href="[^"]*">`,
    'g'
  );
  return html.replace(regex, `<link ${attrName}="${attrValue}" href="${escaped}">`);
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function injectStructuredData(html: string, routePath: string): string {
  const scripts: string[] = [];

  // Organization schema on all pages
  const orgSchema = generateOrganizationSchema();
  scripts.push(
    `<script type="application/ld+json">${JSON.stringify(orgSchema, null, 0)}</script>`
  );

  // WebSite schema on homepage only
  if (routePath === '/') {
    const websiteSchema = generateWebSiteSchema();
    scripts.push(
      `<script type="application/ld+json">${JSON.stringify(websiteSchema, null, 0)}</script>`
    );
  }

  // Insert all structured data scripts before </head>
  if (scripts.length > 0) {
    const structuredDataBlock = '\n' + scripts.join('\n') + '\n';
    html = html.replace('</head>', `${structuredDataBlock}</head>`);
  }

  return html;
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

function deriveRoutePath(filePath: string): string | null {
  const relative = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  if (relative === 'stats.html') return null;

  if (relative === 'index.html') return '/';

  if (!relative.endsWith('.html')) return null;

  const withoutExt = relative.slice(0, -'.html'.length);
  const route = `/${withoutExt}`;
  return route === '/index' ? '/' : route;
}

function buildCanonical(routePath: string): string {
  if (routePath === '/') return DEFAULT_SITE_URL;
  return `${DEFAULT_SITE_URL}${routePath}`;
}

function buildOgImage(ogImage?: string): string {
  if (!ogImage || ogImage.length === 0) {
    return `${DEFAULT_SITE_URL}${DEFAULT_OG_IMAGE}`;
  }
  if (ogImage.startsWith('http')) return ogImage;
  return `${DEFAULT_SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;
}

main().catch((error) => {
  console.error('[postbuild:head] Failed to apply head metadata:', error);
  process.exit(1);
});
