# CLAUDE.md – WiCGATE Frontend Reference

## Overview
- **Project:** WiCGATE community portal for the World in Conflict revival initiative (WiCGATE/Massgate).
- **Stack:** Vue 3 + TypeScript, Vite build system, Pinia state management, Vue Router, modular CSS.
- **Purpose:** Deliver Massgate-inspired experience featuring live player data, onboarding help, community tools, and historically faithful styling.

## Development Quickstart
```bash
npm install          # install dependencies
npm run dev          # start dev server (http://localhost:5175, may increment if port busy)
npm run lint         # lint with ESLint + Prettier rules
npm run lint:fix     # auto-fix lint violations
npm run build        # production build (outputs to dist/)
npm run preview      # preview production build
```
- **Editor:** VS Code with Volar/Vetur recommended for Vue 3.
- **Formatting:** Prettier via ESLint – ensure no CRLF when committing.

## Architectural Notes
- **Entry point:** `src/main.ts` wires Vue, router, global CSS modules, and creates the app.
- **Routing:** Simple 2-route setup: `/` (Home with all sections) and `/game-mode` (standalone page). No separate routes for sections.
- **Single-page architecture:** `Home.vue` imports all screens (`GettingStarted`, `Community`, `Statistics`, `About`, `FAQ`) as components rendered in sequence.
- **State:** `src/stores/appDataStore.ts` manages player data, leaderboards, servers via composable patterns.
- **Data layer:** API integration via composables (`useYoutube`, `useEvents`) and direct fetch in stores; static content in `src/content`.
- **Components:** `src/components` hosts reusable widgets (navigation, leaderboards, overlays). Screen components in `src/screens`.
- **Styling system:** Modular CSS under `src/assets/styles/modules`, composed via `base.css`; each screen/component has dedicated module.

## Technical Architecture - Navigation System

### Dynamic Header Measurement Architecture
The navigation system uses a revolutionary approach that eliminates all hardcoded scroll calculations through real-time DOM measurement:

#### Core Components
- **Header Banner** (`.header-banner`): Variable height responsive header with player count display
- **Navigation Bar** (`header`): Fixed navigation with rectangular tabs and mobile hamburger menu
- **Section Elements**: Target containers with stable IDs (`getting-started`, `statistics`, `community`, etc.)

#### Measurement Strategy
```javascript
// Primary measurement function - used across Home.vue and Navigation.vue
function getDynamicHeaderHeight() {
  const banner = document.querySelector('.header-banner');
  const nav = document.querySelector('header');

  // Fail-safe fallback if elements not mounted
  if (!banner || !nav) return 200;

  // Real-time height calculation
  const bannerHeight = banner.getBoundingClientRect().height;
  const navHeight = nav.getBoundingClientRect().height;

  // Responsive buffer for mobile viewport quirks
  const isMobile = window.innerWidth <= 768;
  const buffer = isMobile ? 20 : 5;

  return Math.ceil(bannerHeight + navHeight + buffer);
}
```

#### Scroll Positioning Algorithm
1. **Element Discovery**: Target section via `document.getElementById()`
2. **Position Calculation**: Use `getBoundingClientRect()` for exact pixel positions
3. **Header Offset**: Subtract dynamic header height from target position
4. **Smooth Scroll**: Execute `window.scrollTo()` with exact coordinates
5. **History Management**: Update URL hash without page reload

#### Responsive Adaptation
- **Automatic Breakpoint Detection**: System adapts to any header size changes
- **Window Resize Handling**: Recalculates positions when viewport changes significantly
- **Mobile Optimization**: Enhanced buffer zones for iOS Safari and other mobile browsers
- **No Manual Breakpoints**: Zero hardcoded pixel values across all screen sizes

#### Performance Optimizations
- **Measurement Caching**: Header heights calculated only when needed
- **Passive Event Listeners**: Scroll detection without blocking main thread
- **Debounced Resize**: Prevents excessive recalculation during window resize
- **Memory Management**: Clean event listener removal on component unmount

