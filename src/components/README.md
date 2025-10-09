# Components Directory

Quick reference for WiCGATE component library. See component source files for detailed JSDoc documentation.

## Core Components

| Component | Purpose |
|-----------|---------|
| `ErrorBoundary.vue` | Error handling with user-friendly fallback UI |
| `Navigation.vue` | Main site navigation (desktop tabs, mobile menu) |
| `HeaderBanner.vue` | Logo and players online button |
| `PlayersOnline.vue` | Slide-in panel for live player list |
| `FirstVisitOverlay.vue` | Welcome overlay for first-time visitors |
| `WidgetDashboard.vue` | Homepage widget grid (orchestrator for widget components) |
| `LeaderboardGroup.vue` | Tabbed leaderboard tables (Overall, Domination, etc.) |
| `RankInsignia.vue` | Player rank badge icons |
| `TwitchEmbed.vue` | Embedded Twitch stream player |
| `Footer.vue` | Site footer |

## Widget Components *(Phase 3.2 - Oct 10, 2025)*

Modular widget system for homepage dashboard. All widgets in `widgets/` directory:

| Component | Purpose | Lines |
|-----------|---------|-------|
| `WidgetBase.vue` | Base widget structure (wrap content with consistent styling) | 73 |
| `QuickStartWidget.vue` | Installation quick links and download CTA | 63 |
| `LiveServersWidget.vue` | Real-time server status with player counts | 86 |
| `TopPlayersWidget.vue` | Top 5 leaderboard preview | 87 |
| `CommunityWidget.vue` | Upcoming Discord events with countdown | 74 |
| `LatestVideosWidget.vue` | Latest 3 YouTube videos from multiple channels | 86 |
| `GettingHelpWidget.vue` | FAQ quick links and support resources | 57 |

**Usage Example:**
```vue
<WidgetBase
  title="Widget Title"
  icon="icon-name"
  action="Action Text"
  @action-click="handleClick"
>
  <template #default>
    <!-- Widget content -->
  </template>
</WidgetBase>
```

**See:** [docs/design-system.md - Widget Components](../../docs/design-system.md#widget-components-phase-32)

## Skeleton Loaders

SEO-friendly loading placeholders with `<noscript>` fallbacks:

- `EventsSkeleton.vue` - Events grid placeholder
- `VideosSkeleton.vue` - Video grid placeholder
- `LeaderboardSkeleton.vue` - Leaderboard table placeholder

## Documentation

- **Component Props/Emits:** See JSDoc in component source files
- **Project Structure:** [docs/architecture.md](../../docs/architecture.md#complete-project-structure)
- **Design Patterns:** [docs/design-system.md](../../docs/design-system.md)
- **Testing:** [docs/testing.md](../../docs/testing.md)

## Contributing

When creating new components:
1. Add TypeScript props/emits interfaces
2. Include JSDoc comments for IDE hints
3. Follow design patterns in [design-system.md](../../docs/design-system.md)
4. Use design tokens (no hardcoded colors)
5. Ensure SSR compatibility
6. Write unit tests
