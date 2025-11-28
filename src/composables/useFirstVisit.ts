import { ref } from 'vue';
import { getItem, setItem, removeItem } from '../utils/storage';

const FIRST_VISIT_KEY = 'wicgate_visited';

// Shared state for global reset functionality
const showFirstVisitOverlay = ref(false);
let triggerOverlay: (() => void) | null = null;

export function useFirstVisit() {
  function checkFirstVisit(): boolean {
    if (typeof window === 'undefined') return false;

    const hasVisited = getItem(FIRST_VISIT_KEY);
    return !hasVisited;
  }

  function markAsVisited() {
    if (typeof window !== 'undefined') {
      setItem(FIRST_VISIT_KEY, 'true');
    }
  }

  function shouldShowOverlay(): boolean {
    // Show overlay on first visit to provide onboarding
    return checkFirstVisit();
  }

  function initFirstVisitCheck() {
    if (shouldShowOverlay()) {
      showFirstVisitOverlay.value = true;
    }
    // Register trigger for global reset
    triggerOverlay = () => {
      showFirstVisitOverlay.value = true;
    };
  }

  function dismissOverlay() {
    showFirstVisitOverlay.value = false;
    markAsVisited();
  }

  function openPrimer() {
    showFirstVisitOverlay.value = true;
  }

  return {
    showFirstVisitOverlay,
    checkFirstVisit,
    markAsVisited,
    shouldShowOverlay,
    initFirstVisitCheck,
    dismissOverlay,
    openPrimer,
  };
}

// Expose global reset function for non-production environments
if (typeof window !== 'undefined' && !import.meta.env.PROD) {
  (window as unknown as { resetFirstVisit: () => void }).resetFirstVisit = () => {
    removeItem(FIRST_VISIT_KEY);
    if (triggerOverlay) {
      triggerOverlay();
      console.log('First visit reset! Overlay triggered.');
    } else {
      console.log('First visit reset! Reload the page to see the overlay.');
    }
  };
}
