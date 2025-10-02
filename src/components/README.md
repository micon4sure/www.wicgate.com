# WiCGATE Components Documentation

## Component Library

### Core Components

#### `ErrorBoundary.vue`
Catches and handles errors from child components gracefully.

**Props:** None (wraps children with slot)

**Features:**
- Catches component errors with `onErrorCaptured`
- Displays user-friendly error UI
- Provides reload and help options
- Shows stack trace in development mode
- Logs to Sentry in production

**Usage:**
```vue
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

#### `Navigation.vue`
Main site navigation with desktop tabs and mobile hamburger menu.

**Props:**
- `activeSection?: string` - Currently active section ID
- `playerCount?: number` - Number of online players
- `showPlayersButton?: boolean` - Whether to show players button

**Emits:**
- `navigate(section: string | undefined)` - User clicked navigation link
- `toggle-players()` - User clicked players button

**Features:**
- Rectangular tab navigation on desktop
- Full-screen mobile menu with smooth animations
- Dynamic header height measurement
- Scroll position preservation on resize using centralized `scrollToSection()` utility
- Players online button integration

**Usage:**
```vue
<Navigation
  :active-section="currentSection"
  :player-count="42"
  :show-players-button="true"
  @navigate="handleNavigate"
  @toggle-players="handleTogglePlayers"
/>
```

---

#### `PlayersOnline.vue`
Side panel showing online players and server list.

**Props:**
- `players: Profile[]` - Array of online player profiles
- `servers: Server[]` - Array of active game servers

**Emits:**
- `enter-game-mode()` - User wants to enter game mode view

**Features:**
- Sliding panel from right side
- Player list with ranks and scores
- Server browser with player counts
- Responsive design (full-width on mobile)
- Close on outside click or ESC key

**Methods:**
- `toggle()` - Public method to open/close panel

---

#### `FirstVisitOverlay.vue`
Welcome overlay for first-time visitors.

**Props:**
- `currentSection?: string` - Section user landed on

**Emits:**
- `go-home()` - User wants to start at homepage
- `continue()` - User wants to continue to current section
- `close()` - User dismissed overlay

**Features:**
- Detects first visit via localStorage
- Animated entrance
- Guides user to homepage or target section
- Semi-transparent backdrop
- Responsive design

---

#### `LeaderboardGroup.vue`
Tabbed leaderboard component with multiple categories.

**Props:**
- `data: DataResponse` - API data containing leaderboards

**Features:**
- Tab navigation (Overall, Domination, Assault, TugOfWar)
- Top 10 rankings per category
- Player names with rank insignia
- Score formatting
- Loading states
- Responsive table layout

---

#### `RankInsignia.vue`
Displays player rank badge with icon.

**Props:**
- `rank: number` - Rank level (0-15)

**Features:**
- 16 rank icons (from /public/rank-*.png)
- Fallback for missing ranks
- Tooltip with rank name
- Size variants

---

#### `TwitchEmbed.vue`
Embedded Twitch stream player.

**Props:**
- `channel: string` - Twitch channel name
- `autoplay?: boolean` - Auto-start playback

**Features:**
- Responsive iframe embed
- Loading state
- Error handling
- Maintains 16:9 aspect ratio

---

### Skeleton Loaders

#### `LeaderboardSkeleton.vue`
Placeholder for leaderboard data during loading.

**Features:**
- Mimics leaderboard structure
- Animated pulse effect
- SEO-friendly `<noscript>` fallback
- Responsive design

#### `EventsSkeleton.vue`
Placeholder for events data during loading.

**Features:**
- Grid layout matching actual events
- Descriptive text for SEO
- Pulse animations

#### `VideosSkeleton.vue`
Placeholder for video content during loading.

**Features:**
- 6-video grid layout
- Thumbnail placeholders
- Text shimmer effects

---

## Screen Components

### `GettingStarted.vue`
Onboarding section with installation instructions.

**Features:**
- 4-step installation guide
- Download buttons
- System requirements list
- Responsive layout

---

### `Statistics.vue`
Statistics section with leaderboards.

**Props:**
- `data: any` - API data
- `loading: boolean` - Loading state

**Features:**
- Uses LeaderboardGroup component
- Conditional rendering (SSR-safe)
- Skeleton loader integration

---

### `Community.vue`
Community hub with events, videos, and live streams.

**Features:**
- Discord events with countdown timers
- YouTube video grid (6 latest)
- Expandable channel sections
- Twitch stream embeds
- Creator badges
- Structured data for videos/events

---

### `About.vue`
Project information and team details.

**Features:**
- Project history
- Technology stack
- Team members
- Call-to-action for contributors

---

### `FAQ.vue`
Frequently asked questions with accordion UI.

**Features:**
- Category-based organization
- Expandable/collapsible items
- Smooth animations
- FAQ structured data (JSON-LD)

---

## Utility Functions

### Scroll Utilities (`src/utils/scroll.ts`)
- `getNavHeight()` - Gets exact navigation header height (no buffer)
- `getHeaderHeightWithBuffer()` - Gets header height with detection tolerance buffer
- `scrollToSection(id, behavior)` - Pixel-perfect scroll to section with header offset
- `getDynamicHeaderHeight()` - **@deprecated** Use `getHeaderHeightWithBuffer()` instead

### Structured Data (`src/utils/structuredData.ts`)
- `generateOrganizationSchema()` - Organization info
- `generateWebSiteSchema()` - Site search action
- `generateFAQSchema(items)` - FAQ page markup
- `generateVideoSchema(video)` - Video metadata
- `generateEventSchema(event)` - Event information

### Performance (`src/utils/performance.ts`)
- `initWebVitals()` - Tracks Core Web Vitals
- `WEB_VITALS_THRESHOLDS` - Performance thresholds

---

## Design Patterns

### Responsive Design
All components use mobile-first approach with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Color System
Components use CSS custom properties:
- `--mg` - Military green/steel tones
- `--sw` - Massgate orange accent
- `--dl` - Soviet red alerts
- `--graphite` - Navigation surfaces
- `--t`, `--t2`, `--t3` - Text hierarchy

### Animations
Standard transitions use:
```css
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
```

### Hover Effects
Interactive elements follow pattern:
- Scale transform (1.02x-1.03x)
- Orange background gradient
- Dark text color
- Multi-layer shadows

---

## Testing

See test files for examples:
- `src/utils/scroll.test.ts` - Utility testing
- `src/stores/appDataStore.test.ts` - Store testing

Run tests:
```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:ui       # Visual UI
npm run test:coverage # With coverage
```

---

## Contributing

When creating new components:
1. Use TypeScript for props and emits
2. Add JSDoc comments
3. Include usage examples
4. Write unit tests
5. Follow existing design patterns
6. Use design tokens (no hardcoded colors)
7. Ensure SSR compatibility
8. Add loading/error states
