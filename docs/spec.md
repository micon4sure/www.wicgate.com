# WICGATE Monolith Page – Implementation Specification
Audience: Frontend contractor rebuilding the prototype into a production codebase.
Scope: Concrete layout structure, design tokens, component specs, behaviors, data expectations. (No strategy/intent prose.)

---
## 1. Global Structure (DOM Sections)
Order (top → bottom):
1. Fixed Header (`<header>`) – persistent.
2. Hero Section (`#hero`).
3. Getting Started Section (`#getting-started`).
4. Statistics Section (`#statistics`).
5. Community Section (`#community`).
6. FAQ Section (`#faq`).
7. Footer (`<footer>`).
8. Players Panel (off‑canvas right sidebar, element id `#pPanel`, overlays/pushes site wrapper).
9. Game Mode Overlay (fullscreen overlay `#gameMode`).

Wrapper: All main content inside `.site-wrapper#siteWrapper` which is horizontally shifted when players panel is opened (desktop) or fully pushed off-screen on mobile.

---
## 2. Layout Specifications
### 2.1 Breakpoints
- Desktop default: > 1024px.
- Tablet: ≤ 1024px (collapse multi-column grids to single column, hero visual height reduced).
- Mobile: ≤ 768px (navigation collapses; players panel becomes fullscreen; site wrapper pushes 100vw off left when panel open).
- Ultra-wide panel width adjustments:
  - Base: 340px
  - ≥1920px: 380px
  - ≥2560px: 420px
  - ≥3440px: 480px
  - Mobile (≤768): 100vw

### 2.2 Global Container & Spacing
- Max content width: 1400px (`.c`).
- Horizontal padding: 20px.
- Section vertical padding: 80px top & bottom (`.sec`).
- Header height: 70px (reserve top offset for anchored scrolling).

### 2.3 Grid Helpers (Prototype Classes)
| Class | Effect |
|-------|--------|
| `.g` | Display: grid; gap: 30px |
| `.g1` | gap: 10px |
| `.g2x` | gap: 20px |
| `.g2` | grid-template-columns: repeat(2,1fr) (collapses to 1fr under 1024px) |
| `.g3` | grid-template-columns: repeat(3,1fr) (collapses under 1024px) |

### 2.4 Header
- Fixed at top, blurred dark translucent background, 1px bottom border.
- Left cluster: Logo link + players button inside `.social` group (players button is the interactive element showing current online count).
- Right cluster: Horizontal nav (anchors). Hidden & replaced by hamburger (`.mob-menu`) on ≤768px.
- Hamburger toggles class `mobile-open` on `<nav>` to show vertical stacked menu.

### 2.5 Hero
- Two-column grid (text | visual slide container) on desktop; single column on ≤1024px.
- Visual panel height: 600px desktop, 400px tablet/mobile.
- Slide system: absolutely stacked `.h-slide` elements with fade (opacity transition). Indicators bottom‑center (5 dots; active = elongated pill style).
- CTAs row: side-by-side buttons (stack vertically on ≤768px, full width 100%).

### 2.6 Getting Started Section
- Two-column grid: Left = vertical list of numbered steps; Right = requirements card.
- Collapses into single column (steps first) under 1024px.
- Step block: circular number (40x40) + content block; each step has title + paragraph (and optionally embedded button).
 - Step 2 MUST include a prominently styled primary button labeled “Download WICGATE” matching hero primary CTA style (`.btn.btn-p`). Button ID: `downloadClientBtn` for potential future analytics binding. The text preceding the button: "Get our lightweight client (15MB) that patches your game for our servers." A line break separates description and button.

### 2.7 Statistics Section
- Contains a grid of leaderboard containers (cards). Each leaderboard card may include tabs (High Scores / Total Scores categories each have 5 role tabs: Overall, Infantry, Armor, Air, Support). Player leaderboard is a single table. Clan leaderboard placeholder with “Coming soon”.
- Tabs: horizontally distributed buttons; active tab has gradient background + bottom indicator bar.
- Tables: 3 columns (Rank, Player, Score/Rating). Rows: highlight top 3 via color accents & glow.

