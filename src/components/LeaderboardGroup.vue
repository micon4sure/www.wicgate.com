<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import type { LeaderboardEntry, LadderEntry } from '../api-types';
import RankInsignia from './RankInsignia.vue';
import { useMobileTabs } from '../composables/useMobileTabs';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE, MOBILE_BREAKPOINT, TABLET_BREAKPOINT } from '../constants';

// Copy link state
const showCopiedToast = ref(false);
const copied = ref(false);

// Mobile tabs
const { isMobile, dropdownOpen, dropdownRef, triggerRef, toggleDropdown, closeDropdown } =
  useMobileTabs();

// Refs used in template via ref="..." bindings
void dropdownRef;
void triggerRef;

// Category icons for mobile dropdown
const categoryIcons: Record<string, string> = {
  overall: 'fa-solid fa-chart-simple',
  infantry: 'fa-solid fa-person-rifle',
  armor: 'fa-solid fa-truck-monster',
  air: 'fa-solid fa-jet-fighter',
  support: 'fa-solid fa-screwdriver-wrench',
};

function getCategoryIcon(category: string): string {
  return categoryIcons[category] || 'fa-solid fa-trophy';
}

function copyLeaderboardLink() {
  if (typeof window === 'undefined' || !navigator.clipboard) return;

  // Build URL with current tab if applicable
  let hash = props.id;
  if (props.categories.length > 1 && active.value !== 'overall') {
    hash = `${props.id}-${active.value}`;
  }

  const url = `${window.location.origin}/statistics#${hash}`;

  navigator.clipboard.writeText(url).then(() => {
    copied.value = true;
    showCopiedToast.value = true;

    setTimeout(() => {
      showCopiedToast.value = false;
      setTimeout(() => {
        copied.value = false;
      }, 200);
    }, 2000);
  });
}

type LeaderboardRow = LeaderboardEntry | LadderEntry;

interface Props {
  id?: string; // ID for deep linking
  title: string;
  subtitle?: string;
  categories?: string[]; // Tab categories; if 0 or 1, tabs hidden
  keys?: Record<string, string>; // Map category -> dataset key in data
  data: Record<string, LeaderboardRow[] | undefined>;
  thirdLabel?: string; // Column header for value
  maxRows?: number; // Rows cap (default 10)
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  subtitle: '',
  categories: () => [],
  keys: () => ({}),
  thirdLabel: 'Score',
  maxRows: 10,
});

// Active tab (first category or fallback 'default')
const active = ref(props.categories[0] || 'default');
watch(
  () => props.categories,
  (cats) => {
    if (cats.length > 0 && !cats.includes(active.value)) {
      active.value = cats[0] ?? 'default';
    }
  }
);

// Expose method to set active tab from parent
function setActiveTab(tab: string) {
  if (props.categories.includes(tab)) {
    active.value = tab;
  }
}
defineExpose({ setActiveTab });

function rows(list?: LeaderboardRow[]) {
  return (list || []).slice(0, props.maxRows);
}
function entriesFor(cat: string) {
  const key: string = props.keys?.[cat] ?? cat; // fallback: direct key
  return rows(props.data[key]);
}
function formatClanTag(entry: LeaderboardRow): string {
  if (entry.tagFormat && entry.shortName) {
    return entry.tagFormat.replace('C', entry.shortName).replace('P', '');
  }
  return '';
}

const formatCategoryLabel = (category: string): string => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Mobile dropdown tab selection
function selectMobileTab(category: string) {
  active.value = category;
  closeDropdown();
}

// Responsive RankInsignia sizing
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : TABLET_BREAKPOINT);

const rankInsigniaSize = computed(() => {
  if (windowWidth.value <= 360) return 16;
  if (windowWidth.value <= 480) return 18;
  if (windowWidth.value <= MOBILE_BREAKPOINT) return 20;
  if (windowWidth.value <= TABLET_BREAKPOINT) return 22;
  return 24;
});

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

