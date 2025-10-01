<script setup lang="ts">
import { computed } from 'vue';
import type { OnlineProfile, ServerEntry } from '../../api-types';

const props = withDefaults(
  defineProps<{
    players: OnlineProfile[];
    servers?: ServerEntry[];
    loading?: boolean;
    lastUpdated?: number | null;
  }>(),
  {
    players: () => [],
    servers: () => [],
    loading: false,
    lastUpdated: null,
  }
);

const emit = defineEmits<{ openPanel: [] }>();

const playerCount = computed(() => props.players.length);
const serverCount = computed(() => props.servers?.length ?? 0);
const lastUpdatedLabel = computed(() => {
  if (!props.lastUpdated) return 'Awaiting data';
  const diff = Date.now() - props.lastUpdated;
  if (diff < 60_000) return 'Updated just now';
  const minutes = Math.round(diff / 60000);
  return `Updated ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
});
</script>

<template>
  <section id="players" class="community-module mb-xl">
    <div class="vid-hdr">
      <h3>Online Players</h3>
      <button class="btn btn-p" type="button" @click="emit('openPanel')">View Live Panel</button>
    </div>

    <div class="players-summary">
      <div class="summary-card">
        <div class="summary-icon">
          <i class="fa-solid fa-users" aria-hidden="true"></i>
        </div>
        <div class="summary-content">
          <p class="summary-label">Players Online</p>
          <p class="summary-value">{{ loading ? '—' : playerCount }}</p>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">
          <i class="fa-solid fa-server" aria-hidden="true"></i>
        </div>
        <div class="summary-content">
          <p class="summary-label">Servers Active</p>
          <p class="summary-value">{{ loading ? '—' : serverCount }}</p>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-icon">
          <i class="fa-regular fa-clock" aria-hidden="true"></i>
        </div>
        <div class="summary-content">
          <p class="summary-label">Status</p>
          <p class="summary-value small">{{ lastUpdatedLabel }}</p>
        </div>
      </div>
    </div>

    <p class="summary-footnote text-muted">
      Population numbers update automatically every 90 seconds.
    </p>
  </section>
</template>

<style scoped>
.players-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.summary-card {
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.96) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  border: 1px solid var(--divider-strong);
  border-left: 3px solid rgba(var(--sw-rgb), 0.7);
  box-shadow:
    0 10px 24px rgba(var(--mg-rgb), 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(var(--sw-rgb), 0.92) 0%, rgba(var(--sw-rgb), 0.68) 100%);
  color: var(--ink);
  border: 2px solid rgba(var(--sw-rgb), 0.85);
  box-shadow:
    0 4px 18px rgba(var(--sw-rgb), 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-label {
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--t2);
  margin: 0;
}

.summary-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--t);
  margin: 0;
}

.summary-value.small {
  font-size: 1rem;
  color: var(--t2);
}

.summary-footnote {
  margin-top: 16px;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .summary-card {
    padding: 20px;
  }

  .summary-value {
    font-size: 1.6rem;
  }
}
</style>
