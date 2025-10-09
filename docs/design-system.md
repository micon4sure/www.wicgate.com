# Design System Documentation

## Overview

WiCGATE uses a comprehensive design system inspired by the original Massgate military aesthetic. All styling is token-based, modular, and responsive across all breakpoints.

## Design Tokens

### CSS Variables Location

**File:** [src/assets/styles/modules/variables.css](../src/assets/styles/modules/variables.css)

**Critical Rule:** NEVER use hardcoded hex values. ALWAYS reference design tokens via `var(--token-name)`.

**Why Design Tokens?**
- **Visual Consistency:** All colors, spacing, and effects centralized in one file
- **Theme Changes:** Update entire site by changing token values
- **Maintainability:** No scattered hardcoded values across 50+ files
- **Refactoring:** Change `--sw` from orange to blue → entire site updates instantly

**Example:**
```css
/* ❌ WRONG - Hardcoded values scattered everywhere */
.button { color: #ff6600; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
.link { color: #ff6600; }
.badge { background: #ff6600; }

/* ✅ CORRECT - Design tokens centralized */
.button { color: var(--sw); box-shadow: var(--shadow-md); }
.link { color: var(--sw); }
.badge { background: var(--sw); }
```

### Color Palette

#### Structure Colors (Steel/Graphite)
```css
--mg: #4a5568;           /* Steel structure base */
--mg-dark: #2d3748;      /* Dark steel */
--mg-muted: #718096;     /* Muted steel */

--graphite: #1a202c;     /* Navigation base */
--graphite-dark: #0f131a; /* Dark graphite */
--graphite-light: #2d3748; /* Light graphite */
```

#### Accent Colors
```css
--sw: #ff6600;           /* Massgate orange (primary) */
--sw-light: #ff8533;     /* Light orange (hover) */
--sw-rgb: 255, 102, 0;   /* RGB for rgba() usage */

--dl: #dc2626;           /* Alert red (danger) */
--d: #5865f2;            /* Discord blue */
```

#### Text Colors
```css
--t: #f7fafc;            /* Primary text (headings) */
--t2: #cbd5e0;           /* Secondary text (inactive) */
--t3: #a0aec0;           /* Tertiary text (subtle) */
--ink: #1a202c;          /* Dark text for light backgrounds */
```

#### Brand/Platform Tokens
```css
--yt: #ff0000;           /* YouTube red */
--yt-dark: #cc0000;      /* YouTube dark */

--tw: #9146ff;           /* Twitch purple */
--tw-dark: #772ce8;      /* Twitch dark */
```

#### Medal/Rank Colors
```css
--gold: #ffd700;         /* 1st place */
--silver: #c0c0c0;       /* 2nd place */
--bronze: #cd7f32;       /* 3rd place */
```

#### Panel RGB Helpers
```css
--panel-rgb: 26, 32, 44;    /* For rgba() backgrounds */
--overlay-rgb: 15, 19, 26;  /* For overlay backgrounds */
```

### Shadows

#### Multi-Layer Shadow System
```css
/* Elevation shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.3);

/* Glow effects */
--glow-orange: 0 0 24px rgba(var(--sw-rgb), 0.4);
--glow-red: 0 0 24px rgba(220, 38, 38, 0.4);
--glow-blue: 0 0 24px rgba(88, 101, 242, 0.4);

/* Inner highlights */
--highlight: inset 0 1px 0 rgba(255, 255, 255, 0.15);
```

**Professional Glow Rule:** Keep glow opacity at 0.3-0.4 for subtle, professional appearance.

### Transitions

```css
--transition-fast: 150ms cubic-bezier(0.25, 0.8, 0.25, 1);
--transition-base: 200ms cubic-bezier(0.25, 0.8, 0.25, 1);
--transition-slow: 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
```

**Standard easing:** `cubic-bezier(0.25, 0.8, 0.25, 1)` for smooth, professional feel.

### Gradients

```css
--gradient-orange: linear-gradient(135deg, var(--sw) 0%, var(--sw-light) 100%);
--gradient-graphite: linear-gradient(180deg, var(--graphite) 0%, var(--graphite-dark) 100%);
--gradient-panel: linear-gradient(180deg, rgba(var(--panel-rgb), 0.95) 0%, rgba(var(--panel-rgb), 0.85) 100%);
```