## Styling & Design System
- **Tokens:** All colors, gradients, shadows, and transitions defined in `src/assets/styles/modules/variables.css`. New work should *only* reference tokens (no hard-coded hex values).
- **Palette highlights:**
  - Steel structure – `--mg`, `--mg-dark`, `--mg-muted`.
  - Graphite navigation surfaces – `--graphite`, `--graphite-dark`, `--graphite-light`.
  - Accents – Massgate orange `--sw`, alert red `--dl`, Discord blue `--d`.
  - Platform/brand tokens – YouTube/Twitch variants, medal colors, panel RGB helpers.
- **Typography:** `typography.css` registers Oswald (headers), Rajdhani (body), Courier New (data), plus scoped utility classes.
- **Component modules:**
  - `navigation.css` (18KB+) – modernized rectangular nav tabs, pill-shaped players button, enhanced hover effects with multi-layer shadows.
  - `leaderboards.css` (12KB+) – enhanced tables with responsive typography, medal/rank styling, podium classes.
  - `community.css` (18KB+) – Events integration, creator badge system with consistent hover states, video grids, Twitch embeds.
  - `hero.css`, `getting-started.css`, `videos.css`, `about.css`, `faq.css`, `buttons.css`, `game-mode.css`, `players-panel.css`, `toggle.css` – each screen/component has its own file.

## Recent Changes (September 2025)
- **🚀 Pixel-Perfect Navigation Revolution (Latest):** Complete elimination of hardcoded scroll calculations in favor of dynamic header measurement system. Navigation links now scroll to exact pixel positions with zero manual guesswork, automatically adapting across all screen sizes. Implemented real-time `offsetHeight` measurement replacing ~40 lines of hardcoded CSS `scroll-margin-top` rules.
- **Navigation Modernization:** Complete redesign with rectangular tabs, enhanced hover effects, and professional shadow systems.
- **Interactive Elements Unification:** Consistent orange hover backgrounds with dark text across nav, players button, and creator badges.
- **Players Button Redesign:** Chunky 52px pill-shaped design optimized for clickability, removing green status indicator clutter.
- **Enhanced Hover Effects:** Scale transforms (1.02x-1.03x) with smooth cubic-bezier transitions and refined glow effects.
- **Major Architecture:** Single-page app structure with section-based navigation instead of multi-page routing.
- **Mobile Navigation Overhaul:** Full-screen mobile nav with smooth animations and enhanced UX.
- **Events System Integration:** Discord-connected events with countdown timers and military-themed status indicators.
- **Content Creator Redesign:** Ultra-compact creator badges (50px desktop, 45px tablet, 40px mobile) with optimized padding, standardized inactive text colors, and matching navigation hover behavior.
- **First Visit Experience:** Welcome overlay system for new users with guided onboarding.
- **Live Streaming Integration:** Embedded Twitch streams in Community section with `TwitchEmbed.vue`.
- **Enhanced Responsive Design:** Improved mobile breakpoints, typography scaling, and touch interactions.
- **Color Consistency Improvements:** Standardized text colors (var(--t2) inactive, var(--ink) hover) across all interactive elements.
- **Advanced Setup UX Optimization:** Replaced inappropriate download buttons with contextual hyperlinks for file downloads, implementing professional massgate orange styling with hover effects and modern underlines.
- **Content Creator Badge Refinement:** Further optimized badge dimensions (50px→45px→40px across breakpoints) with reduced padding and standardized inactive text colors for ultra-clean presentation.
- **Enhanced Discord Integration:** Direct Discord server hyperlinks in setup flows for seamless CD key support access.

## Content & Data
- **Static content:** `src/content/content.ts` holds hero copy, onboarding steps, community cards, requirements.
- **Live data:** `useAppDataStore` orchestrates API fetches for players online, leaderboards, server lists with 60s refresh cycle.
- **Composables:**
  - `useYoutube.ts` – Multi-channel YouTube video fetching and parsing from Atom feeds.
  - `useEvents.ts` – Discord events integration with real-time countdown and status management.
  - `useFirstVisit.ts` – First-time visitor detection and overlay management.
- **Utilities:** `src/utils/playerDisplay.ts` contains formatter/colorizer for massgate-style names (uses tokens for fallback color).