### 2.8 Community Section
Sub-blocks in order:
1. Community Platform Cards (Discord / YouTube / Twitch) – 3-column responsive to 1 column on small.
2. “Latest Videos” header + video card grid (3-column responsive).
3. Featured Playlists (2-column responsive).
4. Active Streams list – vertical list of stream rows.

### 2.9 FAQ Section
- Category blocks (title + list of accordion items).
- Each FAQ item: clickable question row + collapsible answer (max-height transition). Only one open at a time (current implementation closes others when a new one opens).

### 2.10 Footer
- Single centered line, includes animated status dot, copyright, disclaimer.

### 2.11 Players Panel (Sidebar)
- Position: fixed right, top offset 70px (desktop); covers full viewport top→bottom on mobile.
- Width: `--panel-width` (see breakpoints). Hidden by `transform: translateX(100%)` until active.
- Active state: `.p-panel.active` toggled by player button.
- Contains header with status dot + controls (Game Mode, Lock, Close). Below: scrollable player list.
- Lock state adds `.locked` on lock button: persists panel open across navigation/refresh via localStorage flag `wicgate_panel_locked`.
- When active (desktop) site wrapper gets `.panel-open` shifting content left by panel width.
- On mobile: site wrapper is pushed completely off-screen (`margin-right:100vw`) and body prevents scrolling (`body.panel-open-mobile`).

### 2.12 Game Mode Overlay
- Fullscreen layer above all (z-index high). Hidden by default (display none / removed class).
- Header bar with exit button & real-time status count.
- Body split grid: Left (350px players list) + Right (stats grid) on desktop; Left column hidden on mobile (only stats shown).
- Stat cards: uniform responsive grid (min 400px wide – reduces to single column on smaller widths).

---
## 3. Design Tokens
### 3.1 Color Variables
| Token | Value | Usage |
|-------|-------|-------|
| --mg | #556b2f | Primary olive accent / primary button gradient start |
| --mg-dark | #3d4f22 | Primary button gradient end |
| --sw | #e8dcc4 | Light warm accent |
| --sw-light | #f5ede2 | Lighter warm accent (unused visually yet) |
| --o | #d4a574 | Secondary highlight (hero tag, subtle accents) |
| --bg | #0f0f0f | Global page background |
| --s1 | #1a1a1a | Card gradient base 1 |
| --s2 | #252525 | Card gradient base 2 / darker surfaces |
| --t | #ffffff | Primary text |
| --t2 | #a3a3a3 | Secondary text |
| --t3 | #737373 | Tertiary / de-emphasis |
| --g | #7cb342 | Status / online / positive indicators |
| --d | #5865f2 | Discord / platform-specific button gradient start |
| --bd | rgba(255,255,255,0.05) | Base border lines / separators |

Gradients (names from prototype):
- `--grad-main`: 135° olive → sand (`var(--mg) → var(--sw)`).
- `--grad-card`: 135° dark surface overlay.
- `--grad-dark`: Darker variant for headers inside cards.
- `--grad-panel`: Background gradient for players panel.

### 3.2 Typography
- Font stack: `system-ui, -apple-system, sans-serif` (no custom font loaded in prototype).
- Headings: 
  - h1: clamp(2.5rem, 6vw, 4.5rem); weight 900; tight line-height 1.1.
  - h2: clamp(2rem, 4vw, 2.5rem); weight 800.
  - h3: 1.5rem.
  - h4: 1.125rem.
- Body base size: Browser default (16px). Secondary paragraphs often styled to 1.125rem in hero/section intros.
- Uppercase hero tag: 1.125rem, letter-spacing 2px.

### 3.3 Spacing (Observed Patterns)
| Element | Spacing |
|---------|---------|
| Section vertical padding | 80px top & bottom |
| Hero grid gap | 80px between columns |
| Standard grid gap | 30px (`.g`) |
| Button padding | 12px 24px |
| Players list item padding | 8px 12px (desktop) |
| Card internal padding (most) | 20–30px depending on type |

### 3.4 Border Radius & Effects
| Element | Radius |
|---------|--------|
| Cards | 12px |
| Buttons | 8px |
| Control buttons (panel header) | 8px |
| Status dots | 50% (circular) |

