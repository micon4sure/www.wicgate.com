# WICGATE Deeplink Navigation System

This document describes all available deeplinks for navigating to specific sections and subsections of the WICGATE website.

## Overview

The website uses **path-based nested routes** for clean URLs and better SEO:
1. **Main sections** - Top-level pages accessible from the main navigation bar
2. **Subsections** - Specific content areas within each main section, accessible via dropdown menus or direct URLs

## Complete Deeplink Reference

### Hero / Homepage
- **URL**: `/`
- **Description**: Homepage with widget dashboard

### Getting Started

**Main Section**: `/getting-started`

**Subsections**:
- `/getting-started/quick` - Quick Installation guide
- `/getting-started/advanced` - Advanced Setup Options (dedicated servers, manual installation)

### Multiplayer

**Main Section**: `/multiplayer`

**Subsections**:
- `/multiplayer/servers` - Players & Servers Online (live server status)
- `/multiplayer/statistics` - Statistics & Leaderboards

### Community

**Main Section**: `/community`

**Subsections**:
- `/community/events` - Community Events & Tournaments
- `/community/streams` - Live Streams on Twitch
- `/community/videos` - Latest YouTube Videos

### About

**Main Section**: `/about`

**Subsections**:
- `/about/mission` - Our Mission
- `/about/story` - The Story & Our Approach
- `/about/values` - What Drives Us (Project Values)
- `/about/team` - The Team

### FAQ

**Main Section**: `/faq`

**Subsections**:
- `/faq/getting-started` - Getting Started questions
- `/faq/technical` - Technical Issues & troubleshooting
- `/faq/gameplay` - Gameplay & Features
- `/faq/community` - Server & Community information

## Widget Dashboard Quick Links

The homepage widget dashboard includes quick links to specific subsections:

| Widget | Deeplink Target |
|--------|----------------|
| Quick Start | `/getting-started` |
| Live Servers | `/multiplayer/servers` |
| Community | `/community/events` |
| Top Players | `/multiplayer/statistics` |
| Latest Videos | `/community/videos` |
| Getting Help | `/faq` |

## Navigation Features

### Desktop Navigation
- Hover over navigation items with subsections to reveal dropdown menus
- Click main section to navigate to section top
- Click subsection to navigate directly to that content with clean URL

### Mobile Navigation
- Tap section name to navigate to section top
- Tap dropdown arrow to expand/collapse subsections
- Tap subsection to navigate directly to that content

## Benefits of Path-Based Routes

### Clean URLs
- **Before**: `/multiplayer#multiplayer-statistics`
- **After**: `/multiplayer/statistics`

### Better SEO
- Each subsection has its own unique URL
- Search engines can crawl and index all 27 routes independently
- Unique meta tags (title, description, keywords) per subsection
- Better social sharing with proper Open Graph tags

### Improved UX
- Browser back/forward buttons work correctly
- Bookmarkable subsection URLs
- No hash-based navigation complexity

### SSG Compatible
- All routes pre-rendered at build time
- Instant first paint with static HTML
- Full SEO benefits for every subsection

## Technical Implementation

### Key Files
- `src/router/routes.ts` - Complete nested route structure (27 routes)
- `src/types/navigation.ts` - Navigation structure and `getRoutePath()` helper
- `src/components/Navigation.vue` - Navigation component with dropdown support
- `src/components/WidgetDashboard.vue` - Homepage widgets with deeplinks
- `src/views/Home.vue` - Section/subsection route handling
- `src/main.ts` - Router scrollBehavior for subsections
- `src/utils/scroll.ts` - Scroll utility for precise positioning

### Route Structure

All routes are defined in `src/router/routes.ts` with nested structure:

```typescript
{
  path: '/multiplayer',
  component: Home,
  children: [
    {
      path: '',
      name: 'multiplayer',
      meta: { section: 'multiplayer', title: '...', ... }
    },
    {
      path: 'servers',
      name: 'multiplayer-servers',
      meta: {
        section: 'multiplayer',
        subsection: 'multiplayer-servers',
        title: 'Live Servers - Players Online Now | WICGATE',
        ...
      }
    },
    {
      path: 'statistics',
      name: 'multiplayer-statistics',
      meta: {
        section: 'multiplayer',
        subsection: 'multiplayer-statistics',
        title: 'Player Statistics & Leaderboards | WICGATE',
        ...
      }
    }
  ]
}
```

