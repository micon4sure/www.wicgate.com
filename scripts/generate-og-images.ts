/**
 * OG Image Generator for WICGATE
 * Generates Open Graph images for social media sharing
 *
 * Uses hero_picture.png as base with WICGATE branding overlay
 */

import sharp from 'sharp';
import { resolve } from 'path';

const PUBLIC_DIR = resolve(process.cwd(), 'public');

const OG_IMAGES = ['og-default.jpg'];

// Target dimensions for OG images
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// WICGATE text logo (top-left)
const WICGATE_LOGO_WIDTH = 200;
const WICGATE_LOGO_HEIGHT = Math.round((396 / 2109) * 200); // ~38px
const LOGO_PADDING = 40;

// WIC game logo (centered)
const WIC_LOGO_WIDTH = 450;
const WIC_LOGO_HEIGHT = Math.round((413 / 1200) * 450); // ~155px

/**
 * Creates an SVG overlay with subtle vignette gradient for logo contrast
 */
function createOverlaySvg(): Buffer {
  const svg = `
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" style="stop-color:rgba(0,0,0,0);stop-opacity:0" />
          <stop offset="100%" style="stop-color:rgba(0,0,0,0.5);stop-opacity:1" />
        </radialGradient>
      </defs>
      <!-- Vignette effect for logo contrast -->
      <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#vignette)" />
    </svg>
  `;

  return Buffer.from(svg);
}

async function generateOgImage(filename: string): Promise<void> {
  const heroPath = resolve(PUBLIC_DIR, 'hero_picture.png');
  const wicgateLogoPath = resolve(PUBLIC_DIR, 'wicgate-white.png');
  const wicLogoPath = resolve(PUBLIC_DIR, 'wic-logo.png');
  const outputPath = resolve(PUBLIC_DIR, filename);

  // Load and process hero image
  // Original: 2048x1024 (2:1 ratio)
  // Target: 1200x630 (1.9:1 ratio) - need slight vertical crop
  const heroImage = await sharp(heroPath)
    .resize(OG_WIDTH, OG_HEIGHT, {
      fit: 'cover',
      position: 'center',
    })
    .toBuffer();

  // Load WICGATE text logo (top-left)
  const wicgateLogo = await sharp(wicgateLogoPath)
    .resize(WICGATE_LOGO_WIDTH, WICGATE_LOGO_HEIGHT, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  // Load WIC game logo (centered)
  const wicLogo = await sharp(wicLogoPath)
    .resize(WIC_LOGO_WIDTH, WIC_LOGO_HEIGHT, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  // Create overlay with vignette gradient
  const overlaySvg = createOverlaySvg();

  // Center the WIC game logo
  const wicLogoLeft = Math.round((OG_WIDTH - WIC_LOGO_WIDTH) / 2);
  const wicLogoTop = Math.round((OG_HEIGHT - WIC_LOGO_HEIGHT) / 2);

  // Composite all layers
  await sharp(heroImage)
    .composite([
      // Add vignette overlay
      {
        input: overlaySvg,
        top: 0,
        left: 0,
      },
      // Add WICGATE text logo (top-left)
      {
        input: wicgateLogo,
        top: LOGO_PADDING,
        left: LOGO_PADDING,
      },
      // Add WIC game logo (centered)
      {
        input: wicLogo,
        top: wicLogoTop,
        left: wicLogoLeft,
      },
    ])
    .jpeg({
      quality: 85,
      mozjpeg: true,
    })
    .toFile(outputPath);

  console.log(`  ✓ ${filename}`);
}

async function main(): Promise<void> {
  console.log('Generating OG images...\n');

  for (const filename of OG_IMAGES) {
    await generateOgImage(filename);
  }

  console.log(`\n✓ Generated ${OG_IMAGES.length} OG images successfully`);
}

main().catch((error) => {
  console.error('[generate-og-images] Failed:', error);
  process.exit(1);
});
