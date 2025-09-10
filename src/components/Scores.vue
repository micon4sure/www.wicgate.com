<script setup lang="ts">
import type { LeaderboardEntry } from '../composables/useAppData';
defineProps<{ title: string; entries?: LeaderboardEntry[]; best?: boolean }>();
</script>
<template>
  <div class="gm-stat-card">
    <div class="gm-stat-header">
      <h4>{{ title }}</h4>
      <span v-if="best" class="stat-type">BEST</span>
    </div>
    <table class="gm-stat-table">
      <tbody>
        <tr v-if="!entries || entries.length === 0">
          <td colspan="3" class="no-data">No data</td>
        </tr>
        <tr v-for="e in (entries || []).slice(0, 10)" :key="e.rank + (e.profileName || '')"
          :class="e.rank && e.rank <= 3 ? 'rank-' + e.rank : ''">
          <td>{{ e.rank }}</td>
          <td>{{ e.profileName || e.shortName || e.tagFormat || 'Unknown' }}</td>
          <td>{{ e.high?.toLocaleString?.() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
/* uses shared classes */
</style>
