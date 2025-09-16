import { ref } from 'vue';

const FIRST_VISIT_KEY = 'wicgate_visited';

export function useFirstVisit() {
  const showFirstVisitOverlay = ref(false);

  function checkFirstVisit(): boolean {
    if (typeof window === 'undefined') return false;

    const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
    return !hasVisited;
  }

  function markAsVisited() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FIRST_VISIT_KEY, 'true');
    }
  }

  function shouldShowOverlay(hasHash: boolean): boolean {
    // Show overlay only if:
    // 1. It's a first visit AND
    // 2. There's a hash in URL (deep link) OR user has auto game mode preference
    return checkFirstVisit() && hasHash;
  }

  function initFirstVisitCheck(hasHashOrAutoMode: boolean) {
    if (shouldShowOverlay(hasHashOrAutoMode)) {
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
