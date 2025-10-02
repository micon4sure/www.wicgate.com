# API Documentation

## Overview

The WiCGATE API provides real-time access to World in Conflict multiplayer statistics, including server status, online players, leaderboards, and community events. The API is public, read-only, and requires no authentication.

**Base URL:** `https://www.wicgate.com/api`

## Quick Reference

| Endpoint | Purpose | Update Frequency |
|----------|---------|------------------|
| `GET /api/data` | Complete dataset (all data in one call) | 90s client-side polling |
| `GET /api/online` | Currently online servers and players | Real-time |
| `GET /api/leaderboard/all` | All 10 leaderboard variants | Real-time |
| `GET /api/leaderboard/ladder` | Player ladder rankings | Real-time |
| `GET /api/events` | Discord community events | Real-time |

## Configuration

### Environment Variables

Set the API base URL via environment variable:

```env
# .env or .env.local
VITE_API_BASE=https://www.wicgate.com/api
```

**Development:**
```env
VITE_API_BASE=http://localhost:3000/api
```

### TypeScript Definitions

All API types are defined in [src/api-types.ts](../src/api-types.ts).

```typescript
import type { DataResponse, OnlineProfile, LeaderboardEntry } from '@/api-types';
```

## Authentication

**None required.** The API is publicly accessible and read-only.

## Rate Limiting

**No enforced limits,** but clients should:
- Use reasonable polling intervals (recommended: 60-90 seconds)
- Implement exponential backoff on errors
- Respect the Page Visibility API (pause when tab hidden)

**Client Implementation:**
- Default polling: 90 seconds
- Automatic pause when browser tab is hidden
- 3-retry exponential backoff (1s, 2s, 4s delays)

## Endpoints

### GET /api/data

**Purpose:** Fetch complete dataset including servers, online players, ladder, and all 10 leaderboard variants in a single request.

**Response Type:** `DataResponse`

**Response Structure:**
```typescript
{
  servers: ServerEntry[];           // Active game servers
  profiles: OnlineProfile[];        // Currently online players
  ladder: LadderEntry[];            // Player ladder rankings

  // Total Score Leaderboards (10 variants)
  lb_total: LeaderboardEntry[];     // All roles combined
  lb_totinf: LeaderboardEntry[];    // Infantry only
  lb_totarm: LeaderboardEntry[];    // Armor only
  lb_totair: LeaderboardEntry[];    // Air only
  lb_totsup: LeaderboardEntry[];    // Support only

  // High Score Leaderboards (10 variants)
  lb_high: LeaderboardEntry[];      // All roles combined
  lb_highinf: LeaderboardEntry[];   // Infantry only
  lb_higharm: LeaderboardEntry[];   // Armor only
  lb_highair: LeaderboardEntry[];   // Air only
  lb_highsup: LeaderboardEntry[];   // Support only
}
```

**Example Response:**
```json
{
  "servers": [
    {
      "serverName": "EU WiCGATE Server #1",
      "serverId": 1
    },
    {
      "serverName": "US WiCGATE Server #1",
      "serverId": 2
    }
  ],
  "profiles": [
    {
      "profileId": 12345,
      "serverId": 1,
      "profileName": "[CLAN]PlayerName",
      "rank": 10,
      "shortName": "CLAN",
      "tagFormat": "ff6600"
    }
  ],
  "ladder": [
    {
      "profileId": 12345,
      "rank": 1,
      "profileName": "[CLAN]PlayerName",
      "high": 25000,
      "shortName": "CLAN",
      "tagFormat": "ff6600"
    }
  ],
  "lb_total": [
    {
      "rank": 1,
      "high": 1500000,
      "profileName": "[CLAN]PlayerName",
      "shortName": "CLAN",
      "tagFormat": "ff6600"
    }
  ]
}
```

**Usage:**
```typescript
import { useAppDataStore } from '@/stores/appDataStore';

const store = useAppDataStore();
await store.fetchData(); // Fetches /api/data with retry logic

// Access data
const servers = store.data.servers;
const onlinePlayers = store.data.profiles;
const leaderboard = store.data.lb_total;
```

---

### GET /api/online

