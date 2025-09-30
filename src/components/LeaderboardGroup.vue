<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import type { LeaderboardEntry } from '../api-types';
import RankInsignia from './RankInsignia.vue';
import { AnalyticsEvents } from '../utils/analytics';

interface Props {
  title: string;
  subtitle?: string;
  categories?: string[]; // Tab categories; if 0 or 1, tabs hidden
  keys?: Record<string, string>; // Map category -> dataset key in data
  data: Record<string, LeaderboardEntry[] | undefined>;
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
    if (cats.length && !cats.includes(active.value)) active.value = cats[0];
  }
);

function rows(list?: LeaderboardEntry[]) {
  return (list || []).slice(0, props.maxRows);
}
function entriesFor(cat: string) {
  const key = props.keys[cat] || cat; // fallback: direct key
  return rows(props.data[key]);
}
function formatClanTag(entry: LeaderboardEntry): string {
  if (entry.tagFormat && entry.shortName) {
    return entry.tagFormat.replace('C', entry.shortName).replace('P', '');
  }
  return '';
}

function podiumTextClass(index: number): string {
  if (index === 0) return 'podium-gold';
  if (index === 1) return 'podium-silver';
  if (index === 2) return 'podium-bronze';
  return '';
}

function podiumScoreClass(index: number): string {
  if (index === 0) return 'rank-score-gold';
  if (index === 1) return 'rank-score-silver';
  if (index === 2) return 'rank-score-bronze';
  return '';
}

// Responsive RankInsignia sizing
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

const rankInsigniaSize = computed(() => {
  if (windowWidth.value <= 360) return 16;
  if (windowWidth.value <= 480) return 18;
  if (windowWidth.value <= 768) return 20;
  if (windowWidth.value <= 1024) return 22;
  return 24;
});

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWindowWidth);
    updateWindowWidth();
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth);
  }
});
</script>
<template>
  <div class="lb-cont">
    <div class="lb-hdr">
      <h3>{{ title }}</h3>
      <p v-if="subtitle" class="leaderboard-subtitle text-sm text-dim">{{ subtitle }}</p>
    </div>

    <div v-if="categories.length > 1" class="tabs">
      <button
        v-for="c in categories"
        :key="c"
        class="tab-btn"
        :class="{ active: active === c }"
        @click="
          () => {
            active = c;
            AnalyticsEvents.leaderboardTabSwitch(c);
          }
        "
      >
        {{ c[0].toUpperCase() + c.slice(1) }}
      </button>
    </div>

    <!-- If categories provided, render tab containers; else single table -->
    <template v-if="categories.length > 0">
      <div v-for="c in categories" :key="c" class="tab-cont" :class="{ active: active === c }">
        <table class="lb-table">
          <colgroup>
            <col class="col-rank" />
            <col class="col-player" />
            <col class="col-score" />
          </colgroup>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>{{ thirdLabel }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="entriesFor(c).length === 0">
              <td colspan="3" class="text-muted">No data</td>
            </tr>
            <tr
              v-for="(e, index) in entriesFor(c)"
              :key="e.rank + (e.profileName || '')"
              :class="index + 1 <= 3 ? 'rank-' + (index + 1) : ''"
            >
              <td class="lb-position" :class="index + 1 <= 3 ? 'rank-' + (index + 1) : ''">
                {{ index + 1 }}
              </td>
              <td class="player-cell">
                <div class="player-cell-content">
                  <RankInsignia :rank="e.rank" :size="rankInsigniaSize" />
                  <span v-if="formatClanTag(e)" class="clan-tag">{{ formatClanTag(e) }}</span>
                  <span class="player-name">{{ e.profileName || 'Unknown' }}</span>
                </div>
              </td>
              <td :class="[podiumScoreClass(index), podiumTextClass(index)]">
                {{ e.high?.toLocaleString?.() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <table class="lb-table">
        <colgroup>
          <col class="col-rank" />
          <col class="col-player" />
          <col class="col-score" />
        </colgroup>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>{{ thirdLabel }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="entriesFor(active).length === 0">
            <td colspan="3" class="text-muted">No data</td>
          </tr>
          <tr
            v-for="(e, index) in entriesFor(active)"
            :key="e.rank + (e.profileName || '')"
            :class="index + 1 <= 3 ? 'rank-' + (index + 1) : ''"
          >
            <td class="lb-position" :class="index + 1 <= 3 ? 'rank-' + (index + 1) : ''">
              {{ index + 1 }}
            </td>
            <td class="player-cell">
              <div class="player-cell-content">
                <RankInsignia :rank="e.rank" :size="rankInsigniaSize" />
                <span v-if="formatClanTag(e)" class="clan-tag">{{ formatClanTag(e) }}</span>
                <span class="player-name">{{ e.profileName || 'Unknown' }}</span>
              </div>
            </td>
            <td :class="[podiumScoreClass(index), podiumTextClass(index)]">
              {{ e.high?.toLocaleString?.() }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Slot for custom body (e.g., placeholder) if no categories & no table desired -->
    <slot />
  </div>
</template>
<style scoped>
/* uses global styles */
.clan-tag {
  color: var(--sw);
}

.player-name {
  color: var(--t);
}

.podium-gold {
  color: var(--medal-gold);
}

.podium-silver {
  color: var(--medal-silver);
}

.podium-bronze {
  color: var(--medal-bronze);
}

/* Gold, Silver, Bronze styling for rank positions only */
.lb-position.rank-1 {
  color: var(--medal-gold);
  font-weight: 600;
}

.lb-position.rank-2 {
  color: var(--medal-silver);
  font-weight: 600;
}

.lb-position.rank-3 {
  color: var(--medal-bronze);
  font-weight: 600;
}
</style>
