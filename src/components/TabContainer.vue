<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import MobileTabDropdown from './MobileTabDropdown.vue';
import { useMobileTabs } from '../composables/useMobileTabs';

interface Tab {
  id: string; // Tab ID (e.g., 'downloads-quick-install', 'faq-about-wicgate')
  label: string; // Display label (e.g., 'Quick Install')
  icon?: string; // Optional FontAwesome icon class
}

interface Props {
  tabs: Tab[];
  tabClass?: string; // Additional CSS classes for the tab container
  ariaLabel?: string; // ARIA label for tablist
  externalActiveTabId?: string | null; // External control of active tab (e.g., from FAQ question deep links)
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Tab navigation',
  tabClass: 'tab-btn-sub',
  externalActiveTabId: null,
});

const { isMobile } = useMobileTabs();
const route = useRoute();

// Local active tab state
const localActiveTabId = ref<string>(props.tabs[0]?.id || '');

// Active tab - uses local state
const activeTabId = computed(() => localActiveTabId.value);

// Watch for external tab control (e.g., FAQ question deep links)
watch(
  () => props.externalActiveTabId,
  (newTabId) => {
    if (newTabId && props.tabs.some((t) => t.id === newTabId)) {
      localActiveTabId.value = newTabId;
    }
  },
  { immediate: true }
);

// Extract anchor from tab ID by finding common prefix from all tabs
// e.g., 'downloads-quick-install' → 'quick-install', 'faq-about-wicgate' → 'about-wicgate'
function getAnchor(tabId: string): string {
  const firstTab = props.tabs[0];
  if (!firstTab) return tabId;

  const firstTabId = firstTab.id;
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

// Watch route hash changes - handles client-side navigation, back/forward, and initial load
watch(
  () => route.hash,
  (newHash) => {
    const hash = newHash?.slice(1) || ''; // Remove # prefix

    if (hash) {
      const matchingTab = props.tabs.find((t) => getAnchor(t.id) === hash);
      if (matchingTab) {
        localActiveTabId.value = matchingTab.id;
      }
    } else {
      // No hash = reset to default tab
      localActiveTabId.value = props.tabs[0]?.id || '';
    }
  },
  { immediate: true }
);

// Handle tab click - update hash and local state
function switchTab(tab: Tab) {
  if (typeof window === 'undefined') return;

  const anchor = getAnchor(tab.id);
  const isDefault = tab.id === props.tabs[0]?.id;

  if (isDefault) {
    // Clear hash for default tab
    history.replaceState(null, '', window.location.pathname);
  } else {
    // Set hash for non-default tab
    history.pushState(null, '', `#${anchor}`);
  }
  localActiveTabId.value = tab.id;
}

// Format label for display (capitalize first letter)
const formatLabel = (label: string): string => {
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// Generate ARIA IDs
const getTabId = (tabId: string) => `tab-${tabId}`;
// Use anchor for panel ID (e.g., 'quick' not 'downloads-quick')
const getPanelId = (tabId: string) => getAnchor(tabId);

// Handle mobile tab selection
function handleMobileSelect(tabId: string) {
  const tab = props.tabs.find((t) => t.id === tabId);
  if (tab) switchTab(tab);
}
</script>

<template>
  <div class="tab-container">
    <!-- MOBILE: Dropdown (< 640px) -->
    <MobileTabDropdown
      :tabs="tabs"
      :active-tab-id="activeTabId"
      :is-mobile="isMobile"
      :aria-label="ariaLabel"
      :format-label="formatLabel"
      @select="handleMobileSelect"
    />

    <!-- DESKTOP: Horizontal Tabs (>= 640px) -->
    <div role="tablist" :aria-label="ariaLabel" class="tab-nav-sub" :class="{ hidden: isMobile }">
      <button
        v-for="tab in tabs"
        :id="getTabId(tab.id)"
        :key="tab.id"
        role="tab"
        :aria-selected="activeTabId === tab.id"
        :aria-controls="getPanelId(tab.id)"
        :tabindex="activeTabId === tab.id ? 0 : -1"
        :class="[{ 'tab-btn-sub-active': activeTabId === tab.id }, tabClass]"
        @click="switchTab(tab)"
        @keydown.arrow-right.prevent="
          () => {
            const currentIndex = tabs.findIndex((t) => t.id === tab.id);
            const nextIndex = (currentIndex + 1) % tabs.length;
            const nextTab = tabs[nextIndex];
            if (nextTab) switchTab(nextTab);
          }
        "
        @keydown.arrow-left.prevent="
          () => {
            const currentIndex = tabs.findIndex((t) => t.id === tab.id);
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            const prevTab = tabs[prevIndex];
            if (prevTab) switchTab(prevTab);
          }
        "
        @keydown.home.prevent="
          () => {
            const t = tabs[0];
            if (t) switchTab(t);
          }
        "
        @keydown.end.prevent="
          () => {
            const t = tabs[tabs.length - 1];
            if (t) switchTab(t);
          }
        "
      >
        <i v-if="tab.icon" :class="tab.icon" class="mr-2" aria-hidden="true"></i>
        {{ formatLabel(tab.label) }}
      </button>
    </div>

    <!-- Tab Panels (shared for both mobile/desktop) -->
    <div
      v-for="tab in tabs"
      :id="getPanelId(tab.id)"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="getTabId(tab.id)"
      class="tab-panel"
      :class="{ hidden: activeTabId !== tab.id, block: activeTabId === tab.id }"
    >
      <slot :name="getAnchor(tab.id)" />
    </div>
  </div>
</template>
