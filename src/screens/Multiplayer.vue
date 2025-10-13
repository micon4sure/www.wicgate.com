<script setup lang="ts">
import { computed } from 'vue';
import Leaderboards from '../components/Leaderboards.vue';
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton.vue';
import type { DataResponse } from '../api-types';
import { useServerCapacity } from '../composables/useServerCapacity';
import { usePlayerDisplay } from '../composables/usePlayerDisplay';

const props = defineProps<{
  data: Partial<DataResponse>;
  loading: boolean;
}>();

// During SSG build or while loading, show placeholder
const isSSR = import.meta.env.SSR;
const showPlaceholder = computed(() => isSSR || props.loading);

// Players and servers data
const players = computed(() => props.data.profiles || []);
const servers = computed(() => props.data.servers || []);
const totalPlayers = computed(() => players.value.length);

// Group players by server and sort by player count (descending)
const serverGroups = computed(() => {
  const groups = groupPlayersByServer(players.value, servers.value);
  // Sort: servers with players first (by count DESC), empty servers last
  return groups.sort((a, b) => {
    const countA = a.players.length;
    const countB = b.players.length;
    if (countA === 0 && countB === 0) return a.serverName.localeCompare(b.serverName);
    if (countA === 0) return 1;
    if (countB === 0) return -1;
    return countB - countA;
  });
});

const activeServerCount = computed(
  () => serverGroups.value.filter((g) => g.players.length > 0).length
);

// Utility composables
const { getCapacityColor } = useServerCapacity();
const { colorize, parseClanTag, groupPlayersByServer } = usePlayerDisplay();
</script>

<template>
  <section id="multiplayer" class="section bg-gradient-to-b from-graphite/30 to-graphite-dark/50">
    <div class="container max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-20">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Multiplayer
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Live servers and player rankings
        </p>
      </div>

      <!-- Players & Servers Online Subsection -->
      <div id="multiplayer-servers" class="mb-20">
        <!-- Subsection Header -->
        <div class="text-center mb-8">
          <h3
            class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider mb-2"
          >
            Players & Servers Online
          </h3>
          <p class="text-sm md:text-base text-t-secondary font-body m-0">
            {{ totalPlayers }} {{ totalPlayers === 1 ? 'player' : 'players' }} across
            {{ activeServerCount }} {{ activeServerCount === 1 ? 'server' : 'servers' }}
          </p>
        </div>

        <!-- Server Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          <!-- Loading state -->
          <div
            v-if="showPlaceholder"
            class="bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/20 rounded-none p-5 min-h-[150px]"
          >
            <div class="h-6 bg-graphite/30 mb-4 w-3/5"></div>
            <div class="h-20 bg-graphite/20"></div>
          </div>

          <!-- Server cards -->
          <template v-else>
            <div
              v-for="group in serverGroups"
              :key="group.serverId"
              class="bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/30 border-l-4 border-l-massgate-orange/70 rounded-none overflow-hidden"
              :class="{ 'opacity-60': group.players.length === 0 }"
            >
              <!-- Server Card Header -->
              <div
                class="p-4 md:p-5 bg-gradient-to-b from-graphite/25 to-graphite-dark/40 border-b border-teal/20"
              >
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <!-- Status Dot -->
                    <span
                      class="w-2 h-2 rounded-full flex-shrink-0"
                      :class="
                        group.players.length > 0
                          ? 'bg-green shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse'
                          : 'bg-graphite opacity-50'
                      "
                    ></span>
                    <!-- Server Name -->
                    <span
                      class="font-military text-xl md:text-2xl font-bold text-t uppercase tracking-wide truncate"
                      v-html="colorize(group.serverName)"
                    ></span>
                  </div>
                  <!-- Server Capacity -->
                  <div
                    class="text-base md:text-lg font-military font-bold tracking-wide flex-shrink-0"
                    :style="{ color: getCapacityColor(group.players.length) }"
                  >
                    {{ group.players.length }}/16
                  </div>
                </div>
              </div>

              <!-- Server Card Body -->
              <div class="p-4 md:p-5">
                <!-- No Players -->
                <div v-if="group.players.length === 0" class="text-center text-t3 text-sm py-3">
                  No players online
                </div>

                <!-- Player Grid -->
                <div
                  v-else
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2"
                >
                  <div
                    v-for="player in group.players"
                    :key="(player.profileName || 'Unknown') + String(player.serverId)"
                    class="flex items-center gap-2 px-3 py-2 bg-graphite/15 border border-graphite/25 rounded-none transition-all duration-200 hover:bg-teal/15 hover:border-teal/30"
                  >
                    <!-- Player Dot -->
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-green opacity-80 flex-shrink-0 animate-pulse"
                    ></span>

                    <!-- Clan Tag -->
                    <span
                      v-if="parseClanTag(player).clanTag"
                      class="font-mono text-massgate-orange font-semibold text-xs"
                    >
                      {{ parseClanTag(player).clanTag }}
                    </span>

                    <!-- Player Name -->
                    <span class="font-body text-t font-semibold text-base tracking-wide truncate">
                      {{ parseClanTag(player).playerName }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state when no servers -->
            <div v-if="serverGroups.length === 0" class="col-span-full text-center py-16 text-t3">
              <p>No servers available</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Statistics Subsection -->
      <div id="multiplayer-statistics">
        <!-- Subsection Header -->
        <div class="text-center mb-8">
          <h3
            class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider mb-2"
          >
            Statistics
          </h3>
          <p class="text-sm md:text-base text-t-secondary font-body m-0">
            Rankings and leaderboards
          </p>
        </div>

        <!-- SSG/Loading: Render skeleton placeholder -->
        <LeaderboardSkeleton v-if="showPlaceholder" />

        <!-- Runtime: Render live data -->
        <Leaderboards v-else :data="data" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
