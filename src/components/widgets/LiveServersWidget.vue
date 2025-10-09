<script setup lang="ts">
import { computed } from 'vue';
import WidgetBase from './WidgetBase.vue';
import { useServerCapacity } from '../../composables/useServerCapacity';
import { usePlayerDisplay } from '../../composables/usePlayerDisplay';
import type { DataResponse } from '../../api-types';

const props = defineProps<{
  data: Partial<DataResponse>;
  playerCount: number;
  loading: boolean;
  isSSR: boolean;
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

const { getCapacityColor } = useServerCapacity();
const { colorize } = usePlayerDisplay();

const activeServers = computed(() => {
  if (!props.data.servers || !props.data.profiles) return [];

  // Group players by server and get servers with players
  const serverMap = new Map<number, { name: string; count: number }>();

  props.data.profiles.forEach((profile) => {
    const serverId = Number(profile.serverId);
    const server = props.data.servers?.find((s) => s.serverId === serverId);
    if (server) {
      const existing = serverMap.get(serverId);
      if (existing) {
        existing.count++;
      } else {
        serverMap.set(serverId, { name: server.serverName, count: 1 });
      }
    }
  });

  // Convert to array and sort by player count
  return Array.from(serverMap.entries())
    .map(([id, info]) => ({ id, ...info }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
});

const activeServerCount = computed(() => activeServers.value.length);

function handleClick() {
  emit('navigate', 'multiplayer-servers');
}
</script>

<template>
  <WidgetBase title="Live Servers" icon="fa-solid fa-server" action="View All" @click="handleClick">
    <div v-if="isSSR || loading" class="widget-skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>
    <template v-else>
      <div class="widget-stats-row">
        <div class="widget-stat">
          <span class="stat-number">{{ playerCount }}</span>
          <span class="stat-label">Players Online</span>
        </div>
        <div class="widget-stat">
          <span class="stat-number">{{ activeServerCount }}</span>
          <span class="stat-label">Active Servers</span>
        </div>
      </div>
      <div v-if="activeServers.length > 0" class="server-list">
        <div v-for="server in activeServers" :key="server.id" class="server-item">
          <span class="server-dot"></span>
          <span class="server-name" v-html="colorize(server.name)"></span>
          <span class="server-count" :style="{ color: getCapacityColor(server.count) }"
            >{{ server.count }}/16</span
          >
        </div>
      </div>
      <div v-else class="widget-empty">No active servers</div>
    </template>
  </WidgetBase>
</template>
