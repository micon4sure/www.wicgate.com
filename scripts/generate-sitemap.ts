/**
 * Sitemap Generator for WiCGATE
 * Generates XML sitemap from route definitions
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Define routes manually (mirrors routes.ts structure)
const routes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
  },
  {
    path: '/getting-started',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/multiplayer',
    priority: 0.8,
    changefreq: 'daily',
  },
  {
    path: '/community',
    priority: 0.8,
    changefreq: 'daily',
  },
  {
    path: '/about',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/faq',
    priority: 0.8,
    changefreq: 'weekly',
  },
];

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
