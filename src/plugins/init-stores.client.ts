import { useAppDataStore } from '~/stores/appDataStore';
import { useAuthStore } from '~/stores/auth';

// Client-side plugin for initializing stores
// This runs only on the client after hydration

export default defineNuxtPlugin(() => {
  // Initialize app data store (API polling)
  const appDataStore = useAppDataStore();
  appDataStore.init();

  // Check auth status in background
  const authStore = useAuthStore();
  authStore.checkAuth();
});
