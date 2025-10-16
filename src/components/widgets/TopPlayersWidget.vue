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
  emit('navigate', 'multiplayer-statistics');
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
          class="ladder-item"
          :class="[
            'flex items-center gap-3 p-3 bg-mg/15 border border-mg/25 rounded-none transition-all duration-200',
            {
              '[&_.ladder-rank]:text-medal-gold [&_.ladder-rank]:text-shadow-sm [&_.ladder-score]:text-medal-gold':
                i === 0,
              '[&_.ladder-rank]:text-medal-silver [&_.ladder-rank]:text-shadow-sm [&_.ladder-score]:text-medal-silver':
                i === 1,
              '[&_.ladder-rank]:text-medal-bronze [&_.ladder-rank]:text-shadow-sm [&_.ladder-score]:text-medal-bronze':
                i === 2,
            },
          ]"
        >
          <span
            class="ladder-rank w-7 h-7 flex items-center justify-center bg-mg/40 text-sm font-bold font-military flex-shrink-0 rounded-none"
            :class="{
              'text-[1.05rem]': i === 0,
              'text-base': i === 1,
              'text-[0.95rem]': i === 2,
            }"
          >
            {{ i + 1 }}
          </span>
          <div class="flex items-center flex-1 overflow-hidden leading-none gap-0">
            <RankInsignia
              :rank="player.rank || 0"
              :size="20"
              class="inline-block flex-shrink-0 mr-1.5"
            />
            <span
              v-if="formatClanTag(player)"
              class="font-mono text-soviet font-semibold text-[0.75rem] tracking-[0.3px] flex-shrink-0"
            >
              {{ formatClanTag(player) }}
            </span>
            <span
              class="font-body text-t font-semibold text-[0.9rem] tracking-[0.3px] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {{ player.profileName }}
            </span>
          </div>
          <span class="ladder-score text-sm font-military font-bold flex-shrink-0">{{
            player.high
          }}</span>
        </div>
      </div>
      <div v-else class="widget-empty">No rankings yet</div>
    </template>
  </WidgetBase>
</template>
