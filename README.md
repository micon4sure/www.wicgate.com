# WiCGATE Community Portal

> Modern community portal for the World in Conflict revival initiative (WiCGATE/Massgate)

[![Deploy Status](https://github.com/micon4sure/www.wicgate.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/micon4sure/www.wicgate.com/actions/workflows/deploy.yml)

**Live Site:** [wicgate.com](https://wicgate.com)

## Overview

WiCGATE delivers a Massgate-inspired experience for the World in Conflict revival, featuring live player statistics, onboarding guides, community events, and military-themed styling. Built as a Progressive Web App with SEO-optimized Static Site Generation for offline capability and search engine visibility.

## Tech Stack

- **Framework:** Vue 3 + TypeScript (Composition API)
- **Build System:** Vite with ViteSSG for Static Site Generation
- **State Management:** Composable modules with reactive refs
- **Routing:** Vue Router (path-based, 7 pre-rendered routes)
- **Styling:** Modular CSS with design tokens
- **PWA:** Service worker with offline capability
- **Testing:** Vitest + Vue Test Utils (27 tests, 50%+ coverage)
- **Analytics:** Custom type-safe event tracking
- **CI/CD:** GitHub Actions + GitHub Pages

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run tests (fast mode ~0.7s)
npm test

# Production build
npm run build

# Preview production build
npm run preview
```

### Alternative: Using Bun (22% faster)

```bash
bun install
bun run dev
bun run test  # ~0.57s (22% faster than npm)
```

**⚠️ Important:** Use `bun run test`, NOT `bun test` (invokes Bun's native test runner instead of Vitest)

## Available Commands

```bash
npm run dev              # Development server
npm run build            # Production build (SSG + PWA + icons + sitemap)
npm run build:icons      # Generate PWA icons from favicon.svg
npm run preview          # Preview production build
npm test                 # Tests - fast mode with fake timers (~0.7s)
npm run test:thorough    # Tests - real timers for CI (~14s)
npm run test:watch       # Tests in watch mode
npm run test:ui          # Tests with Vitest UI
npm run test:coverage    # Coverage report (50%+ threshold)
npm run lint             # ESLint + Prettier
npm run lint:fix         # Auto-fix linting issues
```

## Documentation

### Core Documentation

- **[Architecture Guide](docs/architecture.md)** - SSG/SSR, routing, navigation system, PWA, build process, deployment
- **[Design System](docs/design-system.md)** - CSS tokens, patterns, hover effects, components, responsive design
- **[Testing Guide](docs/testing.md)** - Test commands, coverage thresholds, strategies, CI/CD integration
- **[API Documentation](docs/api.md)** - Endpoints, data structures, error handling, integration patterns
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues, known bugs, SSR guards, solutions
- **[Changelog](docs/changelog.md)** - Recent changes, feature history, technical deep dives

### Developer Resources

- **[CLAUDE.md](CLAUDE.md)** - AI agent operational rules and mandatory constraints
- **[GUIDE.md](GUIDE.md)** - Quick reference guide for AI agents and developers

## Project Structure

```
src/
├── main.ts              # ViteSSG entry point + PWA registration
├── router/              # Vue Router with SEO metadata
├── stores/              # Composable state modules
├── components/          # Reusable UI components
│   ├── Navigation.vue   # Pixel-perfect responsive navigation
│   ├── LeaderboardGroup.vue  # Enhanced leaderboard tables
│   ├── PlayersOnline.vue     # Slide-in live player panel
│   ├── FirstVisitOverlay.vue # Welcome overlay
│   └── skeletons/       # SEO-friendly loading states
├── screens/             # Section components
│   ├── GettingStarted.vue
│   ├── Community.vue
│   ├── Statistics.vue
│   ├── About.vue
│   └── FAQ.vue
├── views/               # Routed pages
│   ├── Home.vue         # Main SPA with all sections
│   └── GameMode.vue     # Standalone game mode page
├── composables/         # Composition functions
│   ├── useYoutube.ts    # Multi-channel video fetching (SSR-safe)
│   ├── useEvents.ts     # Discord events integration (SSR-safe)
│   └── useFirstVisit.ts # First-time visitor detection
├── utils/               # Utility functions
│   ├── scroll.ts        # Dynamic navigation scroll system
│   ├── analytics.ts     # Type-safe event tracking
│   ├── performance.ts   # Web Vitals monitoring
│   └── structuredData.ts # SEO JSON-LD schemas
└── assets/styles/       # Modular CSS with design tokens
```

**See [docs/architecture.md](docs/architecture.md#project-structure) for complete structure and explanations.**

## Development

### Editor Setup

- **Recommended:** VS Code with Volar/Vetur for Vue 3
- **Formatting:** Prettier via ESLint (no CRLF)
- **Type Checking:** TypeScript strict mode

### Environment Variables

Create `.env` for local development:

```env
VITE_API_BASE=https://www.wicgate.com/api
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_SENTRY_DSN=
```

See [.env.example](.env.example) for complete configuration options.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the [design system](docs/design-system.md)
4. Run tests and linting (`npm test && npm run lint`)
5. Commit with descriptive messages
6. Push to your fork and submit a pull request

### Guidelines

- Follow established patterns in [docs/design-system.md](docs/design-system.md)
- Use design tokens (no hardcoded hex values)
- Maintain test coverage (50%+ threshold)
- Document architectural changes in relevant docs
- Work from feature branches; keep commits scoped

**See [docs/architecture.md#contributing](docs/architecture.md#contributing) for detailed contribution guidelines.**

## Deployment

**Live Site:** https://www.wicgate.com/

Auto-deploys on every push to `master` via GitHub Actions → GitHub Pages.

**See [docs/architecture.md#deployment](docs/architecture.md#deployment) for detailed deployment workflow and configuration.**

## License

Custom / Project-specific. Not affiliated with Ubisoft or Massive Entertainment.

## Support

- **Issues:** [GitHub Issues](https://github.com/micon4sure/www.wicgate.com/issues)
- **Discord:** [WiCGATE Community](https://discord.gg/WnxwfMTyBe)
- **Documentation:** [docs/](docs/)

---

Built with ❤️ for the World in Conflict community
