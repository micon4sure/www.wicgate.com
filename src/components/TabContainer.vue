<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { trackEvent } from '../utils/analytics';

interface Tab {
  id: string; // The route name (e.g., 'downloads-quick', 'faq-about') or local tab ID
  label: string; // Display label (e.g., 'Quick Install')
  icon?: string; // Optional FontAwesome icon class
}

interface Props {
  tabs: Tab[];
  tabClass?: string; // Additional CSS classes for the tab container
  analyticsCategory?: string; // Category for analytics tracking (e.g., 'Downloads')
  ariaLabel?: string; // ARIA label for tablist
}

const props = withDefaults(defineProps<Props>(), {
  analyticsCategory: '',
  ariaLabel: 'Tab navigation',
  tabClass: 'tab-btn',
});

const router = useRouter();
const route = useRoute();

// Local active tab for non-route tabs
const localActiveTabId = ref<string>(props.tabs[0]?.id || '');

// Check if a tab matches a route name
function isRouteTab(tabId: string): boolean {
  return router.hasRoute(tabId);
}

// Active tab - derived from current route if route tab, otherwise use local state
const activeTabId = computed(() => {
  // If current route matches a tab, use it
  const routeMatchingTab = props.tabs.find((t) => t.id === route.name);
  if (routeMatchingTab) {
    return routeMatchingTab.id;
  }

  // If first tab is a route tab, default to it
  if (props.tabs.length > 0 && isRouteTab(props.tabs[0].id)) {
    return props.tabs[0].id;
  }

  // Otherwise use local state (for non-route tabs like Community videos)
  return localActiveTabId.value;
});

// Watch route changes to update local state
watch(
  () => route.name,
  (newRouteName) => {
    const matchingTab = props.tabs.find((t) => t.id === newRouteName);
    if (matchingTab) {
      localActiveTabId.value = matchingTab.id;
    }
  }
);

// Extract anchor from tab ID by finding common prefix from all tabs
// e.g., 'downloads-quick' → 'quick', 'faq-about' → 'about'
function getAnchor(tabId: string): string {
  if (props.tabs.length === 0) return tabId;

  const firstTabId = props.tabs[0].id;
  const firstHyphen = firstTabId.indexOf('-');

  if (firstHyphen === -1) return tabId;

  // Get section prefix (everything before first hyphen)
  const sectionPrefix = firstTabId.substring(0, firstHyphen + 1); // Include the hyphen

  // Strip this prefix from the current tabId
  if (tabId.startsWith(sectionPrefix)) {
    return tabId.substring(sectionPrefix.length);
  }

  return tabId;
}

// Handle tab click - navigate to route if it exists, otherwise update local state
async function switchTab(tab: Tab) {
  const isAlreadyActive = activeTabId.value === tab.id;

  // Check if this tab corresponds to a route
  if (isRouteTab(tab.id)) {
    // Navigate to the route
    try {
      await router.push({ name: tab.id });
    } catch (error) {
      // Route navigation failed, fall back to local state
      console.warn(`Failed to navigate to route: ${tab.id}`, error);
      localActiveTabId.value = tab.id;
    }
  } else {
    // Local tab (no route), just update local state
    localActiveTabId.value = tab.id;
  }

  // Track analytics only when switching to a different tab
  if (!isAlreadyActive && props.analyticsCategory) {
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
// Use anchor for panel ID (e.g., 'quick' not 'downloads-quick')
const getPanelId = (tabId: string) => getAnchor(tabId);
</script>

<template>
  <div class="tab-container">
    <!-- Tab Navigation -->
    <div role="tablist" :aria-label="ariaLabel" class="tab-nav">
      <button
        v-for="tab in tabs"
        :id="getTabId(tab.id)"
        :key="tab.id"
        role="tab"
        :aria-selected="activeTabId === tab.id"
        :aria-controls="getPanelId(tab.id)"
        :tabindex="activeTabId === tab.id ? 0 : -1"
        :class="[{ 'tab-btn-active': activeTabId === tab.id }, tabClass]"
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
      <slot :name="getAnchor(tab.id)" />
    </div>
  </div>
</template>