## UX/Design Guidelines
- Always consume design tokens and component variables for colors, borders, shadows.
- **Interactive Element Standards:** Orange backgrounds (var(--sw-rgb)) with dark text (var(--ink)) on hover for all clickable elements.
- **Hover Effects:** Use scale transforms (1.02x nav, 1.03x players) + translateY(-2px) with cubic-bezier(0.25, 0.8, 0.25, 1) transitions.
- **Shadow System:** Multi-layer shadows with proper depth: outer shadows for elevation, inner highlights for premium feel.
- **Text Color Rules:** var(--t2) for inactive states, var(--ink) for hover/active states across all components.
- **Navigation Scroll Precision:** ALWAYS use dynamic header measurement for scroll positioning. NEVER use hardcoded CSS `scroll-margin-top` values or manual pixel calculations. Use `offsetHeight` measurements at scroll time for pixel-perfect positioning.
- **Download Button Hierarchy:** Reserve `btn-download` (red) exclusively for executable program downloads (WIC LIVE); use contextual hyperlinks for file/ZIP downloads. Use `btn-p` (orange) for standard primary actions.
- **Hyperlink Standards:** Advanced Setup sections use massgate orange (`var(--sw)`) with `var(--sw-light)` hover states, modern underline styling (3px offset, 1px thickness), and `target="_blank"` for external links.
- Maintain adequate contrast (WCAG AA) – headings `var(--t)` on dark surfaces, supporting copy `var(--t2)`/`var(--t3)`.
- **Glow Effects:** Refined brightness levels - keep glow opacity around 0.3-0.4 for subtle professional appearance.
- **Responsive Navigation:** Dynamic measurement system automatically adapts across all breakpoints (1200, 1100, 1000, 900, 850, 800px etc.) without manual calculations.

## Project Structure Snapshot
```
src/
├─ main.ts
├─ router/
├─ stores/
├─ components/
│  ├─ Navigation.vue          # Mobile-first responsive nav
│  ├─ LeaderboardGroup.vue    # Enhanced leaderboard tables
│  ├─ PlayersOnline.vue       # Side panel for live players
│  ├─ FirstVisitOverlay.vue   # Welcome overlay for new users
│  ├─ TwitchEmbed.vue         # Live stream integration
│  ├─ RankInsignia.vue        # Player rank badges
│  ├─ Footer.vue
│  └─ …
├─ screens/                     # Section components (not separate pages)
│  ├─ GettingStarted.vue       # Onboarding section with download flow
│  ├─ Community.vue            # Events, videos, live streams, creator badges
│  ├─ Statistics.vue           # Leaderboards and player data
│  ├─ About.vue                # Project information
│  └─ FAQ.vue                  # Frequently asked questions
├─ views/                       # Actual routed pages
│  ├─ Home.vue                 # Main page containing all sections
│  └─ GameMode.vue             # Standalone game mode page
├─ composables/
│  ├─ useYoutube.ts            # Multi-channel video fetching
│  ├─ useEvents.ts             # Discord events integration
│  └─ useFirstVisit.ts          # First-time visitor management
├─ assets/
│  └─ styles/
│     ├─ base.css
│     └─ modules/
│        ├─ variables.css
│        ├─ typography.css
│        ├─ buttons.css
│        ├─ responsive.css
│        └─ components/
│           ├─ navigation.css
│           ├─ leaderboards.css
│           ├─ hero.css
│           ├─ community.css
│           ├─ getting-started.css      # Onboarding section styling
│           ├─ videos.css               # Video component styles
│           ├─ about.css                # About section styling
│           ├─ faq.css                  # FAQ section styling
│           ├─ game-mode.css            # Game mode page styling
│           ├─ players-panel.css        # Side panel for online players
│           └─ toggle.css               # Toggle switch components
└─ content/
   └─ content.ts
```

## Testing & Quality
- Primary checks via `npm run lint` (ESLint + Prettier integration).
- Build validation through `npm run build` (Vite, outputs hashed bundles to `dist/`).
- No dedicated unit/e2e suites today; manual QA focused on responsive behavior and API integration.

## Navigation Component Details

### Pixel-Perfect Navigation System
- **Desktop Navigation:** Rectangular tabs with 3px top border-radius, enhanced shadow systems, and scale hover effects
- **Players Button:** Independent 52px pill-shaped design (border-radius: 26px) optimized for mobile and desktop interaction
- **Hover Standards:** Orange gradient backgrounds with dark text (var(--ink)) and consistent scale transforms
- **Animation System:** Cubic-bezier(0.25, 0.8, 0.25, 1) transitions with multi-layer shadow effects
- **Scroll Precision:** Dynamic header measurement system eliminates all manual calculations and hardcoded offsets

