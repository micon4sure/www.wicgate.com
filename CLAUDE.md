# CLAUDE.md - WiCGate Gaming Platform

**What this is:** Vue 3 + TypeScript single-page application for World in Conflict gaming community. Features real-time player tracking, leaderboards, Discord events, community integration, and comprehensive project information.

## 🔧 Development Setup

```bash
# Install and run
npm install
npm run dev          # Development server (localhost:5173)

# Code quality (run these before commits)
npm run lint         # Check for errors
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format code with Prettier

# Production
npm run build        # Build for production (1.76s)
npm run preview      # Preview production build
```

## 🏗️ What Was Done (Modularization & Enhancement Work)

### CSS Modularization
- **Before:** Single 2783-line `base.css` file (hard to maintain)
- **After:** 20 organized CSS modules in `src/assets/styles/modules/`
- **Active file:** `base.css` imports all modules in correct order
- **Legacy file:** `base-old.css` (original monolithic CSS, no longer used)
- **Result:** Zero style duplications, organized by purpose (variables, typography, components, etc.)

### Recent Feature Additions
- **About Section:** Complete project information with mission, story, team, and values
- **Enhanced Navigation:** 5-section navigation with optimized responsive breakpoints
- **Content Management:** Centralized content structure with team member profiles and project values
- **CSS Architecture:** Self-contained modular components following established patterns

### JavaScript Optimization
- **Route Splitting:** GameMode page loads on-demand (2.45kB separate chunk)
- **Tree Shaking:** Lodash imports only needed functions (`orderBy`, `map`)
- **Centralized Utils:** Common functions moved to `src/utils/index.ts`
- **Removed Redundant:** Deleted unnecessary `useAppData.ts` file

### Security Hardening
- **XSS Prevention:** Player names render as plain text (no HTML injection)
- **Dependencies:** Updated axios 1.11.0 → 1.12.2 (fixes DoS vulnerability)
- **Production Logging:** Console statements only show in development

### Development Improvements
- **Sass Modern API:** Fixed deprecation warning by configuring Vite to use `modern-compiler` API
- **Responsive Design:** Enhanced navigation breakpoints (950px) to accommodate expanded navigation

## 📁 Project Structure

```
src/
├── assets/styles/
│   ├── base.css                  # ACTIVE: imports all 20 CSS modules
│   ├── base-old.css              # LEGACY: original monolithic CSS
│   └── modules/                  # CSS modules (variables, components, etc.)
│       └── components/           # Component-specific styles (about.css, navigation.css, etc.)
├── components/                   # 10 utility components (Navigation, PlayersOnline, etc.)
├── screens/                      # 5 section components (GettingStarted, Community, About, etc.)
├── views/                        # 2 main pages: Home.vue, GameMode.vue (code-split)
├── composables/                  # API integration: useEvents, useYoutube, useFirstVisit
├── utils/                        # Shared functions: playerDisplay, date formatting
├── stores/                       # State management: appDataStore.ts
├── content/                      # Static content: FAQ, About section data, requirements
├── api-types.ts                  # TypeScript interfaces for API responses
└── main.ts                       # App entry: router setup, code splitting
```

## 🛠️ Tech Stack

**Core:**
- Vue 3.4.29 (Composition API with `<script setup>`)
- TypeScript 5.4.5 (strict mode)
- Vue Router 4.3.0 (with code splitting)
- Vite 5.2.0 (build tool)

**Styling:**
- Modular CSS architecture (20 modules)
- Sass 1.92.1 for preprocessing
- Font Awesome 6.5.2 for icons
- Mobile-first responsive design

**Data & API:**
- Axios 1.12.2 for HTTP requests
- Lodash 4.17.21 (tree-shaken)
- API endpoint: `https://www.wicgate.com/api`
- Environment variable: `VITE_API_BASE`

## 📦 Build Output

Production build creates optimized chunks:
- **vendor-[hash].js** (91.48kB): Vue, Vue Router
- **index-[hash].js** (79.47kB): Main application code
- **lodash-[hash].js** (70.48kB): Utility functions
- **GameMode-[hash].js** (2.45kB): Dashboard page (loaded on-demand)
- **index-[hash].css** (115.17kB): All styles combined

## 🌟 Key Features

