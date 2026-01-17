<script setup lang="ts">
import { ref, inject, onBeforeUnmount } from 'vue';
import type { ClanEntry } from '../api-types';

const props = defineProps<{ clans: ClanEntry[]; id?: string }>();

// Track active timeouts for cleanup
const activeTimeouts = new Set<ReturnType<typeof setTimeout>>();

function trackTimeout(fn: () => void, delay: number): ReturnType<typeof setTimeout> {
  const id = setTimeout(() => {
    activeTimeouts.delete(id);
    fn();
  }, delay);
  activeTimeouts.add(id);
  return id;
}

// Clean up on unmount
onBeforeUnmount(() => {
  activeTimeouts.forEach((id) => clearTimeout(id));
  activeTimeouts.clear();
});

// Base path for GitHub Pages deployment (see main.ts)
const appBase = inject<string>('appBase', '/');

const copied = ref(false);
const showCopiedToast = ref(false);

function formatClanTag(clan: ClanEntry): string {
  return clan.tagFormat.replace('C', clan.shortName).replace('P', '');
}

function copyLeaderboardLink() {
  if (typeof window === 'undefined' || !navigator.clipboard || !props.id) return;

  const url = `${window.location.origin}${appBase}statistics#${props.id}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      copied.value = true;
      showCopiedToast.value = true;

      trackTimeout(() => {
        showCopiedToast.value = false;
        trackTimeout(() => {
          copied.value = false;
        }, 200);
      }, 2000);
    })
    .catch((err: unknown) => {
      if (import.meta.env.DEV) {
        console.warn('Failed to copy link to clipboard:', err);
      }
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
        <col class="col-clan-spacer" />
        <col class="w-auto" />
        <col class="col-score" />
      </colgroup>
      <thead>
        <tr>
          <th class="leaderboard-th" colspan="2">Rank</th>
          <th class="leaderboard-th">Clan</th>
          <th class="leaderboard-th">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="clans.length === 0">
          <td colspan="4" class="text-center italic text-t-tertiary font-body p-[30px]">No data</td>
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
          <td></td>
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

  <!-- Toast notification for copy link -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-show="showCopiedToast"
      class="toast-notification"
      style="top: calc(var(--header-height) + 16px)"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-center gap-3">
        <i class="fa-solid fa-check text-dark-navy text-lg" aria-hidden="true"></i>
        <span class="text-dark-navy font-body font-semibold">Link copied to clipboard!</span>
      </div>
    </div>
  </transition>
</template>
