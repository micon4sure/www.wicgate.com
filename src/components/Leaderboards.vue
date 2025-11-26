<script setup lang="ts">
import type { LeaderboardEntry, LadderEntry } from '../api-types';
import { computed } from 'vue';
import LeaderboardGroup from './LeaderboardGroup.vue';

type LeaderboardRow = LeaderboardEntry | LadderEntry;
type LeaderboardDataRecord = Record<string, LeaderboardRow[] | undefined>;

const props = defineProps<{ data: LeaderboardDataRecord }>();

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
const ladderData = computed<LeaderboardDataRecord>(() => ({
  ladder: props.data.ladder,
}));
</script>
<template>
  <div class="grid grid-cols-1 gap-6 mb-6">
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
      subtitle="Top performers over the past 2 weeks"
      :data="ladderData"
      :categories="[]"
      :keys="{ default: 'ladder' }"
      third-label="Rating"
    />
    <div class="leaderboard-container">
      <div class="leaderboard-header-row">
        <div class="leaderboard-header leaderboard-header-full">
          <h3 class="leaderboard-header-title">Clan Leaderboard</h3>
          <p class="leaderboard-header-subtitle">Coming soon</p>
        </div>
      </div>
      <div class="leaderboard-panel-placeholder">Clan rankings are in development</div>
    </div>
  </div>
</template>