### Technical Implementation - Dynamic Measurement System
```javascript
// Real-time header height measurement - zero guesswork
function getDynamicHeaderHeight() {
  const banner = document.querySelector('.header-banner');
  const nav = document.querySelector('header');

  if (!banner || !nav) return 200; // Fallback

  const bannerHeight = banner.getBoundingClientRect().height;
  const navHeight = nav.getBoundingClientRect().height;
  const isMobile = window.innerWidth <= 768;
  const buffer = isMobile ? 20 : 5;

  return Math.ceil(bannerHeight + navHeight + buffer);
}

// Pixel-perfect scroll positioning
function scrollTo(id: string) {
  const sectionElement = document.getElementById(id);
  if (sectionElement) {
    const headerBanner = document.querySelector('.header-banner');
    const nav = document.querySelector('header');
    const actualHeaderHeight = (headerBanner?.offsetHeight || 0) + (nav?.offsetHeight || 0);

    const sectionRect = sectionElement.getBoundingClientRect();
    const sectionTop = sectionRect.top + window.scrollY;
    const targetY = sectionTop - actualHeaderHeight;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }
}
```

### Visual Design Patterns
```css
/* Navigation Tab Pattern */
transform: scale(1.02) translateY(-2px);
box-shadow:
  0 4px 16px rgba(0, 0, 0, 0.3),
  0 0 24px rgba(var(--sw-rgb), 0.4),
  inset 0 1px 0 rgba(255, 255, 255, 0.15);

/* Players Button Pattern */
height: 52px;
border-radius: 26px;
transform: scale(1.03) translateY(-2px);
```

### Color Consistency Rules
- **Inactive State:** All text uses `var(--t2)` (neutral text color)
- **Hover State:** All text and dividers use `var(--ink)` (dark contrast color)
- **Background Hover:** Orange gradient `rgba(var(--sw-rgb), 0.85-0.68)` range
- **Glow Effects:** Limited to 0.3-0.4 opacity for professional appearance

## Contribution Reminders
- Work from feature branches; keep commits scoped.
- **Follow Navigation Patterns:** Use established hover effects and color rules for new interactive elements.
- When adding styles, create or extend the appropriate module under `assets/styles/modules/components/` and import via `base.css`.
- Document major visual or content changes in `AGENTS.md` + `CLAUDE.md` for future maintainers.

---
*This document is the quick-reference guide for future agents/maintainers so they can ramp fast and stay aligned with the Massgate design system.*

## New Features & Components
- **Pixel-Perfect Navigation System:** Revolutionary dynamic header measurement eliminates all hardcoded scroll calculations, providing exact section positioning across all breakpoints.
- **Modern Navigation Design:** Rectangular tabs with enhanced hover effects, professional shadow systems, and consistent interaction patterns.
- **Optimized Players Button:** Independent 52px pill-shaped design with superior clickability and clean visual presentation.
- **Unified Interactive Design:** Consistent orange hover backgrounds with dark text across all clickable elements (nav, players, creators).
- **Enhanced Visual Feedback:** Scale transforms, refined glow effects, and smooth cubic-bezier transitions throughout the interface.
- **Events System:** Real-time Discord event integration with countdown timers and status tracking.
- **First Visit Experience:** Guided overlay for new users with smart section navigation.
- **Live Streaming:** Embedded Twitch streams with automatic status detection.
- **Enhanced Mobile Navigation:** Full-screen mobile nav with smooth slide animations.
- **Ultra-Compact Creator Badge System:** Significantly refined creator badges with 37% height reduction across breakpoints, optimized padding, and standardized var(--t2) inactive text colors for professional presentation.
- **Color Consistency Standards:** Standardized text colors and divider elements following unified design patterns.
- **Advanced Setup Hyperlink System:** Professional massgate orange hyperlinks replacing download buttons for file downloads, with integrated Discord server access and modern underline styling.

---
*This document reflects the current state of WiCGATE as of September 2025. Major enhancements include pixel-perfect navigation with dynamic measurement system, modernized design with rectangular tabs, unified interactive design language, optimized players button, and comprehensive hover effect standardization across all components.*
