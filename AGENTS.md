# AGENTS.md - WiCGATE Frontend Overview

## Project Outline
- **Stack:** Vue 3 + TypeScript, Vite tooling, modular CSS architecture (assets/styles/modules).
- **Purpose:** Community portal for the World in Conflict multiplayer revival (WiCGATE). Key focus on Massgate-inspired visuals, live player data, onboarding guides, and community resources.

## Visual Identity
- **Palette:**
  - Steel blues (`--mg`, `--mg-dark`) as the structural base.
  - Graphite nav band (`--graphite`, `--graphite-dark`, `--graphite-light`) framing the header/tabs.
  - Massgate orange (`--sw`) for primary accents and headings.
  - Deep Soviet red (`--dl`) reserved for high-attention CTAs (e.g., WIC LIVE download buttons) and leaderboard headers.
- **Typography:** Oswald (headers), Rajdhani (body), Courier New (data). Managed in `src/assets/styles/modules/typography.css`.
- **Global tokens:** Defined in `src/assets/styles/modules/variables.css`.

## Key UI Sections & Styles
- **Navigation (`src/components/Navigation.vue` + `styles/modules/components/navigation.css`):** Graphite bar with orange hover/active tabs, scroll-aware highlighting via an observer in `Home.vue`, lightened mobile toggle, `.logo` handles wordmark styling.
- **Hero (`styles/modules/components/hero.css`):** Dual CTA (download + Discord) with cinematic slideshow.
- **Getting Started (`src/screens/GettingStarted.vue` + `styles/modules/components/getting-started.css`):**
  - Step cards with orange number plaques.
  - Requirements sidebar uses solid orange headings; advanced setup block includes red warning styles.
- **Community (`src/screens/Community.vue` + related styles):** Channel badges, video cards, download CTAs (red), live stream cards.
- **About (`styles/modules/components/about.css`):** Steel panels with orange icon tiles and headers.
- **FAQ (`styles/modules/components/faq.css`):** Accordion with orange category headers and contrast-checked answers.
- **Leaderboards (`styles/modules/components/leaderboards.css`, `src/components/Leaderboards.vue`):** Steel tables with red header band, orange tab highlights on hover/active, alternating row gradients.

## Content & Data
- Static rich text, download links, and onboarding steps live in `src/content/content.ts`.
- Player/server data sourced via `useAppDataStore` (check `src/stores` for API bindings).

## Styling Guidelines
- Use design tokens instead of hard-coded colors.
- Reserve `btn-download` (red) for high-priority actions; `btn-p` (orange) for standard primary actions.
- Prefer `.grad-text` sparingly—if readability suffers on dark backgrounds, override with solid color as done in Getting Started.
- Keep accessibility in mind: headings and body text should sit at least WCAG AA contrast (>4.5:1).

## Build & Quality
- **Scripts:** `npm run dev`, `npm run build`, `npm run lint`, `npm run lint:fix`.
- **Linting:** ESLint with Prettier; format before commits.
- **Entry:** `src/main.ts` bootstraps Vue app; routes defined in `src/router`.

## Future Notes
- When adding new sections, create dedicated CSS modules under `assets/styles/modules/components` and import through `base.css`.
- For new download CTAs, switch to `.btn btn-download` to stay consistent.
- Document major visual adjustments in `AGENTS.md` so future agents retain historical context.
