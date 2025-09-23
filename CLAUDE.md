# CLAUDE.md – WiCGATE Frontend Reference

## Overview
- **Project:** WiCGATE community portal for the World in Conflict revival initiative (WiCGATE/Massgate).
- **Stack:** Vue 3 + TypeScript, Vite build system, Pinia state management, Vue Router, modular CSS.
- **Purpose:** Deliver Massgate-inspired experience featuring live player data, onboarding help, community tools, and historically faithful styling.

## Development Quickstart
```bash
npm install          # install dependencies
npm run dev          # start dev server (http://localhost:5175)
npm run lint         # lint with ESLint + Prettier rules
npm run lint:fix     # auto-fix lint violations
npm run build        # production build (outputs to dist/)
npm run preview      # preview production build
```
- **Editor:** VS Code with Volar/Vetur recommended for Vue 3.
- **Formatting:** Prettier via ESLint – ensure no CRLF when committing.

## Architectural Notes
- **Entry point:** `src/main.ts` wires Vue, router, Pinia, global CSS modules.
- **Routing:** `src/router` handles SPA views (`Home`, `GettingStarted`, `Community`, `Statistics`, `About`, `FAQ`).
- **State:** `src/stores` contains Pinia stores (notably `useAppDataStore` for leaderboards/player counts, and utility stores for UI state).
- **Data layer:** API bindings under `src/api` and `src/stores` fetch Massgate services; mock content kept in `src/content`.
- **Components:** `src/components` hosts shared widgets (navigation, hero, leaderboards, panels). Larger layouts live under `src/screens`.
- **Styling system:** modular CSS under `src/assets/styles/modules`, composed via `base.css`; each screen/component has a dedicated module.

## Styling & Design System
- **Tokens:** All colors, gradients, shadows, and transitions defined in `src/assets/styles/modules/variables.css`. New work should *only* reference tokens (no hard-coded hex values).
- **Palette highlights:**
  - Steel structure – `--mg`, `--mg-dark`, `--mg-muted`.
  - Graphite navigation surfaces – `--graphite`, `--graphite-dark`, `--graphite-light`.
  - Accents – Massgate orange `--sw`, alert red `--dl`, Discord blue `--d`.
  - Platform/brand tokens – YouTube/Twitch variants, medal colors, panel RGB helpers.
- **Typography:** `typography.css` registers Oswald (headers), Rajdhani (body), Courier New (data), plus scoped utility classes.
- **Component modules:**
  - `navigation.css` – top nav, responsive breakpoints, token-based gradients.
  - `leaderboards.css` – tables with medal/rank styling, shared podium classes, new clan-tag + player styling.
  - `hero.css`, `getting-started.css`, `community.css`, `videos.css`, `about.css`, `faq.css`, `buttons.css`, `game-mode.css`, etc. – each screen/component has its own file.
- **Legacy CSS:** `base-old.css` retained for history; do not edit. `temp_variables.css` removed.

## Recent Changes (September 2025)
- Expanded token library (hover/plate/panel brand RGB helpers, medals, platform colors).
- Converted navigation and leaderboard tabs to shared palette tokens for consistent inactive + hover states.
- Clan tags now use Massgate orange token; top-three player names revert to neutral text while ranks/scores retain medal colors.
- Removed direct color literals across navigation, hero, community, getting-started, about, leaderboard, FAQ, game-mode, videos, responsive helpers.
- Updated AGENTS.md to document token usage and historical adjustments.
- Community "By Content Creator" block now uses the shared `.vid-hdr` header treatment with a spacing helper so it matches Live Streams/Latest Videos tabs.

## Content & Data
- **Static content:** `src/content/content.ts` holds hero copy, onboarding steps, community links.
- **Live data:** `useAppDataStore` orchestrates API fetches for players online, leaderboards, server lists. Supporting utilities in `src/utils` (e.g. `playerDisplay.ts` for clan tag formatting/color parsing).
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
│  ├─ Navigation.vue
│  ├─ LeaderboardGroup.vue
│  ├─ RankInsignia.vue
│  └─ …
├─ screens/
│  ├─ Home.vue
│  ├─ GettingStarted.vue
│  ├─ Community.vue
│  ├─ Statistics.vue
│  ├─ About.vue
│  └─ FAQ.vue
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
│           ├─ getting-started.css
│           ├─ videos.css
│           ├─ about.css
│           ├─ faq.css
│           ├─ game-mode.css
│           └─ …
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

