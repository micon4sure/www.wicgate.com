<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import type { LeaderboardEntry, LadderEntry } from '../api-types';
import RankInsignia from './RankInsignia.vue';
import { AnalyticsEvents } from '../utils/analytics';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE, MOBILE_BREAKPOINT, TABLET_BREAKPOINT } from '../constants';

type LeaderboardRow = LeaderboardEntry | LadderEntry;

interface Props {
  title: string;
  subtitle?: string;
  categories?: string[]; // Tab categories; if 0 or 1, tabs hidden
  keys?: Record<string, string>; // Map category -> dataset key in data
  data: Record<string, LeaderboardRow[] | undefined>;
  thirdLabel?: string; // Column header for value
  maxRows?: number; // Rows cap (default 10)
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  categories: () => [],
  keys: () => ({}),
  thirdLabel: 'Score',
  maxRows: 10,
});

// Active tab (first category or fallback 'default')
const active = ref(props.categories[0] || 'default');
watch(
  () => props.categories,
  (cats) => {
    if (cats.length > 0 && !cats.includes(active.value)) {
      active.value = cats[0] ?? 'default';
    }
  }
);

function rows(list?: LeaderboardRow[]) {
  return (list || []).slice(0, props.maxRows);
}
function entriesFor(cat: string) {
  const key: string = props.keys?.[cat] ?? cat; // fallback: direct key
  return rows(props.data[key]);
}
function formatClanTag(entry: LeaderboardRow): string {
  if (entry.tagFormat && entry.shortName) {
    return entry.tagFormat.replace('C', entry.shortName).replace('P', '');
  }
  return '';
}

const formatCategoryLabel = (category: string): string => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Responsive RankInsignia sizing
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : TABLET_BREAKPOINT);

const rankInsigniaSize = computed(() => {
  if (windowWidth.value <= 360) return 16;
  if (windowWidth.value <= 480) return 18;
  if (windowWidth.value <= MOBILE_BREAKPOINT) return 20;
  if (windowWidth.value <= TABLET_BREAKPOINT) return 22;
  return 24;
});

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