**Purpose:** Fetch only currently online servers and players (subset of `/api/data`).

**Response Type:** `OnlineResponse`

**Response Structure:**
```typescript
{
  servers: ServerEntry[];     // Active game servers
  profiles: OnlineProfile[];  // Currently online players
}
```

**Example Response:**
```json
{
  "servers": [
    {"serverName": "EU WiCGATE Server #1", "serverId": 1}
  ],
  "profiles": [
    {
      "profileId": 12345,
      "serverId": 1,
      "profileName": "[CLAN]PlayerName",
      "rank": 10,
      "shortName": "CLAN",
      "tagFormat": "ff6600"
    }
  ]
}
```

**Use Case:** When you only need online player data without leaderboards (lighter payload).

---

### GET /api/leaderboard/all

**Purpose:** Fetch all 10 leaderboard variants (Total Score + High Score across 5 roles).

**Response Type:** `LeaderboardAllResponse`

**Response Structure:**
```typescript
{
  lb_total: LeaderboardEntry[];      // Total Score - All Roles
  lb_totinf: LeaderboardEntry[];     // Total Score - Infantry
  lb_totarm: LeaderboardEntry[];     // Total Score - Armor
  lb_totair: LeaderboardEntry[];     // Total Score - Air
  lb_totsup: LeaderboardEntry[];     // Total Score - Support
  lb_high: LeaderboardEntry[];       // High Score - All Roles
  lb_highinf: LeaderboardEntry[];    // High Score - Infantry
  lb_higharm: LeaderboardEntry[];    // High Score - Armor
  lb_highair: LeaderboardEntry[];    // High Score - Air
  lb_highsup: LeaderboardEntry[];    // High Score - Support
}
```

**Example Response:**
```json
{
  "lb_total": [
    {
      "rank": 1,
      "high": 1500000,
      "profileName": "[CLAN]PlayerName",
      "shortName": "CLAN",
      "tagFormat": "ff6600"
    }
  ],
  "lb_totinf": [...],
  "lb_totarm": [...],
  "lb_totair": [...],
  "lb_totsup": [...],
  "lb_high": [...],
  "lb_highinf": [...],
  "lb_higharm": [...],
  "lb_highair": [...],
  "lb_highsup": [...]
}
```

**Use Case:** When you only need leaderboard data without online players or servers.

---

### GET /api/leaderboard/ladder

**Purpose:** Fetch player ladder rankings.

**Response Type:** `LeaderboardLadderResponse`

**Response Structure:**
```typescript
{
  ladder: LadderEntry[];  // Player ladder rankings with scores
}
```

**Example Response:**
```json
{
  "ladder": [
    {
      "profileId": 12345,
      "rank": 1,
      "profileName": "[CLAN]PlayerName",
      "high": 25000,
      "shortName": "CLAN",
      "tagFormat": "ff6600"
    }
  ]
}
```

---

### GET /api/events

**Purpose:** Fetch Discord community events (upcoming and ongoing).

**Response Type:** `DiscordEvent[]`

**Response Structure:**
```typescript
[
  {
    id: string;              // Unique event identifier
    name: string;            // Event title
    description: string;     // Event details
    start: string;           // ISO 8601 timestamp or empty string
    coverUrl?: string;       // Event cover image URL (optional)
    status: 'ongoing' | 'upcoming';  // Event status
  }
]
```

**Example Response:**
```json
[
  {
    "id": "evt_abc123",
    "name": "Weekly Tournament",
    "description": "Join us for competitive 4v4 matches!",
    "start": "2025-10-05T18:00:00Z",
    "coverUrl": "https://cdn.discord.com/events/...",
    "status": "upcoming"
  },
  {
    "id": "evt_def456",
    "name": "Community Game Night",
    "description": "Casual games and fun!",
    "start": "2025-10-02T20:00:00Z",
    "status": "ongoing"
  }
]
```

**Usage:**
```typescript
import { useEvents } from '@/composables/useEvents';

const { events, loading, error } = useEvents();
// events.value will contain DiscordEvent[]
```

---

## Data Structures

### ServerEntry

Active game server information.

