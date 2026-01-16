import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { formatDate, getCountdown as getCountdownUtil } from '../utils';
import { EVENT_COUNTDOWN_INTERVAL } from '../constants';
import type { CommunityEvent } from '../api-types';

export interface CalendarDay {
  date: string; // 'YYYY-MM-DD'
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  isPast: boolean;
}

const API = import.meta.env.VITE_API_BASE || 'https://www.wicgate.com/api';

export const useCalendarStore = defineStore('calendar', () => {
  // Current displayed month (year, month index 0-11)
  const currentYear = ref(new Date().getFullYear());
  const currentMonth = ref(new Date().getMonth());

  // Selected date with events (null = none selected)
  const selectedDate = ref<string | null>(null);

  // Events data and loading state
  const events = ref<CommunityEvent[]>([]);
  const isLoading = ref(true);

  // Reactive now for countdown calculations
  const now = ref(new Date());
  let timer: number | undefined;

  // Fetch events from API
  async function fetchEvents() {
    if (import.meta.server) {
      isLoading.value = false;
      return;
    }

    try {
      const url = API + (import.meta.env.MODE === 'production' ? '/events' : '/events-test');
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: CommunityEvent[] = await response.json();

      // Sort by date ascending
      events.value = data.sort((a, b) => {
        const dateA = new Date(a.start).getTime();
        const dateB = new Date(b.start).getTime();
        return dateA - dateB;
      });

      if (import.meta.env.DEV) console.log(`Fetched ${events.value.length} events from ${url}`);
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Failed to fetch events:', message, err);
      }
    } finally {
      isLoading.value = false;
    }
  }

  // Start/stop countdown timer based on events
  function startTimer() {
    if (typeof window === 'undefined' || timer !== undefined) return;
    timer = window.setInterval(() => {
      now.value = new Date();
    }, EVENT_COUNTDOWN_INTERVAL);
  }

  function stopTimer() {
    if (timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  }

  // Watch events to manage timer lifecycle
  watch(
    events,
    (newEvents) => {
      if (newEvents.length > 0) {
        startTimer();
      } else {
        stopTimer();
      }
    },
    { immediate: true }
  );

  // Countdown helper that uses reactive now
  function getCountdown(raw: string): string {
    return getCountdownUtil(raw, now.value);
  }

  // Auto-fetch on store creation
  fetchEvents();

  // Computed: Get events grouped by date
  const eventsByDate = computed(() => {
    const map = new Map<string, CommunityEvent[]>();
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    events.value.forEach((event) => {
      // Convert to local timezone before extracting date (fixes timezone mismatch with MediaEventCard)
      const eventDate = new Date(event.start);
      const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;

      // Add to original date
      const existing = map.get(dateKey);
      if (existing) {
        existing.push(event);
      } else {
        map.set(dateKey, [event]);
      }

      // If event has started (LIVE NOW), also add to today's date
      if (eventDate.getTime() < now.getTime() && dateKey !== todayKey) {
        const todayEvents = map.get(todayKey);
        if (todayEvents) {
          if (!todayEvents.includes(event)) todayEvents.push(event);
        } else {
          map.set(todayKey, [event]);
        }
      }
    });
    return map;
  });

  // Computed: Events for selected date
  const selectedDateEvents = computed(() => {
    if (!selectedDate.value) return [];
    return eventsByDate.value.get(selectedDate.value) || [];
  });

  // Computed: Check if can navigate to previous month (allow navigating to earliest event)
  const canGoPrevious = computed(() => {
    const firstEvent = events.value[0];
    if (!firstEvent) return false;
    // Find earliest event date (events are sorted ascending)
    const earliestEvent = new Date(firstEvent.start);
    const earliestMonthStart = new Date(earliestEvent.getFullYear(), earliestEvent.getMonth(), 1);
    const displayedMonthStart = new Date(currentYear.value, currentMonth.value, 1);
    return displayedMonthStart > earliestMonthStart;
  });

  // Computed: Days in current month with metadata
  const calendarDays = computed<CalendarDay[]>(() => {
    const year = currentYear.value;
    const month = currentMonth.value;

    // First day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust for Monday start (Sunday becomes 6, Monday becomes 0)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Days in previous month (for filling first row)
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Previous month days (grayed out)
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        day: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        hasEvents: eventsByDate.value.has(dateStr),
        isPast: dateStr < todayStr,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        day: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        hasEvents: eventsByDate.value.has(dateStr),
        isPast: dateStr < todayStr,
      });
    }

    // Next month days (fill to complete 6 rows = 42 cells)
    const remainingDays = 42 - days.length;
    for (let d = 1; d <= remainingDays; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        date: dateStr,
        day: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        hasEvents: eventsByDate.value.has(dateStr),
        isPast: dateStr < todayStr,
      });
    }

    return days;
  });

  // Computed: Month display name
  const monthDisplayName = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  // Actions
  function goToNextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value++;
    } else {
      currentMonth.value++;
    }
    selectedDate.value = null; // Clear selection on month change
  }

  function goToPreviousMonth() {
    if (!canGoPrevious.value) return;
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value--;
    } else {
      currentMonth.value--;
    }
    selectedDate.value = null;
  }

  function selectDate(dateStr: string | null) {
    // Toggle selection if clicking same date
    if (selectedDate.value === dateStr) {
      selectedDate.value = null;
    } else {
      selectedDate.value = dateStr;
    }
  }

  return {
    // State
    currentYear,
    currentMonth,
    selectedDate,
    events,
    isLoading,
    // Computed
    eventsByDate,
    selectedDateEvents,
    canGoPrevious,
    calendarDays,
    monthDisplayName,
    // Actions
    goToNextMonth,
    goToPreviousMonth,
    selectDate,
    fetchEvents,
    // Helpers
    getCountdown,
    formatDate,
  };
});
