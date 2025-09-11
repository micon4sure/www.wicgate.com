import { onMounted } from 'vue';
import type {
  OnlineProfile as ApiOnlineProfile,
  LeaderboardEntry as ApiLeaderboardEntry,
} from '../api-types';
import { useAppDataStore } from '../stores/appDataStore';

// Re-export the shared API types under the existing names used by components
export type PlayerProfile = ApiOnlineProfile;
export type LeaderboardEntry = ApiLeaderboardEntry;

export function useAppData() {
  const store = useAppDataStore();
  onMounted(() => {
    store.init();
  });
  return store;
}
