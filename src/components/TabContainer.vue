<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { trackEvent } from '../utils/analytics';

interface Tab {
  id: string; // The subsection ID (e.g., 'downloads-quick')
  label: string; // Display label (e.g., 'Quick Install')
  icon?: string; // Optional FontAwesome icon class
}

interface Props {
  tabs: Tab[];
  analyticsCategory?: string; // Category for analytics tracking (e.g., 'Downloads')
  ariaLabel?: string; // ARIA label for tablist
}

const props = withDefaults(defineProps<Props>(), {
  analyticsCategory: '',
  ariaLabel: 'Tab navigation',
});

const route = useRoute();

// Active tab - pure local state
const activeTabId = ref<string>(props.tabs[0]?.id || '');

// Initialize active tab from route or default to first tab (supports deep-linking)
onMounted(() => {
  const routeSubsection = route.meta.subsection as string | undefined;
  if (routeSubsection && props.tabs.some((t) => t.id === routeSubsection)) {
    activeTabId.value = routeSubsection;
  } else {
    activeTabId.value = props.tabs[0]?.id || '';
  }
});

// Watch route changes to sync active tab (supports deep-linking)
watch(
  () => route.meta.subsection,
  (newSubsection) => {
    if (newSubsection && typeof newSubsection === 'string') {
      const matchingTab = props.tabs.find((t) => t.id === newSubsection);
      if (matchingTab) {
        activeTabId.value = newSubsection;
      }
    }
  }
);

// Get route path for a tab
function getTabRoute(tabId: string): string {
  const section = route.meta.section as string;
  const baseRoute = `/${section}`;
  // Extract the subsection suffix (e.g., 'quick' from 'downloads-quick')
  const subsectionSuffix = tabId.replace(`${section}-`, '');
  return `${baseRoute}/${subsectionSuffix}`;
}

// Handle tab click
function switchTab(tab: Tab) {
  if (activeTabId.value === tab.id) return;

  activeTabId.value = tab.id;

  // Update URL for sharing/bookmarking without triggering Vue Router
  // Preserve Vue Router's internal state to avoid routing conflicts
  if (typeof window !== 'undefined') {
    const newUrl = getTabRoute(tab.id);
    window.history.replaceState(window.history.state, '', newUrl);
  }

  // Track analytics if category provided
  if (props.analyticsCategory) {
    trackEvent({
      category: props.analyticsCategory,
      action: 'Tab Switch',
      label: tab.label,
    });
  }
}

// Format label for display (capitalize first letter)
const formatLabel = (label: string): string => {
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// Generate ARIA IDs
const getTabId = (tabId: string) => `tab-${tabId}`;
// Use raw tabId for panel so router scrollBehavior can find it (e.g., 'downloads-quick')
const getPanelId = (tabId: string) => tabId;
</script>

<template>
  <div class="tab-container">
    <!-- Tab Navigation -->
    <div
      role="tablist"
      :aria-label="ariaLabel"
      class="flex bg-gradient-to-b from-[rgba(15,18,21,0.95)] to-[rgba(8,9,11,0.95)] relative border-t border-t-[rgba(var(--graphite-dark-rgb),0.6)]"
    >
      <button
        v-for="tab in tabs"
        :id="getTabId(tab.id)"
        :key="tab.id"
        role="tab"
        :aria-selected="activeTabId === tab.id"
        :aria-controls="getPanelId(tab.id)"
        :tabindex="activeTabId === tab.id ? 0 : -1"
        class="flex-1 p-[12px_16px] border border-[rgba(var(--graphite-dark-rgb),0.6)] border-b-0 text-[var(--t2)] cursor-pointer font-[Oswald,sans-serif] font-medium text-[0.875rem] uppercase tracking-[1px] transition-[var(--tr)] relative mr-px max-[768px]:p-[10px_12px] max-[768px]:text-[0.8rem] max-[480px]:p-[8px_10px] max-[480px]:text-[0.75rem] max-[360px]:p-[0.5rem_0.625rem] max-[360px]:text-[0.7rem]"
        :class="{
          'bg-gradient-to-b from-massgate-orange-light to-massgate-orange !text-[var(--ink)] font-semibold border-[rgba(var(--massgate-orange-rgb),0.85)] z-10 shadow-[0_0_18px_rgba(var(--massgate-orange-rgb),0.45)]':
            activeTabId === tab.id,
          'bg-gradient-to-b from-[rgba(var(--graphite-rgb),0.9)] to-[rgba(var(--graphite-dark-rgb),0.92)] hover:!bg-gradient-to-b hover:!from-massgate-orange-light hover:!to-massgate-orange hover:!text-[var(--ink)] hover:border-[rgba(var(--massgate-orange-rgb),0.65)] hover:shadow-[0_0_16px_rgba(var(--massgate-orange-rgb),0.4)] hover:-translate-y-px':
            activeTabId !== tab.id,
        }"
        @click="switchTab(tab)"
        @keydown.arrow-right.prevent="
          () => {
            const currentIndex = tabs.findIndex((t) => t.id === tab.id);
            const nextIndex = (currentIndex + 1) % tabs.length;
            switchTab(tabs[nextIndex]);
          }
        "
        @keydown.arrow-left.prevent="
          () => {
            const currentIndex = tabs.findIndex((t) => t.id === tab.id);
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            switchTab(tabs[prevIndex]);
          }
        "
        @keydown.home.prevent="switchTab(tabs[0])"
        @keydown.end.prevent="switchTab(tabs[tabs.length - 1])"
      >
        <i v-if="tab.icon" :class="tab.icon" class="mr-2" aria-hidden="true"></i>
        {{ formatLabel(tab.label) }}
      </button>
    </div>

    <!-- Tab Panels -->
    <div
      v-for="tab in tabs"
      :id="getPanelId(tab.id)"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="getTabId(tab.id)"
      :hidden="activeTabId !== tab.id"
      class="tab-panel"
      :class="{ hidden: activeTabId !== tab.id, block: activeTabId === tab.id }"
    >
      <slot :name="tab.id" />
    </div>
  </div>
</template>