### Navigation Helper

The `getRoutePath()` function in `src/types/navigation.ts` converts IDs to paths:

```typescript
getRoutePath('hero')                    // → '/'
getRoutePath('multiplayer')             // → '/multiplayer'
getRoutePath('multiplayer-statistics')  // → '/multiplayer/statistics'
getRoutePath('faq-technical')           // → '/faq/technical'
```

### Other Helper Functions

- `getAllValidIds()` - Returns all valid section and subsection IDs
- `getSectionFromSubsection(subsectionId)` - Get parent section from subsection ID
- `isSubsection(id)` - Check if an ID is a subsection

## Usage Examples

### Direct Navigation (HTML)
```html
<!-- Main section -->
<a href="/multiplayer">View Multiplayer</a>

<!-- Subsection -->
<a href="/multiplayer/servers">View Live Servers</a>
```

### Programmatic Navigation (Vue)
```typescript
import { useRouter } from 'vue-router';
import { getRoutePath } from '@/types/navigation';

const router = useRouter();

// Navigate to subsection
router.push(getRoutePath('multiplayer-servers'));
// → Navigates to /multiplayer/servers

// Navigate to main section
router.push(getRoutePath('community'));
// → Navigates to /community
```

### Router-Link Usage
```vue
<router-link :to="getRoutePath('multiplayer-statistics')">
  View Statistics
</router-link>
```

## SEO & Meta Tags

Each route has unique SEO meta tags:

**Main Sections** - Broad overview content:
- `/getting-started` - "Getting Started - Download & Install WiC Multiplayer"
- `/multiplayer` - "Multiplayer - Live Servers & Rankings"
- `/community` - "Community & Events - Discord, Tournaments & Videos"

**Subsections** - Specific targeted content:
- `/multiplayer/statistics` - "Player Statistics & Leaderboards | WICGATE"
- `/community/events` - "Community Events & Tournaments | WICGATE"
- `/faq/technical` - "FAQ - Technical Issues & Troubleshooting | WICGATE"

Each subsection gets:
- Unique `<title>` tag
- Unique `<meta name="description">`
- Unique `<meta name="keywords">`
- Unique Open Graph tags (`og:title`, `og:description`, `og:image`)
- Canonical URL for SEO

## Pre-Rendered Routes

ViteSSG pre-renders all 27 routes at build time:

```
dist/
  index.html                       (homepage)
  getting-started/
    index.html                     (main section)
    quick/index.html               (subsection)
    advanced/index.html            (subsection)
  multiplayer/
    index.html                     (main section)
    servers/index.html             (subsection)
    statistics/index.html          (subsection)
  community/
    index.html                     (main section)
    events/index.html              (subsection)
    streams/index.html             (subsection)
    videos/index.html              (subsection)
  about/
    index.html                     (main section)
    mission/index.html             (subsection)
    story/index.html               (subsection)
    values/index.html              (subsection)
    team/index.html                (subsection)
  faq/
    index.html                     (main section)
    getting-started/index.html     (subsection)
    technical/index.html           (subsection)
    gameplay/index.html            (subsection)
    community/index.html           (subsection)
```

Each HTML file contains:
- Pre-rendered content with proper section visible
- Unique meta tags for that route
- Structured data (JSON-LD)
- All CSS and assets for instant rendering

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports Vue Router with smooth scrolling
- Proper handling of browser back/forward buttons
- Bookmarkable URLs for every subsection

## Migration from Hash-Based

**Old Format** (deprecated):
- `/multiplayer#multiplayer-statistics`
- `/community#community-videos`
- `/faq#faq-technical`

**New Format** (current):
- `/multiplayer/statistics`
- `/community/videos`
- `/faq/technical`

The new format provides:
- ✅ Cleaner URLs
- ✅ Better SEO
- ✅ Unique meta tags per subsection
- ✅ SSG pre-rendering
- ✅ Simpler codebase (80% reduction in navigation logic)
