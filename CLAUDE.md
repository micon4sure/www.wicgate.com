# CLAUDE.md - WiCGate Vue 3 Project

This is a Vue 3 + TypeScript SPA that reimplements a gaming community website for the WiCGate gaming platform. The project provides real-time player statistics, leaderboards, and community features for World in Conflict players.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```
The dev server runs on `http://localhost:5173`

### Build & Deploy
```bash
npm run build       # Outputs to dist/
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 📁 Project Structure

```
src/
├── assets/styles/base.css     # Global CSS (extracted from original monolith)
├── components/                # Reusable Vue components
│   ├── Navigation.vue         # Top navigation with mobile hamburger
│   ├── PlayersOnline.vue      # Player count button
│   ├── PlayersPanel.vue       # Slide-in players panel
│   ├── Leaderboards.vue       # Tabbed leaderboard system
│   ├── LeaderboardGroup.vue   # Individual leaderboard with tabs
│   ├── LbContainer.vue        # Leaderboard table container
│   ├── Scores.vue            # Score display cards
│   └── Footer.vue            # Site footer
├── views/                     # Route-level components
│   ├── Home.vue              # Main landing page with integrated game mode
│   ├── GettingStarted.vue    # Setup instructions
│   ├── Statistics.vue        # Leaderboards section
│   ├── Community.vue         # Community links & content
│   ├── FAQ.vue              # FAQ accordion
│   └── Footer.vue           # Footer section
├── composables/
│   ├── useAppData.ts         # API data fetching & polling
│   └── useGameModePreference.ts # Game mode auto-start preference
├── content/
│   └── content.ts            # Static content for i18n readiness
└── main.ts                   # App entry point with router
```

## 🛠 Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup lang="ts">`)
- **Language**: TypeScript
- **Bundler**: Vite 5
- **Router**: Vue Router 4 (history mode)
- **Styling**: PostCSS + Autoprefixer, CSS variables for theming
- **Linting**: ESLint with Vue plugin
- **Deployment**: GitHub Actions → GitHub Pages

## 🎯 Key Features

### Responsive Design
- **Desktop**: > 1024px - Full layout with sidebar panels
- **Tablet**: ≤ 1024px - Collapsed grids, reduced hero height
- **Mobile**: ≤ 768px - Hamburger nav, fullscreen panels

### Real-time Data
- Polls `/api/data` every 60 seconds
- Updates player counts, leaderboards, and online status
- Handles API failures gracefully with fallbacks

### Interactive Components
- **Players Panel**: Slide-in sidebar with lock state (persisted in localStorage)
- **Game Mode**: Full-screen overlay with statistics dashboard
- **Auto Game Mode**: Optional preference to automatically start in game mode (clean URLs)
- **Hero Slideshow**: Auto-rotating slides with manual controls
- **Leaderboard Tabs**: Multiple categories (High/Total scores, Player/Clan)
- **FAQ Accordion**: Collapsible Q&A sections

## 🎨 Design System

### Color Tokens (CSS Variables)
```css
--mg: #556b2f        /* Primary olive green */
--mg-dark: #3d4f22   /* Darker olive */
--sw: #e8dcc4        /* Light warm accent */
--o: #d4a574         /* Secondary highlight */
--bg: #0f0f0f        /* Page background */
--s1: #1a1a1a        /* Card background 1 */
--s2: #252525        /* Card background 2 */
--t: #ffffff         /* Primary text */
--t2: #a3a3a3        /* Secondary text */
--t3: #737373        /* Tertiary text */
--g: #7cb342         /* Online/success indicator */
--d: #5865f2         /* Discord blue */
```

### Layout Utilities
```css
.c      /* Container: max-width 1400px, padding 20px */
.sec    /* Section: 80px vertical padding */
.g      /* Grid: display grid, gap 30px */
.g2     /* 2-column grid (responsive) */
.g3     /* 3-column grid (responsive) */
```

## 🔗 Routing

- `/` - Main page with conditional game mode display

