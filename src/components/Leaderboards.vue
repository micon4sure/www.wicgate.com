<script setup lang="ts">
import type { LeaderboardEntry } from '../api-types';
import { computed } from 'vue';
import LeaderboardGroup from './LeaderboardGroup.vue';

const props = defineProps<{ data: Record<string, LeaderboardEntry[] | undefined> }>();

// Shared categories for high/total breakdown
const categories = ['overall', 'infantry', 'armor', 'air', 'support'];
const highKeys: Record<string, string> = {
  overall: 'lb_high',
  infantry: 'lb_highinf',
  armor: 'lb_higharm',
  air: 'lb_highair',
  support: 'lb_highsup',
};
const totalKeys: Record<string, string> = {
  overall: 'lb_total',
  infantry: 'lb_totinf',
  armor: 'lb_totarm',
  air: 'lb_totair',
  support: 'lb_totsup',
};
const ladderData = computed(() => ({ ladder: props.data.ladder || [] }));
</script>
<template>
  <div class="grid grid-2 mb-lg">
    <LeaderboardGroup
      title="High Scores"
      subtitle="Best individual match performances"
      :categories="categories"
      :keys="highKeys"
      :data="props.data"
      third-label="Score"
    />
    <LeaderboardGroup
      title="Total Scores"
      subtitle="Cumulative career scores"
      :categories="categories"
      :keys="totalKeys"
      :data="props.data"
      third-label="Score"
    />
    <LeaderboardGroup
      title="Player Leaderboard"
      :data="ladderData"
      :categories="[]"
      :keys="{ default: 'ladder' }"
      third-label="Rating"
    />
    <div
      class="bg-gradient-to-b from-panel/96 to-panel-dark/98 border border-[var(--divider-strong)] rounded-none overflow-hidden relative shadow-[0_12px_30px_rgba(4,9,14,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] mb-6 transition-all duration-300"
    >
      <div
        class="p-[15px_20px] bg-gradient-to-b from-massgate-red to-massgate-red-dark border-[3px] border-massgate-red-dark relative"
      >
        <h3
          class="font-[Oswald,sans-serif] text-[1.25rem] font-bold text-white uppercase tracking-[1px] m-0 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]"
        >
          Clan Leaderboard
        </h3>
      </div>
      <div class="text-center italic text-t3 font-[Rajdhani,sans-serif] p-[30px]">Coming soon</div>
    </div>
  </div>
</template>
<style scoped>
/* inherits global */
</style>
