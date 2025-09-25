# CLAUDE.md – WiCGATE Frontend Reference

## Overview
- **Project:** WiCGATE community portal for the World in Conflict revival initiative (WiCGATE/Massgate).
- **Stack:** Vue 3 + TypeScript, Vite build system, Pinia state management, Vue Router, modular CSS.
- **Purpose:** Deliver Massgate-inspired experience featuring live player data, onboarding help, community tools, and historically faithful styling.

## Development Quickstart
```bash
npm install          # install dependencies
npm run dev          # start dev server (http://localhost:5173, may use 5175+ if port busy)
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

## Styling & Design System
- **Tokens:** All colors, gradients, shadows, and transitions defined in `src/assets/styles/modules/variables.css`. New work should *only* reference tokens (no hard-coded hex values).
- **Palette highlights:**
  - Steel structure – `--mg`, `--mg-dark`, `--mg-muted`.
  - Graphite navigation surfaces – `--graphite`, `--graphite-dark`, `--graphite-light`.
  - Accents – Massgate orange `--sw`, alert red `--dl`, Discord blue `--d`.
  - Platform/brand tokens – YouTube/Twitch variants, medal colors, panel RGB helpers.
- **Typography:** `typography.css` registers Oswald (headers), Rajdhani (body), Courier New (data), plus scoped utility classes.
- **Component modules:**
  - `navigation.css` (14KB+) – mobile-first responsive nav with full-screen overlay, token-based gradients.
  - `leaderboards.css` (12KB+) – enhanced tables with responsive typography, medal/rank styling, podium classes.
  - `community.css` (18KB+) – Events integration, creator badge system, video grids, Twitch embeds.
  - `hero.css`, `getting-started.css`, `videos.css`, `about.css`, `faq.css`, `buttons.css`, `game-mode.css`, `players-panel.css`, `toggle.css` – each screen/component has its own file.
- **Legacy CSS:** `base-old.css` retained for history; do not edit.

## Recent Changes (September 2025)
- **Major Architecture:** Single-page app structure with section-based navigation instead of multi-page routing.
- **Mobile Navigation Overhaul:** Full-screen mobile nav with smooth animations and enhanced UX.
- **Events System Integration:** Discord-connected events with countdown timers and military-themed status indicators.
- **Content Creator Redesign:** Mobile-friendly compact creator badges in individual sections, eliminating expansion issues.
- **First Visit Experience:** Welcome overlay system for new users with guided onboarding.
- **Live Streaming Integration:** Embedded Twitch streams in Community section with `TwitchEmbed.vue`.
- **Enhanced Responsive Design:** Improved mobile breakpoints, typography scaling, and touch interactions.
- **Expanded Token Library:** hover/plate/panel brand RGB helpers, medals, platform colors with consistent usage.
- **Component Enhancements:** Enhanced leaderboards, refined navigation, improved video management.

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
- Reserve `btn-download` (red) for highest-priority CTAs; `btn-p` (orange) for standard primary actions.
- Maintain adequate contrast (WCAG AA) – headings `var(--t)` on dark surfaces, supporting copy `var(--t2)`/`var(--t3)`.
- Preserve sharp, geometric Massgate aesthetic (avoid rounded corners unless specified).
- Keep responsive breakpoints aligned with existing nav/hero strategies (1200, 1100, 1000, 900, 850, 800px etc.).

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

## Contribution Reminders
- Work from feature branches; keep commits scoped.
- When adding styles, create or extend the appropriate module under `assets/styles/modules/components/` and import via `base.css`.
- Document major visual or content changes in `AGENTS.md` + `CLAUDE.md` for future maintainers.
- Avoid editing `base-old.css`; use it only for historical reference.

---
*This document is the quick-reference guide for future agents/maintainers so they can ramp fast and stay aligned with the Massgate design system.*

## New Features & Components
- **Events System:** Real-time Discord event integration with countdown timers and status tracking.
- **First Visit Experience:** Guided overlay for new users with smart section navigation.
- **Live Streaming:** Embedded Twitch streams with automatic status detection.
- **Enhanced Mobile Navigation:** Full-screen mobile nav with smooth slide animations.
- **Creator Badge System:** Individual content creator sections with mobile-optimized compact badges.
- **Responsive Improvements:** Enhanced breakpoints, typography scaling, and touch interactions.

---
*This document reflects the current state of WiCGATE as of September 2025. Major architectural changes include single-page structure, mobile-first design, and integrated community features.*
