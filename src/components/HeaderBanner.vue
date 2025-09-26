<script setup lang="ts">
import { toRef } from 'vue';

// HeaderBanner component - Massgate-style banner above navigation
const props = defineProps<{
  showPlayersButton?: boolean;
  playerCount?: number;
}>();

const showPlayersButton = toRef(props, 'showPlayersButton');
const playerCount = toRef(props, 'playerCount');

const emit = defineEmits<{
  'toggle-players': [];
}>();

function togglePlayers() {
  emit('toggle-players');
}
</script>

<template>
  <div class="header-banner">
    <div class="banner-background">
      <!-- Placeholder for future military/tank background image -->
      <div class="banner-placeholder"></div>

      <!-- Logo and players button positioned in banner -->
      <div class="banner-content container">
        <div class="banner-logo">
          <div class="logo-main">WICGATE</div>
          <div class="logo-subtitle">Community Hosted Multiplayer</div>
        </div>

        <!-- Players button on right side -->
        <div v-if="showPlayersButton" class="banner-players">
          <button class="players-btn-banner" @click="togglePlayers">
            <span class="p-count">{{ playerCount || 0 }}</span>
            <span class="p-divider" />
            <span class="p-label">Players Online</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles for banner positioning - main styles in banner.css module */
</style>