Shadows: Card hover: `0 10px 25px rgba(0,0,0,0.4)` plus subtle internal glows depending on type.

### 3.5 Buttons
| Variant | Colors | Hover Behavior |
|---------|--------|----------------|
| Primary `.btn-p` | Gradient: `--mg` → `--mg-dark`; white text | Lightens start color, lifts (translateY(-2px)), stronger shadow |
| Primary Download CTA | Same as `.btn-p`; appears in Hero and Step 2 of Getting Started. Ensure consistent padding (12px 24px) and spacing above via small top margin utility (e.g. `.mt-sm`). |
| Discord `.btn-d` | Gradient: `--d` → darker blue | Lightens start color, similar elevation |
| Generic base `.btn` | Transparent base w ripple pseudo-element | Ripple effect expands pseudo element on hover |

### 3.6 Cards
- Base: `.card` uses gradient background, border (1px translucent), rounded corners, transition on hover (if `.card-hover`).
- Community cards: platform color bar expands on hover (height tween 3px → full overlay at low opacity).

### 3.7 Tabs
- Inactive: transparent, muted text.
- Active: Subtle gradient fill + text glow + bottom bar (3px height) with main gradient.

### 3.8 Tables / Leaderboards
- Header row: dark gradient, uppercase, 0.85rem font.
- Row highlight (hover): subtle background fade.
- Top 3 ranks: distinct color + glow; `rankPulse` animation.

### 3.9 Status Indicators
- Small circular dots (6–8px) with synchronized pulse animation when players online.
- Always-animate variant in footer to show continuity.

### 3.10 Animations (Keyframes Names)
| Name | Purpose | Notes |
|------|---------|-------|
| `pulse` / `syncPulse` | Status dot opacity pulsing | 2s loop |
| `glow` | Box-shadow breathing effect (unused widely) |
| `fadeIn` | Vertical fade entry (hero tag) |
| `gentlePulse` / `subtleGlow` | Soft scaling / glow (rare usage) |
| `rankPulse` | Scaling pulse for top ranks | Different durations per rank |
| `scoreShine` | Animated gradient line across leaderboard header (8s linear loop) |

### 3.11 FAQ Accordion States
- Closed: `max-height:0; overflow:hidden`.
- Open: `max-height:500px` (arbitrary cap) + rotated chevron (180° transform).

---
## 4. Component Inventory (Functional Summary)
| Component | ID / Selector | Primary Interactions |
|-----------|---------------|----------------------|
| Header Nav | `#navigation` | Smooth scroll to anchor sections; mobile toggle class `mobile-open` |
| Players Button | `.players-btn` | Toggles players panel; displays player count / status dot |
| Players Panel | `#pPanel` | Slide in/out; lock state persists; list populated from API profiles |
| Lock Button | `#pLock` | Toggles `.locked`; persists `localStorage['wicgate_panel_locked']` |
| Game Mode Button | `#pGameMode` | Opens fullscreen overlay stats view |
| Game Mode Overlay | `#gameMode` | Displays aggregated stat cards + optional players list |
| Hero Slideshow | `.h-slide` elements + `#slideIndicators` | Auto-rotates every 6000ms; manual click sets slide; resets interval |
| Leaderboard Tabs | `.tab-btn` groups | Switches visible `.tab-cont` via class toggling |
| FAQ Items | `.faq-q` + `.faq-a` | One open at a time; click toggles active classes |
| Streams / Videos / Playlists | List/card clicks | Currently static placeholders (no playback logic) |

---
## 5. Behavioral Logic
### 5.1 Navigation / Scrolling
- All internal links call `navigateToSection(id, event)` which prevents default, smooth scrolls, and clears hash from URL via `history.replaceState`.
- Hero link (logo) scrolls to top.

### 5.2 Players Panel
- Toggle: Adds/removes `.active` on `#pPanel` and `.panel-open` on `.site-wrapper`.
- Mobile: Additionally adds `body.panel-open-mobile` (locks scrolling) and stores scroll position in `App.state.scrollPosition` so it can be restored on close.
- Lock: When locked, panel auto-opens on page load; transitions suppressed initially with `no-transition` class removed after a double `requestAnimationFrame`.

