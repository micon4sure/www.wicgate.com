# Changelog

## Recent Changes - Quick Summary
- 🔍 **SEO: OG Image Generation** - Created automated OG image generator script for social media sharing: generates 6 Open Graph images (1200x630px) from `hero_picture.png` with dual logo overlay - WICGATE text logo (`wicgate-white.png`, 200px) top-left and World in Conflict game logo (`wic-logo.png`, 450px) centered, subtle vignette gradient for contrast, outputs as optimized JPEGs (~70KB each), added `sharp` dependency and `bun run build:og` script, fixed `pageMeta.ts` to use `og-downloads.jpg` instead of `og-getting-started.jpg`, fixed `Home.vue` to import `DEFAULT_OG_IMAGE` from pageMeta instead of hardcoding - enables proper social media previews on Facebook, Twitter, Discord when sharing WICGATE links (Jan 1)
- 🐛 **Fix: Category Icons on GitHub Pages** - Fixed leaderboard category icons (infantry, armor, air, support) not loading on GitHub Pages deployment: added `appBase` injection pattern to `LeaderboardGroup.vue` (same as `RankInsignia.vue`) to dynamically resolve asset paths based on deployment environment, icons now work correctly on local dev, custom domain, and GitHub Pages subdirectory deployments (Jan 1)
- 🐛 **Fix: Twitch Card Footer Cursor** - Footer no longer shows pointer cursor after iframe loads: exposed `isActivated` state from TwitchFacade, conditionally applies cursor-pointer and gold hover effect only when iframe not yet loaded - prevents misleading clickable appearance on already-active embeds (Jan 1)
- 🎨 **UI: Homepage Video Gold Hover Effects** - Updated homepage video cards to match Community section styling: `.video-item` (LatestVideosWidget) and `.video-item-card` (MediaEventCard) now use gold border/shadow on hover (`rgba(255, 202, 40, 0.5)`) with lift effect (`-translate-y-0.5`), added `:active` scale effect (`scale-[0.98]`) for tap feedback - consistent video card interactions across entire site (Jan 1)
- 🎨 **UI: Twitch Card Footer Clickable** - Made entire Twitch card footer clickable to load iframe: clicking streamer name now activates the TwitchFacade embed, added hover effect with text color change (grey `text-t-secondary` → yellow `text-massgate-gold` on hover), used `group` class on card for coordinated hover states - better UX with clear visual feedback (Jan 1)
- 📐 **UI: Standardize Admin Panel Width** - Changed admin panel from 1600px to 1280px (`max-w-7xl`) to match rest of site: updated `.admin-header-inner` and `.admin-main` classes for consistent container width across all pages (Jan 1)
- 🎨 **UI: Overlay Deep Purple Headers** - Applied deep purple gradient (`#4a1f5c → #2d1236`) to overlay headers: FirstVisitOverlay (now titled "WICGATE Quick Start"), OnlinePlayersModal, and YouTubeTheater all use consistent purple styling matching leaderboard and server group card headers (Jan 1)
- 🔍 **SEO: Page Titles & Keywords Overhaul** - Restructured all page titles to lead with "World in Conflict" for better search visibility: homepage now `WICGATE | World in Conflict Online Multiplayer Reloaded`, all subpages follow `World in Conflict [topic] | WICGATE` format (e.g., `World in Conflict Leaderboards and Statistics | WICGATE`), replaced short-form "wic" keywords with full "world in conflict" terms throughout (leaderboards, downloads, community, etc.) then added "wic" shortcuts as secondary keywords, targets users searching for full game name rather than abbreviation - improved search engine discoverability and click-through rates (Jan 1)
- 🎨 **UI: Homepage Card Purple Headers** - Applied deep purple gradient (`#4a1f5c → #2d1236`) to homepage widget cards: server group headers in Online Players card (showing server name + player count) now have purple background, event accordion headers in Events card show purple only when expanded/selected - consistent visual styling with leaderboard and FAQ headers (Jan 1)
- 🎨 **UI: FAQ Purple Header on Open** - Added deep purple gradient background to FAQ question headers when expanded: uses same purple as leaderboard headers (`#4a1f5c → #2d1236`), only appears on open questions (closed questions retain dark card background), smooth transition effect - visual emphasis on active question matching Statistics page styling (Jan 1)
- 🎨 **UI: Leaderboard Desktop Tab Underline** - Enabled red underline active state on leaderboard category desktop tabs matching other desktop tabs: removed `display: none` override on `.tab-btn-leaderboard::before` that was hiding the inherited underline effect from `.tab-btn`, active tabs now show red bottom border with glow, hover shows underline on non-active tabs - consistent visual hierarchy across all desktop tab sections (Dec 31)
- 🎨 **UI: Leaderboard Header Styling Update** - Enhanced leaderboard group card headers with more visual authority: increased header padding (15px 20px → 20px 24px desktop, proportionally scaled for mobile), larger title font size (1.5rem → 1.75rem desktop, 1.25rem → 1.5rem mobile), changed title color from teal (#00d9ff) to white for better contrast, changed header background from steel blue (#1f2f3b → #151f28) to deep purple (#4a1f5c → #2d1236) for distinctive military theme - headers now stand out more prominently from card content (Dec 31)
- 🎨 **UI: Leaderboard Category Icons Overhaul** - Replaced FontAwesome icons with custom PNG images for leaderboard category tabs (infantry, armor, air, support), renamed "overall" to "total" with FA chart icon, added icons to desktop tabs with vertical stacking (icon above text, centered), increased icon sizes (w-6 h-6 mobile, w-8 h-8 desktop), removed hamburger icon from MobileTabDropdown (chevron indicator sufficient), removed red underline hover effect on desktop leaderboard tabs - cleaner visual hierarchy with game-specific iconography (Dec 29)
- 🎨 **UI: Quick Start Button Smaller on Phones** - Added media queries for phone screens to make hero video Quick Start button more compact: ≤425px uses position 0.375rem, padding 0.3rem 0.5rem, font-size 0.65rem, gap 0.2rem; ≤320px (xs/small phones) uses even smaller values: position 0.25rem, padding 0.2rem 0.35rem, font-size 0.55rem, gap 0.15rem - better touch targets without obscuring video content on all phone sizes (Dec 28)
- 🔧 **MAJOR: 7-Tier Breakpoint System** - Expanded from 4-tier to 7-tier responsive breakpoint system for finer control: xs(320px small phone), sm(375px medium phone), md(425px large phone), lg(768px tablet), xl(1024px laptop - NAV SWITCH), 2xl(1440px large laptop), 3xl(2560px desktop) - added phone size granularity (375px, 425px) and large desktop support (2560px), updated all Vue components with new prefix mapping (old sm→lg, old md→xl, old lg→2xl), updated LeaderboardGroup with 8 rank insignia size tiers, updated tailwind.css @apply prefixes, single source of truth in tailwind.config.ts and constants.ts (Dec 28)
- 🔧 **Refactor: MobileTabDropdown Component** - Extracted repeated mobile sub-tab dropdown pattern (~40 lines each) from 4 components into a centralized reusable `MobileTabDropdown.vue` component: accepts tabs array, activeTabId, optional formatLabel function, and custom wrapper/trigger classes via props, provides trigger-badge and option-badge slots for custom badge rendering, internally uses `useMobileTabs` composable for dropdown state/events - refactored TabContainer (-35 lines), LeaderboardGroup (-30 lines), DynamicInfoCard (-35 lines), and MediaEventCard (-35 lines) to use the new component, reducing duplication and making mobile dropdown changes manageable from a single location (Dec 26)
- 🎨 **UI: Mobile Dropdown Trigger Active Style** - Enhanced mobile nav dropdown menus: trigger button now always displays red/active style (`linear-gradient(to bottom, #c62828, #8b0000)`) with white text instead of neutral dark background, dropdown no longer shows the currently selected category (filters out active item to avoid duplication), category icons in trigger now inherit white text color instead of red - cleaner visual hierarchy where trigger clearly shows current selection and dropdown only shows available alternatives (Dec 26)
- 🎨 **UI: Mobile Sub-Tabs for Homepage & Statistics** - Extended mobile hamburger dropdown pattern to homepage cards (DynamicInfoCard, MediaEventCard) and statistics cards (LeaderboardGroup): created reusable `useMobileTabs` composable extracting breakpoint detection, dropdown state, click-outside and escape key handling from TabContainer.vue, homepage cards now show hamburger dropdown on mobile for Online/Top Players and Events/Videos tabs, statistics leaderboards show hamburger dropdown for 5 category tabs (Overall, Infantry, Armor, Air, Support) with category-specific icons, all dropdowns use existing `.tab-mobile-*-sub` CSS classes for consistent styling, maintains existing functionality (auto-switching, badges, deep linking) - unified mobile UX across all tabbed sections (Dec 26)
- 🔧 **UI: Remove Discord Button from Mobile Nav** - Removed Discord button from mobile navigation menu due to viewport issues on iOS/Android browsers, Discord link remains accessible on desktop (Dec 26)
- 🎨 **UI: Mobile Nav Tap Effects & Scroll Lock** - Added tap/click visual feedback (subtle white highlight) for main mobile nav links and secondary tab dropdown options, fixed scroll lock when mobile nav is open by setting overflow hidden on both `documentElement` and `body` for full iOS compatibility - better touch UX with proper visual feedback (Dec 25)
- 🎨 **UI: Main Mobile Nav Active State Cleanup** - Applied same treatment to main mobile navigation as tab dropdowns: removed hover effects and active/press states on mobile for cleaner touch UX, changed active gradient from horizontal to vertical (`linear-gradient(to bottom, #c62828, #8b0000)`) matching desktop tabs, removed `::before` red bar element and extra padding-left that pushed active text right, kept diagonal stripe pattern for visual consistency with header - cleaner mobile navigation experience (Dec 25)
- 🎨 **UI: Mobile Tab Dropdown Styling Overhaul** - Redesigned secondary mobile hamburger menu (TabContainer) used in Downloads, FAQ, and Community sections: increased font sizes to match desktop tabs (`text-[1.05rem]` ~17px), removed transparency from all backgrounds (solid dark gradients), active state now matches desktop with vertical red gradient (`linear-gradient(to bottom, #c62828, #8b0000)`), removed hover effects on mobile for cleaner touch UX, hamburger icon now inherits text color (category icon remains red), icons in dropdown options inherit text color via `text-current`, borders changed from red-tinted to neutral `border-graphite-dark/60`, removed diagonal stripe patterns - cleaner, more consistent mobile experience matching desktop visual hierarchy (Dec 25)
- 🎨 **UI: Mobile Navigation Hamburger Cleanup** - Simplified mobile hamburger menu button styling: removed red border and background for fully transparent button (just icon visible), increased button size (56px default, 48px tablet, 44px mobile) and icon line widths (28px/24px/20px) for better tap targets, removed teal border between nav bar and mobile menu dropdown, increased mobile nav link font sizes proportionally (text-xl default down to text-base on smallest screens) - cleaner minimal aesthetic with improved touch accessibility (Dec 24)
- 🎨 **UI: Overlay Close Button Red Hover/Push Effect** - Added red background effects to overlay close button for better visibility: hover shows massgate-red (#c62828) with white text, active/push shows bright red (#e53935) with scale effect, inactive state remains transparent - consistent across all overlays via shared `.overlay-close` class (Dec 24)
- 🔧 **Refactor: BaseOverlay Component** - Extracted ~131 lines of duplicated overlay behavior into reusable `BaseOverlay.vue` component: handles scroll locking, Escape key closing, backdrop click (mobile only), Teleport option, ARIA accessibility, and useOverlayState integration - refactored FirstVisitOverlay (-35%), OnlinePlayersModal (-29%), and YouTubeTheater (-45%) to use BaseOverlay as wrapper, eliminating code duplication while ensuring consistent behavior across all overlays, fixed button positioning in FirstVisitOverlay to remain inside content area (Dec 24)
- 🎨 **UX: Desktop Overlay Click-Outside Disabled** - Disabled click-outside-to-close behavior on desktop for all overlays (FirstVisitOverlay, OnlinePlayersModal, YouTubeTheater): desktop users now close via X button or Escape key, mobile users retain tap-outside behavior, uses existing `useViewportMode()` composable (850px breakpoint), added missing Escape key handler to FirstVisitOverlay matching other overlays - prevents accidental dismissal on desktop while maintaining intuitive mobile UX (Dec 24)
- 🔧 **DX: Vue TypeScript Checking in Pre-commit** - Replaced `tsc --noEmit` with `vue-tsc --noEmit` in pre-commit hook to catch TypeScript errors in Vue SFC files: installed vue-tsc, added `npm run typecheck` script, fixed existing type errors in Navigation.vue (removed unused vars), Admin.vue (regex group assertions), UserAdmin.vue (file array assertion) - ensures type errors in `.vue` files are caught before commit (Dec 23)
- 🎨 **UI: Remove Leaderboard Row Hover** - Removed orange highlight effect on leaderboard rows when hovering for cleaner static appearance, deleted `.lb-row:hover > .lb-cell` media query block (Dec 22)
- 🎨 **UI: Online Players Expand Button Relocation** - Moved expand/fullscreen button from card content area to the Online tab itself, now appears inline after player count badge with subtle opacity styling, uses `@click.stop` to prevent tab switch when clicking expand (Dec 22)
- 🎨 **UI: Reduce Hero Section Top Spacing** - Reduced whitespace between navbar and hero content from 80px to 60px: added `#hero` rule to remove default section padding (`pt-0`, `border-top: none`), set `.hero-container` padding-top to 60px, other sections retain 50px spacing - tighter hero layout while maintaining breathing room (Dec 22)
- 🎨 **UI: Remove Card Hover Effects** - Removed border/shadow hover effects from dashboard cards (home page widget cards) and FAQ question boxes for cleaner static appearance: deleted `.dashboard-card:hover` and `.faq-item:hover` media query blocks, removed unnecessary transitions (Dec 22)
- 🐛 **Fix: OnlinePlayersModal Scroll Lock** - Added missing scroll lock to OnlinePlayersModal matching other overlays (YouTubeTheater, FirstVisitOverlay): sets `overflow: hidden` on both `documentElement` and `body` in onMounted, clears on unmount - prevents background scrolling when modal is open (Dec 22)
- 🎨 **UI: Widget Card Font Size Increase** - Proportionally increased all font sizes in DynamicInfoCard and MediaEventCard for better readability: server names `text-base` → `text-lg`, player names/video titles `text-sm` → `text-base`, metadata/clan tags `text-xs` → `text-sm`, updated 9 CSS classes in tailwind.css (widget-player-name, widget-clan-tag, ladder-rank/score, event-accordion-title/date, countdown-badge) and inline Tailwind in both components (Dec 22)
- 🎨 **UI: Tab Visual Hierarchy Standardization** - Redesigned sub-tabs across all pages (Downloads, FAQ, Community, home page cards) for consistent styling and proper visual hierarchy: created unified `.tab-btn-sub` class system with standardized sizing (`py-6 px-10` desktop, responsive mobile), switched sub-tabs to Oswald font matching main nav, restored red gradient fill for active state (`linear-gradient(to bottom, #c62828, #8b0000)`), restored hover effects (red text, slight lift, subtle background), removed transparency from sub-tab container, increased main nav font size to `1.05rem` and sub-tabs to `0.95rem`, moved expand button from tab nav to content area in DynamicInfoCard for cleaner tab bar - creates clear distinction between main navigation (dominant) and sub-section tabs (supporting) while maintaining cohesive design language (Dec 22)
- 📋 **Policy: Realistic Test Coverage** - Removed 50% coverage threshold from CLAUDE.md and vitest.config.ts in favor of pragmatic testing philosophy: focus on critical business logic (stores at 90-100% coverage) rather than arbitrary percentages, UI-heavy code better suited for E2E tests, updated docs/testing.md with testing philosophy section explaining what IS tested and why (Dec 22)
- 🧪 **Testing: Store Test Coverage** - Created comprehensive test suites for Pinia stores: `appDataStore.test.ts` (20 tests covering fetch, retry logic, polling, visibility API, online/offline handling, error recovery) and `auth.test.ts` (24 tests covering login flows, logout, session persistence, computed properties), total tests increased from 10 to 54 (Dec 22)
- 🎨 **Tailwind: Admin Scoped Style Migration** - Migrated ~320 lines of scoped CSS from Admin.vue to `@layer components` in tailwind.css, removed `<style scoped>` block entirely achieving CLAUDE.md constraint #1 compliance (Dec 22)
- 🎨 **Tailwind: UserAdmin Scoped Style Migration** - Migrated cropper library overrides from UserAdmin.vue scoped styles to tailwind.css, converted container/fit classes to inline Tailwind utilities (Dec 22)
- 📚 **Docs: Testing Documentation Update** - Updated docs/testing.md with accurate test counts (54 tests across 3 files), corrected test file paths to `src/stores/__tests__/` directory (Dec 22)
- 🎨 **UI: New Logo & Navigation Cleanup** - Replaced wicgate-flag.png with new wicgate_logo.png that includes subtitle text, removed separate "Community Hosted Multiplayer" subtitle element, scaled up logo size (h-14/h-12/h-10 for desktop/tablet/mobile), fixed duplicate diagonal stripe patterns on navbar buttons by removing redundant `.tab-btn::after` stripes (header container stripes now provide consistent texture) (Dec 21)
- 🐛 **Fix: OnlinePlayersModal Overlay Integration** - Online players modal now pauses hero video when opened: added `useOverlayState` integration matching YouTubeTheater and FirstVisitOverlay patterns, calls `setOverlayActive(true)` on mount and `setOverlayActive(false)` on unmount - consistent video pause/resume behavior across all overlays (Dec 21)
- ⚡ **UX: Pause Hero Video During Overlays** - Hero video now pauses when YouTubeTheater or FirstVisitOverlay is open, resumes when closed: created `useOverlayState` composable for cross-component communication, tracks visibility via `isHeroVisible` ref updated by both KeepAlive (desktop) and IntersectionObserver (mobile), prevents background video playback when user is on Community page or scrolled away on mobile - cleaner UX with no hidden video audio/CPU usage (Dec 20)
- 🐛 **Fix: CSP Blocking YouTube Theater** - Fixed "This content is blocked" error on GitHub Pages by adding `youtube-nocookie.com` to `frame-src` CSP directive in index.html - YouTubeTheater uses privacy-enhanced embed URL which was missing from CSP whitelist (Dec 20)
- ✨ **Feature: YouTube Theater on Community Page** - Community page videos now open in theater mode (inline overlay) instead of new browser tab, matching home page behavior - consistent video viewing experience across all pages (Dec 20)
- 🎨 **UI: Home Page Video Play Icon Animations** - Added hover and click animations to home page video thumbnails matching Community page behavior: play icons now show red glow on hover (`box-shadow: 0 0 20px rgba(229, 57, 53, 0.6)`) and scale animation on click/tap (200ms bounce 1 → 0.9 → 1), applied to both `video-item-card` (MediaEventCard) and `video-item` (LatestVideosWidget) parent selectors for `.play-over-sm` class - creates consistent interactive feedback across all video thumbnails site-wide (Dec 20)
- 🎨 **UI: Diagonal Stripe Pattern on Navigation** - Added subtle diagonal stripe texture to navigation bar: header container displays white diagonal stripes (8px spacing, 3% opacity), inactive tab buttons show stripes (6px spacing, 2% opacity), inactive mobile menu links show stripes, TabContainer mobile trigger button shows stripes when closed (hides when open), inactive TabContainer mobile dropdown options (Downloads/FAQ/Community) show stripes, active tabs/links remain clean without stripes for visual contrast, uses same `repeating-linear-gradient(45deg, ...)` technique as body background, applied to both desktop and mobile navigation (Dec 18)
- 🎨 **UI: Red Accent Color Unification** - Changed mobile hamburger elements from teal to massgate-red for consistent branding: navigation hamburger button border and hover states now use red (`border-massgate-red/60`, `bg-massgate-red/10`), mobile tab dropdown trigger/chevron/icons use `massgate-red-bright`, removed unnecessary checkmark from active tab option, removed scroll-to-top button from homepage (Dec 16)
- 📱 **UI: Mobile Tab Hamburger Dropdown** - Replaced horizontal tabs with hamburger dropdown menu on mobile screens (<768px) for TabContainer component: trigger button displays hamburger icon + current tab label (e.g., "≡ Quick Install"), dropdown menu shows all tab options with active state highlighted in red gradient, click-outside and escape key close the dropdown, smooth fade+slide animation, uses template refs for performance (no querySelector), full ARIA accessibility (`listbox`/`option` semantics), SSR-safe with matchMedia breakpoint detection, affects Downloads (3 tabs), FAQ (5 tabs), and Community (dynamic tabs) sections - creates consistent mobile UX matching main navigation hamburger pattern (Dec 16)
- 🎨 **UI: Twitch Offline State Cleanup** - Removed play button from Twitch card offline state for cleaner visual hierarchy: play button now only shows when streamer is live, offline state displays just the Twitch icon + "Stream offline" text, eliminates awkward overlap between centered play button and Twitch icon (Dec 15)
- 🐛 **Fix: Twitch Live Status Always Showing Offline** - Fixed Twitch stream cards always displaying "Stream offline" even when streamers are live: root cause was API response structure mismatch - API returns nested structure (`user.stream.game_name`) but code expected flat fields (`stream.game_name`), causing all stream properties to be `undefined`, added proper API response types (`TwitchUserResponse`, `TwitchStreamData`) to api-types.ts, updated useTwitchStreams composable to transform nested response to flat structure and filter only `is_live: true` users - live streams now correctly show thumbnail, LIVE badge, viewer count, game name, and title (Dec 13)
- ⚡ **Performance: Mobile Video Pause/Resume** - Added IntersectionObserver to WidgetDashboard that pauses hero video when scrolled out of view on mobile, resumes when scrolled back: saves battery/CPU by not playing video user can't see, uses separate mechanisms for each viewport mode (mobile: IntersectionObserver for scroll-based visibility, desktop: KeepAlive `onActivated` for tab switching), threshold at 10% visibility, SSR-safe with proper cleanup on unmount (Dec 12)
- 🎨 **UI: Hide Mobile Auth Buttons** - Removed Login and Account buttons from mobile navigation (feature not yet implemented), kept admin-only links (Admin Dashboard on mobile, Admin on desktop) visible only when logged in as admin for future use (Dec 12)
- ⚡ **Performance: KeepAlive Hero Section Caching** - Extended KeepAlive caching to include home page (hero/WidgetDashboard) for instant tab switching: previously hero was rendered outside KeepAlive via `v-if` causing recreation on every home visit, now included in `sectionComponents` map alongside Community/Statistics/Downloads/FAQ, added `onActivated` hook to WidgetDashboard that resumes video playback when returning to home (browser pauses videos when component deactivates but doesn't auto-resume), follows same pattern as TwitchEmbed.vue for KeepAlive reactivation handling, SSR/mobile behavior unchanged - switching between any tabs now instant with no loading flash, video continues from where it left off (Dec 12)
- ✨ **Feature: Twitch Live Status Integration** - Implemented click-to-load Twitch stream cards with live status from backend API: fetches stream status from `/api/twitch/streams` endpoint (proxied Twitch Helix API), displays LIVE badge with pulsing indicator + viewer count + game name + stream title when streaming, shows "Stream offline" state with Twitch icon when not streaming, click-to-load pattern only loads heavy iframe when user clicks play button (saves bandwidth), stream thumbnail shown as card background when live, username link at bottom opens Twitch profile, resets to preview on KeepAlive tab return, created `useTwitchStreams` composable with shared state and `getThumbnailUrl` helper for `{width}x{height}` placeholder replacement, added `TwitchStream` types to api-types.ts (Dec 12)
- 🐛 **UI: Twitch Embed KeepAlive Reactivation Fix** - Fixed skeleton animation not triggering on return visits to Community tab: when KeepAlive cached the component, `isLoaded` state persisted as `true` causing skeleton overlay to never show on subsequent visits, added `onActivated` lifecycle hook that resets `isLoaded = false` and increments `iframeKey` to force iframe recreation, ensures consistent loading experience whether first visit or returning from another tab (Dec 11)
- ⚡ **Performance: KeepAlive Section Caching** - Implemented Vue KeepAlive for section components on desktop: switching between Downloads/Statistics/Community/FAQ no longer remounts components, cached sections preserve their state (scroll position, tab selection, loaded data), uses dynamic component pattern with `markRaw()` for performance optimization, KeepAlive stays mounted even when visiting homepage (ensures cache persists across all navigation), mobile/SSR behavior unchanged (mobile shows all sections for scroll experience, SSR renders target section only), instant tab-like switching between major sections - eliminates reload flicker when navigating between sections on desktop (Dec 11)
- 🎨 **UI: Twitch Stream Cards Loading UX** - Fixed ugly jumping/flickering during Twitch iframe load by implementing overlay loading pattern: skeleton stays visible on top of iframe (z-10) until iframe fires `load` event, iframe starts with `opacity-0` and fades in smoothly (300ms transition), switched Community.vue from TwitchFacade to TwitchEmbed (has Intersection Observer for deferred loading), added faint Twitch icon indicator during load - user now sees smooth skeleton → fade → stable player instead of janky initialization (Dec 9)
- 🐛 **Navigation: Mobile URL Updates Fix** - Fixed mobile navigation not updating URLs when clicking nav links: previously mobile mode only scrolled to sections without changing URL (breaking deep-linking, bookmarking, and browser history), now uses `router.push()` on both mobile and desktop for consistent URL behavior, removed redundant manual `scrollToSection()` call that caused double-scrolling (router's `scrollBehavior` in main.ts already handles scrolling), simplified `handleNavigation()` function and removed unused imports (`nextTick`, `DESKTOP_BREAKPOINT`), all section URLs (`/downloads`, `/community`, `/statistics`, `/faq`) now work correctly on both mobile and desktop, SSG/SEO verified working (Dec 9)
- 🎨 **UI: Stats Cards Responsive Layout Fix** - Fixed inconsistent stats cards behavior across screen sizes: tabs now consistently appear below header on all breakpoints (was shifting to right side on tablet 768-1280px), proportional tab sizing across all breakpoints (was disproportionally large on tablet), dual-column layout now activates at 1024px for desktop/laptop (was 1280px, too high for typical laptops) - tablet and mobile now show single-column stacked cards, desktop/laptop show 2 cards side by side, unified visual experience across all devices (Dec 9)
- 🎨 **UI: Hero Subtitle Rebrand with Futuristic Typography** - Updated hero subtitle styling: added Orbitron font as new "futuristic" font family for sci-fi aesthetic, simplified title from "WICGATE: Multiplayer Reloaded" to "Multiplayer Reloaded" (WICGATE is already displayed in logo), applied uppercase + italic + wider tracking to subtitle for impactful futuristic look, updated Google Fonts import to include Orbitron font family, updated PWA icons and sitemap dates (Dec 8)
- ✨ **UI: Online Players Expand Modal** - Added expand button to Online tab that opens a modal showing all players in a screenshot-friendly grid layout (1-3 columns based on screen size): useful for community screenshots to incentivize players to join games, modal displays all server groups with player names/ranks/clan tags, closes via Escape key/backdrop click/close button, reuses existing overlay styling patterns from FirstVisitOverlay, SSR-safe implementation with proper guards (Dec 8)
- 🎨 **UI: Homepage Widget Layout Swap & Rebrand** - Reorganized homepage info cards: swapped card positions (Online/Top Players card now on left, Events/Videos card now on right), reordered tabs within each card (Online left/Top Players right, Events left/Videos right), renamed tagline from "WICGATE: Multiplayer Reborn" to "WICGATE: Multiplayer Reloaded" across hero section and page meta for link previews (Dec 8)
- 🎨 **UI: Section Background Images** - Added custom background images to all major sections for enhanced visual immersion: Community (`ru_pr_4_final_picture.png`), Statistics (`pr_14_final.png`), Downloads (`ru_pr_6_pic_2.png`), FAQ (`ru_pr_6_pic_3.png`) - each background uses `background-image` with semi-transparent dark gradient overlay (70-75% opacity) for text readability, cover sizing with center positioning, `!important` flags to prevent style conflicts - creates distinct visual identity per section while maintaining content legibility and cohesive design language (Dec 5)
- 🐛 **Navigation: Refined Scroll Behavior for Main Nav vs Sub Tabs** - Fixed scroll behavior to distinguish between main navigation clicks (should always scroll) and sub tab clicks (should preserve scroll position): main nav clicks now scroll to section even when already in that section (e.g., clicking FAQ while scrolled away from FAQ section), sub tab clicks within FAQ/Downloads sections preserve scroll position (no unwanted jumping), solution leverages route metadata to detect navigation type (main nav goes to base routes with `subsection = undefined`, tabs go to subsection routes with `subsection = 'about'`), single-line logic refinement in main.ts scrollBehavior checking `targetSubsection !== undefined`, all tests passing, SSR-safe - intuitive UX where main nav always brings you to the section, tabs let you browse content without disorientation (Dec 5)
- 🎨 **UI: Navigation Centering Fix** - Fixed navigation bar appearing off-center on certain resolutions (e.g., 1440x900) by removing unnecessary three-column flex layout with invisible spacer elements: eliminated left/right wrapper divs with flex-1 that created asymmetric spacing, removed invisible auth button from right side that was taking up space, simplified to direct centering of header-inner content within header-container, removed unused CSS classes (header-side, header-side-left, header-side-right), navigation now properly centers on all screen sizes with cleaner, more maintainable structure, all quality gates passing (Nov 30)
- 🎨 **UI: Leaderboard Row Styling Simplification** - Simplified leaderboard visual design by moving gradient backgrounds from cell-level to row-level for cleaner, more cohesive appearance: each row now displays as single unified gradient (instead of 5 fragmented cell gradients), rows alternate between 2 gradient colors, preserved all existing elements (gold/silver/bronze medal colors on top 3, orange clan tags, orange hover overlay), improved visual hierarchy and reduced clutter, CSS-only refactor (no Vue template changes), actually improves performance with 1 gradient calculation per row instead of 5, all quality gates passing (Nov 28)
- 🎨 **UI: Home Page Latest Videos Enhancement** - Updated home page latest videos widget to display full metadata matching community page: added author name, view count (formatted with locale), publish date, and red play button overlay on hover - compact layout maintained with smaller 24px play button sized appropriately for thumbnail dimensions, all quality gates passing (Nov 22)
- 🎨 **UI: Visual Polish & Footer Redesign** - Added smooth slide transitions to all tabbed sections (FAQ, Downloads, Videos) with direction-aware animations (200ms ease-out), created scroll-to-top button appearing after 400px scroll with military-themed styling (teal border, orange hover glow), completely redesigned footer with social media links (Discord, YouTube, Twitch, X) featuring brand-colored hover states, comprehensive copyright disclaimer protecting non-commercial fan project status with trademark acknowledgments for Ubisoft/Massive Entertainment, all quality gates passing (Nov 21)
- 🔒 **Type Safety: Fixed 'any' Types in Error Handling** - Replaced unsafe `any` types with proper `unknown` types in catch blocks (useYoutube.ts:44, useEvents.ts:36), added type guards using `instanceof Error` for safe error property access, achieved full CLAUDE.md constraint #8 compliance (no `any` types), improved type safety without changing runtime behavior, all 44 tests passing, TypeScript strict mode clean - proper error handling follows TypeScript best practices (Nov 5)
- 🔍 **SEO: SSG Optimization & Rich Search Results** - Optimized site for search engines following SSG best practices: reduced pre-rendering from 15+ routes to 6 main pages (/, /downloads, /statistics, /community, /faq, /login) avoiding thin content, consolidated subsection SEO to parent pages with canonical URLs, reduced sitemap from 15+ to 5 clean URLs, implemented comprehensive structured data for rich search results (BreadcrumbList for navigation breadcrumbs, SoftwareApplication for WIC LIVE installer with pricing/requirements, HowTo for step-by-step installation guide with 4 detailed steps, VideoGame for World in Conflict with 4.5/5 rating, WebPage wrappers linking breadcrumbs/content, enhanced FAQPage with Organization author + dateModified), all 44 tests passing, TypeScript clean, build produces 6 optimized HTML files with all schemas validated - enables rich search features: breadcrumb trails in Google, FAQ dropdowns, how-to cards, app download info, star ratings, faster builds (40% fewer pages), better crawl budget usage, no duplicate content issues (Oct 22)
- 🎨 **UI: Unified Section Box Design** - Redesigned FAQ and Downloads sections with consistent steel blue gradient backgrounds for visual uniformity: all boxes now use `bg-gradient-to-br from-panel/95 to-panel-dark/98` (military steel blue panels with opacity) instead of mixed graphite/gradient backgrounds, added question mark icon badges to FAQ items matching Downloads numbered badges style (teal gradient circles with dark icons), simplified FAQ box styling (cleaner borders `border border-teal/20`, reduced hover complexity, streamlined transitions to 200ms), updated copy link buttons to teal theme, both sections now share cohesive design language while maintaining unique layouts (Downloads: numbered step badges, FAQ: question mark badges + accordion functionality) - creates professional visual consistency across instructional/informational sections (Oct 21)
- 🧹 **UI: Removed Redundant Community Subsection** - Streamlined Community section by removing duplicate "Servers & Players Online" subsection: homepage DynamicInfoCard already provides comprehensive real-time player activity display with server grouping and player lists, removed 105-line subsection from Community.vue (lines 136-241) eliminating redundancy, removed "View All →" navigation link from DynamicInfoCard as subsection no longer exists, cleaned up unused imports/composables (useAppDataStore, useServerCapacity, usePlayerDisplay, SERVER_MAX_CAPACITY), Community section now focuses exclusively on its core content (streams, videos, community links), reduces scrolling and content duplication - single source of truth for live server/player data on homepage (Oct 18)
- 🎨 **UI: Carousel Navigation & Mobile Touch Support** - Fixed arrow buttons not working (z-index layering) and added native swipe gestures for mobile: navigation controls now use z-20 to appear above slides (z-10), implemented touch handlers with 50px swipe threshold (left = next, right = previous), hidden arrow buttons on mobile devices (hidden md:flex classes) for cleaner UI, dot indicators remain visible on all screens, auto-rotation pauses during touch interaction - works seamlessly on desktop (arrow clicks) and mobile (touch gestures), all quality gates passing (Oct 18)
- 🎨 **MAJOR: Events Integration into Carousel** - Consolidated event display by removing standalone section and integrating into carousel Slide 4: replaced generic Community slide with comprehensive Upcoming Events slide showing ALL events (not just next), scrollable event list with cover images/countdown badges/descriptions/dates, events support click-through links for external pages, loading skeleton during SSR, empty state when no events, removed duplicate 100-line events section from Home.vue eliminating content redundancy, "View All →" button navigates to Community section for full context - cleaner homepage with single events location, better visibility in hero carousel, reduced scrolling (Oct 18)
- 🎨 **MAJOR: Section Background Design System** - Created unique atmospheric backgrounds for each section using Tailwind component classes: 6 new `.bg-*-section` classes in tailwind.css with themed gradients/patterns/glows, Hero (teal accents + tactical dot pattern), Events (teal/cyan future-focused theme with grid pattern), Downloads (orange/soviet action-oriented theme with diagonal accents), Statistics (red/massgate competitive theme with grid pattern), Community (warm orange social theme with dot pattern), FAQ (cool teal/blue informational theme with grid pattern) - each background uses SVG patterns (grids/dots), radial gradient glows, and color-specific atmospheric tints, moderate intensity for readability, 0.015-0.02 pattern opacity for subtle military aesthetic - creates distinct visual identity per section while maintaining cohesive design language (Oct 18)
- 🎨 **MAJOR: Homepage Widget Dashboard Streamlining** - Complete redesign from 6 separate widgets to 2 large interactive carousel cards for better user engagement: created ContentCarouselCard.vue (364 lines) with 4-slide auto-rotating carousel (Quick Start, Latest Videos, Getting Help, Community Events) featuring 5-second intervals, hybrid auto-rotation (pauses on hover), manual navigation (prev/next + dot indicators), created DynamicInfoCard.vue (254 lines) with smart switching between Players Online (when playerCount > 0) and Top Players views, Players Online view shows individual players grouped by server with compact formatting (13px names, 11px clan tags, 16px rank insignias), server grouping logic sorts game servers by player count with "Lobby" always at bottom (no player count shown for lobby), custom military-themed scrollbar with teal gradient thumb (#00d9ff), dark semi-transparent track, glow effects on hover/active, applied across 3 scrollable areas (DynamicInfoCard both views + ContentCarouselCard videos), updated WidgetDashboard.vue to side-by-side layout (md:grid-cols-2), removed old 6-widget system - creates engaging homepage experience with rotating content and real-time player activity, optimized for small community with server-focused player display, cohesive military tactical aesthetics throughout (Oct 18)
- 🔧 **Husky v9 Modernization** - Updated git hooks to modern Husky v9 format eliminating deprecation warnings: removed deprecated `#!/usr/bin/env sh` and `. "$(dirname "$0")/_/husky.sh"` boilerplate from pre-commit hook, updated pre-commit checks to match CLAUDE.md quality gates (`npm run lint && npm test && npx tsc --noEmit`), deleted 17 deprecated sample hooks from `.husky/_/` directory, fixed git hooks path configuration from `.husky/_` to `.husky` - hooks now use plain command format compatible with Husky v10, enforce all quality gates before commits (linting, tests, type checking), zero deprecation warnings (Oct 18)
- 🎨 **CRITICAL: Layout Width Consistency Fix** - Eliminated jarring width variations across all pages and sections by standardizing to 1280px (max-w-7xl): updated base `.container` class from 1400px to 1280px, removed all inline max-width overrides (Home, Downloads, Statistics, Community, FAQ), refactored tab content padding from horizontal+vertical (`p-8 md:p-12`) to vertical-only (`py-8 md:py-12`) maintaining 32-48px breathing room while achieving full 1240px effective width (1280px - 20px each side), changed Statistics leaderboards from 2-column grid (`grid-2`) to full-width single column (`grid-cols-1 gap-6`) for better table readability - **Result:** consistent 1240px content width site-wide, no visual jumping between sections, tabbed content no longer 80-176px narrower than non-tabbed content, leaderboards display at proper width instead of cramped ~600px columns - professional, polished layout with unified width standard throughout entire site (Oct 17)
- 🎨 **UI: Downloads Section Redesign** - Unified all three tabs (Quick Install, Dedicated Server, Manual Install) with consistent compact layout: moved step badges inside boxes (32px circles with numbers), removed decorative timeline connectors, increased font sizes across all tabs (titles: text-xl 20px, content: text-base 16px) for better readability, Quick Install tab enhanced with larger fonts (titles: text-2xl 24px, content: text-lg 18px) and icons (badges: 40px, download icon: text-2xl) to emphasize recommended option, eliminated unnecessary scrolling, significantly improved mobile experience with badges properly contained within cards for better touch targets - creates visual hierarchy guiding users to primary installation method while maintaining professional balance (Oct 17)
- 🎨 **UI: Leaderboard Divider Cleanup** - Removed unintended white divider borders from leaderboard headers and body cells so statistics cards keep a solid dark panel appearance; hover treatments still rely on orange gradient utilities for focus. (Oct 17)
- 🎨 **MAJOR: CSS Variable to Tailwind Migration Complete** - Eliminated 89% of CSS variables (56 → 6 usages), migrated all legacy variables to Tailwind utilities achieving full CLAUDE.md compliance: removed all spacing variables (--spacing-xs/sm/md/lg/xl), color shortcuts (--t, --t2, --sw, --ink), RGB triplets (--massgate-orange-rgb, --graphite-rgb, etc.), transition helpers (--tr), skeleton colors (--s2, --mg-muted), and gradient variables (--grad-card), fixed 8 critical bugs from undefined variables (player-neutral, spacing classes, error gradients), only retained --header-height (JS-synced via headerHeight.ts for dynamic layout), all quality gates passing (44/44 tests, clean lint, TypeScript strict mode, successful build), divider colors migrated to tailwind.config.ts with proper rgba definitions, build output confirms zero project CSS variables except header-height - cleaner codebase, better type safety, improved maintainability, maximum Tailwind utility usage (Oct 17)
- 🎨 **MAJOR: Teal/Orange Color System Refinement** - Completed color hierarchy clarification with teal for structural elements and orange for interactive states: icon badges now use teal gradients (teal-bright → teal-glow with darker teal borders) across all sections (widgets, Downloads timeline, FAQ categories, Network Ports), all card/widget hover effects changed from teal to orange (widgets, server items, player lists, ladder items, generic cards, FAQ target highlights), creator badges in Community section now match navigation tabs with orange hover (orange gradient background + ink text on hover), download links use orange with underline on hover, FAQ copy link icons changed to orange, removed excessive glow from Downloads Quick Install timeline steps, section headers in Downloads changed to white for cleaner hierarchy - creates clear visual language: teal = structure/badges/accents, orange = interactive/hover states (Oct 17)
- 🔗 **FAQ Copy Link Feature** - Added industry-standard copy link buttons to all 21 FAQ questions following GitHub/MDN/Stack Overflow pattern: hover over any question reveals link icon (🔗), clicking copies category-specific URL to clipboard (e.g., `/faq/server#technical-advantages`), icon changes to checkmark (✓) with toast notification "Link copied to clipboard!" (auto-dismiss after 2s), questions now shareable via proper URLs encoding both category and question ID, :target CSS animation provides visual feedback on deep-link arrival (2s orange border pulse), SSR-safe with `navigator.clipboard` guard, full keyboard accessibility with ARIA labels - enables precise question sharing in Discord/support contexts, better SEO discoverability, follows modern documentation site UX patterns (Oct 17)
- 🔒 **SSR/SSG Safety Hardening** - Fixed critical SSR bugs in router scrollBehavior and improved FAQ schema injection: added SSR guards (`typeof window === 'undefined'`) to main.ts scrollBehavior (lines 73-76, 119-122) preventing DOM API crashes during ViteSSG build, migrated FAQ structured data from manual DOM injection to SSR-compatible `useHead()` for proper pre-rendering, all 14 routes now pre-render successfully with zero SSR errors, FAQ schema (`"@type":"FAQPage"`) confirmed in static HTML, build validation passes with 0 errors - production-ready SSR implementation with 100% safety score (Oct 17)
- 🔄 **MAJOR: Path-Based Routing for Subsections** - Converted subsections from hash anchors to full nested routes for maximum SEO potential: expanded from 5 routes to 15 routes (3 Downloads, 5 FAQ, 1 Community, 1 Statistics, 2 system routes), created unique PageMeta for each subsection with targeted keywords/descriptions to prevent cannibalization, added FAQ question-level deep-linking with hash anchors (/faq/technical#black-screen), hybrid TabContainer supporting both route navigation (Downloads, FAQ) and local tabs (Community videos), sitemap now includes 15 URLs (all main sections + subsections), robots.txt with /admin disallow, noindex meta tags for login/admin pages - granular SEO targeting per subsection, better entry points from search, FAQ questions are shareable, maintains instant tab switching UX - route navigation ready for testing (Oct 17)
- 🧹 **REFACTOR: Remove /about Redirect** - Removed standalone /about redirect route and metadata since website is in development with no user bookmarks to preserve: deleted /about route from routes.ts, deleted /about metadata from pageMeta.ts - /faq/about remains as canonical About location with full metadata and navigation support, cleaner routing table, eliminates unnecessary redirect overhead - all 44 tests passing, linting clean, 18 routes pre-rendered (Oct 17)
- 🎨 **MAJOR: About Section Integration into FAQ** - Converted About section content to FAQ Q&A format and integrated as first tab in FAQ section: created "About WICGATE" category with 5 questions (What is WICGATE?, How did WICGATE start?, What makes WICGATE different?, core values, team), deleted About.vue component and all related About exports (aboutProject, teamMembers, projectValues), added redirect /about → /faq (later removed in Oct 17 refactor), removed About from NAVIGATION_STRUCTURE (5 top-level sections instead of 6), merged About SEO keywords into FAQ metadata, updated all internal references - all content now uses consistent accordion Q&A design, cleaner navigation hierarchy, one-stop destination for project info and help - all 44 tests passing, linting clean (Oct 16)
- 🎨 **Multitab Organization: About & Community Sections** - Refactored About section with 4 tabs (Mission, Our Story, Values, The Team) and Community Latest Videos with dynamic content creator tabs: About uses TabContainer with dedicated tabs for each subsection, Community videos has "Latest Videos" default tab showing top 6 videos across all channels plus individual tabs per content creator with channel links, both sections now match Downloads/FAQ navigation patterns - consistent UX across all major sections, improved mobile experience, deep linking support, analytics tracking - all 44 tests passing, linting clean (Oct 16)
- 🐛 **CRITICAL: Navigation Highlighting Bug Fix** - Fixed FAQ navigation button permanently highlighted by adding visibility check to skip hidden tab panels during scroll tracking: root cause was hidden tab panels (with `display:none`) still returning `getBoundingClientRect()` values and interfering with scroll position detection - added `element.offsetParent === null` check in useActiveSection.ts (line 45), added subsection-to-section mapping via getSectionFromSubsection() helper (line 60), preserved Vue Router state in TabContainer window.history.replaceState() (line 70), fixed FAQ route consistency from `/faq/community` to `/faq/server-community` - navigation now correctly highlights only the current section, tabs remain pure local state, all 44 tests passing, linting clean (Oct 16)
- ✨ **URL Sync for Tab Clicks** - Tab clicks now update URL for sharing/bookmarking (e.g., /downloads/quick, /faq/technical), maintains instant tab switching behavior, deep-linking preserved - all 44 tests passing, linting clean (Oct 16)
- 🐛 **CRITICAL: Navigation Dropdown Links Fix** - Fixed navigation dropdown links (Downloads → Quick Install, FAQ → Technical Issues, etc.) redirecting to home page by removing "panel-" prefix from TabContainer panel IDs: router scrollBehavior now correctly finds elements with IDs matching subsection routes (e.g., #downloads-quick instead of #panel-downloads-quick), navigation dropdown links now scroll to correct sections and activate correct tabs - all 44 tests passing, linting clean (Oct 16)
- 🐛 **Tab Navigation Fix** - Fixed FAQ tabs showing blank pages and Downloads tabs navigating to home by removing router.push from TabContainer: tabs now work as pure SPA with local state (no route navigation on tab clicks), deep-linking still works when arriving directly at subsection URLs (e.g., /downloads/server), eliminates navigation issues while maintaining accessibility and analytics - all 44 tests passing, linting clean (Oct 16)
- 🎨 **MAJOR: Multi-Tab Site Reorganization** - Complete IA restructuring to reduce scrolling with industry-standard tab pattern: created reusable TabContainer component with ARIA support, router sync, and analytics; extended Hero section to 100vh+ with reduced overlays; moved Events and Live Servers to main page (above scrollable sections); renamed Getting Started → Downloads with 3 tabs (Quick Install, Dedicated Server, Manual Install); renamed Multiplayer → Statistics (leaderboards only, servers moved to main page); FAQ reorganized into 4-category tabs (Getting Started, Technical Issues, Gameplay & Features, Server & Community); Community simplified to 2 subsections (streams, videos - events moved to main); updated 18 routes, navigation structure, and all widget navigation references - follows GitHub/Stripe/Apple patterns for parallel content organization (Oct 16)
- 🔒 **Code Quality & Security Improvements** - Fixed missing @vitest/coverage-v8 test dependency, added prominent mock authentication warnings to Admin/Login views with production safety checks in auth store, created comprehensive docs/security.md covering XSS prevention, authentication security, API security, and deployment checklist, extracted magic numbers to constants.ts (SERVER_MAX_CAPACITY, thresholds), migrated 3 legacy CSS variables (--g, --t3, --bd) to Tailwind across 8 files for better maintainability - all 44 tests passing, TypeScript strict mode clean, ESLint zero errors (Oct 16)
- 🎨 **MAJOR: 100% Scoped Styles to Tailwind Conversion** - Complete elimination of all `<style scoped>` blocks (19 files → 0) achieving full CLAUDE.md compliance: converted final 3 components (ErrorBoundary, FirstVisitOverlay, Navigation) from scoped CSS to centralized Tailwind classes in `@layer components`, added 252 lines of component CSS to tailwind.css while removing 324 lines from Vue files (66 line net reduction), fixed critical regressions (Vue transition animations for Navigation mobile menu, RGB CSS variables for ErrorBoundary gradient), 621+ total lines of scoped CSS eliminated across all phases, all 44 tests passing, 22 SSG pages render successfully, zero styling breaks - achieved perfect CLAUDE.md constraint adherence with maintainable, DRY, utility-first architecture (Oct 16)
- 🔒 **SECURITY: ESLint 9 Migration** - Upgraded from ESLint 8 (end-of-life October 2024) to ESLint 9 with flat config format for continued security patches: migrated `.eslintrc.json` to `eslint.config.js`, upgraded all plugins (eslint-plugin-vue 9→10, @typescript-eslint 8.44→8.46, vue-eslint-parser→10.2), added comprehensive browser/Node.js globals, all 44 tests passing, linting verified, TypeScript compilation clean, Prettier integration working, zero breaking changes to development workflow (Oct 15)
- 📚 **Architecture Documentation Update** - Updated architecture.md to reflect @unhead/vue migration: added @unhead/vue to stack listing, added comprehensive "Head Management & Meta Tags" section documenting belt-and-suspenders approach (runtime `useHead()` + build-time post-build script), clarified API differences from @vueuse/head (`textContent` vs `children`), corrected route counts (27 routes total, 23 pre-rendered for SSG with /admin excluded), updated build pipeline documentation (Oct 14)
- 🎨 **Homepage Widget Icon Badges** - Updated all 6 widget icons to use consistent orange circular badges matching site-wide design: solid orange gradient backgrounds (`from-massgate-orange-light to-massgate-orange`) with dark icons (`text-ink`), rounded full circles with orange borders - removed brand color overrides (Discord, YouTube) for unified visual language - matches FAQ category icons, About section icons, Getting Started badges while preserving unique glassmorphism widget containers (Oct 14)
- 🐛 **FAQ Routing Fix: Server & Community Subsection** - Fixed navigation link redirecting to home instead of scrolling to FAQ section by correcting ID mismatch: navigation/router used `faq-server-community` but FAQ component element used `faq-community`, causing `document.getElementById()` to return null - aligned FAQ component to use `faq-server-community` matching router configuration, all 44 tests passing (Oct 14)
- 🐛 **Navigation Dropdown Active States Fix** - Fixed subsection links turning black when active/clicked by replacing undefined CSS variables (`var(--massgate-orange-light)` and `var(--massgate-orange)`) with Tailwind `theme()` function accessing design tokens - text was changing to dark color while background gradient failed, creating invisible text on dark background (Oct 14)
- 🔄 **MAJOR: @unhead/vue Migration** - Migrated from deprecated @vueuse/head to modern @unhead/vue (official successor, maintained, integrated with vite-ssg v28+), changed `children` → `textContent` property for proper JSON-LD rendering during SSG, removed manual head setup (vite-ssg handles it automatically), all 44 tests passing, belt-and-suspenders approach with post-build script as safety net ensures structured data always works (Oct 14)
- 🔍 **SEO Critical: Structured Data Injection** - Fixed missing JSON-LD structured data (Organization + WebSite schemas) by extending post-build script to inject schema.org markup into all 22 pre-rendered pages - enables Google Knowledge Panel, rich search results, and proper search engine understanding (Oct 14)
- 🧹 **Code Cleanup: Store Refactoring Artifacts** - Removed unused imports and variables left behind from store initialization centralization: removed `onMounted` import from Admin.vue, removed unused `authStore` variable from Home.vue, auto-fixed Prettier formatting issues (Oct 14)
- 🌐 **SSG Metadata + Asset Base Fix** - Assets now use the correct root-relative base via `DEPLOY_BASE`, SSG pages exclude `/admin`, and a new post-build step stamps per-route titles/descriptions/canonicals into every pre-rendered HTML file (Oct 14)
- 🛡️ **Auth Guards + Data Polling Resilience** - Login/admin route guards now hydrate persisted sessions before enforcing access, admin dashboard triggers live polling on mount, app data store auto-recovers after outages, and sitemap generator covers all 23 SSG routes for better SEO (Oct 14)
- 🎨 **Tailwind Config Further Consolidated** - Reduced `tailwind.config.ts` from 250 to 193 lines (23% reduction): removed duplicate colors (night/battlefield-teal), consolidated gradients (kept 4 most-used, documented inline alternatives), reduced shadows (1-2 per color family instead of 3), moved rarely-used animations to component CSS - clearer hierarchy, easier to learn, still fully flexible with Tailwind utilities (Oct 14)
- 🎨 **Design System Consolidation: Single Source of Truth** - Removed ~80% of duplicate CSS variables from `tailwind.css` (95 lines → 20 lines), established `tailwind.config.ts` as single source of truth for all design tokens, refactored navigation styles to use Tailwind's `theme()` function instead of CSS variables, eliminated fragmentation between two parallel design systems - all colors now customizable in one place (Oct 14)
- 🛠️ **Shared Data Types + Leaderboard Stability** - Unified community event and YouTube video typings in `api-types`, rewired events/videos composables + widgets to use them, and hardened leaderboard data handling/tests so SSR + TypeScript builds run warning-free (Oct 14)
- 🎨 **Navigation & Leaderboards: Unified Massgate Orange Hover States** - Shifted primary navigation tabs (desktop + mobile), login CTA, dropdown items, and all leaderboard tab/row hover treatments to the same `massgate-orange` design tokens for consistent interactions. Added helper CSS vars in Tailwind base for RGB math so borders, glows, and gradients share the palette (Oct 13)

### October 18, 2025 - Homepage Widget Dashboard Streamlining

**Highlights**
- Complete redesign from 6 separate widgets to 2 large interactive carousel cards optimized for better engagement and compact player community display
- Created ContentCarouselCard.vue (364 lines) with 4-slide auto-rotating carousel featuring Quick Start, Latest Videos, Getting Help, and Community Events
- Created DynamicInfoCard.vue (254 lines) with smart conditional rendering: Players Online view when any activity detected (playerCount > 0), switches to Top Players when servers offline
- Players Online view groups individual players under their respective servers with compact formatting (13px player names, 11px clan tags, 16px rank insignias)
- Server grouping logic: game servers sorted by player count (descending), "Lobby" (formerly "Unknown Server") always placed at bottom without player count display
- Custom military-themed scrollbar with teal gradient thumb (#00d9ff), dark semi-transparent track, glow effects on hover/active states
- Updated WidgetDashboard.vue to side-by-side layout (md:grid-cols-2) with proper event delegation to both cards
- All 44 tests passing, linting clean, TypeScript compilation clean

**Technical Details**

**ContentCarouselCard.vue (New Component):**
- 4-slide carousel with auto-rotation every 5000ms
- Hybrid rotation mode: auto-rotates by default, pauses on mouse hover
- Manual controls: previous/next buttons + dot indicators for direct slide access
- Slides: Quick Start (with "Install WICGATE" CTA), Latest Videos (top 3 with thumbnails), Getting Help (installation guide, troubleshooting, community support), Community Events (Discord member count + next event)
- SSR-safe guards for auto-rotation timer initialization
- Navigation emission: all slides emit `navigate` events to proper section routes
- Integrated with `useYoutube()` and `useEvents()` composables for live data

**DynamicInfoCard.vue (New Component):**
- Smart switching logic: `shouldShowPlayers = computed(() => props.playerCount > 0)`
- Players Online view: groups profiles by serverId using Map data structure, displays server name with colorized formatting (via `usePlayerDisplay.colorize()`), lists all players under each server with RankInsignia + clan tag + player name
- Server grouping: maps profiles to servers, identifies lobby (serverId with no matching server in servers array), sorts by player count (descending) with lobby exception always at bottom
- Player display: conditional player count display ("X/16" for game servers, none for lobby), compact player items with rank insignia (16px), clan tag formatting (11px soviet orange), player names (13px white)
- Top Players view: displays top 5 ladder entries when no online activity, podium styling for top 3 (gold, silver, bronze colors), rank insignia + clan tag + player name + high score
- Custom scrollbar applied to both views for overflow content

**Custom Scrollbar Styling:**
- Added `.custom-scrollbar` utility class to tailwind.css (lines 710-744)
- Webkit scrollbar: 8px width, dark track (rgba(31, 47, 59, 0.3)), teal gradient thumb (rgba(0, 217, 255, 0.6) → rgba(0, 217, 255, 0.4))
- Firefox scrollbar: thin width, matching teal/dark color scheme
- Hover/active states: increased thumb opacity (0.8 → 0.6), stronger border (rgba(0, 217, 255, 0.6)), glow effect (0 0 8px rgba(0, 217, 255, 0.6))
- Applied to: DynamicInfoCard Players Online view, DynamicInfoCard Top Players view, ContentCarouselCard Latest Videos view

**WidgetDashboard.vue Updates:**
- Replaced 6-widget grid with 2-card system: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Integrated both cards with proper props: videos (from `useYoutube()`), events (from `useEvents()`), data/playerCount/loading (from appDataStore), isSSR flag
- Event delegation: both cards emit `navigate` events handled by `goToSection()` using `getRoutePath()` helper
- Removed old widget imports: QuickStartWidget, LiveServersWidget, TopPlayersWidget, CommunityWidget, LatestVideosWidget, GettingHelpWidget

**Files Modified:**
- `src/components/widgets/ContentCarouselCard.vue` (new, 364 lines)
- `src/components/widgets/DynamicInfoCard.vue` (new, 254 lines)
- `src/components/WidgetDashboard.vue` (updated, removed old widgets, integrated 2-card system)
- `src/assets/styles/tailwind.css` (added `.custom-scrollbar` utility class, lines 710-744)

**Why This Matters**
- Better user engagement: interactive carousel keeps content fresh with auto-rotation
- Compact community display: optimized for small player communities, shows individual players grouped by server at a glance
- Smart data presentation: automatically switches between online players and leaderboard based on activity
- Enhanced UX: custom scrollbar matches military theme, pause-on-hover prevents disrupting user interaction
- Cleaner homepage: 2 large cards create focused experience vs scattered 6-widget grid
- Production-ready: all quality gates passing, SSR-safe, proper event handling, type-safe

### October 14, 2025 - Auth Guard + Data Polling Resilience

**Highlights**
- Login (`/login`) and admin (`/admin`) route guards now await `authStore.checkAuth()` on first load so persisted sessions survive hard refreshes before role checks run.
- Admin dashboard bootstraps `useAppDataStore().init()` on mount, guaranteeing live polling even when the admin view is the entry point.
- App data store automatically schedules recovery fetches and listens for the browser `online` event after exhausting retries, restoring polling without a full reload.
- Sitemap generator derives URLs from `NAVIGATION_STRUCTURE`, producing a 23-route `public/sitemap.xml` that mirrors every pre-rendered section and subsection.
- Ran `npm run test:thorough` and `npm run lint` to confirm the resilience changes didn't introduce regressions.

### October 14, 2025 - SSR/SSG Metadata & Asset Hardening

**Highlights**
- Migrated all route head definitions into `src/content/pageMeta.ts`, providing a single source of truth for titles, descriptions, keywords, OG assets, and canonicals.
- Added `scripts/apply-head-meta.ts` plus a `postbuild:head` step so every ViteSSG HTML artifact is rewritten with the page-specific head metadata (24 routes total).
- Updated `vite.config.ts` to respect a `DEPLOY_BASE` env variable (default `/`); this fixes broken `/assets/*` URLs when serving nested SSG pages and excludes gated `/admin` from the SSG pass entirely.
- Regenerated sitemap via `scripts/generate-sitemap.ts` (now 22 routes) and refreshed PWA icons in `public/` during the build pipeline.
- Verified via `npm run build`, `npm run lint`, and `npm run test:thorough` to ensure the SSR output and asset references are stable.

- 🎨 **Leaderboard Headers: Red Gradient + White Text** - Updated leaderboard headers to use red gradient background with white text for strong military command center aesthetic: red gradient (`from-massgate-red to-massgate-red-dark` = #c62828 → #8b0000), dark red border (`border-massgate-red-dark`), white text with subtle shadow - affects all leaderboards (High Scores, Total Scores, Player Leaderboard, Clan Leaderboard) - creates bold, commanding presence matching military tactical UI (Oct 13)
- 🎨 **Text Brightness Enhancement** - Brightened text colors for better visibility on steel blue card backgrounds: primary text (#f3f6f8 → #ffffff pure white), secondary text (#a7b7c3 → #c5d5e0 brighter gray-blue), tertiary text (#6c7a85 → #8a9aa8) - improves readability across all content cards in About, FAQ, Getting Started, Multiplayer, Community sections (Oct 13)
- 🎨 **Design System: Darker Teal Variant** - Added `teal-darker` (#008b9e) to design system for subdued teal applications in headers and badges, completing teal color palette: bright (#4de8ff), default (#00d9ff), dark (#00b8d4), darker (#008b9e), glow (#26c6da) (Oct 13)
- 🎨 **Leaderboard Cleanup: Removed Unnecessary Red Borders** - Removed all unnecessary red borders/separators from leaderboards for cleaner visual flow: removed 3px aggressive red border below header, removed dark border below tab container, removed subtle red borders below table headers (RANK/PLAYER/SCORE) - affects all leaderboards (High Scores, Total Scores, Player Leaderboard, Clan Leaderboard) - creates unified seamless design with header flowing directly into tabs and table without visual breaks (Oct 13)
- 🎨 **Leaderboard Styling: Aggressive Red Headers + Consistent Borders** - Updated all leaderboard headers to use bright aggressive massgate-red (`#c62828`) instead of muted deep Soviet red (`#8b1d14`) for stronger visual hierarchy - fixed Clan Leaderboard outer border to match other leaderboards (`border-[var(--divider-strong)]`) - affects High Scores, Total Scores, Player Leaderboard, and Clan Leaderboard - creates more impactful, eye-catching headers with consistent card borders (Oct 13)
- 🎨 **MAJOR: Authentic Master Branch Steel Blue Theme** - Converted all content cards AND leaderboard tables from pure graphite/black to authentic military steel blue/navy backgrounds from original master branch - added new `panel` colors to design system: panel (DEFAULT: #121e27, dark: #090f14, alt: #1f313d), panel-striped (DEFAULT: #182630, dark: #0e181f) - affects 14 content cards across About, FAQ, Getting Started, Multiplayer, Community + leaderboard table rows (6 cells per table, 2 tables) - leaderboard odd rows: `from-panel/75 to-panel-dark/85`, even rows: `from-panel-striped/78 to-panel-striped-dark/88` - restores authentic darker, more subdued military tactical steel blue from original master branch design, replacing flat graphite/black with dimensional navy blue characteristic of military UI - matches authentic Massgate aesthetics from screenshot (Oct 13)
- 🎨 **Discord Button: Authentic Social Media CTA** - Redesigned desktop Discord button from icon-only to full button with "Join Discord" text, using official Discord brand colors (solid Discord blue #5865F2, white text, rounded corners), matching social media button pattern with hover lift and glow effects - exception to teal/orange theme for third-party brand recognition (Oct 13)
- 🎨 **Icon Badges: Nav Button Style (Solid Orange + Dark Text)** - Updated all icon badges to match navigation button visual style: solid orange gradient backgrounds (`from-massgate-orange-light to-massgate-orange`) with dark text/icons (`text-ink`), replacing semi-transparent gradients - affects Getting Started (timeline badges, advanced section icons, step numbers), About (mission, story, approach, values icons), FAQ (category icons), Discord CTA icons - matches nav tabs design (solid teal background + dark text) but with orange branding (Oct 13)
- 🎨 **MAJOR: Authentic Massgate Orange Structural Color (#f37c2b)** - Replaced teal with authentic Massgate orange (#f37c2b - warm red-tinted orange from original Massgate master branch) for all structural elements: timelines, badges, icon borders, card left accents, decorative lines, clan tags (Multiplayer + Leaderboards), network port numbers, FAQ category headers - added new `massgate-orange` color to design system (DEFAULT: #f37c2b, light: #f8a85e, dark: #e06820) with glows/shadows - teal now reserved ONLY for interactive hover/active states (navigation, buttons, accordions), soviet orange (#ff6600) kept for CTAs/download buttons - honors original Massgate's navigation/header style with authentic color palette, eliminates "teal washing" with proper color hierarchy (Oct 13)
- 🎨 **UI Cleanup: Reduced Teal Overload** - Removed icon badges from subsection headers (Community: Events/Live Streams/Latest Videos/By Content Creator, Multiplayer: Players & Servers/Statistics), changed subsection header text from teal to white for cleaner visual hierarchy, fixed YouTube play button to be always visible (not hidden until hover), teal now reserved for borders/accents/interactive elements (Oct 13)
- 🎨 **Multiplayer Section: Modern Card-Based Redesign** - Complete visual overhaul matching other sections: circular icon badges (server, trophy), server cards with teal accents, player hover changed from orange to teal, removed 372 lines of scoped CSS, reduced from 505 to 221 lines (56% reduction), kept beloved leaderboard tab teal gradient + dark text hover effect (Oct 13)
- 🎨 **About & FAQ Sections: Modern Card-Based Redesign** - Complete visual overhaul matching Getting Started's design language: circular icon badges with teal accents, card-based layouts, Vue transitions for collapsibles, Tailwind-first approach (no CSS variables/inline styles), hover effects reserved for interactive elements only (buttons/links), category icons (graduation-cap, wrench, gamepad, users) (Oct 13)
- 📚 **Documentation Consolidation** - Merged SCROLL_SYSTEM.md and DEEPLINKS.md into architecture.md, reduced from 2,270 lines to 559 lines (75% reduction), deleted design-system.md (duplicate of tailwind.config.ts), updated all references across GUIDE.md and AGENTS.md (Oct 13)
- 🎨 **Community Section: Teal Hover Theme** - Converted all video/event/stream card hover effects from orange to teal accent color matching navigation tabs for consistent visual language, reduced excessive glow effects in design system by ~50% (Oct 13)
- 🎨 **Getting Started: Modern Timeline UI** - Complete redesign with vertical timeline pattern, z-index layered badges/cards/lines, collapsible advanced sections with subtle hover effects, prominent RED download CTA button, orange underlined links in advanced sections (Oct 13)
- 🔄 **MAJOR: Pinia State Management Migration** - Complete migration from composable-based state to Pinia stores, added authentication system with mock JWT (admin/user roles), protected routes with guards, session persistence via localStorage, 19 new auth tests (44 total tests), comprehensive docs update (Oct 13)
- 🐛 **Server 0 Display Fix** - Players with serverId 0 (logged in but not on any server) now display as "Online" instead of "Server 0", added comprehensive tests and API documentation (Oct 13)
- 🎨 **Widget Icon Brand Colors** - Fixed Discord and YouTube widget icons to display their official brand colors (#5865F2 and #e53935) by making iconClass conditional in WidgetBase.vue, removed excessive teal glow from Getting Started step badges (Oct 12)
- 🎨 **MAJOR: Tailwind CSS Migration** - Complete rewrite from modular CSS to utility-first Tailwind approach, ~80% code reduction (8,154 deletions vs 1,569 additions), deleted 29 CSS module files, all design tokens moved to `tailwind.config.ts` (Oct 12)
- ✨ **Homepage Enhancement: Glassmorphism & Video Background** - Added frosted glass widget effect (desktop only), 22MB video background with SSR guards, enhanced text readability with drop shadows, 3-slide onboarding wizard for first-time visitors (Oct 12)
- 🔧 **CRITICAL: Page Reload Scroll Fix** - Fixed page refresh failing to reach FAQ/About sections by removing global CSS `scroll-behavior: smooth` that overrode JavaScript control, now uses smart behavior: instant jump (`auto`) on page reload to avoid smooth scroll distance limitations (~700ms browser animation timeout), smooth animation on SPA clicks for UX (Oct 11)
- 🎨 **Layout Stability: SSR→CSR Hydration** - Added min-height constraints to Community section containers (events: 380px, videos: 340px, streams: 200px) matching skeleton loaders, prevents layout shifts during API data loading, added 500ms hydration protection to useActiveSection to prevent premature scroll tracking during SSR→CSR transition, implemented smart scroll delays (400ms direct nav, 100ms SPA) (Oct 11)
- 🎯 **Navigation Highlighting: Hybrid Scroll Tracking** - Replaced complex IntersectionObserver with simple hybrid approach: click navigation uses route (instant), manual scrolling uses position-based tracking (scroll position + header height), added programmatic scroll protection to prevent racing highlights, ~110 lines vs 100+ complex observer code (Oct 10)
- 🧹 **Code Cleanup: Scroll System Documentation** - Removed duplicate `.section` CSS definition, updated outdated comments to reflect manual offset calculation instead of `scroll-padding-top`, consolidated `.section` definition with `position: relative` in layout.css (Oct 10)
- 🔧 **CRITICAL: Scroll Positioning & Navigation Height Fix** - Fixed hardcoded `.hdr` heights breaking dynamic measurement system and browser `scroll-padding-top` inconsistencies by using both `height` + `min-height` properties and manual offset calculation in router scrollBehavior for pixel-perfect positioning across all browsers and breakpoints (Oct 10)
- 🔧 **CRITICAL: Missing CSS Imports Fixed** - Discovered and fixed missing `hero.css` and `visual-hierarchy.css` imports in `base.css` that prevented dynamic header height from working, added comprehensive scroll system documentation in [architecture.md](architecture.md#scroll--navigation-system) (Oct 10)
- 🎯 **Dynamic Header Height Sync** - Implemented industry-standard auto-syncing system: JavaScript measures actual header height, updates CSS variable `--header-height`, `scroll-padding-top` uses variable for pixel-perfect positioning at all breakpoints, zero maintenance required (Oct 10)
- 🔄 **Native Scroll & Navigation System Refactor** - Complete rewrite using CSS/HTML-first approach: `scroll-behavior: smooth`, CSS variables for scroll offset, native `scrollRestoration: auto`, removed 500+ lines of custom JS logic (80% reduction), removed expandable sections for better discoverability (Oct 10)
- 🏗️ **Major Refactoring (Phases 1-5)** - Comprehensive codebase optimization: extracted composables, improved type safety, decomposed components, performance optimizations, developer experience enhancements (Oct 10)
- 🎨 **Live Servers Widget Color Enhancement** - Added dynamic player count colors (green < 50%, orange 50-89%, red ≥ 90%) matching Multiplayer section (Oct 9)
- 🎨 **Quick Start Widget Enhancement** - Added download icon and "Install WICGATE" CTA (reused from removed homepage button) for clearer action (Oct 9)
- 🌈 **Server Name Color Rendering** - Fixed Live Servers widget to properly render WiC in-game color codes, matching Multiplayer section display (Oct 9)
- 🔗 **Discord Navigation Integration** - Moved Discord from homepage CTA to navigation bar (icon-only on desktop, full link in mobile menu), removed redundant homepage buttons (Oct 9)
- 🔄 **Navigation System: Path-Based Nested Routes** - Refactored from hash-based to nested routes (27 pre-rendered routes), unique SEO meta tags per subsection, 80% code reduction (Oct 9)
- 🎨 **Widget Dashboard Styling Improvements** - Top Players widget now matches leaderboard styling: rank insignias, clan tags (orange), player names (white), podium colors for scores (Oct 9)
- 🎨 **Homepage Redesign: Widget Dashboard** - Replaced hero carousel with function-geared widget grid, integrated player count into Live Servers widget (Oct 9)
- 🐛 **90-Second Refresh Bug Fix** - Fixed LivePlayersBadge and Multiplayer section flashing/crashing every 90 seconds during polling (Oct 8)
- 🔧 **Hash Navigation Fix** - Replaced hash-based URLs with path-based routes in hero section for SSG compatibility (Oct 8)
- 📖 **GUIDE.md Update** - Added path-based navigation pattern to prevent future hash navigation bugs (Oct 8)
- 🎯 **Navigation UX Improvement** - Aligned navigation to left (gaming industry standard) for faster F-pattern scanning, matching Steam/Epic/Battle.net (Oct 8)
- 🔄 **Section Rename: Multiplayer** - Renamed "Game Mode" to "Multiplayer" for clarity, updated routes from `/game-mode` to `/multiplayer` (Oct 8)
- 🎮 **Hero Widget: Live Players Badge** - Added interactive player count widget to hero section with click-to-navigate to Multiplayer (Oct 8)
- 🧹 **UI Cleanup** - Removed Players Online panel/button, cleaned up related CSS/analytics/utilities (Oct 8)
- 🐛 **Critical Scroll Jump Fix** - Fixed fundamental scroll positioning bugs with async content loading using industry-standard patterns (Oct 6)
- ⚡ **Scroll Performance Improvement** - Removed artificial setTimeout delays (50-200ms) from navigation scrolling for instant, more predictable UX (Oct 6)
- ⚡ **Twitch Embed Performance Optimization** - Implemented click-to-load facade pattern with static previews, reducing initial page load by ~1.2MB (Oct 6)
- 🐛 **Memory Leak & Cleanup Fixes** - Fixed RAF/timeout cleanup in throttle/debounce utilities, added cancel methods, fixed visibilitychange listener leak (Oct 5)
- 🧹 **Code Review Cleanup** - Removed deprecated getDynamicHeaderHeight() function and lodash vite config reference, 26 tests passing (Oct 4)
- 🔧 **Constants Refactor & Cleanup** - Restored breakpoint/timing constants, removed unused dependencies/timers, centralized magic numbers (Oct 4)
- ⚡ **Performance & Bundle Optimization** - Removed axios/lodash (-83KB), debounced resize handlers (-95% events), RAF throttled scrolling (60fps locked), consolidated utilities, fixed memory leaks (Oct 3)
- 🔧 **Scroll Jumping & Hydration Fix** - Eliminated scroll jumping and SSR hydration mismatches with v-show + CSS transitions (Oct 3)
- 🎯 **Advanced Setup Collapsible** - Made Advanced Setup Options collapsible by default for cleaner onboarding (Oct 3)
- 🎯 **Getting Started Simplification** - Compressed 4 steps to 3, removed Requirements box, streamlined onboarding (Oct 3)
- 🎨 **Navigation Flash Fix** - Disabled scroll listener during programmatic navigation to prevent highlight flash (Oct 2)
- 🎨 **WICGATE Logo UX** - Made logos non-interactive in navigation and game mode (Oct 2)
- 🎨 **Navigation Animation Polish** - Smart transition system prevents cascade flicker during fast scrolling (Oct 2)
- 🎯 **Primary CTA Enhancement** - Dramatically improved download/Discord button interactivity (Oct 2)
- 🏆 **Leaderboard Top 3 Styling** - Removed glow effects from podium colors (Oct 2)
- 🎮 **Game Mode Header Buttons** - Revamped to match navigation's interactive design system (Oct 2)
- ▶️ **YouTube Play Button** - Updated to match YouTube's rounded rectangle shape (Oct 2)
- 🎨 **Visual Design Cleanup** - Removed green status indicators, fixed Twitch embed styling (Oct 2)
- 🔧 **Quick Fixes** - Added svgo dependency, improved .gitignore, fixed type safety in Home.vue (Oct 2)
- 🔄 **Navigation Scroll Fix** - Simplified resize handler to use centralized `scrollToSection()` utility (Oct 2)
- 📖 **GUIDE.md Optimization** - Streamlined from 500 → 182 lines, essential patterns only (Oct 2)
- 📋 **Documentation Restructure** - CLAUDE.md → pure preferences, GUIDE.md → detailed patterns (Oct 2)
- 📘 **API Documentation** - Complete endpoint reference, data structures, integration patterns (Oct 2)
- 📚 **Documentation Enhancement** - Fixed state management docs, added quick summaries, enhanced onboarding (Oct 2)
- 📱 **PWA Implementation** - Full offline capability, installable app with service worker
- 📊 **Analytics Integration** - 15 event categories, Web Vitals tracking
- 🧪 **Testing Infrastructure** - 26 tests, hybrid timing (0.7s fast / 14s thorough)
- ♻️ **Scroll System Refactor** - 3 focused functions, eliminated 40+ lines duplication
- 🔧 **Enhanced Error Handling** - 3-retry exponential backoff, Page Visibility API
- 🔍 **SEO Revolution** - 7 unique pre-rendered HTML files, path-based routing
- 🚀 **Pixel-Perfect Navigation** - Dynamic measurement, zero hardcoded values
- 🎨 **Navigation Modernization** - Rectangular tabs, multi-layer shadows
- 🔵 **Interactive Elements Unification** - Consistent orange hover backgrounds
- 🎯 **Players Button Redesign** - 52px pill-shaped, mobile-optimized
- 🔗 **Advanced Setup UX** - Professional hyperlinks for file downloads
- 👤 **Content Creator Redesign** - Ultra-compact badges (37% size reduction)

---

## October 2025

### October 22, 2025 - SSG Optimization & Rich Search Results

**Highlights**
- Optimized SSG pre-rendering from 15+ routes to 6 main pages following SSG best practices to avoid thin content
- Reduced sitemap from 15+ URLs to 5 clean entries (main sections only, excludes subsections and noindex pages)
- Consolidated SEO for subsections: all content visible on parent pages, canonical URLs point to parents for maximum SEO signal strength
- Implemented comprehensive structured data for rich search results: BreadcrumbList, SoftwareApplication, HowTo, VideoGame, WebPage schemas
- Enhanced FAQPage schema with Organization author and dateModified timestamps for freshness signals
- Build produces 6 optimized HTML files, all 44 tests passing, TypeScript strict mode clean, all schemas validated

**Technical Details**

**SSG Best Practices Implementation:**
- **vite.config.ts (lines 154-157):** Updated `includedRoutes()` filter to pre-render only 6 main pages: `['/', '/downloads', '/statistics', '/community', '/faq', '/login']`
- **Build optimization:** Reduced from 15+ pre-rendered pages to 6 (60% reduction)
- **Faster builds:** 40% fewer HTML files to generate and process
- **Smaller dist/ folder:** No thin content pages from subsections
- **scripts/generate-sitemap.ts (lines 44-52):** Removed subsection loops, generates 5 URLs (excludes /login as it's noindex)
- **Home.vue (lines 47-56):** Added `effectiveSeoPath` computed property - subsections inherit parent page path for SEO
- **Home.vue (lines 58-78):** Updated `matchedMeta` computed to find parent route meta for subsections
- **Canonical URLs:** Subsection routes (e.g., /downloads/quick) canonical to parent (e.g., /downloads)

**Sitemap Optimization:**
- **Before:** 15 URLs (all main sections + all subsections + login)
- **After:** 5 URLs (only main sections with substantial content)
- **Excluded:** All subsections (client-side tab navigation only), /login (noindex page)
- **Included:** /, /downloads, /statistics, /community, /faq
- **Priorities:** Homepage (1.0), Community/FAQ (0.8), Downloads/Statistics (0.5)
- **Change frequencies:** Homepage (daily), Community/FAQ (weekly), Downloads/Statistics (monthly)

**Rich Search Results Schemas (src/utils/structuredData.ts):**

1. **BreadcrumbList** (lines 175-186)
   - Shows breadcrumb trails in Google search results (e.g., "Home > Downloads", "Home > FAQ")
   - Added to all section pages automatically based on route
   - Improves navigation clarity and CTR

2. **SoftwareApplication** (lines 192-210)
   - WIC LIVE installer with complete metadata
   - Includes: name, category (GameApplication), price (free), OS requirements (Windows 7-11)
   - Download URL, file size (~50MB), screenshot
   - Enables rich app download cards in search results

3. **HowTo** (lines 223-237)
   - Step-by-step installation guide schema
   - 4 detailed steps with names, descriptions, optional images/URLs
   - Enables rich how-to cards in Google with numbered steps
   - Applied to Downloads page for installation instructions

4. **VideoGame** (existing, now applied to homepage)
   - World in Conflict game information
   - 4.5/5 AggregateRating (1000 reviews)
   - Platform (PC), publisher (Ubisoft), genre, release date
   - Shows star ratings and game info in search results

5. **WebPage** (lines 260-279)
   - Page structure wrapper for all pages
   - Links breadcrumbs (when present) to main content entity
   - References parent WebSite schema
   - Provides context for search engines about page relationships

6. **Enhanced FAQPage** (lines 109-136)
   - Added Organization author (WICGATE) with URL
   - Added dateModified field (auto-updates to current date)
   - Individual items support optional dateModified and author fields
   - Enables FAQ rich snippets with expandable dropdowns in Google

**Home.vue Schema Integration (lines 253-325):**
```typescript
script: [
  // Organization (all pages)
  { type: 'application/ld+json', textContent: ..., key: 'organization-schema' },

  // Homepage only: WebSite + VideoGame
  ...(!targetSection.value ? [...] : []),

  // Section pages: BreadcrumbList
  ...(breadcrumbs.value.length > 1 ? [...] : []),

  // All pages: WebPage wrapper
  { type: 'application/ld+json', textContent: ..., key: 'webpage-schema' },

  // Downloads page: SoftwareApplication + HowTo
  ...(targetSection.value === 'downloads' ? [...] : []),
]
```

**Files Modified:**
- `vite.config.ts` - SSG route filtering
- `scripts/generate-sitemap.ts` - Sitemap generation logic
- `src/views/Home.vue` - Meta tag inheritance, schema integration
- `src/utils/structuredData.ts` - New schema generators
- `public/sitemap.xml` - Regenerated with 5 URLs

**Why This Matters**
- **Better SEO:** Consolidated signals to fewer, stronger pages (no thin content dilution)
- **Rich search features:** Breadcrumbs, FAQ dropdowns, how-to cards, app info cards, star ratings
- **Faster builds:** 40% fewer pages to pre-render and process
- **Better crawl budget:** Google spends more time on quality pages vs thin subsections
- **No duplicate content:** One authoritative page per topic
- **Improved user experience:** All search result enhancements make finding information easier

### October 16, 2025 - Code Quality & Security Improvements

**Highlights**
- Fixed missing @vitest/coverage-v8 dependency causing test coverage to fail (critical blocker for CI/CD pipelines)
- Added prominent mock authentication warnings to production builds: visual banner in Admin dashboard, demo mode notice in Login page, console error in auth store
- Created comprehensive security documentation (docs/security.md) covering XSS prevention strategies, authentication security concerns, API security best practices, storage security, and deployment checklist
- Extracted magic numbers to constants.ts: SERVER_MAX_CAPACITY (16 players), SERVER_CAPACITY_THRESHOLDS (90% full, 50% medium, 0% low)
- Migrated 3 most-used legacy CSS variables to Tailwind utilities across 8 files: --g → bg-online, --t3 → text-t-tertiary, --bd → border-mg
- Added security comments to usePlayerDisplay.ts documenting hex validation preventing CSS injection
- All 44 tests passing, TypeScript strict mode clean, ESLint zero errors

**Technical Details**

**Phase 1 - Critical Fixes:**
- `package.json`: Installed @vitest/coverage-v8@3.0.0 as dev dependency (required by vitest.config.ts)
- `src/views/Admin.vue`: Added prominent mock auth warning banner with red border/background, icon, and bold text after line 82
- `src/views/Login.vue`: Added demo mode warning notice with red styling and Flask icon after line 65
- `src/stores/auth.ts`: Added production environment check logging critical error when mock auth detected in production build (after line 11)
- `docs/security.md`: Created 250+ line comprehensive security guide covering XSS prevention (v-html usage analysis, sanitization strategies), authentication security (mock auth risks, production recommendations), API security (CORS, rate limiting), storage security (localStorage risks), vulnerability reporting, and deployment security checklist
- `src/composables/usePlayerDisplay.ts`: Added inline security comment at hex validation documenting CSS injection prevention (line 75-77)

**Phase 2 - High Priority:**
- `src/constants.ts`: Added SERVER_MAX_CAPACITY constant (16) and SERVER_CAPACITY_THRESHOLDS object (FULL: 0.9, MEDIUM: 0.5, LOW: 0) after line 9
- `src/screens/Multiplayer.vue`: Updated player count display to use SERVER_MAX_CAPACITY constant instead of hard-coded 16 (line 139)
- `tailwind.config.ts`: Added t-tertiary color (#6c7a85) to text hierarchy for muted text (line 88)
- `src/components/Footer.vue`: Migrated 4 CSS variable usages to Tailwind classes (bg-graphite-dark, border-mg, text-t-tertiary, bg-online)
- `src/components/LeaderboardGroup.vue`: Replaced var(--t3) with text-t-tertiary in 2 locations (lines 173, 265)
- `src/components/TwitchFacade.vue` & `src/components/TwitchEmbed.vue`: Migrated var(--s2) → bg-graphite-light, var(--bd) → border-mg
- `src/composables/useServerCapacity.ts`: Changed getCapacityColor() to return hex colors directly (#e53935 red, #ff6600 orange, #7cb342 green) instead of CSS variables (lines 53-55)

**Why This Matters**
- Test coverage now works in CI/CD pipelines (previously failed with "Cannot find dependency" error)
- Mock authentication now has visible warnings preventing accidental production deployment
- Security documentation provides clear guidance for production hardening (real auth backend, XSS prevention, deployment checklist)
- Magic number extraction improves maintainability (single source of truth for server capacity)
- CSS variable migration reduces technical debt and improves type safety (Tailwind IntelliSense works better with utility classes)

### October 17, 2025 - Leaderboard Divider Cleanup

- Removed table header and body border utilities from the statistics leaderboard so the cards no longer show unintended white seams between cells.
- Kept hover highlights using existing orange gradient utilities; no changes to data fetching or row rendering.

**Files**
- `src/components/LeaderboardGroup.vue`

### October 15, 2025 - ESLint 9 Migration (Security Update)

**Highlights**
- Upgraded from ESLint 8.57.1 (end-of-life October 5, 2024) to ESLint 9.37.0 for continued security patch support.
- Migrated from deprecated `.eslintrc.json` format to modern flat config (`eslint.config.js`) as required by ESLint 9.
- Upgraded all ESLint-related packages: `eslint-plugin-vue` (9.33.0 → 10.5.0), `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` (8.44.0 → 8.46.1), `vue-eslint-parser` (→ 10.2.0).
- Added comprehensive browser globals (DOM, Fetch API, Service Workers) and Node.js globals to flat config to eliminate `no-undef` errors.
- Verified zero breaking changes: all 44 tests passing (`npm run test:thorough`), TypeScript compilation clean (`npx tsc --noEmit`), linting passes with 0 errors, Prettier integration working, build scripts functional.
- Configuration files (`*.config.ts/js`) and `scripts/**` properly ignored by ESLint as intended.

**Technical Details**
- `package.json`: Updated ESLint and related plugins to latest compatible versions with `--legacy-peer-deps` flag for peer dependency resolution
- `eslint.config.js`: Created new flat config with ESM imports, explicit plugin registration, comprehensive globals definition, preserved all custom rules (unused var patterns, Prettier integration, Vue-specific overrides)
- `.eslintrc.json`: Deleted deprecated config file after successful migration
- All source files (`.ts`, `.vue`) lint cleanly with new configuration
- Pre-commit hooks continue to work without modification
- `npm run lint` and `npm run lint:fix` commands unchanged

**Why This Matters**
- ESLint 8 reached end-of-life on October 5, 2024 and no longer receives security patches for newly discovered vulnerabilities
- Flat config is the future of ESLint configuration and will be the only format supported in ESLint 10 (expected early 2025)
- Proactive migration ensures continued security support and compatibility with future ESLint ecosystem updates
- Zero disruption to development workflow - all existing scripts, hooks, and IDE integrations continue to work

### October 14, 2025 - @unhead/vue Migration (Head Management Library)

**Highlights**
- Migrated from deprecated `@vueuse/head@2.0.0` to modern `@unhead/vue@1.11.18` (official successor maintained by the Unhead team).
- Fixed critical API difference: changed `children` property to `textContent` in all `useHead()` script blocks for proper JSON-LD rendering during ViteSSG build.
- Removed manual head setup from `src/main.ts` since vite-ssg v28+ automatically integrates @unhead/vue (no `createHead()` needed).
- Verified structured data renders correctly during SSG: both @unhead/vue AND post-build script now inject JSON-LD (belt-and-suspenders approach).
- All 44 tests passing, build successful, structured data properly formatted in all 22 pre-rendered pages.

**Technical Details**
- `package.json`: Replaced `@vueuse/head@2.0.0` with `@unhead/vue@1.11.18` in devDependencies
- `src/main.ts`: Removed `import { createHead } from '@vueuse/head'` and manual head setup (lines 132-134), added comment explaining vite-ssg v28+ auto-integration
- `src/views/Home.vue`: Changed import to `@unhead/vue`, replaced `children:` with `textContent:` in both Organization and WebSite schema script blocks
- Result: Structured data now renders during SSG via @unhead/vue, with post-build script as backup safety net

**Why This Matters**
- @vueuse/head is officially sunset/deprecated, @unhead/vue is the maintained successor integrated with modern build tools
- Using `children` property with @unhead/vue produces malformed HTML attributes instead of proper JSON-LD content
- Future-proof foundation: when tailwind branch merges to master, it brings modern, maintained library with correct API usage
- Belt-and-suspenders approach ensures structured data works even if library behavior changes

### October 14, 2025 - Structured Data SEO Fix + Code Cleanup

**Highlights**
- Extended `scripts/apply-head-meta.ts` to inject JSON-LD structured data during post-build processing, fixing a critical SEO gap where @vueuse/head v2 doesn't render `<script>` tags during SSG.
- Added Organization schema to all 22 pre-rendered pages and WebSite schema to homepage for rich search results and Google Knowledge Panel eligibility.
- Cleaned up unused imports/variables from store initialization refactoring: removed `onMounted` from Admin.vue, removed unused `authStore` from Home.vue.
- Build validation now passes with 0 errors, 0 warnings (previously had 22 warnings for missing structured data).
- Verified with `npm run lint`, `npm test`, and new `npm run validate:build` command.

**Technical Details**
- `apply-head-meta.ts`: Added `injectStructuredData()` function that imports schemas from `src/utils/structuredData.ts` and injects minified JSON-LD before `</head>` tag
- All 22 routes now include proper schema.org Organization markup with name, logo, description, social links, and founding date
- Homepage additionally includes WebSite schema with search action for enhanced search engine integration
- Created `scripts/validate-build.ts` for automated post-build quality checks (favicon paths, canonical URLs, meta tags, structured data)

### October 13, 2025 - Pinia State Management Migration + Authentication

- Complete migration from composable-based state to Pinia stores
- Added authentication system with mock JWT (admin/admin123, user/user123)
- Protected routes with guards (`/login`, `/admin`)
- Session persistence via localStorage
- 19 new auth tests (44 total tests passing)
- Fixed critical reactivity bug (destructuring breaks reactivity)
- Updated CLAUDE.md from "NEVER use Pinia" to "ALWAYS use Pinia"

### October 13, 2025 - Server 0 Display Fix

- Players with `serverId: 0` now display as "Online" instead of "Server 0"
- Added 10 comprehensive tests covering all edge cases
- Updated API documentation with serverId behavior

### October 12, 2025 - Tailwind CSS Migration

- Complete rewrite from modular CSS to utility-first Tailwind
- ~80% code reduction (8,154 deletions vs 1,569 additions)
- Deleted 29 CSS module files
- All design tokens moved to `tailwind.config.ts`
- Added glassmorphism widgets (desktop only)
- 22MB video background with SSR guards
- Enhanced 3-slide onboarding wizard

### October 11, 2025 - SSR Hydration & Scroll Fixes

- Fixed page refresh failing to reach FAQ/About sections
- Removed global CSS `scroll-behavior: smooth` that overrode JS control
- Added min-height constraints matching skeleton loaders
- 500ms hydration protection to prevent premature scroll tracking
- Smart scroll delays (400ms direct nav, 100ms SPA)

### October 10, 2025 - Navigation & Scroll System Refactor

- Replaced IntersectionObserver with hybrid scroll tracking (~110 lines vs 100+)
- Fixed hardcoded header heights breaking dynamic measurement
- Added missing CSS imports (hero.css, visual-hierarchy.css)
- Implemented industry-standard auto-syncing system for header height
- Complete rewrite using CSS/HTML-first approach (removed 500+ lines JS)

### October 9, 2025 - Path-Based Nested Routes

- Refactored from hash-based to nested routes (27 pre-rendered routes)
- Unique SEO meta tags per subsection
- 80% code reduction in navigation logic
- Clean URLs: `/multiplayer/statistics` instead of `/multiplayer#statistics`
- Widget dashboard redesign: replaced carousel with 6 functional widgets

### October 8, 2025 - Navigation UX & Bug Fixes

- Fixed 90-second refresh bug (LivePlayersBadge and Multiplayer flashing)
- Replaced hash-based URLs with path-based routes for SSG compatibility
- Left-aligned navigation (gaming industry standard)
- Renamed "Game Mode" to "Multiplayer"
- Added LivePlayersBadge hero widget
- Removed Players Online panel/button

### October 6, 2025 - Performance Optimizations

- Removed setTimeout delays (50-200ms) from navigation scrolling
- Fixed critical scroll jump bugs with async content loading
- Twitch embed facade pattern (reducing page load by ~1.2MB)
- Industry-standard async scroll handling

### October 5, 2025 - Memory Leak Fixes

- Fixed RAF/timeout cleanup in throttle/debounce utilities
- Added cancel methods to prevent callbacks after unmount
- Fixed visibilitychange listener leak in appDataStore

### October 4, 2025 - Code Review Cleanup

- Removed deprecated getDynamicHeaderHeight() function
- Removed lodash from vite config
- Restored breakpoint/timing constants to constants.ts
- Centralized magic numbers across codebase

### October 3, 2025 - Bundle Optimization

- Removed axios/lodash (-83KB bundle size)
- Debounced resize handlers (-95% events)
- RAF throttled scrolling (60fps locked)
- Fixed memory leaks and race conditions
- Consolidated duplicate utilities

### October 2, 2025 - Documentation & UX Polish

- GUIDE.md optimization (500 → 182 lines)
- Documentation restructure (CLAUDE.md → preferences, GUIDE.md → patterns)
- Complete API documentation
- Navigation animation polish
- Primary CTA enhancement
- Visual design cleanup

---

## September 2025

- Major architecture changes: Single-page app with section-based navigation
- Mobile navigation overhaul: Full-screen with smooth animations
- Events system integration: Discord-connected with real-time sync
- Content creator redesign: Ultra-compact badges (37% size reduction)
- First visit experience: Welcome overlay with localStorage detection
- Live streaming integration: Embedded Twitch streams in Community
- Enhanced responsive design: Improved breakpoints and touch targets
- Color consistency improvements: Standardized text colors across components
- Advanced setup UX optimization: Contextual hyperlinks for file downloads
- Web Vitals monitoring: Core Web Vitals tracking (CLS, FCP, INP, LCP, TTFB)
- Build automation: Icon generation, sitemap creation, PWA manifest

---

## Future Enhancements

### Planned Features

- [ ] Implement lazy loading for video thumbnails
- [ ] Add E2E tests with Playwright
- [ ] Performance benchmarking
- [ ] Accessibility testing (axe-core)

### Under Consideration

- Service worker update notifications
- Offline-first data caching strategy
- Enhanced analytics dashboards
- Advanced search functionality

---

*For current features and architecture, see [README.md](../README.md) and [architecture.md](architecture.md).*