## Typography

### Font Families

**File:** [src/assets/styles/modules/typography.css](../src/assets/styles/modules/typography.css)

```css
--font-heading: 'Oswald', sans-serif;     /* Headers, nav */
--font-body: 'Rajdhani', sans-serif;      /* Body copy */
--font-data: 'Courier New', monospace;    /* Player names, scores */
```

### Font Scales

#### Desktop
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

#### Responsive Scaling
Typography automatically scales down on mobile breakpoints. See [typography.css](../src/assets/styles/modules/typography.css) for responsive variants.

### Utility Classes

```css
.heading-primary    /* Oswald, bold, large */
.heading-secondary  /* Oswald, semibold, medium */
.body-text          /* Rajdhani, regular, base */
.data-text          /* Courier New, monospace */
```

## Component Patterns

### Widget Dashboard (Homepage) *(Updated Phase 3.2)*

**Main File:** [src/components/WidgetDashboard.vue](../src/components/WidgetDashboard.vue) (77 lines - orchestrator)
**Widget Components:** [src/components/widgets/](../src/components/widgets/) (7 modular components)
**CSS Module:** [src/assets/styles/modules/components/widget-dashboard.css](../src/assets/styles/modules/components/widget-dashboard.css)

**Design Philosophy:** Function-geared dashboard following industry best practices (GitHub, Vercel, Notion). Provides quick access to all key site functions through interactive widget cards.

**Architecture (Phase 3.2 Refactoring - Oct 10, 2025):**
- Reduced WidgetDashboard from 376 lines to 77 lines (80% reduction)
- Extracted 7 widget components for modularity and testability
- Shared `WidgetBase.vue` component enforces consistent structure
- Each widget is self-contained with its own logic and styling

#### Widget Grid Layout

```css
.widget-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 columns desktop */
  gap: 24px;
}

/* Responsive breakpoints */
@media (max-width: 1100px) {
  .widget-grid {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns tablet */
  }
}

@media (max-width: 768px) {
  .widget-grid {
    grid-template-columns: 1fr;  /* 1 column mobile */
  }
}
```

#### Widget Card Pattern

```css
.widget {
  background: linear-gradient(180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%);
  border: 1px solid var(--divider-strong);
  box-shadow: 0 12px 28px rgba(4, 9, 14, 0.55);
  display: flex;
  flex-direction: column;
  min-height: 280px;
}

.widget:hover {
  border-color: rgba(var(--sw-rgb), 0.75);
  box-shadow: 0 0 30px rgba(var(--sw-rgb), 0.32);
  transform: translateY(-4px);
}
```

#### Widget Types

**1. Primary Widget (Quick Start)**
- Enhanced visual prominence with orange gradient background
- Includes live player count badge
- Primary CTA for new users

