import { computed } from 'vue';
import { useAsyncData, useRuntimeConfig } from '#imports';
import type {
  LeaderboardAllResponse,
  LeaderboardLadderResponse,
  ClanLeaderboardResponse,
  LeaderboardEntry,
  LadderEntry,
  ClanEntry,
} from '../api-types';

export interface StatisticsData {
  ladder: LadderEntry[];
  lb_total: LeaderboardEntry[];
  lb_totinf: LeaderboardEntry[];
  lb_totarm: LeaderboardEntry[];
  lb_totair: LeaderboardEntry[];
  lb_totsup: LeaderboardEntry[];
  lb_high: LeaderboardEntry[];
  lb_highinf: LeaderboardEntry[];
  lb_higharm: LeaderboardEntry[];
  lb_highair: LeaderboardEntry[];
  lb_highsup: LeaderboardEntry[];
}

interface StatisticsApiResponse {
  leaderboard: LeaderboardAllResponse;
  ladder: LeaderboardLadderResponse;
  clans: ClanLeaderboardResponse;
}

/**
 * Server-side data fetching composable for statistics/leaderboard data.
 * Uses Nuxt's useAsyncData with $fetch for parallel API calls.
 *
 * IMPORTANT: This is NOT an async function - it returns useAsyncData directly
 * to preserve Nuxt's composable context. The calling page should NOT await this.
 */
export function useStatisticsData() {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  // Use useAsyncData with Promise.all for parallel fetching
  // This preserves Nuxt context unlike multiple sequential await useFetch() calls
  const { data, pending, error } = useAsyncData<StatisticsApiResponse>(
    'statistics-data',
    async () => {
      const [leaderboard, ladder, clans] = await Promise.all([
        $fetch<LeaderboardAllResponse>('/leaderboard/all', { baseURL: apiBase }),
        $fetch<LeaderboardLadderResponse>('/leaderboard/ladder', { baseURL: apiBase }),
        $fetch<ClanLeaderboardResponse>('/leaderboard/clans', { baseURL: apiBase }),
      ]);
      return { leaderboard, ladder, clans };
    },
    {
      // Use cached data if available (prevents duplicate fetches after hydration)
      // Note: Use optional chaining as nuxtApp.static may be undefined
      getCachedData: (key, nuxtApp) => nuxtApp.payload?.data?.[key] || nuxtApp.static?.data?.[key],
    }
  );

  // Transform into unified statistics data structure
  const statisticsData = computed<Partial<StatisticsData>>(() => {
    const lb = data.value?.leaderboard;
    const ld = data.value?.ladder;

    return {
      ladder: ld?.ladder ?? [],
      lb_total: lb?.lb_total ?? [],
      lb_totinf: lb?.lb_totinf ?? [],
      lb_totarm: lb?.lb_totarm ?? [],
      lb_totair: lb?.lb_totair ?? [],
      lb_totsup: lb?.lb_totsup ?? [],
      lb_high: lb?.lb_high ?? [],
      lb_highinf: lb?.lb_highinf ?? [],
      lb_higharm: lb?.lb_higharm ?? [],
      lb_highair: lb?.lb_highair ?? [],
      lb_highsup: lb?.lb_highsup ?? [],
    };
  });

  // Clans data
  const clansData = computed<ClanEntry[]>(() => data.value?.clans?.clans ?? []);

  return {
    statisticsData,
    clansData,
    loading: pending,
    error,
  };
}
