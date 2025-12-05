<script setup lang="ts">
import { computed } from 'vue';
import WidgetBase from './WidgetBase.vue';
import RankInsignia from '../RankInsignia.vue';
import type { LadderEntry } from '../../api-types';

const props = defineProps<{
  ladder: LadderEntry[];
  loading: boolean;
  isSSR: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

const topLadderPlayers = computed(() => {
  if (!props.ladder) return [];
  return props.ladder.slice(0, 3);
});

// Format clan tag like leaderboard
function formatClanTag(entry: LadderEntry): string {
  if (entry.tagFormat && entry.shortName) {
    return entry.tagFormat.replace('C', entry.shortName).replace('P', '');
  }
  return '';
}

function handleClick() {
  emit('navigate', 'statistics');
}
</script>

<template>
  <WidgetBase
    title="Top Players"
    icon="fa-solid fa-trophy"
    action="Leaderboards"
    @click="handleClick"
  >
    <div v-if="isSSR || loading" class="widget-skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>
    <template v-else>
      <div v-if="topLadderPlayers.length > 0" class="ladder-list">
        <div
          v-for="(player, i) in topLadderPlayers"
          :key="player.profileId"
          class="ladder-item flex items-center gap-3 p-3 bg-mg/15 border border-mg/25 rounded-none transition-all duration-200"
        >
          <span
            class="ladder-rank w-7 h-7 flex items-center justify-center bg-mg/40 text-sm font-bold font-military flex-shrink-0 rounded-none text-white"
          >
            {{ i + 1 }}
          </span>
          <div class="flex items-center flex-1 overflow-hidden leading-none gap-0">
            <RankInsignia
              :rank="player.rank || 0"
              :size="20"
              class="inline-block flex-shrink-0 mr-1.5"
            /><!--
         --><span v-if="formatClanTag(player)" class="widget-clan-tag">{{
              formatClanTag(player)
            }}</span
            ><span class="widget-player-name">{{ player.profileName }}</span>
          </div>
          <span class="ladder-score text-sm font-military font-bold flex-shrink-0 text-white">{{
            player.high
          }}</span>
        </div>
      </div>
      <div v-else class="widget-empty">No rankings yet</div>
    </template>
  </WidgetBase>
</template>
