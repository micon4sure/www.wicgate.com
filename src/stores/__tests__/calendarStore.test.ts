import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCalendarStore } from '../calendarStore';
import type { CommunityEvent } from '../../api-types';

// Mock event data
const mockEvents: CommunityEvent[] = [
  {
    id: 1,
    name: 'Past Event',
    description: 'An event from yesterday',
    start: '2025-01-13T18:00:00Z',
  },
  {
    id: 2,
    name: 'Future Event',
    description: 'An upcoming event',
    start: '2025-01-20T20:00:00Z',
    link: 'https://discord.gg/example',
  },
  {
    id: 3,
    name: 'Far Future Event',
    description: 'Event next month',
    start: '2025-02-15T19:00:00Z',
    coverUrl: 'https://example.com/cover.jpg',
  },
];

// Helper to mock successful fetch
function mockSuccessfulFetch(events: CommunityEvent[] = mockEvents) {
  vi.mocked(global.fetch).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(events),
  } as Response);
}

describe('calendarStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-14T12:00:00Z'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have current year and month on initialization', () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();

      expect(store.currentYear).toBe(2025);
      expect(store.currentMonth).toBe(0); // January = 0
    });

    it('should start with empty events and loading true', () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();

      expect(store.events).toEqual([]);
      expect(store.isLoading).toBe(true);
    });

    it('should have no selected date initially', () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();

      expect(store.selectedDate).toBeNull();
    });
  });

  describe('fetchEvents', () => {
    it('should fetch and sort events by date ascending', async () => {
      // Return events in wrong order to test sorting
      const unsortedEvents = [mockEvents[2]!, mockEvents[0]!, mockEvents[1]!];
      mockSuccessfulFetch(unsortedEvents);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.events).toHaveLength(3);
      // Should be sorted by date ascending
      expect(store.events[0]?.name).toBe('Past Event');
      expect(store.events[1]?.name).toBe('Future Event');
      expect(store.events[2]?.name).toBe('Far Future Event');
      expect(store.isLoading).toBe(false);
    });

    it('should set loading to false after fetch completes', async () => {
      mockSuccessfulFetch();
      const store = useCalendarStore();

      expect(store.isLoading).toBe(true);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.isLoading).toBe(false);
    });

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.events).toEqual([]);
      expect(store.isLoading).toBe(false);
    });

    it('should handle non-ok HTTP response', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.events).toEqual([]);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('eventsByDate', () => {
    it('should group events by their date', async () => {
      mockSuccessfulFetch();
      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      const eventMap = store.eventsByDate;

      // Check that events are grouped by date
      expect(eventMap.size).toBeGreaterThan(0);
    });

    it('should add past events to today date (LIVE NOW behavior)', async () => {
      // Create an event that started yesterday (should show on today too)
      const pastEvent: CommunityEvent = {
        id: 100,
        name: 'Live Event',
        description: 'Started yesterday',
        start: '2025-01-13T10:00:00Z', // Yesterday
      };
      mockSuccessfulFetch([pastEvent]);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      const eventMap = store.eventsByDate;

      // Event should appear on its original date AND today
      expect(eventMap.get('2025-01-13')).toBeDefined();
      expect(eventMap.get('2025-01-14')).toBeDefined(); // Today
      expect(eventMap.get('2025-01-14')?.[0]?.name).toBe('Live Event');
    });

    it('should not duplicate events on today if already on today', async () => {
      // Event that is today
      const todayEvent: CommunityEvent = {
        id: 101,
        name: 'Today Event',
        description: 'Happening today',
        start: '2025-01-14T08:00:00Z', // Earlier today (past)
      };
      mockSuccessfulFetch([todayEvent]);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      const todayEvents = store.eventsByDate.get('2025-01-14');
      expect(todayEvents).toHaveLength(1); // Should not be duplicated
    });
  });

  describe('selectedDateEvents', () => {
    it('should return empty array when no date selected', async () => {
      mockSuccessfulFetch();
      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.selectedDateEvents).toEqual([]);
    });

    it('should return events for selected date', async () => {
      const event: CommunityEvent = {
        id: 102,
        name: 'Test Event',
        description: 'Test',
        start: '2025-01-20T18:00:00Z',
      };
      mockSuccessfulFetch([event]);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      store.selectDate('2025-01-20');
      expect(store.selectedDateEvents).toHaveLength(1);
      expect(store.selectedDateEvents[0]?.name).toBe('Test Event');
    });
  });

  describe('canGoPrevious', () => {
    it('should return false when no events', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.canGoPrevious).toBe(false);
    });

    it('should return false when earliest event is in current month', async () => {
      const event: CommunityEvent = {
        id: 103,
        name: 'Current Month Event',
        description: 'Test',
        start: '2025-01-20T18:00:00Z',
      };
      mockSuccessfulFetch([event]);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      // Currently viewing January 2025, event is also in January
      expect(store.canGoPrevious).toBe(false);
    });

    it('should return true when earliest event is in previous month', async () => {
      const event: CommunityEvent = {
        id: 104,
        name: 'Past Month Event',
        description: 'Test',
        start: '2024-12-15T18:00:00Z', // December 2024
      };
      mockSuccessfulFetch([event]);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      // Currently viewing January 2025, event is in December 2024
      expect(store.canGoPrevious).toBe(true);
    });
  });

  describe('calendarDays', () => {
    it('should generate 42 days (6 weeks)', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      expect(store.calendarDays).toHaveLength(42);
    });

    it('should mark current month days correctly', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      // January 2025 has 31 days
      const currentMonthDays = store.calendarDays.filter((d) => d.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(31);
    });

    it('should mark today correctly', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      const todayDays = store.calendarDays.filter((d) => d.isToday);
      expect(todayDays).toHaveLength(1);
      expect(todayDays[0]?.date).toBe('2025-01-14');
    });

    it('should mark days with events', async () => {
      const event: CommunityEvent = {
        id: 105,
        name: 'Event',
        description: 'Test',
        start: '2025-01-20T18:00:00Z',
      };
      mockSuccessfulFetch([event]);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      const day20 = store.calendarDays.find((d) => d.date === '2025-01-20');
      expect(day20?.hasEvents).toBe(true);
    });
  });

  describe('monthDisplayName', () => {
    it('should return formatted month name', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();

      expect(store.monthDisplayName).toBe('January 2025');
    });
  });

  describe('navigation', () => {
    it('goToNextMonth should increment month', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();

      store.goToNextMonth();

      expect(store.currentMonth).toBe(1); // February
      expect(store.currentYear).toBe(2025);
    });

    it('goToNextMonth should wrap to next year', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();
      store.currentMonth = 11; // December

      store.goToNextMonth();

      expect(store.currentMonth).toBe(0); // January
      expect(store.currentYear).toBe(2026);
    });

    it('goToNextMonth should clear selected date', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();
      store.selectedDate = '2025-01-14';

      store.goToNextMonth();

      expect(store.selectedDate).toBeNull();
    });

    it('goToPreviousMonth should decrement month when allowed', async () => {
      const event: CommunityEvent = {
        id: 106,
        name: 'Past Event',
        description: 'Test',
        start: '2024-12-15T18:00:00Z',
      };
      mockSuccessfulFetch([event]);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      store.goToPreviousMonth();

      expect(store.currentMonth).toBe(11); // December
      expect(store.currentYear).toBe(2024);
    });

    it('goToPreviousMonth should not go back when not allowed', async () => {
      mockSuccessfulFetch([]); // No events = canGoPrevious is false

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);

      store.goToPreviousMonth();

      expect(store.currentMonth).toBe(0); // Still January
      expect(store.currentYear).toBe(2025);
    });

    it('goToPreviousMonth should wrap to previous year', async () => {
      const event: CommunityEvent = {
        id: 107,
        name: 'Old Event',
        description: 'Test',
        start: '2024-06-15T18:00:00Z', // June 2024
      };
      mockSuccessfulFetch([event]);

      const store = useCalendarStore();
      await vi.advanceTimersByTimeAsync(0);
      store.currentMonth = 0; // January

      store.goToPreviousMonth();

      expect(store.currentMonth).toBe(11); // December
      expect(store.currentYear).toBe(2024);
    });
  });

  describe('selectDate', () => {
    it('should select a date', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();

      store.selectDate('2025-01-20');

      expect(store.selectedDate).toBe('2025-01-20');
    });

    it('should toggle selection when clicking same date', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();

      store.selectDate('2025-01-20');
      expect(store.selectedDate).toBe('2025-01-20');

      store.selectDate('2025-01-20');
      expect(store.selectedDate).toBeNull();
    });

    it('should change selection when clicking different date', async () => {
      mockSuccessfulFetch([]);
      const store = useCalendarStore();

      store.selectDate('2025-01-20');
      store.selectDate('2025-01-21');

      expect(store.selectedDate).toBe('2025-01-21');
    });
  });
});
