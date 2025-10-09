<script setup lang="ts">
import { computed } from 'vue';
import WidgetBase from './WidgetBase.vue';
import type { CommunityEvent } from '../../api-types';

const props = defineProps<{
  events: CommunityEvent[];
}>();

const emit = defineEmits<{
  navigate: [section: string];
}>();

const nextEvent = computed(() => {
  if (!props.events || props.events.length === 0) return null;
  const upcoming = props.events.find((e) => new Date(e.start).getTime() > Date.now());
  return upcoming || props.events[0];
});

function handleClick() {
  emit('navigate', 'community-events');
}
</script>

<template>
  <WidgetBase
    title="Community"
    icon="fa-brands fa-discord"
    action="Explore"
    icon-class="widget-icon-discord"
    @click="handleClick"
  >
    <div class="widget-stat">
      <span class="stat-number">287</span>
      <span class="stat-label">Discord Members</span>
    </div>
    <div v-if="nextEvent" class="widget-highlight">
      <i class="fa-regular fa-calendar" aria-hidden="true"></i>
      <span>{{ nextEvent.name }}</span>
    </div>
    <div v-else class="widget-desc">Join our active community</div>
  </WidgetBase>
</template>
