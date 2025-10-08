<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  playerCount: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();

// Format player count with animation-friendly display
const displayCount = computed(() => props.playerCount || 0);

// Determine status text based on player count
const statusText = computed(() => {
  if (props.loading) return 'CHECKING STATUS...';
  if (displayCount.value === 0) return 'NO PLAYERS ONLINE';
  if (displayCount.value === 1) return 'PLAYER ONLINE NOW';
  return 'PLAYERS ONLINE NOW';
});

// Show pulsing dot only when players are online
const isActive = computed(() => !props.loading && displayCount.value > 0);
</script>

<template>
  <div class="live-badge" :class="{ loading, active: isActive }" @click="emit('click')">
    <div class="badge-status">
      <span class="status-indicator" :class="{ pulse: isActive }"></span>
      <span class="player-count">{{ displayCount }}</span>
      <span class="status-text">{{ statusText }}</span>
    </div>
    <div v-if="!loading" class="badge-cta">
      <span>View Live Servers</span>
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </div>
  </div>
</template>

<style scoped>
.live-badge {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 24px;
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.85) 0%,
    rgba(var(--panel-dark-rgb), 0.9) 100%
  );
  border: 2px solid rgba(var(--sw-rgb), 0.4);
  border-radius: 0;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 20px rgba(var(--sw-rgb), 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  max-width: 400px;
  width: 100%;
}

.live-badge.loading {
  opacity: 0.6;
  cursor: default;
}

@media (hover: hover) {
  .live-badge:not(.loading):hover {
    transform: scale(1.02);
    border-color: rgba(var(--sw-rgb), 0.7);
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 30px rgba(var(--sw-rgb), 0.35);
  }
}

.live-badge:active {
  transform: scale(0.98);
}

.badge-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--t3);
  flex-shrink: 0;
  opacity: 0.5;
}

.status-indicator.pulse {
  background: var(--g);
  opacity: 1;
  box-shadow: 0 0 12px rgba(var(--g-rgb), 0.8);
  animation: syncPulse 2s ease-in-out infinite;
}

.player-count {
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--sw);
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(var(--sw-rgb), 0.4);
  line-height: 1;
  transition: transform 0.3s;
}

@media (hover: hover) {
  .live-badge:not(.loading):hover .player-count {
    transform: scale(1.05);
    text-shadow: 0 2px 12px rgba(var(--sw-rgb), 0.6);
  }
}

.status-text {
  font-family: 'Oswald', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--t2);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  line-height: 1;
}

.live-badge.loading .status-text {
  color: var(--t3);
}

.badge-cta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--sw);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  padding-left: 22px; /* Align with text after dot */
}

@media (hover: hover) {
  .live-badge:not(.loading):hover .badge-cta {
    gap: 12px;
    color: var(--t);
  }
}

.badge-cta i {
  font-size: 0.875rem;
  transition: transform 0.2s;
}

@media (hover: hover) {
  .live-badge:not(.loading):hover .badge-cta i {
    transform: translateX(4px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .live-badge {
    padding: 14px 20px;
    max-width: 100%;
  }

  .player-count {
    font-size: 1.75rem;
  }

  .status-text {
    font-size: 0.8rem;
  }

  .badge-cta {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .live-badge {
    padding: 12px 16px;
  }

  .player-count {
    font-size: 1.5rem;
  }

  .status-text {
    font-size: 0.75rem;
    letter-spacing: 1px;
  }

  .badge-cta {
    font-size: 0.8rem;
    padding-left: 20px;
  }

  .badge-status {
    gap: 10px;
  }
}
</style>
