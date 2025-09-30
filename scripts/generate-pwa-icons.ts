/**
 * PWA Icon Generator
 * Generates all required PWA icon sizes from favicon.svg
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const sizes = [
  { name: 'pwa-64x64.png', size: 64 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'maskable-icon-512x512.png', size: 512 },
];

async function generateIcons() {
  const svgPath = resolve(process.cwd(), 'public', 'favicon.svg');
  const svgBuffer = readFileSync(svgPath);

  console.log('🎨 Generating PWA icons from favicon.svg...\n');

  for (const { name, size } of sizes) {
    const outputPath = resolve(process.cwd(), 'public', name);

    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 10, alpha: 1 }, // #0a0a0a
      })
      .png()
      .toFile(outputPath);

    console.log(`  ✓ Generated ${name} (${size}x${size})`);
  }

  console.log('\n✅ All PWA icons generated successfully!');
}

generateIcons().catch((err) => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
