# PWA (Progressive Web App) Implementation

## Overview
WICGATE is now a fully installable Progressive Web App with offline capability, allowing users to install the website on their devices and access it even when offline.

## Features

### 📱 Installation
- **Desktop**: Users can install WICGATE as a desktop app via browser prompts (Chrome, Edge, Opera)
- **Mobile**: Add to Home Screen on iOS and Android devices
- **Standalone Mode**: Runs in its own window without browser UI when installed

### 🔌 Offline Support
- **Service Worker**: Automatically caches static assets (HTML, CSS, JS, images, fonts)
- **Network-First API**: API calls attempt network first, fall back to cache
- **Cache-First Assets**: Fonts, images, and static resources served from cache for speed
- **Background Sync**: Updates cache in background when new versions are deployed

### ⚡ Performance
- **Automatic Updates**: Service worker checks for updates and refreshes automatically
- **Font Caching**: Google Fonts cached for 1 year (365 days)
- **Image Caching**: Rank badges and icons cached for 30 days
- **API Caching**: Player data cached for 5 minutes with network-first strategy

## Cache Strategies

### Google Fonts (CacheFirst)
- **Duration**: 1 year
- **Max Entries**: 10
- **Purpose**: Minimize font loading times

### Images (CacheFirst)
- **Duration**: 30 days
- **Max Entries**: 100
- **Purpose**: Fast image loading, reduced bandwidth

### API Responses (NetworkFirst)
- **Duration**: 5 minutes
- **Max Entries**: 50
- **Network Timeout**: 10 seconds
- **Purpose**: Fresh data when online, fallback when offline

## App Manifest

```json
{
  "name": "WICGATE - World in Conflict Multiplayer",
  "short_name": "WICGATE",
  "description": "Play World in Conflict online with restored multiplayer servers",
  "theme_color": "#1a1a1a",
  "background_color": "#0a0a0a",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "categories": ["games", "entertainment"]
}
```

## Icons

### Sizes Available
- **64x64**: Favicon, small browser tabs
- **192x192**: Android home screen, browser install prompts
- **512x512**: App splash screens, high-res displays
- **512x512 (maskable)**: Adaptive icons for Android

### Design
- Dark background (#0a0a0a) matching site theme
- Steel frame borders (Massgate aesthetic)
- Orange accent corners (SW orange #ff6b00)
- Military stencil "WIC" + orange "GATE" text
- Tactical crosshair accent

## Build Process

### Icon Generation
```bash
npm run build:icons
```
Generates all PWA icon sizes from `public/favicon.svg` using Sharp.

### Full Build
```bash
npm run build
```
Includes icon generation, sitemap, and PWA service worker registration.

## Testing PWA Installation

### Desktop (Chrome/Edge)
1. Open the website in Chrome or Edge
2. Look for the install icon in the address bar
3. Click to install as desktop app
4. App will open in standalone window

### Mobile (iOS Safari)
1. Open the website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Icon will appear on home screen

### Mobile (Android Chrome)
1. Open the website in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"
4. App will appear in app drawer

## Offline Testing

### Test Offline Functionality
1. Open the website normally
2. Wait for "App ready to work offline" console message
3. Open DevTools → Application → Service Workers
4. Check "Offline" checkbox
5. Refresh the page - site should still work
6. Navigate between sections - cached content loads

### Clear Cache (for testing)
1. Open DevTools → Application → Storage
2. Click "Clear site data"
3. Reload to re-register service worker

## Implementation Files

### Core Configuration
- `vite.config.ts` - VitePWA plugin configuration with Workbox strategies
- `public/manifest.webmanifest` - App manifest (auto-generated)
- `dist/sw.js` - Service worker (auto-generated)

### Icons & Assets
- `public/favicon.svg` - Source SVG icon
- `public/pwa-64x64.png` - Small icon
- `public/pwa-192x192.png` - Standard icon
- `public/pwa-512x512.png` - Large icon
- `public/maskable-icon-512x512.png` - Android adaptive icon

### Scripts
- `scripts/generate-pwa-icons.ts` - Icon generator using Sharp
- `src/main.ts` - Service worker registration

### HTML
- `index.html` - PWA meta tags, theme colors, Apple touch icons

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 72+ (Desktop & Mobile)
- ✅ Edge 79+ (Desktop)
- ✅ Firefox 97+ (Desktop)
- ✅ Safari 15.4+ (iOS & macOS)
- ✅ Opera 60+
- ✅ Samsung Internet 11+

### Unsupported
- ❌ Internet Explorer (all versions)
- ❌ Legacy Edge (<79)

## Monitoring

### Development Console
When `NODE_ENV=development`, the PWA logs:
- `[PWA] Service worker registered` - Successful registration
- `[PWA] App ready to work offline` - Cache ready
- `[PWA] New content available, refreshing...` - Update detected

### Production
Service worker runs silently, automatically updating in background.

## Security Considerations

### Content Security Policy
The CSP in `index.html` allows service worker registration:
- `script-src 'self'` - Required for service worker
- Service worker can only fetch from same origin

### HTTPS Requirement
Service workers require HTTPS (or localhost for development):
- ✅ Production: https://wicgate.com
- ✅ Development: http://localhost:5173
- ❌ HTTP production sites won't work

## Future Enhancements

### Potential Additions
- **Background Sync**: Queue failed API requests to retry when online
- **Push Notifications**: Tournament reminders, friend online notifications
- **Share Target**: Allow sharing game clips to WICGATE
- **Shortcuts**: Quick actions for common tasks (join game, view stats)

### Analytics
PWA installation and usage tracking can be added via:
```javascript
window.addEventListener('appinstalled', () => {
  AnalyticsEvents.pwaInstalled();
});
```

## Troubleshooting

### Service Worker Not Registering
1. Check console for errors
2. Ensure HTTPS (or localhost)
3. Clear browser cache and reload
4. Check Application → Service Workers in DevTools

### Offline Mode Not Working
1. Verify service worker is registered
2. Check cache in Application → Cache Storage
3. Ensure assets are in precache manifest
4. Test network conditions in DevTools

### Icons Not Showing
1. Verify icons exist in `public/` directory
2. Run `npm run build:icons` to regenerate
3. Check manifest.webmanifest references correct paths
4. Clear browser cache and reinstall

## Production Deployment

### Checklist
- [ ] Icons generated (`npm run build:icons`)
- [ ] Service worker precaches all routes
- [ ] HTTPS enabled on production domain
- [ ] CSP allows service worker registration
- [ ] Manifest references correct icon paths
- [ ] Test installation on multiple browsers/devices

### Post-Deployment Verification
1. Visit site in incognito/private mode
2. Check for install prompt
3. Test offline mode
4. Verify icons display correctly
5. Check service worker registration in DevTools

---

**Note**: PWA features are automatically included in all production builds. No additional configuration needed for deployment.
