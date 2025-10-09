/**
 * Safe localStorage wrapper with error handling
 * Handles private browsing mode, storage quota exceeded, and other edge cases
 */

import { STORAGE_KEYS } from '../constants';

// Type for valid storage keys
type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Safely get an item from localStorage
 * @param key - The storage key
 * @param defaultValue - Value to return if retrieval fails
 * @returns The stored value or defaultValue
 */
export function getItem(key: string, defaultValue: string | null = null): string | null {
  if (typeof window === 'undefined') return defaultValue;

  try {
    return localStorage.getItem(key);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[Storage] Failed to get item '${key}':`, error);
    }
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 * @param key - The storage key
 * @param value - The value to store
 * @returns true if successful, false otherwise
 */
export function setItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[Storage] Failed to set item '${key}':`, error);
    }
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param key - The storage key
 * @returns true if successful, false otherwise
 */
export function removeItem(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[Storage] Failed to remove item '${key}':`, error);
    }
    return false;
  }
}

/**
 * Check if localStorage is available and working
 * @returns true if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Typed Storage Helpers
// ============================================================================

/**
 * Get a boolean value from localStorage with type safety
 * @param key - Storage key (must be from STORAGE_KEYS)
 * @param defaultValue - Default boolean value
 * @returns Boolean value from storage or default
 *
 * @example
 * ```typescript
 * const isExpanded = getBoolean(STORAGE_KEYS.ADVANCED_SETUP_EXPANDED, false);
 * ```
 */
export function getBoolean(key: StorageKey, defaultValue: boolean): boolean {
  const value = getItem(key);
  if (value === null) return defaultValue;
  return value === '1' || value === 'true';
}

/**
 * Set a boolean value in localStorage with type safety
 * @param key - Storage key (must be from STORAGE_KEYS)
 * @param value - Boolean value to store
 * @returns True if successful
 *
 * @example
 * ```typescript
 * setBoolean(STORAGE_KEYS.ADVANCED_SETUP_EXPANDED, true);
 * ```
 */
export function setBoolean(key: StorageKey, value: boolean): boolean {
  return setItem(key, value ? '1' : '0');
}

/**
 * Get a number value from localStorage with type safety
 * @param key - Storage key (must be from STORAGE_KEYS)
 * @param defaultValue - Default number value
 * @returns Number value from storage or default
 */
export function getNumber(key: StorageKey, defaultValue: number): number {
  const value = getItem(key);
  if (value === null) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Set a number value in localStorage with type safety
 * @param key - Storage key (must be from STORAGE_KEYS)
 * @param value - Number value to store
 * @returns True if successful
 */
export function setNumber(key: StorageKey, value: number): boolean {
  return setItem(key, String(value));
}

/**
 * Get a JSON object from localStorage with type safety
 * @param key - Storage key (must be from STORAGE_KEYS)
 * @param defaultValue - Default object value
 * @returns Parsed object from storage or default
 */
export function getJSON<T>(key: StorageKey, defaultValue: T): T {
  const value = getItem(key);
  if (value === null) return defaultValue;

  try {
    return JSON.parse(value) as T;
  } catch {
    if (import.meta.env.DEV) {
      console.warn(`[Storage] Failed to parse JSON for key '${key}'`);
    }
    return defaultValue;
  }
}

/**
 * Set a JSON object in localStorage with type safety
 * @param key - Storage key (must be from STORAGE_KEYS)
 * @param value - Object value to store
 * @returns True if successful
 */
export function setJSON<T>(key: StorageKey, value: T): boolean {
  try {
    return setItem(key, JSON.stringify(value));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(`[Storage] Failed to stringify value for key '${key}':`, error);
    }
    return false;
  }
}

/**
 * Type-safe remove function that only accepts valid storage keys
 * @param key - Storage key (must be from STORAGE_KEYS)
 * @returns True if successful
 */
export function removeTyped(key: StorageKey): boolean {
  return removeItem(key);
}
