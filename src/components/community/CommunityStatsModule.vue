<script setup lang="ts">
import { computed } from 'vue';
import type { DataResponse } from '../../api-types';
import Leaderboards from '../Leaderboards.vue';
import LeaderboardSkeleton from '../skeletons/LeaderboardSkeleton.vue';

const props = withDefaults(
  defineProps<{
    data?: Partial<DataResponse> | null;
    loading?: boolean;
  }>(),
  {
    data: () => null,
    loading: false,
  }
);

const isSSR = import.meta.env.SSR;
const showSkeleton = computed(() => isSSR || props.loading || !props.data);
</script>

<template>
  <section id="statistics" class="community-module mb-xl">
    <div class="vid-hdr">
      <h3>Statistics</h3>
      <p class="section-lead" style="margin: 0; font-size: 0.9rem">Rankings and leaderboards</p>
    </div>

    <LeaderboardSkeleton v-if="showSkeleton" />
    <Leaderboards v-else :data="props.data as Record<string, any>" />
  </section>
</template>
