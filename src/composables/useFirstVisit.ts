import { ref } from 'vue';
import { getItem, setItem } from '../utils/storage';

const FIRST_VISIT_KEY = 'wicgate_visited';

export function useFirstVisit() {
  const showFirstVisitOverlay = ref(false);

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
  }

  function dismissOverlay() {
    showFirstVisitOverlay.value = false;
    markAsVisited();
  }

  return {
    showFirstVisitOverlay,
    checkFirstVisit,
    markAsVisited,
    shouldShowOverlay,
    initFirstVisitCheck,
    dismissOverlay,
  };
}
