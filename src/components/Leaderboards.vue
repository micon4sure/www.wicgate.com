<script setup lang="ts">
import type { LeaderboardEntry } from '../composables/useAppData';
import { computed } from 'vue';
import LeaderboardGroup from './LeaderboardGroup.vue';

const props = defineProps<{ data: Record<string, LeaderboardEntry[] | undefined> }>();

// Shared categories for high/total breakdown
const categories = ['overall', 'infantry', 'armor', 'air', 'support'];
const highKeys: Record<string, string> = { overall: 'lb_high', infantry: 'lb_highinf', armor: 'lb_higharm', air: 'lb_highair', support: 'lb_highsup' };
const totalKeys: Record<string, string> = { overall: 'lb_total', infantry: 'lb_totinf', armor: 'lb_totarm', air: 'lb_totair', support: 'lb_totsup' };
const ladderData = computed(() => ({ ladder: props.data.ladder || [] }));
</script>
<template>
  <div class="grid grid-2 mb-lg">
    <LeaderboardGroup title="High Scores" subtitle="Best individual match performances" :categories="categories"
      :keys="highKeys" :data="props.data" third-label="Score" />
    <LeaderboardGroup title="Total Scores" subtitle="Cumulative career scores" :categories="categories"
      :keys="totalKeys" :data="props.data" third-label="Score" />
    <LeaderboardGroup title="Player Leaderboard" :data="ladderData" :categories="[]" :keys="{ default: 'ladder' }"
      third-label="Rating" />
    <div class="lb-cont">
      <div class="lb-hdr">
        <h3>Clan Leaderboard</h3>
      </div>
      <div class="lb-placeholder">Coming soon</div>
    </div>
  </div>
</template>
<style scoped>
/* inherits global */
</style>
