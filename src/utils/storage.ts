/**
 * Safe localStorage wrapper with error handling
 * Handles private browsing mode, storage quota exceeded, and other edge cases
 */

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