**2. Data Widgets (Live Servers, Top Players)**
- Real-time API data integration
- Skeleton loaders for SSR compatibility
- Top 3 list patterns for glanceable information
- **Player Display Consistency:** Top Players widget matches leaderboard styling exactly
  - Rank insignias (20px size)
  - Clan tags: Courier New monospace, `var(--sw)` orange, 0.75rem
  - Player names: Rajdhani, `var(--t)` white, 0.9rem
  - Zero spacing between clan tag and player name (like in-game)
  - Podium colors for scores: gold (#ffd700), silver (#c0c0c0), bronze (#cd7f32)

**3. Community Widgets**
- Platform-specific icon styling (Discord, YouTube)
- Event countdown integration
- Social engagement metrics

**4. Content Widgets (Latest Videos, Help)**
- Thumbnail previews with text clipping
- Icon-based navigation lists
- Click-to-action patterns

#### Widget Components *(Phase 3.2)*

**1. WidgetBase.vue** (Base Component)
```vue
<WidgetBase
  title="Widget Title"
  icon="icon-name"
  action="Action Text"
  widget-class="custom-class"
  @action-click="handleClick"
>
  <template #default>
    <!-- Widget content goes here -->
  </template>
</WidgetBase>
```

**2. QuickStartWidget.vue** (63 lines)
- Installation quick links and download CTA
- Primary widget with enhanced visual prominence

**3. LiveServersWidget.vue** (86 lines)
- Real-time server status with player counts
- Uses `useServerCapacity` composable for dynamic colors
- Green (<50%), Orange (50-89%), Red (≥90%)

**4. TopPlayersWidget.vue** (87 lines)
- Top 5 leaderboard preview
- Uses `usePlayerDisplay` composable for colorization
- Matches main leaderboard styling exactly

**5. CommunityWidget.vue** (74 lines)
- Upcoming Discord events with countdown
- Empty state for no events

**6. LatestVideosWidget.vue** (86 lines)
- Latest 3 YouTube videos from multiple channels
- Thumbnail, title, author, view count

**7. GettingHelpWidget.vue** (57 lines)
- FAQ quick links and support resources

#### Widget Structure (Legacy/Direct HTML)

```html
<div class="widget">
  <!-- Header: Icon + Title -->
  <div class="widget-header">
    <div class="widget-icon">
      <i class="fa-solid fa-icon"></i>
    </div>
    <h3>Widget Title</h3>
  </div>

  <!-- Body: Main Content -->
  <div class="widget-body">
    <!-- Stats, lists, or content -->
  </div>

  <!-- Footer: Action Link -->
  <div class="widget-footer">
    <span class="widget-action">
      View More <i class="fa-solid fa-arrow-right"></i>
    </span>
  </div>
</div>
```

**Key Features:**
- **Flexible height:** `min-height` ensures consistency, `flex: 1` for body adapts to content
- **Interactive footers:** Arrow icons slide right on hover
- **Responsive scaling:** Widget heights, padding, and font sizes adapt across 7 breakpoints
- **SSR-safe:** Skeleton loaders prevent layout shift during API loading
- **Accessibility:** All widgets are clickable with proper ARIA labels
- **Modular architecture:** Each widget is a standalone component (Phase 3.2)

### Interactive Element Standards

**Universal Hover Pattern:**
- **Inactive state:** Text uses `var(--t2)` (neutral)
- **Hover state:** Background `rgba(var(--sw-rgb), 0.85)`, text `var(--ink)` (dark)
- **Transform:** `scale(1.02-1.03) translateY(-2px)`
- **Transition:** `var(--transition-base)`

### Navigation Components

**File:** [src/assets/styles/modules/components/navigation.css](../src/assets/styles/modules/components/navigation.css)

#### Navigation Tabs (Desktop)
```css
.nav-link {
  border-radius: 3px 3px 0 0; /* Rectangular tabs */
  transition: var(--transition-base);
}

.nav-link:hover {
  background: linear-gradient(180deg,
    rgba(var(--sw-rgb), 0.85) 0%,
    rgba(var(--sw-rgb), 0.68) 100%);
  color: var(--ink);
  transform: scale(1.02) translateY(-2px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 24px rgba(var(--sw-rgb), 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

**Key Features:**
- 3px top border-radius for rectangular aesthetic
- Multi-layer shadows (elevation + glow + highlight)
- Scale + translateY for depth
- Orange gradient with dark text

#### Players Button (Pill Design)
```css
.players-btn-nav {
  height: 52px;
  background: linear-gradient(180deg, rgba(var(--graphite-rgb), 0.9) 0%, rgba(var(--graphite-dark-rgb), 0.95) 100%);
  border: 1px solid rgba(var(--sw-rgb), 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.players-btn-nav:hover {
  background: linear-gradient(180deg,
    rgba(var(--sw-rgb), 0.85) 0%,
    rgba(var(--sw-rgb), 0.68) 100%);
  transform: scale(1.03) translateY(-2px);
}

.players-btn-nav:active {
  background: linear-gradient(180deg, rgba(var(--sw-rgb), 0.95) 0%, rgba(var(--sw-rgb), 0.8) 100%);
  transform: scale(0.98) translateY(0px);
  box-shadow:
    0 1px 8px rgba(0, 0, 0, 0.5),
    0 0 16px rgba(var(--sw-rgb), 0.6),
    inset 0 3px 6px rgba(0, 0, 0, 0.2);
}
```

**Key Features:**
- 52px height with rectangular navigation styling
- Matches navigation tabs design (not pill-shaped)
- Slightly stronger scale (1.03x) for emphasis on hover
- Clear active/pressed state with scale(0.98) and inset shadow
- Optimized for thumb/finger interaction on mobile

#### Mobile Navigation
```css
.mobile-nav {
  position: fixed;
  top: 0;
  right: -100%; /* Off-screen by default */
  width: 100%;
  height: 100vh;
  background: var(--graphite-dark);
  transition: right var(--transition-slow);
}

.mobile-nav.open {
  right: 0; /* Slide in */
}
```

**Features:**
- Full-screen overlay
- Smooth slide animation
- Touch-optimized spacing

### Button System

**File:** [src/assets/styles/modules/components/buttons.css](../src/assets/styles/modules/components/buttons.css)

#### Primary Button (Orange)
```css
.btn-p {
  background: var(--gradient-orange);
  color: var(--ink);
  padding: 12px 24px;
  border-radius: 4px;
  transition: var(--transition-base);
}

.btn-p:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg), var(--glow-orange);
}
```

#### Download Button (Red - Reserved)
```css
.btn-download {
  background: var(--dl);
  color: var(--t);
}
```

**⚠️ Critical Rule:** Reserve `.btn-download` (red) EXCLUSIVELY for executable program downloads (e.g., WIC LIVE). Use `.btn-p` (orange) for standard actions.

#### Game Mode Header Controls

**File:** [src/assets/styles/modules/components/game-mode.css](../src/assets/styles/modules/components/game-mode.css)

Game mode header includes a static status display and interactive exit button.

**Players Online Status (Static Display):**
```css
.gm-status {
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, rgba(var(--graphite-rgb), 0.9) 0%, rgba(var(--graphite-dark-rgb), 0.95) 100%);
  border: 1px solid rgba(var(--sw-rgb), 0.3);
  /* No hover effects - static display */
}
```

**Exit Button (Interactive):**
```css
.gm-btn-base {
  background: linear-gradient(180deg, rgba(var(--graphite-rgb), 0.9) 0%, rgba(var(--graphite-dark-rgb), 0.95) 100%);
  border: 1px solid rgba(var(--sw-rgb), 0.3);
  color: var(--t2);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.gm-btn-base:hover {
  background: linear-gradient(180deg, rgba(var(--sw-rgb), 0.85) 0%, rgba(var(--sw-rgb), 0.68) 100%);
  color: var(--ink);
  transform: scale(1.03) translateY(-2px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 24px rgba(var(--sw-rgb), 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.gm-btn-base:active {
  background: linear-gradient(180deg, rgba(var(--sw-rgb), 0.95) 0%, rgba(var(--sw-rgb), 0.8) 100%);
  transform: scale(0.98) translateY(0px);
  box-shadow:
    0 1px 8px rgba(0, 0, 0, 0.5),
    0 0 16px rgba(var(--sw-rgb), 0.6),
    inset 0 3px 6px rgba(0, 0, 0, 0.2);
}
```

**Game Mode Header:**
```css
.gm-header {
  background: linear-gradient(180deg, rgba(var(--graphite-light-rgb), 0.95) 0%, rgba(var(--graphite-dark-rgb), 0.98) 100%);
  border-bottom: 3px solid rgba(var(--graphite-rgb), 0.85);
  box-shadow:
    0 2px 24px rgba(0, 0, 0, 0.75),
    0 0 36px rgba(var(--graphite-rgb), 0.35);
}
```

**Usage:**
```html
<!-- Players Online status - static display -->
<div class="gm-status">
  <span class="gm-status-count">{{ playerCount }}</span>
  <span class="gm-status-divider" />
  <span class="gm-status-label">Players Online</span>
</div>

<!-- Exit Game Mode button - interactive -->
<button class="gm-btn-base gm-exit" @click="goHome">
  <i class="fa-solid fa-right-from-bracket"></i>
  Exit Game Mode
</button>
```

**Key Features:**
- Game mode header matches navigation's dark graphite background
- `.gm-status` is a static display with no hover effects
- `.gm-btn-base` provides interactive navigation-style hover and active states
- Exit button uses orange gradient hover with `var(--ink)` text
- Clear active/pressed state: scale(0.98), deeper inset shadow
- Multi-layer shadows: elevation + glow + highlight on hover
- Stronger tactile feedback on click/tap for better UX
- Responsive heights: 52px desktop, 44px tablet, 40px mobile

#### Hyperlink Standards
```css
.advanced-setup-link {
  color: var(--sw);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  text-underline-offset: 3px;
  transition: var(--transition-base);
}

.advanced-setup-link:hover {
  color: var(--sw-light);
  border-bottom-color: var(--sw-light);
}
```

**Use Cases:**
- File/ZIP downloads in Advanced Setup sections
- Discord server access links
- External documentation links

**Pattern:** Massgate orange with hover underline, `target="_blank"` for external links.

#### Video Play Button

**Files:**
- [src/assets/styles/modules/components/community.css](../src/assets/styles/modules/components/community.css) (lines 568-598)
- [src/assets/styles/modules/components/videos.css](../src/assets/styles/modules/components/videos.css) (lines 69-98)

**Design:** YouTube-style rounded rectangle play button for video thumbnails.

```css
.play-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 68px;
  height: 48px;
  background: rgba(255, 0, 0, 0.9);  /* YouTube red */
  color: #fff;
  border-radius: 10px;  /* Rounded corners */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

@media (hover: hover) {
  .vid-card:hover .play-over {
    opacity: 1;
  }
}

.vid-card:active .play-over {
  opacity: 1;
  background: rgba(255, 0, 0, 1);
  transform: translate(-50%, -50%) scale(0.95);
}
```

**Key Features:**
- **Shape:** 68px × 48px rounded rectangle (YouTube's 1.42:1 aspect ratio)
- **Color:** YouTube red `rgba(255, 0, 0, 0.9)` - instantly recognizable
- **Corners:** 10px border-radius for YouTube's signature rounded style
- **Icon:** Default Font Awesome `fa-play` - no custom sizing needed
- **Behavior:** Fades in on hover, scales down slightly on click
- **Simple:** Fixed size, no responsive complexity

**Why This Design:**
- Matches YouTube's actual play button shape
- Instantly recognizable to users
- Clean, minimal implementation
- Works well at all screen sizes without breakpoints

### Leaderboard Components

**File:** [src/assets/styles/modules/components/leaderboards.css](../src/assets/styles/modules/components/leaderboards.css)

#### Table Styling
```css
.leaderboard-table {
  background: rgba(var(--panel-rgb), 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.leaderboard-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: var(--transition-fast);
}

.leaderboard-row:hover {
  background: rgba(var(--sw-rgb), 0.1);
}
```

#### Rank Styling
```css
.rank-1 { color: var(--gold); font-weight: bold; }
.rank-2 { color: var(--silver); font-weight: bold; }
.rank-3 { color: var(--bronze); font-weight: bold; }

.podium-1 { background: linear-gradient(135deg,
  rgba(255, 215, 0, 0.2) 0%,
  rgba(255, 215, 0, 0.05) 100%); }
.podium-2 { background: linear-gradient(135deg,
  rgba(192, 192, 192, 0.2) 0%,
  rgba(192, 192, 192, 0.05) 100%); }
.podium-3 { background: linear-gradient(135deg,
  rgba(205, 127, 50, 0.2) 0%,
  rgba(205, 127, 50, 0.05) 100%); }
```

### Community Components

**File:** [src/assets/styles/modules/components/community.css](../src/assets/styles/modules/components/community.css)

#### Creator Badges (Ultra-Compact)
```css
.creator-badge {
  height: 50px;  /* Desktop */
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(var(--panel-rgb), 0.5);
  transition: var(--transition-base);
  color: var(--t2); /* Inactive state */
}

.creator-badge:hover {
  background: linear-gradient(180deg,
    rgba(var(--sw-rgb), 0.85) 0%,
    rgba(var(--sw-rgb), 0.68) 100%);
  color: var(--ink); /* Hover state */
  transform: scale(1.02) translateY(-2px);
}

/* Responsive scaling */
@media (max-width: 900px) {
  .creator-badge { height: 45px; }
}
@media (max-width: 768px) {
  .creator-badge { height: 40px; }
}
```

**Design Evolution:**
- 37% height reduction across breakpoints (from original 80px)
- Standardized `var(--t2)` inactive text color
- Matching navigation hover behavior
- Optimized padding for ultra-clean presentation

#### Event Cards
```css
.event-card {
  background: rgba(var(--panel-rgb), 0.7);
  border-left: 4px solid var(--sw);
  border-radius: 8px;
  padding: 16px;
}

.event-status-live {
  color: var(--dl);
  animation: pulse 2s infinite;
}

.event-countdown {
  font-family: var(--font-data);
  color: var(--sw);
  font-weight: bold;
}
```

### Skeleton Loaders (Progressive Enhancement)

**Files:**
- [src/components/skeletons/LeaderboardSkeleton.vue](../src/components/skeletons/LeaderboardSkeleton.vue)
- [src/components/skeletons/EventsSkeleton.vue](../src/components/skeletons/EventsSkeleton.vue)
- [src/components/skeletons/VideosSkeleton.vue](../src/components/skeletons/VideosSkeleton.vue)

#### Skeleton Pattern
```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(var(--panel-rgb), 0.3) 0%,
    rgba(var(--panel-rgb), 0.5) 50%,
    rgba(var(--panel-rgb), 0.3) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**SEO Enhancement:**
```html
<noscript>
  <p>Loading player leaderboards... (Requires JavaScript)</p>
</noscript>
```

Every skeleton component includes descriptive `<noscript>` fallback for SEO and accessibility.

## Responsive Breakpoints

### Primary Breakpoints

```css
/* Desktop Large */
@media (max-width: 1200px) { /* Typography -5% */ }

/* Desktop Medium */
@media (max-width: 1100px) { /* Nav adjustments */ }

/* Desktop Small */
@media (max-width: 1000px) { /* Compact layouts */ }

/* Tablet */
@media (max-width: 900px) { /* Creator badges -10% */ }

/* Tablet Small */
@media (max-width: 850px) { /* Further compacting */ }

/* Mobile */
@media (max-width: 768px) {
  /* Mobile nav activation */
  /* Typography scales down */
  /* Touch-optimized spacing */
}

/* Mobile Small */
@media (max-width: 480px) { /* Minimal layout */ }
```

### Responsive Strategy

**File:** [src/assets/styles/modules/responsive.css](../src/assets/styles/modules/responsive.css)

1. **Mobile-first approach:** Base styles for mobile, progressively enhance for desktop
2. **Fluid typography:** Scale text smoothly across breakpoints
3. **Touch targets:** Minimum 44px for mobile interactive elements
4. **Dynamic spacing:** Padding/margins adjust with viewport
5. **Content reflow:** Stack columns on narrow screens

## Modular CSS Architecture

### Module Organization

**Base:** [src/assets/styles/base.css](../src/assets/styles/base.css)

Imports all modules in dependency order:
```css
@import './modules/variables.css';
@import './modules/typography.css';
@import './modules/components/navigation.css';
@import './modules/components/buttons.css';
@import './modules/components/leaderboards.css';
/* ... etc */
```

### Component Modules

Each screen/component has dedicated CSS module:

- `navigation.css` (18KB+) - Nav tabs, mobile menu, players button
- `leaderboards.css` (12KB+) - Tables, ranks, medals, podium
- `community.css` (18KB+) - Events, creators, videos, streams
- `hero.css` - Hero section, animated backgrounds
- `getting-started.css` - Onboarding flow styling
- `videos.css` - Video grids, thumbnails
- `about.css` - About section layouts
- `faq.css` - Accordion patterns
- `game-mode.css` - Standalone dashboard
- `players-panel.css` - Slide-in panel
- `toggle.css` - Switch components

**Rule:** When adding styles, create or extend the appropriate module under `assets/styles/modules/components/` and import via `base.css`.

## Hover Effects & Animations

### Standard Hover Pattern

```css
.interactive-element {
  transition: all var(--transition-base);
}

.interactive-element:hover {
  background: linear-gradient(180deg,
    rgba(var(--sw-rgb), 0.85) 0%,
    rgba(var(--sw-rgb), 0.68) 100%);
  color: var(--ink);
  transform: scale(1.02) translateY(-2px);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),      /* Elevation */
    0 0 24px rgba(var(--sw-rgb), 0.4),  /* Glow */
    inset 0 1px 0 rgba(255, 255, 255, 0.15); /* Highlight */
}
```

**Components:**
1. **Scale transform:** 1.02x (subtle) to 1.03x (emphasis)
2. **TranslateY:** -2px for lift effect
3. **Multi-layer shadow:** Elevation + glow + inner highlight
4. **Cubic-bezier easing:** Smooth, professional feel

### Animation Keyframes

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Expandable Section Transitions

**Pattern for smooth expand/collapse animations with v-show directive.**

Used in:
- **Advanced Setup** ([src/screens/GettingStarted.vue](../src/screens/GettingStarted.vue)) - Dedicated Server & Manual Installation sections
- **Videos by Creator** ([src/screens/Community.vue](../src/screens/Community.vue)) - Channel-organized video grid

**CSS Pattern:**

```css
/* Base state (expanded/visible) */
.advanced-content,
.videos-expandable {
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 5000px; /* Large enough for all content */
  opacity: 1;
}

/* Collapsed state (when v-show="false") */
.advanced-content[style*="display: none"],
.videos-expandable[style*="display: none"] {
  max-height: 0;
  opacity: 0;
}
```

**Why This Pattern:**

1. **Works with v-show:** Vue's `v-show` directive toggles `style="display: none"`, which we target with CSS selector
2. **Smooth animations:** `max-height` + `opacity` transitions create polished expand/collapse effect
3. **No layout shifts:** Content stays in DOM (v-show doesn't remove), preventing scroll jumping
4. **SSR-compatible:** All content pre-rendered in HTML for SEO, just initially hidden with CSS

**Component Integration:**

```vue
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const expanded = ref(false); // Initialize collapsed (SSR-safe)

// Read localStorage AFTER hydration to prevent mismatch
onMounted(() => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('section_expanded');
    if (stored === '1') {
      expanded.value = true;
    }
  }
});

// Save preference when toggled
watch(expanded, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('section_expanded', val ? '1' : '0');
  }
});
</script>

<template>
  <label class="toggle">
    <input v-model="expanded" type="checkbox">
    <span class="slider"></span>
    <span class="lbl">{{ expanded ? 'Collapse' : 'Expand' }}</span>
  </label>

  <!-- v-show (not v-if) keeps content in DOM -->
  <div v-show="expanded" class="advanced-content">
    <!-- Content here... -->
  </div>
</template>
```

**Key Files:**
- **CSS:** [src/assets/styles/modules/components/getting-started.css](../src/assets/styles/modules/components/getting-started.css) (lines 404-416)
- **CSS:** [src/assets/styles/modules/components/videos.css](../src/assets/styles/modules/components/videos.css) (lines 281-293)

**Technical Notes:**
- `max-height` must be large enough for all content (5000px for Advanced Setup, 10000px for Videos)
- `overflow: hidden` required for smooth height animation
- `cubic-bezier(0.4, 0, 0.2, 1)` provides professional easing
- Attribute selector `[style*="display: none"]` targets Vue's inline style

**Architecture Reference:**
- Pattern explained: [docs/architecture.md - SSR Hydration Best Practices](architecture.md#ssr-hydration-best-practices)
- Changelog: [docs/changelog.md - Scroll Jumping & Hydration Fix](changelog.md#scroll-jumping--ssr-hydration-fix)

## Navigation Scroll Precision

**⚠️ CRITICAL RULE:** ALWAYS use dynamic header measurement for scroll positioning. NEVER use hardcoded CSS `scroll-margin-top` values or manual pixel calculations.

### Correct Implementation

**File:** [src/utils/scroll.ts](../src/utils/scroll.ts)

```typescript
// ✅ CORRECT: Dynamic measurement at scroll time
export function scrollToSection(sectionId: string, behavior = 'smooth'): void {
  const sectionElement = document.getElementById(sectionId);
  const headerHeight = getNavHeight(); // Dynamic measurement
  const targetY = sectionElement.offsetTop - headerHeight;
  window.scrollTo({ top: targetY, behavior });
}
```

### Incorrect Implementations

```css
/* ❌ WRONG: Hardcoded scroll-margin-top */
section {
  scroll-margin-top: 120px; /* Breaks on responsive */
}
```

```typescript
// ❌ WRONG: Manual pixel calculations
const targetY = sectionElement.offsetTop - 120; // Hardcoded offset
```

**Why Dynamic Measurement:**
- Adapts automatically across all breakpoints (1200px, 900px, 768px, etc.)
- Eliminates ~40 lines of duplicate manual calculations
- Single source of truth in `getNavHeight()`
- Zero maintenance when header design changes

## Color Consistency Rules

### Text Color States

```css
/* Inactive/default state */
.element {
  color: var(--t2); /* Neutral text */
}

/* Hover/active state */
.element:hover {
  color: var(--ink); /* Dark contrast on orange background */
}

/* Dividers and borders */
.divider {
  border-color: var(--t2); /* Inactive */
}

.divider:hover {
  border-color: var(--ink); /* Active */
}
```

**Applied consistently across:**
- Navigation links
- Players button
- Creator badges
- Button components
- Interactive cards

## Accessibility Considerations

### WCAG AA Compliance

- **Headings:** `var(--t)` (#f7fafc) on dark surfaces = 15.8:1 contrast
- **Body text:** `var(--t2)` (#cbd5e0) on dark surfaces = 11.2:1 contrast
- **Interactive elements:** Minimum 3:1 contrast in all states

### Focus States

```css
.interactive-element:focus {
  outline: 2px solid var(--sw);
  outline-offset: 2px;
}

.interactive-element:focus:not(:focus-visible) {
  outline: none; /* Hide outline for mouse users */
}
```

### Touch Targets

Minimum 44x44px for mobile interactive elements:
```css
@media (max-width: 768px) {
  button, a, .interactive {
    min-height: 44px;
    min-width: 44px;
  }
}
```

## Component Scoping

**Rule:** Component-scoped additions should be MINIMAL. Keep global styles in modules for maintainability.

**Example (Vue SFC):**
```vue
<style scoped>
/* Only component-specific overrides */
.unique-component-class {
  /* Minimal styles */
}
</style>
```

**All base styling should reference tokens:**
```vue
<style scoped>
.unique-component-class {
  color: var(--t2);           /* ✅ GOOD: Token reference */
  background: var(--graphite); /* ✅ GOOD */
  /* NOT: color: #cbd5e0; */  /* ❌ BAD: Hardcoded */
}
</style>
```

## Download Button Hierarchy

**Rule:** Reserve different button styles for different action types.

### Button Type Matrix

| Action Type | Class | Color | Use Case |
|------------|-------|-------|----------|
| Executable download | `.btn-download` | Red (`var(--dl)`) | WIC LIVE installer |
| Primary action | `.btn-p` | Orange (`var(--sw)`) | Standard CTAs |
| File/ZIP download | Hyperlink | Orange link | Setup files, assets |
| External link | Hyperlink | Orange link | Discord, docs |

**Examples:**

```html
<!-- ✅ CORRECT: Executable program -->
<button class="btn-download">Download WIC LIVE</button>

<!-- ✅ CORRECT: File download -->
<a href="/files/setup.zip" class="advanced-setup-link">
  Download setup files
</a>

<!-- ✅ CORRECT: Primary action -->
<button class="btn-p">Join Community</button>

<!-- ❌ WRONG: File download as red button -->
<button class="btn-download">Download config.zip</button>
```

## Design System Maintenance

### Adding New Components

1. **Create module:** `src/assets/styles/modules/components/new-component.css`
2. **Use tokens:** Reference `var(--token-name)` exclusively
3. **Import in base.css:** Add import in dependency order
4. **Document patterns:** Update this file with new patterns

### Modifying Tokens

1. **Edit variables.css:** Change token value once
2. **Propagates everywhere:** All components update automatically
3. **Test responsive:** Verify across all breakpoints
4. **Update docs:** Document token changes here

### Responsive Testing Checklist

- [ ] Desktop Large (1200px+)
- [ ] Desktop Medium (1100px-1200px)
- [ ] Desktop Small (1000px-1100px)
- [ ] Tablet (900px-1000px)
- [ ] Tablet Small (850px-900px)
- [ ] Mobile (768px-850px)
- [ ] Mobile Small (<768px)

---

*This document defines the complete design system for WiCGATE. For architectural details, see [architecture.md](architecture.md).*
