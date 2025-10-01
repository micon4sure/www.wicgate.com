<script setup lang="ts">
import { computed } from 'vue';
import { useEvents } from '../../composables/useEvents';
import EventsSkeleton from '../skeletons/EventsSkeleton.vue';

defineProps<{ heading?: string; subheading?: string }>();

const { events, isLoading, formatDate, getCountdown } = useEvents();
const isSSR = import.meta.env.SSR;

const showSkeleton = computed(() => isSSR || isLoading.value);
const hasEvents = computed(() => !showSkeleton.value && events.value.length > 0);
</script>

<template>
  <section id="events" class="community-module mb-xl">
    <div class="vid-hdr">
      <h3>{{ heading || 'Events' }}</h3>
      <p v-if="subheading" class="section-lead" style="margin: 0; font-size: 0.9rem">
        {{ subheading }}
      </p>
    </div>

    <EventsSkeleton v-if="showSkeleton" />

    <template v-else>
      <div v-if="hasEvents" class="events-container">
        <div class="events-grid">
          <component :is="event.link ? 'a' : 'div'" v-for="event in events" :key="event.id" :href="event.link"
            target="_blank" class="event-card">
            <div v-if="event.coverUrl" class="event-image" :style="{ backgroundImage: `url(${event.coverUrl})` }">
              <div class="event-image-overlay"></div>
              <div v-if="new Date(event.start).getTime() <= Date.now()" class="event-status live">
                <span class="status-text">LIVE NOW</span>
              </div>
              <div v-else class="event-status">
                <span class="status-text">{{ getCountdown(event.start) }}</span>
              </div>
            </div>
            <div class="event-content" :class="{ 'no-image': !event.coverUrl }">
              <div v-if="!event.coverUrl && new Date(event.start).getTime() <= Date.now()" class="event-status live">
                <span class="status-text">LIVE NOW</span>
              </div>
              <div v-else-if="!event.coverUrl" class="event-status">
                <span class="status-text">{{ getCountdown(event.start) }}</span>
              </div>
              <h4 class="event-title">{{ event.name }}</h4>
              <p class="event-desc">{{ event.description }}</p>
              <div class="event-meta">
                <span class="event-date">
                  <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                  {{ formatDate(event.start) }}
                </span>
                <span v-if="event.link" class="event-link-icon">
                  <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
            </div>
          </component>
        </div>
      </div>
      <div v-else class="events-empty">
        <i class="fa-regular fa-calendar-xmark" aria-hidden="true"></i>
        <p>No events scheduled at the moment</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.community-module {
  width: 100%;
}
</style>
