# WICGATE Deeplink Navigation System

This document describes all available deeplinks for navigating to specific sections and subsections of the WICGATE website.

## Overview

The website supports two levels of navigation:
1. **Main sections** - Top-level pages accessible from the main navigation bar
2. **Subsections** - Specific content areas within each main section, accessible via dropdown menus or direct links

## Complete Deeplink Reference

### Hero / Homepage
- **URL**: `/` or `/#hero`
- **Description**: Homepage with widget dashboard

### Getting Started

**Main Section**: `/getting-started`

**Subsections**:
- `/getting-started#getting-started-quick` - Quick Installation guide
- `/getting-started#getting-started-advanced` - Advanced Setup Options (dedicated servers, manual installation)

### Multiplayer

**Main Section**: `/multiplayer`

**Subsections**:
- `/multiplayer#multiplayer-servers` - Players & Servers Online (live server status)
- `/multiplayer#multiplayer-statistics` - Statistics & Leaderboards

### Community

**Main Section**: `/community`

**Subsections**:
- `/community#community-events` - Community Events & Tournaments
- `/community#community-streams` - Live Streams on Twitch
- `/community#community-videos` - Latest YouTube Videos

### About

**Main Section**: `/about`

**Subsections**:
- `/about#about-mission` - Our Mission
- `/about#about-story` - The Story & Our Approach
- `/about#about-values` - What Drives Us (Project Values)
- `/about#about-team` - The Team

### FAQ

**Main Section**: `/faq`

**Subsections**:
- `/faq#faq-getting-started` - Getting Started questions
- `/faq#faq-technical` - Technical Issues & troubleshooting
- `/faq#faq-gameplay` - Gameplay & Features
- `/faq#faq-server-community` - Server & Community information

## Widget Dashboard Quick Links

The homepage widget dashboard includes quick links to specific subsections:

| Widget | Deeplink Target |
|--------|----------------|
| Quick Start | `/getting-started` |
| Live Servers | `/multiplayer#multiplayer-servers` |
| Community | `/community#community-events` |
| Top Players | `/multiplayer#multiplayer-statistics` |
| Latest Videos | `/community#community-videos` |
| Getting Help | `/faq` |

## Navigation Features

### Desktop Navigation
- Hover over navigation items with subsections to reveal dropdown menus
- Click main section to navigate to section top
- Click subsection to navigate directly to that content

### Mobile Navigation
- Tap section name to navigate to section top
- Tap dropdown arrow to expand/collapse subsections
- Tap subsection to navigate directly to that content

## Technical Implementation

### Key Files
- `src/types/navigation.ts` - Navigation structure and deeplink helpers
- `src/components/Navigation.vue` - Navigation component with dropdown support
- `src/components/WidgetDashboard.vue` - Homepage widgets with deeplinks
- `src/views/Home.vue` - Section/subsection scroll handling
- `src/utils/scroll.ts` - Scroll utility for precise positioning

### Navigation Structure

All sections and subsections are defined in `src/types/navigation.ts`:

```typescript
export const NAVIGATION_STRUCTURE: NavigationSection[] = [
  {
    id: 'hero',
    label: 'Home',
  },
  {
    id: 'getting-started',
    label: 'Getting Started',
    subsections: [
      { id: 'getting-started-quick', label: 'Quick Installation' },
      { id: 'getting-started-advanced', label: 'Advanced Setup' },
    ],
  },
  // ... more sections
];
```

### Helper Functions

- `getAllValidIds()` - Returns all valid section and subsection IDs
- `getSectionFromSubsection(subsectionId)` - Get parent section from subsection ID
- `isSubsection(id)` - Check if an ID is a subsection

## Usage Examples

### Direct Navigation
```html
<a href="/multiplayer#multiplayer-servers">View Live Servers</a>
```

### Programmatic Navigation
```typescript
import { useRouter } from 'vue-router';

const router = useRouter();

// Navigate to subsection
router.push({
  path: '/multiplayer',
  hash: '#multiplayer-servers'
});
```

### Scroll to Subsection
```typescript
import { scrollToSection } from '../utils/scroll';

// Scroll to any section or subsection
scrollToSection('multiplayer-servers');
```

## SEO & Sharing

All sections have dedicated routes with proper meta tags for SEO and social sharing:
- `/getting-started` - Installation guide
- `/multiplayer` - Live servers and rankings
- `/community` - Community hub
- `/about` - About WICGATE
- `/faq` - Help center

When sharing links with subsection hashes, the page will load and automatically scroll to the specific content.

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports both hash-based navigation and Vue Router transitions