// Debounce resize handler to improve performance
const debouncedResize = debounce(updateWindowWidth, DEBOUNCE_RESIZE);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', debouncedResize);
    updateWindowWidth();
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', debouncedResize);
  }
});
</script>
<template>
  <div
    class="bg-gradient-to-b from-[rgba(15,18,21,0.96)] to-[rgba(8,9,11,0.98)] border border-[var(--divider-strong)] rounded-none overflow-hidden relative shadow-[0_12px_30px_rgba(4,9,14,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] mb-6 transition-[var(--tr)]"
  >
    <div
      class="p-[15px_20px] bg-gradient-to-b from-massgate-red to-massgate-red-dark border-[3px] border-massgate-red-dark relative max-[768px]:p-[12px_15px] max-[480px]:p-[10px_12px] max-[360px]:p-[0.625rem_0.75rem]"
    >
      <h3
        class="font-[Oswald,sans-serif] text-[1.25rem] font-bold text-white uppercase tracking-[1px] m-0 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] max-[768px]:text-[1.1rem]"
      >
        {{ title }}
      </h3>
      <p
        v-if="subtitle"
        class="font-[Rajdhani,sans-serif] font-medium m-[5px_0_0_0] text-white/90 uppercase tracking-[0.5px] text-[0.85rem] [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
      >
        {{ subtitle }}
      </p>
    </div>

    <div
      v-if="categories.length > 1"
      class="flex bg-gradient-to-b from-[rgba(15,18,21,0.95)] to-[rgba(8,9,11,0.95)] relative"
    >
      <button
        v-for="c in categories"
        :key="c"
        class="flex-1 p-[12px_16px] border border-[rgba(var(--graphite-dark-rgb),0.6)] border-b-0 text-[var(--t2)] cursor-pointer font-[Oswald,sans-serif] font-medium text-[0.875rem] uppercase tracking-[1px] transition-[var(--tr)] relative mr-px max-[768px]:p-[10px_12px] max-[768px]:text-[0.8rem] max-[480px]:p-[8px_10px] max-[480px]:text-[0.75rem] max-[360px]:p-[0.5rem_0.625rem] max-[360px]:text-[0.7rem]"
        :class="{
          'bg-gradient-to-b from-massgate-orange-light to-massgate-orange !text-[var(--ink)] font-semibold border-[rgba(var(--massgate-orange-rgb),0.85)] z-10 shadow-[0_0_18px_rgba(var(--massgate-orange-rgb),0.45)]':
            active === c,
          'bg-gradient-to-b from-[rgba(var(--graphite-rgb),0.9)] to-[rgba(var(--graphite-dark-rgb),0.92)] hover:!bg-gradient-to-b hover:!from-massgate-orange-light hover:!to-massgate-orange hover:!text-[var(--ink)] hover:border-[rgba(var(--massgate-orange-rgb),0.65)] hover:shadow-[0_0_16px_rgba(var(--massgate-orange-rgb),0.4)] hover:-translate-y-px':
            active !== c,
        }"
        @click="
          () => {
            active = c;
            AnalyticsEvents.leaderboardTabSwitch(c);
          }
        "
      >
        {{ formatCategoryLabel(c) }}
      </button>
    </div>

    <!-- If categories provided, render tab containers; else single table -->
    <template v-if="categories.length > 0">
      <div v-for="c in categories" :key="c" :class="{ hidden: active !== c, block: active === c }">
        <table
          class="w-full [border-collapse:separate] border-spacing-0 font-[Rajdhani,sans-serif]"
        >
          <colgroup>
            <col
              class="w-[72px] min-w-[72px] max-[1024px]:w-16 max-[1024px]:min-w-16 max-[768px]:w-[3.75rem] max-[768px]:min-w-[3.75rem] max-[480px]:w-[3.375rem] max-[480px]:min-w-[3.375rem] max-[360px]:w-12 max-[360px]:min-w-12"
            />
            <col class="w-auto" />
            <col
              class="w-[140px] min-w-[140px] max-[1024px]:w-36 max-[1024px]:min-w-36 max-[768px]:w-[7.5rem] max-[768px]:min-w-[7.5rem] max-[480px]:w-[6.25rem] max-[480px]:min-w-[6.25rem] max-[360px]:w-[5.5rem] max-[360px]:min-w-[5.5rem]"
            />
          </colgroup>
          <thead>
            <tr>
              <th
                class="bg-gradient-to-b from-[rgba(var(--mg-rgb),0.92)] to-[rgba(var(--mg-dark-rgb),0.95)] text-[var(--t)] p-3 text-left font-[Oswald,sans-serif] font-semibold text-[0.875rem] uppercase tracking-[1px] border border-[rgba(var(--graphite-dark-rgb),0.6)] align-baseline leading-[1.4] first:border-l-[var(--divider-soft)] last:border-r-[var(--divider-soft)] max-[768px]:text-[0.8rem]"
              >
                Rank
              </th>
              <th
                class="bg-gradient-to-b from-[rgba(var(--mg-rgb),0.92)] to-[rgba(var(--mg-dark-rgb),0.95)] text-[var(--t)] p-3 text-left font-[Oswald,sans-serif] font-semibold text-[0.875rem] uppercase tracking-[1px] border border-[rgba(var(--graphite-dark-rgb),0.6)] align-baseline leading-[1.4] first:border-l-[var(--divider-soft)] last:border-r-[var(--divider-soft)] max-[768px]:text-[0.8rem]"
              >
                Player
              </th>
              <th
                class="bg-gradient-to-b from-[rgba(var(--mg-rgb),0.92)] to-[rgba(var(--mg-dark-rgb),0.95)] text-[var(--t)] p-3 text-left font-[Oswald,sans-serif] font-semibold text-[0.875rem] uppercase tracking-[1px] border border-[rgba(var(--graphite-dark-rgb),0.6)] align-baseline leading-[1.4] first:border-l-[var(--divider-soft)] last:border-r-[var(--divider-soft)] max-[768px]:text-[0.8rem]"
              >
                {{ thirdLabel }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="entriesFor(c).length === 0">
              <td
                colspan="3"
                class="text-center italic text-t-tertiary font-[Rajdhani,sans-serif] p-[30px]"
              >
                No data
              </td>
            </tr>
            <tr
              v-for="(e, index) in entriesFor(c)"
              :key="e.rank + (e.profileName || '')"
              class="min-h-14 h-14 hover:[&>td]:bg-gradient-to-r hover:[&>td]:from-[rgba(var(--massgate-orange-rgb),0.22)] hover:[&>td]:to-[rgba(var(--massgate-orange-rgb),0.15)] hover:[&>td]:!border-[rgba(var(--massgate-orange-rgb),0.4)] max-[1024px]:min-h-[3.25rem] max-[1024px]:h-[3.25rem] max-[768px]:min-h-12 max-[768px]:h-12 max-[480px]:min-h-[2.75rem] max-[480px]:h-[2.75rem] max-[360px]:min-h-10 max-[360px]:h-10"
            >
              <td
                class="p-3 text-[var(--t)] border-b border-b-[rgba(var(--mg-rgb),0.25)] border-l border-l-[rgba(var(--mg-rgb),0.12)] font-medium bg-gradient-to-r from-panel/75 to-panel-dark/85 align-middle leading-[1.2] min-h-14 h-14 first:border-l-[rgba(var(--mg-rgb),0.12)] last:border-r last:border-r-[rgba(var(--mg-rgb),0.12)] last:font-[Oswald,sans-serif] last:font-semibold last:text-right last:text-[1.15rem] last:tracking-[0.5px] last:whitespace-nowrap [tr:nth-child(even)>&]:bg-gradient-to-r [tr:nth-child(even)>&]:from-panel-striped/78 [tr:nth-child(even)>&]:to-panel-striped-dark/88 transition-all duration-200 font-[Oswald,sans-serif] font-bold text-[1.2rem] text-center w-16 max-[1024px]:p-[0.675rem] max-[1024px]:min-h-[3.25rem] max-[1024px]:h-[3.25rem] max-[1024px]:w-[3.75rem] max-[1024px]:last:text-[1.1rem] max-[768px]:p-[0.625rem] max-[768px]:min-h-12 max-[768px]:h-12 max-[768px]:w-[3.5rem] max-[768px]:text-[1.1rem] max-[768px]:last:text-[1rem] max-[480px]:p-2 max-[480px]:min-h-[2.75rem] max-[480px]:h-[2.75rem] max-[480px]:w-[3.125rem] max-[480px]:text-[1rem] max-[480px]:last:text-[0.95rem] max-[360px]:p-1.5 max-[360px]:min-h-10 max-[360px]:h-10 max-[360px]:w-[2.75rem] max-[360px]:text-[0.9rem] max-[360px]:last:text-[0.85rem]"
                :class="{
                  'text-[var(--medal-gold)] [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] max-[480px]:text-[1.1rem] max-[360px]:text-[1rem]':
                    index === 0,
                  'text-[var(--medal-silver)] [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] max-[480px]:text-[1.05rem] max-[360px]:text-[0.95rem]':
                    index === 1,
                  'text-[var(--medal-bronze)] [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] max-[480px]:text-[1rem] max-[360px]:text-[0.9rem]':
                    index === 2,
                }"
              >
                {{ index + 1 }}
              </td>
              <td
                class="p-3 text-[var(--t)] border-b border-b-[rgba(var(--mg-rgb),0.25)] border-l border-l-[rgba(var(--mg-rgb),0.12)] font-medium bg-gradient-to-r from-panel/75 to-panel-dark/85 align-middle leading-[1.2] min-h-14 h-14 first:border-l-[rgba(var(--mg-rgb),0.12)] last:border-r last:border-r-[rgba(var(--mg-rgb),0.12)] last:font-[Oswald,sans-serif] last:font-semibold last:text-right last:text-[1.15rem] last:tracking-[0.5px] last:whitespace-nowrap [tr:nth-child(even)>&]:bg-gradient-to-r [tr:nth-child(even)>&]:from-panel-striped/78 [tr:nth-child(even)>&]:to-panel-striped-dark/88 transition-all duration-200 relative max-[1024px]:p-[0.675rem] max-[1024px]:min-h-[3.25rem] max-[1024px]:h-[3.25rem] max-[1024px]:last:text-[1.1rem] max-[768px]:p-[0.625rem] max-[768px]:min-h-12 max-[768px]:h-12 max-[768px]:last:text-[1rem] max-[480px]:p-2 max-[480px]:min-h-[2.75rem] max-[480px]:h-[2.75rem] max-[480px]:last:text-[0.95rem] max-[360px]:p-1.5 max-[360px]:min-h-10 max-[360px]:h-10 max-[360px]:last:text-[0.85rem]"
              >
                <div class="flex items-center leading-none">
                  <RankInsignia
                    :rank="e.rank ?? null"
                    :size="rankInsigniaSize"
                    class="inline-block !align-middle flex-shrink-0 m-0 leading-none"
                  />
                  <span
                    v-if="formatClanTag(e)"
                    class="font-[Courier_New,monospace] text-massgate-orange font-semibold text-[0.8rem] inline align-middle leading-[1.2] m-0 p-0 max-[768px]:text-[0.7rem] max-[360px]:text-[0.65rem]"
                    >{{ formatClanTag(e) }}</span
                  >
                  <span
                    class="font-[Rajdhani,sans-serif] text-[var(--t)] font-semibold text-[1.1rem] tracking-[0.3px] inline align-middle leading-[1.2] m-0 max-[1024px]:text-[1.05rem] max-[768px]:text-[1rem] max-[480px]:text-[0.95rem] max-[360px]:text-[0.9rem]"
                    >{{ e.profileName || 'Unknown' }}</span
                  >
                </div>
              </td>
              <td
                class="p-3 text-[var(--t)] border-b border-b-[rgba(var(--mg-rgb),0.25)] border-l border-l-[rgba(var(--mg-rgb),0.12)] font-medium bg-gradient-to-r from-panel/75 to-panel-dark/85 align-middle leading-[1.2] min-h-14 h-14 first:border-l-[rgba(var(--mg-rgb),0.12)] last:border-r last:border-r-[rgba(var(--mg-rgb),0.12)] last:font-[Oswald,sans-serif] last:font-semibold last:text-right last:text-[1.15rem] last:tracking-[0.5px] last:whitespace-nowrap [tr:nth-child(even)>&]:bg-gradient-to-r [tr:nth-child(even)>&]:from-panel-striped/78 [tr:nth-child(even)>&]:to-panel-striped-dark/88 transition-all duration-200 max-[1024px]:p-[0.675rem] max-[1024px]:min-h-[3.25rem] max-[1024px]:h-[3.25rem] max-[1024px]:last:text-[1.1rem] max-[768px]:p-[0.625rem] max-[768px]:min-h-12 max-[768px]:h-12 max-[768px]:last:text-[1rem] max-[480px]:p-2 max-[480px]:min-h-[2.75rem] max-[480px]:h-[2.75rem] max-[480px]:last:text-[0.95rem] max-[360px]:p-1.5 max-[360px]:min-h-10 max-[360px]:h-10 max-[360px]:last:text-[0.85rem]"
                :class="{
                  'text-[var(--medal-gold)]': index === 0,
                  'text-[var(--medal-silver)]': index === 1,
                  'text-[var(--medal-bronze)]': index === 2,
                }"
              >
                {{ e.high.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <table class="w-full [border-collapse:separate] border-spacing-0 font-[Rajdhani,sans-serif]">
        <colgroup>
          <col
            class="w-[72px] min-w-[72px] max-[1024px]:w-16 max-[1024px]:min-w-16 max-[768px]:w-[3.75rem] max-[768px]:min-w-[3.75rem] max-[480px]:w-[3.375rem] max-[480px]:min-w-[3.375rem] max-[360px]:w-12 max-[360px]:min-w-12"
          />
          <col class="w-auto" />
          <col
            class="w-[140px] min-w-[140px] max-[1024px]:w-36 max-[1024px]:min-w-36 max-[768px]:w-[7.5rem] max-[768px]:min-w-[7.5rem] max-[480px]:w-[6.25rem] max-[480px]:min-w-[6.25rem] max-[360px]:w-[5.5rem] max-[360px]:min-w-[5.5rem]"
          />
        </colgroup>
        <thead>
          <tr>
            <th
              class="bg-gradient-to-b from-[rgba(var(--mg-rgb),0.92)] to-[rgba(var(--mg-dark-rgb),0.95)] text-[var(--t)] p-3 text-left font-[Oswald,sans-serif] font-semibold text-[0.875rem] uppercase tracking-[1px] border border-[rgba(var(--graphite-dark-rgb),0.6)] align-baseline leading-[1.4] first:border-l-[var(--divider-soft)] last:border-r-[var(--divider-soft)] max-[768px]:text-[0.8rem]"
            >
              Rank
            </th>
            <th
              class="bg-gradient-to-b from-[rgba(var(--mg-rgb),0.92)] to-[rgba(var(--mg-dark-rgb),0.95)] text-[var(--t)] p-3 text-left font-[Oswald,sans-serif] font-semibold text-[0.875rem] uppercase tracking-[1px] border border-[rgba(var(--graphite-dark-rgb),0.6)] align-baseline leading-[1.4] first:border-l-[var(--divider-soft)] last:border-r-[var(--divider-soft)] max-[768px]:text-[0.8rem]"
            >
              Player
            </th>
            <th
              class="bg-gradient-to-b from-[rgba(var(--mg-rgb),0.92)] to-[rgba(var(--mg-dark-rgb),0.95)] text-[var(--t)] p-3 text-left font-[Oswald,sans-serif] font-semibold text-[0.875rem] uppercase tracking-[1px] border border-[rgba(var(--graphite-dark-rgb),0.6)] align-baseline leading-[1.4] first:border-l-[var(--divider-soft)] last:border-r-[var(--divider-soft)] max-[768px]:text-[0.8rem]"
            >
              {{ thirdLabel }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="entriesFor(active).length === 0">
            <td
              colspan="3"
              class="text-center italic text-t-tertiary font-[Rajdhani,sans-serif] p-[30px]"
            >
              No data
            </td>
          </tr>
          <tr
            v-for="(e, index) in entriesFor(active)"
            :key="e.rank + (e.profileName || '')"
            class="min-h-14 h-14 hover:[&>td]:bg-gradient-to-r hover:[&>td]:from-[rgba(var(--massgate-orange-rgb),0.22)] hover:[&>td]:to-[rgba(var(--massgate-orange-rgb),0.15)] hover:[&>td]:!border-[rgba(var(--massgate-orange-rgb),0.4)] max-[1024px]:min-h-[3.25rem] max-[1024px]:h-[3.25rem] max-[768px]:min-h-12 max-[768px]:h-12 max-[480px]:min-h-[2.75rem] max-[480px]:h-[2.75rem] max-[360px]:min-h-10 max-[360px]:h-10"
          >
            <td
              class="p-3 text-[var(--t)] border-b border-b-[rgba(var(--mg-rgb),0.25)] border-l border-l-[rgba(var(--mg-rgb),0.12)] font-medium bg-gradient-to-r from-panel/75 to-panel-dark/85 align-middle leading-[1.2] min-h-14 h-14 first:border-l-[rgba(var(--mg-rgb),0.12)] last:border-r last:border-r-[rgba(var(--mg-rgb),0.12)] last:font-[Oswald,sans-serif] last:font-semibold last:text-right last:text-[1.15rem] last:tracking-[0.5px] last:whitespace-nowrap [tr:nth-child(even)>&]:bg-gradient-to-r [tr:nth-child(even)>&]:from-panel-striped/78 [tr:nth-child(even)>&]:to-panel-striped-dark/88 transition-all duration-200 font-[Oswald,sans-serif] font-bold text-[1.2rem] text-center w-16 max-[1024px]:p-[0.675rem] max-[1024px]:min-h-[3.25rem] max-[1024px]:h-[3.25rem] max-[1024px]:w-[3.75rem] max-[1024px]:last:text-[1.1rem] max-[768px]:p-[0.625rem] max-[768px]:min-h-12 max-[768px]:h-12 max-[768px]:w-[3.5rem] max-[768px]:text-[1.1rem] max-[768px]:last:text-[1rem] max-[480px]:p-2 max-[480px]:min-h-[2.75rem] max-[480px]:h-[2.75rem] max-[480px]:w-[3.125rem] max-[480px]:text-[1rem] max-[480px]:last:text-[0.95rem] max-[360px]:p-1.5 max-[360px]:min-h-10 max-[360px]:h-10 max-[360px]:w-[2.75rem] max-[360px]:text-[0.9rem] max-[360px]:last:text-[0.85rem]"
              :class="{
                'text-[var(--medal-gold)] [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] max-[480px]:text-[1.1rem] max-[360px]:text-[1rem]':
                  index === 0,
                'text-[var(--medal-silver)] [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] max-[480px]:text-[1.05rem] max-[360px]:text-[0.95rem]':
                  index === 1,
                'text-[var(--medal-bronze)] [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] max-[480px]:text-[1rem] max-[360px]:text-[0.9rem]':
                  index === 2,
              }"
            >
              {{ index + 1 }}
            </td>
            <td
              class="p-3 text-[var(--t)] border-b border-b-[rgba(var(--mg-rgb),0.25)] border-l border-l-[rgba(var(--mg-rgb),0.12)] font-medium bg-gradient-to-r from-panel/75 to-panel-dark/85 align-middle leading-[1.2] min-h-14 h-14 first:border-l-[rgba(var(--mg-rgb),0.12)] last:border-r last:border-r-[rgba(var(--mg-rgb),0.12)] last:font-[Oswald,sans-serif] last:font-semibold last:text-right last:text-[1.15rem] last:tracking-[0.5px] last:whitespace-nowrap [tr:nth-child(even)>&]:bg-gradient-to-r [tr:nth-child(even)>&]:from-panel-striped/78 [tr:nth-child(even)>&]:to-panel-striped-dark/88 transition-all duration-200 relative max-[1024px]:p-[0.675rem] max-[1024px]:min-h-[3.25rem] max-[1024px]:h-[3.25rem] max-[1024px]:last:text-[1.1rem] max-[768px]:p-[0.625rem] max-[768px]:min-h-12 max-[768px]:h-12 max-[768px]:last:text-[1rem] max-[480px]:p-2 max-[480px]:min-h-[2.75rem] max-[480px]:h-[2.75rem] max-[480px]:last:text-[0.95rem] max-[360px]:p-1.5 max-[360px]:min-h-10 max-[360px]:h-10 max-[360px]:last:text-[0.85rem]"
            >
              <div class="flex items-center leading-none">
                <RankInsignia
                  :rank="e.rank ?? null"
                  :size="rankInsigniaSize"
                  class="inline-block !align-middle flex-shrink-0 m-0 leading-none"
                />
                <span
                  v-if="formatClanTag(e)"
                  class="font-[Courier_New,monospace] text-massgate-orange font-semibold text-[0.8rem] inline align-middle leading-[1.2] m-0 p-0 max-[768px]:text-[0.7rem] max-[360px]:text-[0.65rem]"
                  >{{ formatClanTag(e) }}</span
                >
                <span
                  class="font-[Rajdhani,sans-serif] text-[var(--t)] font-semibold text-[1.1rem] tracking-[0.3px] inline align-middle leading-[1.2] m-0 max-[1024px]:text-[1.05rem] max-[768px]:text-[1rem] max-[480px]:text-[0.95rem] max-[360px]:text-[0.9rem]"
                  >{{ e.profileName || 'Unknown' }}</span
                >
              </div>
            </td>
            <td
              class="p-3 text-[var(--t)] border-b border-b-[rgba(var(--mg-rgb),0.25)] border-l border-l-[rgba(var(--mg-rgb),0.12)] font-medium bg-gradient-to-r from-panel/75 to-panel-dark/85 align-middle leading-[1.2] min-h-14 h-14 first:border-l-[rgba(var(--mg-rgb),0.12)] last:border-r last:border-r-[rgba(var(--mg-rgb),0.12)] last:font-[Oswald,sans-serif] last:font-semibold last:text-right last:text-[1.15rem] last:tracking-[0.5px] last:whitespace-nowrap [tr:nth-child(even)>&]:bg-gradient-to-r [tr:nth-child(even)>&]:from-panel-striped/78 [tr:nth-child(even)>&]:to-panel-striped-dark/88 transition-all duration-200 max-[1024px]:p-[0.675rem] max-[1024px]:min-h-[3.25rem] max-[1024px]:h-[3.25rem] max-[1024px]:last:text-[1.1rem] max-[768px]:p-[0.625rem] max-[768px]:min-h-12 max-[768px]:h-12 max-[768px]:last:text-[1rem] max-[480px]:p-2 max-[480px]:min-h-[2.75rem] max-[480px]:h-[2.75rem] max-[480px]:last:text-[0.95rem] max-[360px]:p-1.5 max-[360px]:min-h-10 max-[360px]:h-10 max-[360px]:last:text-[0.85rem]"
              :class="{
                'text-[var(--medal-gold)]': index === 0,
                'text-[var(--medal-silver)]': index === 1,
                'text-[var(--medal-bronze)]': index === 2,
              }"
            >
              {{ e.high.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Slot for custom body (e.g., placeholder) if no categories & no table desired -->
    <slot />
  </div>
</template>