### 5.3 Game Mode Overlay
- Activation populates stats if data loaded.
- Exit button or Escape key closes overlay.
- On mobile, players subcolumn is hidden (layout simplifies to stats only).

### 5.4 Hero Slideshow
- Interval: 6000ms (`App.config.slideInterval`).
- On manual dot click, interval resets to keep consistent cycle.
- Slides fade via CSS opacity transitions.

### 5.5 Data Fetch Cycle
- Endpoint: `GET https://www.wicgate.com/api/data` (no query params in prototype).
- Interval: 60000ms (1 minute) after initial load.
- Cache policy: `cache: 'no-store'`.
- Success populates:
  - Players list (header count, panel list, game mode count/list).
  - Leaderboard tables (multiple datasets keyed by prefix names; see Data Schema below).
  - Game mode stat cards (top 10 entries per category; placeholder row if empty).
- Failure populates fallback (empty players + empty leaderboards placeholders).

### 5.6 Leaderboard Tab Logic
- Each leaderboard category has multiple tab content containers with IDs patterned: `[prefix]-[category]-tb` for table `<tbody>`.
- Active tab: `.tab-btn.active` + corresponding `.tab-cont.active`.

### 5.7 FAQ Collapse Logic
- Only one open at any time: toggling a new question closes others by removing `.active`.

### 5.8 Keyboard Shortcuts
- Escape: Closes game mode if open; else closes players panel if open.

### 5.9 Persistence
- Panel lock state only (localStorage key `wicgate_panel_locked='true'`).

---
## 6. Data Schema (Fields Actually Consumed)
Top-level JSON object (example keys):
- `profiles`: Array of player objects.
  - Each player object fields used:
    - `profileName` (string) → display name.
    - `serverId` (number/string) → displayed as "Server {serverId}".
- Leaderboard groupings (arrays). Keys used:
  - `lb_high` (overall high scores)
  - `lb_highinf` (infantry high scores)
  - `lb_higharm` (armor high scores)
  - `lb_highair` (air high scores)
  - `lb_highsup` (support high scores)
  - `lb_total` (overall cumulative)
  - (Similar pattern for totals per class if added; current code expects mapping when iterating: `lb_total` + shortened forms inside `populateLeaderboards`).
  - `ladder` (player ladder rating list)
- Each leaderboard entry fields used:
  - `rank` (number) → row rank; top 3 trigger highlight.
  - `profileName` OR fallback `shortName` OR `tagFormat`.
  - `high` (score numeric) displayed with thousands separators.

Note: Table filler uses empty state `<tr><td colspan="3">No data available</td></tr>` when array missing or empty.

---
## 7. Responsive Behavior Summary
| Feature | Desktop | Tablet (≤1024) | Mobile (≤768) |
|---------|---------|----------------|---------------|
| Hero Grid | 2 columns | 1 column | 1 column |
| Hero Visual Height | 600px | 400px | 400px |
| Leaderboard Tabs | Horizontal | Horizontal | Horizontal (no special change) |
| Players Panel | Sidebar pushes content (margin-right panel width) | Same | Fullscreen; content pushed completely off-screen left |
| Navigation | Inline | Inline | Hidden by default; toggle shows vertical list |
| Buttons in Hero | Inline row | Inline row | Full-width stacked |
| Game Mode Layout | 350px side list + stats grid | Same if width allows | Players column hidden; stats single column |

---
## 8. States & Edge Cases
| Area | Edge Case | Handling |
|------|-----------|----------|
| Players list | Zero players | Show message: "No players currently online"; remove pulse class from body |
| Leaderboards | Empty dataset | Insert single row "No data available" |
| API failure | Network/API down | Fallback empties (no crash) |
| Panel lock + mobile | Lock state on small screen | Panel opens fullscreen; background scroll prevented |
| Manual slide change | Interval conflict | Interval reset after manual change |

