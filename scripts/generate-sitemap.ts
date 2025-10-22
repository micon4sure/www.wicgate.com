/**
 * Sitemap Generator for WiCGATE
 * Generates XML sitemap from route definitions
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { NAVIGATION_STRUCTURE, getRoutePath } from '../src/types/navigation';

interface RouteEntry {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

interface SectionRouteMeta {
  priority: number;
  changefreq: RouteEntry['changefreq'];
  subsectionPriority?: number;
}

const SECTION_META: Record<string, SectionRouteMeta> = {
  hero: { priority: 1.0, changefreq: 'daily' },
  'getting-started': { priority: 0.9, changefreq: 'weekly' },
  multiplayer: { priority: 0.8, changefreq: 'daily' },
  community: { priority: 0.8, changefreq: 'weekly' },
  about: { priority: 0.7, changefreq: 'monthly' },
  faq: { priority: 0.8, changefreq: 'weekly' },
};

const DEFAULT_META: SectionRouteMeta = {
  priority: 0.5,
  changefreq: 'monthly',
};

const routeMap = new Map<string, RouteEntry>();

function addRoute(path: string, priority: number, changefreq: RouteEntry['changefreq']) {
  const normalizedPriority = Number(priority.toFixed(2));
  routeMap.set(path, { path, priority: normalizedPriority, changefreq });
}

// Generate routes from navigation structure (main sections only, no subsections)
// Subsections are client-side tab navigation and don't need separate sitemap entries
for (const section of NAVIGATION_STRUCTURE) {
  const meta = SECTION_META[section.id] ?? DEFAULT_META;
  addRoute(getRoutePath(section.id), meta.priority, meta.changefreq);

  // Skip subsections - they're included in parent page content
  // This avoids thin content pages and consolidates SEO signals
}

// Note: Excluding /login as it's noindex anyway (auth page)

const routes = Array.from(routeMap.values()).sort((a, b) => a.path.localeCompare(b.path));

const SITE_URL = 'https://wicgate.com';

function generateSitemap(): string {
  const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const urlEntries = routes
    .map((route) => {
      return `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

// Generate and write sitemap
const sitemap = generateSitemap();
const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml');

writeFileSync(outputPath, sitemap, 'utf-8');

console.log(`✓ Sitemap generated successfully at ${outputPath}`);
console.log(`  Total URLs: ${routes.length}`);
