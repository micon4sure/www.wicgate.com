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
  <div class="leaderboard-container">
    <div class="leaderboard-header">
      <h3 class="leaderboard-header-title">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="leaderboard-header-subtitle">
        {{ subtitle }}
      </p>
    </div>

    <div v-if="categories.length > 1" class="leaderboard-tabs">
      <button
        v-for="c in categories"
        :key="c"
        class="leaderboard-tab"
        :class="{ active: active === c }"
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
        <table class="leaderboard-table">
          <colgroup>
            <col class="col-rank" />
            <col class="w-auto" />
            <col class="col-score" />
          </colgroup>
          <thead>
            <tr>
              <th class="leaderboard-th">Rank</th>
              <th class="leaderboard-th">Player</th>
              <th class="leaderboard-th">{{ thirdLabel }}</th>
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
              class="lb-row"
            >
              <td
                class="lb-cell-rank"
                :class="{
                  'lb-medal-gold': index === 0,
                  'lb-medal-silver': index === 1,
                  'lb-medal-bronze': index === 2,
                }"
              >
                {{ index + 1 }}
              </td>
              <td class="lb-cell-player">
                <div class="flex items-center leading-none">
                  <RankInsignia
                    :rank="e.rank ?? null"
                    :size="rankInsigniaSize"
                    class="inline-block !align-middle flex-shrink-0 m-0 leading-none"
                  />
                  <span v-if="formatClanTag(e)" class="lb-clan-tag">{{ formatClanTag(e) }}</span>
                  <span class="lb-player-name">{{ e.profileName || 'Unknown' }}</span>
                </div>
              </td>
              <td
                class="lb-cell-score"
                :class="{
                  'text-gold': index === 0,
                  'text-silver': index === 1,
                  'text-bronze': index === 2,
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
      <table class="leaderboard-table">
        <colgroup>
          <col class="col-rank" />
          <col class="w-auto" />
          <col class="col-score" />
        </colgroup>
        <thead>
          <tr>
            <th class="leaderboard-th">Rank</th>
            <th class="leaderboard-th">Player</th>
            <th class="leaderboard-th">{{ thirdLabel }}</th>
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
            class="lb-row"
          >
            <td
              class="lb-cell-rank"
              :class="{
                'lb-medal-gold': index === 0,
                'lb-medal-silver': index === 1,
                'lb-medal-bronze': index === 2,
              }"
            >
              {{ index + 1 }}
            </td>
            <td class="lb-cell-player">
              <div class="flex items-center leading-none">
                <RankInsignia
                  :rank="e.rank ?? null"
                  :size="rankInsigniaSize"
                  class="inline-block !align-middle flex-shrink-0 m-0 leading-none"
                />
                <span v-if="formatClanTag(e)" class="lb-clan-tag">{{ formatClanTag(e) }}</span>
                <span class="lb-player-name">{{ e.profileName || 'Unknown' }}</span>
              </div>
            </td>
            <td
              class="lb-cell-score"
              :class="{
                'text-gold': index === 0,
                'text-silver': index === 1,
                'text-bronze': index === 2,
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
