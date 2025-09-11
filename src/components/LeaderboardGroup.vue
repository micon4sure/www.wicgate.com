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
            <tr v-for="e in entriesFor(c)" :key="e.rank + (e.profileName || '')"
              :class="e.rank && e.rank <= 3 ? 'rank-' + e.rank : ''">
              <td class="rank-cell">
                <RankInsignia :rank="e.rank" :size="22" />
              </td>
              <td>{{ e.profileName || e.shortName || e.tagFormat || 'Unknown' }}</td>
              <td>{{ e.high?.toLocaleString?.() }}</td>
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
          <tr v-for="e in entriesFor(active)" :key="e.rank + (e.profileName || '')"
            :class="e.rank && e.rank <= 3 ? 'rank-' + e.rank : ''">
            <td class="rank-cell">
              <RankInsignia :rank="e.rank" :size="22" />
            </td>
            <td>{{ e.profileName || e.shortName || e.tagFormat || 'Unknown' }}</td>
            <td>{{ e.high?.toLocaleString?.() }}</td>
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
</style>
