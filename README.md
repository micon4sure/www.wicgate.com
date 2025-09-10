# WICGATE Vue 3 (TypeScript)

Reimplementation of the original monolith `monolith.html` as a structured Vue 3 + TypeScript SPA with router and modular components while preserving 1:1 visual fidelity.

## Tech Stack
- Vue 3 + `<script setup lang="ts">`
- Vite build tool
- Vue Router
- PostCSS + Autoprefixer

## Routes
- `/` Main marketing + stats page (sections: Hero, Getting Started, Statistics, Community, FAQ + Footer, Players panel overlay)
- `/gamemode` Full-screen Game Mode statistics dashboard

## Key Components
- `Navigation.vue` Top nav / hero navigation
- `PlayersOnline.vue` Slide-in players panel (persisted lock state in `localStorage`)
- `Leaderboards.vue` Tabbed leaderboards (High / Total / Player / Clan placeholder)
- `Scores.vue` Reusable scoreboard card used in Game Mode
- `Footer.vue` Site footer

## Composables
- `useAppData.ts` Handles periodic API polling (`/api/data`) every 60s and updates player online body classes.

## Content
Static content extracted to `src/content/content.ts` for easier future translation / editing.

## Development
```powershell
npm install
npm run dev
```

## Build
```powershell
npm run build
```
Output goes to `dist/`.

## Deployment (GitHub Pages)
This repo is configured for automatic deployment to GitHub Pages using the workflow at `.github/workflows/deploy.yml`.

1. Ensure the repository name on GitHub is `www.wicgate.com` (or adjust the CNAME/workflow if different).
2. In the repo settings under Pages, set Source to GitHub Actions.
3. DNS: Point the `www` CNAME record to `micon4sure.github.io` (and optionally configure an apex redirect via your DNS provider).
4. Push to `master` — the workflow builds and deploys the `dist` folder.
5. HTTPS: After first deploy, enable Enforce HTTPS in Pages settings.

If you fork or rename:
- Update `CNAME` file with the new domain (or remove it if none).
- Adjust `echo "www.wicgate.com" > dist/CNAME` line in the workflow.

To trigger a manual redeploy: use the Actions tab > Deploy to GitHub Pages > Run workflow.

## Styling
All global styles are consolidated in `src/assets/styles/base.css` (extracted from original monolith). Component-scoped additions are minimal to keep maintainability high. Autoprefixer provides vendor prefixes for better cross-browser support.

## Future Enhancements
- Extract remaining static subsections (videos, playlists, streams) into dedicated components
- Introduce a lightweight state management (Pinia) if API surface grows
- Add unit tests (Vitest) for composables
- Implement real image/thumb loading for videos & playlists

## License
Custom / Project-specific (add one if needed). Not affiliated with Ubisoft or Massive Entertainment.
