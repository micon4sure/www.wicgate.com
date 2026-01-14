import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { CommunityEvent } from '../api-types';

export interface CalendarDay {
  date: string; // 'YYYY-MM-DD'
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  isPast: boolean;
}

export const useCalendarStore = defineStore('calendar', () => {
  // Current displayed month (year, month index 0-11)
  const currentYear = ref(new Date().getFullYear());
  const currentMonth = ref(new Date().getMonth());

  // Selected date with events (null = none selected)
  const selectedDate = ref<string | null>(null);

  // Events data (synced from useEvents composable)
  const events = ref<CommunityEvent[]>([]);

  // Computed: Get events grouped by date
  const eventsByDate = computed(() => {
    const map = new Map<string, CommunityEvent[]>();
    events.value.forEach((event) => {
      // Extract date portion from ISO string (e.g., '2025-10-10T12:00:00Z' -> '2025-10-10')
      const dateKey = event.start.slice(0, 10);
      const existing = map.get(dateKey);
      if (existing) {
        existing.push(event);
      } else {
        map.set(dateKey, [event]);
      }
    });
    return map;
  });

  // Computed: Events for selected date
  const selectedDateEvents = computed(() => {
    if (!selectedDate.value) return [];
    return eventsByDate.value.get(selectedDate.value) || [];
  });

  // Computed: Check if can navigate to previous month (not before current month)
  const canGoPrevious = computed(() => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const displayedMonthStart = new Date(currentYear.value, currentMonth.value, 1);
    return displayedMonthStart > currentMonthStart;
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

  function setEvents(newEvents: CommunityEvent[]) {
    events.value = newEvents;
  }

  return {
    currentYear,
    currentMonth,
    selectedDate,
    events,
    eventsByDate,
    selectedDateEvents,
    canGoPrevious,
    calendarDays,
    monthDisplayName,
    goToNextMonth,
    goToPreviousMonth,
    selectDate,
    setEvents,
  };
});