// Debounce resize handler to improve performance
const debouncedResize = debounce(updateWindowWidth, DEBOUNCE_RESIZE);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', debouncedResize);
    updateWindowWidth();
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', debouncedResize);
  }
});
</script>
<template>
  <div :id="id || undefined" class="leaderboard-container">
    <div class="leaderboard-header-row">
      <div
        class="leaderboard-header group relative"
        :class="{ 'leaderboard-header-full': categories.length <= 1 }"
      >
        <div>
          <h3 class="leaderboard-header-title">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="leaderboard-header-subtitle">
            {{ subtitle }}
          </p>
        </div>
        <!-- Copy Link Button - positioned right -->
        <span
          v-if="id"
          role="button"
          tabindex="0"
          class="lb-copy-link-btn absolute right-3 top-1/2 -translate-y-1/2"
          :class="copied ? 'is-copied' : ''"
          :title="`Copy link to ${title}${categories.length > 1 && active !== 'overall' ? ': ' + active.charAt(0).toUpperCase() + active.slice(1) : ''}`"
          :aria-label="`Copy link to ${title}${categories.length > 1 && active !== 'overall' ? ': ' + active.charAt(0).toUpperCase() + active.slice(1) : ''}`"
          @click.stop="copyLeaderboardLink"
          @keydown.enter.stop.prevent="copyLeaderboardLink"
          @keydown.space.stop.prevent="copyLeaderboardLink"
        >
          <i
            class="text-sm transition-all duration-200"
            :class="copied ? 'fa-solid fa-check' : 'fa-solid fa-link'"
            aria-hidden="true"
          ></i>
        </span>
      </div>

      <!-- MOBILE: Hamburger Dropdown (categories > 1) -->
      <div v-if="categories.length > 1 && isMobile" class="tab-mobile-wrapper flex-1">
        <button
          ref="triggerRef"
          class="tab-mobile-trigger-sub h-full border-t-0"
          :class="{ 'tab-mobile-trigger-sub-open': dropdownOpen }"
          :aria-expanded="dropdownOpen"
          aria-haspopup="listbox"
          @click="toggleDropdown"
        >
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-bars" aria-hidden="true"></i>
            <i
              :class="getCategoryIcon(active)"
              class="text-massgate-red-bright"
              aria-hidden="true"
            ></i>
            <span class="tab-mobile-trigger-label">{{ formatCategoryLabel(active) }}</span>
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
            aria-label="Category selection"
          >
            <button
              v-for="c in categories"
              :key="c"
              role="option"
              :aria-selected="active === c"
              :class="['tab-mobile-option-sub', { 'tab-mobile-option-sub-active': active === c }]"
              @click="selectMobileTab(c)"
            >
              <i :class="getCategoryIcon(c)" class="mr-3" aria-hidden="true"></i>
              {{ formatCategoryLabel(c) }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- DESKTOP: Horizontal Tabs (categories > 1) -->
      <div v-if="categories.length > 1 && !isMobile" class="leaderboard-tabs">
        <button
          v-for="c in categories"
          :key="c"
          class="tab-btn-leaderboard"
          :class="{ 'tab-btn-active': active === c }"
          @click="active = c"
        >
          {{ formatCategoryLabel(c) }}
        </button>
      </div>
    </div>

    <!-- If categories provided, render tab containers; else single table -->
    <template v-if="categories.length > 0">
      <div v-for="c in categories" :key="c" :class="{ hidden: active !== c, block: active === c }">
        <table class="leaderboard-table">
          <colgroup>
            <col class="col-rank" />
            <col class="col-avatar" />
            <col class="col-insignia" />
            <col class="w-auto" />
            <col class="col-score" />
          </colgroup>
          <thead>
            <tr>
              <th class="leaderboard-th" colspan="3">Rank</th>
              <th class="leaderboard-th">Player</th>
              <th class="leaderboard-th">{{ thirdLabel }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="entriesFor(c).length === 0">
              <td
                colspan="5"
                class="text-center italic text-t-tertiary font-[Rajdhani,sans-serif] p-[30px]"
              >
                No data
              </td>
            </tr>
            <tr
              v-for="(e, index) in entriesFor(c)"
              :key="e.rank + (e.profileName || '')"
              class="lb-row"
            >
              <td
                class="lb-cell-rank"
                :class="{
                  'lb-medal-gold': index === 0,
                  'lb-medal-silver': index === 1,
                  'lb-medal-bronze': index === 2,
                }"
              >
                {{ index + 1 }}
              </td>
              <td class="lb-cell-avatar">
                <div class="lb-avatar">
                  <img
                    v-if="e.profileId"
                    :src="`https://www.wicgate.com/pcc/${e.profileId}.webp`"
                    :alt="e.profileName"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    @error="($event.target as HTMLImageElement).style.display = 'none'"
                  />
                </div>
              </td>
              <td class="lb-cell-insignia">
                <RankInsignia
                  :rank="e.rank ?? null"
                  :size="rankInsigniaSize"
                  class="inline-block"
                />
              </td>
              <td class="lb-cell-player">
                <div class="flex items-center leading-none">
                  <span v-if="formatClanTag(e)" class="lb-clan-tag">{{ formatClanTag(e) }}</span>
                  <span class="lb-player-name">{{ e.profileName || 'Unknown' }}</span>
                </div>
              </td>
              <td
                class="lb-cell-score"
                :class="{
                  'text-gold': index === 0,
                  'text-silver': index === 1,
                  'text-bronze': index === 2,
                }"
              >
                {{ e.high.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <table class="leaderboard-table">
        <colgroup>
          <col class="col-rank" />
          <col class="col-avatar" />
          <col class="col-insignia" />
          <col class="w-auto" />
          <col class="col-score" />
        </colgroup>
        <thead>
          <tr>
            <th class="leaderboard-th" colspan="3">Rank</th>
            <th class="leaderboard-th">Player</th>
            <th class="leaderboard-th">{{ thirdLabel }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="entriesFor(active).length === 0">
            <td
              colspan="5"
              class="text-center italic text-t-tertiary font-[Rajdhani,sans-serif] p-[30px]"
            >
              No data
            </td>
          </tr>
          <tr
            v-for="(e, index) in entriesFor(active)"
            :key="e.rank + (e.profileName || '')"
            class="lb-row"
          >
            <td
              class="lb-cell-rank"
              :class="{
                'lb-medal-gold': index === 0,
                'lb-medal-silver': index === 1,
                'lb-medal-bronze': index === 2,
              }"
            >
              {{ index + 1 }}
            </td>
            <td class="lb-cell-avatar">
              <div class="lb-avatar">
                <img
                  v-if="e.profileId"
                  :src="`https://www.wicgate.com/pcc/${e.profileId}.webp`"
                  :alt="e.profileName"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
              </div>
            </td>
            <td class="lb-cell-insignia">
              <RankInsignia :rank="e.rank ?? null" :size="rankInsigniaSize" class="inline-block" />
            </td>
            <td class="lb-cell-player">
              <div class="flex items-center leading-none">
                <span v-if="formatClanTag(e)" class="lb-clan-tag">{{ formatClanTag(e) }}</span>
                <span class="lb-player-name">{{ e.profileName || 'Unknown' }}</span>
              </div>
            </td>
            <td
              class="lb-cell-score"
              :class="{
                'text-gold': index === 0,
                'text-silver': index === 1,
                'text-bronze': index === 2,
              }"
            >
              {{ e.high.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Slot for custom body (e.g., placeholder) if no categories & no table desired -->
    <slot />
  </div>
</template>
