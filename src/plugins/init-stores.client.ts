import { useAppDataStore } from '~/stores/appDataStore';
import { useAuthStore } from '~/stores/auth';

// Client-side plugin for initializing stores
// This runs only on the client after hydration
//
// Note: calendarStore and youtubeStore are now hydrated from server-side
// composables in page components, not auto-fetched here.

export default defineNuxtPlugin(() => {
  // Initialize app data store for real-time online player polling
  // (leaderboards/stats are now server-side via useStatisticsData)
  const appDataStore = useAppDataStore();
  appDataStore.init();

  // Check auth status in background
  const authStore = useAuthStore();
  authStore.checkAuth();
});
