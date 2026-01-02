# Deployment Guide

This guide covers deployment-specific configurations for different hosting environments.

## Environment Variables

Two environment variables control URL generation for different deployment targets:

| Variable | Purpose | Default (Fallback) |
|----------|---------|-------------------|
| `VITE_SITE_URL` | Absolute URLs for OG images (social previews) | `https://wicgate.com` |
| `DEPLOY_BASE` | Asset path prefix for images within the app | `/` |

## Deployment Scenarios

### Custom Domain (wicgate.com)

**No configuration needed.** Both variables use their defaults:

```bash
npm run build
```

- OG images → `https://wicgate.com/og-default.jpg`
- Assets → `/rank-01.png`, `/infantry.png`, etc.

### GitHub Pages (username.github.io/repo-name)

Both variables must be set to the GitHub Pages URL:

```bash
VITE_SITE_URL=https://username.github.io/repo-name DEPLOY_BASE=/repo-name/ npm run build
```

Current workflow (`.github/workflows/deploy.yml`):
```yaml
run: VITE_SITE_URL=https://micon4sure.github.io/www.wicgate.com DEPLOY_BASE=/www.wicgate.com/ npm run build:staging
```

- OG images → `https://micon4sure.github.io/www.wicgate.com/og-default.jpg`
- Assets → `/www.wicgate.com/rank-01.png`, etc.

### Switching from GitHub Pages to Custom Domain

1. Update `.github/workflows/deploy.yml`:
   ```yaml
   # Before (GitHub Pages)
   run: VITE_SITE_URL=https://micon4sure.github.io/www.wicgate.com DEPLOY_BASE=/www.wicgate.com/ npm run build:staging

   # After (Custom Domain)
   run: npm run build
   ```

2. Update CNAME if needed (already set to `www.wicgate.com`)

3. Configure DNS to point to GitHub Pages or your hosting provider

## How It Works

### OG Images (`VITE_SITE_URL`)

Social media platforms (Facebook, Twitter, Discord) require **absolute URLs** for preview images.

**File:** `scripts/apply-head-meta.ts`
```typescript
// Reads from process.env since tsx doesn't process import.meta.env like Vite
const SITE_URL = process.env.VITE_SITE_URL || 'https://wicgate.com';
```

This post-build script writes `og:image` and `twitter:image` meta tags to pre-rendered HTML files.

**Note:** The script uses `process.env` (not `import.meta.env`) because it runs with `tsx` (Node.js), not Vite.

**File:** `src/content/pageMeta.ts` (imported by the script)
```typescript
// Uses optional chaining to work in both Vite and Node.js/tsx contexts
export const DEFAULT_SITE_URL = import.meta.env?.VITE_SITE_URL || 'https://wicgate.com';
```

**Why optional chaining?** In Vite, `import.meta.env` is an object. In Node.js/tsx, it's `undefined`. The `?.` safely handles both.

### Asset Paths (`DEPLOY_BASE` / `appBase`)

Images referenced in Vue components need the correct base path when deployed to a subdirectory.

**Flow:**
1. `DEPLOY_BASE` → Vite `base` config (`vite.config.ts:15`)
2. Vite exposes as `import.meta.env.BASE_URL`
3. `main.ts` provides as `appBase` to all components
4. Components inject and use for asset URLs

**File:** `src/main.ts`
```typescript
const getRuntimeBase = () => {
  if (typeof window === 'undefined') return '/';
  return new URL(import.meta.env.BASE_URL, window.location.href).pathname;
};

// Later...
app.provide('appBase', runtimeBase.endsWith('/') ? runtimeBase : runtimeBase + '/');
```

**Components using `appBase`:**

| Component | Assets |
|-----------|--------|
| `src/components/RankInsignia.vue` | Rank insignia images (`rank-01.png` to `rank-18.png`) |
| `src/components/LeaderboardGroup.vue` | Category icons (`infantry.png`, `armor.png`, `air.png`, `support.png`) |

**Usage pattern:**
```typescript
const appBase = inject<string>('appBase', '/');
const src = computed(() => `${appBase}rank-${code}.png`);
```

## Troubleshooting

### OG images not showing in social previews

1. Verify `VITE_SITE_URL` is set correctly for your deployment target
2. Check that `og-default.jpg` exists in `public/`
3. Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Rank insignia or category icons not loading

1. Verify `DEPLOY_BASE` matches your deployment path
2. Check browser DevTools Network tab for 404 errors
3. Ensure component uses `inject('appBase', '/')` pattern

### Adding new image assets that need base path

Use the `appBase` injection pattern:
```typescript
import { inject, computed } from 'vue';

const appBase = inject<string>('appBase', '/');
const imageSrc = computed(() => `${appBase}your-image.png`);
```
