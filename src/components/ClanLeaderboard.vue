<script setup lang="ts">
import type { ClanEntry } from '../api-types';

defineProps<{ clans: ClanEntry[] }>();

function formatClanTag(clan: ClanEntry): string {
  return clan.tagFormat.replace('C', clan.shortName).replace('P', '');
}
</script>

<template>
  <div class="leaderboard-container">
    <div class="leaderboard-header-row">
      <div class="leaderboard-header leaderboard-header-full">
        <h3 class="leaderboard-header-title">Clan Leaderboard</h3>
        <p class="leaderboard-header-subtitle">Top ranked clans</p>
      </div>
    </div>
    <table class="leaderboard-table">
      <colgroup>
        <col class="col-rank" />
        <col class="w-auto" />
        <col class="col-score" />
      </colgroup>
      <thead>
        <tr>
          <th class="leaderboard-th">Rank</th>
          <th class="leaderboard-th">Clan</th>
          <th class="leaderboard-th">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="clans.length === 0">
          <td
            colspan="3"
            class="text-center italic text-t-tertiary font-[Rajdhani,sans-serif] p-[30px]"
          >
            No data
          </td>
        </tr>
        <tr v-for="(clan, index) in clans.slice(0, 10)" :key="clan.clanId" class="lb-row">
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
              <span class="lb-clan-tag">{{ formatClanTag(clan) }}</span>
              <span class="lb-player-name">{{ clan.fullName }}</span>
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
            {{ clan.rating.toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
