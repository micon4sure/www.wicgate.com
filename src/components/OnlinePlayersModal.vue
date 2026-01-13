<script setup lang="ts">
import { usePlayerDisplay } from '../composables/usePlayerDisplay';
import BaseOverlay from './BaseOverlay.vue';
import RankInsignia from './RankInsignia.vue';

interface PlayerInfo {
  profileId: number | string;
  profileName: string;
  rank?: number;
  shortName?: string | null;
  tagFormat?: string | null;
}

interface ServerGroup {
  serverId: number;
  serverName: string;
  players: PlayerInfo[];
  playerCount: number;
  isLobby: boolean;
}

defineProps<{
  serverGroups: ServerGroup[];
  playerCount: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { colorize } = usePlayerDisplay();

function formatPlayerClanTag(player: {
  tagFormat?: string | null;
  shortName?: string | null;
}): string {
  if (player.tagFormat && player.shortName) {
    return player.tagFormat.replace('C', player.shortName).replace('P', '');
  }
  return '';
}
</script>

<template>
  <BaseOverlay max-width="4xl" aria-labelledby="modal-title" @close="emit('close')">
    <template #header>
      <span class="flex items-center gap-2">
        <i class="fa-solid fa-users" aria-hidden="true"></i>
        <span>Online Players</span>
        <span class="widget-badge-count ml-1">{{ playerCount }}</span>
      </span>
    </template>

    <div class="players-modal-grid">
      <div v-for="server in serverGroups" :key="server.serverId" class="server-group-card">
        <div class="server-group-header">
          <div class="flex items-center gap-2 flex-1 overflow-hidden">
            <span
              class="text-data font-body font-semibold text-t overflow-hidden text-ellipsis whitespace-nowrap"
              v-html="colorize(server.serverName)"
            ></span>
          </div>
          <span
            v-if="!server.isLobby"
            class="text-data font-military font-bold text-teal flex-shrink-0"
          >
            {{ server.playerCount }}/16
          </span>
        </div>

        <div class="px-3 py-2 space-y-1.5">
          <div
            v-for="player in server.players"
            :key="player.profileId"
            class="flex items-center gap-1.5 py-1 leading-none"
          >
            <div class="w-5 h-5 rounded-sm flex-shrink-0 overflow-hidden">
              <img
                :src="`https://www.wicgate.com/pcc/${player.profileId}.webp`"
                :alt="player.profileName"
                class="w-full h-full object-cover"
                loading="lazy"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />
            </div>
            <RankInsignia
              :rank="player.rank || 0"
              :size="20"
              class="inline-block flex-shrink-0 align-middle mr-1"
            /><!--
         --><span
              class="inline align-middle leading-none overflow-hidden text-ellipsis whitespace-nowrap"
            >
              <span v-if="formatPlayerClanTag(player)" class="widget-clan-tag-sm">{{
                formatPlayerClanTag(player)
              }}</span
              ><span class="widget-player-name-sm">{{ player.profileName }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="serverGroups.length === 0"
      class="h-full flex items-center justify-center text-t-tertiary font-body text-sm py-8"
    >
      No players online
    </div>
  </BaseOverlay>
</template>
