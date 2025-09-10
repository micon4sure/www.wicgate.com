import { ref, onMounted } from 'vue';

export interface PlayerProfile { profileName?: string; serverId?: string|number }
export interface LeaderboardEntry { rank?: number; profileName?: string; shortName?: string; tagFormat?: string; high?: number }
interface ApiData {
  profiles?: PlayerProfile[];
  lb_high?: LeaderboardEntry[];
  lb_highinf?: LeaderboardEntry[];
  lb_higharm?: LeaderboardEntry[];
  lb_highair?: LeaderboardEntry[];
  lb_highsup?: LeaderboardEntry[];
  lb_total?: LeaderboardEntry[];
  ladder?: LeaderboardEntry[];
  [k: string]: any;
}

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

export function useAppData() {
  const data = ref<ApiData>({});
  const loading = ref(false);
  const error = ref<string | null>(null);
  const playerCount = ref(0);

  async function fetchData() {
    loading.value = true; error.value = null;
    try {
      const r = await fetch(`${API}/data`, { cache: 'no-store' });
      if (!r.ok) throw new Error(r.statusText);
      const json: ApiData = await r.json();
      data.value = json;
      playerCount.value = json.profiles?.length || 0;
      if (playerCount.value > 0) document.body.classList.add('players-online'); else document.body.classList.remove('players-online');
    } catch (e: any) {
      error.value = e.message || 'Failed to load';
    } finally { loading.value = false; }
  }

  onMounted(() => {
    fetchData();
    const int = setInterval(fetchData, 60000);
    // @ts-ignore stored for dev tools
    (window as any).__wicgateInterval = int;
  });

  return { data, loading, error, playerCount, fetchData };
}
