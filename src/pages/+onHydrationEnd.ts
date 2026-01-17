import type { PageContextClient } from 'vike/types';

async function onHydrationEnd(_pageContext: PageContextClient): Promise<void> {
  // Only appDataStore needs explicit init (has isInitialized guard)
  // Calendar and YouTube stores auto-fetch on first access via useStore()
  const { useAppDataStore } = await import('../stores/appDataStore');
  const appDataStore = useAppDataStore();
  appDataStore.init();
}

export { onHydrationEnd };
