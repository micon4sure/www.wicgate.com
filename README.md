# WICGATE Vue 3 (TypeScript)

Reimplementation of the original monolithic prototype as a structured Vue 3 + TypeScript SPA with router and modular components while preserving 1:1 visual fidelity.

## Tech Stack

- Vue 3 + `<script setup lang="ts">`
- Vite build tool
- Vue Router
- PostCSS + Autoprefixer

## Routes

- `/` Main marketing + stats page (sections: Hero, Getting Started, Statistics, Community, FAQ + Footer, Players panel overlay)
- `/gamemode` Full-screen Game Mode statistics dashboard

## Key Components

- `Navigation.vue` Top nav / hero navigation with **pixel-perfect dynamic scroll positioning**
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

The site deploys automatically via `.github/workflows/deploy.yml` to:

Primary (GitHub Pages path): https://micon4sure.github.io/www.wicgate.com/
Custom Domain (after DNS): https://www.wicgate.com/

### How it works

- `vite.config.ts` sets `base: './'` so built asset URLs are relative, functioning in both locations.
- Router base is chosen at runtime (`/www.wicgate.com/` if path contains that segment, otherwise `/`).
- Workflow copies `index.html` to `404.html` for History API fallback on refresh/deep links.
- `CNAME` is injected so GitHub Pages serves the custom domain when DNS is ready.

### Steps to finalize

1. Confirm repo name is `www.wicgate.com` (matches deployed path used by detection logic).
2. GitHub > Settings > Pages: Source = GitHub Actions.
3. DNS: Set `www` CNAME → `micon4sure.github.io`.
4. (Optional) Apex/root redirect handled at DNS provider (ALIAS/ANAME or redirect).
5. After propagation, enable "Enforce HTTPS".

### If you fork/rename

Update:

- `runtimeBase` logic in `src/main.ts` if repo folder changes.
- The `CNAME` addition step or remove it if no custom domain.
- Optionally set a different `base` in `vite.config.ts` if you prefer absolute paths.

### Manual redeploy

Use Actions tab → Deploy to GitHub Pages → Run workflow.

### Local test of production build

```powershell
npm run build
npx serve dist  # or any static server
```

## Styling

All global styles are consolidated in `src/assets/styles/base.css` (extracted from original monolith). Component-scoped additions are minimal to keep maintainability high. Autoprefixer provides vendor prefixes for better cross-browser support.

## Future Enhancements

- Extract remaining static subsections (videos, playlists, streams) into dedicated components
- Introduce a lightweight state management (Pinia) if API surface grows
- Add unit tests (Vitest) for composables
- Implement real image/thumb loading for videos & playlists

## License

Custom / Project-specific (add one if needed). Not affiliated with Ubisoft or Massive Entertainment.
