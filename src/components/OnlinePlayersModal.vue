<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { usePlayerDisplay } from '../composables/usePlayerDisplay';
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

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div class="first-visit-overlay">
      <div class="overlay-backdrop" @click="emit('close')"></div>
      <div
        class="overlay-card max-w-4xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="overlay-header">
          <h2 id="modal-title" class="slide-title flex items-center gap-2">
            <i class="fa-solid fa-users" aria-hidden="true"></i>
            Online Players
            <span class="widget-badge-count ml-1">{{ playerCount }}</span>
          </h2>
          <button class="overlay-close" title="Close" @click="emit('close')">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        <div class="overlay-content custom-scrollbar">
          <div class="players-modal-grid">
            <div v-for="server in serverGroups" :key="server.serverId" class="server-group-card">
              <div class="server-group-header">
                <div class="flex items-center gap-2 flex-1 overflow-hidden">
                  <span
                    class="text-base font-body font-semibold text-t overflow-hidden text-ellipsis whitespace-nowrap"
                    v-html="colorize(server.serverName)"
                  ></span>
                </div>
                <span
                  v-if="!server.isLobby"
                  class="text-xs font-military font-bold text-online flex-shrink-0"
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
            class="h-full flex items-center justify-center text-t3 font-body text-sm py-8"
          >
            No players online
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
