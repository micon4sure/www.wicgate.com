<script setup lang="ts">
import { computed } from 'vue';
import Leaderboards from '../components/Leaderboards.vue';
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton.vue';
import type { DataResponse, LeaderboardEntry, LadderEntry } from '../api-types';

const props = defineProps<{
  data: Partial<DataResponse>;
  loading: boolean;
}>();

type LeaderboardRow = LeaderboardEntry | LadderEntry;
type LeaderboardDataRecord = Record<string, LeaderboardRow[] | undefined>;

// During SSG build or while loading, show placeholder
const isSSR = import.meta.env.SSR;
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
</script>

<template>
  <section id="statistics" class="section bg-statistics-section">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-20">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Statistics
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Player rankings and competitive leaderboards
        </p>
      </div>

      <!-- Leaderboards Section -->
      <div id="leaderboards">
        <!-- SSG/Loading: Render skeleton placeholder -->
        <LeaderboardSkeleton v-if="showPlaceholder" />

        <!-- Runtime: Render live data -->
        <Leaderboards v-else :data="leaderboardData" />
      </div>
    </div>
  </section>
</template>
