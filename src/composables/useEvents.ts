import axios from 'axios';
import lodash from 'lodash';
import { ref, onMounted, onUnmounted } from 'vue';

const { orderBy } = lodash;

export interface Event {
  id: number | string;
  name: string;
  start: string;
  description: string;
  link?: string;
  coverUrl?: string;
}

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

export function useEvents() {
  const events = ref<Event[]>([]);
  const now = ref(new Date());
  const isLoading = ref(true);
  let timer: number;

  onMounted(async () => {
    // Skip data fetching during SSG build
    if (import.meta.env.SSR) {
      isLoading.value = false;
      return;
    }

    try {
      const url = import.meta.env.DEV ? API + '/events-test' : API + '/events';
      const response = await axios.get<Event[]>(url);
      events.value = orderBy(response.data, ['date'], ['asc']);

      isLoading.value = false;
      if (import.meta.env.DEV) console.log(`Fetched ${events.value.length} events from ${url}`);
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Failed to fetch events:', err.message, err);
      isLoading.value = false;
    }

    // Only set timer in browser context
    if (typeof window !== 'undefined') {
      timer = window.setInterval(() => {
        now.value = new Date();
      }, 1000);
    }
  });

  onUnmounted(() => {
    clearInterval(timer);
  });

  function formatDate(raw: string): string {
    return new Date(raw).toLocaleString();
  }

  function getCountdown(raw: string): string {
    const target = new Date(raw).getTime();
    const diff = target - now.value.getTime();
    if (diff <= 0) {
      return 'Event ongoing';
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const parts: string[] = [];
    if (days) {
      parts.push(`${days}d`);
    }
    parts.push(`${String(hours).padStart(2, '0')}h`);
    parts.push(`${String(minutes).padStart(2, '0')}m`);
    parts.push(`${String(seconds).padStart(2, '0')}s`);
    return parts.join(' ');
  }

  return {
    events,
    formatDate,
    getCountdown,
    isLoading,
  };
}
