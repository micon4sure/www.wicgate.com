<script setup lang="ts">
import type { LeaderboardEntry, LadderEntry, ClanEntry } from '../api-types';
import { computed } from 'vue';
import LeaderboardGroup from './LeaderboardGroup.vue';
import ClanLeaderboard from './ClanLeaderboard.vue';

type LeaderboardRow = LeaderboardEntry | LadderEntry;
type LeaderboardDataRecord = Record<string, LeaderboardRow[] | undefined>;

const props = defineProps<{ data: LeaderboardDataRecord; clans?: ClanEntry[] }>();

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
    <!-- Player and Clan Leaderboards side by side on wide screens -->
    <div class="leaderboard-dual-container">
      <LeaderboardGroup
        title="Player Leaderboard"
        subtitle="Top performers over the past 2 weeks"
        :data="ladderData"
        :categories="[]"
        :keys="{ default: 'ladder' }"
        third-label="Score"
      />
      <ClanLeaderboard :clans="props.clans || []" />
    </div>
    <!-- High Scores and Total Scores side by side on wide screens -->
    <div class="leaderboard-dual-container">
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
    </div>
  </div>
</template>
