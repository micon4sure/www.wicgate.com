// Centralized utility functions for the WiCGate application
// This module consolidates common utilities to improve maintainability

// Re-export player display utilities
export {
  displayName,
  colorize,
  groupPlayersByServer,
  type PlayerProfile,
  type PlayerGroup,
} from './playerDisplay';

// FontAwesome configuration is imported in main.ts
// No need to re-export it from here

// Common date utilities
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Common time utilities
export const getCountdown = (targetDateString: string, currentDate: Date = new Date()): string => {
  const target = new Date(targetDateString).getTime();
  const diff = target - currentDate.getTime();

  if (diff <= 0) {
    return 'Event ongoing';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const parts: string[] = [];
  if (days) {
    parts.push(`${days}d`);
  }
  parts.push(`${String(hours).padStart(2, '0')}h`);
  parts.push(`${String(minutes).padStart(2, '0')}m`);
  parts.push(`${String(seconds).padStart(2, '0')}s`);

  return parts.join(' ');
};

// Common array utilities (to reduce lodash dependency)
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return array.slice().sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Common object utilities
export const mapValues = <T, U>(obj: Record<string, T>, fn: (value: T) => U): Record<string, U> => {
  const result: Record<string, U> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = fn(value);
  }
  return result;
};
