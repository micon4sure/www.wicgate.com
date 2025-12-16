<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MOBILE_BREAKPOINT } from '../constants';

interface Tab {
  id: string; // The route name (e.g., 'downloads-quick', 'faq-about') or local tab ID
  label: string; // Display label (e.g., 'Quick Install')
  icon?: string; // Optional FontAwesome icon class
}

interface Props {
  tabs: Tab[];
  tabClass?: string; // Additional CSS classes for the tab container
  ariaLabel?: string; // ARIA label for tablist
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Tab navigation',
  tabClass: 'tab-btn',
});

const router = useRouter();
const route = useRoute();

// Mobile dropdown state
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
  const firstTab = props.tabs[0];
  if (firstTab && isRouteTab(firstTab.id)) {
    return firstTab.id;
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

// Handle tab click - navigate to route if it exists, otherwise update local state
async function switchTab(tab: Tab) {
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
}

// Format label for display (capitalize first letter)
const formatLabel = (label: string): string => {
  return label.charAt(0).toUpperCase() + label.slice(1);
};

// Generate ARIA IDs
const getTabId = (tabId: string) => `tab-${tabId}`;
// Use anchor for panel ID (e.g., 'quick' not 'downloads-quick')
const getPanelId = (tabId: string) => getAnchor(tabId);

// Active tab label for mobile trigger button
const activeTabLabel = computed(() => {
  const activeTab = props.tabs.find((t) => t.id === activeTabId.value);
  return activeTab ? formatLabel(activeTab.label) : 'Select Tab';
});

// Active tab icon for mobile trigger button
const activeTabIcon = computed(() => {
  const activeTab = props.tabs.find((t) => t.id === activeTabId.value);
  return activeTab?.icon || null;
});

// Toggle dropdown
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// Close dropdown
function closeDropdown() {
  dropdownOpen.value = false;
}

// Handle tab selection from dropdown
async function selectTab(tab: Tab) {
  await switchTab(tab);
  closeDropdown();
}

// Handle click outside dropdown
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

// Handle escape key
function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && dropdownOpen.value) {
    closeDropdown();
  }
}

// Handle media query change
function handleMediaChange(event: { matches: boolean }) {
  isMobile.value = !event.matches;
  // Close dropdown when switching to desktop
  if (!isMobile.value) {
    closeDropdown();
  }
}

// Lifecycle hooks for event listeners
onMounted(() => {
  if (typeof window === 'undefined') return;

  // Setup media query listener
  mediaQuery = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);
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
</script>

<template>
  <div class="tab-container">
    <!-- MOBILE: Hamburger Dropdown (< 768px) -->
    <div v-if="isMobile" class="tab-mobile-wrapper">
      <!-- Trigger Button -->
      <button
        ref="triggerRef"
        class="tab-mobile-trigger"
        :class="{ 'tab-mobile-trigger-open': dropdownOpen }"
        :aria-expanded="dropdownOpen"
        aria-haspopup="listbox"
        @click="toggleDropdown"
      >
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-bars text-teal" aria-hidden="true"></i>
          <i v-if="activeTabIcon" :class="activeTabIcon" class="text-teal" aria-hidden="true"></i>
          <span class="tab-mobile-trigger-label">{{ activeTabLabel }}</span>
        </div>
        <i
          class="fa-solid fa-chevron-down tab-mobile-chevron"
          :class="{ 'rotate-180': dropdownOpen }"
          aria-hidden="true"
        ></i>
      </button>

      <!-- Dropdown Menu -->
      <Transition name="tab-dropdown">
        <div
          v-if="dropdownOpen"
          ref="dropdownRef"
          class="tab-mobile-dropdown"
          role="listbox"
          :aria-label="ariaLabel"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            role="option"
            :aria-selected="activeTabId === tab.id"
            :class="['tab-mobile-option', { 'tab-mobile-option-active': activeTabId === tab.id }]"
            @click="selectTab(tab)"
          >
            <i v-if="tab.icon" :class="tab.icon" class="mr-3" aria-hidden="true"></i>
            {{ formatLabel(tab.label) }}
            <i
              v-if="activeTabId === tab.id"
              class="fa-solid fa-check ml-auto text-teal"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </Transition>
    </div>

    <!-- DESKTOP: Horizontal Tabs (>= 768px) -->
    <div v-else role="tablist" :aria-label="ariaLabel" class="tab-nav">
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
      :hidden="activeTabId !== tab.id"
      class="tab-panel"
      :class="{ hidden: activeTabId !== tab.id, block: activeTabId === tab.id }"
    >
      <slot :name="getAnchor(tab.id)" />
    </div>
  </div>
</template>
