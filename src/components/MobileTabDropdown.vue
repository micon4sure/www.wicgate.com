<script setup lang="ts">
import { computed } from 'vue';
import { useMobileTabs } from '../composables/useMobileTabs';

export interface MobileTab {
  id: string;
  label: string;
  icon?: string;
}

const props = withDefaults(
  defineProps<{
    tabs: MobileTab[];
    activeTabId: string;
    isMobile: boolean; // Parent controls visibility
    ariaLabel?: string;
    formatLabel?: (label: string) => string;
    wrapperClass?: string;
    triggerClass?: string;
  }>(),
  {
    ariaLabel: 'Tab selection',
    formatLabel: (label: string) => label,
    wrapperClass: '',
    triggerClass: '',
  }
);

const emit = defineEmits<{
  select: [tabId: string];
}>();

// Use composable for dropdown behavior only (click-outside, escape, toggle)
const { dropdownOpen, dropdownRef, triggerRef, toggleDropdown, closeDropdown } = useMobileTabs();

// Refs used in template via ref="..." bindings
void dropdownRef;
void triggerRef;

const activeTab = computed(
  () => props.tabs.find((t) => t.id === props.activeTabId) ?? props.tabs[0]
);

function isImageIcon(icon?: string): boolean {
  return !!icon && icon.endsWith('.png');
}

const filteredTabs = computed(() => props.tabs.filter((t) => t.id !== props.activeTabId));

function handleSelect(tabId: string) {
  emit('select', tabId);
  closeDropdown();
}
</script>

<template>
  <div class="tab-mobile-wrapper relative" :class="[wrapperClass, isMobile ? 'block' : 'hidden']">
    <button
      ref="triggerRef"
      class="tab-mobile-trigger-sub"
      :class="[triggerClass, { 'tab-mobile-trigger-sub-open': dropdownOpen }]"
      :aria-expanded="dropdownOpen"
      aria-haspopup="listbox"
      @click="toggleDropdown"
    >
      <div class="flex items-center gap-3">
        <img
          v-if="isImageIcon(activeTab?.icon)"
          :src="activeTab?.icon"
          alt=""
          class="w-[1.75em] h-[1.75em]"
          aria-hidden="true"
        />
        <i v-else-if="activeTab?.icon" :class="activeTab.icon" aria-hidden="true"></i>
        <span class="tab-mobile-trigger-label">{{ formatLabel(activeTab?.label ?? '') }}</span>
        <slot name="trigger-badge" :active-tab="activeTab" />
      </div>
      <i
        class="fa-solid fa-chevron-down tab-mobile-chevron"
        :class="{ 'rotate-180': dropdownOpen }"
        aria-hidden="true"
      ></i>
    </button>

    <Transition name="tab-dropdown">
      <div
        v-if="dropdownOpen"
        ref="dropdownRef"
        class="tab-mobile-dropdown-sub"
        role="listbox"
        :aria-label="ariaLabel"
      >
        <button
          v-for="tab in filteredTabs"
          :key="tab.id"
          role="option"
          :aria-selected="false"
          class="tab-mobile-option-sub"
          @click="handleSelect(tab.id)"
        >
          <img
            v-if="isImageIcon(tab.icon)"
            :src="tab.icon"
            alt=""
            class="w-[1.75em] h-[1.75em] mr-3"
            aria-hidden="true"
          />
          <i v-else-if="tab.icon" :class="tab.icon" class="mr-3" aria-hidden="true"></i>
          {{ formatLabel(tab.label) }}
          <slot name="option-badge" :tab="tab" />
        </button>
      </div>
    </Transition>
  </div>
</template>
