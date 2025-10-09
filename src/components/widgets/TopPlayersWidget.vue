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
          :class="`rank-${i + 1}`"
        >
          <span class="ladder-rank">{{ i + 1 }}</span>
          <div class="player-cell-content">
            <RankInsignia :rank="player.rank || 0" :size="20" />
            <span v-if="formatClanTag(player)" class="clan-tag">{{ formatClanTag(player) }}</span>
            <span class="player-name">{{ player.profileName }}</span>
          </div>
          <span class="ladder-score">{{ player.high }}</span>
        </div>
      </div>
      <div v-else class="widget-empty">No rankings yet</div>
    </template>
  </WidgetBase>
</template>

<style scoped>
/* Podium styling for rank numbers */
.ladder-item.rank-1 .ladder-rank {
  color: var(--medal-gold);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 1.05rem;
}

.ladder-item.rank-2 .ladder-rank {
  color: var(--medal-silver);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 1rem;
}

.ladder-item.rank-3 .ladder-rank {
  color: var(--medal-bronze);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 0.95rem;
}

/* Podium styling for scores - matches leaderboard */
.ladder-item.rank-1 .ladder-score {
  color: var(--medal-gold);
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.ladder-item.rank-2 .ladder-score {
  color: var(--medal-silver);
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.ladder-item.rank-3 .ladder-score {
  color: var(--medal-bronze);
  font-weight: 600;
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

/* Player cell content - matches leaderboard layout */
.player-cell-content {
  display: flex;
  align-items: center;
  /* NO gap property - matches leaderboard */
  flex: 1;
  overflow: hidden;
  line-height: 1;
}

.player-cell-content .rank-insignia {
  flex-shrink: 0;
  margin: 0 6px 0 0; /* Only rank insignia gets right margin */
}

.clan-tag {
  font-family: 'Courier New', monospace;
  color: var(--sw);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}

.player-name {
  font-family: 'Rajdhani', sans-serif;
  color: var(--t);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
