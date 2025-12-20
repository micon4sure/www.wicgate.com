import { ref, readonly } from 'vue';

// Module-level state shared across all components
const overlayActive = ref(false);

export function useOverlayState() {
  function setOverlayActive(active: boolean) {
    overlayActive.value = active;
  }

  return {
    overlayActive: readonly(overlayActive),
    setOverlayActive,
  };
}