```typescript
interface ServerEntry {
  serverName: string;  // Display name (e.g., "EU WiCGATE Server #1")
  serverId: number;    // Unique server identifier
}
```

---

### OnlineProfile

Currently online player with server information.

```typescript
interface OnlineProfile {
  profileId: number | string;  // Unique player identifier
  serverId: number | string;   // Server player is currently on
  profileName: string;         // Full player name with clan tags
  rank?: number;               // Player rank (optional)
  shortName?: string | null;   // Clan tag abbreviation (e.g., "CLAN")
  tagFormat?: string | null;   // Clan tag color in hex (e.g., "ff6600")
}
```

**Clan Tag Formatting:**
- `profileName`: Full name with clan tag `[CLAN]PlayerName`
- `shortName`: Extracted clan tag `CLAN`
- `tagFormat`: Hex color for rendering clan tag (without #)

---

### LeaderboardEntry

Player entry in leaderboard tables.

```typescript
interface LeaderboardEntry {
  rank: number;                // Leaderboard position (1, 2, 3, ...)
  high: number;                // Player's score
  profileName: string;         // Full player name with clan tags
  shortName?: string | null;   // Clan tag abbreviation
  tagFormat?: string | null;   // Clan tag color in hex
}
```

**Top 3 Styling:**
- Rank 1: Gold highlighting (`--gold` color token)
- Rank 2: Silver highlighting (`--silver` color token)
- Rank 3: Bronze highlighting (`--bronze` color token)

---

### LadderEntry

Player entry in ladder rankings.

```typescript
interface LadderEntry {
  profileId: number | string;  // Unique player identifier
  rank?: number;               // Ladder rank (optional)
  profileName: string;         // Full player name with clan tags
  high: number;                // Player's ladder score
  shortName?: string | null;   // Clan tag abbreviation
  tagFormat?: string | null;   // Clan tag color in hex
}
```

---

### DiscordEvent

Community event from Discord.

```typescript
interface DiscordEvent {
  id: string;              // Unique event identifier
  name: string;            // Event title
  description: string;     // Event details/description
  start: string;           // ISO 8601 timestamp or empty string
  coverUrl?: string;       // Event cover image URL (optional)
  status: 'ongoing' | 'upcoming';  // Current event status
}
```

**Start Time Handling:**
- Valid timestamp: Parse as ISO 8601 date
- Empty string: Event time not set

---

## Client Integration

### Primary Data Fetching (appDataStore)

**File:** [src/stores/appDataStore.ts](../src/stores/appDataStore.ts)

The main data store handles `/api/data` endpoint with robust error handling:

```typescript
import { useAppDataStore } from '@/stores/appDataStore';

const store = useAppDataStore();

// Initialize (starts 90s polling)
store.init();

// Manual fetch
await store.fetchData();

// Access data
const servers = store.data.servers;
const onlinePlayers = store.data.profiles;
const totalLeaderboard = store.data.lb_total;
const playerCount = store.playerCount; // Computed property

// Stop polling (cleanup)
store.stop();
```

**Features:**
- 3-retry exponential backoff (1s, 2s, 4s)
- 90s automatic polling
- Page Visibility API integration (pauses when tab hidden)
- SSR-safe (no calls during build)
- Reactive state with Vue 3 refs/computed

---

### Events Integration (useEvents)

**File:** [src/composables/useEvents.ts](../src/composables/useEvents.ts)

Handles `/api/events` endpoint with countdown timers:

```typescript
import { useEvents } from '@/composables/useEvents';

const { events, loading, error, upcomingEvents, ongoingEvents } = useEvents();

// events.value contains all DiscordEvent[]
// upcomingEvents.value filtered to status: 'upcoming'
// ongoingEvents.value filtered to status: 'ongoing'
```

**Features:**
- Automatic event status detection
- Real-time countdown timers
- SSR-safe execution
- Test events in DEV mode only

---

### YouTube Integration (useYoutube)

**File:** [src/composables/useYoutube.ts](../src/composables/useYoutube.ts)

Note: Does NOT use WiCGATE API - fetches from YouTube Atom feeds directly.

---

## Error Handling

### Retry Logic

All API calls implement exponential backoff:

```typescript
async function fetchDataWithRetry(retryCount = 0): Promise<void> {
  try {
    const r = await fetch(`${API}/data`, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.statusText);
    const json: DataResponse = await r.json();
    data.value = json;
  } catch (e: any) {
    if (retryCount < MAX_RETRIES) { // MAX_RETRIES = 3
      const delay = RETRY_DELAYS[retryCount]; // [1000, 2000, 4000]
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchDataWithRetry(retryCount + 1);
    }
    // All retries exhausted - set error state
    error.value = e?.message || 'Failed to load';
    AnalyticsEvents.apiError('/api/data');
  }
}
```

**Retry Schedule:**
1. **Attempt 1:** Immediate
2. **Retry 1:** Wait 1 second
3. **Retry 2:** Wait 2 seconds
4. **Retry 3:** Wait 4 seconds
5. **Failure:** Set error state, log analytics event

### Error States

When API calls fail after all retries:
- `error.value` contains error message
- `isOnline.value` set to `false`
- Analytics event logged (`AnalyticsEvents.apiError()`)
- ErrorBoundary component shows user-friendly fallback

---

## Caching Strategy

### Client-Side Caching

**Polling Interval:** 90 seconds
```typescript
// Automatic refresh every 90 seconds
intervalId = window.setInterval(fetchData, 90000);
```

**Page Visibility Integration:**
```typescript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(intervalId); // Pause polling when tab hidden
  } else {
    fetchData(); // Fetch immediately when tab becomes visible
    intervalId = setInterval(fetchData, 90000); // Resume polling
  }
});
```

### PWA Service Worker Cache

**Strategy:** NetworkFirst with 5-minute cache fallback

```typescript
// From vite.config.ts PWA configuration
{
  urlPattern: /^https:\/\/www\.wicgate\.com\/api\/.*/i,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'api-cache',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 5, // 5 minutes
    },
    networkTimeoutSeconds: 10,
  }
}
```

**Behavior:**
1. Try network first (10s timeout)
2. If network fails, serve from cache (if available, max 5 minutes old)
3. Cache successful responses for offline fallback

---

## Best Practices

### 1. Use the Composable Pattern

✅ **Recommended:**
```typescript
import { useAppDataStore } from '@/stores/appDataStore';
const store = useAppDataStore();
```

❌ **Avoid:** Direct fetch calls without retry logic
```typescript
// Don't do this - no error handling, no retries
const response = await fetch('https://www.wicgate.com/api/data');
```

### 2. Respect Page Visibility

The store automatically pauses when tab is hidden. Don't override this behavior.

### 3. Handle Loading States

```typescript
const store = useAppDataStore();

if (store.loading) {
  // Show skeleton loader
}

if (store.error) {
  // Show error message with retry button
}

if (store.data.profiles) {
  // Render data
}
```

### 4. TypeScript Type Safety

Always use the provided types:

```typescript
import type { LeaderboardEntry, OnlineProfile } from '@/api-types';

const leaderboard: LeaderboardEntry[] = store.data.lb_total || [];
const players: OnlineProfile[] = store.data.profiles || [];
```

---

## Testing

### Mock Data

Test setup provides mock API responses:

```typescript
// tests/setup.ts
vi.stubEnv('VITE_API_BASE', 'https://test.wicgate.com/api');
```

### Example Test

```typescript
import { useAppDataStore } from '@/stores/appDataStore';

it('should fetch and parse API data', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      servers: [{ serverName: 'Test Server', serverId: 1 }],
      profiles: [],
      // ... other fields
    })
  });

  const store = useAppDataStore();
  await store.fetchData();

  expect(store.data.servers).toHaveLength(1);
  expect(store.data.servers[0].serverName).toBe('Test Server');
});
```

See [src/stores/appDataStore.test.ts](../src/stores/appDataStore.test.ts) for complete test suite.

---

## Related Documentation

- **[Architecture](architecture.md)** - State management and data layer architecture
- **[Testing](testing.md)** - API testing strategies and mocks
- **[Type Definitions](../src/api-types.ts)** - Complete TypeScript interfaces

---

*Last Updated: October 2, 2025*
