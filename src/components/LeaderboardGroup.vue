<script setup lang="ts">
import { ref, watch } from 'vue';
import type { LeaderboardEntry } from '../composables/useAppData';
import RankInsignia from './RankInsignia.vue';

interface Props {
  title: string;
  subtitle?: string;
  categories?: string[];              // Tab categories; if 0 or 1, tabs hidden
  keys?: Record<string, string>;      // Map category -> dataset key in data
  data: Record<string, LeaderboardEntry[] | undefined>;
  thirdLabel?: string;                // Column header for value
  maxRows?: number;                   // Rows cap (default 10)
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  keys: () => ({}),
  thirdLabel: 'Score',
  maxRows: 10
});

// Active tab (first category or fallback 'default')
const active = ref(props.categories[0] || 'default');
watch(() => props.categories, (cats) => {
  if (cats.length && !cats.includes(active.value)) active.value = cats[0];
});

function rows(list?: LeaderboardEntry[]) { return (list || []).slice(0, props.maxRows); }
function entriesFor(cat: string) {
  const key = props.keys[cat] || cat; // fallback: direct key
  return rows(props.data[key]);
}
function formatPlayerName(entry: LeaderboardEntry): string {
  if (entry.tagFormat && entry.shortName && entry.profileName) {
    return entry.tagFormat
      .replace('C', entry.shortName)
      .replace('P', entry.profileName);
  }
  return entry.profileName || entry.shortName || 'Unknown';
}
function formatClanTag(entry: LeaderboardEntry): string {
  if (entry.tagFormat && entry.shortName) {
    return entry.tagFormat.replace('C', entry.shortName).replace('P', '');
  }
  return '';
}
</script>
<template>
  <div class="lb-cont">
    <div class="lb-hdr">
      <h3>{{ title }}</h3>
      <p v-if="subtitle" class="leaderboard-subtitle text-sm text-dim">{{ subtitle }}</p>
    </div>

    <div v-if="categories.length > 1" class="tabs">
      <button v-for="c in categories" :key="c" class="tab-btn" :class="{ active: active === c }" @click="active = c">
        {{ c[0].toUpperCase() + c.slice(1) }}
      </button>
    </div>

    <!-- If categories provided, render tab containers; else single table -->
    <template v-if="categories.length > 0">
      <div v-for="c in categories" :key="c" class="tab-cont" :class="{ active: active === c }">
        <table class="lb-table">
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
            <tr v-for="(e, index) in entriesFor(c)" :key="e.rank + (e.profileName || '')" 
                :class="index + 1 <= 3 ? 'rank-' + (index + 1) : ''">
              <td class="lb-position" :class="index + 1 <= 3 ? 'rank-' + (index + 1) : ''">{{ index + 1 }}</td>
              <td class="player-cell">
                <RankInsignia :rank="e.rank" :size="22" style="margin-right: 8px; margin-left: -30px;" />
                <span v-if="formatClanTag(e)" class="clan-tag">{{ formatClanTag(e) }}</span>
                <span class="player-name">{{ e.profileName || 'Unknown' }}</span>
              </td>
              <td :style="index === 0 ? 'color: #ffd700 !important; font-weight: 600; background: none !important; -webkit-text-fill-color: #ffd700 !important;' : index === 1 ? 'color: #c0c0c0 !important; font-weight: 600; background: none !important; -webkit-text-fill-color: #c0c0c0 !important;' : index === 2 ? 'color: #cd7f32 !important; font-weight: 600; background: none !important; -webkit-text-fill-color: #cd7f32 !important;' : ''">{{ e.high?.toLocaleString?.() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <table class="lb-table">
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
          <tr v-for="(e, index) in entriesFor(active)" :key="e.rank + (e.profileName || '')"
              :class="index + 1 <= 3 ? 'rank-' + (index + 1) : ''">
            <td class="lb-position" :class="index + 1 <= 3 ? 'rank-' + (index + 1) : ''">{{ index + 1 }}</td>
            <td class="player-cell">
              <RankInsignia :rank="e.rank" :size="22" style="margin-right: 8px; margin-left: -30px;" />
              <span v-if="formatClanTag(e)" class="clan-tag">{{ formatClanTag(e) }}</span>
              <span class="player-name">{{ e.profileName || 'Unknown' }}</span>
            </td>
            <td :style="index === 0 ? 'color: #ffd700 !important; font-weight: 600; background: none !important; -webkit-text-fill-color: #ffd700 !important;' : index === 1 ? 'color: #c0c0c0 !important; font-weight: 600; background: none !important; -webkit-text-fill-color: #c0c0c0 !important;' : index === 2 ? 'color: #cd7f32 !important; font-weight: 600; background: none !important; -webkit-text-fill-color: #cd7f32 !important;' : ''">{{ e.high?.toLocaleString?.() }}</td>
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
  color: #b3b3b3;
}

.player-name {
  color: var(--t);
}

/* Gold, Silver, Bronze styling for rank positions only */
.lb-position.rank-1 {
  color: #ffd700;
  font-weight: 600;
}

.lb-position.rank-2 {
  color: #c0c0c0;
  font-weight: 600;
}

.lb-position.rank-3 {
  color: #cd7f32;
  font-weight: 600;
}
</style>
