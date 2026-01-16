<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import { ANCHOR_HIGHLIGHT_DELAY, DEFAULT_CONTENT_OFFSET } from '../constants';
import Leaderboards from '../components/Leaderboards.vue';
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton.vue';
import type { DataResponse, LeaderboardEntry, LadderEntry, ClanEntry } from '../api-types';

const props = defineProps<{
  data: Partial<DataResponse>;
  loading: boolean;
  clans?: ClanEntry[];
}>();

type LeaderboardRow = LeaderboardEntry | LadderEntry;
type LeaderboardDataRecord = Record<string, LeaderboardRow[] | undefined>;

// During SSG build or while loading, show placeholder
const isSSR = import.meta.server;
const showPlaceholder = computed(() => isSSR || props.loading);

const leaderboardData = computed<LeaderboardDataRecord>(() => ({
  lb_total: props.data.lb_total,
  lb_totinf: props.data.lb_totinf,
  lb_totarm: props.data.lb_totarm,
  lb_totair: props.data.lb_totair,
  lb_totsup: props.data.lb_totsup,
  lb_high: props.data.lb_high,
  lb_highinf: props.data.lb_highinf,
  lb_higharm: props.data.lb_higharm,
  lb_highair: props.data.lb_highair,
  lb_highsup: props.data.lb_highsup,
  ladder: props.data.ladder,
}));

// Ref to Leaderboards component for deep linking
const leaderboardsRef = ref<InstanceType<typeof Leaderboards> | null>(null);

// Hash patterns: #player-leaderboard, #clan-leaderboard, #high-scores, #high-scores-infantry, #total-scores-armor
function handleHashNavigation() {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash.slice(1);
  if (!hash) return;

  // Wait for component to render
  nextTick(() => {
    setTimeout(() => {
      // Parse hash: could be "high-scores-infantry" -> scroll to "high-scores", set tab to "infantry"
      const parts = hash.split('-');
      let elementId = hash;
      let tabName = '';

      // Check for category suffix
      const categories = ['total', 'infantry', 'armor', 'air', 'support'];
      const lastPart = parts[parts.length - 1];
      if (lastPart && categories.includes(lastPart) && parts.length > 2) {
        tabName = lastPart;
        elementId = parts.slice(0, -1).join('-');
      }

      // Scroll to element with header offset (same as FAQ)
      const element = document.getElementById(elementId);
      if (element) {
        const contentOffset =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--content-offset').trim()
          ) || DEFAULT_CONTENT_OFFSET;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - contentOffset - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Add highlight effect to draw attention (delay for consistency with FAQ)
        setTimeout(() => {
          element.classList.add('anchor-highlight');
          setTimeout(() => {
            element.classList.remove('anchor-highlight');
          }, 2000);
        }, ANCHOR_HIGHLIGHT_DELAY);

        // Set active tab if applicable
        if (tabName && leaderboardsRef.value) {
          if (elementId === 'high-scores' && leaderboardsRef.value.highScoresRef) {
            leaderboardsRef.value.highScoresRef.setActiveTab(tabName);
          } else if (elementId === 'total-scores' && leaderboardsRef.value.totalScoresRef) {
            leaderboardsRef.value.totalScoresRef.setActiveTab(tabName);
          }
        }
      }
    }, 300);
  });
}

// Handle hash on mount and when loading completes
onMounted(() => {
  if (!showPlaceholder.value) {
    handleHashNavigation();
  }
});

watch(showPlaceholder, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    // Loading just finished
    handleHashNavigation();
  }
});
</script>

<template>
  <section id="statistics" class="section bg-statistics-section">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-responsive">
        <h1
          class="text-5xl lg:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Statistics
        </h1>
        <p class="text-lg lg:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Player rankings and competitive leaderboards
        </p>
      </div>

      <!-- Leaderboards Section -->
      <div id="leaderboards">
        <!-- SSG/Loading: Render skeleton placeholder -->
        <LeaderboardSkeleton v-if="showPlaceholder" />

        <!-- Runtime: Render live data -->
        <Leaderboards
          v-else
          ref="leaderboardsRef"
          :data="leaderboardData"
          :clans="props.clans ?? []"
        />
      </div>
    </div>
  </section>
</template>