**Site Sections:**
1. **Hero/Home** - Player counts, featured content, call-to-action
2. **Getting Started** - Installation guide, requirements, step-by-step setup
3. **Statistics** - Live leaderboards, player rankings, game statistics
4. **Community** - Discord, YouTube, Twitch integration with live data
5. **About** - Project mission, team information, development approach, values
6. **FAQ** - Comprehensive troubleshooting and information

**Real-time Gaming Data:**
- Live player counts with 60-second polling
- Interactive leaderboards (multiple categories)
- Server status and player grouping
- Game Mode dashboard (full-screen overlay)

**Community Integration:**
- Discord events with countdown timers
- YouTube video feeds
- Twitch stream embeds
- FAQ system with search

**Project Information:**
- Mission statement and development story
- Team member profiles and roles
- Project values and technical approach
- Community contribution guidelines

**User Experience:**
- Mobile-first responsive design (navigation collapses at 950px)
- Touch-optimized interactions
- Persistent panel state (localStorage)
- Smooth animations and transitions
- Proper scroll positioning for all sections

## 🔒 Security Features

- **XSS Protection:** User input (player names) rendered safely as plain text
- **Server Names:** Admin-controlled content can use colorization
- **Secure Dependencies:** All packages updated to patch vulnerabilities
- **Production Safety:** Debug information removed from production builds

## 🚀 Deployment

**GitHub Pages Ready:**
- Automatic deployment on push to master
- Supports both custom domain and GitHub Pages subpath
- SPA routing with fallback handling
- Optimized asset caching with hash-based filenames

**Environment Setup:**
```bash
# Optional: Set custom API endpoint
VITE_API_BASE=https://your-api-domain.com/api
```

## ✅ Current Status

**Production Ready** - All features working, security audited, performance optimized.

- Zero lint errors, TypeScript strict mode
- All original functionality preserved + About section added
- Security vulnerabilities resolved
- Build time: 1.76 seconds
- Bundle size optimized with code splitting
- Enhanced navigation with proper responsive design
- Comprehensive project documentation

## 📚 Content Management

**About Section Content** (`src/content/content.ts`):
- `aboutProject`: Mission, story, and technical approach
- `teamMembers`: Team profiles with roles and descriptions
- `projectValues`: Core principles (Authentic Experience, Community Driven, Fair Competition, Open Source Spirit)

**Navigation Structure:**
1. Getting Started → Installation and setup
2. Statistics → Live player data and leaderboards
3. Community → Discord, YouTube, Twitch integration
4. About → Project information and team
5. FAQ → Troubleshooting and support

## 🎨 CSS Architecture

**Modular System** (20 modules):
- **Core:** variables.css, reset.css, typography.css, layout.css
- **Components:** navigation.css, hero.css, about.css, community.css, etc.
- **Utilities:** buttons.css, utilities.css, animations.css
- **Responsive:** responsive.css with mobile-first breakpoints

**Component Pattern:**
- Each section has dedicated CSS module
- No cross-section dependencies
- Self-contained styling per component
- Consistent responsive design patterns

## 🐛 Troubleshooting

```bash
# Clear cache and reinstall if issues
rm -rf node_modules dist .vite
npm install

# Check for type errors
npx tsc --noEmit

# Security audit
npm audit
```

**Common Issues:**
- If styles look wrong: Verify `base.css` is imported in `main.ts`
- If GameMode won't load: Check router code splitting in `main.ts:22`
- If API fails: Check `VITE_API_BASE` environment variable
- If navigation clips: Responsive breakpoint set to 950px for 5 nav items
- **Sass deprecation warning:** If you see "The legacy JS API is deprecated", this is already fixed in `vite.config.ts` with `api: 'modern-compiler'`

## 📈 Recent Development History

**Latest Enhancements:**
- ✅ About section implementation with mission, story, team, and values
- ✅ Navigation expanded to 5 sections with optimized responsive breakpoints
- ✅ CSS architecture improvements (20 modular files, proper component isolation)
- ✅ Content management system for team and project information
- ✅ Enhanced scroll positioning and mobile navigation
- ✅ FAQ cleanup to eliminate redundancy with About section

**Architecture Principles Applied:**
- Modular CSS with component-specific files
- Self-contained components with no cross-dependencies
- Mobile-first responsive design
- Proper semantic structure and accessibility
- Performance optimization with code splitting

---
*Vue 3 SPA with complete modular architecture, comprehensive project information, and enterprise security*