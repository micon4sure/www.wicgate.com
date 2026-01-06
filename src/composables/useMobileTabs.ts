import { ref, onMounted, onUnmounted } from 'vue';
import { SUB_TAB_BREAKPOINT } from '../constants';

/**
 * Composable for mobile tab dropdown behavior.
 * Provides breakpoint detection, dropdown state management, and click-outside/escape handling.
 * @param breakpoint - Custom breakpoint in pixels (default: SUB_TAB_BREAKPOINT 640px)
 */
export function useMobileTabs(breakpoint?: number) {
  const bp = breakpoint ?? SUB_TAB_BREAKPOINT;
  const dropdownOpen = ref(false);
  const isMobile = ref(false);
  const dropdownRef = ref<HTMLElement | null>(null);
  const triggerRef = ref<HTMLElement | null>(null);

  // Typed for ESLint compatibility (avoids 'MediaQueryList is not defined' error)
  let mediaQuery: {
    matches: boolean;
    addEventListener: (type: string, listener: (event: { matches: boolean }) => void) => void;
    removeEventListener: (type: string, listener: (event: { matches: boolean }) => void) => void;
  } | null = null;

  function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value;
  }

  function closeDropdown() {
    dropdownOpen.value = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    if (
      dropdownOpen.value &&
      dropdownRef.value &&
      triggerRef.value &&
      !dropdownRef.value.contains(target) &&
      !triggerRef.value.contains(target)
    ) {
      closeDropdown();
    }
  }

  function handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && dropdownOpen.value) {
      closeDropdown();
    }
  }

  function handleMediaChange(event: { matches: boolean }) {
    isMobile.value = !event.matches;
    // Close dropdown when switching to desktop
    if (!isMobile.value) {
      closeDropdown();
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return;

    // Setup media query listener
    mediaQuery = window.matchMedia(`(min-width: ${bp}px)`);
    isMobile.value = !mediaQuery.matches;
    mediaQuery.addEventListener('change', handleMediaChange);

    // Setup click outside and escape key listeners
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
  });

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleMediaChange);
    }
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleEscapeKey);
  });

  return {
    isMobile,
    dropdownOpen,
    dropdownRef,
    triggerRef,
    toggleDropdown,
    closeDropdown,
  };
}