**Clean URL Architecture:**
- Always loads at `wicgate.com` (no `/gamemode` URLs)
- Game mode is a view state within the home page
- Auto game mode preference enables seamless power-user experience
- Shared links always show main page first

The router uses dynamic base detection for GitHub Pages deployment.

## 📊 API Integration

### Data Structure
```typescript
interface ApiData {
  profiles?: PlayerProfile[];           // Online players
  lb_high?: LeaderboardEntry[];        // High scores overall
  lb_highinf?: LeaderboardEntry[];     // Infantry high scores
  lb_higharm?: LeaderboardEntry[];     // Armor high scores
  lb_highair?: LeaderboardEntry[];     // Air high scores
  lb_rightsup?: LeaderboardEntry[];     // Support high scores
  lb_total?: LeaderboardEntry[];       // Total scores
  ladder?: LeaderboardEntry[];         // Player rankings
}
```

### Environment Variables
```bash
VITE_API_BASE=https://www.wicgate.com/api  # API endpoint base URL
```

## 🚀 Deployment

The project auto-deploys via GitHub Actions on push to `master`:

1. **Primary URL**: https://micon4sure.github.io/www.wicgate.com/
2. **Custom Domain**: https://www.wicgate.com/ (when DNS configured)

### Deployment Features
- Relative asset paths for dual-domain compatibility
- SPA fallback (404.html = index.html)
- Automatic CNAME file generation
- History API support

## 🧪 Testing & Quality

```bash
npm run lint        # ESLint checks
npm run build       # Production build verification
```

## 🎛 Development Notes

### Key Classes & IDs
```css
#siteWrapper        /* Main content container */
.players-online     /* Body class when players online */
.panel-open        /* Applied when side panel open */
.panel-open-mobile /* Mobile panel state */
#pPanel            /* Players panel */
#gameMode          /* Game mode overlay */
```

### State Management
- Uses Vue's reactive system with composables
- `useAppData.ts` handles all API state
- localStorage for panel lock persistence only

### Performance Considerations
- 60-second API polling interval
- Efficient DOM updates via Vue's reactivity
- Smooth CSS transitions with hardware acceleration
- Image placeholders for future lazy-loading

## 🔮 Future Enhancements

1. **State Management**: Add Pinia if state complexity grows
2. **Testing**: Implement Vitest for composables
3. **Media**: Real image/thumbnail loading for videos
4. **I18n**: Multi-language support (content extracted to content.ts)
5. **PWA**: Service worker for offline capabilities
6. **Authentication**: User sessions for personalized features

## 🐛 Common Issues & Solutions

### Panel Not Opening
- Check localStorage: `wicgate_panel_locked` key
- Verify CSS classes: `.active`, `.panel-open`

### API Connection Issues  
- Verify VITE_API_BASE environment variable
- Check CORS settings on API server
- Monitor browser console for fetch errors

### Mobile Layout Problems
- Confirm viewport meta tag in index.html
- Test breakpoint CSS variables
- Check mobile-specific classes

## ⚡ Auto Game Mode Feature

The website automatically remembers user preferences without requiring manual locks:

**How it works:**
- **Players Panel**: Remembers open/closed state automatically
- **Game Mode**: Entering game mode saves preference, exiting removes it
- **Clean URLs**: Always `wicgate.com` - no complex toggle buttons needed
- **Seamless Experience**: Returning users see their preferred view automatically

**localStorage Keys:**
- `wicgate_panel_open='true'` - Panel open state (remembers automatically)
- `wicgate_auto_gamemode='true'` - Game mode preference (set by usage patterns)

**Implementation:**
- `useGameModePreference.ts` - Simple preference detection
- `Home.vue` - Automatic state management based on user actions
- `PlayersOnline.vue` - Automatic panel state persistence

## 📝 Contributing

1. Follow existing Vue 3 + TypeScript patterns
2. Use `<script setup lang="ts">` syntax
3. Maintain responsive design principles
4. Update this CLAUDE.md when adding features
5. Run `npm run lint` before committing

## 📜 License

Custom / Project-specific. Not affiliated with Ubisoft or Massive Entertainment.

---

*Generated for Claude Code development assistance*