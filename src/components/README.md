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

## Widget Components

Homepage dashboard uses `DynamicInfoCard.vue` and `MediaEventCard.vue` in `widgets/` directory, orchestrated by `WidgetDashboard.vue`.

## Skeleton Loaders

SEO-friendly loading placeholders with `<noscript>` fallbacks:

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
