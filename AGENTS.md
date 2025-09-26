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
- **Navigation (`src/components/Navigation.vue` + `styles/modules/components/navigation.css`):** Graphite bar with orange default labels that flip to light/graphite plates on hover/active (Massgate style), **pixel-perfect dynamic scroll positioning** with real-time header measurement eliminating all hardcoded calculations, lightened mobile toggle, `.logo` handles wordmark styling.
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
## Recent Updates (2025-09-23)
- Leaderboard tables now share an explicit <colgroup> with fixed rank/score widths plus responsive tweaks, while podium cells reuse shared classes so only the text adopts gold/silver/bronze tones.
- Hover styling on leaderboard rows no longer forces color: var(--t), which keeps podium scores tinted correctly during highlight.
- Players Online panel extracted scroll-lock helpers, re-applies them on viewport resize, and cleans up on unmount to prevent ody.panel-open-mobile from freezing page scroll.
- Ran `npm run lint -- --fix` to normalize formatting; expect LF-preferred formatting even on Windows checkouts.
## Recent Updates (2025-09-24)
- Expanded `variables.css` with rgb helpers plus brand/medal and hover panel tokens so components can drop hard-coded hex values.
- Replaced direct colour literals across navigation, hero, community (including live streams), getting started, about, leaderboards, FAQ, game-mode, videos, and button styles with the shared tokens.
- Updated `LeaderboardGroup.vue` and `playerDisplay.ts` to use the new clan/player token colours so scoreboard styling stays consistent with CSS.
- Removed the unused `temp_variables.css` palette stub and cleaned up legacy files.




## Recent Updates (2025-09-25)
- Community "By Content Creator" header now reuses the shared `.vid-hdr` Massgate banner, keeping it visually aligned with Live Streams and Latest Videos. Added `.by-channel-hdr` helper in `Community.vue` to preserve spacing when the channels list expands.

- Community channel badges now flip to a full Massgate orange fill on hover while keeping text/icons dark, improving readability in the By Content Creator list.

## Recent Updates (2025-09-26)
- **🚀 Pixel-Perfect Navigation Revolution:** Complete elimination of all hardcoded scroll calculations in favor of dynamic header measurement system. Navigation links now provide exact section positioning across all breakpoints without manual guesswork.
- **Dynamic Measurement Architecture:** Implemented real-time `offsetHeight` measurement of header banner and navigation elements, replacing ~40 lines of hardcoded CSS `scroll-margin-top` rules.
- **Responsive Adaptation:** Automatic buffer calculations for mobile viewport quirks, ensuring precision across desktop, tablet, and mobile devices.
- **Performance Optimization:** Added passive scroll listeners, debounced resize handling, and proper memory cleanup for smooth navigation experience.
