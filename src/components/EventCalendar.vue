<script setup lang="ts">
import { computed, ref, inject, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '../stores/calendarStore';
import type { CalendarDay } from '../stores/calendarStore';
import EventCalendarSkeleton from './skeletons/EventCalendarSkeleton.vue';

// Base path for GitHub Pages deployment
const appBase = inject<string>('appBase', '/');

// Track active timeouts for cleanup
const activeTimeouts = new Set<ReturnType<typeof setTimeout>>();

function trackTimeout(fn: () => void, delay: number): ReturnType<typeof setTimeout> {
  const id = setTimeout(() => {
    activeTimeouts.delete(id);
    fn();
  }, delay);
  activeTimeouts.add(id);
  return id;
}

// Clean up on unmount
onBeforeUnmount(() => {
  activeTimeouts.forEach((id) => clearTimeout(id));
  activeTimeouts.clear();
});

// Copy link state
const copied = ref(false);
const showCopiedToast = ref(false);

// Copy link to clipboard
function copyLink() {
  if (typeof window === 'undefined' || !navigator.clipboard) return;

  const url = `${window.location.origin}${appBase}community#events`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      copied.value = true;
      showCopiedToast.value = true;

      trackTimeout(() => {
        showCopiedToast.value = false;
        trackTimeout(() => {
          copied.value = false;
        }, 300);
      }, 2000);
    })
    .catch((err: unknown) => {
      // Clipboard permission denied or other error - fail silently
      if (import.meta.env.DEV) {
        console.warn('Failed to copy link to clipboard:', err);
      }
    });
}

// Calendar store (single source of truth for events)
const calendarStore = useCalendarStore();
const {
  isLoading,
  monthDisplayName,
  calendarDays,
  selectedDate,
  selectedDateEvents,
  canGoPrevious,
} = storeToRefs(calendarStore);

// Weekday labels (Monday first)
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Format time for display
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Format selected date for header
const selectedDateFormatted = computed(() => {
  if (!selectedDate.value) return '';
  const date = new Date(selectedDate.value + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
});

// Handle day click
function handleDayClick(day: CalendarDay) {
  if (!day.hasEvents) return;
  calendarStore.selectDate(day.date);
}

// Get day cell classes
function getDayClasses(day: CalendarDay) {
  return [
    'calendar-day',
    {
      'calendar-day-other': !day.isCurrentMonth,
      'calendar-day-past': day.isPast && !day.isToday,
      'calendar-day-today': day.isToday,
      'calendar-day-event': day.hasEvents,
      'calendar-day-selected': selectedDate.value === day.date,
      'cursor-default': !day.hasEvents,
    },
  ];
}
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <EventCalendarSkeleton />
    </template>
    <EventCalendarSkeleton v-if="isLoading" />
    <div v-else class="calendar-card">
      <!-- Calendar Header -->
      <div class="calendar-header group">
        <button
          type="button"
          class="calendar-nav-btn"
          :disabled="!canGoPrevious"
          aria-label="Previous month"
          @click="calendarStore.goToPreviousMonth()"
        >
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>

        <div class="flex items-center gap-2">
          <h3 class="calendar-header-title">{{ monthDisplayName }}</h3>
          <span
            role="button"
            tabindex="0"
            class="lb-copy-link-btn"
            :class="copied ? 'is-copied' : ''"
            title="Copy link to Events"
            aria-label="Copy link to Events calendar"
            @click="copyLink"
            @keydown.enter.prevent="copyLink"
            @keydown.space.prevent="copyLink"
          >
            <i
              class="text-sm transition-all duration-200"
              :class="copied ? 'fa-solid fa-check' : 'fa-solid fa-link'"
              aria-hidden="true"
            ></i>
          </span>
        </div>

        <button
          type="button"
          class="calendar-nav-btn"
          aria-label="Next month"
          @click="calendarStore.goToNextMonth()"
        >
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="calendar-weekday">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <button
          v-for="day in calendarDays"
          :key="day.date"
          type="button"
          :class="getDayClasses(day)"
          :aria-label="`${day.day}${day.hasEvents ? ', has events' : ''}`"
          :aria-pressed="selectedDate === day.date"
          @click="handleDayClick(day)"
        >
          <span class="calendar-day-num">{{ day.day }}</span>
        </button>
      </div>

      <!-- Events Panel (shown when date selected) -->
      <div v-if="selectedDate && selectedDateEvents.length > 0" class="calendar-events-panel">
        <div class="calendar-events-header">
          <i class="fa-regular fa-calendar text-soviet" aria-hidden="true"></i>
          <span class="calendar-events-date">{{ selectedDateFormatted }}</span>
          <button
            type="button"
            class="ml-auto overlay-close text-data"
            aria-label="Close events panel"
            @click="calendarStore.selectDate(null)"
          >
            <i class="fa-solid fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div class="calendar-events-list">
          <component
            :is="event.link ? 'a' : 'div'"
            v-for="event in selectedDateEvents"
            :key="event.id"
            :href="event.link || undefined"
            :target="event.link ? '_blank' : undefined"
            :rel="event.link ? 'noopener noreferrer' : undefined"
            class="calendar-event-item"
          >
            <div class="flex items-start justify-between gap-4">
              <h4 class="calendar-event-name">{{ event.name }}</h4>
              <span class="calendar-event-time shrink-0">{{ formatTime(event.start) }}</span>
            </div>
            <p v-if="event.description" class="calendar-event-desc">
              {{ event.description }}
            </p>
          </component>
        </div>
      </div>
    </div>
  </ClientOnly>

  <!-- Toast notification for copy link -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-show="showCopiedToast"
      class="toast-notification"
      style="top: calc(var(--header-height) + 16px)"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-center gap-3">
        <i class="fa-solid fa-check text-dark-navy text-lg" aria-hidden="true"></i>
        <span class="text-dark-navy font-body font-semibold">Link copied to clipboard!</span>
      </div>
    </div>
  </transition>
</template>