---
## 9. Class & ID Naming (Key Hooks)
| Hook | Purpose |
|------|---------|
| `#siteWrapper` | Shift container when panel open |
| `body.players-online` | Triggers global pulsing animations |
| `.panel-open` | Applied to wrapper when players panel active (desktop) |
| `.panel-open-mobile` | Applied to body to freeze scroll |
| `.p-panel.active` | Visible players panel |
| `#gameMode.active` | Visible game mode overlay |
| `.locked` (on `#pLock`) | Panel lock state |
| `.active` (slides, dots, tabs, faq) | Active element toggling |

---
## 10. Accessibility (Baseline Observed – For Completion By Contractor)
Minimum items to implement while rebuilding (prototype lacks full a11y):
- Provide focus styles for all interactive elements.
- Use `aria-expanded` on FAQ triggers.
- Provide `role="tablist"` and `role="tab"` semantics on leaderboard tabs if retained.
- Ensure Escape handlers are accessible (also provide visible close buttons).

---
## 11. Implementation Notes / Expectations
- Recreate design tokens as central theme (CSS variables / SCSS map / Tailwind config etc.).
- Abstract components (Button, Card, Tabs, LeaderboardTable, PlayerPanel, GameModeOverlay, FAQAccordion) for reuse.
- Data layer: single poll endpoint every 60s (make interval configurable; consider exponential backoff on failures in production).
- Avoid hard-coded emoji in final design if art assets become available; keep placeholders for now.
- Ensure transitions respect user preference (optional: reduce motion media query).

---
## 12. Known Omissions in Prototype (For Real Implementation)
| Area | Recommended Improvement |
|------|------------------------|
| Image/media assets | Replace placeholder thumbs with real thumbnails (lazy-load) |
| Error handling | Surface API errors subtly (toast or status line) |
| SEO | Real meta tags & structured data |
| Internationalization | None present; plan keys if future i18n required |
| Security | No auth flows; future personalized states require session handling |

---
## 13. Acceptance Criteria (Contractor)
1. Layout matches described section order and responsive behaviors.
2. Design tokens implemented centrally; modifying a token cascades correctly.
3. Players panel + game mode overlay function with dummy/mock API returning schema above.
4. Leaderboard tab switching does not reload page; content area swaps cleanly.
5. FAQ accordion: only one open at a time; keyboard accessible.
6. Hero slideshow cycles automatically; manual selection works and resets timer.
7. Mobile navigation, panel, and game mode behave per spec.
8. Zero-JS fallback degrades gracefully (non-critical: if JS off, static content visible except dynamic sections).

---
## 14. Quick Visual Reference (ASCII Wireframe Approx.)
```
[Fixed Header: Logo | Players[● 12 Players Online] .......... Nav Links .......... (Hamburger)]

Hero:
+---------------------------------------------------------------+------------------+
|  Tagline                                                      | Slide (fade)     |
|  H1 Headline (2 lines)                                        | [Indicator dots] |
|  Supporting line                                              |                  |
|  [Primary CTA] [Discord CTA]                                  |                  |
+---------------------------------------------------------------+------------------+

Getting Started:
[ Step 1 ]
[ Step 2 ]    |  [ Requirements Box ]
[ Step 3 ]    |  [ Supported Versions ]
[ Step 4 ]    |

Statistics (grid of cards):
[ High Scores (tabs) ] [ Total Scores (tabs) ]
[ Player Ladder ] [ Clan Leaderboard (Coming Soon) ]

Community:
[ Discord Card ] [ YouTube Card ] [ Twitch Card ]
"Latest Videos" (3-column grid)
"Featured Playlists" (2-column)
"Active Streams" (vertical list)

FAQ:
[ Category Header ]
  > Question (closed)
  > Question (open)

Footer: [●] Status • Copyright • Disclaimer

Players Panel (overlay right):
[Header: Title | GameMode | Lock | Close]
[List of players]

Game Mode (fullscreen):
[Header Bar: Logo | Player Count | Exit]
[Left Player List] | [Stat Cards Grid]
```

---
## 15. File Reference (Prototype Source)
Original prototype file: `monolith.html` (contains inline styles + JS). This spec extracts only structure & behavior necessary for clean rebuild.

---
## 16. Version Log
| Date | Change |
|------|--------|
| 2025-09-10 | Initial implementation spec extracted from prototype |

---
End of specification.
