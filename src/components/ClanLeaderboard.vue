<script setup lang="ts">
import { ref } from 'vue';
import type { ClanEntry } from '../api-types';

const props = defineProps<{ clans: ClanEntry[]; id?: string }>();

const copied = ref(false);

function formatClanTag(clan: ClanEntry): string {
  return clan.tagFormat.replace('C', clan.shortName).replace('P', '');
}

function copyLeaderboardLink() {
  if (typeof window === 'undefined' || !navigator.clipboard || !props.id) return;

  const url = `${window.location.origin}/statistics#${props.id}`;

  navigator.clipboard.writeText(url).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2200);
  });
}
</script>

<template>
  <div :id="id || undefined" class="leaderboard-container">
    <div class="leaderboard-header-row">
      <div class="leaderboard-header leaderboard-header-full group relative">
        <div>
          <h3 class="leaderboard-header-title">Clan Leaderboard</h3>
          <p class="leaderboard-header-subtitle">Top ranked clans</p>
        </div>
        <!-- Copy Link Button - positioned right -->
        <span
          v-if="id"
          role="button"
          tabindex="0"
          class="lb-copy-link-btn absolute right-3 top-1/2 -translate-y-1/2"
          :class="copied ? 'is-copied' : ''"
          title="Copy link to Clan Leaderboard"
          aria-label="Copy link to Clan Leaderboard"
          @click.stop="copyLeaderboardLink"
          @keydown.enter.stop.prevent="copyLeaderboardLink"
          @keydown.space.stop.prevent="copyLeaderboardLink"
        >
          <i
            class="text-sm transition-all duration-200"
            :class="copied ? 'fa-solid fa-check' : 'fa-solid fa-link'"
            aria-hidden="true"
          ></i>
        </span>
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
