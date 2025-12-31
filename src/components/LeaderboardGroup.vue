<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import type { LeaderboardEntry, LadderEntry } from '../api-types';
import RankInsignia from './RankInsignia.vue';
import MobileTabDropdown from './MobileTabDropdown.vue';
import { useMobileTabs } from '../composables/useMobileTabs';
import { debounce } from '../utils/debounce';
import { DEBOUNCE_RESIZE, BREAKPOINTS } from '../constants';

// Copy link state
const showCopiedToast = ref(false);
const copied = ref(false);

// Mobile tabs
const { isMobile } = useMobileTabs();

// Category icons for mobile dropdown
const categoryIcons: Record<string, string> = {
  total: 'fa-solid fa-chart-simple',
  infantry: '/infantry.png',
  armor: '/armor.png',
  air: '/air.png',
  support: '/support.png',
};

function getCategoryIcon(category: string): string {
  return categoryIcons[category] || '';
}

function isImageIcon(icon: string): boolean {
  return icon.endsWith('.png');
}

function copyLeaderboardLink() {
  if (typeof window === 'undefined' || !navigator.clipboard) return;

  // Build URL with current tab if applicable
  let hash = props.id;
  if (props.categories.length > 1 && active.value !== 'total') {
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

// Transform categories to Tab format for MobileTabDropdown
const categoryTabs = computed(() =>
  props.categories.map((c) => ({
    id: c,
    label: formatCategoryLabel(c),
    icon: getCategoryIcon(c),
  }))
);

// Mobile dropdown tab selection
function selectMobileTab(tabId: string) {
  active.value = tabId;
}

// Responsive RankInsignia sizing (7-tier system)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.XL);

const rankInsigniaSize = computed(() => {
  if (windowWidth.value < BREAKPOINTS.XS) return 14; // Below xs (edge case)
  if (windowWidth.value < BREAKPOINTS.SM) return 16; // xs: 320-374 (small phone)
  if (windowWidth.value < BREAKPOINTS.MD) return 17; // sm: 375-424 (medium phone)
  if (windowWidth.value < BREAKPOINTS.LG) return 18; // md: 425-767 (large phone)
  if (windowWidth.value < BREAKPOINTS.XL) return 20; // lg: 768-1023 (tablet)
  if (windowWidth.value < BREAKPOINTS.XXL) return 22; // xl: 1024-1439 (laptop)
  if (windowWidth.value < BREAKPOINTS.XXXL) return 24; // 2xl: 1440-2559 (desktop)
  return 26; // 3xl: 2560+ (large desktop)
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
          :title="`Copy link to ${title}${categories.length > 1 && active !== 'total' ? ': ' + active.charAt(0).toUpperCase() + active.slice(1) : ''}`"
          :aria-label="`Copy link to ${title}${categories.length > 1 && active !== 'total' ? ': ' + active.charAt(0).toUpperCase() + active.slice(1) : ''}`"
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
      <MobileTabDropdown
        v-if="categories.length > 1"
        :tabs="categoryTabs"
        :active-tab-id="active"
        aria-label="Category selection"
        wrapper-class="flex-1"
        trigger-class="h-full border-t-0"
        @select="selectMobileTab"
      />

      <!-- DESKTOP: Horizontal Tabs (categories > 1) -->
      <div v-if="categories.length > 1 && !isMobile" class="leaderboard-tabs">
        <button
          v-for="c in categories"
          :key="c"
          class="tab-btn-leaderboard flex flex-col items-center"
          :class="{ 'tab-btn-active': active === c }"
          @click="active = c"
        >
          <img
            v-if="getCategoryIcon(c) && isImageIcon(getCategoryIcon(c))"
            :src="getCategoryIcon(c)"
            class="w-8 h-8"
            aria-hidden="true"
          />
          <i
            v-else-if="getCategoryIcon(c)"
            :class="getCategoryIcon(c)"
            class="text-2xl"
            aria-hidden="true"
          ></i>
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
